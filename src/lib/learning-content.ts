import type { LucideIcon } from "lucide-react";
import { BookOpen, Brain, CheckCircle2, GraduationCap, Headphones, Library, Medal, ShieldCheck, Star, Target } from "lucide-react";
import { ARABIC_MODULES, type ArabicModuleId } from "@/lib/arabic-curriculum";

export type GuidedTask = {
  id: string;
  title: string;
  description: string;
  href: string;
  minutes: number;
  icon: LucideIcon;
};

export type LessonBlock = {
  id: string;
  title: string;
  level: "Débutant" | "Intermédiaire" | "Avancé";
  objective: string;
  points: string[];
  practice: string;
};

export type LessonUnit = {
  id: string;
  moduleId: ArabicModuleId;
  title: string;
  level: "Fondation" | "Lecture" | "Fluidité" | "Récitation" | "Validation";
  duration: string;
  intention: string;
  teaching?: string[];
  before: string[];
  lesson: string[];
  practice: string[];
  commonMistakes: string[];
  validation: string;
};

export type StudyPlan = {
  id: string;
  title: string;
  audience: string;
  rhythm: string;
  steps: string[];
  checkpoint: string;
};

export type CertificateTrack = {
  id: string;
  title: string;
  level: string;
  requirements: string[];
  proof: string;
};

export type LibraryResource = {
  id: string;
  title: string;
  category: string;
  summary: string;
  href: string;
};

export const guidedTasks: GuidedTask[] = [
  {
    id: "listen",
    title: "Écouter un passage court",
    description: "Écouter une première fois en silence, puis relancer en suivant le texte arabe.",
    href: "/quran",
    minutes: 5,
    icon: Headphones,
  },
  {
    id: "arabic",
    title: "Valider une fondation",
    description: "Reprendre le module arabe en cours et avancer seulement si la base est claire.",
    href: "/arabic",
    minutes: 7,
    icon: BookOpen,
  },
  {
    id: "quiz",
    title: "Faire une série courte",
    description: "Répondre à une courte série, puis noter précisément le thème à revoir.",
    href: "/learning-lab",
    minutes: 8,
    icon: Target,
  },
  {
    id: "revision",
    title: "Revoir une erreur précise",
    description: "Choisir une seule erreur récente et la reprendre avant d'ajouter une notion.",
    href: "/gaps",
    minutes: 5,
    icon: Brain,
  },
];

export const arabicLessonBlocks: LessonBlock[] = [
  {
    id: "alphabet-forms",
    title: "Formes des lettres",
    level: "Débutant",
    objective: "Reconnaître une lettre isolée, initiale, médiane et finale.",
    points: ["Observer la forme", "Comparer les lettres proches", "Lire lentement sans deviner"],
    practice: "Choisir cinq lettres et les écrire dans trois positions.",
  },
  {
    id: "harakat",
    title: "Voyelles courtes",
    level: "Débutant",
    objective: "Lire fatha, kasra, damma et sukun sans confusion.",
    points: ["Fatha : a bref", "Kasra : i bref", "Damma : ou bref", "Sukun : arrêt de la voyelle"],
    practice: "Lire ba, bi, bou puis changer de lettre.",
  },
  {
    id: "makharij-foundation",
    title: "Points de sortie",
    level: "Débutant",
    objective: "Repérer les zones de prononciation sans forcer la voix.",
    points: ["Gorge : ء ه ع ح غ خ", "Langue : sons dentaux et palataux", "Lèvres : ب م و ف"],
    practice: "Comparer deux sons proches, écouter, puis répéter lentement.",
  },
  {
    id: "tanwin-shadda",
    title: "Tanwin et shadda",
    level: "Intermédiaire",
    objective: "Comprendre la terminaison en n et le redoublement d'une lettre.",
    points: ["Tanwin : son final avec n", "Shadda : lettre appuyée", "Lire en deux temps si nécessaire"],
    practice: "Lire des mots courts contenant shadda, puis vérifier à l'audio.",
  },
  {
    id: "madd-foundation",
    title: "Prolongations",
    level: "Intermédiaire",
    objective: "Lire alif, waw et ya de prolongation avec un rythme stable.",
    points: ["Fatha + alif : aa", "Kasra + ya : ii", "Damma + waw : ou"],
    practice: "Lire قَالَ, قِيلَ et نُور en gardant le même tempo.",
  },
  {
    id: "solar-lunar",
    title: "Lettres solaires et lunaires",
    level: "Intermédiaire",
    objective: "Reconnaître quand le lam se prononce ou s'assimile.",
    points: ["Lam lunaire : prononcé", "Lam solaire : assimilé", "Observer la shadda après l'article"],
    practice: "Comparer الْقَمَر et الشَّمْس.",
  },
  {
    id: "quran-vocabulary",
    title: "Mots coraniques fréquents",
    level: "Intermédiaire",
    objective: "Associer quelques mots fréquents à une lecture claire et un sens simple.",
    points: ["Lire sans traduire mécaniquement", "Observer les signes", "Relier le mot au contexte"],
    practice: "Lire رَبّ, نُور, آيَة, سُورَة puis écouter la correction.",
  },
  {
    id: "guided-reading",
    title: "Lecture guidée",
    level: "Avancé",
    objective: "Lire une phrase courte avec rythme et attention.",
    points: ["Ne pas accélérer trop tôt", "Garder les voyelles visibles", "S'arrêter proprement en fin de verset"],
    practice: "Lire une courte ligne, écouter, puis relire.",
  },
  {
    id: "revision-method",
    title: "Révision contrôlée",
    level: "Avancé",
    objective: "Réviser les lacunes avant de passer à une difficulté supérieure.",
    points: ["Revoir l'erreur exacte", "Répéter une petite unité", "Valider avec un exercice ciblé"],
    practice: "Refaire une série de questions sur le dernier module difficile.",
  },
];

