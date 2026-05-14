/**
 * Gitaarth AI — Bookmark Model
 * Saved shlokas and messages that resonated with the user.
 */

import mongoose from 'mongoose';

const bookmarkSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    type: {
      type: String,
      required: true,
      enum: ['shloka', 'message'],
    },
    referenceId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    note: {
      type: String,
      default: '',
      maxlength: 500,
    },
  },
  {
    timestamps: true,
    collection: 'bookmarks',
  }
);

/* ─── Prevent duplicate bookmarks ─── */
bookmarkSchema.index({ userId: 1, type: 1, referenceId: 1 }, { unique: true });

const Bookmark = mongoose.model('Bookmark', bookmarkSchema);
export default Bookmark;
