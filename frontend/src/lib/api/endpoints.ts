/**
 * Type-safe API endpoint wrappers.
 * All API calls go through these functions — never call apiClient directly from components.
 */

import apiClient from "./client";
import type {
  ChatMessage,
  ChatSendResponse,
  ChatSession,
  CycleAnalytics,
  CycleLog,
  CyclePrediction,
  FlashcardDeck,
  FlashcardItem,
  LearnArticle,
  LearnCategory,
  LoginRequest,
  QuizCategory,
  QuizQuestion,
  QuizResult,
  QuizStats,
  RegisterRequest,
  TokenResponse,
  User,
} from "@/types";

// ── Auth Endpoints ──────────────────────────────────────────────
export const authApi = {
  register: (data: RegisterRequest) =>
    apiClient.post<TokenResponse>("/auth/register", data).then((r) => r.data),

  login: (data: LoginRequest) =>
    apiClient.post<TokenResponse>("/auth/login", data).then((r) => r.data),

  refresh: (refreshToken: string) =>
    apiClient
      .post<TokenResponse>("/auth/refresh", { refresh_token: refreshToken })
      .then((r) => r.data),

  getProfile: () =>
    apiClient.get<User>("/auth/me").then((r) => r.data),

  updateProfile: (data: Partial<User>) =>
    apiClient.put<User>("/auth/me", data).then((r) => r.data),
};

// ── Chat Endpoints ──────────────────────────────────────────────
export const chatApi = {
  createSession: (data: { title?: string; language?: string }) =>
    apiClient.post<ChatSession>("/chat/sessions", data).then((r) => r.data),

  listSessions: (params?: { skip?: number; limit?: number }) =>
    apiClient.get<ChatSession[]>("/chat/sessions", { params }).then((r) => r.data),

  sendMessage: (sessionId: string, data: { content: string; language?: string }) =>
    apiClient
      .post<ChatSendResponse>(`/chat/sessions/${sessionId}/messages`, data)
      .then((r) => r.data),

  getMessages: (sessionId: string, params?: { skip?: number; limit?: number }) =>
    apiClient
      .get<ChatMessage[]>(`/chat/sessions/${sessionId}/messages`, { params })
      .then((r) => r.data),

  deleteSession: (sessionId: string) =>
    apiClient.delete(`/chat/sessions/${sessionId}`).then((r) => r.data),
};

// ── Quiz Endpoints ──────────────────────────────────────────────
export const quizApi = {
  listCategories: () =>
    apiClient.get<QuizCategory[]>("/quiz/categories").then((r) => r.data),

  getByCategory: (slug: string) =>
    apiClient.get<QuizQuestion[]>(`/quiz/category/${slug}`).then((r) => r.data),

  getDaily: () =>
    apiClient.get<QuizQuestion[]>("/quiz/daily").then((r) => r.data),

  submitAttempt: (quizId: string, data: { selected_option: number }) =>
    apiClient.post<QuizResult>(`/quiz/${quizId}/attempt`, data).then((r) => r.data),

  getStats: () =>
    apiClient.get<QuizStats>("/quiz/stats").then((r) => r.data),
};

// ── Learn Endpoints ─────────────────────────────────────────────
export const learnApi = {
  listCategories: () =>
    apiClient.get<LearnCategory[]>("/learn/categories").then((r) => r.data),

  getArticles: (slug: string) =>
    apiClient.get<LearnArticle[]>(`/learn/category/${slug}`).then((r) => r.data),

  getArticle: (id: string) =>
    apiClient.get<LearnArticle>(`/learn/articles/${id}`).then((r) => r.data),
};

// ── Flashcard Endpoints ─────────────────────────────────────────
export const flashcardApi = {
  listDecks: () =>
    apiClient.get<FlashcardDeck[]>("/flashcards/decks").then((r) => r.data),

  getDeckCards: (slug: string) =>
    apiClient.get<FlashcardItem[]>(`/flashcards/decks/${slug}`).then((r) => r.data),
};

// ── Dashboard / Cycle Endpoints ─────────────────────────────────
export const cycleApi = {
  logCycle: (data: { period_start: string; period_end?: string; cycle_length?: number; symptoms?: Record<string, unknown>; notes?: string }) =>
    apiClient.post<CycleLog>("/cycles", data).then((r) => r.data),

  listCycles: (params?: { skip?: number; limit?: number }) =>
    apiClient.get<CycleLog[]>("/cycles", { params }).then((r) => r.data),

  deleteCycle: (id: string) =>
    apiClient.delete(`/cycles/${id}`).then((r) => r.data),

  predict: () =>
    apiClient.get<CyclePrediction>("/cycles/predict").then((r) => r.data),

  analytics: () =>
    apiClient.get<CycleAnalytics>("/cycles/analytics").then((r) => r.data),
};
