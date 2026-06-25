"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-xl font-medium transition disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40",
  {
    variants: {
      variant: {
        primary:
          "bg-gradient-to-br from-brand to-brand-dim text-white font-semibold hover:-translate-y-px hover:shadow-[0_10px_32px_rgba(28,166,95,0.35)] disabled:hover:translate-y-0 disabled:hover:shadow-none",
        outline:
          "border border-line bg-transparent text-ink-primary hover:border-brand hover:text-brand",
        ghost: "text-ink-secondary hover:bg-white/5 hover:text-ink-primary",
        danger:
          "border border-negative/30 bg-negative/10 text-negative hover:bg-negative/20",
        subtle: "bg-navy-mid text-ink-secondary hover:text-ink-primary border border-line",
      },
      size: {
        sm: "px-3 py-2 text-xs",
        md: "px-5 py-3 text-sm",
        lg: "px-6 py-3.5 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, loading, children, disabled, ...props }, ref) => (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    >
      {loading && <Loader2 size={16} className="animate-spin" />}
      {children}
    </button>
  ),
);
Button.displayName = "Button";
