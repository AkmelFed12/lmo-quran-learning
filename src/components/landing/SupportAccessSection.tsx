import Link from "next/link";
import { ArrowRight, HeartHandshake, ShieldCheck } from "lucide-react";

const notes = [
  "Accès gratuit pour apprendre à son rythme.",
  "Soutien facultatif, séparé de la progression.",
  "Annonces placées avec prudence, jamais au coeur de la lecture.",
];

export default function SupportAccessSection() {
  return (
    <section className="bg-ivory py-16 dark:bg-slate-950">
      <div className="section-shell">
        <div className="grid gap-6 rounded-[2rem] border border-emerald-900/10 bg-white p-6 shadow-xl shadow-emerald-950/5 dark:border-white/10 dark:bg-slate-900 md:p-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-gold">Accès gratuit</p>
            <h2 className="mt-3 text-3xl font-heading font-bold text-slate-950 dark:text-white md:text-4xl">
              Un projet ouvert, soutenu avec transparence.
            </h2>
            <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-300">
              LMO Quran Learning peut être soutenu par des contributions volontaires et des annonces discrètes. Le contenu éducatif reste prioritaire.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link href="/support" className="btn-emerald w-full sm:w-auto">
                Soutenir le projet
                <HeartHandshake className="h-4 w-4" />
              </Link>
              <Link href="/cookies" className="inline-flex min-h-12 w-full items-center justify-center rounded-full border border-emerald-900/10 px-5 py-3 text-sm font-semibold text-emerald-900 transition hover:border-gold/40 dark:border-white/10 dark:text-emerald-100 sm:w-auto">
                Cookies et annonces
              </Link>
            </div>
          </div>

          <div className="grid gap-3">
            {notes.map((note) => (
              <div key={note} className="flex gap-3 rounded-3xl border border-emerald-900/10 bg-ivory/70 p-4 text-sm leading-7 text-slate-700 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-300">
                <ShieldCheck className="mt-1 h-4 w-4 shrink-0 text-emerald-700 dark:text-gold" />
                {note}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
