"use client";

import dynamic from "next/dynamic";
import {
  Bitcoin,
  TrendingUp,
  TrendingDown,
  Percent,
  Coins,
  ArrowDownToLine,
  ArrowUpFromLine,
} from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardHeader } from "@/components/ui/Card";
import { StatCard } from "@/components/dashboard/StatCard";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { LoadingSpinner } from "@/components/shared/States";
import { useAccounts } from "@/hooks/useAccounts";
import {
  CRYPTO_ASSETS,
  CRYPTO_SAVINGS_APY,
  CRYPTO_ACCOUNT_TYPES,
} from "@/lib/constants";
import { formatCurrency, cn } from "@/lib/utils";
import { toast } from "@/lib/toast-store";
import type { CategorySlice } from "@/types";

const SpendingDonut = dynamic(
  () => import("@/components/charts/SpendingDonut").then((m) => m.SpendingDonut),
  { ssr: false, loading: () => <LoadingSpinner /> },
);
const PortfolioChart = dynamic(
  () => import("@/components/charts/PortfolioChart").then((m) => m.PortfolioChart),
  { ssr: false, loading: () => <LoadingSpinner /> },
);

const MONTHS = ["Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun"];
const SERIES = [1_180_000, 1_310_000, 1_240_000, 1_460_000, 1_520_000, 1_690_000, 1_610_000, 1_740_000, 1_700_000, 1_820_000, 1_905_000, 1_928_300];

