/**
 * Gitaarth AI — Auth Routes
 * Handles Google OAuth login flow and session management.
 */

import { Router } from 'express';
import passport from '../config/passport.js';
import jwt from 'jsonwebtoken';

const router = Router();
const JWT_SECRET = process.env.SESSION_SECRET || 'gitaarth-secret';
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

/**
 * GET /auth/google
 * Redirects the user to Google's consent screen.
 */
router.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email'],
}));

/**
 * GET /auth/google/callback
 * Google redirects here after the user signs in.
 * On success: generates a JWT and redirects to frontend with token.
 * On failure: redirects to frontend with error.
 */
router.get('/google/callback',
  passport.authenticate('google', {
    failureRedirect: `${FRONTEND_URL}?auth=error`,
    session: false,
  }),
  (req, res) => {
    // Generate JWT token with user data
    const token = jwt.sign(
      {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        avatar: req.user.avatar,
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Redirect to frontend with token as query param
    // Frontend will store this in localStorage
    res.redirect(`${FRONTEND_URL}?token=${token}`);
  }
);

/**
 * GET /auth/me
 * Returns the current user's profile from their JWT token.
 */
router.get('/me', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  try {
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    res.json({
      user: {
        id: decoded.id,
        name: decoded.name,
        email: decoded.email,
        avatar: decoded.avatar,
      },
    });
  } catch {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
});

/**
 * POST /auth/logout
 * Client-side logout — just tells the frontend to clear the token.
 */
router.post('/logout', (_req, res) => {
  res.json({ success: true, message: 'Logged out. Clear your token.' });
});

export default router;
