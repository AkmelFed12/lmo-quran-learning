import FlashcardReview from "@/components/quran/FlashcardReview";
import { Layers, Repeat2, Volume2 } from "lucide-react";

const flashcardTips = [
  {
    icon: Repeat2,
    title: "Rappel actif",
    text: "Essayez de vous souvenir avant d'afficher la réponse.",
  },
  {
    icon: Volume2,
    title: "Écoute courte",
    text: "Relancez l'audio seulement pour confirmer la prononciation.",
  },
];

export default function FlashcardsPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <header className="card-premium overflow-hidden p-0">
        <div className="grid gap-5 bg-gradient-to-br from-slate-950 via-emerald-950 to-emerald-900 p-5 text-white sm:p-6 lg:grid-cols-[1fr_0.85fr]">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-gold">
              <Layers className="h-4 w-4" />
              Cartes de révision
            </div>
            <h1 className="mt-4 text-3xl font-heading font-bold sm:text-4xl">Réviser sans surcharge.</h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-emerald-50/80">
              Reprenez vos sessions de mémorisation sous forme de cartes courtes : question, réponse, écoute, puis carte suivante.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
            {flashcardTips.map((tip) => {
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
      <FlashcardReview />
    </div>
  );
}
