"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Bell, CalendarClock, RefreshCw, X } from "lucide-react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/lib/hooks/useAuth";

type RevisionReminder = {
  id: string;
  surahNumber?: number;
  fromAyah?: number;
  toAyah?: number;
  nextReviewDate?: string;
};

export default function NotificationBell() {
  const { user } = useAuth();
  const router = useRouter();
  const panelRef = useRef<HTMLDivElement>(null);
  const [dueRevisions, setDueRevisions] = useState<RevisionReminder[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const count = dueRevisions.length;

  const checkRevisions = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const snap = await getDoc(doc(db, "memorization", user.uid));
      if (!snap.exists()) {
        setDueRevisions([]);
        return;
      }

      const sessions = (snap.data().sessions || []) as RevisionReminder[];
      const today = new Date().toISOString().split("T")[0];
      setDueRevisions(sessions.filter((session) => session.nextReviewDate && session.nextReviewDate <= today));
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!user) return;
    void checkRevisions();
    const interval = setInterval(() => {
      void checkRevisions();
    }, 60000);
    return () => clearInterval(interval);
  }, [checkRevisions, user]);

  useEffect(() => {
    if (!open) return;

    const closeOnOutsideClick = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", closeOnOutsideClick);
    return () => document.removeEventListener("mousedown", closeOnOutsideClick);
  }, [open]);

  const goToRevisions = () => {
    setOpen(false);
    router.push("/memorization");
  };

  return (
    <div ref={panelRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="relative grid h-10 w-10 place-items-center rounded-full text-slate-600 transition hover:bg-emerald-50 hover:text-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 dark:text-slate-300 dark:hover:bg-emerald-950/40 dark:hover:text-emerald-300"
        aria-label={count > 0 ? `${count} révision à traiter` : "Notifications"}
        aria-expanded={open}
      >
        <Bell className="h-5 w-5" />
        {count > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-xs font-bold text-white shadow-sm">
            {count}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-12 z-[70] w-[min(22rem,calc(100vw-1.5rem))] overflow-hidden rounded-[1.5rem] border border-emerald-900/10 bg-white shadow-2xl shadow-emerald-950/10 dark:border-white/10 dark:bg-slate-900">
          <div className="flex items-start justify-between gap-3 border-b border-slate-100 p-4 dark:border-slate-800">
            <div>
              <p className="text-sm font-bold text-slate-950 dark:text-white">Notifications</p>
              <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
                {count > 0 ? `${count} révision(s) à faire aujourd'hui.` : "Aucune révision urgente pour le moment."}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-full p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-white"
              aria-label="Fermer les notifications"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="max-h-72 overflow-y-auto p-3">
            {count === 0 ? (
              <div className="rounded-2xl bg-emerald-50 p-4 text-sm leading-6 text-emerald-950 dark:bg-emerald-950/30 dark:text-emerald-100">
                Votre planning de révision est à jour. Revenez plus tard pour les prochains rappels.
              </div>
            ) : (
              <div className="space-y-2">
                {dueRevisions.slice(0, 5).map((session) => (
                  <button
                    key={session.id}
                    type="button"
                    onClick={goToRevisions}
                    className="flex w-full items-start gap-3 rounded-2xl border border-amber-100 bg-amber-50/70 p-3 text-left transition hover:border-amber-300 hover:bg-amber-100 dark:border-amber-900/40 dark:bg-amber-950/20 dark:hover:bg-amber-950/35"
                  >
                    <CalendarClock className="mt-0.5 h-4 w-4 shrink-0 text-amber-700 dark:text-amber-300" />
                    <span>
                      <span className="block text-sm font-semibold text-slate-950 dark:text-white">
                        Sourate {session.surahNumber ?? "-"}, versets {session.fromAyah ?? "-"}-{session.toAyah ?? "-"}
                      </span>
                      <span className="mt-1 block text-xs text-slate-500 dark:text-slate-400">
                        Prévue le {session.nextReviewDate || "aujourd'hui"}
                      </span>
                    </span>
                  </button>
                ))}
                {count > 5 && (
                  <p className="px-2 text-xs text-slate-500 dark:text-slate-400">
                    +{count - 5} autre(s) révision(s) dans votre espace mémorisation.
                  </p>
                )}
              </div>
            )}
          </div>

          <div className="grid gap-2 border-t border-slate-100 p-3 dark:border-slate-800 sm:grid-cols-2">
            <button
              type="button"
              onClick={goToRevisions}
              className="min-h-10 rounded-full bg-emerald-700 px-4 text-sm font-bold text-white transition hover:bg-emerald-800"
            >
              Voir les révisions
            </button>
            <button
              type="button"
              onClick={() => void checkRevisions()}
              className="inline-flex min-h-10 items-center justify-center gap-2 rounded-full border border-slate-200 px-4 text-sm font-semibold text-slate-700 transition hover:border-emerald-200 hover:bg-emerald-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-emerald-950/30"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
              Actualiser
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
