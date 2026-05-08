/**
 * IndexedDB setup using Dexie.js for offline data persistence.
 * Stores chat messages, sync queue, and cached content for offline access.
 */

import Dexie, { type Table } from "dexie";
import type { ChatMessage, SyncQueueItem } from "@/types";

export class SehatSaheliDB extends Dexie {
  chatMessages!: Table<ChatMessage & { sessionId: string }, string>;
  syncQueue!: Table<SyncQueueItem, number>;
  cachedContent!: Table<{ key: string; data: string; timestamp: number }, string>;

  constructor() {
    super("SehatSaheliDB");

    this.version(1).stores({
      chatMessages: "id, sessionId, role, created_at",
      syncQueue: "++id, url, timestamp",
      cachedContent: "key, timestamp",
    });
  }
}

export const db = new SehatSaheliDB();

// ── Sync Queue Helpers ──────────────────────────────────────────

export async function addToSyncQueue(item: Omit<SyncQueueItem, "id">) {
  return db.syncQueue.add(item as SyncQueueItem);
}

export async function getSyncQueue() {
  return db.syncQueue.orderBy("timestamp").toArray();
}

export async function removeSyncQueueItem(id: number) {
  return db.syncQueue.delete(id);
}

export async function clearSyncQueue() {
  return db.syncQueue.clear();
}

// ── Chat Message Cache ──────────────────────────────────────────

export async function cacheMessages(sessionId: string, messages: ChatMessage[]) {
  const withSession = messages.map((m) => ({ ...m, sessionId }));
  return db.chatMessages.bulkPut(withSession);
}

export async function getCachedMessages(sessionId: string) {
  return db.chatMessages.where("sessionId").equals(sessionId).sortBy("created_at");
}

// ── Generic Content Cache ───────────────────────────────────────

export async function cacheContent(key: string, data: unknown) {
  return db.cachedContent.put({
    key,
    data: JSON.stringify(data),
    timestamp: Date.now(),
  });
}

export async function getCachedContent<T>(key: string): Promise<T | null> {
  const item = await db.cachedContent.get(key);
  if (!item) return null;
  return JSON.parse(item.data) as T;
}
