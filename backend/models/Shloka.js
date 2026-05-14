/**
 * Gitaarth AI — Shloka Model (Bhagavad Gita)
 * Stores verified shlokas from all 18 chapters of the Gita.
 */

import mongoose from 'mongoose';

const shlokaSchema = new mongoose.Schema({
  chapter: {
    type: Number,
    required: true,
    min: 1,
    max: 18,
  },
  verse: {
    type: Number,
    required: true,
    min: 1,
  },
  chapterName: {
    type: String,
    required: true,
    trim: true,
  },
  chapterNameSanskrit: {
    type: String,
    default: '',
    trim: true,
  },
  sanskrit: {
    type: String,
    required: true,
  },
  translations: {
    en: { type: String, required: true },
    hi: { type: String, default: '' },
  },
  keywords: [{
    type: String,
    lowercase: true,
    trim: true,
  }],
}, {
  timestamps: true,
});

// Compound index for fast chapter+verse lookup
shlokaSchema.index({ chapter: 1, verse: 1 }, { unique: true });

// Text index for RAG-style keyword search
shlokaSchema.index({ keywords: 1 });
shlokaSchema.index(
  { 'translations.en': 'text', keywords: 'text' },
  { name: 'shloka_text_search' }
);

export default mongoose.model('Shloka', shlokaSchema);
