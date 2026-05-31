"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { CheckCircle, HelpCircle, LockKeyhole, RefreshCw, Timer, Trophy, XCircle } from "lucide-react";
import { doc, getDoc, increment, setDoc } from "firebase/firestore";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { db } from "@/lib/firebase";
import { useAuth } from "@/lib/hooks/useAuth";
import { getSeenQuestionSignatures, recordQuestionBatchSeen, recordQuestionResult } from "@/lib/question-history";
import {
  QUESTION_BANK_SIZE,
  QUESTION_CATEGORY_LABELS,
  getQuestionSignature,
  type LearningQuestion,
  getQuestionBatch,
  shuffleQuestionOptions,
} from "@/lib/question-bank";

type AnswerMap = Record<number, string>;
type PendingDailyQuizSave = {
  date: string;
  displayName: string;
  score: number;
  total: number;
  uid: string;
  completedAt: string;
};

const DAILY_QUIZ_VERSION = 4;
const DAILY_QUIZ_RECENT_DAYS_TO_AVOID = 14;
const DAILY_QUIZ_PENDING_SAVE_KEY = "lmo-pending-daily-quiz-save";
const DAILY_QUIZ_OPEN_MINUTE = 20 * 60 + 30;
const DAILY_QUIZ_CLOSE_MINUTE = 24 * 60;
const correctFeedback = [
  "Bien vu, continue comme ça.",
  "Réponse solide, garde ce rythme.",
  "C'est acquis pour cette question.",
];
const reviewFeedback = [
  "À revoir doucement, cette règle revient souvent.",
  "Bonne occasion de consolider ce point.",
  "Note cette erreur : elle mérite une petite révision.",
];

function getTodayKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getRecentDayKeys(today: string, count: number) {
  return Array.from({ length: count }, (_, index) => {
    const date = new Date(`${today}T12:00:00`);
    date.setDate(date.getDate() - (index + 1));
    return getTodayKey(date);
  });
}

function isDailyQuizOpen(date = new Date()) {
  const minuteOfDay = date.getHours() * 60 + date.getMinutes();
  return minuteOfDay >= DAILY_QUIZ_OPEN_MINUTE && minuteOfDay < DAILY_QUIZ_CLOSE_MINUTE;
}

function getDailyWindowMessage(date = new Date()) {
  const minuteOfDay = date.getHours() * 60 + date.getMinutes();
  if (minuteOfDay < DAILY_QUIZ_OPEN_MINUTE) return "Ouverture aujourd'hui à 20h30.";
  return "La prochaine série ouvrira demain à 20h30.";
}

function extractQuestionIds(value: unknown) {
  if (!Array.isArray(value)) return [];
  return value
    .map((question) => (typeof question === "object" && question !== null && "id" in question ? Number(question.id) : null))
    .filter((id): id is number => Number.isFinite(id));
}

function extractQuestionSignatures(value: unknown) {
  if (!Array.isArray(value)) return [];
  return value
    .filter((question): question is LearningQuestion => typeof question === "object" && question !== null && "question" in question && "answer" in question && "category" in question)
    .map((question) => getQuestionSignature(question));
}

function hasUniqueQuestionSignatures(questions: LearningQuestion[]) {
  const signatures = questions.map((question) => getQuestionSignature(question));
  return signatures.length === new Set(signatures).size;
}

function createDailyQuestions(today: string, excludeIds: Iterable<number> = [], excludeSignatures: Iterable<string> = []): LearningQuestion[] {
  return getQuestionBatch({
    seed: `daily-quiz-${today}`,
    count: 10,
    category: "mixed",
    excludeIds,
    excludeSignatures,
  }).map((question) => shuffleQuestionOptions(question, `${today}-${question.id}`));
}

