/**
 * Gitaarth AI — MongoDB Connection
 * Handles connection lifecycle with retry logic and graceful shutdown.
 */

import mongoose from 'mongoose';

const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 3000;

/**
 * Connect to MongoDB with retry logic.
 * @returns {Promise<void>}
 */
export async function connectDB() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.warn('⚠️  MONGODB_URI not set — running without database. Chat history will not persist.');
    return;
  }

  /* ─── Connection event handlers ─── */
  mongoose.connection.on('connected', () => {
    console.log('🔗 MongoDB connected successfully');
  });

  mongoose.connection.on('error', (err) => {
    console.error('❌ MongoDB connection error:', err.message);
  });

  mongoose.connection.on('disconnected', () => {
    console.log('🔌 MongoDB disconnected');
  });

  /* ─── Retry loop ─── */
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      await mongoose.connect(uri, {
        dbName: process.env.DB_NAME || 'gitaarth',
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
      });
      return; // success
    } catch (err) {
      console.error(`❌ MongoDB connection attempt ${attempt}/${MAX_RETRIES} failed:`, err.message);
      if (attempt < MAX_RETRIES) {
        console.log(`⏳ Retrying in ${RETRY_DELAY_MS / 1000}s...`);
        await new Promise((r) => setTimeout(r, RETRY_DELAY_MS));
      } else {
        console.error('💀 All MongoDB connection attempts failed. Starting without database.');
      }
    }
  }
}

/**
 * Check if the database is currently connected.
 * @returns {boolean}
 */
export function isDBConnected() {
  return mongoose.connection.readyState === 1;
}

/* ─── Graceful shutdown ─── */
async function gracefulShutdown(signal) {
  console.log(`\n📡 Received ${signal}. Closing MongoDB connection...`);
  try {
    await mongoose.connection.close();
    console.log('✅ MongoDB connection closed gracefully');
  } catch (err) {
    console.error('❌ Error closing MongoDB:', err.message);
  }
  process.exit(0);
}

process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
