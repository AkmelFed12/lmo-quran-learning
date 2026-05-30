"use client";
import { useState, useEffect, useRef } from "react";
import { Search, X } from "lucide-react";
import Link from "next/link";

const searchData = [
  { type: "sourate", label: "Al-Fatiha (1)", href: "/quran?surah=1" },
  { type: "sourate", label: "Al-Baqara (2)", href: "/quran?surah=2" },
  { type: "sourate", label: "An-Nas (114)", href: "/quran?surah=114" },
  { type: "page", label: "Tableau de bord", href: "/dashboard" },
  { type: "page", label: "Parcours guidé", href: "/guided-path" },
  { type: "page", label: "Apprendre l'arabe", href: "/arabic" },
  { type: "page", label: "Leçons pédagogiques", href: "/lessons" },
  { type: "page", label: "Exercices et tests", href: "/learning-lab" },
  { type: "page", label: "Banque de questions", href: "/learning-lab" },
  { type: "page", label: "Mes lacunes", href: "/gaps" },
  { type: "page", label: "Révision ciblée", href: "/gaps" },
  { type: "page", label: "Coran", href: "/quran" },
  { type: "page", label: "Mémorisation", href: "/memorization" },
  { type: "page", label: "Cartes de révision", href: "/flashcards" },
  { type: "page", label: "Mes progrès", href: "/progress" },
  { type: "page", label: "Certificats", href: "/certificates" },
  { type: "page", label: "Bibliothèque pédagogique", href: "/library" },
  { type: "page", label: "Planning", href: "/planning" },
  { type: "page", label: "Quiz quotidien", href: "/daily-quiz" },
  { type: "page", label: "Classement", href: "/leaderboard" },
  { type: "page", label: "Profil", href: "/profile" },
  { type: "page", label: "Paramètres", href: "/settings" },
  { type: "page", label: "Témoignages", href: "/testimonials" },
  { type: "page", label: "Forum", href: "/forum" },
  { type: "blog", label: "Bienvenue sur LMO", href: "/blog/bienvenue-sur-lmo" },
  { type: "blog", label: "Mémorisation guidée", href: "/blog/nouveautes-memorisation" },
  { type: "faq", label: "Foire aux questions", href: "/faq" },
  { type: "page", label: "À propos", href: "/about" },
  { type: "page", label: "Contact", href: "/contact" },
];

export default function GlobalSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setOpen(false);
      return;
    }
    const filtered = searchData
      .filter((item) =>
        item.label.toLowerCase().includes(query.toLowerCase())
      )
      .slice(0, 6);
    setResults(filtered);
    setOpen(true);
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative w-full">
      <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-full px-3 py-2 gap-2">
        <Search className="w-4 h-4 text-slate-400 flex-shrink-0" />
        <input
          ref={inputRef}
          type="text"
          placeholder="Rechercher une sourate, un verset, une page…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="bg-transparent border-none outline-none text-sm w-full"
        />
        {query && (
          <button
            onClick={() => {
              setQuery("");
              setOpen(false);
            }}
            className="text-slate-400 flex-shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
      {open && results.length > 0 && (
        <div className="absolute top-full mt-2 w-full bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 z-50 py-2">
          {results.map((item, i) => (
            <Link
              key={i}
              href={item.href}
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-700 transition"
            >
              <span className="text-xs text-slate-400 uppercase">{item.type}</span>
              <span className="text-sm">{item.label}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
