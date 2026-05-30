"use client";

import { getQuestionSignature, type LearningQuestion, type QuestionCategory } from "@/lib/question-bank";

export type QuestionScope = "placement" | "exercise" | "learning-lab" | "daily-quiz" | "revision" | "module-checkpoint";

export type QuestionResult = {
  id: number;
  category: QuestionCategory;
  skill: string;
  level: LearningQuestion["level"];
  question: string;
  signature: string;
  answer: string;
  selectedAnswer: string;
  correct: boolean;
  scope: QuestionScope;
  answeredAt: string;
};

export type WeakCategory = {
  category: QuestionCategory;
  attempts: number;
  mistakes: number;
  accuracy: number;
};

const SEEN_KEY = "lmo_learning_seen_questions_v3";
const SEEN_SIGNATURES_KEY = "lmo_learning_seen_question_signatures_v1";
const RESULTS_KEY = "lmo_learning_question_results_v3";
const MAX_SEEN_IDS = 50_000;
const MAX_SEEN_SIGNATURES = 25_000;
const MAX_RESULTS = 2_000;

function canUseStorage() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function readJson<T>(key: string, fallback: T): T {
  if (!canUseStorage()) return fallback;

  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeJson<T>(key: string, value: T) {
  if (!canUseStorage()) return;

  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // If storage is full or blocked, learning must continue without interruption.
  }
}

export function getSeenQuestionIds(limit = MAX_SEEN_IDS): number[] {
  return readJson<number[]>(SEEN_KEY, []).slice(-limit);
}

export function getSeenQuestionSignatures(limit = MAX_SEEN_SIGNATURES): string[] {
  return readJson<string[]>(SEEN_SIGNATURES_KEY, []).slice(-limit);
}

export function rememberQuestionIds(ids: number[], limit = MAX_SEEN_IDS) {
  if (ids.length === 0) return;

  const merged = [...getSeenQuestionIds(limit), ...ids];
  const unique = Array.from(new Set(merged)).slice(-limit);
  writeJson(SEEN_KEY, unique);
}

export function rememberQuestionSignatures(signatures: string[], limit = MAX_SEEN_SIGNATURES) {
  if (signatures.length === 0) return;

  const merged = [...getSeenQuestionSignatures(limit), ...signatures];
  const unique = Array.from(new Set(merged)).slice(-limit);
  writeJson(SEEN_SIGNATURES_KEY, unique);
}

export function getQuestionResults(limit = MAX_RESULTS): QuestionResult[] {
  return readJson<QuestionResult[]>(RESULTS_KEY, []).slice(0, limit);
}

export function recordQuestionResult(question: LearningQuestion, selectedAnswer: string, scope: QuestionScope) {
  const signature = getQuestionSignature(question);
  const result: QuestionResult = {
    id: question.id,
    category: question.category,
    skill: question.skill,
    level: question.level,
    question: question.question,
    signature,
    answer: question.answer,
    selectedAnswer,
    correct: selectedAnswer === question.answer,
    scope,
    answeredAt: new Date().toISOString(),
  };

  rememberQuestionIds([question.id]);
  rememberQuestionSignatures([signature]);
  const results = [result, ...getQuestionResults(MAX_RESULTS - 1)];
  writeJson(RESULTS_KEY, results.slice(0, MAX_RESULTS));
  return result;
}

export function recordQuestionBatchSeen(questions: LearningQuestion[]) {
  rememberQuestionIds(questions.map((question) => question.id));
  rememberQuestionSignatures(questions.map((question) => getQuestionSignature(question)));
}

export function getWrongQuestionIds(limit = 250): number[] {
  const ids = getQuestionResults()
    .filter((result) => !result.correct)
    .map((result) => result.id);

  return Array.from(new Set(ids)).slice(0, limit);
}

export function getWeakCategories(minAttempts = 2): WeakCategory[] {
  const stats = new Map<QuestionCategory, { attempts: number; mistakes: number }>();

  getQuestionResults().forEach((result) => {
    const current = stats.get(result.category) || { attempts: 0, mistakes: 0 };
    current.attempts += 1;
    if (!result.correct) current.mistakes += 1;
    stats.set(result.category, current);
  });

  return Array.from(stats.entries())
    .map(([category, value]) => ({
      category,
      attempts: value.attempts,
      mistakes: value.mistakes,
      accuracy: value.attempts === 0 ? 0 : Math.round(((value.attempts - value.mistakes) / value.attempts) * 100),
    }))
    .filter((item) => item.attempts >= minAttempts)
    .sort((a, b) => b.mistakes - a.mistakes || a.accuracy - b.accuracy);
}

export function clearQuestionHistory() {
  if (!canUseStorage()) return;
  window.localStorage.removeItem(SEEN_KEY);
  window.localStorage.removeItem(SEEN_SIGNATURES_KEY);
  window.localStorage.removeItem(RESULTS_KEY);
}
