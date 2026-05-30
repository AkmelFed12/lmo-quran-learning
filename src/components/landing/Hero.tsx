"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, BookOpen, CheckCircle2, Headphones, ShieldCheck, Sparkles } from "lucide-react";

const commitments = [
  "Alphabet puis voyelles",
  "Lecture guidée",
  "Révision claire",
  "Sources indiquées",
];

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-ivory pt-20 dark:bg-night">
      <div className="absolute inset-0 islamic-pattern opacity-80" />
      <div className="absolute left-1/2 top-10 h-80 w-80 -translate-x-1/2 rounded-full bg-gold/20 blur-3xl" />

      <div className="section-shell relative grid min-h-[calc(100vh-5rem)] items-center gap-12 py-16 lg:grid-cols-[1.02fr_0.98fr] lg:py-24">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: "easeOut" }}
          className="text-center lg:text-left"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-900/10 bg-white/75 px-4 py-2 text-sm font-semibold text-emerald-900 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5 dark:text-emerald-100">
            <Sparkles className="h-4 w-4 text-gold" />
            Parcours progressif pour débutants et apprenants réguliers
          </span>

          <h1 className="mt-7 text-4xl font-heading font-bold leading-tight text-slate-950 dark:text-white md:text-6xl lg:text-7xl">
            Apprendre à lire le Coran pas à pas.
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-slate-600 dark:text-slate-300 sm:text-lg lg:mx-0">
            Commencez par l'alphabet arabe, avancez vers les voyelles et les syllabes, puis lisez de courts passages avec écoute, tajwid de base et révision.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row lg:justify-start">
            <Link href="/signup" className="btn-emerald w-full sm:w-auto">
              Commencer maintenant
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              href="/sources-methodology"
              className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full border border-emerald-900/15 bg-white/70 px-6 py-3 font-semibold text-emerald-950 transition hover:bg-white dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10 sm:w-auto"
            >
              Voir la méthode
            </Link>
          </div>

          <div className="mt-8 grid gap-2 sm:grid-cols-2">
            {commitments.map((item) => (
              <div key={item} className="flex items-center justify-center gap-2 rounded-2xl border border-emerald-900/10 bg-white/65 px-4 py-3 text-sm font-medium text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-200 lg:justify-start">
                <CheckCircle2 className="h-4 w-4 text-emerald-700 dark:text-emerald-300" />
                {item}
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.65, delay: 0.1 }}
          className="mx-auto w-full max-w-xl"
        >
          <div className="relative rounded-[2rem] border border-emerald-900/10 bg-white/80 p-4 shadow-2xl shadow-emerald-950/10 backdrop-blur dark:border-white/10 dark:bg-slate-900/70 sm:p-5">
            <div className="absolute -right-4 -top-4 rounded-full bg-gold px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-emerald-950 shadow-lg">
              Gratuit
            </div>

            <div className="rounded-[1.5rem] bg-gradient-to-br from-emerald-950 via-emerald-900 to-slate-950 p-5 text-white sm:p-6">
              <p className="text-sm uppercase tracking-[0.25em] text-gold">Lecture du jour</p>
              <p className="arabic-reading mt-5 text-right text-4xl sm:text-5xl" dir="rtl">
                اقْرَأْ بِاسْمِ رَبِّكَ الَّذِي خَلَقَ
              </p>
              <p className="mt-5 text-sm leading-7 text-emerald-50/80">
                Écouter, lire, répéter, puis réviser. Une session courte et régulière installe une progression plus solide.
              </p>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {[
                [BookOpen, "Arabe", "Bases solides"],
                [Headphones, "Écoute", "Récitateurs"],
                [ShieldCheck, "Suivi", "Privé"],
              ].map(([Icon, title, text]) => {
                const TypedIcon = Icon as typeof BookOpen;
                return (
                  <div key={String(title)} className="rounded-2xl border border-emerald-900/10 bg-ivory/80 p-4 text-center dark:border-white/10 dark:bg-white/[0.04]">
                    <TypedIcon className="mx-auto h-5 w-5 text-emerald-800 dark:text-emerald-300" />
                    <p className="mt-2 font-semibold text-slate-900 dark:text-white">{String(title)}</p>
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{String(text)}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
