"use client";
import { useEffect } from "react";
import { Volume2 } from "lucide-react";
import { toast } from "sonner";
import { playArabicText, warmArabicVoices } from "@/lib/arabic-audio";

const rules = [
  {
    title: "Ikhfa",
    arabic: "إخفاء",
    color: "bg-sky-100 text-sky-900 border-sky-200 dark:bg-sky-950/40 dark:text-sky-100 dark:border-sky-800",
    description: "Nasalisation légère lorsque noun sakina ou tanwin rencontre certaines lettres.",
    letters: "ت ث ج د ذ ز س ش ص ض ط ظ ف ق ك",
    examples: ["مِنْ قَبْلِ", "أَنْزَلْنَا"],
  },
  {
    title: "Idgham",
    arabic: "إدغام",
    color: "bg-emerald-100 text-emerald-950 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-100 dark:border-emerald-800",
    description: "Fusion de deux sons, avec ou sans ghunna selon la lettre rencontrée.",
    letters: "ي ر م ل و ن",
    examples: ["مَنْ يَقُولُ", "مِنْ رَبِّهِمْ"],
  },
  {
    title: "Iqlab",
    arabic: "إقلاب",
    color: "bg-amber-100 text-amber-950 border-amber-200 dark:bg-amber-950/40 dark:text-amber-100 dark:border-amber-800",
    description: "Transformation du son noun en mim léger devant la lettre ba.",
    letters: "ب",
    examples: ["مِنْ بَعْدِ", "سَمِيعٌ بَصِيرٌ"],
  },
  {
    title: "Madd",
    arabic: "مد",
    color: "bg-violet-100 text-violet-950 border-violet-200 dark:bg-violet-950/40 dark:text-violet-100 dark:border-violet-800",
    description: "Allongement vocalique selon la lettre et le contexte de lecture.",
    letters: "ا و ي",
    examples: ["قَالَ", "يَقُولُ", "قِيلَ"],
  },
  {
    title: "Qalqala",
    arabic: "قلقلة",
    color: "bg-rose-100 text-rose-950 border-rose-200 dark:bg-rose-950/40 dark:text-rose-100 dark:border-rose-800",
    description: "Léger rebond du son lorsque l'une des lettres de qalqala est en sukun.",
    letters: "ق ط ب ج د",
    examples: ["أَحَدْ", "خَلَقْنَا"],
  },
];

export default function TajwidRules() {
  useEffect(() => {
    void warmArabicVoices();
  }, []);

  const speak = async (text: string) => {
    const played = await playArabicText(text, { rate: 0.78 });
    if (!played) toast.error("Lecture audio indisponible. Vérifiez le son de l'appareil.");
  };

  return (
    <div className="space-y-5">
      <div className="rounded-3xl border border-emerald-900/10 bg-ivory/70 p-5 dark:border-white/10 dark:bg-white/[0.04]">
        <h3 className="text-xl font-heading font-bold text-slate-950 dark:text-white">Tajwid essentiel</h3>
        <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">
          Les règles ci-dessous servent d'introduction. Pour corriger précisément la récitation, l'accompagnement d'un enseignant reste recommandé.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {rules.map((rule) => (
          <article key={rule.title} className={`rounded-3xl border p-5 ${rule.color}`}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.18em] opacity-70">{rule.title}</p>
                <h4 className="arabic-reading mt-1 text-3xl" dir="rtl">{rule.arabic}</h4>
              </div>
              <span className="rounded-full bg-white/60 px-3 py-1 text-xs font-bold dark:bg-white/10">Règle</span>
            </div>
            <p className="mt-4 text-sm leading-7">{rule.description}</p>
            <div className="mt-4 rounded-2xl bg-white/55 p-3 dark:bg-white/10">
              <p className="text-xs font-bold uppercase tracking-[0.15em] opacity-70">Lettres</p>
              <p className="arabic-reading mt-1 text-right text-2xl" dir="rtl">{rule.letters}</p>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {rule.examples.map((example) => (
                <button
                  key={example}
                  onClick={() => void speak(example)}
                  className="touch-target inline-flex items-center gap-2 rounded-2xl bg-white/70 px-4 py-3 text-sm font-semibold shadow-sm transition hover:bg-white dark:bg-white/10 dark:hover:bg-white/15"
                >
                  <Volume2 className="h-4 w-4" />
                  <span className="arabic-reading text-xl" dir="rtl">{example}</span>
                </button>
              ))}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
