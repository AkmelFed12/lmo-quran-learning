"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, LogOut, Home, Book, BookOpen, Brain, Layers, Calendar, Timer, MessageSquare, MessageCircle, Trophy, User, Settings, ClipboardCheck, Library, Medal, AlertCircle, GraduationCap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { toast } from "sonner";
import { useAuth } from "@/lib/hooks/useAuth";

const menuGroups = [
  {
    title: "Principal",
    items: [
      { href: "/dashboard", icon: Home, label: "Tableau de bord" },
      { href: "/guided-path", icon: ClipboardCheck, label: "Parcours guidé" },
      { href: "/arabic", icon: Book, label: "Apprendre l'arabe" },
      { href: "/lessons", icon: GraduationCap, label: "Leçons" },
      { href: "/quran", icon: BookOpen, label: "Coran" },
    ],
  },
  {
    title: "Outils",
    items: [
      { href: "/memorization", icon: Brain, label: "Mémorisation" },
      { href: "/learning-lab", icon: ClipboardCheck, label: "Exercices & tests" },
      { href: "/gaps", icon: AlertCircle, label: "Mes lacunes" },
      { href: "/flashcards", icon: Layers, label: "Cartes de révision" },
      { href: "/planning", icon: Calendar, label: "Planning" },
    ],
  },
  {
    title: "Communauté",
    items: [
      { href: "/daily-quiz", icon: Timer, label: "Quiz quotidien" },
      { href: "/leaderboard", icon: Trophy, label: "Classement" },
      { href: "/forum", icon: MessageCircle, label: "Forum" },
      { href: "/testimonials", icon: MessageSquare, label: "Témoignages" },
    ],
  },
  {
    title: "Personnel",
    items: [
      { href: "/profile", icon: User, label: "Profil" },
      { href: "/progress", icon: Trophy, label: "Mes progrès" },
      { href: "/certificates", icon: Medal, label: "Certificats" },
      { href: "/library", icon: Library, label: "Bibliothèque" },
      { href: "/settings", icon: Settings, label: "Paramètres" },
    ],
  },
];

export default function HamburgerMenu() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const handleLogout = async () => {
    setOpen(false);
    await signOut(auth);
    toast.success("À bientôt !");
    router.push("/");
  };

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className="md:hidden relative p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
        aria-label="Menu"
      >
        {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      <AnimatePresence>
        {open && (
          <>
            <div
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
              onClick={() => setOpen(false)}
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 350, damping: 35 }}
              className="fixed left-0 top-0 h-full w-80 z-50 bg-white dark:bg-slate-900 shadow-2xl flex flex-col overflow-hidden"
            >
              {/* En-tête */}
              <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-800 flex items-center justify-center">
                    <BookOpen className="w-4 h-4 text-emerald-600 dark:text-emerald-300" />
                  </div>
                  <span className="font-heading text-lg font-bold text-emerald-700 dark:text-emerald-400">LMO</span>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation */}
              <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
                {menuGroups.map((group) => (
                  <div key={group.title}>
                    <h3 className="px-3 text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">
                      {group.title}
                    </h3>
                    <div className="space-y-1">
                      {group.items.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setOpen(false)}
                            className={`flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                              isActive
                                ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 shadow-sm"
                                : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                            }`}
                          >
                            <item.icon className="w-5 h-5" />
                            {item.label}
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </nav>

              {/* Pied du menu */}
              {user && (
                <div className="p-4 border-t border-slate-200 dark:border-slate-800">
                  <div className="px-3 py-2 mb-2">
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
                      {user.displayName || "Utilisateur"}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user.email}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 w-full px-3 py-3 rounded-xl text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                  >
                    <LogOut className="w-5 h-5" />
                    Se déconnecter
                  </button>
                </div>
              )}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