export const lessonUnits: LessonUnit[] = [
  {
    id: "alphabet-complete",
    moduleId: "alphabet",
    title: "Alphabet complet, sans précipitation",
    level: "Fondation",
    duration: "2 à 4 séances",
    intention: "Reconnaître chaque lettre, écouter son son, puis la répéter avant de la marquer comme apprise.",
    teaching: [
      "L'alphabet arabe se travaille avec patience. Une lettre n'est pas seulement une forme : elle porte un son, une position de langue et parfois une confusion possible avec une lettre voisine.",
      "La bonne méthode consiste à observer, écouter, répéter, puis reconnaître la lettre sans aide. La vitesse viendra plus tard ; ici, la priorité est la stabilité.",
    ],
    before: ["S'installer dans un endroit calme", "Monter légèrement le volume", "Ne travailler que 7 à 10 lettres par séance"],
    lesson: ["Regarder la lettre seule", "Écouter le son", "Répéter à voix basse", "Comparer avec une lettre proche"],
    practice: ["Toucher une lettre pour écouter", "Répéter trois fois", "Valider avec le bouton uniquement lorsque la lettre est reconnue", "Revenir aux lettres non maîtrisées"],
    commonMistakes: ["Marquer une lettre trop vite", "Confondre ح et ه", "Confondre س et ص", "Oublier les lettres emphatiques"],
    validation: "Les 28 lettres doivent être marquées comme apprises. Le module suivant reste fermé avant cela.",
  },
  {
    id: "letter-shapes",
    moduleId: "letter_forms",
    title: "Formes selon la position",
    level: "Fondation",
    duration: "2 séances",
    intention: "Comprendre qu'une lettre peut changer visuellement selon sa place dans le mot.",
    teaching: [
      "Beaucoup de lettres changent de forme quand elles sont au début, au milieu ou à la fin d'un mot. Il faut donc apprendre à reconnaître la même lettre sous plusieurs habits.",
      "Les points sont essentiels. Une petite différence peut transformer complètement la lecture, comme ب, ت, ث, ن et ي.",
    ],
    before: ["Avoir terminé les 28 lettres", "Revoir les familles de lettres", "Préparer un carnet si possible"],
    lesson: ["Observer la forme isolée", "Comparer initiale, médiane, finale", "Regrouper les familles proches", "Lire sans deviner"],
    practice: ["Écrire ب au début, milieu et fin", "Comparer ج ح خ", "Repérer les lettres qui ne s'attachent pas à gauche"],
    commonMistakes: ["Penser qu'une forme différente est une nouvelle lettre", "Oublier les points", "Lire le mot globalement sans observer les formes"],
    validation: "Réussir le mini-test du module à 80% minimum.",
  },
  {
    id: "makharij-foundation",
    moduleId: "makharij",
    title: "Prononciation et points de sortie",
    level: "Fondation",
    duration: "2 à 3 séances courtes",
    intention: "Installer une prononciation prudente sans forcer la gorge.",
    teaching: [
      "Les points de sortie aident à comprendre d'où vient le son : gorge, langue, lèvres ou cavité buccale. Cette connaissance évite de réciter seulement par imitation visuelle.",
      "Les sons difficiles doivent être abordés avec douceur. Forcer la gorge donne souvent une mauvaise habitude ; écouter puis répéter lentement donne de meilleurs résultats.",
    ],
    before: ["Boire un peu d'eau", "Éviter de crier les sons", "Écouter avant de répéter"],
    lesson: ["Distinguer gorge, langue, lèvres", "Comparer sons légers et emphatiques", "Ralentir les sons difficiles", "Accepter de revenir plusieurs fois"],
    practice: ["Comparer ه et ح", "Comparer ت et ط", "Comparer س et ص", "Lire chaque paire trois fois"],
    commonMistakes: ["Forcer ع et ح", "Transformer ق en ك", "Lire ص comme س", "Aller trop vite"],
    validation: "Réussir le mini-test du module à 80% minimum, puis continuer les répétitions audio.",
  },
  {
    id: "harakat-reading",
    moduleId: "vowels",
    title: "Harakat : fatha, kasra, damma, sukun",
    level: "Lecture",
    duration: "3 séances",
    intention: "Assembler une lettre et son signe sans inventer de voyelle.",
    teaching: [
      "Les harakat donnent la voyelle courte qui accompagne une lettre. Fatha ouvre le son, kasra l'abaisse, damma l'arrondit et sukun ferme la lettre sans ajouter de voyelle.",
      "Le piège le plus fréquent est d'ajouter un son qui n'est pas écrit. En lecture coranique, on lit ce qui est indiqué, sans deviner.",
    ],
    before: ["Avoir revu les sons des lettres", "Choisir une seule lettre de départ", "Lire lentement"],
    lesson: ["Fatha donne a court", "Kasra donne i court", "Damma donne ou court", "Sukun ferme le son"],
    practice: ["Lire بَ بِ بُ بْ", "Changer de lettre", "Écouter puis relire sans audio", "Noter les confusions"],
    commonMistakes: ["Lire damma comme o", "Ajouter une voyelle après sukun", "Confondre kasra et fatha"],
    validation: "Mini-test voyelles à 80% minimum avant tanwin et shadda.",
  },
  {
    id: "tanwin-shadda-practice",
    moduleId: "tanwin_shadda",
    title: "Tanwin, sukun et shadda",
    level: "Lecture",
    duration: "2 séances",
    intention: "Lire les signes qui changent la fin ou l'appui d'un mot.",
    teaching: [
      "Le tanwin ajoute un son final en n. Le sukun indique une lettre sans voyelle. La shadda montre qu'une lettre est appuyée, comme si elle était redoublée.",
      "Ces signes sont petits, mais ils changent fortement la lecture. Il vaut mieux lire lentement que sauter un signe discret.",
    ],
    before: ["Maîtriser les voyelles courtes", "Écouter les exemples", "Travailler lentement"],
    lesson: ["Tanwin ajoute un son n final", "Sukun ferme une lettre", "Shadda appuie puis relâche", "La précision passe avant la vitesse"],
    practice: ["Lire رَبّ", "Lire كِتَابٌ", "Lire مِنْ", "Comparer ثُمَّ et ثُمَ"],
    commonMistakes: ["Oublier le son n du tanwin", "Ajouter une voyelle après sukun", "Lire shadda comme une simple lettre"],
    validation: "Mini-test module à 80% minimum.",
  },
  {
    id: "madd-natural",
    moduleId: "madd",
    title: "Madd naturel",
    level: "Lecture",
    duration: "1 à 2 séances",
    intention: "Prolonger naturellement sans chanter ni couper trop vite.",
    teaching: [
      "Le madd naturel allonge une voyelle quand une lettre de prolongation la suit : alif après fatha, ya après kasra, waw après damma.",
      "L'allongement doit rester mesuré. Trop court, il disparaît ; trop long, il devient exagéré. L'écoute aide à garder le juste rythme.",
    ],
    before: ["Relire fatha, kasra, damma", "Écouter le modèle", "Garder un tempo régulier"],
    lesson: ["Fatha + alif : aa", "Kasra + ya : ii", "Damma + waw : ou", "Le madd naturel reste mesuré"],
    practice: ["Lire مَا", "Lire فِي", "Lire نُور", "Comparer court et long"],
    commonMistakes: ["Allonger toutes les voyelles", "Couper le madd trop tôt", "Exagérer le son"],
    validation: "Mini-test module à 80% minimum.",
  },
  {
    id: "syllables-assembly",
    moduleId: "syllables",
    title: "Assembler les syllabes",
    level: "Lecture",
    duration: "2 à 3 séances",
    intention: "Passer de la lettre isolée à une petite unité lisible, sans perdre les voyelles ni le sukun.",
    teaching: [
      "Une syllabe est une petite unité de lecture. Elle peut être ouverte, comme بَ, ou fermée, comme قَلْ. Savoir les assembler prépare la lecture des mots.",
      "Le regard doit rester précis : lettre, signe, puis lettre suivante. Quand la syllabe est claire, le mot devient beaucoup plus simple à lire.",
    ],
    before: ["Revoir les prolongations", "Lire à voix basse", "Garder le doigt ou le regard sous chaque signe"],
    lesson: ["Une syllabe ouverte se lit avec une voyelle courte", "Une syllabe fermée se termine par un sukun", "Le madd allonge la syllabe", "On assemble sans avaler la dernière lettre"],
    practice: ["Lire بَ بِ بُ", "Lire قَلْ puis رَبْ", "Comparer مَا et مَ", "Répéter chaque syllabe avant de passer à la suivante"],
    commonMistakes: ["Ajouter une voyelle après le sukun", "Lire trop vite", "Confondre voyelle courte et prolongation"],
    validation: "Lire les syllabes proposées puis réussir le mini-test à 80% minimum.",
  },
  {
    id: "first-words-reading",
    moduleId: "words",
    title: "Lire les premiers mots",
    level: "Lecture",
    duration: "3 séances",
    intention: "Lire des mots courts en gardant chaque lettre, chaque signe et chaque appui visibles.",
    teaching: [
      "Lire un mot ne signifie pas le reconnaître globalement. Il faut le construire : première lettre, signe, syllabe, puis liaison avec la suite.",
      "Les mots courts sont parfaits pour installer la méthode. On écoute, on découpe, on lit, puis on relit sans audio.",
    ],
    before: ["Avoir validé les syllabes", "Lire mot par mot", "Écouter l'exemple avant la répétition"],
    lesson: ["Découper le mot en unités", "Repérer shadda, sukun et madd", "Lire lentement puis relier", "Corriger une seule erreur à la fois"],
    practice: ["Lire رَبّ", "Lire قَلَم", "Lire كِتَاب", "Relire le même mot sans audio"],
    commonMistakes: ["Deviner le mot", "Oublier la shadda", "Sauter une voyelle courte", "Changer l'ordre des lettres"],
    validation: "Lire les mots courts avec audio, puis réussir le mini-test du module.",
  },
  {
    id: "quran-vocabulary-foundation",
    moduleId: "quran_vocab",
    title: "Mots fréquents du Coran",
    level: "Lecture",
    duration: "2 séances",
    intention: "Reconnaître quelques mots fréquents tout en gardant une lecture précise.",
    teaching: [
      "Certains mots reviennent souvent dans le Coran. Les reconnaître aide la mémoire, mais la lecture doit rester complète : chaque lettre et chaque signe comptent.",
      "Le sens simple peut soutenir l'apprentissage, sans remplacer une traduction fiable ni une explication savante.",
    ],
    before: ["Ne pas traduire mécaniquement", "Observer les signes", "Relier le sens au contexte avec prudence"],
    lesson: ["Un mot fréquent doit rester lu correctement", "Le sens aide la mémorisation", "Le contexte évite les approximations", "La lecture reste prioritaire"],
    practice: ["Lire رَبّ", "Lire نُور", "Lire آيَة", "Associer chaque mot à un sens simple"],
    commonMistakes: ["Reconnaître le mot sans le lire", "Confondre sens général et traduction exacte", "Aller trop vite parce que le mot semble connu"],
    validation: "Reconnaître et lire les mots fréquents, puis réussir le mini-test à 80% minimum.",
  },
  {
    id: "short-phrases-reading",
    moduleId: "phrases",
    title: "Lire de courtes expressions",
    level: "Fluidité",
    duration: "3 séances",
    intention: "Relier plusieurs mots sans perdre la respiration, les voyelles et les arrêts.",
    teaching: [
      "Une expression courte se lit par petits groupes. L'objectif n'est pas d'aller vite, mais de garder le texte clair du premier mot jusqu'à la pause.",
      "Quand une erreur revient, il faut reprendre le groupe lentement au lieu de continuer comme si elle n'existait pas.",
    ],
    before: ["Choisir une expression courte", "Lire lentement", "Marquer les petites pauses"],
    lesson: ["Lire par groupes courts", "Garder les signes visibles", "Ne pas accélérer au milieu", "Reprendre au début si une erreur se répète"],
    practice: ["Lire بِسْمِ اللهِ", "Lire الْحَمْدُ لِلَّهِ", "Lire رَبِّ الْعَالَمِينَ", "Écouter puis relire sans audio"],
    commonMistakes: ["Avaler la fin du mot", "Relier avant de maîtriser", "Oublier la pause naturelle", "Perdre la shadda dans la liaison"],
    validation: "Lire une expression courte avec calme, puis réussir le mini-test.",
  },
  {
    id: "guided-reading-method",
    moduleId: "guided_reading",
    title: "Lecture accompagnée",
    level: "Fluidité",
    duration: "4 séances",
    intention: "Lire un court passage avec écoute, répétition, masquage et correction.",
    teaching: [
      "La lecture accompagnée se déroule en quatre temps : écouter, suivre le texte, répéter un segment, puis relire avec moins d'aide.",
      "Le masquage du texte ne doit venir qu'après une vraie lecture. Il sert à vérifier la mémoire, pas à deviner.",
    ],
    before: ["Choisir un passage très court", "Ne pas chercher une longue sourate", "Préparer deux répétitions"],
    lesson: ["Écouter sans lire", "Lire en suivant", "Répéter par segment", "Cacher puis relire"],
    practice: ["Travailler un demi-verset", "Corriger un seul type d'erreur", "Revenir au texte", "Relire une dernière fois"],
    commonMistakes: ["Lire trop long", "Répéter sans écouter", "Négliger les pauses", "Passer au tajwid trop tôt"],
    validation: "Mini-test de lecture et repères coraniques à 80% minimum.",
  },
  {
    id: "tajwid-entry",
    moduleId: "tajwid_foundations",
    title: "Entrée dans le tajwid",
    level: "Récitation",
    duration: "5 séances progressives",
    intention: "Reconnaître les règles essentielles sans transformer le tajwid en liste abstraite.",
    teaching: [
      "Le tajwid commence par l'écoute et l'observation. Nommer une règle ne suffit pas : il faut entendre ce qu'elle change dans la récitation.",
      "Les premières règles doivent rester pratiques : ikhfa, idgham, iqlab, madd et qalqala. Chacune s'apprend avec un exemple court.",
    ],
    before: ["Savoir lire des mots courts", "Écouter les exemples", "Accepter de revenir à la lecture lente"],
    lesson: ["Ikhfa : dissimulation mesurée", "Idgham : fusion", "Iqlab : transformation devant ba", "Madd : prolongation", "Qalqala : rebond bref"],
    practice: ["Écouter une règle", "Lire l'exemple", "Dire le nom de la règle", "Faire le quiz ciblé"],
    commonMistakes: ["Réciter la règle sans savoir la reconnaître", "Exagérer la nasalisation", "Ajouter une voyelle à qalqala"],
    validation: "Mini-test tajwid à 80% minimum.",
  },
  {
    id: "controlled-fluency",
    moduleId: "fluency",
    title: "Fluidité contrôlée",
    level: "Récitation",
    duration: "4 séances",
    intention: "Lire plus naturellement sans sacrifier la précision ni les règles déjà apprises.",
    teaching: [
      "La fluidité n'est pas la vitesse. Une bonne lecture garde les lettres, les voyelles, les prolongations et les pauses sans tension.",
      "Chaque passage doit rester court. On corrige un point précis, puis on relit pour mesurer l'amélioration.",
    ],
    before: ["Choisir un passage court", "Relire les règles difficiles", "Préparer une écoute modèle"],
    lesson: ["La fluidité vient après la précision", "La pause doit rester propre", "La voix reste calme", "Chaque erreur répétée devient un point de révision"],
    practice: ["Écouter une fois", "Lire lentement", "Corriger un point", "Relire avec un rythme plus stable"],
    commonMistakes: ["Confondre fluidité et vitesse", "Supprimer les voyelles faibles", "Négliger les pauses", "Passer sur les erreurs sans les noter"],
    validation: "Réussir le mini-test à 80% minimum et relire un court passage avec stabilité.",
  },
  {
    id: "final-revision",
    moduleId: "revision_exam",
    title: "Révision finale du parcours arabe",
    level: "Validation",
    duration: "2 à 4 séances",
    intention: "Reprendre les lacunes avant de passer à une lecture coranique plus autonome.",
    teaching: [
      "La révision finale sert à consolider. Elle n'est pas une formalité : elle révèle les bases qui doivent être reprises avant d'ajouter plus de difficulté.",
      "Un bon score n'a de valeur que si les erreurs sont comprises. Les lacunes deviennent alors une feuille de route claire.",
    ],
    before: ["Consulter les erreurs récentes", "Revoir les modules faibles", "Prévoir une session courte et concentrée"],
    lesson: ["Reprendre l'alphabet si une lettre bloque", "Revoir les voyelles si la lecture hésite", "Relire les règles de tajwid essentielles", "Valider seulement ce qui est stable"],
    practice: ["Faire une série mixte", "Relire un passage court", "Corriger les erreurs notées", "Recommencer avec de nouvelles questions"],
    commonMistakes: ["Chercher un score sans corriger", "Passer trop vite au niveau suivant", "Négliger les bases parce qu'elles semblent simples"],
    validation: "Obtenir au moins 85% au mini-test final et garder une liste claire des points à réviser.",
  },
];

