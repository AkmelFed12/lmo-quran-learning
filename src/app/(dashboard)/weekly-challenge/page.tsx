"use client";

import WeeklyChallenge from "@/components/challenges/WeeklyChallenge";
import { Card, CardContent } from "@/components/ui/card";
import { CalendarDays, Target, Trophy } from "lucide-react";

export default function WeeklyChallengePage() {
  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <header className="rounded-[2rem] border border-emerald-900/10 bg-gradient-to-br from-emerald-800 via-emerald-700 to-amber-600 p-6 text-white shadow-xl shadow-emerald-950/20">
        <p className="text-sm font-bold uppercase tracking-[0.22em] text-emerald-50/80">Défi hebdomadaire</p>
        <h1 className="mt-2 text-3xl font-heading font-bold">Un objectif court pour rester régulier</h1>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-emerald-50/90">
          Rejoignez le défi de la semaine, suivez votre progression et revenez à la mémorisation sans pression.
        </p>
      </header>

      <section className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-5">
            <Trophy className="h-5 w-5 text-amber-600" />
            <p className="mt-3 font-semibold">Défi simple</p>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Un objectif atteignable, pensé pour la régularité.</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <CalendarDays className="h-5 w-5 text-emerald-700 dark:text-gold" />
            <p className="mt-3 font-semibold">Semaine en cours</p>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Le suivi se base sur vos sessions de révision récentes.</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <Target className="h-5 w-5 text-sky-700" />
            <p className="mt-3 font-semibold">Sans suppression</p>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Vos données existantes restent conservées.</p>
          </CardContent>
        </Card>
      </section>

      <WeeklyChallenge />
    </div>
  );
}
