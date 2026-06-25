import { Prisma } from "@prisma/client";
import { ApiError, handle, ok, requireUserId } from "@/lib/api";
import { prisma } from "@/lib/prisma";
import { toNumber, generateReference } from "@/lib/utils";

// Delete a goal and refund its saved amount to the user's default account.
export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  return handle(async () => {
    const userId = await requireUserId();
    const { id } = await params;
    const goal = await prisma.savingsGoal.findFirst({ where: { id, userId } });
    if (!goal) throw new ApiError("Goal not found", 404);

    const saved = toNumber(goal.savedAmount);
    await prisma.$transaction(async (tx) => {
      if (saved > 0) {
        const account =
          (await tx.bankAccount.findFirst({
            where: { userId, isDefault: true },
          })) ?? (await tx.bankAccount.findFirst({ where: { userId } }));
        if (account) {
          await tx.bankAccount.update({
            where: { id: account.id },
            data: { balance: { increment: new Prisma.Decimal(saved) } },
          });
          await tx.transaction.create({
            data: {
              userId,
              bankAccountId: account.id,
              type: "CREDIT",
              category: "REFUND",
              amount: new Prisma.Decimal(saved),
              description: `Goal closed — ${goal.name} refund`,
              reference: generateReference(),
              status: "COMPLETED",
              processedAt: new Date(),
            },
          });
        }
      }
      await tx.savingsGoal.delete({ where: { id } });
    });

    return ok({ success: true, refunded: saved });
  });
}
