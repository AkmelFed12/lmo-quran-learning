import Link from "next/link";
import { ArrowRight, BookOpen, CheckCircle2, Clock, GraduationCap, ShieldCheck, Target } from "lucide-react";
import { lessonUnits } from "@/lib/learning-content";
import AdSlot from "@/components/monetization/AdSlot";
import { GOOGLE_ADSENSE_SLOTS } from "@/lib/monetization";

export default function LessonsPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <header className="card-premium overflow-hidden p-0">
        <div className="grid gap-6 bg-gradient-to-br from-emerald-950 via-emerald-900 to-slate-950 p-5 text-white sm:p-6 lg:grid-cols-[1fr_0.75fr]">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.22em] text-gold">Académie LMO</p>
            <h1 className="mt-2 text-3xl font-heading font-bold sm:text-4xl">Cours d'arabe et de lecture coranique</h1>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-emerald-50/80">
              Retrouvez les cours dans l'ordre d'apprentissage : alphabet, formes, prononciation, voyelles, signes, syllabes, mots, lecture accompagnée, puis tajwid.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link href="/arabic" className="inline-flex min-h-11 items-center gap-2 rounded-full bg-gold px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-amber-300">
                Commencer le parcours
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/learning-lab" className="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/15 px-5 py-3 text-sm font-bold text-white transition hover:bg-white/10">
                Faire un test
                <Target className="h-4 w-4" />
              </Link>
            </div>
          </div>
          <div className="rounded-[1.5rem] border border-white/10 bg-white/10 p-5 backdrop-blur">
            <p className="text-sm text-emerald-50/70">Cours disponibles</p>
            <h2 className="mt-2 text-2xl font-bold">{lessonUnits.length} cours complets</h2>
            <p className="mt-2 text-sm leading-6 text-emerald-50/75">
              Chaque cours contient le contenu à lire, les exercices liés, les erreurs à éviter et la validation du module.
            </p>
          </div>
        </div>
      </header>

      <AdSlot slot={GOOGLE_ADSENSE_SLOTS.lessons} minHeight={110} />

      <section className="card-premium p-5 sm:p-6">
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.22em] text-gold">Tous les cours</p>
            <h2 className="mt-2 text-2xl font-heading font-bold text-slate-950 dark:text-white">Lire, comprendre, pratiquer</h2>
            <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-600 dark:text-slate-300">
              Chaque cours est conçu pour être lu avant l'exercice correspondant. Le contenu reste simple, direct et progressif.
            </p>
          </div>
          <Link href="/arabic" className="inline-flex items-center gap-2 text-sm font-bold text-emerald-800 hover:text-emerald-950 dark:text-gold">
            Voir le parcours verrouillé
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="space-y-4">
          {lessonUnits.map((lesson) => (
            <article key={lesson.id} className="rounded-[1.8rem] border border-emerald-900/10 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-slate-900 sm:p-6">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-gold">{lesson.level} · {lesson.duration}</p>
                  <h2 className="mt-2 text-2xl font-heading font-bold text-slate-950 dark:text-white">{lesson.title}</h2>
                  <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">{lesson.intention}</p>
                </div>
                <GraduationCap className="h-7 w-7 shrink-0 text-emerald-800 dark:text-gold" />
              </div>

              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <LessonList title="Avant la leçon" items={lesson.before} icon="clock" />
                <LessonList title="Ce qu'on apprend" items={lesson.lesson} icon="book" />
                <LessonList title="Pratique" items={lesson.practice} icon="check" />
                <LessonList title="Erreurs à surveiller" items={lesson.commonMistakes} icon="shield" />
              </div>

              <p className="mt-5 rounded-2xl border border-gold/25 bg-gold/10 p-4 text-sm leading-6 text-slate-700 dark:text-slate-200">
                <strong>Validation :</strong> {lesson.validation}
              </p>

              <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                <Link href={`/lessons/${lesson.id}`} className="btn-emerald">
                  Ouvrir le cours
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link href={`/arabic#${lesson.moduleId}`} className="inline-flex min-h-12 items-center justify-center rounded-full border border-emerald-900/10 px-5 py-3 text-sm font-semibold text-emerald-900 transition hover:border-gold/40 dark:border-white/10 dark:text-emerald-100">
                  Pratiquer le module
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

function LessonList({ title, items, icon }: { title: string; items: string[]; icon: "clock" | "book" | "check" | "shield" }) {
  const Icon = icon === "clock" ? Clock : icon === "book" ? BookOpen : icon === "check" ? CheckCircle2 : ShieldCheck;

  return (
    <div className="rounded-[1.4rem] border border-emerald-900/10 bg-ivory/70 p-4 dark:border-white/10 dark:bg-white/[0.04]">
      <h3 className="flex items-center gap-2 font-bold text-slate-950 dark:text-white">
        <Icon className="h-4 w-4 text-emerald-800 dark:text-gold" />
        {title}
      </h3>
      <div className="mt-3 space-y-2">
        {items.map((item) => (
          <p key={item} className="text-sm leading-6 text-slate-600 dark:text-slate-300">{item}</p>
        ))}
      </div>
    </div>
  );
}
