"use client";
import { useAuth } from "@/lib/hooks/useAuth";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, BarChart3, Book, BookOpen, Brain, Calendar, CheckCircle2 } from "lucide-react";
import { useLocale } from "@/lib/hooks/useLocale";

const quickLinks = [
  { href: "/arabic", icon: Book, label: "arabic", hint: "Lettres et voyelles" },
  { href: "/quran", icon: BookOpen, label: "quran", hint: "Lecture accompagnée" },
  { href: "/memorization", icon: Brain, label: "memorization", hint: "Révision courte" },
  { href: "/planning", icon: Calendar, label: "planning", hint: "Routine claire" },
  { href: "/dashboard", icon: BarChart3, label: "dashboard", hint: "Vue d'ensemble" },
];

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } }
};

const item = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  show: { opacity: 1, y: 0, scale: 1 }
};

export default function WelcomeHero() {
  const { user } = useAuth();
  const { t } = useLocale();
  const firstName = user?.displayName?.split(" ")[0] || user?.email?.split("@")[0] || "Apprenant";

  return (
    <section className="relative min-h-[90vh] overflow-hidden bg-ivory dark:bg-slate-950">
      <div className="absolute inset-0 islamic-pattern opacity-60" />
      <div className="section-shell relative py-20">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mx-auto max-w-4xl text-center"
        >
          <p className="mx-auto inline-flex items-center gap-2 rounded-full border border-emerald-900/10 bg-white/80 px-4 py-2 text-sm font-semibold text-emerald-900 shadow-sm dark:border-white/10 dark:bg-white/5 dark:text-emerald-100">
            <CheckCircle2 className="h-4 w-4 text-gold" />
            Session prête
          </p>
          <h1 className="mt-6 text-4xl font-heading font-bold leading-tight text-slate-950 dark:text-white md:text-6xl">
            {t("welcome")},{" "}
            <span className="text-emerald-800 dark:text-gold">
              {firstName}
            </span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-slate-600 dark:text-slate-300 md:text-lg">
            Assalamu alaykum. Reprenez une petite session, révisez un point fragile ou continuez votre lecture sans vous disperser.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link href="/dashboard" className="btn-emerald w-full sm:w-auto">
              Reprendre ma progression
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link href="/guided-path" className="inline-flex min-h-12 w-full items-center justify-center rounded-full border border-emerald-900/10 bg-white/75 px-6 py-3 text-sm font-semibold text-emerald-900 transition hover:border-gold/50 dark:border-white/10 dark:bg-white/5 dark:text-emerald-100 sm:w-auto">
              Parcours du jour
            </Link>
          </div>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="mx-auto mt-12 grid max-w-6xl grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5"
        >
          {quickLinks.map((link) => (
            <motion.div key={link.href} variants={item}>
              <Link
                href={link.href}
                className="group relative flex h-full flex-col rounded-3xl border border-emerald-900/10 bg-white/85 p-5 text-left shadow-sm transition hover:-translate-y-1 hover:border-gold/60 hover:shadow-xl hover:shadow-emerald-950/10 dark:border-white/10 dark:bg-slate-900/75"
              >
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-emerald-950 text-gold transition group-hover:bg-gold group-hover:text-emerald-950">
                  <link.icon className="h-6 w-6" />
                </div>
                <span className="mt-4 font-semibold text-slate-950 dark:text-white">
                  {t(link.label as any)}
                </span>
                <span className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">{link.hint}</span>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
