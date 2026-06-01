"use client";
import { useState, useEffect } from "react";
import { doc, setDoc, getDoc, increment } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/lib/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { ArrowRight, Brain, BarChart3, CalendarClock, CheckCircle2, Clock3, ShieldAlert } from "lucide-react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

interface MemorizationSession {
  id: string;
  surahNumber: number;
  fromAyah: number;
  toAyah: number;
  easeFactor: number;
  interval: number;
  nextReviewDate: string;
  repetitionCount: number;
  lastReviewDate: string;
  qualityHistory?: number[];
}

export default function MemorizationTracker() {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<MemorizationSession[]>([]);
  const [surahInput, setSurahInput] = useState(1);
  const [fromAyah, setFromAyah] = useState(1);
  const [toAyah, setToAyah] = useState(5);
  const [showChart, setShowChart] = useState(false);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const docRef = doc(db, "memorization", user.uid);
      const snap = await getDoc(docRef);
      if (snap.exists()) setSessions(snap.data().sessions || []);
    })();
  }, [user]);

  const addSession = async () => {
    if (!user) return;
    const newSession: MemorizationSession = {
      id: Date.now().toString(),
      surahNumber: surahInput,
      fromAyah,
      toAyah,
      easeFactor: 2.5,
      interval: 0,
      nextReviewDate: new Date().toISOString().split("T")[0],
      repetitionCount: 0,
      lastReviewDate: new Date().toISOString().split("T")[0],
      qualityHistory: [],
    };
    const updated = [...sessions, newSession];
    await setDoc(doc(db, "memorization", user.uid), { sessions: updated }, { merge: true });
    setSessions(updated);
    toast.success("Session ajoutée !");
  };

  const reviewSession = async (index: number, quality: number) => {
    const updated = [...sessions];
    const s = updated[index];
    let newEF = s.easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
    if (newEF < 1.3) newEF = 1.3;
    const newInterval = s.interval === 0 ? 1 : Math.round(s.interval * newEF);
    const nextDate = new Date();
    nextDate.setDate(nextDate.getDate() + newInterval);

    const qualityHistory = [...(s.qualityHistory || []), quality];

    updated[index] = {
      ...s,
      easeFactor: newEF,
      interval: newInterval,
      nextReviewDate: nextDate.toISOString().split("T")[0],
      repetitionCount: s.repetitionCount + 1,
      lastReviewDate: new Date().toISOString().split("T")[0],
      qualityHistory,
    };

    await setDoc(doc(db, "memorization", user!.uid), { sessions: updated }, { merge: true });
    setSessions(updated);
    toast.success(`Révision notée ${quality}/5.`);

    // Mise à jour des statistiques globales.
    const totalAyahs = updated.reduce((acc, s) => acc + (s.toAyah - s.fromAyah + 1), 0);
    await setDoc(doc(db, "progress", user!.uid), {
      memorizationSessions: updated.map(s => ({
        surahNumber: s.surahNumber,
        fromAyah: s.fromAyah,
        toAyah: s.toAyah,
        status: s.nextReviewDate <= new Date().toISOString().split("T")[0] ? 'review' : 'learning'
      })),
      "stats.totalAyahs": totalAyahs,
    }, { merge: true });
  };

  const today = new Date().toISOString().split("T")[0];
  const dueRevisions = sessions
    .map((session, index) => ({ session, index }))
    .filter(({ session }) => session.nextReviewDate <= today);
  const overdueRevisions = dueRevisions.filter(({ session }) => session.nextReviewDate < today);
  const fragileDueRevisions = dueRevisions.filter(({ session }) => (session.qualityHistory || []).slice(-2).some((quality) => quality <= 2));
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowKey = tomorrow.toISOString().split("T")[0];
  const tomorrowRevisions = sessions.filter(s => s.nextReviewDate === tomorrowKey).length;
  const fragileSessions = sessions.filter(s => (s.qualityHistory || []).slice(-2).some((quality) => quality <= 2)).length;
  const stableSessions = sessions.filter(s => s.repetitionCount >= 3 && (s.qualityHistory || []).slice(-2).every((quality) => quality >= 4)).length;
  const priorityCards = [
    {
      label: "En retard",
      value: overdueRevisions.length,
      text: "à traiter en premier",
      icon: Clock3,
      className: "border-red-200 bg-red-50 text-red-950 dark:border-red-900/60 dark:bg-red-950/25 dark:text-red-100",
    },
    {
      label: "Urgent aujourd'hui",
      value: Math.max(dueRevisions.length - overdueRevisions.length, 0),
      text: "prévu pour aujourd'hui",
      icon: CalendarClock,
      className: "border-amber-200 bg-amber-50 text-amber-950 dark:border-amber-900/60 dark:bg-amber-950/25 dark:text-amber-100",
    },
    {
      label: "Fragile",
      value: fragileDueRevisions.length,
      text: "à revoir lentement",
      icon: ShieldAlert,
      className: "border-rose-200 bg-rose-50 text-rose-950 dark:border-rose-900/60 dark:bg-rose-950/25 dark:text-rose-100",
    },
    {
      label: "Stable",
      value: stableSessions,
      text: "rythme solide",
      icon: CheckCircle2,
      className: "border-emerald-200 bg-emerald-50 text-emerald-950 dark:border-emerald-900/60 dark:bg-emerald-950/25 dark:text-emerald-100",
    },
  ];

  // Données pour le graphique d'intervalles
  const intervalChartData = {
    labels: sessions.map((s, i) => `Sess. ${i + 1}`),
    datasets: [
      {
        label: "Intervalles (jours)",
        data: sessions.map(s => s.interval),
        borderColor: "#059669",
        backgroundColor: "rgba(5, 150, 105, 0.1)",
        fill: true,
        tension: 0.3,
      },
    ],
  };

  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <CalendarClock className="h-5 w-5 text-amber-600" />
            <p className="mt-3 text-2xl font-bold">{dueRevisions.length}</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">à revoir aujourd'hui</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <Brain className="h-5 w-5 text-sky-600" />
            <p className="mt-3 text-2xl font-bold">{tomorrowRevisions}</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">prévu demain</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <ShieldAlert className="h-5 w-5 text-rose-600" />
            <p className="mt-3 text-2xl font-bold">{fragileSessions}</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">passages fragiles</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <CheckCircle2 className="h-5 w-5 text-emerald-600" />
            <p className="mt-3 text-2xl font-bold">{stableSessions}</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">passages stables</p>
          </CardContent>
        </Card>
      </section>

      <Card>
        <CardHeader>
          <CardTitle>Priorité de révision</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-4">
          {priorityCards.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.label} className={`rounded-2xl border p-4 ${item.className}`}>
                <Icon className="h-5 w-5" />
                <p className="mt-3 text-2xl font-bold">{item.value}</p>
                <p className="mt-1 text-sm font-semibold">{item.label}</p>
                <p className="mt-1 text-xs opacity-80">{item.text}</p>
              </div>
            );
          })}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Ajouter une session</CardTitle>
        </CardHeader>
        <CardContent className="flex gap-2 flex-wrap">
          <input type="number" min={1} max={114} value={surahInput} onChange={e => setSurahInput(+e.target.value)} className="w-20 rounded border px-2" placeholder="Sourate" />
          <input type="number" min={1} value={fromAyah} onChange={e => setFromAyah(+e.target.value)} className="w-20 rounded border px-2" placeholder="De" />
          <input type="number" min={1} value={toAyah} onChange={e => setToAyah(+e.target.value)} className="w-20 rounded border px-2" placeholder="À" />
          <Button onClick={addSession}><ArrowRight className="w-4 h-4 mr-1" /> Ajouter</Button>
        </CardContent>
      </Card>

      {dueRevisions.length > 0 && (
        <Card>
          <CardHeader><CardTitle>Révisions du jour ({dueRevisions.length})</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {dueRevisions.map(({ session, index }) => (
              <div key={session.id} className="flex flex-col gap-3 rounded-2xl border border-emerald-900/10 p-3 dark:border-white/10 sm:flex-row sm:items-center sm:justify-between">
                <span>Sourate {session.surahNumber}, versets {session.fromAyah}-{session.toAyah}</span>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map(q => (
                    <button key={q} onClick={() => reviewSession(index, q)} className="h-9 w-9 rounded-full bg-emerald-100 text-xs font-bold text-emerald-950 hover:bg-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-100">{q}</button>
                  ))}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {sessions.length > 0 && (
        <>
          <Card>
            <CardHeader className="flex justify-between items-center">
              <CardTitle>Toutes vos sessions</CardTitle>
              <Button variant="outline" size="sm" onClick={() => setShowChart(!showChart)}>
                <BarChart3 className="w-4 h-4 mr-1" /> {showChart ? "Masquer le graphique" : "Voir les stats"}
              </Button>
            </CardHeader>
            <CardContent>
              {showChart && (
                <div className="mb-4">
                  <Line data={intervalChartData} options={{ responsive: true, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true } } }} />
                </div>
              )}
              <div className="space-y-2">
                {sessions.map((s, i) => (
                  <div key={i} className="flex justify-between text-sm">
                    <span>S{s.surahNumber} v{s.fromAyah}-{s.toAyah}</span>
                    <span className="text-slate-400">Prochaine révision : {s.nextReviewDate} | Facteur : {s.easeFactor.toFixed(1)} | Qualité : {(s.qualityHistory || []).join(", ") || "-"}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
