"use client";

import { useState } from "react";
import { ArrowDownUp, RefreshCw, Info } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Label, Select } from "@/components/ui/Input";
import { useFxRates } from "@/hooks/useMisc";
import { FX_FALLBACK } from "@/lib/constants";
import { toast } from "@/lib/toast-store";
import { formatCurrency } from "@/lib/utils";

// USD plus the FX currencies, all priced in USD.
const RATE: Record<string, number> = {
  USD: 1,
  ...Object.fromEntries(FX_FALLBACK.map((r) => [r.code, r.rate])),
};
const CODES = ["USD", ...FX_FALLBACK.map((r) => r.code)];

export default function SwapPage() {
  const { data: liveRates } = useFxRates();
  const [from, setFrom] = useState("USD");
  const [to, setTo] = useState("GBP");
  const [amount, setAmount] = useState("1000");

  const rateFor = (code: string) =>
    code === "USD" ? 1 : liveRates?.find((r) => r.code === code)?.rate ?? RATE[code];

  const amt = Number(amount) || 0;
  const usdValue = amt * rateFor(from);
  const converted = usdValue / rateFor(to);
  const pairRate = rateFor(from) / rateFor(to);

  function flip() {
    setFrom(to);
    setTo(from);
  }

  return (
    <div>
      <PageHeader title="Currency Swap" subtitle="Convert between currencies at live exchange rates" />

      <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
        <Card className="space-y-4">
          {/* From */}
          <div className="rounded-xl border border-line bg-navy-mid p-4">
            <div className="mb-2 flex items-center justify-between">
              <Label className="mb-0">You send</Label>
              <Select value={from} onChange={(e) => setFrom(e.target.value)} className="w-auto min-w-[110px]">
                {CODES.map((c) => <option key={c} value={c}>{c}</option>)}
              </Select>
            </div>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full bg-transparent font-display text-3xl font-bold text-ink-primary outline-none tnum"
              placeholder="0.00"
            />
          </div>

          {/* Flip */}
          <div className="flex justify-center">
            <button onClick={flip} className="flex h-10 w-10 items-center justify-center rounded-full border border-line bg-navy-card text-brand transition hover:border-brand">
              <ArrowDownUp size={18} />
            </button>
          </div>

          {/* To */}
          <div className="rounded-xl border border-line bg-navy-mid p-4">
            <div className="mb-2 flex items-center justify-between">
              <Label className="mb-0">You receive</Label>
              <Select value={to} onChange={(e) => setTo(e.target.value)} className="w-auto min-w-[110px]">
                {CODES.map((c) => <option key={c} value={c}>{c}</option>)}
              </Select>
            </div>
            <div className="font-display text-3xl font-bold text-brand tnum">
              {converted.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: to === "JPY" ? 0 : 2 })}
            </div>
          </div>

          <div className="flex items-center justify-between rounded-xl border border-line bg-navy-mid px-4 py-3 text-sm">
            <span className="text-ink-muted">Exchange rate</span>
            <span className="font-medium text-ink-primary tnum">1 {from} = {pairRate.toLocaleString("en-US", { maximumFractionDigits: 6 })} {to}</span>
          </div>

          <Button
            className="w-full"
            onClick={() => {
              if (amt <= 0) return toast.error("Enter an amount");
              if (from === to) return toast.error("Choose different currencies");
              toast.success("Swap complete", `${formatCurrency(amt, from)} → ${converted.toFixed(2)} ${to}`);
            }}
          >
            <RefreshCw size={15} /> Swap {from} → {to}
          </Button>
        </Card>

        <div className="space-y-5">
          <Card>
            <CardHeader title="Live rates" subtitle="Per 1 USD" />
            <div className="space-y-2.5">
              {FX_FALLBACK.map((r) => (
                <div key={r.code} className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 text-ink-secondary"><span className="text-base">{r.flag}</span>{r.code}</span>
                  <span className="font-medium text-ink-primary tnum">{(1 / rateFor(r.code)).toFixed(4)}</span>
                </div>
              ))}
            </div>
          </Card>
          <Card>
            <div className="flex items-start gap-3 text-xs text-ink-muted">
              <Info size={15} className="mt-0.5 shrink-0 text-brand" />
              Rates are indicative and refresh every 60 seconds. No conversion fees on EligantWealth accounts.
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
