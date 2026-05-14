/**
 * Gitaarth AI — Grok Service
 * Wraps the xAI Grok API using the OpenAI-compatible SDK.
 */

import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: process.env.XAI_GROK_API_KEY,
  baseURL: 'https://api.groq.com/openai/v1',
});

const MODEL = process.env.XAI_GROK_MODEL || 'llama-3.3-70b-versatile';

/**
 * Send messages to Grok and get a structured divine response.
 * @param {Array} messages — OpenAI-format messages array
 * @returns {Object} parsed response { persona, message, shloka, counseling }
 */
export async function getGrokResponse(messages) {
  const completion = await client.chat.completions.create({
    model: MODEL,
    messages,
    temperature: 0.85,
    max_tokens: 1024,
  });

  const raw = completion.choices[0]?.message?.content || '';

  // Try to parse the JSON response
  try {
    // Strip any markdown code fences if Grok adds them
    const cleaned = raw.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const parsed = JSON.parse(cleaned);

    return {
      persona: parsed.persona || 'krishna',
      message: parsed.message || '',
      shloka: parsed.shloka || null,
      counseling: parsed.counseling || '',
    };
  } catch {
    // If JSON parsing fails, return as a plain Krishna message
    console.warn('⚠️ Grok response was not valid JSON, using raw text');
    return {
      persona: 'krishna',
      message: raw,
      shloka: null,
      counseling: '',
    };
  }
}
