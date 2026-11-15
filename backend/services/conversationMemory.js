/**
 * Gitaarth AI — Conversation Memory
 *
 * Stage 2 of the pipeline. Turns raw message history into a compact brief the
 * LLM can actually act on: what this person has been going through, what has
 * already been said to them, and what must not be repeated.
 *
 * This is what stops the conversation from restarting on every turn.
 */

import { analyzeHeuristic } from './emotionEngine.js';

const MAX_TURNS_IN_PROMPT = 12;

/** Opening words we never want to see twice in one conversation. */
const OPENING_WORD_COUNT = 6;

/* Phrases the model over-uses. Tracked so we can ban them explicitly. */
const OVERUSED = [
  'i hear your pain', 'i understand', 'your heart', 'battlefield', 'the weight you carry',
  'the burden you carry', 'darkness', 'i know this', 'dear friend', 'dear one', 'mere dost',
  'the war is not outside you', 'i have stood on that field', 'your mind has turned into',
];

/**
 * Build a structured memory brief from conversation history.
 * @param {Array} history — [{ role, text, persona, shloka, counseling }]
 * @returns {Object}
 */
export function buildMemory(history = []) {
  const userTurns = history.filter((m) => m.role === 'user' && m.text);
  const assistantTurns = history.filter((m) => m.role === 'assistant' && m.text);

  /* ── What has this person been feeling across the conversation? ── */
  const emotionTrail = userTurns.slice(-6).map((m) => {
    const a = analyzeHeuristic(m.text);
    return { emotion: a.emotion, topic: a.topic };
  });

  const topicCounts = {};
  for (const e of emotionTrail) {
    if (e.topic && e.topic !== 'general') topicCounts[e.topic] = (topicCounts[e.topic] || 0) + 1;
  }
  const dominantTopic = Object.entries(topicCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || null;

  /* ── Verses already cited: never repeat one in the same conversation. ── */
  const usedShlokas = [];
  for (const m of assistantTurns) {
    const s = m.shloka;
    if (s && s.chapter && s.verse) {
      const key = `${s.chapter}.${s.verse}`;
      if (!usedShlokas.includes(key)) usedShlokas.push(key);
    }
  }

  /* ── Openings already used: never repeat one. ── */
  const usedOpenings = assistantTurns
    .map((m) => (m.text || '').trim().split(/\s+/).slice(0, OPENING_WORD_COUNT).join(' '))
    .filter(Boolean)
    .slice(-6);

  /* ── Questions already asked: don't re-ask the same thing. ── */
  const askedQuestions = assistantTurns
    .map((m) => m.counseling)
    .filter((q) => typeof q === 'string' && q.trim())
    .slice(-4);

  /* ── Overused phrases that already appeared. ── */
  const assistantBlob = assistantTurns.map((m) => (m.text || '').toLowerCase()).join(' ');
  const burnedPhrases = OVERUSED.filter((p) => assistantBlob.includes(p));

  /* Did the previous reply already end with a question? Two in a row is what
     makes the chatbot feel like an interviewer rather than a companion. */
  const lastAssistant = assistantTurns[assistantTurns.length - 1];
  const lastTurnAskedQuestion = Boolean(
    (lastAssistant?.counseling || '').trim() || /\?\s*$/.test((lastAssistant?.text || '').trim())
  );

  return {
    turnCount: userTurns.length,
    isFirstMessage: userTurns.length === 0,
    lastTurnAskedQuestion,
    emotionTrail,
    dominantTopic,
    lastUserMessage: userTurns[userTurns.length - 1]?.text || null,
    lastAssistantMessage: assistantTurns[assistantTurns.length - 1]?.text || null,
    usedShlokas,
    usedOpenings,
    askedQuestions,
    burnedPhrases,
  };
}

/**
 * Render the memory brief as prompt text.
 */
export function renderMemoryBrief(memory) {
  if (memory.isFirstMessage) {
    return `This is the first message of THIS conversation thread. That says nothing about whether you know them — what you know about them as a person is in the section above. Read their actual words carefully and respond to what they specifically said, not to a generic version of it.`;
  }

  const lines = [`This conversation is already ${memory.turnCount} message(s) in. CONTINUE it — do not restart, do not re-introduce yourself, do not re-greet.`];

  if (memory.emotionTrail.length) {
    lines.push(`How they have been feeling, oldest to newest: ${memory.emotionTrail.map((e) => e.emotion).join(' → ')}.`);
  }
  if (memory.dominantTopic) {
    lines.push(`What this conversation keeps coming back to: ${memory.dominantTopic}.`);
  }
  if (memory.lastAssistantMessage) {
    lines.push(`The last thing YOU said was: "${memory.lastAssistantMessage.slice(0, 220)}" — build on it. Do not repeat its idea or its shape.`);
  }
  if (memory.usedOpenings.length) {
    lines.push(`Openings you have ALREADY used (start differently this time): ${memory.usedOpenings.map((o) => `"${o}…"`).join(', ')}.`);
  }
  if (memory.askedQuestions.length) {
    lines.push(`Questions you have ALREADY asked (ask something new): ${memory.askedQuestions.map((q) => `"${q}"`).join(' ')}.`);
  }
  if (memory.usedShlokas.length) {
    lines.push(`Verses already quoted in this conversation — do NOT quote them again: ${memory.usedShlokas.join(', ')}.`);
  }
  if (memory.burnedPhrases.length) {
    lines.push(`Phrases already burned in this conversation — they are now FORBIDDEN: ${memory.burnedPhrases.map((p) => `"${p}"`).join(', ')}.`);
  }

  return lines.join('\n');
}

/**
 * Trim history to what fits comfortably in the context window.
 */
export function recentTurns(history = []) {
  return history.slice(-MAX_TURNS_IN_PROMPT);
}
