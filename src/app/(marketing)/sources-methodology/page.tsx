import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpen, CheckCircle2, GraduationCap, Info, ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Sources et méthodologie",
  description: "Sources utilisées, méthode pédagogique et limites de LMO Quran Learning.",
};

const sources = [
  "Texte arabe : API AlQuran.cloud, édition uthmani.",
  "Traduction française : Hamidullah via AlQuran.cloud.",
  "Translittération : ressource fournie par AlQuran.cloud.",
  "Récitations : récitateurs disponibles via AlQuran.cloud.",
];

const method = [
  "Étape 1 : alphabet et reconnaissance des lettres.",
  "Étape 2 : voyelles courtes, sukun et premières syllabes.",
  "Étape 3 : lecture courte avec écoute et répétition.",
  "Étape 4 : tajwid de base avec exemples prudents.",
  "Étape 5 : mémorisation, révision espacée et correction des erreurs.",
];

export default function SourcesMethodologyPage() {
  return (
    <div className="min-h-screen bg-ivory pt-24 pb-16 dark:bg-slate-950">
      <div className="section-shell max-w-5xl">
        <div className="rounded-[2rem] border border-emerald-900/10 bg-white p-6 shadow-xl shadow-emerald-950/5 dark:border-white/10 dark:bg-slate-900 md:p-10">
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-gold">Transparence</p>
          <h1 className="mt-3 text-4xl font-heading font-bold text-slate-950 dark:text-white md:text-5xl">
            Sources et méthodologie
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-8 text-slate-600 dark:text-slate-300">
            LMO Quran Learning est une plateforme éducative. Elle aide à apprendre et à organiser sa progression, mais ne remplace pas l'accompagnement d'un enseignant qualifié.
          </p>

          <div className="mt-8 grid gap-5 lg:grid-cols-2">
            <section className="surface-calm p-5">
              <div className="flex items-center gap-3">
                <BookOpen className="h-6 w-6 text-emerald-800 dark:text-gold" />
                <h2 className="text-xl font-semibold">Sources utilisées</h2>
              </div>
              <div className="mt-5 space-y-3">
                {sources.map((source) => (
                  <p key={source} className="flex gap-2 text-sm leading-7 text-slate-600 dark:text-slate-300">
                    <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-emerald-700 dark:text-gold" />
                    {source}
                  </p>
                ))}
              </div>
            </section>

            <section className="surface-calm p-5 lg:col-span-2">
              <div className="flex items-center gap-3">
                <GraduationCap className="h-6 w-6 text-emerald-800 dark:text-gold" />
                <h2 className="text-xl font-semibold">Méthode proposée</h2>
              </div>
              <div className="mt-5 space-y-3">
                {method.map((item) => (
                  <p key={item} className="flex gap-2 text-sm leading-7 text-slate-600 dark:text-slate-300">
                    <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-emerald-700 dark:text-gold" />
                    {item}
                  </p>
                ))}
              </div>
            </section>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="rounded-3xl border border-amber-200 bg-amber-50 p-5 text-amber-950 dark:border-gold/30 dark:bg-gold/10 dark:text-amber-50">
              <div className="flex items-center gap-2 font-semibold">
                <Info className="h-5 w-5" />
                Limite pédagogique
              </div>
              <p className="mt-3 text-sm leading-7">
                En cas de doute sur la récitation, le tajwid ou la compréhension d'un passage, il faut revenir à un professeur qualifié ou à une institution reconnue.
              </p>
            </div>
            <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-5 text-emerald-950 dark:border-emerald-700/40 dark:bg-emerald-950/35 dark:text-emerald-50">
              <div className="flex items-center gap-2 font-semibold">
                <ShieldCheck className="h-5 w-5" />
                Respect du contenu
              </div>
              <p className="mt-3 text-sm leading-7">
                Les contenus doivent rester sobres, utiles et respectueux. Les corrections signalées par les utilisateurs sont traitées en priorité.
              </p>
            </div>
          </div>

          <Link href="/signup" className="btn-emerald mt-8 w-full sm:w-auto">
            Créer mon compte
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
