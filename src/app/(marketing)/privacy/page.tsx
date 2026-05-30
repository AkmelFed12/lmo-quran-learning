import type { Metadata } from "next";
import Link from "next/link";

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
            <p>Si la publicité est activée, LMO Quran Learning peut afficher des annonces afin de maintenir l'accès gratuit. Les régies publicitaires peuvent utiliser des cookies ou identifiants techniques pour mesurer l'affichage, limiter les abus et diffuser des annonces conformes à leurs règles.</p>
            <p>Les annonces ne doivent jamais encourager l'utilisateur à cliquer, gêner la lecture du Coran ou remplacer l'objectif éducatif de la plateforme.</p>
            <p>Les détails pratiques sont présentés dans la page <Link href="/cookies" className="font-semibold text-emerald-800 underline underline-offset-4 dark:text-gold">Cookies et annonces</Link>.</p>
            <p>Vous pouvez demander la correction ou la suppression de vos données via la page Contact.</p>
          </div>
        </div>
      </article>
    </div>
  );
}
