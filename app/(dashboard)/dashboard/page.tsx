"use client";

import Link from "next/link";
import { CreditCard, ArrowRight } from "lucide-react";
import { useSession } from "next-auth/react";
import { Card, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import {
  OverviewStats,
  PrimaryAccountCard,
  QuickActionsRow,
  AccountStatistics,
  NeedAssistance,
} from "@/components/dashboard/Overview";
import { QuickTransfer } from "@/components/transfer/QuickTransfer";
import { RecentTransactions } from "@/components/dashboard/RecentTransactions";
import { VirtualCard } from "@/components/dashboard/VirtualCard";
import { Skeleton } from "@/components/shared/States";
import { useAccounts, useAccountSummary } from "@/hooks/useAccounts";
import { useRecentTransactions, useTxnStats } from "@/hooks/useTransactions";

export default function DashboardPage() {
  const { data: session } = useSession();
  const { data: accounts } = useAccounts();
  const { data: summary, isLoading } = useAccountSummary();
  const { data: recent } = useRecentTransactions(50);
  const { data: stats } = useTxnStats();

  const holder = session?.user?.name ?? "Member";
  const primary = accounts?.find((a) => a.isDefault) ?? accounts?.[0];
  const cryptoUsd =
    accounts
      ?.filter((a) => a.type.startsWith("CRYPTO"))
      .reduce((s, a) => s + a.balance, 0) ?? 0;

  const pending = (recent ?? []).filter((t) => t.status === "PENDING");
  const pendingAmount = pending.reduce((s, t) => s + Math.abs(t.amount), 0);
  const volume = (stats?.credited ?? 0) + (stats?.debited ?? 0);

  if (isLoading || !summary || !accounts || !primary) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-28 w-full" />
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6 fade-up">
      {/* Top stat row */}
      <OverviewStats summary={summary} volume={volume} available={primary.balance} />

      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
        {/* ── Left column ── */}
        <div className="space-y-6">
          <PrimaryAccountCard
            account={primary}
            holder={holder}
            totalPortfolio={summary.totalBalance}
            cryptoUsd={cryptoUsd}
          />

          <QuickActionsRow />

          <QuickTransfer />

          {/* Active cards */}
          <Card>
            <CardHeader
              title="Your Active Cards"
              action={
                <Link href="/cards" className="ufg-link">
                  Manage <ArrowRight size={13} />
                </Link>
              }
            />
            <div className="grid gap-4 sm:grid-cols-[320px_1fr] sm:items-center">
              <VirtualCard account={primary} holder={holder} />
              <div className="text-sm text-ink-muted">
                <p>Your EligantWealth virtual card is active and ready for secure online payments.</p>
                <Link href="/cards" className="mt-3 inline-block">
                  <Button variant="outline"><CreditCard size={15} /> Apply for New Card</Button>
                </Link>
              </div>
            </div>
          </Card>
        </div>

        {/* ── Right rail ── */}
        <div className="space-y-6">
          <RecentTransactions />
          <AccountStatistics
            volume={volume}
            pendingCount={pending.length}
            pendingAmount={pendingAmount}
          />
          <NeedAssistance />
        </div>
      </div>
    </div>
  );
}
