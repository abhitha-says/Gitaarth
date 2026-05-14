/**
 * Gitaarth AI — Database Seed Script
 * Run: npm run seed
 * Seeds MongoDB with Gita shlokas and Ram quotes.
 */

import 'dotenv/config';
import mongoose from 'mongoose';
import { readFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

import Shloka from '../models/Shloka.js';
import RamQuote from '../models/RamQuote.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function seed() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('❌ MONGODB_URI not set in .env — cannot seed.');
    process.exit(1);
  }

  try {
    await mongoose.connect(uri);
    console.log('🔗 Connected to MongoDB');

    // ── Seed Gita Shlokas ──
    const shlokaData = JSON.parse(
      await readFile(join(__dirname, 'gitaShlokas.json'), 'utf-8')
    );

    await Shloka.deleteMany({});
    const shlokas = await Shloka.insertMany(shlokaData);
    console.log(`📖 Seeded ${shlokas.length} Gita shlokas`);

    // ── Seed Ram Quotes ──
    const ramData = JSON.parse(
      await readFile(join(__dirname, 'ramQuotes.json'), 'utf-8')
    );

    await RamQuote.deleteMany({});
    const quotes = await RamQuote.insertMany(ramData);
    console.log(`🏹 Seeded ${quotes.length} Ram quotes`);

    console.log('\n✅ Database seeded successfully!');
  } catch (err) {
    console.error('❌ Seed failed:', err.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

seed();
