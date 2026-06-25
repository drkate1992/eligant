// Domain constants. Status/enum-like values live here as `as const` tuples so they
// can be shared between Zod validators, the seed script, and UI without a DB enum.

export const ROLES = ["USER", "ADMIN", "SUPPORT"] as const;
export const KYC_STATUSES = ["PENDING", "VERIFIED", "REJECTED"] as const;
export const ACCOUNT_TYPES = [
  "SAVINGS",
  "CHECKING",
  "INVESTMENT",
  "BUSINESS",
  "CRYPTO_SAVINGS",
  "CRYPTO_TRADING",
] as const;

// Account types that hold digital assets (shown on the Crypto page, not Cards).
export const CRYPTO_ACCOUNT_TYPES = ["CRYPTO_SAVINGS", "CRYPTO_TRADING"] as const;
export const TRANSACTION_TYPES = ["CREDIT", "DEBIT"] as const;
export const TRANSACTION_CATEGORIES = [
  "SALARY",
  "TRANSFER",
  "PAYMENT",
  "INVESTMENT",
  "REFUND",
  "FEE",
  "OTHER",
] as const;
export const TRANSACTION_STATUSES = [
  "PENDING",
  "PROCESSING",
  "COMPLETED",
  "FAILED",
  "REVERSED",
] as const;

export type Role = (typeof ROLES)[number];
export type KycStatus = (typeof KYC_STATUSES)[number];
export type AccountType = (typeof ACCOUNT_TYPES)[number];
export type TransactionType = (typeof TRANSACTION_TYPES)[number];
export type TransactionCategory = (typeof TRANSACTION_CATEGORIES)[number];
export type TransactionStatus = (typeof TRANSACTION_STATUSES)[number];

export const ACCOUNT_TYPE_META: Record<string, { label: string; dot: string }> = {
  SAVINGS: { label: "Savings", dot: "#c9a84c" },
  CHECKING: { label: "Checking", dot: "#4caf8a" },
  INVESTMENT: { label: "Investment", dot: "#6a8fc8" },
  BUSINESS: { label: "Business", dot: "#a78fcc" },
  CRYPTO_SAVINGS: { label: "Crypto Savings", dot: "#f7931a" },
  CRYPTO_TRADING: { label: "Crypto Trading", dot: "#8b5cf6" },
};

// Crypto holdings shown on the Crypto page. `account` ties each asset to one of
// the two crypto accounts; values are illustrative for the demo.
export const CRYPTO_SAVINGS_APY = 5.25;

export const CRYPTO_ASSETS = [
  { symbol: "BTC", name: "Bitcoin", amount: 0.16, price: 97400, change: 2.4, color: "#f7931a", account: "trading" },
  { symbol: "ETH", name: "Ethereum", amount: 2.2, price: 3420, change: 3.1, color: "#627eea", account: "trading" },
  { symbol: "SOL", name: "Solana", amount: 23, price: 232, change: -1.8, color: "#14f195", account: "trading" },
  { symbol: "USDC", name: "USD Coin", amount: 42_000, price: 1, change: 0.0, color: "#2775ca", account: "savings" },
] as const;

export const CATEGORY_META: Record<string, { label: string; color: string }> = {
  SALARY: { label: "Salary", color: "#4caf8a" },
  TRANSFER: { label: "Transfer", color: "#6a8fc8" },
  PAYMENT: { label: "Payment", color: "#c9a84c" },
  INVESTMENT: { label: "Investment", color: "#a78fcc" },
  REFUND: { label: "Refund", color: "#4caf8a" },
  FEE: { label: "Fee", color: "#e05c5c" },
  OTHER: { label: "Other", color: "#6a7f96" },
};

// Static FX fallback (USD base) used when no OPEN_EXCHANGE_APP_ID is configured.
export const FX_FALLBACK = [
  { code: "EUR", name: "Euro", flag: "🇪🇺", rate: 1.0852, change: 0.07 },
  { code: "GBP", name: "British Pound", flag: "🇬🇧", rate: 1.2748, change: 0.12 },
  { code: "JPY", name: "Japanese Yen", flag: "🇯🇵", rate: 0.0064, change: -0.15 },
  { code: "CAD", name: "Canadian Dollar", flag: "🇨🇦", rate: 0.732, change: -0.03 },
] as const;
