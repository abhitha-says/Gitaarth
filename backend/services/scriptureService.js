/**
 * Gitaarth AI — Scripture Service (RAG)
 * Retrieves the most relevant shlokas and Ram quotes from MongoDB
 * based on keyword matching against the user's message.
 */

import Shloka from '../models/Shloka.js';
import RamQuote from '../models/RamQuote.js';

/**
 * Find relevant Gita shlokas for a user message.
 * Uses MongoDB text search + keyword array matching.
 * @param {string} userMessage
 * @param {number} limit - max results
 * @param {Array} excludeIds - shloka IDs already used in this conversation
 * @returns {Array} matching shlokas
 */
export async function findRelevantShlokas(userMessage, limit = 3, excludeIds = []) {
  const words = userMessage.toLowerCase().split(/\s+/).filter(w => w.length > 2);

  try {
    // Strategy 1: MongoDB text search
    const textResults = await Shloka.find(
      { $text: { $search: userMessage } },
      { score: { $meta: 'textScore' } }
    )
      .sort({ score: { $meta: 'textScore' } })
      .limit(limit * 2)
      .lean();

    // Strategy 2: keyword array match
    const keywordResults = await Shloka.find({
      keywords: { $in: words },
      _id: { $nin: excludeIds },
    })
      .limit(limit * 2)
      .lean();

    // Merge and deduplicate
    const seen = new Set();
    const merged = [];

    for (const s of [...textResults, ...keywordResults]) {
      const key = `${s.chapter}-${s.verse}`;
      if (!seen.has(key)) {
        seen.add(key);
        merged.push(s);
      }
    }

    // If we still have too many, pick randomly to add variety
    if (merged.length > limit) {
      return shuffleArray(merged).slice(0, limit);
    }

    return merged;
  } catch (err) {
    console.error('⚠️ Scripture search failed:', err.message);
    return [];
  }
}

/**
 * Find relevant Ram quotes for a user message.
 * @param {string} userMessage
 * @param {number} limit
 * @returns {Array} matching quotes
 */
export async function findRelevantRamQuotes(userMessage, limit = 2) {
  const words = userMessage.toLowerCase().split(/\s+/).filter(w => w.length > 2);

  try {
    const textResults = await RamQuote.find(
      { $text: { $search: userMessage } },
      { score: { $meta: 'textScore' } }
    )
      .sort({ score: { $meta: 'textScore' } })
      .limit(limit)
      .lean();

    if (textResults.length > 0) return textResults;

    // Fallback: keyword match
    return await RamQuote.find({
      keywords: { $in: words },
    })
      .limit(limit)
      .lean();
  } catch (err) {
    console.error('⚠️ Ram quote search failed:', err.message);
    return [];
  }
}

/**
 * Get a random daily shloka (deterministic per day).
 */
export async function getDailyShloka() {
  const today = new Date();
  const dayOfYear = Math.floor(
    (today - new Date(today.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24)
  );

  const count = await Shloka.countDocuments();
  if (count === 0) return null;

  const index = dayOfYear % count;
  return Shloka.findOne().skip(index).lean();
}

/** Simple array shuffle (Fisher-Yates) */
function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
