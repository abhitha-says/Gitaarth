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
    /* Stable owner key ("user:<id>" | "guest:<uuid>") — the same key long-term
       memory is filed under, so a conversation list and the memories behind it
       can never drift apart. */
    ownerKey: {
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
// Sidebar query: this person's live conversations, newest first.
chatSessionSchema.index({ ownerKey: 1, isArchived: 1, updatedAt: -1 });

const ChatSession = mongoose.model('ChatSession', chatSessionSchema);
export default ChatSession;