export default function CryptoPage() {
  const { data: accounts, isLoading } = useAccounts();

  const cryptoAccounts =
    accounts?.filter((a) =>
      (CRYPTO_ACCOUNT_TYPES as readonly string[]).includes(a.type),
    ) ?? [];
  const savings = cryptoAccounts.find((a) => a.type === "CRYPTO_SAVINGS");
  const trading = cryptoAccounts.find((a) => a.type === "CRYPTO_TRADING");

  const holdings = CRYPTO_ASSETS.map((a) => ({ ...a, value: a.amount * a.price }));
  const totalValue =
    cryptoAccounts.reduce((s, a) => s + a.balance, 0) ||
    holdings.reduce((s, h) => s + h.value, 0);

  const change24h =
    holdings.reduce((s, h) => s + h.value * h.change, 0) /
    holdings.reduce((s, h) => s + h.value, 0);

  const allocation: CategorySlice[] = holdings.map((h) => ({
    category: h.symbol,
    label: h.symbol,
    color: h.color,
    amount: h.value,
    pct: (h.value / totalValue) * 100,
  }));

  if (isLoading) return <LoadingSpinner />;

  return (
    <div>
      <PageHeader
        title="Crypto"
        subtitle="Your digital asset savings & trading portfolio"
        action={
          <div className="flex gap-2.5">
            <Button variant="outline" onClick={() => toast.info("Deposit", "Send crypto to your wallet address (demo).")}>
              <ArrowDownToLine size={15} /> Deposit
            </Button>
            <Button onClick={() => toast.info("Buy crypto", "Order ticket opens here (demo).")}>
              <Bitcoin size={15} /> Buy Crypto
            </Button>
          </div>
        }
      />

      {/* Stats */}
      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          icon={<Coins size={18} />}
          iconColor="#f7931a"
          label="Total Crypto Value"
          value={formatCurrency(totalValue, "USD", { maximumFractionDigits: 0 })}
        />
        <StatCard
          icon={change24h >= 0 ? <TrendingUp size={18} /> : <TrendingDown size={18} />}
          iconColor={change24h >= 0 ? "#34c47b" : "#e05c5c"}
          label="24h Change"
          value={`${change24h >= 0 ? "+" : ""}${change24h.toFixed(2)}%`}
          change="Across all assets"
          trend={change24h >= 0 ? "up" : "down"}
        />
        <StatCard
          icon={<Percent size={18} />}
          iconColor="#8b5cf6"
          label="Savings APY"
          value={`${CRYPTO_SAVINGS_APY}%`}
          change="Paid daily in USDC"
          trend="up"
        />
        <StatCard
          icon={<Bitcoin size={18} />}
          iconColor="#627eea"
          label="Assets Held"
          value={String(holdings.length)}
        />
      </div>

      {/* Account cards */}
      <div className="mb-6 grid gap-5 md:grid-cols-2">
        <Card className="relative overflow-hidden">
          <div className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-[#f7931a] opacity-20" />
          <div className="relative">
            <div className="flex items-center justify-between">
              <span className="text-xs text-ink-muted">Crypto Savings</span>
              <Badge className="border-positive/20 bg-positive/10 text-positive">
                {CRYPTO_SAVINGS_APY}% APY
              </Badge>
            </div>
            <div className="mt-2 font-display text-3xl font-bold text-ink-primary tnum">
              {formatCurrency(savings?.balance ?? 0, "USD")}
            </div>
            <p className="mt-1 text-xs text-ink-muted">
              Earning daily yield on stablecoins · ••••{" "}
              {savings?.accountNumber.slice(-4)}
            </p>
          </div>
        </Card>
        <Card className="relative overflow-hidden">
          <div className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-[#8b5cf6] opacity-20" />
          <div className="relative">
            <div className="flex items-center justify-between">
              <span className="text-xs text-ink-muted">Crypto Trading</span>
              <Badge
                className={cn(
                  change24h >= 0
                    ? "border-positive/20 bg-positive/10 text-positive"
                    : "border-negative/20 bg-negative/10 text-negative",
                )}
              >
                {change24h >= 0 ? "+" : ""}
                {change24h.toFixed(2)}% 24h
              </Badge>
            </div>
            <div className="mt-2 font-display text-3xl font-bold text-ink-primary tnum">
              {formatCurrency(trading?.balance ?? 0, "USD")}
            </div>
            <p className="mt-1 text-xs text-ink-muted">
              Active spot holdings · •••• {trading?.accountNumber.slice(-4)}
            </p>
          </div>
        </Card>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1fr_360px]">
        {/* Holdings */}
        <Card className="p-0">
          <div className="flex items-center justify-between border-b border-line p-5">
            <h3 className="font-display text-lg font-bold text-ink-primary">
              Holdings
            </h3>
            <span className="text-xs text-ink-muted">{holdings.length} assets</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px]">
              <thead>
                <tr className="border-b border-line text-left text-[11px] uppercase tracking-wider text-ink-muted">
                  <th className="px-5 py-3 font-medium">Asset</th>
                  <th className="px-5 py-3 text-right font-medium">Holdings</th>
                  <th className="px-5 py-3 text-right font-medium">Price</th>
                  <th className="px-5 py-3 text-right font-medium">Value</th>
                  <th className="px-5 py-3 text-right font-medium">24h</th>
                  <th className="px-5 py-3 text-right font-medium" />
                </tr>
              </thead>
              <tbody>
                {holdings.map((h) => (
                  <tr key={h.symbol} className="border-b border-line/60">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <span
                          className="flex h-9 w-9 items-center justify-center rounded-full text-[11px] font-bold"
                          style={{ backgroundColor: `${h.color}22`, color: h.color }}
                        >
                          {h.symbol}
                        </span>
                        <div>
                          <div className="text-[13px] font-medium text-ink-primary">
                            {h.name}
                          </div>
                          <div className="text-[11px] text-ink-muted">{h.symbol}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-right text-[13px] text-ink-secondary tnum">
                      {h.amount.toLocaleString()} {h.symbol}
                    </td>
                    <td className="px-5 py-4 text-right text-[13px] text-ink-secondary tnum">
                      {formatCurrency(h.price)}
                    </td>
                    <td className="px-5 py-4 text-right font-display text-[15px] font-bold text-ink-primary tnum">
                      {formatCurrency(h.value, "USD", { maximumFractionDigits: 0 })}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <span
                        className={cn(
                          "text-[13px] font-medium tnum",
                          h.change >= 0 ? "text-positive" : "text-negative",
                        )}
                      >
                        {h.change >= 0 ? "+" : ""}
                        {h.change}%
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex justify-end gap-1.5">
                        <button
                          onClick={() => toast.success(`Buy ${h.symbol}`, "Order placed (demo).")}
                          className="rounded-lg border border-line px-2.5 py-1 text-[11px] text-ink-secondary transition hover:border-brand hover:text-brand"
                        >
                          Buy
                        </button>
                        <button
                          onClick={() => toast.success(`Sell ${h.symbol}`, "Order placed (demo).")}
                          className="rounded-lg border border-line px-2.5 py-1 text-[11px] text-ink-secondary transition hover:border-negative hover:text-negative"
                        >
                          Sell
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Right column: allocation + performance */}
        <div className="flex flex-col gap-5">
          <Card>
            <CardHeader title="Allocation" subtitle="By asset value" />
            <div className="relative mx-auto h-40">
              <SpendingDonut data={allocation} />
            </div>
            <div className="mt-4 flex flex-col gap-2">
              {allocation.map((a) => (
                <div key={a.category} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className="h-2.5 w-2.5 rounded-[3px]"
                      style={{ background: a.color }}
                    />
                    <span className="text-xs text-ink-secondary">{a.label}</span>
                  </div>
                  <span className="font-display text-[13px] text-ink-primary tnum">
                    {a.pct.toFixed(0)}%
                  </span>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <CardHeader title="Performance" subtitle="Portfolio value · 12 months" />
            <div className="h-44">
              <PortfolioChart labels={MONTHS} values={SERIES} />
            </div>
          </Card>
        </div>
      </div>

      <div className="mt-6 flex items-center gap-2 rounded-xl border border-line bg-white/[0.02] px-4 py-3 text-xs text-ink-muted">
        <ArrowUpFromLine size={14} className="text-brand" />
        Crypto holdings are illustrative for this demo. Prices are indicative and
        not live market data.
      </div>
    </div>
  );
}
