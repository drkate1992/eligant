"use client";

import { useMemo, useState } from "react";
import { Search, Download, Filter } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card } from "@/components/ui/Card";
import { StatusBadge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Input";
import { Skeleton, EmptyState } from "@/components/shared/States";
import { TxnIcon } from "@/components/transactions/TxnRow";
import { TxnDetailPanel } from "@/components/transactions/TxnDetailPanel";
import { ExportModal } from "@/components/transactions/ExportModal";
import { useTransactions } from "@/hooks/useTransactions";
import { useAccounts } from "@/hooks/useAccounts";
import { useDebounce } from "@/hooks/useDebounce";
import { formatCurrency, formatDate, cn } from "@/lib/utils";
import type { TransactionDTO } from "@/types";

const TYPE_CHIPS = [
  { label: "All", value: "ALL" },
  { label: "Credits", value: "CREDIT" },
  { label: "Debits", value: "DEBIT" },
];

export default function TransactionsPage() {
  const [search, setSearch] = useState("");
  const [type, setType] = useState("ALL");
  const [accountId, setAccountId] = useState("");
  const [selected, setSelected] = useState<TransactionDTO | null>(null);
  const [exportOpen, setExportOpen] = useState(false);

  const debouncedSearch = useDebounce(search, 300);
  const { data: accounts } = useAccounts();

  const filters = useMemo(
    () => ({ search: debouncedSearch, type, accountId, limit: 12 }),
    [debouncedSearch, type, accountId],
  );

  const {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useTransactions(filters);

  const rows = data?.pages.flatMap((p) => p.data) ?? [];
  const total = data?.pages[0]?.total ?? 0;

  return (
    <div>
      <PageHeader
        title="Transactions"
        subtitle={`${total} total transactions`}
        action={
          <Button variant="outline" onClick={() => setExportOpen(true)}>
            <Download size={15} /> Export
          </Button>
        }
      />

      <div className="grid gap-5 xl:grid-cols-[1fr_360px]">
        <Card className="p-0">
          {/* Filter bar */}
          <div className="flex flex-wrap items-center gap-3 border-b border-line p-4">
            <div className="relative min-w-[200px] flex-1">
              <Search
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-muted"
              />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search transactions…"
                className="ufg-input pl-10"
              />
            </div>
            <div className="flex gap-1 rounded-lg bg-navy-mid p-1">
              {TYPE_CHIPS.map((c) => (
                <button
                  key={c.value}
                  onClick={() => setType(c.value)}
                  className={cn(
                    "rounded-md px-3 py-1.5 text-xs transition",
                    type === c.value
                      ? "border border-line bg-navy-card text-brand"
                      : "text-ink-muted hover:text-ink-secondary",
                  )}
                >
                  {c.label}
                </button>
              ))}
            </div>
            <Select
              value={accountId}
              onChange={(e) => setAccountId(e.target.value)}
              className="w-auto min-w-[150px]"
            >
              <option value="">All accounts</option>
              {(accounts ?? []).map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name}
                </option>
              ))}
            </Select>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            {isLoading ? (
              <div className="space-y-2 p-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <Skeleton key={i} className="h-14 w-full" />
                ))}
              </div>
            ) : rows.length === 0 ? (
              <EmptyState
                icon={<Filter size={20} />}
                title="No transactions found"
                description="Try adjusting your filters."
              />
            ) : (
              <table className="w-full min-w-[640px]">
                <thead>
                  <tr className="border-b border-line text-left text-[11px] uppercase tracking-wider text-ink-muted">
                    <th className="px-4 py-3 font-medium">Transaction</th>
                    <th className="px-4 py-3 font-medium">Date</th>
                    <th className="px-4 py-3 font-medium">Account</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 text-right font-medium">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((t) => (
                    <tr
                      key={t.id}
                      onClick={() => setSelected(t)}
                      className={cn(
                        "cursor-pointer border-b border-line/60 transition hover:bg-white/[0.02]",
                        selected?.id === t.id && "bg-brand/[0.05]",
                      )}
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <TxnIcon txn={t} size={34} />
                          <span className="text-[13px] font-medium text-ink-primary">
                            {t.description}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-xs text-ink-muted">
                        {formatDate(t.createdAt)}
                      </td>
                      <td className="px-4 py-3 text-xs text-ink-secondary">
                        {t.accountName ?? "—"}
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={t.status} />
                      </td>
                      <td
                        className={cn(
                          "px-4 py-3 text-right font-display text-[15px] font-bold tnum",
                          t.type === "CREDIT"
                            ? "text-positive"
                            : "text-ink-primary",
                        )}
                      >
                        {t.type === "CREDIT" ? "+" : "-"}
                        {formatCurrency(t.amount)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {hasNextPage && (
            <div className="border-t border-line p-4 text-center">
              <Button
                variant="outline"
                onClick={() => fetchNextPage()}
                loading={isFetchingNextPage}
              >
                Load more
              </Button>
            </div>
          )}
        </Card>

        <div className="xl:sticky xl:top-24 xl:self-start">
          <TxnDetailPanel txn={selected} onClose={() => setSelected(null)} />
        </div>
      </div>

      <ExportModal open={exportOpen} onClose={() => setExportOpen(false)} />
    </div>
  );
}
