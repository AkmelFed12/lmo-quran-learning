"use client";
import { useEffect, useRef, useState } from "react";
import {
  Bookmark,
  BookmarkCheck,
  BookOpen,
  CheckCircle2,
  Eye,
  EyeOff,
  Maximize2,
  Mic,
  MicOff,
  Minimize2,
  Moon,
  Pause,
  Play,
  Repeat2,
  Settings2,
  StickyNote,
  Sun,
} from "lucide-react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { toast } from "sonner";
import { db } from "@/lib/firebase";
import { useAuth } from "@/lib/hooks/useAuth";

interface Ayah {
  numberInSurah: number;
  text: string;
  translation?: string;
  transliteration?: string;
  audio?: string;
}

type DisplayMode = "arabic" | "translation" | "transliteration" | "all";
const READER_PREFS_KEY = "lmo_quran_reader_preferences";

function removeDiacritics(arabic: string): string {
  return arabic.replace(/[\u064B-\u0652\u0670]/g, "");
}

function extractBasmala(text: string): { basmala: string | null; cleanText: string } {
  const basmalaPattern = "بسم الله الرحمن الرحيم";
  const normalizedText = removeDiacritics(text).trim();
  const normalizedBasmala = removeDiacritics(basmalaPattern);

  if (normalizedText.startsWith(normalizedBasmala)) {
    const basmalaLength = text.indexOf("الرَّحِيمِ") + "الرَّحِيمِ".length;
    const afterBasmala = text.substring(basmalaLength).trim();
    return { basmala: text.substring(0, basmalaLength).trim(), cleanText: afterBasmala };
  }
  return { basmala: null, cleanText: text };
}

const RECITERS: Record<string, string> = {
  "ar.abdurrahmaansudais": "Abdul Rahman Al-Sudais",
  "ar.alafasy": "Mishary Rashid Al-Afasy",
  "ar.husary": "Mahmoud Khalil Al-Hussary",
  "ar.mahermuaiqly": "Maher Al-Mu'aiqly",
  "ar.yasseraldosari": "Yasser Al-Dosari",
};

function bookmarksKey(surahId: number) {
  return `lmo_quran_bookmarks_${surahId}`;
}

function notesKey(surahId: number) {
  return `lmo_quran_notes_${surahId}`;
}

