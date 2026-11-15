/**
 * Gitaarth — API client
 * Thin wrappers over the existing backend contracts. Nothing here changes
 * what the server receives; it only turns failures into something the UI
 * can explain honestly.
 */
import { API_BASE_URL } from './constants';
import { identityHeaders } from './identity';

export class ApiError extends Error {
  /** kind: 'network' | 'timeout' | 'rate' | 'invalid' | 'server' | 'unavailable' | 'notfound' */
  constructor(kind, message, status = 0) {
    super(message || kind);
    this.kind = kind;
    this.status = status;
  }
}

const CHAT_TIMEOUT_MS = 60000;

async function readJson(res) {
  try { return await res.json(); } catch { return null; }
}

/**
 * POST /api/chat
 * Body: { message, language, history, sessionId }
 * Returns: { sessionId, persona, text, shloka, counseling }
 */
export async function sendChat({ message, language, history, sessionId, signal }) {
  const controller = new AbortController();
  let timedOut = false;
  const timer = setTimeout(() => { timedOut = true; controller.abort(); }, CHAT_TIMEOUT_MS);
  const onAbort = () => controller.abort();
  signal?.addEventListener('abort', onAbort);

  let res;
  try {
    res = await fetch(`${API_BASE_URL}/chat`, {
      method: 'POST',
      headers: identityHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify({ message, language, history, sessionId }),
      signal: controller.signal,
    });
  } catch (err) {
    if (timedOut) throw new ApiError('timeout');
    if (err?.name === 'AbortError') throw err;
    throw new ApiError('network');
  } finally {
    clearTimeout(timer);
    signal?.removeEventListener('abort', onAbort);
  }

  const data = await readJson(res);
  if (!res.ok) {
    const kind = res.status === 429 ? 'rate' : res.status === 400 ? 'invalid' : 'server';
    throw new ApiError(kind, data?.error, res.status);
  }
  if (!data || typeof data.text !== 'string') throw new ApiError('server', 'Empty response');
  return data;
}

/** GET /api/sessions — null when history is unavailable (no DB, offline). */
export async function listSessions(limit = 30) {
  try {
    const res = await fetch(`${API_BASE_URL}/sessions?limit=${limit}`, { headers: identityHeaders() });
    if (!res.ok) return null;
    const data = await readJson(res);
    return Array.isArray(data?.sessions) ? data.sessions : [];
  } catch {
    return null;
  }
}

/** GET /api/sessions/:id — { session, messages } */
export async function getSession(sessionId) {
  let res;
  try {
    res = await fetch(`${API_BASE_URL}/sessions/${encodeURIComponent(sessionId)}`, { headers: identityHeaders() });
  } catch {
    throw new ApiError('network');
  }
  if (res.status === 404) throw new ApiError('notfound');
  if (res.status === 503) throw new ApiError('unavailable');
  if (!res.ok) throw new ApiError('server');
  return readJson(res);
}

/** Plain-language explanations for each failure. */
export function describeError(err) {
  switch (err?.kind) {
    case 'rate':
      return {
        title: 'Gitaarth needs a short pause',
        body: 'Too many conversations are reaching the guidance service right now. Please wait a few minutes, then try again.',
      };
    case 'timeout':
      return {
        title: 'This is taking longer than it should',
        body: 'No reply arrived within a minute. Your words are still here, so you can send them again.',
      };
    case 'network':
      return {
        title: 'Your words could not reach Gitaarth',
        body: 'The connection to the guidance service failed. Check your internet connection, then try again.',
      };
    case 'invalid':
      return { title: 'That message could not be sent', body: err.message || 'Please write something and try again.' };
    default:
      return {
        title: 'Something went wrong on our side',
        body: 'The guidance service did not respond as expected. Please try again in a moment.',
      };
  }
}
