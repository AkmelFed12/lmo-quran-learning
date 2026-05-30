export const QUESTION_BANK_SIZE = 500_000;

export type QuestionCategory =
  | "arabic_letters"
  | "arabic_vowels"
  | "arabic_syllables"
  | "arabic_words"
  | "tajwid"
  | "quran_basics"
  | "memorization"
  | "islam_basics";

export interface LearningQuestion {
  id: number;
  category: QuestionCategory;
  difficulty: number;
  level: "Débutant" | "Intermédiaire" | "Avancé";
  skill: string;
  question: string;
  options: string[];
  answer: string;
  explanation: string;
  proof: string;
}

export interface QuestionBatchOptions {
  seed: string | number;
  count: number;
  category?: QuestionCategory | "mixed";
  categories?: QuestionCategory[];
  difficulty?: number;
  excludeIds?: Iterable<number>;
  excludeSignatures?: Iterable<string>;
}

export const QUESTION_CATEGORY_LABELS: Record<QuestionCategory, string> = {
  arabic_letters: "Alphabet arabe",
  arabic_vowels: "Voyelles et harakat",
  arabic_syllables: "Syllabes",
  arabic_words: "Premiers mots",
  tajwid: "Tajwid",
  quran_basics: "Repères coraniques",
  memorization: "Mémorisation",
  islam_basics: "Bases islamiques",
};

export const LEARNING_MODULES = [
  {
    id: "diagnostic",
    title: "Diagnostic de niveau",
    description: "Évalue alphabet, voyelles, syllabes, tajwid et repères coraniques.",
    categories: ["arabic_letters", "arabic_vowels", "arabic_syllables", "tajwid", "quran_basics"] satisfies QuestionCategory[],
  },
  {
    id: "alphabet",
    title: "Alphabet solide",
    description: "Reconnaître les lettres, leurs noms et leurs formes.",
    categories: ["arabic_letters"] satisfies QuestionCategory[],
  },
  {
    id: "harakat",
    title: "Voyelles courtes",
    description: "Lire fatha, kasra, damma, sukun et tanwin.",
    categories: ["arabic_vowels", "arabic_syllables"] satisfies QuestionCategory[],
  },
  {
    id: "reading",
    title: "Lecture guidée",
    description: "Assembler syllabes, mots fréquents et lecture lente.",
    categories: ["arabic_syllables", "arabic_words"] satisfies QuestionCategory[],
  },
  {
    id: "tajwid",
    title: "Tajwid essentiel",
    description: "Comprendre les règles avec exemples progressifs.",
    categories: ["tajwid"] satisfies QuestionCategory[],
  },
  {
    id: "quran",
    title: "Repères du Coran",
    description: "Sourates, ordre, versets et culture de lecture.",
    categories: ["quran_basics"] satisfies QuestionCategory[],
  },
  {
    id: "revision",
    title: "Révision ciblée",
    description: "Méthodes de mémorisation et auto-évaluation.",
    categories: ["memorization"] satisfies QuestionCategory[],
  },
  {
    id: "foundations",
    title: "Fondations islamiques",
    description: "Notions de base utiles au parcours éducatif.",
    categories: ["islam_basics"] satisfies QuestionCategory[],
  },
] as const;

const ARABIC_LETTERS = [
  { char: "ا", name: "Alif", root: "a", note: "lettre de prolongation ou support" },
  { char: "ب", name: "Ba", root: "b", note: "lettre labiale" },
  { char: "ت", name: "Ta léger", root: "t", note: "lettre légère" },
  { char: "ث", name: "Tha", root: "th", note: "son interdental" },
  { char: "ج", name: "Jim", root: "j", note: "lettre médiane" },
  { char: "ح", name: "Ha guttural", root: "h", note: "souffle profond de la gorge" },
  { char: "خ", name: "Kha", root: "kh", note: "son guttural marqué" },
  { char: "د", name: "Dal", root: "d", note: "lettre dentale" },
  { char: "ذ", name: "Dhal", root: "dh", note: "son interdental voisé" },
  { char: "ر", name: "Ra", root: "r", note: "lettre roulée" },
  { char: "ز", name: "Zay", root: "z", note: "son z" },
  { char: "س", name: "Sin", root: "s", note: "son s léger" },
  { char: "ش", name: "Shin", root: "sh", note: "son ch" },
  { char: "ص", name: "Sad emphatique", root: "s", note: "s emphatique" },
  { char: "ض", name: "Dad emphatique", root: "d", note: "d emphatique" },
  { char: "ط", name: "Ta emphatique", root: "t", note: "t emphatique" },
  { char: "ظ", name: "Za emphatique", root: "z", note: "z emphatique" },
  { char: "ع", name: "Ayn", root: "a", note: "lettre gutturale spécifique" },
  { char: "غ", name: "Ghayn", root: "gh", note: "son guttural voisé" },
  { char: "ف", name: "Fa", root: "f", note: "lettre labiodentale" },
  { char: "ق", name: "Qaf", root: "q", note: "q profond" },
  { char: "ك", name: "Kaf", root: "k", note: "k léger" },
  { char: "ل", name: "Lam", root: "l", note: "lettre claire ou emphatisée selon contexte" },
  { char: "م", name: "Mim", root: "m", note: "lettre nasale" },
  { char: "ن", name: "Nun", root: "n", note: "lettre nasale" },
  { char: "ه", name: "Ha doux", root: "h", note: "h léger" },
  { char: "و", name: "Waw", root: "w", note: "lettre de liaison ou prolongation" },
  { char: "ي", name: "Ya", root: "y", note: "lettre de liaison ou prolongation" },
] as const;

