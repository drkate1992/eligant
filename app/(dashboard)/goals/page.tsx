"use client";

import { useState } from "react";
import { Plus, Trash2, Target, PartyPopper } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Input, Label, Select } from "@/components/ui/Input";
import { Skeleton, EmptyState } from "@/components/shared/States";
import {
  useGoals,
  useCreateGoal,
  useDepositGoal,
  useDeleteGoal,
} from "@/hooks/useGoals";
import { useAccounts } from "@/hooks/useAccounts";
import { formatCurrency, formatDate, cn } from "@/lib/utils";
import { toast } from "@/lib/toast-store";
import { FetchError } from "@/lib/api-client";
import type { GoalDTO } from "@/types";

const EMOJIS = ["🎯", "🏠", "✈️", "🚗", "🎓", "💍", "🏖️", "💻", "🎁", "🌱"];

export default function GoalsPage() {
  const { data: goals, isLoading } = useGoals();
  const { data: accounts } = useAccounts();
  const createGoal = useCreateGoal();
  const deposit = useDepositGoal();
  const removeGoal = useDeleteGoal();

  const [addOpen, setAddOpen] = useState(false);
  const [depositGoalId, setDepositGoalId] = useState<string | null>(null);

  // create form
  const [name, setName] = useState("");
  const [emoji, setEmoji] = useState("🎯");
  const [target, setTarget] = useState("");
  const [date, setDate] = useState("");

  // deposit form
  const [fromId, setFromId] = useState("");
  const [depAmount, setDepAmount] = useState("");

  async function submitGoal() {
    if (!name || !Number(target))
      return toast.error("Enter a name and target amount");
    try {
      await createGoal.mutateAsync({
        name,
        emoji,
        targetAmount: Number(target),
        targetDate: date || undefined,
      });
      toast.success("Goal created", name);
      setAddOpen(false);
      setName("");
      setTarget("");
      setDate("");
      setEmoji("🎯");
    } catch (e) {
      toast.error("Could not create goal", e instanceof FetchError ? e.message : "");
    }
  }

  async function submitDeposit() {
    const acct = fromId || accounts?.[0]?.id;
    if (!acct || !Number(depAmount))
      return toast.error("Choose an account and amount");
    try {
      const updated = await deposit.mutateAsync({
        id: depositGoalId!,
        fromAccountId: acct,
        amount: Number(depAmount),
      });
      toast.success(
        updated.progress >= 100 ? "🎉 Goal reached!" : "Funds added",
        `${formatCurrency(Number(depAmount))} added`,
      );
      setDepositGoalId(null);
      setDepAmount("");
    } catch (e) {
      toast.error("Deposit failed", e instanceof FetchError ? e.message : "");
    }
  }

  return (
    <div>
      <PageHeader
        title="Goals & Savings"
        subtitle="Track progress toward what matters"
        action={
          <Button onClick={() => setAddOpen(true)}>
            <Plus size={15} /> Add Goal
          </Button>
        }
      />

      {isLoading ? (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-52 w-full" />
          ))}
        </div>
      ) : (goals ?? []).length === 0 ? (
        <Card>
          <EmptyState
            icon={<Target size={20} />}
            title="No savings goals yet"
            description="Create your first goal to start saving."
            action={
              <Button onClick={() => setAddOpen(true)}>
                <Plus size={15} /> Add Goal
              </Button>
            }
          />
        </Card>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {goals?.map((g) => (
            <GoalCard
              key={g.id}
              goal={g}
              onDeposit={() => setDepositGoalId(g.id)}
              onDelete={async () => {
                await removeGoal.mutateAsync(g.id);
                toast.success("Goal closed", `${g.name} — funds refunded`);
              }}
            />
          ))}
        </div>
      )}

      {/* Add goal modal */}
      <Modal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        title="New Savings Goal"
        subtitle="Set a target and start saving"
      >
        <div className="space-y-4">
          <div>
            <Label>Choose an icon</Label>
            <div className="flex flex-wrap gap-2">
              {EMOJIS.map((e) => (
                <button
                  key={e}
                  onClick={() => setEmoji(e)}
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-xl border text-lg transition",
                    emoji === e
                      ? "border-brand bg-brand/10"
                      : "border-line bg-navy-mid hover:border-brand/40",
                  )}
                >
                  {e}
                </button>
              ))}
            </div>
          </div>
          <div>
            <Label>Goal Name</Label>
            <Input
              placeholder="e.g. House Down Payment"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Target Amount</Label>
              <Input
                type="number"
                placeholder="10000"
                value={target}
                onChange={(e) => setTarget(e.target.value)}
              />
            </div>
            <div>
              <Label>Target Date</Label>
              <input
                type="date"
                className="ufg-input"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
          </div>
          <Button onClick={submitGoal} loading={createGoal.isPending} className="w-full">
            Create Goal
          </Button>
        </div>
      </Modal>

      {/* Deposit modal */}
      <Modal
        open={!!depositGoalId}
        onClose={() => setDepositGoalId(null)}
        title="Add Funds"
        subtitle="Move money from an account into this goal"
      >
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
          <div>
            <Label>Amount</Label>
            <Input
              type="number"
              placeholder="0.00"
              value={depAmount}
              onChange={(e) => setDepAmount(e.target.value)}
            />
          </div>
          <Button onClick={submitDeposit} loading={deposit.isPending} className="w-full">
            Add Funds
          </Button>
        </div>
      </Modal>
    </div>
  );
}

function GoalCard({
  goal,
  onDeposit,
  onDelete,
}: {
  goal: GoalDTO;
  onDeposit: () => void;
  onDelete: () => void;
}) {
  const complete = goal.progress >= 100;
  return (
    <Card className="flex flex-col">
      <div className="mb-3 flex items-start justify-between">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-navy-mid text-xl">
            {goal.emoji}
          </span>
          <div>
            <div className="font-medium text-ink-primary">{goal.name}</div>
            <div className="text-[11px] text-ink-muted">
              {goal.targetDate ? `Target ${formatDate(goal.targetDate)}` : "No deadline"}
            </div>
          </div>
        </div>
        <button onClick={onDelete} className="text-ink-muted hover:text-negative">
          <Trash2 size={15} />
        </button>
      </div>

      <div className="mb-1 flex items-end justify-between">
        <span className="font-display text-2xl font-bold text-brand">
          {formatCurrency(goal.savedAmount, "USD")}
        </span>
        <span className="text-xs text-ink-muted">
          of {formatCurrency(goal.targetAmount, "USD", { maximumFractionDigits: 0 })}
        </span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-navy-mid">
        <div
          className={cn(
            "h-full rounded-full transition-all duration-700",
            complete
              ? "bg-gradient-to-r from-positive to-brand"
              : "bg-gradient-to-r from-brand to-brand-dim",
          )}
          style={{ width: `${goal.progress}%` }}
        />
      </div>
      <div className="mt-1 flex items-center justify-between text-[11px] text-ink-muted">
        <span>{goal.progress.toFixed(0)}% complete</span>
        {complete && (
          <span className="flex items-center gap-1 text-brand">
            <PartyPopper size={12} /> Reached!
          </span>
        )}
      </div>

      <Button variant="outline" onClick={onDeposit} className="mt-4">
        <Plus size={14} /> Add Funds
      </Button>
    </Card>
  );
}
