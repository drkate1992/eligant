import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  ShieldCheck,
  Globe2,
  LineChart,
  Wallet,
  Send,
  Lock,
  Building2,
  CreditCard,
  PiggyBank,
  Star,
  Check,
  Landmark,
  BadgeCheck,
  Smartphone,
  Clock,
  Phone,
  Settings,
} from "lucide-react";
import { BrandBadge } from "@/components/shared/LogoMark";
import { Button } from "@/components/ui/Button";

const NAV = [
  { label: "Home", href: "#top" },
  { label: "About", href: "#company" },
  { label: "Services", href: "#services" },
  { label: "Contact", href: "#contact" },
];

const STATS = [
  { v: "$2.5B+", l: "Assets under management" },
  { v: "50K+", l: "Customers worldwide" },
  { v: "180+", l: "Countries supported" },
  { v: "99.98%", l: "Uptime SLA" },
];

const SERVICES = [
  { icon: Wallet, title: "Personal Banking", body: "Checking and savings with no hidden fees and instant insights." },
  { icon: Building2, title: "Business Banking", body: "Run payroll, pay vendors, and manage cash flow at any scale." },
  { icon: Send, title: "Global Transfers", body: "Move money internally or internationally with live FX rates." },
  { icon: CreditCard, title: "Cards", body: "Issue virtual debit cards instantly. Freeze and control in a tap." },
  { icon: LineChart, title: "Wealth & Investments", body: "Track portfolio performance and grow your holdings over time." },
  { icon: PiggyBank, title: "Savings Goals", body: "Automate saving toward what matters with progress tracking." },
];

const RATES = [
  { label: "High-Yield Savings", value: "4.30%", unit: "APY", note: "On all balances, compounded daily" },
  { label: "Business Money Market", value: "4.65%", unit: "APY", note: "For balances over $100k" },
  { label: "Personal Loan", value: "6.99%", unit: "APR", note: "Fixed rate, terms up to 60 months" },
];