const CONSONANTS = ARABIC_LETTERS.filter((letter) => letter.char !== "ا");

const VOWELS = [
  { name: "Fatha", mark: "َ", sound: "a bref", transliteration: "a", explanation: "La fatha place un son a court au-dessus de la lettre." },
  { name: "Kasra", mark: "ِ", sound: "i bref", transliteration: "i", explanation: "La kasra place un son i court sous la lettre." },
  { name: "Damma", mark: "ُ", sound: "ou bref", transliteration: "u", explanation: "La damma place un son ou court au-dessus de la lettre." },
  { name: "Sukun", mark: "ْ", sound: "absence de voyelle", transliteration: "", explanation: "Le sukun indique que la lettre se lit sans voyelle courte." },
  { name: "Fathatan", mark: "ً", sound: "an", transliteration: "an", explanation: "Le fathatan ajoute une terminaison an." },
  { name: "Kasratan", mark: "ٍ", sound: "in", transliteration: "in", explanation: "Le kasratan ajoute une terminaison in." },
  { name: "Dammatan", mark: "ٌ", sound: "oun", transliteration: "un", explanation: "Le dammatan ajoute une terminaison oun." },
] as const;

const WORD_BANK = [
  { arabic: "رَبّ", transliteration: "rabb", meaning: "Seigneur" },
  { arabic: "قَلَم", transliteration: "qalam", meaning: "stylo" },
  { arabic: "كِتَاب", transliteration: "kitab", meaning: "livre" },
  { arabic: "نُور", transliteration: "nour", meaning: "lumière" },
  { arabic: "سَلَام", transliteration: "salam", meaning: "paix" },
  { arabic: "قُرْآن", transliteration: "qur'an", meaning: "Coran" },
  { arabic: "عِلْم", transliteration: "ilm", meaning: "science" },
  { arabic: "قَلْب", transliteration: "qalb", meaning: "cœur" },
  { arabic: "بَيْت", transliteration: "bayt", meaning: "maison" },
  { arabic: "مَسْجِد", transliteration: "masjid", meaning: "mosquée" },
  { arabic: "صَبْر", transliteration: "sabr", meaning: "patience" },
  { arabic: "رَحْمَة", transliteration: "rahma", meaning: "miséricorde" },
  { arabic: "هُدًى", transliteration: "houda", meaning: "guidée" },
  { arabic: "آيَة", transliteration: "aya", meaning: "verset / signe" },
  { arabic: "سُورَة", transliteration: "soura", meaning: "sourate" },
  { arabic: "دِين", transliteration: "din", meaning: "religion" },
] as const;

const TAJWID_RULES = [
  { name: "Ikhfa", definition: "dissimuler légèrement le noun sakina ou tanwin avant certaines lettres", example: "مِنْ شَرِّ", color: "vert", difficulty: 3 },
  { name: "Idgham", definition: "fusionner le noun sakina ou tanwin dans la lettre suivante", example: "مَنْ يَقُولُ", color: "bleu", difficulty: 3 },
  { name: "Iqlab", definition: "transformer le son noun en mim devant la lettre ba", example: "مِنْ بَعْدِ", color: "or", difficulty: 3 },
  { name: "Izhar", definition: "prononcer clairement le noun sakina ou tanwin", example: "مِنْ هَادٍ", color: "ivoire", difficulty: 2 },
  { name: "Madd naturel", definition: "prolonger naturellement deux temps", example: "قَالَ", color: "cyan", difficulty: 2 },
  { name: "Qalqala", definition: "faire rebondir légèrement certaines lettres lorsqu'elles sont sakin", example: "قَدْ", color: "rose", difficulty: 3 },
  { name: "Ghounna", definition: "faire résonner le son nasal du mim ou noun", example: "إِنَّ", color: "violet", difficulty: 2 },
  { name: "Lam solaire", definition: "assimiler le lam de l'article devant une lettre solaire", example: "الشَّمْس", color: "ambre", difficulty: 2 },
  { name: "Lam lunaire", definition: "prononcer clairement le lam de l'article devant une lettre lunaire", example: "الْقَمَر", color: "indigo", difficulty: 2 },
] as const;

