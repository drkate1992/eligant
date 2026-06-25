export interface AccountDTO {
  id: string;
  type: string;
  name: string;
  accountNumber: string;
  sortCode: string;
  balance: number;
  currency: string;
  isDefault: boolean;
  isFrozen: boolean;
  createdAt: string;
}

export interface AccountSummary {
  totalBalance: number;
  accountCount: number;
  monthIn: number;
  monthOut: number;
  savingsRate: number;
  portfolioReturn: number;
  monthChangeAmount: number;
  monthChangePct: number;
}

export interface TransactionDTO {
  id: string;
  bankAccountId: string;
  accountName?: string;
  type: string;
  category: string;
  amount: number;
  currency: string;
  description: string;
  reference: string;
  status: string;
  createdAt: string;
  processedAt: string | null;
}

export interface TxnPage {
  data: TransactionDTO[];
  nextCursor: string | null;
  total: number;
}

export interface TxnStats {
  credited: number;
  debited: number;
  count: number;
  net: number;
}

export interface MonthlyPoint {
  month: string;
  credit: number;
  debit: number;
}

export interface CategorySlice {
  category: string;
  label: string;
  color: string;
  amount: number;
  pct: number;
}

export interface BeneficiaryDTO {
  id: string;
  name: string;
  accountNumber: string;
  bankName: string | null;
  bankCode: string | null;
  country: string;
  isFavorite: boolean;
}

export interface GoalDTO {
  id: string;
  name: string;
  emoji: string;
  targetAmount: number;
  savedAmount: number;
  targetDate: string | null;
  isActive: boolean;
  progress: number;
}

export interface NotificationDTO {
  id: string;
  title: string;
  body: string;
  type: string;
  isRead: boolean;
  createdAt: string;
}

export interface FxRate {
  code: string;
  name: string;
  flag: string;
  rate: number;
  change: number;
}
