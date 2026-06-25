"use client";

import { useState } from "react";
import { MessageCircle, Mail, Phone, LifeBuoy, ChevronDown, Send } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input, Label, Select } from "@/components/ui/Input";
import { toast } from "@/lib/toast-store";
import { cn } from "@/lib/utils";

const CHANNELS = [
  { icon: MessageCircle, label: "Live Chat", value: "Avg. wait < 2 min", action: "Start chat", color: "#1ca65f" },
  { icon: Phone, label: "Call Us", value: "1-800-BANKING", action: "24/7 support", color: "#6a8fc8" },
  { icon: Mail, label: "Email", value: "support@unityfinancial.com", action: "Reply in 24h", color: "#c8a76a" },
];

const FAQS = [
  { q: "How long do transfers take?", a: "Local transfers are instant. International transfers reflect within 72 hours depending on the method and destination." },
  { q: "How do I reset my transaction PIN?", a: "Go to Settings → Security → Reset PIN. You'll verify via the email on file before setting a new PIN." },
  { q: "Is my money protected?", a: "Yes. Eligible deposits are FDIC-insured up to $250,000 and all activity is monitored 24/7 for fraud." },
  { q: "How do I apply for a loan or grant?", a: "Open the Loans or Grants page from the sidebar, choose a product, and submit the short application. Decisions are typically returned within 1–2 business days." },
];

export default function SupportPage() {
  const [open, setOpen] = useState<number | null>(0);
  const [form, setForm] = useState({ subject: "", category: "General", message: "" });

  return (
    <div>
      <PageHeader title="Support" subtitle="We're here to help, around the clock" />

      {/* Channels */}
      <div className="mb-5 grid gap-4 sm:grid-cols-3">
        {CHANNELS.map((c) => (
          <Card key={c.label} className="text-center">
            <span className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl" style={{ backgroundColor: `${c.color}1a`, color: c.color }}>
              <c.icon size={22} />
            </span>
            <div className="font-semibold text-ink-primary">{c.label}</div>
            <div className="mt-0.5 text-sm text-ink-secondary">{c.value}</div>
            <button
              onClick={() => toast.success(c.label, c.action)}
              className="mt-3 text-sm font-medium text-brand hover:underline"
            >
              {c.action} →
            </button>
          </Card>
        ))}
      </div>

      <div className="grid gap-5 lg:grid-cols-[1fr_360px]">
        {/* FAQ */}
        <Card>
          <CardHeader title="Frequently asked questions" />
          <div className="divide-y divide-line">
            {FAQS.map((f, i) => (
              <div key={i} className="py-1">
                <button
                  onClick={() => setOpen(open === i ? null : i)}
                  className="flex w-full items-center justify-between gap-4 py-3 text-left"
                >
                  <span className="text-sm font-medium text-ink-primary">{f.q}</span>
                  <ChevronDown size={16} className={cn("shrink-0 text-ink-muted transition", open === i && "rotate-180 text-brand")} />
                </button>
                {open === i && <p className="pb-3 text-sm text-ink-muted">{f.a}</p>}
              </div>
            ))}
          </div>
        </Card>

        {/* Ticket */}
        <Card className="space-y-4">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand/10 text-brand"><LifeBuoy size={18} /></span>
            <CardHeader title="Send a message" subtitle="We'll reply by email" className="mb-0" />
          </div>
          <div>
            <Label>Category</Label>
            <Select value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}>
              {["General", "Transfers", "Cards", "Loans & Grants", "Account & Security"].map((c) => <option key={c}>{c}</option>)}
            </Select>
          </div>
          <div>
            <Label>Subject</Label>
            <Input placeholder="How can we help?" value={form.subject} onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))} />
          </div>
          <div>
            <Label>Message</Label>
            <textarea
              className="ufg-input min-h-[110px] resize-none"
              placeholder="Describe your issue or question"
              value={form.message}
              onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
            />
          </div>
          <Button
            className="w-full"
            onClick={() => {
              if (!form.subject || !form.message) return toast.error("Add a subject and message");
              toast.success("Message sent", "Our team will reply within 24 hours.");
              setForm({ subject: "", category: "General", message: "" });
            }}
          >
            <Send size={15} /> Send Message
          </Button>
        </Card>
      </div>
    </div>
  );
}
