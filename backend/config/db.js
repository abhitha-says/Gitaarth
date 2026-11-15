/**
 * Gitaarth AI — MongoDB Connection
 * Connects to MongoDB Atlas (or local) using Mongoose.
 */

import mongoose from 'mongoose';

export async function connectDB() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.warn('⚠️  MONGODB_URI not set — database features disabled.');
    return false;
  }

  try {
    await mongoose.connect(uri);
    console.log('🔗 MongoDB connected successfully');
    return true;
  } catch (err) {
    // Do NOT exit. Chat, scripture retrieval and the prompt pipeline all have
    // working no-DB fallbacks; killing the process here means every chat request
    // fails and the UI silently falls back to canned replies.
    console.error('❌ MongoDB connection failed:', err.message);
    console.warn('⚠️  Continuing without the database — history will not persist.');
    return false;
  }
}

export function isDBConnected() {
  return mongoose.connection.readyState === 1;
}
