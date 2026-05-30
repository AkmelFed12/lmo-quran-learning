import type { Metadata } from "next";
import EducationalSeoPage from "@/components/marketing/EducationalSeoPage";

export const metadata: Metadata = {
  title: "Mémoriser le Coran",
  description: "Mémoriser le Coran avec de petites portions, écoute, répétition, texte masqué et révision espacée.",
};

export default function MemorizeQuranPage() {
  return (
    <EducationalSeoPage
      eyebrow="Mémorisation"
      title="Mémoriser avec régularité et humilité"
      description="La mémorisation progresse mieux avec de petites portions, un rappel actif et une révision ciblée des passages fragiles."
      points={[
        "Écouter avant de réciter pour installer le rythme.",
        "Répéter une portion courte plutôt qu'accumuler trop vite.",
        "Masquer le texte seulement pour vérifier le rappel.",
        "Noter les passages fragiles pour les revoir plus tôt.",
      ]}
      note="La mémorisation doit rester respectueuse du texte récité. Les erreurs persistantes doivent être corrigées auprès d'un enseignant."
    />
  );
}
