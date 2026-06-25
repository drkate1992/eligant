"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { z } from "zod";
import { Mail, Lock, Eye, EyeOff, AlertCircle, ShieldCheck, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input, Label } from "@/components/ui/Input";
import { loginSchema } from "@/lib/validations";

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const [showPw, setShowPw] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Two-step state: credentials → emailed one-time code.
  const [step, setStep] = useState<"credentials" | "otp">("credentials");
  const [creds, setCreds] = useState<{ email: string; password: string } | null>(null);
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState<string | null>(null);
  const [verifying, setVerifying] = useState(false);
  const [resending, setResending] = useState(false);
  const [devCode, setDevCode] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({ resolver: zodResolver(loginSchema) });

  // Step 1 — validate credentials and request an emailed OTP.
  async function onSubmit(data: LoginForm) {
    setFormError(null);
    try {
      const res = await fetch("/api/auth/request-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: data.email, password: data.password }),
      });
      const body = await res.json();
      if (!res.ok) {
        setFormError(body.error ?? "Invalid email or password. Please try again.");
        return;
      }
      setCreds({ email: data.email, password: data.password });
      setDevCode(body.devCode ?? null);
      setOtp("");
      setOtpError(null);
      setStep("otp");
    } catch {
      setFormError("Something went wrong. Please try again.");
    }
  }

  // Step 2 — verify the OTP and create the session.
  async function verifyOtp(e: React.FormEvent) {
    e.preventDefault();
    if (!creds) return;
    if (otp.trim().length !== 6) {
      setOtpError("Enter the 6-digit code from your email.");
      return;
    }
    setVerifying(true);
    setOtpError(null);
    const res = await signIn("credentials", {
      email: creds.email,
      password: creds.password,
      otp: otp.trim(),
      redirect: false,
    });
    setVerifying(false);
    if (res?.error) {
      setOtpError("That code is invalid or has expired. Please try again.");
      return;
    }
    router.push("/dashboard");
    router.refresh();
  }

  async function resend() {
    if (!creds) return;
    setResending(true);
    setOtpError(null);
    try {
      const res = await fetch("/api/auth/request-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(creds),
      });
      const body = await res.json();
      if (res.ok) {
        setDevCode(body.devCode ?? null);
        setOtp("");
      } else {
        setOtpError(body.error ?? "Couldn't resend the code.");
      }
    } finally {
      setResending(false);
    }
  }

  /* ── Step 2: OTP entry ── */
  if (step === "otp") {
    return (
      <div className="w-full max-w-sm">
        <button
          onClick={() => { setStep("credentials"); setFormError(null); }}
          className="mb-6 flex items-center gap-2 text-sm text-ink-muted transition hover:text-brand fade-up"
        >
          <ArrowLeft size={15} /> Back
        </button>

        <div className="mb-7 fade-up">
          <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-brand/12 text-brand">
            <ShieldCheck size={24} />
          </span>
          <h2 className="mb-1.5 font-display text-3xl font-semibold text-ink-primary">
            Verify it&apos;s you
          </h2>
          <p className="text-sm text-ink-muted">
            We emailed a 6-digit code to{" "}
            <span className="text-ink-secondary">{creds?.email}</span>. Enter it below to continue.
          </p>
        </div>

        {devCode && (
          <div className="mb-4 rounded-xl border border-brand/25 bg-brand/10 px-4 py-3 text-sm text-brand-light fade-up">
            Dev mode — your code is{" "}
            <span className="font-mono font-bold tracking-widest">{devCode}</span>
          </div>
        )}

        {otpError && (
          <div className="mb-4 flex items-center gap-2 rounded-xl border border-negative/25 bg-negative/10 px-4 py-3 text-sm text-negative fade-up">
            <AlertCircle size={16} />
            {otpError}
          </div>
        )}

        <form onSubmit={verifyOtp} className="space-y-4 fade-up delay-1">
          <div>
            <Label>One-Time Code</Label>
            <Input
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={6}
              placeholder="••••••"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
              className="text-center text-2xl font-bold tracking-[0.5em]"
              autoFocus
            />
          </div>

          <Button type="submit" loading={verifying} className="w-full">
            {verifying ? "Verifying…" : "Verify & Sign In"}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-ink-muted fade-up delay-2">
          Didn&apos;t get it?{" "}
          <button
            onClick={resend}
            disabled={resending}
            className="font-medium text-brand transition hover:text-brand-light disabled:opacity-60"
          >
            {resending ? "Sending…" : "Resend code"}
          </button>
        </p>
      </div>
    );
  }

  /* ── Step 1: credentials ── */
  return (
    <div className="w-full max-w-sm">
      <div className="mb-8 fade-up">
        <h2 className="mb-1.5 font-display text-3xl font-semibold text-ink-primary">
          Welcome back
        </h2>
        <p className="text-sm text-ink-muted">
          Sign in to your EligantWealth account to continue.
        </p>
      </div>

      {formError && (
        <div className="mb-4 flex items-center gap-2 rounded-xl border border-negative/25 bg-negative/10 px-4 py-3 text-sm text-negative fade-up">
          <AlertCircle size={16} />
          {formError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="fade-up delay-1">
          <Label>Email Address</Label>
          <Input
            type="email"
            placeholder="you@example.com"
            icon={<Mail size={16} />}
            autoComplete="email"
            error={errors.email?.message}
            {...register("email")}
          />
        </div>

        <div className="fade-up delay-2">
          <Label>Password</Label>
          <div className="relative">
            <Input
              type={showPw ? "text" : "password"}
              placeholder="Enter your password"
              icon={<Lock size={16} />}
              autoComplete="current-password"
              error={errors.password?.message}
              {...register("password")}
            />
            <button
              type="button"
              onClick={() => setShowPw((s) => !s)}
              className="absolute right-3.5 top-[22px] -translate-y-1/2 text-ink-muted transition hover:text-brand"
            >
              {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between py-1 fade-up delay-3">
          <label className="flex cursor-pointer items-center gap-2 text-sm text-ink-secondary">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-white/20 bg-navy-card accent-brand"
              {...register("remember")}
            />
            Keep me signed in
          </label>
          <Link
            href="/forgot-password"
            className="text-sm text-brand transition hover:text-brand-light"
          >
            Forgot password?
          </Link>
        </div>

        <Button
          type="submit"
          loading={isSubmitting}
          className="w-full fade-up delay-4"
        >
          {isSubmitting ? "Sending security code…" : "Continue"}
        </Button>

        <p className="flex items-center justify-center gap-1.5 text-center text-xs text-ink-muted fade-up delay-4">
          <ShieldCheck size={13} className="text-brand" />
          We&apos;ll email a one-time code to verify each sign-in.
        </p>
      </form>

      <p className="mt-7 text-center text-sm text-ink-muted fade-up delay-5">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="font-medium text-brand hover:text-brand-light">
          Create one →
        </Link>
      </p>
    </div>
  );
}
