/**
 * Gitaarth AI — User Model
 * Stores users who sign in via Google OAuth.
 */

import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  googleId: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  avatar: {
    type: String,
    default: '',
  },
  language: {
    type: String,
    enum: ['en', 'hi', 'te', 'ta', 'kn', 'sa'],
    default: 'en',
  },
}, {
  timestamps: true,
});

export default mongoose.model('User', userSchema);
