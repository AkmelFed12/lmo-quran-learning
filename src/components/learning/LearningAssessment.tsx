"use client";

import { useEffect, useMemo, useState } from "react";
import { doc, increment, setDoc } from "firebase/firestore";
import { CheckCircle2, ClipboardCheck, RefreshCw, Target, XCircle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { db } from "@/lib/firebase";
import { useAuth } from "@/lib/hooks/useAuth";
import {
  getQuestionResults,
  getSeenQuestionIds,
  getSeenQuestionSignatures,
  recordQuestionBatchSeen,
  recordQuestionResult,
} from "@/lib/question-history";
import {
  LEARNING_MODULES,
  QUESTION_BANK_SIZE,
  QUESTION_CATEGORY_LABELS,
  type LearningQuestion,
  getQuestionBatch,
} from "@/lib/question-bank";

const questionCounts = [10, 20, 40] as const;
const difficulties = [
  { label: "Tous niveaux", value: 0 },
  { label: "Débutant", value: 1 },
  { label: "Intermédiaire", value: 3 },
  { label: "Avancé", value: 5 },
] as const;

function getScoreMessage(score: number, total: number) {
  const ratio = total === 0 ? 0 : score / total;
  if (ratio >= 0.85) return "Très solide. Vous pouvez passer au module suivant avec confiance.";
  if (ratio >= 0.6) return "Bon socle. Continuez avec une petite révision ciblée.";
  return "Reprenez doucement les bases du module, puis relancez un test court.";
}

export default function LearningAssessment() {
  const { user } = useAuth();
  const [moduleId, setModuleId] = useState<(typeof LEARNING_MODULES)[number]["id"]>("diagnostic");
  const [questionCount, setQuestionCount] = useState<(typeof questionCounts)[number]>(20);
  const [difficulty, setDifficulty] = useState(0);
  const [targetedMode, setTargetedMode] = useState(true);
  const [targetedLevel, setTargetedLevel] = useState(2);
  const [sessionSeed, setSessionSeed] = useState(() => Date.now());
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [savedSession, setSavedSession] = useState(false);
  const [excludedIds, setExcludedIds] = useState<number[]>([]);
  const [excludedSignatures, setExcludedSignatures] = useState<string[]>([]);

  const activeModule = LEARNING_MODULES.find((module) => module.id === moduleId) || LEARNING_MODULES[0];
  const effectiveDifficulty = targetedMode ? targetedLevel : difficulty || undefined;
  const questions = useMemo(
    () =>
      getQuestionBatch({
        seed: `learning-lab-${moduleId}-${questionCount}-${effectiveDifficulty || "mixed"}-${sessionSeed}`,
        count: questionCount,
        categories: [...activeModule.categories],
        difficulty: effectiveDifficulty || undefined,
        excludeIds: excludedIds,
        excludeSignatures: excludedSignatures,
      }),
    [activeModule.categories, effectiveDifficulty, excludedIds, excludedSignatures, moduleId, questionCount, sessionSeed]
  );

  const currentQuestion = questions[currentIndex];
  const score = questions.reduce(
    (total, question) => total + (answers[question.id] === question.answer ? 1 : 0),
    0
  );
  const answeredCount = Object.keys(answers).length;
  const progress = submitted ? 100 : Math.round((answeredCount / questions.length) * 100);

  useEffect(() => {
    setExcludedIds(getSeenQuestionIds());
    setExcludedSignatures(getSeenQuestionSignatures());
  }, []);

  useEffect(() => {
    recordQuestionBatchSeen(questions);
  }, [questions]);

  useEffect(() => {
    if (!submitted || savedSession || !user) return;

    const saveSession = async () => {
      const now = new Date().toISOString();
      const recentResults = getQuestionResults(questionCount);

      try {
        await setDoc(
          doc(db, "users", user.uid, "learningSessions", `${moduleId}-${sessionSeed}`),
          {
            moduleId,
            moduleTitle: activeModule.title,
            score,
            total: questions.length,
            difficulty: targetedMode ? `cible-${targetedLevel}` : difficulty || "mixed",
            targetedMode,
            finalTargetedLevel: targetedLevel,
            completedAt: now,
            answers: recentResults
              .filter((result) => questions.some((question) => question.id === result.id))
              .map((result) => ({
                id: result.id,
                category: result.category,
                correct: result.correct,
                selectedAnswer: result.selectedAnswer,
                answer: result.answer,
              })),
          },
          { merge: true }
        );

        await setDoc(
          doc(db, "progress", user.uid),
          {
            learning: {
              lastAssessmentAt: now,
              lastAssessmentModule: activeModule.title,
              lastAssessmentScore: score,
              lastAssessmentTotal: questions.length,
            },
            stats: {
              xp: increment(score * 5),
            },
          },
          { merge: true }
        );
        setSavedSession(true);
      } catch {
        toast.error("Bilan calculé, mais synchronisation cloud indisponible.");
      }
    };

    void saveSession();
  }, [activeModule.title, difficulty, moduleId, questionCount, questions, savedSession, score, sessionSeed, submitted, targetedLevel, targetedMode, user]);

  const resetSession = () => {
    setExcludedIds(getSeenQuestionIds());
    setExcludedSignatures(getSeenQuestionSignatures());
    setSessionSeed(Date.now());
    setCurrentIndex(0);
    setAnswers({});
    setSubmitted(false);
    setSavedSession(false);
    setTargetedLevel(difficulty || 2);
  };

  const handleAnswer = (question: LearningQuestion, option: string) => {
    if (answers[question.id] || submitted) return;
    const nextAnswers = { ...answers, [question.id]: option };
    const isCorrect = option === question.answer;
    setAnswers(nextAnswers);
    recordQuestionResult(question, option, "learning-lab");
    if (targetedMode) {
      setTargetedLevel((level) => Math.min(5, Math.max(1, level + (isCorrect ? 1 : -1))));
    }

    if (currentIndex < questions.length - 1) {
      window.setTimeout(() => setCurrentIndex((index) => index + 1), 1050);
    } else {
      window.setTimeout(() => setSubmitted(true), 1050);
    }
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <header className="card-premium overflow-hidden p-5 sm:p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.22em] text-gold">Exercices & tests</p>
            <h1 className="mt-2 text-3xl font-heading font-bold text-slate-950 dark:text-white sm:text-4xl">
              Exercices de révision
            </h1>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600 dark:text-slate-300">
              Des questions variées, une correction claire et une sélection qui évite de vous reproposer trop vite les mêmes exercices. Plus de {QUESTION_BANK_SIZE.toLocaleString("fr-FR")} questions sont disponibles.
            </p>
          </div>
          <div className="rounded-[1.5rem] border border-emerald-900/10 bg-white/80 p-4 text-sm shadow-sm dark:border-white/10 dark:bg-white/[0.04]">
            <p className="font-semibold text-slate-950 dark:text-white">Mode actuel</p>
            <p className="mt-1 text-slate-500 dark:text-slate-400">
              {activeModule.title} · {questionCount} questions · {targetedMode ? `mode ciblé niveau ${targetedLevel}` : "niveau fixe"}
            </p>
          </div>
        </div>
      </header>

      <section className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-emerald-800 dark:text-gold" />
              Choisir un module
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
              {LEARNING_MODULES.map((module) => (
                <button
                  key={module.id}
                  onClick={() => {
                    setModuleId(module.id);
                    resetSession();
                  }}
                  className={`rounded-3xl border p-4 text-left transition ${
                    moduleId === module.id
                      ? "border-emerald-800 bg-emerald-950 text-white shadow-lg shadow-emerald-950/10"
                      : "border-emerald-900/10 bg-white hover:border-gold/60 dark:border-white/10 dark:bg-slate-950"
                  }`}
                >
                  <p className="font-semibold">{module.title}</p>
                  <p className={`mt-1 text-sm leading-6 ${moduleId === module.id ? "text-emerald-50/75" : "text-slate-500 dark:text-slate-400"}`}>
                    {module.description}
                  </p>
                </button>
              ))}
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <p className="mb-2 text-sm font-semibold">Nombre de questions</p>
                <div className="flex flex-wrap gap-2">
                  {questionCounts.map((count) => (
                    <button
                      key={count}
                      onClick={() => {
                        setQuestionCount(count);
                        resetSession();
                      }}
                      className={`rounded-full border px-4 py-2 text-sm font-bold ${
                        questionCount === count
                          ? "border-gold bg-gold text-slate-950"
                          : "border-emerald-900/10 bg-white dark:border-white/10 dark:bg-slate-950"
                      }`}
                    >
                      {count}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="mb-2 text-sm font-semibold">Difficulté</p>
                <select
                  value={difficulty}
                  disabled={targetedMode}
                  onChange={(event) => {
                    setDifficulty(Number(event.target.value));
                    resetSession();
                  }}
                  className="min-h-11 w-full rounded-2xl border border-emerald-900/10 bg-white px-3 text-sm outline-none focus:border-gold dark:border-white/10 dark:bg-slate-950"
                >
                  {difficulties.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                setTargetedMode((value) => !value);
                resetSession();
              }}
              className={`flex items-start gap-3 rounded-2xl border p-4 text-left transition ${
                targetedMode
                  ? "border-emerald-700 bg-emerald-50 text-emerald-950 dark:bg-emerald-950/40 dark:text-emerald-100"
                  : "border-slate-200 dark:border-slate-800"
              }`}
            >
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />
              <span>
                <span className="block font-semibold">Mode ciblé</span>
                <span className="mt-1 block text-sm leading-6 opacity-80">
                  La difficulté monte après une bonne réponse et redescend après une erreur.
                </span>
              </span>
            </button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="border-b border-emerald-900/10 dark:border-white/10">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <CardTitle className="flex items-center gap-2">
                <ClipboardCheck className="h-5 w-5 text-emerald-800 dark:text-gold" />
                Session d'évaluation
              </CardTitle>
              <Button variant="outline" onClick={resetSession}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Nouvelle session
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-5 p-5">
            <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
              <span>{answeredCount}/{questions.length} réponse(s)</span>
              <span>Score actuel : {score}</span>
            </div>
            <div className="h-2 rounded-full bg-emerald-100 dark:bg-emerald-950/50">
              <div className="h-full rounded-full bg-gradient-to-r from-emerald-700 to-gold transition-all" style={{ width: `${progress}%` }} />
            </div>

            {submitted ? (
              <div className="rounded-[1.5rem] bg-ivory p-5 text-center dark:bg-white/[0.04]">
                <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-700 dark:text-gold" />
                <h2 className="mt-3 text-2xl font-bold">Résultat : {score} / {questions.length}</h2>
                <p className="mx-auto mt-2 max-w-xl text-sm leading-7 text-slate-600 dark:text-slate-300">
                  {getScoreMessage(score, questions.length)}
                </p>
                <Button onClick={resetSession} className="mt-5 min-h-11">
                  Refaire avec de nouvelles questions
                </Button>
              </div>
            ) : (
              <div className="rounded-[1.5rem] border border-emerald-900/10 bg-white p-5 dark:border-white/10 dark:bg-slate-950">
                <div className="mb-4 flex flex-wrap gap-2">
                  <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-900 dark:bg-emerald-950 dark:text-emerald-100">
                    {QUESTION_CATEGORY_LABELS[currentQuestion.category]}
                  </span>
                  <span className="rounded-full bg-gold/15 px-3 py-1 text-xs font-bold text-amber-900 dark:text-gold">
                    {currentQuestion.level}
                  </span>
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400">Question {currentIndex + 1}/{questions.length}</p>
                <h3 className="mt-3 text-lg font-semibold leading-8">{currentQuestion.question}</h3>
                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  {currentQuestion.options.map((option) => {
                    const selectedAnswer = answers[currentQuestion.id];
                    const selected = selectedAnswer === option;
                    const correct = option === currentQuestion.answer;
                    const answered = Boolean(selectedAnswer);
                    const optionClass = answered
                      ? correct
                        ? "border-emerald-600 bg-emerald-50 text-emerald-950 hover:bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-100"
                        : selected
                          ? "border-red-500 bg-red-50 text-red-950 hover:bg-red-50 dark:border-red-800 dark:bg-red-950/40 dark:text-red-100"
                          : "opacity-55"
                      : "";
                    return (
                      <Button
                        key={option}
                        variant="outline"
                        onClick={() => handleAnswer(currentQuestion, option)}
                        disabled={answered}
                        className={`min-h-12 justify-start whitespace-normal text-left ${optionClass}`}
                      >
                        {answered && correct && <CheckCircle2 className="mr-2 h-4 w-4 shrink-0 text-emerald-700 dark:text-emerald-200" />}
                        {answered && selected && !correct && <XCircle className="mr-2 h-4 w-4 shrink-0 text-red-700 dark:text-red-200" />}
                        {option}
                      </Button>
                    );
                  })}
                </div>
                {answers[currentQuestion.id] && (
                  <div
                    className={`mt-5 rounded-2xl border p-4 text-sm leading-6 ${
                      answers[currentQuestion.id] === currentQuestion.answer
                        ? "border-emerald-200 bg-emerald-50 text-emerald-950 dark:border-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-100"
                        : "border-red-200 bg-red-50 text-red-950 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-100"
                    }`}
                  >
                    <strong>{answers[currentQuestion.id] === currentQuestion.answer ? "Bonne réponse." : `Réponse correcte : ${currentQuestion.answer}`}</strong> {currentQuestion.explanation}
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {Object.entries(QUESTION_CATEGORY_LABELS).map(([categoryKey, label]) => (
          <div key={categoryKey} className="rounded-[1.5rem] border border-emerald-900/10 bg-white p-4 dark:border-white/10 dark:bg-slate-900">
            <p className="text-sm font-bold text-slate-950 dark:text-white">{label}</p>
            <p className="mt-2 text-xs leading-5 text-slate-500 dark:text-slate-400">
              Questions sélectionnées avec suivi des réponses, correction pédagogique et rotation anti-répétition.
            </p>
          </div>
        ))}
      </section>
    </div>
  );
}
