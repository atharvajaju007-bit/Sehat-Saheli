"use client";

/**
 * Application-wide React providers wrapper.
 * Wraps the app with Query, Auth, and Online/Offline detection.
 */

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useState, type ReactNode } from "react";
import { useUIStore } from "@/lib/stores";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 30 * 60 * 1000,   // 30 minutes (formerly cacheTime)
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
});

function OnlineStatusProvider({ children }: { children: ReactNode }) {
  const setOnline = useUIStore((s) => s.setOnline);

  useEffect(() => {
    const handleOnline = () => setOnline(true);
    const handleOffline = () => setOnline(false);

    setOnline(navigator.onLine);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [setOnline]);

  return <>{children}</>;
}

export function AppProviders({ children }: { children: ReactNode }) {
  // Prevent hydration mismatch — only render client-side providers after mount
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <OnlineStatusProvider>{children}</OnlineStatusProvider>
    </QueryClientProvider>
  );
}
