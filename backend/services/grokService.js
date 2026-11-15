/**
 * Gitaarth AI — LLM Service
 * Wraps the Groq/xAI chat API using the OpenAI-compatible SDK.
 *
 * Two entry points:
 *   classifyWithLLM() — cheap, deterministic, JSON-only emotion/intent call.
 *   getGrokResponse() — the generation call, with a quality gate and one repair retry.
 */

import OpenAI from 'openai';

/* Constructed lazily: a missing key should fail the request, not crash the
   server at import time (which would silently drop every chat to a fallback). */
let _client = null;
function getClient() {
  if (!_client) {
    const apiKey = process.env.XAI_GROK_API_KEY;
    if (!apiKey) throw new Error('XAI_GROK_API_KEY is missing from the environment');
    _client = new OpenAI({ apiKey, baseURL: 'https://api.groq.com/openai/v1' });
  }
  return _client;
}

const MODEL = process.env.XAI_GROK_MODEL || 'openai/gpt-oss-120b';
const CLASSIFIER_MODEL = process.env.XAI_CLASSIFIER_MODEL || MODEL;

/* Reasoning models (gpt-oss) spend completion tokens thinking before they answer.
   At their default effort the 900-token budget runs out before the JSON reply is
   written, and Groq rejects the call with json_validate_failed. */
const REASONING_EFFORT = process.env.XAI_REASONING_EFFORT || 'low';
const reasoningOpts = (model) => (/gpt-oss/i.test(model) ? { reasoning_effort: REASONING_EFFORT } : {});

/* ─────────── Quality gate ─────────── */

/** Phrases that make the reply sound like a chatbot or a poetry generator. */
const BANNED_PATTERNS = [
  /\bi hear (your|the) (pain|struggle|sorrow)\b/i,
  /\bi understand (how|what) you\b/i,
  /\bi can see that you\b/i,
  /\bbattlefield\b/i,
  /\bthe (weight|burden) you (carry|bear)\b/i,
  /\bdear (friend|one|child|soul)\b/i,
  /\bmy child\b/i,
  /\bbeloved (soul|one)\b/i,
  /\bmere dost\b/i,
  /\bpartha\b/i,
  /\bkaunteya\b/i,
  /\bas i (told|said to) arjuna\b/i,
  /\bthe (gita|ramayana|mahabharata) teaches\b/i,
  /\bstay positive\b/i,
  /\bbelieve in yourself\b/i,
  /\byour heart is (heavy|troubled|burdened)\b/i,
  /\blet'?s (break|unpack) (it|this|that) (down|up)?\b/i,
  /\bhere'?s the thing\b/i,
  /\bthat must be (difficult|hard|tough)\b/i,
  /\bit'?s (okay|ok|normal|natural) to feel\b/i,
  /\bthat'?s (totally |completely )?(normal|understandable)\b/i,
  /\bi'?m here for you\b/i,
  /\btake a (deep breath|few deep breaths)\b/i,
  /\bbe kind to yourself\b/i,
  /\byou'?ve got this\b/i,
  /\bgreat question\b/i,
  /\bit'?s (okay|ok) to not be (okay|ok)\b/i,
  /\bit'?s no wonder\b/i,
  /\ba testament to\b/i,
  /\bmore than just a pet\b/i,
  /* Generic-career-advice register — the "managing an Instagram account can be
     a lot of fun" failure. This is ChatGPT, not Krishna. */
  /\bthat sounds like a (fantastic|great|wonderful|amazing) (first )?(project|opportunity|idea|choice)\b/i,
  /\bcan be a (lot of fun|fun (challenge|way|experience))\b/i,
  /\bit'?s a great way to\b/i,
  /\bthe world is your oyster\b/i,
  /\bmake sure to\b/i,
  /\bdon'?t forget to\b/i,
  /\bkeep up the good work\b/i,
  /\bwish you all the best\b/i,
  /\blet me know if\b/i,
  /\bfeel free to\b/i,
];

