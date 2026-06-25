"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { Card, CardHeader } from "@/components/ui/Card";
import { LoadingSpinner } from "@/components/shared/States";
import { useMonthly } from "@/hooks/useTransactions";
import { cn } from "@/lib/utils";

const CashflowChart = dynamic(
  () => import("@/components/charts/CashflowChart").then((m) => m.CashflowChart),
  { ssr: false, loading: () => <LoadingSpinner /> },
);

const PERIODS = ["7D", "1M", "3M", "1Y"];

export function CashflowCard() {
  const { data, isLoading } = useMonthly();
  const [period, setPeriod] = useState("1M");

  return (
    <Card>
      <CardHeader
        title="Cash Flow Overview"
        subtitle="Income vs Expenses"
        action={
          <div className="flex gap-1 rounded-lg bg-navy-mid p-1">
            {PERIODS.map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={cn(
                  "rounded-md px-3 py-1 text-xs transition",
                  period === p
                    ? "border border-line bg-navy-card text-brand"
                    : "text-ink-muted hover:text-ink-secondary",
                )}
              >
                {p}
              </button>
            ))}
          </div>
        }
      />
      <div className="h-[200px]">
        {isLoading ? <LoadingSpinner /> : <CashflowChart data={data ?? []} />}
      </div>
    </Card>
  );
}
