"use client";
import { useEffect, useState } from "react";

interface Surah {
  number: number;
  name: string;
  englishName: string;
  numberOfAyahs: number;
}

export default function QuranNav({ onSelect }: { onSelect: (id: number) => void }) {
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
        placeholder="Rechercher une sourate..."
        className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 mb-4 text-sm"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <div className="space-y-1 max-h-[60vh] overflow-y-auto">
        {filtered.map(s => (
          <button
            key={s.number}
            onClick={() => onSelect(s.number)}
            className="w-full text-left px-3 py-2 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition flex justify-between items-center"
          >
            <span className="text-sm font-medium">{s.number}. {s.englishName} ({s.name})</span>
            <span className="text-xs text-slate-400">{s.numberOfAyahs} versets</span>
          </button>
        ))}
      </div>
    </div>
  );
}