const TESTIMONIALS = [
  { quote: "The fastest business banking I've used. Wires that took days now settle in minutes.", name: "Marcus Bell", role: "Founder, Bell & Co.", avatar: "/avatars/marcus.jpg" },
  { quote: "Switching was effortless and the mobile experience is genuinely best-in-class.", name: "Sofia Ramirez", role: "CFO, Northwind Inc.", avatar: "/avatars/sofia.jpg" },
  { quote: "Transparent fees, real support, and rates that actually beat my old bank.", name: "Daniel Cho", role: "Managing Partner", avatar: "/avatars/daniel.jpg" },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-navy">
      {/* ── Nav ── */}
      <header
        id="top"
        className="sticky top-0 z-50 border-b border-line bg-navy-mid/95 backdrop-blur"
      >
        <div className="mx-auto flex max-w-6xl items-center gap-4 px-5 py-3.5">
          <div className="flex flex-1 items-center">
            <BrandBadge height={38} />
          </div>
          <nav className="hidden items-center gap-8 md:flex">
            {NAV.map((n) => (
              <a
                key={n.label}
                href={n.href}
                className="text-sm font-medium text-ink-secondary transition hover:text-ink-primary"
              >
                {n.label}
              </a>
            ))}
          </nav>
          <div className="flex flex-1 items-center justify-end gap-2.5">
            <button
              aria-label="Settings"
              className="hidden h-9 w-9 items-center justify-center rounded-lg border border-line text-ink-secondary transition hover:border-brand hover:text-brand sm:flex"
            >
              <Settings size={16} />
            </button>
            <Link href="/login">
              <Button variant="ghost" size="sm">
                Login
              </Button>
            </Link>
            <Link href="/register">
              <Button size="sm">Open Account</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* ── Hero (full-bleed background) ── */}
      <section className="relative isolate min-h-[640px] overflow-hidden lg:min-h-[88vh]">
        {/* Background photo */}
        <Image
          src="/hero.jpg"
          alt="A couple managing their finances together on a phone"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        {/* Navy + green brand overlay for legibility */}
        <div className="absolute inset-0 bg-gradient-to-r from-navy via-navy/85 to-navy/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/30 to-navy/40" />
        <div className="absolute inset-0 bg-gradient-to-br from-brand/15 to-transparent" />

        {/* Foreground content */}
        <div className="relative mx-auto flex min-h-[640px] max-w-6xl flex-col justify-center px-5 pb-28 pt-20 lg:min-h-[88vh] lg:pb-32">
          <div className="max-w-xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-3.5 py-1.5 text-xs text-brand-light backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full bg-brand" />
              FDIC insured · Member-owned banking
            </div>
            <h1 className="font-display text-5xl font-extrabold leading-[1.05] tracking-tight text-white sm:text-6xl">
              EligantWealth
            </h1>
            <p className="mt-5 max-w-md text-lg leading-relaxed text-ink-secondary">
              We do banking differently. We believe that people come first, and
              that everyone deserves a great experience every step of the way.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link href="/register">
                <Button size="lg">
                  Open Account Today <ArrowRight size={18} />
                </Button>
              </Link>
              <Link href="/login">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-white/25 bg-white/[0.06] text-white backdrop-blur hover:border-white/50 hover:text-white"
                >
                  Login to Banking
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Language pill (decorative) */}
        <div className="absolute bottom-5 left-5 z-10 hidden items-center gap-2 rounded-full border border-white/15 bg-navy/70 px-3 py-1.5 text-xs text-ink-secondary backdrop-blur sm:flex">
          <Globe2 size={13} className="text-brand" /> EN
        </div>

      </section>

      {/* Info cards overlapping the hero bottom */}
      <div className="relative z-10 -mt-14 mb-4 px-5">
        <div className="mx-auto grid max-w-6xl gap-4 sm:grid-cols-3">
          {[
            { icon: Landmark, label: "Routing #", value: "251480576" },
            { icon: Clock, label: "Branch Hours", value: "Mon–Fri 9AM–5PM" },
            { icon: Phone, label: "24/7 Support", value: "1-800-BANKING" },
          ].map((c) => (
            <div
              key={c.label}
              className="flex items-center justify-between gap-4 rounded-2xl border border-line bg-navy-card/95 px-5 py-4 shadow-2xl backdrop-blur"
            >
              <div>
                <div className="text-[11px] uppercase tracking-wider text-ink-muted">
                  {c.label}
                </div>
                <div className="mt-0.5 font-display text-xl font-bold text-ink-primary tnum">
                  {c.value}
                </div>
              </div>
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand/15 text-brand">
                <c.icon size={20} />
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Stats bar ── */}
      <section className="border-b border-line bg-navy-mid">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-5 py-12 lg:grid-cols-4">
          {STATS.map((s) => (
            <div key={s.l} className="text-center lg:text-left">
              <div className="font-display text-3xl font-extrabold text-brand-light tnum sm:text-4xl">
                {s.v}
              </div>
              <div className="mt-1 text-xs text-ink-muted">{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Trust strip ── */}
      <section className="border-b border-line">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-10 gap-y-3 px-5 py-6 text-xs text-ink-muted">
          {[
            { icon: Landmark, label: "FDIC Insured" },
            { icon: Lock, label: "256-bit SSL encryption" },
            { icon: BadgeCheck, label: "SOC 2 Type II" },
            { icon: Smartphone, label: "2FA protected" },
          ].map((b) => (
            <span key={b.label} className="flex items-center gap-2">
              <b.icon size={15} className="text-brand" /> {b.label}
            </span>
          ))}
        </div>
      </section>

      {/* ── Services ── */}
      <section id="services" className="mx-auto max-w-6xl px-5 py-20">
        <div className="mb-12 max-w-2xl">
          <span className="text-xs font-semibold uppercase tracking-[2px] text-brand">
            What we offer
          </span>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-ink-primary sm:text-4xl">
            Everything your money needs
          </h2>
          <p className="mt-3 text-ink-secondary">
            A complete banking experience for individuals and businesses,
            refined to the last detail.
          </p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((f) => (
            <div
              key={f.title}
              className="group rounded-2xl border border-line bg-navy-card p-6 transition hover:border-brand/40 hover:bg-navy-card/80"
            >
              <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-brand/10 text-brand transition group-hover:bg-brand group-hover:text-white">
                <f.icon size={22} />
              </span>
              <h3 className="font-display text-lg font-bold text-ink-primary">
                {f.title}
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-secondary">
                {f.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Rates ── */}
      <section id="rates" className="border-y border-line bg-navy-mid">
        <div className="mx-auto max-w-6xl px-5 py-20">
          <div className="mb-12 max-w-2xl">
            <span className="text-xs font-semibold uppercase tracking-[2px] text-brand">
              Competitive rates
            </span>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-ink-primary sm:text-4xl">
              Rates that work harder for you
            </h2>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {RATES.map((r) => (
              <div
                key={r.label}
                className="rounded-2xl border border-line bg-navy-card p-7"
              >
                <div className="text-sm text-ink-secondary">{r.label}</div>
                <div className="mt-3 flex items-baseline gap-1.5">
                  <span className="font-display text-5xl font-extrabold text-brand-light tnum">
                    {r.value}
                  </span>
                  <span className="text-sm font-semibold text-ink-muted">
                    {r.unit}
                  </span>
                </div>
                <p className="mt-3 text-xs text-ink-muted">{r.note}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Business banking ── */}
      <section className="mx-auto grid max-w-6xl items-center gap-12 px-5 py-20 lg:grid-cols-2">
        <div>
          <div className="mb-4 inline-flex items-center gap-2 text-[11px] uppercase tracking-[2px] text-brand">
            <span className="h-px w-6 bg-brand" />
            For Business
          </div>
          <h2 className="font-display text-3xl font-bold leading-tight text-ink-primary sm:text-4xl">
            Business banking built for growth
          </h2>
          <p className="mt-4 max-w-lg text-ink-secondary">
            From your first hire to your next expansion, manage payroll, vendor
            payments, and cash flow with tools designed for modern teams.
          </p>
          <ul className="mt-6 space-y-3">
            {[
              "Same-day payroll and vendor payouts",
              "Multi-user access with role controls",
              "Real-time cash-flow insights",
            ].map((p) => (
              <li key={p} className="flex items-center gap-3 text-sm text-ink-secondary">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand/15 text-brand">
                  <Check size={13} />
                </span>
                {p}
              </li>
            ))}
          </ul>
          <Link href="/register" className="mt-7 inline-block">
            <Button size="lg">
              Open a business account <ArrowRight size={18} />
            </Button>
          </Link>
        </div>
        <div className="relative order-first lg:order-last">
          <Image
            src="/business.jpg"
            alt="Two business owners reviewing their finances on a laptop"
            width={1200}
            height={800}
            className="h-full w-full rounded-3xl border border-line object-cover shadow-2xl"
          />
          <div className="pointer-events-none absolute inset-0 rounded-3xl bg-gradient-to-tl from-navy/40 to-transparent" />
        </div>
      </section>

      {/* ── Bonus offer ── */}
      <section className="mx-auto max-w-6xl px-5 py-20">
        <div className="relative overflow-hidden rounded-3xl border border-brand/20 bg-gradient-to-br from-brand/15 via-navy-card to-navy-light p-10 sm:p-14">
          <div
            className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full"
            style={{ background: "radial-gradient(circle, rgba(28,166,95,0.2) 0%, transparent 70%)" }}
          />
          <div className="relative flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-brand/15 px-3 py-1 text-xs font-semibold text-brand-light">
                Limited time
              </div>
              <h2 className="mt-4 font-display text-3xl font-bold text-ink-primary sm:text-4xl">
                Get a <span className="text-brand-light">$200 bonus</span> when
                you open an account
              </h2>
              <p className="mt-3 max-w-lg text-ink-secondary">
                Open a new checking account and set up direct deposit to claim
                your welcome bonus. No minimum balance required.
              </p>
            </div>
            <Link href="/register" className="shrink-0">
              <Button size="lg">
                Claim Offer <ArrowRight size={18} />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── People-first ── */}
      <section className="border-y border-line bg-navy-mid">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 py-20 lg:grid-cols-2">
          <div className="relative">
            <Image
              src="/people.jpg"
              alt="A EligantWealth relationship manager greeting a client"
              width={1200}
              height={800}
              className="h-full w-full rounded-3xl border border-line object-cover shadow-2xl"
            />
            <div className="pointer-events-none absolute inset-0 rounded-3xl bg-gradient-to-tr from-navy/40 to-transparent" />
          </div>
          <div>
            <div className="mb-4 inline-flex items-center gap-2 text-[11px] uppercase tracking-[2px] text-brand">
              <span className="h-px w-6 bg-brand" />
              People First
            </div>
            <h2 className="font-display text-3xl font-bold leading-tight text-ink-primary sm:text-4xl">
              We do banking differently
            </h2>
            <p className="mt-4 max-w-lg text-ink-secondary">
              Everyone deserves a great experience every step of the way. From
              your first transfer to your largest acquisition, a dedicated team
              is with you — combining private-banking attention with technology
              that never sleeps.
            </p>
            <ul className="mt-6 space-y-3">
              {[
                "Dedicated relationship managers",
                "24/7 priority support, worldwide",
                "Transparent pricing — no hidden fees",
              ].map((p) => (
                <li key={p} className="flex items-center gap-3 text-sm text-ink-secondary">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand/15 text-brand">
                    <Check size={13} />
                  </span>
                  {p}
                </li>
              ))}
            </ul>
            <Link href="/register" className="mt-7 inline-block">
              <Button size="lg">
                Become a member <ArrowRight size={18} />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section id="company" className="border-y border-line bg-navy-mid">
        <div className="mx-auto max-w-6xl px-5 py-20">
          <div className="mb-12 max-w-2xl">
            <span className="text-xs font-semibold uppercase tracking-[2px] text-brand">
              Loved by customers
            </span>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-ink-primary sm:text-4xl">
              Trusted by 50,000+ members
            </h2>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {TESTIMONIALS.map((t) => (
              <div
                key={t.name}
                className="flex flex-col rounded-2xl border border-line bg-navy-card p-6"
              >
                <div className="mb-3 flex gap-0.5 text-brand">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={14} fill="currentColor" />
                  ))}
                </div>
                <p className="flex-1 text-sm leading-relaxed text-ink-secondary">
                  “{t.quote}”
                </p>
                <div className="mt-5 flex items-center gap-3">
                  <Image
                    src={t.avatar}
                    alt={t.name}
                    width={40}
                    height={40}
                    className="h-9 w-9 rounded-full object-cover ring-2 ring-brand/30"
                  />
                  <div>
                    <div className="text-sm font-medium text-ink-primary">
                      {t.name}
                    </div>
                    <div className="text-xs text-ink-muted">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="mx-auto max-w-6xl px-5 py-20">
        <div className="relative overflow-hidden rounded-3xl border border-line bg-gradient-to-br from-navy-card via-[#1a2f4a] to-navy-light p-12 text-center sm:p-16">
          <div
            className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full"
            style={{ background: "radial-gradient(circle, rgba(28,166,95,0.14) 0%, transparent 70%)" }}
          />
          <h2 className="relative font-display text-3xl font-bold tracking-tight text-ink-primary sm:text-5xl">
            Ready to bank brilliantly?
          </h2>
          <p className="relative mx-auto mt-4 max-w-md text-ink-secondary">
            Join EligantWealth today — it takes less than two minutes.
          </p>
          <Link href="/register" className="relative mt-8 inline-block">
            <Button size="lg">
              Create your account <ArrowRight size={18} />
            </Button>
          </Link>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-line">
        <div className="mx-auto max-w-6xl px-5 py-14">
          <div className="grid gap-10 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
            <div>
              <BrandBadge height={46} />
              <p className="mt-4 max-w-xs text-sm text-ink-muted">
                Private banking with global reach. Secure, transparent, and
                built around you.
              </p>
            </div>
            {[
              { h: "Products", links: ["Personal Banking", "Business Banking", "Cards", "Investments"] },
              { h: "Company", links: ["About", "Careers", "Press", "Contact"] },
              { h: "Legal", links: ["Privacy", "Terms", "Security", "Disclosures"] },
            ].map((col) => (
              <div key={col.h}>
                <div className="mb-3 text-xs font-semibold uppercase tracking-wider text-ink-muted">
                  {col.h}
                </div>
                <ul className="space-y-2">
                  {col.links.map((l) => (
                    <li key={l}>
                      <span className="cursor-pointer text-sm text-ink-secondary transition hover:text-brand">
                        {l}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-line pt-8 sm:flex-row">
            <p className="text-xs text-ink-muted">
              © 2026 EligantWealth. All rights reserved. Member FDIC.
            </p>
            <div className="flex gap-5 text-xs text-ink-muted">
              <span className="flex items-center gap-1.5">
                <ShieldCheck size={13} className="text-brand" /> 256-bit SSL
              </span>
              <span className="flex items-center gap-1.5">
                <Lock size={13} className="text-brand" /> 2FA Protected
              </span>
              <span className="flex items-center gap-1.5">
                <Globe2 size={13} className="text-brand" /> 180+ Countries
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
