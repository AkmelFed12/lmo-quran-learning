"use client";
import { useEffect, useState } from "react";
import { doc, getDoc, onSnapshot, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/lib/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ArrowRight, CheckCircle2, RefreshCw, Trophy } from "lucide-react";
import Link from "next/link";

type MemorizationSession = {
  fromAyah?: number;
  toAyah?: number;
  lastReviewDate?: string;
};

const challenge = {
  target: 30,
  label: "Réviser ou mémoriser 30 versets cette semaine",
  description: "Un objectif volontairement court pour garder une progression régulière sans pression.",
};

function getStartOfWeek() {
  const now = new Date();
  const start = new Date(now);
  const day = start.getDay() || 7;
  start.setDate(start.getDate() - day + 1);
  start.setHours(0, 0, 0, 0);
  return start;
}

export default function WeeklyChallenge() {
  const { user } = useAuth();
  const [progress, setProgress] = useState(0);
  const [joined, setJoined] = useState(false);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return undefined;
    }

    setLoading(true);
    setLoadError(false);

    void getDoc(doc(db, "challenges", "weekly", "participants", user.uid))
      .then((snapshot) => setJoined(snapshot.exists() && snapshot.data().joined === true))
      .catch(() => undefined);

    const unsub = onSnapshot(
      doc(db, "memorization", user.uid),
      (snap) => {
        const sessions = snap.exists() && Array.isArray(snap.data().sessions)
          ? snap.data().sessions as MemorizationSession[]
          : [];
        const startOfWeek = getStartOfWeek();
        const total = sessions
          .filter((session) => session.lastReviewDate && new Date(session.lastReviewDate) >= startOfWeek)
          .reduce((acc, session) => acc + Math.max((session.toAyah || 0) - (session.fromAyah || 0) + 1, 0), 0);
        setProgress(total);
        setLoading(false);
      },
      () => {
        setLoadError(true);
        setLoading(false);
      }
    );

    return () => unsub();
  }, [user]);

  const joinChallenge = async () => {
    if (!user || joining) return;
    setJoining(true);
    try {
      await setDoc(
        doc(db, "challenges", "weekly", "participants", user.uid),
        {
          displayName: user.displayName || user.email?.split("@")[0] || "Apprenant",
          joined: true,
          joinedAt: new Date().toISOString(),
        },
        { merge: true },
      );
      setJoined(true);
      toast.success("Vous avez rejoint le défi de la semaine.");
    } catch {
      toast.error("Impossible de rejoindre le défi pour le moment.");
    } finally {
      setJoining(false);
    }
  };

  const percent = Math.min(Math.round((progress / challenge.target) * 100), 100);

  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-amber-500" /> Défi de la semaine
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <div>
          <p className="text-lg font-semibold text-slate-950 dark:text-white">{challenge.label}</p>
          <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">{challenge.description}</p>
        </div>

        <div className="rounded-2xl bg-emerald-50 p-4 dark:bg-emerald-950/25">
          <div className="flex items-center justify-between text-sm font-semibold">
            <span>{loading ? "Calcul en cours..." : `${progress} / ${challenge.target} versets`}</span>
            <span>{percent}%</span>
          </div>
          <div className="mt-3 h-4 w-full rounded-full bg-white dark:bg-slate-800">
            <div className="h-4 rounded-full bg-emerald-600 transition-all" style={{ width: `${percent}%` }} />
          </div>
        </div>

        {loadError && (
          <p className="rounded-2xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-950 dark:border-amber-900/50 dark:bg-amber-950/25 dark:text-amber-100">
            Progression indisponible pour le moment. Vos données restent conservées.
          </p>
        )}

        {joined ? (
          <div className="flex flex-wrap items-center gap-3 text-sm font-semibold text-emerald-700 dark:text-emerald-300">
            <CheckCircle2 className="h-5 w-5" />
            Défi rejoint cette semaine
          </div>
        ) : (
          <Button onClick={joinChallenge} size="sm" disabled={!user || joining}>
            {joining && <RefreshCw className="mr-2 h-4 w-4 animate-spin" />}
            Relever le défi
          </Button>
        )}

        <Link href="/memorization" className="inline-flex items-center gap-2 text-sm font-bold text-emerald-800 dark:text-gold">
          Ouvrir la mémorisation
          <ArrowRight className="h-4 w-4" />
        </Link>
      </CardContent>
    </Card>
  );
}
