/**
 * Gitaarth AI — Emotion & Intent Engine
 *
 * Stage 1 + Stage 3 of the response pipeline:
 *   User → [Emotion Detection] → Memory → [Intent Detection] → Scripture → LLM → Response
 *
 * Strategy: a fast LLM classifier (temperature 0, tiny output) with a
 * deterministic lexicon classifier as fallback when the API is slow/unavailable.
 * Nothing here generates prose — it only produces structured signals that
 * promptEngine uses to shape the tone of the final reply.
 */

import { classifyWithLLM } from './grokService.js';

/* ─────────────── Emotion taxonomy ─────────────── */

export const EMOTIONS = [
  'joy', 'gratitude', 'pride', 'excitement', 'curiosity', 'spiritual_seeking',
  'sadness', 'anxiety', 'fear', 'anger', 'loneliness', 'confusion',
  'regret', 'guilt', 'neutral',
];

const POSITIVE = new Set(['joy', 'gratitude', 'pride', 'excitement']);
const SEEKING = new Set(['curiosity', 'spiritual_seeking', 'confusion']);
const PAINFUL = new Set(['sadness', 'anxiety', 'fear', 'anger', 'loneliness', 'regret', 'guilt']);

export function valenceOf(emotion) {
  if (POSITIVE.has(emotion)) return 'positive';
  if (PAINFUL.has(emotion)) return 'negative';
  if (SEEKING.has(emotion)) return 'seeking';
  return 'neutral';
}

/* ─────────────── Lexicon (English + Hinglish) ─────────────── */

const LEXICON = {
  joy: ['happy', 'happiest', 'glad', 'delighted', 'joy', 'joyful', 'cheerful', 'wonderful', 'amazing', 'great news', 'so good', 'khush', 'khushi', 'maza', 'mazaa', 'accha laga', 'acha laga'],
  gratitude: ['thank', 'thanks', 'thankful', 'grateful', 'gratitude', 'blessed', 'shukriya', 'dhanyavaad', 'dhanyavad', 'aabhar', 'kripa'],
  pride: ['proud', 'i did it', 'achieved', 'achievement', 'accomplished', 'topped', 'won', 'first place', 'promoted', 'promotion', 'cracked', 'selected', 'got the job', 'got an internship', 'got internship', 'passed', 'cleared', 'garv', 'safal', 'safalta'],
  excitement: ['excited', 'exciting', 'cant wait', "can't wait", 'thrilled', 'pumped', 'looking forward', 'finally', 'josh', 'bahut excited'],
  curiosity: ['what is', 'what does', 'why do', 'how do', 'explain', 'meaning of', 'tell me about', 'curious', 'wondering', 'question', 'kya hai', 'kaise', 'kyun', 'matlab', 'samjhao', 'batao'],
  spiritual_seeking: ['moksha', 'dharma', 'karma', 'soul', 'atma', 'aatma', 'god', 'bhagwan', 'meditation', 'dhyan', 'purpose of life', 'enlighten', 'devotion', 'bhakti', 'spiritual', 'prayer', 'puja', 'mukti', 'rebirth', 'punarjanam'],
  sadness: ['sad', 'sadness', 'unhappy', 'depressed', 'depression', 'crying', 'cried', 'tears', 'heartbroken', 'broken', 'miss him', 'miss her', 'miss them', 'grief', 'grieving', 'died', 'death', 'passed away', 'lost my', 'hurt', 'hurting', 'empty', 'numb', 'dukhi', 'dukh', 'udaas', 'rona', 'ro raha', 'ro rahi', 'takleef'],
  anxiety: ['anxious', 'anxiety', 'stressed', 'stress', 'worried', 'worry', 'worrying', 'overthinking', 'overwhelmed', 'panic', 'pressure', 'nervous', 'restless', 'cant sleep', "can't sleep", 'tension', 'ghabra', 'ghabrahat', 'pareshan', 'chinta', 'bechain'],
  fear: ['afraid', 'scared', 'scary', 'fear', 'terrified', 'frightened', 'what if i fail', 'dar', 'darr', 'dara hua', 'darr lagta'],
  anger: ['angry', 'anger', 'furious', 'rage', 'hate', 'irritated', 'annoyed', 'frustrated', 'frustration', 'unfair', 'betrayed', 'cheated on me', 'gussa', 'krodh', 'nafrat', 'chidh'],
  loneliness: ['lonely', 'alone', 'no one', 'nobody', 'isolated', 'left me', 'abandoned', 'ignored', 'akela', 'akeli', 'tanha', 'koi nahi'],
  confusion: ['confused', 'confusion', 'dont know', "don't know", 'do not know', 'lost', 'stuck', 'unsure', 'not sure', 'torn between', 'should i', 'i should', 'which one', 'cant decide', "can't decide", 'cannot decide', 'two options', 'directionless', 'samajh nahi', 'confuse', 'kya karu', 'kya karoon', 'faisla', 'decide'],
  regret: ['regret', 'i wish i had', 'should have', 'shouldnt have', "shouldn't have", 'mistake', 'wasted', 'too late', 'pachtava', 'galti ki', 'kaash'],
  guilt: ['guilty', 'guilt', 'my fault', 'i hurt', 'i lied', 'i cheated', 'ashamed', 'shame', 'forgive me', 'sorry for', 'sharminda', 'galti meri', 'maaf'],
};

