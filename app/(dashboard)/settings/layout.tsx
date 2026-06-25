"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { User, Shield, Bell } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { cn } from "@/lib/utils";

const TABS = [
  { href: "/settings/profile", label: "Profile", icon: User },
  { href: "/settings/security", label: "Security", icon: Shield },
  { href: "/settings/notifications", label: "Notifications", icon: Bell },
];

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  return (
    <div>
      <PageHeader title="Settings" subtitle="Manage your account preferences" />
      <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
        <nav className="flex gap-2 overflow-x-auto lg:flex-col">
          {TABS.map((t) => {
            const active = pathname === t.href;
            return (
              <Link
                key={t.href}
                href={t.href}
                className={cn(
                  "flex items-center gap-2.5 rounded-xl border px-4 py-2.5 text-sm transition",
                  active
                    ? "border-brand/20 bg-brand/10 text-brand-light"
                    : "border-line bg-navy-card text-ink-secondary hover:text-ink-primary",
                )}
              >
                <t.icon size={16} />
                {t.label}
              </Link>
            );
          })}
        </nav>
        <div>{children}</div>
      </div>
    </div>
  );
}
