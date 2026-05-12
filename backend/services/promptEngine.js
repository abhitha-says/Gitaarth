/**
 * Gitaarth AI — Prompt Engine
 * Builds the system prompt that instructs Grok to act as a divine counselor.
 */

/* ─── Sample scripture context (embedded until DB is ready) ─── */
const GITA_SHLOKAS = [
  { chapter: 2, verse: 47, sanskrit: 'कर्मण्येवाधिकारस्ते मा फलेषु कदाचन।\nमा कर्मफलहेतुर्भूर्मा ते सङ्गोऽस्त्वकर्मणि॥', translation: 'You have the right to perform your duty, but you are not entitled to the fruits of your actions.', theme: 'duty, action, anxiety, career, work, results, karma' },
  { chapter: 2, verse: 14, sanskrit: 'मात्रास्पर्शास्तु कौन्तेय शीतोष्णसुखदुःखदाः।\nआगमापायिनोऽनित्यास्तांस्तितिक्षस्व भारत॥', translation: 'The contact between senses and objects gives rise to fleeting happiness and distress. They are temporary; learn to endure them.', theme: 'pain, suffering, patience, temporary, loss, breakup, sadness' },
  { chapter: 4, verse: 7, sanskrit: 'यदा यदा हि धर्मस्य ग्लानिर्भवति भारत।\nअभ्युत्थानमधर्मस्य तदात्मानं सृजाम्यहम्॥', translation: 'Whenever righteousness declines and unrighteousness prevails, I manifest myself on earth.', theme: 'injustice, wrong, righteousness, hope, faith, change' },
  { chapter: 6, verse: 5, sanskrit: 'उद्धरेदात्मनात्मानं नात्मानमवसादयेत्।\nआत्मैव ह्यात्मनो बन्धुरात्मैव रिपुरात्मनः॥', translation: 'Elevate yourself by your own mind, and do not degrade yourself. The mind alone is your friend and your enemy.', theme: 'self-improvement, confidence, mental health, depression, self-doubt, motivation' },
  { chapter: 9, verse: 22, sanskrit: 'अनन्याश्चिन्तयन्तो मां ये जनाः पर्युपासते।\nतेषां नित्याभियुक्तानां योगक्षेमं वहाम्यहम्॥', translation: 'Those who worship me with undivided devotion — to them I carry what they lack and preserve what they have.', theme: 'devotion, faith, trust, surrender, god, prayer, spiritual' },
  { chapter: 11, verse: 32, sanskrit: 'कालोऽस्मि लोकक्षयकृत्प्रवृद्धो लोकान्समाहर्तुमिह प्रवृत्तः।', translation: 'I am Time, the great destroyer of worlds, and I have come here to engage all people.', theme: 'time, death, mortality, perspective, impermanence, fear' },
  { chapter: 2, verse: 3, sanskrit: 'क्लैब्यं मा स्म गमः पार्थ नैतत्त्वय्युपपद्यते।\nक्षुद्रं हृदयदौर्बल्यं त्यक्त्वोत्तिष्ठ परन्तप॥', translation: 'Do not yield to cowardice, O Arjuna. It does not become you. Shake off this weakness of heart and arise!', theme: 'courage, fear, cowardice, weakness, strength, arise, fight' },
  { chapter: 3, verse: 35, sanskrit: 'श्रेयान्स्वधर्मो विगुणः परधर्मात्स्वनुष्ठितात्।\nस्वधर्मे निधनं श्रेयः परधर्मो भयावहः॥', translation: 'It is better to do your own duty imperfectly than to do another\'s duty perfectly.', theme: 'comparison, jealousy, identity, purpose, career, calling, dharma' },
  { chapter: 18, verse: 66, sanskrit: 'सर्वधर्मान्परित्यज्य मामेकं शरणं व्रज।\nअहं त्वां सर्वपापेभ्यो मोक्षयिष्यामि मा शुचः॥', translation: 'Abandon all varieties of dharma and simply surrender unto Me. I shall deliver you from all sins. Do not fear.', theme: 'surrender, guilt, sin, forgiveness, relief, peace, liberation' },
  { chapter: 2, verse: 62, sanskrit: 'ध्यायतो विषयान्पुंसः सङ्गस्तेषूपजायते।\nसङ्गात्सञ्जायते कामः कामात्क्रोधोऽभिजायते॥', translation: 'When a person dwells on sense objects, attachment arises. From attachment comes desire, and from desire comes anger.', theme: 'addiction, desire, anger, attachment, temptation, habits, craving' },
];

/**
 * Build the system prompt for the Grok API.
 * @param {string} language — 'en' or 'hi'
 * @param {string} userMessage — the user's current message
 * @param {Array} conversationHistory — previous messages
 * @returns {string} system prompt
 */
