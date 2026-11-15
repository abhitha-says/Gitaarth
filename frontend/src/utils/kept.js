/**
 * Gitaarth — Kept words
 * Verses and guidance a person chooses to keep, stored on this device.
 * Works for guests and signed-in people alike; nothing leaves the browser.
 */
import { useSyncExternalStore, useCallback } from 'react';

const KEY = 'gitaarth_kept';
const LIMIT = 200;
const listeners = new Set();

function read() {
  try {
    const parsed = JSON.parse(localStorage.getItem(KEY) || '[]');
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

let cache = typeof window === 'undefined' ? [] : read();

function write(next) {
  cache = next.slice(0, LIMIT);
  try { localStorage.setItem(KEY, JSON.stringify(cache)); } catch { /* storage full or blocked */ }
  listeners.forEach((fn) => fn());
}

if (typeof window !== 'undefined') {
  window.addEventListener('storage', (e) => {
    if (e.key === KEY) { cache = read(); listeners.forEach((fn) => fn()); }
  });
}

function subscribe(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

/** Stable id from text, so the same words are never kept twice. */
export function keyFor(prefix, text) {
  let h = 5381;
  for (let i = 0; i < text.length; i++) h = ((h << 5) + h + text.charCodeAt(i)) | 0;
  return `${prefix}-${(h >>> 0).toString(36)}`;
}

export function useKept() {
  const items = useSyncExternalStore(subscribe, () => cache, () => cache);
  const isKept = useCallback((id) => items.some((i) => i.id === id), [items]);
  const toggle = useCallback((item) => {
    const exists = cache.some((i) => i.id === item.id);
    write(exists ? cache.filter((i) => i.id !== item.id) : [{ ...item, keptAt: Date.now() }, ...cache]);
    return !exists;
  }, []);
  const remove = useCallback((id) => write(cache.filter((i) => i.id !== id)), []);
  return { items, isKept, toggle, remove };
}
