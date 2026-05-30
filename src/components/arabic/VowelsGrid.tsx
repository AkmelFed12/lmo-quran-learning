"use client";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { playArabicText, warmArabicVoices } from "@/lib/arabic-audio";

// Liste complète des 28 lettres arabes
const ARABIC_LETTERS = [
  "ا", "ب", "ت", "ث", "ج", "ح", "خ", "د", "ذ", "ر", "ز", "س", "ش", "ص", "ض",
  "ط", "ظ", "ع", "غ", "ف", "ق", "ك", "ل", "م", "ن", "ه", "و", "ي"
];

export default function VowelsGrid() {
  const [selectedLetter, setSelectedLetter] = useState("ب"); // initial

  useEffect(() => {
    void warmArabicVoices();
  }, []);

  const play = async (text: string) => {
    const played = await playArabicText(text, { rate: 0.78 });
    if (!played) toast.error("Lecture audio indisponible. Vérifiez le son de l'appareil.");
  };

  const shortVowels = [
    { symbol: "ﹷ", name: "Fatha", getChar: (l: string) => l + "َ" },
    { symbol: "ﹻ", name: "Kasra", getChar: (l: string) => l + "ِ" },
    { symbol: "ﹹ", name: "Damma", getChar: (l: string) => l + "ُ" },
    { symbol: "ﹿ", name: "Sukoon", getChar: (l: string) => l + "ْ" },
  ];

  const longVowels = [
    { name: "Alif (aa)", getChar: (l: string) => l + "َا" },
    { name: "Yaa (ii)", getChar: (l: string) => l + "ِي" },
    { name: "Waaw (uu)", getChar: (l: string) => l + "ُو" },
  ];

  return (
    <div className="space-y-8">
      {/* Sélecteur de lettre */}
      <div className="flex flex-wrap gap-2">
        {ARABIC_LETTERS.map((letter) => (
          <button
            key={letter}
            onClick={() => setSelectedLetter(letter)}
            className={`w-10 h-10 rounded-full flex items-center justify-center font-arabic text-lg transition ${
              selectedLetter === letter
                ? "bg-emerald-600 text-white"
                : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-emerald-50"
            }`}
          >
            {letter}
          </button>
        ))}
      </div>

      {/* Voyelles courtes */}
      <div>
        <h3 className="text-lg font-semibold mb-3">Voyelles courtes (Harakaat)</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {shortVowels.map((v, idx) => (
            <button
              key={idx}
              onClick={() => void play(v.getChar(selectedLetter))}
              className="card-premium p-4 text-center hover:border-emerald-500 transition"
            >
              <span className="text-3xl font-arabic">{v.getChar(selectedLetter)}</span>
              <p className="text-xs text-slate-500 mt-1">{v.name}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Voyelles longues */}
      <div>
        <h3 className="text-lg font-semibold mb-3">Voyelles longues (Madd)</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {longVowels.map((v, idx) => (
            <button
              key={idx}
              onClick={() => void play(v.getChar(selectedLetter))}
              className="card-premium p-4 text-center hover:border-emerald-500 transition"
            >
              <span className="text-3xl font-arabic">{v.getChar(selectedLetter)}</span>
              <p className="text-xs text-slate-500 mt-1">{v.name}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
