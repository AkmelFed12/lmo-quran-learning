import type { QuestionCategory } from "@/lib/question-bank";

export type ArabicModuleId =
  | "placement"
  | "alphabet"
  | "letter_forms"
  | "makharij"
  | "vowels"
  | "tanwin_shadda"
  | "madd"
  | "syllables"
  | "words"
  | "quran_vocab"
  | "phrases"
  | "guided_reading"
  | "tajwid_foundations"
  | "fluency"
  | "revision_exam";

export type ArabicModule = {
  id: ArabicModuleId;
  label: string;
  stage: string;
  description: string;
  objective: string;
  mastery: string;
  minutes: number;
  prerequisiteIds: ArabicModuleId[];
  checkpointCategories: QuestionCategory[];
  passScore: number;
};

export type ArabicPracticeCard = {
  title: string;
  arabic?: string;
  description: string;
  examples?: string[];
};

export const ARABIC_LETTERS = [
  { char: "ا", name: "Alif", file: "/audio/1_alif.mp3", note: "Support et prolongation." },
  { char: "ب", name: "Ba", file: "/audio/2_baa.mp3", note: "Se prononce avec les deux lèvres." },
  { char: "ت", name: "Ta", file: "/audio/3_taa.mp3", note: "Lettre légère." },
  { char: "ث", name: "Tha", file: "/audio/4_thaa.mp3", note: "Son proche du th anglais." },
  { char: "ج", name: "Jim", file: "/audio/5_jeem.mp3", note: "Lettre médiane." },
  { char: "ح", name: "Ha guttural", file: "/audio/6_haa.mp3", note: "Souffle profond de la gorge." },
  { char: "خ", name: "Kha", file: "/audio/7_khaa.mp3", note: "Son guttural marqué." },
  { char: "د", name: "Dal", file: "/audio/8_daal.mp3", note: "Lettre dentale." },
  { char: "ذ", name: "Dhal", file: "/audio/9_zaal.mp3", note: "Son interdental voisé." },
  { char: "ر", name: "Ra", file: "/audio/10_raa.mp3", note: "Lettre roulée avec mesure." },
  { char: "ز", name: "Zay", file: "/audio/11_zaa.mp3", note: "Son z." },
  { char: "س", name: "Sin", file: "/audio/12_seen.mp3", note: "Son s léger." },
  { char: "ش", name: "Shin", file: "/audio/13_sheen.mp3", note: "Son ch." },
  { char: "ص", name: "Sad emphatique", file: "/audio/14_saad.mp3", note: "S emphatique." },
  { char: "ض", name: "Dad emphatique", file: "/audio/15_daad.mp3", note: "D emphatique." },
  { char: "ط", name: "Ta emphatique", file: "/audio/16_taah.mp3", note: "T emphatique." },
  { char: "ظ", name: "Za emphatique", file: "/audio/17_zhaa.mp3", note: "Z emphatique." },
  { char: "ع", name: "Ayn", file: "/audio/18_ain.mp3", note: "Lettre gutturale propre à l'arabe." },
  { char: "غ", name: "Ghayn", file: "/audio/19_ghain.mp3", note: "Son guttural voisé." },
  { char: "ف", name: "Fa", file: "/audio/20_faa.mp3", note: "Lettre labiodentale." },
  { char: "ق", name: "Qaf", file: "/audio/21_qaaf.mp3", note: "Q profond." },
  { char: "ك", name: "Kaf", file: "/audio/22_kaaf.mp3", note: "K léger." },
  { char: "ل", name: "Lam", file: "/audio/23_laam.mp3", note: "Lettre claire ou emphatisée selon le contexte." },
  { char: "م", name: "Mim", file: "/audio/24_meem.mp3", note: "Lettre nasale." },
  { char: "ن", name: "Nun", file: "/audio/25_noon.mp3", note: "Lettre nasale." },
  { char: "ه", name: "Ha doux", file: "/audio/26_haah.mp3", note: "H léger." },
  { char: "و", name: "Waw", file: "/audio/27_waw.mp3", note: "Liaison ou prolongation." },
  { char: "ي", name: "Ya", file: "/audio/28_yaa.mp3", note: "Liaison ou prolongation." },
] as const;

