"use client";

import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-5 bg-navy px-5 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-negative/10 text-negative">
        <AlertTriangle size={26} />
      </span>
      <div>
        <h1 className="font-display text-2xl font-semibold text-ink-primary">
          Something went wrong
        </h1>
        <p className="mt-2 max-w-sm text-sm text-ink-muted">
          An unexpected error occurred. Please try again — if it persists,
          contact support.
        </p>
      </div>
      <div className="flex gap-3">
        <Button onClick={reset}>Try Again</Button>
        <a href="/dashboard">
          <Button variant="outline">Go to Dashboard</Button>
        </a>
      </div>
    </div>
  );
}