const SURAHS = [
  { order: 1, name: "Al-Fatiha", arabic: "الفاتحة", verses: 7, revelation: "Mecquoise" },
  { order: 2, name: "Al-Baqara", arabic: "البقرة", verses: 286, revelation: "Médinoise" },
  { order: 3, name: "Ali 'Imran", arabic: "آل عمران", verses: 200, revelation: "Médinoise" },
  { order: 4, name: "An-Nisa", arabic: "النساء", verses: 176, revelation: "Médinoise" },
  { order: 18, name: "Al-Kahf", arabic: "الكهف", verses: 110, revelation: "Mecquoise" },
  { order: 36, name: "Ya-Sin", arabic: "يس", verses: 83, revelation: "Mecquoise" },
  { order: 55, name: "Ar-Rahman", arabic: "الرحمن", verses: 78, revelation: "Médinoise" },
  { order: 67, name: "Al-Mulk", arabic: "الملك", verses: 30, revelation: "Mecquoise" },
  { order: 78, name: "An-Naba", arabic: "النبأ", verses: 40, revelation: "Mecquoise" },
  { order: 87, name: "Al-A'la", arabic: "الأعلى", verses: 19, revelation: "Mecquoise" },
  { order: 93, name: "Ad-Duha", arabic: "الضحى", verses: 11, revelation: "Mecquoise" },
  { order: 94, name: "Ash-Sharh", arabic: "الشرح", verses: 8, revelation: "Mecquoise" },
  { order: 95, name: "At-Tin", arabic: "التين", verses: 8, revelation: "Mecquoise" },
  { order: 96, name: "Al-'Alaq", arabic: "العلق", verses: 19, revelation: "Mecquoise" },
  { order: 97, name: "Al-Qadr", arabic: "القدر", verses: 5, revelation: "Mecquoise" },
  { order: 99, name: "Az-Zalzala", arabic: "الزلزلة", verses: 8, revelation: "Médinoise" },
  { order: 100, name: "Al-'Adiyat", arabic: "العاديات", verses: 11, revelation: "Mecquoise" },
  { order: 103, name: "Al-'Asr", arabic: "العصر", verses: 3, revelation: "Mecquoise" },
  { order: 108, name: "Al-Kawthar", arabic: "الكوثر", verses: 3, revelation: "Mecquoise" },
  { order: 112, name: "Al-Ikhlas", arabic: "الإخلاص", verses: 4, revelation: "Mecquoise" },
  { order: 113, name: "Al-Falaq", arabic: "الفلق", verses: 5, revelation: "Mecquoise" },
  { order: 114, name: "An-Nas", arabic: "الناس", verses: 6, revelation: "Mecquoise" },
] as const;

const MEMORIZATION_SCENARIOS = [
  { scenario: "Vous oubliez souvent la fin d'un verset appris hier.", answer: "Réviser par petits segments puis relier les segments", reason: "Le rappel actif par segments renforce la mémorisation durable." },
  { scenario: "Vous voulez mémoriser une courte sourate sans vous fatiguer.", answer: "Écouter, répéter, cacher le texte puis s'auto-évaluer", reason: "Cette boucle combine écoute, lecture et rappel." },
  { scenario: "Vous confondez deux versets proches.", answer: "Comparer les deux passages et noter le mot distinctif", reason: "Identifier la différence précise réduit les confusions." },
  { scenario: "Vous avez seulement cinq minutes aujourd'hui.", answer: "Relire une petite portion déjà apprise avec concentration", reason: "La régularité courte vaut mieux qu'une longue session rare." },
  { scenario: "Vous maîtrisez un passage mais manquez de fluidité.", answer: "Lire lentement avec audio puis accélérer progressivement", reason: "La fluidité se construit après l'exactitude." },
  { scenario: "Vous reprenez après plusieurs jours d'arrêt.", answer: "Faire une révision douce avant d'ajouter du nouveau", reason: "La consolidation précède l'ajout de nouvelles portions." },
] as const;

