import { ApiError, handle, ok, requireUserId } from "@/lib/api";
import { prisma } from "@/lib/prisma";
import { serializeTransaction } from "@/lib/serialize";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  return handle(async () => {
    const userId = await requireUserId();
    const { id } = await params;
    const txn = await prisma.transaction.findFirst({
      where: { id, userId },
      include: { bankAccount: { select: { name: true } } },
    });
    if (!txn) throw new ApiError("Transaction not found", 404);
    return ok(serializeTransaction(txn));
  });
}
