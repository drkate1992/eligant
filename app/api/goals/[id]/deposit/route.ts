import { Prisma } from "@prisma/client";
import { ApiError, handle, ok, requireUserId } from "@/lib/api";
import { prisma } from "@/lib/prisma";
import { serializeGoal } from "@/lib/serialize";
import { goalDepositSchema } from "@/lib/validations";
import { toNumber, generateReference } from "@/lib/utils";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  return handle(async () => {
    const userId = await requireUserId();
    const { id } = await params;
    const input = goalDepositSchema.parse(await req.json());

    const result = await prisma.$transaction(async (tx) => {
      const goal = await tx.savingsGoal.findFirst({ where: { id, userId } });
      if (!goal) throw new ApiError("Goal not found", 404);
      const account = await tx.bankAccount.findFirst({
        where: { id: input.fromAccountId, userId },
      });
      if (!account) throw new ApiError("Account not found", 404);
      if (toNumber(account.balance) < input.amount) {
        throw new ApiError("Insufficient balance");
      }

      const amount = new Prisma.Decimal(input.amount);
      await tx.bankAccount.update({
        where: { id: account.id },
        data: { balance: { decrement: amount } },
      });
      await tx.transaction.create({
        data: {
          userId,
          bankAccountId: account.id,
          type: "DEBIT",
          category: "TRANSFER",
          amount,
          description: `Goal deposit — ${goal.name}`,
          reference: generateReference(),
          status: "COMPLETED",
          processedAt: new Date(),
        },
      });
      const updated = await tx.savingsGoal.update({
        where: { id },
        data: { savedAmount: { increment: amount } },
      });
      return updated;
    });

    return ok(serializeGoal(result), { status: 201 });
  });
}
