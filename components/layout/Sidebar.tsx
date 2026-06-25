"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { MoreVertical, LogOut } from "lucide-react";
import { useState } from "react";
import { NAV_ITEMS } from "@/lib/nav";
import { LogoLockup } from "@/components/shared/LogoMark";
import { initialsFromName, cn } from "@/lib/utils";

export function Sidebar({
  open,
  onNavigate,
  user,
}: {
  open: boolean;
  onNavigate: () => void;
  user: { name: string; email: string };
}) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  let lastGroup: string | undefined;

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 bottom-0 z-[100] flex w-[260px] flex-col border-r border-line bg-navy-mid transition-transform duration-300 lg:translate-x-0",
        open ? "translate-x-0" : "-translate-x-full",
      )}
    >
      <div className="border-b border-line px-6 py-6">
        <LogoLockup />
      </div>

      <nav className="flex-1 overflow-y-auto px-3.5 py-5">
        {NAV_ITEMS.map((item) => {
          const active =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href)) ||
            (item.label === "Settings" && pathname.startsWith("/settings"));
          const showGroup = item.group && item.group !== lastGroup;
          lastGroup = item.group ?? lastGroup;
          const Icon = item.icon;
          return (
            <div key={item.href}>
              {showGroup && (
                <div className="mb-2 mt-5 px-2.5 text-[10px] uppercase tracking-[1.8px] text-ink-muted">
                  {item.group}
                </div>
              )}
              <Link
                href={item.href}
                onClick={onNavigate}
                className={cn(
                  "mb-0.5 flex items-center gap-3 rounded-[10px] px-3.5 py-2.5 text-sm transition",
                  active
                    ? "border border-brand/20 bg-gradient-to-br from-brand/15 to-brand/5 text-brand-light"
                    : "text-ink-secondary hover:bg-white/[0.04] hover:text-ink-primary",
                )}
              >
                <Icon size={18} className="shrink-0" />
                {item.label}
                {item.badge && (
                  <span className="ml-auto rounded-full bg-brand px-1.5 py-0.5 text-[10px] font-bold text-white">
                    {item.badge}
                  </span>
                )}
              </Link>
            </div>
          );
        })}
      </nav>

      <div className="relative border-t border-line p-3.5">
        {menuOpen && (
          <div className="absolute bottom-[68px] left-3.5 right-3.5 overflow-hidden rounded-xl border border-line bg-navy-card shadow-xl">
            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="flex w-full items-center gap-2 px-4 py-3 text-sm text-ink-secondary transition hover:bg-white/5 hover:text-negative"
            >
              <LogOut size={15} /> Sign out
            </button>
          </div>
        )}
        <button
          onClick={() => setMenuOpen((s) => !s)}
          className="flex w-full items-center gap-3 rounded-[10px] p-2.5 text-left transition hover:bg-white/[0.04]"
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-gradient-to-br from-brand to-brand-dim font-display text-sm font-bold text-white">
            {initialsFromName(user.name)}
          </div>
          <div className="min-w-0 flex-1">
            <div className="truncate text-[13px] font-medium text-ink-primary">
              {user.name}
            </div>
            <div className="truncate text-[11px] text-ink-muted">
              Premium Member
            </div>
          </div>
          <MoreVertical size={16} className="text-ink-muted" />
        </button>
      </div>
    </aside>
  );
}
