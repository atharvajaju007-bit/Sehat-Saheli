"use client";

/**
 * Top header bar with app name, language dropdown, and dark mode toggle.
 */

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Globe, Sun, Moon, ChevronDown, Check } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useUIStore, useToast } from "@/lib/stores";
import { SUPPORTED_LANGUAGES } from "@/lib/constants";
import type { LanguageCode } from "@/types";
import { useTranslation } from "@/lib/i18n/useTranslation";

export function TopBar() {
  const { language, setLanguage, theme, toggleTheme, setTheme } = useUIStore();
  const { t } = useTranslation();
  const toast = useToast();
  const [langOpen, setLangOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Apply persisted theme on mount
  useEffect(() => {
    setTheme(theme);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setLangOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const currentLang = SUPPORTED_LANGUAGES.find((l) => l.code === language);

  return (
    <header className="sticky top-0 z-50 border-b border-dusty-rose-100 dark:border-gray-700 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md transition-colors">
      <div className="flex h-14 items-center justify-between px-4">
        {/* App branding — left */}
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl">🌸</span>
          <h1 className="bg-gradient-to-r from-dusty-rose-500 to-lavender-500 bg-clip-text text-lg font-bold text-transparent">
            {t("common.appName")}
          </h1>
        </Link>

        {/* Controls — right */}
        <div className="flex items-center gap-2">
          {/* Language dropdown */}
          <div ref={dropdownRef} className="relative">
            <button
              onClick={() => setLangOpen(!langOpen)}
              className="flex items-center gap-1.5 rounded-lg border border-gray-200 dark:border-gray-600 px-2.5 py-1.5 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-dusty-rose-50 dark:hover:bg-gray-800 transition-colors"
              aria-label="Select language"
            >
              <Globe className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">{currentLang?.nativeName}</span>
              <span className="sm:hidden">{currentLang?.code.toUpperCase()}</span>
              <ChevronDown className={`h-3.5 w-3.5 transition-transform ${langOpen ? "rotate-180" : ""}`} />
            </button>

            <AnimatePresence>
              {langOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-2 w-48 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 py-1 shadow-xl z-[60]"
                >
                  {SUPPORTED_LANGUAGES.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setLanguage(lang.code as LanguageCode);
                        setLangOpen(false);
                        toast.info(`Language: ${lang.nativeName}`);
                      }}
                      className={`flex w-full items-center justify-between px-3 py-2 text-sm transition-colors ${
                        language === lang.code
                          ? "bg-dusty-rose-50 dark:bg-gray-700 text-dusty-rose-600 dark:text-dusty-rose-300 font-medium"
                          : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                      }`}
                    >
                      <span>
                        {lang.nativeName}
                        <span className="ml-2 text-xs text-gray-400">({lang.name})</span>
                      </span>
                      {language === lang.code && (
                        <Check className="h-4 w-4 text-dusty-rose-500" />
                      )}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Dark mode toggle — extreme right */}
          <button
            onClick={() => {
              toggleTheme();
              toast.info(theme === "dark" ? "Light mode" : "Dark mode");
            }}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 dark:border-gray-600 text-gray-500 dark:text-yellow-400 hover:bg-dusty-rose-50 dark:hover:bg-gray-700 transition-colors"
            aria-label="Toggle dark mode"
          >
            {theme === "dark" ? (
              <Sun className="h-[18px] w-[18px]" />
            ) : (
              <Moon className="h-[18px] w-[18px]" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
