"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, BookOpen } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center bg-gradient-to-br from-white via-emerald-50/30 to-white dark:from-slate-950 dark:via-emerald-950/20 dark:to-slate-950">
      <div className="absolute inset-0 bg-[url('/images/arabesque.svg')] opacity-5 dark:opacity-10" />
      <div className="container mx-auto px-4 py-20 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-heading font-bold text-slate-800 dark:text-white mb-6 leading-tight">
            Learn and Read AL QU'RAN<br />
            <span className="text-emerald-600 dark:text-emerald-400">with LMO Qu'ran Learning</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto mb-10">
            Votre plateforme complète pour apprendre l'arabe, lire le Coran avec tajwid, mémoriser et méditer. Un suivi intelligent qui s'adapte à votre rythme.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/signup" className="btn-emerald text-lg px-8 py-4">
              Commencer maintenant
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-600 px-6 py-3 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              <BookOpen className="w-5 h-5" />
              Se connecter
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}