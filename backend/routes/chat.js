/**
 * Gitaarth AI — Chat Route
 * POST /api/chat — Send a message and receive guidance.
 *
 * Context assembled per request (never the whole history):
 *   current message + recent turns + relevant long-term memories + relevant scripture
 */

import { Router } from 'express';
import crypto from 'crypto';
import { isDBConnected } from '../config/db.js';
import { optionalAuth, attachOwner } from '../middleware/auth.js';
import { buildMessages } from '../services/promptEngine.js';
import { getGrokResponse } from '../services/grokService.js';
import { retrieveMemories, extractMemories } from '../services/memoryStore.js';
import ChatSession from '../models/ChatSession.js';
import Message from '../models/Message.js';

const router = Router();

/* Chat is open to guests, but we still want to know WHO the guest is so their
   memories survive a new conversation. */
router.use(optionalAuth, attachOwner);

/** How many stored turns to rehydrate when the client sends no history. */
const HISTORY_LOOKBACK = 12;

/**
 * Generate a session title from the first user message.
 */
function generateTitle(message) {
  const cleaned = message.replace(/[^\w\s]/g, '').trim();
  if (cleaned.length <= 60) return cleaned;
  return cleaned.slice(0, 57) + '...';
}

/**
 * Load the tail of a conversation from the database.
 *
 * The client sends its in-memory history, but that is lost on refresh and
 * absent when a stored conversation is reopened. The DB is the source of truth;
 * the client's copy is only a fallback for when Mongo is unavailable.
 */
async function loadHistory(sessionId, ownerKey) {
  if (!sessionId || !isDBConnected()) return null;

  try {
    // Only read history for a session this caller actually owns.
    const session = await ChatSession.findOne({ sessionId }).select('ownerKey').lean();
    if (!session) return null;
    if (session.ownerKey && ownerKey && session.ownerKey !== ownerKey) return null;

    const rows = await Message.find({ sessionId })
      .sort({ timestamp: -1 })
      .limit(HISTORY_LOOKBACK)
      .lean();

    return rows.reverse().map((m) => ({
      role: m.role,
      text: m.text,
      persona: m.persona,
      shloka: m.shloka,
      counseling: m.counseling,
    }));
  } catch (err) {
    console.warn('⚠️ History load failed, falling back to client history:', err.message);
    return null;
  }
}

/**
 * POST /api/chat
 * Body: { message, language: 'en'|'hi', history?: Array, sessionId?: string, persona?: 'krishna'|'ram' }
 * Headers: Authorization: Bearer <jwt>  (optional)  ·  X-Guest-Id: <uuid>  (optional)
 */
router.post('/', async (req, res) => {
  try {
    const { message, language = 'en', history = [], sessionId, persona = null } = req.body;

    if (!message || typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const trimmedMessage = message.trim();
    const ownerKey = req.ownerKey;
    const requestedPersona = persona === 'ram' || persona === 'krishna' ? persona : null;

    // Determine or create sessionId
    const isNewSession = !sessionId;
    const activeSessionId = sessionId || crypto.randomUUID();

    /* ── Recent conversation: database first, client copy as fallback ── */
    const storedHistory = await loadHistory(activeSessionId, ownerKey);
    const conversationHistory = storedHistory ?? (Array.isArray(history) ? history : []);

    /* ── Long-term memory: retrieved BEFORE the prompt is built ──
       On the opening turn of a fresh thread we also pull "what was going on in
       their life", so a new chat is a new thread and not a new stranger. */
    const openingTurn = conversationHistory.filter((m) => m.role === 'user').length === 0;
    const longTermMemory = await retrieveMemories({
      ownerKey,
      message: trimmedMessage,
      analysis: {},
      openingTurn,
    });

    /* ── Pipeline: emotion → memory → intent → scripture → prompt ── */
    const { messages, analysis } = await buildMessages(
      language,
      trimmedMessage,
      conversationHistory,
      { longTermMemory, persona: requestedPersona }
    );

    console.log(
      `🧭 ${analysis.emotion}/${analysis.intent} (${analysis.valence}, ${analysis.intensity})` +
      ` · topic=${analysis.topic} · scripture=${analysis.needsScripture} · explicit=${analysis.isExplicitRequest}` +
      ` · question=${analysis.askQuestion} · memories=${longTermMemory.relevant.length}+${longTermMemory.openers.length}` +
      ` · via=${analysis.source}`
    );

    /* ── LLM generation, with the quality gate applied ── */
    const response = await getGrokResponse(messages, analysis);

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

    /* ── Persist (non-blocking — don't fail chat if DB is down) ── */
    if (isDBConnected()) {
      try {
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
            ownerKey,
            userId: req.userId || null,
          };
        }

        await ChatSession.findOneAndUpdate(
          { sessionId: activeSessionId },
          sessionUpdate,
          { upsert: true, new: true }
        );

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

    /* ── Memory extraction runs AFTER the reply is sent ──
       It costs an extra LLM call; the person waiting for an answer should never
       pay for it in latency. Errors are swallowed inside extractMemories. */
    extractMemories({
      ownerKey,
      sessionId: activeSessionId,
      userMessage: trimmedMessage,
      recentHistory: conversationHistory,
    }).catch((err) => console.warn('⚠️ Memory extraction rejected:', err.message));
  } catch (err) {
    console.error('❌ Chat error:', err.message);
    console.error('❌ Full error:', JSON.stringify({ status: err.status, code: err.code, type: err.type }, null, 2));

    // Specific error for missing API key
    if (err.message?.includes('API key') || err.message?.includes('XAI_GROK_API_KEY') || err.status === 401) {
      return res.status(500).json({
        error: 'Grok API key is missing or invalid. Please set XAI_GROK_API_KEY in your .env file.',
      });
    }

    // Rate limit / quota — distinct from a real outage, and worth saying plainly.
    if (err.status === 429) {
      return res.status(429).json({
        error: 'The LLM API rate limit has been reached. Please wait a few minutes and try again.',
        retryAfter: err.headers?.['retry-after'] || null,
      });
    }

    res.status(500).json({
      error: 'The divine is momentarily unreachable. Please try again.',
    });
  }
});

export default router;