/** The verse should land inside the words, never be announced like a citation. */
const VERSE_ANNOUNCEMENTS = [
  /\bas (it'?s|it is) said\b/i,
  /\bas the saying goes\b/i,
  /\bas (i|it) (once )?(said|told)\b/i,
  /\bthere'?s? an? (old )?(saying|verse|teaching)\b/i,
  /\bthe scriptures? (say|tell)/i,
  /\bin the (gita|bhagavad gita|ramayana)\b/i,
];

/**
 * Distinctive lines from the few-shot examples in the system prompt. If these
 * show up, the model copied the example instead of writing for this person.
 */
const EXAMPLE_ECHOES = [
  /someone looked at your work and decided it was worth paying for/i,
  /before your mind runs off to worrying/i,
  /a week is nothing/i,
  /the house is loud with her missing/i,
  /love with nowhere left to go/i,
  /you are not behind schedule on this/i,
  /rehearsing the failure/i,
  /shut the book\W+eat something/i,
  // The Instagram / first-project example — copied verbatim in testing.
  /first step into working life/i,
  /a task to finish\b.{0,20}\ba small field to learn in/i,
  /treat it as a (small )?field to learn in/i,
  /get some of it wrong on purpose/i,
  /you wanted to learn before you earned/i,
  // The register samples in the language instruction, also copied verbatim.
  /that'?s wonderful\.\s*genuinely\s*[—-]\s*congratulations/i,
  /tell me what'?s actually worrying you about it/i,
  // Details that belong to the register samples and to no real person. If one
  // of these appears, the model has borrowed a fact instead of listening.
  /\bdriving test\b/i,
  /\bbakery counter\b/i,
  /\bfourth (time|try)\b.{0,40}\bthree times you were told no\b/i,
  /\bwhile wrong is cheap\b/i,
  /\bnowhere left to put itself\b/i,
];

/** Claims of a shared past. Fine when there IS one; a lie when there is not. */
const FALSE_FAMILIARITY = [
  /\bsince we (last )?(spoke|met|talked)\b/i,
  /\blast time we (spoke|met|talked)\b/i,
  /\bwhen we last (spoke|met|talked)\b/i,
  /\bwelcome back\b/i,
  /\bgood to (see|hear from) you again\b/i,
  /\byou had mentioned\b/i,
  /\byou told me (earlier|before|last)\b/i,
  /\b(again|back)\s*[,!]/i,
  /\bas always\b/i,
  /\bhow (is|are|did) (that|the|your) .{0,30}\bgoing\b.{0,20}\bnow\b/i,
];

/** Words that must never appear when the user is celebrating. */
const DISTRESS_WORDS = /\b(suffering|sorrow|grief|anguish|torment|burden|prison|darkness|battle|war|wound|despair|dukh|dard)\b/i;

/**
 * Check a generated reply against the analysis. Returns a list of problems,
 * empty if the reply is acceptable.
 */
export function auditResponse(parsed, analysis) {
  const problems = [];
  const text = `${parsed.message || ''} ${parsed.counseling || ''}`;

  for (const pattern of BANNED_PATTERNS) {
    if (pattern.test(text)) problems.push(`uses the banned phrase matching ${pattern}`);
  }

  for (const pattern of EXAMPLE_ECHOES) {
    if (pattern.test(text)) {
      problems.push('copies wording straight from the illustrative examples instead of writing for this person');
      break;
    }
  }

  if (parsed.shloka) {
    for (const pattern of VERSE_ANNOUNCEMENTS) {
      if (pattern.test(parsed.message || '')) {
        problems.push('announces the verse like a citation instead of letting its meaning live inside your own words');
        break;
      }
    }
    // The verse already renders in its own card — repeating it is duplication.
    const translation = (parsed.shloka.translation || '').toLowerCase().replace(/[^a-z ]/g, '').trim();
    if (translation.length > 25 && (parsed.message || '').toLowerCase().replace(/[^a-z ]/g, '').includes(translation.slice(0, 40))) {
      problems.push('repeats the verse translation word-for-word in the message — say it in your own words instead');
    }
  }

  if (/\?\s*$/.test((parsed.message || '').trim())) {
    problems.push('ends the message with a question — the single question belongs in the "counseling" field only');
  }

  /* ── The follow-up question must be earned, not automatic ── */
  const asked = (parsed.counseling || '').trim();
  if (asked && analysis?.askQuestion === false) {
    problems.push('tacks a follow-up question onto a reply that did not need one — this message should simply land, so "counseling" must be an empty string');
  }

  /* ── An explicit request outranks everything: answer it, do not deflect ── */
  if (analysis?.isExplicitRequest) {
    if (/^[^.!]*\?\s*$/.test((parsed.message || '').trim())) {
      problems.push('answers a direct request with a clarifying question instead of the thing that was asked for');
    }
    if (analysis.explicitWants === 'gita' && !parsed.shloka) {
      problems.push('was asked outright for a Gita verse and did not provide one — a verse from the supplied list is mandatory here');
    }
  }

  /* ── Do not manufacture a shared past ──
     Only enforced when the pipeline actually retrieved nothing about them.
     When memories exist, referring back to them is exactly the point. */
  if (analysis?.hasLongTermMemory === false) {
    for (const pattern of FALSE_FAMILIARITY) {
      if (pattern.test(text)) {
        problems.push('implies you have spoken with this person before when you have not — drop every reference to a previous conversation');
        break;
      }
    }
  }

  /* ── "sakhi" is Krishna's word for them, not a verbal tic ── */
  const sakhiCount = (text.match(/\bsakhi\b/gi) || []).length;
  if (sakhiCount > 1) {
    problems.push('says "sakhi" more than once in a single reply — it is a term of affection, not punctuation; keep at most one');
  }
  if (sakhiCount && parsed.persona === 'ram') {
    problems.push('uses "sakhi" as Ram — that is Krishna\'s word, not his; Ram does not use affectionate nicknames');
  }

  if (analysis?.valence === 'positive' && DISTRESS_WORDS.test(text)) {
    problems.push('treats a happy message as if it were suffering — remove all distress language and celebrate instead');
  }

  if ((analysis?.isGreeting || analysis?.isSmallTalk) && parsed.shloka) {
    problems.push('quotes scripture in reply to a greeting');
  }

  if (analysis?.needsScripture === false && parsed.shloka && analysis?.valence === 'positive') {
    problems.push('forces a verse into a celebration');
  }

  const wordCount = (parsed.message || '').trim().split(/\s+/).length;
  if (wordCount > 220) problems.push('is far too long — cut it down');

  return problems;
}

/* ─────────── JSON parsing ─────────── */

function parseJSONResponse(raw) {
  let cleaned = raw.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

  const jsonMatch = cleaned.match(/\{[\s\S]*"message"[\s\S]*\}/);
  if (jsonMatch) cleaned = jsonMatch[0];

  const parsed = JSON.parse(cleaned);
  return {
    persona: parsed.persona === 'ram' ? 'ram' : 'krishna',
    message: typeof parsed.message === 'string' ? parsed.message.trim() : '',
    shloka: parsed.shloka && parsed.shloka.sanskrit ? parsed.shloka : null,
    counseling: typeof parsed.counseling === 'string' ? parsed.counseling.trim() : '',
  };
}

/* ─────────── Classifier call ─────────── */

/**
 * Deterministic JSON classification. Throws on failure so the caller can
 * fall back to the heuristic classifier.
 */
export async function classifyWithLLM(messages) {
  const completion = await getClient().chat.completions.create({
    model: CLASSIFIER_MODEL,
    messages,
    temperature: 0,
    max_tokens: 200,
    response_format: { type: 'json_object' },
    ...reasoningOpts(CLASSIFIER_MODEL),
  });

  const raw = completion.choices[0]?.message?.content || '';
  return JSON.parse(raw.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim());
}

/* ─────────── Generation call ─────────── */

/**
 * Generate the divine response.
 * @param {Array} messages — OpenAI-format messages from the prompt engine
 * @param {Object} analysis — emotion/intent analysis, used for the quality gate
 * @returns {Object} { persona, message, shloka, counseling }
 */
export async function getGrokResponse(messages, analysis = null) {
  // Warmer emotions get a little more spontaneity; painful ones stay steadier.
  const temperature = analysis?.valence === 'positive' ? 0.9
    : analysis?.valence === 'negative' ? 0.7
    : 0.8;

  const call = async (msgs) => {
    const completion = await getClient().chat.completions.create({
      model: MODEL,
      messages: msgs,
      temperature,
      max_tokens: 900,
      // Guarantees parseable output — the prompt already specifies the schema.
      response_format: { type: 'json_object' },
      ...reasoningOpts(MODEL),
    });
    return completion.choices[0]?.message?.content || '';
  };

  let raw = await call(messages);
  let parsed;

  try {
    parsed = parseJSONResponse(raw);
  } catch {
    console.warn('⚠️ LLM response was not valid JSON, using raw text');
    const cleanedRaw = raw
      .replace(/\{[\s\S]*"persona"[\s\S]*\}/, '')
      .replace(/```[\s\S]*```/g, '')
      .trim();
    return { persona: 'krishna', message: cleanedRaw || raw, shloka: null, counseling: '' };
  }

  /* ── Quality gate: one repair pass if the reply broke the rules ── */
  const problems = auditResponse(parsed, analysis);
  if (problems.length) {
    console.warn('⚠️ Response failed quality gate, retrying:', problems.join('; '));
    try {
      const repairRaw = await call([
        ...messages,
        { role: 'assistant', content: raw },
        {
          role: 'user',
          content: `That reply broke the rules. It ${problems.join(', and it ')}.

Write it again — same JSON format, same warmth, same register. Do NOT retreat into safe, generic, assistant-sounding language to avoid the mistake; that is a worse failure than the one you just made.

Keep it spoken and specific: use this person's own details, say the one true thing a polite assistant would skip, and sound like someone who knows them — not like a help desk. Output only the JSON object.`,
        },
      ]);
      const repaired = parseJSONResponse(repairRaw);
      // Only accept the repair if it is genuinely better.
      if (auditResponse(repaired, analysis).length < problems.length) parsed = repaired;
    } catch (err) {
      console.warn('⚠️ Repair pass failed, keeping original:', err.message);
    }
  }

  /* ── Hard guarantees the model cannot violate ── */
  if (parsed.persona === 'ram') parsed.shloka = null;
  if (analysis?.isGreeting || analysis?.isSmallTalk) parsed.shloka = null;
  // A question the pipeline decided against is dropped outright, so "stop
  // asking something after every message" holds even when the model ignores it.
  if (analysis?.askQuestion === false) parsed.counseling = '';

  return parsed;
}
