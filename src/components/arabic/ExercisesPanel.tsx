"use client";

import { useEffect, useMemo, useState } from "react";
import { doc, increment, setDoc } from "firebase/firestore";
import { CheckCircle2, RefreshCw, Sparkles, XCircle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { db } from "@/lib/firebase";
import { useAuth } from "@/lib/hooks/useAuth";
import {
  getSeenQuestionIds,
  getSeenQuestionSignatures,
  recordQuestionBatchSeen,
  recordQuestionResult,
} from "@/lib/question-history";
import {
  QUESTION_CATEGORY_LABELS,
  type QuestionCategory,
  getQuestionBatch,
} from "@/lib/question-bank";

const exerciseCategories: QuestionCategory[] = [
  "arabic_letters",
  "arabic_vowels",
  "arabic_syllables",
  "arabic_words",
  "tajwid",
  "quran_basics",
  "memorization",
];

type ExercisesPanelProps = {
  allowedCategories?: QuestionCategory[];
  description?: string;
  title?: string;
};

export default function ExercisesPanel({
  allowedCategories,
  description = "Série courte, corrigée immédiatement, avec rotation des questions déjà vues.",
  title = "Exercices progressifs",
}: ExercisesPanelProps) {
  const { user } = useAuth();
  const [sessionSeed, setSessionSeed] = useState(() => Date.now());
  const [category, setCategory] = useState<QuestionCategory>("arabic_letters");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState<Record<number, string>>({});
  const [excludedIds, setExcludedIds] = useState<number[]>([]);
  const [excludedSignatures, setExcludedSignatures] = useState<string[]>([]);
  const availableCategories = useMemo(() => {
    const allowed = allowedCategories?.length ? new Set(allowedCategories) : null;
    const categories = allowed ? exerciseCategories.filter((item) => allowed.has(item)) : exerciseCategories;
    return categories.length > 0 ? categories : (["arabic_letters"] satisfies QuestionCategory[]);
  }, [allowedCategories]);

  const questions = useMemo(
    () =>
      getQuestionBatch({
        seed: `exercise-${category}-${sessionSeed}`,
        count: 12,
        category,
        excludeIds: excludedIds,
        excludeSignatures: excludedSignatures,
      }),
    [category, excludedIds, excludedSignatures, sessionSeed]
  );

  const currentQuestion = questions[currentIndex];
  const progress = Math.round(((currentIndex + 1) / questions.length) * 100);
  const selectedAnswer = currentQuestion ? answered[currentQuestion.id] : undefined;
  const isFinished = currentIndex >= questions.length;

  useEffect(() => {
    setExcludedIds(getSeenQuestionIds());
    setExcludedSignatures(getSeenQuestionSignatures());
  }, []);

  useEffect(() => {
    if (!availableCategories.includes(category)) {
      setCategory(availableCategories[0]);
      setCurrentIndex(0);
      setScore(0);
      setAnswered({});
    }
  }, [availableCategories, category]);

  useEffect(() => {
    recordQuestionBatchSeen(questions);
  }, [questions]);

  const startNewSession = () => {
    setExcludedIds(getSeenQuestionIds());
    setExcludedSignatures(getSeenQuestionSignatures());
    setSessionSeed(Date.now());
    setCurrentIndex(0);
    setScore(0);
    setAnswered({});
  };

  const handleAnswer = (answer: string) => {
    if (!currentQuestion || selectedAnswer) return;

    const isCorrect = answer === currentQuestion.answer;
    setAnswered((previous) => ({ ...previous, [currentQuestion.id]: answer }));
    recordQuestionResult(currentQuestion, answer, "exercise");
    if (isCorrect) {
      setScore((previous) => previous + 1);
      toast.success("Bonne réponse.");
    } else {
      toast.error(`Réponse correcte : ${currentQuestion.answer}`);
    }

    window.setTimeout(() => {
      setCurrentIndex((previous) => previous + 1);
    }, 550);
  };

  const saveScore = async () => {
    if (!user) {
      toast.info("Connectez-vous pour sauvegarder vos résultats.");
      return;
    }

    try {
      await setDoc(
        doc(db, "progress", user.uid),
        {
          "arabic.quizzesPassed": increment(score),
          "arabic.lastExerciseScore": score,
          "arabic.lastExerciseTotal": questions.length,
        },
        { merge: true }
      );
      toast.success("Résultat sauvegardé.");
      startNewSession();
    } catch {
      toast.error("Impossible de sauvegarder pour le moment.");
    }
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="border-b border-emerald-900/10 bg-ivory/60 dark:border-white/10 dark:bg-white/[0.03]">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-gold" />
              {title}
            </CardTitle>
            <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
              {description}
            </p>
          </div>
          <Button variant="outline" onClick={startNewSession} className="min-h-11">
            <RefreshCw className="mr-2 h-4 w-4" />
            Nouvelle série
          </Button>
        </div>

        <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
          {availableCategories.map((item) => (
            <button
              key={item}
              onClick={() => {
                setCategory(item);
                startNewSession();
              }}
              className={`whitespace-nowrap rounded-full border px-4 py-2 text-sm font-semibold transition ${
                category === item
                  ? "border-emerald-800 bg-emerald-900 text-white dark:border-gold dark:bg-gold dark:text-slate-950"
                  : "border-emerald-900/10 bg-white text-slate-600 hover:border-gold/60 dark:border-white/10 dark:bg-slate-950 dark:text-slate-300"
              }`}
            >
              {QUESTION_CATEGORY_LABELS[item]}
            </button>
          ))}
        </div>
      </CardHeader>

      <CardContent className="space-y-5 p-5">
        <div className="flex items-center justify-between gap-3 text-sm text-slate-500 dark:text-slate-400">
          <span>
            Score : <strong className="text-emerald-800 dark:text-gold">{score}</strong> / {questions.length}
          </span>
          <span>Question {Math.min(currentIndex + 1, questions.length)} / {questions.length}</span>
        </div>
        <div className="h-2 rounded-full bg-emerald-100 dark:bg-emerald-950/50">
          <div className="h-full rounded-full bg-gradient-to-r from-emerald-700 to-gold transition-all" style={{ width: `${isFinished ? 100 : progress}%` }} />
        </div>

        {isFinished ? (
          <div className="rounded-[1.5rem] border border-emerald-900/10 bg-white p-5 text-center dark:border-white/10 dark:bg-slate-950">
            <CheckCircle2 className="mx-auto h-10 w-10 text-emerald-700 dark:text-gold" />
            <h3 className="mt-3 text-xl font-bold">Série terminée</h3>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Résultat : {score} / {questions.length}. Relancez une série pour obtenir de nouvelles questions.
            </p>
            <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Button onClick={saveScore} className="min-h-11">Sauvegarder</Button>
              <Button variant="outline" onClick={startNewSession} className="min-h-11">Recommencer</Button>
            </div>
          </div>
        ) : (
          <div className="rounded-[1.5rem] border border-emerald-900/10 bg-white p-5 dark:border-white/10 dark:bg-slate-950">
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-900 dark:bg-emerald-950 dark:text-emerald-100">
                {QUESTION_CATEGORY_LABELS[currentQuestion.category]}
              </span>
              <span className="rounded-full bg-gold/15 px-3 py-1 text-xs font-bold text-amber-900 dark:text-gold">
                {currentQuestion.level}
              </span>
            </div>

            <h3 className="text-lg font-semibold leading-8">{currentQuestion.question}</h3>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {currentQuestion.options.map((option) => {
                const chosen = selectedAnswer === option;
                const correct = option === currentQuestion.answer;
                const optionClass = selectedAnswer
                  ? correct
                    ? "border-emerald-600 bg-emerald-50 text-emerald-900 hover:bg-emerald-50 dark:bg-emerald-950 dark:text-emerald-100"
                    : chosen
                      ? "border-red-500 bg-red-50 text-red-950 hover:bg-red-50 dark:border-red-800 dark:bg-red-950/50 dark:text-red-100"
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
                    {selectedAnswer && correct && <CheckCircle2 className="mr-2 h-4 w-4 shrink-0 text-emerald-700 dark:text-emerald-200" />}
                    {selectedAnswer && chosen && !correct && <XCircle className="mr-2 h-4 w-4 shrink-0 text-red-700 dark:text-red-200" />}
                    {option}
                  </Button>
                );
              })}
            </div>

            {selectedAnswer && (
              <div
                className={`mt-5 rounded-2xl border p-4 text-sm leading-6 ${
                  selectedAnswer === currentQuestion.answer
                    ? "border-emerald-200 bg-emerald-50 text-emerald-950 dark:border-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-100"
                    : "border-red-200 bg-red-50 text-red-950 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-100"
                }`}
              >
                <strong>{selectedAnswer === currentQuestion.answer ? "Bonne réponse." : `Réponse correcte : ${currentQuestion.answer}`}</strong> {currentQuestion.explanation}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
