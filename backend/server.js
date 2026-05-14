import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { connectDB, isDBConnected } from './config/db.js';
import chatRouter from './routes/chat.js';
import sessionsRouter from './routes/sessions.js';
import shlokasRouter from './routes/shlokas.js';
import bookmarksRouter from './routes/bookmarks.js';

const app = express();
const PORT = process.env.PORT || 5000;

/* ─── Middleware ─── */
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());

/* ─── Health check ─── */
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'gitaarth-ai',
    db: isDBConnected() ? 'connected' : 'disconnected',
    uptime: Math.floor(process.uptime()),
  });
});

/* ─── Routes ─── */
app.use('/api/chat', chatRouter);
app.use('/api/sessions', sessionsRouter);
app.use('/api/shlokas', shlokasRouter);
app.use('/api/bookmarks', bookmarksRouter);

/* ─── Start ─── */
async function start() {
  // Connect to MongoDB (non-blocking — server starts even if DB is down)
  await connectDB();

  app.listen(PORT, () => {
    console.log(`✨ Gitaarth AI backend running on http://localhost:${PORT}`);
    console.log(`📦 Database: ${isDBConnected() ? '✅ Connected' : '⚠️  Not connected (running without persistence)'}`);
  });
}

start();
