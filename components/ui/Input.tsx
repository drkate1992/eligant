"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, icon, error, ...props }, ref) => (
    <div className="w-full">
      <div className="relative">
        {icon && (
          <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-muted">
            {icon}
          </span>
        )}
        <input
          ref={ref}
          className={cn(
            "w-full rounded-xl border border-white/10 bg-navy-card px-4 py-3 text-sm text-ink-primary outline-none transition placeholder:text-ink-muted focus:border-brand focus:ring-2 focus:ring-brand/10",
            icon && "pl-10",
            error && "border-negative/50 focus:border-negative focus:ring-negative/10",
            className,
          )}
          {...props}
        />
      </div>
      {error && <p className="mt-1.5 text-xs text-negative">{error}</p>}
    </div>
  ),
);
Input.displayName = "Input";

export const Label = ({
  className,
  ...props
}: React.LabelHTMLAttributes<HTMLLabelElement>) => (
  <label
    className={cn(
      "mb-2 block text-[11px] font-medium uppercase tracking-wider text-ink-muted",
      className,
    )}
    {...props}
  />
);

export const Select = React.forwardRef<
  HTMLSelectElement,
  React.SelectHTMLAttributes<HTMLSelectElement>
>(({ className, children, ...props }, ref) => (
  <select
    ref={ref}
    className={cn(
      "w-full appearance-none rounded-xl border border-white/10 bg-navy-card bg-[url('data:image/svg+xml,%3Csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20width=%2712%27%20height=%2712%27%20viewBox=%270%200%2024%2024%27%20fill=%27none%27%20stroke=%27%236a7f96%27%20stroke-width=%272%27%3E%3Cpath%20d=%27M6%209l6%206%206-6%27/%3E%3C/svg%3E')] bg-[right_14px_center] bg-no-repeat px-4 py-3 pr-10 text-sm text-ink-primary outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/10",
      className,
    )}
    {...props}
  >
    {children}
  </select>
));
Select.displayName = "Select";