const ISLAM_FACTS = [
  { question: "Combien y a-t-il de piliers de l'Islam ?", answer: "5", explanation: "Les piliers connus sont la shahada, la prière, la zakat, le jeûne de Ramadan et le pèlerinage pour qui en a la capacité." },
  { question: "Quelle est la direction de la prière ?", answer: "La Kaaba à La Mecque", explanation: "La qibla oriente la prière vers la Kaaba." },
  { question: "Quel mois est consacré au jeûne obligatoire ?", answer: "Ramadan", explanation: "Le jeûne du mois de Ramadan fait partie des piliers de l'Islam." },
  { question: "Comment appelle-t-on l'appel à la prière ?", answer: "Adhan", explanation: "L'adhan annonce l'entrée du temps de prière." },
  { question: "Quelle formule ouvre la récitation de nombreuses sourates ?", answer: "Bismillah", explanation: "Bismillah signifie commencer au nom d'Allah." },
  { question: "Quel livre est récité et mémorisé par les musulmans ?", answer: "Le Coran", explanation: "Le Coran est au centre de la récitation et de l'apprentissage." },
  { question: "Quelle attitude doit accompagner l'apprentissage religieux ?", answer: "Humilité et vérification auprès de personnes qualifiées", explanation: "Une plateforme aide, mais elle ne remplace pas un enseignant qualifié." },
] as const;

const LETTER_NAME_STEMS = [
  "Quel est le nom de la lettre {char} ?",
  "Comment appelle-t-on la lettre {char} ?",
  "Quel nom correspond à {char} ?",
  "Quel est le nom correct de {char} ?",
  "La lettre {char} porte quel nom ?",
  "Quel nom faut-il associer à {char} ?",
  "À l'oral, quel nom donne-t-on à {char} ?",
  "Quelle réponse nomme correctement {char} ?",
] as const;

const LETTER_CHAR_STEMS = [
  "Quelle est l'écriture correcte de {name} ?",
  "Quelle lettre correspond au nom {name} ?",
  "{name} s'écrit comment en arabe ?",
  "Quelle forme arabe représente {name} ?",
  "Quelle lettre faut-il lire pour {name} ?",
  "À l'oral, quelle lettre correspond à {name} ?",
  "Quel symbole arabe porte le nom {name} ?",
  "Retrouvez l'écriture de {name}.",
] as const;

const LETTER_NOTE_STEMS = [
  "Quel repère décrit la lettre {name} ?",
  "Quelle indication aide à reconnaître {name} ?",
  "Quel indice correspond à {name} ?",
  "{name} est associé à quel repère ?",
] as const;

const VOWEL_STEMS = [
  "Comment se lit {syllable} ?",
  "Quel son entend-on dans {syllable} ?",
  "Quelle valeur donne le signe placé sur {char} ?",
  "Quel son correspond à {syllable} ?",
  "{syllable} se lit avec quel son ?",
  "Quelle lecture convient pour {syllable} ?",
] as const;

const VOWEL_MARK_STEMS = [
  "Quel signe correspond à {name} ?",
  "Quelle marque représente {name} ?",
  "{name} s'écrit avec quel signe ?",
  "Quel signe faut-il reconnaître pour {sound} ?",
] as const;

const SYLLABLE_STEMS = [
  "Quelle lecture convient pour {syllable} ?",
  "Comment lit-on la syllabe {syllable} ?",
  "Quelle est la lecture la plus juste de {syllable} ?",
  "Quelle réponse correspond à {syllable} ?",
  "{syllable} se lit comment ?",
] as const;

const WORD_STEMS = [
  "Que signifie le mot {arabic} ?",
  "Quel est le sens de {arabic} ?",
  "Quel sens associer à {arabic} ?",
  "{arabic} signifie quoi ?",
] as const;

const WORD_READING_STEMS = [
  "Quelle aide de lecture correspond à {arabic} ?",
  "Comment peut-on transcrire {arabic} pour guider la lecture ?",
  "Quelle translittération convient pour {arabic} ?",
  "{arabic} se lit comment en translittération simple ?",
] as const;

const WORD_ARABIC_STEMS = [
  "Quel mot arabe signifie « {meaning} » ?",
  "Quelle écriture arabe correspond au sens « {meaning} » ?",
  "Quel mot faut-il lire pour le sens « {meaning} » ?",
  "Retrouvez le mot arabe qui signifie « {meaning} ».",
] as const;

