"use client";
import { useEffect, useState } from "react";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy } from "lucide-react";

type LeaderboardUser = {
  id: string;
  displayName: string;
  totalAyahs: number;
};

export default function LeaderboardPage() {
  const [leaders, setLeaders] = useState<LeaderboardUser[]>([]);

  useEffect(() => {
    (async () => {
      const q = query(collection(db, "stats"), orderBy("totalAyahs", "desc"), limit(20));
      const snap = await getDocs(q);
      setLeaders(snap.docs.map((entry) => {
        const data = entry.data();
        return {
          id: entry.id,
          displayName: typeof data.displayName === "string" ? data.displayName : "Anonyme",
          totalAyahs: Number(data.totalAyahs || 0),
        };
      }));
    })();
  }, []);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold flex items-center gap-2">
        <Trophy className="w-6 h-6 text-amber-500" /> Classement
      </h2>
      <Card>
        <CardHeader><CardTitle>Top 20 des mémorisateurs</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-2">
            {leaders.length === 0 && (
              <p className="text-sm text-slate-500 dark:text-slate-400">Aucun classement disponible pour le moment.</p>
            )}
            {leaders.map((user, idx) => (
              <div key={user.id} className="flex justify-between items-center">
                <span className="font-medium">{idx + 1}. {user.displayName || "Anonyme"}</span>
                <span className="text-sm text-slate-500">{user.totalAyahs} versets</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
