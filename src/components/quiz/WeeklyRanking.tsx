"use client";
import { useEffect, useState } from "react";
import { collection, query, orderBy, onSnapshot, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Medal, Calendar } from "lucide-react";

interface RankingUser {
  uid: string;
  displayName: string;
  totalScore: number;
}

export default function WeeklyRanking() {
  const [users, setUsers] = useState<RankingUser[]>([]);

  useEffect(() => {
    // Génère les 7 derniers jours (chaîne YYYY-MM-DD)
    const days: string[] = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      days.push(d.toISOString().split("T")[0]);
    }

    // Écoute en temps réel sur chaque jour
    const unsubscribes = days.map((day) => {
      const ref = collection(db, "rankings", day, "users");
      const q = query(ref, orderBy("score", "desc"));
      return onSnapshot(q, () => {
        // Dès qu'un jour change, on recalcule l'agrégation
        recalculate();
      });
    });

    const recalculate = async () => {
      const scores: Record<string, { displayName: string; total: number }> = {};
      for (const day of days) {
        const snap = await getDocs(query(collection(db, "rankings", day, "users")));
        snap.forEach((doc) => {
          const data = doc.data();
          const uid = doc.id;
          if (!scores[uid]) scores[uid] = { displayName: data.displayName || "Anonyme", total: 0 };
          scores[uid].total += data.score || 0;
        });
      }
      const list = Object.entries(scores)
        .map(([uid, info]) => ({ uid, displayName: info.displayName, totalScore: info.total }))
        .sort((a, b) => b.totalScore - a.totalScore)
        .slice(0, 20);
      setUsers(list);
    };

    recalculate();

    return () => {
      unsubscribes.forEach((unsub) => unsub());
    };
  }, []);

  const getMedal = (index: number) => {
    if (index === 0) return <Trophy className="w-5 h-5 text-amber-500" />;
    if (index === 1) return <Medal className="w-5 h-5 text-slate-400" />;
    if (index === 2) return <Medal className="w-5 h-5 text-amber-700" />;
    return null;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-emerald-600" />
          Classement de la semaine
        </CardTitle>
      </CardHeader>
      <CardContent>
        {users.length === 0 && <p className="text-slate-500 text-sm">Aucune participation cette semaine.</p>}
        <div className="space-y-2">
          {users.map((user, idx) => (
            <div
              key={user.uid}
              className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-800"
            >
              <div className="flex items-center gap-3">
                <span className="w-6 text-center font-bold text-sm">{idx + 1}</span>
                {getMedal(idx)}
                <span className="text-sm font-medium truncate max-w-[120px] sm:max-w-none">{user.displayName}</span>
              </div>
              <span className="text-sm font-semibold">{user.totalScore} pts</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}