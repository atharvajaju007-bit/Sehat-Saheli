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

// ── Quiz Types ─────────────────────────────────────────────────
export interface QuizCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image_url?: string;
  quiz_count: number;
}

export interface QuizQuestion {
  id: string;
  category_id: string;
  question: Record<string, string>;
  options: Record<string, string[]>;
  image_url?: string;
  difficulty: string;
}

export interface QuizAttempt {
  id: string;
  quiz_id: string;
  selected_option: number;
  is_correct: boolean;
  score: number;
  created_at: string;
}

export interface QuizResult {
  attempt: QuizAttempt;
  correct_option: number;
  explanation?: string;
}

export interface QuizStats {
  total_attempts: number;
  correct_count: number;
  total_score: number;
  accuracy: number;
}

// ── Learn Types ────────────────────────────────────────────────
export interface LearnCategory {
  id: string;
  name: string;
  slug: string;
  icon?: string;
  order_index: number;
  article_count: number;
}

export interface LearnArticle {
  id: string;
  category_id: string;
  title: Record<string, string>;
  content: Record<string, string>;
  image_url?: string;
  video_url?: string;
  content_type: string;
  order_index: number;
}

// ── Flashcard Types ────────────────────────────────────────────
export interface FlashcardDeck {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image_url?: string;
  category: string;
  card_count: number;
}

export interface FlashcardItem {
  id: string;
  deck_id: string;
  front: Record<string, string>;
  back: Record<string, string>;
  image_url?: string;
  order_index: number;
}

// ── Dashboard / Cycle Types ────────────────────────────────────
export interface CycleLog {
  id: string;
  period_start: string;
  period_end?: string;
  cycle_length?: number;
  symptoms?: Record<string, unknown>;
  notes?: string;
  created_at: string;
}

export interface CyclePrediction {
  predicted_start: string;
  average_cycle_length: number;
  based_on_entries: number;
}

export interface CycleAnalytics {
  total_logs: number;
  average_cycle_length: number;
  average_period_length: number;
  shortest_cycle?: number;
  longest_cycle?: number;
}
