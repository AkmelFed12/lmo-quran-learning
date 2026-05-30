import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Foire aux questions sur l'utilisation de LMO Quran Learning.",
};

const faqs = [
  {
    q: "Comment commencer à apprendre l'arabe ?",
    a: "Rendez-vous dans la section « Apprendre l'arabe » après connexion. Vous y trouverez l'alphabet interactif, les voyelles, les règles de tajwid et des quiz.",
  },
  {
    q: "Puis-je écouter le Coran ?",
    a: "Oui, dans le module Coran, cliquez sur l'icône de lecture à côté de chaque verset. Vous pouvez choisir parmi plusieurs récitateurs.",
  },
  {
    q: "Comment fonctionne la mémorisation ?",
    a: "Ajoutez des sessions avec les sourates et versets à mémoriser. Le système de répétition espacée planifie automatiquement vos révisions.",
  },
  {
    q: "Est-ce gratuit ?",
    a: "Oui, LMO est entièrement gratuit.",
  },
  {
    q: "Comment contacter le support ?",
    a: "Utilisez la page Contact pour nous envoyer un message ou nous appeler directement.",
  },
];

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 pt-24 pb-16">
      <div className="container mx-auto px-4 max-w-3xl">
        <h1 className="text-4xl font-heading font-bold text-center mb-8 text-slate-800 dark:text-white">
          Foire aux questions
        </h1>
        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <details key={i} className="card-premium p-6 group">
              <summary className="font-semibold text-lg cursor-pointer list-none flex justify-between items-center">
                {faq.q}
                <span className="text-emerald-500 group-open:rotate-90 transition-transform">▶</span>
              </summary>
              <p className="mt-4 text-slate-600 dark:text-slate-400">{faq.a}</p>
            </details>
          ))}
        </div>
      </div>
    </div>
  );
}
