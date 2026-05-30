import Link from "next/link";
import { ArrowRight, BookOpen, Brain, CheckCircle2, ClipboardCheck, Headphones, PenTool } from "lucide-react";

type TodayFocusProps = {
  arabicProgress: number;
  memorizationProgress: number;
  listeningProgress: number;
};

function getDailyLesson(arabicProgress: number, memorizationProgress: number, listeningProgress: number) {
  if (arabicProgress < 70) {
    return {
      href: "/arabic",
      icon: PenTool,
      title: "Cours du jour : fondation arabe",
      duration: "12 minutes",
      text: "Renforcer la base avant d'ajouter une nouvelle difficulté.",
      steps: ["Écouter 3 lettres ou signes", "Répéter lentement", "Valider seulement ce qui est reconnu", "Faire 3 questions courtes"],
    };
  }

  if (listeningProgress < memorizationProgress || listeningProgress < 60) {
    return {
      href: "/quran",
      icon: Headphones,
      title: "Cours du jour : écoute guidée",
      duration: "10 minutes",
      text: "Installer un modèle sonore propre avant la lecture.",
      steps: ["Écouter un passage court", "Suivre le texte arabe", "Relancer une fois", "Noter un passage fragile"],
    };
  }

  if (memorizationProgress < 80) {
    return {
      href: "/memorization",
      icon: Brain,
      title: "Cours du jour : mémorisation courte",
      duration: "15 minutes",
      text: "Mémoriser peu, mais réviser correctement.",
      steps: ["Écouter le segment", "Répéter 5 fois", "Cacher le texte", "Corriger une erreur"],
    };
  }

  return {
    href: "/learning-lab",
    icon: ClipboardCheck,
    title: "Cours du jour : consolidation",
    duration: "8 minutes",
    text: "Vérifier les acquis avec une série courte.",
    steps: ["Choisir le niveau adapté", "Répondre sans se presser", "Lire la correction", "Reprendre une erreur"],
  };
}

export default function TodayFocus({ arabicProgress, memorizationProgress, listeningProgress }: TodayFocusProps) {
  const average = Math.round((arabicProgress + memorizationProgress + listeningProgress) / 3);
  const lesson = getDailyLesson(arabicProgress, memorizationProgress, listeningProgress);
  const LessonIcon = lesson.icon;

  return (
    <section className="card-premium overflow-hidden p-0">
      <div className="grid gap-5 bg-gradient-to-br from-emerald-950 via-emerald-900 to-slate-950 p-5 text-white lg:grid-cols-[0.85fr_1.15fr] lg:p-6">
        <div className="flex flex-col justify-between">
          <div>
            <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold">Aujourd'hui</span>
            <h2 className="mt-4 text-2xl font-heading font-bold">{lesson.title}</h2>
            <p className="mt-3 text-sm leading-6 text-emerald-50/85">{lesson.text}</p>
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl bg-white/12 p-4">
              <p className="text-sm text-emerald-50/80">Durée conseillée</p>
              <p className="mt-2 text-2xl font-bold">{lesson.duration}</p>
            </div>
            <div className="rounded-2xl bg-white/12 p-4">
              <p className="text-sm text-emerald-50/80">Progression moyenne</p>
              <div className="mt-3 h-2 rounded-full bg-white/20">
                <div className="h-full rounded-full bg-gold transition-all" style={{ width: `${Math.min(average, 100)}%` }} />
              </div>
              <p className="mt-2 text-2xl font-bold">{average}%</p>
            </div>
          </div>
        </div>

        <div className="rounded-[1.5rem] border border-white/15 bg-white/12 p-4 backdrop-blur">
          <div className="flex items-start justify-between gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gold text-slate-950">
              <LessonIcon className="h-5 w-5" />
            </div>
            <BookOpen className="h-5 w-5 text-emerald-50/60" />
          </div>
          <div className="mt-5 grid gap-3">
            {lesson.steps.map((step, index) => (
              <div key={step} className="flex gap-3 rounded-2xl bg-white/10 p-3 text-sm leading-6 text-emerald-50/85">
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-white/15 text-xs font-bold text-gold">{index + 1}</span>
                <span>{step}</span>
              </div>
            ))}
          </div>
          <Link href={lesson.href} className="mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-bold text-emerald-950 transition hover:bg-gold">
            Commencer la session
            <ArrowRight className="h-4 w-4" />
          </Link>
          <p className="mt-4 flex gap-2 text-xs leading-5 text-emerald-50/70">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
            Terminer une courte session avec attention vaut mieux qu'accumuler des notions non maîtrisées.
          </p>
        </div>
      </div>
    </section>
  );
}
