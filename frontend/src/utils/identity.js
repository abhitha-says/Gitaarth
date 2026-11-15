/**
 * Gitaarth AI — Caller identity
 *
 * Every request carries a stable key so the backend can file long-term
 * memories against the right person:
 *   signed in → Authorization: Bearer <jwt>
 *   guest     → X-Guest-Id: <uuid persisted in localStorage>
 *
 * The guest id is what lets someone who has never signed in still be
 * remembered across a new chat on the same browser.
 */

const TOKEN_KEY = 'gitaarth_token';
const GUEST_KEY = 'gitaarth_guest_id';

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

/** crypto.randomUUID needs a secure context; fall back for plain http hosts. */
function newUuid() {
  if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID();
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
  });
}

export function getGuestId() {
  let id = localStorage.getItem(GUEST_KEY);
  if (!id) {
    id = newUuid();
    localStorage.setItem(GUEST_KEY, id);
  }
  return id;
}

/** Headers for any call that should be attributed to this person. */
export function identityHeaders(extra = {}) {
  const headers = { 'X-Guest-Id': getGuestId(), ...extra };
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
}
