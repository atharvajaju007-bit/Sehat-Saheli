/**
 * Type-safe API endpoint wrappers.
 * All API calls go through these functions — never call apiClient directly from components.
 */

import apiClient from "./client";
import type {
  ChatMessage,
  ChatSendResponse,
  ChatSession,
  LoginRequest,
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
