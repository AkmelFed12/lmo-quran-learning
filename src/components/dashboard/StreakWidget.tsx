import { Flame } from "lucide-react";

export default function StreakWidget({ streak }: { streak: number }) {
  return (
    <div className="card-premium p-6 flex flex-col items-center justify-center bg-gradient-to-br from-amber-50 to-amber-100/50 dark:from-amber-900/20 dark:to-amber-800/10 border-amber-200 dark:border-amber-700/50">
      <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mb-3">
        <Flame className="w-7 h-7 text-amber-600 dark:text-amber-400" />
      </div>
      <span className="text-3xl font-bold">{streak}</span>
      <span className="text-sm text-slate-500">jours consécutifs</span>
    </div>
  );
}