import type { LucideIcon } from "lucide-react";
import { BookCheck, Eye, FileText, Headphones, Smartphone, ShieldCheck } from "lucide-react";

export type QualityItem = {
  id: string;
  title: string;
  description: string;
  status: "stable" | "review" | "planned";
  owner: string;
  icon: LucideIcon;
};

export type QualityStatus = QualityItem["status"];

export type RevisionProtocolStep = {
  id: string;
  title: string;
  duration: string;
  instruction: string;
  icon: LucideIcon;
};

export type QualityBacklogItem = {
  id: string;
  area: "Leçons" | "Interface" | "Admin" | "Mobile" | "Contenu";
  priority: "Haute" | "Moyenne" | "Basse";
  title: string;
  action: string;
};

export const revisionProtocol: RevisionProtocolStep[] = [
  {
    id: "listen",
    title: "Écoute attentive",
    duration: "2 à 4 min",
    instruction: "Écouter le passage sans parler, en suivant le texte arabe du regard.",
    icon: Headphones,
  },
  {
    id: "read",
    title: "Lecture lente",
    duration: "3 à 5 min",
    instruction: "Lire lentement, verset par verset, sans chercher à aller vite.",
    icon: BookCheck,
  },
  {
    id: "hide",
    title: "Rappel sans regarder",
    duration: "2 à 5 min",
    instruction: "Cacher le texte, réciter, puis rouvrir pour corriger précisément.",
    icon: Eye,
  },
  {
    id: "grade",
    title: "Auto-évaluation",
    duration: "1 min",
    instruction: "Noter la qualité de rappel de 1 à 5. Un passage faible revient plus tôt.",
    icon: ShieldCheck,
  },
];

export const contentQualityItems: QualityItem[] = [
  {
    id: "quran-source",
    title: "Sources Coran",
    description: "Contrôler l'affichage arabe, la traduction, la translittération et les récitateurs.",
    status: "stable",
    owner: "Équipe contenu",
    icon: BookCheck,
  },
  {
    id: "tajwid-wording",
    title: "Formulation tajwid",
    description: "Relire chaque règle avec des exemples courts, compréhensibles et pédagogiquement prudents.",
    status: "review",
    owner: "Enseignant / éditeur",
    icon: FileText,
  },
  {
    id: "arabic-audio",
    title: "Audio arabe",
    description: "Vérifier les boutons d'écoute des lettres, voyelles, syllabes, mots et exemples.",
    status: "stable",
    owner: "Technique",
    icon: Headphones,
  },
  {
    id: "mobile-layout",
    title: "Lisibilité mobile",
    description: "Tester 360px, 390px, 430px, tablette et desktop, sans scroll horizontal.",
    status: "review",
    owner: "UI/UX",
    icon: Smartphone,
  },
  {
    id: "teacher-review",
    title: "Validation pédagogique",
    description: "Préparer une liste de contenus à relire par une personne qualifiée avant publication large.",
    status: "planned",
    owner: "Direction pédagogique",
    icon: ShieldCheck,
  },
];

export const mobileQualityChecklist = [
  "Boutons audio utilisables au pouce, avec une hauteur minimale de 48px.",
  "Cartes empilées proprement sous 430px, sans texte coupé.",
  "Mode sombre lisible dans le lecteur Coran et les exercices.",
  "Navigation mobile limitée aux entrées essentielles.",
  "Aucun tableau sans conteneur de défilement horizontal contrôlé.",
  "Animations réduites lorsque le mode faible connexion est activé.",
];

export const editorialStandards = [
  "Écrire sobrement, sans promesse excessive.",
  "Ne pas remplacer l'avis d'un enseignant qualifié.",
  "Séparer clairement apprentissage, mémorisation et tajwid.",
  "Privilégier des phrases courtes et des consignes vérifiables.",
  "Relire orthographe, accents et ponctuation avant publication.",
];

export const qualityBacklog: QualityBacklogItem[] = [
  {
    id: "lesson-objectives",
    area: "Leçons",
    priority: "Haute",
    title: "Objectif clair par leçon",
    action: "Chaque leçon doit annoncer une compétence observable avant la pratique.",
  },
  {
    id: "mobile-course-screen",
    area: "Mobile",
    priority: "Haute",
    title: "Cours visible sans recherche",
    action: "Le contenu actif doit rester proche du haut de l'écran après chaque sélection.",
  },
  {
    id: "quran-night-reading",
    area: "Interface",
    priority: "Haute",
    title: "Lecture Coran lisible en mode sombre",
    action: "Vérifier le contraste arabe, traduction, translittération et boutons audio.",
  },
  {
    id: "admin-publication-gate",
    area: "Admin",
    priority: "Moyenne",
    title: "Publication avec contrôle qualité",
    action: "Empêcher la publication d'un contenu incomplet ou sans note de relecture.",
  },
  {
    id: "tajwid-examples",
    area: "Contenu",
    priority: "Moyenne",
    title: "Exemples tajwid relus",
    action: "Associer chaque règle à un exemple court, audio et une explication prudente.",
  },
];
