import Link from "next/link";
import { ArrowRight, BookOpen, CheckCircle2, Clock, ShieldCheck } from "lucide-react";
import { lessonUnits } from "@/lib/learning-content";

const previewUnits = lessonUnits;

export default function StructuredArabicLessons() {
  return (
    <section className="card-premium p-5 sm:p-6">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.22em] text-gold">Leçons structurées</p>
          <h2 className="mt-2 text-2xl font-heading font-bold text-slate-950 dark:text-white">Méthode de progression</h2>
          <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-600 dark:text-slate-300">
            Chaque leçon suit la même logique : préparer, observer, écouter, pratiquer, corriger, puis valider. Cela évite d'accumuler des notions sans maîtrise réelle.
          </p>
        </div>
        <Link href="/lessons" className="inline-flex items-center gap-2 text-sm font-bold text-emerald-800 hover:text-emerald-950 dark:text-gold">
          Voir toutes les leçons
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {previewUnits.map((lesson) => (
          <article key={lesson.id} className="rounded-[1.5rem] border border-emerald-900/10 bg-white p-5 dark:border-white/10 dark:bg-slate-900">
            <div className="flex items-start justify-between gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-2xl bg-emerald-100 text-emerald-900 dark:bg-emerald-950/70 dark:text-gold">
                <BookOpen className="h-5 w-5" />
              </div>
              <span className="rounded-full bg-gold/15 px-3 py-1 text-xs font-bold text-amber-900 dark:text-gold">{lesson.level}</span>
            </div>
            <h3 className="mt-4 text-lg font-bold text-slate-950 dark:text-white">{lesson.title}</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{lesson.intention}</p>
            <div className="mt-4 space-y-2">
              {lesson.lesson.slice(0, 3).map((point) => (
                <p key={point} className="flex gap-2 text-sm text-slate-600 dark:text-slate-300">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-700 dark:text-gold" />
                  {point}
                </p>
              ))}
            </div>
            <div className="mt-4 grid gap-2 rounded-2xl bg-ivory p-3 text-xs leading-5 text-slate-600 dark:bg-white/[0.04] dark:text-slate-300">
              <p className="flex items-center gap-2"><Clock className="h-4 w-4 text-emerald-700 dark:text-gold" /> Durée : {lesson.duration}</p>
              <p className="flex items-start gap-2"><ShieldCheck className="mt-0.5 h-4 w-4 text-emerald-700 dark:text-gold" /> {lesson.validation}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
