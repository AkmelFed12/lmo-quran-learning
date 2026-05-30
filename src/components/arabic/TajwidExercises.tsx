"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { doc, setDoc, increment } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/lib/hooks/useAuth";
import { Award, CheckCircle2, XCircle } from "lucide-react";

const questions = [
  { rule: "Qalqala", question: "Quelles lettres font partie de la qalqala ?", options: ["ق ط ب ج د", "ي ر م ل و ن", "ا و ي", "ت ث ج د"], answer: "ق ط ب ج د", explanation: "Les lettres de qalqala sont ق ط ب ج د. Elles produisent un léger rebond lorsqu'elles portent un sukun ou se trouvent à l'arrêt." },
  { rule: "Iqlab", question: "Quelle lettre provoque l'iqlab ?", options: ["ب", "ل", "ق", "م"], answer: "ب", explanation: "L'iqlab apparaît devant ب : le son noun ou tanwin se transforme en mim léger avec ghunna." },
  { rule: "Madd", question: "Quelle règle concerne l'allongement ?", options: ["Madd", "Ikhfa", "Qalqala", "Idgham"], answer: "Madd", explanation: "Le madd concerne l'allongement vocalique. Sa durée dépend du type de madd et du contexte de lecture." },
  { rule: "Ikhfa", question: "L'ikhfa implique généralement :", options: ["une nasalisation légère", "un arrêt complet", "aucun son", "une voyelle longue"], answer: "une nasalisation légère", explanation: "L'ikhfa consiste à dissimuler légèrement le noun sakina ou le tanwin avec une nasalisation mesurée." },
  { rule: "Idgham", question: "L'idgham signifie :", options: ["fusionner", "retourner", "allonger", "couper"], answer: "fusionner", explanation: "L'idgham fait entrer le son du noun sakina ou du tanwin dans la lettre suivante, selon les cas avec ou sans ghunna." },
];

export default function TajwidExercises() {
  const { user } = useAuth();
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

  const q = questions[currentQ];

  const finishQuiz = async (finalScore: number) => {
    setCompleted(true);
    if (user) {
      await setDoc(doc(db, "progress", user.uid), {
        "arabic.tajwidQuizScore": increment(finalScore),
        "arabic.tajwidCertificate": finalScore >= 4,
      }, { merge: true });
    }
    if (finalScore >= 4) {
      toast.success("Mini-certificat tajwid débloqué.");
    } else {
      toast.info("Quiz terminé. Révisez les règles puis réessayez.");
    }
  };

  const handleAnswer = (choice: string) => {
    if (selectedAnswer) return;
    const correct = choice === q.answer;
    const nextScore = score + (correct ? 1 : 0);
    setSelectedAnswer(choice);
    setScore(nextScore);
    toast[correct ? "success" : "error"](correct ? "Correct." : `Réponse : ${q.answer}`);

    window.setTimeout(() => {
      setSelectedAnswer(null);

      if (currentQ < questions.length - 1) {
        setCurrentQ((index) => index + 1);
        return;
      }

      void finishQuiz(nextScore);
    }, 1100);
  };

  const restart = () => {
    setCurrentQ(0);
    setScore(0);
    setCompleted(false);
    setSelectedAnswer(null);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Award className="h-5 w-5 text-gold" />
          Validation tajwid
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {completed ? (
          <div className="rounded-3xl border border-emerald-900/10 bg-ivory p-5 text-center dark:border-white/10 dark:bg-white/[0.04]">
            <CheckCircle2 className="mx-auto h-10 w-10 text-emerald-700 dark:text-gold" />
            <h3 className="mt-3 text-xl font-semibold">Score : {score}/{questions.length}</h3>
            <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">
              {score >= 4 ? "Mini-certificat interne validé. Continuez à pratiquer avec un enseignant." : "Reprenez les règles colorées puis retentez la validation."}
            </p>
            <Button onClick={restart} className="mt-4">Recommencer</Button>
          </div>
        ) : (
          <>
            <div className="rounded-2xl bg-emerald-50 p-4 dark:bg-emerald-950/30">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-800 dark:text-gold">{q.rule}</p>
              <p className="mt-2 font-medium">{q.question}</p>
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              {q.options.map((option) => {
                const chosen = selectedAnswer === option;
                const correct = option === q.answer;
                const answered = Boolean(selectedAnswer);
                const optionClass = answered
                  ? correct
                    ? "border-emerald-500 bg-emerald-50 text-emerald-950 hover:bg-emerald-50 dark:border-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-100"
                    : chosen
                      ? "border-red-500 bg-red-50 text-red-950 hover:bg-red-50 dark:border-red-800 dark:bg-red-950/50 dark:text-red-100"
                      : "opacity-55"
                  : "";

                return (
                  <Button key={option} variant="outline" disabled={answered} className={`min-h-12 justify-start whitespace-normal text-left ${optionClass}`} onClick={() => handleAnswer(option)}>
                    {answered && correct && <CheckCircle2 className="mr-2 h-4 w-4 shrink-0 text-emerald-700 dark:text-emerald-200" />}
                    {answered && chosen && !correct && <XCircle className="mr-2 h-4 w-4 shrink-0 text-red-700 dark:text-red-200" />}
                    {option}
                  </Button>
                );
              })}
            </div>
            {selectedAnswer && (
              <div
                className={`rounded-2xl border p-4 text-sm leading-6 ${
                  selectedAnswer === q.answer
                    ? "border-emerald-200 bg-emerald-50 text-emerald-950 dark:border-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-100"
                    : "border-red-200 bg-red-50 text-red-950 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-100"
                }`}
              >
                <strong>{selectedAnswer === q.answer ? "Réponse validée." : `Réponse correcte : ${q.answer}`}</strong> {q.explanation}
              </div>
            )}
            <p className="text-sm text-slate-500">Question {currentQ + 1}/{questions.length} | Score : {score}</p>
          </>
        )}
      </CardContent>
    </Card>
  );
}
