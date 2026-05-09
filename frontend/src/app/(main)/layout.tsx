"use client";

/**
 * Main layout — wraps all authenticated pages with TopBar and BottomNav.
 * Auto-authenticates unauthenticated users as Guest.
 */

import { type ReactNode, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { TopBar, BottomNav, OfflineBanner, ToastContainer } from "@/components/layout";
import { useAuthStore } from "@/lib/stores";

export default function MainLayout({ children }: { children: ReactNode }) {
  const { isAuthenticated, fetchProfile, guestLogin } = useAuthStore();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    // Re-validate the stored auth state against the server
    const verify = async () => {
      if (!isAuthenticated) {
        await guestLogin();
        setChecking(false);
        return;
      }

      try {
        await fetchProfile();
        setChecking(false);
      } catch {
        // Token expired or invalid — try guest login
        await guestLogin();
        setChecking(false);
      }
    };

    verify();
  }, []);

  // While checking auth, show a branded loading screen
  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-cream dark:bg-gray-900">
        <motion.div
          className="flex flex-col items-center gap-4"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
        >
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-dusty-rose-400 to-warm-peach-400 shadow-lg">
            <span className="text-3xl">🌸</span>
          </div>
          <motion.div
            className="h-1 w-16 rounded-full bg-gradient-to-r from-dusty-rose-300 to-warm-peach-300"
            animate={{ scaleX: [0.3, 1, 0.3] }}
            transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
            style={{ originX: 0.5 }}
          />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <OfflineBanner />
      <TopBar />
      <main className="flex-1 pb-nav">{children}</main>
      <BottomNav />
      <ToastContainer />
    </div>
  );
}
