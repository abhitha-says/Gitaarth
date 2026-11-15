/**
 * Gitaarth AI — Narrative Index
 *
 * A curated map from real human situations to real episodes in the epics.
 *
 * Why a table instead of letting the model free-associate: asked for "a
 * Mahabharata story about X", an LLM will happily invent one. Every entry here
 * is an event that actually occurs in the source material, described in plain
 * terms, so the model relates rather than fabricates.
 *
 * Nothing here is auto-inserted. Entries are offered to the prompt only when
 * the situation is weighty enough, and the model is told it may ignore them —
 * a forced parallel ("this is exactly like Arjuna") is worse than no parallel.
 */

export const NARRATIVES = [
  {
    id: 'arjuna-paralysis',
    source: 'Mahabharata / Bhagavad Gita',
    fits: ['confusion', 'seeking_decision', 'paralysis', 'duty', 'moral dilemma', 'career', 'self'],
    summary: 'Arjuna, the finest archer alive, put his bow down before Kurukshetra and refused to fight — not from cowardice, but because every path in front of him cost him something he loved. Krishna did not remove the cost. He helped him see his own duty clearly enough to act rather than freeze.',
    useWhen: 'They are stuck between options where no choice is clean, and the paralysis itself has become the problem.',
    dontStretch: 'A simple preference between two good options is not this. Do not inflate an ordinary decision into a moral crisis.',
  },
  {
    id: 'karna-identity',
    source: 'Mahabharata',
    fits: ['identity', 'rejection', 'loneliness', 'anger', 'self', 'comparison', 'family', 'unfair'],
    summary: 'Karna was turned away for who people thought he was, not for what he could do. He was the equal of any warrior there, and spent his life being told he was not. His loyalty to the one person who accepted him ended up costing him everything.',
    useWhen: 'They feel judged for their background, passed over despite being capable, or bound by loyalty to someone who is not good for them.',
    dontStretch: 'Not for ordinary disappointment or one bad interview.',
  },
  {
    id: 'bhishma-vow',
    source: 'Mahabharata',
    fits: ['duty', 'family', 'regret', 'guilt', 'obligation', 'sacrifice'],
    summary: 'Bhishma gave up his throne and his own life as a young man to keep a promise to his father. He kept that vow perfectly for decades — and it left him bound to the wrong side of a war he knew was wrong, unable to act.',
    useWhen: 'They are trapped by an old commitment, or by a promise to family that has outlived its purpose.',
    dontStretch: 'Not for everyday reluctance about chores or work.',
  },
  {
    id: 'yudhishthira-truth',
    source: 'Mahabharata',
    fits: ['guilt', 'regret', 'honesty', 'leadership', 'money', 'addiction', 'mistake'],
    summary: 'Yudhishthira was the most truthful man of his age and still gambled away his kingdom, his brothers, and his wife in a single night. Being good did not make him immune to one catastrophic weakness.',
    useWhen: 'They did something badly out of character and cannot forgive themselves for it, or they have a weakness that keeps undoing their good intentions.',
    dontStretch: 'Not for small mistakes. This one is heavy; do not use it lightly.',
  },
  {
    id: 'draupadi-sabha',
    source: 'Mahabharata',
    fits: ['anger', 'humiliation', 'unfair', 'betrayed', 'loneliness', 'relationship'],
    summary: 'Draupadi was wronged in a full court, and every powerful man in that hall — elders, teachers, her own husbands — stayed silent. Her anger was not a flaw to be managed. It was the only honest response in the room.',
    useWhen: 'They were wronged and the people who should have defended them said nothing, and they are being told to calm down.',
    dontStretch: 'Not for irritation or minor slights.',
  },
  {
    id: 'abhimanyu-chakravyuh',
    source: 'Mahabharata',
    fits: ['fear', 'anxiety', 'career', 'studies', 'first job', 'inexperience', 'courage'],
    summary: 'Abhimanyu knew how to break into the chakravyuh formation but had never learned how to get out. He went in anyway, because it needed doing and nobody else could.',
    useWhen: 'They are stepping into something they are only half-prepared for — a first job, a first project — and know it.',
    dontStretch: 'The story ends badly. Use it for the courage of entering, never as a prediction. Do not use it with someone already frightened.',
  },
  {
    id: 'eklavya-thumb',
    source: 'Mahabharata',
    fits: ['studies', 'unfair', 'sacrifice', 'learning', 'comparison', 'self'],
    summary: 'Eklavya taught himself archery from a clay figure of a teacher who had refused him, and became better than the students that teacher accepted.',
    useWhen: 'They are learning something without the access, mentor, or institution other people had.',
    dontStretch: 'The ending is unjust. Use the self-teaching, not the ending.',
  },
  {
    id: 'hanuman-ocean',
    source: 'Ramayana',
    fits: ['self-doubt', 'confidence', 'fear', 'anxiety', 'capability', 'career'],
    summary: 'Hanuman could cross an ocean and had forgotten it. He sat on the shore with the others until someone reminded him what he was capable of — and then he simply did it.',
    useWhen: 'They are underestimating themselves at something they have already proven they can do.',
    dontStretch: 'Not for genuine lack of skill. This is about forgotten capability, not flattery.',
  },
  {
    id: 'rama-exile',
    source: 'Ramayana',
    fits: ['loss', 'sadness', 'family', 'duty', 'unfair', 'setback', 'career'],
    summary: 'Rama was told to leave for fourteen years on the eve of his coronation. He put down what he had been promised and walked out without an argument or a grudge, and kept being who he was the whole way.',
    useWhen: 'Something they had earned was taken away by someone else\'s decision.',
    dontStretch: 'Do not use it to tell them to accept mistreatment quietly.',
  },
  {
    id: 'sita-agni',
    source: 'Ramayana',
    fits: ['humiliation', 'unfair', 'relationship', 'dignity', 'anger'],
    summary: 'Sita was asked to prove herself to people who had no right to ask, after enduring more than any of them.',
    useWhen: 'They are being made to justify themselves to people who have not earned the right to judge.',
    dontStretch: 'Handle carefully. Never suggest the proving was reasonable.',
  },
  {
    id: 'bharata-sandals',
    source: 'Ramayana',
    fits: ['family', 'friendship', 'duty', 'loyalty', 'responsibility', 'leadership'],
    summary: 'Bharata was handed a kingdom he never wanted and refused to sit on the throne. He placed Rama\'s sandals on it and ruled as a caretaker until his brother returned.',
    useWhen: 'They have been handed something that belongs to someone else, or are holding a position for another person.',
    dontStretch: 'Not for ordinary workplace politics.',
  },
  {
    id: 'krishna-sudama',
    source: 'Mahabharata / Bhagavata',
    fits: ['friendship', 'money', 'shame', 'gratitude', 'humility', 'relationship'],
    summary: 'Sudama came to Krishna\'s palace with nothing but a small bundle of beaten rice, too ashamed to ask for anything. Krishna ate the rice and never let him feel small for a moment of it.',
    useWhen: 'They feel embarrassed about what little they have to offer, or about needing help from a friend.',
    dontStretch: 'Not a lesson about wealth or charity.',
  },
];

