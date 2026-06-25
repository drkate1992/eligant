import { z } from "zod";
import {
  ACCOUNT_TYPES,
  TRANSACTION_TYPES,
  TRANSACTION_CATEGORIES,
} from "./constants";

export const passwordSchema = z
  .string()
  .min(8, "At least 8 characters")
  .regex(/[A-Z]/, "One uppercase letter")
  .regex(/[a-z]/, "One lowercase letter")
  .regex(/[0-9]/, "One number")
  .regex(/[^A-Za-z0-9]/, "One special character");

export function passwordStrength(pw: string) {
  const checks = [
    pw.length >= 8,
    /[A-Z]/.test(pw),
    /[0-9]/.test(pw),
    /[^A-Za-z0-9]/.test(pw),
  ];
  const score = checks.filter(Boolean).length;
  const label = ["Too weak", "Weak", "Fair", "Good", "Strong"][score];
  return { score, label, checks };
}

export const loginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
  remember: z.boolean().optional(),
  otp: z.string().optional(),
});

// Step 1 of login: validate credentials before emailing a one-time code.
export const requestOtpSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

// Email-confirmation codes for sign-up.
export const sendEmailOtpSchema = z.object({
  email: z.string().email("Enter a valid email"),
});

export const verifyEmailOtpSchema = z.object({
  email: z.string().email("Enter a valid email"),
  code: z.string().regex(/^\d{6}$/, "Enter the 6-digit code"),
});

export const registerSchema = z
  .object({
    firstName: z.string().min(1, "First name is required").max(60),
    lastName: z.string().min(1, "Last name is required").max(60),
    dateOfBirth: z.string().optional(),
    country: z.string().min(1, "Country is required"),
    phone: z.string().min(6, "Enter a valid phone number"),
    email: z.string().email("Enter a valid email"),
    password: passwordSchema,
    confirmPassword: z.string(),
    accountType: z.enum(ACCOUNT_TYPES).default("CHECKING"),
    acceptTerms: z.literal(true, {
      errorMap: () => ({ message: "You must accept the terms" }),
    }),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type RegisterInput = z.infer<typeof registerSchema>;

export const beneficiarySchema = z.object({
  name: z.string().min(1, "Name is required"),
  accountNumber: z.string().min(4, "Account number is required"),
  bankName: z.string().optional(),
  bankCode: z.string().optional(),
  country: z.string().default("US"),
  isFavorite: z.boolean().optional(),
});

export const internalTransferSchema = z.object({
  fromAccountId: z.string().min(1),
  toAccountId: z.string().min(1),
  amount: z.coerce.number().positive("Amount must be greater than 0"),
  description: z.string().max(140).optional(),
});

export const externalTransferSchema = z.object({
  fromAccountId: z.string().min(1),
  beneficiaryId: z.string().optional(),
  recipientName: z.string().min(1, "Recipient is required"),
  recipientAccount: z.string().min(4, "Account number is required"),
  amount: z.coerce.number().positive("Amount must be greater than 0"),
  description: z.string().max(140).optional(),
  scope: z.enum(["domestic", "international"]).default("domestic"),
  currency: z.string().default("USD"),
});

export const goalSchema = z.object({
  name: z.string().min(1, "Name is required"),
  emoji: z.string().default("🎯"),
  targetAmount: z.coerce.number().positive("Target must be greater than 0"),
  targetDate: z.string().optional(),
});

export const goalDepositSchema = z.object({
  fromAccountId: z.string().min(1),
  amount: z.coerce.number().positive("Amount must be greater than 0"),
});

export const createAccountSchema = z.object({
  type: z.enum(ACCOUNT_TYPES),
  name: z.string().min(1, "Name is required"),
  currency: z.string().default("USD"),
});

export const profileSchema = z.object({
  firstName: z.string().min(1).max(60),
  lastName: z.string().min(1).max(60),
  phone: z.string().optional(),
  country: z.string().optional(),
});

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1),
    newPassword: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const forgotPasswordSchema = z.object({
  email: z.string().email(),
});

export const resetPasswordSchema = z
  .object({
    token: z.string().min(1),
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const txnFilterSchema = z.object({
  type: z.enum([...TRANSACTION_TYPES, "ALL"]).optional(),
  category: z.enum([...TRANSACTION_CATEGORIES, "ALL"]).optional(),
  accountId: z.string().optional(),
  search: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  cursor: z.string().optional(),
  limit: z.coerce.number().min(1).max(100).optional(),
});
