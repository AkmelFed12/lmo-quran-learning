interface ProgressRingProps {
  value: number; // 0-100
  label: string;
}

export default function ProgressRing({ value, label }: ProgressRingProps) {
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <svg width="100" height="100" className="transform -rotate-90">
        <circle
          cx="50" cy="50" r={radius}
          stroke="currentColor"
          strokeWidth="8"
          fill="transparent"
          className="text-emerald-100 dark:text-emerald-900/50"
        />
        <circle
          cx="50" cy="50" r={radius}
          stroke="currentColor"
          strokeWidth="8"
          fill="transparent"
          strokeLinecap="round"
          className="text-emerald-600 dark:text-emerald-400"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <span className="text-sm font-medium mt-1">{label}</span>
      <span className="text-lg font-bold">{value}%</span>
    </div>
  );
}