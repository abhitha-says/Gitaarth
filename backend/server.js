import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { connectDB } from './config/db.js';
import chatRouter from './routes/chat.js';
import shlokaRouter from './routes/shlokas.js';
import userRouter from './routes/user.js';

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
  res.json({ status: 'ok', service: 'gitaarth-ai' });
});

/* ─── Routes ─── */
app.use('/api/chat', chatRouter);
app.use('/api/shlokas', shlokaRouter);
app.use('/api/user', userRouter);

/* ─── Start ─── */
async function start() {
  // Connect to MongoDB (gracefully skips if URI not set)
  await connectDB();

  app.listen(PORT, () => {
    console.log(`✨ Gitaarth AI backend running on http://localhost:${PORT}`);
  });
}

start();
