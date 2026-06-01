"use client";

import { useEffect, useMemo, useState } from "react";
import { AlertCircle, CheckCircle2, RefreshCw, Target, Trash2, XCircle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  QUESTION_CATEGORY_LABELS,
  type LearningQuestion,
  type QuestionCategory,
  getQuestionBatch,
} from "@/lib/question-bank";
import {
  clearQuestionHistory,
  getQuestionResults,
  getSeenQuestionIds,
  getSeenQuestionSignatures,
  getWeakCategories,
  recordQuestionBatchSeen,
  recordQuestionResult,
  type QuestionResult,
  type WeakCategory,
} from "@/lib/question-history";

function getAdvice(category: QuestionCategory) {
  const advice: Record<QuestionCategory, string> = {
    arabic_letters: "Reprenez les lettres proches et lisez-les lentement avant de répondre.",
    arabic_vowels: "Travaillez fatha, kasra et damma avec une lettre à la fois.",
    arabic_syllables: "Assemblez d'abord consonne + voyelle, puis lisez sans vous presser.",
    arabic_words: "Relisez les mots courts en associant sens et prononciation.",
    tajwid: "Révisez une règle, écoutez un exemple, puis refaites le quiz.",
    quran_basics: "Stabilisez les repères de sourates petit à petit.",
    memorization: "Privilégiez le rappel actif : cacher, réciter, vérifier.",
    islam_basics: "Gardez les notions simples et vérifiez les points sensibles auprès d'un enseignant.",
  };

  return advice[category];
}

