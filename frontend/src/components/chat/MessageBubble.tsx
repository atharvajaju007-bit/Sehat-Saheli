"use client";

/**
 * Chat message bubble component.
 * Renders user and assistant messages with distinct styling and avatars.
 */

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { ChatMessage } from "@/types";

interface MessageBubbleProps {
  message: ChatMessage;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={cn("flex gap-3 px-4 py-2", isUser ? "flex-row-reverse" : "flex-row")}
    >
      {/* Avatar */}
      {isUser ? (
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-lg shadow-sm bg-gradient-to-br from-lavender-300 to-lavender-400">
          👩
        </div>
      ) : (
        <img
          src="/icons/saheli-avatar.png"
          alt="Saheli"
          className="h-9 w-9 shrink-0 rounded-full shadow-sm object-cover"
        />
      )}

      {/* Message Content */}
      <div
        className={cn(
          "max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm transition-colors",
          isUser
            ? "rounded-tr-sm bg-gradient-to-br from-lavender-100 to-lavender-50 dark:from-lavender-900 dark:to-lavender-800 text-gray-800 dark:text-gray-100"
            : "rounded-tl-sm bg-gradient-to-br from-dusty-rose-50 to-warm-peach-50 dark:from-gray-700 dark:to-gray-600 text-gray-800 dark:text-gray-100"
        )}
      >
        <p className="whitespace-pre-wrap">{message.content}</p>
        {message.id !== "welcome" && (
          <time className="mt-1 block text-right text-[10px] text-gray-400">
            {new Date(message.created_at).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </time>
        )}
      </div>
    </motion.div>
  );
}
