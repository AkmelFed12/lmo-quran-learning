"use client";
import Link from "next/link";
import { useDashboardData } from "@/lib/hooks/useDashboardData";
import Loading from "@/components/shared/Loading";
import ProgressRing from "@/components/dashboard/ProgressRing";
import ProgressChart from "@/components/dashboard/ProgressChart";
import HeatmapChart from "@/components/dashboard/HeatmapChart";
import BadgesPanel from "@/components/dashboard/BadgesPanel";
import { ArrowRight, BookOpen, Brain, ClipboardCheck, Flame, Headphones, History, Sparkles, Target, Trophy } from "lucide-react";

const fallbackHistory = [
  { label: "Lecture", text: "Reprendre une sourate et écouter quelques versets.", icon: BookOpen },
  { label: "Révision", text: "Faire une courte session de mémorisation.", icon: Brain },
  { label: "Exercices", text: "Valider un module avec une série ciblée.", icon: ClipboardCheck },
];

function formatDate(value?: string) {
  if (!value) return "";
  return new Date(value).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });
}

function getProgressLevel(score: number) {
  if (score >= 85) return { label: "Avancé", text: "Votre parcours est solide. Gardez un rythme régulier pour consolider.", icon: Trophy };
  if (score >= 55) return { label: "Intermédiaire", text: "Vous avez une bonne base. Une courte session ciblée peut faire avancer le niveau.", icon: Sparkles };
  if (score >= 25) return { label: "En construction", text: "Les fondations se mettent en place. Continuez avec des objectifs simples.", icon: Target };
  return { label: "Départ guidé", text: "Commencez petit : une lettre, une écoute ou quelques versets suffisent.", icon: BookOpen };
}

function getNextAction(arabic: number, listening: number, memorization: number) {
  if (arabic < 45) return { href: "/arabic", label: "Renforcer l'arabe", text: "Travaillez lettres, voyelles et assemblages courts." };
  if (listening < 45) return { href: "/quran", label: "Écouter un passage", text: "Écoutez une sourate courte puis répétez calmement." };
  if (memorization < 25) return { href: "/memorization", label: "Planifier une révision", text: "Choisissez une petite portion stable à revoir." };
  return { href: "/daily-quiz", label: "Valider avec le quiz", text: "Testez vos acquis avec quelques questions." };
}

export default function ProgressPage() {
  const { data, loading } = useDashboardData();

  if (loading) return <Loading />;

  const globalScore = Math.round((data.arabicProgress + data.listeningProgress + data.memorizationProgress) / 3);
  const level = getProgressLevel(globalScore);
  const LevelIcon = level.icon;
  const nextAction = getNextAction(data.arabicProgress, data.listeningProgress, data.memorizationProgress);
  const dailyGoalPercent = data.dailyGoalTarget > 0 ? Math.min(100, Math.round((data.dailyGoalCurrent / data.dailyGoalTarget) * 100)) : 0;

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <header className="card-premium p-6">
        <p className="text-sm font-bold uppercase tracking-[0.22em] text-gold">Mes progrès</p>
        <h1 className="mt-2 text-3xl font-heading font-bold text-slate-950 dark:text-white">Statistiques personnelles</h1>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600 dark:text-slate-300">
          Suivez ce qui a été lu, écouté, mémorisé et révisé. Les données restent liées à votre compte.
        </p>
      </header>

      <section className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-[2rem] border border-emerald-900/10 bg-gradient-to-br from-emerald-800 via-emerald-700 to-amber-600 p-6 text-white shadow-xl shadow-emerald-950/20">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.22em] text-emerald-50/80">Niveau global</p>
              <h2 className="mt-2 text-4xl font-heading font-bold">{level.label}</h2>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-emerald-50/90">{level.text}</p>
            </div>
            <div className="grid h-24 w-24 shrink-0 place-items-center rounded-[2rem] bg-white/15 backdrop-blur">
              <LevelIcon className="h-10 w-10" />
            </div>
          </div>
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl bg-white/12 p-4">
              <p className="text-3xl font-bold">{globalScore}%</p>
              <p className="mt-1 text-xs text-emerald-50/75">score moyen</p>
            </div>
            <div className="rounded-2xl bg-white/12 p-4">
              <p className="flex items-center gap-2 text-3xl font-bold"><Flame className="h-6 w-6" /> {data.streak}</p>
              <p className="mt-1 text-xs text-emerald-50/75">jour(s) de série</p>
            </div>
            <div className="rounded-2xl bg-white/12 p-4">
              <p className="text-3xl font-bold">{dailyGoalPercent}%</p>
              <p className="mt-1 text-xs text-emerald-50/75">objectif du jour</p>
            </div>
          </div>
        </div>

        <Link
          href={nextAction.href}
          className="group rounded-[2rem] border border-emerald-900/10 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-gold/50 hover:shadow-xl dark:border-white/10 dark:bg-slate-900"
        >
          <Target className="h-7 w-7 text-emerald-700 dark:text-gold" />
          <p className="mt-5 text-sm font-bold uppercase tracking-[0.2em] text-gold">Prochaine action</p>
          <h2 className="mt-2 text-2xl font-heading font-bold text-slate-950 dark:text-white">{nextAction.label}</h2>
          <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">{nextAction.text}</p>
          <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-emerald-800 dark:text-gold">
            Continuer
            <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
          </span>
        </Link>
      </section>

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
