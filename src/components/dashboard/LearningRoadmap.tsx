import Link from "next/link";
import { ArrowRight, BookOpen, Brain, CheckCircle2, ClipboardCheck, Headphones, PenTool } from "lucide-react";

type LearningRoadmapProps = {
  arabicProgress: number;
  memorizationProgress: number;
  listeningProgress: number;
};

const roadmap = [
  {
    href: "/arabic",
    icon: PenTool,
    title: "Fondations arabes",
    text: "Modules verrouillés : lettres, formes, sons, voyelles et signes.",
    getProgress: (progress: LearningRoadmapProps) => progress.arabicProgress,
  },
  {
    href: "/quran",
    icon: BookOpen,
    title: "Lecture guidée",
    text: "Écouter, lire, répéter, cacher le texte, puis corriger.",
    getProgress: (progress: LearningRoadmapProps) => Math.max(progress.listeningProgress - 10, 0),
  },
  {
    href: "/quran",
    icon: Headphones,
    title: "Écoute active",
    text: "Récitation lente, répétition courte et prononciation stable.",
    getProgress: (progress: LearningRoadmapProps) => progress.listeningProgress,
  },
  {
    href: "/memorization",
    icon: Brain,
    title: "Mémorisation",
    text: "Petites portions, rappel actif et révision espacée.",
    getProgress: (progress: LearningRoadmapProps) => progress.memorizationProgress,
  },
  {
    href: "/learning-lab",
    icon: ClipboardCheck,
    title: "Exercices & tests",
    text: "Mini-tests et banque aléatoire pour valider le niveau réel.",
    getProgress: (progress: LearningRoadmapProps) => Math.round((progress.arabicProgress + progress.memorizationProgress + progress.listeningProgress) / 3),
  },
];

export default function LearningRoadmap(props: LearningRoadmapProps) {
  return (
    <section className="card-premium p-5 sm:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600 dark:text-emerald-300">
            Parcours personnel
          </p>
          <h2 className="mt-2 text-2xl font-heading font-bold text-slate-900 dark:text-white">
            Une progression par maîtrise réelle
          </h2>
        </div>
        <Link href="/planning" className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 hover:text-emerald-800 dark:text-emerald-300">
          Organiser ma semaine
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {roadmap.map((step) => {
          const Icon = step.icon;
          const progress = Math.min(Math.max(Math.round(step.getProgress(props)), 0), 100);
          const completed = progress >= 100;

          return (
            <Link
              key={step.title}
              href={step.href}
              className="group rounded-2xl border border-slate-100 bg-slate-50/80 p-4 transition hover:-translate-y-1 hover:border-emerald-200 hover:bg-white hover:shadow-lg dark:border-slate-800 dark:bg-slate-900/70 dark:hover:border-emerald-800 dark:hover:bg-slate-900"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="grid h-11 w-11 place-items-center rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
                  <Icon className="h-5 w-5" />
                </div>
                {completed ? (
                  <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                ) : (
                  <span className="rounded-full bg-white px-2 py-1 text-xs font-semibold text-slate-500 dark:bg-slate-800 dark:text-slate-300">
                    {progress}%
                  </span>
                )}
              </div>
              <h3 className="mt-4 font-semibold text-slate-900 dark:text-white">{step.title}</h3>
              <p className="mt-2 min-h-[3rem] text-sm leading-6 text-slate-500 dark:text-slate-400">
                {step.text}
              </p>
              <div className="mt-4 h-2 rounded-full bg-slate-200 dark:bg-slate-800">
                <div className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all" style={{ width: `${progress}%` }} />
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
