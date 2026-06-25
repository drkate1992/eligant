import { Prisma } from "@prisma/client";
import { requireUserId, toErrorResponse } from "@/lib/api";
import { prisma } from "@/lib/prisma";
import { toNumber, formatDate } from "@/lib/utils";

function csvCell(v: string | number) {
  const s = String(v);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

export async function GET(req: Request) {
  try {
    const userId = await requireUserId();
    const sp = new URL(req.url).searchParams;

    const where: Prisma.TransactionWhereInput = { userId };
    const accountId = sp.get("accountId");
    const type = sp.get("type");
    const startDate = sp.get("startDate");
    const endDate = sp.get("endDate");
    if (accountId) where.bankAccountId = accountId;
    if (type && type !== "ALL") where.type = type;
    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = new Date(startDate);
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        where.createdAt.lte = end;
      }
    }

    const txns = await prisma.transaction.findMany({
      where,
      include: { bankAccount: { select: { name: true } } },
      orderBy: { createdAt: "desc" },
    });

    const header = [
      "Date",
      "Description",
      "Account",
      "Type",
      "Category",
      "Status",
      "Reference",
      "Amount",
      "Currency",
    ];
    const lines = [header.join(",")];
    for (const t of txns) {
      const amt = toNumber(t.amount);
      lines.push(
        [
          formatDate(t.createdAt, true),
          t.description,
          t.bankAccount?.name ?? "",
          t.type,
          t.category,
          t.status,
          t.reference,
          (t.type === "DEBIT" ? -amt : amt).toFixed(2),
          t.currency,
        ]
          .map(csvCell)
          .join(","),
      );
    }
    const csv = lines.join("\n");

    return new Response(csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="eligantwealth-transactions-${Date.now()}.csv"`,
      },
    });
  } catch (err) {
    return toErrorResponse(err);
  }
}
