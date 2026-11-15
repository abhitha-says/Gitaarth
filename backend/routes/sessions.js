/**
 * Gitaarth AI — Sessions Route
 * CRUD for chat sessions.
 */

import { Router } from 'express';
import { isDBConnected } from '../config/db.js';
import { optionalAuth, attachOwner } from '../middleware/auth.js';
import ChatSession from '../models/ChatSession.js';
import Message from '../models/Message.js';

const router = Router();

/* Every route below is scoped to the caller. Without this, one browser's
   sidebar would list every conversation on the server. */
router.use(optionalAuth, attachOwner);

/** Reject anonymous callers — with no owner key there is nothing to scope to. */
function requireOwner(req, res) {
  if (!req.ownerKey) {
    res.status(400).json({ error: 'Missing identity. Sign in or send an X-Guest-Id header.' });
    return false;
  }
  return true;
}

/**
 * GET /api/sessions
 * List all sessions (paginated, newest first).
 * Query: ?page=1&limit=20&archived=false
 */
router.get('/', async (req, res) => {
  try {
    if (!isDBConnected()) {
      return res.status(503).json({ error: 'Database not connected' });
    }
    if (!requireOwner(req, res)) return;

    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || 20));
    const showArchived = req.query.archived === 'true';
    const skip = (page - 1) * limit;

    const filter = { ownerKey: req.ownerKey, isArchived: showArchived };

    const [sessions, total] = await Promise.all([
      ChatSession.find(filter)
        .sort({ updatedAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      ChatSession.countDocuments(filter),
    ]);

    res.json({
      sessions,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    console.error('❌ Sessions list error:', err.message);
    res.status(500).json({ error: 'Failed to fetch sessions' });
  }
});

/**
 * GET /api/sessions/:sessionId
 * Get a single session with all its messages.
 */
router.get('/:sessionId', async (req, res) => {
  try {
    if (!isDBConnected()) {
      return res.status(503).json({ error: 'Database not connected' });
    }

    if (!requireOwner(req, res)) return;
    const { sessionId } = req.params;

    // Scope the lookup itself — never fetch then check, or a wrong owner still
    // learns the session exists.
    const session = await ChatSession.findOne({ sessionId, ownerKey: req.ownerKey }).lean();
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    const messages = await Message.find({ sessionId }).sort({ timestamp: 1 }).lean();
    res.json({ session, messages });
  } catch (err) {
    console.error('❌ Session fetch error:', err.message);
    res.status(500).json({ error: 'Failed to fetch session' });
  }
});

/**
 * PATCH /api/sessions/:sessionId
 * Update session title or archive status.
 */
router.patch('/:sessionId', async (req, res) => {
  try {
    if (!isDBConnected()) {
      return res.status(503).json({ error: 'Database not connected' });
    }

    if (!requireOwner(req, res)) return;
    const { sessionId } = req.params;
    const { title, isArchived } = req.body;

    const updates = {};
    if (typeof title === 'string') updates.title = title.slice(0, 200);
    if (typeof isArchived === 'boolean') updates.isArchived = isArchived;

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ error: 'No valid fields to update' });
    }

    const session = await ChatSession.findOneAndUpdate(
      { sessionId, ownerKey: req.ownerKey },
      { $set: updates },
      { new: true, lean: true }
    );

    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    res.json({ session });
  } catch (err) {
    console.error('❌ Session update error:', err.message);
    res.status(500).json({ error: 'Failed to update session' });
  }
});

/**
 * DELETE /api/sessions/:sessionId
 * Soft-delete (archive) a session.
 */
router.delete('/:sessionId', async (req, res) => {
  try {
    if (!isDBConnected()) {
      return res.status(503).json({ error: 'Database not connected' });
    }

    if (!requireOwner(req, res)) return;
    const { sessionId } = req.params;

    const session = await ChatSession.findOneAndUpdate(
      { sessionId, ownerKey: req.ownerKey },
      { $set: { isArchived: true } },
      { new: true, lean: true }
    );

    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    res.json({ message: 'Session archived', session });
  } catch (err) {
    console.error('❌ Session delete error:', err.message);
    res.status(500).json({ error: 'Failed to archive session' });
  }
});

export default router;
