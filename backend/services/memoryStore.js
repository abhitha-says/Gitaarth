/**
 * Gitaarth AI — Long-Term Memory Store
 *
 * The piece that makes a NEW CHAT feel like the same relationship.
 *
 *   write path:  turn ends → extract durable facts → dedupe → persist
 *   read path:   message arrives → score memories against it → pass only the relevant ones
 *
 * Two rules govern everything here:
 *   1. Store little. Only facts that would change a future reply.
 *   2. Retrieve less. An irrelevant memory in the prompt makes Krishna
 *      bring up the internship when the user asked about their mother.
 *
 * Extraction is deliberately fire-and-forget: it must never add latency to
 * the reply the person is waiting for.
 */

import { isDBConnected } from '../config/db.js';
import Memory, { MEMORY_TYPES } from '../models/Memory.js';
import { classifyWithLLM } from './grokService.js';

/* How many memories may ride along in a single prompt. Beyond this the model
   starts pattern-matching the list instead of listening to the person. */
const MAX_IN_PROMPT = 6;

/* Score a memory must reach before it is considered relevant to THIS message. */
const RELEVANCE_FLOOR = 3;

/* Per-person ceiling. Past this, the weakest and stalest get archived. */
const MAX_ACTIVE_PER_OWNER = 150;

/* Two memories this similar are the same fact worded differently. */
const DUPLICATE_SIMILARITY = 0.6;

const STOPWORDS = new Set([
  'the', 'a', 'an', 'and', 'or', 'but', 'if', 'is', 'am', 'are', 'was', 'were', 'be', 'been',
  'to', 'of', 'in', 'on', 'at', 'for', 'with', 'about', 'from', 'by', 'as', 'it', 'its',
  'this', 'that', 'these', 'those', 'i', 'me', 'my', 'mine', 'you', 'your', 'we', 'us',
  'he', 'she', 'they', 'them', 'his', 'her', 'their', 'user', 'users', 'have', 'has', 'had',
  'do', 'does', 'did', 'will', 'would', 'can', 'could', 'should', 'may', 'might', 'just',
  'so', 'very', 'not', 'no', 'yes', 'what', 'when', 'how', 'why', 'who', 'which', 'get',
  'got', 'want', 'wants', 'like', 'really', 'now', 'then', 'there', 'here', 'some', 'any',
  'hai', 'hain', 'ka', 'ki', 'ke', 'ko', 'se', 'me', 'mein', 'aur', 'par', 'bhi', 'hi',
]);

