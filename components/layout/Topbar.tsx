"use client";

import { useState } from "react";
import { Menu, Search, Bell, Check } from "lucide-react";
import { useNotifications, useMarkNotificationsRead } from "@/hooks/useMisc";
import { greeting, initialsFromName, formatDate, cn } from "@/lib/utils";

export function Topbar({
  onMenu,
  user,
}: {
  onMenu: () => void;
  user: { name: string; firstName: string | null };
}) {
  const [bellOpen, setBellOpen] = useState(false);
  const { data } = useNotifications();
  const markRead = useMarkNotificationsRead();
  const unread = data?.unread ?? 0;
  const firstName = user.firstName ?? user.name?.split(" ")[0] ?? "there";

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between border-b border-line bg-navy px-5 py-4 sm:px-8">
      <div className="flex items-center gap-3.5">
        <button
          onClick={onMenu}
          className="flex h-10 w-10 items-center justify-center rounded-[10px] border border-line bg-navy-card text-ink-secondary lg:hidden"
        >
          <Menu size={20} />
        </button>
        <div>
          <h1 className="font-display text-xl font-semibold text-ink-primary sm:text-2xl">
            {greeting()}, {firstName} <span className="text-brand">✦</span>
          </h1>
          <p className="mt-0.5 text-xs text-ink-muted">
            {formatDate(new Date())} · Account in good standing
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button className="hidden h-10 w-10 items-center justify-center rounded-[10px] border border-line bg-navy-card text-ink-secondary transition hover:border-brand hover:text-brand sm:flex">
          <Search size={18} />
        </button>
        <div className="relative">
          <button
            onClick={() => setBellOpen((s) => !s)}
            className="relative flex h-10 w-10 items-center justify-center rounded-[10px] border border-line bg-navy-card text-ink-secondary transition hover:border-brand hover:text-brand"
          >
            <Bell size={18} />
            {unread > 0 && (
              <span className="absolute right-1.5 top-1.5 h-2.5 w-2.5 rounded-full border-2 border-navy bg-brand" />
            )}
          </button>

          {bellOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setBellOpen(false)}
              />
              <div className="absolute right-0 top-12 z-50 w-80 overflow-hidden rounded-xl border border-line bg-navy-card shadow-2xl">
                <div className="flex items-center justify-between border-b border-line px-4 py-3">
                  <span className="text-sm font-medium text-ink-primary">
                    Notifications
                  </span>
                  {unread > 0 && (
                    <button
                      onClick={() => markRead.mutate(undefined)}
                      className="flex items-center gap-1 text-[11px] text-brand"
                    >
                      <Check size={12} /> Mark all read
                    </button>
                  )}
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {(data?.data ?? []).length === 0 ? (
                    <p className="px-4 py-6 text-center text-xs text-ink-muted">
                      No notifications
                    </p>
                  ) : (
                    data?.data.map((n) => (
                      <div
                        key={n.id}
                        className={cn(
                          "border-b border-line px-4 py-3 last:border-0",
                          !n.isRead && "bg-brand/[0.04]",
                        )}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-[13px] font-medium text-ink-primary">
                            {n.title}
                          </p>
                          {!n.isRead && (
                            <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />
                          )}
                        </div>
                        <p className="mt-0.5 text-xs text-ink-muted">{n.body}</p>
                        <p className="mt-1 text-[10px] text-ink-muted">
                          {formatDate(n.createdAt, true)}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </>
          )}
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-[10px] bg-gradient-to-br from-brand to-brand-dim font-display text-sm font-bold text-white">
          {initialsFromName(user.name)}
        </div>
      </div>
    </header>
  );
}
