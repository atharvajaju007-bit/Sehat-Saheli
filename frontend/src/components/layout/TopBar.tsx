"use client";

/**
 * Top header bar with app name, language selector, and dark mode toggle.
 */

import { useEffect } from "react";
import { Globe, Sun, Moon } from "lucide-react";
import { useUIStore } from "@/lib/stores";
import { SUPPORTED_LANGUAGES } from "@/lib/constants";
import type { LanguageCode } from "@/types";

export function TopBar() {
  const { language, setLanguage, theme, toggleTheme, setTheme } = useUIStore();

  // Apply persisted theme on mount
  useEffect(() => {
    setTheme(theme);
  }, []);

  return (
    <header className="sticky top-0 z-40 border-b border-dusty-rose-100 bg-white/95 backdrop-blur-md dark:bg-gray-900/95 dark:border-gray-700 transition-colors">
      <div className="mx-auto flex h-14 max-w-lg items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <span className="text-xl">🌸</span>
          <h1 className="bg-gradient-to-r from-dusty-rose-500 to-lavender-500 bg-clip-text text-lg font-bold text-transparent">
            Sehat Saheli
          </h1>
        </div>

        <div className="flex items-center gap-3">
          {/* Dark mode toggle */}
          <button
            onClick={toggleTheme}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 hover:bg-dusty-rose-50 dark:text-gray-400 dark:hover:bg-gray-800 transition-colors"
            aria-label="Toggle dark mode"
          >
            {theme === "dark" ? (
              <Sun className="h-4.5 w-4.5" />
            ) : (
              <Moon className="h-4.5 w-4.5" />
            )}
          </button>

          {/* Language selector */}
          <div className="flex items-center gap-1">
            <Globe className="h-4 w-4 text-gray-400" />
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as LanguageCode)}
              className="appearance-none bg-transparent text-sm font-medium text-gray-600 dark:text-gray-300 focus:outline-none cursor-pointer pr-1"
              aria-label="Select language"
            >
              {SUPPORTED_LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.nativeName}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </header>
  );
}
