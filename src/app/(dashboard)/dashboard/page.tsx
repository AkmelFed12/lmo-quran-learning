"use client";
import { useAuth } from "@/lib/hooks/useAuth";
import { useDashboardData } from "@/lib/hooks/useDashboardData";
import Loading from "@/components/shared/Loading";
import DailySessionPlanner from "@/components/dashboard/DailySessionPlanner";
import TodayFocus from "@/components/dashboard/TodayFocus";
import LearningRoadmap from "@/components/dashboard/LearningRoadmap";
import StudyCoach from "@/components/dashboard/StudyCoach";
import DailyGoal from "@/components/dashboard/DailyGoal";
import RecentSurahs from "@/components/dashboard/RecentSurahs";
import BadgeSystem from "@/components/dashboard/BadgeSystem";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, BookMarked, ClipboardCheck, Library, Medal } from "lucide-react";
import AdSlot from "@/components/monetization/AdSlot";
import { GOOGLE_ADSENSE_SLOTS } from "@/lib/monetization";

const dashboardShortcuts = [
  {
    href: "/guided-path",
    icon: ClipboardCheck,
    title: "Parcours guidé",
    text: "Une feuille de route quotidienne, courte et mesurable.",
  },
  {
    href: "/certificates",
    icon: Medal,
    title: "Attestations",
    text: "Suivre les niveaux validés avant chaque attestation interne.",
  },
  {
    href: "/library",
    icon: Library,
    title: "Bibliothèque",
    text: "Sources, méthode, tajwid, arabe et repères fiables.",
  },
  {
    href: "/quran",
    icon: BookMarked,
    title: "Lecture Coran",
    text: "Reprendre la lecture avec audio, notes et marque-pages.",
  },
];

export default function DashboardPage() {
  const { user } = useAuth();
  const { data, loading } = useDashboardData();
  const firstName = user?.displayName?.split(" ")[0] || user?.email?.split("@")[0] || "Apprenant";

  if (loading) return <Loading />;

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-7xl space-y-5">
      <header className="rounded-[2rem] border border-emerald-900/10 bg-white/85 p-5 shadow-sm dark:border-white/10 dark:bg-slate-900/70 sm:p-6">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-gold">Tableau de bord</p>
        <h1 className="mt-2 text-3xl font-heading font-bold text-slate-950 dark:text-white sm:text-4xl">
          Assalamu alaykum, {firstName}
        </h1>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600 dark:text-slate-300">
          Votre espace reste volontairement simple : une session du jour, un parcours clair et quelques indicateurs utiles.
        </p>
      </header>

      <AdSlot slot={GOOGLE_ADSENSE_SLOTS.dashboard} minHeight={96} />

      <DailySessionPlanner />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {dashboardShortcuts.map((item) => {
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className="group rounded-[1.5rem] border border-emerald-900/10 bg-white/85 p-5 shadow-sm transition hover:-translate-y-1 hover:border-gold/50 hover:shadow-xl hover:shadow-emerald-950/10 dark:border-white/10 dark:bg-slate-900/70"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="grid h-11 w-11 place-items-center rounded-2xl bg-emerald-100 text-emerald-900 dark:bg-emerald-950/70 dark:text-gold">
                  <Icon className="h-5 w-5" />
                </div>
                <ArrowRight className="mt-2 h-4 w-4 text-slate-400 transition group-hover:translate-x-1 group-hover:text-gold" />
              </div>
              <h2 className="mt-5 font-heading text-lg font-bold text-slate-950 dark:text-white">{item.title}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{item.text}</p>
            </Link>
          );
        })}
      </section>

      <div className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
        <TodayFocus
          arabicProgress={data.arabicProgress}
          memorizationProgress={data.memorizationProgress}
          listeningProgress={data.listeningProgress}
        />
        <StudyCoach
          arabicProgress={data.arabicProgress}
          memorizationProgress={data.memorizationProgress}
          listeningProgress={data.listeningProgress}
          streak={data.streak}
        />
      </div>

      <LearningRoadmap
        arabicProgress={data.arabicProgress}
        memorizationProgress={data.memorizationProgress}
        listeningProgress={data.listeningProgress}
      />

      <div className="grid gap-5 lg:grid-cols-3">
        <DailyGoal target={data.dailyGoalTarget} current={data.dailyGoalCurrent} />
        <RecentSurahs surahs={data.recentSurahs} />
        <BadgeSystem />
      </div>
    </motion.div>
  );
}