async function getRecentDailyQuizExclusions(today: string) {
  const recentDayKeys = getRecentDayKeys(today, DAILY_QUIZ_RECENT_DAYS_TO_AVOID);
  const snapshots = await Promise.allSettled(
    recentDayKeys.map((dayKey) => getDoc(doc(db, "dailyQuizzes", dayKey)))
  );

  const questionIds: number[] = [];
  const questionSignatures: string[] = [];
  const sourceDates: string[] = [];

  snapshots.forEach((result, index) => {
    if (result.status !== "fulfilled" || !result.value.exists()) return;

    const questions = result.value.data().questions;
    questionIds.push(...extractQuestionIds(questions));
    questionSignatures.push(...extractQuestionSignatures(questions));
    sourceDates.push(recentDayKeys[index]);
  });

  return {
    questionIds: Array.from(new Set(questionIds)),
    questionSignatures: Array.from(new Set(questionSignatures)),
    sourceDates,
  };
}

function readPendingDailyQuizSave(): PendingDailyQuizSave | null {
  if (typeof window === "undefined") return null;

  try {
    const value = window.localStorage.getItem(DAILY_QUIZ_PENDING_SAVE_KEY);
    return value ? JSON.parse(value) as PendingDailyQuizSave : null;
  } catch {
    return null;
  }
}

function writePendingDailyQuizSave(value: PendingDailyQuizSave) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(DAILY_QUIZ_PENDING_SAVE_KEY, JSON.stringify(value));
}

function clearPendingDailyQuizSave() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(DAILY_QUIZ_PENDING_SAVE_KEY);
}

async function saveDailyQuizResult(payload: PendingDailyQuizSave) {
  const rankingSave = setDoc(
    doc(db, "rankings", payload.date, "users", payload.uid),
    {
      displayName: payload.displayName,
      score: payload.score,
      total: payload.total,
      uid: payload.uid,
      updatedAt: payload.completedAt,
    },
    { merge: true }
  );

  const progressSave = setDoc(
    doc(db, "progress", payload.uid),
    {
      quiz: {
        lastDailyScore: payload.score,
        lastDailyTotal: payload.total,
        lastDailyQuizAt: payload.completedAt,
      },
      "stats.xp": increment(payload.score * 10),
    },
    { merge: true }
  );

  const results = await Promise.allSettled([rankingSave, progressSave]);
  return results.filter((result) => result.status === "rejected");
}

