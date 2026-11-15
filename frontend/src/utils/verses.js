import { GITA_SHLOKAS } from './shlokaData';

export const CHAPTERS = [
  { num: 1, name: 'Arjuna Vishada Yoga', nameSanskrit: 'अर्जुनविषादयोग', theme: 'The sorrow of Arjuna', verses: 47 },
  { num: 2, name: 'Sankhya Yoga', nameSanskrit: 'सांख्ययोग', theme: 'The yoga of knowledge', verses: 72 },
  { num: 3, name: 'Karma Yoga', nameSanskrit: 'कर्मयोग', theme: 'The yoga of action', verses: 43 },
  { num: 4, name: 'Jnana Karma Sanyasa Yoga', nameSanskrit: 'ज्ञानकर्मसंन्यासयोग', theme: 'Knowledge and the renunciation of action', verses: 42 },
  { num: 5, name: 'Karma Sanyasa Yoga', nameSanskrit: 'कर्मसंन्यासयोग', theme: 'The yoga of renunciation', verses: 29 },
  { num: 6, name: 'Dhyana Yoga', nameSanskrit: 'ध्यानयोग', theme: 'The yoga of meditation', verses: 47 },
  { num: 7, name: 'Jnana Vijnana Yoga', nameSanskrit: 'ज्ञानविज्ञानयोग', theme: 'Knowledge and realisation', verses: 30 },
  { num: 8, name: 'Akshara Brahma Yoga', nameSanskrit: 'अक्षरब्रह्मयोग', theme: 'The imperishable', verses: 28 },
  { num: 9, name: 'Raja Vidya Raja Guhya Yoga', nameSanskrit: 'राजविद्याराजगुह्ययोग', theme: 'The royal knowledge', verses: 34 },
  { num: 10, name: 'Vibhuti Yoga', nameSanskrit: 'विभूतियोग', theme: 'The divine glories', verses: 42 },
  { num: 11, name: 'Vishwaroop Darshan Yoga', nameSanskrit: 'विश्वरूपदर्शनयोग', theme: 'The vision of the universal form', verses: 55 },
  { num: 12, name: 'Bhakti Yoga', nameSanskrit: 'भक्तियोग', theme: 'The yoga of devotion', verses: 20 },
  { num: 13, name: 'Kshetra Kshetrajna Vibhaga Yoga', nameSanskrit: 'क्षेत्रक्षेत्रज्ञविभागयोग', theme: 'The field and its knower', verses: 35 },
  { num: 14, name: 'Gunatraya Vibhaga Yoga', nameSanskrit: 'गुणत्रयविभागयोग', theme: 'The three qualities', verses: 27 },
  { num: 15, name: 'Purushottama Yoga', nameSanskrit: 'पुरुषोत्तमयोग', theme: 'The supreme person', verses: 20 },
  { num: 16, name: 'Daivasura Sampad Vibhaga Yoga', nameSanskrit: 'दैवासुरसम्पद्विभागयोग', theme: 'The divine and the demonic', verses: 24 },
  { num: 17, name: 'Shraddhatraya Vibhaga Yoga', nameSanskrit: 'श्रद्धात्रयविभागयोग', theme: 'The three kinds of faith', verses: 28 },
  { num: 18, name: 'Moksha Sanyasa Yoga', nameSanskrit: 'मोक्षसंन्यासयोग', theme: 'Liberation through renunciation', verses: 78 },
];

const DEVANAGARI_DIGITS = '०१२३४५६७८९';
export function toDevanagari(n) {
  return String(n).replace(/\d/g, (d) => DEVANAGARI_DIGITS[d]);
}

const ROMAN = [[10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I']];
export function toRoman(n) {
  let out = '';
  for (const [v, s] of ROMAN) while (n >= v) { out += s; n -= v; }
  return out;
}

export function chapterOf(num) {
  return CHAPTERS.find((c) => c.num === Number(num)) || null;
}

export function versesOfChapter(num) {
  return GITA_SHLOKAS.filter((s) => s.chapter === Number(num));
}

export function findVerse(chapter, verse) {
  return GITA_SHLOKAS.find((s) => s.chapter === Number(chapter) && s.verse === Number(verse)) || null;
}

/** Teachings only: skip narrative verses and Arjuna's own questions ("... said", उवाच). */
const SPEAKER = /^\s*(arjuna|sanjaya|dhritarashtra)\b[^:]{0,30}said/i;
const TEACHINGS = GITA_SHLOKAS.filter(
  (s) => s.chapter > 1 && !s.sanskrit.includes('उवाच') && !SPEAKER.test(s.translation?.en || '')
);

/** A different teaching each day, the same one for everyone on that day. */
export function verseOfTheDay(date = new Date()) {
  const start = new Date(date.getFullYear(), 0, 0);
  const day = Math.floor((date - start) / 86400000);
  return TEACHINGS[(day + date.getFullYear() * 7) % TEACHINGS.length];
}

export function gitaRef(s) {
  return `Bhagavad Gita ${s.chapter}.${s.verse}`;
}

export function reflectPrompt(s, lang = 'en') {
  const t = s.translation?.en || s.translation || '';
  return lang === 'hi'
    ? `Main Bhagavad Gita ${s.chapter}.${s.verse} par sochna chahta hoon: "${t}" Mere jeevan mein abhi iska kya matlab ho sakta hai?`
    : `I'd like to reflect on Bhagavad Gita ${s.chapter}.${s.verse}: "${t}" What might this mean for my life right now?`;
}
