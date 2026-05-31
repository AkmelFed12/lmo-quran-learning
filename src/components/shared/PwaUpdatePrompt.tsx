"use client";

import { useEffect, useState } from "react";
import { RefreshCw, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PwaUpdatePrompt() {
  const [waitingRegistration, setWaitingRegistration] = useState<ServiceWorkerRegistration | null>(null);
  const [visible, setVisible] = useState(false);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (!("serviceWorker" in navigator)) return undefined;

    let refreshing = false;

    const handleControllerChange = () => {
      if (refreshing) return;
      refreshing = true;
      window.location.reload();
    };

    const watchRegistration = (registration: ServiceWorkerRegistration) => {
      if (registration.waiting && navigator.serviceWorker.controller) {
        setWaitingRegistration(registration);
        setVisible(true);
      }

      registration.addEventListener("updatefound", () => {
        const installingWorker = registration.installing;
        if (!installingWorker) return;

        installingWorker.addEventListener("statechange", () => {
          if (installingWorker.state === "installed" && navigator.serviceWorker.controller) {
            setWaitingRegistration(registration);
            setVisible(true);
          }
        });
      });
    };

    navigator.serviceWorker.addEventListener("controllerchange", handleControllerChange);
    navigator.serviceWorker.ready.then((registration) => {
      watchRegistration(registration);
      registration.update().catch(() => undefined);
    }).catch(() => undefined);

    return () => {
      navigator.serviceWorker.removeEventListener("controllerchange", handleControllerChange);
    };
  }, []);

  const updateApplication = async () => {
    if (updating) return;
    setUpdating(true);

    try {
      if ("caches" in window) {
        const keys = await caches.keys();
        await Promise.all(keys.filter((key) => key.includes("workbox") || key.includes("next")).map((key) => caches.delete(key)));
      }
    } catch {
      // Même si le navigateur refuse l'accès au cache, on continue la mise à jour.
    }

    waitingRegistration?.waiting?.postMessage({ type: "SKIP_WAITING" });
    window.setTimeout(() => window.location.reload(), 350);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-24 left-3 right-3 z-[70] mx-auto max-w-md rounded-[1.4rem] border border-emerald-900/10 bg-white p-4 shadow-2xl shadow-emerald-950/20 dark:border-white/10 dark:bg-slate-900 md:bottom-5" role="status" aria-live="polite">
      <div className="flex items-start gap-3">
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-gold">
          <RefreshCw className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-slate-950 dark:text-white">Nouvelle version disponible</p>
          <p className="mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400">
            Mettez l'application à jour pour afficher les dernières corrections et éviter l'ancien cache.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Button size="sm" onClick={updateApplication} disabled={updating}>
              <RefreshCw className={`mr-2 h-4 w-4 ${updating ? "animate-spin" : ""}`} />
              {updating ? "Mise à jour..." : "Mettre à jour"}
            </Button>
            <Button size="sm" variant="outline" onClick={() => setVisible(false)} disabled={updating}>
              Plus tard
            </Button>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setVisible(false)}
          className="rounded-full p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-white/10 dark:hover:text-white"
          aria-label="Fermer"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
