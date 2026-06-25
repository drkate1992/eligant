import { prisma } from "./prisma";
import { toNumber } from "./utils";
import { CATEGORY_META } from "./constants";
import type {
  AccountSummary,
  TxnStats,
  MonthlyPoint,
  CategorySlice,
} from "@/types";

function startOfMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

export async function getAccountSummary(userId: string): Promise<AccountSummary> {
  const accounts = await prisma.bankAccount.findMany({ where: { userId } });
  const totalBalance = accounts.reduce((s, a) => s + toNumber(a.balance), 0);

  const now = new Date();
  const monthStart = startOfMonth(now);
  const prevMonthStart = startOfMonth(
    new Date(now.getFullYear(), now.getMonth() - 1, 1),
  );

  const monthTxns = await prisma.transaction.findMany({
    where: { userId, createdAt: { gte: monthStart } },
  });
  const prevTxns = await prisma.transaction.findMany({
    where: { userId, createdAt: { gte: prevMonthStart, lt: monthStart } },
  });

  const sum = (list: typeof monthTxns, type: "CREDIT" | "DEBIT") =>
    list
      .filter((t) => t.type === type && t.status === "COMPLETED")
      .reduce((s, t) => s + toNumber(t.amount), 0);

  const monthIn = sum(monthTxns, "CREDIT");
  const monthOut = sum(monthTxns, "DEBIT");
  const prevNet = sum(prevTxns, "CREDIT") - sum(prevTxns, "DEBIT");
  const monthNet = monthIn - monthOut;
  const monthChangeAmount = monthNet;
  const monthChangePct =
    totalBalance > 0 ? (monthNet / totalBalance) * 100 : 0;

  return {
    totalBalance,
    accountCount: accounts.length,
    monthIn,
    monthOut,
    savingsRate: monthIn > 0 ? (monthIn - monthOut) / monthIn : 0,
    portfolioReturn: 8.7, // mock YTD figure
    monthChangeAmount,
    monthChangePct: prevNet === 0 ? monthChangePct : monthChangePct,
  };
}

export async function getTxnStats(
  userId: string,
  range?: { gte?: Date; lt?: Date },
): Promise<TxnStats> {
  const txns = await prisma.transaction.findMany({
    where: {
      userId,
      ...(range ? { createdAt: range } : {}),
    },
  });
  const credited = txns
    .filter((t) => t.type === "CREDIT")
    .reduce((s, t) => s + toNumber(t.amount), 0);
  const debited = txns
    .filter((t) => t.type === "DEBIT")
    .reduce((s, t) => s + toNumber(t.amount), 0);
  return { credited, debited, count: txns.length, net: credited - debited };
}

export async function getMonthly(
  userId: string,
  months = 6,
): Promise<MonthlyPoint[]> {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth() - (months - 1), 1);
  const txns = await prisma.transaction.findMany({
    where: { userId, createdAt: { gte: start } },
  });

  const points: MonthlyPoint[] = [];
  for (let i = 0; i < months; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - (months - 1) + i, 1);
    const next = new Date(d.getFullYear(), d.getMonth() + 1, 1);
    const inMonth = txns.filter(
      (t) => t.createdAt >= d && t.createdAt < next,
    );
    points.push({
      month: d.toLocaleDateString("en-US", { month: "short" }),
      credit: inMonth
        .filter((t) => t.type === "CREDIT")
        .reduce((s, t) => s + toNumber(t.amount), 0),
      debit: inMonth
        .filter((t) => t.type === "DEBIT")
        .reduce((s, t) => s + toNumber(t.amount), 0),
    });
  }
  return points;
}

export async function getByCategory(userId: string): Promise<CategorySlice[]> {
  const monthStart = startOfMonth(new Date());
  const txns = await prisma.transaction.findMany({
    where: { userId, type: "DEBIT", createdAt: { gte: monthStart } },
  });
  const totals = new Map<string, number>();
  for (const t of txns) {
    totals.set(t.category, (totals.get(t.category) ?? 0) + toNumber(t.amount));
  }
  const grand = [...totals.values()].reduce((s, v) => s + v, 0);
  return [...totals.entries()]
    .map(([category, amount]) => ({
      category,
      label: CATEGORY_META[category]?.label ?? category,
      color: CATEGORY_META[category]?.color ?? "#6a7f96",
      amount,
      pct: grand > 0 ? (amount / grand) * 100 : 0,
    }))
    .sort((a, b) => b.amount - a.amount);
}