export const studyPlans: StudyPlan[] = [
  {
    id: "beginner-10",
    title: "Débutant 10 minutes",
    audience: "Apprenant qui découvre l'arabe",
    rhythm: "5 jours par semaine",
    steps: ["3 min alphabet ou formes", "3 min écoute et répétition", "2 min mini-exercice", "2 min revoir une erreur"],
    checkpoint: "Ne pas passer aux voyelles tant que les lettres ne sont pas reconnues.",
  },
  {
    id: "reading-20",
    title: "Lecture 20 minutes",
    audience: "Apprenant qui connaît déjà les lettres",
    rhythm: "4 jours par semaine",
    steps: ["5 min voyelles et signes", "5 min syllabes", "5 min mots courts", "5 min lecture accompagnée"],
    checkpoint: "Valider le mini-test du module avant d'ajouter un nouveau signe.",
  },
  {
    id: "quran-30",
    title: "Lecture Coran 30 minutes",
    audience: "Apprenant en lecture accompagnée",
    rhythm: "3 à 5 jours par semaine",
    steps: ["5 min révision arabe", "10 min écoute d'un passage", "10 min répétition segmentée", "5 min note de correction"],
    checkpoint: "Travailler de petites portions et demander correction quand c'est possible.",
  },
  {
    id: "family",
    title: "Enfant ou famille",
    audience: "Parent, enfant ou petit groupe",
    rhythm: "Sessions très courtes",
    steps: ["Choisir 3 lettres", "Écouter ensemble", "Répéter sous forme de jeu", "Féliciter l'effort, pas seulement le score"],
    checkpoint: "Garder une atmosphère calme et régulière.",
  },
];

