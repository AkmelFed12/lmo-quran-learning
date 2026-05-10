import { BookOpen } from "lucide-react";

const mockSurahs = ["Al-Fatiha", "Al-Baqara", "An-Nas"];

export default function RecentSurahs() {
  return (
    <div className="card-premium p-6">
      <h3 className="text-lg font-semibold mb-3">Dernières sourates</h3>
      <ul className="space-y-2">
        {mockSurahs.map((surah) => (
          <li key={surah} className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
            <BookOpen className="w-4 h-4 text-emerald-600" />
            {surah}
          </li>
        ))}
      </ul>
    </div>
  );
}