import { BookOpen, Mic, Brain, BarChart3, Globe, Shield } from "lucide-react";

const features = [
  { icon: BookOpen, title: "Apprentissage de l'arabe", desc: "Alphabet interactif, quiz et écriture guidée." },
  { icon: Mic, title: "Lecture du Coran", desc: "Règles de tajwid, correction visuelle, niveaux progressifs." },
  { icon: Brain, title: "Mémorisation intelligente", desc: "Répétition espacée et calendrier automatique." },
  { icon: BarChart3, title: "Suivi quotidien", desc: "Streak, objectifs et statistiques motivantes." },
  { icon: Globe, title: "Disponible partout", desc: "Fonctionne hors-ligne, synchronisation cloud." },
  { icon: Shield, title: "Sécurisé et privé", desc: "Vos données sont chiffrées et jamais partagées." },
];

export default function Features() {
  return (
    <section className="py-24 bg-white dark:bg-slate-900">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-heading font-bold text-center mb-16">
          Une plateforme complète pour votre cheminement spirituel
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((f, i) => (
            <div key={i} className="card-premium p-6 text-center">
              <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                <f.icon className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold mb-2">{f.title}</h3>
              <p className="text-slate-600 dark:text-slate-400">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}