export const lessonModuleMap = ARABIC_MODULES.filter((module) => module.id !== "placement").map((module) => ({
  id: module.id,
  label: module.label,
  stage: module.stage,
  minutes: module.minutes,
  passScore: module.passScore,
  lesson: lessonUnits.find((unit) => unit.moduleId === module.id),
}));

export const tajwidProgram: LessonBlock[] = [
  {
    id: "ikhfa",
    title: "Ikhfa",
    level: "Débutant",
    objective: "Dissimuler légèrement le noun sakina ou tanwin avec ghunna.",
    points: ["Ne pas prononcer un noun complet", "Garder une nasalisation mesurée", "Écouter plusieurs exemples"],
    practice: "Répéter مِنْ قَبْلِ et أَنْزَلْنَا lentement.",
  },
  {
    id: "idgham",
    title: "Idgham",
    level: "Intermédiaire",
    objective: "Fusionner correctement selon la lettre rencontrée.",
    points: ["Identifier la lettre suivante", "Distinguer avec ou sans ghunna", "Ne pas couper les deux sons"],
    practice: "Comparer مَنْ يَقُولُ et مِنْ رَبِّهِمْ.",
  },
  {
    id: "madd",
    title: "Madd",
    level: "Intermédiaire",
    objective: "Allonger sans exagérer, selon le type de prolongation.",
    points: ["Madd naturel : deux temps", "Observer alif, waw, ya", "Garder un rythme stable"],
    practice: "Lire قَالَ, يَقُولُ, قِيلَ.",
  },
  {
    id: "qalqala",
    title: "Qalqala",
    level: "Avancé",
    objective: "Produire un léger rebond sur les lettres concernées.",
    points: ["Lettres : ق ط ب ج د", "Le rebond reste bref", "Ne pas ajouter une voyelle"],
    practice: "Travailler أَحَدْ et خَلَقْنَا avec écoute.",
  },
];

