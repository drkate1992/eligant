import {
  ArrowDownLeft,
  ArrowUpRight,
  CreditCard,
  Home,
  TrendingUp,
  Receipt,
  Banknote,
  RotateCcw,
  type LucideIcon,
} from "lucide-react";
import { formatCurrency, formatDate, cn } from "@/lib/utils";
import type { TransactionDTO } from "@/types";

const CATEGORY_ICON: Record<string, LucideIcon> = {
  SALARY: Banknote,
  TRANSFER: ArrowUpRight,
  PAYMENT: CreditCard,
  INVESTMENT: TrendingUp,
  REFUND: ArrowDownLeft,
  FEE: Receipt,
  OTHER: Home,
};

/** A reversed transaction — flagged in red across the UI. */
export function isReversal(txn: TransactionDTO) {
  return txn.status === "REVERSED" || txn.description.startsWith("Reversal ");
}

export function TxnIcon({ txn, size = 40 }: { txn: TransactionDTO; size?: number }) {
  const reversal = isReversal(txn);
  const credit = txn.type === "CREDIT";
  const Icon = reversal
    ? RotateCcw
    : credit
      ? ArrowDownLeft
      : CATEGORY_ICON[txn.category] ?? CreditCard;
  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center rounded-xl",
        reversal
          ? "bg-negative/10 text-negative"
          : credit
            ? "bg-positive/10 text-positive"
            : "bg-white/[0.05] text-ink-secondary",
      )}
      style={{ width: size, height: size }}
    >
      <Icon size={size * 0.4} />
    </div>
  );
}

export function TxnRow({
  txn,
  onClick,
  selected,
}: {
  txn: TransactionDTO;
  onClick?: () => void;
  selected?: boolean;
}) {
  const credit = txn.type === "CREDIT";
  const reversal = isReversal(txn);
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-3.5 rounded-[10px] px-3.5 py-3 text-left transition",
        selected ? "bg-brand/[0.06]" : "hover:bg-white/[0.03]",
      )}
    >
      <TxnIcon txn={txn} />
      <div className="min-w-0 flex-1">
        <div className="truncate text-[13px] font-medium text-ink-primary">
          {txn.description}
        </div>
        <div className="text-[11px] text-ink-muted">
          {formatDate(txn.createdAt, true)}
        </div>
      </div>
      <div className="text-right">
        <div
          className={cn(
            "font-display text-base font-bold tnum",
            reversal ? "text-negative" : credit ? "text-positive" : "text-ink-primary",
          )}
        >
          {credit ? "+" : "-"}
          {formatCurrency(txn.amount)}
        </div>
        <div
          className={cn(
            "text-[10px] capitalize",
            reversal ? "font-medium text-negative" : "text-ink-muted",
          )}
        >
          {reversal ? "Reversed" : txn.status.toLowerCase()}
        </div>
      </div>
    </button>
  );
}
