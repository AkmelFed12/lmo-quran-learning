"use client";
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, BookOpen, TrendingUp, MessageSquare } from "lucide-react";
import { Line } from "react-chartjs-2";
import type { ChartData } from "chart.js";
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement,
  LineElement, Title, Tooltip, Legend, Filler,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

export default function AdminAnalyticsPage() {
  const [stats, setStats] = useState({ users: 0, sessions: 0, quizzes: 0, contacts: 0 });
  const [chartData, setChartData] = useState<ChartData<"line", number[], string> | null>(null);

  useEffect(() => {
    (async () => {
      const usersSnap = await getDocs(collection(db, "users"));
      const memSnap = await getDocs(collection(db, "memorization"));
      const progSnap = await getDocs(collection(db, "progress"));
      const contactSnap = await getDocs(collection(db, "contacts"));

      let sessions = 0;
      memSnap.forEach(d => sessions += (d.data().sessions?.length || 0));
      let quizzes = 0;
      progSnap.forEach(d => quizzes += (d.data().arabic?.quizzesPassed || 0));

      setStats({
        users: usersSnap.size,
        sessions,
        quizzes,
        contacts: contactSnap.size,
      });

      setChartData({
        labels: ["Jan", "Fév", "Mar", "Avr", "Mai"],
        datasets: [{
          label: "Utilisateurs",
          data: [5, 8, 12, 20, usersSnap.size],
          borderColor: "#10b981",
          backgroundColor: "rgba(16,185,129,0.1)",
          fill: true,
          tension: 0.4,
        }],
      });
    })();
  }, []);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Statistiques</h2>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-emerald-500">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Utilisateurs</CardTitle>
            <Users className="w-5 h-5 text-emerald-500" />
          </CardHeader>
          <CardContent><p className="text-3xl font-bold">{stats.users}</p></CardContent>
        </Card>
        <Card className="border-l-4 border-l-sky-500">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Sessions</CardTitle>
            <BookOpen className="w-5 h-5 text-sky-500" />
          </CardHeader>
          <CardContent><p className="text-3xl font-bold">{stats.sessions}</p></CardContent>
        </Card>
        <Card className="border-l-4 border-l-amber-500">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Quiz</CardTitle>
            <TrendingUp className="w-5 h-5 text-amber-500" />
          </CardHeader>
          <CardContent><p className="text-3xl font-bold">{stats.quizzes}</p></CardContent>
        </Card>
        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Messages</CardTitle>
            <MessageSquare className="w-5 h-5 text-purple-500" />
          </CardHeader>
          <CardContent><p className="text-3xl font-bold">{stats.contacts}</p></CardContent>
        </Card>
      </div>
      {chartData && (
        <Card>
          <CardHeader><CardTitle>Évolution des inscriptions</CardTitle></CardHeader>
          <CardContent>
            <Line data={chartData} options={{ responsive: true, plugins: { legend: { display: false } } }} />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
