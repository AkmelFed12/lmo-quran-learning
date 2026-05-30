interface DailyGoalProps {
  target: number;
  current: number;
}

export default function DailyGoal({ target, current }: DailyGoalProps) {
  const percent = Math.min((current / target) * 100, 100);
  return (
    <div className="card-premium p-6">
      <h3 className="text-lg font-semibold mb-2">Objectif du jour</h3>
      <p className="text-sm text-slate-500 mb-3">{current} / {target} versets</p>
      <div className="w-full bg-emerald-100 dark:bg-emerald-900/30 rounded-full h-3">
        <div className="bg-emerald-600 h-3 rounded-full transition-all duration-500" style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}