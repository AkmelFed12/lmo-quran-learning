"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const quizLetters = [
  { char: "ب", options: ["Ba", "Alif", "Ta"], correct: 0 },
  { char: "س", options: ["Shin", "Sin", "Sad"], correct: 1 },
  { char: "ك", options: ["Lam", "Kaf", "Mim"], correct: 1 },
];

export default function QuizCard() {
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);

  const handleAnswer = (index: number) => {
    if (index === quizLetters[current].correct) {
      toast.success("Correct !");
      setScore(score + 1);
    } else {
      toast.error("Essaie encore.");
    }
    if (current < quizLetters.length - 1) {
      setCurrent(current + 1);
    } else {
      toast.success(`Quiz terminé ! Score : ${score + 1} / ${quizLetters.length}`);
      setCurrent(0);
      setScore(0);
    }
  };

  return (
    <div className="card-premium p-6">
      <h3 className="text-xl font-bold mb-4">Quelle est cette lettre ?</h3>
      <div className="text-center mb-6">
        <span className="text-5xl font-arabic">{quizLetters[current].char}</span>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {quizLetters[current].options.map((opt, i) => (
          <Button key={i} variant="outline" onClick={() => handleAnswer(i)}>
            {opt}
          </Button>
        ))}
      </div>
    </div>
  );
}