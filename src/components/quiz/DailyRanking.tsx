"use client";
import { useEffect, useState } from "react";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Medal } from "lucide-react";

interface RankingUser {
  uid: string;
  displayName: string;
  score: number;
}

export default function DailyRanking() {
  const [users, setUsers] = useState<RankingUser[]>([]);

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    const ref = collection(db, "rankings", today, "users");
    const q = query(ref, orderBy("score", "desc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map((d) => ({
        uid: d.id,
        ...d.data(),
      })) as RankingUser[];
      setUsers(list);
    }, (error) => {
      console.error("Erreur classement:", error);
    });

    return () => unsubscribe();
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
          <Trophy className="w-5 h-5 text-amber-500" />
          Classement du jour
        </CardTitle>
      </CardHeader>
      <CardContent>
        {users.length === 0 && <p className="text-slate-500 text-sm">Aucun participant pour le moment.</p>}
        <div className="space-y-2">
          {users.map((user, idx) => (
            <div
              key={user.uid}
              className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-800"
            >
              <div className="flex items-center gap-3">
                <span className="w-6 text-center font-bold text-sm">{idx + 1}</span>
                {getMedal(idx)}
                <span className="text-sm font-medium">{user.displayName}</span>
              </div>
              <span className="text-sm font-semibold">{user.score} / 10</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}