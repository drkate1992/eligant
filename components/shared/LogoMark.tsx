import Image from "next/image";
import { cn } from "@/lib/utils";

/** Gold "U" monogram tile — used in dark areas (sidebar, auth panels). */
export function LogoMark({
  size = 40,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-[10px] bg-gradient-to-br from-brand to-brand-dim font-display font-bold text-white",
        className,
      )}
      style={{ width: size, height: size, fontSize: size * 0.5 }}
    >
      U
    </div>
  );
}

export function LogoLockup({
  className,
  subtitle = "Group",
}: {
  className?: string;
  subtitle?: string;
}) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <LogoMark size={40} />
      <div className="flex flex-col">
        <span className="font-display text-base font-semibold leading-tight text-ink-primary">
          EligantWealth
        </span>
        <span className="text-[10px] uppercase tracking-[1.5px] text-brand">
          {subtitle}
        </span>
      </div>
    </div>
  );
}

/**
 * The EligantWealth brand badge for dark areas (landing header/footer, auth panels).
 * The logo artwork (public/logo-dark.png) has dark lettering, so it sits on a
 * white rounded chip to stay legible on the dark navy theme. `height` is the
 * overall chip height in px.
 */
const LOGO_ASPECT = 500 / 256; // public/logo-dark.png dimensions

export function BrandBadge({
  height = 40,
  className,
}: {
  height?: number;
  className?: string;
}) {
  const logoH = Math.round(height * 0.66);
  const logoW = Math.round(logoH * LOGO_ASPECT);
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-xl bg-white shadow-sm ring-1 ring-black/5",
        className,
      )}
      style={{ height, paddingInline: Math.round(height * 0.22) }}
    >
      <Image
        src="/logo-dark.png"
        alt="EligantWealth"
        width={logoW}
        height={logoH}
        priority
        style={{ height: logoH, width: "auto" }}
        className="object-contain"
      />
    </span>
  );
}
