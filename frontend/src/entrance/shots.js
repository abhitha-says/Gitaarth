/** Once per browser session: the entrance plays on the first arrival only. */
const KEY = 'gitaarth:entered';
export const hasEntered = () => { try { return sessionStorage.getItem(KEY) === '1'; } catch { return false; } };
export const markEntered = () => { try { sessionStorage.setItem(KEY, '1'); } catch { /* private mode */ } };

/** The film runs over this much of the scroll; then light, then the question. */
export const FILM_END = 0.86;

/** A frame of film grain, made once (a small noise tile, drawn by CSS over the stage). */
let grain;
export function grainTile() {
  if (grain !== undefined) return grain;
  try {
    const n = 128;
    const c = document.createElement('canvas');
    c.width = n; c.height = n;
    const ctx = c.getContext('2d');
    const img = ctx.createImageData(n, n);
    // Light and dark specks on a clear ground: composited normally, so it costs nothing to blend
    for (let k = 0; k < img.data.length; k += 4) {
      const v = Math.random() + Math.random() + Math.random() - 1.5;
      const c = v > 0 ? 255 : 0;
      img.data[k] = c; img.data[k + 1] = c; img.data[k + 2] = c;
      img.data[k + 3] = Math.min(255, Math.abs(v) * 30);
    }
    ctx.putImageData(img, 0, 0);
    grain = c.toDataURL('image/png');
  } catch { grain = null; }
  return grain;
}
