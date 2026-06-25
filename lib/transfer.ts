import { Prisma } from "@prisma/client";
import { prisma } from "./prisma";
import { ApiError } from "./api";
import { toNumber, generateReference } from "./utils";
import { FX_FALLBACK } from "./constants";

export interface InternalTransferInput {
  fromAccountId: string;
  toAccountId: string;
  amount: number;
  description?: string;
}

export async function performInternalTransfer(
  userId: string,
  input: InternalTransferInput,
) {
  if (input.fromAccountId === input.toAccountId) {
    throw new ApiError("Source and destination must differ");
  }

  return prisma.$transaction(async (tx) => {
    const from = await tx.bankAccount.findFirst({
      where: { id: input.fromAccountId, userId },
    });
    const to = await tx.bankAccount.findFirst({
      where: { id: input.toAccountId, userId },
    });
    if (!from || !to) throw new ApiError("Account not found", 404);
    if (from.isFrozen) throw new ApiError("Source account is frozen");
    if (toNumber(from.balance) < input.amount) {
      throw new ApiError("Insufficient balance");
    }

    const amount = new Prisma.Decimal(input.amount);
    await tx.bankAccount.update({
      where: { id: from.id },
      data: { balance: { decrement: amount } },
    });
    await tx.bankAccount.update({
      where: { id: to.id },
      data: { balance: { increment: amount } },
    });

    const desc = input.description || `Transfer to ${to.name}`;
    const now = new Date();
    const debit = await tx.transaction.create({
      data: {
        userId,
        bankAccountId: from.id,
        type: "DEBIT",
        category: "TRANSFER",
        amount,
        currency: from.currency,
        description: desc,
        reference: generateReference(),
        status: "COMPLETED",
        processedAt: now,
      },
    });
    await tx.transaction.create({
      data: {
        userId,
        bankAccountId: to.id,
        type: "CREDIT",
        category: "TRANSFER",
        amount,
        currency: to.currency,
        description: input.description || `Transfer from ${from.name}`,
        reference: generateReference(),
        status: "COMPLETED",
        processedAt: now,
      },
    });

    // The transfer completes successfully, then is automatically reversed —
    // both legs are returned so neither balance changes.
    await tx.bankAccount.update({
      where: { id: from.id },
      data: { balance: { increment: amount } },
    });
    await tx.bankAccount.update({
      where: { id: to.id },
      data: { balance: { decrement: amount } },
    });
    await tx.transaction.create({
      data: {
        userId,
        bankAccountId: from.id,
        type: "CREDIT",
        category: "REFUND",
        amount,
        currency: from.currency,
        description: `Reversal — ${desc}`,
        reference: generateReference(),
        status: "REVERSED",
        processedAt: now,
        metadata: JSON.stringify({ reversalOf: debit.reference, reason: "Transfer reversed" }),
      },
    });
    await tx.transaction.create({
      data: {
        userId,
        bankAccountId: to.id,
        type: "DEBIT",
        category: "REFUND",
        amount,
        currency: to.currency,
        description: `Reversal — ${input.description || `Transfer from ${from.name}`}`,
        reference: generateReference(),
        status: "REVERSED",
        processedAt: now,
        metadata: JSON.stringify({ reversalOf: debit.reference, reason: "Transfer reversed" }),
      },
    });

    return {
      reference: debit.reference,
      fromBalance: toNumber(from.balance),
      toBalance: toNumber(to.balance),
    };
  });
}

export interface ExternalTransferInput {
  fromAccountId: string;
  beneficiaryId?: string;
  recipientName: string;
  recipientAccount: string;
  amount: number;
  description?: string;
  scope: "domestic" | "international";
  currency: string;
}

export async function performExternalTransfer(
  userId: string,
  input: ExternalTransferInput,
) {
  return prisma.$transaction(async (tx) => {
    const from = await tx.bankAccount.findFirst({
      where: { id: input.fromAccountId, userId },
    });
    if (!from) throw new ApiError("Account not found", 404);
    if (from.isFrozen) throw new ApiError("Source account is frozen");

    // For international, convert the entered foreign amount back to USD to debit.
    let usdAmount = input.amount;
    if (input.scope === "international" && input.currency !== "USD") {
      const fx = FX_FALLBACK.find((r) => r.code === input.currency);
      if (fx) usdAmount = input.amount * fx.rate;
    }

    if (toNumber(from.balance) < usdAmount) {
      throw new ApiError("Insufficient balance");
    }

    await tx.bankAccount.update({
      where: { id: from.id },
      data: { balance: { decrement: new Prisma.Decimal(usdAmount) } },
    });

    const label =
      input.scope === "international" ? "International wire" : "Wire transfer";
    const now = new Date();
    const description = input.description || `${label} — ${input.recipientName}`;
    const debit = await tx.transaction.create({
      data: {
        userId,
        bankAccountId: from.id,
        type: "DEBIT",
        category: "TRANSFER",
        amount: new Prisma.Decimal(usdAmount),
        currency: from.currency,
        description,
        reference: generateReference(),
        status: "COMPLETED",
        processedAt: now,
        metadata: JSON.stringify({
          recipientName: input.recipientName,
          recipientAccount: input.recipientAccount,
          scope: input.scope,
          enteredAmount: input.amount,
          enteredCurrency: input.currency,
        }),
      },
    });

    // The transfer completes successfully, then is automatically reversed —
    // funds are returned to the source account, leaving the balance unchanged.
    await reverseDebit(tx, {
      userId,
      account: from,
      amount: new Prisma.Decimal(usdAmount),
      description,
      originalRef: debit.reference,
      when: now,
    });

    return {
      reference: debit.reference,
      fromBalance: toNumber(from.balance),
      debited: usdAmount,
    };
  });
}

/**
 * Reverses a completed debit: returns the funds to the account and records a
 * matching CREDIT "Reversal" transaction. Used so demo transfers always send
 * successfully but never actually deplete the balance.
 */
async function reverseDebit(
  tx: Prisma.TransactionClient,
  args: {
    userId: string;
    account: { id: string; currency: string };
    amount: Prisma.Decimal;
    description: string;
    originalRef: string;
    when: Date;
  },
) {
  await tx.bankAccount.update({
    where: { id: args.account.id },
    data: { balance: { increment: args.amount } },
  });
  await tx.transaction.create({
    data: {
      userId: args.userId,
      bankAccountId: args.account.id,
      type: "CREDIT",
      category: "REFUND",
      amount: args.amount,
      currency: args.account.currency,
      description: `Reversal — ${args.description}`,
      reference: generateReference(),
      status: "REVERSED",
      processedAt: args.when,
      metadata: JSON.stringify({
        reversalOf: args.originalRef,
        reason: "Transfer reversed",
      }),
    },
  });
}
