import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(
  value: number | string,
  currency = "USD",
  opts: Intl.NumberFormatOptions = {},
) {
  const n = typeof value === "string" ? Number(value) : value;
  // Clamp so minimumFractionDigits never exceeds maximumFractionDigits
  // (Intl throws a RangeError otherwise — e.g. when a caller passes
  // maximumFractionDigits: 0 while the default minimum is 2).
  const max = opts.maximumFractionDigits ?? 2;
  const min = opts.minimumFractionDigits ?? Math.min(2, max);
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    ...opts,
    minimumFractionDigits: min,
    maximumFractionDigits: max,
  }).format(Number.isFinite(n) ? n : 0);
}

export function formatCompact(value: number) {
  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

export function formatDate(date: Date | string, withTime = false) {
  const d = typeof date === "string" ? new Date(date) : date;
  const datePart = d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  if (!withTime) return datePart;
  const timePart = d.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
  return `${datePart} · ${timePart}`;
}

export function maskAccountNumber(num: string) {
  const clean = num.replace(/\s/g, "");
  const last4 = clean.slice(-4);
  return `•••• ${last4}`;
}

export function initialsFromName(name?: string | null) {
  if (!name) return "U";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function greeting(date = new Date()) {
  const h = date.getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

export function generateAccountNumber() {
  // 10-digit pseudo account number
  let s = "";
  for (let i = 0; i < 10; i++) s += Math.floor(Math.random() * 10);
  return s;
}

export function generateReference(prefix = "UFG") {
  const ts = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).slice(2, 7).toUpperCase();
  return `${prefix}-${ts}-${rand}`;
}

export function toNumber(value: unknown): number {
  if (value == null) return 0;
  if (typeof value === "number") return value;
  // Prisma Decimal has a toString(); Number() handles it.
  return Number(value.toString());
}
