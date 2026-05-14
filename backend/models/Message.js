/**
 * Gitaarth AI — Message Model
 * Individual messages within a chat session (both user and assistant).
 */

import mongoose from 'mongoose';

const shlokaSubSchema = new mongoose.Schema(
  {
    chapter: { type: Number, required: true },
    verse: { type: Number, required: true },
    chapterName: { type: String, default: '' },
    chapterNameSanskrit: { type: String, default: '' },
    sanskrit: { type: String, default: '' },
    translation: { type: String, default: '' },
  },
  { _id: false }
);

const messageSchema = new mongoose.Schema(
  {
    sessionId: {
      type: String,
      required: true,
      index: true,
    },
    role: {
      type: String,
      required: true,
      enum: ['user', 'assistant'],
    },
    text: {
      type: String,
      required: true,
    },
    persona: {
      type: String,
      enum: ['krishna', 'ram', null],
      default: null,
    },
    shloka: {
      type: shlokaSubSchema,
      default: null,
    },
    counseling: {
      type: String,
      default: null,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  {
    collection: 'messages',
  }
);

/* ─── Indexes ─── */
messageSchema.index({ sessionId: 1, timestamp: 1 });

const Message = mongoose.model('Message', messageSchema);
export default Message;
