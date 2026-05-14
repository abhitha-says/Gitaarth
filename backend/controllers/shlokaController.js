/**
 * Gitaarth AI — Shloka Controller
 * Handles scripture library browsing and daily shloka.
 */

import Shloka from '../models/Shloka.js';
import RamQuote from '../models/RamQuote.js';
import { getDailyShloka } from '../services/scriptureService.js';

/** GET /api/shlokas/daily — Today's shloka */
export async function daily(req, res) {
  try {
    const shloka = await getDailyShloka();
    if (!shloka) {
      return res.json({ shloka: null, message: 'Scripture database not yet seeded.' });
    }
    res.json({ shloka });
  } catch (err) {
    console.error('❌ Daily shloka error:', err.message);
    res.status(500).json({ error: 'Could not fetch daily shloka.' });
  }
}

/** GET /api/shlokas — List all shlokas, optionally filter by chapter */
export async function list(req, res) {
  try {
    const { chapter, search } = req.query;
    const filter = {};

    if (chapter) filter.chapter = Number(chapter);

    let shlokas;
    if (search) {
      shlokas = await Shloka.find(
        { $text: { $search: search }, ...filter },
        { score: { $meta: 'textScore' } }
      )
        .sort({ score: { $meta: 'textScore' } })
        .lean();
    } else {
      shlokas = await Shloka.find(filter)
        .sort({ chapter: 1, verse: 1 })
        .lean();
    }

    res.json({ shlokas, count: shlokas.length });
  } catch (err) {
    console.error('❌ Shloka list error:', err.message);
    res.status(500).json({ error: 'Could not fetch shlokas.' });
  }
}

/** GET /api/shlokas/chapters — Get chapter metadata */
export async function chapters(req, res) {
  try {
    const result = await Shloka.aggregate([
      {
        $group: {
          _id: '$chapter',
          chapterName: { $first: '$chapterName' },
          chapterNameSanskrit: { $first: '$chapterNameSanskrit' },
          verseCount: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
      {
        $project: {
          chapter: '$_id',
          chapterName: 1,
          chapterNameSanskrit: 1,
          verseCount: 1,
          _id: 0,
        },
      },
    ]);

    res.json({ chapters: result });
  } catch (err) {
    console.error('❌ Chapters error:', err.message);
    res.status(500).json({ error: 'Could not fetch chapters.' });
  }
}

/** GET /api/shlokas/:chapter/:verse — Get a specific shloka */
export async function getOne(req, res) {
  try {
    const { chapter, verse } = req.params;
    const shloka = await Shloka.findOne({
      chapter: Number(chapter),
      verse: Number(verse),
    }).lean();

    if (!shloka) {
      return res.status(404).json({ error: 'Shloka not found.' });
    }

    res.json({ shloka });
  } catch (err) {
    console.error('❌ Get shloka error:', err.message);
    res.status(500).json({ error: 'Could not fetch shloka.' });
  }
}

/** GET /api/ramquotes — List Ram quotes, optionally search */
export async function listRamQuotes(req, res) {
  try {
    const { search } = req.query;

    let quotes;
    if (search) {
      quotes = await RamQuote.find(
        { $text: { $search: search } },
        { score: { $meta: 'textScore' } }
      )
        .sort({ score: { $meta: 'textScore' } })
        .lean();
    } else {
      quotes = await RamQuote.find().lean();
    }

    res.json({ quotes, count: quotes.length });
  } catch (err) {
    console.error('❌ Ram quotes error:', err.message);
    res.status(500).json({ error: 'Could not fetch Ram quotes.' });
  }
}
