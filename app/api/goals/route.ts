import { Prisma } from "@prisma/client";
import { handle, ok, requireUserId } from "@/lib/api";
import { prisma } from "@/lib/prisma";
import { serializeGoal } from "@/lib/serialize";
import { goalSchema } from "@/lib/validations";

export async function GET() {
  return handle(async () => {
    const userId = await requireUserId();
    const goals = await prisma.savingsGoal.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
    return ok(goals.map(serializeGoal));
  });
}

export async function POST(req: Request) {
  return handle(async () => {
    const userId = await requireUserId();
    const input = goalSchema.parse(await req.json());
    const goal = await prisma.savingsGoal.create({
      data: {
        userId,
        name: input.name,
        emoji: input.emoji,
        targetAmount: new Prisma.Decimal(input.targetAmount),
        targetDate: input.targetDate ? new Date(input.targetDate) : null,
      },
    });
    return ok(serializeGoal(goal), { status: 201 });
  });
}
