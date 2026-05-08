/**
 * Internationalization configuration and translation loader.
 */

import type { LanguageCode } from "@/types";
import en from "./locales/en.json";

const translations: Record<string, typeof en> = { en };

// Lazy-load other languages only when needed
const languageLoaders: Record<string, () => Promise<typeof en>> = {
  hi: () => import("./locales/hi.json").then((m) => m.default),
  mr: () => import("./locales/mr.json").then((m) => m.default),
  bn: () => import("./locales/bn.json").then((m) => m.default),
  ta: () => import("./locales/ta.json").then((m) => m.default),
  te: () => import("./locales/te.json").then((m) => m.default),
  kn: () => import("./locales/kn.json").then((m) => m.default),
  gu: () => import("./locales/gu.json").then((m) => m.default),
};

export async function loadLanguage(code: LanguageCode): Promise<typeof en> {
  if (translations[code]) return translations[code];

  const loader = languageLoaders[code];
  if (loader) {
    const data = await loader();
    translations[code] = data;
    return data;
  }

  return en; // Fallback to English
}

/**
 * Get a translated string by dot-notation key.
 * Example: t("chat.welcome", translations)
 */
export function getTranslation(
  key: string,
  lang: LanguageCode,
): string {
  const dict = translations[lang] || en;
  const keys = key.split(".");
  let result: unknown = dict;
  for (const k of keys) {
    if (result && typeof result === "object" && k in result) {
      result = (result as Record<string, unknown>)[k];
    } else {
      // Fallback to English
      result = en;
      for (const fk of keys) {
        if (result && typeof result === "object" && fk in result) {
          result = (result as Record<string, unknown>)[fk];
        } else {
          return key; // Return key as fallback
        }
      }
      break;
    }
  }
  return typeof result === "string" ? result : key;
}