export const ARABIC_MODULES: ArabicModule[] = [
  {
    id: "placement",
    label: "Test de niveau",
    stage: "Diagnostic",
    description: "Identifier le bon point de départ sans brûler les étapes.",
    objective: "Mesurer les bases avant de commencer.",
    mastery: "Répondre aux questions avec calme, sans chercher à deviner.",
    minutes: 5,
    prerequisiteIds: [],
    checkpointCategories: ["arabic_letters", "arabic_vowels", "arabic_syllables", "quran_basics"],
    passScore: 0,
  },
  {
    id: "alphabet",
    label: "Alphabet",
    stage: "Fondation",
    description: "Reconnaître les 28 lettres et leurs sons.",
    objective: "Connaître chaque lettre isolée avant les voyelles.",
    mastery: "Les 28 lettres sont marquées comme apprises.",
    minutes: 12,
    prerequisiteIds: [],
    checkpointCategories: ["arabic_letters"],
    passScore: 100,
  },
  {
    id: "letter_forms",
    label: "Formes des lettres",
    stage: "Fondation",
    description: "Lire les lettres isolées, initiales, médianes et finales.",
    objective: "Reconnaître une même lettre quand elle change de position.",
    mastery: "Identifier les formes d'au moins huit familles de lettres.",
    minutes: 10,
    prerequisiteIds: ["alphabet"],
    checkpointCategories: ["arabic_letters"],
    passScore: 80,
  },
  {
    id: "makharij",
    label: "Points de sortie",
    stage: "Prononciation",
    description: "Découvrir les zones de prononciation utiles à la lecture.",
    objective: "Distinguer les sons de la gorge, de la langue et des lèvres.",
    mastery: "Répéter les groupes sans confondre les sons proches.",
    minutes: 10,
    prerequisiteIds: ["letter_forms"],
    checkpointCategories: ["arabic_letters"],
    passScore: 80,
  },
  {
    id: "vowels",
    label: "Voyelles courtes",
    stage: "Lecture",
    description: "Lire fatha, kasra, damma et sukun.",
    objective: "Assembler une lettre avec une voyelle courte.",
    mastery: "Lire plusieurs lettres avec les quatre signes principaux.",
    minutes: 12,
    prerequisiteIds: ["makharij"],
    checkpointCategories: ["arabic_vowels"],
    passScore: 80,
  },
  {
    id: "tanwin_shadda",
    label: "Tanwin, sukun, shadda",
    stage: "Lecture",
    description: "Comprendre les terminaisons, l'absence de voyelle et le redoublement.",
    objective: "Lire sans confondre son final, arrêt et appui.",
    mastery: "Reconnaître tanwin, sukun et shadda dans des mots courts.",
    minutes: 12,
    prerequisiteIds: ["vowels"],
    checkpointCategories: ["arabic_vowels", "arabic_syllables"],
    passScore: 80,
  },
  {
    id: "madd",
    label: "Prolongations",
    stage: "Lecture",
    description: "Lire alif, waw et ya de prolongation.",
    objective: "Allonger naturellement sans exagération.",
    mastery: "Lire aa, ii et ou avec un rythme stable.",
    minutes: 10,
    prerequisiteIds: ["tanwin_shadda"],
    checkpointCategories: ["arabic_vowels", "arabic_syllables"],
    passScore: 80,
  },
  {
    id: "syllables",
    label: "Syllabes",
    stage: "Assemblage",
    description: "Assembler lettres, voyelles, sukun et prolongations.",
    objective: "Passer de la lettre isolée à la petite unité lisible.",
    mastery: "Lire des syllabes simples et fermées sans hésitation.",
    minutes: 12,
    prerequisiteIds: ["madd"],
    checkpointCategories: ["arabic_syllables"],
    passScore: 80,
  },
  {
    id: "words",
    label: "Premiers mots",
    stage: "Assemblage",
    description: "Lire des mots courts et fréquents.",
    objective: "Lire lentement sans perdre les signes.",
    mastery: "Lire les mots courts avec audio puis sans audio.",
    minutes: 12,
    prerequisiteIds: ["syllables"],
    checkpointCategories: ["arabic_words"],
    passScore: 80,
  },
  {
    id: "quran_vocab",
    label: "Mots du Coran",
    stage: "Compréhension",
    description: "Découvrir du vocabulaire coranique fréquent.",
    objective: "Associer lecture, sens simple et contexte.",
    mastery: "Reconnaître les mots fréquents sans traduction mot à mot excessive.",
    minutes: 10,
    prerequisiteIds: ["words"],
    checkpointCategories: ["arabic_words", "quran_basics"],
    passScore: 80,
  },
  {
    id: "phrases",
    label: "Phrases courtes",
    stage: "Fluidité",
    description: "Lire des groupes de mots avec respiration.",
    objective: "Relier les mots sans perdre la précision.",
    mastery: "Lire une courte expression en gardant le rythme.",
    minutes: 12,
    prerequisiteIds: ["quran_vocab"],
    checkpointCategories: ["arabic_syllables", "arabic_words"],
    passScore: 80,
  },
  {
    id: "guided_reading",
    label: "Lecture accompagnée",
    stage: "Fluidité",
    description: "Écouter, lire, répéter puis relire sans aide.",
    objective: "Installer une routine proche d'un cours accompagné.",
    mastery: "Lire un passage court après écoute modèle.",
    minutes: 15,
    prerequisiteIds: ["phrases"],
    checkpointCategories: ["arabic_words", "quran_basics"],
    passScore: 80,
  },
  {
    id: "tajwid_foundations",
    label: "Tajwid essentiel",
    stage: "Récitation",
    description: "Identifier ikhfa, idgham, iqlab, madd et qalqala.",
    objective: "Comprendre les premières règles sans complexifier.",
    mastery: "Reconnaître la règle et écouter l'exemple.",
    minutes: 15,
    prerequisiteIds: ["guided_reading"],
    checkpointCategories: ["tajwid"],
    passScore: 80,
  },
  {
    id: "fluency",
    label: "Fluidité contrôlée",
    stage: "Récitation",
    description: "Lire plus naturellement tout en gardant la précision.",
    objective: "Stabiliser le rythme, les pauses et la clarté.",
    mastery: "Lire lentement, corriger, puis relire plus fluide.",
    minutes: 15,
    prerequisiteIds: ["tajwid_foundations"],
    checkpointCategories: ["arabic_words", "tajwid"],
    passScore: 80,
  },
  {
    id: "revision_exam",
    label: "Révision finale",
    stage: "Validation",
    description: "Revoir les lacunes et préparer le passage vers le Coran.",
    objective: "Consolider avant d'augmenter la difficulté.",
    mastery: "Terminer une série d'exercices ciblés et relire un passage court.",
    minutes: 18,
    prerequisiteIds: ["fluency"],
    checkpointCategories: ["arabic_letters", "arabic_vowels", "arabic_syllables", "arabic_words", "tajwid", "quran_basics"],
    passScore: 85,
  },
];

