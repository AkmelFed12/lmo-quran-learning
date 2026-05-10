"use client";
import { useAuth } from "@/lib/hooks/useAuth";
import ProgressRing from "@/components/dashboard/ProgressRing";
import StreakWidget from "@/components/dashboard/StreakWidget";
import DailyGoal from "@/components/dashboard/DailyGoal";
import RecentSurahs from "@/components/dashboard/RecentSurahs";
import { motion } from "framer-motion";

export default function DashboardPage() {
  const { user } = useAuth();
  const firstName = user?.displayName?.split(" ")[0] || user?.email?.split("@")[0] || "Apprenant";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <h1 className="text-3xl font-heading font-bold">
        Assalamu alaykum, {firstName}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="col-span-2 card-premium p-6 flex flex-wrap items-center justify-around gap-4">
          <ProgressRing value={68} label="Mémorisé" />
          <ProgressRing value={42} label="Arabe" />
          <ProgressRing value={85} label="Écoute" />
        </div>
        <StreakWidget streak={12} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <RecentSurahs />
        <DailyGoal target={10} current={7} />
      </div>
    </motion.div>
  );
}