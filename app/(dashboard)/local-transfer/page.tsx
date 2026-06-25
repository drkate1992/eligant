"use client";

import { useState } from "react";
import { Send, Shield, Zap, Gift, Landmark, CheckCircle2, ArrowRight } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input, Label, Select } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { useAccounts } from "@/hooks/useAccounts";
import { useExternalTransfer } from "@/hooks/useTransfer";
import { toast } from "@/lib/toast-store";
import { FetchError } from "@/lib/api-client";
import { formatCurrency, cn } from "@/lib/utils";

const QUICK = [100, 500, 1000];

export default function LocalTransferPage() {
  const { data: accounts } = useAccounts();
  const transfer = useExternalTransfer();

  const [fromId, setFromId] = useState("");
  const [form, setForm] = useState({
    accountName: "",
    accountNumber: "",
    bankName: "",
    accountType: "Checking",
    routingNumber: "",
    amount: "",
    description: "",
    pin: "",
  });
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);

  const source = accounts?.find((a) => a.id === (fromId || accounts[0]?.id));
  const amt = Number(form.amount) || 0;
  const set = (k: keyof typeof form, v: string) => setForm((f) => ({ ...f, [k]: v }));

  function review() {
    if (!source) return toast.error("No source account");
    if (!form.accountName || !form.accountNumber || !form.bankName)
      return toast.error("Complete the beneficiary details");
    if (amt <= 0) return toast.error("Enter a valid amount");
    if (amt > source.balance) return toast.error("Insufficient balance");
    if (!form.pin || form.pin.length < 4) return toast.error("Enter your 4-digit transaction PIN");
    setConfirmOpen(true);
  }

  async function execute() {
    if (!source) return;
    try {
      const res = await transfer.mutateAsync({
        fromAccountId: source.id,
        recipientName: form.accountName,
        recipientAccount: form.accountNumber,
        amount: amt,
        scope: "domestic",
        currency: "USD",
        description: form.description || `Local transfer to ${form.accountName}`,
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
        <h2 className="font-display text-2xl font-bold text-ink-primary">Transfer successful</h2>
        <p className="mt-2 text-sm text-ink-muted">
          {formatCurrency(amt)} sent to {form.accountName}.
        </p>
        <div className="mt-4 rounded-xl border border-line bg-navy-card p-4 text-sm">
          <span className="text-ink-muted">Reference: </span>
          <span className="font-mono text-brand">{success}</span>
        </div>
        <div className="mt-6 flex justify-center gap-3">
          <Button variant="outline" onClick={() => { setSuccess(null); set("amount", ""); set("pin", ""); }}>
            New Transfer
          </Button>
          <a href="/transactions"><Button>View Transactions <ArrowRight size={15} /></Button></a>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="Local Transfer" subtitle="Send money to any local bank account securely and instantly" />

      <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
        <Card className="space-y-6">
          {/* From account */}
          <div>
            <Label>From Account</Label>
            <Select value={fromId} onChange={(e) => setFromId(e.target.value)}>
              {(accounts ?? []).map((a) => (
                <option key={a.id} value={a.id}>{a.name} · {formatCurrency(a.balance)}</option>
              ))}
            </Select>
          </div>

          {/* Amount */}
          <div>
            <Label>Transfer Amount</Label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-display text-lg font-semibold text-brand">$</span>
              <input
                type="number"
                className="ufg-input pl-8 text-lg font-bold tnum"
                placeholder="0.00"
                value={form.amount}
                onChange={(e) => set("amount", e.target.value)}
              />
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {QUICK.map((q) => (
                <button key={q} onClick={() => set("amount", String(q))} className="rounded-lg border border-line bg-navy-mid px-3 py-1 text-xs text-ink-secondary transition hover:border-brand hover:text-brand">
                  ${q.toLocaleString()}
                </button>
              ))}
              <button onClick={() => source && set("amount", String(source.balance))} className="rounded-lg bg-brand/15 px-3 py-1 text-xs font-medium text-brand">
                Max
              </button>
            </div>
          </div>

          {/* Beneficiary */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label>Account Holder Name</Label>
              <Input placeholder="Full name on account" value={form.accountName} onChange={(e) => set("accountName", e.target.value)} />
            </div>
            <div>
              <Label>Account Number</Label>
              <Input placeholder="Account number" value={form.accountNumber} onChange={(e) => set("accountNumber", e.target.value)} />
            </div>
            <div>
              <Label>Bank Name</Label>
              <Input placeholder="Bank name" value={form.bankName} onChange={(e) => set("bankName", e.target.value)} />
            </div>
            <div>
              <Label>Account Type</Label>
              <Select value={form.accountType} onChange={(e) => set("accountType", e.target.value)}>
                {["Checking", "Savings Account", "Online Banking", "Joint Account"].map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </Select>
            </div>
            <div>
              <Label>Routing Number</Label>
              <Input placeholder="9-digit routing number" maxLength={9} value={form.routingNumber} onChange={(e) => set("routingNumber", e.target.value)} />
            </div>
            <div>
              <Label>Transaction PIN</Label>
              <Input type="password" placeholder="4-digit PIN" maxLength={6} value={form.pin} onChange={(e) => set("pin", e.target.value)} />
            </div>
          </div>

          <div>
            <Label>Description / Memo (optional)</Label>
            <Input placeholder="Purpose of payment" value={form.description} onChange={(e) => set("description", e.target.value)} />
          </div>

          <Button onClick={review} className="w-full"><Send size={15} /> Preview Transfer</Button>
        </Card>

        {/* Side info */}
        <div className="space-y-5">
          <Card className="space-y-4">
            <div className="grid grid-cols-3 gap-3 text-center">
              {[
                { icon: Zap, label: "Time", value: "Instant" },
                { icon: Gift, label: "Fee", value: "Free" },
                { icon: Landmark, label: "Banks", value: "All local" },
              ].map((s) => (
                <div key={s.label} className="rounded-xl border border-line bg-navy-mid p-3">
                  <s.icon size={16} className="mx-auto mb-1 text-brand" />
                  <div className="text-[10px] uppercase tracking-wider text-ink-muted">{s.label}</div>
                  <div className="text-sm font-semibold text-ink-primary">{s.value}</div>
                </div>
              ))}
            </div>
          </Card>
          <Card>
            <div className="flex items-start gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand/10 text-brand">
                <Shield size={18} />
              </span>
              <div>
                <div className="text-sm font-semibold text-ink-primary">Bank-grade security</div>
                <p className="mt-1 text-xs text-ink-muted">
                  Transfers are protected with 256-bit SSL encryption and monitored 24/7 for fraud.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <Modal open={confirmOpen} onClose={() => setConfirmOpen(false)} title="Confirm Transfer" subtitle="Review the details before confirming">
        <div className="space-y-2.5 rounded-xl border border-line bg-navy-mid p-4 text-sm">
          {[
            ["Amount", formatCurrency(amt)],
            ["Recipient", form.accountName],
            ["Account", form.accountNumber],
            ["Bank", form.bankName],
            ["From", source?.name ?? ""],
          ].map(([k, v]) => (
            <div key={k} className="flex justify-between gap-4">
              <span className="text-ink-muted">{k}</span>
              <span className={cn("text-right", k === "Amount" ? "font-display text-base text-brand" : "text-ink-primary")}>{v}</span>
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
