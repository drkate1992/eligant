"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Shield, Smartphone, Monitor } from "lucide-react";
import { Card, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input, Label } from "@/components/ui/Input";
import { changePasswordSchema } from "@/lib/validations";
import { api, FetchError } from "@/lib/api-client";
import { toast } from "@/lib/toast-store";

type Form = z.infer<typeof changePasswordSchema>;

export default function SecuritySettingsPage() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<Form>({ resolver: zodResolver(changePasswordSchema) });
  const [twoFA, setTwoFA] = useState(false);

  async function onSubmit(data: Form) {
    try {
      await api.post("/api/auth/change-password", data);
      toast.success("Password changed", "Your password has been updated.");
      reset();
    } catch (e) {
      toast.error("Could not change password", e instanceof FetchError ? e.message : "");
    }
  }

  return (
    <div className="space-y-5">
      <Card>
        <CardHeader title="Change Password" subtitle="Use a strong, unique password" />
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label>Current Password</Label>
            <Input
              type="password"
              error={errors.currentPassword?.message}
              {...register("currentPassword")}
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label>New Password</Label>
              <Input
                type="password"
                error={errors.newPassword?.message}
                {...register("newPassword")}
              />
            </div>
            <div>
              <Label>Confirm New Password</Label>
              <Input
                type="password"
                error={errors.confirmPassword?.message}
                {...register("confirmPassword")}
              />
            </div>
          </div>
          <Button type="submit" loading={isSubmitting}>
            Update Password
          </Button>
        </form>
      </Card>

      <Card>
        <CardHeader
          title="Two-Factor Authentication"
          subtitle="Add an extra layer of security"
        />
        <div className="flex items-center justify-between rounded-xl border border-line bg-navy-mid p-4">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand/10 text-brand">
              <Shield size={18} />
            </span>
            <div>
              <div className="text-sm font-medium text-ink-primary">
                Authenticator App (TOTP)
              </div>
              <div className="text-xs text-ink-muted">
                {twoFA ? "Enabled" : "Not configured"}
              </div>
            </div>
          </div>
          <Button
            variant={twoFA ? "danger" : "outline"}
            size="sm"
            onClick={() => {
              setTwoFA((s) => !s);
              toast.info(
                twoFA ? "2FA disabled" : "2FA enabled",
                "Scan the QR with your authenticator app (demo).",
              );
            }}
          >
            {twoFA ? "Disable" : "Enable"}
          </Button>
        </div>
      </Card>

      <Card>
        <CardHeader title="Active Sessions" subtitle="Devices signed into your account" />
        <div className="space-y-2">
          {[
            { icon: Monitor, name: "Chrome · Windows", meta: "This device · Active now" },
            { icon: Smartphone, name: "Safari · iPhone", meta: "Los Angeles, CA · 2 days ago" },
          ].map((s) => (
            <div
              key={s.name}
              className="flex items-center gap-3 rounded-xl border border-line bg-navy-mid p-4"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.05] text-ink-secondary">
                <s.icon size={18} />
              </span>
              <div className="flex-1">
                <div className="text-sm font-medium text-ink-primary">{s.name}</div>
                <div className="text-xs text-ink-muted">{s.meta}</div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => toast.success("Session revoked")}
              >
                Revoke
              </Button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
