"use client";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/lib/hooks/useAuth";
import { Award, Star, Flame, BookOpen, Brain, Trophy } from "lucide-react";

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: any;
  earned: boolean;
}

const BADGES_DEFINITION: Omit<Badge, "earned">[] = [
  { id: "first-letter", name: "Première lettre", description: "Apprendre votre première lettre arabe", icon: BookOpen },
  { id: "alphabet-master", name: "Maître de l'alphabet", description: "Apprendre toutes les lettres", icon: Award },
  { id: "first-surah", name: "Première sourate", description: "Mémoriser une sourate complète", icon: Star },
  { id: "streak-7", name: "7 jours", description: "Maintenir une série de 7 jours", icon: Flame },
  { id: "streak-30", name: "30 jours", description: "Maintenir une série de 30 jours", icon: Flame },
  { id: "quiz-perfect", name: "Quiz parfait", description: "Obtenir 100 % à un quiz", icon: Brain },
  { id: "ayahs-100", name: "100 versets", description: "Mémoriser 100 versets", icon: Trophy },
];

export default function BadgesPanel() {
  const { user } = useAuth();
  const [badges, setBadges] = useState<Badge[]>(
    BADGES_DEFINITION.map((b) => ({ ...b, earned: false }))
  );

  useEffect(() => {
    if (!user) return;
    (async () => {
      const snap = await getDoc(doc(db, "progress", user.uid));
      if (snap.exists()) {
        const data = snap.data();
        const earned: string[] = data.badges || [];
        setBadges(
          BADGES_DEFINITION.map((b) => ({ ...b, earned: earned.includes(b.id) }))
        );
      }
    })();
  }, [user]);

  const earnedCount = badges.filter((b) => b.earned).length;

  return (
    <div className="card-premium p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Badges</h3>
        <span className="text-sm text-slate-500">
          {earnedCount} / {badges.length}
        </span>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {badges.map((badge) => (
          <div
            key={badge.id}
            className={`p-3 rounded-xl text-center border transition-all ${
              badge.earned
                ? "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-300 dark:border-emerald-700"
                : "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 opacity-50"
            }`}
          >
            <badge.icon
              className={`w-8 h-8 mx-auto mb-1 ${
                badge.earned ? "text-emerald-600" : "text-slate-400"
              }`}
            />
            <p className="text-xs font-medium">{badge.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
