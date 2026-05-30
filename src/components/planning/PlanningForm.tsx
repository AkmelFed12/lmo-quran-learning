"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/lib/hooks/useAuth";
import dynamic from "next/dynamic";

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
      <Card>
        <CardHeader>
          <CardTitle>Votre objectif de mémorisation</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium">Sourate de départ :</label>
            <select
              className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2"
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
          <div>
            <label className="text-sm font-medium">Versets par jour :</label>
            <input
              type="number"
              min={1}
              max={100}
              value={goalVerses}
              onChange={(e) => setGoalVerses(Number(e.target.value))}
              className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Jours par semaine :</label>
            <input
              type="number"
              min={1}
              max={7}
              value={daysPerWeek}
              onChange={(e) => setDaysPerWeek(Number(e.target.value))}
              className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2"
            />
          </div>
          <Button onClick={preparePlan} className="w-full">
            Préparer mon planning
          </Button>
        </CardContent>
      </Card>

      {plan.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Votre planning hebdomadaire</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {plan.map((day, i) => (
                <div key={i} className="card-premium p-4 flex justify-between items-center">
                  <span className="font-semibold">{day.day}</span>
                  <span className="text-sm text-slate-600 dark:text-slate-400">
                    {day.surahName} ({day.surah}) : versets {day.fromAyah} à {day.toAyah} ({day.verses} v.)
                  </span>
                </div>
              ))}
            </div>
            <ExportPlanningPDF plan={plan} />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
