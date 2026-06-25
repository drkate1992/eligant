import { Prisma } from "@prisma/client";
import bcrypt from "bcryptjs";
import { ApiError, handle, ok } from "@/lib/api";
import { prisma } from "@/lib/prisma";
import { registerSchema } from "@/lib/validations";
import { rateLimit, ipFromRequest } from "@/lib/rate-limit";
import { generateAccountNumber, generateReference } from "@/lib/utils";

export async function POST(req: Request) {
  return handle(async () => {
    rateLimit(`register:${ipFromRequest(req)}`, 5, 15 * 60 * 1000);
    const input = registerSchema.parse(await req.json());
    const email = input.email.toLowerCase();

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) throw new ApiError("An account with this email already exists", 409);

    // The email must have been confirmed via a one-time code first.
    const emailOtp = await prisma.emailOtp.findUnique({ where: { email } });
    if (!emailOtp?.verifiedAt) {
      throw new ApiError("Please confirm your email with the code we sent", 400);
    }

    const passwordHash = await bcrypt.hash(input.password, 12);

    await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email,
          passwordHash,
          firstName: input.firstName,
          lastName: input.lastName,
          name: `${input.firstName} ${input.lastName}`,
          country: input.country,
          phone: input.phone,
          dateOfBirth: input.dateOfBirth ? new Date(input.dateOfBirth) : null,
          emailVerified: new Date(),
        },
      });

      const account = await tx.bankAccount.create({
        data: {
          userId: user.id,
          type: input.accountType,
          name:
            input.accountType === "SAVINGS"
              ? "Premium Savings"
              : input.accountType === "INVESTMENT"
                ? "Wealth Portfolio"
                : input.accountType === "BUSINESS"
                  ? "Business Account"
                  : input.accountType === "CRYPTO_SAVINGS"
                    ? "Crypto Savings"
                    : input.accountType === "CRYPTO_TRADING"
                      ? "Crypto Trading"
                      : "Everyday Checking",
          accountNumber: generateAccountNumber(),
          sortCode: "04-29-18",
          isDefault: true,
          balance: new Prisma.Decimal(500),
        },
      });

      // Welcome bonus transaction so the new dashboard isn't empty.
      await tx.transaction.create({
        data: {
          userId: user.id,
          bankAccountId: account.id,
          type: "CREDIT",
          category: "REFUND",
          amount: new Prisma.Decimal(500),
          description: "Welcome bonus — Unity Financial Group",
          reference: generateReference(),
          status: "COMPLETED",
          processedAt: new Date(),
        },
      });

      await tx.notification.create({
        data: {
          userId: user.id,
          title: "Welcome to Unity Financial",
          body: "Your account is ready. We've added a $500 welcome bonus to get you started.",
          type: "INFO",
        },
      });
    });

    // Consume the email-confirmation record now that the account exists.
    await prisma.emailOtp.delete({ where: { email } }).catch(() => {});

    return ok({ success: true, email }, { status: 201 });
  });
}
