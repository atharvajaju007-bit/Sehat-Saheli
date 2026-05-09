"use client";

/**
 * Chat message bubble component.
 * Renders user and assistant messages with distinct styling and avatars.
 */

import { useState } from "react";
import { motion } from "framer-motion";
import { Volume2, VolumeX } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ChatMessage } from "@/types";
import { useToast } from "@/lib/stores";

interface MessageBubbleProps {
  message: ChatMessage;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === "user";
  const [isPlaying, setIsPlaying] = useState(false);
  const toast = useToast();

  const handlePlayAudio = () => {
    if (!("speechSynthesis" in window)) {
      toast.error("Text-to-speech is not supported in your browser.");
      return;
    }

    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(message.content);
    // Try to map language code to TTS language, default to en-US
    const langMap: Record<string, string> = {
      hi: "hi-IN", mr: "mr-IN", bn: "bn-IN", ta: "ta-IN", te: "te-IN", kn: "kn-IN", gu: "gu-IN", en: "en-IN"
    };
    utterance.lang = langMap[message.language] || "en-US";
    
    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = (event) => {
      console.error("SpeechSynthesis error:", event);
      // Don't show toast for 'interrupted' or 'canceled' errors
      if (event.error !== "interrupted" && event.error !== "canceled") {
        toast.error(`Audio error: ${event.error}`);
      }
      setIsPlaying(false);
    };

    // Chrome needs to load voices first sometimes
    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
      const voice = voices.find(v => v.lang.startsWith(utterance.lang) || v.lang.startsWith(utterance.lang.split('-')[0]));
      if (voice) utterance.voice = voice;
    }

    window.speechSynthesis.speak(utterance);
    setIsPlaying(true);
  };

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
        <div className="mt-1 flex items-center justify-between">
          {!isUser && (
            <button
              onClick={handlePlayAudio}
              className="text-dusty-rose-400 hover:text-dusty-rose-600 transition-colors"
              title="Play Audio"
            >
              {isPlaying ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </button>
          )}
          {message.id !== "welcome" && (
            <time className="block text-right text-[10px] text-gray-400 flex-1">
              {new Date(message.created_at).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </time>
          )}
        </div>
      </div>
    </motion.div>
  );
}