/**
 * Offer the two or three narratives that could plausibly fit this moment.
 * Returns [] whenever the moment does not call for a story at all — greetings,
 * good news, small talk, and anything shallow.
 */
export function selectNarratives(analysis, { userMessage = '' } = {}) {
  if (analysis.isGreeting || analysis.isSmallTalk) return [];

  // Celebration and casual chat do not want an epic. PART 20: conversation first.
  const heavyEnough =
    analysis.isExplicitRequest ||
    analysis.intent === 'seeking_decision' ||
    analysis.intent === 'seeking_comfort' ||
    (analysis.valence === 'negative' && analysis.intensity !== 'low');

  if (!heavyEnough) return [];

  const haystack = `${userMessage} ${analysis.topic || ''} ${analysis.emotion || ''} ${analysis.intent || ''}`.toLowerCase();

  const scored = NARRATIVES.map((n) => {
    let score = 0;
    for (const tag of n.fits) {
      if (haystack.includes(tag)) score += tag.includes(' ') ? 3 : 2;
    }
    return { ...n, score };
  }).filter((n) => n.score > 0);

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, 3);
}

/** Render selected narratives as prompt text. */
export function renderNarratives(narratives) {
  if (!narratives.length) return '';

  return `═══ EPISODES YOU MIGHT DRAW ON ═══
These are real events from the epics that may — or may not — illuminate what this person is going through. You are under NO obligation to use one. Using none is the common, correct choice.

${narratives.map((n) => `— ${n.summary}
  (${n.source}) Fits when: ${n.useWhen}
  Do not stretch it: ${n.dontStretch}`).join('\n\n')}

IF you use one:
• Bring it up the way you would remember something, not the way a search engine returns it. "You know what this reminds me of…" — not "In the Mahabharata, chapter…".
• Two or three sentences of the story, told plainly. Then what it might mean for them.
• Say out loud that their situation is not the same as that one. It is a light held up to their life, not a template laid over it.
• Never say "you are exactly like Arjuna". They are not Arjuna. Their life is not the Mahabharata.
• If the connection is only that the emotion matches, that is not enough. Drop it and just talk to them.
• Never invent an event, a conversation, or a teaching that is not in the summaries above.`;
}
