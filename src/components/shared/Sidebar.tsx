"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Home, BookOpen, Brain, Calendar, Settings, LogOut, Book, Trophy, User, ChevronRight,
  Layers, MessageSquare, Timer, MessageCircle, ClipboardCheck, AlertCircle, Library, Medal, GraduationCap, Bell
} from "lucide-react";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { motion } from "framer-motion";
import { toast } from "sonner";
import Logo from "./Logo";
import { useState } from "react";

const navSections = [
  {
    title: "Aujourd'hui",
    links: [
      { href: "/dashboard", icon: Home, label: "Tableau de bord", color: "hover:bg-emerald-50 dark:hover:bg-emerald-900/20" },
      { href: "/guided-path", icon: ClipboardCheck, label: "Parcours guidé", color: "hover:bg-emerald-50 dark:hover:bg-emerald-900/20" },
      { href: "/notifications", icon: Bell, label: "Notifications", color: "hover:bg-amber-50 dark:hover:bg-amber-900/20" },
      { href: "/progress", icon: Trophy, label: "Mes progrès", color: "hover:bg-gold/10 dark:hover:bg-gold/10" },
    ],
  },
  {
    title: "Apprentissage",
    links: [
      { href: "/arabic", icon: Book, label: "Apprendre l'arabe", color: "hover:bg-sky-50 dark:hover:bg-sky-900/20" },
      { href: "/lessons", icon: GraduationCap, label: "Leçons", color: "hover:bg-emerald-50 dark:hover:bg-emerald-900/20" },
      { href: "/learning-lab", icon: ClipboardCheck, label: "Exercices & tests", color: "hover:bg-emerald-50 dark:hover:bg-emerald-900/20" },
      { href: "/gaps", icon: AlertCircle, label: "Mes lacunes", color: "hover:bg-amber-50 dark:hover:bg-amber-900/20" },
      { href: "/quran", icon: BookOpen, label: "Coran", color: "hover:bg-amber-50 dark:hover:bg-amber-900/20" },
      { href: "/memorization", icon: Brain, label: "Mémorisation", color: "hover:bg-rose-50 dark:hover:bg-rose-900/20" },
      { href: "/flashcards", icon: Layers, label: "Cartes de révision", color: "hover:bg-purple-50 dark:hover:bg-purple-900/20" },
      { href: "/planning", icon: Calendar, label: "Planning", color: "hover:bg-indigo-50 dark:hover:bg-indigo-900/20" },
      { href: "/daily-quiz", icon: Timer, label: "Quiz quotidien", color: "hover:bg-red-50 dark:hover:bg-red-900/20" },
      { href: "/weekly-challenge", icon: Trophy, label: "Défi hebdo", color: "hover:bg-amber-50 dark:hover:bg-amber-900/20" },
    ],
  },
  {
    title: "Communauté",
    links: [
      { href: "/forum", icon: MessageCircle, label: "Forum", color: "hover:bg-teal-50 dark:hover:bg-teal-900/20" },
      { href: "/testimonials", icon: MessageSquare, label: "Témoignages", color: "hover:bg-pink-50 dark:hover:bg-pink-900/20" },
      { href: "/leaderboard", icon: Trophy, label: "Classement", color: "hover:bg-amber-50 dark:hover:bg-amber-900/20" },
      { href: "/certificates", icon: Medal, label: "Certificats", color: "hover:bg-gold/10 dark:hover:bg-gold/10" },
      { href: "/library", icon: Library, label: "Bibliothèque", color: "hover:bg-emerald-50 dark:hover:bg-emerald-900/20" },
    ],
  },
  {
    title: "Compte",
    links: [
      { href: "/profile", icon: User, label: "Profil", color: "hover:bg-slate-50 dark:hover:bg-slate-800" },
      { href: "/settings", icon: Settings, label: "Paramètres", color: "hover:bg-slate-50 dark:hover:bg-slate-800" },
    ],
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [hovered, setHovered] = useState<string | null>(null);

  const handleLogout = async () => {
    await signOut(auth);
    toast.success("À bientôt !");
    router.push("/");
  };

  return (
    <motion.aside
      initial={{ x: -280 }}
      animate={{ x: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="hidden md:flex flex-col fixed left-0 top-0 h-full w-64 bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl border-r border-emerald-100/50 dark:border-emerald-900/30 z-40 shadow-xl"
    >
      <div className="p-6 border-b border-emerald-100/50 dark:border-emerald-900/30">
        <Logo />
      </div>

      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        {navSections.map((section, sectionIndex) => (
          <div key={section.title} className={sectionIndex === 0 ? "" : "pt-4"}>
            <p className="px-4 pb-2 text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
              {section.title}
            </p>
            <div className="space-y-1">
              {section.links.map((link, index) => {
                const isActive = pathname === link.href;
                return (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: (sectionIndex * 0.04) + (index * 0.03) }}
                    onMouseEnter={() => setHovered(link.href)}
                    onMouseLeave={() => setHovered(null)}
                  >
                    <Link
                      href={link.href}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 group ${
                        isActive
                          ? "bg-emerald-600 text-white shadow-lg shadow-emerald-200/30"
                          : `text-slate-600 dark:text-slate-300 ${link.color}`
                      }`}
                    >
                      <link.icon className={`w-5 h-5 transition-transform duration-200 ${
                        hovered === link.href && !isActive ? "scale-110" : ""
                      }`} />
                      <span className="flex-1">{link.label}</span>
                      {(hovered === link.href || isActive) && (
                        <ChevronRight className="w-4 h-4 opacity-50" />
                      )}
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="p-4 border-t border-emerald-100/50 dark:border-emerald-900/30">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200 group"
        >
          <LogOut className="w-5 h-5 group-hover:text-red-500 transition-colors" />
          <span>Déconnexion</span>
        </button>
      </div>
    </motion.aside>
  );
}
