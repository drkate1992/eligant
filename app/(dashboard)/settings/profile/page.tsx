"use client";

import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input, Label, Select } from "@/components/ui/Input";
import { LoadingSpinner } from "@/components/shared/States";
import { Badge } from "@/components/ui/Badge";
import { api, FetchError } from "@/lib/api-client";
import { toast } from "@/lib/toast-store";
import { initialsFromName } from "@/lib/utils";

interface Profile {
  email: string;
  firstName: string | null;
  lastName: string | null;
  phone: string | null;
  country: string | null;
  kycStatus: string;
}

export default function ProfileSettingsPage() {
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["profile"],
    queryFn: () => api.get<Profile>("/api/user/profile"),
  });

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    country: "",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (data) {
      setForm({
        firstName: data.firstName ?? "",
        lastName: data.lastName ?? "",
        phone: data.phone ?? "",
        country: data.country ?? "",
      });
    }
  }, [data]);

  async function save() {
    setSaving(true);
    try {
      await api.patch("/api/user/profile", form);
      toast.success("Profile updated");
      refetch();
    } catch (e) {
      toast.error("Update failed", e instanceof FetchError ? e.message : "");
    } finally {
      setSaving(false);
    }
  }

  if (isLoading) return <LoadingSpinner />;

  return (
    <Card>
      <CardHeader title="Profile" subtitle="Update your personal information" />

      <div className="mb-6 flex items-center gap-4 border-b border-line pb-6">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-brand to-brand-dim font-display text-xl font-bold text-white">
          {initialsFromName(`${form.firstName} ${form.lastName}`)}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-medium text-ink-primary">
              {form.firstName} {form.lastName}
            </span>
            {data?.kycStatus === "VERIFIED" && (
              <Badge className="border-positive/20 bg-positive/10 text-positive">
                Verified
              </Badge>
            )}
          </div>
          <div className="text-sm text-ink-muted">{data?.email}</div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label>First Name</Label>
          <Input
            value={form.firstName}
            onChange={(e) => setForm({ ...form, firstName: e.target.value })}
          />
        </div>
        <div>
          <Label>Last Name</Label>
          <Input
            value={form.lastName}
            onChange={(e) => setForm({ ...form, lastName: e.target.value })}
          />
        </div>
        <div>
          <Label>Phone</Label>
          <Input
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />
        </div>
        <div>
          <Label>Country</Label>
          <Select
            value={form.country}
            onChange={(e) => setForm({ ...form, country: e.target.value })}
          >
            <option value="">Select country</option>
            {["United States", "Canada", "United Kingdom", "Australia", "Germany", "France"].map(
              (c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ),
            )}
          </Select>
        </div>
        <div className="sm:col-span-2">
          <Label>Email (read-only)</Label>
          <Input value={data?.email ?? ""} disabled className="opacity-60" />
        </div>
      </div>

      <Button onClick={save} loading={saving} className="mt-6">
        Save Changes
      </Button>
    </Card>
  );
}
