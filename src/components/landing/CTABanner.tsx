import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";

export default function CTABanner() {
  return (
    <section className="bg-ivory py-20 dark:bg-slate-950">
      <div className="section-shell">
        <div className="relative overflow-hidden rounded-[2rem] border border-emerald-900/10 bg-white p-6 text-center shadow-xl shadow-emerald-950/5 dark:border-white/10 dark:bg-slate-900 md:p-10">
          <div className="absolute inset-0 islamic-pattern opacity-70" />
          <div className="relative mx-auto max-w-2xl">
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-emerald-950 text-gold">
              <BookOpen className="h-7 w-7" />
            </div>
            <h2 className="mt-6 text-3xl font-heading font-bold text-slate-950 dark:text-white md:text-5xl">
              Commencez doucement, mais commencez aujourd'hui.
            </h2>
            <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-300 md:text-base">
              Créez votre compte, choisissez une session de 5 minutes et laissez la plateforme vous guider étape par étape.
            </p>
            <Link href="/signup" className="btn-emerald mt-7 w-full sm:w-auto">
              Commencer gratuitement
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
