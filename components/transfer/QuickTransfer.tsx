"use client";

import { useState } from "react";
import { Send, Plus, Loader2 } from "lucide-react";
import { Card, CardHeader } from "@/components/ui/Card";
import { Label, Select } from "@/components/ui/Input";
import { useAccounts } from "@/hooks/useAccounts";
import {
  useBeneficiaries,
  useExternalTransfer,
} from "@/hooks/useTransfer";
import { toast } from "@/lib/toast-store";
import { FetchError } from "@/lib/api-client";
import { initialsFromName, formatCurrency, cn } from "@/lib/utils";
import { AddBeneficiaryModal } from "./AddBeneficiaryModal";

export function QuickTransfer() {
  const { data: accounts } = useAccounts();
  const { data: beneficiaries } = useBeneficiaries();
  const transfer = useExternalTransfer();

  const [fromId, setFromId] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [recipientAccount, setRecipientAccount] = useState("");
  const [amount, setAmount] = useState("");
  const [addOpen, setAddOpen] = useState(false);

  const source = accounts?.find((a) => a.id === (fromId || accounts[0]?.id));

  async function submit() {
    if (!source) return toast.error("No account", "Add an account first.");
    if (!recipientName || !recipientAccount)
      return toast.error("Missing recipient", "Select or enter a recipient.");
    const amt = Number(amount);
    if (!amt || amt <= 0) return toast.error("Invalid amount");
    if (amt > source.balance)
      return toast.error("Insufficient balance");

    try {
      const res = await transfer.mutateAsync({
        fromAccountId: source.id,
        recipientName,
        recipientAccount,
        amount: amt,
        scope: "domestic",
        currency: "USD",
      });
      toast.success("Transfer sent", `Reference ${res.reference}`);
      setAmount("");
      setRecipientName("");
      setRecipientAccount("");
    } catch (e) {
      toast.error(
        "Transfer failed",
        e instanceof FetchError ? e.message : "Please try again.",
      );
    }
  }

  return (
    <Card>
      <CardHeader title="Quick Transfer" subtitle="Send to saved beneficiaries" />

      <div className="mb-4 flex gap-2.5 overflow-x-auto pb-1">
        {(beneficiaries ?? []).slice(0, 5).map((b) => {
          const active = recipientAccount === b.accountNumber;
          return (
            <button
              key={b.id}
              onClick={() => {
                setRecipientName(b.name);
                setRecipientAccount(b.accountNumber);
              }}
              className="flex shrink-0 flex-col items-center gap-1.5"
            >
              <span
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-xl border-2 bg-gradient-to-br from-[#1e3a5f] to-[#2a4d7a] text-sm font-semibold text-brand-light transition",
                  active ? "border-brand" : "border-transparent",
                )}
              >
                {initialsFromName(b.name)}
              </span>
              <span className="max-w-[52px] truncate text-[10px] text-ink-muted">
                {b.name.split(" ")[0]}
              </span>
            </button>
          );
        })}
        <button
          onClick={() => setAddOpen(true)}
          className="flex shrink-0 flex-col items-center gap-1.5"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-xl border-2 border-dashed border-ink-muted text-ink-muted">
            <Plus size={16} />
          </span>
          <span className="text-[10px] text-ink-muted">Add New</span>
        </button>
      </div>

      <div className="flex flex-col gap-3.5">
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
        <div>
          <Label>Recipient</Label>
          <input
            className="ufg-input"
            placeholder="Account number or name"
            value={recipientName}
            onChange={(e) => setRecipientName(e.target.value)}
          />
        </div>
        <div>
          <Label>Recipient Account</Label>
          <input
            className="ufg-input"
            placeholder="Account number"
            value={recipientAccount}
            onChange={(e) => setRecipientAccount(e.target.value)}
          />
        </div>
        <div>
          <Label>Amount</Label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-display text-base font-semibold text-brand">
              $
            </span>
            <input
              type="number"
              className="ufg-input pl-8"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
        </div>
        <button
          onClick={submit}
          disabled={transfer.isPending}
          className="ufg-btn-primary w-full"
        >
          {transfer.isPending ? (
            <Loader2 size={15} className="animate-spin" />
          ) : (
            <Send size={15} />
          )}
          Send Transfer
        </button>
      </div>

      <AddBeneficiaryModal open={addOpen} onClose={() => setAddOpen(false)} />
    </Card>
  );
}