export const certificateTracks: CertificateTrack[] = [
  {
    id: "alphabet",
    title: "Alphabet arabe",
    level: "Fondation",
    requirements: ["Reconnaître les 28 lettres", "Lire les voyelles courtes", "Réussir une série de questions débutant"],
    proof: "Validation interne après exercice et suivi de progression.",
  },
  {
    id: "reading",
    title: "Lecture débutant",
    level: "Lecture",
    requirements: ["Lire syllabes et mots courts", "Écouter puis relire", "Obtenir au moins 80% sur un test lecture"],
    proof: "Attestation interne de parcours, sans valeur d'ijaza.",
  },
  {
    id: "tajwid-1",
    title: "Tajwid niveau 1",
    level: "Règles essentielles",
    requirements: ["Identifier ikhfa, idgham, iqlab, madd, qalqala", "Réussir le quiz tajwid", "Relire les exemples audio"],
    proof: "Certificat pédagogique interne, à compléter avec un enseignant qualifié.",
  },
  {
    id: "juz-amma",
    title: "Mémorisation Juz Amma",
    level: "Mémorisation",
    requirements: ["Planifier les sourates courtes", "Réviser avec répétition espacée", "Marquer les passages fragiles"],
    proof: "Suivi de progression personnel et révision régulière.",
  },
];

