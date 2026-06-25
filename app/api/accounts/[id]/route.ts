import { ApiError, handle, ok, requireUserId } from "@/lib/api";
import { prisma } from "@/lib/prisma";
import { serializeAccount } from "@/lib/serialize";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  return handle(async () => {
    const userId = await requireUserId();
    const { id } = await params;
    const account = await prisma.bankAccount.findFirst({
      where: { id, userId },
    });
    if (!account) throw new ApiError("Account not found", 404);
    return ok(serializeAccount(account));
  });
}
