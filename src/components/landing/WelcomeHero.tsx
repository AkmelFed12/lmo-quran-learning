"use client";
import { useAuth } from "@/lib/hooks/useAuth";
import Link from "next/link";
import { motion } from "framer-motion";
import { BookOpen, Mic, Brain, Calendar, BarChart3, Book } from "lucide-react";

const quickLinks = [
  { href: "/arabic", icon: Book, label: "Arabe", color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" },
  { href: "/quran", icon: BookOpen, label: "Coran", color: "bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400" },
  { href: "/memorization", icon: Brain, label: "Mémorisation", color: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" },
  { href: "/planning", icon: Calendar, label: "Planning", color: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400" },
  { href: "/dashboard", icon: BarChart3, label: "Tableau de bord", color: "bg-emerald-700 text-white" },
];

export default function WelcomeHero() {
  const { user } = useAuth();
  const firstName = user?.displayName?.split(" ")[0] || user?.email?.split("@")[0] || "Apprenant";

  return (
    <section className="min-h-[90vh] flex flex-col justify-center bg-gradient-to-br from-white via-emerald-50/30 to-white dark:from-slate-950 dark:via-emerald-950/20 dark:to-slate-950">
      <div className="container mx-auto px-4 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-10"
        >
          <h1 className="text-4xl md:text-6xl font-heading font-bold text-slate-800 dark:text-white mb-4">
            Bienvenue, {firstName}
          </h1>
          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            Continuez votre apprentissage du Coran et de l'arabe avec LMO. Chaque jour est une nouvelle opportunité de progresser.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="grid grid-cols-2 md:grid-cols-6 gap-4 max-w-3xl mx-auto"
        >
          {quickLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="group flex flex-col items-center p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200"
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 ${link.color}`}>
                <link.icon className="w-6 h-6" />
              </div>
              <span className="font-medium text-sm text-slate-700 dark:text-slate-200">{link.label}</span>
            </Link>
          ))}
        </motion.div>
      </div>
    </section>
  );
}