const TAJWID_STEMS = [
  "Quelle règle correspond à cette description : {definition} ?",
  "Quelle règle travaille-t-on dans l'exemple {example} ?",
  "Quelle règle faut-il reconnaître ici : {definition} ?",
  "Quel nom porte cette règle de récitation : {definition} ?",
  "Quelle règle de tajwid correspond à {example} ?",
] as const;

const QURAN_VERSE_STEMS = [
  "Combien de versets contient la sourate {name} ({arabic}) ?",
  "Quel est le nombre de versets de {name} ?",
  "{name} contient combien de versets ?",
  "Quel repère donne le nombre de versets de {name} ?",
] as const;

const QURAN_REVELATION_STEMS = [
  "La sourate {name} est généralement classée comment ?",
  "Quelle classification retient-on souvent pour {name} ?",
  "{name} est une sourate de quelle classification ?",
  "Dans les repères de lecture, {name} est une sourate...",
] as const;

const QURAN_ORDER_STEMS = [
  "Quelle sourate porte le numéro {order} dans le mushaf ?",
  "Quelle est la sourate numéro {order} ?",
  "Quel nom correspond au rang {order} dans l'ordre du mushaf ?",
  "La sourate numéro {order} s'appelle comment ?",
] as const;

const QURAN_ARABIC_NAME_STEMS = [
  "Quelle écriture arabe correspond à {name} ?",
  "{name} s'écrit comment en arabe ?",
  "Quel nom arabe correspond à {name} ?",
  "Retrouvez l'écriture arabe de {name}.",
] as const;

const MEMORIZATION_STEMS = [
  "Quelle méthode convient le mieux ? {scenario}",
  "Quelle stratégie adopter ? {scenario}",
  "Que faire dans ce cas ? {scenario}",
  "Quelle réponse aide le mieux ici ? {scenario}",
] as const;

const ISLAM_STEMS = [
  "{question}",
  "Quelle est la bonne réponse : {question}",
  "Quel repère convient : {question}",
  "Répondez directement : {question}",
] as const;

