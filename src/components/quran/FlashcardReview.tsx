"use client";
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/lib/hooks/useAuth";
import { ArrowLeft, ArrowRight, BookOpen, Eye, EyeOff, Layers, Loader, Pause, Play } from "lucide-react";
import { toast } from "sonner";

type FlashcardSession = {
  surahNumber: number;
  fromAyah: number;
  toAyah: number;
};

export default function FlashcardReview() {
  const { user } = useAuth();
  const [flashcards, setFlashcards] = useState<FlashcardSession[]>([]);
  const [index, setIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [loadingAudio, setLoadingAudio] = useState(false);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const snap = await getDoc(doc(db, "memorization", user.uid));
      if (snap.exists()) {
        const sessions: unknown[] = Array.isArray(snap.data().sessions) ? snap.data().sessions : [];
        setFlashcards(
          sessions.filter((session): session is FlashcardSession =>
            typeof session === "object" &&
            session !== null &&
            typeof (session as Partial<FlashcardSession>).surahNumber === "number" &&
            typeof (session as Partial<FlashcardSession>).fromAyah === "number" &&
            typeof (session as Partial<FlashcardSession>).toAyah === "number"
          )
        );
      }
    })();
  }, [user]);

  const fetchAudio = async (surahNumber: number, ayahNumber: number) => {
    setLoadingAudio(true);
    try {
      const res = await fetch(
        `https://api.alquran.cloud/v1/ayah/${surahNumber}:${ayahNumber}/ar.alafasy`
      );
      const data = await res.json();
      if (data?.data?.audio) {
        setAudioUrl(data.data.audio);
        return data.data.audio;
      }
    } catch {
      toast.error("Audio indisponible pour cette carte.");
    } finally {
      setLoadingAudio(false);
    }
    return null;
  };

  const playAudio = async () => {
    if (flashcards.length === 0) return;
    const current = flashcards[index];
    const url = await fetchAudio(current.surahNumber, current.fromAyah);
    if (url) {
      const audio = new Audio(url);
      audio.play().catch(() => toast.error("Lecture audio impossible pour le moment."));
      setPlaying(true);
      audio.onended = () => setPlaying(false);
    }
  };

  if (flashcards.length === 0)
    return (
      <div className="rounded-[2rem] border border-dashed border-emerald-900/20 bg-white/80 p-8 text-center shadow-sm dark:border-white/10 dark:bg-slate-900/70">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-emerald-100 text-emerald-900 dark:bg-emerald-950/60 dark:text-gold">
          <Layers className="h-6 w-6" />
        </div>
        <h2 className="mt-4 text-xl font-heading font-bold text-slate-950 dark:text-white">Aucune carte à réviser.</h2>
        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-600 dark:text-slate-300">
          Créez d'abord une session de mémorisation, puis revenez ici pour la transformer en carte de rappel.
        </p>
      </div>
    );

  const current = flashcards[index];
  const progress = Math.round(((index + 1) / flashcards.length) * 100);

  return (
    <Card className="overflow-hidden border-emerald-900/10 bg-white/90 shadow-sm dark:border-white/10 dark:bg-slate-900/75">
      <CardContent className="p-0">
        <div className="border-b border-emerald-900/10 bg-ivory/70 p-5 dark:border-white/10 dark:bg-white/[0.04]">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-gold">Session de rappel</p>
              <h2 className="mt-1 text-xl font-heading font-bold text-slate-950 dark:text-white">
                Carte {index + 1} sur {flashcards.length}
              </h2>
            </div>
            <span className="inline-flex w-fit items-center gap-2 rounded-full bg-emerald-100 px-4 py-2 text-xs font-bold text-emerald-950 dark:bg-emerald-950/60 dark:text-emerald-100">
              <BookOpen className="h-4 w-4" />
              Sourate {current.surahNumber}
            </span>
          </div>
          <div className="mt-4 h-2 rounded-full bg-emerald-900/10 dark:bg-white/10">
            <div className="h-full rounded-full bg-gold transition-all" style={{ width: `${progress}%` }} />
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowAnswer(!showAnswer)}
          className="block w-full px-5 py-8 text-center transition hover:bg-emerald-50/70 dark:hover:bg-white/[0.03]"
        >
        {!showAnswer ? (
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">Question</p>
            <p className="mt-3 text-3xl font-heading font-bold text-slate-950 dark:text-white">Sourate {current.surahNumber}</p>
            <p className="mt-3 inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-xs font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
              <Eye className="h-4 w-4" />
              Afficher les versets
            </p>
          </div>
        ) : (
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">Réponse</p>
            <p className="mt-3 text-2xl font-heading font-bold text-slate-950 dark:text-white">
              Versets {current.fromAyah} – {current.toAyah}
            </p>
            <p className="mt-3 inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-xs font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
              <EyeOff className="h-4 w-4" />
              Masquer la réponse
            </p>
          </div>
        )}
        </button>

        <div className="grid gap-3 border-t border-emerald-900/10 p-5 dark:border-white/10 sm:grid-cols-[1fr_auto_1fr]">
          <Button
            variant="outline"
            className="min-h-12 rounded-full"
            onClick={(e) => {
              e.stopPropagation();
              setIndex((i) => Math.max(0, i - 1));
              setShowAnswer(false);
            }}
            disabled={index === 0}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Précédent
          </Button>
          <Button
            variant="outline"
            className="min-h-12 rounded-full border-emerald-200 text-emerald-800 hover:bg-emerald-50 dark:border-emerald-900 dark:text-emerald-100 dark:hover:bg-emerald-950/40"
            onClick={(e) => {
              e.stopPropagation();
              playAudio();
            }}
            disabled={loadingAudio}
          >
            {loadingAudio ? (
              <Loader className="mr-2 h-4 w-4 animate-spin" />
            ) : playing ? (
              <Pause className="mr-2 h-4 w-4" />
            ) : (
              <Play className="mr-2 h-4 w-4" />
            )}
            Écouter le début
          </Button>
          <Button
            className="min-h-12 rounded-full bg-emerald-900 text-white hover:bg-emerald-800"
            onClick={(e) => {
              e.stopPropagation();
              setIndex((i) => Math.min(flashcards.length - 1, i + 1));
              setShowAnswer(false);
            }}
            disabled={index === flashcards.length - 1}
          >
            Suivant
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
