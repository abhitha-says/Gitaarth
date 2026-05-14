/**
 * Gitaarth AI — Shloka Model
 * Bhagavad Gita shlokas with bilingual translations and thematic tags.
 */

import mongoose from 'mongoose';

const shlokaSchema = new mongoose.Schema(
  {
    chapter: {
      type: Number,
      required: true,
    },
    verse: {
      type: Number,
      required: true,
    },
    chapterName: {
      type: String,
      required: true,
    },
    chapterNameSanskrit: {
      type: String,
      required: true,
    },
    sanskrit: {
      type: String,
      required: true,
    },
    translation: {
      en: { type: String, required: true },
      hi: { type: String, default: '' },
    },
    themes: {
      type: [String],
      index: true,
    },
    source: {
      type: String,
      default: 'bhagavad_gita',
    },
  },
  {
    timestamps: true,
    collection: 'shlokas',
  }
);

/* ─── Compound unique index ─── */
shlokaSchema.index({ chapter: 1, verse: 1 }, { unique: true });

/* ─── Text index for search ─── */
shlokaSchema.index(
  { themes: 'text', 'translation.en': 'text', 'translation.hi': 'text' },
  { weights: { themes: 10, 'translation.en': 5, 'translation.hi': 3 }, name: 'shloka_text_search' }
);

const Shloka = mongoose.model('Shloka', shlokaSchema);
export default Shloka;
