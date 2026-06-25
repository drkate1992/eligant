"use client";

import { Download, X } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { StatusBadge } from "@/components/ui/Badge";
import { TxnIcon, isReversal } from "./TxnRow";
import { EmptyState } from "@/components/shared/States";
import { Receipt } from "lucide-react";
import { formatCurrency, formatDate, cn } from "@/lib/utils";
import { toast } from "@/lib/toast-store";
import type { TransactionDTO } from "@/types";

export function TxnDetailPanel({
  txn,
  onClose,
}: {
  txn: TransactionDTO | null;
  onClose: () => void;
}) {
  if (!txn) {
    return (
      <Card className="hidden lg:block">
        <EmptyState
          icon={<Receipt size={20} />}
          title="No transaction selected"
          description="Click a row to see full details."
        />
      </Card>
    );
  }

  const credit = txn.type === "CREDIT";
  const reversal = isReversal(txn);
  const rows: [string, string][] = [
    ["Description", txn.description],
    ["Account", txn.accountName ?? "—"],
    ["Category", txn.category],
    ["Type", txn.type],
    ["Reference", txn.reference],
    ["Date", formatDate(txn.createdAt, true)],
  ];

  return (
    <Card>
      <div className="mb-4 flex items-start justify-between">
        <div className="flex items-center gap-3">
          <TxnIcon txn={txn} size={44} />
          <div>
            <div className="text-sm font-medium text-ink-primary">
              {txn.description}
            </div>
            <StatusBadge status={txn.status} />
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-ink-muted transition hover:text-ink-primary lg:hidden"
        >
          <X size={18} />
        </button>
      </div>

      <div className="mb-5 rounded-xl border border-line bg-navy-mid p-5 text-center">
        <div className="text-[11px] uppercase tracking-wider text-ink-muted">
          Amount
        </div>
        <div
          className={cn(
            "mt-1 font-display text-3xl font-bold tnum",
            reversal ? "text-negative" : credit ? "text-positive" : "text-ink-primary",
          )}
        >
          {credit ? "+" : "-"}
          {formatCurrency(txn.amount, txn.currency)}
        </div>
        {reversal && (
          <div className="mt-1 text-[11px] font-medium uppercase tracking-wider text-negative">
            Reversed — returned to balance
          </div>
        )}
      </div>

      <dl className="space-y-3">
        {rows.map(([k, v]) => (
          <div key={k} className="flex items-start justify-between gap-4 text-sm">
            <dt className="text-ink-muted">{k}</dt>
            <dd className="max-w-[60%] break-words text-right text-ink-primary">
              {v}
            </dd>
          </div>
        ))}
      </dl>

      <button
        onClick={() => toast.success("Receipt downloaded", txn.reference)}
        className="ufg-btn-outline mt-5 w-full"
      >
        <Download size={15} /> Download Receipt
      </button>
    </Card>
  );
}
