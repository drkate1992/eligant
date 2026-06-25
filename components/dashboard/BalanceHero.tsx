"use client";

import Link from "next/link";
import { Plus, Send, ArrowLeftRight, CreditCard, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useCountUp } from "@/hooks/useCountUp";
import { formatCurrency, cn } from "@/lib/utils";
import { ACCOUNT_TYPE_META } from "@/lib/constants";
import type { AccountDTO, AccountSummary } from "@/types";

export function BalanceHero({
  summary,
  accounts,
}: {
  summary: AccountSummary;
  accounts: AccountDTO[];
}) {
  const animated = useCountUp(summary.totalBalance);
  const up = summary.monthChangeAmount >= 0;

  return (
    <div className="relative mb-6 grid gap-8 overflow-hidden rounded-card border border-line bg-gradient-to-br from-navy-card via-[#1a2f4a] to-navy-light p-7 sm:p-9 lg:grid-cols-2 lg:items-center">
      <div
        className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(28,166,95,0.1) 0%, transparent 70%)",
        }}
      />
      <div className="relative">
        <div className="text-[11px] uppercase tracking-[2px] text-brand">
          Total Portfolio Value
        </div>
        <div className="mt-2 font-display text-4xl font-extrabold leading-none text-ink-primary tnum sm:text-5xl">
          <span className="mr-1 text-2xl text-brand sm:text-3xl">$</span>
          {animated.toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </div>
        <div className="mt-2 text-[13px] text-ink-muted">
          Across {summary.accountCount} accounts · Last updated just now
        </div>
        <div
          className={cn(
            "mt-3 inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium",
            up
              ? "border-positive/20 bg-positive/10 text-positive"
              : "border-negative/20 bg-negative/10 text-negative",
          )}
        >
          <TrendingUp size={12} />
          {up ? "+" : ""}
          {formatCurrency(summary.monthChangeAmount)} (
          {summary.monthChangePct.toFixed(2)}%) this month
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          {accounts.map((a) => (
            <Link
              key={a.id}
              href="/accounts"
              className="flex items-center gap-1.5 rounded-lg border border-line bg-white/[0.04] px-3.5 py-1.5 text-xs text-ink-secondary transition hover:border-brand hover:text-brand-light"
            >
              <span
                className="h-1.5 w-1.5 rounded-full"
                style={{ background: ACCOUNT_TYPE_META[a.type]?.dot ?? "#1ca65f" }}
              />
              {ACCOUNT_TYPE_META[a.type]?.label ?? a.name} ·{" "}
              {formatCurrency(a.balance, a.currency, {
                maximumFractionDigits: 0,
                minimumFractionDigits: 0,
              })}
            </Link>
          ))}
        </div>
      </div>

      <div className="relative flex flex-col gap-3 lg:items-end">
        <div className="flex gap-2.5">
          <Link href="/deposit">
            <Button>
              <Plus size={15} /> Add Money
            </Button>
          </Link>
          <Link href="/local-transfer">
            <Button variant="outline">
              <Send size={15} /> Send
            </Button>
          </Link>
        </div>
        <div className="flex gap-2.5">
          <Link href="/swap">
            <Button variant="outline">
              <ArrowLeftRight size={15} /> Exchange
            </Button>
          </Link>
          <Link href="/cards">
            <Button variant="outline">
              <CreditCard size={15} /> Cards
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
