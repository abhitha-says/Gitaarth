/**
 * Gitaarth AI — Long-Term Memory Model
 *
 * One row = one durable fact about a person that should survive across
 * conversations. This is what makes "New Chat ≠ New Person" true.
 *
 * Deliberately NOT a transcript. Messages live in the Message collection;
 * this holds only distilled facts worth carrying forward, so retrieval stays
 * cheap and the prompt stays small.
 */

import mongoose from 'mongoose';

export const MEMORY_TYPES = [
  'achievement',   // "got an internship"
  'goal',          // "wants to be financially independent"
  'project',       // "first project is managing an Instagram account"
  'career',        // role, company, field of study
  'relationship',  // brother, mother, partner — people who matter to them
  'concern',       // a recurring worry
  'event',         // a significant life event
  'preference',    // how they like to be spoken to, language, persona
  'spiritual',     // what they seek, what they practice
  'identity',      // name, age, where they are in life
  'other',
];

const memorySchema = new mongoose.Schema(
  {
    /* Owner key: "user:<mongoId>" for signed-in users, "guest:<uuid>" otherwise.
       A single string keeps every query one index lookup regardless of auth state. */
    ownerKey: {
      type: String,
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: MEMORY_TYPES,
      default: 'other',
    },
    /* Third person, one sentence: "User recently started an internship." */
    content: {
      type: String,
      required: true,
      trim: true,
      maxlength: 300,
    },
    /* Lowercased retrieval terms. Cheap keyword matching beats an embedding
       service here — the corpus per user is tens of rows, not thousands. */
    keywords: [{ type: String, lowercase: true, trim: true }],
    /* 1 = trivia, 5 = defines who they are. Drives both retrieval order and eviction. */
    importance: {
      type: Number,
      default: 3,
      min: 1,
      max: 5,
    },
    sourceSessionId: {
      type: String,
      default: null,
    },
    /* How many separate times this has come up — repetition means it matters. */
    mentionCount: {
      type: Number,
      default: 1,
      min: 1,
    },
    /* Last time this was actually fed to the LLM, so we can rotate rather than
       repeat the same three facts every single conversation. */
    lastReferencedAt: {
      type: Date,
      default: null,
    },
    status: {
      type: String,
      enum: ['active', 'archived'],
      default: 'active',
    },
  },
  {
    timestamps: true,
    collection: 'memories',
  }
);

/* ─── Indexes ─── */
// Primary retrieval path: this person's active memories, strongest first.
memorySchema.index({ ownerKey: 1, status: 1, importance: -1, updatedAt: -1 });
// Text search for topic-relevant lookup when the DB supports it.
memorySchema.index({ content: 'text', keywords: 'text' }, { name: 'memory_text_search' });

const Memory = mongoose.model('Memory', memorySchema);
export default Memory;
