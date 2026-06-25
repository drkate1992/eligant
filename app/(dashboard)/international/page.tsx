"use client";

import { useState } from "react";
import {
  Globe,
  Bitcoin,
  Wallet,
  Banknote,
  Building2,
  Smartphone,
  ArrowLeft,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input, Label, Select } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { useAccounts } from "@/hooks/useAccounts";
import { useExternalTransfer } from "@/hooks/useTransfer";
import { FX_FALLBACK } from "@/lib/constants";
import { toast } from "@/lib/toast-store";
import { FetchError } from "@/lib/api-client";
import { formatCurrency, cn } from "@/lib/utils";

const METHODS = [
  { id: "Wire Transfer", icon: Building2, desc: "Direct to international bank accounts", color: "#6a8fc8" },
  { id: "Cryptocurrency", icon: Bitcoin, desc: "Send to a crypto wallet", color: "#f7931a" },
  { id: "PayPal", icon: Wallet, desc: "Transfer to a PayPal account", color: "#627eea" },
  { id: "Wise Transfer", icon: Banknote, desc: "Low-fee global transfer", color: "#34c47b" },
  { id: "Skrill", icon: Wallet, desc: "Send to a Skrill wallet", color: "#a78fcc" },
  { id: "Mobile Wallet", icon: Smartphone, desc: "Venmo, Zelle, Cash App, Revolut…", color: "#1ca65f" },
];