export default function LearningGaps() {
  const [weakCategories, setWeakCategories] = useState<WeakCategory[]>([]);
  const [recentMistakes, setRecentMistakes] = useState<QuestionResult[]>([]);
  const [sessionSeed, setSessionSeed] = useState(() => Date.now());
  const [activeCategory, setActiveCategory] = useState<QuestionCategory | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [confirmReset, setConfirmReset] = useState(false);

  const refreshData = () => {
    const weaknesses = getWeakCategories(1);
    setWeakCategories(weaknesses);
    setRecentMistakes(getQuestionResults().filter((result) => !result.correct).slice(0, 8));
    setActiveCategory((current) => current || weaknesses[0]?.category || null);
  };

  useEffect(() => {
    refreshData();
  }, []);

  const practiceQuestions = useMemo(() => {
    if (!activeCategory) return [];
    return getQuestionBatch({
      seed: `gaps-${activeCategory}-${sessionSeed}`,
      count: 10,
      category: activeCategory,
      excludeIds: getSeenQuestionIds(),
      excludeSignatures: getSeenQuestionSignatures(),
    });
  }, [activeCategory, sessionSeed]);

  useEffect(() => {
    recordQuestionBatchSeen(practiceQuestions);
  }, [practiceQuestions]);

  const currentQuestion = practiceQuestions[currentIndex];
  const score = practiceQuestions.reduce(
    (total, question) => total + (answers[question.id] === question.answer ? 1 : 0),
    0
  );
  const finished = practiceQuestions.length > 0 && currentIndex >= practiceQuestions.length;
  const activeCategoryLabel = activeCategory ? QUESTION_CATEGORY_LABELS[activeCategory] : "Aucun thème";
  const activeCategoryAdvice = activeCategory ? getAdvice(activeCategory) : "Commencez par quelques exercices pour détecter un point à renforcer.";
  const sessionProgress = practiceQuestions.length > 0
    ? Math.min(100, Math.round((Math.min(currentIndex, practiceQuestions.length) / practiceQuestions.length) * 100))
    : 0;

  const restartPractice = (category = activeCategory) => {
    setActiveCategory(category);
    setSessionSeed(Date.now());
    setCurrentIndex(0);
    setAnswers({});
  };

  const handleAnswer = (question: LearningQuestion, answer: string) => {
    if (answers[question.id]) return;
    const isCorrect = answer === question.answer;
    setAnswers((previous) => ({ ...previous, [question.id]: answer }));
    recordQuestionResult(question, answer, "revision");
    toast[isCorrect ? "success" : "error"](isCorrect ? "Correct." : `Réponse : ${question.answer}`);

    window.setTimeout(() => {
      setCurrentIndex((index) => index + 1);
      refreshData();
    }, 1050);
  };

  const resetHistory = () => {
    clearQuestionHistory();
    setWeakCategories([]);
    setRecentMistakes([]);
    setActiveCategory(null);
    setAnswers({});
    setCurrentIndex(0);
    setConfirmReset(false);
    toast.success("Historique local réinitialisé.");
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <header className="card-premium p-5 sm:p-6">
        <p className="text-sm font-bold uppercase tracking-[0.22em] text-gold">Révision ciblée</p>
        <h1 className="mt-2 text-3xl font-heading font-bold text-slate-950 dark:text-white">Mes lacunes</h1>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600 dark:text-slate-300">
          Cette page s'appuie sur vos réponses récentes pour proposer une révision courte, utile et différente à chaque session.
        </p>
        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl bg-emerald-50 p-4 dark:bg-emerald-950/30">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-800 dark:text-gold">Thèmes faibles</p>
            <p className="mt-2 text-2xl font-bold text-slate-950 dark:text-white">{weakCategories.length}</p>
          </div>
          <div className="rounded-2xl bg-amber-50 p-4 dark:bg-amber-950/30">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-amber-800 dark:text-gold">Erreurs récentes</p>
            <p className="mt-2 text-2xl font-bold text-slate-950 dark:text-white">{recentMistakes.length}</p>
          </div>
          <div className="rounded-2xl bg-sky-50 p-4 dark:bg-sky-950/30">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-sky-800 dark:text-sky-100">Session</p>
            <p className="mt-2 text-2xl font-bold text-slate-950 dark:text-white">{sessionProgress}%</p>
          </div>
        </div>
      </header>

      <section className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-3">
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-amber-600" />
              Points à renforcer
            </CardTitle>
            <Button variant="outline" size="sm" onClick={() => setConfirmReset(true)}>
              <Trash2 className="mr-2 h-4 w-4" />
              Effacer
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {confirmReset && (
              <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950 dark:border-amber-900/60 dark:bg-amber-950/30 dark:text-amber-100">
                <p className="font-semibold">Réinitialiser l'historique local ?</p>
                <p className="mt-1 text-xs">Cela retire seulement les traces de révision stockées sur cet appareil. Le compte et les scores enregistrés restent conservés.</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Button variant="outline" size="sm" onClick={() => setConfirmReset(false)}>
                    Annuler
                  </Button>
                  <Button size="sm" onClick={resetHistory}>
                    Confirmer
                  </Button>
                </div>
              </div>
            )}

            {weakCategories.length === 0 ? (
              <div className="rounded-2xl bg-ivory p-4 text-sm leading-6 text-slate-600 dark:bg-white/[0.04] dark:text-slate-300">
                Faites quelques exercices ou tests pour obtenir un bilan personnalisé.
              </div>
            ) : (
              weakCategories.map((item) => (
                <button
                  key={item.category}
                  onClick={() => restartPractice(item.category)}
                  className={`w-full rounded-2xl border p-4 text-left transition ${
                    activeCategory === item.category
                      ? "border-emerald-800 bg-emerald-950 text-white"
                      : "border-emerald-900/10 bg-white hover:border-gold/60 dark:border-white/10 dark:bg-slate-950"
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-semibold">{QUESTION_CATEGORY_LABELS[item.category]}</p>
                    <span className="rounded-full bg-gold/15 px-3 py-1 text-xs font-bold text-gold">
                      {item.accuracy}%
                    </span>
                  </div>
                  <p className={`mt-2 text-sm leading-6 ${activeCategory === item.category ? "text-emerald-50/75" : "text-slate-500 dark:text-slate-400"}`}>
                    {getAdvice(item.category)}
                  </p>
                  <p className={`mt-2 text-xs ${activeCategory === item.category ? "text-emerald-50/60" : "text-slate-400"}`}>
                    {item.mistakes} erreur(s) sur {item.attempts} tentative(s)
                  </p>
                </button>
              ))
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="border-b border-emerald-900/10 dark:border-white/10">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-emerald-800 dark:text-gold" />
                Session ciblée
              </CardTitle>
              <Button variant="outline" onClick={() => restartPractice()}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Nouvelle série
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-5 p-5">
            <div className="rounded-[1.5rem] border border-emerald-900/10 bg-ivory/70 p-4 dark:border-white/10 dark:bg-white/[0.04]">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-gold">Thème actif</p>
                  <h2 className="mt-1 text-xl font-heading font-bold text-slate-950 dark:text-white">{activeCategoryLabel}</h2>
                  <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{activeCategoryAdvice}</p>
                </div>
                <span className="rounded-full bg-emerald-100 px-4 py-2 text-xs font-bold text-emerald-950 dark:bg-emerald-950/60 dark:text-emerald-100">
                  Score {score}/{practiceQuestions.length || 0}
                </span>
              </div>
              <div className="mt-4 h-2 rounded-full bg-emerald-900/10 dark:bg-white/10">
                <div className="h-full rounded-full bg-gold transition-all" style={{ width: `${sessionProgress}%` }} />
              </div>
            </div>

            {!activeCategory ? (
              <p className="rounded-2xl bg-ivory p-4 text-sm text-slate-600 dark:bg-white/[0.04] dark:text-slate-300">
                Aucune lacune détectée pour le moment. Commencez par un test dans “Exercices & tests”.
              </p>
            ) : finished ? (
              <div className="rounded-[1.5rem] bg-ivory p-5 text-center dark:bg-white/[0.04]">
                <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-700 dark:text-gold" />
                <h2 className="mt-3 text-2xl font-bold">Révision terminée</h2>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                  Score : {score} / {practiceQuestions.length}. Relancez une série pour travailler autrement.
                </p>
                <Button onClick={() => restartPractice()} className="mt-5">Nouvelle série ciblée</Button>
              </div>
            ) : practiceQuestions.length === 0 || !currentQuestion ? (
              <p className="rounded-2xl bg-ivory p-4 text-sm text-slate-600 dark:bg-white/[0.04] dark:text-slate-300">
                Toutes les questions récentes de ce thème ont déjà été vues. Effacez l'historique local ou choisissez un autre point à renforcer.
              </p>
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
                <p className="text-sm text-slate-500 dark:text-slate-400">Question {currentIndex + 1}/{practiceQuestions.length}</p>
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

      <Card>
        <CardHeader>
          <CardTitle>Dernières erreurs</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {recentMistakes.length === 0 ? (
            <p className="text-sm text-slate-500 dark:text-slate-400">Aucune erreur récente enregistrée.</p>
          ) : (
            recentMistakes.map((item) => (
              <div key={`${item.id}-${item.answeredAt}`} className="rounded-2xl border border-slate-100 p-4 text-sm dark:border-slate-800">
                <p className="font-semibold leading-6">{item.question}</p>
                <p className="mt-2 text-slate-500 dark:text-slate-400">
                  Votre réponse : {item.selectedAnswer || "sans réponse"} · Correction : {item.answer}
                </p>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
