"use client";

/**
 * AI Chat page — core chatbot interface with message history,
 * AI responses, typing indicator, and offline support.
 */

import { useState, useRef, useEffect, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MessageBubble, ChatInput, TypingIndicator } from "@/components/chat";
import { chatApi } from "@/lib/api";
import { useUIStore } from "@/lib/stores";
import type { ChatMessage, ChatSession } from "@/types";

export default function ChatPage() {
  const queryClient = useQueryClient();
  const language = useUIStore((s) => s.language);
  const isOnline = useUIStore((s) => s.isOnline);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [showSidebar, setShowSidebar] = useState(false);
  const [isSending, setIsSending] = useState(false);

  // Fetch chat sessions (sidebar list)
  const { data: sessions = [] } = useQuery({
    queryKey: ["chatSessions"],
    queryFn: () => chatApi.listSessions(),
    enabled: isOnline,
  });

  // Fetch messages when switching to a different session
  const { data: sessionMessages } = useQuery({
    queryKey: ["chatMessages", activeSessionId],
    queryFn: () => chatApi.getMessages(activeSessionId!),
    enabled: !!activeSessionId && isOnline,
    refetchOnWindowFocus: false,
    staleTime: Infinity, // Don't auto-refetch — we manage state optimistically
  });

  // Only set messages when switching sessions (not on every refetch)
  const prevSessionRef = useRef<string | null>(null);
  useEffect(() => {
    if (activeSessionId !== prevSessionRef.current) {
      prevSessionRef.current = activeSessionId;
      if (sessionMessages) {
        setMessages(sessionMessages);
      } else if (!activeSessionId) {
        setMessages([]);
      }
    }
  }, [activeSessionId, sessionMessages]);

  // Create new session
  const createSessionMutation = useMutation({
    mutationFn: () => chatApi.createSession({ language }),
    onSuccess: (session) => {
      setActiveSessionId(session.id);
      setMessages([]);
      queryClient.invalidateQueries({ queryKey: ["chatSessions"] });
      setShowSidebar(false);
    },
  });

  // Send message
  const sendMessageMutation = useMutation({
    mutationFn: (content: string) =>
      chatApi.sendMessage(activeSessionId!, { content, language }),
    onSuccess: (response) => {
      // Replace temp messages with real ones, add assistant response
      setMessages((prev) => [
        ...prev.filter((m) => !m.id.startsWith("temp-")),
        response.user_message,
        response.assistant_message,
      ]);
      queryClient.invalidateQueries({ queryKey: ["chatSessions"] });
    },
  });

  // Delete session
  const deleteSessionMutation = useMutation({
    mutationFn: (id: string) => chatApi.deleteSession(id),
    onSuccess: () => {
      if (activeSessionId) {
        setActiveSessionId(null);
        setMessages([]);
      }
      queryClient.invalidateQueries({ queryKey: ["chatSessions"] });
    },
  });

  // Auto-scroll to bottom on new messages
  // Track loading from both paths
  const isLoading = isSending || sendMessageMutation.isPending;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleSend = useCallback(
    async (content: string) => {
      if (!activeSessionId) {
        // Create session first, then send message
        setIsSending(true);
        try {
          const session = await chatApi.createSession({ language });
          setActiveSessionId(session.id);
          queryClient.invalidateQueries({ queryKey: ["chatSessions"] });

          // Optimistic add of user message
          const tempUserMsg: ChatMessage = {
            id: `temp-${Date.now()}`,
            role: "user",
            content,
            language,
            created_at: new Date().toISOString(),
          };
          setMessages([tempUserMsg]);

          const response = await chatApi.sendMessage(session.id, { content, language });
          setMessages([response.user_message, response.assistant_message]);
          queryClient.invalidateQueries({ queryKey: ["chatSessions"] });
        } catch {
          // Handle error
        } finally {
          setIsSending(false);
        }
        return;
      }

      // Optimistic add
      const tempMsg: ChatMessage = {
        id: `temp-${Date.now()}`,
        role: "user",
        content,
        language,
        created_at: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, tempMsg]);
      sendMessageMutation.mutate(content);
    },
    [activeSessionId, language, sendMessageMutation, queryClient]
  );

  const welcomeMessage: ChatMessage = {
    id: "welcome",
    role: "assistant",
    content:
      language === "hi"
        ? "नमस्ते! 🌺 मैं सहेली हूं, आपकी स्वास्थ्य साथी। मैं आपको शरीर, स्वास्थ्य और कल्याण के बारे में जानने में मदद करने के लिए यहां हूं। कुछ भी पूछें!"
        : "Hi there! 🌺 I'm Saheli, your health companion. I'm here to help you learn about your body, health, and well-being. Feel free to ask me anything!",
    language,
    created_at: new Date().toISOString(),
  };

  // Always show welcome as the first message
  const displayMessages = [welcomeMessage, ...messages];

  // Shared session list component
  const sessionList = (
    <div className="space-y-1.5 overflow-y-auto">
      {sessions.length === 0 ? (
        <p className="text-xs text-gray-400 text-center py-8">No chats yet</p>
      ) : (
        sessions.map((session: ChatSession) => (
          <div
            key={session.id}
            onClick={() => {
              setActiveSessionId(session.id);
              setShowSidebar(false);
            }}
            className={`group flex items-center justify-between rounded-xl px-3 py-2.5 text-sm cursor-pointer transition-colors ${
              activeSessionId === session.id
                ? "bg-dusty-rose-50 text-dusty-rose-700"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            <span className="truncate flex-1">{session.title}</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                deleteSessionMutation.mutate(session.id);
              }}
              className="hidden group-hover:block text-gray-400 hover:text-red-500 transition-colors"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        ))
      )}
    </div>
  );

  return (
    <div className="relative flex h-[calc(100vh-8rem)]">
      {/* Desktop Sidebar — always visible on lg+ */}
      <div className="hidden lg:flex lg:w-64 lg:flex-col lg:border-r lg:border-dusty-rose-100 lg:bg-white/60 lg:backdrop-blur-sm">
        <div className="flex items-center justify-between p-4 border-b border-dusty-rose-100">
          <h3 className="text-sm font-semibold text-gray-800">Chat History</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => createSessionMutation.mutate()}
            disabled={createSessionMutation.isPending}
            className="text-dusty-rose-500 h-8 w-8 p-0"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex-1 overflow-y-auto p-3">
          {sessionList}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex flex-1 flex-col">
        {/* Chat Header */}
        <div className="flex items-center justify-between border-b border-dusty-rose-100 bg-white/60 backdrop-blur-sm px-4 py-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowSidebar(!showSidebar)}
              className="rounded-lg p-1.5 text-gray-500 hover:bg-dusty-rose-50 transition-colors lg:hidden"
            >
              <MessageCircle className="h-5 w-5" />
            </button>
            <img
              src="/icons/saheli-avatar.png"
              alt="Saheli"
              className="h-8 w-8 rounded-full object-cover"
            />
            <div>
              <h2 className="text-sm font-semibold text-gray-800">Chat with Saheli</h2>
              <p className="text-xs text-gray-400">Ask anything about health 🌸</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => createSessionMutation.mutate()}
            disabled={createSessionMutation.isPending}
            className="text-dusty-rose-500 lg:hidden"
          >
            <Plus className="h-4 w-4 mr-1" />
            New
          </Button>
        </div>

        {/* Mobile Session Sidebar (Overlay) */}
        <AnimatePresence>
          {showSidebar && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.3 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowSidebar(false)}
                className="fixed inset-0 z-40 bg-black lg:hidden"
              />
              <motion.div
                initial={{ x: -280 }}
                animate={{ x: 0 }}
                exit={{ x: -280 }}
                transition={{ type: "spring", damping: 25 }}
                className="fixed left-0 top-0 z-50 h-full w-72 border-r border-dusty-rose-100 bg-white p-4 shadow-xl lg:hidden"
              >
                <h3 className="mb-4 text-sm font-semibold text-gray-800">Chat History</h3>
                {sessionList}
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto py-4">
          {/* Medical Disclaimer */}
          <div className="mx-4 mb-4 rounded-xl bg-gradient-to-r from-sage-50 to-sage-100 border border-sage-200 px-4 py-2.5 text-xs text-sage-700">
            💡 This is educational information only. Please consult a healthcare provider for personalized medical advice.
          </div>

          {displayMessages.map((msg) => (
            <MessageBubble key={msg.id} message={msg} />
          ))}

          {isLoading && <TypingIndicator />}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <ChatInput
          onSend={handleSend}
          isLoading={isLoading}
          placeholder={language === "hi" ? "अपना सवाल लिखें..." : "Type your question..."}
        />
      </div>
    </div>
  );
}