export const ARABIC_LEARNING_MODULES = ARABIC_MODULES.filter((module) => module.id !== "placement");

export const MODULE_CATEGORY_UNLOCKS: Partial<Record<ArabicModuleId, QuestionCategory[]>> = {
  alphabet: ["arabic_letters"],
  vowels: ["arabic_vowels"],
  syllables: ["arabic_syllables"],
  words: ["arabic_words"],
  quran_vocab: ["quran_basics"],
  guided_reading: ["arabic_words", "quran_basics"],
  tajwid_foundations: ["tajwid"],
  revision_exam: ["arabic_letters", "arabic_vowels", "arabic_syllables", "arabic_words", "tajwid", "quran_basics", "memorization"],
};

export const ARABIC_PRACTICE_SETS: Record<string, ArabicPracticeCard[]> = {
  letter_forms: [
    { title: "Famille Ba", arabic: "ب بـ ـبـ ـب", description: "Ba, Ta, Tha, Nun et Ya partagent une base proche. Les points changent le son.", examples: ["ب", "ت", "ث", "ن", "ي"] },
    { title: "Famille Jim", arabic: "ج ح خ", description: "Même squelette visuel, mais sortie de son différente.", examples: ["جَ", "حَ", "خَ"] },
    { title: "Famille Dal", arabic: "د ذ", description: "Lettres courtes qui ne s'attachent pas à gauche.", examples: ["دَ", "ذَ"] },
    { title: "Famille Sad", arabic: "ص ض", description: "Forme large, son emphatique. Prenez le temps de distinguer les points.", examples: ["صَ", "ضَ"] },
  ],
  makharij: [
    { title: "Gorge", arabic: "ء ه ع ح غ خ", description: "Ces lettres demandent une attention particulière. Ne forcez pas la gorge.", examples: ["أَ", "هَ", "عَ", "حَ", "غَ", "خَ"] },
    { title: "Langue", arabic: "ل ن ر ت د ط", description: "La langue touche différentes zones du palais ou des dents.", examples: ["لَ", "نَ", "رَ", "تَ", "دَ", "طَ"] },
    { title: "Lèvres", arabic: "ب م و ف", description: "Les lèvres participent fortement à ces sons.", examples: ["بَ", "مَ", "وَ", "فَ"] },
    { title: "Sons proches", arabic: "س ص ت ط د ض", description: "Comparer les sons légers et emphatiques évite les confusions.", examples: ["سَ", "صَ", "تَ", "طَ", "دَ", "ضَ"] },
  ],
  tanwin_shadda: [
    { title: "Tanwin", arabic: "ـً ـٍ ـٌ", description: "Le tanwin ajoute un son final en n : an, in ou oun.", examples: ["كِتَابٌ", "هُدًى", "رَحْمَةٍ"] },
    { title: "Sukun", arabic: "ـْ", description: "Le sukun indique une lettre sans voyelle. On ferme le son proprement.", examples: ["قَلْ", "مِنْ", "عَبْ"] },
    { title: "Shadda", arabic: "ـّ", description: "La shadda redouble la lettre : on appuie puis on relâche.", examples: ["رَبّ", "إِنَّ", "ثُمَّ"] },
    { title: "Lecture lente", arabic: "رَبٌّ", description: "Commencez doucement : consonne, appui, terminaison.", examples: ["رَبٌّ", "حَقٌّ"] },
  ],
  madd: [
    { title: "Alif de madd", arabic: "قَالَ", description: "La fatha suivie d'un alif prolonge le son aa.", examples: ["مَا", "قَالَ", "كَانَ"] },
    { title: "Ya de madd", arabic: "قِيلَ", description: "La kasra suivie d'un ya prolonge le son ii.", examples: ["فِي", "دِين", "قِيلَ"] },
    { title: "Waw de madd", arabic: "يَقُولُ", description: "La damma suivie d'un waw prolonge le son ou.", examples: ["نُور", "يَقُولُ", "رُوح"] },
    { title: "Rythme", arabic: "قَالُوا", description: "Gardez un allongement naturel et régulier.", examples: ["قَالُوا", "آمَنُوا"] },
  ],
  quran_vocab: [
    { title: "Noms fréquents", arabic: "رَبّ  كِتَاب  نُور", description: "Des mots courts utiles pour lire avec plus de sens.", examples: ["رَبّ", "كِتَاب", "نُور"] },
    { title: "Repères de lecture", arabic: "آيَة  سُورَة  قُرْآن", description: "Vocabulaire lié au texte, aux sourates et aux versets.", examples: ["آيَة", "سُورَة", "قُرْآن"] },
    { title: "Valeurs", arabic: "صَبْر  رَحْمَة  هُدًى", description: "Mots à lire lentement, avec attention au sens.", examples: ["صَبْر", "رَحْمَة", "هُدًى"] },
  ],
  fluency: [
    { title: "Écouter", description: "Lancez l'audio une première fois sans répéter. Suivez seulement les sons." },
    { title: "Répéter", description: "Répétez une petite unité trois fois, sans accélérer." },
    { title: "Cacher", description: "Cachez le texte quelques secondes puis relisez de mémoire." },
    { title: "Corriger", description: "Revenez au texte, notez l'erreur, puis relisez une dernière fois." },
  ],
};

