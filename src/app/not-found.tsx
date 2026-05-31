import Link from "next/link";
import { ArrowLeft, BookOpen, LayoutDashboard } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-ivory px-4 py-12 dark:bg-slate-950">
      <div className="w-full max-w-xl rounded-[2rem] border border-emerald-900/10 bg-white p-6 text-center shadow-2xl shadow-emerald-950/10 dark:border-white/10 dark:bg-slate-900">
        <p className="text-sm font-bold uppercase tracking-[0.22em] text-gold">Page introuvable</p>
        <h1 className="mt-3 text-7xl font-heading font-bold text-emerald-700 dark:text-emerald-400">404</h1>
        <p className="mt-4 text-2xl font-semibold text-slate-800 dark:text-white">Cette page n'est plus disponible</p>
        <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-slate-500 dark:text-slate-400">
          La page que vous cherchez n'existe pas ou a été déplacée.
        </p>
        <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/"
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-emerald-700 px-6 py-3 text-sm font-bold text-white transition hover:bg-emerald-800"
          >
            <ArrowLeft className="h-4 w-4" />
            Accueil
          </Link>
          <Link
            href="/dashboard"
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-emerald-900/10 px-6 py-3 text-sm font-bold text-emerald-900 transition hover:border-gold/40 dark:border-white/10 dark:text-emerald-100"
          >
            <LayoutDashboard className="h-4 w-4" />
            Tableau de bord
          </Link>
          <Link
            href="/quran"
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-emerald-900/10 px-6 py-3 text-sm font-bold text-emerald-900 transition hover:border-gold/40 dark:border-white/10 dark:text-emerald-100"
          >
            <BookOpen className="h-4 w-4" />
            Coran
          </Link>
        </div>
      </div>
    </div>
  );
}
