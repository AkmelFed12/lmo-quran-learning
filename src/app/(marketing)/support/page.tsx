import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, ExternalLink, HeartHandshake, Mail, MessageCircle, ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Support",
  description: "Contactez LMO Quran Learning, signalez une correction ou soutenez l'accès gratuit à la plateforme.",
};

const contributionWays = [
  "Signaler une erreur de contenu ou de récitation.",
  "Proposer une idée de leçon, de quiz ou de fonctionnalité.",
  "Partager la plateforme avec un apprenant autour de vous.",
];

const fundingUses = [
  "Hébergement, stockage et maintenance technique.",
  "Amélioration des contenus, exercices et corrections.",
  "Optimisation mobile pour les apprenants à faible connexion.",
];

const wavePaymentUrl = "https://pay.wave.com/m/M_ci_85MvaTHMpTqa/c/ci/";

export default function SupportPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50 pt-24 pb-16 dark:from-slate-950 dark:via-slate-900 dark:to-emerald-950">
      <div className="container mx-auto max-w-5xl px-4">
        <Link href="/" className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-white/75 px-4 py-2 text-sm font-medium text-slate-600 shadow-sm backdrop-blur transition hover:text-emerald-700 dark:border-emerald-900/50 dark:bg-slate-900/70 dark:text-slate-300">
          <ArrowLeft className="h-4 w-4" />
          Retour accueil
        </Link>

        <section className="relative overflow-hidden rounded-[2rem] border border-emerald-100 bg-white/85 p-6 shadow-xl shadow-emerald-950/5 backdrop-blur dark:border-emerald-900/50 dark:bg-slate-900/80 md:p-10">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-emerald-300/20 blur-3xl" />
          <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-sky-300/15 blur-3xl" />
          <div className="relative grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-2 text-sm font-semibold text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-200">
                <HeartHandshake className="h-4 w-4" />
                Support communautaire
              </span>
              <h1 className="mt-6 text-4xl font-heading font-bold leading-tight text-slate-900 dark:text-white md:text-5xl">
                Aidez LMO Quran Learning à rester gratuit, utile et fiable.
              </h1>
              <p className="mt-5 text-lg leading-8 text-slate-600 dark:text-slate-300">
                La plateforme reste accessible gratuitement. Les contributions sont facultatives et servent uniquement à maintenir, corriger et améliorer l'expérience d'apprentissage.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link href={wavePaymentUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-200/50 transition hover:-translate-y-0.5 hover:bg-emerald-700 dark:shadow-emerald-950/30 sm:w-auto">
                  Soutenir avec Wave
                  <ExternalLink className="h-4 w-4" />
                </Link>
                <Link href="/contact" className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-white dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800 sm:w-auto">
                  Contacter l'équipe
                  <Mail className="h-4 w-4" />
                </Link>
                <Link href="/faq" className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-white dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800 sm:w-auto">
                  Lire la FAQ
                  <MessageCircle className="h-4 w-4" />
                </Link>
              </div>
            </div>

            <div className="rounded-3xl border border-emerald-100 bg-emerald-50/70 p-5 dark:border-emerald-900/50 dark:bg-emerald-950/25">
              <h2 className="font-semibold text-slate-900 dark:text-white">Contribuer sans paiement</h2>
              <div className="mt-5 space-y-4">
                {contributionWays.map((item) => (
                  <div key={item} className="flex gap-3 rounded-2xl bg-white/75 p-4 text-sm leading-6 text-slate-600 shadow-sm dark:bg-slate-900/60 dark:text-slate-300">
                    <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-emerald-500" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="mt-8 grid gap-4 rounded-[2rem] border border-emerald-100 bg-white/80 p-6 shadow-sm dark:border-emerald-900/50 dark:bg-slate-900/75 md:grid-cols-[auto_1fr] md:items-start">
          <ShieldCheck className="h-8 w-8 text-emerald-600 dark:text-emerald-300" />
          <div>
            <h2 className="font-semibold text-slate-900 dark:text-white">Transparence</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
              Un soutien financier ne donne aucun avantage religieux, aucun raccourci pédagogique et aucune obligation de cliquer sur les publicités. L'apprentissage reste la priorité.
            </p>
          </div>
        </section>

        <section className="mt-8 rounded-[2rem] border border-emerald-100 bg-white/80 p-6 shadow-sm dark:border-emerald-900/50 dark:bg-slate-900/75">
          <h2 className="text-2xl font-heading font-bold text-slate-900 dark:text-white">À quoi sert le soutien ?</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {fundingUses.map((item) => (
              <div key={item} className="rounded-3xl border border-emerald-100 bg-ivory/70 p-5 text-sm leading-7 text-slate-600 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-300">
                <CheckCircle2 className="mb-3 h-5 w-5 text-emerald-600 dark:text-gold" />
                {item}
              </div>
            ))}
          </div>
          <p className="mt-5 text-sm leading-7 text-slate-500 dark:text-slate-400">
            Les autres moyens de paiement pourront être ajoutés progressivement lorsqu'ils seront validés et documentés.
          </p>
        </section>
      </div>
    </div>
  );
}
