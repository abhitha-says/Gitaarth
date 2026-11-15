import { useEffect, useRef, useState } from 'react';
import { useTier } from '../../scene/tier';

/**
 * Lines that arrive one at a time (the shared `.arrive` class) once the block
 * comes into view. In the still tier everything is simply there.
 * Returns [ref, className, still].
 */
export function useArrive({ margin = '0px 0px -8% 0px' } = {}) {
  const still = useTier() === 'still';
  const ref = useRef(null);
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    if (still) return undefined;
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') return undefined;
    const io = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) {
        setSeen(true);
        io.disconnect();
      }
    }, { rootMargin: margin });
    io.observe(el);
    return () => io.disconnect();
  }, [still, margin]);

  return [ref, `arrive${seen || still ? ' is-on' : ''}`, still];
}
