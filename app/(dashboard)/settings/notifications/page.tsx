"use client";

import { useState } from "react";
import { Card, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { toast } from "@/lib/toast-store";

const CATEGORIES = [
  { key: "transactions", label: "Transactions", desc: "Credits and debits on your accounts" },
  { key: "transfers", label: "Transfers", desc: "Outgoing and incoming transfers" },
  { key: "security", label: "Security Alerts", desc: "Sign-ins and password changes" },
  { key: "promotions", label: "Promotions", desc: "Offers and product news" },
  { key: "goals", label: "Goals", desc: "Savings goal progress and milestones" },
];

const CHANNELS = ["email", "sms", "push"] as const;

type Prefs = Record<string, Record<(typeof CHANNELS)[number], boolean>>;

function defaults(): Prefs {
  const p: Prefs = {};
  for (const c of CATEGORIES) {
    p[c.key] = {
      email: true,
      sms: c.key === "security" || c.key === "transactions",
      push: c.key !== "promotions",
    };
  }
  return p;
}

export default function NotificationSettingsPage() {
  const [prefs, setPrefs] = useState<Prefs>(defaults);

  function toggle(cat: string, ch: (typeof CHANNELS)[number]) {
    setPrefs((p) => ({
      ...p,
      [cat]: { ...p[cat], [ch]: !p[cat][ch] },
    }));
  }

  return (
    <Card>
      <CardHeader
        title="Notification Preferences"
        subtitle="Choose how you want to be notified"
      />
      <div className="overflow-x-auto">
        <table className="w-full min-w-[480px]">
          <thead>
            <tr className="border-b border-line text-[11px] uppercase tracking-wider text-ink-muted">
              <th className="py-3 text-left font-medium">Category</th>
              {CHANNELS.map((c) => (
                <th key={c} className="px-2 py-3 text-center font-medium capitalize">
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {CATEGORIES.map((cat) => (
              <tr key={cat.key} className="border-b border-line/60">
                <td className="py-4 pr-4">
                  <div className="text-sm font-medium text-ink-primary">
                    {cat.label}
                  </div>
                  <div className="text-xs text-ink-muted">{cat.desc}</div>
                </td>
                {CHANNELS.map((ch) => (
                  <td key={ch} className="px-2 py-4 text-center">
                    <button
                      onClick={() => toggle(cat.key, ch)}
                      className={cn(
                        "relative inline-flex h-6 w-11 items-center rounded-full transition",
                        prefs[cat.key][ch] ? "bg-brand" : "bg-navy-mid border border-line",
                      )}
                    >
                      <span
                        className={cn(
                          "inline-block h-4 w-4 transform rounded-full bg-white transition",
                          prefs[cat.key][ch] ? "translate-x-6" : "translate-x-1",
                        )}
                      />
                    </button>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Button
        className="mt-6"
        onClick={() => toast.success("Preferences saved")}
      >
        Save Preferences
      </Button>
    </Card>
  );
}
