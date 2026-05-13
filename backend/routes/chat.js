/**
 * Gitaarth AI — Chat Route
 * POST /api/chat — Send a message and receive divine guidance.
 */

import { Router } from 'express';
import { buildMessages } from '../services/promptEngine.js';
import { getGrokResponse } from '../services/grokService.js';

const router = Router();

/**
 * POST /api/chat
 * Body: { message: string, language: 'en' | 'hi', history: Array }
 */
router.post('/', async (req, res) => {
  try {
    const { message, language = 'en', history = [] } = req.body;

    if (!message || typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Build messages for the Grok API
    const messages = buildMessages(language, message.trim(), history);

    // Call Grok
    const response = await getGrokResponse(messages);

    // Format shloka for frontend compatibility
    let formattedShloka = null;
    if (response.shloka) {
      formattedShloka = {
        id: Date.now(),
        chapter: response.shloka.chapter,
        verse: response.shloka.verse,
        chapterName: response.shloka.chapterName || '',
        chapterNameSanskrit: response.shloka.chapterNameSanskrit || '',
        sanskrit: response.shloka.sanskrit || '',
        translation: {
          en: response.shloka.translation || '',
          hi: response.shloka.translation || '',
        },
      };
    }

    res.json({
      persona: response.persona,
      text: response.message,
      shloka: formattedShloka,
      counseling: response.counseling,
    });
  } catch (err) {
    console.error('❌ Chat error:', err.message);
    console.error('❌ Full error:', JSON.stringify({ status: err.status, code: err.code, type: err.type }, null, 2));

    // Specific error for missing API key
    if (err.message?.includes('API key') || err.status === 401) {
      return res.status(500).json({
        error: 'Grok API key is missing or invalid. Please set XAI_GROK_API_KEY in your .env file.',
      });
    }

    res.status(500).json({
      error: 'The divine is momentarily unreachable. Please try again.',
    });
  }
});

export default router;
