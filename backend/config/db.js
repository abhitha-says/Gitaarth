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
    console.error('❌ MongoDB connection failed:', err.message);
    process.exit(1);
  }
}
