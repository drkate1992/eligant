import { Skeleton } from "./States";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils";

/** Page title + subtitle placeholder. */
export function SkelHeader({ action = false }: { action?: boolean }) {
  return (
    <div className="mb-6 flex items-end justify-between gap-4">
      <div className="space-y-2">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-64" />
      </div>
      {action && <Skeleton className="h-10 w-36 rounded-xl" />}
    </div>
  );
}

/** Row of 4 stat cards. */
export function SkelStatRow({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <Card key={i} className="space-y-3">
          <Skeleton className="h-9 w-9 rounded-[10px]" />
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-7 w-28" />
        </Card>
      ))}
    </div>
  );
}

/** Generic card with a header + a body block of given height. */
export function SkelCard({
  bodyHeight = "h-48",
  className,
}: {
  bodyHeight?: string;
  className?: string;
}) {
  return (
    <Card className={cn("space-y-4", className)}>
      <div className="space-y-2">
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-3 w-28" />
      </div>
      <Skeleton className={cn("w-full rounded-xl", bodyHeight)} />
    </Card>
  );
}

/** A list of full-width rows (table / transaction list). */
export function SkelRows({ rows = 6 }: { rows?: number }) {
  return (
    <div className="space-y-2.5">
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={i} className="h-14 w-full" />
      ))}
    </div>
  );
}

/** Grid of cards (accounts, goals, etc.). */
export function SkelCardGrid({
  count = 3,
  height = "h-44",
}: {
  count?: number;
  height?: string;
}) {
  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton key={i} className={cn("w-full", height)} />
      ))}
    </div>
  );
}
