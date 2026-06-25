import { handle, ok, requireUserId } from "@/lib/api";
import { prisma } from "@/lib/prisma";
import { serializeBeneficiary } from "@/lib/serialize";
import { beneficiarySchema } from "@/lib/validations";

export async function GET() {
  return handle(async () => {
    const userId = await requireUserId();
    const list = await prisma.beneficiary.findMany({
      where: { userId },
      orderBy: [{ isFavorite: "desc" }, { createdAt: "desc" }],
    });
    return ok(list.map(serializeBeneficiary));
  });
}

export async function POST(req: Request) {
  return handle(async () => {
    const userId = await requireUserId();
    const input = beneficiarySchema.parse(await req.json());
    const created = await prisma.beneficiary.create({
      data: { ...input, userId },
    });
    return ok(serializeBeneficiary(created), { status: 201 });
  });
}
