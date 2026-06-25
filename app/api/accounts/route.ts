import { handle, ok, requireUserId } from "@/lib/api";
import { prisma } from "@/lib/prisma";
import { serializeAccount } from "@/lib/serialize";
import { createAccountSchema } from "@/lib/validations";
import { generateAccountNumber } from "@/lib/utils";

export async function GET() {
  return handle(async () => {
    const userId = await requireUserId();
    const accounts = await prisma.bankAccount.findMany({
      where: { userId },
      orderBy: [{ isDefault: "desc" }, { createdAt: "asc" }],
    });
    return ok(accounts.map(serializeAccount));
  });
}

export async function POST(req: Request) {
  return handle(async () => {
    const userId = await requireUserId();
    const input = createAccountSchema.parse(await req.json());
    const account = await prisma.bankAccount.create({
      data: {
        userId,
        type: input.type,
        name: input.name,
        currency: input.currency,
        accountNumber: generateAccountNumber(),
        sortCode: "04-29-18",
      },
    });
    return ok(serializeAccount(account), { status: 201 });
  });
}
