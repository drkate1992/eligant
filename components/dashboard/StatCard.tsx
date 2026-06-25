import { TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

export function StatCard({
  icon,
  iconColor,
  label,
  value,
  change,
  trend = "up",
}: {
  icon: React.ReactNode;
  iconColor: string;
  label: string;
  value: string;
  change?: string;
  trend?: "up" | "down";
}) {
  return (
    <div className="rounded-card border border-line bg-navy-card p-5 transition hover:border-brand/30">
      <div
        className="mb-3.5 flex h-9 w-9 items-center justify-center rounded-[10px]"
        style={{ backgroundColor: `${iconColor}1a`, color: iconColor }}
      >
        {icon}
      </div>
      <div className="text-xs text-ink-muted">{label}</div>
      <div className="mt-0.5 font-display text-2xl font-bold text-ink-primary tnum">
        {value}
      </div>
      {change && (
        <div
          className={cn(
            "mt-1 flex items-center gap-1 text-[11px]",
            trend === "up" ? "text-positive" : "text-negative",
          )}
        >
          {trend === "up" ? (
            <TrendingUp size={11} />
          ) : (
            <TrendingDown size={11} />
          )}
          {change}
        </div>
      )}
    </div>
  );
}
