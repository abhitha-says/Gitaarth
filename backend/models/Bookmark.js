/**
 * Gitaarth AI — Bookmark Model
 * Lets signed-in users save shlokas, quotes, or chat messages.
 */

import mongoose from 'mongoose';

const bookmarkSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  type: {
    type: String,
    enum: ['shloka', 'ramquote', 'message'],
    required: true,
  },
  referenceId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  // Snapshot of the bookmarked content (so it loads fast without joins)
  snapshot: {
    text: { type: String, default: '' },
    sanskrit: { type: String, default: '' },
    translation: { type: String, default: '' },
    chapter: Number,
    verse: Number,
    persona: String,
  },
}, {
  timestamps: true,
});

// Prevent duplicate bookmarks
bookmarkSchema.index({ userId: 1, type: 1, referenceId: 1 }, { unique: true });

export default mongoose.model('Bookmark', bookmarkSchema);
