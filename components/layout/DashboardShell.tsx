"use client";

import { useState } from "react";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { MobileNav } from "./MobileNav";

export interface ShellUser {
  name: string;
  email: string;
  firstName: string | null;
}

export function DashboardShell({
  user,
  children,
}: {
  user: ShellUser;
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-navy">
      <Sidebar
        open={sidebarOpen}
        onNavigate={() => setSidebarOpen(false)}
        user={user}
      />

      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-[90] bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="flex min-h-screen flex-col lg:ml-[260px]">
        <Topbar onMenu={() => setSidebarOpen(true)} user={user} />
        <main className="flex-1 px-5 pb-24 pt-7 sm:px-8 md:pb-10">
          {children}
        </main>
      </div>

      <MobileNav />
    </div>
  );
}
