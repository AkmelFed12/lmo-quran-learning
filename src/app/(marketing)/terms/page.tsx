import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Conditions d'utilisation",
  description: "Conditions d'utilisation de LMO Quran Learning.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-ivory pt-24 pb-16 dark:bg-slate-950">
      <article className="section-shell max-w-3xl">
        <div className="card-premium p-6 md:p-10">
          <h1 className="text-4xl font-heading font-bold text-slate-950 dark:text-white">Conditions d'utilisation</h1>
          <div className="mt-6 space-y-5 text-sm leading-8 text-slate-600 dark:text-slate-300">
            <p>LMO Quran Learning est une plateforme éducative dédiée à l'apprentissage de l'arabe, de la lecture du Coran, du tajwid et de la mémorisation.</p>
            <p>Les contenus proposés doivent être utilisés avec respect. Toute publication inappropriée, polémique ou irrespectueuse peut être modérée.</p>
            <p>La plateforme ne remplace pas un professeur qualifié. Pour une correction précise de récitation ou de tajwid, l'accompagnement humain reste recommandé.</p>
            <p>L'accès gratuit peut évoluer avec le temps, mais les changements importants seront annoncés clairement.</p>
          </div>
        </div>
      </article>
    </div>
  );
}
