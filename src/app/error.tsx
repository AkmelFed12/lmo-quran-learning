"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Home, RefreshCw, ShieldAlert } from "lucide-react";

type AppErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

async function clearPageCache() {
  if (typeof window === "undefined") return;

  if ("caches" in window) {
    const keys = await caches.keys();
    await Promise.all(keys.map((key) => caches.delete(key)));
  }

  if ("serviceWorker" in navigator) {
    const registrations = await navigator.serviceWorker.getRegistrations();
    await Promise.all(registrations.map((registration) => registration.update().catch(() => undefined)));
  }
}

export default function AppError({ error, reset }: AppErrorProps) {
  useEffect(() => {
    console.error("Erreur de page LMO Quran Learning :", error);
  }, [error]);

  const reloadCleanly = async () => {
    await clearPageCache();
    window.location.reload();
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-ivory px-4 py-12 dark:bg-slate-950">
      <section className="w-full max-w-xl rounded-[2rem] border border-emerald-900/10 bg-white p-6 text-center shadow-2xl shadow-emerald-950/10 dark:border-white/10 dark:bg-slate-900">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-gold">
          <ShieldAlert className="h-7 w-7" />
        </div>
        <h1 className="mt-6 text-3xl font-heading font-bold text-slate-950 dark:text-white">Affichage interrompu</h1>
        <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-300">
          La page n'a pas pu terminer son chargement. Rechargez proprement pour récupérer la dernière version de l'application.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button
            type="button"
            onClick={reloadCleanly}
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-emerald-700 px-6 py-3 text-sm font-bold text-white transition hover:bg-emerald-800"
          >
            <RefreshCw className="h-4 w-4" />
            Recharger proprement
          </button>
          <button
            type="button"
            onClick={reset}
            className="inline-flex min-h-12 items-center justify-center rounded-full border border-emerald-900/10 px-6 py-3 text-sm font-bold text-emerald-900 transition hover:border-gold/40 dark:border-white/10 dark:text-emerald-100"
          >
            Réessayer
          </button>
          <Link
            href="/dashboard"
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-emerald-900/10 px-6 py-3 text-sm font-bold text-emerald-900 transition hover:border-gold/40 dark:border-white/10 dark:text-emerald-100"
          >
            <Home className="h-4 w-4" />
            Tableau de bord
          </Link>
        </div>
        <p className="mt-5 text-xs leading-6 text-slate-400 dark:text-slate-500">
          Si le problème revient après le rechargement, ouvrez les paramètres puis relancez l'application depuis la dernière version.
        </p>
      </section>
    </main>
  );
}
