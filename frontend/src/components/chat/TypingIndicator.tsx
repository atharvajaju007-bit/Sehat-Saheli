"use client";

/**
 * Typing indicator — animated dots showing "Saheli is thinking".
 */

import { motion } from "framer-motion";

export function TypingIndicator() {
  return (
    <div className="flex gap-3 px-4 py-2">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-dusty-rose-300 to-warm-peach-300 text-lg shadow-sm">
        🌸
      </div>
      <div className="flex items-center gap-1.5 rounded-2xl rounded-tl-sm bg-gradient-to-br from-dusty-rose-50 to-warm-peach-50 px-5 py-3 shadow-sm">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="h-2 w-2 rounded-full bg-dusty-rose-400"
            animate={{ y: [0, -6, 0] }}
            transition={{
              duration: 0.6,
              repeat: Infinity,
              delay: i * 0.15,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
    </div>
  );
}
