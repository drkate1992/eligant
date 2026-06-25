import { cn } from "@/lib/utils";

const STATUS_STYLES: Record<string, string> = {
  COMPLETED: "bg-positive/10 text-positive border-positive/20",
  PROCESSING: "bg-brand/10 text-brand border-brand/20",
  PENDING: "bg-ink-muted/10 text-ink-secondary border-line",
  FAILED: "bg-negative/10 text-negative border-negative/20",
  REVERSED: "bg-negative/10 text-negative border-negative/20",
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wide",
        STATUS_STYLES[status] ?? STATUS_STYLES.PENDING,
      )}
    >
      {status.toLowerCase()}
    </span>
  );
}

export function Badge({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border border-line bg-white/[0.04] px-2.5 py-0.5 text-[11px] text-ink-secondary",
        className,
      )}
    >
      {children}
    </span>
  );
}
