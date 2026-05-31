"use client";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/lib/hooks/useAuth";
import type { LucideIcon } from "lucide-react";
import { Award, BookOpen, Brain, CheckCircle2, Flame, LockKeyhole, Star, Trophy, Zap } from "lucide-react";

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  earned: boolean;
  aliases?: string[];
}

const BADGES_DEFINITION: Omit<Badge, "earned">[] = [
  { id: "first-letter", name: "Première lettre", description: "Apprendre votre première lettre arabe", icon: BookOpen },
  { id: "alphabet-master", name: "Maître de l'alphabet", description: "Apprendre toutes les lettres", icon: Award, aliases: ["alphabet-done"] },
  { id: "first-surah", name: "Première sourate", description: "Mémoriser une sourate complète", icon: Star },
  { id: "streak-7", name: "7 jours", description: "Maintenir une série de 7 jours", icon: Flame },
  { id: "streak-30", name: "30 jours", description: "Maintenir une série de 30 jours", icon: Flame },
  { id: "quiz-perfect", name: "Quiz parfait", description: "Obtenir 100 % à un quiz", icon: Brain, aliases: ["quiz-10"] },
  { id: "ayahs-100", name: "100 versets", description: "Mémoriser 100 versets", icon: Trophy, aliases: ["memorize-100"] },
  { id: "weekly-challenge", name: "Défi rejoint", description: "Rejoindre un défi hebdomadaire", icon: Zap },
];

export default function BadgesPanel() {
  const { user } = useAuth();
  const [badges, setBadges] = useState<Badge[]>(
    BADGES_DEFINITION.map((b) => ({ ...b, earned: false }))
  );

  useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        const [progressSnap, challengeSnap] = await Promise.all([
          getDoc(doc(db, "progress", user.uid)),
          getDoc(doc(db, "challenges", "weekly", "participants", user.uid)),
        ]);
        const data = progressSnap.exists() ? progressSnap.data() : {};
        const earned: string[] = Array.isArray(data.badges) ? data.badges : [];
        setBadges(
          BADGES_DEFINITION.map((badge) => ({
            ...badge,
            earned:
              earned.includes(badge.id) ||
              badge.aliases?.some((alias) => earned.includes(alias)) === true ||
              (badge.id === "weekly-challenge" && challengeSnap.exists() && challengeSnap.data().joined === true),
          }))
        );
      } catch {
        setBadges(BADGES_DEFINITION.map((badge) => ({ ...badge, earned: false })));
      }
    })();
  }, [user]);

  const earnedCount = badges.filter((b) => b.earned).length;
  const percent = Math.round((earnedCount / badges.length) * 100);

  return (
    <div className="card-premium p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold">Badges</h3>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Vos étapes importantes du parcours.</p>
        </div>
        <span className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-bold text-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-100">
          {earnedCount} / {badges.length}
        </span>
      </div>
      <div className="mb-5 h-3 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
        <div className="h-full rounded-full bg-emerald-600 transition-all" style={{ width: `${percent}%` }} />
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {badges.map((badge) => (
          <div
            key={badge.id}
            className={`rounded-2xl border p-4 transition-all ${
              badge.earned
                ? "border-emerald-300 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-950/25"
                : "border-slate-200 bg-slate-50 opacity-75 dark:border-slate-800 dark:bg-slate-900"
            }`}
          >
            <div className="flex items-start gap-3">
              <div className={`grid h-11 w-11 shrink-0 place-items-center rounded-2xl ${badge.earned ? "bg-white text-emerald-700 dark:bg-white/10 dark:text-gold" : "bg-white text-slate-400 dark:bg-white/5"}`}>
                <badge.icon className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-semibold">{badge.name}</p>
                  {badge.earned ? <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" /> : <LockKeyhole className="h-4 w-4 shrink-0 text-slate-400" />}
                </div>
                <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">{badge.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
