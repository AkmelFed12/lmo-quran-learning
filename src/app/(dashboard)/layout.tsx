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

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.push("/login");
  }, [user, loading, router]);

  useRevisionReminder();

  if (loading || !user) return <Loading />;

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
