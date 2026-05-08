"use client";

/**
 * Offline status banner — shows when the user loses connectivity.
 * Animates in/out using Framer Motion.
 */

import { WifiOff } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useUIStore } from "@/lib/stores";

export function OfflineBanner() {
  const isOnline = useUIStore((s) => s.isOnline);

  return (
    <AnimatePresence>
      {!isOnline && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="overflow-hidden bg-gradient-to-r from-warm-peach-400 to-dusty-rose-400 text-white"
        >
          <div className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium">
            <WifiOff className="h-4 w-4" />
            <span>You are offline — data will sync when connected</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
