"use client";
import { useLocale } from "@/lib/hooks/useLocale";
import { Globe } from "lucide-react";

export default function LocaleSwitcher() {
  const { locale, setLocale } = useLocale();

  const cycleLocale = () => {
    if (locale === "fr") setLocale("en");
    else if (locale === "en") setLocale("ar");
    else setLocale("fr");
  };

  return (
    <button
      onClick={cycleLocale}
      className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
      title="Changer de langue"
    >
      <Globe className="w-5 h-5 text-slate-600 dark:text-slate-300" />
      <span className="sr-only">{locale.toUpperCase()}</span>
    </button>
  );
}