import film from './frames.json';

/**
 * The entrance film: one timeline of frames (see tools/entrance/build_frames.py).
 *
 * Files arrive in the order the visitor meets them (the arrival first, then
 * the first frame of every shot, then the rest) and are kept as small
 * compressed blobs. Only a moving window of frames around the playhead is
 * decoded, so memory stays flat however long the film is.
 */
export const FILM = film;
export const ARRIVAL = film.shots[0];
export const SCROLLED = film.shots.slice(1);

const TINY_AVIF = 'data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAAD5bWV0YQAAAAAAAAAvaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAFBpY3R1cmVIYW5kbGVyAAAAAA5waXRtAAAAAAABAAAAHmlsb2MAAAAARAAAAQABAAAAAQAAASEAAAAWAAAAKGlpbmYAAAAAAAEAAAAaaW5mZQIAAAAAAQAAYXYwMUNvbG9yAAAAAGppcHJwAAAAS2lwY28AAAAUaXNwZQAAAAAAAAACAAAAAgAAABBwaXhpAAAAAAMICAgAAAAMYXYxQ4EADAAAAAATY29scm5jbHgAAgACAAIAAAAAF2lwbWEAAAAAAAAAAQABBAECgwQAAAAebWRhdAoFGAA2wCAyDRgAAABQAAAAALATSyg=';

let avifCheck;
/** Whether this browser decodes AVIF (asked once). */
export function supportsAvif() {
  if (!avifCheck) {
    avifCheck = new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(img.width > 0);
      img.onerror = () => resolve(false);
      img.src = TINY_AVIF;
    });
  }
  return avifCheck;
}

export const heroSrc = (format) => `/entrance/hero.${format}`;

/** Which shot an index belongs to. */
export function shotAt(i) {
  const s = film.shots;
  for (let k = s.length - 1; k >= 0; k -= 1) if (i >= s[k].start) return s[k];
  return s[0];
}

export function createFilm({ format, step = 1, behind = 8, ahead = 18 }) {
  const blobs = new Map();     // index -> Blob
  const frames = new Map();    // index -> ImageBitmap
  const decoding = new Set();
  const listeners = new Set();
  let centre = 0;
  let cancelled = false;

  const has = (i) => i >= 0 && i < film.count && i % step === 0;
  const url = (i) => `/entrance/f/${String(i).padStart(3, '0')}.${format}`;

  // Load order: the arrival, then each shot's first frame, then everything in order
  const order = [];
  const seen = new Set();
  const push = (i) => { if (has(i) && !seen.has(i)) { seen.add(i); order.push(i); } };
  for (let i = 0; i < ARRIVAL.count; i += 1) push(i);
  SCROLLED.forEach((s) => push(s.start));
  for (let i = 0; i < film.count; i += 1) push(i);

  async function fetchOne(i) {
    try {
      const res = await fetch(url(i));
      if (!res.ok || cancelled) return;
      blobs.set(i, await res.blob());
      pump();
    } catch { /* a missing frame is covered by its neighbours */ }
  }

  (async () => {
    let next = 0;
    const worker = async () => {
      while (!cancelled && next < order.length) {
        const i = order[next];
        next += 1;
        await fetchOne(i);
      }
    };
    await Promise.all(Array.from({ length: 6 }, worker));
  })();

  // Decode the frames nearest the playhead first; let go of the ones far behind or far ahead
  function pump() {
    if (cancelled) return;
    frames.forEach((bmp, i) => {
      if (i < centre - behind * 2 || i > centre + ahead * 2) { bmp.close?.(); frames.delete(i); }
    });
    if (decoding.size >= 3) return;
    let best = -1;
    let bestD = Infinity;
    for (let i = Math.max(0, Math.floor(centre) - behind); i <= Math.min(film.count - 1, Math.ceil(centre) + ahead); i += 1) {
      if (!blobs.has(i) || frames.has(i) || decoding.has(i)) continue;
      const d = i < centre ? (centre - i) * 1.6 : i - centre;   // ahead matters more than behind
      if (d < bestD) { bestD = d; best = i; }
    }
    if (best < 0) return;
    decoding.add(best);
    createImageBitmap(blobs.get(best))
      .then((bmp) => {
        decoding.delete(best);
        if (cancelled) { bmp.close?.(); return; }
        frames.set(best, bmp);
        listeners.forEach((fn) => fn(best));
        pump();
      })
      .catch(() => { decoding.delete(best); blobs.delete(best); pump(); });
    pump();
  }

  return {
    step,
    /** Move the decode window to the playhead. */
    focus(i) {
      if (Math.abs(i - centre) < 0.5) return;
      centre = i;
      pump();
    },
    /** The decoded frame at exactly i, or null. */
    get(i) { return frames.get(i) || null; },
    /** Nearest decoded frame at or below i (dir -1) or at or above i (dir 1), within `reach`. */
    near(i, dir, reach = 6) {
      for (let d = 0; d <= reach; d += 1) {
        const j = i + d * dir;
        const b = frames.get(j);
        if (b) return [j, b];
      }
      return null;
    },
    /** Whether every file from a to b (inclusive) has arrived. */
    loaded(a, b) {
      for (let i = a; i <= b; i += 1) if (has(i) && !blobs.has(i)) return false;
      return true;
    },
    onFrame(fn) { listeners.add(fn); return () => listeners.delete(fn); },
    dispose() {
      cancelled = true;
      frames.forEach((b) => b.close?.());
      frames.clear();
      blobs.clear();
      listeners.clear();
    },
  };
}
