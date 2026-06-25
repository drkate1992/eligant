"use client";

import dynamic from "next/dynamic";
import { TrendingUp, TrendingDown } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardHeader } from "@/components/ui/Card";
import { StatCard } from "@/components/dashboard/StatCard";
import { LoadingSpinner } from "@/components/shared/States";
import { Badge } from "@/components/ui/Badge";
import { formatCurrency, cn } from "@/lib/utils";

const PortfolioChart = dynamic(
  () => import("@/components/charts/PortfolioChart").then((m) => m.PortfolioChart),
  { ssr: false, loading: () => <LoadingSpinner /> },
);

const HOLDINGS = [
  { name: "Vanguard S&P 500 ETF", ticker: "VOO", units: 48, price: 512.34, pl: 12.4 },
  { name: "Invesco QQQ Trust", ticker: "QQQ", units: 22, price: 489.1, pl: 18.2 },
  { name: "iShares Core MSCI World", ticker: "IWDA", units: 65, price: 102.7, pl: 7.8 },
  { name: "Vanguard Total Bond", ticker: "BND", units: 80, price: 72.15, pl: -2.1 },
  { name: "ARK Innovation ETF", ticker: "ARKK", units: 30, price: 48.9, pl: -5.6 },
];

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const SERIES = [
  168000, 175400, 182900, 179500, 191200, 203800, 214500, 209700, 226300, 238900,
  245100, 250717.35,
];

const PORTFOLIO_VALUE = 250_717.35;
const TOTAL_GAIN = 368_283.05;
const DAY_CHANGE_PCT = 0.94;

export default function InvestmentsPage() {
  return (
    <div>
      <PageHeader title="Investments" subtitle="Your wealth portfolio" />

      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          icon={<TrendingUp size={18} />}
          iconColor="#1ca65f"
          label="Portfolio Value"
          value={formatCurrency(PORTFOLIO_VALUE, "USD")}
        />
        <StatCard
          icon={<TrendingUp size={18} />}
          iconColor="#34c47b"
          label="Total Gain"
          value={formatCurrency(TOTAL_GAIN, "USD")}
          change="All-time"
          trend="up"
        />
        <StatCard
          icon={<TrendingUp size={18} />}
          iconColor="#6a8fc8"
          label="Holdings"
          value={String(HOLDINGS.length)}
        />
        <StatCard
          icon={<TrendingDown size={18} />}
          iconColor="#c9a84c"
          label="Day Change"
          value={`+${DAY_CHANGE_PCT.toFixed(2)}%`}
          change="Market open"
          trend="up"
        />
      </div>

      <div className="grid gap-5 lg:grid-cols-[1fr_400px]">
        <Card>
          <CardHeader title="Performance" subtitle="Portfolio value over the year" />
          <div className="h-64">
            <PortfolioChart labels={MONTHS} values={SERIES} />
          </div>
        </Card>

        <Card className="p-0">
          <div className="border-b border-line p-5">
            <h3 className="font-display text-lg font-semibold text-ink-primary">
              Holdings
            </h3>
          </div>
          <div className="divide-y divide-line">
            {HOLDINGS.map((h) => (
              <div key={h.ticker} className="flex items-center gap-3 p-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-brand/10 text-[11px] font-bold text-brand">
                  {h.ticker.slice(0, 3)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-[13px] font-medium text-ink-primary">
                    {h.name}
                  </div>
                  <div className="text-[11px] text-ink-muted">
                    {h.units} units · {formatCurrency(h.price)}
                  </div>
                </div>
                <Badge
                  className={cn(
                    h.pl >= 0
                      ? "border-positive/20 bg-positive/10 text-positive"
                      : "border-negative/20 bg-negative/10 text-negative",
                  )}
                >
                  {h.pl >= 0 ? "+" : ""}
                  {h.pl}%
                </Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
