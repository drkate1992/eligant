"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Mail, ArrowLeft, MailCheck } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input, Label } from "@/components/ui/Input";
import { forgotPasswordSchema } from "@/lib/validations";
import { api } from "@/lib/api-client";

type Form = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);
  const [devUrl, setDevUrl] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Form>({ resolver: zodResolver(forgotPasswordSchema) });

  async function onSubmit(data: Form) {
    const res = await api.post<{ devResetUrl?: string }>(
      "/api/auth/forgot-password",
      data,
    );
    setDevUrl(res.devResetUrl ?? null);
    setSent(true);
  }

  if (sent) {
    return (
      <div className="w-full max-w-sm text-center fade-up">
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand/10 text-brand">
          <MailCheck size={26} />
        </div>
        <h2 className="mb-2 font-display text-2xl font-semibold text-ink-primary">
          Check your email
        </h2>
        <p className="text-sm text-ink-muted">
          If an account exists for that address, we&apos;ve sent a link to reset
          your password. The link expires in 15 minutes.
        </p>
        {devUrl && (
          <Link
            href={devUrl}
            className="mt-5 inline-block rounded-xl border border-line bg-white/[0.02] px-4 py-2 text-xs text-brand"
          >
            Dev reset link → continue
          </Link>
        )}
        <Link
          href="/login"
          className="mt-6 inline-flex items-center gap-2 text-sm text-ink-secondary hover:text-ink-primary"
        >
          <ArrowLeft size={15} /> Back to sign in
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-sm">
      <div className="mb-8 fade-up">
        <h2 className="mb-1.5 font-display text-3xl font-semibold text-ink-primary">
          Reset password
        </h2>
        <p className="text-sm text-ink-muted">
          Enter your email and we&apos;ll send you a reset link.
        </p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Label>Email Address</Label>
          <Input
            type="email"
            placeholder="you@example.com"
            icon={<Mail size={16} />}
            error={errors.email?.message}
            {...register("email")}
          />
        </div>
        <Button type="submit" loading={isSubmitting} className="w-full">
          Send Reset Link
        </Button>
      </form>
      <Link
        href="/login"
        className="mt-6 inline-flex items-center gap-2 text-sm text-ink-secondary hover:text-ink-primary"
      >
        <ArrowLeft size={15} /> Back to sign in
      </Link>
    </div>
  );
}
