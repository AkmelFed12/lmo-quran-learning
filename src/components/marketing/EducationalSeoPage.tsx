import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";

type EducationalSeoPageProps = {
  eyebrow: string;
  title: string;
  description: string;
  points: string[];
  note: string;
};

export default function EducationalSeoPage({ eyebrow, title, description, points, note }: EducationalSeoPageProps) {
  return (
    <main className="min-h-screen bg-ivory pt-24 pb-16 dark:bg-slate-950">
      <section className="section-shell max-w-5xl">
        <div className="rounded-[2rem] border border-emerald-900/10 bg-white p-6 shadow-xl shadow-emerald-950/5 dark:border-white/10 dark:bg-slate-900 md:p-10">
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-gold">{eyebrow}</p>
          <h1 className="mt-3 text-4xl font-heading font-bold text-slate-950 dark:text-white md:text-5xl">{title}</h1>
          <p className="mt-5 max-w-3xl text-base leading-8 text-slate-600 dark:text-slate-300">{description}</p>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {points.map((point) => (
              <div key={point} className="rounded-3xl border border-emerald-900/10 bg-ivory/70 p-5 dark:border-white/10 dark:bg-white/[0.04]">
                <p className="flex gap-3 text-sm leading-7 text-slate-700 dark:text-slate-300">
                  <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-emerald-700 dark:text-gold" />
                  {point}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-3xl border border-amber-200 bg-amber-50 p-5 text-sm leading-7 text-amber-950 dark:border-gold/30 dark:bg-gold/10 dark:text-amber-50">
            {note}
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/signup" className="btn-emerald w-full sm:w-auto">
              Commencer gratuitement
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/sources-methodology" className="inline-flex min-h-12 w-full items-center justify-center rounded-full border border-emerald-900/10 px-6 py-3 text-sm font-semibold text-emerald-900 dark:border-white/10 dark:text-emerald-100 sm:w-auto">
              Sources et méthodologie
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
