/**
 * Gitaarth AI — Conversation Model
 * Stores chat sessions. userId is null for guest conversations.
 */

import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ['user', 'assistant'],
    required: true,
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
    chapter: Number,
    verse: Number,
    chapterName: String,
    chapterNameSanskrit: String,
    sanskrit: String,
    translation: String,
  },
  counseling: {
    type: String,
    default: '',
  },
}, {
  timestamps: true,
});

const conversationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
    index: true,
  },
  guestId: {
    type: String,
    default: null,
    index: true,
  },
  title: {
    type: String,
    default: 'New Conversation',
    trim: true,
  },
  language: {
    type: String,
    enum: ['en', 'hi', 'te', 'ta', 'kn', 'sa'],
    default: 'en',
  },
  messages: [messageSchema],
  lastMessageAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

// Index for fetching user's conversations sorted by recent
conversationSchema.index({ userId: 1, lastMessageAt: -1 });
conversationSchema.index({ guestId: 1, lastMessageAt: -1 });

export default mongoose.model('Conversation', conversationSchema);
