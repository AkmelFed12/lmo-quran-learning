import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Confidentialité",
  description: "Politique de confidentialité de LMO Quran Learning.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-ivory pt-24 pb-16 dark:bg-slate-950">
      <article className="section-shell max-w-3xl">
        <div className="card-premium p-6 md:p-10">
          <h1 className="text-4xl font-heading font-bold text-slate-950 dark:text-white">Confidentialité</h1>
          <div className="mt-6 space-y-5 text-sm leading-8 text-slate-600 dark:text-slate-300">
            <p>LMO Quran Learning collecte uniquement les informations nécessaires au fonctionnement du compte : e-mail, nom affiché, progression, objectifs et préférences.</p>
            <p>Les données de progression servent à afficher le tableau de bord, les rappels, les badges et les statistiques personnelles.</p>
            <p>La plateforme utilise Firebase pour l'authentification, la base de données et le stockage. Les accès administrateur doivent rester strictement limités aux personnes autorisées.</p>
            <p>LMO Quran Learning garde un parcours d'apprentissage sobre. Les données ne sont pas utilisées pour vendre des emplacements commerciaux.</p>
            <p>Le soutien du projet reste volontaire et séparé de la progression pédagogique.</p>
            <p>Vous pouvez demander la correction ou la suppression de vos données via la page Contact.</p>
          </div>
        </div>
      </article>
    </div>
  );
}
