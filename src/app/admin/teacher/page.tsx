"use client";

import { useEffect, useMemo, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { BookOpen, Brain, GraduationCap, Headphones } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { db } from "@/lib/firebase";
import { getLearnerRecommendation, type LearnerSnapshot, type TeacherClass } from "@/lib/teacher-groups";
import { getArabicProgressPercent } from "@/lib/arabic-curriculum";

export default function AdminTeacherPage() {
  const [learners, setLearners] = useState<LearnerSnapshot[]>([]);
  const [classes, setClasses] = useState<TeacherClass[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTeacherData = async () => {
      setLoading(true);
      try {
        const [usersSnapshot, progressSnapshot, classesSnapshot] = await Promise.all([
          getDocs(collection(db, "users")),
          getDocs(collection(db, "progress")),
          getDocs(collection(db, "teacherClasses")),
        ]);

        const progressByUser = new Map(progressSnapshot.docs.map((entry) => [entry.id, entry.data()]));
        setLearners(
          usersSnapshot.docs
            .map((entry) => {
              const user = entry.data();
              const progress = progressByUser.get(entry.id) || {};
              const sessions = progress.memorizationSessions || [];
              const memorizedAyahs = Array.isArray(sessions)
                ? sessions.reduce((total: number, session: any) => total + Math.max((session.toAyah || 0) - (session.fromAyah || 0) + 1, 0), 0)
                : 0;
              return {
                id: entry.id,
                displayName: user.displayName,
                email: user.email,
                role: user.role || "user",
                arabicProgress: getArabicProgressPercent(progress.arabic?.completedLevels || [], progress.arabic?.lettersLearned || []),
                memorizationProgress: Math.min(100, Math.round((memorizedAyahs / 6236) * 100)),
                listeningProgress: progress.stats?.listeningPercent || 0,
                lastAssessment: progress.learning
                  ? {
                      module: progress.learning.lastAssessmentModule,
                      score: progress.learning.lastAssessmentScore,
                      total: progress.learning.lastAssessmentTotal,
                    }
                  : undefined,
              } satisfies LearnerSnapshot;
            })
            .filter((entry) => !entry.role || entry.role === "user" || entry.role === "learner")
        );

        setClasses(classesSnapshot.docs.map((entry) => ({ id: entry.id, ...entry.data() } as TeacherClass)));
      } finally {
        setLoading(false);
      }
    };

    void loadTeacherData();
  }, []);

  const averages = useMemo(() => {
    const total = Math.max(learners.length, 1);
    return {
      arabic: Math.round(learners.reduce((sum, learner) => sum + learner.arabicProgress, 0) / total),
      memorization: Math.round(learners.reduce((sum, learner) => sum + learner.memorizationProgress, 0) / total),
      listening: Math.round(learners.reduce((sum, learner) => sum + learner.listeningProgress, 0) / total),
    };
  }, [learners]);

  const fragileLearners = learners.filter((learner) => learner.arabicProgress < 35 || learner.listeningProgress < 30);

  return (
    <div className="space-y-6">
      <header className="rounded-[2rem] bg-slate-950 p-6 text-white">
        <p className="text-sm font-bold uppercase tracking-[0.22em] text-gold">Enseignant</p>
        <h1 className="mt-2 text-3xl font-heading font-bold">Suivi des apprenants</h1>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-300">
          Vue synthétique pour repérer les lacunes, recommander une révision et accompagner les élèves par groupe.
        </p>
      </header>

      <section className="grid gap-4 md:grid-cols-4">
        <Card><CardHeader><CardTitle className="flex items-center gap-2"><GraduationCap className="h-5 w-5 text-emerald-600" /> Élèves</CardTitle></CardHeader><CardContent><p className="text-3xl font-bold">{learners.length}</p></CardContent></Card>
        <Card><CardHeader><CardTitle className="flex items-center gap-2"><BookOpen className="h-5 w-5 text-sky-600" /> Arabe</CardTitle></CardHeader><CardContent><p className="text-3xl font-bold">{averages.arabic}%</p></CardContent></Card>
        <Card><CardHeader><CardTitle className="flex items-center gap-2"><Headphones className="h-5 w-5 text-amber-600" /> Écoute</CardTitle></CardHeader><CardContent><p className="text-3xl font-bold">{averages.listening}%</p></CardContent></Card>
        <Card><CardHeader><CardTitle className="flex items-center gap-2"><Brain className="h-5 w-5 text-rose-600" /> À suivre</CardTitle></CardHeader><CardContent><p className="text-3xl font-bold">{fragileLearners.length}</p></CardContent></Card>
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
        <Card>
          <CardHeader>
            <CardTitle>Élèves et recommandations</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {loading ? (
              <p className="text-sm text-slate-500">Chargement…</p>
            ) : learners.length === 0 ? (
              <p className="text-sm text-slate-500">Aucun élève trouvé.</p>
            ) : (
              learners.slice(0, 12).map((learner) => (
                <div key={learner.id} className="rounded-2xl border border-slate-200 p-4 dark:border-slate-800">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="font-semibold">{learner.displayName || learner.email || learner.id}</p>
                      <p className="mt-1 text-xs text-slate-500">
                        Arabe {learner.arabicProgress}% · Écoute {learner.listeningProgress}% · Mémorisation {learner.memorizationProgress}%
                      </p>
                    </div>
                    {learner.lastAssessment?.total && (
                      <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-900">
                        {learner.lastAssessment.score}/{learner.lastAssessment.total}
                      </span>
                    )}
                  </div>
                  <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">{getLearnerRecommendation(learner)}</p>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Classes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {classes.length === 0 ? (
              <p className="text-sm text-slate-500">Aucune classe créée.</p>
            ) : (
              classes.map((classe) => (
                <div key={classe.id} className="rounded-2xl border border-slate-200 p-4 dark:border-slate-800">
                  <p className="font-semibold">{classe.name}</p>
                  <p className="mt-1 text-sm text-slate-500">{classe.level} · {classe.studentIds.length} élève(s)</p>
                  <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{classe.objective || "Objectif à préciser."}</p>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
