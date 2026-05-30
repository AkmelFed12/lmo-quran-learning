import { revisionProtocol } from "@/lib/quality-content";

export default function RevisionProtocol() {
  return (
    <section className="grid gap-4 lg:grid-cols-[0.7fr_1.3fr]">
      <div className="rounded-[1.7rem] bg-emerald-950 p-5 text-white shadow-xl shadow-emerald-950/10">
        <p className="text-sm font-bold uppercase tracking-[0.22em] text-gold">Méthode</p>
        <h2 className="mt-3 text-2xl font-heading font-bold">Réviser sans se disperser</h2>
        <p className="mt-3 text-sm leading-7 text-emerald-50/80">
          Une bonne révision ne consiste pas à répéter au hasard. Elle suit un ordre simple : écouter, lire, cacher, vérifier.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {revisionProtocol.map((step) => {
          const Icon = step.icon;

          return (
            <article key={step.id} className="rounded-[1.5rem] border border-emerald-900/10 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-slate-900">
              <div className="flex items-start gap-3">
                <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-emerald-100 text-emerald-900 dark:bg-emerald-950/70 dark:text-gold">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-gold">{step.duration}</p>
                  <h3 className="mt-1 font-heading text-lg font-bold text-slate-950 dark:text-white">{step.title}</h3>
                </div>
              </div>
              <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-300">{step.instruction}</p>
            </article>
          );
        })}
      </div>
    </section>
  );
}
