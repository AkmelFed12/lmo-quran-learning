"use client";

import { useEffect, useState } from "react";
import { collectionGroup, getDocs, limit, orderBy, query } from "firebase/firestore";
import { BarChart3, GraduationCap, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { db } from "@/lib/firebase";

type LearningSession = {
  id: string;
  moduleId?: string;
  moduleTitle?: string;
  score?: number;
  total?: number;
  completedAt?: string;
  difficulty?: string | number;
  answers?: Array<{ id?: number; category?: string; correct?: boolean; selectedAnswer?: string; answer?: string }>;
};

export default function AdminLearningPage() {
  const [sessions, setSessions] = useState<LearningSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadSessions = async () => {
      try {
        const snapshot = await getDocs(query(collectionGroup(db, "learningSessions"), orderBy("completedAt", "desc"), limit(30)));
        setSessions(snapshot.docs.map((document) => ({ id: document.id, ...document.data() } as LearningSession)));
      } catch {
        setError("Impossible de charger les résultats. Vérifiez les règles Firestore et l'index collectionGroup si nécessaire.");
      } finally {
        setLoading(false);
      }
    };

    void loadSessions();
  }, []);

  const averageScore = sessions.length
    ? Math.round((sessions.reduce((total, session) => total + ((session.score || 0) / Math.max(session.total || 1, 1)), 0) / sessions.length) * 100)
    : 0;
  const completedSessions = sessions.length;
  const perfectSessions = sessions.filter((session) => session.score === session.total && session.total).length;
  const moduleUsage = Object.entries(
    sessions.reduce<Record<string, number>>((acc, session) => {
      const label = session.moduleTitle || session.moduleId || "Session";
      acc[label] = (acc[label] || 0) + 1;
      return acc;
    }, {})
  ).sort((a, b) => b[1] - a[1]);
  const weakCategories = Object.entries(
    sessions.reduce<Record<string, number>>((acc, session) => {
      (session.answers || []).forEach((answer) => {
        if (answer.correct === false) {
          const category = answer.category || "non classé";
          acc[category] = (acc[category] || 0) + 1;
        }
      });
      return acc;
    }, {})
  ).sort((a, b) => b[1] - a[1]);
  const averageDifficulty = sessions.length
    ? Math.round(
        sessions.reduce((sum, session) => {
          const value = typeof session.difficulty === "number" ? session.difficulty : Number(String(session.difficulty || "").replace(/\D/g, "")) || 0;
          return sum + value;
        }, 0) / sessions.length
      )
    : 0;

  return (
    <div className="space-y-6">
      <header className="rounded-[2rem] bg-slate-950 p-6 text-white">
        <p className="text-sm font-bold uppercase tracking-[0.22em] text-gold">Résultats</p>
        <h1 className="mt-2 text-3xl font-heading font-bold">Suivi pédagogique</h1>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-300">
          Vue administrateur des tests terminés, scores moyens et modules à renforcer.
        </p>
      </header>

      <section className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-emerald-600" />
              Sessions terminées
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{completedSessions}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-amber-600" />
              Score moyen
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{averageScore}%</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-sky-600" />
              Difficulté moyenne
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{averageDifficulty || "-"}</p>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-5 lg:grid-cols-3">
        <Card>
          <CardHeader><CardTitle>Scores parfaits</CardTitle></CardHeader>
          <CardContent><p className="text-3xl font-bold">{perfectSessions}</p></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Modules les plus utilisés</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {moduleUsage.length === 0 ? <p className="text-sm text-slate-500">Aucune donnée.</p> : moduleUsage.slice(0, 5).map(([module, count]) => (
              <div key={module} className="flex items-center justify-between rounded-2xl border border-slate-100 p-3 text-sm dark:border-slate-800">
                <span>{module}</span>
                <strong>{count}</strong>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Lacunes fréquentes</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {weakCategories.length === 0 ? <p className="text-sm text-slate-500">Aucune erreur enregistrée.</p> : weakCategories.slice(0, 5).map(([category, count]) => (
              <div key={category} className="flex items-center justify-between rounded-2xl border border-slate-100 p-3 text-sm dark:border-slate-800">
                <span>{category}</span>
                <strong>{count}</strong>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>

      <Card>
        <CardHeader>
          <CardTitle>Dernières sessions</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          {loading ? (
            <p className="text-sm text-slate-500">Chargement…</p>
          ) : error ? (
            <p className="rounded-2xl bg-amber-50 p-4 text-sm text-amber-900 dark:bg-amber-950/30 dark:text-amber-100">{error}</p>
          ) : sessions.length === 0 ? (
            <p className="text-sm text-slate-500">Aucune session enregistrée pour le moment.</p>
          ) : (
            <table className="w-full min-w-[680px] text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-left dark:border-slate-800">
                  <th className="py-3">Module</th>
                  <th className="py-3">Score</th>
                  <th className="py-3">Difficulté</th>
                  <th className="py-3">Date</th>
                </tr>
              </thead>
              <tbody>
                {sessions.map((session) => (
                  <tr key={session.id} className="border-b border-slate-100 dark:border-slate-800">
                    <td className="py-3 font-semibold">{session.moduleTitle || "Session"}</td>
                    <td className="py-3">{session.score || 0} / {session.total || 0}</td>
                    <td className="py-3">{session.difficulty || "mixte"}</td>
                    <td className="py-3">{session.completedAt ? new Date(session.completedAt).toLocaleString("fr-FR") : "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
