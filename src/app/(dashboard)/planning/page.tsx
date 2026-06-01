import PlanningForm from "@/components/planning/PlanningForm";
import { CalendarCheck, Clock3, Repeat2 } from "lucide-react";

const planningTips = [
  {
    icon: Clock3,
    title: "Court",
    text: "Un objectif réaliste tient mieux qu'un grand planning abandonné.",
  },
  {
    icon: Repeat2,
    title: "Régulier",
    text: "Gardez des jours fixes pour installer une vraie routine.",
  },
  {
    icon: CalendarCheck,
    title: "Vérifiable",
    text: "Chaque séance doit dire exactement quoi lire ou mémoriser.",
  },
];

export default function PlanningPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <header className="card-premium overflow-hidden p-0">
        <div className="grid gap-5 bg-gradient-to-br from-emerald-950 via-emerald-900 to-slate-950 p-5 text-white sm:p-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.22em] text-gold">Planning</p>
            <h1 className="mt-3 text-3xl font-heading font-bold sm:text-4xl">Préparer une semaine claire.</h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-emerald-50/80">
              Construisez un objectif de mémorisation simple, découpé par jour, puis exportez-le pour le garder sous les yeux.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
            {planningTips.map((tip) => {
              const Icon = tip.icon;

              return (
                <div key={tip.title} className="rounded-2xl border border-white/10 bg-white/10 p-4">
                  <div className="flex items-center gap-3">
                    <span className="grid h-9 w-9 place-items-center rounded-xl bg-gold text-emerald-950">
                      <Icon className="h-4 w-4" />
                    </span>
                    <p className="font-bold">{tip.title}</p>
                  </div>
                  <p className="mt-2 text-xs leading-5 text-emerald-50/75">{tip.text}</p>
                </div>
              );
            })}
          </div>
        </div>
      </header>
      <PlanningForm />
    </div>
  );
}
