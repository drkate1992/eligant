"use client";

import { useState } from "react";
import { HandCoins, Sprout, Building2, Users, CheckCircle2, ArrowRight, X } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input, Label } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { toast } from "@/lib/toast-store";
import { formatCurrency } from "@/lib/utils";

const GRANTS = [
  { id: "small-biz", name: "Small Business Growth Grant", icon: Building2, amount: 25000, tag: "Business", desc: "Working capital for contractors and small firms scaling operations.", color: "#1ca65f" },
  { id: "green", name: "Green Energy Initiative", icon: Sprout, amount: 40000, tag: "Sustainability", desc: "Fund solar, EV equipment and energy-efficient upgrades.", color: "#34c47b" },
  { id: "community", name: "Community Development Fund", icon: Users, amount: 15000, tag: "Community", desc: "Support local hiring, training and neighborhood projects.", color: "#6a8fc8" },
  { id: "startup", name: "Startup Accelerator Grant", icon: HandCoins, amount: 50000, tag: "Startup", desc: "Non-dilutive funding for early-stage ventures.", color: "#c8a76a" },
];

export default function GrantsPage() {
  const [selected, setSelected] = useState<(typeof GRANTS)[number] | null>(null);
  const [form, setForm] = useState({ org: "", amount: "", reason: "" });
  const [submitted, setSubmitted] = useState(false);

  function apply() {
    if (!form.org) return toast.error("Enter your organization / project name");
    if (!form.reason) return toast.error("Tell us how you'll use the grant");
    setSelected(null);
    setSubmitted(true);
    setForm({ org: "", amount: "", reason: "" });
  }

  return (
    <div>
      <PageHeader title="Grants" subtitle="Non-repayable funding to help you and your community thrive" />

      {submitted && (
        <Card className="mb-5 flex items-start gap-3 border-positive/30 bg-positive/5">
          <CheckCircle2 size={20} className="mt-0.5 shrink-0 text-positive" />
          <div className="flex-1">
            <div className="font-semibold text-ink-primary">Application submitted</div>
            <p className="text-sm text-ink-muted">Our grants committee reviews applications monthly. You&apos;ll hear back within 30 days.</p>
          </div>
          <button onClick={() => setSubmitted(false)} className="text-ink-muted hover:text-ink-primary"><X size={16} /></button>
        </Card>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        {GRANTS.map((g) => (
          <Card key={g.id} className="flex flex-col">
            <div className="flex items-start justify-between">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl" style={{ backgroundColor: `${g.color}1a`, color: g.color }}>
                <g.icon size={20} />
              </span>
              <span className="rounded-full bg-navy-mid px-2.5 py-1 text-[11px] font-medium text-ink-secondary">{g.tag}</span>
            </div>
            <h3 className="mt-3 font-display text-lg font-semibold text-ink-primary">{g.name}</h3>
            <p className="mt-1 flex-1 text-sm text-ink-muted">{g.desc}</p>
            <div className="mt-4 flex items-center justify-between">
              <div>
                <div className="text-[11px] uppercase tracking-wider text-ink-muted">Up to</div>
                <div className="font-display text-xl font-bold text-brand tnum">{formatCurrency(g.amount, "USD", { maximumFractionDigits: 0 })}</div>
              </div>
              <Button variant="outline" onClick={() => { setSelected(g); setForm((f) => ({ ...f, amount: String(g.amount) })); }}>
                Apply <ArrowRight size={14} />
              </Button>
            </div>
          </Card>
        ))}
      </div>

      <Modal open={!!selected} onClose={() => setSelected(null)} title={selected?.name ?? ""} subtitle={`Apply for up to ${selected ? formatCurrency(selected.amount, "USD", { maximumFractionDigits: 0 }) : ""}`}>
        <div className="space-y-4">
          <div>
            <Label>Organization / Project Name</Label>
            <Input placeholder="Your business or project" value={form.org} onChange={(e) => setForm((f) => ({ ...f, org: e.target.value }))} />
          </div>
          <div>
            <Label>Requested Amount</Label>
            <Input type="number" value={form.amount} onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))} />
          </div>
          <div>
            <Label>How will you use this grant?</Label>
            <textarea
              className="ufg-input min-h-[96px] resize-none"
              placeholder="Describe your plan and expected impact"
              value={form.reason}
              onChange={(e) => setForm((f) => ({ ...f, reason: e.target.value }))}
            />
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setSelected(null)} className="flex-1">Cancel</Button>
            <Button onClick={apply} className="flex-1"><HandCoins size={15} /> Submit Application</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
