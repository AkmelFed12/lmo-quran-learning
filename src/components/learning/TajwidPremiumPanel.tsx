import Link from "next/link";
import { ArrowRight, CheckCircle2, Headphones, ShieldCheck } from "lucide-react";
import { tajwidProgram } from "@/lib/learning-content";

export default function TajwidPremiumPanel() {
  return (
    <section className="rounded-[1.8rem] border border-emerald-900/10 bg-white p-5 dark:border-white/10 dark:bg-slate-900 sm:p-6">
      <div className="mb-5">
        <p className="text-sm font-bold uppercase tracking-[0.22em] text-gold">Tajwid niveau 1</p>
        <h3 className="mt-2 text-2xl font-heading font-bold text-slate-950 dark:text-white">Règles, écoute et validation</h3>
        <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-600 dark:text-slate-300">
          Le tajwid commence seulement après les bases de lecture. Chaque règle doit être reconnue dans un exemple, écoutée, répétée, puis vérifiée par un test ciblé.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {tajwidProgram.map((rule) => (
          <article key={rule.id} className="rounded-[1.4rem] border border-emerald-900/10 bg-ivory/70 p-4 dark:border-white/10 dark:bg-white/[0.04]">
            <div className="flex items-start justify-between gap-3">
              <ShieldCheck className="h-5 w-5 text-emerald-800 dark:text-gold" />
              <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-emerald-900 dark:bg-slate-950 dark:text-gold">{rule.level}</span>
            </div>
            <h4 className="mt-3 text-lg font-bold text-slate-950 dark:text-white">{rule.title}</h4>
            <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{rule.objective}</p>
            <div className="mt-3 space-y-1">
              {rule.points.map((point) => (
                <p key={point} className="flex gap-2 text-sm text-slate-600 dark:text-slate-300">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-700 dark:text-gold" />
                  {point}
                </p>
              ))}
            </div>
            <p className="mt-4 flex items-start gap-2 rounded-2xl bg-white p-3 text-xs leading-5 text-slate-600 dark:bg-slate-950 dark:text-slate-300">
              <Headphones className="mt-0.5 h-4 w-4 shrink-0 text-emerald-700 dark:text-gold" />
              {rule.practice}
            </p>
          </article>
        ))}
      </div>

      <div className="mt-5 rounded-[1.4rem] border border-gold/25 bg-gold/10 p-4">
        <p className="text-sm leading-6 text-slate-700 dark:text-slate-200">
          Validation recommandée : réussir le mini-test tajwid à 80% minimum, puis relire les exemples avec audio. Cette validation reste pédagogique et ne remplace pas la correction d'un enseignant qualifié.
        </p>
        <Link href="/learning-lab" className="mt-3 inline-flex items-center gap-2 text-sm font-bold text-emerald-800 hover:text-emerald-950 dark:text-gold">
          Ouvrir le test tajwid
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}
