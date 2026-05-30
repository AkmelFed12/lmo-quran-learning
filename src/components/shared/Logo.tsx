import Link from "next/link";
import { BookOpen } from "lucide-react";

export default function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2 font-heading text-xl font-bold text-emerald-700 dark:text-emerald-400" aria-label="LMO Quran Learning">
      <span className="grid h-10 w-10 place-items-center rounded-2xl bg-emerald-100 text-emerald-700 shadow-sm dark:bg-emerald-950/70 dark:text-emerald-300">
        <BookOpen className="h-5 w-5" />
      </span>
      <span className="leading-none">
        LMO
        <span className="block text-xs font-body font-semibold tracking-wide text-slate-500 dark:text-slate-400">
          Quran
        </span>
      </span>
    </Link>
  );
}
