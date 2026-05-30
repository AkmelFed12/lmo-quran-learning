import { BookOpen } from "lucide-react";

interface RecentSurahsProps {
  surahs?: string[];
}

export default function RecentSurahs({ surahs = [] }: RecentSurahsProps) {
  const displaySurahs = surahs.length > 0 ? surahs : ["Al-Fatiha", "Al-Baqara", "An-Nas"];

  return (
    <div className="card-premium p-6">
      <h3 className="text-lg font-semibold mb-3">Dernières sourates</h3>
      <ul className="space-y-2">
        {displaySurahs.map((surah, idx) => (
          <li key={idx} className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
            <BookOpen className="w-4 h-4 text-emerald-600" />
            {surah}
          </li>
        ))}
      </ul>
    </div>
  );
}