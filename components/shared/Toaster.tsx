"use client";

import { CheckCircle2, XCircle, Info, X } from "lucide-react";
import { useToastStore } from "@/lib/toast-store";
import { cn } from "@/lib/utils";

const icons = {
  success: CheckCircle2,
  error: XCircle,
  info: Info,
};

const accents = {
  success: "border-positive/30 text-positive",
  error: "border-negative/30 text-negative",
  info: "border-line text-brand",
};

export function Toaster() {
  const { toasts, dismiss } = useToastStore();

  return (
    <div className="pointer-events-none fixed bottom-5 right-5 z-[200] flex w-[min(360px,calc(100vw-2.5rem))] flex-col gap-2">
      {toasts.map((t) => {
        const Icon = icons[t.variant];
        return (
          <div
            key={t.id}
            className={cn(
              "pointer-events-auto flex items-start gap-3 rounded-xl border bg-navy-mid/95 p-4 shadow-xl backdrop-blur fade-up",
              accents[t.variant],
            )}
          >
            <Icon size={18} className="mt-0.5 shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-ink-primary">{t.title}</p>
              {t.description && (
                <p className="mt-0.5 text-xs text-ink-secondary">
                  {t.description}
                </p>
              )}
            </div>
            <button
              onClick={() => dismiss(t.id)}
              className="text-ink-muted transition hover:text-ink-primary"
            >
              <X size={16} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
