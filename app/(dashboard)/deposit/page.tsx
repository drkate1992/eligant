"use client";

import { useState } from "react";
import { Building2, CreditCard, Bitcoin, Copy, Check } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input, Label } from "@/components/ui/Input";
import { useAccounts } from "@/hooks/useAccounts";
import { toast } from "@/lib/toast-store";
import { cn } from "@/lib/utils";

const BTC_ADDRESS = "bc1q49nv2q9cqhw888fjczw7nr0t8kgd9zxa9v6qha";
const ROUTING = "251480576";

type Method = "bank" | "card" | "crypto";

function CopyRow({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border border-line bg-navy-mid p-3">
      <div className="min-w-0">
        <div className="text-[11px] uppercase tracking-wider text-ink-muted">{label}</div>
        <div className="truncate font-mono text-sm text-ink-primary">{value}</div>
      </div>
      <button
        onClick={() => { navigator.clipboard?.writeText(value); setCopied(true); toast.success("Copied", label); setTimeout(() => setCopied(false), 1500); }}
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand/10 text-brand transition hover:bg-brand/20"
      >
        {copied ? <Check size={15} /> : <Copy size={15} />}
      </button>
    </div>
  );
}

export default function DepositPage() {
  const { data: accounts } = useAccounts();
  const primary = accounts?.find((a) => a.isDefault) ?? accounts?.[0];
  const [method, setMethod] = useState<Method>("bank");
  const [cardAmount, setCardAmount] = useState("");

  const TABS: { id: Method; label: string; icon: typeof Building2 }[] = [
    { id: "bank", label: "Bank Transfer", icon: Building2 },
    { id: "card", label: "Debit Card", icon: CreditCard },
    { id: "crypto", label: "Crypto", icon: Bitcoin },
  ];

  return (
    <div>
      <PageHeader title="Deposit" subtitle="Add funds to your Unity Financial account" />

      <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
        <Card className="space-y-5">
          <div className="flex gap-1 rounded-xl bg-navy-mid p-1">
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => setMethod(t.id)}
                className={cn(
                  "flex flex-1 items-center justify-center gap-2 rounded-lg py-2.5 text-sm transition",
                  method === t.id ? "border border-line bg-navy-card text-brand" : "text-ink-muted hover:text-ink-secondary",
                )}
              >
                <t.icon size={15} /> {t.label}
              </button>
            ))}
          </div>

          {method === "bank" && (
            <div className="space-y-3">
              <p className="text-sm text-ink-secondary">
                Transfer funds from another bank using the details below. Deposits usually clear within 1 business day.
              </p>
              <CopyRow label="Account Name" value={primary ? "Unity Financial Group" : "—"} />
              <CopyRow label="Account Number" value={primary?.accountNumber ?? "—"} />
              <CopyRow label="Routing Number" value={ROUTING} />
              <CopyRow label="Sort Code" value={primary?.sortCode ?? "04-29-18"} />
            </div>
          )}

          {method === "card" && (
            <div className="space-y-4">
              <div>
                <Label>Amount</Label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-display text-lg font-semibold text-brand">$</span>
                  <input type="number" className="ufg-input pl-8 text-lg font-bold tnum" placeholder="0.00" value={cardAmount} onChange={(e) => setCardAmount(e.target.value)} />
                </div>
              </div>
              <div>
                <Label>Card Number</Label>
                <Input placeholder="0000 0000 0000 0000" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Expiry</Label><Input placeholder="MM/YY" /></div>
                <div><Label>CVC</Label><Input placeholder="123" /></div>
              </div>
              <Button
                className="w-full"
                onClick={() => {
                  if (!Number(cardAmount)) return toast.error("Enter an amount");
                  toast.success("Deposit submitted", `${cardAmount} will be added shortly (demo).`);
                  setCardAmount("");
                }}
              >
                <CreditCard size={15} /> Deposit with Card
              </Button>
            </div>
          )}

          {method === "crypto" && (
            <div className="space-y-4">
              <p className="text-sm text-ink-secondary">Send <strong className="text-ink-primary">Bitcoin (BTC)</strong> to the address below. Only send BTC to this address.</p>
              <div className="mx-auto w-fit rounded-2xl border border-line bg-white p-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${BTC_ADDRESS}`}
                  alt="BTC deposit address QR"
                  width={160}
                  height={160}
                  className="rounded-lg"
                />
              </div>
              <CopyRow label="Bitcoin Address" value={BTC_ADDRESS} />
              <div className="rounded-xl border border-[#c8a76a]/30 bg-[#c8a76a]/10 p-3 text-xs text-ink-secondary">
                ⚠ Sending any asset other than BTC to this address may result in permanent loss.
              </div>
            </div>
          )}
        </Card>

        <div className="space-y-5">
          <Card>
            <CardHeader title="Why deposit?" />
            <ul className="space-y-2.5 text-sm text-ink-secondary">
              {["Fund transfers and bill payments", "Grow with high-yield savings", "Buy crypto and investments", "No deposit fees"].map((t) => (
                <li key={t} className="flex items-center gap-2.5">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand/15 text-brand"><Check size={12} /></span>
                  {t}
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}
