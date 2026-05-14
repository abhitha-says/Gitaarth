/**
 * Gitaarth AI — Ram Quote Model (Ramayana)
 * Stores verified teachings/quotes of Lord Ram from the Ramayana.
 */

import mongoose from 'mongoose';

const ramQuoteSchema = new mongoose.Schema({
  quote: {
    type: String,
    required: true,
  },
  context: {
    type: String,
    required: true,
    trim: true,
  },
  source: {
    type: String,
    default: 'Valmiki Ramayana',
    trim: true,
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

// Text index for RAG-style keyword search
ramQuoteSchema.index({ keywords: 1 });
ramQuoteSchema.index(
  { 'translations.en': 'text', keywords: 'text' },
  { name: 'ramquote_text_search' }
);

export default mongoose.model('RamQuote', ramQuoteSchema);
