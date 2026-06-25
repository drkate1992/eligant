"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { FileText, Globe, Banknote, Snowflake, ArrowRight, Plus } from "lucide-react";
import { Card, CardHeader } from "@/components/ui/Card";
import { LoadingSpinner } from "@/components/shared/States";
import { useFxRates } from "@/hooks/useMisc";
import { useByCategory } from "@/hooks/useTransactions";
import { useGoals } from "@/hooks/useGoals";
import { formatCurrency, cn } from "@/lib/utils";

const SpendingDonut = dynamic(
  () => import("@/components/charts/SpendingDonut").then((m) => m.SpendingDonut),
  { ssr: false, loading: () => <LoadingSpinner /> },
);

export function QuickActions() {
  const actions = [
    { icon: FileText, label: "Statement", href: "/transactions" },
    { icon: Globe, label: "International", href: "/international" },
    { icon: Banknote, label: "Deposit", href: "/deposit" },
    { icon: Snowflake, label: "Freeze Card", href: "/cards" },
  ];
  return (
    <Card>
      <CardHeader title="Quick Actions" />
      <div className="grid grid-cols-2 gap-2.5">
        {actions.map((a) => (
          <Link
            key={a.label}
            href={a.href}
            className="flex flex-col items-start gap-2.5 rounded-xl border border-line bg-navy-mid p-4 transition hover:border-brand/30 hover:bg-brand/[0.04]"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-brand/10 text-brand">
              <a.icon size={15} />
            </span>
            <span className="text-xs text-ink-secondary">{a.label}</span>
          </Link>
        ))}
      </div>
    </Card>
  );
}

export function FxRatesCard() {
  const { data, isLoading } = useFxRates();
  return (
    <Card>
      <CardHeader
        title="FX Rates"
        subtitle="Live · Updated now"
        action={
          <Link href="/swap" className="ufg-link">
            All rates <ArrowRight size={13} />
          </Link>
        }
      />
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <div>
          {(data ?? []).map((r) => (
            <div
              key={r.code}
              className="flex items-center gap-3 border-b border-line py-2.5 last:border-0"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-navy-mid text-base">
                {r.flag}
              </span>
              <div>
                <div className="text-[13px] font-medium text-ink-primary">
                  {r.name}
                </div>
                <div className="text-[11px] text-ink-muted">{r.code} / USD</div>
              </div>
              <div className="ml-auto text-right">
                <div className="font-display text-base text-ink-primary">
                  {r.rate}
                </div>
                <div
                  className={cn(
                    "text-[11px]",
                    r.change >= 0 ? "text-positive" : "text-negative",
                  )}
                >
                  {r.change >= 0 ? "+" : ""}
                  {r.change}%
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}

export function SpendingCard() {
  const { data, isLoading } = useByCategory();
  const slices = data ?? [];
  return (
    <Card>
      <CardHeader title="Spending by Category" subtitle="This month" />
      {isLoading ? (
        <LoadingSpinner />
      ) : slices.length === 0 ? (
        <p className="py-8 text-center text-xs text-ink-muted">
          No spending yet this month.
        </p>
      ) : (
        <>
          <div className="relative mx-auto h-40">
            <SpendingDonut data={slices} />
          </div>
          <div className="mt-4 flex flex-col gap-2">
            {slices.slice(0, 4).map((s) => (
              <div key={s.category} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className="h-2.5 w-2.5 rounded-[3px]"
                    style={{ background: s.color }}
                  />
                  <span className="text-xs text-ink-secondary">{s.label}</span>
                </div>
                <span className="font-display text-[13px] text-ink-primary">
                  {formatCurrency(s.amount, "USD", { maximumFractionDigits: 0 })}{" "}
                  · {s.pct.toFixed(0)}%
                </span>
              </div>
            ))}
          </div>
        </>
      )}
    </Card>
  );
}

export function SavingsGoalsWidget() {
  const { data, isLoading } = useGoals();
  const goals = (data ?? []).filter((g) => g.isActive).slice(0, 2);
  return (
    <Card>
      <CardHeader
        title="Savings Goals"
        subtitle={`${data?.length ?? 0} active goals`}
        action={
          <Link href="/goals" className="ufg-link">
            Manage <ArrowRight size={13} />
          </Link>
        }
      />
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <div className="flex flex-col gap-5">
          {goals.map((g) => (
            <div key={g.id}>
              <div className="mb-2 flex justify-between">
                <div>
                  <div className="text-[13px] font-medium text-ink-primary">
                    {g.emoji} {g.name}
                  </div>
                  <div className="text-[11px] text-ink-muted">
                    {g.targetDate
                      ? `Target: ${new Date(g.targetDate).toLocaleDateString(
                          "en-US",
                          { month: "short", year: "numeric" },
                        )}`
                      : "No deadline"}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-display text-base text-brand">
                    {formatCurrency(g.savedAmount, "USD", {
                      maximumFractionDigits: 0,
                    })}
                  </div>
                  <div className="text-[11px] text-ink-muted">
                    of{" "}
                    {formatCurrency(g.targetAmount, "USD", {
                      maximumFractionDigits: 0,
                    })}
                  </div>
                </div>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-navy-mid">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-brand to-brand-dim transition-all duration-700"
                  style={{ width: `${g.progress}%` }}
                />
              </div>
              <div className="mt-1 text-right text-[11px] text-ink-muted">
                {g.progress.toFixed(0)}% complete
              </div>
            </div>
          ))}
          <Link href="/goals">
            <button className="ufg-btn-outline w-full text-xs">
              <Plus size={13} /> Add New Goal
            </button>
          </Link>
        </div>
      )}
    </Card>
  );
}
