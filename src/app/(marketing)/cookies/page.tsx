import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Cookie, ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Cookies et annonces",
  description: "Informations sur les cookies, mesures techniques et annonces utilisées par LMO Quran Learning.",
};

const sections = [
  {
    title: "Cookies nécessaires",
    text: "Ils permettent la connexion, la sécurité du compte, la sauvegarde de la progression et les préférences de lecture. Sans eux, certaines fonctions essentielles ne peuvent pas rester stables.",
  },
  {
    title: "Mesure et amélioration",
    text: "Les données techniques peuvent aider à repérer les erreurs, améliorer l'affichage mobile et comprendre quelles pages ont besoin d'être simplifiées.",
  },
  {
    title: "Annonces",
    text: "Quand la publicité est activée, des partenaires publicitaires peuvent utiliser des identifiants techniques pour afficher, mesurer et sécuriser les annonces, selon leurs propres règles.",
  },
  {
    title: "Priorité pédagogique",
    text: "Les annonces ne doivent pas bloquer la lecture, perturber la récitation ou encourager des clics artificiels. L'apprentissage reste prioritaire.",
  },
];

export default function CookiesPage() {
  return (
    <main className="min-h-screen bg-ivory pt-24 pb-16 dark:bg-slate-950">
      <article className="section-shell max-w-4xl">
        <Link href="/" className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-white/75 px-4 py-2 text-sm font-medium text-slate-600 shadow-sm backdrop-blur transition hover:text-emerald-700 dark:border-emerald-900/50 dark:bg-slate-900/70 dark:text-slate-300">
          <ArrowLeft className="h-4 w-4" />
          Retour accueil
        </Link>

        <section className="card-premium p-6 md:p-10">
          <div className="flex items-center gap-3">
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-gold">
              <Cookie className="h-6 w-6" />
            </span>
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.22em] text-gold">Transparence</p>
              <h1 className="text-3xl font-heading font-bold text-slate-950 dark:text-white md:text-4xl">Cookies et annonces</h1>
            </div>
          </div>

          <p className="mt-6 text-sm leading-8 text-slate-600 dark:text-slate-300">
            Cette page explique simplement les usages techniques liés au compte, à la progression, aux préférences et aux annonces. Elle complète la politique de confidentialité.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {sections.map((section) => (
              <div key={section.title} className="rounded-3xl border border-emerald-900/10 bg-ivory/70 p-5 dark:border-white/10 dark:bg-white/[0.04]">
                <h2 className="font-heading text-lg font-bold text-slate-950 dark:text-white">{section.title}</h2>
                <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">{section.text}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 rounded-3xl border border-amber-200 bg-amber-50 p-5 text-sm leading-7 text-amber-950 dark:border-gold/30 dark:bg-gold/10 dark:text-amber-50">
            <div className="flex items-center gap-2 font-semibold">
              <ShieldCheck className="h-5 w-5" />
              Rappel important
            </div>
            <p className="mt-3">
              Il ne faut jamais cliquer soi-même sur ses annonces ni demander à d'autres personnes de le faire. Les revenus publicitaires doivent venir d'un usage normal du site.
            </p>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/privacy" className="btn-emerald">Lire la confidentialité</Link>
            <Link href="/support" className="inline-flex min-h-12 items-center justify-center rounded-full border border-emerald-900/10 px-6 py-3 text-sm font-semibold text-emerald-900 dark:border-white/10 dark:text-emerald-100">
              Soutenir le projet
            </Link>
          </div>
        </section>
      </article>
    </main>
  );
}
