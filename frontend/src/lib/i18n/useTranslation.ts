import { useEffect, useState } from "react";
import { useUIStore } from "@/lib/stores/uiStore";
import { loadLanguage, getTranslation } from "./config";

export function useTranslation() {
  const language = useUIStore((s) => s.language);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(false);
    loadLanguage(language).then(() => {
      setIsLoaded(true);
    });
  }, [language]);

  const t = (key: string) => {
    return getTranslation(key, language);
  };

  return { t, isLoaded, language };
}
