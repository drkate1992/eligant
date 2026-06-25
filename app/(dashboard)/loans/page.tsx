"use client";

import { useState } from "react";
import { Landmark, Home, Car, Briefcase, GraduationCap, CheckCircle2, ArrowRight } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input, Label, Select } from "@/components/ui/Input";
import { toast } from "@/lib/toast-store";
import { formatCurrency, cn } from "@/lib/utils";

const PRODUCTS = [
  { id: "Personal", icon: Briefcase, apr: 7.9, max: 50000, desc: "Flexible funds for any purpose" },
  { id: "Business", icon: Landmark, apr: 6.5, max: 500000, desc: "Grow your contracting business" },
  { id: "Auto", icon: Car, apr: 5.4, max: 100000, desc: "Finance equipment & vehicles" },
  { id: "Mortgage", icon: Home, apr: 6.1, max: 1500000, desc: "Buy or refinance property" },
  { id: "Education", icon: GraduationCap, apr: 4.9, max: 75000, desc: "Invest in skills & training" },
];

export default function LoansPage() {
  const [product, setProduct] = useState(PRODUCTS[1]);
  const [amount, setAmount] = useState("50000");
  const [term, setTerm] = useState("36");
  const [purpose, setPurpose] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const principal = Number(amount) || 0;
  const months = Number(term) || 1;
  const monthlyRate = product.apr / 100 / 12;
  const monthly =
    monthlyRate > 0
      ? (principal * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -months))
      : principal / months;
  const totalRepay = monthly * months;

  if (submitted) {
    return (
      <div className="mx-auto max-w-md py-10 text-center fade-up">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-positive/10 text-positive">
          <CheckCircle2 size={32} />
        </div>
        <h2 className="font-display text-2xl font-bold text-ink-primary">Application received</h2>
        <p className="mt-2 text-sm text-ink-muted">
          Your {product.id.toLowerCase()} loan request for {formatCurrency(principal)} is under review. A loan officer will contact you within 1–2 business days.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Button variant="outline" onClick={() => setSubmitted(false)}>New Application</Button>
          <a href="/dashboard"><Button>Back to Dashboard <ArrowRight size={15} /></Button></a>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="Loans" subtitle="Competitive rates, fast decisions, no hidden fees" />

      {/* Products */}
      <div className="mb-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {PRODUCTS.map((p) => (
          <button
            key={p.id}
            onClick={() => setProduct(p)}
            className={cn(
              "rounded-2xl border p-4 text-left transition",
              product.id === p.id ? "border-brand bg-brand/5" : "border-line bg-navy-card hover:border-brand/40",
            )}
          >
            <span className={cn("mb-2 flex h-9 w-9 items-center justify-center rounded-xl", product.id === p.id ? "bg-brand text-navy" : "bg-brand/10 text-brand")}>
              <p.icon size={17} />
            </span>
            <div className="text-sm font-semibold text-ink-primary">{p.id}</div>
            <div className="text-xs text-ink-muted">from {p.apr}% APR</div>
          </button>
        ))}
      </div>

      <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
        <Card className="space-y-5">
          <CardHeader title={`${product.id} Loan`} subtitle={product.desc} />

          <div>
            <Label>Loan Amount (max {formatCurrency(product.max, "USD", { maximumFractionDigits: 0 })})</Label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-display text-lg font-semibold text-brand">$</span>
              <input type="number" aria-label="Loan amount" placeholder="0.00" className="ufg-input pl-8 text-lg font-bold tnum" value={amount} onChange={(e) => setAmount(e.target.value)} max={product.max} />
            </div>
          </div>

          <div>
            <Label>Repayment Term</Label>
            <Select value={term} onChange={(e) => setTerm(e.target.value)}>
              {["12", "24", "36", "48", "60", "84"].map((t) => (
                <option key={t} value={t}>{t} months</option>
              ))}
            </Select>
          </div>

          <div>
            <Label>Purpose</Label>
            <Input placeholder="e.g. Purchase a new excavator" value={purpose} onChange={(e) => setPurpose(e.target.value)} />
          </div>

          <Button
            className="w-full"
            onClick={() => {
              if (principal <= 0) return toast.error("Enter a loan amount");
              if (principal > product.max) return toast.error(`Maximum for ${product.id} is ${formatCurrency(product.max, "USD", { maximumFractionDigits: 0 })}`);
              setSubmitted(true);
            }}
          >
            <Landmark size={15} /> Apply for {product.id} Loan
          </Button>
        </Card>

        {/* Estimate */}
        <div className="space-y-5">
          <Card>
            <CardHeader title="Your estimate" />
            <div className="space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-ink-muted">APR</span><span className="font-medium text-ink-primary">{product.apr}%</span></div>
              <div className="flex justify-between"><span className="text-ink-muted">Term</span><span className="font-medium text-ink-primary">{term} months</span></div>
              <div className="my-2 h-px bg-line" />
              <div className="flex items-baseline justify-between">
                <span className="text-ink-muted">Monthly payment</span>
                <span className="font-display text-xl font-bold text-brand tnum">{formatCurrency(monthly)}</span>
              </div>
              <div className="flex justify-between"><span className="text-ink-muted">Total repayable</span><span className="font-medium text-ink-primary tnum">{formatCurrency(totalRepay)}</span></div>
            </div>
          </Card>
          <Card>
            <ul className="space-y-2.5 text-sm text-ink-secondary">
              {["No early repayment penalty", "Decision in as little as 24 hours", "Fixed monthly payments"].map((t) => (
                <li key={t} className="flex items-center gap-2.5">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand/15 text-brand"><CheckCircle2 size={12} /></span>
                  {t}
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}
