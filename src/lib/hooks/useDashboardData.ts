"use client";
import { useEffect, useState } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "./useAuth";
import { getArabicProgressPercent } from "@/lib/arabic-curriculum";

interface DashboardData {
  memorizationProgress: number;
  arabicProgress: number;
  listeningProgress: number;
  streak: number;
  recentSurahs: string[];
  dailyGoalTarget: number;
  dailyGoalCurrent: number;
  activityHistory: Array<{ type?: string; label?: string; createdAt?: string }>;
  lastAssessment?: {
    module?: string;
    score?: number;
    total?: number;
    completedAt?: string;
  };
  lastListened?: {
    surahId?: number;
    ayahNumber?: number;
    reciter?: string;
    listenedAt?: string;
  };
}

export function useDashboardData() {
  const { user } = useAuth();
  const [data, setData] = useState<DashboardData>({
    memorizationProgress: 0,
    arabicProgress: 0,
    listeningProgress: 0,
    streak: 0,
    recentSurahs: [],
    dailyGoalTarget: 10,
    dailyGoalCurrent: 0,
    activityHistory: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        // 1. Lire le document progress
        const progressSnap = await getDoc(doc(db, "progress", user.uid));
        const progress = progressSnap.exists() ? progressSnap.data() : {};

        // 2. Lire les sessions de mémorisation (dans memorization/{uid})
        const memSnap = await getDoc(doc(db, "memorization", user.uid));
        const sessions = memSnap.exists() ? memSnap.data().sessions || [] : [];

        // 3. Calculs
        const totalAyahs = sessions.reduce(
          (acc: number, s: any) => acc + (s.toAyah - s.fromAyah + 1),
          0
        );
        const memPercent = Math.min(100, Math.round((totalAyahs / 6236) * 100));

        const lettersLearned = progress.arabic?.lettersLearned || [];
        const completedLevels = progress.arabic?.completedLevels || [];
        const arabicPercent = getArabicProgressPercent(completedLevels, lettersLearned);

        const listeningPercent = progress.stats?.listeningPercent || 0;

        // Série quotidienne
        const lastActive = progress.stats?.lastActive;
        let streak = progress.stats?.streak || 0;
        if (lastActive) {
          const last = new Date(lastActive);
          const today = new Date();
          const yesterday = new Date(today);
          yesterday.setDate(yesterday.getDate() - 1);

          if (last.toDateString() === today.toDateString()) {
            // Déjà à jour aujourd'hui, on garde la série actuelle.
          } else if (last.toDateString() === yesterday.toDateString()) {
            streak += 1; // Incrémente la série.
          } else {
            streak = 1; // Repart sur une nouvelle série.
          }
        } else {
          streak = 1; // Première activité.
        }

        const recentSurahs = progress.recentSurahs || [];
        const dailyGoal = progress.dailyGoal || { target: 10, current: 0 };
        const activityHistory = Array.isArray(progress.activityHistory) ? progress.activityHistory.slice(0, 10) : [];
        const lastAssessment = progress.learning
          ? {
              module: progress.learning.lastAssessmentModule,
              score: progress.learning.lastAssessmentScore,
              total: progress.learning.lastAssessmentTotal,
              completedAt: progress.learning.lastAssessmentAt,
            }
          : undefined;
        const lastListened = progress.quran?.lastListened;

        setData({
          memorizationProgress: memPercent,
          arabicProgress: arabicPercent,
          listeningProgress: listeningPercent,
          streak,
          recentSurahs,
          dailyGoalTarget: dailyGoal.target,
          dailyGoalCurrent: dailyGoal.current,
          activityHistory,
          lastAssessment,
          lastListened,
        });

        // Mettre à jour l'activité et la série dans Firestore.
        await setDoc(
          doc(db, "progress", user.uid),
          {
            "stats.lastActive": new Date().toISOString(),
            "stats.streak": streak,
          },
          { merge: true }
        );
      } catch (error) {
        console.error("Erreur tableau de bord :", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  return { data, loading };
}
