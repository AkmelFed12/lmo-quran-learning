"use client";
import { useState, useEffect } from "react";
import { Clock, MapPin } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Prayer {
  name: string;
  time: string;
}

export default function PrayerTimes() {
  const [prayers, setPrayers] = useState<Prayer[]>([]);
  const [city, setCity] = useState("Abidjan");
  const [country, setCountry] = useState("CI");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPrayers = async () => {
      setError("");
      try {
        const res = await fetch(`https://api.aladhan.com/v1/timingsByCity?city=${encodeURIComponent(city)}&country=${encodeURIComponent(country)}&method=2`);
        const data = await res.json();
        const timings = data?.data?.timings;
        if (!timings) throw new Error("Prayer times unavailable");
        setPrayers([
          { name: "Fajr", time: timings.Fajr },
          { name: "Dhuhr", time: timings.Dhuhr },
          { name: "Asr", time: timings.Asr },
          { name: "Maghrib", time: timings.Maghrib },
          { name: "Isha", time: timings.Isha },
        ]);
      } catch {
        setPrayers([]);
        setError("Impossible de récupérer les horaires.");
      }
    };
    fetchPrayers();
  }, [city, country]);

  return (
    <Card className="card-premium">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-emerald-600" /> Horaires de prière
        </CardTitle>
      </CardHeader>
      <CardContent>
        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
        <div className="flex flex-wrap gap-2 mb-3">
          <input
            type="text"
            aria-label="Ville pour les horaires de prière"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Ville"
            className="w-28 rounded-lg border px-2 py-1 text-sm"
          />
          <input
            type="text"
            aria-label="Code pays pour les horaires de prière"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            placeholder="Code pays (ex: CI)"
            className="w-20 rounded-lg border px-2 py-1 text-sm"
          />
        </div>
        {prayers.length > 0 && (
          <div className="grid grid-cols-5 gap-2 text-center">
            {prayers.map((p) => (
              <div key={p.name} className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-900/20">
                <div className="text-xs font-semibold">{p.name}</div>
                <div className="text-sm">{p.time}</div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
