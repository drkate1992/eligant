import { randomInt } from "crypto";
import bcrypt from "bcryptjs";
import { handle, ok, ApiError } from "@/lib/api";
import { prisma } from "@/lib/prisma";
import { sendEmailOtpSchema } from "@/lib/validations";
import { rateLimit, ipFromRequest } from "@/lib/rate-limit";
import { sendEmailVerificationEmail } from "@/lib/mailer";

const OTP_TTL_MS = 10 * 60 * 1000; // 10 minutes

export async function POST(req: Request) {
  return handle(async () => {
    rateLimit(`email-otp:${ipFromRequest(req)}`, 10, 15 * 60 * 1000);

    const { email } = sendEmailOtpSchema.parse(await req.json());
    const normalized = email.toLowerCase();

    // Don't issue codes for emails that already have an account.
    const existing = await prisma.user.findUnique({ where: { email: normalized } });
    if (existing) {
      throw new ApiError("An account with this email already exists", 409);
    }

    const code = String(randomInt(0, 1_000_000)).padStart(6, "0");
    const codeHash = await bcrypt.hash(code, 10);
    const expiresAt = new Date(Date.now() + OTP_TTL_MS);

    await prisma.emailOtp.upsert({
      where: { email: normalized },
      create: { email: normalized, codeHash, expiresAt },
      update: { codeHash, expiresAt, verifiedAt: null },
    });

    try {
      await sendEmailVerificationEmail(normalized, code);
    } catch (err) {
      console.error("[send-email-otp] email delivery failed", err);
      throw new ApiError("We couldn't send your code right now. Please try again.", 502);
    }

    const devCode = process.env.NODE_ENV !== "production" ? code : undefined;
    return ok({ success: true, ...(devCode ? { devCode } : {}) });
  });
}