export default function DailyQuiz() {
  const { user } = useAuth();
  const [today] = useState(() => getTodayKey());
  const [now, setNow] = useState(() => new Date());
  const [questions, setQuestions] = useState<LearningQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<AnswerMap>({});
  const [submitted, setSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(25);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [alreadyPlayed, setAlreadyPlayed] = useState(false);
  const [previousScore, setPreviousScore] = useState<number | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const autoAdvanceRef = useRef<NodeJS.Timeout | null>(null);
  const quizOpen = isDailyQuizOpen(now);

  useEffect(() => {
    const interval = window.setInterval(() => setNow(new Date()), 30_000);
    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!user) return;

    const checkAlreadyPlayed = async () => {
      try {
        const rankingRef = doc(db, "rankings", today, "users", user.uid);
        const snapshot = await getDoc(rankingRef);
        if (snapshot.exists()) {
          setAlreadyPlayed(true);
          setPreviousScore(Number(snapshot.data().score || 0));
        }
      } catch {
        toast.error("Impossible de vérifier votre participation du jour.");
      }
    };

    void checkAlreadyPlayed();
  }, [today, user]);

  useEffect(() => {
    if (!user) return;

    const retryPendingSave = async () => {
      const pending = readPendingDailyQuizSave();
      if (!pending || pending.uid !== user.uid) return;

      const failedSaves = await saveDailyQuizResult(pending);
      if (failedSaves.length === 0) {
        clearPendingDailyQuizSave();
        toast.success("Score quotidien synchronisé.");
      }
    };

    void retryPendingSave();
  }, [user]);

  const fetchQuestions = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const quizRef = doc(db, "dailyQuizzes", today);
      const snapshot = await getDoc(quizRef);
      const snapshotData = snapshot.exists() ? snapshot.data() : null;
      const savedQuestions = snapshotData?.questions;
      const savedVersion = Number(snapshotData?.questionPolicyVersion || 0);

      if (
        Array.isArray(savedQuestions) &&
        savedQuestions.length >= 10 &&
        savedVersion === DAILY_QUIZ_VERSION &&
        hasUniqueQuestionSignatures(savedQuestions.slice(0, 10) as LearningQuestion[])
      ) {
        const selectedQuestions = savedQuestions.slice(0, 10) as LearningQuestion[];
        setQuestions(selectedQuestions);
        recordQuestionBatchSeen(selectedQuestions);
        return;
      }

      let recentQuestionIds: number[] = [];
      let recentQuestionSignatures: string[] = [];
      let recentSourceDates: string[] = [];
      try {
        const exclusions = await getRecentDailyQuizExclusions(today);
        recentQuestionIds = exclusions.questionIds;
        recentQuestionSignatures = exclusions.questionSignatures;
        recentSourceDates = exclusions.sourceDates;
      } catch {
        recentQuestionIds = [];
        recentQuestionSignatures = [];
        recentSourceDates = [];
      }

      const preparedQuestions = createDailyQuestions(today, recentQuestionIds, recentQuestionSignatures);
      setQuestions(preparedQuestions);
      recordQuestionBatchSeen(preparedQuestions);

      try {
        await setDoc(
          quizRef,
          {
            bankSize: QUESTION_BANK_SIZE,
            date: today,
            excludedRecentQuizDates: recentSourceDates,
            excludedRecentQuestionIds: recentQuestionIds,
            excludedRecentQuestionSignatures: recentQuestionSignatures,
            preparedAt: new Date().toISOString(),
            questionPolicyVersion: DAILY_QUIZ_VERSION,
            questions: preparedQuestions,
          },
          { merge: true }
        );
      } catch {
        // Le quiz reste disponible localement si la connexion Firestore est momentanément indisponible.
      }
    } catch {
      setQuestions(createDailyQuestions(today, [], getSeenQuestionSignatures()));
      setError("Connexion instable : quiz préparé sur l'appareil pour éviter un écran vide.");
    } finally {
      setLoading(false);
    }
  }, [today]);

  useEffect(() => {
    if (!alreadyPlayed && quizOpen) void fetchQuestions();
  }, [alreadyPlayed, fetchQuestions, quizOpen]);

  const submitQuiz = useCallback(
    async (finalAnswers: AnswerMap = answers) => {
      if (submitted || alreadyPlayed || questions.length === 0) return;
      if (timerRef.current) clearInterval(timerRef.current);
      if (autoAdvanceRef.current) clearTimeout(autoAdvanceRef.current);

      const correctAnswers = questions.reduce(
        (total, question) => total + (finalAnswers[question.id] === question.answer ? 1 : 0),
        0
      );

      questions.forEach((question) => {
        recordQuestionResult(question, finalAnswers[question.id] || "", "daily-quiz");
      });

      setScore(correctAnswers);
      setSubmitted(true);
      setAlreadyPlayed(true);

      if (!user) return;

      const payload: PendingDailyQuizSave = {
        date: today,
        displayName: user.displayName || user.email || "Apprenant",
        score: correctAnswers,
        total: questions.length,
        uid: user.uid,
        completedAt: new Date().toISOString(),
      };
      const failedSaves = await saveDailyQuizResult(payload);

      if (failedSaves.length === 0) {
        clearPendingDailyQuizSave();
        toast.success("Score enregistré.");
      } else {
        writePendingDailyQuizSave(payload);
        console.warn("Sauvegarde partielle du quiz quotidien :", failedSaves);
        toast.info("Score affiché. La synchronisation sera retentée lors de votre prochaine activité.");
      }
    },
    [alreadyPlayed, answers, questions, submitted, today, user]
  );

  useEffect(() => {
    if (submitted || questions.length === 0 || alreadyPlayed) return undefined;

    setTimeLeft(25);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimeLeft((previous) => {
        if (previous <= 1) {
          if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex((index) => index + 1);
            return 25;
          }

          void submitQuiz();
          return 0;
        }

        return previous - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [alreadyPlayed, currentQuestionIndex, questions.length, submitted, submitQuiz]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (autoAdvanceRef.current) clearTimeout(autoAdvanceRef.current);
    };
  }, []);

  const handleAnswer = (option: string) => {
    if (alreadyPlayed || submitted || !quizOpen) return;
    const question = questions[currentQuestionIndex];
    if (!question || answers[question.id]) return;

    const nextAnswers = { ...answers, [question.id]: option };
    setAnswers(nextAnswers);

    if (autoAdvanceRef.current) clearTimeout(autoAdvanceRef.current);
    autoAdvanceRef.current = setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex((index) => index + 1);
        setTimeLeft(25);
      } else {
        void submitQuiz(nextAnswers);
      }
    }, 1200);
  };

  if (!quizOpen && !submitted) {
    return (
      <Card className="overflow-hidden text-center">
        <CardContent className="p-8">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-800 dark:bg-emerald-950/50 dark:text-gold">
            <LockKeyhole className="h-7 w-7" />
          </div>
          <h3 className="text-xl font-bold">Quiz quotidien fermé</h3>
          <p className="mt-2 text-slate-500 dark:text-slate-400">
            La session classée est accessible chaque jour de 20h30 à 00h00.
          </p>
          <p className="mt-2 text-sm font-semibold text-emerald-800 dark:text-gold">{getDailyWindowMessage(now)}</p>
          {alreadyPlayed && (
            <p className="mt-4 rounded-2xl bg-ivory px-4 py-3 text-sm text-slate-600 dark:bg-white/[0.04] dark:text-slate-300">
              Participation du jour déjà enregistrée : {previousScore} / 10.
            </p>
          )}
        </CardContent>
      </Card>
    );
  }

  if (alreadyPlayed && !submitted) {
    return (
      <Card className="text-center">
        <CardContent className="p-8">
          <Trophy className="mx-auto mb-4 h-12 w-12 text-gold" />
          <h3 className="text-xl font-bold">Participation déjà enregistrée</h3>
          <p className="mt-2 text-slate-500 dark:text-slate-400">Votre score du jour : {previousScore} / 10.</p>
          <p className="mt-2 text-sm text-slate-400">Revenez demain pour une nouvelle série classée.</p>
        </CardContent>
      </Card>
    );
  }

  if (loading) {
    return (
      <div className="space-y-3 py-12 text-center">
        <HelpCircle className="mx-auto h-10 w-10 text-emerald-700 dark:text-gold" />
        <p className="text-slate-500">Préparation du quiz quotidien…</p>
        <Button variant="outline" onClick={fetchQuestions}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Réessayer
        </Button>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="space-y-6">
        <div className="rounded-[2rem] border border-emerald-900/10 bg-white p-6 text-center dark:border-white/10 dark:bg-slate-900">
          <Trophy className="mx-auto mb-4 h-16 w-16 text-gold" />
          <h2 className="text-2xl font-bold">Quiz terminé</h2>
          <p className="mt-2 text-xl">Votre score : {score} / {questions.length}</p>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Sélection issue de la banque pédagogique : {QUESTION_BANK_SIZE.toLocaleString("fr-FR")} items.
          </p>
        </div>

        {questions.map((question) => {
          const isCorrect = answers[question.id] === question.answer;
          const feedback = isCorrect
            ? correctFeedback[question.id % correctFeedback.length]
            : reviewFeedback[question.id % reviewFeedback.length];
          return (
            <Card key={question.id} className={isCorrect ? "border-emerald-500" : "border-red-400"}>
              <CardContent className="p-4">
                <div className="mb-2 flex flex-wrap gap-2">
                  <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-900 dark:bg-emerald-950 dark:text-emerald-100">
                    {QUESTION_CATEGORY_LABELS[question.category]}
                  </span>
                  <span className="rounded-full bg-gold/15 px-3 py-1 text-xs font-bold text-amber-900 dark:text-gold">
                    {question.level}
                  </span>
                </div>
                <p className="font-semibold">{question.question}</p>
                <p className="mt-2 text-sm">
                  Votre réponse : <strong>{answers[question.id] || "Pas de réponse"}</strong>
                </p>
                <p className="text-sm text-emerald-700 dark:text-emerald-300">
                  Réponse correcte : <strong>{question.answer}</strong>
                </p>
                <div
                  className={`mt-3 rounded-2xl border p-3 text-sm leading-6 ${
                    isCorrect
                      ? "border-emerald-200 bg-emerald-50 text-emerald-950 dark:border-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-100"
                      : "border-red-200 bg-red-50 text-red-950 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-100"
                  }`}
                >
                  <p className="font-semibold">{isCorrect ? "Réponse validée" : "Correction à retenir"}</p>
                  <p className="mt-1">{feedback}</p>
                  <p>{question.explanation}</p>
                  <p className={isCorrect ? "mt-1 text-xs text-emerald-800 dark:text-emerald-200" : "mt-1 text-xs text-red-800 dark:text-red-200"}>{question.proof}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    );
  }

  const question = questions[currentQuestionIndex];
  if (!question) {
    return (
      <div className="py-12 text-center">
        <p className="text-slate-500">Aucune question disponible.</p>
        <Button variant="outline" onClick={fetchQuestions} className="mt-4">
          Préparer une série
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-100">
          {error}
        </div>
      )}

      <div className="flex items-center justify-between">
        <span className="text-sm text-slate-500">
          Question {currentQuestionIndex + 1}/{questions.length}
        </span>
        <span className={`flex items-center gap-1 text-sm font-bold ${timeLeft <= 5 ? "text-red-500" : "text-emerald-700 dark:text-gold"}`}>
          <Timer className="h-4 w-4" />
          {timeLeft}s
        </span>
      </div>

      <Card>
        <CardContent className="p-5 sm:p-6">
          <div className="mb-4 flex flex-wrap gap-2">
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-900 dark:bg-emerald-950 dark:text-emerald-100">
              {QUESTION_CATEGORY_LABELS[question.category]}
            </span>
            <span className="rounded-full bg-gold/15 px-3 py-1 text-xs font-bold text-amber-900 dark:text-gold">
              {question.skill}
            </span>
          </div>

          <h3 className="mb-5 text-lg font-semibold leading-8">{question.question}</h3>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {question.options.map((option) => {
              const selectedAnswer = answers[question.id];
              const chosen = selectedAnswer === option;
              const correct = option === question.answer;
              const answered = Boolean(selectedAnswer);
              const optionClass = answered
                ? correct
                  ? "border-emerald-500 bg-emerald-50 text-emerald-950 hover:bg-emerald-50 dark:border-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-100"
                  : chosen
                    ? "border-red-500 bg-red-50 text-red-950 hover:bg-red-50 dark:border-red-800 dark:bg-red-950/50 dark:text-red-100"
                    : "opacity-55"
                : "";

              return (
                <Button
                  key={option}
                  variant="outline"
                  onClick={() => handleAnswer(option)}
                  className={`min-h-12 justify-start whitespace-normal text-left ${optionClass}`}
                  disabled={answered}
                >
                  {answered && correct && <CheckCircle className="mr-2 h-4 w-4 shrink-0 text-emerald-700 dark:text-emerald-200" />}
                  {answered && chosen && !correct && <XCircle className="mr-2 h-4 w-4 shrink-0 text-red-700 dark:text-red-200" />}
                  {option}
                </Button>
              );
            })}
          </div>

          {answers[question.id] && (
            <div
              className={`mt-5 rounded-2xl border p-4 text-sm leading-6 ${
                answers[question.id] === question.answer
                  ? "border-emerald-200 bg-emerald-50 text-emerald-950 dark:border-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-100"
                  : "border-red-200 bg-red-50 text-red-950 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-100"
              }`}
            >
              <p className="font-semibold">
                {answers[question.id] === question.answer ? "Bonne réponse." : `Réponse correcte : ${question.answer}`}
              </p>
              <p className="mt-1">
                {answers[question.id] === question.answer
                  ? "Bien vu, continue comme ça."
                  : "À revoir doucement, cette règle revient souvent."}
              </p>
              <p className="mt-1">{question.explanation}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
