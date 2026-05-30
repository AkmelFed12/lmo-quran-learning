export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-white via-emerald-50 to-sky-50 dark:from-slate-950 dark:via-slate-900 dark:to-emerald-950">
      <div className="relative">
        <div className="absolute inset-0 rounded-full bg-emerald-400/30 blur-xl" />
        <div className="relative h-14 w-14 rounded-full border-4 border-emerald-100 border-t-emerald-600 animate-spin dark:border-emerald-950 dark:border-t-emerald-300" />
      </div>
    </div>
  );
}
