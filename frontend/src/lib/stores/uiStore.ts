/**
 * UI state management — language, theme, sidebar, online status.
 */

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { LanguageCode } from "@/types";

type Theme = "light" | "dark";

interface UIState {
  language: LanguageCode;
  theme: Theme;
  isSidebarOpen: boolean;
  isOnline: boolean;
  showInstallPrompt: boolean;

  // Actions
  setLanguage: (lang: LanguageCode) => void;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  setOnline: (online: boolean) => void;
  setShowInstallPrompt: (show: boolean) => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      language: "en",
      theme: "light",
      isSidebarOpen: false,
      isOnline: true,
      showInstallPrompt: false,

      setLanguage: (language) => set({ language }),
      toggleTheme: () =>
        set((state) => {
          const next = state.theme === "light" ? "dark" : "light";
          if (typeof document !== "undefined") {
            document.documentElement.classList.toggle("dark", next === "dark");
          }
          return { theme: next };
        }),
      setTheme: (theme) => {
        if (typeof document !== "undefined") {
          document.documentElement.classList.toggle("dark", theme === "dark");
        }
        set({ theme });
      },
      toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
      setSidebarOpen: (isSidebarOpen) => set({ isSidebarOpen }),
      setOnline: (isOnline) => set({ isOnline }),
      setShowInstallPrompt: (showInstallPrompt) => set({ showInstallPrompt }),
    }),
    {
      name: "ss-ui-store",
      partialize: (state) => ({ language: state.language, theme: state.theme }),
    }
  )
);