export const libraryResources: LibraryResource[] = [
  {
    id: "method",
    title: "Méthode d'apprentissage",
    category: "Méthode",
    summary: "Lire peu, écouter souvent, répéter avec calme, puis vérifier auprès d'une personne qualifiée.",
    href: "/sources-methodology",
  },
  {
    id: "adab",
    title: "Adab de l'apprentissage",
    category: "Valeurs",
    summary: "Humilité, régularité, intention sincère et respect du texte récité.",
    href: "/about",
  },
  {
    id: "parents",
    title: "Conseils parents et enfants",
    category: "Famille",
    summary: "Sessions courtes, encouragement, écoute répétée et progression adaptée à l'âge.",
    href: "/support",
  },
  {
    id: "sources",
    title: "Sources et limites",
    category: "Fiabilité",
    summary: "La plateforme accompagne l'étude, mais ne remplace pas l'enseignement direct.",
    href: "/sources-methodology",
  },
];

export const platformHealthChecks = [
  { id: "home", label: "Accueil", href: "/" },
  { id: "login", label: "Connexion", href: "/login" },
  { id: "dashboard", label: "Tableau de bord", href: "/dashboard" },
  { id: "daily-quiz", label: "Quiz quotidien", href: "/daily-quiz" },
  { id: "quran-page", label: "Page Coran", href: "/quran" },
  { id: "memorization", label: "Mémorisation", href: "/memorization" },
  { id: "forum", label: "Forum", href: "/forum" },
  { id: "settings", label: "Paramètres", href: "/settings" },
  { id: "quran-api", label: "API Coran", href: "https://api.alquran.cloud/v1/surah/1" },
  { id: "arabic-audio", label: "Audio arabe", href: "/api/audio/arabic?text=%D8%A8%D9%8E" },
  { id: "manifest", label: "Manifest PWA", href: "/manifest.json" },
];

export const certificateIcons = [GraduationCap, Medal, ShieldCheck, Star, CheckCircle2, Library];
