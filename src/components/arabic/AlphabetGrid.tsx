"use client";
import { useState, useEffect } from "react";
import { doc, getDoc, setDoc, arrayUnion } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/lib/hooks/useAuth";
import { toast } from "sonner";
import { ARABIC_LETTERS } from "@/lib/arabic-curriculum";
import { playArabicText, warmArabicVoices } from "@/lib/arabic-audio";

type AlphabetGridProps = {
  onLettersChange?: (letters: string[]) => void;
  onAlphabetComplete?: () => void;
};

async function playLetterAudio(file: string, char: string) {
  const filePlayed = await new Promise<boolean>((resolve) => {
    const audio = new Audio(file);
    audio.preload = "auto";
    let settled = false;

    const finish = (played: boolean) => {
      if (settled) return;
      settled = true;
      resolve(played);
    };

    audio.addEventListener("playing", () => finish(true), { once: true });
    audio.addEventListener("error", () => finish(false), { once: true });
    audio.play().then(() => finish(true)).catch(() => finish(false));
    window.setTimeout(() => finish(false), 4500);
  });

  if (filePlayed) return true;
  return playArabicText(char, { rate: 0.75 });
}

function readStoredLetters(data: Record<string, unknown>) {
  const nested = data.arabic && typeof data.arabic === "object" && !Array.isArray(data.arabic)
    ? (data.arabic as Record<string, unknown>)
    : {};
  const source = Array.isArray(nested.lettersLearned)
    ? nested.lettersLearned
    : Array.isArray(data["arabic.lettersLearned"])
      ? data["arabic.lettersLearned"]
      : [];
  return source.filter((letter): letter is string => typeof letter === "string");
}

export default function AlphabetGrid({ onLettersChange, onAlphabetComplete }: AlphabetGridProps) {
  const { user } = useAuth();
  const [selected, setSelected] = useState<string | null>(null);
  const [learnedLetters, setLearnedLetters] = useState<string[]>([]);
  const selectedLetter = ARABIC_LETTERS.find((letter) => letter.char === selected);
  const learnedCount = learnedLetters.length;

  useEffect(() => {
    void warmArabicVoices();
  }, []);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const snap = await getDoc(doc(db, "progress", user.uid));
      if (snap.exists()) {
        const letters = readStoredLetters(snap.data() as Record<string, unknown>);
        setLearnedLetters(letters);
        onLettersChange?.(letters);
      }
    })();
  }, [onLettersChange, user]);

  const play = async (file: string, char: string) => {
    const played = await playLetterAudio(file, char);
    if (!played) toast.error("Lecture audio indisponible sur ce navigateur.");
  };

  const markAsLearned = async (char: string) => {
    if (!user) {
      toast.info("Connectez-vous pour sauvegarder votre progression.");
      return;
    }
    if (learnedLetters.includes(char)) {
      toast.info("Lettre déjà apprise.");
      return;
    }
    const newList = [...learnedLetters, char];
    setLearnedLetters(newList);
    onLettersChange?.(newList);
    try {
      await setDoc(
        doc(db, "progress", user.uid),
        {
          arabic: {
            lettersLearned: arrayUnion(char),
          },
        },
        { merge: true }
      );
      toast.success(
        `${char} (${ARABIC_LETTERS.find((letter) => letter.char === char)?.name}) ajoutée à votre progression.`
      );
      if (newList.length >= ARABIC_LETTERS.length) onAlphabetComplete?.();
    } catch (err) {
      toast.error("Erreur de sauvegarde.");
    }
  };

  return (
    <div className="space-y-5">
      <div className="rounded-3xl border border-emerald-900/10 bg-emerald-50/70 p-4 text-sm leading-6 text-emerald-950 dark:border-emerald-800/50 dark:bg-emerald-950/25 dark:text-emerald-100">
        Touchez une lettre pour l'écouter, répétez-la lentement, puis confirmez uniquement quand vous la reconnaissez sans hésitation. Le module suivant reste verrouillé tant que les 28 lettres ne sont pas terminées.
      </div>

      <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-[1.6rem] border border-emerald-900/10 bg-white p-5 dark:border-white/10 dark:bg-slate-950">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-gold">Lettre active</p>
              <h3 className="mt-1 text-xl font-bold text-slate-950 dark:text-white">
                {selectedLetter ? selectedLetter.name : "Choisissez une lettre"}
              </h3>
            </div>
            <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-900 dark:bg-emerald-950 dark:text-emerald-100">
              {learnedCount}/{ARABIC_LETTERS.length}
            </span>
          </div>

          {selectedLetter ? (
            <div className="mt-5">
              <p className="arabic-reading text-center text-7xl text-emerald-950 dark:text-white" dir="rtl">{selectedLetter.char}</p>
              <p className="mt-4 rounded-2xl bg-ivory p-4 text-sm leading-6 text-slate-600 dark:bg-white/[0.05] dark:text-slate-300">
                {selectedLetter.note}
              </p>
              <div className="mt-4 grid gap-2 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => void play(selectedLetter.file, selectedLetter.char)}
                  className="min-h-12 rounded-2xl border border-emerald-900/10 bg-white px-4 py-3 text-sm font-bold text-emerald-900 transition hover:border-gold dark:border-white/10 dark:bg-slate-900 dark:text-gold"
                >
                  Écouter
                </button>
                <button
                  type="button"
                  onClick={() => void markAsLearned(selectedLetter.char)}
                  disabled={learnedLetters.includes(selectedLetter.char)}
                  className="min-h-12 rounded-2xl bg-emerald-800 px-4 py-3 text-sm font-bold text-white transition hover:bg-emerald-900 disabled:cursor-not-allowed disabled:bg-emerald-100 disabled:text-emerald-900 dark:disabled:bg-emerald-950 dark:disabled:text-emerald-100"
                >
                  {learnedLetters.includes(selectedLetter.char) ? "Déjà validée" : "Je connais cette lettre"}
                </button>
              </div>
            </div>
          ) : (
            <p className="mt-5 rounded-2xl bg-ivory p-4 text-sm leading-6 text-slate-600 dark:bg-white/[0.05] dark:text-slate-300">
              Commencez par Alif, puis avancez dans l'ordre. Une lettre est validée seulement quand sa forme et son son sont reconnus.
            </p>
          )}
        </div>

        <div className="grid grid-cols-4 gap-3 min-[420px]:grid-cols-5 sm:grid-cols-7 sm:gap-4">
        {ARABIC_LETTERS.map((letter) => (
          <button
            type="button"
            key={letter.char}
            onClick={() => {
              setSelected(letter.char);
              void play(letter.file, letter.char);
            }}
            onDoubleClick={() => void markAsLearned(letter.char)}
            className={`card-premium aspect-square flex cursor-pointer flex-col items-center justify-center p-2 text-2xl font-arabic transition-all hover:border-emerald-500 ${
              learnedLetters.includes(letter.char)
                ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20"
                : selected === letter.char
                  ? "border-gold bg-gold/10"
                  : ""
            }`}
          >
            <span className="text-3xl text-slate-950 dark:text-white">{letter.char}</span>
            <span className="mt-1 text-center text-[11px] text-slate-500 dark:text-slate-400">{letter.name}</span>
            {learnedLetters.includes(letter.char) && (
              <span className="mt-1 text-xs text-emerald-600 dark:text-emerald-300">Apprise</span>
            )}
          </button>
        ))}
        </div>
      </div>
    </div>
  );
}
