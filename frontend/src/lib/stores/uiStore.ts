/**
 * UI state management — language, theme, sidebar, online status.
 */

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { LanguageCode } from "@/types";

interface UIState {
  language: LanguageCode;
  isSidebarOpen: boolean;
  isOnline: boolean;
  showInstallPrompt: boolean;

  // Actions
  setLanguage: (lang: LanguageCode) => void;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  setOnline: (online: boolean) => void;
  setShowInstallPrompt: (show: boolean) => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      language: "en",
      isSidebarOpen: false,
      isOnline: true,
      showInstallPrompt: false,

      setLanguage: (language) => set({ language }),
      toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
      setSidebarOpen: (isSidebarOpen) => set({ isSidebarOpen }),
      setOnline: (isOnline) => set({ isOnline }),
      setShowInstallPrompt: (showInstallPrompt) => set({ showInstallPrompt }),
    }),
    {
      name: "ss-ui-store",
      partialize: (state) => ({ language: state.language }),
    }
  )
);
