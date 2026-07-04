"use client";

import { useEffect, useState } from "react";

export type Language = "EN" | "RU";

const STORAGE_KEY = "pharmascope-language";

export function useLanguage() {
  const [language, setLanguageState] = useState<Language>("EN");

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "RU" || stored === "EN") {
      setLanguageState(stored);
    }

    const onChange = () => {
      const next = window.localStorage.getItem(STORAGE_KEY);
      if (next === "RU" || next === "EN") {
        setLanguageState(next);
      }
    };

    window.addEventListener("pharmascope-language-change", onChange);
    return () => window.removeEventListener("pharmascope-language-change", onChange);
  }, []);

  const setLanguage = (next: Language) => {
    window.localStorage.setItem(STORAGE_KEY, next);
    setLanguageState(next);
    window.dispatchEvent(new Event("pharmascope-language-change"));
  };

  return { language, setLanguage, isRu: language === "RU" };
}
