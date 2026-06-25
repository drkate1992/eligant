import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("skeleton rounded-lg", className)} />;
}

export function LoadingSpinner({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center justify-center py-10", className)}>
      <Loader2 className="animate-spin text-brand" size={24} />
    </div>
  );
}

export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 px-6 py-12 text-center">
      {icon && (
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/[0.04] text-brand">
          {icon}
        </div>
      )}
      <div>
        <p className="text-sm font-medium text-ink-primary">{title}</p>
        {description && (
          <p className="mt-1 text-xs text-ink-muted">{description}</p>
        )}
      </div>
      {action}
    </div>
  );
}
