"use client";
import Link from "next/link";
import { useDashboardData } from "@/lib/hooks/useDashboardData";
import Loading from "@/components/shared/Loading";
import ProgressRing from "@/components/dashboard/ProgressRing";
import ProgressChart from "@/components/dashboard/ProgressChart";
import HeatmapChart from "@/components/dashboard/HeatmapChart";
import BadgesPanel from "@/components/dashboard/BadgesPanel";
import { ArrowRight, BookOpen, Brain, ClipboardCheck, Headphones, History } from "lucide-react";

const fallbackHistory = [
  { label: "Lecture", text: "Reprendre une sourate et écouter quelques versets.", icon: BookOpen },
  { label: "Révision", text: "Faire une courte session de mémorisation.", icon: Brain },
  { label: "Exercices", text: "Valider un module avec une série ciblée.", icon: ClipboardCheck },
];

function formatDate(value?: string) {
  if (!value) return "";
  return new Date(value).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });
}

export default function ProgressPage() {
  const { data, loading } = useDashboardData();

  if (loading) return <Loading />;

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <header className="card-premium p-6">
        <p className="text-sm font-bold uppercase tracking-[0.22em] text-gold">Mes progrès</p>
        <h1 className="mt-2 text-3xl font-heading font-bold text-slate-950 dark:text-white">Statistiques personnelles</h1>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600 dark:text-slate-300">
          Suivez ce qui a été lu, écouté, mémorisé et révisé. Les données restent liées à votre compte.
        </p>
      </header>

      <section className="grid gap-4 md:grid-cols-3">
        <div className="card-premium p-5">
          <ProgressRing value={data.arabicProgress} label="Arabe" />
        </div>
        <div className="card-premium p-5">
          <ProgressRing value={data.listeningProgress} label="Écoute" />
        </div>
        <div className="card-premium p-5">
          <ProgressRing value={data.memorizationProgress} label="Mémorisé" />
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="card-premium p-5">
          <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold">
            <History className="h-5 w-5 text-emerald-700 dark:text-gold" />
            Historique d'apprentissage
          </h2>
          <div className="space-y-3">
            {data.activityHistory.length > 0
              ? data.activityHistory.map((item, index) => (
                  <div key={`${item.createdAt}-${index}`} className="rounded-2xl border border-emerald-900/10 bg-ivory/70 p-4 dark:border-white/10 dark:bg-white/[0.04]">
                    <div className="flex items-start gap-3">
                      <Headphones className="mt-1 h-5 w-5 shrink-0 text-emerald-800 dark:text-gold" />
                      <div>
                        <h3 className="font-semibold">{item.type === "listening" ? "Écoute" : "Activité"}</h3>
                        <p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-300">{item.label || "Session enregistrée"}</p>
                        <p className="mt-1 text-xs text-slate-400">{formatDate(item.createdAt)}</p>
                      </div>
                    </div>
                  </div>
                ))
              : fallbackHistory.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.label} className="rounded-2xl border border-emerald-900/10 bg-ivory/70 p-4 dark:border-white/10 dark:bg-white/[0.04]">
                      <div className="flex items-start gap-3">
                        <Icon className="mt-1 h-5 w-5 shrink-0 text-emerald-800 dark:text-gold" />
                        <div>
                          <h3 className="font-semibold">{item.label}</h3>
                          <p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-300">{item.text}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
          </div>
          <div className="mt-5 flex flex-col gap-3 rounded-2xl bg-emerald-50 p-4 text-sm dark:bg-emerald-950/30">
            {data.lastListened?.surahId && (
              <p className="text-emerald-950 dark:text-emerald-100">
                Dernière écoute : sourate {data.lastListened.surahId}, verset {data.lastListened.ayahNumber || 1}.
              </p>
            )}
            {data.lastAssessment?.module && (
              <p className="text-emerald-950 dark:text-emerald-100">
                Dernier test : {data.lastAssessment.module} · {data.lastAssessment.score}/{data.lastAssessment.total}.
              </p>
            )}
            <Link href="/quran" className="inline-flex items-center gap-2 font-semibold text-emerald-800 dark:text-gold">
              Reprendre la lecture
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
        <BadgesPanel />
      </section>

      <section className="grid gap-5 lg:grid-cols-2">
        <ProgressChart />
        <HeatmapChart />
      </section>
    </div>
  );
}
