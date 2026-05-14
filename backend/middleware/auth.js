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
