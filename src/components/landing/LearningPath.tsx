import Link from "next/link";
import { ArrowRight, BookOpen, CheckCircle2 } from "lucide-react";

const levels = [
  {
    name: "1. Alphabet",
    goal: "Reconnaître les lettres isolées et installer les premiers sons.",
    steps: ["Identifier la lettre", "Écouter le son", "Répéter lentement"],
  },
  {
    name: "2. Voyelles",
    goal: "Lire fatha, kasra, damma et sukun sans se précipiter.",
    steps: ["Associer signe et son", "Lire une syllabe", "Corriger les confusions"],
  },
  {
    name: "3. Syllabes",
    goal: "Passer des sons isolés à de petits assemblages lisibles.",
    steps: ["Assembler deux sons", "Lire un mot court", "Garder un rythme lent"],
  },
  {
    name: "4. Lecture courte",
    goal: "Lire de courts passages avec écoute et répétition.",
    steps: ["Écouter un modèle", "Lire phrase par phrase", "Noter un passage fragile"],
  },
  {
    name: "5. Tajwid de base",
    goal: "Reconnaître les premières règles sans remplacer la correction orale.",
    steps: ["Repérer la règle", "Écouter l'exemple", "Vérifier avec une personne qualifiée"],
  },
];

export default function LearningPath() {
  return (
    <section className="relative overflow-hidden bg-emerald-950 py-20 text-white">
      <div className="absolute inset-0 islamic-pattern opacity-30" />
      <div className="section-shell relative">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-gold">Parcours par niveau</p>
            <h2 className="mt-3 text-3xl font-heading font-bold md:text-5xl">
              Un chemin lisible pour progresser étape par étape.
            </h2>
          </div>
          <p className="text-sm leading-7 text-emerald-50/80 md:text-base">
            L'objectif n'est pas d'aller vite. L'objectif est d'avancer avec régularité, de corriger les bases et de ne pas perdre ce qui a été appris.
          </p>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {levels.map((level) => (
            <article key={level.name} className="rounded-3xl border border-white/10 bg-white/[0.06] p-5 backdrop-blur">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-2xl font-heading font-bold">{level.name}</h3>
                <BookOpen className="h-6 w-6 text-gold" />
              </div>
              <p className="mt-4 text-sm leading-7 text-emerald-50/80">{level.goal}</p>
              <div className="mt-6 space-y-3">
                {level.steps.map((step) => (
                  <div key={step} className="flex items-center gap-2 text-sm text-emerald-50">
                    <CheckCircle2 className="h-4 w-4 text-gold" />
                    {step}
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>

        <div className="mt-8 flex flex-col gap-3 rounded-3xl border border-white/10 bg-white/[0.06] p-5 backdrop-blur sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm leading-7 text-emerald-50/85">
            Chaque niveau peut être suivi avec des sessions de 5, 10 ou 20 minutes selon votre disponibilité.
          </p>
          <Link href="/signup" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-gold px-6 py-3 font-semibold text-emerald-950 transition hover:bg-darkgold">
            Créer mon parcours
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