export default function QuranReader({ surahId }: { surahId: number }) {
  const { user } = useAuth();
  const [ayahs, setAyahs] = useState<Ayah[]>([]);
  const [surahInfo, setSurahInfo] = useState<any>(null);
  const [basmala, setBasmala] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [reciter, setReciter] = useState("ar.alafasy");
  const [playingAyah, setPlayingAyah] = useState<number | null>(null);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [repeatCount, setRepeatCount] = useState(1);
  const [repeatLeft, setRepeatLeft] = useState(0);
  const [displayMode, setDisplayMode] = useState<DisplayMode>("all");
  const [arabicSize, setArabicSize] = useState(34);
  const [hiddenMode, setHiddenMode] = useState(false);
  const [nightReader, setNightReader] = useState(false);
  const [focusMode, setFocusMode] = useState(false);
  const [continuousMode, setContinuousMode] = useState(false);
  const [listening, setListening] = useState(false);
  const [voiceResult, setVoiceResult] = useState("");
  const [resumeAyah, setResumeAyah] = useState<number | null>(null);
  const [bookmarkedAyahs, setBookmarkedAyahs] = useState<number[]>([]);
  const [ayahNotes, setAyahNotes] = useState<Record<number, string>>({});
  const [activeNoteAyah, setActiveNoteAyah] = useState<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const recognitionRef = useRef<any>(null);
  const ayahRefs = useRef<Record<number, HTMLElement | null>>({});
  const noteSaveTimers = useRef<Record<number, number>>({});

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(READER_PREFS_KEY);
      if (!raw) return;
      const prefs = JSON.parse(raw) as Partial<{
        reciter: string;
        playbackRate: number;
        repeatCount: number;
        displayMode: DisplayMode;
        arabicSize: number;
        nightReader: boolean;
      }>;
      if (prefs.reciter && RECITERS[prefs.reciter]) setReciter(prefs.reciter);
      if (prefs.playbackRate) setPlaybackRate(prefs.playbackRate);
      if (prefs.repeatCount) setRepeatCount(prefs.repeatCount);
      if (prefs.displayMode) setDisplayMode(prefs.displayMode);
      if (prefs.arabicSize) setArabicSize(prefs.arabicSize);
      if (typeof prefs.nightReader === "boolean") setNightReader(prefs.nightReader);
    } catch {
      // Les préférences locales ne doivent jamais bloquer la lecture.
    }
  }, []);

  useEffect(() => {
    if (!user) return;

    const loadCloudPreferences = async () => {
      try {
        const snapshot = await getDoc(doc(db, "progress", user.uid));
        const prefs = snapshot.exists() ? snapshot.data().quran?.preferences : null;
        if (!prefs) return;
        if (prefs.reciter && RECITERS[prefs.reciter]) setReciter(prefs.reciter);
        if (prefs.playbackRate) setPlaybackRate(Number(prefs.playbackRate));
        if (prefs.repeatCount) setRepeatCount(Number(prefs.repeatCount));
        if (prefs.displayMode) setDisplayMode(prefs.displayMode);
        if (prefs.arabicSize) setArabicSize(Number(prefs.arabicSize));
        if (typeof prefs.nightReader === "boolean") setNightReader(prefs.nightReader);
      } catch {
        // Les préférences locales prennent le relais si le cloud est indisponible.
      }
    };

    void loadCloudPreferences();
  }, [user]);

  useEffect(() => {
    const preferences = { reciter, playbackRate, repeatCount, displayMode, arabicSize, nightReader };
    try {
      window.localStorage.setItem(READER_PREFS_KEY, JSON.stringify(preferences));
    } catch {
      // La lecture reste disponible même si le stockage local est plein ou désactivé.
    }

    if (user) {
      void setDoc(doc(db, "progress", user.uid), { quran: { preferences } }, { merge: true });
    }
  }, [arabicSize, displayMode, nightReader, playbackRate, reciter, repeatCount, user]);

  useEffect(() => {
    try {
      const savedBookmarks = window.localStorage.getItem(bookmarksKey(surahId));
      const savedNotes = window.localStorage.getItem(notesKey(surahId));
      setBookmarkedAyahs(savedBookmarks ? JSON.parse(savedBookmarks) : []);
      setAyahNotes(savedNotes ? JSON.parse(savedNotes) : {});
      setActiveNoteAyah(null);
    } catch {
      setBookmarkedAyahs([]);
      setAyahNotes({});
      setActiveNoteAyah(null);
    }

    if (!user) return;

    const loadCloudReaderState = async () => {
      try {
        const snapshot = await getDoc(doc(db, "progress", user.uid));
        const quran = snapshot.exists() ? snapshot.data().quran : null;
        const cloudBookmarks = quran?.bookmarks?.[String(surahId)];
        const cloudNotes = quran?.notes?.[String(surahId)];
        if (Array.isArray(cloudBookmarks)) {
          setBookmarkedAyahs(cloudBookmarks.map(Number).sort((a, b) => a - b));
        }
        if (cloudNotes && typeof cloudNotes === "object") {
          setAyahNotes(cloudNotes);
        }
      } catch {
        // L'état local reste utilisable hors connexion.
      }
    };

    void loadCloudReaderState();
  }, [surahId, user]);

  useEffect(() => {
    audioRef.current?.pause();
    audioRef.current = null;
    setPlayingAyah(null);
    setRepeatLeft(0);
    setLoading(true);
    setBasmala(null);
    setAyahs([]);

    const loadSurah = async () => {
      try {
        const [arRes, frRes, translitRes, metaRes, audioRes] = await Promise.all([
          fetch(`https://api.alquran.cloud/v1/surah/${surahId}/ar.uthmani`),
          fetch(`https://api.alquran.cloud/v1/surah/${surahId}/fr.hamidullah`),
          fetch(`https://api.alquran.cloud/v1/surah/${surahId}/en.transliteration`),
          fetch(`https://api.alquran.cloud/v1/surah/${surahId}`),
          fetch(`https://api.alquran.cloud/v1/surah/${surahId}/${reciter}`),
        ]);

        const arData = await arRes.json();
        const frData = await frRes.json();
        const translitData = await translitRes.json();
        const metaData = await metaRes.json();
        const audioData = await audioRes.json();

        const arAyahs = arData?.data?.ayahs;
        if (!arAyahs || !Array.isArray(arAyahs)) {
          console.error("Format arabe inattendu :", arData);
          return;
        }

        const frAyahs = frData?.data?.ayahs || [];
        const translitAyahs = translitData?.data?.ayahs || [];
        const audioAyahs = audioData?.data?.ayahs || [];
        setSurahInfo(metaData?.data || null);

        let extractedBasmala: string | null = null;
        let ayahsToProcess = [...arAyahs];

        if (surahId !== 1 && surahId !== 9 && ayahsToProcess.length > 0) {
          const first = ayahsToProcess[0];
          const { basmala: basmalaExtracted, cleanText } = extractBasmala(first.text || "");
          if (basmalaExtracted) {
            extractedBasmala = basmalaExtracted;
            ayahsToProcess[0] = { ...first, text: cleanText };
          }
        }

        setBasmala(extractedBasmala);
        setAyahs(
          ayahsToProcess.map((ayah: any, index: number) => ({
            numberInSurah: ayah.numberInSurah || index + 1,
            text: ayah.text || "",
            translation: frAyahs[index]?.text || "",
            transliteration: translitAyahs[index]?.text || "",
            audio: audioAyahs[index]?.audio || "",
          }))
        );
      } catch (err) {
        console.error("Erreur chargement sourate :", err);
        toast.error("Impossible de charger cette sourate pour le moment.");
      } finally {
        setLoading(false);
      }
    };

    loadSurah();
  }, [surahId, reciter]);

  useEffect(() => {
    if (!user) return;

    const loadResumePoint = async () => {
      try {
        const snapshot = await getDoc(doc(db, "progress", user.uid));
        const lastListened = snapshot.exists() ? snapshot.data().quran?.lastListened : null;
        if (lastListened?.surahId === surahId && lastListened?.ayahNumber) {
          setResumeAyah(Number(lastListened.ayahNumber));
        } else {
          setResumeAyah(null);
        }
      } catch {
        setResumeAyah(null);
      }
    };

    void loadResumePoint();
  }, [surahId, user]);

  useEffect(() => {
    if (audioRef.current) audioRef.current.playbackRate = playbackRate;
  }, [playbackRate]);

  useEffect(() => {
    if (!playingAyah) return;
    ayahRefs.current[playingAyah]?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [playingAyah]);

  useEffect(() => {
    const timers = noteSaveTimers.current;
    return () => {
      audioRef.current?.pause();
      recognitionRef.current?.stop?.();
      Object.values(timers).forEach((timer) => window.clearTimeout(timer));
    };
  }, []);

  const saveListeningProgress = async (ayahNumber: number) => {
    if (!user) return;
    try {
      const progressRef = doc(db, "progress", user.uid);
      const progressSnap = await getDoc(progressRef);
      const currentPercent = progressSnap.exists() ? Number(progressSnap.data().stats?.listeningPercent || 0) : 0;
      const estimatedPercent = Math.min(100, Math.round(((surahId - 1) / 114) * 100 + 1));
      const history = progressSnap.exists() ? progressSnap.data().activityHistory || [] : [];

      await setDoc(
        progressRef,
        {
          quran: {
            lastListened: {
              surahId,
              ayahNumber,
              reciter,
              listenedAt: new Date().toISOString(),
            },
          },
          activityHistory: [
            {
              type: "listening",
              label: `Sourate ${surahId}, verset ${ayahNumber}`,
              createdAt: new Date().toISOString(),
            },
            ...history.slice(0, 9),
          ],
          stats: {
            listeningPercent: Math.max(currentPercent, estimatedPercent),
            lastActive: new Date().toISOString(),
          },
        },
        { merge: true }
      );
    } catch (error) {
      console.error("Erreur de sauvegarde de l'écoute :", error);
    }
  };

  const saveMemorizationReview = async (ayahNumber: number, quality: "easy" | "review") => {
    if (!user) return;
    await setDoc(
      doc(db, "progress", user.uid),
      {
        quran: {
          lastSelfEvaluation: {
            surahId,
            ayahNumber,
            quality,
            reviewedAt: new Date().toISOString(),
          },
        },
        stats: {
          lastActive: new Date().toISOString(),
        },
      },
      { merge: true }
    );
    toast.success(quality === "easy" ? "Verset marqué comme fluide." : "Verset ajouté aux révisions.");
  };

  const stopAudio = () => {
    audioRef.current?.pause();
    audioRef.current = null;
    setPlayingAyah(null);
    setRepeatLeft(0);
  };

  const toggleBookmark = (ayahNumber: number) => {
    const next = bookmarkedAyahs.includes(ayahNumber)
      ? bookmarkedAyahs.filter((number) => number !== ayahNumber)
      : [...bookmarkedAyahs, ayahNumber].sort((a, b) => a - b);
    setBookmarkedAyahs(next);
    window.localStorage.setItem(bookmarksKey(surahId), JSON.stringify(next));
    if (user) {
      void setDoc(doc(db, "progress", user.uid), { quran: { bookmarks: { [String(surahId)]: next } } }, { merge: true });
    }
    toast.success(next.includes(ayahNumber) ? "Marque-page ajouté." : "Marque-page retiré.");
  };

  const updateNote = (ayahNumber: number, note: string) => {
    const next = { ...ayahNotes, [ayahNumber]: note };
    if (!note.trim()) delete next[ayahNumber];
    setAyahNotes(next);
    window.localStorage.setItem(notesKey(surahId), JSON.stringify(next));
    if (!user) return;
    window.clearTimeout(noteSaveTimers.current[ayahNumber]);
    noteSaveTimers.current[ayahNumber] = window.setTimeout(() => {
      void setDoc(doc(db, "progress", user.uid), { quran: { notes: { [String(surahId)]: next } } }, { merge: true });
    }, 600);
  };

  const playFromIndex = (startIndex: number, forceContinuous = continuousMode) => {
    const ayah = ayahs[startIndex];
    if (!ayah?.audio) {
      toast.error("Audio indisponible pour ce verset.");
      return;
    }

    if (audioRef.current) {
      audioRef.current.pause();
      if (playingAyah === ayah.numberInSurah) {
        stopAudio();
        return;
      }
    }

    const audio = new Audio(ayah.audio);
    let remainingRepeats = repeatCount - 1;
    audio.playbackRate = playbackRate;
    audioRef.current = audio;
    setPlayingAyah(ayah.numberInSurah);
    setRepeatLeft(remainingRepeats);
    audio.play().catch(() => toast.error("Lecture audio impossible."));

    audio.onended = () => {
      if (remainingRepeats > 0) {
        remainingRepeats -= 1;
        setRepeatLeft(remainingRepeats);
        audio.currentTime = 0;
        audio.play().catch(() => {});
        return;
      }

      saveListeningProgress(ayah.numberInSurah);
      setResumeAyah(ayah.numberInSurah);
      if (forceContinuous && startIndex < ayahs.length - 1) {
        playFromIndex(startIndex + 1, true);
        return;
      }
      stopAudio();
    };
  };

  const toggleVoice = () => {
    if (!listening) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (!SpeechRecognition) {
        toast.error("Votre navigateur ne supporte pas la reconnaissance vocale.");
        return;
      }
      const recognition = new SpeechRecognition();
      recognition.lang = "ar-SA";
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setVoiceResult(transcript);
        const found = ayahs.find((ayah) => ayah.text.includes(transcript));
        toast[found ? "success" : "error"](found ? `Verset trouvé : ${found.numberInSurah}` : "Aucun verset correspondant trouvé.");
        setListening(false);
      };
      recognition.onerror = () => setListening(false);
      recognition.start();
      setListening(true);
      recognitionRef.current = recognition;
    } else {
      recognitionRef.current?.stop();
      setListening(false);
    }
  };

  const showArabic = displayMode === "arabic" || displayMode === "all";
  const showTranslation = displayMode === "translation" || displayMode === "all";
  const showTransliteration = displayMode === "transliteration" || displayMode === "all";
  const arabicText = nightReader ? "text-ivory" : "text-slate-950 dark:text-white";
  const translationText = nightReader ? "text-slate-200" : "text-slate-700 dark:text-slate-300";
  const transliterationText = nightReader ? "text-slate-300" : "text-slate-500 dark:text-slate-400";
  const ayahSurface = nightReader
    ? "border-white/10 bg-white/[0.055] text-slate-100"
    : "border-emerald-900/10 bg-ivory/70 text-slate-900 dark:border-white/10 dark:bg-white/[0.035] dark:text-slate-100";
  const basmalaSurface = nightReader
    ? "border-white/10 bg-white/[0.06] text-ivory"
    : "border-emerald-900/10 bg-ivory/80 text-slate-950 dark:border-white/10 dark:bg-white/[0.04] dark:text-white";
  const hiddenSurface = nightReader
    ? "border-white/20 text-slate-300"
    : "border-emerald-900/20 text-slate-500 dark:border-white/15 dark:text-slate-400";

  if (loading) {
    return (
      <div className="card-premium space-y-4 p-5">
        <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-gold">
          <BookOpen className="h-6 w-6 animate-pulse" />
        </div>
        <div className="skeleton-block mx-auto h-5 w-40" />
        <div className="skeleton-block h-32 w-full" />
        <div className="skeleton-block h-32 w-full" />
      </div>
    );
  }

  return (
    <section className={focusMode ? "fixed inset-0 z-[70] overflow-y-auto bg-ivory p-3 dark:bg-slate-950 sm:p-6" : ""}>
      <div className={`overflow-hidden rounded-[2rem] border shadow-xl ${
        nightReader
          ? "border-white/10 bg-slate-950 text-slate-100"
          : "border-emerald-900/10 bg-white dark:border-white/10 dark:bg-slate-900"
      }`}>
        <header className="bg-emerald-950 p-5 text-white sm:p-6">
          <div className="grid gap-5 lg:grid-cols-[1fr_auto] lg:items-start">
            <div className="text-center lg:text-left">
              <p className="text-sm uppercase tracking-[0.25em] text-gold">Lecture accompagnée</p>
              <h2 className="arabic-reading mt-2 text-4xl" dir="rtl">{surahInfo?.name || ""}</h2>
              <p className="mt-1 text-xl font-semibold">{surahInfo?.englishName || "Sourate"}</p>
              <div className="mt-2 flex flex-wrap justify-center gap-3 text-xs text-emerald-50/75 lg:justify-start">
                <span>{surahInfo?.revelationType === "Meccan" ? "Mecquoise" : "Médinoise"}</span>
                <span>{surahInfo?.numberOfAyahs} versets</span>
                <span>{RECITERS[reciter]}</span>
              </div>
            </div>

            <div className="flex flex-wrap justify-center gap-2">
              <button onClick={() => setNightReader((value) => !value)} className="touch-target rounded-2xl bg-white/10 p-3 text-white transition hover:bg-white/15" aria-label="Basculer le mode nuit">
                {nightReader ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>
              <button onClick={() => setFocusMode((value) => !value)} className="touch-target rounded-2xl bg-white/10 p-3 text-white transition hover:bg-white/15" aria-label="Basculer le plein écran">
                {focusMode ? <Minimize2 className="h-5 w-5" /> : <Maximize2 className="h-5 w-5" />}
              </button>
              <button onClick={() => setHiddenMode((value) => !value)} className="touch-target rounded-2xl bg-white/10 p-3 text-white transition hover:bg-white/15" aria-label="Masquer ou afficher le texte arabe">
                {hiddenMode ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
              </button>
              <button onClick={toggleVoice} className="touch-target rounded-2xl bg-white/10 p-3 text-white transition hover:bg-white/15" aria-label="Recherche vocale">
                {listening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
              </button>
            </div>
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
            <label className="text-xs font-semibold text-emerald-50">
              Récitateur
              <select value={reciter} onChange={(event) => setReciter(event.target.value)} className="mt-1 w-full rounded-2xl border border-white/15 bg-white/10 px-3 py-3 text-sm text-white outline-none">
                {Object.entries(RECITERS).map(([id, name]) => (
                  <option key={id} value={id} className="text-slate-900">{name}</option>
                ))}
              </select>
            </label>
            <label className="text-xs font-semibold text-emerald-50">
              Affichage
              <select value={displayMode} onChange={(event) => setDisplayMode(event.target.value as DisplayMode)} className="mt-1 w-full rounded-2xl border border-white/15 bg-white/10 px-3 py-3 text-sm text-white outline-none">
                <option value="all" className="text-slate-900">Arabe + traduction + translittération</option>
                <option value="arabic" className="text-slate-900">Arabe seul</option>
                <option value="translation" className="text-slate-900">Traduction seule</option>
                <option value="transliteration" className="text-slate-900">Translittération seule</option>
              </select>
            </label>
            <label className="text-xs font-semibold text-emerald-50">
              Vitesse
              <select value={playbackRate} onChange={(event) => setPlaybackRate(Number(event.target.value))} className="mt-1 w-full rounded-2xl border border-white/15 bg-white/10 px-3 py-3 text-sm text-white outline-none">
                <option value={0.75} className="text-slate-900">0.75x lent</option>
                <option value={1} className="text-slate-900">1x normal</option>
                <option value={1.25} className="text-slate-900">1.25x rapide</option>
              </select>
            </label>
            <label className="text-xs font-semibold text-emerald-50">
              Répétition
              <select value={repeatCount} onChange={(event) => setRepeatCount(Number(event.target.value))} className="mt-1 w-full rounded-2xl border border-white/15 bg-white/10 px-3 py-3 text-sm text-white outline-none">
                <option value={1} className="text-slate-900">1 fois</option>
                <option value={3} className="text-slate-900">3 fois</option>
                <option value={5} className="text-slate-900">5 fois</option>
              </select>
            </label>
            <label className="text-xs font-semibold text-emerald-50">
              Taille arabe : {arabicSize}px
              <input type="range" min={28} max={46} value={arabicSize} onChange={(event) => setArabicSize(Number(event.target.value))} className="mt-4 w-full accent-gold" />
            </label>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-center gap-2 lg:justify-start">
            {resumeAyah && (
              <button onClick={() => playFromIndex(Math.max(0, resumeAyah - 1), true)} className="inline-flex min-h-12 items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-bold text-emerald-950 transition hover:bg-emerald-50">
                <Play className="h-4 w-4" />
                Reprendre au verset {resumeAyah}
              </button>
            )}
            <button onClick={() => playFromIndex(0, true)} className="inline-flex min-h-12 items-center gap-2 rounded-full bg-gold px-5 py-3 text-sm font-bold text-emerald-950 transition hover:bg-darkgold">
              <Play className="h-4 w-4" />
              Lire la sourate
            </button>
            <button onClick={() => setContinuousMode((value) => !value)} className={`inline-flex min-h-12 items-center gap-2 rounded-full px-5 py-3 text-sm font-bold transition ${continuousMode ? "bg-white text-emerald-950" : "bg-white/10 text-white hover:bg-white/15"}`}>
              <Repeat2 className="h-4 w-4" />
              Lecture continue
            </button>
            {playingAyah && (
              <button onClick={stopAudio} className="inline-flex min-h-12 items-center gap-2 rounded-full bg-white/10 px-5 py-3 text-sm font-bold text-white transition hover:bg-white/15">
                <Pause className="h-4 w-4" />
                Arrêter
              </button>
            )}
          </div>

          {listening && <p className="mt-3 text-center text-xs text-emerald-50/80">Écoute… récitez un verset</p>}
          {voiceResult && <p className="mt-2 text-center text-xs text-emerald-50/80">Résultat : {voiceResult}</p>}
        </header>

        <div className="space-y-5 p-4 sm:p-6">
          {basmala && showArabic && !hiddenMode && (
            <p className={`arabic-reading rounded-3xl border p-5 text-center text-3xl ${basmalaSurface}`} dir="rtl">
              {basmala}
            </p>
          )}

          {ayahs.map((ayah, index) => {
            const active = playingAyah === ayah.numberInSurah;
            return (
              <article
                key={ayah.numberInSurah}
                ref={(element) => {
                  ayahRefs.current[ayah.numberInSurah] = element;
                }}
                className={`rounded-[1.6rem] border p-4 transition sm:p-5 ${
                  active
                    ? "border-gold bg-gold/10 shadow-lg shadow-gold/10"
                    : ayahSurface
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`grid h-10 w-10 shrink-0 place-items-center rounded-2xl text-sm font-bold ${active ? "bg-gold text-emerald-950" : "bg-emerald-950 text-gold"}`}>
                    {ayah.numberInSurah}
                  </div>

                  <div className="min-w-0 flex-1">
                    {showArabic && !hiddenMode && (
                      <p className={`arabic-reading text-right ${arabicText}`} dir="rtl" style={{ fontSize: `${arabicSize}px` }}>
                        {ayah.text}
                      </p>
                    )}
                    {hiddenMode && showArabic && (
                      <div className={`rounded-2xl border border-dashed p-5 text-center text-sm ${hiddenSurface}`}>
                        Texte masqué pour récitation de mémoire.
                      </div>
                    )}
                    {showTransliteration && ayah.transliteration && (
                      <p className={`mt-4 text-sm italic leading-7 ${transliterationText}`}>{ayah.transliteration}</p>
                    )}
                    {showTranslation && ayah.translation && (
                      <p className={`mt-3 text-sm leading-7 ${translationText}`}>{ayah.translation}</p>
                    )}
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-2 pl-0 sm:pl-[3.25rem]">
                  {ayah.audio && (
                    <button onClick={() => playFromIndex(index)} className={`touch-target inline-flex items-center gap-2 rounded-full px-4 py-3 text-sm font-semibold transition ${active ? "bg-emerald-950 text-gold" : "bg-white text-emerald-900 shadow-sm hover:bg-emerald-50 dark:bg-slate-950 dark:text-emerald-100 dark:hover:bg-slate-800"}`}>
                      {active ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                      {active ? "En cours" : "Écouter"}
                    </button>
                  )}
                  <button onClick={() => saveMemorizationReview(ayah.numberInSurah, "easy")} className="touch-target inline-flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-3 text-sm font-semibold text-emerald-950 transition hover:bg-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-100">
                    <CheckCircle2 className="h-4 w-4" />
                    Fluide
                  </button>
                  <button onClick={() => saveMemorizationReview(ayah.numberInSurah, "review")} className="touch-target inline-flex items-center gap-2 rounded-full bg-amber-100 px-4 py-3 text-sm font-semibold text-amber-950 transition hover:bg-amber-200 dark:bg-amber-950/40 dark:text-amber-100">
                    <Settings2 className="h-4 w-4" />
                    À revoir
                  </button>
                  <button onClick={() => toggleBookmark(ayah.numberInSurah)} className="touch-target inline-flex items-center gap-2 rounded-full bg-sky-100 px-4 py-3 text-sm font-semibold text-sky-950 transition hover:bg-sky-200 dark:bg-sky-950/40 dark:text-sky-100">
                    {bookmarkedAyahs.includes(ayah.numberInSurah) ? <BookmarkCheck className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
                    Marque-page
                  </button>
                  <button onClick={() => setActiveNoteAyah((current) => current === ayah.numberInSurah ? null : ayah.numberInSurah)} className="touch-target inline-flex items-center gap-2 rounded-full bg-white px-4 py-3 text-sm font-semibold text-emerald-900 shadow-sm transition hover:bg-emerald-50 dark:bg-slate-950 dark:text-emerald-100 dark:hover:bg-slate-800">
                    <StickyNote className="h-4 w-4" />
                    Note
                  </button>
                  {active && repeatLeft > 0 && (
                    <span className={`inline-flex min-h-10 items-center gap-2 rounded-full bg-gold/20 px-4 py-2 text-xs font-semibold ${nightReader ? "text-gold" : "text-emerald-950 dark:text-gold"}`}>
                      <Repeat2 className="h-3.5 w-3.5" />
                      {repeatLeft} répétition(s)
                    </span>
                  )}
                </div>
                {activeNoteAyah === ayah.numberInSurah && (
                  <div className="mt-4 rounded-2xl border border-emerald-900/10 bg-white p-3 dark:border-white/10 dark:bg-slate-950">
                    <label className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
                      Note personnelle
                    </label>
                    <textarea
                      value={ayahNotes[ayah.numberInSurah] || ""}
                      onChange={(event) => updateNote(ayah.numberInSurah, event.target.value)}
                      rows={3}
                      placeholder="Écrire une remarque de lecture ou de mémorisation..."
                      className="mt-2 w-full rounded-2xl border border-slate-200 bg-ivory p-3 text-sm text-slate-900 outline-none focus:border-gold dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
                    />
                  </div>
                )}
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
