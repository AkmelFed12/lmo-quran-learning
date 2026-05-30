"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import fr from "@/lib/i18n/fr.json";
import en from "@/lib/i18n/en.json";
import ar from "@/lib/i18n/ar.json";

type Locale = "fr" | "en" | "ar";
type Translations = typeof fr;

const translations: Record<Locale, Translations> = { fr, en, ar };

interface LocaleContextType {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (key: keyof Translations) => string;
}

const LocaleContext = createContext<LocaleContextType>({
  locale: "fr",
  setLocale: () => {},
  t: (key) => key,
});

export function useLocale() {
  return useContext(LocaleContext);
}

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("fr");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("locale") as Locale | null;
      if (saved && ["fr", "en", "ar"].includes(saved)) {
        setLocaleState(saved);
      }
    }
  }, []);

  const setLocale = (l: Locale) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("locale", l);
    }
    setLocaleState(l);
    if (typeof document !== "undefined") {
      document.documentElement.lang = l === "ar" ? "ar" : l;
      document.documentElement.dir = l === "ar" ? "rtl" : "ltr";
    }
  };

  const t = (key: keyof Translations) => {
    return translations[locale]?.[key] || key;
  };

  return (
    <LocaleContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LocaleContext.Provider>
  );
}