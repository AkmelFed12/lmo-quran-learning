import type { Metadata } from "next";
import EducationalSeoPage from "@/components/marketing/EducationalSeoPage";

export const metadata: Metadata = {
  title: "Tajwid débutant",
  description: "Découvrir le tajwid pour débutants : ikhfa, idgham, iqlab, madd, qalqala et exercices courts.",
};

export default function TajwidBeginnerPage() {
  return (
    <EducationalSeoPage
      eyebrow="Tajwid"
      title="Découvrir le tajwid avec prudence"
      description="Le tajwid est présenté sous forme de repères pédagogiques : reconnaître la règle, écouter un exemple, puis vérifier avec un enseignant."
      points={[
        "Ikhfa, idgham, iqlab, madd et qalqala expliqués progressivement.",
        "Exemples courts pour éviter la surcharge.",
        "Quiz par règle pour vérifier la reconnaissance.",
        "Mention claire des limites pédagogiques de l'application.",
      ]}
      note="Le tajwid demande une correction orale. Les contenus de LMO Quran Learning ne remplacent pas une transmission directe et qualifiée."
    />
  );
}
