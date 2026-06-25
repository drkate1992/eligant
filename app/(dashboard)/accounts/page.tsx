"use client";

import { useState } from "react";
import { Plus, Wallet, Snowflake, Copy } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Input, Label, Select } from "@/components/ui/Input";
import { Skeleton } from "@/components/shared/States";
import { useAccounts, useCreateAccount } from "@/hooks/useAccounts";
import { ACCOUNT_TYPES, ACCOUNT_TYPE_META } from "@/lib/constants";
import { formatCurrency, formatDate, cn } from "@/lib/utils";
import { toast } from "@/lib/toast-store";
import { FetchError } from "@/lib/api-client";

export default function AccountsPage() {
  const { data: accounts, isLoading } = useAccounts();
  const create = useCreateAccount();
  const [open, setOpen] = useState(false);
  const [type, setType] = useState("SAVINGS");
  const [name, setName] = useState("");

  async function submit() {
    if (!name) return toast.error("Enter an account name");
    try {
      await create.mutateAsync({ type, name });
      toast.success("Account opened", name);
      setOpen(false);
      setName("");
    } catch (e) {
      toast.error(
        "Could not open account",
        e instanceof FetchError ? e.message : "Try again.",
      );
    }
  }

  return (
    <div>
      <PageHeader
        title="Accounts"
        subtitle="Manage your bank accounts"
        action={
          <Button onClick={() => setOpen(true)}>
            <Plus size={15} /> Open New Account
          </Button>
        }
      />

      {isLoading ? (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-44 w-full" />
          ))}
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {accounts?.map((a) => {
            const meta = ACCOUNT_TYPE_META[a.type];
            return (
              <Card key={a.id} className="relative overflow-hidden">
                <div
                  className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full opacity-20"
                  style={{ background: meta?.dot ?? "#1ca65f" }}
                />
                <div className="relative">
                  <div className="mb-4 flex items-center justify-between">
                    <span
                      className="flex h-10 w-10 items-center justify-center rounded-xl"
                      style={{
                        backgroundColor: `${meta?.dot ?? "#1ca65f"}1a`,
                        color: meta?.dot ?? "#1ca65f",
                      }}
                    >
                      <Wallet size={18} />
                    </span>
                    <div className="flex items-center gap-2">
                      {a.isDefault && (
                        <span className="rounded-full border border-brand/20 bg-brand/10 px-2 py-0.5 text-[10px] text-brand">
                          Default
                        </span>
                      )}
                      {a.isFrozen && (
                        <Snowflake size={15} className="text-ink-muted" />
                      )}
                    </div>
                  </div>
                  <div className="text-xs text-ink-muted">
                    {meta?.label ?? a.type}
                  </div>
                  <div className="text-base font-medium text-ink-primary">
                    {a.name}
                  </div>
                  <div className="mt-3 font-display text-3xl font-bold text-ink-primary tnum">
                    {formatCurrency(a.balance, a.currency)}
                  </div>
                  <button
                    onClick={() => {
                      navigator.clipboard?.writeText(a.accountNumber);
                      toast.success("Copied", "Account number copied");
                    }}
                    className="mt-3 flex items-center gap-2 text-xs text-ink-muted transition hover:text-brand"
                  >
                    •••• {a.accountNumber.slice(-4)}
                    <Copy size={12} />
                  </button>
                  <div className="mt-1 text-[11px] text-ink-muted">
                    Sort code {a.sortCode ?? "—"} · Opened{" "}
                    {formatDate(a.createdAt)}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Open New Account"
        subtitle="Add a sub-account to your portfolio"
      >
        <div className="space-y-4">
          <div>
            <Label>Account Type</Label>
            <Select value={type} onChange={(e) => setType(e.target.value)}>
              {ACCOUNT_TYPES.map((t) => (
                <option key={t} value={t}>
                  {ACCOUNT_TYPE_META[t].label}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <Label>Account Name</Label>
            <Input
              placeholder="e.g. Holiday Fund"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="flex gap-3 pt-1">
            <Button variant="outline" onClick={() => setOpen(false)} className="flex-1">
              Cancel
            </Button>
            <Button onClick={submit} loading={create.isPending} className="flex-1">
              Open Account
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