export default function InternationalPage() {
  const { data: accounts } = useAccounts();
  const transfer = useExternalTransfer();

  const [method, setMethod] = useState<string | null>(null);
  const [fromId, setFromId] = useState("");
  const [currency, setCurrency] = useState("GBP");
  const [recipient, setRecipient] = useState("");
  const [detail, setDetail] = useState(""); // account/wallet/email
  const [amount, setAmount] = useState("");
  const [pin, setPin] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);

  const source = accounts?.find((a) => a.id === (fromId || accounts[0]?.id));
  const amt = Number(amount) || 0;
  const fx = FX_FALLBACK.find((r) => r.code === currency);
  const usd = fx ? amt * fx.rate : amt;

  function review() {
    if (!source) return toast.error("No source account");
    if (!recipient || !detail) return toast.error("Enter recipient details");
    if (amt <= 0) return toast.error("Enter a valid amount");
    if (usd > source.balance) return toast.error("Insufficient balance");
    if (!pin || pin.length < 4) return toast.error("Enter your transaction PIN");
    setConfirmOpen(true);
  }

  async function execute() {
    if (!source) return;
    try {
      const res = await transfer.mutateAsync({
        fromAccountId: source.id,
        recipientName: recipient,
        recipientAccount: detail,
        amount: amt,
        scope: "international",
        currency,
        description: `${method} — ${recipient}`,
      });
      setConfirmOpen(false);
      setSuccess(res.reference);
    } catch (e) {
      setConfirmOpen(false);
      toast.error("Transfer failed", e instanceof FetchError ? e.message : "Please try again.");
    }
  }

  if (success) {
    return (
      <div className="mx-auto max-w-md py-10 text-center fade-up">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-positive/10 text-positive">
          <CheckCircle2 size={32} />
        </div>
        <h2 className="font-display text-2xl font-bold text-ink-primary">Transfer initiated</h2>
        <p className="mt-2 text-sm text-ink-muted">
          {amt} {currency} via {method} to {recipient}. Funds reflect within 72 hours.
        </p>
        <div className="mt-4 rounded-xl border border-line bg-navy-card p-4 text-sm">
          <span className="text-ink-muted">Reference: </span>
          <span className="font-mono text-brand">{success}</span>
        </div>
        <div className="mt-6 flex justify-center gap-3">
          <Button variant="outline" onClick={() => { setSuccess(null); setMethod(null); setAmount(""); setPin(""); }}>
            New Transfer
          </Button>
          <a href="/transactions"><Button>View Transactions <ArrowRight size={15} /></Button></a>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="International Transfer" subtitle="Send money worldwide with multiple payment methods" />

      {!method ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {METHODS.map((m) => (
            <button
              key={m.id}
              onClick={() => setMethod(m.id)}
              className="rounded-2xl border border-line bg-navy-card p-5 text-left transition hover:border-brand/40 hover:bg-navy-card/80"
            >
              <span className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl" style={{ backgroundColor: `${m.color}1a`, color: m.color }}>
                <m.icon size={18} />
              </span>
              <div className="font-medium text-ink-primary">{m.id}</div>
              <p className="mt-1 text-xs text-ink-muted">{m.desc}</p>
            </button>
          ))}
        </div>
      ) : (
        <Card className="space-y-5">
          <button onClick={() => setMethod(null)} className="flex items-center gap-2 text-sm text-ink-muted transition hover:text-brand">
            <ArrowLeft size={15} /> Change method
          </button>
          <div className="flex items-center gap-3 border-b border-line pb-4">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand/10 text-brand"><Globe size={18} /></span>
            <div>
              <div className="font-display text-lg font-semibold text-ink-primary">{method}</div>
              <div className="text-xs text-ink-muted">Funds reflect within 72 hours</div>
            </div>
          </div>

          <div>
            <Label>From Account</Label>
            <Select value={fromId} onChange={(e) => setFromId(e.target.value)}>
              {(accounts ?? []).map((a) => (
                <option key={a.id} value={a.id}>{a.name} · {formatCurrency(a.balance)}</option>
              ))}
            </Select>
          </div>

          <div className="grid gap-4 sm:grid-cols-[1fr_140px]">
            <div>
              <Label>Amount ({currency})</Label>
              <Input type="number" placeholder="0.00" value={amount} onChange={(e) => setAmount(e.target.value)} />
            </div>
            <div>
              <Label>Currency</Label>
              <Select value={currency} onChange={(e) => setCurrency(e.target.value)}>
                {FX_FALLBACK.map((r) => <option key={r.code} value={r.code}>{r.code}</option>)}
              </Select>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label>Recipient Name</Label>
              <Input placeholder="Full name" value={recipient} onChange={(e) => setRecipient(e.target.value)} />
            </div>
            <div>
              <Label>{method === "Cryptocurrency" ? "Wallet Address" : method === "PayPal" || method === "Skrill" ? "Email" : "Account / IBAN"}</Label>
              <Input placeholder="Recipient detail" value={detail} onChange={(e) => setDetail(e.target.value)} />
            </div>
          </div>

          <div>
            <Label>Transaction PIN</Label>
            <Input type="password" placeholder="4-digit PIN" maxLength={6} value={pin} onChange={(e) => setPin(e.target.value)} />
          </div>

          {fx && amt > 0 && (
            <div className="rounded-xl border border-line bg-navy-mid p-3 text-sm text-ink-secondary">
              <div className="flex justify-between"><span>FX rate</span><span className="text-ink-primary">1 {currency} = ${fx.rate}</span></div>
              <div className="mt-1 flex justify-between"><span>Debited from account</span><span className="font-display text-brand">{formatCurrency(usd)}</span></div>
            </div>
          )}

          <Button onClick={review} className="w-full"><Globe size={15} /> Review Transfer</Button>
        </Card>
      )}

      <Modal open={confirmOpen} onClose={() => setConfirmOpen(false)} title="Confirm Transfer" subtitle="This cannot be reversed">
        <div className="space-y-2.5 rounded-xl border border-line bg-navy-mid p-4 text-sm">
          {[
            ["Method", method ?? ""],
            ["Amount", `${amt} ${currency}`],
            ["Debited", formatCurrency(usd)],
            ["Recipient", recipient],
          ].map(([k, v]) => (
            <div key={k} className="flex justify-between gap-4">
              <span className="text-ink-muted">{k}</span>
              <span className={cn("text-right", k === "Debited" ? "font-display text-base text-brand" : "text-ink-primary")}>{v}</span>
            </div>
          ))}
        </div>
        <div className="mt-5 flex gap-3">
          <Button variant="outline" onClick={() => setConfirmOpen(false)} className="flex-1">Cancel</Button>
          <Button onClick={execute} loading={transfer.isPending} className="flex-1">Confirm &amp; Send</Button>
        </div>
      </Modal>
    </div>
  );
}
