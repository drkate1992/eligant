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
          Unity Financial
        </span>
        <span className="text-[10px] uppercase tracking-[1.5px] text-brand">
          {subtitle}
        </span>
      </div>
    </div>
  );
}

/**
 * The Unity Financial Group logo, dark-theme variant. Uses /logo-dark.png
 * (navy artwork recolored to cream, green kept, transparent background — see
 * scripts/process-logo.mjs) so it blends directly on the dark navy theme with
 * no white tile. `height` is the rendered height in px.
 */
export function BrandBadge({
  height = 40,
  className,
}: {
  height?: number;
  className?: string;
}) {
  const width = Math.round(height * (781 / 606)); // cropped logo aspect ratio
  return (
    <Image
      src="/logo-dark.png"
      alt="Unity Financial Group"
      width={width}
      height={height}
      priority
      className={cn("object-contain", className)}
    />
  );
}
