import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

type StudyCoachProps = {
  arabicProgress: number;
  memorizationProgress: number;
  listeningProgress: number;
  streak: number;
};

function getCoachAdvice({ arabicProgress, memorizationProgress, listeningProgress, streak }: StudyCoachProps) {
  if (arabicProgress < 35) {
    return {
      title: "Priorité : fondations arabes",
      text: "Travaillez les lettres dans l'ordre, puis les formes et les sons. Ne passez pas à la lecture longue tant que le module en cours n'est pas validé.",
      steps: ["Revoir 5 lettres", "Lire 6 syllabes lentement", "Faire une correction immédiate"],
      href: "/arabic",
      cta: "Continuer le parcours",
    };
  }

  if (listeningProgress < 45) {
    return {
      title: "Priorité : écoute et prononciation",
      text: "Écoutez un passage court, répétez par segment, puis relisez sans audio. L'objectif est une lecture propre, pas une longue quantité.",
      steps: ["Écouter un passage court", "Répéter verset par verset", "Noter le passage fragile"],
      href: "/quran",
      cta: "Écouter une sourate",
    };
  }

  if (memorizationProgress < 20) {
    return {
      title: "Priorité : mémoriser par petites étapes",
      text: "Choisissez une petite portion. Écoutez, répétez, cachez le texte, puis vérifiez. La régularité compte plus que la vitesse.",
      steps: ["Choisir 1 à 3 versets", "Répéter avec audio", "Cacher puis vérifier"],
      href: "/memorization",
      cta: "Créer une session",
    };
  }

  if (streak < 3) {
    return {
      title: "Priorité : construire la routine",
      text: "Votre progression commence à se stabiliser. Gardez une séance courte, claire et vérifiable plusieurs jours de suite.",
      steps: ["Choisir un créneau fixe", "Faire 10 minutes", "Cocher la séance terminée"],
      href: "/planning",
      cta: "Planifier ma routine",
    };
  }

  return {
    title: "Continuez le rythme",
    text: "Gardez l'alternance : leçon, pratique, mini-test, révision. Si une erreur revient souvent, revenez au module concerné.",
    steps: ["Faire le quiz quotidien", "Relire la correction", "Réviser une erreur"],
    href: "/daily-quiz",
    cta: "Faire le quiz",
  };
}

export default function StudyCoach(props: StudyCoachProps) {
  const advice = getCoachAdvice(props);

  return (
    <section className="relative overflow-hidden rounded-[2rem] border border-emerald-100 bg-slate-950 p-5 text-white shadow-xl shadow-emerald-950/20 dark:border-emerald-900/50 sm:p-6">
      <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-emerald-400/20 blur-3xl" />
      <div className="absolute -bottom-20 -left-20 h-56 w-56 rounded-full bg-sky-400/15 blur-3xl" />
      <div className="relative">
        <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-emerald-100">
          <Sparkles className="h-4 w-4" />
          Conseil pédagogique
        </span>
        <h2 className="mt-4 text-2xl font-heading font-bold">{advice.title}</h2>
        <p className="mt-3 text-sm leading-6 text-slate-300">{advice.text}</p>
        <div className="mt-5 grid gap-2">
          {advice.steps.map((step, index) => (
            <div key={step} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/10 px-3 py-2 text-sm text-slate-100">
              <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-emerald-400/20 text-xs font-bold text-emerald-100">
                {index + 1}
              </span>
              <span>{step}</span>
            </div>
          ))}
        </div>
        <Link href={advice.href} className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:-translate-y-0.5 hover:bg-emerald-50">
          {advice.cta}
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}
