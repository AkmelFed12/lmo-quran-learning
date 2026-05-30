"use client";
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/lib/hooks/useAuth";
import { Play, Pause, Loader } from "lucide-react";

export default function FlashcardReview() {
  const { user } = useAuth();
  const [flashcards, setFlashcards] = useState<any[]>([]);
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
        const sessions = snap.data().sessions || [];
        setFlashcards(sessions);
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
    } catch (err) {
      console.error("Erreur audio", err);
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
      audio.play();
      setPlaying(true);
      audio.onended = () => setPlaying(false);
    }
  };

  if (flashcards.length === 0)
    return <p className="text-center text-slate-500">Aucune carte à réviser.</p>;

  const current = flashcards[index];

  return (
    <Card className="cursor-pointer" onClick={() => setShowAnswer(!showAnswer)}>
      <CardContent className="text-center py-8">
        {!showAnswer ? (
          <p className="text-2xl font-bold">Sourate {current.surahNumber}</p>
        ) : (
          <div>
            <p className="text-lg mb-2">
              Versets {current.fromAyah} – {current.toAyah}
            </p>
            <button
              onClick={(e) => {
                e.stopPropagation();
                playAudio();
              }}
              className="flex items-center justify-center gap-1 mx-auto text-emerald-600 hover:text-emerald-700"
            >
              {loadingAudio ? (
                <Loader className="w-4 h-4 animate-spin" />
              ) : playing ? (
                <Pause className="w-4 h-4" />
              ) : (
                <Play className="w-4 h-4" />
              )}
              <span className="text-sm">Écouter le début</span>
            </button>
          </div>
        )}
        <div className="flex gap-2 justify-center mt-4">
          <Button
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              setIndex((i) => Math.max(0, i - 1));
            }}
          >
            Précédent
          </Button>
          <Button
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              setIndex((i) => Math.min(flashcards.length - 1, i + 1));
            }}
          >
            Suivant
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}