/**
 * Gitaarth AI — Chat Route
 * POST /api/chat — Send a message and receive divine guidance.
 * Now persists conversations to MongoDB.
 */

import { Router } from 'express';
import crypto from 'crypto';
import { isDBConnected } from '../config/db.js';
import { buildMessages } from '../services/promptEngine.js';
import { getGrokResponse } from '../services/grokService.js';
import ChatSession from '../models/ChatSession.js';
import Message from '../models/Message.js';

const router = Router();

/**
 * Generate a session title from the first user message.
 */
function generateTitle(message) {
  const cleaned = message.replace(/[^\w\s]/g, '').trim();
  if (cleaned.length <= 60) return cleaned;
  return cleaned.slice(0, 57) + '...';
}

/**
 * POST /api/chat
 * Body: { message: string, language: 'en' | 'hi', history: Array, sessionId?: string }
 */
router.post('/', async (req, res) => {
  try {
    const { message, language = 'en', history = [], sessionId } = req.body;

    if (!message || typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const trimmedMessage = message.trim();

    // Determine or create sessionId
    const activeSessionId = sessionId || crypto.randomUUID();

    // Build messages for the Grok API
    const messages = await buildMessages(language, trimmedMessage, history);

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

    // ─── Persist to MongoDB (non-blocking — don't fail chat if DB is down) ───
    if (isDBConnected()) {
      try {
        // Upsert the session
        const isNewSession = !sessionId;
        const sessionUpdate = {
          $inc: { messageCount: 2 }, // user msg + assistant msg
          $set: {
            lastPersona: response.persona || 'krishna',
            language,
          },
        };

        if (isNewSession) {
          sessionUpdate.$setOnInsert = {
            sessionId: activeSessionId,
            title: generateTitle(trimmedMessage),
          };
        }

        await ChatSession.findOneAndUpdate(
          { sessionId: activeSessionId },
          sessionUpdate,
          { upsert: true, new: true }
        );

        // Save both messages
        await Message.insertMany([
          {
            sessionId: activeSessionId,
            role: 'user',
            text: trimmedMessage,
            timestamp: new Date(),
          },
          {
            sessionId: activeSessionId,
            role: 'assistant',
            text: response.message,
            persona: response.persona || 'krishna',
            shloka: response.shloka ? {
              chapter: response.shloka.chapter,
              verse: response.shloka.verse,
              chapterName: response.shloka.chapterName || '',
              chapterNameSanskrit: response.shloka.chapterNameSanskrit || '',
              sanskrit: response.shloka.sanskrit || '',
              translation: response.shloka.translation || '',
            } : null,
            counseling: response.counseling || null,
            timestamp: new Date(),
          },
        ]);
      } catch (dbErr) {
        // Log but don't fail the response
        console.error('⚠️ Failed to persist chat to DB:', dbErr.message);
      }
    }

    res.json({
      sessionId: activeSessionId,
      persona: response.persona,
      text: response.message,
      shloka: formattedShloka,
      counseling: response.counseling,
    });
  } catch (err) {
    console.error('❌ Chat error:', err.message);

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
