import Link from "next/link";
import { ArrowRight, CheckCircle2, GraduationCap, LockKeyhole, Scale } from "lucide-react";

const notes = [
  { icon: GraduationCap, title: "Sources indiquées", text: "Texte arabe, traduction, translittération et récitations sont présentés avec leurs repères." },
  { icon: Scale, title: "Limites claires", text: "La plateforme aide à apprendre, mais ne remplace pas un enseignant qualifié." },
  { icon: LockKeyhole, title: "Compte utile", text: "Le compte sert au suivi personnel, aux objectifs, aux révisions et aux attestations internes." },
];

export default function TrustAndSources() {
  return (
    <section className="bg-white py-20 dark:bg-night">
      <div className="section-shell">
        <div className="grid gap-8 rounded-[2rem] border border-emerald-900/10 bg-emerald-950 p-6 text-white shadow-xl shadow-emerald-950/15 dark:border-white/10 md:p-8 lg:grid-cols-[0.95fr_1.05fr] lg:p-10">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-gold">Confiance</p>
            <h2 className="mt-3 text-3xl font-heading font-bold md:text-5xl">
              Une plateforme éducative, sobre et transparente.
            </h2>
            <p className="mt-5 text-sm leading-7 text-emerald-50/80 md:text-base">
              LMO Quran Learning est conçu pour soutenir l'apprentissage personnel du Coran et de l'arabe avec respect, méthode et prudence.
            </p>
            <Link href="/sources-methodology" className="mt-6 inline-flex min-h-12 items-center gap-2 rounded-full bg-gold px-6 py-3 font-semibold text-emerald-950 transition hover:bg-darkgold">
              Voir les sources
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid gap-3">
            {notes.map((note) => {
              const Icon = note.icon;
              return (
                <div key={note.title} className="rounded-2xl border border-white/10 bg-white/[0.07] p-4">
                  <div className="flex items-start gap-3">
                    <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white/10 text-gold">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{note.title}</h3>
                      <p className="mt-1 text-sm leading-6 text-emerald-50/75">{note.text}</p>
                    </div>
                  </div>
                </div>
              );
            })}
            <div className="flex items-center gap-2 rounded-2xl bg-white/[0.07] p-4 text-sm text-emerald-50/85">
              <CheckCircle2 className="h-4 w-4 text-gold" />
              Accès simple, sans promesse exagérée ni contenu sensationnaliste.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
