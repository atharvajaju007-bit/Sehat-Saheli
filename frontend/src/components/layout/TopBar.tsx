"use client";

/**
 * Top header bar with app name and language selector.
 */

import { Globe } from "lucide-react";
import { useUIStore } from "@/lib/stores";
import { SUPPORTED_LANGUAGES } from "@/lib/constants";
import type { LanguageCode } from "@/types";

export function TopBar() {
  const { language, setLanguage } = useUIStore();

  return (
    <header className="sticky top-0 z-40 border-b border-dusty-rose-100 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-lg items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <span className="text-xl">🌸</span>
          <h1 className="bg-gradient-to-r from-dusty-rose-500 to-lavender-500 bg-clip-text text-lg font-bold text-transparent">
            Sehat Saheli
          </h1>
        </div>

        <div className="flex items-center gap-1">
          <Globe className="h-4 w-4 text-gray-400" />
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value as LanguageCode)}
            className="appearance-none bg-transparent text-sm font-medium text-gray-600 focus:outline-none cursor-pointer pr-1"
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
    </header>
  );
}