/* Negation / hypothetical guards — "I'm not sad", "what if I get sad" */
const NEGATORS = /\b(not|never|no longer|nahi|nahin|isn'?t|aren'?t|wasn'?t|don'?t|doesn'?t)\s+\w{0,12}$/i;

const GREETING_RE = /^(hi|hii+|hello|helo|hey+|yo|sup|namaste|namaskar|namasthe|hola|good\s?(morning|evening|afternoon|night)|jai\s?shri\s?(krishna|ram|rama)|har\s?har\s?mahadev|radhe\s?radhe|ram\s?ram|jai\s?hanuman|om)\b/i;

const SMALLTALK_RE = /^(ok|okay|k|hmm+|haan|ha|yes|yeah|no|nope|thik hai|theek hai|acha|achha|got it|i see|nice|cool|lol|haha)\b[.! ]*$/i;

/* ─────────────── Explicit requests ───────────────
   When someone asks outright for a verse or a story, the request is the whole
   job. Answering it with "what made you think about this?" is the single most
   irritating thing this app can do, so these patterns are detected
   deterministically and are never overridden by the LLM classifier. */

const EXPLICIT_PATTERNS = [
  { wants: 'gita', re: /\b(gita|geeta|bhagavad\s?gita)\b.{0,30}\b(quote|verse|shloka|sloka|reference|says?|reference)\b/i },
  { wants: 'gita', re: /\b(quote|verse|shloka|sloka|reference)\b.{0,30}\b(gita|geeta)\b/i },
  { wants: 'gita', re: /\b(give|tell|show|share|send)\s+(me\s+)?(a\s+|one\s+|some\s+)?(shloka|sloka|verse|quote)\b/i },
  { wants: 'ramayana', re: /\bramayan[a]?\b.{0,30}\b(quote|verse|reference|story|says?|teach)/i },
  { wants: 'ramayana', re: /\b(story|reference|example)\b.{0,30}\bramayan[a]?\b/i },
  { wants: 'mahabharata', re: /\bmahabharat[a]?\b.{0,30}\b(story|reference|example|says?|teach|happened)/i },
  { wants: 'mahabharata', re: /\b(story|reference|example)\b.{0,30}\bmahabharat[a]?\b/i },
  { wants: 'mahabharata', re: /\bwhat happened (to|with)\s+(arjun|arjuna|karna|bhishma|draupadi|yudhishthir|duryodhan)/i },
  { wants: 'teaching', re: /\bwhat (did|does)\s+(krishna|ram|rama|you)\s+(teach|say|tell|advise)\b/i },
  { wants: 'teaching', re: /\b(krishna|ram|rama)'?s?\s+(teaching|advice|words)\s+(on|about)\b/i },
  { wants: 'explain', re: /\bexplain\b.{0,20}\b(this\s+)?(shloka|sloka|verse|chapter|teaching)\b/i },
  { wants: 'explain', re: /\bwhat does\b.{0,30}\b(shloka|sloka|verse|chapter \d)\b.{0,20}\bmean\b/i },
  { wants: 'story', re: /\b(tell|share|give)\s+me\s+(a|the|some)\s+(story|katha|prasang)\b/i },
  { wants: 'gita', re: /\b(chapter|adhyay)\s?\d{1,2}\b.{0,15}\b(verse|shlok|sloka|\d{1,2})\b/i },
];

/**
 * Did the user directly ask for scripture, a story, or a teaching?
 * @returns {{ isExplicitRequest: boolean, wants: string|null }}
 */
export function detectExplicitRequest(text = '') {
  for (const { wants, re } of EXPLICIT_PATTERNS) {
    if (re.test(text)) return { isExplicitRequest: true, wants };
  }
  return { isExplicitRequest: false, wants: null };
}

/* ─────────────── Heuristic classifier ─────────────── */

/** Escape a lexicon term for use inside a RegExp. */
function escapeRe(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Find a term's position, anchored at a word boundary so "body" does not match
 * "nobody". A trailing suffix is allowed, so "thank" still matches "thanks".
 */
function findTerm(lower, term) {
  const re = new RegExp(`\\b${escapeRe(term)}`, 'i');
  const match = re.exec(lower);
  return match ? match.index : -1;
}

function scoreLexicon(text) {
  const lower = text.toLowerCase();
  const scores = {};

  for (const [emotion, terms] of Object.entries(LEXICON)) {
    let score = 0;
    for (const term of terms) {
      const idx = findTerm(lower, term);
      if (idx === -1) continue;
      // Skip if immediately preceded by a negation ("not sad", "nahi dar")
      const before = lower.slice(Math.max(0, idx - 24), idx);
      if (NEGATORS.test(before)) continue;
      // Longer phrases are stronger evidence than single words
      score += term.includes(' ') ? 3 : 2;
    }
    if (score > 0) scores[emotion] = score;
  }
  return scores;
}

function intensityOf(text, topScore) {
  const exclaims = (text.match(/!/g) || []).length;
  const shouty = /\b[A-Z]{4,}\b/.test(text);
  const amplifiers = /\b(so|very|really|extremely|bahut|bohot|itna|too|completely|totally)\b/i.test(text);
  const weight = topScore + exclaims * 2 + (shouty ? 2 : 0) + (amplifiers ? 2 : 0);
  if (weight >= 8) return 'high';
  if (weight >= 4) return 'medium';
  return 'low';
}

/**
 * Deterministic classification. Always returns a usable result.
 */
export function analyzeHeuristic(message) {
  const text = message.trim();
  const words = text.split(/\s+/).filter(Boolean);

  /* An explicit ask outranks everything else, including greeting detection —
     "Hey Krishna, give me a Gita verse on failure" is a request, not a hello. */
  const explicit = detectExplicitRequest(text);
  if (explicit.isExplicitRequest) {
    const scored = scoreLexicon(text);
    const topEmotion = Object.entries(scored).sort((a, b) => b[1] - a[1])[0]?.[0] || 'curiosity';
    return base({
      emotion: topEmotion,
      intent: 'seeking_knowledge',
      intensity: intensityOf(text, scored[topEmotion] || 0),
      confident: true,                 // deterministic — skip the classifier round trip
      needsScripture: true,
      isExplicitRequest: true,
      explicitWants: explicit.wants,
      topic: topicGuess(text),
    });
  }

  if (GREETING_RE.test(text) && words.length <= 5) {
    return base({ emotion: 'neutral', intent: 'greeting', intensity: 'low', needsScripture: false, isGreeting: true });
  }

  if (SMALLTALK_RE.test(text)) {
    return base({ emotion: 'neutral', intent: 'small_talk', intensity: 'low', needsScripture: false, isSmallTalk: true });
  }

  const scores = scoreLexicon(text);
  const ranked = Object.entries(scores).sort((a, b) => b[1] - a[1]);

  const topScore = ranked[0]?.[1] || 0;
  const runnerUp = ranked[1]?.[1] || 0;
  const emotion = ranked[0]?.[0] || 'neutral';
  const secondary = ranked[1]?.[0] || null;
  const intensity = ranked.length ? intensityOf(text, topScore) : 'low';

  // Confident when the signal is strong AND unambiguous — a clear winner over
  // the runner-up. Confident results skip the LLM classifier entirely.
  // Scoring is 2 per word / 3 per phrase, so >= 5 means several corroborating
  // signals. The margin rule keeps mixed-emotion messages going to the LLM.
  const confident = topScore >= 5 && topScore >= runnerUp + 2;

  const isQuestion = /\?\s*$/.test(text) || /^(what|why|how|when|who|which|can|should|is|does|do|kya|kaise|kyun|kaun)\b/i.test(text);

  let intent = 'venting';
  if (valenceOf(emotion) === 'positive') intent = 'sharing_good_news';
  else if (emotion === 'curiosity' || emotion === 'spiritual_seeking') intent = 'seeking_knowledge';
  else if (emotion === 'confusion' || isQuestion) intent = 'seeking_decision';
  else if (valenceOf(emotion) === 'negative') intent = intensity === 'high' ? 'seeking_comfort' : 'venting';
  else if (isQuestion) intent = 'seeking_knowledge';
  else intent = 'sharing';

  return base({
    emotion,
    secondaryEmotion: secondary,
    intent,
    intensity,
    confident,
    needsScripture: shouldUseScriptureHeuristic(intent, intensity, words.length),
    topic: topicGuess(text),
  });
}

function shouldUseScriptureHeuristic(intent, intensity, wordCount) {
  if (intent === 'greeting' || intent === 'small_talk') return false;
  if (intent === 'seeking_knowledge') return true;
  if (intent === 'sharing_good_news') return false;   // celebrate, don't preach
  if (wordCount < 4) return false;                     // too little to anchor a verse
  return intensity !== 'low';
}

function topicGuess(text) {
  const t = text.toLowerCase();
  const topics = {
    career: ['job', 'internship', 'work', 'career', 'office', 'boss', 'salary', 'stipend', 'placement', 'interview'],
    studies: ['exam', 'study', 'studies', 'college', 'school', 'marks', 'result', 'semester', 'assignment', 'jee', 'neet'],
    relationship: ['girlfriend', 'boyfriend', 'wife', 'husband', 'partner', 'breakup', 'broke up', 'love', 'crush', 'marriage', 'shaadi'],
    family: ['mother', 'father', 'mom', 'dad', 'parents', 'brother', 'sister', 'family', 'maa', 'papa', 'ghar'],
    friendship: ['friend', 'friends', 'dost', 'yaar', 'best friend'],
    health: ['sick', 'illness', 'health', 'hospital', 'pain', 'body', 'sleep', 'tired'],
    money: ['money', 'loan', 'debt', 'paisa', 'financial', 'afford'],
    self: ['myself', 'my life', 'who i am', 'purpose', 'confidence', 'self'],
  };
  for (const [topic, terms] of Object.entries(topics)) {
    if (terms.some((term) => findTerm(t, term) !== -1)) return topic;
  }
  return 'general';
}

function base(partial) {
  return {
    emotion: 'neutral',
    secondaryEmotion: null,
    intensity: 'low',
    intent: 'sharing',
    topic: 'general',
    confident: false,
    needsScripture: false,
    isGreeting: false,
    isSmallTalk: false,
    isExplicitRequest: false,
    explicitWants: null,
    source: 'heuristic',
    ...partial,
    valence: valenceOf(partial.emotion || 'neutral'),
  };
}

/* ─────────────── LLM-refined classifier ─────────────── */

const CLASSIFIER_PROMPT = `You are an emotion and intent classifier for a spiritual companion app. You do NOT reply to the user. You only classify.

Read the user's latest message in the context of the conversation and output ONLY a JSON object:
{
  "emotion": one of ["joy","gratitude","pride","excitement","curiosity","spiritual_seeking","sadness","anxiety","fear","anger","loneliness","confusion","regret","guilt","neutral"],
  "secondaryEmotion": one of the same values, or null,
  "intensity": "low" | "medium" | "high",
  "intent": "greeting" | "small_talk" | "sharing_good_news" | "venting" | "seeking_comfort" | "seeking_decision" | "seeking_knowledge" | "gratitude" | "testing",
  "topic": short 1-3 word noun phrase describing what the message is actually about,
  "needsScripture": true only if a scripture verse would genuinely deepen the reply; false for greetings, small talk, good news, and casual chat,
  "isGreeting": boolean,
  "isSmallTalk": boolean
}

CRITICAL: Do not assume distress. "I got an internship with a stipend" is joy/pride — NOT sadness. Read what is actually said.
Output raw JSON only. No prose, no code fences.`;

function sanitizeLLM(raw, fallback) {
  if (!raw || typeof raw !== 'object') return fallback;
  const emotion = EMOTIONS.includes(raw.emotion) ? raw.emotion : fallback.emotion;
  const intents = ['greeting', 'small_talk', 'sharing_good_news', 'venting', 'seeking_comfort', 'seeking_decision', 'seeking_knowledge', 'gratitude', 'testing'];
  return {
    emotion,
    secondaryEmotion: EMOTIONS.includes(raw.secondaryEmotion) ? raw.secondaryEmotion : null,
    valence: valenceOf(emotion),
    intensity: ['low', 'medium', 'high'].includes(raw.intensity) ? raw.intensity : fallback.intensity,
    intent: intents.includes(raw.intent) ? raw.intent : fallback.intent,
    topic: typeof raw.topic === 'string' && raw.topic.trim() ? raw.topic.trim().slice(0, 40) : fallback.topic,
    needsScripture: typeof raw.needsScripture === 'boolean' ? raw.needsScripture : fallback.needsScripture,
    isGreeting: raw.isGreeting === true || fallback.isGreeting,
    isSmallTalk: raw.isSmallTalk === true || fallback.isSmallTalk,
    // Never inferred by the LLM — the deterministic detector owns these.
    isExplicitRequest: fallback.isExplicitRequest,
    explicitWants: fallback.explicitWants,
    source: 'llm',
  };
}

/**
 * Full analysis: emotion + intent + whether scripture is warranted.
 * @param {string} message — the user's latest message
 * @param {Array} history — prior messages [{ role, text }]
 */
export async function analyzeMessage(message, history = []) {
  const heuristic = analyzeHeuristic(message);

  // Skip the extra API round trip when the lexicon already gave a clear answer.
  // Saves latency and tokens on the majority of messages.
  if (heuristic.isGreeting || heuristic.isSmallTalk || heuristic.confident) return heuristic;

  const recent = history
    .slice(-4)
    .map((m) => `${m.role === 'user' ? 'User' : 'Krishna'}: ${(m.text || '').slice(0, 200)}`)
    .join('\n');

  try {
    const raw = await classifyWithLLM([
      { role: 'system', content: CLASSIFIER_PROMPT },
      { role: 'user', content: `${recent ? `Recent conversation:\n${recent}\n\n` : ''}Latest user message:\n"${message}"` },
    ]);
    const merged = sanitizeLLM(raw, heuristic);
    // Trust the heuristic when it found strong positive-valence evidence and the
    // LLM drifted to distress — this is the exact failure mode we are fixing.
    if (valenceOf(heuristic.emotion) === 'positive' && valenceOf(merged.emotion) === 'negative' && heuristic.intensity !== 'low') {
      return { ...heuristic, source: 'heuristic-override' };
    }
    return merged;
  } catch (err) {
    console.warn('⚠️ Emotion classifier failed, using heuristic:', err.message);
    return heuristic;
  }
}

/* ─────────────── Per-emotion response direction ─────────────── */

const TONE_BOOK = {
  joy: {
    stance: 'Be genuinely happy with them. Smile in your words.',
    do: 'Congratulate them plainly and specifically. Name the thing they achieved. Let the joy stand on its own for at least two sentences before anything else.',
    dont: 'Do NOT reframe their joy as a hidden problem. Do NOT warn them about attachment in the first breath. Do NOT mention battle, burden, pain, or darkness.',
  },
  pride: {
    stance: 'Be proud of them, the way someone who has watched them struggle would be.',
    do: 'Acknowledge the effort behind the result, not just the result. Then, gently, point toward humility and responsibility — as encouragement, not as a warning.',
    dont: 'Do NOT deflate them. Do NOT lecture about ego. Do NOT turn the win into a lesson about detachment.',
  },
  excitement: {
    stance: 'Match their energy. Be light.',
    do: 'Share the anticipation with them. Ask what they are most looking forward to.',
    dont: 'Do NOT slow them down with solemn philosophy.',
  },
  gratitude: {
    stance: 'Receive it warmly and simply.',
    do: 'Accept the thanks without ceremony. Turn it back toward what they did for themselves.',
    dont: 'Do NOT deliver a sermon on devotion.',
  },
  curiosity: {
    stance: 'Be a teacher who enjoys the question.',
    do: 'Answer clearly and concretely first. Use an example or a short story. Scripture fits naturally here.',
    dont: 'Do NOT be cryptic. Do NOT answer a question with only a question.',
  },
  spiritual_seeking: {
    stance: 'Be the guide they came for.',
    do: 'Answer the spiritual question directly, then ground it in something they can practice this week.',
    dont: 'Do NOT drown them in abstraction.',
  },
  sadness: {
    stance: 'Sit with them first. Do not rush to fix.',
    do: 'Acknowledge what specifically hurts, in their own terms. Comfort before wisdom. Keep it soft and short.',
    dont: 'Do NOT open with a grand metaphor. Do NOT say "I hear your pain".',
  },
  anxiety: {
    stance: 'Be steady. Slow the conversation down.',
    do: 'Name the specific worry they described. Separate what they control from what they do not. Offer one small, concrete next step.',
    dont: 'Do NOT add intensity. Do NOT say "stay positive".',
  },
  fear: {
    stance: 'Be the calm presence beside them.',
    do: 'Reassure without dismissing. Make the feared thing smaller and more concrete.',
    dont: 'Do NOT minimize the fear or call it illusion.',
  },
  anger: {
    stance: 'Let them be angry. Do not scold.',
    do: 'Validate that something wrong happened. Then ask what the anger is protecting.',
    dont: 'Do NOT tell them to calm down or forgive immediately.',
  },
  loneliness: {
    stance: 'Be company, not counsel.',
    do: 'Be present with them. Speak warmly and personally. Mention one real, small way to reach outward.',
    dont: 'Do NOT say "you are never alone because I am with you" as the whole answer — it rings hollow.',
  },
  confusion: {
    stance: 'Be clarifying and practical.',
    do: 'Lay out the choice cleanly. Ask the one question that reveals what they actually want.',
    dont: 'Do NOT add more abstraction to a confused mind.',
  },
  regret: {
    stance: 'Be forgiving and forward-facing.',
    do: 'Let the past be past. Focus on what is still in their hands.',
    dont: 'Do NOT dwell on the mistake.',
  },
  guilt: {
    stance: 'Be merciful.',
    do: 'Separate the act from their worth. Point toward repair where repair is possible.',
    dont: 'Do NOT moralize. They are already punishing themselves.',
  },
  neutral: {
    stance: 'Be natural and conversational.',
    do: 'Respond to what they actually said, like a friend would. Keep it short.',
    dont: 'Do NOT manufacture depth that is not there.',
  },
};

export function toneDirectiveFor(analysis) {
  const t = TONE_BOOK[analysis.emotion] || TONE_BOOK.neutral;
  return `Detected emotion: ${analysis.emotion}${analysis.secondaryEmotion ? ` (with ${analysis.secondaryEmotion})` : ''} — intensity ${analysis.intensity}, valence ${analysis.valence}.
Their intent: ${analysis.intent}. Topic: ${analysis.topic}.

STANCE: ${t.stance}
DO: ${t.do}
DO NOT: ${t.dont}`;
}

/* ─────────────── Should this reply end with a question? ───────────────
   Asking every single time turns a companion into an interviewer. This is the
   whole fix: a question must be earned, and never two turns running. */

export function shouldAskQuestion(analysis, memory = {}) {
  // They asked for something. Deliver it. Do not interrogate them first.
  if (analysis.isExplicitRequest) return false;
  if (analysis.intent === 'seeking_knowledge') return false;

  // "ok", "haha", "got it" — a question here restarts a conversation that was winding down.
  if (analysis.isSmallTalk) return false;

  // An opening hello is exactly where an invitation belongs.
  if (analysis.isGreeting) return true;

  // The strongest rule: never two questions in a row.
  if (memory.lastTurnAskedQuestion) return false;

  // Pain and indecision genuinely benefit from understanding them better.
  if (analysis.valence === 'negative' && analysis.intensity !== 'low') return true;
  if (analysis.intent === 'seeking_decision') return true;

  // Good news deserves celebration far more than it deserves an intake form.
  // Big news gets none at all — let the moment be theirs.
  if (analysis.valence === 'positive') {
    if (analysis.intensity === 'high') return false;
    return (memory.turnCount || 0) % 3 === 1;
  }

  // Everything else: sometimes. Alternating keeps the rhythm human.
  return (memory.turnCount || 0) % 2 === 1;
}
