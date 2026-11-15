/* eslint-disable react-refresh/only-export-components */
import { useSyncExternalStore } from 'react';
import LivingImage from '../../scene/LivingImage';
import { art } from '../../scene/art';

const WIDE = '(min-width: 1024px) and (min-aspect-ratio: 1/1)';

function subscribe(onChange) {
  const mq = window.matchMedia(WIDE);
  mq.addEventListener('change', onChange);
  return () => mq.removeEventListener('change', onChange);
}

/** True on a wide, landscape screen, where Krishna can sit beside the words. */
export function useWide() {
  return useSyncExternalStore(subscribe, () => window.matchMedia(WIDE).matches, () => false);
}

/** The seated picture when it exists; until then the standing stand-in. */
export function presenceSlot() {
  if (art('krishna-seated')) return 'krishna-seated';
  if (art('krishna-standing')) return 'krishna-standing';
  return null;
}

/**
 * Krishna at the side of the conversation, in the light from the upper left.
 * He is never behind or under the words; only his cloth stirs.
 */
export default function Presence({ tier }) {
  const slot = presenceSlot();
  if (!slot) return null;
  const standIn = Boolean(art(slot)?.standIn) || slot === 'krishna-standing';
  return (
    <aside className={`presence presence--${slot}`} aria-label="Krishna is here with you">
      <div className="presence__figure">
        <LivingImage
          slot={slot}
          alt="Krishna at rest in the morning light, listening"
          live={tier === 'full'}
          haze={standIn ? 0.24 : 0.08}
          light={0.8}
          depth={0.01}
          eager
        />
      </div>
      <span className="presence__ground" aria-hidden="true" />
    </aside>
  );
}
