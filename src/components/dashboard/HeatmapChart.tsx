"use client";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/lib/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function HeatmapChart() {
  const { user } = useAuth();
  const [activity, setActivity] = useState<Record<string, number>>({});

  useEffect(() => {
    if (!user) return;
    (async () => {
      const snap = await getDoc(doc(db, "progress", user.uid));
      if (snap.exists()) {
        setActivity(snap.data().activity || {});
      }
    })();
  }, [user]);

  // Préparer les 30 derniers jours
  const days = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push(d.toISOString().split("T")[0]);
  }

  return (
    <Card>
      <CardHeader><CardTitle>Activité (30 derniers jours)</CardTitle></CardHeader>
      <CardContent>
        <div className="grid grid-cols-10 gap-1">
          {days.map(date => {
            const count = activity[date] || 0;
            const intensity = count === 0 ? "bg-slate-100 dark:bg-slate-800" : count < 5 ? "bg-emerald-200 dark:bg-emerald-800" : "bg-emerald-600";
            return (
              <div
                key={date}
                className={`w-6 h-6 rounded ${intensity}`}
                title={`${date}: ${count} révisions`}
              />
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
