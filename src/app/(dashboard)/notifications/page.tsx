"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AlertCircle, Bell, BellOff, CalendarClock, ClipboardCheck, Lightbulb, RefreshCw, Settings } from "lucide-react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/lib/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type RevisionReminder = {
  id: string;
  surahNumber?: number;
  fromAyah?: number;
  toAyah?: number;
  nextReviewDate?: string;
};

export default function NotificationsPage() {
  const { user } = useAuth();
  const [permission, setPermission] = useState<NotificationPermission | "unsupported">("unsupported");
  const [revisions, setRevisions] = useState<RevisionReminder[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const today = useMemo(() => new Date().toISOString().split("T")[0], []);
  const sortedRevisions = useMemo(
    () =>
      revisions
        .filter((session) => typeof session.nextReviewDate === "string" && session.nextReviewDate.length > 0)
        .sort((first, second) => first.nextReviewDate!.localeCompare(second.nextReviewDate!)),
    [revisions],
  );
  const dueRevisions = sortedRevisions.filter((session) => session.nextReviewDate && session.nextReviewDate <= today);
  const upcomingRevisions = revisions
    .filter((session) => session.nextReviewDate && session.nextReviewDate > today)
    .sort((first, second) => first.nextReviewDate!.localeCompare(second.nextReviewDate!))
    .slice(0, 5);

  const loadNotifications = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setLoadError(null);
    try {
      if ("Notification" in window) {
        setPermission(Notification.permission);
      }

      const snapshot = await getDoc(doc(db, "memorization", user.uid));
      const sessions = snapshot.exists() ? (snapshot.data().sessions || []) as RevisionReminder[] : [];
      setRevisions(sessions.filter((session) => session && typeof session === "object"));
    } catch {
      setLoadError("Impossible de charger les rappels pour le moment. Vous pouvez réessayer sans risque.");
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!user) return;
    setPermission("Notification" in window ? Notification.permission : "unsupported");
    void loadNotifications();
  }, [loadNotifications, user]);

  const permissionLabel =
    permission === "granted"
      ? "Notifications activées"
      : permission === "denied"
        ? "Notifications bloquées par le navigateur"
        : permission === "default"
          ? "Notifications non activées"
          : "Notifications non supportées";

  const smartAdvice =
    permission === "denied"
      ? {
          title: "Notifications bloquées",
          text: "Votre navigateur bloque les rappels. Vous pouvez toujours utiliser cette page comme liste de révision.",
          href: "/settings",
          cta: "Voir les paramètres",
        }
      : dueRevisions.length > 0
        ? {
            title: "À faire aujourd'hui",
            text: `Commencez par ${dueRevisions[0].surahNumber ? `la sourate ${dueRevisions[0].surahNumber}` : "la première révision"} puis gardez une session courte.`,
            href: "/memorization",
            cta: "Ouvrir la mémorisation",
          }
        : upcomingRevisions.length > 0
          ? {
              title: "Préparer la suite",
              text: `Prochaine révision prévue le ${upcomingRevisions[0].nextReviewDate}. Une courte écoute aujourd'hui peut aider la mémorisation.`,
              href: "/quran",
              cta: "Écouter le Coran",
            }
          : {
              title: "Rythme à jour",
              text: "Aucune révision urgente. Profitez-en pour faire le quiz quotidien ou consolider une sourate courte.",
              href: "/daily-quiz",
              cta: "Faire le quiz",
            };

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <header className="rounded-[2rem] border border-emerald-900/10 bg-white/85 p-5 shadow-sm dark:border-white/10 dark:bg-slate-900/70 sm:p-6">
        <p className="text-sm font-bold uppercase tracking-[0.22em] text-gold">Notifications</p>
        <h1 className="mt-2 text-3xl font-heading font-bold text-slate-950 dark:text-white">
          Rappels et prochaines actions
        </h1>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600 dark:text-slate-300">
          Retrouvez ici les révisions dues, les rappels utiles et l'état des notifications sur votre appareil.
        </p>
      </header>

      <section className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-5">
            <CalendarClock className="h-5 w-5 text-amber-600" />
            <p className="mt-3 text-3xl font-bold">{dueRevisions.length}</p>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">révision(s) à faire aujourd'hui</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            {permission === "granted" ? <Bell className="h-5 w-5 text-emerald-600" /> : <BellOff className="h-5 w-5 text-slate-400" />}
            <p className="mt-3 text-base font-bold">{permissionLabel}</p>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">état sur ce navigateur</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <ClipboardCheck className="h-5 w-5 text-emerald-700 dark:text-gold" />
            <p className="mt-3 text-3xl font-bold">{upcomingRevisions.length}</p>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">prochaines révisions visibles</p>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-3">
            <CardTitle>À traiter</CardTitle>
            <Button variant="outline" size="sm" onClick={() => void loadNotifications()} disabled={loading} aria-label="Actualiser les rappels">
              <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
              Actualiser
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {loadError ? (
              <div className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-950 dark:border-amber-900/50 dark:bg-amber-950/25 dark:text-amber-100">
                <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
                <span>{loadError}</span>
              </div>
            ) : dueRevisions.length === 0 ? (
              <div className="rounded-2xl bg-emerald-50 p-4 text-sm leading-6 text-emerald-950 dark:bg-emerald-950/30 dark:text-emerald-100">
                Rien d'urgent pour le moment. Votre planning de révision est à jour.
              </div>
            ) : (
              dueRevisions.map((session) => (
                <Link
                  key={session.id}
                  href="/memorization"
                  className="flex items-start gap-3 rounded-2xl border border-amber-100 bg-amber-50/70 p-4 transition hover:border-amber-300 hover:bg-amber-100 dark:border-amber-900/40 dark:bg-amber-950/20 dark:hover:bg-amber-950/35"
                >
                  <CalendarClock className="mt-0.5 h-5 w-5 shrink-0 text-amber-700 dark:text-amber-300" />
                  <span>
                    <span className="block font-semibold text-slate-950 dark:text-white">
                      Sourate {session.surahNumber ?? "-"}, versets {session.fromAyah ?? "-"}-{session.toAyah ?? "-"}
                    </span>
                    <span className="mt-1 block text-sm text-slate-500 dark:text-slate-400">
                      Prévue le {session.nextReviewDate || "aujourd'hui"}
                    </span>
                  </span>
                </Link>
              ))
            )}
          </CardContent>
        </Card>

        <div className="space-y-5">
          <Card className="border-emerald-900/10 bg-gradient-to-br from-emerald-800 to-emerald-700 text-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-gold" />
                Conseil intelligent
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-semibold">{smartAdvice.title}</p>
              <p className="mt-2 text-sm leading-6 text-emerald-50/85">{smartAdvice.text}</p>
              <Link href={smartAdvice.href} className="mt-4 inline-flex rounded-full bg-white px-4 py-2 text-sm font-bold text-emerald-800 transition hover:bg-gold">
                {smartAdvice.cta}
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Accès rapides</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3">
              <Link href="/memorization" className="rounded-2xl border border-slate-100 p-4 text-sm font-semibold transition hover:border-gold/50 dark:border-slate-800">
                Ouvrir la mémorisation
              </Link>
              <Link href="/daily-quiz" className="rounded-2xl border border-slate-100 p-4 text-sm font-semibold transition hover:border-gold/50 dark:border-slate-800">
                Faire le quiz quotidien
              </Link>
              <Link href="/settings" className="flex items-center gap-2 rounded-2xl border border-slate-100 p-4 text-sm font-semibold transition hover:border-gold/50 dark:border-slate-800">
                <Settings className="h-4 w-4" />
                Gérer les notifications
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>À venir</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {upcomingRevisions.length === 0 ? (
                <p className="text-sm leading-6 text-slate-500 dark:text-slate-400">Aucune révision planifiée à court terme.</p>
              ) : (
                upcomingRevisions.map((session) => (
                  <p key={session.id} className="rounded-2xl bg-slate-50 p-3 text-sm leading-6 text-slate-600 dark:bg-white/[0.04] dark:text-slate-300">
                    Sourate {session.surahNumber ?? "-"} v{session.fromAyah ?? "-"}-{session.toAyah ?? "-"} · {session.nextReviewDate}
                  </p>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