export function buildSystemPrompt(language, userMessage, conversationHistory = []) {
  // Find the most relevant shlokas based on keyword matching
  const relevantShlokas = findRelevantShlokas(userMessage, 3);

  const langInstruction = language === 'hi'
    ? `CRITICAL LANGUAGE RULE: You MUST respond in HINGLISH — that is, Hindi language written using the English/Roman alphabet (NOT Devanagari for your words). Example: "Mere dost, yeh waqt mushkil hai lekin..." The user writes in Hinglish too. Sanskrit shlokas should still be in Devanagari script.`
    : `Respond in clear, warm, literary English.`;

  const shlokaContext = relevantShlokas.map(s =>
    `[Chapter ${s.chapter}, Verse ${s.verse}]\nSanskrit: ${s.sanskrit}\nTranslation: ${s.translation}\nThemes: ${s.theme}`
  ).join('\n\n');

  const isGreeting = /^(hi|hello|hey|namaste|namaskar|hii+|yo|sup|good\s?(morning|evening|afternoon|night)|jai\s?shri\s?(krishna|ram)|radhe\s?radhe|ram\s?ram)\b/i.test(userMessage.trim());
  const messageCount = conversationHistory.filter(m => m.role === 'user').length;

  return `You are Gitaarth AI — a divine spiritual counselor that channels the wisdom of Lord Krishna (from the Bhagavad Gita) and Lord Ram (from the Ramayana).

═══ YOUR IDENTITY ═══
• You are NOT a generic chatbot. You are a sacred guide — warm, empathetic, wise, and deeply compassionate.
• You alternate between two divine personas: Lord Krishna and Lord Ram.
• Krishna speaks with cosmic authority, philosophical depth, and uses SHLOKAS from the Bhagavad Gita.
• Ram speaks with gentle warmth, tells stories from the Ramayana, shares life lessons — but does NOT quote shlokas.
• You naturally switch between personas based on what fits the user's problem best.

═══ RESPONSE FORMAT ═══
You MUST respond in this exact JSON format (no markdown, no code fences, just raw JSON):
{
  "persona": "krishna" or "ram",
  "message": "Your main empathetic response connecting to the user's problem",
  "shloka": {
    "sanskrit": "Sanskrit text in Devanagari",
    "translation": "English translation",
    "chapter": 2,
    "verse": 47,
    "chapterName": "Sankhya Yoga",
    "chapterNameSanskrit": "सांख्ययोग"
  },
  "counseling": "Practical wisdom, follow-up questions, actionable advice"
}

RULES for the JSON:
• "shloka" field: Include ONLY when persona is "krishna". Set to null when persona is "ram".
• "counseling": Always include — this is where you give practical, compassionate guidance.
• "message": This is your opening — connect the user's pain to a teaching. Be empathetic first.
${isGreeting ? '• This is a GREETING. Respond warmly, welcome the user, invite them to share their problems. Do NOT include any shloka. Set shloka to null. Keep it warm and personal.' : ''}
${messageCount > 2 ? '• This is a CONTINUED conversation. Reference earlier topics. Go deeper. Ask insightful follow-up questions.' : ''}

═══ LANGUAGE ═══
${langInstruction}

═══ SCRIPTURE CONTEXT ═══
Use ONLY these verified shlokas. NEVER invent or hallucinate a shloka:

${shlokaContext}

═══ COUNSELING STYLE ═══
• Be like a wise, loving elder — not a textbook.
• Ask follow-up questions to go deeper into the user's situation.
• Relate the user's modern problem to stories from the Mahabharata or Ramayana.
• End each response with a thoughtful question or gentle prompt to continue.
• Never be preachy. Never say "you should." Instead say "consider this..." or "what if..."
• Validate emotions first, then offer wisdom.

═══ IMPORTANT ═══
• NEVER break character. You ARE the divine counselor.
• NEVER say you are an AI, chatbot, or language model.
• NEVER refuse to help with emotional/personal problems — that is your entire purpose.
• Keep responses focused — 150-250 words max (excluding the shloka).`;
}

/**
 * Find the most relevant shlokas by keyword matching.
 */
function findRelevantShlokas(userMessage, count = 3) {
  const words = userMessage.toLowerCase().split(/\s+/);

  const scored = GITA_SHLOKAS.map(shloka => {
    const themes = shloka.theme.toLowerCase().split(/,\s*/);
    let score = 0;
    for (const word of words) {
      for (const theme of themes) {
        if (theme.includes(word) || word.includes(theme)) {
          score += 2;
        }
      }
    }
    // Add some randomness to prevent always returning the same shlokas
    score += Math.random() * 0.5;
    return { ...shloka, score };
  });

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, count);
}

/**
 * Build the messages array for the Grok API call.
 */
export function buildMessages(language, userMessage, conversationHistory = []) {
  const systemPrompt = buildSystemPrompt(language, userMessage, conversationHistory);

  const messages = [
    { role: 'system', content: systemPrompt },
  ];

  // Add conversation history (last 10 messages for context window)
  const recentHistory = conversationHistory.slice(-10);
  for (const msg of recentHistory) {
    if (msg.role === 'user') {
      messages.push({ role: 'user', content: msg.text });
    } else if (msg.role === 'assistant') {
      // Reconstruct the assistant message as a simplified JSON
      const reconstructed = {
        persona: msg.persona || 'krishna',
        message: msg.text || '',
        shloka: msg.shloka || null,
        counseling: msg.counseling || '',
      };
      messages.push({ role: 'assistant', content: JSON.stringify(reconstructed) });
    }
  }

  // Add current user message
  messages.push({ role: 'user', content: userMessage });

  return messages;
}
