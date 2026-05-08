/**
 * Shared TypeScript types used across the application.
 */

// ── Auth Types ─────────────────────────────────────────────────
export interface User {
  id: string;
  name: string;
  phone: string;
  age: number;
  address?: string;
  role: string;
  preferred_language: string;
  created_at: string;
}

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
}

export interface LoginRequest {
  phone: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  phone: string;
  age: number;
  address?: string;
  password: string;
  preferred_language: string;
}

// ── Chat Types ─────────────────────────────────────────────────
export interface ChatSession {
  id: string;
  title: string;
  language: string;
  created_at: string;
  updated_at: string;
  message_count: number;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  language: string;
  created_at: string;
}

export interface ChatSendResponse {
  user_message: ChatMessage;
  assistant_message: ChatMessage;
  disclaimer?: string;
}

// ── Common Types ───────────────────────────────────────────────
export interface ApiError {
  error_code: string;
  message: string;
  details?: unknown;
}

export interface PaginationMeta {
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationMeta;
}

// ── Language Types ──────────────────────────────────────────────
export type LanguageCode = "en" | "hi" | "mr" | "bn" | "ta" | "te" | "kn" | "gu";

export interface LanguageOption {
  code: LanguageCode;
  name: string;
  nativeName: string;
}

// ── Offline Sync Types ─────────────────────────────────────────
export interface SyncQueueItem {
  id?: number;
  url: string;
  method: string;
  body?: string;
  headers?: Record<string, string>;
  timestamp: number;
  retries: number;
}
