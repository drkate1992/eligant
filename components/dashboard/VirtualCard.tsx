"use client";

import { useEffect, useState } from "react";
import { Eye, EyeOff, Snowflake } from "lucide-react";
import type { AccountDTO } from "@/types";

// Deterministic per-card expiry derived from the account number, so each card
// shows a distinct (but stable) date instead of a shared hardcoded one.
function cardExpiry(accountNumber?: string) {
  if (!accountNumber) return "08/29";
  const n = parseInt(accountNumber.slice(-4), 10) || 0;
  const month = String((n % 12) + 1).padStart(2, "0");
  const year = 27 + (n % 5);
  return `${month}/${year}`;
}

export function VirtualCard({
  account,
  holder,
}: {
  account?: AccountDTO;
  holder: string;
}) {
  const [revealed, setRevealed] = useState(false);
  const last4 = account?.accountNumber.slice(-4) ?? "4821";
  const expiry = cardExpiry(account?.accountNumber);

  // Auto-hide the card number 3 seconds after it's revealed, for security.
  useEffect(() => {
    if (!revealed) return;
    const t = setTimeout(() => setRevealed(false), 3000);
    return () => clearTimeout(t);
  }, [revealed]);
  const masked = revealed
    ? `4821  ${last4.padStart(4, "0")}  ${last4}  ${last4}`
    : `••••  ••••  ••••  ${last4}`;

  return (
    <div className="relative overflow-hidden rounded-2xl border border-line bg-gradient-to-br from-[#1a2f4a] to-navy p-6">
      <div
        className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(28,166,95,0.14) 0%, transparent 70%)",
        }}
      />
      <div className="mb-5 flex items-center justify-between">
        <span className="text-[10px] uppercase tracking-[2px] text-brand">
          {account?.isFrozen ? "Frozen" : "Debit Card"} ·{" "}
          {account?.name ?? "Savings"}
        </span>
        <button
          onClick={() => setRevealed((s) => !s)}
          className="text-ink-muted transition hover:text-brand"
        >
          {revealed ? <EyeOff size={15} /> : <Eye size={15} />}
        </button>
      </div>
      <div className="mb-5 font-display text-xl tracking-[3px] text-ink-primary">
        {masked}
      </div>
      <div className="flex items-end justify-between">
        <div>
          <div className="text-xs text-ink-muted">Account Holder</div>
          <div className="text-sm font-medium text-ink-primary">{holder}</div>
        </div>
        <div className="text-right">
          <div className="text-[10px] text-ink-muted">Expires</div>
          <div className="font-display text-sm text-brand">{expiry}</div>
        </div>
      </div>
      {account?.isFrozen && (
        <div className="absolute inset-0 flex items-center justify-center bg-navy/60 backdrop-blur-[1px]">
          <span className="flex items-center gap-2 rounded-full border border-line bg-navy-card px-3 py-1 text-xs text-ink-secondary">
            <Snowflake size={13} className="text-brand" /> Card frozen
          </span>
        </div>
      )}
    </div>
  );
}
