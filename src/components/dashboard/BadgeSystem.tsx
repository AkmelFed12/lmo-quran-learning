"use client";
import { useEffect, useState } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/lib/hooks/useAuth";
import { Award, Star, Zap, BookOpen } from "lucide-react";
import { motion } from "framer-motion";
import { isAlphabetMastered } from "@/lib/arabic-curriculum";

const allBadges = [
  { id: "alphabet-done", label: "Alphabet maîtrisé", icon: BookOpen, color: "text-amber-500" },
  { id: "streak-7", label: "7 jours de suite", icon: Zap, color: "text-orange-500" },
  { id: "memorize-100", label: "100 versets mémorisés", icon: Star, color: "text-yellow-500" },
  { id: "quiz-10", label: "10 quiz réussis", icon: Award, color: "text-purple-500" },
];

export default function BadgeSystem() {
  const { user } = useAuth();
  const [earned, setEarned] = useState<string[]>([]);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const progressSnap = await getDoc(doc(db, "progress", user.uid));
      const memSnap = await getDoc(doc(db, "memorization", user.uid));
      const newEarned: string[] = [];
      const progress = progressSnap.exists() ? progressSnap.data() : {};
      if (isAlphabetMastered(progress.arabic?.completedLevels || [], progress.arabic?.lettersLearned?.length || 0)) newEarned.push("alphabet-done");
      if (progress.stats?.streak >= 7) newEarned.push("streak-7");
      if (progress.arabic?.quizzesPassed >= 10) newEarned.push("quiz-10");
      const sessions = memSnap.exists() ? memSnap.data().sessions || [] : [];
      const totalAyahs = sessions.reduce((acc: number, s: any) => acc + (s.toAyah - s.fromAyah + 1), 0);
      if (totalAyahs >= 100) newEarned.push("memorize-100");
      setEarned(newEarned);
      if (user) await setDoc(doc(db, "progress", user.uid), { badges: newEarned }, { merge: true });
    })();
  }, [user]);

  return (
    <div className="card-premium p-6">
      <h3 className="text-lg font-semibold mb-4">Badges</h3>
      <div className="grid grid-cols-4 gap-3">
        {allBadges.map((badge) => (
          <motion.div
            key={badge.id}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className={`flex flex-col items-center p-2 rounded-xl transition ${
              earned.includes(badge.id) ? "opacity-100" : "opacity-30 grayscale"
            }`}
            whileHover={{ scale: 1.1 }}
          >
            <badge.icon className={`w-8 h-8 ${badge.color}`} />
            <span className="text-[10px] text-center mt-1">{badge.label}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
