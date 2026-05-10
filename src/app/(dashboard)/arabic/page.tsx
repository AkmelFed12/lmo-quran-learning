import AlphabetGrid from "@/components/arabic/AlphabetGrid";
import QuizCard from "@/components/arabic/QuizCard";
import WritingCanvas from "@/components/arabic/WritingCanvas";

export default function ArabicPage() {
  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold">Apprendre l'arabe</h2>
      <AlphabetGrid />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <QuizCard />
        <WritingCanvas />
      </div>
    </div>
  );
}