function tokenize(text = '') {
  return (text.toLowerCase().match(/[a-z']{3,}/g) || []).filter((w) => !STOPWORDS.has(w));
}

/** Jaccard overlap of two token sets — cheap, deterministic, good enough for dedupe. */
function similarity(aTokens, bTokens) {
  const a = new Set(aTokens);
  const b = new Set(bTokens);
  if (!a.size || !b.size) return 0;
  let shared = 0;
  for (const t of a) if (b.has(t)) shared++;
  return shared / (a.size + b.size - shared);
}

/* ═══════════════════════════ WRITE PATH ═══════════════════════════ */

const EXTRACTION_PROMPT = `You extract long-term memories for a spiritual companion app. You never reply to the user — you only decide what is worth remembering about them for FUTURE conversations, weeks from now.

Store a memory ONLY if it would genuinely change how a future conversation should go.

WORTH REMEMBERING:
- life events and achievements ("got an internship", "cleared the exam", "grandmother passed away")
- goals and aspirations ("wants to be financially independent", "wants to settle in Bangalore")
- projects and work they are doing ("first project is managing an Instagram account")
- career / studies ("final year CS student", "works at a startup")
- people who matter to them ("has a younger brother he is close to")
- recurring worries ("keeps worrying he is falling behind his friends")
- spiritual interests ("has started reading the Gita in the morning")
- anything they explicitly ask to be remembered
- how they want to be spoken to

NOT WORTH REMEMBERING:
- passing moods ("feeling tired today")
- small talk, greetings, thanks
- trivia with no bearing on their life ("likes pizza")
- anything the assistant said — only facts about the USER
- restating a question they asked

Output ONLY a JSON object:
{"memories":[{"type":"<one of: achievement|goal|project|career|relationship|concern|event|preference|spiritual|identity|other>","content":"<ONE sentence, third person, starting with 'User'>","keywords":["3-6 lowercase nouns for lookup"],"importance":<1-5, 5 = defines who they are>}]}

Return {"memories":[]} when nothing durable was said — that is the common case and is completely fine. Never invent facts the user did not state.`;

/* ─── Deterministic pre-pass ───
   The LLM extractor is good but not reliable: in testing it dropped "I got an
   internship today!" — the single highest-value memory this app can hold. These
   patterns are the high-signal cases, caught without asking a model's opinion.
   Anything they produce is deduped against the LLM's output downstream. */

const CERTAIN_MEMORIES = [
  {
    type: 'achievement',
    importance: 5,
    re: /\bi\s+(?:just\s+|finally\s+)?(?:got|received|landed|bagged|cracked|cleared|secured)\b[^.!?]{0,60}?\b(internship|job|offer|placement|promotion|admission|scholarship|position|role|raise)\b/i,
  },
  { type: 'achievement', importance: 5, re: /\bi\s+(?:got|am|'?m|have been)\s+(selected|promoted|hired|accepted|shortlisted)\b/i },
  { type: 'achievement', importance: 4, re: /\bi\s+(?:passed|topped|won|cleared)\b[^.!?]{0,40}\b(exam|test|interview|round|competition|semester)\b/i },
  { type: 'goal', importance: 4, re: /\bi\s+(?:want|wish|hope|plan|aim|intend)\s+to\b[^.!?]{5,90}/i },
  { type: 'goal', importance: 4, re: /\bmy\s+(goal|dream|ambition|plan)\s+is\b[^.!?]{5,90}/i },
  { type: 'event', importance: 5, re: /\b(?:my|our)\s+\w{3,12}\s+(?:passed away|died)\b/i },
  { type: 'preference', importance: 5, re: /\b(?:remember|note)\s+(?:this|that)\b|\bplease remember\b|\bdon'?t forget\b/i },
];

/**
 * Catch the high-signal facts deterministically. Content is the user's own
 * sentence, lightly reframed — no model, no chance of it being skipped.
 */
function certainMemories(userMessage) {
  const found = [];
  for (const { type, importance, re } of CERTAIN_MEMORIES) {
    const match = re.exec(userMessage);
    if (!match) continue;

    const sentence = match[0].trim().replace(/\s+/g, ' ');
    const content = `User said: "${sentence.charAt(0).toUpperCase()}${sentence.slice(1)}".`;
    found.push({ type, content: content.slice(0, 300), keywords: tokenize(sentence).slice(0, 6), importance });
  }
  return found;
}

/**
 * Pull durable facts out of one exchange and persist them.
 * Safe to call without awaiting — it swallows its own errors.
 *
 * @param {Object}  p
 * @param {string}  p.ownerKey
 * @param {string}  p.sessionId
 * @param {string}  p.userMessage
 * @param {Array}   p.recentHistory — [{ role, text }] for pronoun resolution
 */
export async function extractMemories({ ownerKey, sessionId, userMessage, recentHistory = [] }) {
  if (!ownerKey || !isDBConnected() || !userMessage?.trim()) return [];

  // Nothing durable fits in a handful of words ("ok", "thanks", "hey").
  if (userMessage.trim().split(/\s+/).length < 4) return [];

  const context = recentHistory
    .slice(-4)
    .map((m) => `${m.role === 'user' ? 'User' : 'Guide'}: ${(m.text || '').slice(0, 200)}`)
    .join('\n');

  let llmCandidates = [];
  try {
    const raw = await classifyWithLLM([
      { role: 'system', content: EXTRACTION_PROMPT },
      {
        role: 'user',
        content: `${context ? `Conversation so far:\n${context}\n\n` : ''}Latest user message:\n"${userMessage}"`,
      },
    ]);
    if (Array.isArray(raw?.memories)) llmCandidates = raw.memories;
  } catch (err) {
    // The deterministic pass below still runs — a dead API must not mean amnesia.
    console.warn('⚠️ Memory extraction failed:', err.message);
  }

  // LLM output first so its better wording wins; the certain ones fill the gaps
  // and are folded into any duplicate by upsertMemory.
  const candidates = [...llmCandidates, ...certainMemories(userMessage)];
  if (!candidates.length) return [];

  const saved = [];
  for (const candidate of candidates.slice(0, 6)) {
    const stored = await upsertMemory(ownerKey, sessionId, candidate);
    if (stored) saved.push(stored);
  }

  if (saved.length) {
    console.log(`🧠 ${saved.length} memory(ies) stored for ${ownerKey}: ${saved.map((m) => m.content).join(' | ')}`);
    await evictIfOverCapacity(ownerKey);
  }

  return saved;
}

/**
 * Insert a memory, or fold it into the existing one it duplicates.
 * Re-hearing a fact is a signal that it matters, so a merge raises importance.
 */
async function upsertMemory(ownerKey, sessionId, candidate) {
  const content = typeof candidate?.content === 'string' ? candidate.content.trim() : '';
  if (content.length < 8 || content.length > 300) return null;

  const type = MEMORY_TYPES.includes(candidate.type) ? candidate.type : 'other';
  const keywords = Array.isArray(candidate.keywords)
    ? candidate.keywords.filter((k) => typeof k === 'string' && k.trim()).map((k) => k.toLowerCase().trim()).slice(0, 8)
    : [];
  const importance = Math.min(5, Math.max(1, Number(candidate.importance) || 3));

  try {
    const existing = await Memory.find({ ownerKey, status: 'active', type }).lean();
    const incomingTokens = tokenize(`${content} ${keywords.join(' ')}`);

    for (const prior of existing) {
      const priorTokens = tokenize(`${prior.content} ${(prior.keywords || []).join(' ')}`);
      if (similarity(incomingTokens, priorTokens) >= DUPLICATE_SIMILARITY) {
        const merged = await Memory.findByIdAndUpdate(
          prior._id,
          {
            $set: {
              content,                                                  // newest wording wins
              keywords: [...new Set([...(prior.keywords || []), ...keywords])].slice(0, 10),
              importance: Math.max(prior.importance, importance),
              sourceSessionId: sessionId || prior.sourceSessionId,
            },
            $inc: { mentionCount: 1 },
          },
          { new: true, lean: true }
        );
        return merged;
      }
    }

    return await Memory.create({ ownerKey, type, content, keywords, importance, sourceSessionId: sessionId });
  } catch (err) {
    console.warn('⚠️ Memory upsert failed:', err.message);
    return null;
  }
}

/** Keep the per-person set bounded: archive the weakest, stalest rows. */
async function evictIfOverCapacity(ownerKey) {
  try {
    const count = await Memory.countDocuments({ ownerKey, status: 'active' });
    if (count <= MAX_ACTIVE_PER_OWNER) return;

    const doomed = await Memory.find({ ownerKey, status: 'active' })
      .sort({ importance: 1, mentionCount: 1, updatedAt: 1 })
      .limit(count - MAX_ACTIVE_PER_OWNER)
      .select('_id')
      .lean();

    await Memory.updateMany(
      { _id: { $in: doomed.map((d) => d._id) } },
      { $set: { status: 'archived' } }
    );
  } catch (err) {
    console.warn('⚠️ Memory eviction failed:', err.message);
  }
}

/* ═══════════════════════════ READ PATH ═══════════════════════════ */

/**
 * Score every stored memory against the message in hand and return only the
 * ones that earn their place in the prompt.
 *
 * The `openingTurn` flag is what makes TEST 7 work: on the first message of a
 * brand-new conversation there is nothing to match against, so we fall back to
 * "what defines this person" rather than returning nothing.
 *
 * @returns {{ relevant: Array, openers: Array }}
 */
export async function retrieveMemories({ ownerKey, message, analysis = {}, openingTurn = false }) {
  if (!ownerKey || !isDBConnected()) return { relevant: [], openers: [] };

  let all;
  try {
    all = await Memory.find({ ownerKey, status: 'active' })
      .sort({ importance: -1, updatedAt: -1 })
      .limit(120)
      .lean();
  } catch (err) {
    console.warn('⚠️ Memory retrieval failed:', err.message);
    return { relevant: [], openers: [] };
  }

  if (!all.length) return { relevant: [], openers: [] };

  const messageTokens = new Set(tokenize(message));
  const topicTokens = new Set(tokenize(`${analysis.topic || ''} ${analysis.emotion || ''}`));
  const now = Date.now();

  const scored = all.map((m) => {
    const memTokens = tokenize(`${m.content} ${(m.keywords || []).join(' ')}`);

    let score = 0;
    for (const token of new Set(memTokens)) {
      if (messageTokens.has(token)) score += 3;   // direct topical hit
      else if (topicTokens.has(token)) score += 2; // matches the detected topic
    }

    // Important facts surface more readily, but importance alone never clears
    // the floor — relevance has to come from the message itself.
    score += (m.importance - 3) * 0.5;

    // Recent facts are likelier to still be live ("how's the internship?").
    const ageDays = (now - new Date(m.updatedAt).getTime()) / 86400000;
    if (ageDays < 7) score += 1;
    else if (ageDays > 90) score -= 1;

    // Repeatedly mentioned things matter to them.
    if (m.mentionCount > 2) score += 0.5;

    return { ...m, score };
  });

  scored.sort((a, b) => b.score - a.score);

  const relevant = scored.filter((m) => m.score >= RELEVANCE_FLOOR).slice(0, MAX_IN_PROMPT);

  /* Openers: only for the first turn of a fresh conversation. Prefer things
     that are both important and recent, and rotate so the same fact is not
     used to greet them every single time. */
  let openers = [];
  if (openingTurn) {
    openers = [...all]
      .filter((m) => m.importance >= 3)
      .sort((a, b) => {
        const staleA = a.lastReferencedAt ? new Date(a.lastReferencedAt).getTime() : 0;
        const staleB = b.lastReferencedAt ? new Date(b.lastReferencedAt).getTime() : 0;
        if (staleA !== staleB) return staleA - staleB;          // least recently used first
        return b.importance - a.importance;
      })
      .slice(0, 3);
  }

  touch([...relevant, ...openers]);
  return { relevant, openers };
}

/** Mark memories as used, so the opener rotation actually rotates. */
function touch(memories) {
  const ids = memories.map((m) => m._id).filter(Boolean);
  if (!ids.length) return;
  Memory.updateMany({ _id: { $in: ids } }, { $set: { lastReferencedAt: new Date() } })
    .catch((err) => console.warn('⚠️ Memory touch failed:', err.message));
}

/**
 * Render retrieved memories as prompt text.
 *
 * The wording here matters as much as the retrieval: the model must be told
 * these are things it *knows*, never things it *looked up*, and that using
 * them is optional.
 */
export function renderLongTermMemory({ relevant, openers }, { isNewConversation }) {
  const lines = [];

  if (relevant.length) {
    lines.push('Things you already know about this person, from times you have spoken before:');
    for (const m of relevant) lines.push(`• ${m.content}`);
    lines.push('');
    lines.push('These are relevant to what they just said. Use one if it makes your reply more specific — "you had mentioned…", "last time you were…". Never use all of them. Never list them back.');
  }

  if (isNewConversation && openers.length) {
    lines.push('');
    lines.push('This is the start of a NEW conversation, but not a new relationship. What was going on in their life when you last spoke:');
    for (const m of openers) lines.push(`• ${m.content}`);
    lines.push('');
    lines.push('Greet them like someone you know. Picking up ONE of these naturally ("how has the internship been treating you?") is usually the right move. If they opened with something specific instead, follow their lead and leave these alone.');
  }

  if (!lines.length) {
    return `You remember NOTHING about this person — either you have never spoken, or nothing you know is relevant to what they just said.

Do not imply otherwise. No "since we last spoke", no "welcome back", no "you had mentioned", no "how is that going now". Meet them as they are, in this message, with nothing behind it.`;
  }

  lines.push('');
  lines.push('ABSOLUTE RULE: never reveal how you know. No "according to your previous conversation", no "I have stored", no "my records". You simply remember, the way a friend does. And do not force a memory in where it does not belong — if none of it fits what they just said, ignore all of it.');

  return lines.join('\n');
}