const moduleIds = new Set(ARABIC_MODULES.map((module) => module.id));

export function isArabicModuleId(value: unknown): value is ArabicModuleId {
  return typeof value === "string" && moduleIds.has(value as ArabicModuleId);
}

export function isAlphabetMastered(completedLevels: Iterable<string>, lettersLearnedCount: number) {
  return new Set(completedLevels).has("alphabet") || lettersLearnedCount >= ARABIC_LETTERS.length;
}

export function normalizeArabicCompletedLevels(completedLevels: Iterable<string>, lettersLearned: readonly string[]) {
  const completed = new Set(Array.from(completedLevels).filter(isArabicModuleId));
  if (lettersLearned.length >= ARABIC_LETTERS.length) completed.add("alphabet");

  const normalized: ArabicModuleId[] = [];
  for (const curriculumModule of ARABIC_LEARNING_MODULES) {
    const prerequisitesMet = curriculumModule.prerequisiteIds.every((id) => normalized.includes(id));
    if (completed.has(curriculumModule.id) && prerequisitesMet) normalized.push(curriculumModule.id);
  }

  return normalized;
}

export function isArabicModuleUnlocked(module: ArabicModule, completedLevels: Iterable<string>, lettersLearned: readonly string[]) {
  if (module.id === "placement" || module.id === "alphabet") return true;
  const normalized = normalizeArabicCompletedLevels(completedLevels, lettersLearned);
  return module.prerequisiteIds.every((id) => normalized.includes(id));
}

