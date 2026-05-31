"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Home, BookOpen, Brain, Calendar, Book, LogOut, MoreHorizontal,
  Trophy, User, Settings, Layers, X, MessageCircle, Timer, ClipboardCheck, AlertCircle, Library, Medal, GraduationCap, Bell
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { useAuth } from "@/lib/hooks/useAuth";
import { toast } from "sonner";

const mainLinks = [
  { href: "/dashboard", icon: Home, label: "Accueil" },
  { href: "/quran", icon: BookOpen, label: "Coran" },
  { href: "/arabic", icon: Book, label: "Arabe" },
  { href: "/memorization", icon: Brain, label: "Révision" },
  { href: "/profile", icon: User, label: "Profil" },
];

const moreLinks = [
  { href: "/guided-path", icon: ClipboardCheck, label: "Parcours" },
  { href: "/lessons", icon: GraduationCap, label: "Leçons" },
  { href: "/learning-lab", icon: ClipboardCheck, label: "Exercices" },
  { href: "/gaps", icon: AlertCircle, label: "Lacunes" },
  { href: "/flashcards", icon: Layers, label: "Cartes" },
  { href: "/progress", icon: Trophy, label: "Progrès" },
  { href: "/certificates", icon: Medal, label: "Certificats" },
  { href: "/library", icon: Library, label: "Bibliothèque" },
  { href: "/daily-quiz", icon: Timer, label: "Quiz quotidien" },
  { href: "/notifications", icon: Bell, label: "Notifications" },
  { href: "/leaderboard", icon: Trophy, label: "Classement" },
  { href: "/forum", icon: MessageCircle, label: "Forum" },
  { href: "/testimonials", icon: MessageCircle, label: "Témoignages" },
  { href: "/settings", icon: Settings, label: "Paramètres" },
];

export default function MobileNav() {
  const pathname = usePathname();
  const { user } = useAuth();
  const router = useRouter();
  const [showMore, setShowMore] = useState(false);

  const handleLogout = async () => {
    setShowMore(false);
    await signOut(auth);
    toast.success("À bientôt !");
    router.push("/");
  };

  return (
    <>
      <motion.nav
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="mobile-safe-bottom fixed bottom-0 left-3 right-3 z-50 md:hidden"
      >
        <div className="rounded-[1.35rem] border border-emerald-900/10 bg-white/95 px-2 py-2 shadow-2xl shadow-emerald-950/15 backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/95">
          <div className="grid grid-cols-6 gap-1">
            {mainLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`touch-target relative flex flex-col items-center justify-center rounded-2xl px-1 py-2 transition-all ${
                    isActive
                      ? "text-emerald-900 dark:text-gold"
                      : "text-slate-500 dark:text-slate-400"
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="mobileNavIndicator"
                      className="absolute inset-0 rounded-2xl bg-emerald-100 dark:bg-white/10"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                  <link.icon className="w-5 h-5 relative z-10" />
                  <span className="relative z-10 mt-1 text-[10px] font-semibold">{link.label}</span>
                </Link>
              );
            })}

            <button
              onClick={() => setShowMore(!showMore)}
              className="touch-target relative flex flex-col items-center justify-center rounded-2xl px-1 py-2 text-slate-500 dark:text-slate-400"
            >
              {showMore ? (
                <X className="w-5 h-5" />
              ) : (
                <MoreHorizontal className="w-5 h-5" />
              )}
              <span className="mt-1 text-[10px] font-semibold">Plus</span>
            </button>
          </div>
        </div>
      </motion.nav>

      <AnimatePresence>
        {showMore && (
          <>
            <div
              className="md:hidden fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
              onClick={() => setShowMore(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="fixed bottom-24 left-3 right-3 z-50 rounded-[1.5rem] border border-emerald-900/10 bg-white/95 p-4 shadow-2xl shadow-emerald-950/15 backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/95 md:hidden"
            >
              <div className="grid grid-cols-3 gap-3 min-[390px]:grid-cols-4">
                {moreLinks.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setShowMore(false)}
                      className={`touch-target flex flex-col items-center justify-center rounded-2xl p-2 ${
                        isActive
                          ? "bg-emerald-50 text-emerald-900 dark:bg-white/10 dark:text-gold"
                          : "text-slate-500 dark:text-slate-400"
                      }`}
                    >
                      <link.icon className="w-5 h-5" />
                      <span className="text-[10px] mt-1">{link.label}</span>
                    </Link>
                  );
                })}
                {user && (
                  <button
                    onClick={handleLogout}
                    className="flex flex-col items-center p-2 rounded-xl text-red-500"
                  >
                    <LogOut className="w-5 h-5" />
                    <span className="text-[10px] mt-1">Quitter</span>
                  </button>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
