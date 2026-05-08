"use client";

/**
 * Main layout — wraps all authenticated pages with TopBar and BottomNav.
 */

import { type ReactNode } from "react";
import { TopBar, BottomNav, OfflineBanner } from "@/components/layout";

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <OfflineBanner />
      <TopBar />
      <main className="flex-1 pb-nav">{children}</main>
      <BottomNav />
    </div>
  );
}
