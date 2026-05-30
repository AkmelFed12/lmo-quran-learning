import { BarChart3, BookOpen, Brain, Headphones, Languages, ShieldCheck } from "lucide-react";

const modules = [
  { icon: Languages, title: "Arabe", desc: "Alphabet, voyelles, syllabes et premiers mots pour lire avec confiance." },
  { icon: BookOpen, title: "Lecture du Coran", desc: "Mushaf numérique, traduction, translittération et lecture accompagnée." },
  { icon: Headphones, title: "Écoute", desc: "Récitations, répétition par verset et vitesse adaptée à l'apprentissage." },
  { icon: Brain, title: "Mémorisation", desc: "Mode masqué, auto-évaluation et révisions espacées." },
  { icon: BarChart3, title: "Progression", desc: "Objectifs simples, historique clair et statistiques lisibles." },
  { icon: ShieldCheck, title: "Confiance", desc: "Sources indiquées, données protégées et limites pédagogiques expliquées." },
];

export default function Features() {
  return (
    <section className="bg-white py-20 dark:bg-slate-950">
      <div className="section-shell">
        <div className="max-w-3xl">
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-gold">Modules</p>
          <h2 className="mt-3 text-3xl font-heading font-bold text-slate-950 dark:text-white md:text-5xl">
            Un environnement unique pour apprendre sans se disperser.
          </h2>
          <p className="mt-4 text-base leading-8 text-slate-600 dark:text-slate-300">
            Chaque module répond à une étape précise : comprendre les bases, lire correctement, écouter, mémoriser, puis consolider.
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {modules.map((item) => {
            const Icon = item.icon;
            return (
              <article key={item.title} className="surface-calm p-5 sm:p-6">
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-emerald-900 text-gold dark:bg-emerald-950">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mt-5 text-lg font-semibold text-slate-950 dark:text-white">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">{item.desc}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
