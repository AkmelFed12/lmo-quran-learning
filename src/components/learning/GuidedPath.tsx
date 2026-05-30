"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowRight, CheckCircle2, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { guidedTasks } from "@/lib/learning-content";
import { useDashboardData } from "@/lib/hooks/useDashboardData";

function getTodayKey() {
  return new Date().toISOString().split("T")[0];
}

function buildStorageKey() {
  return `lmo_guided_path_${getTodayKey()}`;
}

export default function GuidedPath() {
  const { data, loading } = useDashboardData();
  const [doneTasks, setDoneTasks] = useState<string[]>([]);
  const storageKey = useMemo(() => buildStorageKey(), []);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(storageKey);
      setDoneTasks(saved ? JSON.parse(saved) : []);
    } catch {
      setDoneTasks([]);
    }
  }, [storageKey]);

  const toggleTask = (id: string) => {
    const next = doneTasks.includes(id) ? doneTasks.filter((taskId) => taskId !== id) : [...doneTasks, id];
    setDoneTasks(next);
    window.localStorage.setItem(storageKey, JSON.stringify(next));
  };

  const reset = () => {
    setDoneTasks([]);
    window.localStorage.removeItem(storageKey);
  };

  const progress = Math.round((doneTasks.length / guidedTasks.length) * 100);
  const recommendedTask =
    data.arabicProgress < 35 ? "arabic" : data.listeningProgress < 40 ? "listen" : data.memorizationProgress < 20 ? "revision" : "quiz";

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <header className="card-premium p-5 sm:p-6">
        <p className="text-sm font-bold uppercase tracking-[0.22em] text-gold">Parcours guidé</p>
        <h1 className="mt-2 text-3xl font-heading font-bold text-slate-950 dark:text-white sm:text-4xl">
          Aujourd'hui, avancez simplement
        </h1>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600 dark:text-slate-300">
          Une session courte et réaliste : écouter, lire, répondre, puis revoir. Le but est la régularité avant la quantité.
        </p>
      </header>

      <section className="grid gap-4 lg:grid-cols-[0.75fr_1.25fr]">
        <div className="card-premium p-5">
          <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">Progression du jour</p>
          <p className="mt-2 text-5xl font-bold text-emerald-900 dark:text-gold">{progress}%</p>
          <div className="mt-4 h-3 rounded-full bg-emerald-100 dark:bg-emerald-950/50">
            <div className="h-full rounded-full bg-gradient-to-r from-emerald-700 to-gold" style={{ width: `${progress}%` }} />
          </div>
          <p className="mt-4 text-sm leading-6 text-slate-600 dark:text-slate-300">
            {loading
              ? "Chargement de votre progression..."
              : `Arabe ${data.arabicProgress}% · Écoute ${data.listeningProgress}% · Mémorisation ${data.memorizationProgress}%`}
          </p>
          <Button variant="outline" onClick={reset} className="mt-5 min-h-11">
            <RotateCcw className="mr-2 h-4 w-4" />
            Réinitialiser aujourd'hui
          </Button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {guidedTasks.map((task) => {
            const Icon = task.icon;
            const done = doneTasks.includes(task.id);
            const recommended = task.id === recommendedTask;
            return (
              <article
                key={task.id}
                className={`rounded-[1.6rem] border p-5 transition ${
                  done
                    ? "border-emerald-400 bg-emerald-50 dark:border-emerald-700 dark:bg-emerald-950/30"
                    : "border-emerald-900/10 bg-white dark:border-white/10 dark:bg-slate-900"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="grid h-12 w-12 place-items-center rounded-2xl bg-emerald-950 text-gold">
                    <Icon className="h-5 w-5" />
                  </div>
                  {recommended && (
                    <span className="rounded-full bg-gold/20 px-3 py-1 text-xs font-bold text-amber-900 dark:text-gold">
                      conseillé
                    </span>
                  )}
                </div>
                <h2 className="mt-4 text-lg font-bold text-slate-950 dark:text-white">{task.title}</h2>
                <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{task.description}</p>
                <p className="mt-3 text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">{task.minutes} min</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  <Button onClick={() => toggleTask(task.id)} variant={done ? "default" : "outline"} className="min-h-11">
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    {done ? "Fait" : "Marquer fait"}
                  </Button>
                  <Link
                    href={task.href}
                    className="inline-flex min-h-11 items-center justify-center rounded-full border border-slate-300 bg-transparent px-5 py-2 font-medium transition-colors hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 dark:border-slate-600 dark:hover:bg-slate-800"
                  >
                    Ouvrir
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}
