import type { Metadata } from "next";
import EducationalSeoPage from "@/components/marketing/EducationalSeoPage";

export const metadata: Metadata = {
  title: "Méthode d'apprentissage",
  description: "Méthode progressive pour apprendre l'arabe, lire le Coran, écouter, mémoriser et réviser régulièrement.",
};

export default function MethodPage() {
  return (
    <EducationalSeoPage
      eyebrow="Méthode"
      title="Une méthode courte, régulière et vérifiable"
      description="LMO Quran Learning privilégie des sessions simples : bases arabes, lecture accompagnée, écoute, mémorisation puis révision espacée."
      points={[
        "Commencer par les lettres et les voyelles avant d'allonger les lectures.",
        "Écouter un modèle audio puis lire lentement sans chercher la vitesse.",
        "Cacher le texte uniquement après une lecture attentive.",
        "Revoir les erreurs avant d'ajouter une nouvelle notion.",
      ]}
      note="La plateforme accompagne l'apprentissage personnel. Pour la récitation et le tajwid, une correction par un enseignant qualifié reste indispensable."
    />
  );
}
