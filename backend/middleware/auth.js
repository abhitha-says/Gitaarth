/**
 * Gitaarth AI — Auth Middleware
 * Protects routes that require a logged-in user.
 */

import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.SESSION_SECRET || 'gitaarth-secret';

/**
 * requireAuth — blocks unauthenticated requests.
 * Extracts userId from JWT and attaches it to req.userId.
 */
export function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authentication required. Please sign in.' });
  }

  try {
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.id;
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ error: 'Invalid or expired token. Please sign in again.' });
  }
}

/**
 * optionalAuth — attaches user info if token is present, but doesn't block.
 * Useful for routes that work for both guests and logged-in users (like chat).
 */
export function optionalAuth(req, _res, next) {
  const authHeader = req.headers.authorization;
  if (authHeader?.startsWith('Bearer ')) {
    try {
      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, JWT_SECRET);
      req.userId = decoded.id;
      req.user = decoded;
    } catch {
      // Token invalid — proceed as guest
    }
  }
  next();
}

/* ─────────── Owner identity ─────────── */

/** Guest ids are client-generated UUIDs; anything else is not trusted as a key. */
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * attachOwner — resolves the stable key that long-term memory hangs off.
 *
 * Signed in  → "user:<mongoId>"  (survives device changes)
 * Guest      → "guest:<uuid>"    (survives new chats on the same browser)
 * Neither    → null              (no persistence, chat still works)
 *
 * Run this AFTER optionalAuth. A signed-in user always wins over the guest
 * header, so signing in cannot be spoofed away by a forged X-Guest-Id.
 */
export function attachOwner(req, _res, next) {
  if (req.userId) {
    req.ownerKey = `user:${req.userId}`;
    req.ownerType = 'user';
  } else {
    const guestId = req.headers['x-guest-id'];
    if (typeof guestId === 'string' && UUID_RE.test(guestId)) {
      req.ownerKey = `guest:${guestId.toLowerCase()}`;
      req.ownerType = 'guest';
    } else {
      req.ownerKey = null;
      req.ownerType = 'anonymous';
    }
  }
  next();
}
