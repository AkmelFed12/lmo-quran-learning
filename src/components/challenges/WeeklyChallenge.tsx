"use client";
import { useEffect, useState } from "react";
import { doc, getDoc, setDoc, increment, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/lib/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Trophy } from "lucide-react";

export default function WeeklyChallenge() {
  const { user } = useAuth();
  const [challenge, setChallenge] = useState<{ target: number; label: string }>({ target: 100, label: "Mémorisez 100 versets cette semaine" });
  const [progress, setProgress] = useState(0);
  const [joined, setJoined] = useState(false);

  useEffect(() => {
    if (!user) return;
    const unsub = onSnapshot(doc(db, "memorization", user.uid), (snap) => {
      if (snap.exists()) {
        const sessions = snap.data().sessions || [];
        const now = new Date();
        const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
        const total = sessions
          .filter((s: any) => new Date(s.lastReviewDate) >= startOfWeek)
          .reduce((acc: number, s: any) => acc + (s.toAyah - s.fromAyah + 1), 0);
        setProgress(total);
      }
    });
    return () => unsub();
  }, [user]);

  const joinChallenge = async () => {
    if (!user) return;
    setJoined(true);
    toast.success("Vous avez rejoint le défi de la semaine !");
    // Sauvegarder la participation
    await setDoc(doc(db, "challenges", "weekly", "participants", user.uid), { displayName: user.displayName, joined: true }, { merge: true });
  };

  const percent = Math.min(Math.round((progress / challenge.target) * 100), 100);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-amber-500" /> Défi de la semaine
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <p>{challenge.label}</p>
        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-4">
          <div className="bg-emerald-600 h-4 rounded-full transition-all" style={{ width: `${percent}%` }} />
        </div>
        <p className="text-sm text-slate-500">{progress} / {challenge.target} versets</p>
        {!joined && (
          <Button onClick={joinChallenge} size="sm">Relever le défi</Button>
        )}
      </CardContent>
    </Card>
  );
}