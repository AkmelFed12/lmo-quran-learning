import DailyQuiz from "@/components/quiz/DailyQuiz";
import DailyRanking from "@/components/quiz/DailyRanking";
import WeeklyRanking from "@/components/quiz/WeeklyRanking";
import GlobalRanking from "@/components/quiz/GlobalRanking";

export default function DailyQuizPage() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Quiz quotidien</h2>
      <p className="text-slate-500">
        Une série classée par jour, préparée depuis la banque pédagogique afin d'éviter les répétitions.
      </p>
      <DailyQuiz />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <DailyRanking />
        <WeeklyRanking />
      </div>
      <GlobalRanking />
    </div>
  );
}
