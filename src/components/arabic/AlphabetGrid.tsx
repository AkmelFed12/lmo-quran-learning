"use client";
import { useState } from "react";

const letters = [
  { char: "ا", name: "Alif", file: "/audio/1_alif.mp3" },
  { char: "ب", name: "Ba", file: "/audio/2_baa.mp3" },
  { char: "ت", name: "Ta", file: "/audio/3_taa.mp3" },
  { char: "ث", name: "Tha", file: "/audio/4_thaa.mp3" },
  { char: "ج", name: "Jim", file: "/audio/5_jeem.mp3" },
  { char: "ح", name: "Ha", file: "/audio/6_haa.mp3" },
  { char: "خ", name: "Kha", file: "/audio/7_khaa.mp3" },
  { char: "د", name: "Dal", file: "/audio/8_daal.mp3" },
  { char: "ذ", name: "Dhal", file: "/audio/9_zaal.mp3" },
  { char: "ر", name: "Ra", file: "/audio/10_raa.mp3" },
  { char: "ز", name: "Zay", file: "/audio/11_zaa.mp3" },
  { char: "س", name: "Sin", file: "/audio/12_seen.mp3" },
  { char: "ش", name: "Shin", file: "/audio/13_sheen.mp3" },
  { char: "ص", name: "Sad", file: "/audio/14_saad.mp3" },
  { char: "ض", name: "Dad", file: "/audio/15_daad.mp3" },
  { char: "ط", name: "Ta", file: "/audio/16_taah.mp3" },
  { char: "ظ", name: "Za", file: "/audio/17_zhaa.mp3" },
  { char: "ع", name: "Ayn", file: "/audio/18_ain.mp3" },
  { char: "غ", name: "Ghayn", file: "/audio/19_ghain.mp3" },
  { char: "ف", name: "Fa", file: "/audio/20_faa.mp3" },
  { char: "ق", name: "Qaf", file: "/audio/21_qaaf.mp3" },
  { char: "ك", name: "Kaf", file: "/audio/22_kaaf.mp3" },
  { char: "ل", name: "Lam", file: "/audio/23_laam.mp3" },
  { char: "م", name: "Mim", file: "/audio/24_meem.mp3" },
  { char: "ن", name: "Nun", file: "/audio/25_noon.mp3" },
  { char: "ه", name: "Ha", file: "/audio/26_haah.mp3" },
  { char: "و", name: "Waw", file: "/audio/27_waw.mp3" },
  { char: "ي", name: "Ya", file: "/audio/28_yaa.mp3" },
];

export default function AlphabetGrid() {
  const [selected, setSelected] = useState<string | null>(null);

  const play = (file: string) => {
    const audio = new Audio(file);
    audio.play().catch((err) => {
      console.error("Erreur lecture audio :", err);
    });
  };

  return (
    <div className="grid grid-cols-4 sm:grid-cols-7 gap-4">
      {letters.map((l) => (
        <div
          key={l.char}
          onClick={() => {
            setSelected(l.char);
            play(l.file);
          }}
          className={`card-premium aspect-square flex flex-col items-center justify-center text-2xl font-arabic cursor-pointer hover:border-emerald-500 transition-all ${
            selected === l.char
              ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20"
              : ""
          }`}
        >
          <span className="text-3xl">{l.char}</span>
          <span className="text-xs text-slate-400 mt-1">{l.name}</span>
        </div>
      ))}
    </div>
  );
}