export function getMissingPrerequisite(module: ArabicModule, completedLevels: Iterable<string>, lettersLearned: readonly string[]) {
  const normalized = normalizeArabicCompletedLevels(completedLevels, lettersLearned);
  return module.prerequisiteIds.find((id) => !normalized.includes(id));
}

export function getArabicProgressPercent(completedLevels: Iterable<string>, lettersLearned: readonly string[]) {
  const normalized = normalizeArabicCompletedLevels(completedLevels, lettersLearned);
  return Math.round((normalized.length / ARABIC_LEARNING_MODULES.length) * 100);
}

export function getNextArabicModule(completedLevels: Iterable<string>, lettersLearned: readonly string[]) {
  const normalized = normalizeArabicCompletedLevels(completedLevels, lettersLearned);
  return ARABIC_LEARNING_MODULES.find((module) => !normalized.includes(module.id) && isArabicModuleUnlocked(module, normalized, lettersLearned));
}

export function getUnlockedQuestionCategories(completedLevels: Iterable<string>, lettersLearned: readonly string[]) {
  const categories = new Set<QuestionCategory>(["arabic_letters"]);
  const normalized = normalizeArabicCompletedLevels(completedLevels, lettersLearned);
  normalized.forEach((moduleId) => {
    MODULE_CATEGORY_UNLOCKS[moduleId]?.forEach((category) => categories.add(category));
  });
  return Array.from(categories);
}
