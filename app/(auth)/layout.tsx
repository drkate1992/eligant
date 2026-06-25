import { BrandBadge } from "@/components/shared/LogoMark";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-navy">
      {/* Brand panel — desktop only */}
      <div className="relative hidden flex-1 flex-col justify-between overflow-hidden border-r border-line bg-navy-mid p-12 lg:flex">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(rgba(28,166,95,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(28,166,95,0.04) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
        <div
          className="pointer-events-none absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(28,166,95,0.08) 0%, transparent 65%)",
          }}
        />
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-brand/10 animate-pulseRing" />

        <div className="relative z-10">
          <BrandBadge height={48} />
        </div>

        <div className="relative z-10">
          <div className="mb-5 inline-flex items-center gap-2 text-[11px] uppercase tracking-[2px] text-brand">
            <span className="h-px w-6 bg-brand" />
            Private Banking · Global Reach
          </div>
          <h1 className="mb-4 font-display text-5xl font-semibold leading-[1.1] text-ink-primary">
            Your wealth,
            <br />
            <em className="italic text-brand-light">intelligently</em>
            <br />
            managed.
          </h1>
          <p className="max-w-sm text-[15px] leading-relaxed text-ink-secondary">
            Access your full financial portfolio, initiate international
            transfers, and track every transaction — all in one secure,
            elegantly designed platform.
          </p>
        </div>

        <div className="relative z-10 flex gap-8">
          {[
            { v: "$2.4B+", l: "Assets Under Management" },
            { v: "180+", l: "Countries Covered" },
            { v: "99.98%", l: "Uptime SLA" },
          ].map((s, i) => (
            <div key={s.l} className="flex gap-8">
              {i > 0 && <div className="w-px bg-line" />}
              <div>
                <div className="mb-1 font-display text-2xl font-bold leading-none text-brand-light">
                  {s.v}
                </div>
                <div className="text-[11px] text-ink-muted">{s.l}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Form panel */}
      <div className="flex w-full flex-col items-center justify-center overflow-y-auto p-7 sm:p-12 lg:w-[520px] lg:flex-shrink-0">
        {/* Logo for mobile (brand panel is hidden < lg) */}
        <div className="mb-8 lg:hidden">
          <BrandBadge height={44} />
        </div>
        {children}
      </div>
    </div>
  );
}
