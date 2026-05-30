import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, BookOpen, CheckCircle2, Clock, GraduationCap, ShieldCheck, Target } from "lucide-react";
import { ARABIC_MODULES } from "@/lib/arabic-curriculum";
import { lessonUnits } from "@/lib/learning-content";

type LessonPageProps = {
  params: {
    id: string;
  };
};

export function generateStaticParams() {
  return lessonUnits.map((lesson) => ({ id: lesson.id }));
}

export function generateMetadata({ params }: LessonPageProps): Metadata {
  const lesson = lessonUnits.find((item) => item.id === params.id);

  if (!lesson) {
    return {
      title: "Cours introuvable",
    };
  }

  return {
    title: lesson.title,
    description: lesson.intention,
  };
}

export default function LessonDetailPage({ params }: LessonPageProps) {
  const lesson = lessonUnits.find((item) => item.id === params.id);

  if (!lesson) notFound();

  const curriculumModule = ARABIC_MODULES.find((item) => item.id === lesson.moduleId);
  const lessonIndex = lessonUnits.findIndex((item) => item.id === lesson.id) + 1;

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <Link href="/lessons" className="inline-flex min-h-11 items-center gap-2 rounded-full border border-emerald-900/10 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-gold/40 hover:text-emerald-900 dark:border-white/10 dark:bg-slate-900 dark:text-slate-200">
        <ArrowLeft className="h-4 w-4" />
        Retour aux cours
      </Link>

      <header className="card-premium overflow-hidden p-0">
        <div className="bg-gradient-to-br from-emerald-950 via-emerald-900 to-slate-950 p-6 text-white sm:p-8">
          <div className="flex flex-wrap gap-2">
            <span className="rounded-full bg-gold px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-slate-950">
              Cours {lessonIndex}
            </span>
            <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold text-emerald-50">
              {lesson.level}
            </span>
            <span className="inline-flex items-center gap-1 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold text-emerald-50">
              <Clock className="h-3.5 w-3.5" />
              {lesson.duration}
            </span>
          </div>

          <h1 className="mt-5 text-3xl font-heading font-bold leading-tight sm:text-5xl">{lesson.title}</h1>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-emerald-50/80 sm:text-base">{lesson.intention}</p>

          {curriculumModule && (
            <div className="mt-6 rounded-[1.5rem] border border-white/10 bg-white/10 p-5 backdrop-blur">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-gold">{curriculumModule.stage}</p>
              <h2 className="mt-2 text-xl font-bold">{curriculumModule.label}</h2>
              <p className="mt-2 text-sm leading-6 text-emerald-50/75">{curriculumModule.objective}</p>
            </div>
          )}
        </div>
      </header>

      {lesson.teaching && (
        <section className="card-premium p-5 sm:p-6">
          <div className="flex items-center gap-3">
            <BookOpen className="h-6 w-6 text-emerald-800 dark:text-gold" />
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.22em] text-gold">Explication</p>
              <h2 className="text-2xl font-heading font-bold text-slate-950 dark:text-white">Le cours à retenir</h2>
            </div>
          </div>
          <div className="mt-5 space-y-4">
            {lesson.teaching.map((paragraph) => (
              <p key={paragraph} className="rounded-3xl border border-emerald-900/10 bg-ivory/70 p-5 text-sm leading-8 text-slate-700 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-300">
                {paragraph}
              </p>
            ))}
          </div>
        </section>
      )}

      <section className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
        <LessonCard title="Avant de commencer" items={lesson.before} icon="target" />
        <LessonCard title="Cours" items={lesson.lesson} icon="book" emphasized />
      </section>

      <section className="card-premium p-5 sm:p-6">
        <div className="flex items-center gap-3">
          <GraduationCap className="h-6 w-6 text-emerald-800 dark:text-gold" />
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.22em] text-gold">Pratique guidée</p>
            <h2 className="text-2xl font-heading font-bold text-slate-950 dark:text-white">À faire après le cours</h2>
          </div>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {lesson.practice.map((item, index) => (
            <div key={item} className="rounded-3xl border border-emerald-900/10 bg-ivory/70 p-5 dark:border-white/10 dark:bg-white/[0.04]">
              <span className="grid h-9 w-9 place-items-center rounded-2xl bg-emerald-100 text-sm font-bold text-emerald-900 dark:bg-emerald-950/60 dark:text-gold">
                {index + 1}
              </span>
              <p className="mt-4 text-sm leading-7 text-slate-700 dark:text-slate-300">{item}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
        <LessonCard title="Erreurs à éviter" items={lesson.commonMistakes} icon="shield" />
        <div className="rounded-[1.8rem] border border-gold/30 bg-gold/10 p-5 dark:bg-gold/10 sm:p-6">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="h-6 w-6 text-emerald-800 dark:text-gold" />
            <h2 className="text-xl font-heading font-bold text-slate-950 dark:text-white">Validation</h2>
          </div>
          <p className="mt-4 text-sm leading-7 text-slate-700 dark:text-slate-200">{lesson.validation}</p>
          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <Link href={`/arabic#${lesson.moduleId}`} className="btn-emerald">
              Passer à la pratique
            </Link>
            <Link href="/learning-lab" className="inline-flex min-h-12 items-center justify-center rounded-full border border-emerald-900/10 px-5 py-3 text-sm font-semibold text-emerald-900 transition hover:border-gold/40 dark:border-white/10 dark:text-emerald-100">
              Exercices et tests
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function LessonCard({ title, items, icon, emphasized = false }: { title: string; items: string[]; icon: "target" | "book" | "shield"; emphasized?: boolean }) {
  const Icon = icon === "target" ? Target : icon === "book" ? BookOpen : ShieldCheck;

  return (
    <section className={`rounded-[1.8rem] border p-5 sm:p-6 ${emphasized ? "border-emerald-900/10 bg-white shadow-lg shadow-emerald-950/5 dark:border-white/10 dark:bg-slate-900" : "border-emerald-900/10 bg-ivory/70 dark:border-white/10 dark:bg-white/[0.04]"}`}>
      <div className="flex items-center gap-3">
        <Icon className="h-5 w-5 text-emerald-800 dark:text-gold" />
        <h2 className="text-xl font-heading font-bold text-slate-950 dark:text-white">{title}</h2>
      </div>
      <div className="mt-5 space-y-3">
        {items.map((item, index) => (
          <div key={item} className="flex gap-3 rounded-2xl bg-white/70 p-4 text-sm leading-7 text-slate-700 dark:bg-slate-950/40 dark:text-slate-300">
            <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-900 dark:bg-emerald-950/60 dark:text-gold">
              {index + 1}
            </span>
            <p>{item}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
