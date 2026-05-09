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
import { useUIStore, useToast, useAuthStore } from "@/lib/stores";
import type { ChatMessage, ChatSession } from "@/types";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { getOfflineResponse } from "@/lib/i18n/offlineResponses";

export default function ChatPage() {
  const queryClient = useQueryClient();
  const language = useUIStore((s) => s.language);
  const isOnline = useUIStore((s) => s.isOnline);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const { t } = useTranslation();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [showSidebar, setShowSidebar] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const toast = useToast();

  // Fetch chat sessions (sidebar list)
  const { data: sessionsData = [] } = useQuery({
    queryKey: ["chatSessions"],
    queryFn: () => chatApi.listSessions(),
    enabled: isOnline && isAuthenticated,
  });
  const sessions = Array.isArray(sessionsData) ? sessionsData : [];

  // Fetch messages when switching to a different session
  const { data: sessionMessages } = useQuery({
    queryKey: ["chatMessages", activeSessionId],
    queryFn: () => chatApi.getMessages(activeSessionId!),
    enabled: !!activeSessionId && isOnline && isAuthenticated,
    refetchOnWindowFocus: false,
    staleTime: Infinity,
  });

  // Track which session we last loaded data for to avoid overwriting optimistic updates
  const loadedSessionRef = useRef<string | null>(null);
  useEffect(() => {
    if (!activeSessionId) {
      loadedSessionRef.current = null;
      setMessages([]);
      return;
    }
    // Only load from server when switching to a session we haven't loaded yet
    if (sessionMessages && loadedSessionRef.current !== activeSessionId) {
      loadedSessionRef.current = activeSessionId;
      setMessages(sessionMessages);
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
      toast.success("New chat started");
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
    onError: () => {
      toast.error("Failed to send message. Please try again.");
      // Remove the optimistic temp message
      setMessages((prev) => prev.filter((m) => !m.id.startsWith("temp-")));
    },
  });

  // Delete session
  const deleteSessionMutation = useMutation({
    mutationFn: (id: string) => chatApi.deleteSession(id),
    onSuccess: (_data, deletedId) => {
      if (activeSessionId === deletedId) {
        setActiveSessionId(null);
        loadedSessionRef.current = null;
        setMessages([]);
      }
      queryClient.refetchQueries({ queryKey: ["chatSessions"] });
      toast.success("Chat deleted");
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
        try {
          const session = await chatApi.createSession({ language });
          setActiveSessionId(session.id);
          // Mark this session as "owned" so the query effect doesn't overwrite
          loadedSessionRef.current = session.id;
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

          // Show typing dots AFTER user message is rendered
          // Use setTimeout to ensure React renders the message first
          await new Promise((r) => setTimeout(r, 50));
          setIsSending(true);

          const response = await chatApi.sendMessage(session.id, { content, language });
          setMessages([response.user_message, response.assistant_message]);
          queryClient.invalidateQueries({ queryKey: ["chatSessions"] });
        } catch {
          toast.error("Failed to send message. Please try again.");
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
      // Handle Offline Logic natively in the frontend
      if (!isOnline) {
        setIsSending(true);
        // Simulate network delay for realism
        await new Promise((r) => setTimeout(r, 800));
        
        const offlineReply = getOfflineResponse(content, language);
        const aiMsg: ChatMessage = {
          id: `offline-${Date.now()}`,
          role: "assistant",
          content: offlineReply,
          language,
          created_at: new Date().toISOString(),
        };
        
        setMessages((prev) => [...prev.filter((m) => m.id !== tempMsg.id), tempMsg, aiMsg]);
        setIsSending(false);
        return;
      }

      sendMessageMutation.mutate(content);
    },
    [activeSessionId, language, sendMessageMutation, queryClient, isOnline]
  );

  const welcomeMessage: ChatMessage = {
    id: "welcome",
    role: "assistant",
    content: t("chat.welcome"),
    language,
    created_at: new Date().toISOString(),
  };

  // Always show welcome as the first message
  const displayMessages = [welcomeMessage, ...messages];

  // Shared session list component
  const sessionList = (
    <div className="space-y-1.5 overflow-y-auto">
      {sessions.length === 0 ? (
        <p className="text-xs text-gray-400 text-center py-8">{t("chat.emptySessions")}</p>
      ) : (
        sessions.map((session: ChatSession) => (
          <div
            key={session.id}
            onClick={() => {
              // Reset ref so the effect loads messages from server
              loadedSessionRef.current = null;
              queryClient.invalidateQueries({ queryKey: ["chatMessages", session.id] });
              setActiveSessionId(session.id);
              setShowSidebar(false);
            }}
            className={`group flex items-center justify-between rounded-xl px-3 py-2.5 text-sm cursor-pointer transition-colors ${
              activeSessionId === session.id
                ? "bg-dusty-rose-50 dark:bg-gray-700 text-dusty-rose-700 dark:text-dusty-rose-300"
                : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700"
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
      <div className="hidden lg:flex lg:w-64 lg:flex-col lg:border-r lg:border-dusty-rose-100 dark:lg:border-gray-700 lg:bg-white/60 dark:lg:bg-gray-800/60 lg:backdrop-blur-sm transition-colors">
        <div className="flex items-center justify-between p-4 border-b border-dusty-rose-100 dark:border-gray-700">
          <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">{t("chat.history")}</h3>
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
        <div className="flex items-center justify-between border-b border-dusty-rose-100 dark:border-gray-700 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm px-4 py-3 transition-colors">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowSidebar(!showSidebar)}
              className="rounded-lg p-1.5 text-gray-500 hover:bg-dusty-rose-50 dark:hover:bg-gray-700 transition-colors lg:hidden"
            >
              <MessageCircle className="h-5 w-5" />
            </button>
            <img
              src="/icons/saheli-avatar.png"
              alt="Saheli"
              className="h-8 w-8 rounded-full object-cover"
            />
            <div>
              <h2 className="text-sm font-semibold text-gray-800 dark:text-gray-200">{t("chat.title")}</h2>
              <p className="text-xs text-gray-400">{t("chat.subtitle")}</p>
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
                className="fixed left-0 top-0 z-50 h-full w-72 border-r border-dusty-rose-100 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 shadow-xl lg:hidden transition-colors"
              >
                <h3 className="mb-4 text-sm font-semibold text-gray-800 dark:text-gray-200">{t("chat.history")}</h3>
                {sessionList}
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto py-4">
          {/* Medical Disclaimer */}
          <div className="mx-4 mb-4 rounded-xl bg-gradient-to-r from-sage-50 to-sage-100 dark:from-gray-800 dark:to-gray-700 border border-sage-200 dark:border-gray-600 px-4 py-2.5 text-xs text-sage-700 dark:text-sage-300 transition-colors">
            {t("chat.disclaimer")}
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
          placeholder={t("chat.placeholder")}
        />
      </div>
    </div>
  );
}
