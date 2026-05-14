/**
 * Gitaarth AI — Shlokas Route
 * Browse, search, and get daily shlokas from the scripture database.
 */

import { Router } from 'express';
import { isDBConnected } from '../config/db.js';
import Shloka from '../models/Shloka.js';

const router = Router();

/**
 * GET /api/shlokas
 * List shlokas with optional chapter/verse filters and pagination.
 * Query: ?chapter=2&page=1&limit=20
 */
router.get('/', async (req, res) => {
  try {
    if (!isDBConnected()) {
      return res.status(503).json({ error: 'Database not connected' });
    }

    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 20));
    const skip = (page - 1) * limit;

    const filter = {};
    if (req.query.chapter) filter.chapter = parseInt(req.query.chapter);
    if (req.query.verse) filter.verse = parseInt(req.query.verse);

    const [shlokas, total] = await Promise.all([
      Shloka.find(filter)
        .sort({ chapter: 1, verse: 1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Shloka.countDocuments(filter),
    ]);

    res.json({
      shlokas,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    console.error('❌ Shlokas list error:', err.message);
    res.status(500).json({ error: 'Failed to fetch shlokas' });
  }
});

/**
 * GET /api/shlokas/daily
 * Returns a deterministic "shloka of the day" seeded by today's date.
 */
router.get('/daily', async (req, res) => {
  try {
    if (!isDBConnected()) {
      return res.status(503).json({ error: 'Database not connected' });
    }

    const total = await Shloka.countDocuments();
    if (total === 0) {
      return res.status(404).json({ error: 'No shlokas in database. Run the seed script.' });
    }

    // Deterministic seed based on date
    const today = new Date();
    const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
    const index = seed % total;

    const shloka = await Shloka.findOne().skip(index).lean();

    res.json({ shloka, date: today.toISOString().split('T')[0] });
  } catch (err) {
    console.error('❌ Daily shloka error:', err.message);
    res.status(500).json({ error: 'Failed to fetch daily shloka' });
  }
});

/**
 * GET /api/shlokas/search
 * Full-text search across themes and translations.
 * Query: ?q=courage+fear
 */
router.get('/search', async (req, res) => {
  try {
    if (!isDBConnected()) {
      return res.status(503).json({ error: 'Database not connected' });
    }

    const query = req.query.q?.trim();
    if (!query) {
      return res.status(400).json({ error: 'Search query (q) is required' });
    }

    const shlokas = await Shloka.find(
      { $text: { $search: query } },
      { score: { $meta: 'textScore' } }
    )
      .sort({ score: { $meta: 'textScore' } })
      .limit(10)
      .lean();

    res.json({ shlokas, query });
  } catch (err) {
    console.error('❌ Shloka search error:', err.message);
    res.status(500).json({ error: 'Failed to search shlokas' });
  }
});

/**
 * GET /api/shlokas/chapter/:chapter
 * Get all shlokas for a specific chapter.
 */
router.get('/chapter/:chapter', async (req, res) => {
  try {
    if (!isDBConnected()) {
      return res.status(503).json({ error: 'Database not connected' });
    }

    const chapter = parseInt(req.params.chapter);
    if (isNaN(chapter) || chapter < 1 || chapter > 18) {
      return res.status(400).json({ error: 'Chapter must be between 1 and 18' });
    }

    const shlokas = await Shloka.find({ chapter })
      .sort({ verse: 1 })
      .lean();

    res.json({ chapter, shlokas, count: shlokas.length });
  } catch (err) {
    console.error('❌ Chapter shlokas error:', err.message);
    res.status(500).json({ error: 'Failed to fetch chapter shlokas' });
  }
});

export default router;
