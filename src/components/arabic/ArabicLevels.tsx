"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { arrayUnion, doc, getDoc, setDoc } from "firebase/firestore";
import { toast } from "sonner";
import { ArrowRight, BookOpen, CheckCircle2, GraduationCap, Layers, ListChecks, LockKeyhole, RefreshCw, Route, ShieldCheck, Sparkles, Target, Volume2, XCircle } from "lucide-react";
import { db } from "@/lib/firebase";
import { useAuth } from "@/lib/hooks/useAuth";
import AlphabetGrid from "./AlphabetGrid";
import VowelsGrid from "./VowelsGrid";
import TajwidRules from "./TajwidRules";
import TajwidExercises from "./TajwidExercises";
import ExercisesPanel from "./ExercisesPanel";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { QUESTION_CATEGORY_LABELS, getQuestionBatch } from "@/lib/question-bank";
import { getSeenQuestionIds, getSeenQuestionSignatures, recordQuestionBatchSeen, recordQuestionResult } from "@/lib/question-history";
import { playArabicText, warmArabicVoices } from "@/lib/arabic-audio";
import StructuredArabicLessons from "@/components/learning/StructuredArabicLessons";
import TajwidPremiumPanel from "@/components/learning/TajwidPremiumPanel";
import { lessonUnits, type LessonUnit } from "@/lib/learning-content";
import {
  ARABIC_LEARNING_MODULES,
  ARABIC_LETTERS,
  ARABIC_MODULES,
  ARABIC_PRACTICE_SETS,
  type ArabicModule,
  type ArabicModuleId,
  type ArabicPracticeCard,
  getArabicProgressPercent,
  getMissingPrerequisite,
  getNextArabicModule,
  getUnlockedQuestionCategories,
  isAlphabetMastered,
  isArabicModuleId,
  isArabicModuleUnlocked,
  normalizeArabicCompletedLevels,
} from "@/lib/arabic-curriculum";

type PracticeItem = {
  arabic: string;
  title?: string;
  note?: string;
};

type ModuleScore = {
  score: number;
  total: number;
  percent: number;
  passed: boolean;
  completedAt: string;
};

function readStoredArabicProgress(data: Record<string, unknown>) {
  const nested = data.arabic && typeof data.arabic === "object" && !Array.isArray(data.arabic)
    ? (data.arabic as Record<string, unknown>)
    : {};
  const completedSource = Array.isArray(nested.completedLevels)
    ? nested.completedLevels
    : Array.isArray(data["arabic.completedLevels"])
      ? data["arabic.completedLevels"]
      : [];
  const lettersSource = Array.isArray(nested.lettersLearned)
    ? nested.lettersLearned
    : Array.isArray(data["arabic.lettersLearned"])
      ? data["arabic.lettersLearned"]
      : [];
  const nestedScores = nested.moduleScores && typeof nested.moduleScores === "object" && !Array.isArray(nested.moduleScores)
    ? (nested.moduleScores as Record<string, ModuleScore>)
    : {};
  const legacyScores = Object.entries(data).reduce<Record<string, ModuleScore>>((scores, [key, value]) => {
    if (key.startsWith("arabic.moduleScores.") && value && typeof value === "object" && !Array.isArray(value)) {
      const moduleId = key.replace("arabic.moduleScores.", "");
      if (isArabicModuleId(moduleId)) scores[moduleId] = value as ModuleScore;
    }
    return scores;
  }, {});

  const moduleScores = { ...legacyScores, ...nestedScores };
  const completedFromScores = Object.entries(moduleScores)
    .filter(([moduleId, score]) => isArabicModuleId(moduleId) && Boolean(score?.passed))
    .map(([moduleId]) => moduleId as ArabicModuleId);
  const needsMigration =
    Array.isArray(data["arabic.completedLevels"]) ||
    Array.isArray(data["arabic.lettersLearned"]) ||
    Object.keys(data).some((key) => key.startsWith("arabic.moduleScores."));

  return {
    completedLevels: [...completedSource, ...completedFromScores].filter(isArabicModuleId),
    lettersLearned: lettersSource.filter((letter): letter is string => typeof letter === "string"),
    moduleScores,
    needsMigration,
  };
}

const syllables: PracticeItem[] = [
  { arabic: "بَ", title: "Ba + fatha", note: "Son a court." },
  { arabic: "بِ", title: "Ba + kasra", note: "Son i court." },
  { arabic: "بُ", title: "Ba + damma", note: "Son ou court." },
  { arabic: "مَا", title: "Ma prolongé", note: "Fatha suivie d'alif." },
  { arabic: "قَلْ", title: "Syllabe fermée", note: "Lam avec sukun." },
  { arabic: "نُو", title: "Nou prolongé", note: "Damma suivie de waw." },
  { arabic: "رَبْ", title: "Arrêt bref", note: "Lire sans ajouter de voyelle finale." },
  { arabic: "كِتَا", title: "Deux unités", note: "Kasra puis prolongation." },
];

const words: PracticeItem[] = [
  { arabic: "رَبّ", title: "Rabb", note: "Appui sur la lettre avec shadda." },
  { arabic: "قَلَم", title: "Qalam", note: "Trois lettres nettes." },
  { arabic: "كِتَاب", title: "Kitab", note: "Prolongation finale." },
  { arabic: "نُور", title: "Nour", note: "Damma puis waw de madd." },
  { arabic: "سَلَام", title: "Salam", note: "Lire sans précipitation." },
  { arabic: "قُرْآن", title: "Qur'an", note: "Attention au sukun et au hamza." },
];

const phrases: PracticeItem[] = [
  { arabic: "بِسْمِ اللهِ", title: "Bismillah", note: "Lire en deux petites unités." },
  { arabic: "الْحَمْدُ لِلَّهِ", title: "Al-hamdulillah", note: "Observer le lam lunaire puis la shadda." },
  { arabic: "رَبِّ الْعَالَمِينَ", title: "Rabbil-'alamin", note: "Shadda, kasra puis prolongation finale." },
  { arabic: "مَالِكِ يَوْمِ الدِّينِ", title: "Maliki yawmid-din", note: "Lire lentement avant de relier." },
];

