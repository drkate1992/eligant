"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Building2,
  CreditCard,
  Landmark,
  Send,
  Plus,
  ArrowLeftRight,
  Receipt,
  Eye,
  EyeOff,
  Bitcoin,
  ShieldCheck,
  CircleDollarSign,
  Hourglass,
  BarChart3,
  Headphones,
  MessageCircle,
  Zap,
  Lock,
  Copy,
  Check,
  Wallet,
} from "lucide-react";
import { Card, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { toast } from "@/lib/toast-store";
import { formatCurrency, cn } from "@/lib/utils";
import type { AccountDTO, AccountSummary } from "@/types";

const DAILY_LIMIT = 500_000;
const BTC_PRICE = 97_400;
const ROUTING = "251480576";

/* ───────────────────────── Top stat row ───────────────────────── */

function StatTile({
  icon,
  iconColor,
  period,
  value,
  label,
}: {
  icon: React.ReactNode;
  iconColor: string;
  period: string;
  value: string;
  label: string;
}) {
  return (
    <div className="rounded-card border border-line bg-navy-card p-5 transition hover:border-brand/30">
      <div className="mb-4 flex items-start justify-between">
        <span
          className="flex h-10 w-10 items-center justify-center rounded-xl"
          style={{ backgroundColor: `${iconColor}1a`, color: iconColor }}
        >
          {icon}
        </span>
        <span className="text-[11px] uppercase tracking-wider text-ink-muted">{period}</span>
      </div>
      <div className="font-display text-2xl font-bold text-ink-primary tnum">{value}</div>
      <div className="mt-0.5 text-xs text-ink-muted">{label}</div>
    </div>
  );
}

export function OverviewStats({
  summary,
  volume,
  available,
}: {
  summary: AccountSummary;
  volume: number;
  available: number;
}) {
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      <StatTile
        icon={<CreditCard size={19} />}
        iconColor="#1ca65f"
        period="Available"
        value={formatCurrency(available, "USD")}
        label="Available Balance"
      />
      <StatTile
        icon={<ArrowLeftRight size={19} />}
        iconColor="#34c47b"
        period="This Month"
        value={formatCurrency(summary.monthIn, "USD")}
        label="Monthly Deposits"
      />
      <StatTile
        icon={<Receipt size={19} />}
        iconColor="#e0a05c"
        period="This Month"
        value={formatCurrency(summary.monthOut, "USD")}
        label="Monthly Expenses"
      />
      <StatTile
        icon={<BarChart3 size={19} />}
        iconColor="#6a8fc8"
        period="All Time"
        value={formatCurrency(volume, "USD")}
        label="Total Volume"
      />
    </div>
  );
}

/* ─────────────────────── Primary account card ─────────────────────── */

