"use client";
import { useState } from "react";
import QuranReader from "@/components/quran/QuranReader";
import QuranNav from "@/components/quran/QuranNav";

export default function QuranPage() {
  const [selectedSurah, setSelectedSurah] = useState(1);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Coran</h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <QuranNav onSelect={setSelectedSurah} />
        </div>
        <div className="lg:col-span-2">
          <QuranReader surahId={selectedSurah} />
        </div>
      </div>
    </div>
  );
}