"use client";

import { useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Lock, Eye, EyeOff, CheckCircle2 } from "lucide-react";
import { z } from "zod";
import { Button } from "@/components/ui/Button";
import { Input, Label } from "@/components/ui/Input";
import { passwordSchema, passwordStrength } from "@/lib/validations";
import { api, FetchError } from "@/lib/api-client";
import { toast } from "@/lib/toast-store";
import { cn } from "@/lib/utils";

const formSchema = z
  .object({
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
type Form = z.infer<typeof formSchema>;

export default function ResetPasswordPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = use(params);
  const router = useRouter();
  const [showPw, setShowPw] = useState(false);
  const [done, setDone] = useState(false);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<Form>({ resolver: zodResolver(formSchema) });
  const strength = passwordStrength(watch("password") || "");

  async function onSubmit(data: Form) {
    try {
      await api.post("/api/auth/reset-password", { ...data, token });
      setDone(true);
      setTimeout(() => router.push("/login"), 1800);
    } catch (e) {
      toast.error(
        "Reset failed",
        e instanceof FetchError ? e.message : "Try requesting a new link.",
      );
    }
  }

  if (done) {
    return (
      <div className="w-full max-w-sm text-center fade-up">
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand/10 text-brand">
          <CheckCircle2 size={26} />
        </div>
        <h2 className="mb-2 font-display text-2xl font-semibold text-ink-primary">
          Password updated
        </h2>
        <p className="text-sm text-ink-muted">
          Redirecting you to sign in…
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-sm">
      <div className="mb-8 fade-up">
        <h2 className="mb-1.5 font-display text-3xl font-semibold text-ink-primary">
          Set a new password
        </h2>
        <p className="text-sm text-ink-muted">
          Choose a strong password for your account.
        </p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Label>New Password</Label>
          <div className="relative">
            <Input
              type={showPw ? "text" : "password"}
              placeholder="New password"
              icon={<Lock size={16} />}
              error={errors.password?.message}
              {...register("password")}
            />
            <button
              type="button"
              onClick={() => setShowPw((s) => !s)}
              className="absolute right-3.5 top-[22px] -translate-y-1/2 text-ink-muted hover:text-brand"
            >
              {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          <div className="mt-2 flex gap-1.5">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className={cn(
                  "h-1 flex-1 rounded-full transition",
                  i < strength.score ? "bg-brand" : "bg-white/10",
                )}
              />
            ))}
          </div>
        </div>
        <div>
          <Label>Confirm Password</Label>
          <Input
            type="password"
            placeholder="Re-enter password"
            icon={<Lock size={16} />}
            error={errors.confirmPassword?.message}
            {...register("confirmPassword")}
          />
        </div>
        <Button type="submit" loading={isSubmitting} className="w-full">
          Update Password
        </Button>
      </form>
      <Link
        href="/login"
        className="mt-6 inline-block text-sm text-ink-secondary hover:text-ink-primary"
      >
        Back to sign in
      </Link>
    </div>
  );
}
