import Link from "next/link";
import { ArrowRight, BookMarked, Library, ShieldCheck } from "lucide-react";
import { libraryResources } from "@/lib/learning-content";

export default function PedagogicalLibrary() {
  const categories = Array.from(new Set(libraryResources.map((resource) => resource.category)));

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <header className="card-premium p-5 sm:p-6">
        <p className="text-sm font-bold uppercase tracking-[0.22em] text-gold">Bibliothèque</p>
        <h1 className="mt-2 text-3xl font-heading font-bold text-slate-950 dark:text-white sm:text-4xl">
          Repères pour apprendre avec sérieux
        </h1>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600 dark:text-slate-300">
          Méthode, sources, conseils pratiques et limites pédagogiques. Cette bibliothèque accompagne l'apprentissage sans remplacer un professeur qualifié.
        </p>
        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl bg-emerald-50 p-4 dark:bg-emerald-950/30">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-800 dark:text-gold">Ressources</p>
            <p className="mt-2 text-2xl font-bold text-slate-950 dark:text-white">{libraryResources.length}</p>
          </div>
          <div className="rounded-2xl bg-gold/15 p-4">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-amber-900 dark:text-gold">Catégories</p>
            <p className="mt-2 text-2xl font-bold text-slate-950 dark:text-white">{categories.length}</p>
          </div>
          <div className="rounded-2xl bg-sky-50 p-4 dark:bg-sky-950/30">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-sky-800 dark:text-sky-100">Usage conseillé</p>
            <p className="mt-2 text-sm font-semibold leading-6 text-slate-700 dark:text-slate-200">Lire une fiche, appliquer une action.</p>
          </div>
        </div>
      </header>

      <section className="rounded-[1.5rem] border border-emerald-900/10 bg-white/85 p-5 shadow-sm dark:border-white/10 dark:bg-slate-900/70">
        <p className="text-sm font-bold text-slate-950 dark:text-white">Repères disponibles</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {categories.map((category) => (
            <span key={category} className="rounded-full bg-emerald-50 px-4 py-2 text-xs font-bold text-emerald-900 dark:bg-emerald-950/50 dark:text-emerald-100">
              {category}
            </span>
          ))}
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        {libraryResources.map((resource) => (
          <Link
            key={resource.id}
            href={resource.href}
            className="group rounded-[1.6rem] border border-emerald-900/10 bg-white p-5 transition hover:-translate-y-0.5 hover:border-gold/60 hover:shadow-xl hover:shadow-emerald-950/10 dark:border-white/10 dark:bg-slate-900"
          >
            <div className="flex items-start gap-4">
              <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-emerald-950 text-gold">
                <Library className="h-5 w-5" />
              </div>
              <div>
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-900 dark:bg-emerald-950/50 dark:text-emerald-100">
                  {resource.category}
                </span>
                <h2 className="mt-3 text-xl font-bold text-slate-950 dark:text-white">{resource.title}</h2>
                <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{resource.summary}</p>
                <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-emerald-800 dark:text-gold">
                  Lire
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                </span>
              </div>
            </div>
          </Link>
        ))}
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        {[
          { icon: BookMarked, title: "Progression courte", text: "Une petite session régulière vaut mieux qu'une longue séance rare." },
          { icon: ShieldCheck, title: "Fiabilité", text: "Les traductions et outils restent des aides : les questions sensibles doivent être vérifiées." },
          { icon: Library, title: "Famille", text: "Pour les enfants, privilégier l'écoute, l'encouragement et les objectifs simples." },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.title} className="rounded-[1.5rem] border border-emerald-900/10 bg-ivory/70 p-5 dark:border-white/10 dark:bg-white/[0.04]">
              <Icon className="h-6 w-6 text-emerald-800 dark:text-gold" />
              <h3 className="mt-3 font-bold text-slate-950 dark:text-white">{item.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{item.text}</p>
            </div>
          );
        })}
      </section>
    </div>
  );
}
