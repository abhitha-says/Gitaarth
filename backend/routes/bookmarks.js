/**
 * Gitaarth AI — Bookmarks Route
 * Save and manage bookmarked shlokas and messages.
 */

import { Router } from 'express';
import { isDBConnected } from '../config/db.js';
import Bookmark from '../models/Bookmark.js';

const router = Router();

/**
 * POST /api/bookmarks
 * Create a bookmark.
 * Body: { userId, type: 'shloka'|'message', referenceId, note? }
 */
router.post('/', async (req, res) => {
  try {
    if (!isDBConnected()) {
      return res.status(503).json({ error: 'Database not connected' });
    }

    const { userId, type, referenceId, note } = req.body;

    if (!userId || !type || !referenceId) {
      return res.status(400).json({ error: 'userId, type, and referenceId are required' });
    }

    if (!['shloka', 'message'].includes(type)) {
      return res.status(400).json({ error: 'type must be "shloka" or "message"' });
    }

    const bookmark = await Bookmark.create({
      userId,
      type,
      referenceId,
      note: note?.slice(0, 500) || '',
    });

    res.status(201).json({ bookmark });
  } catch (err) {
    // Handle duplicate bookmark
    if (err.code === 11000) {
      return res.status(409).json({ error: 'This item is already bookmarked' });
    }
    console.error('❌ Bookmark create error:', err.message);
    res.status(500).json({ error: 'Failed to create bookmark' });
  }
});

/**
 * GET /api/bookmarks
 * List bookmarks for a user.
 * Query: ?userId=xxx&type=shloka
 */
router.get('/', async (req, res) => {
  try {
    if (!isDBConnected()) {
      return res.status(503).json({ error: 'Database not connected' });
    }

    const { userId, type } = req.query;

    if (!userId) {
      return res.status(400).json({ error: 'userId query parameter is required' });
    }

    const filter = { userId };
    if (type && ['shloka', 'message'].includes(type)) {
      filter.type = type;
    }

    const bookmarks = await Bookmark.find(filter)
      .sort({ createdAt: -1 })
      .lean();

    res.json({ bookmarks, count: bookmarks.length });
  } catch (err) {
    console.error('❌ Bookmarks list error:', err.message);
    res.status(500).json({ error: 'Failed to fetch bookmarks' });
  }
});

/**
 * DELETE /api/bookmarks/:id
 * Remove a bookmark by its _id.
 */
router.delete('/:id', async (req, res) => {
  try {
    if (!isDBConnected()) {
      return res.status(503).json({ error: 'Database not connected' });
    }

    const bookmark = await Bookmark.findByIdAndDelete(req.params.id);

    if (!bookmark) {
      return res.status(404).json({ error: 'Bookmark not found' });
    }

    res.json({ message: 'Bookmark removed' });
  } catch (err) {
    console.error('❌ Bookmark delete error:', err.message);
    res.status(500).json({ error: 'Failed to delete bookmark' });
  }
});

export default router;
