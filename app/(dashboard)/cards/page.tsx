"use client";

import { Snowflake, Sun, CreditCard, SlidersHorizontal } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/shared/States";
import { VirtualCard } from "@/components/dashboard/VirtualCard";
import { useAccounts, useToggleFreeze } from "@/hooks/useAccounts";
import { useSession } from "next-auth/react";
import { toast } from "@/lib/toast-store";
import { CRYPTO_ACCOUNT_TYPES } from "@/lib/constants";

export default function CardsPage() {
  const { data: session } = useSession();
  const { data: allAccounts, isLoading } = useAccounts();
  const toggle = useToggleFreeze();
  const holder = session?.user?.name ?? "Member";
  // Crypto accounts hold digital assets — they don't issue debit cards.
  const accounts = allAccounts?.filter(
    (a) => !(CRYPTO_ACCOUNT_TYPES as readonly string[]).includes(a.type),
  );

  return (
    <div>
      <PageHeader title="Cards" subtitle="Manage your virtual debit cards" />

      {isLoading ? (
        <div className="grid gap-6 lg:grid-cols-2">
          {Array.from({ length: 2 }).map((_, i) => (
            <Skeleton key={i} className="h-52 w-full" />
          ))}
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          {accounts?.map((a) => (
            <Card key={a.id} className="space-y-4">
              <VirtualCard account={a} holder={holder} />
              <div className="grid grid-cols-2 gap-2.5">
                <Button
                  variant={a.isFrozen ? "primary" : "outline"}
                  onClick={async () => {
                    await toggle.mutateAsync(a.id);
                    toast.success(
                      a.isFrozen ? "Card unfrozen" : "Card frozen",
                      a.name,
                    );
                  }}
                >
                  {a.isFrozen ? <Sun size={15} /> : <Snowflake size={15} />}
                  {a.isFrozen ? "Unfreeze" : "Freeze"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() =>
                    toast.info("Physical card", "Request submitted — ships in 5–7 days.")
                  }
                >
                  <CreditCard size={15} /> Request Physical
                </Button>
                <Button
                  variant="outline"
                  onClick={() => toast.info("Limits", "Spending limits coming soon.")}
                >
                  <SlidersHorizontal size={15} /> Limits
                </Button>
                <Button
                  variant="outline"
                  onClick={() => toast.info("Card details", `Linked to ${a.name}.`)}
                >
                  Details
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
