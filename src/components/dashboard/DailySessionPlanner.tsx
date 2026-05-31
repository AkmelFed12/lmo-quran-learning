"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, BookOpen, CheckCircle2, Clock, Headphones, Languages, Repeat2 } from "lucide-react";
import { studyPlans } from "@/lib/learning-content";

const durationPlans = {
  5: ["1 min : revoir une erreur précise.", "2 min : écouter un modèle court.", "2 min : répéter lentement puis arrêter."],
  10: ["3 min : fondation arabe du jour.", "3 min : écoute et répétition.", "2 min : mini-exercice.", "2 min : noter la difficulté."],
  20: ["5 min : alphabet, signes ou tajwid.", "5 min : syllabes ou mots courts.", "6 min : lecture accompagnée.", "4 min : révision et auto-évaluation."],
};

export default function DailySessionPlanner() {
  const [duration, setDuration] = useState<5 | 10 | 20>(10);
  const [selectedPlanId, setSelectedPlanId] = useState(studyPlans[0].id);
  const selectedPlan = studyPlans.find((plan) => plan.id === selectedPlanId) || studyPlans[0];

  return (
    <section className="card-premium overflow-hidden p-0">
      <div className="grid gap-0 xl:grid-cols-[0.8fr_1.2fr]">
        <div className="bg-emerald-950 p-5 text-white sm:p-6">
          <p className="text-sm font-bold uppercase tracking-[0.22em] text-gold">Aujourd'hui, fais ceci</p>
          <h2 className="mt-4 text-3xl font-heading font-bold">Un plan court, réaliste et vérifiable.</h2>
          <p className="mt-3 text-sm leading-7 text-emerald-50/80">
            Choisissez un rythme adapté. Une bonne séance a une intention claire, une pratique courte et un point de contrôle.
          </p>

          <div className="mt-5 grid grid-cols-3 gap-2">
            {[5, 10, 20].map((value) => (
              <button
                type="button"
                aria-pressed={duration === value}
                key={value}
                onClick={() => setDuration(value as 5 | 10 | 20)}
                className={`touch-target rounded-2xl border px-3 py-3 text-sm font-semibold transition ${
                  duration === value
                    ? "border-gold bg-gold text-emerald-950"
                    : "border-white/10 bg-white/10 text-white hover:bg-white/15"
                }`}
              >
                {value} min
              </button>
            ))}
          </div>

          <div className="mt-5 grid gap-2">
            {studyPlans.map((plan) => (
              <button
                type="button"
                aria-pressed={selectedPlanId === plan.id}
                key={plan.id}
                onClick={() => setSelectedPlanId(plan.id)}
                className={`rounded-2xl border px-4 py-3 text-left text-sm transition ${
                  selectedPlanId === plan.id
                    ? "border-gold bg-white text-emerald-950"
                    : "border-white/10 bg-white/10 text-white hover:bg-white/15"
                }`}
              >
                <span className="block font-bold">{plan.title}</span>
                <span className="mt-1 block text-xs opacity-75">{plan.audience}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-5 p-5 sm:p-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-2xl bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-gold">
                <Clock className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-950 dark:text-white">Séance de {duration} minutes</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">{selectedPlan.rhythm}</p>
              </div>
            </div>

            <div className="space-y-3">
              {durationPlans[duration].map((step) => (
                <div key={step} className="rounded-2xl border border-emerald-900/10 bg-ivory/70 p-4 text-sm leading-6 text-slate-700 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-300">
                  {step}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[1.5rem] border border-emerald-900/10 bg-white p-4 dark:border-white/10 dark:bg-slate-950">
            <h3 className="text-lg font-bold text-slate-950 dark:text-white">{selectedPlan.title}</h3>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{selectedPlan.audience}</p>
            <div className="mt-4 space-y-2">
              {selectedPlan.steps.map((step) => (
                <p key={step} className="flex gap-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-700 dark:text-gold" />
                  {step}
                </p>
              ))}
            </div>
            <p className="mt-4 rounded-2xl bg-emerald-50 p-3 text-xs leading-5 text-emerald-950 dark:bg-emerald-950/30 dark:text-emerald-100">
              {selectedPlan.checkpoint}
            </p>
          </div>

          <div className="grid gap-2 sm:grid-cols-3 lg:col-span-2">
            {[
              ["/arabic", Languages, "Arabe"],
              ["/quran", Headphones, "Lecture"],
              ["/memorization", Repeat2, "Révision"],
            ].map(([href, Icon, label]) => {
              const TypedIcon = Icon as typeof BookOpen;
              return (
                <Link key={String(href)} href={String(href)} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-emerald-900/10 bg-white px-4 py-3 text-sm font-semibold text-emerald-900 transition hover:border-gold/50 dark:border-white/10 dark:bg-slate-950 dark:text-emerald-100">
                  <TypedIcon className="h-4 w-4" />
                  {String(label)}
                </Link>
              );
            })}
          </div>

          <Link href="/lessons" className="inline-flex items-center justify-center gap-2 rounded-full text-sm font-semibold text-emerald-800 hover:text-emerald-950 dark:text-gold lg:col-span-2">
            Voir la méthode complète
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
