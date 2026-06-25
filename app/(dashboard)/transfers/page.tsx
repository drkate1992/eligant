"use client";

import { useState } from "react";
import { Send, ArrowRight, Star, Trash2, Plus, CheckCircle2 } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Label, Select } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { EmptyState } from "@/components/shared/States";
import { AddBeneficiaryModal } from "@/components/transfer/AddBeneficiaryModal";
import { useAccounts } from "@/hooks/useAccounts";
import {
  useBeneficiaries,
  useInternalTransfer,
  useExternalTransfer,
  useDeleteBeneficiary,
  useToggleFavoriteBeneficiary,
} from "@/hooks/useTransfer";
import { toast } from "@/lib/toast-store";
import { FetchError } from "@/lib/api-client";
import { FX_FALLBACK } from "@/lib/constants";
import { formatCurrency, initialsFromName, cn } from "@/lib/utils";

type Tab = "internal" | "domestic" | "international";
const TABS: { id: Tab; label: string }[] = [
  { id: "internal", label: "Internal" },
  { id: "domestic", label: "Domestic" },
  { id: "international", label: "International" },
];

export default function TransfersPage() {
  const [tab, setTab] = useState<Tab>("internal");
  const { data: accounts } = useAccounts();
  const { data: beneficiaries } = useBeneficiaries();
  const internal = useInternalTransfer();
  const external = useExternalTransfer();
  const delBenef = useDeleteBeneficiary();
  const favBenef = useToggleFavoriteBeneficiary();

  const [fromId, setFromId] = useState("");
  const [toId, setToId] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [recipientAccount, setRecipientAccount] = useState("");
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("GBP");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);

  const source = accounts?.find((a) => a.id === (fromId || accounts[0]?.id));
  const amt = Number(amount) || 0;
  const fx = FX_FALLBACK.find((r) => r.code === currency);
  const usdEquivalent = tab === "international" && fx ? amt * fx.rate : amt;

  function openConfirm() {
    if (!source) return toast.error("No source account");
    if (amt <= 0) return toast.error("Enter a valid amount");
    if (tab === "internal") {
      if (!toId || toId === source.id)
        return toast.error("Choose a different destination account");
    } else {
      if (!recipientName || !recipientAccount)
        return toast.error("Enter recipient details");
    }
    if (usdEquivalent > source.balance)
      return toast.error("Insufficient balance");
    setConfirmOpen(true);
  }

  async function execute() {
    if (!source) return;
    try {
      let reference = "";
      if (tab === "internal") {
        const res = await internal.mutateAsync({
          fromAccountId: source.id,
          toAccountId: toId,
          amount: amt,
        });
        reference = res.reference;
      } else {
        const res = await external.mutateAsync({
          fromAccountId: source.id,
          recipientName,
          recipientAccount,
          amount: amt,
          scope: tab,
          currency: tab === "international" ? currency : "USD",
        });
        reference = res.reference;
      }
      setConfirmOpen(false);
      setSuccess(reference);
      setAmount("");
      setRecipientName("");
      setRecipientAccount("");
    } catch (e) {
      setConfirmOpen(false);
      toast.error(
        "Transfer failed",
        e instanceof FetchError ? e.message : "Please try again.",
      );
    }
  }

  const pending = internal.isPending || external.isPending;

  if (success) {
    return (
      <div className="mx-auto max-w-md py-10 text-center fade-up">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-brand/10 text-brand">
          <CheckCircle2 size={32} />
        </div>
        <h2 className="font-display text-2xl font-semibold text-ink-primary">
          Transfer successful
        </h2>
        <p className="mt-2 text-sm text-ink-muted">
          Your transfer has been processed.
        </p>
        <div className="mt-4 rounded-xl border border-line bg-navy-card p-4 text-sm">
          <span className="text-ink-muted">Reference: </span>
          <span className="font-mono text-brand">{success}</span>
        </div>
        <div className="mt-6 flex justify-center gap-3">
          <Button variant="outline" onClick={() => setSuccess(null)}>
            New Transfer
          </Button>
          <a href="/transactions">
            <Button>
              View Transaction <ArrowRight size={15} />
            </Button>
          </a>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="Transfers" subtitle="Move money securely" />

      <div className="grid gap-5 lg:grid-cols-[1fr_360px]">
        <Card>
          <div className="mb-6 flex gap-1 rounded-xl bg-navy-mid p-1">
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={cn(
                  "flex-1 rounded-lg py-2.5 text-sm transition",
                  tab === t.id
                    ? "border border-line bg-navy-card text-brand"
                    : "text-ink-muted hover:text-ink-secondary",
                )}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            <div>
              <Label>From Account</Label>
              <Select value={fromId} onChange={(e) => setFromId(e.target.value)}>
                {(accounts ?? []).map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name} · {formatCurrency(a.balance)}
                  </option>
                ))}
              </Select>
            </div>

            {tab === "internal" ? (
              <div>
                <Label>To Account</Label>
                <Select value={toId} onChange={(e) => setToId(e.target.value)}>
                  <option value="">Select destination</option>
                  {(accounts ?? [])
                    .filter((a) => a.id !== source?.id)
                    .map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.name} · {formatCurrency(a.balance)}
                      </option>
                    ))}
                </Select>
              </div>
            ) : (
              <>
                <div>
                  <Label>Recipient Name</Label>
                  <input
                    className="ufg-input"
                    placeholder="Recipient full name"
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                  />
                </div>
                <div>
                  <Label>Recipient Account</Label>
                  <input
                    className="ufg-input"
                    placeholder="Account number / IBAN"
                    value={recipientAccount}
                    onChange={(e) => setRecipientAccount(e.target.value)}
                  />
                </div>
              </>
            )}

            <div className="grid gap-3 sm:grid-cols-[1fr_140px]">
              <div>
                <Label>Amount {tab === "international" ? `(${currency})` : "(USD)"}</Label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-display text-base font-semibold text-brand">
                    {tab === "international" ? "" : "$"}
                  </span>
                  <input
                    type="number"
                    className={cn("ufg-input", tab !== "international" && "pl-8")}
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                </div>
              </div>
              {tab === "international" && (
                <div>
                  <Label>Currency</Label>
                  <Select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                  >
                    {FX_FALLBACK.map((r) => (
                      <option key={r.code} value={r.code}>
                        {r.code}
                      </option>
                    ))}
                  </Select>
                </div>
              )}
            </div>

            {tab === "international" && fx && amt > 0 && (
              <div className="rounded-xl border border-line bg-navy-mid p-3 text-sm text-ink-secondary">
                <div className="flex justify-between">
                  <span>FX rate</span>
                  <span className="text-ink-primary">
                    1 {currency} = ${fx.rate}
                  </span>
                </div>
                <div className="mt-1 flex justify-between">
                  <span>Debited from account</span>
                  <span className="font-display text-brand">
                    {formatCurrency(usdEquivalent)}
                  </span>
                </div>
              </div>
            )}

            <Button onClick={openConfirm} className="w-full">
              <Send size={15} /> Review Transfer
            </Button>
          </div>
        </Card>

        {/* Beneficiaries */}
        <Card>
          <CardHeader
            title="Beneficiaries"
            subtitle="Saved recipients"
            action={
              <button
                onClick={() => setAddOpen(true)}
                className="ufg-link"
              >
                <Plus size={13} /> Add
              </button>
            }
          />
          {(beneficiaries ?? []).length === 0 ? (
            <EmptyState
              title="No beneficiaries"
              description="Add a recipient to send money faster."
            />
          ) : (
            <div className="flex flex-col gap-2">
              {beneficiaries?.map((b) => (
                <div
                  key={b.id}
                  className="flex items-center gap-3 rounded-xl border border-line bg-navy-mid p-3"
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-gradient-to-br from-[#1e3a5f] to-[#2a4d7a] text-xs font-semibold text-brand-light">
                    {initialsFromName(b.name)}
                  </span>
                  <button
                    onClick={() => {
                      setTab("domestic");
                      setRecipientName(b.name);
                      setRecipientAccount(b.accountNumber);
                    }}
                    className="min-w-0 flex-1 text-left"
                  >
                    <div className="truncate text-[13px] font-medium text-ink-primary">
                      {b.name}
                    </div>
                    <div className="text-[11px] text-ink-muted">
                      {b.bankName ?? b.accountNumber}
                    </div>
                  </button>
                  <button
                    onClick={() => favBenef.mutate(b.id)}
                    className={cn(
                      "transition",
                      b.isFavorite ? "text-brand" : "text-ink-muted hover:text-brand",
                    )}
                  >
                    <Star size={15} fill={b.isFavorite ? "currentColor" : "none"} />
                  </button>
                  <button
                    onClick={() => {
                      delBenef.mutate(b.id);
                      toast.success("Beneficiary removed", b.name);
                    }}
                    className="text-ink-muted transition hover:text-negative"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* Confirmation modal */}
      <Modal
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        title="Confirm Transfer"
        subtitle="Please review the details below"
      >
        <div className="space-y-3 rounded-xl border border-line bg-navy-mid p-4 text-sm">
          <Row label="From" value={source?.name ?? ""} />
          <Row
            label="To"
            value={
              tab === "internal"
                ? accounts?.find((a) => a.id === toId)?.name ?? ""
                : recipientName
            }
          />
          <Row label="Type" value={TABS.find((t) => t.id === tab)?.label ?? ""} />
          <Row
            label="Amount"
            value={
              tab === "international"
                ? `${amt} ${currency}`
                : formatCurrency(amt)
            }
            highlight
          />
          {tab === "international" && (
            <Row label="Debited" value={formatCurrency(usdEquivalent)} />
          )}
        </div>
        <div className="mt-5 flex gap-3">
          <Button
            variant="outline"
            onClick={() => setConfirmOpen(false)}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button onClick={execute} loading={pending} className="flex-1">
            Confirm &amp; Send
          </Button>
        </div>
      </Modal>

      <AddBeneficiaryModal open={addOpen} onClose={() => setAddOpen(false)} />
    </div>
  );
}

function Row({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-ink-muted">{label}</span>
      <span
        className={cn(
          "text-right",
          highlight ? "font-display text-base text-brand" : "text-ink-primary",
        )}
      >
        {value}
      </span>
    </div>
  );
}
