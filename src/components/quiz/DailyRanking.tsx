"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Trophy, Medal } from "lucide-react";
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

  const highlightedRank = highlightUid ? users.findIndex((user) => user.uid === highlightUid) + 1 : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-amber-500" />
          Classement du jour
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {highlightedRank > 0 && (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-3 text-sm leading-6 text-emerald-950 dark:border-emerald-900/50 dark:bg-emerald-950/25 dark:text-emerald-100">
            <span className="font-bold">Votre rang aujourd'hui : {highlightedRank}</span>
            <span className="ml-1">sur {users.length} participant{users.length > 1 ? "s" : ""}.</span>
          </div>
        )}
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
        <Link href="/leaderboard" className="inline-flex items-center gap-2 text-sm font-bold text-emerald-800 dark:text-gold">
          Voir le classement complet
          <ArrowRight className="h-4 w-4" />
        </Link>
      </CardContent>
    </Card>
  );
}
