"use client";

import { useEffect, useState } from "react";
import { RefreshCw, ShieldAlert } from "lucide-react";

type GlobalErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

async function clearApplicationCache() {
  if (typeof window === "undefined") return;

  try {
    if ("caches" in window) {
      const keys = await caches.keys();
      await Promise.all(keys.map((key) => caches.delete(key)));
    }
  } catch {}

  try {
    if ("serviceWorker" in navigator) {
      const registrations = await navigator.serviceWorker.getRegistrations();
      await Promise.all(registrations.map((registration) => registration.update().catch(() => undefined)));
    }
  } catch {}
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  const [reloading, setReloading] = useState(false);

  useEffect(() => {
    console.error("Erreur globale LMO Quran Learning :", error);
  }, [error]);

  const reloadCleanly = async () => {
    if (reloading) return;
    setReloading(true);
    await clearApplicationCache();
    window.location.reload();
  };

  return (
    <html lang="fr">
      <body className="min-h-screen bg-[#fbf7ef] text-slate-900">
        <main className="flex min-h-screen items-center justify-center px-4 py-12">
          <section className="w-full max-w-xl rounded-[2rem] border border-emerald-900/10 bg-white p-6 text-center shadow-2xl shadow-emerald-950/10">
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-emerald-100 text-emerald-800">
              <ShieldAlert className="h-7 w-7" />
            </div>
            <h1 className="mt-6 text-3xl font-bold">La page doit être rechargée</h1>
            <p className="mt-4 text-sm leading-7 text-slate-600">
              Une ancienne version de l'application ou un module du navigateur a interrompu l'affichage. Vous pouvez relancer la page proprement.
            </p>
            {error.digest && (
              <p className="mt-4 rounded-2xl bg-slate-50 px-4 py-3 text-xs text-slate-500">
                Référence : {error.digest}
              </p>
            )}
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <button
                type="button"
                onClick={reloadCleanly}
                disabled={reloading}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-emerald-700 px-6 py-3 text-sm font-bold text-white transition hover:bg-emerald-800"
              >
                <RefreshCw className={`h-4 w-4 ${reloading ? "animate-spin" : ""}`} />
                {reloading ? "Rechargement..." : "Recharger proprement"}
              </button>
              <button
                type="button"
                onClick={reset}
                className="inline-flex min-h-12 items-center justify-center rounded-full border border-slate-200 px-6 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
              >
                Réessayer
              </button>
            </div>
            <p className="mt-5 text-xs leading-6 text-slate-400">
              Cette action ne supprime pas vos données. Elle recharge seulement la dernière version disponible.
            </p>
          </section>
        </main>
      </body>
    </html>
  );
}
