const fs = require('fs');
const surahs = require('../public/data/surahs.json');

const tajwidRules = [
  'Ikhfa', 'Idgham', 'Iqlab', 'Shadda', 'Tanwin', 'Madd', 'Qalqalah',
  'Ghunnah', 'Tafkheem', 'Tarqeeq'
];

function generateTajwidQuestion(id) {
  const rule = tajwidRules[Math.floor(Math.random() * tajwidRules.length)];
  const examples = {
    'Ikhfa': { text: 'مِن بَعْدِ', explanation: 'Nasalisation légère (ghunna) sans prolongement.' },
    'Idgham': { text: 'مِن رَّحْمَةٍ', explanation: 'Le noun sakina fusionne avec la lettre suivante.' },
    'Iqlab': { text: 'مِن بَعْدِ', explanation: 'Le noun sakina est transformé en mim.' },
    'Shadda': { text: 'بَّ', explanation: 'Redoublement de la consonne.' },
    'Tanwin': { text: 'بً', explanation: 'Nasalisation en fin de mot (an/in/un).' },
    'Madd': { text: 'بَا', explanation: 'Allongement vocalique.' },
    'Qalqalah': { text: 'قُلْ', explanation: 'Résonnance de la consonne.' },
    'Ghunnah': { text: 'مِنْ', explanation: 'Nasalisation.' },
    'Tafkheem': { text: 'صَ', explanation: 'Emphatisation de la lettre.' },
    'Tarqeeq': { text: 'سَ', explanation: 'Amincissement de la lettre.' }
  };
  const ex = examples[rule] || examples['Shadda'];
  const fakeRules = tajwidRules.filter(r => r !== rule).sort(() => 0.5 - Math.random()).slice(0, 3);
  return {
    id,
    question: `Quelle règle de tajwid s'applique dans l'exemple : ${ex.text} ?`,
    options: [rule, ...fakeRules].sort(() => Math.random() - 0.5),
    answer: rule,
    explanation: ex.explanation,
    proof: 'Voir Jazariyyah, chapitre sur les règles du noun sakina.',
    category: 'tajwid',
    difficulty: 1
  };
}

function generateQuranQuestion(id) {
  const s = surahs[Math.floor(Math.random() * surahs.length)];
  const ayah = Math.floor(Math.random() * s.ayahCount) + 1;
  const fakeSurahs = surahs.filter(x => x.number !== s.number).sort(() => 0.5 - Math.random()).slice(0, 3).map(x => x.englishName);
  return {
    id,
    question: `Dans quelle sourate se trouve le verset ${ayah} ?`,
    options: [s.englishName, ...fakeSurahs].sort(() => Math.random() - 0.5),
    answer: s.englishName,
    explanation: `Le verset ${ayah} appartient à la sourate ${s.englishName}.`,
    proof: `Coran, sourate ${s.name} verset ${ayah}.`,
    category: 'quran',
    difficulty: 1
  };
}

function generateHadithQuestion(id) {
  const hadiths = [
    { text: 'Les actions ne valent que par leurs intentions.', source: 'Boukhari et Mouslim' },
    { text: 'La religion est le conseil sincère.', source: 'Mouslim' },
    { text: 'Celui qui ne remercie pas les gens ne remercie pas Allah.', source: 'Abou Daoud' },
    { text: 'Le croyant fort est meilleur et plus aimé d\'Allah que le croyant faible.', source: 'Mouslim' },
    { text: 'La foi comporte soixante-dix et quelques branches.', source: 'Boukhari' }
  ];
  const h = hadiths[Math.floor(Math.random() * hadiths.length)];
  const fakeSources = ['Tirmidhi', 'Ibn Majah', 'Nassai'].sort(() => 0.5 - Math.random()).slice(0, 2);
  return {
    id,
    question: `Quel hadith correspond à : "${h.text}" ?`,
    options: [h.source, ...fakeSources].sort(() => Math.random() - 0.5),
    answer: h.source,
    explanation: `Ce hadith est rapporté par ${h.source}.`,
    proof: h.source,
    category: 'hadith',
    difficulty: 2
  };
}

function generateSirahQuestion(id) {
  const events = [
    { question: 'En quelle année est né le Prophète Muhammad ?', answer: 'L\'année de l\'éléphant', options: ['L\'année de l\'éléphant', 'L\'année du déluge', 'L\'année de la sécheresse', 'L\'année de la victoire'] },
    { question: 'Où a eu lieu la première révélation ?', answer: 'Grotte de Hira', options: ['Grotte de Hira', 'Médine', 'Jérusalem', 'La Mecque'] }
  ];
  const ev = events[Math.floor(Math.random() * events.length)];
  return {
    id,
    question: ev.question,
    options: ev.options,
    answer: ev.answer,
    explanation: `Réponse : ${ev.answer}.`,
    proof: 'Sirah d\'Ibn Hicham',
    category: 'sirah',
    difficulty: 2
  };
}

function generateFiqhQuestion(id) {
  const fiqhs = [
    { question: 'Combien de rakats dans la prière de Fajr ?', answer: '2', options: ['2', '4', '3', '1'] },
    { question: 'Quel est le montant minimum de la zakat al-fitr ?', answer: 'Un sa\' de nourriture', options: ['Un sa\' de nourriture', 'Un dirham', 'Un dinar', 'Un mouton'] }
  ];
  const f = fiqhs[Math.floor(Math.random() * fiqhs.length)];
  return {
    id,
    question: f.question,
    options: f.options,
    answer: f.answer,
    explanation: `Réponse : ${f.answer}.`,
    proof: 'Ouvrage de fiqh',
    category: 'fiqh',
    difficulty: 3
  };
}

function generateQuestion(id) {
  const r = Math.random();
  if (r < 0.3) return generateTajwidQuestion(id);
  if (r < 0.6) return generateQuranQuestion(id);
  if (r < 0.8) return generateHadithQuestion(id);
  if (r < 0.95) return generateSirahQuestion(id);
  return generateFiqhQuestion(id);
}

const questions = [];
for (let i = 1; i <= 100000; i++) {
  questions.push(generateQuestion(i));
}

fs.writeFileSync('questions.json', JSON.stringify(questions));
console.log('100 000 questions préparées dans questions.json');
