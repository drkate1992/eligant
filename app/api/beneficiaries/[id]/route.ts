import { ApiError, handle, ok, requireUserId } from "@/lib/api";
import { prisma } from "@/lib/prisma";
import { serializeBeneficiary } from "@/lib/serialize";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  return handle(async () => {
    const userId = await requireUserId();
    const { id } = await params;
    const existing = await prisma.beneficiary.findFirst({
      where: { id, userId },
    });
    if (!existing) throw new ApiError("Beneficiary not found", 404);

    const body = await req.json().catch(() => ({}));
    const updated = await prisma.beneficiary.update({
      where: { id },
      data: { isFavorite: body.isFavorite ?? !existing.isFavorite },
    });
    return ok(serializeBeneficiary(updated));
  });
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  return handle(async () => {
    const userId = await requireUserId();
    const { id } = await params;
    const existing = await prisma.beneficiary.findFirst({
      where: { id, userId },
    });
    if (!existing) throw new ApiError("Beneficiary not found", 404);
    await prisma.beneficiary.delete({ where: { id } });
    return ok({ success: true });
  });
}