const guidedReading: PracticeItem[] = [
  { arabic: "قُلْ هُوَ اللهُ أَحَدٌ", title: "Segment 1", note: "Écouter, répéter trois fois, puis cacher le texte." },
  { arabic: "اللهُ الصَّمَدُ", title: "Segment 2", note: "Attention à la shadda dans الصمد." },
  { arabic: "لَمْ يَلِدْ وَلَمْ يُولَدْ", title: "Segment 3", note: "Ne pas ajouter de voyelle après les lettres sakin." },
  { arabic: "وَلَمْ يَكُنْ لَهُ كُفُوًا أَحَدٌ", title: "Segment 4", note: "Découper en petites unités lisibles." },
];

const revisionChecklist = [
  "Je reconnais les 28 lettres sans regarder les réponses.",
  "Je lis fatha, kasra, damma et sukun sur plusieurs lettres.",
  "Je distingue tanwin, shadda et madd dans un mot court.",
  "Je peux écouter un segment, le répéter, puis le relire seul.",
  "Je sais quand ralentir pour corriger une erreur de lecture.",
];

export default function ArabicLevels() {
  const { user } = useAuth();
  const modulePanelRef = useRef<HTMLElement | null>(null);
  const [currentLevel, setCurrentLevel] = useState<ArabicModuleId>("alphabet");
  const [completedLevels, setCompletedLevels] = useState<ArabicModuleId[]>([]);
  const [lettersLearned, setLettersLearned] = useState<string[]>([]);
  const [moduleScores, setModuleScores] = useState<Record<string, ModuleScore>>({});
  const [loadingProgress, setLoadingProgress] = useState(true);

  useEffect(() => {
    void warmArabicVoices();
  }, []);

  useEffect(() => {
    if (!user) {
      setLoadingProgress(false);
      return;
    }

    const loadProgress = async () => {
      setLoadingProgress(true);
      try {
        const snap = await getDoc(doc(db, "progress", user.uid));
        const { completedLevels: savedCompleted, lettersLearned: savedLetters, moduleScores: savedScores, needsMigration } = snap.exists()
          ? readStoredArabicProgress(snap.data() as Record<string, unknown>)
          : { completedLevels: [], lettersLearned: [], moduleScores: {}, needsMigration: false };
        const normalized = normalizeArabicCompletedLevels(savedCompleted, savedLetters);

        setLettersLearned(savedLetters);
        setCompletedLevels(normalized);
        setModuleScores(savedScores as Record<string, ModuleScore>);

        if (needsMigration || normalized.length !== savedCompleted.length || normalized.some((item, index) => item !== savedCompleted[index])) {
          await setDoc(
            doc(db, "progress", user.uid),
            {
              arabic: {
                completedLevels: normalized,
                lettersLearned: savedLetters,
                moduleScores: savedScores,
              },
            },
            { merge: true }
          );
        }
      } catch {
        toast.error("Impossible de charger votre progression arabe.");
      } finally {
        setLoadingProgress(false);
      }
    };

    void loadProgress();
  }, [user]);

  const progress = useMemo(() => getArabicProgressPercent(completedLevels, lettersLearned), [completedLevels, lettersLearned]);
  const alphabetDone = isAlphabetMastered(completedLevels, lettersLearned.length);
  const nextModule = getNextArabicModule(completedLevels, lettersLearned);
  const unlockedCategories = useMemo(() => getUnlockedQuestionCategories(completedLevels, lettersLearned), [completedLevels, lettersLearned]);
  const current = ARABIC_MODULES.find((level) => level.id === currentLevel) || ARABIC_MODULES[1];
  const currentUnlocked = isArabicModuleUnlocked(current, completedLevels, lettersLearned);
  const currentScore = moduleScores[current.id];
  const currentPassed = completedLevels.includes(current.id) || (current.id === "alphabet" ? alphabetDone : Boolean(currentScore?.passed));
  const currentLesson = useMemo(() => lessonUnits.find((lesson) => lesson.moduleId === current.id), [current.id]);

  const focusModulePanel = useCallback(() => {
    if (typeof window === "undefined") return;
    window.setTimeout(() => {
      modulePanelRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      modulePanelRef.current?.focus({ preventScroll: true });
    }, 80);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const hashModule = window.location.hash.replace("#", "");
    if (isArabicModuleId(hashModule)) {
      setCurrentLevel(hashModule);
      focusModulePanel();
    }
  }, [focusModulePanel]);

  const completeModule = useCallback(
    async (levelId: ArabicModuleId, options: { force?: boolean; silent?: boolean } = {}) => {
      const selectedModule = ARABIC_MODULES.find((item) => item.id === levelId);
      if (!selectedModule || levelId === "placement") return;

      if (!user) {
        toast.info("Connectez-vous pour sauvegarder cette étape.");
        return;
      }

      const alreadyCompleted = completedLevels.includes(levelId);
      if (alreadyCompleted) {
        if (!options.silent) toast.info("Cette étape est déjà validée.");
        return;
      }

      const unlocked = isArabicModuleUnlocked(selectedModule, completedLevels, lettersLearned);
      if (!unlocked && !options.force) {
        const missing = getMissingPrerequisite(selectedModule, completedLevels, lettersLearned);
        const missingLabel = ARABIC_MODULES.find((item) => item.id === missing)?.label || "l'étape précédente";
        toast.error(`Terminez d'abord : ${missingLabel}.`);
        return;
      }

      if (levelId === "alphabet" && !options.force && lettersLearned.length < ARABIC_LETTERS.length) {
        toast.error(`Alphabet incomplet : ${lettersLearned.length}/${ARABIC_LETTERS.length} lettres terminées.`);
        return;
      }

      const moduleScore = moduleScores[levelId];
      if (levelId !== "alphabet" && !options.force && !moduleScore?.passed) {
        toast.error(`Réussissez d'abord le mini-test du module à ${selectedModule.passScore}% minimum.`);
        return;
      }

      const updated = normalizeArabicCompletedLevels([...completedLevels, levelId], lettersLearned);
      setCompletedLevels(updated);

      try {
        await setDoc(
          doc(db, "progress", user.uid),
          {
            arabic: {
              completedLevels: updated,
              lastCompletedModule: levelId,
              lastCompletedAt: new Date().toISOString(),
            },
            activityHistory: arrayUnion({
              type: "arabic",
              label: `Module validé : ${selectedModule.label}`,
              createdAt: new Date().toISOString(),
            }),
          },
          { merge: true }
        );
        if (!options.silent) toast.success(`Module validé : ${selectedModule.label}.`);
      } catch {
        toast.error("Impossible de sauvegarder cette étape pour le moment.");
      }
    },
    [completedLevels, lettersLearned, moduleScores, user]
  );

  const handleCheckpointPassed = useCallback((moduleId: ArabicModuleId, score: ModuleScore) => {
    setModuleScores((previous) => ({ ...previous, [moduleId]: score }));
    if (score.passed) void completeModule(moduleId, { force: true, silent: true });
  }, [completeModule]);

  const handleLettersChange = useCallback((letters: string[]) => {
    setLettersLearned(letters);
  }, []);

  const handleSelectModule = (module: ArabicModule) => {
    if (isArabicModuleUnlocked(module, completedLevels, lettersLearned)) {
      setCurrentLevel(module.id);
      if (typeof window !== "undefined") {
        window.history.replaceState(null, "", `${window.location.pathname}#${module.id}`);
      }
      focusModulePanel();
      return;
    }

    const missing = getMissingPrerequisite(module, completedLevels, lettersLearned);
    const missingModule = ARABIC_MODULES.find((item) => item.id === missing);
    if (missing === "alphabet" && !alphabetDone) {
      toast.error(`Terminez les 28 lettres de l'alphabet avant d'ouvrir ${module.label}.`);
      return;
    }
    toast.error(`Module verrouillé. Terminez d'abord : ${missingModule?.label || "l'étape précédente"}.`);
  };

  const handlePlacementResult = async (score: number) => {
    let suggestedLevel: ArabicModuleId = "alphabet";
    if (score >= 15 && alphabetDone) suggestedLevel = "vowels";
    if (score >= 25 && completedLevels.includes("madd")) suggestedLevel = "syllables";
    if (score >= 35 && completedLevels.includes("guided_reading")) suggestedLevel = "tajwid_foundations";

    setCurrentLevel(suggestedLevel);
    if (typeof window !== "undefined") {
      window.history.replaceState(null, "", `${window.location.pathname}#${suggestedLevel}`);
    }
    focusModulePanel();
    if (user) {
      await setDoc(
        doc(db, "progress", user.uid),
        {
          arabic: {
            placementDone: true,
            suggestedLevel,
            lastPlacementScore: score,
          },
        },
        { merge: true }
      );
    }
    toast.success(`Niveau suggéré : ${ARABIC_MODULES.find((level) => level.id === suggestedLevel)?.label}`);
  };

  const renderCurrentModule = () => {
    if (!currentUnlocked) return <LockedModulePanel module={current} completedLevels={completedLevels} lettersLearned={lettersLearned} />;

    switch (currentLevel) {
      case "placement":
        return <PlacementTest onComplete={handlePlacementResult} />;
      case "alphabet":
        return (
          <AlphabetGrid
            onLettersChange={handleLettersChange}
            onAlphabetComplete={() => void completeModule("alphabet", { force: true })}
          />
        );
      case "letter_forms":
        return <ConceptPanel title="Formes des lettres" cards={ARABIC_PRACTICE_SETS.letter_forms} />;
      case "makharij":
        return <ConceptPanel title="Points de sortie des sons" cards={ARABIC_PRACTICE_SETS.makharij} />;
      case "vowels":
        return <VowelsGrid />;
      case "tanwin_shadda":
        return <ConceptPanel title="Tanwin, sukun et shadda" cards={ARABIC_PRACTICE_SETS.tanwin_shadda} />;
      case "madd":
        return <ConceptPanel title="Prolongations naturelles" cards={ARABIC_PRACTICE_SETS.madd} />;
      case "syllables":
        return <PracticeGrid title="Syllabes guidées" items={syllables} guidance="Écoutez chaque syllabe, répétez deux fois, puis relisez sans l'audio." />;
      case "words":
        return <PracticeGrid title="Premiers mots" items={words} guidance="Le but n'est pas la vitesse : lisez chaque signe, puis reliez le mot." />;
      case "quran_vocab":
        return <ConceptPanel title="Vocabulaire coranique fréquent" cards={ARABIC_PRACTICE_SETS.quran_vocab} />;
      case "phrases":
        return <PracticeGrid title="Phrases courtes" items={phrases} large guidance="Travaillez par petits groupes de mots et gardez une respiration calme." />;
      case "guided_reading":
        return <GuidedReadingPanel />;
      case "tajwid_foundations":
        return (
          <div className="space-y-6">
            <TajwidRules />
            <TajwidExercises />
          </div>
        );
      case "fluency":
        return <ConceptPanel title="Méthode de fluidité contrôlée" cards={ARABIC_PRACTICE_SETS.fluency} />;
      case "revision_exam":
        return <RevisionPanel />;
      default:
        return null;
    }
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <header className="card-premium overflow-hidden p-0">
        <div className="grid gap-6 bg-gradient-to-br from-emerald-950 via-emerald-900 to-slate-950 p-5 text-white sm:p-6 lg:grid-cols-[1fr_0.8fr]">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.22em] text-gold">Apprendre l&apos;arabe</p>
            <h1 className="mt-2 text-3xl font-heading font-bold sm:text-4xl">Parcours verrouillé par niveau</h1>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-emerald-50/80">
              Le parcours suit l&apos;ordre naturel d&apos;apprentissage : lettres, formes, sons, voyelles, syllabes, mots, lecture accompagnée, puis tajwid. Un module avancé reste fermé tant que les fondations ne sont pas terminées.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <span className="rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white">{ARABIC_LEARNING_MODULES.length} modules</span>
              <span className="rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white">Alphabet : {lettersLearned.length}/{ARABIC_LETTERS.length}</span>
              <span className="rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white">Progression : {progress}%</span>
            </div>
          </div>
          <div className="rounded-[1.5rem] border border-white/10 bg-white/10 p-5 backdrop-blur">
            <p className="text-sm text-emerald-50/70">Prochaine étape</p>
            <h2 className="mt-2 text-2xl font-bold">{nextModule?.label || "Parcours arabe terminé"}</h2>
            <p className="mt-2 text-sm leading-6 text-emerald-50/75">{nextModule?.description || "Continuez avec les exercices, la lecture du Coran et la révision régulière."}</p>
            {nextModule && (
              <Button onClick={() => handleSelectModule(nextModule)} className="mt-4 min-h-11 bg-gold text-slate-950 hover:bg-amber-300">
                Continuer
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </header>

      <Card className="border-emerald-900/10 dark:border-white/10">
        <CardContent className="p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-semibold">Progression arabe</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {completedLevels.length} étape(s) validée(s) sur {ARABIC_LEARNING_MODULES.length}. Les modules se débloquent dans l&apos;ordre.
              </p>
            </div>
            <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-bold text-emerald-900 dark:bg-emerald-950/60 dark:text-emerald-100">{progress}%</span>
          </div>
          <div className="mt-4 h-3 rounded-full bg-emerald-100 dark:bg-emerald-950/50">
            <div className="h-full rounded-full bg-gradient-to-r from-emerald-700 to-gold transition-all" style={{ width: `${progress}%` }} />
          </div>
        </CardContent>
      </Card>

      <section className="grid gap-5 xl:grid-cols-[20rem_1fr]">
        <aside className="card-premium p-3 xl:sticky xl:top-6 xl:self-start">
          <div className="rounded-[1.4rem] bg-emerald-950 p-4 text-white">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-gold">Modules</p>
            <h2 className="mt-1 text-xl font-heading font-bold">Salle de cours</h2>
            <p className="mt-2 text-xs leading-5 text-emerald-50/75">
              Sélectionnez un module : son contenu s'ouvre directement à droite.
            </p>
          </div>

          <div className="mt-3 max-h-[70vh] space-y-2 overflow-y-auto pr-1">
            {ARABIC_MODULES.map((level, index) => {
              const completed = completedLevels.includes(level.id);
              const active = currentLevel === level.id;
              const unlocked = isArabicModuleUnlocked(level, completedLevels, lettersLearned);
              const missing = getMissingPrerequisite(level, completedLevels, lettersLearned);
              const missingLabel = ARABIC_MODULES.find((item) => item.id === missing)?.label;
              return (
                <button
                  key={level.id}
                  type="button"
                  onClick={() => handleSelectModule(level)}
                  aria-current={active ? "step" : undefined}
                  aria-disabled={!unlocked}
                  className={`group w-full rounded-[1.25rem] border p-3 text-left transition ${
                    active
                      ? "border-gold bg-emerald-950 text-white shadow-lg shadow-emerald-950/10"
                      : unlocked
                        ? "border-emerald-900/10 bg-white text-slate-700 hover:border-gold/40 hover:bg-emerald-50/60 dark:border-white/10 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-emerald-950/25"
                        : "border-slate-200 bg-slate-50 text-slate-400 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-500"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span className={`mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-2xl text-xs font-bold ${
                      active
                        ? "bg-white/10 text-gold"
                        : completed
                          ? "bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-gold"
                          : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-300"
                    }`}>
                      {level.id === "placement" ? "T" : index}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className={active ? "block text-[11px] font-bold uppercase tracking-[0.16em] text-gold" : "block text-[11px] font-bold uppercase tracking-[0.16em] text-emerald-700 dark:text-gold"}>
                        {level.stage}
                      </span>
                      <span className="mt-1 block font-semibold">{level.label}</span>
                      <span className={active ? "mt-1 block text-xs leading-5 text-emerald-50/75" : "mt-1 block text-xs leading-5 text-slate-500 dark:text-slate-400"}>
                        {unlocked ? `${level.minutes} min · ${level.passScore}%` : `Pré-requis : ${missingLabel || "étape précédente"}`}
                      </span>
                    </span>
                    {completed ? <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-gold" /> : unlocked ? <Route className="mt-1 h-4 w-4 shrink-0" /> : <LockKeyhole className="mt-1 h-4 w-4 shrink-0" />}
                  </div>
                </button>
              );
            })}
          </div>
        </aside>

        <section ref={modulePanelRef} tabIndex={-1} className="scroll-mt-24 card-premium p-5 outline-none sm:p-6">
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-gold">Cours actif · {current.stage}</p>
              <h2 className="mt-1 text-2xl font-heading font-bold">{current.label}</h2>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600 dark:text-slate-300">{current.objective}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-900 dark:bg-emerald-950 dark:text-emerald-100">{current.minutes} min</span>
                <span className="rounded-full bg-gold/15 px-3 py-1 text-xs font-bold text-amber-900 dark:text-gold">Score requis : {current.passScore}%</span>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300">{currentUnlocked ? "Accessible" : "Verrouillé"}</span>
              </div>
              <p className="mt-3 text-xs font-semibold text-emerald-700 dark:text-gold">Validation : {current.mastery}</p>
            </div>
            {current.id !== "placement" && (
              <Button onClick={() => void completeModule(current.id)} disabled={loadingProgress || !currentUnlocked || !currentPassed} className="min-h-12">
                <ListChecks className="mr-2 h-4 w-4" />
                Valider le module
              </Button>
            )}
          </div>

          <div className="space-y-6">
            <ModuleLessonPrimer lesson={currentLesson} module={current} />
            <section className="rounded-[1.5rem] border border-emerald-900/10 bg-white p-4 dark:border-white/10 dark:bg-slate-950/70 sm:p-5">
              <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-700 dark:text-gold">2. Pratique guidée</p>
                  <h3 className="mt-1 text-lg font-bold text-slate-950 dark:text-white">Appliquer la leçon</h3>
                </div>
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-900 dark:bg-emerald-950 dark:text-emerald-100">
                  Après lecture
                </span>
              </div>
              {renderCurrentModule()}
            </section>
            {current.id !== "placement" && currentUnlocked && (
              <ModuleCheckpoint
                module={current}
                userId={user?.uid}
                lettersLearnedCount={lettersLearned.length}
                savedScore={currentScore}
                onPassed={handleCheckpointPassed}
              />
            )}
          </div>
        </section>
      </section>

      <StructuredArabicLessons />

      <ExercisesPanel
        allowedCategories={unlockedCategories}
        title="Exercices après la leçon"
        description="Les exercices arrivent après le cours actif et les leçons structurées. Les catégories se débloquent selon votre progression réelle."
      />

      <TajwidPremiumPanel />
    </div>
  );
}

function LockedModulePanel({ module, completedLevels, lettersLearned }: { module: ArabicModule; completedLevels: ArabicModuleId[]; lettersLearned: string[] }) {
  const missing = getMissingPrerequisite(module, completedLevels, lettersLearned);
  const missingModule = ARABIC_MODULES.find((item) => item.id === missing);

  return (
    <div className="rounded-[1.5rem] border border-amber-200 bg-amber-50 p-5 text-amber-950 dark:border-amber-900/60 dark:bg-amber-950/20 dark:text-amber-100">
      <div className="flex items-start gap-3">
        <LockKeyhole className="mt-1 h-5 w-5 shrink-0" />
        <div>
          <h3 className="font-bold">Module verrouillé</h3>
          <p className="mt-2 text-sm leading-6">
            Terminez d&apos;abord {missingModule?.label || "l'étape précédente"}. Cette progression évite de passer à la lecture sans bases solides.
          </p>
        </div>
      </div>
    </div>
  );
}

function ModuleLessonPrimer({ lesson, module }: { lesson?: LessonUnit; module: ArabicModule }) {
  if (!lesson) {
    return (
      <section className="rounded-[1.5rem] border border-emerald-900/10 bg-emerald-50/70 p-5 dark:border-emerald-800/50 dark:bg-emerald-950/20">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-700 dark:text-gold">1. Préparation</p>
            <h3 className="mt-1 text-xl font-heading font-bold text-slate-950 dark:text-white">{module.label}</h3>
            <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-600 dark:text-slate-300">
              Lisez l'objectif du module, répondez calmement, puis utilisez le résultat pour choisir le bon point de départ.
            </p>
          </div>
          <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-emerald-900 dark:bg-slate-950 dark:text-gold">
            {module.minutes} min
          </span>
        </div>
      </section>
    );
  }

  return (
    <section className="rounded-[1.5rem] border border-emerald-900/10 bg-emerald-50/70 p-5 dark:border-emerald-800/50 dark:bg-emerald-950/20">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-700 dark:text-gold">1. Cours</p>
          <h3 className="mt-1 text-2xl font-heading font-bold text-slate-950 dark:text-white">{lesson.title}</h3>
          <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-600 dark:text-slate-300">{lesson.intention}</p>
        </div>
        <div className="flex flex-wrap gap-2 lg:justify-end">
          <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-emerald-900 dark:bg-slate-950 dark:text-gold">
            {lesson.level}
          </span>
          <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-emerald-900 dark:bg-slate-950 dark:text-gold">
            {lesson.duration}
          </span>
          <span className="rounded-full bg-gold/20 px-3 py-1 text-xs font-bold text-amber-900 dark:text-gold">
            Cours d'abord
          </span>
        </div>
      </div>

      <div className="mt-5 rounded-[1.25rem] border border-emerald-900/10 bg-white p-4 dark:border-white/10 dark:bg-slate-950 sm:p-5">
        <h4 className="flex items-center gap-2 text-lg font-bold text-slate-950 dark:text-white">
          <BookOpen className="h-5 w-5 text-emerald-800 dark:text-gold" />
          Cours du module
        </h4>
        <div className="mt-4 space-y-3">
          {lesson.lesson.map((item, index) => (
            <p key={item} className="rounded-2xl bg-ivory p-4 text-sm leading-7 text-slate-700 dark:bg-white/[0.04] dark:text-slate-200">
              <strong className="mr-2 text-emerald-800 dark:text-gold">{index + 1}.</strong>
              {item}
            </p>
          ))}
        </div>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <article className="rounded-[1.25rem] border border-emerald-900/10 bg-white p-4 dark:border-white/10 dark:bg-slate-950">
          <h4 className="flex items-center gap-2 font-bold text-slate-950 dark:text-white">
            <GraduationCap className="h-4 w-4 text-emerald-800 dark:text-gold" />
            Exercices liés au cours
          </h4>
          <div className="mt-3 space-y-2">
            {lesson.practice.map((item) => (
              <p key={item} className="flex gap-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                <CheckCircle2 className="mt-1 h-3.5 w-3.5 shrink-0 text-emerald-700 dark:text-gold" />
                {item}
              </p>
            ))}
          </div>
        </article>
        <article className="rounded-[1.25rem] border border-emerald-900/10 bg-white p-4 dark:border-white/10 dark:bg-slate-950">
          <h4 className="flex items-center gap-2 font-bold text-slate-950 dark:text-white">
            <ShieldCheck className="h-4 w-4 text-emerald-800 dark:text-gold" />
            Erreurs à éviter
          </h4>
          <div className="mt-3 space-y-2">
            {lesson.commonMistakes.map((item) => (
              <p key={item} className="flex gap-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                <XCircle className="mt-1 h-3.5 w-3.5 shrink-0 text-red-600 dark:text-red-300" />
                {item}
              </p>
            ))}
          </div>
        </article>
      </div>

      <p className="mt-4 rounded-2xl border border-gold/25 bg-gold/10 p-4 text-sm leading-6 text-slate-700 dark:text-slate-200">
        <strong>Validation :</strong> {lesson.validation}
      </p>
    </section>
  );
}

function ConceptPanel({ title, cards }: { title: string; cards: ArabicPracticeCard[] }) {
  return (
    <div className="space-y-4">
      <h3 className="flex items-center gap-2 text-xl font-semibold">
        <ShieldCheck className="h-5 w-5 text-emerald-800 dark:text-gold" />
        {title}
      </h3>
      <div className="grid gap-4 md:grid-cols-2">
        {cards.map((card) => (
          <article key={card.title} className="rounded-[1.5rem] border border-emerald-900/10 bg-ivory/70 p-5 dark:border-white/10 dark:bg-white/[0.04]">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h4 className="text-lg font-bold text-slate-950 dark:text-white">{card.title}</h4>
                <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{card.description}</p>
              </div>
              {card.arabic && <p className="arabic-reading text-right text-3xl text-emerald-950 dark:text-white" dir="rtl">{card.arabic}</p>}
            </div>
            {card.examples && (
              <div className="mt-4 flex flex-wrap gap-2">
                {card.examples.map((example) => (
                  <button
                    key={example}
                    type="button"
                    onClick={() => void playArabicText(example, { rate: 0.76 })}
                    className="rounded-2xl border border-emerald-900/10 bg-white px-4 py-3 text-lg font-semibold text-emerald-950 transition hover:border-gold dark:border-white/10 dark:bg-slate-950 dark:text-gold"
                    dir="rtl"
                  >
                    {example}
                  </button>
                ))}
              </div>
            )}
          </article>
        ))}
      </div>
    </div>
  );
}

function PracticeGrid({ title, items, guidance, large = false }: { title: string; items: PracticeItem[]; guidance: string; large?: boolean }) {
  const play = async (text: string) => {
    const played = await playArabicText(text, { rate: large ? 0.74 : 0.8 });
    if (!played) toast.error("Lecture audio indisponible. Vérifiez le son de l'appareil.");
  };

  return (
    <div>
      <div className="mb-4 rounded-3xl border border-emerald-900/10 bg-emerald-50/70 p-4 dark:border-emerald-800/50 dark:bg-emerald-950/20">
        <h3 className="flex items-center gap-2 text-xl font-semibold">
          {large ? <BookOpen className="h-5 w-5 text-emerald-800 dark:text-gold" /> : <Layers className="h-5 w-5 text-emerald-800 dark:text-gold" />}
          {title}
        </h3>
        <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{guidance}</p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <button
            key={item.arabic}
            onClick={() => void play(item.arabic)}
            className="group rounded-3xl border border-emerald-900/10 bg-ivory/70 p-5 text-center transition hover:border-gold/50 dark:border-white/10 dark:bg-white/[0.04]"
          >
            <p className={`arabic-reading text-4xl text-slate-950 dark:text-white ${large ? "sm:text-5xl" : ""}`} dir="rtl">{item.arabic}</p>
            {item.title && <p className="mt-3 font-semibold text-slate-800 dark:text-slate-100">{item.title}</p>}
            {item.note && <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">{item.note}</p>}
            <span className="mt-4 inline-flex items-center gap-2 rounded-full bg-white px-3 py-2 text-xs font-semibold text-emerald-900 shadow-sm dark:bg-slate-950 dark:text-gold">
              <Volume2 className="h-3.5 w-3.5" />
              Écouter
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

function GuidedReadingPanel() {
  return (
    <div className="space-y-5">
      <div className="grid gap-4 md:grid-cols-4">
        {[
          { title: "1. Écouter", text: "Écouter le segment sans parler." },
          { title: "2. Répéter", text: "Répéter lentement trois fois." },
          { title: "3. Cacher", text: "Cacher le texte et essayer seul." },
          { title: "4. Corriger", text: "Relire avec le texte et noter l'erreur." },
        ].map((step) => (
          <div key={step.title} className="rounded-3xl border border-emerald-900/10 bg-white p-4 dark:border-white/10 dark:bg-slate-950">
            <p className="font-bold text-emerald-900 dark:text-gold">{step.title}</p>
            <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{step.text}</p>
          </div>
        ))}
      </div>
      <PracticeGrid title="Lecture accompagnée" items={guidedReading} large guidance="Travaillez un seul segment à la fois. La précision passe avant la vitesse." />
    </div>
  );
}

function RevisionPanel() {
  return (
    <div className="grid gap-5 lg:grid-cols-[0.85fr_1.15fr]">
      <div className="rounded-[1.5rem] border border-emerald-900/10 bg-white p-5 dark:border-white/10 dark:bg-slate-950">
        <h3 className="flex items-center gap-2 text-xl font-bold">
          <Target className="h-5 w-5 text-emerald-800 dark:text-gold" />
          Liste de validation
        </h3>
        <div className="mt-4 space-y-3">
          {revisionChecklist.map((item) => (
            <p key={item} className="flex gap-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-700 dark:text-gold" />
              {item}
            </p>
          ))}
        </div>
      </div>
      <div className="rounded-[1.5rem] border border-gold/30 bg-gold/10 p-5 dark:bg-gold/10">
        <h3 className="flex items-center gap-2 text-xl font-bold text-slate-950 dark:text-white">
          <Sparkles className="h-5 w-5 text-gold" />
          Passage recommandé
        </h3>
        <p className="mt-3 text-sm leading-7 text-slate-700 dark:text-slate-200">
          Après cette étape, l'apprenant peut travailler la lecture du Coran avec des passages très courts, un audio modèle, une répétition espacée et une correction auprès d'une personne qualifiée quand c'est possible.
        </p>
        <p className="mt-4 rounded-2xl bg-white p-4 text-sm leading-6 text-slate-600 dark:bg-slate-950 dark:text-slate-300">
          Cette validation interne est pédagogique. Elle ne remplace pas une ijaza ni l'accompagnement d'un enseignant qualifié.
        </p>
      </div>
    </div>
  );
}

function ModuleCheckpoint({
  module,
  userId,
  lettersLearnedCount,
  savedScore,
  onPassed,
}: {
  module: ArabicModule;
  userId?: string;
  lettersLearnedCount: number;
  savedScore?: ModuleScore;
  onPassed: (moduleId: ArabicModuleId, score: ModuleScore) => void;
}) {
  const [sessionSeed, setSessionSeed] = useState(() => Date.now());
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [excludedIds, setExcludedIds] = useState<number[]>([]);
  const [excludedSignatures, setExcludedSignatures] = useState<string[]>([]);

  const questions = useMemo(
    () =>
      getQuestionBatch({
        seed: `module-checkpoint-${module.id}-${sessionSeed}`,
        count: 5,
        categories: module.checkpointCategories,
        excludeIds: excludedIds,
        excludeSignatures: excludedSignatures,
      }),
    [excludedIds, excludedSignatures, module.checkpointCategories, module.id, sessionSeed]
  );

  const score = questions.reduce((total, question) => total + (answers[question.id] === question.answer ? 1 : 0), 0);
  const percent = Math.round((score / Math.max(questions.length, 1)) * 100);
  const currentQuestion = questions[currentIndex];
  const selectedAnswer = currentQuestion ? answers[currentQuestion.id] : undefined;
  const passed = percent >= module.passScore;

  useEffect(() => {
    setExcludedIds(getSeenQuestionIds());
    setExcludedSignatures(getSeenQuestionSignatures());
  }, []);

  useEffect(() => {
    if (module.id !== "alphabet") recordQuestionBatchSeen(questions);
  }, [module.id, questions]);

  const reset = () => {
    setExcludedIds(getSeenQuestionIds());
    setExcludedSignatures(getSeenQuestionSignatures());
    setSessionSeed(Date.now());
    setCurrentIndex(0);
    setAnswers({});
    setSubmitted(false);
  };

  const saveCheckpoint = async (finalAnswers: Record<number, string>) => {
    const finalScore = questions.reduce((total, question) => total + (finalAnswers[question.id] === question.answer ? 1 : 0), 0);
    const finalPercent = Math.round((finalScore / Math.max(questions.length, 1)) * 100);
    const scoreData: ModuleScore = {
      score: finalScore,
      total: questions.length,
      percent: finalPercent,
      passed: finalPercent >= module.passScore,
      completedAt: new Date().toISOString(),
    };

    onPassed(module.id, scoreData);

    if (!userId) {
      toast.info("Connectez-vous pour sauvegarder ce résultat.");
      return;
    }

    try {
      await setDoc(
        doc(db, "progress", userId),
        {
          arabic: {
            moduleScores: {
              [module.id]: scoreData,
            },
          },
          activityHistory: arrayUnion({
            type: "arabic-checkpoint",
            label: `Mini-test ${module.label} : ${finalScore}/${questions.length}`,
            createdAt: scoreData.completedAt,
          }),
        },
        { merge: true }
      );
      if (scoreData.passed) toast.success("Mini-test réussi. Vous pouvez valider le module.");
      else toast.error(`Score insuffisant : ${finalPercent}%. Reprenez la leçon puis recommencez.`);
    } catch {
      toast.error("Impossible de sauvegarder le mini-test.");
    }
  };

  const handleAnswer = (answer: string) => {
    if (!currentQuestion || selectedAnswer || submitted) return;

    const nextAnswers = { ...answers, [currentQuestion.id]: answer };
    setAnswers(nextAnswers);
    recordQuestionResult(currentQuestion, answer, "module-checkpoint");

    if (currentIndex < questions.length - 1) {
      window.setTimeout(() => setCurrentIndex((index) => index + 1), 650);
      return;
    }

    window.setTimeout(() => {
      setSubmitted(true);
      void saveCheckpoint(nextAnswers);
    }, 650);
  };

  if (module.id === "alphabet") {
    const alphabetPercent = Math.round((lettersLearnedCount / ARABIC_LETTERS.length) * 100);
    return (
      <div className="rounded-[1.5rem] border border-emerald-900/10 bg-white p-5 dark:border-white/10 dark:bg-slate-950">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="flex items-center gap-2 text-xl font-bold">
              <ListChecks className="h-5 w-5 text-emerald-800 dark:text-gold" />
              Validation du module
            </h3>
            <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
              Terminez les 28 lettres. La suite restera verrouillée tant que l'alphabet n'est pas complet.
            </p>
          </div>
          <span className="rounded-full bg-emerald-100 px-4 py-2 text-sm font-bold text-emerald-900 dark:bg-emerald-950/60 dark:text-emerald-100">
            {lettersLearnedCount}/{ARABIC_LETTERS.length}
          </span>
        </div>
        <div className="mt-4 h-3 rounded-full bg-emerald-100 dark:bg-emerald-950/50">
          <div className="h-full rounded-full bg-gradient-to-r from-emerald-700 to-gold transition-all" style={{ width: `${alphabetPercent}%` }} />
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-[1.5rem] border border-emerald-900/10 bg-white p-5 dark:border-white/10 dark:bg-slate-950">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h3 className="flex items-center gap-2 text-xl font-bold">
            <ListChecks className="h-5 w-5 text-emerald-800 dark:text-gold" />
            Mini-test de validation
          </h3>
          <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
            Score requis : {module.passScore}%. Le bouton de validation reste bloqué tant que ce test n'est pas réussi.
          </p>
        </div>
        {savedScore && (
          <span className={`rounded-full px-4 py-2 text-sm font-bold ${savedScore.passed ? "bg-emerald-100 text-emerald-900 dark:bg-emerald-950/60 dark:text-emerald-100" : "bg-red-100 text-red-900 dark:bg-red-950/50 dark:text-red-100"}`}>
            Dernier score : {savedScore.percent}%
          </span>
        )}
      </div>

      {submitted ? (
        <div className={`mt-5 rounded-2xl border p-5 text-center ${passed ? "border-emerald-200 bg-emerald-50 text-emerald-950 dark:border-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-100" : "border-red-200 bg-red-50 text-red-950 dark:border-red-900 dark:bg-red-950/30 dark:text-red-100"}`}>
          {passed ? <CheckCircle2 className="mx-auto h-10 w-10" /> : <XCircle className="mx-auto h-10 w-10" />}
          <h4 className="mt-3 text-lg font-bold">{score}/{questions.length} bonnes réponses</h4>
          <p className="mt-2 text-sm leading-6">
            {passed ? "Mini-test réussi. Vous pouvez maintenant valider le module." : "Reprenez la leçon, écoutez les exemples, puis refaites le mini-test."}
          </p>
          <Button variant="outline" onClick={reset} className="mt-4 min-h-11">
            <RefreshCw className="mr-2 h-4 w-4" />
            Refaire le test
          </Button>
        </div>
      ) : (
        <div className="mt-5 rounded-2xl border border-emerald-900/10 bg-ivory/70 p-4 dark:border-white/10 dark:bg-white/[0.04]">
          <div className="flex items-center justify-between gap-3 text-sm text-slate-500 dark:text-slate-400">
            <span>Question {currentIndex + 1}/{questions.length}</span>
            <span>Score actuel : {score}</span>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-900 dark:bg-emerald-950 dark:text-emerald-100">
              {QUESTION_CATEGORY_LABELS[currentQuestion.category]}
            </span>
            <span className="rounded-full bg-gold/15 px-3 py-1 text-xs font-bold text-amber-900 dark:text-gold">
              {currentQuestion.level}
            </span>
          </div>
          <p className="mt-4 font-semibold leading-7">{currentQuestion.question}</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {currentQuestion.options.map((option) => {
              const chosen = selectedAnswer === option;
              const correct = option === currentQuestion.answer;
              const optionClass = selectedAnswer
                ? correct
                  ? "border-emerald-600 bg-emerald-50 text-emerald-950 hover:bg-emerald-50 dark:bg-emerald-950/40 dark:text-emerald-100"
                  : chosen
                    ? "border-red-500 bg-red-50 text-red-950 hover:bg-red-50 dark:bg-red-950/40 dark:text-red-100"
                    : "opacity-55"
                : "";
              return (
                <Button
                  key={option}
                  variant="outline"
                  onClick={() => handleAnswer(option)}
                  disabled={Boolean(selectedAnswer)}
                  className={`min-h-12 justify-start whitespace-normal text-left ${optionClass}`}
                >
                  {selectedAnswer && correct && <CheckCircle2 className="mr-2 h-4 w-4 shrink-0 text-emerald-700" />}
                  {selectedAnswer && chosen && !correct && <XCircle className="mr-2 h-4 w-4 shrink-0 text-red-700" />}
                  {option}
                </Button>
              );
            })}
          </div>
          {selectedAnswer && (
            <div className={`mt-4 rounded-2xl border p-4 text-sm leading-6 ${selectedAnswer === currentQuestion.answer ? "border-emerald-200 bg-emerald-50 text-emerald-950 dark:border-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-100" : "border-red-200 bg-red-50 text-red-950 dark:border-red-900 dark:bg-red-950/30 dark:text-red-100"}`}>
              <strong>{selectedAnswer === currentQuestion.answer ? "Bonne réponse." : `Réponse correcte : ${currentQuestion.answer}`}</strong> {currentQuestion.explanation}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function PlacementTest({ onComplete }: { onComplete: (score: number) => void }) {
  const [score, setScore] = useState(0);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [sessionSeed] = useState(() => `placement-${Date.now()}-${Math.random()}`);
  const [excludedIds, setExcludedIds] = useState<number[]>([]);
  const [excludedSignatures, setExcludedSignatures] = useState<string[]>([]);
  const questions = useMemo(
    () =>
      getQuestionBatch({
        seed: sessionSeed,
        count: 8,
        categories: ["arabic_letters", "arabic_vowels", "arabic_syllables", "arabic_words", "tajwid", "quran_basics"],
        excludeIds: excludedIds,
        excludeSignatures: excludedSignatures,
      }),
    [excludedIds, excludedSignatures, sessionSeed]
  );

  useEffect(() => {
    setExcludedIds(getSeenQuestionIds());
    setExcludedSignatures(getSeenQuestionSignatures());
  }, []);

  useEffect(() => {
    recordQuestionBatchSeen(questions);
  }, [questions]);

  const handleAnswer = (choice: string) => {
    recordQuestionResult(questions[currentIdx], choice, "placement");
    const newScore = score + (choice === questions[currentIdx].answer ? 5 : 0);
    setScore(newScore);
    if (currentIdx < questions.length - 1) {
      setCurrentIdx((index) => index + 1);
    } else {
      onComplete(newScore);
    }
  };

  return (
    <Card className="border-emerald-900/10 dark:border-white/10">
      <CardContent className="space-y-4 p-5">
        <h3 className="flex items-center gap-2 text-xl font-bold">
          <GraduationCap className="h-5 w-5 text-emerald-800 dark:text-gold" />
          Test de placement
        </h3>
        <p className="text-sm text-slate-500">Question {currentIdx + 1}/{questions.length}</p>
        <div className="flex flex-wrap gap-2">
          <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-900 dark:bg-emerald-950 dark:text-emerald-100">
            {QUESTION_CATEGORY_LABELS[questions[currentIdx].category]}
          </span>
          <span className="rounded-full bg-gold/15 px-3 py-1 text-xs font-bold text-amber-900 dark:text-gold">
            {questions[currentIdx].level}
          </span>
        </div>
        <p className="font-semibold leading-7">{questions[currentIdx].question}</p>
        <div className="grid gap-2 sm:grid-cols-2">
          {questions[currentIdx].options.map((option) => (
            <Button key={option} variant="outline" className="min-h-12" onClick={() => handleAnswer(option)}>
              {option}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
