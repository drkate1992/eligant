"use client";

import { useState } from "react";
import { Receipt, FileText, ShieldCheck, Clock, CheckCircle2, ArrowRight } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input, Label, Select } from "@/components/ui/Input";
import { toast } from "@/lib/toast-store";
import { formatCurrency } from "@/lib/utils";

const STATUSES = ["Single", "Married filing jointly", "Married filing separately", "Head of household"];
const YEARS = ["2025", "2024", "2023", "2022"];

export default function TaxRefundPage() {
  const [form, setForm] = useState({
    year: "2024",
    status: "Single",
    ssnLast4: "",
    income: "",
    withheld: "",
    refund: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const set = (k: keyof typeof form, v: string) => setForm((f) => ({ ...f, [k]: v }));

  // Rough estimate: refund = withheld - (income * effective rate)
  const income = Number(form.income) || 0;
  const withheld = Number(form.withheld) || 0;
  const estTax = income * 0.18;
  const estRefund = Math.max(0, withheld - estTax);

  if (submitted) {
    return (
      <div className="mx-auto max-w-md py-10 text-center fade-up">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-positive/10 text-positive">
          <CheckCircle2 size={32} />
        </div>
        <h2 className="font-display text-2xl font-bold text-ink-primary">Refund claim submitted</h2>
        <p className="mt-2 text-sm text-ink-muted">
          Your {form.year} tax refund claim is being processed. Approved refunds are paid directly to your EligantWealth account within 21 days.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Button variant="outline" onClick={() => setSubmitted(false)}>New Claim</Button>
          <a href="/dashboard"><Button>Back to Dashboard <ArrowRight size={15} /></Button></a>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="Tax Refund" subtitle="File your claim and get refunds paid straight to your account" />

      <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
        <Card className="space-y-5">
          <CardHeader title="Refund claim" subtitle="All information is encrypted and IRS-compliant" />

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label>Tax Year</Label>
              <Select value={form.year} onChange={(e) => set("year", e.target.value)}>
                {YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
              </Select>
            </div>
            <div>
              <Label>Filing Status</Label>
              <Select value={form.status} onChange={(e) => set("status", e.target.value)}>
                {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
              </Select>
            </div>
            <div>
              <Label>SSN (last 4)</Label>
              <Input placeholder="••••" maxLength={4} value={form.ssnLast4} onChange={(e) => set("ssnLast4", e.target.value)} />
            </div>
            <div>
              <Label>Annual Income</Label>
              <Input type="number" placeholder="0.00" value={form.income} onChange={(e) => set("income", e.target.value)} />
            </div>
            <div>
              <Label>Federal Tax Withheld</Label>
              <Input type="number" placeholder="0.00" value={form.withheld} onChange={(e) => set("withheld", e.target.value)} />
            </div>
            <div>
              <Label>Expected Refund (optional)</Label>
              <Input type="number" placeholder="0.00" value={form.refund} onChange={(e) => set("refund", e.target.value)} />
            </div>
          </div>

          <div className="rounded-xl border border-line bg-navy-mid p-4">
            <div className="flex items-center gap-2 text-xs text-ink-muted"><FileText size={14} /> Estimated refund based on your figures</div>
            <div className="mt-1 font-display text-2xl font-bold text-brand tnum">{formatCurrency(estRefund)}</div>
          </div>

          <Button
            className="w-full"
            onClick={() => {
              if (!form.ssnLast4 || form.ssnLast4.length < 4) return toast.error("Enter the last 4 digits of your SSN");
              if (income <= 0) return toast.error("Enter your annual income");
              setSubmitted(true);
            }}
          >
            <Receipt size={15} /> Submit Refund Claim
          </Button>
        </Card>

        <div className="space-y-5">
          <Card>
            <CardHeader title="How it works" />
            <ol className="space-y-3 text-sm text-ink-secondary">
              {[
                { icon: FileText, t: "Enter your tax details" },
                { icon: ShieldCheck, t: "We verify with the IRS" },
                { icon: Clock, t: "Refund paid within 21 days" },
              ].map((s, i) => (
                <li key={i} className="flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-brand/10 text-brand"><s.icon size={15} /></span>
                  <span><span className="font-medium text-ink-primary">Step {i + 1}.</span> {s.t}</span>
                </li>
              ))}
            </ol>
          </Card>
        </div>
      </div>
    </div>
  );
}
