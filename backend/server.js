import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import session from 'express-session';
import passport from './config/passport.js';
import { connectDB } from './config/db.js';
import authRouter from './routes/auth.js';
import chatRouter from './routes/chat.js';
import shlokaRouter from './routes/shlokas.js';
import userRouter from './routes/user.js';
import { requireAuth } from './middleware/auth.js';

const app = express();
const PORT = process.env.PORT || 5000;

/* ─── Middleware ─── */
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());

// Session (needed for Passport OAuth handshake)
app.use(session({
  secret: process.env.SESSION_SECRET || 'gitaarth-secret',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 24 * 60 * 60 * 1000 }, // 1 day
}));

// Passport
app.use(passport.initialize());
app.use(passport.session());

/* ─── Health check ─── */
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'gitaarth-ai' });
});

/* ─── Routes ─── */
app.use('/auth', authRouter);           // Google OAuth (public)
app.use('/api/chat', chatRouter);       // Chat API (public — guests can chat)
app.use('/api/shlokas', shlokaRouter);  // Scripture library (public)
app.use('/api/user', requireAuth, userRouter); // User profile/bookmarks (auth required)

/* ─── Start ─── */
async function start() {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`✨ Gitaarth AI backend running on http://localhost:${PORT}`);
  });
}

start();
