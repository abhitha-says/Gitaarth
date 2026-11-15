import meta from './artMeta.json';

/**
 * The artwork manifest. Every picture on the site is a named slot; replacing
 * a file in public/img/art (through tools/art/prepare_art.py) is all it takes
 * to change it. A slot that has no picture yet returns null and its scene
 * simply leaves the place empty.
 */
export function art(slot) {
  const entry = meta[slot];
  return entry && entry.src ? entry : null;
}

export const MIST = { a: '/img/art/mist-a.webp', b: '/img/art/mist-b.webp' };
