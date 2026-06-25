import type {
  BankAccount,
  Transaction,
  Beneficiary,
  SavingsGoal,
  Notification,
} from "@prisma/client";
import { toNumber } from "./utils";
import type {
  AccountDTO,
  TransactionDTO,
  BeneficiaryDTO,
  GoalDTO,
  NotificationDTO,
} from "@/types";

export function serializeAccount(a: BankAccount): AccountDTO {
  return {
    id: a.id,
    type: a.type,
    name: a.name,
    accountNumber: a.accountNumber,
    sortCode: a.sortCode,
    balance: toNumber(a.balance),
    currency: a.currency,
    isDefault: a.isDefault,
    isFrozen: a.isFrozen,
    createdAt: a.createdAt.toISOString(),
  };
}

export function serializeTransaction(
  t: Transaction & { bankAccount?: { name: string } | null },
): TransactionDTO {
  return {
    id: t.id,
    bankAccountId: t.bankAccountId,
    accountName: t.bankAccount?.name,
    type: t.type,
    category: t.category,
    amount: toNumber(t.amount),
    currency: t.currency,
    description: t.description,
    reference: t.reference,
    status: t.status,
    createdAt: t.createdAt.toISOString(),
    processedAt: t.processedAt ? t.processedAt.toISOString() : null,
  };
}

export function serializeBeneficiary(b: Beneficiary): BeneficiaryDTO {
  return {
    id: b.id,
    name: b.name,
    accountNumber: b.accountNumber,
    bankName: b.bankName,
    bankCode: b.bankCode,
    country: b.country,
    isFavorite: b.isFavorite,
  };
}

export function serializeGoal(g: SavingsGoal): GoalDTO {
  const target = toNumber(g.targetAmount);
  const saved = toNumber(g.savedAmount);
  return {
    id: g.id,
    name: g.name,
    emoji: g.emoji,
    targetAmount: target,
    savedAmount: saved,
    targetDate: g.targetDate ? g.targetDate.toISOString() : null,
    isActive: g.isActive,
    progress: target > 0 ? Math.min(100, (saved / target) * 100) : 0,
  };
}

export function serializeNotification(n: Notification): NotificationDTO {
  return {
    id: n.id,
    title: n.title,
    body: n.body,
    type: n.type,
    isRead: n.isRead,
    createdAt: n.createdAt.toISOString(),
  };
}
