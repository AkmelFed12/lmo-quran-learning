import type { Metadata } from "next";
import EducationalSeoPage from "@/components/marketing/EducationalSeoPage";

export const metadata: Metadata = {
  title: "Apprendre l'arabe",
  description: "Apprendre l'alphabet arabe, les voyelles, les syllabes et les premiers mots pour commencer la lecture du Coran pas à pas.",
};

export default function LearnArabicPage() {
  return (
    <EducationalSeoPage
      eyebrow="Arabe"
      title="Apprendre l'arabe pas à pas"
      description="Le parcours commence avec l'alphabet, les formes des lettres, les voyelles courtes, les syllabes, puis les mots simples."
      points={[
        "Alphabet arabe avec reconnaissance visuelle progressive.",
        "Voyelles courtes : fatha, kasra, damma et sukun.",
        "Syllabes et premiers mots pour construire la lecture.",
        "Questions variées pour repérer les lacunes sans répéter toujours les mêmes exercices.",
      ]}
      note="Les exercices sont éducatifs et doivent rester simples. La prononciation gagne à être corrigée par une personne compétente."
    />
  );
}
