import { Prisma } from "@prisma/client";
import { handle, ok, requireUserId } from "@/lib/api";
import { prisma } from "@/lib/prisma";
import { serializeTransaction } from "@/lib/serialize";
import { txnFilterSchema } from "@/lib/validations";

export async function GET(req: Request) {
  return handle(async () => {
    const userId = await requireUserId();
    const sp = new URL(req.url).searchParams;
    const filters = txnFilterSchema.parse(Object.fromEntries(sp));
    const limit = filters.limit ?? 15;

    const where: Prisma.TransactionWhereInput = { userId };
    if (filters.type && filters.type !== "ALL") where.type = filters.type;
    if (filters.category && filters.category !== "ALL")
      where.category = filters.category;
    if (filters.accountId) where.bankAccountId = filters.accountId;
    if (filters.search) {
      where.description = { contains: filters.search };
    }
    if (filters.startDate || filters.endDate) {
      where.createdAt = {};
      if (filters.startDate) where.createdAt.gte = new Date(filters.startDate);
      if (filters.endDate) {
        const end = new Date(filters.endDate);
        end.setHours(23, 59, 59, 999);
        where.createdAt.lte = end;
      }
    }

    const total = await prisma.transaction.count({ where });
    const rows = await prisma.transaction.findMany({
      where,
      include: { bankAccount: { select: { name: true } } },
      orderBy: { createdAt: "desc" },
      take: limit + 1,
      ...(filters.cursor
        ? { cursor: { id: filters.cursor }, skip: 1 }
        : {}),
    });

    const hasMore = rows.length > limit;
    const data = (hasMore ? rows.slice(0, limit) : rows).map(
      serializeTransaction,
    );
    const nextCursor = hasMore ? rows[limit - 1].id : null;

    return ok({ data, nextCursor, total });
  });
}
