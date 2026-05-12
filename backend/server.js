import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import chatRouter from './routes/chat.js';

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

/* ─── Start ─── */
app.listen(PORT, () => {
  console.log(`✨ Gitaarth AI backend running on http://localhost:${PORT}`);
});
