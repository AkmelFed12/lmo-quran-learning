"use client";
import { useEffect, useState } from "react";

interface Surah {
  number: number;
  name: string;
  englishName: string;
  numberOfAyahs: number;
}

export default function QuranNav({ activeSurah, onSelect }: { activeSurah?: number; onSelect: (id: number) => void }) {
  const [surahs, setSurahs] = useState<Surah[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("https://api.alquran.cloud/v1/surah")
      .then(res => res.json())
      .then(data => {
        // L'API renvoie un tableau dans data.data
        if (data?.data && Array.isArray(data.data)) {
          setSurahs(data.data);
        }
      })
      .catch(console.error);
  }, []);

  const filtered = surahs.filter(s =>
    s.englishName.toLowerCase().includes(search.toLowerCase()) ||
    s.name.includes(search)
  );

  return (
    <div className="card-premium p-4">
      <input
        type="text"
        placeholder="Rechercher une sourate…"
        className="mb-4 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-emerald-600 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <div className="space-y-1 max-h-[60vh] overflow-y-auto">
        {filtered.map(s => (
          <button
            key={s.number}
            onClick={() => onSelect(s.number)}
            className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left transition ${
              activeSurah === s.number
                ? "bg-emerald-950 text-white shadow-sm dark:bg-gold dark:text-slate-950"
                : "text-slate-800 hover:bg-emerald-50 dark:text-slate-100 dark:hover:bg-emerald-900/25"
            }`}
          >
            <span className="text-sm font-medium">{s.number}. {s.englishName} ({s.name})</span>
            <span className={`text-xs ${activeSurah === s.number ? "text-white/75 dark:text-slate-900/70" : "text-slate-500 dark:text-slate-400"}`}>{s.numberOfAyahs} versets</span>
          </button>
        ))}
      </div>
    </div>
  );
}
