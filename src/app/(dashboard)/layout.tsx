"use client";
import { useAuth } from "@/lib/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Sidebar from "@/components/shared/Sidebar";
import MobileNav from "@/components/shared/MobileNav";
import Loading from "@/components/shared/Loading";
import OnboardingOverlay from "@/components/onboarding/OnboardingOverlay";
import InstallPWA from "@/components/shared/InstallPWA";
import LearningGuide from "@/components/shared/LearningGuide";
import { motion, AnimatePresence } from "framer-motion";
import { useRevisionReminder } from "@/lib/hooks/useRevisionReminder";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { Button } from "@/components/ui/button";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, disabled, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.push("/login");
  }, [user, loading, router]);

  useRevisionReminder();

  if (loading || !user) return <Loading />;

  if (disabled) {
    return (
      <div className="grid min-h-screen place-items-center bg-gradient-to-br from-amber-50 via-white to-emerald-50 px-4 dark:from-slate-950 dark:via-slate-900 dark:to-amber-950/20">
        <div className="max-w-lg rounded-[2rem] border border-amber-200 bg-white p-6 text-center shadow-xl dark:border-amber-900/50 dark:bg-slate-900">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-amber-700 dark:text-amber-300">Compte suspendu</p>
          <h1 className="mt-3 text-3xl font-heading font-bold text-slate-950 dark:text-white">Accès temporairement limité</h1>
          <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
            Votre compte est conservé, mais l'accès à l'espace apprenant est désactivé pour le moment. Contactez l'équipe LMO si vous pensez qu'il s'agit d'une erreur.
          </p>
          <Button className="mt-6" onClick={() => void signOut(auth)}>
            Se déconnecter
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/20 dark:from-slate-950 dark:via-slate-900 dark:to-emerald-950/20">
      <Sidebar />
      <AnimatePresence mode="wait">
        <motion.main
          key={user.uid}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="flex-1 ml-0 md:ml-64 pt-6 pb-28 md:pb-6 px-3 sm:px-4 md:px-6 lg:px-8"
        >
          {children}
        </motion.main>
      </AnimatePresence>
      <MobileNav />
      <OnboardingOverlay />
      <InstallPWA />
      <LearningGuide />
    </div>
  );
}
