"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Card, CardHeader } from "@/components/ui/Card";
import { Skeleton, EmptyState } from "@/components/shared/States";
import { TxnRow } from "@/components/transactions/TxnRow";
import { useRecentTransactions } from "@/hooks/useTransactions";

export function RecentTransactions() {
  const { data, isLoading } = useRecentTransactions(5);

  return (
    <Card>
      <CardHeader
        title="Recent Transactions"
        subtitle="Last 5 activities"
        action={
          <Link href="/transactions" className="ufg-link">
            View All <ArrowRight size={13} />
          </Link>
        }
      />
      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-14 w-full" />
          ))}
        </div>
      ) : !data || data.length === 0 ? (
        <EmptyState title="No transactions yet" description="Your activity will appear here." />
      ) : (
        <div className="flex flex-col gap-1">
          {data.map((t) => (
            <TxnRow key={t.id} txn={t} />
          ))}
        </div>
      )}
    </Card>
  );
}
