import { useEffect } from 'react';

/**
 * One sun for the whole site. --sun runs from 0 (first light) to 1 (full
 * morning); index.css derives every shadow, and the sky's glow, from it.
 */
let last = -1;

export function setSun(value) {
  const q = Math.round(Math.min(1, Math.max(0, value)) * 100) / 100;
  if (q === last) return;
  last = q;
  const style = document.documentElement.style;
  style.setProperty('--sun', String(q));
  style.setProperty('--sun-x', `${20 + q * 8}%`);
  style.setProperty('--sun-y', `${62 - q * 48}%`);
}

/**
 * Away from the journey the sun keeps the visitor's own hours, but it never
 * sets: the small hours read as early morning, midday as full morning.
 */
export function sunForHour(date = new Date()) {
  const h = date.getHours() + date.getMinutes() / 60;
  const fromNoon = Math.min(1, Math.abs(h - 12.5) / 7.5);
  return 0.56 + (1 - fromNoon) * 0.4;
}

export function useAmbientSun(active = true) {
  useEffect(() => {
    if (!active) return undefined;
    setSun(sunForHour());
    const id = setInterval(() => setSun(sunForHour()), 5 * 60 * 1000);
    return () => clearInterval(id);
  }, [active]);
}
