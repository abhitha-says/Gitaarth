import { useSyncExternalStore } from 'react';

/**
 * Three versions of the same morning:
 *   full    — everything
 *   lighter — fewer layers and no dust, for modest phones and data savers
 *   still   — reduced motion: nothing moves on its own, nothing is pinned
 * `?tier=` in the address forces one, for checking.
 */
const QUERY = '(prefers-reduced-motion: reduce)';

function detect() {
  if (typeof window === 'undefined') return 'full';
  const forced = new URLSearchParams(window.location.search).get('tier');
  if (forced === 'full' || forced === 'lighter' || forced === 'still') return forced;
  if (window.matchMedia(QUERY).matches) return 'still';
  const nav = window.navigator;
  if (nav.connection?.saveData) return 'lighter';
  if ((nav.deviceMemory || 8) <= 4 || (nav.hardwareConcurrency || 8) <= 4) return 'lighter';
  return 'full';
}

function subscribe(onChange) {
  const mq = window.matchMedia(QUERY);
  mq.addEventListener('change', onChange);
  return () => mq.removeEventListener('change', onChange);
}

export function useTier() {
  return useSyncExternalStore(subscribe, detect, () => 'full');
}
