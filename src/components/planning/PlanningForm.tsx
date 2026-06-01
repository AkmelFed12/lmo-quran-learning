"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/lib/hooks/useAuth";
import dynamic from "next/dynamic";
import { CalendarDays, CheckCircle2, FileDown, Target } from "lucide-react";

const ExportPlanningPDF = dynamic(() => import("./ExportPlanningPDF"), {
  ssr: false,
  loading: () => <div className="skeleton-block mt-4 h-12 w-52" />,
});

interface Surah {
  number: number;
  name: string;
  englishName: string;
  ayahCount: number;
}

interface DayPlan {
  day: string;
  surah: number;
  surahName: string;
  fromAyah: number;
  toAyah: number;
  verses: number;
}

const DAYS = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];

export default function PlanningForm() {
  const { user } = useAuth();
  const [surahs, setSurahs] = useState<Surah[]>([]);
  const [goalVerses, setGoalVerses] = useState(10);
  const [daysPerWeek, setDaysPerWeek] = useState(5);
  const [startSurah, setStartSurah] = useState(1);
  const [plan, setPlan] = useState<DayPlan[]>([]);

  // Charger les sourates
  useEffect(() => {
    fetch("/data/surahs.json")
      .then((res) => res.json())
      .then((data) => setSurahs(data))
      .catch(() => toast.error("Impossible de charger les données des sourates."));
  }, []);

  // Détecter la dernière sourate mémorisée
  useEffect(() => {
    if (!user) return;
    (async () => {
      const snap = await getDoc(doc(db, "memorization", user.uid));
      if (snap.exists()) {
        const sessions = snap.data().sessions || [];
        if (sessions.length > 0) {
          const last = sessions[sessions.length - 1];
          setStartSurah(last.surahNumber);
        }
      }
    })();
  }, [user]);

  const preparePlan = async () => {
    if (surahs.length === 0) {
      toast.error("Les données des sourates ne sont pas encore chargées.");
      return;
    }

    const newPlan: DayPlan[] = [];
    let currentSurahIndex = surahs.findIndex((s) => s.number === startSurah);
    if (currentSurahIndex === -1) currentSurahIndex = 0;

    let ayahPointer = 1;
    let remainingDays = daysPerWeek;

    while (remainingDays > 0 && currentSurahIndex < surahs.length) {
      const surah = surahs[currentSurahIndex];
      const remainingAyahsInSurah = surah.ayahCount - ayahPointer + 1;
      const versesToday = Math.min(goalVerses, remainingAyahsInSurah);

      if (versesToday > 0) {
        newPlan.push({
          day: DAYS[daysPerWeek - remainingDays],
          surah: surah.number,
          surahName: surah.englishName,
          fromAyah: ayahPointer,
          toAyah: ayahPointer + versesToday - 1,
          verses: versesToday,
        });
        remainingDays--;
      }

      ayahPointer += versesToday;
      if (ayahPointer > surah.ayahCount) {
        currentSurahIndex++;
        ayahPointer = 1;
      }
    }

    setPlan(newPlan);
    toast.success("Planning préparé avec succès !");

    if (user) {
      await setDoc(doc(db, "plannings", user.uid), {
        plan: newPlan,
        startSurah,
        goalVerses,
        daysPerWeek,
        updatedAt: new Date().toISOString(),
      }, { merge: true });
      toast.success("Planning sauvegardé.");
    }
  };

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden border-emerald-900/10 bg-white/90 shadow-sm dark:border-white/10 dark:bg-slate-900/75">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-slate-950 dark:text-white">
            <span className="grid h-10 w-10 place-items-center rounded-2xl bg-emerald-100 text-emerald-900 dark:bg-emerald-950/60 dark:text-gold">
              <Target className="h-5 w-5" />
            </span>
            Votre objectif de mémorisation
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">Sourate de départ</label>
            <select
              className="mt-2 min-h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-gold dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
              value={startSurah}
              onChange={(e) => setStartSurah(Number(e.target.value))}
            >
              {surahs.map((s) => (
                <option key={s.number} value={s.number}>
                  {s.number}. {s.englishName} ({s.ayahCount} versets)
                </option>
              ))}
            </select>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">Versets par jour</label>
            <input
              type="number"
              min={1}
              max={100}
              value={goalVerses}
              onChange={(e) => setGoalVerses(Number(e.target.value))}
              className="mt-2 min-h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-gold dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">Jours par semaine</label>
            <input
              type="number"
              min={1}
              max={7}
              value={daysPerWeek}
              onChange={(e) => setDaysPerWeek(Number(e.target.value))}
              className="mt-2 min-h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-gold dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
            />
          </div>
          </div>
          <p className="rounded-2xl bg-emerald-50 p-3 text-xs leading-5 text-emerald-950 dark:bg-emerald-950/30 dark:text-emerald-100">
            Conseil : commencez avec peu de versets, puis augmentez seulement quand les révisions restent stables.
          </p>
          <Button onClick={preparePlan} className="min-h-12 w-full rounded-full bg-emerald-900 text-white hover:bg-emerald-800">
            Préparer mon planning
          </Button>
        </CardContent>
      </Card>

      {plan.length > 0 && (
        <Card className="overflow-hidden border-emerald-900/10 bg-white/90 shadow-sm dark:border-white/10 dark:bg-slate-900/75">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-slate-950 dark:text-white">
              <span className="grid h-10 w-10 place-items-center rounded-2xl bg-gold/20 text-emerald-900 dark:text-gold">
                <CalendarDays className="h-5 w-5" />
              </span>
              Votre planning hebdomadaire
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              {plan.map((day, i) => (
                <div key={i} className="flex flex-col gap-3 rounded-[1.25rem] border border-emerald-900/10 bg-ivory/70 p-4 dark:border-white/10 dark:bg-white/[0.04] sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-3">
                    <span className="grid h-9 w-9 place-items-center rounded-xl bg-emerald-950 text-sm font-bold text-gold">
                      {i + 1}
                    </span>
                    <span className="font-semibold text-slate-950 dark:text-white">{day.day}</span>
                  </div>
                  <span className="text-sm leading-6 text-slate-600 dark:text-slate-300">
                    {day.surahName} ({day.surah}) : versets {day.fromAyah} à {day.toAyah} ({day.verses} v.)
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-4 grid gap-3 rounded-2xl bg-emerald-50 p-4 text-sm text-emerald-950 dark:bg-emerald-950/30 dark:text-emerald-100 sm:grid-cols-[1fr_auto] sm:items-center">
              <p className="flex gap-2 leading-6">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
                Planning prêt : gardez la même heure chaque jour si possible, puis cochez mentalement la séance terminée.
              </p>
              <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-2 text-xs font-bold text-emerald-950 dark:bg-slate-950 dark:text-emerald-100">
                <FileDown className="h-4 w-4" />
                Export PDF
              </span>
            </div>
            <ExportPlanningPDF plan={plan} />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
