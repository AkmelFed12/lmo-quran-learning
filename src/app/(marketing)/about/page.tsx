import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpen, Brain, Globe, HeartHandshake, Shield } from "lucide-react";

export const metadata: Metadata = {
  title: "À propos",
  description: "Mission, valeurs et vision de LMO Quran Learning.",
};

const values = [
  { icon: BookOpen, title: "Respect du Coran", text: "Une interface sobre, une lecture lisible et des sources indiquées." },
  { icon: Brain, title: "Progression réelle", text: "Des petites étapes pour apprendre sans se décourager." },
  { icon: Globe, title: "Accessibilité", text: "Une plateforme mobile-first, utilisable partout avec un compte personnel." },
  { icon: Shield, title: "Responsabilité", text: "Une mention claire : l'outil complète, mais ne remplace pas, un enseignant qualifié." },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-ivory pt-24 pb-16 dark:bg-slate-950">
      <div className="section-shell max-w-6xl">
        <section className="rounded-[2rem] border border-emerald-900/10 bg-white p-6 shadow-xl shadow-emerald-950/5 dark:border-white/10 dark:bg-slate-900 md:p-10">
          <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.25em] text-gold">À propos</p>
              <h1 className="mt-3 text-4xl font-heading font-bold leading-tight text-slate-950 dark:text-white md:text-6xl">
                Un institut numérique pour apprendre avec calme et régularité.
              </h1>
              <p className="mt-5 text-base leading-8 text-slate-600 dark:text-slate-300">
                LMO Quran Learning est né pour rendre l'apprentissage de l'arabe et du Coran plus accessible, surtout sur mobile, avec une expérience claire, respectueuse et progressive.
              </p>
              <Link href="/sources-methodology" className="btn-emerald mt-7">
                Voir la méthodologie
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
            <div className="rounded-[2rem] bg-emerald-950 p-6 text-white">
              <HeartHandshake className="h-10 w-10 text-gold" />
              <h2 className="mt-5 text-2xl font-heading font-bold">Notre intention</h2>
              <p className="mt-4 text-sm leading-7 text-emerald-50/80">
                Aider chacun à commencer, reprendre ou structurer son apprentissage, sans promesses exagérées et sans remplacer la transmission humaine.
              </p>
              <p className="arabic-reading mt-6 text-right text-4xl" dir="rtl">رَبِّ زِدْنِي عِلْمًا</p>
            </div>
          </div>
        </section>

        <section className="mt-8 grid gap-4 md:grid-cols-2">
          {values.map((value) => {
            const Icon = value.icon;
            return (
              <article key={value.title} className="card-premium p-5">
                <Icon className="h-7 w-7 text-emerald-800 dark:text-gold" />
                <h3 className="mt-4 text-xl font-semibold">{value.title}</h3>
                <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">{value.text}</p>
              </article>
            );
          })}
        </section>
      </div>
    </div>
  );
}
