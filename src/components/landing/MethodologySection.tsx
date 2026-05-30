import { BookMarked, Headphones, PenLine, Repeat2, ShieldCheck, Target } from "lucide-react";

const method = [
  { icon: PenLine, title: "Arabe", text: "Construire les bases avec les lettres, les voyelles, les syllabes et les mots." },
  { icon: BookMarked, title: "Lecture", text: "Lire verset par verset avec le texte arabe, la traduction et la translittération." },
  { icon: ShieldCheck, title: "Tajwid", text: "Identifier les règles essentielles avec des exemples colorés et progressifs." },
  { icon: Headphones, title: "Écoute", text: "Écouter un récitateur fiable, ralentir si besoin et répéter plusieurs fois." },
  { icon: Target, title: "Mémorisation", text: "Cacher le texte, réciter, puis s'auto-évaluer avec honnêteté." },
  { icon: Repeat2, title: "Révision", text: "Revenir aux acquis à intervalles réguliers pour éviter l'oubli." },
];

export default function MethodologySection() {
  return (
    <section className="bg-ivory py-20 dark:bg-slate-950">
      <div className="section-shell">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-gold">Méthode d'apprentissage</p>
          <h2 className="mt-3 text-3xl font-heading font-bold text-slate-950 dark:text-white md:text-5xl">
            Une routine simple, répétable et adaptée au mobile.
          </h2>
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {method.map((item) => {
            const Icon = item.icon;
            return (
              <article key={item.title} className="surface-calm p-5">
                <Icon className="h-7 w-7 text-emerald-800 dark:text-gold" />
                <h3 className="mt-4 font-semibold text-slate-950 dark:text-white">{item.title}</h3>
                <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">{item.text}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
