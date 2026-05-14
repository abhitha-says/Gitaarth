/**
 * Gitaarth AI — ChatSession Model
 * Represents a conversation session between a user and the divine counselor.
 */

import mongoose from 'mongoose';

const chatSessionSchema = new mongoose.Schema(
  {
    sessionId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    userId: {
      type: String,
      default: null,
      index: true,
    },
    language: {
      type: String,
      enum: ['en', 'hi'],
      default: 'en',
    },
    title: {
      type: String,
      default: 'New Guidance Session',
      maxlength: 200,
    },
    messageCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    lastPersona: {
      type: String,
      enum: ['krishna', 'ram'],
      default: 'krishna',
    },
    isArchived: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    collection: 'chat_sessions',
  }
);

/* ─── Indexes ─── */
chatSessionSchema.index({ updatedAt: -1 });
chatSessionSchema.index({ userId: 1, isArchived: 1, updatedAt: -1 });

const ChatSession = mongoose.model('ChatSession', chatSessionSchema);
export default ChatSession;
