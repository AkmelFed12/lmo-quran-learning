export type AdminContentType = "article" | "lesson" | "tajwid" | "quiz" | "source";
export type AdminContentStatus = "draft" | "review" | "published" | "fix";

export type AdminContentItem = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  type: AdminContentType;
  status: AdminContentStatus;
  level: "Débutant" | "Intermédiaire" | "Avancé" | "Tous niveaux";
  module: string;
  qualityNotes: string;
  updatedAt?: unknown;
  updatedBy?: string;
};

export const contentTypeLabels: Record<AdminContentType, string> = {
  article: "Article",
  lesson: "Leçon",
  tajwid: "Tajwid",
  quiz: "Quiz",
  source: "Source",
};

export const contentStatusLabels: Record<AdminContentStatus, string> = {
  draft: "Brouillon",
  review: "En revue",
  published: "Publié",
  fix: "À corriger",
};

export const contentStatusClasses: Record<AdminContentStatus, string> = {
  draft: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200",
  review: "bg-amber-100 text-amber-950 dark:bg-amber-950/40 dark:text-amber-100",
  published: "bg-emerald-100 text-emerald-900 dark:bg-emerald-950/50 dark:text-emerald-100",
  fix: "bg-red-100 text-red-950 dark:bg-red-950/40 dark:text-red-100",
};

export const contentStatuses: AdminContentStatus[] = ["draft", "review", "published", "fix"];

export const seedLearningContents: AdminContentItem[] = [
  {
    id: "arabic-alphabet-foundation",
    slug: "alphabet-arabe-fondations",
    title: "Alphabet arabe : fondations",
    excerpt: "Reconnaître les lettres, leurs noms et leurs premières formes.",
    body: "Objectif : identifier chaque lettre avant de travailler les voyelles. Méthode : observer, écouter, répéter, puis écrire quelques formes simples.",
    type: "lesson",
    status: "review",
    level: "Débutant",
    module: "Arabe",
    qualityNotes: "Faire relire les noms de lettres et les exemples par un enseignant.",
  },
  {
    id: "arabic-harakat-reading",
    slug: "voyelles-courtes-harakat",
    title: "Voyelles courtes et harakat",
    excerpt: "Lire fatha, kasra, damma, sukun et tanwin sans confusion.",
    body: "Objectif : associer chaque signe à un son court. Méthode : lire ba, bi, bou, puis changer de lettre progressivement.",
    type: "lesson",
    status: "review",
    level: "Débutant",
    module: "Arabe",
    qualityNotes: "Ajouter des exemples audio courts et éviter les explications trop longues.",
  },
  {
    id: "tajwid-ikhfa-basics",
    slug: "tajwid-ikhfa-debutant",
    title: "Tajwid : comprendre l'ikhfa",
    excerpt: "Dissimuler légèrement noun sakina ou tanwin avec une nasalisation mesurée.",
    body: "Objectif : reconnaître l'ikhfa dans un exemple simple. La règle doit être pratiquée lentement et validée auprès d'une personne qualifiée.",
    type: "tajwid",
    status: "fix",
    level: "Intermédiaire",
    module: "Tajwid",
    qualityNotes: "Ajouter la liste des lettres et vérifier la formulation pédagogique.",
  },
  {
    id: "quran-reading-method",
    slug: "methode-lecture-coran",
    title: "Méthode de lecture accompagnée",
    excerpt: "Lire, écouter, répéter puis reprendre les passages fragiles.",
    body: "Objectif : installer une routine courte. L'apprenant écoute le verset, lit lentement, cache le texte, puis note la qualité de rappel.",
    type: "lesson",
    status: "published",
    level: "Tous niveaux",
    module: "Coran",
    qualityNotes: "Méthode générale validée pour usage éducatif interne.",
  },
  {
    id: "placement-targeted-test",
    slug: "test-cible-niveau",
    title: "Test ciblé de niveau",
    excerpt: "Évaluer sans répéter les mêmes questions trop rapidement.",
    body: "Objectif : commencer simple, augmenter la difficulté si les réponses sont solides, réduire la difficulté en cas d'erreur répétée.",
    type: "quiz",
    status: "review",
    level: "Tous niveaux",
    module: "Exercices",
    qualityNotes: "Surveiller les questions trop ambiguës dans les retours utilisateurs.",
  },
  {
    id: "sources-methodology-standard",
    slug: "sources-et-limites",
    title: "Sources et limites pédagogiques",
    excerpt: "Rappeler que la plateforme accompagne mais ne remplace pas un enseignant.",
    body: "Chaque page sensible doit mentionner les sources, les limites pédagogiques et l'importance d'une correction humaine qualifiée.",
    type: "source",
    status: "published",
    level: "Tous niveaux",
    module: "Confiance",
    qualityNotes: "Conserver une formulation sobre et institutionnelle.",
  },
];
