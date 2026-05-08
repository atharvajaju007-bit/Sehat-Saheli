"use client";

/**
 * Chat input bar with send button.
 */

import { useState, useRef, type FormEvent } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ChatInputProps {
  onSend: (message: string) => void;
  isLoading: boolean;
  placeholder?: string;
}

export function ChatInput({ onSend, isLoading, placeholder = "Type your question..." }: ChatInputProps) {
  const [message, setMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = message.trim();
    if (!trimmed || isLoading) return;

    onSend(trimmed);
    setMessage("");

    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleInput = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="border-t border-dusty-rose-100 bg-white/95 backdrop-blur-md px-4 py-3 safe-area-bottom"
    >
      <div className="mx-auto flex max-w-lg items-end gap-2">
        <div className="relative flex-1">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            onInput={handleInput}
            placeholder={placeholder}
            rows={1}
            disabled={isLoading}
            className={cn(
              "w-full resize-none rounded-2xl border-2 border-dusty-rose-200 bg-cream px-4 py-3 pr-4 text-sm text-gray-800",
              "placeholder:text-gray-400",
              "focus:border-dusty-rose-400 focus:outline-none focus:ring-2 focus:ring-dusty-rose-100",
              "disabled:opacity-50",
              "max-h-[120px]"
            )}
          />
        </div>
        <Button
          type="submit"
          size="icon"
          disabled={!message.trim() || isLoading}
          className="shrink-0 rounded-full bg-gradient-to-r from-dusty-rose-400 to-warm-peach-400 shadow-md hover:shadow-lg transition-shadow"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </form>
  );
}
