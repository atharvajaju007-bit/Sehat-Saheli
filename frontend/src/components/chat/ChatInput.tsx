"use client";

/**
 * Chat input bar with send button.
 */

import { useState, useRef, useEffect, type FormEvent } from "react";
import { Send, Mic, MicOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/lib/stores";
import { cn } from "@/lib/utils";

interface ChatInputProps {
  onSend: (message: string) => void;
  isLoading: boolean;
  placeholder?: string;
}

export function ChatInput({ onSend, isLoading, placeholder = "Type your question..." }: ChatInputProps) {
  const [message, setMessage] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const recognitionRef = useRef<any>(null);
  const toast = useToast();

  useEffect(() => {
    // Initialize Web Speech API for fallback STT
    if (typeof window !== "undefined" && ("SpeechRecognition" in window || "webkitSpeechRecognition" in window)) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      
      recognition.onresult = (event: any) => {
        let finalTranscript = "";
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          }
        }
        if (finalTranscript) {
          setMessage((prev) => prev + (prev ? " " : "") + finalTranscript);
        }
      };

      recognition.onerror = (event: any) => {
        console.error("Speech recognition error", event.error);
        setIsRecording(false);
        if (event.error !== "no-speech") {
          toast.error("Microphone error. Please check permissions.");
        }
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  const toggleRecording = () => {
    if (!recognitionRef.current) {
      toast.error("Speech recognition is not supported in this browser.");
      return;
    }

    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      // Set language dynamically if we wanted, for now let browser auto-detect or use default
      try {
        recognitionRef.current.start();
        setIsRecording(true);
      } catch (err) {
        // Handle case where it might already be started
        setIsRecording(false);
      }
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = message.trim();
    if (!trimmed || isLoading) return;

    onSend(trimmed);
    setMessage("");

    // Reset textarea height and re-focus
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.focus();
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
      className="border-t border-dusty-rose-100 dark:border-gray-700 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md px-4 py-3 safe-area-bottom transition-colors"
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
              "w-full resize-none rounded-2xl border-2 border-dusty-rose-200 dark:border-gray-600 bg-cream dark:bg-gray-800 px-4 py-3 pr-4 text-sm text-gray-800 dark:text-gray-100",
              "placeholder:text-gray-400 dark:placeholder:text-gray-500",
              "focus:border-dusty-rose-400 dark:focus:border-dusty-rose-500 focus:outline-none focus:ring-2 focus:ring-dusty-rose-100 dark:focus:ring-gray-700",
              "disabled:opacity-50",
              "max-h-[120px] transition-colors"
            )}
          />
        </div>
        <Button
          type="button"
          size="icon"
          onClick={toggleRecording}
          variant={isRecording ? "default" : "outline"}
          className={`shrink-0 rounded-full transition-colors ${
            isRecording 
              ? "bg-red-500 hover:bg-red-600 text-white animate-pulse shadow-md" 
              : "border-dusty-rose-200 dark:border-gray-600 text-dusty-rose-500 hover:bg-dusty-rose-50 dark:hover:bg-gray-800"
          }`}
        >
          {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
        </Button>
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
