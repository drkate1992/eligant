"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import {
  Check,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input, Label, Select } from "@/components/ui/Input";
import { registerSchema, passwordStrength, type RegisterInput } from "@/lib/validations";
import { api } from "@/lib/api-client";
import { FetchError } from "@/lib/api-client";
import { toast } from "@/lib/toast-store";
import { ACCOUNT_TYPES, ACCOUNT_TYPE_META } from "@/lib/constants";
import { cn } from "@/lib/utils";

const STEPS = ["Personal", "Account", "Verify", "Review"];

const STEP_FIELDS: (keyof RegisterInput)[][] = [
  ["firstName", "lastName", "country", "phone"],
  ["email", "password", "confirmPassword"],
  [],
  ["acceptTerms"],
];

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [showPw, setShowPw] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [busy, setBusy] = useState(false);
  const [devCode, setDevCode] = useState<string | null>(null);

  const form = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    mode: "onTouched",
    defaultValues: { accountType: "CHECKING" },
  });
  const { register, trigger, getValues, watch, formState } = form;

  const pw = watch("password") || "";
  const strength = passwordStrength(pw);

  async function sendEmailOtp(): Promise<boolean> {
    setBusy(true);
    try {
      const res = await fetch("/api/auth/send-email-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: getValues("email") }),
      });
      const body = await res.json();
      if (!res.ok) {
        toast.error("Couldn't send code", body.error ?? "Please try again.");
        return false;
      }
      setDevCode(body.devCode ?? null);
      setOtp(["", "", "", "", "", ""]);
      return true;
    } catch {
      toast.error("Couldn't send code", "Please try again.");
      return false;
    } finally {
      setBusy(false);
    }
  }

  async function resendEmailOtp() {
    if (await sendEmailOtp()) {
      toast.success("Code sent", `We emailed a new code to ${getValues("email")}.`);
    }
  }

  async function next() {
    const fields = STEP_FIELDS[step];
    if (fields.length) {
      const valid = await trigger(fields);
      if (!valid) return;
    }

    // Leaving the credentials step → email a confirmation code.
    if (step === 1) {
      if (!(await sendEmailOtp())) return;
    }

    // Leaving the verify step → confirm the emailed code.
    if (step === 2) {
      const code = otp.join("");
      if (code.length !== 6) {
        toast.error("Enter the 6-digit code", "Check your email for the code.");
        return;
      }
      setBusy(true);
      try {
        const res = await fetch("/api/auth/verify-email-otp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: getValues("email"), code }),
        });
        const body = await res.json();
        if (!res.ok) {
          toast.error("Invalid code", body.error ?? "That code is incorrect or expired.");
          return;
        }
      } finally {
        setBusy(false);
      }
    }

    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  }

  function handleOtpChange(i: number, val: string) {
    if (!/^\d?$/.test(val)) return;
    const copy = [...otp];
    copy[i] = val;
    setOtp(copy);
    if (val && i < 5) otpRefs.current[i + 1]?.focus();
  }

  async function onFinalSubmit() {
    const valid = await trigger();
    if (!valid) return;
    setSubmitting(true);
    const data = getValues();
    try {
      await api.post("/api/auth/register", data);
      const res = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });
      if (res?.error) {
        toast.success("Account created", "Please sign in to continue.");
        router.push("/login");
        return;
      }
      toast.success("Welcome to Unity Financial!", "Your account is ready.");
      router.push("/dashboard");
      router.refresh();
    } catch (e) {
      const msg = e instanceof FetchError ? e.message : "Registration failed";
      toast.error("Could not create account", msg);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="w-full max-w-md">
      <div className="mb-7">
        <h2 className="mb-1.5 font-display text-3xl font-semibold text-ink-primary">
          Create your account
        </h2>
        <p className="text-sm text-ink-muted">
          Join Unity Financial Group in four quick steps.
        </p>
      </div>

      {/* Step indicators */}
      <div className="mb-7 flex items-center">
        {STEPS.map((label, i) => (
          <div key={label} className="flex flex-1 items-center last:flex-none">
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full border text-xs font-semibold transition",
                  i < step && "border-brand bg-brand text-white",
                  i === step && "border-brand bg-brand/10 text-brand",
                  i > step && "border-line bg-navy-card text-ink-muted",
                )}
              >
                {i < step ? <Check size={14} /> : i + 1}
              </div>
              <span
                className={cn(
                  "text-[10px]",
                  i <= step ? "text-ink-secondary" : "text-ink-muted",
                )}
              >
                {label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div
                className={cn(
                  "mx-2 h-px flex-1",
                  i < step ? "bg-brand" : "bg-line",
                )}
              />
            )}
          </div>
        ))}
      </div>

      <div className="space-y-4">
        {step === 0 && (
          <div className="space-y-4 fade-up">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>First Name</Label>
                <Input
                  placeholder="John"
                  icon={<User size={16} />}
                  error={formState.errors.firstName?.message}
                  {...register("firstName")}
                />
              </div>
              <div>
                <Label>Last Name</Label>
                <Input
                  placeholder="Carter"
                  error={formState.errors.lastName?.message}
                  {...register("lastName")}
                />
              </div>
            </div>
            <div>
              <Label>Date of Birth</Label>
              <Input type="date" {...register("dateOfBirth")} />
            </div>
            <div>
              <Label>Country</Label>
              <Select {...register("country")} defaultValue="">
                <option value="" disabled>
                  Select country
                </option>
                {["United States", "Canada", "United Kingdom", "Australia", "Germany", "France"].map(
                  (c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ),
                )}
              </Select>
              {formState.errors.country && (
                <p className="mt-1.5 text-xs text-negative">
                  {formState.errors.country.message}
                </p>
              )}
            </div>
            <div>
              <Label>Phone Number</Label>
              <Input
                placeholder="+1 (213) 555-0142"
                error={formState.errors.phone?.message}
                {...register("phone")}
              />
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-4 fade-up">
            <div>
              <Label>Email Address</Label>
              <Input
                type="email"
                placeholder="you@example.com"
                icon={<Mail size={16} />}
                error={formState.errors.email?.message}
                {...register("email")}
              />
            </div>
            <div>
              <Label>Password</Label>
              <div className="relative">
                <Input
                  type={showPw ? "text" : "password"}
                  placeholder="Create a strong password"
                  icon={<Lock size={16} />}
                  error={formState.errors.password?.message}
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
              {pw && (
                <div className="mt-2">
                  <div className="flex gap-1.5">
                    {[0, 1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className={cn(
                          "h-1 flex-1 rounded-full transition",
                          i < strength.score
                            ? strength.score <= 2
                              ? "bg-negative"
                              : strength.score === 3
                                ? "bg-gold"
                                : "bg-brand"
                            : "bg-white/10",
                        )}
                      />
                    ))}
                  </div>
                  <p className="mt-1 text-[11px] text-ink-muted">
                    Strength: {strength.label}
                  </p>
                </div>
              )}
            </div>
            <div>
              <Label>Confirm Password</Label>
              <Input
                type="password"
                placeholder="Re-enter your password"
                icon={<Lock size={16} />}
                error={formState.errors.confirmPassword?.message}
                {...register("confirmPassword")}
              />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-5 fade-up">
            <div className="rounded-xl border border-line bg-white/[0.02] p-4 text-center">
              <p className="text-sm text-ink-secondary">
                We emailed a 6-digit code to{" "}
                <span className="text-ink-primary">{getValues("email")}</span>.
              </p>
              {devCode && (
                <p className="mt-1 text-xs text-ink-muted">
                  Dev mode code:{" "}
                  <span className="font-mono text-base tracking-widest text-brand">
                    {devCode}
                  </span>
                </p>
              )}
              <button
                type="button"
                onClick={resendEmailOtp}
                disabled={busy}
                className="mt-2 text-xs font-medium text-brand transition hover:text-brand-light disabled:opacity-60"
              >
                {busy ? "Sending…" : "Resend code"}
              </button>
            </div>
            <div className="flex justify-center gap-2">
              {otp.map((d, i) => (
                <input
                  key={i}
                  ref={(el) => {
                    otpRefs.current[i] = el;
                  }}
                  value={d}
                  onChange={(e) => handleOtpChange(i, e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Backspace" && !otp[i] && i > 0)
                      otpRefs.current[i - 1]?.focus();
                  }}
                  inputMode="numeric"
                  maxLength={1}
                  className="h-12 w-11 rounded-xl border border-white/10 bg-navy-card text-center font-display text-xl text-ink-primary outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/10"
                />
              ))}
            </div>
            <div>
              <Label>Account Type</Label>
              <Select {...register("accountType")}>
                {ACCOUNT_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {ACCOUNT_TYPE_META[t].label}
                  </option>
                ))}
              </Select>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4 fade-up">
            <div className="rounded-xl border border-line bg-white/[0.02] p-4">
              <h4 className="mb-3 font-display text-base text-ink-primary">
                Review your details
              </h4>
              <dl className="space-y-2 text-sm">
                {[
                  ["Name", `${getValues("firstName")} ${getValues("lastName")}`],
                  ["Email", getValues("email")],
                  ["Country", getValues("country")],
                  ["Phone", getValues("phone")],
                  [
                    "Account",
                    ACCOUNT_TYPE_META[getValues("accountType")]?.label,
                  ],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between gap-4">
                    <dt className="text-ink-muted">{k}</dt>
                    <dd className="text-right text-ink-primary">{v}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <label className="flex cursor-pointer items-start gap-2.5 text-sm text-ink-secondary">
              <input
                type="checkbox"
                className="mt-0.5 h-4 w-4 rounded border-white/20 bg-navy-card accent-brand"
                {...register("acceptTerms")}
              />
              <span>
                I agree to the{" "}
                <span className="text-brand">Terms of Service</span> and{" "}
                <span className="text-brand">Privacy Policy</span>.
              </span>
            </label>
            {formState.errors.acceptTerms && (
              <p className="text-xs text-negative">
                {formState.errors.acceptTerms.message}
              </p>
            )}
          </div>
        )}
      </div>

      <div className="mt-7 flex items-center gap-3">
        {step > 0 && (
          <Button
            type="button"
            variant="outline"
            onClick={() => setStep((s) => s - 1)}
          >
            <ArrowLeft size={16} /> Back
          </Button>
        )}
        {step < STEPS.length - 1 ? (
          <Button type="button" onClick={next} loading={busy} className="ml-auto">
            {step === 1 ? "Send Code" : step === 2 ? "Verify Email" : "Continue"} <ArrowRight size={16} />
          </Button>
        ) : (
          <Button
            type="button"
            onClick={onFinalSubmit}
            loading={submitting}
            className="ml-auto"
          >
            Create Account
          </Button>
        )}
      </div>

      <p className="mt-6 text-center text-sm text-ink-muted">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-brand hover:text-brand-light">
          Sign in
        </Link>
      </p>
    </div>
  );
}