export function PrimaryAccountCard({
  account,
  holder,
  totalPortfolio,
  cryptoUsd,
}: {
  account: AccountDTO;
  holder: string;
  totalPortfolio: number;
  cryptoUsd: number;
}) {
  const [hidden, setHidden] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const btc = cryptoUsd / BTC_PRICE;
  const mask = (v: string) => (hidden ? "••••••" : v);

  return (
    <>
      <div className="relative overflow-hidden rounded-card border border-brand/20 bg-gradient-to-br from-brand-dim via-[#14834a] to-brand p-6 text-white sm:p-7">
        {/* glow accents */}
        <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/10" />
        <div className="pointer-events-none absolute -bottom-20 right-24 h-40 w-40 rounded-full bg-black/10" />

        <div className="relative">
          {/* header */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15">
                <Landmark size={20} />
              </span>
              <div>
                <div className="font-display text-lg font-bold">Unity Financial Group</div>
                <div className="text-xs text-white/70">Primary Account</div>
              </div>
            </div>
            <div className="rounded-xl bg-white/10 px-3 py-2 text-right">
              <div className="text-[10px] uppercase tracking-wider text-white/60">Account Number</div>
              <div className="font-mono text-sm tracking-wide">•••• {account.accountNumber.slice(-4)}</div>
            </div>
          </div>

          {/* balances */}
          <div className="mt-6 grid gap-5 sm:grid-cols-3">
            <div>
              <div className="text-[11px] uppercase tracking-wider text-white/60">Account Holder</div>
              <div className="mt-1 font-semibold">{holder}</div>
              <div className="mt-2 space-y-1 text-xs">
                <div className="flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-white" /> Account Active</div>
                <div className="flex items-center gap-1.5 text-white/80"><ShieldCheck size={12} /> Verified Member</div>
              </div>
              <div className="mt-3 inline-block rounded-xl bg-white/10 px-3 py-2">
                <div className="text-[10px] uppercase tracking-wider text-white/60">Total Portfolio</div>
                <div className="font-display text-base font-bold tnum">{mask(formatCurrency(totalPortfolio))}</div>
              </div>
            </div>

            <div className="sm:text-center">
              <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-white/60 sm:justify-center">
                Fiat Balance
                <button onClick={() => setHidden((h) => !h)} className="text-white/70 transition hover:text-white">
                  {hidden ? <EyeOff size={13} /> : <Eye size={13} />}
                </button>
              </div>
              <div className="mt-1 font-display text-3xl font-extrabold tnum">{mask(formatCurrency(account.balance))}</div>
              <div className="text-xs text-white/70">USD Balance</div>
            </div>

            <div className="sm:text-right">
              <div className="text-[11px] uppercase tracking-wider text-white/60">Crypto Balance</div>
              <div className="mt-1 flex items-center gap-1.5 font-display text-2xl font-bold tnum sm:justify-end">
                <Bitcoin size={18} /> {mask(`${btc.toFixed(6)} BTC`)}
              </div>
              <div className="text-xs text-white/70">≈ {mask(formatCurrency(cryptoUsd))}</div>
              <div className="mt-0.5 text-[11px] text-white/50">1 BTC = {formatCurrency(BTC_PRICE, "USD", { maximumFractionDigits: 0 })}</div>
            </div>
          </div>

          {/* actions */}
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/local-transfer">
              <Button className="!bg-none !bg-white !text-brand-dim !shadow-none hover:!-translate-y-0 hover:!bg-white/90"><Send size={15} /> Send Money</Button>
            </Link>
            <Link href="/deposit">
              <Button variant="outline" className="!border-white/40 !text-white hover:!bg-white/10"><Plus size={15} /> Add Money</Button>
            </Link>
            <button
              onClick={() => setDetailsOpen(true)}
              className="ml-auto inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-white/80 transition hover:bg-white/10 hover:text-white"
            >
              <Building2 size={15} /> Bank Details
            </button>
          </div>
        </div>
      </div>

      <BankDetailsModal open={detailsOpen} onClose={() => setDetailsOpen(false)} account={account} holder={holder} />
    </>
  );
}

/* ─────────────────────── Bank details modal ─────────────────────── */

function CopyLine({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border border-line bg-navy-mid p-3">
      <div className="min-w-0">
        <div className="text-[10px] uppercase tracking-wider text-ink-muted">{label}</div>
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

function BankDetailsModal({
  open,
  onClose,
  account,
  holder,
}: {
  open: boolean;
  onClose: () => void;
  account: AccountDTO;
  holder: string;
}) {
  return (
    <Modal open={open} onClose={onClose} title="Bank Details" subtitle="Share these to receive payments">
      <div className="space-y-2.5">
        <CopyLine label="Account Holder" value={holder} />
        <CopyLine label="Bank Name" value="Unity Financial Group" />
        <CopyLine label="Account Number" value={account.accountNumber} />
        <CopyLine label="Routing Number" value={ROUTING} />
        <CopyLine label="Sort Code" value={account.sortCode ?? "04-29-18"} />
      </div>
    </Modal>
  );
}

/* ─────────────────────── Quick actions ─────────────────────── */

export function QuickActionsRow() {
  const actions = [
    { icon: ArrowLeftRight, label: "Transfer", href: "/local-transfer" },
    { icon: Receipt, label: "Pay Bills", href: "/transactions" },
    { icon: CircleDollarSign, label: "Request", href: "/deposit" },
    { icon: Wallet, label: "Currency Swap", href: "/swap" },
  ];
  return (
    <Card>
      <CardHeader title="Quick Actions" />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {actions.map((a) => (
          <Link
            key={a.label}
            href={a.href}
            className="flex flex-col items-center gap-2.5 rounded-xl border border-line bg-navy-mid p-4 text-center transition hover:border-brand/40 hover:bg-navy-card"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand/12 text-brand">
              <a.icon size={19} />
            </span>
            <span className="text-xs font-medium text-ink-secondary">{a.label}</span>
          </Link>
        ))}
      </div>
    </Card>
  );
}

/* ─────────────────────── Account statistics ─────────────────────── */

export function AccountStatistics({
  volume,
  pendingCount,
  pendingAmount,
}: {
  volume: number;
  pendingCount: number;
  pendingAmount: number;
}) {
  const rows = [
    {
      icon: Lock,
      color: "#1ca65f",
      label: "Transaction Limit",
      value: formatCurrency(DAILY_LIMIT, "USD", { maximumFractionDigits: 0 }),
      sub: "Daily limit available",
    },
    {
      icon: Hourglass,
      color: "#e0a05c",
      label: "Pending Transactions",
      value: formatCurrency(pendingAmount, "USD"),
      sub: `${pendingCount} awaiting processing`,
    },
    {
      icon: BarChart3,
      color: "#6a8fc8",
      label: "Total Volume",
      value: formatCurrency(volume, "USD"),
      sub: "All-time transactions",
    },
  ];
  return (
    <Card>
      <CardHeader title="Account Statistics" />
      <div className="space-y-3">
        {rows.map((r) => (
          <div key={r.label} className="flex items-center gap-3 rounded-xl border border-line bg-navy-mid p-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl" style={{ backgroundColor: `${r.color}1a`, color: r.color }}>
              <r.icon size={16} />
            </span>
            <div className="min-w-0 flex-1">
              <div className="text-[11px] uppercase tracking-wider text-ink-muted">{r.label}</div>
              <div className="font-display text-base font-bold text-ink-primary tnum">{r.value}</div>
            </div>
            <span className="text-[11px] text-ink-muted">{r.sub}</span>
          </div>
        ))}
      </div>
      <div className="mt-3 flex items-center justify-center gap-1.5 text-[11px] text-ink-muted">
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-positive" /> Updated in real-time
      </div>
    </Card>
  );
}

/* ─────────────────────── Need assistance ─────────────────────── */

export function NeedAssistance() {
  return (
    <Card className="text-center">
      <span className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-brand/12 text-brand">
        <Headphones size={22} />
      </span>
      <div className="font-display text-lg font-semibold text-ink-primary">Need Assistance?</div>
      <p className="mt-1 text-sm text-ink-muted">Our expert support team is available 24/7</p>

      <div className="mt-4 grid grid-cols-2 gap-3 text-left">
        <div className="rounded-xl border border-line bg-navy-mid p-3">
          <Zap size={15} className="mb-1 text-brand" />
          <div className="text-xs font-semibold text-ink-primary">Quick Response</div>
          <div className="text-[11px] text-ink-muted">&lt; 5 minutes</div>
        </div>
        <div className="rounded-xl border border-line bg-navy-mid p-3">
          <ShieldCheck size={15} className="mb-1 text-brand" />
          <div className="text-xs font-semibold text-ink-primary">Secure Chat</div>
          <div className="text-[11px] text-ink-muted">Encrypted</div>
        </div>
      </div>

      <Link href="/support" className="mt-4 block">
        <Button className="w-full"><MessageCircle size={15} /> Start Live Chat</Button>
      </Link>
      <p className="mt-2 text-[11px] text-ink-muted">Or call us at 1-800-BANKING for urgent matters</p>
    </Card>
  );
}
