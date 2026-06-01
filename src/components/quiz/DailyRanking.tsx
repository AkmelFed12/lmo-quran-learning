"use client";
import { useEffect, useState } from "react";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Medal } from "lucide-react";
import { toast } from "sonner";

interface RankingUser {
  uid: string;
  displayName: string;
  score: number;
}

type DailyRankingProps = {
  highlightUid?: string;
  optimisticEntry?: RankingUser | null;
};

export default function DailyRanking({ highlightUid, optimisticEntry }: DailyRankingProps) {
  const [users, setUsers] = useState<RankingUser[]>([]);

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    const ref = collection(db, "rankings", today, "users");
    const q = query(ref, orderBy("score", "desc"));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const list = snapshot.docs.map((entry) => {
          const data = entry.data();
          return {
            uid: entry.id,
            displayName: typeof data.displayName === "string" ? data.displayName : "Apprenant",
            score: Number(data.score || 0),
          };
        });
        const mergedList = optimisticEntry && !list.some((user) => user.uid === optimisticEntry.uid)
          ? [...list, optimisticEntry].sort((first, second) => second.score - first.score)
          : list;
        setUsers(mergedList);
      },
      () => {
        toast.error("Classement indisponible pour le moment.");
      }
    );

    return () => unsubscribe();
  }, [optimisticEntry]);

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
              className={`flex items-center justify-between rounded-lg p-2 ${
                highlightUid === user.uid
                  ? "bg-emerald-50 ring-1 ring-emerald-300 dark:bg-emerald-950/30 dark:ring-emerald-800"
                  : "bg-slate-50 dark:bg-slate-800"
              }`}
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
