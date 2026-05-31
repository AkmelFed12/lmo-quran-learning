"use client";
import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import type { ChartData } from "chart.js";
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
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/lib/hooks/useAuth";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

export default function ProgressChart() {
  const { user } = useAuth();
  const [chartData, setChartData] = useState<ChartData<"line", number[], string> | null>(null);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const snap = await getDoc(doc(db, "progress", user.uid));
      const history: { date: string; verses: number }[] = snap.exists()
        ? snap.data().history || []
        : [];
      const labels = history.map((h) => h.date);
      const data = history.map((h) => h.verses);

      setChartData({
        labels,
        datasets: [
          {
            label: "Versets mémorisés",
            data,
            fill: true,
            borderColor: "#059669",
            backgroundColor: "rgba(5, 150, 105, 0.1)",
            tension: 0.4,
            pointRadius: 3,
            pointBackgroundColor: "#059669",
          },
        ],
      });
    })();
  }, [user]);

  if (!chartData) return <p>Chargement…</p>;

  return (
    <div className="card-premium p-6">
      <h3 className="text-lg font-semibold mb-4">Évolution</h3>
      <Line
        data={chartData}
        options={{
          responsive: true,
          plugins: { legend: { display: false } },
          scales: { y: { beginAtZero: true } },
        }}
      />
    </div>
  );
}