export function stringToSeed(input: string): number {
  let hash = 2166136261;
  for (let index = 0; index < input.length; index += 1) {
    hash ^= input.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function normalizeSeed(seed: string | number): number {
  return typeof seed === "number" ? seed >>> 0 : stringToSeed(seed);
}

function normalizeQuestionId(id: number): number {
  const rounded = Number.isFinite(id) ? Math.trunc(id) : 1;
  return ((rounded - 1) % QUESTION_BANK_SIZE + QUESTION_BANK_SIZE) % QUESTION_BANK_SIZE + 1;
}

function mulberry32(seed: number) {
  let state = seed >>> 0;
  return () => {
    state += 0x6d2b79f5;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

function pick<T>(items: readonly T[], seed: number): T {
  return items[Math.abs(seed) % items.length];
}

function shuffleWithSeed<T>(items: readonly T[], seed: number): T[] {
  const result = [...items];
  const random = mulberry32(seed);
  for (let index = result.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    [result[index], result[swapIndex]] = [result[swapIndex], result[index]];
  }
  return result;
}

function makeOptions(correct: string, pool: readonly string[], seed: number, size = 4): string[] {
  const uniquePool = Array.from(new Set(pool.filter((item) => item && item !== correct)));
  const distractors = shuffleWithSeed(uniquePool, seed).slice(0, size - 1);
  return shuffleWithSeed([correct, ...distractors], seed + 1337);
}

function getLevel(difficulty: number): LearningQuestion["level"] {
  if (difficulty <= 2) return "Débutant";
  if (difficulty <= 4) return "Intermédiaire";
  return "Avancé";
}

function renderStem(stems: readonly string[], variant: number, id: number, values: Record<string, string | number>): string {
  const stem = pick(stems, variant * 5 + id);
  return Object.entries(values).reduce(
    (text, [key, value]) => text.replaceAll(`{${key}}`, String(value)),
    stem
  );
}

function buildQuestion(
  id: number,
  category: QuestionCategory,
  difficulty: number,
  skill: string,
  question: string,
  options: string[],
  answer: string,
  explanation: string,
  proof: string
): LearningQuestion {
  return {
    id,
    category,
    difficulty,
    level: getLevel(difficulty),
    skill,
    question,
    options,
    answer,
    explanation,
    proof,
  };
}

function buildLetterNameQuestion(id: number, variant: number): LearningQuestion {
  const letter = pick(ARABIC_LETTERS, id + variant * 3);
  const answer = letter.name;
  return buildQuestion(
    id,
    "arabic_letters",
    1 + (variant % 5),
    "Reconnaissance des lettres",
    renderStem(LETTER_NAME_STEMS, variant, id, { char: letter.char }),
    makeOptions(answer, ARABIC_LETTERS.map((item) => item.name), id),
    answer,
    `${letter.char} se nomme ${letter.name}. Indice pédagogique : ${letter.note}.`,
    "Alphabet arabe - reconnaissance visuelle"
  );
}

function buildLetterCharQuestion(id: number, variant: number): LearningQuestion {
  const letter = pick(ARABIC_LETTERS, id * 5 + variant);
  const answer = letter.char;
  return buildQuestion(
    id,
    "arabic_letters",
    1 + (variant % 5),
    "Association nom-lettre",
    renderStem(LETTER_CHAR_STEMS, variant, id, { name: letter.name }),
    makeOptions(answer, ARABIC_LETTERS.map((item) => item.char), id),
    answer,
    `${letter.name} s'écrit ${letter.char}. Cette association doit devenir automatique avant la lecture fluide.`,
    "Alphabet arabe - association"
  );
}

function buildLetterNoteQuestion(id: number, variant: number): LearningQuestion {
  const letter = pick(ARABIC_LETTERS, id * 11 + variant);
  const answer = letter.note;
  return buildQuestion(
    id,
    "arabic_letters",
    1 + (variant % 4),
    "Repères de lettres",
    renderStem(LETTER_NOTE_STEMS, variant, id, { name: letter.name }),
    makeOptions(answer, ARABIC_LETTERS.map((item) => item.note), id),
    answer,
    `${letter.name} : ${letter.note}. Ce repère aide à distinguer les lettres proches.`,
    "Alphabet arabe - repères de prononciation"
  );
}

function buildVowelQuestion(id: number, variant: number): LearningQuestion {
  const letter = pick(CONSONANTS, id + variant);
  const vowel = pick(VOWELS, id * 2 + variant);
  const answer = vowel.sound;
  return buildQuestion(
    id,
    "arabic_vowels",
    1 + (variant % 5),
    "Voyelles courtes",
    renderStem(VOWEL_STEMS, variant, id, { syllable: `${letter.char}${vowel.mark}`, char: letter.char }),
    makeOptions(answer, VOWELS.map((item) => item.sound), id),
    answer,
    `${letter.char}${vowel.mark} se lit avec ${vowel.name} : ${vowel.explanation}`,
    "Harakat - lecture des voyelles"
  );
}

function buildVowelMarkQuestion(id: number, variant: number): LearningQuestion {
  const vowel = pick(VOWELS, id * 3 + variant);
  const answer = vowel.mark;
  return buildQuestion(
    id,
    "arabic_vowels",
    1 + (variant % 4),
    "Signes vocaliques",
    renderStem(VOWEL_MARK_STEMS, variant, id, { name: vowel.name, sound: vowel.sound }),
    makeOptions(answer, VOWELS.map((item) => item.mark), id),
    answer,
    `${vowel.name} se note ${vowel.mark}. ${vowel.explanation}`,
    "Harakat - reconnaissance des signes"
  );
}

function buildSyllableQuestion(id: number, variant: number): LearningQuestion {
  const letter = pick(CONSONANTS, id * 7 + variant);
  const vowel = pick(VOWELS.slice(0, 4), id + variant * 11);
  const syllable = `${letter.char}${vowel.mark}`;
  const answer = vowel.transliteration ? `${letter.root}${vowel.transliteration}` : `${letter.root} sans voyelle`;
  const pool = CONSONANTS.slice(0, 12).flatMap((item) =>
    VOWELS.slice(0, 4).map((vowelItem) => vowelItem.transliteration ? `${item.root}${vowelItem.transliteration}` : `${item.root} sans voyelle`)
  );
  return buildQuestion(
    id,
    "arabic_syllables",
    1 + (variant % 5),
    "Assemblage lettre-voyelle",
    renderStem(SYLLABLE_STEMS, variant, id, { syllable }),
    makeOptions(answer, pool, id),
    answer,
    `La lettre ${letter.name} prend ici ${vowel.name}. On assemble la consonne et le signe vocalique.`,
    "Lecture syllabique"
  );
}

function buildWordQuestion(id: number, variant: number): LearningQuestion {
  const word = pick(WORD_BANK, id + variant * 13);
  const askMeaning = variant % 2 === 0;
  const answer = askMeaning ? word.meaning : word.transliteration;
  const pool = askMeaning ? WORD_BANK.map((item) => item.meaning) : WORD_BANK.map((item) => item.transliteration);
  return buildQuestion(
    id,
    "arabic_words",
    2 + (variant % 4),
    askMeaning ? "Compréhension de mots fréquents" : "Translittération utile",
    askMeaning
      ? renderStem(WORD_STEMS, variant, id, { arabic: word.arabic })
      : renderStem(WORD_READING_STEMS, variant, id, { arabic: word.arabic }),
    makeOptions(answer, pool, id),
    answer,
    `${word.arabic} se lit ${word.transliteration} et signifie « ${word.meaning} ».`,
    "Vocabulaire arabe de base"
  );
}

function buildWordArabicQuestion(id: number, variant: number): LearningQuestion {
  const word = pick(WORD_BANK, id * 17 + variant);
  return buildQuestion(
    id,
    "arabic_words",
    2 + (variant % 4),
    "Vocabulaire arabe",
    renderStem(WORD_ARABIC_STEMS, variant, id, { meaning: word.meaning }),
    makeOptions(word.arabic, WORD_BANK.map((item) => item.arabic), id),
    word.arabic,
    `Le mot « ${word.meaning} » correspond ici à ${word.arabic}, lu ${word.transliteration}.`,
    "Vocabulaire arabe de base"
  );
}

function buildTajwidQuestion(id: number, variant: number): LearningQuestion {
  const rule = pick(TAJWID_RULES, id + variant * 17);
  const mode = variant % 3;
  const question =
    mode === 0
      ? renderStem(TAJWID_STEMS, variant, id, { definition: rule.definition, example: rule.example })
      : mode === 1
        ? renderStem(TAJWID_STEMS, variant + 1, id, { definition: rule.definition, example: rule.example })
        : `Quelle règle est associée à l'exemple ${rule.example} ?`;
  return buildQuestion(
    id,
    "tajwid",
    Math.min(5, rule.difficulty + (variant % 3)),
    "Règles essentielles de tajwid",
    question,
    makeOptions(rule.name, TAJWID_RULES.map((item) => item.name), id),
    rule.name,
    `${rule.name} consiste à ${rule.definition}. Exemple d'étude : ${rule.example}.`,
    "Tajwid - règles pédagogiques"
  );
}

function buildQuranBasicsQuestion(id: number, variant: number): LearningQuestion {
  const surah = pick(SURAHS, id + variant * 19);
  const mode = variant % 3;
  if (mode === 0) {
    const answer = `${surah.verses}`;
    return buildQuestion(
      id,
      "quran_basics",
      1 + (variant % 5),
      "Repères de sourates",
      renderStem(QURAN_VERSE_STEMS, variant, id, { name: surah.name, arabic: surah.arabic }),
      makeOptions(answer, SURAHS.map((item) => `${item.verses}`), id),
      answer,
      `${surah.name} contient ${surah.verses} versets selon le découpage standard du mushaf.`,
      "Repères coraniques - nombre de versets"
    );
  }

  if (mode === 1) {
    return buildQuestion(
      id,
      "quran_basics",
      1 + (variant % 5),
      "Repères de sourates",
      renderStem(QURAN_REVELATION_STEMS, variant, id, { name: surah.name }),
      makeOptions(surah.revelation, ["Mecquoise", "Médinoise"], id, 2),
      surah.revelation,
      `${surah.name} est généralement classée comme sourate ${surah.revelation.toLowerCase()}.`,
      "Repères coraniques - classification"
    );
  }

  return buildQuestion(
    id,
    "quran_basics",
    1 + (variant % 5),
    "Ordre du mushaf",
    renderStem(QURAN_ORDER_STEMS, variant, id, { order: surah.order }),
    makeOptions(surah.name, SURAHS.map((item) => item.name), id),
    surah.name,
    `La sourate numéro ${surah.order} est ${surah.name} (${surah.arabic}).`,
    "Repères coraniques - ordre des sourates"
  );
}

function buildQuranArabicNameQuestion(id: number, variant: number): LearningQuestion {
  const surah = pick(SURAHS, id * 31 + variant);
  return buildQuestion(
    id,
    "quran_basics",
    1 + (variant % 4),
    "Noms des sourates",
    renderStem(QURAN_ARABIC_NAME_STEMS, variant, id, { name: surah.name }),
    makeOptions(surah.arabic, SURAHS.map((item) => item.arabic), id),
    surah.arabic,
    `${surah.name} s'écrit ${surah.arabic} en arabe.`,
    "Repères coraniques - noms arabes"
  );
}

function buildMemorizationQuestion(id: number, variant: number): LearningQuestion {
  const scenario = pick(MEMORIZATION_SCENARIOS, id + variant * 23);
  const options = makeOptions(scenario.answer, MEMORIZATION_SCENARIOS.map((item) => item.answer), id);
  return buildQuestion(
    id,
    "memorization",
    2 + (variant % 4),
    "Méthode de mémorisation",
    renderStem(MEMORIZATION_STEMS, variant, id, { scenario: scenario.scenario }),
    options,
    scenario.answer,
    scenario.reason,
    "Méthodologie d'apprentissage - rappel actif"
  );
}

function buildIslamBasicsQuestion(id: number, variant: number): LearningQuestion {
  const fact = pick(ISLAM_FACTS, id + variant * 29);
  const options = makeOptions(
    fact.answer,
    [
      ...ISLAM_FACTS.map((item) => item.answer),
      "Un choix à vérifier avec un enseignant",
      "Une réponse sans source fiable",
    ],
    id
  );
  return buildQuestion(
    id,
    "islam_basics",
    1 + (variant % 5),
    "Culture islamique essentielle",
    renderStem(ISLAM_STEMS, variant, id, { question: fact.question }),
    options,
    fact.answer,
    fact.explanation,
    "Fondations islamiques - niveau éducatif"
  );
}

const BUILDERS = [
  buildLetterNameQuestion,
  buildLetterCharQuestion,
  buildLetterNoteQuestion,
  buildVowelQuestion,
  buildVowelMarkQuestion,
  buildSyllableQuestion,
  buildWordQuestion,
  buildWordArabicQuestion,
  buildTajwidQuestion,
  buildQuranBasicsQuestion,
  buildQuranArabicNameQuestion,
  buildMemorizationQuestion,
  buildIslamBasicsQuestion,
] as const;

export function getQuestionById(id: number): LearningQuestion {
  const normalizedId = normalizeQuestionId(id);
  const builderIndex = (normalizedId - 1) % BUILDERS.length;
  const variant = Math.floor((normalizedId - 1) / BUILDERS.length);
  return BUILDERS[builderIndex](normalizedId, variant);
}

export function getQuestionSignature(question: Pick<LearningQuestion, "category" | "question" | "answer">): string {
  const normalizedText = `${question.category}|${question.question}|${question.answer}`
    .normalize("NFKC")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
  return `${question.category}:${stringToSeed(normalizedText).toString(36)}`;
}

export function getQuestionBatch({
  seed,
  count,
  category = "mixed",
  categories,
  difficulty,
  excludeIds,
  excludeSignatures,
}: QuestionBatchOptions): LearningQuestion[] {
  const selectedCategories = categories?.length ? new Set<QuestionCategory>(categories) : null;
  const excluded = new Set(excludeIds || []);
  const excludedSignaturesSet = new Set(excludeSignatures || []);
  const usedIds = new Set<number>();
  const usedSignatures = new Set<string>();
  const random = mulberry32(normalizeSeed(seed));
  const questions: LearningQuestion[] = [];
  let guard = 0;

  const accepts = (question: LearningQuestion) => {
    if (excluded.has(question.id) || usedIds.has(question.id)) return false;
    if (category !== "mixed" && question.category !== category) return false;
    if (selectedCategories && !selectedCategories.has(question.category)) return false;
    if (difficulty && question.difficulty !== difficulty) return false;

    const signature = getQuestionSignature(question);
    if (excludedSignaturesSet.has(signature) || usedSignatures.has(signature)) return false;
    usedSignatures.add(signature);
    usedIds.add(question.id);
    return true;
  };

  while (questions.length < count && guard < QUESTION_BANK_SIZE * 2) {
    const candidateId = 1 + Math.floor(random() * QUESTION_BANK_SIZE);
    const question = getQuestionById(candidateId);
    if (accepts(question)) questions.push(question);
    guard += 1;
  }

  for (let fallbackId = 1; questions.length < count && fallbackId <= QUESTION_BANK_SIZE; fallbackId += 1) {
    const question = getQuestionById(fallbackId);
    if (accepts(question)) questions.push(question);
  }

  return questions;
}

export function shuffleQuestionOptions(question: LearningQuestion, seed: string | number): LearningQuestion {
  return {
    ...question,
    options: shuffleWithSeed(question.options, normalizeSeed(seed) + question.id),
  };
}
