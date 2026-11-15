/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Veil.css';

/**
 * The passage into a conversation: a slow bloom of golden light that fills
 * the screen, carries the visitor across, and dissolves on the other side.
 */
const VeilCtx = createContext(() => {});

const prefersReduced = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export function VeilProvider({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [phase, setPhase] = useState('idle'); // idle | rising | settling
  const [origin, setOrigin] = useState({ x: 50, y: 50 });
  const busy = useRef(false);

  const enter = useCallback((to, event) => {
    if (busy.current) return;
    const target = typeof to === 'string' ? to : to.pathname;
    if (prefersReduced() || target.split('?')[0] === location.pathname) {
      navigate(to);
      return;
    }
    busy.current = true;
    if (event?.clientX != null && event.clientX !== 0) {
      setOrigin({ x: (event.clientX / window.innerWidth) * 100, y: (event.clientY / window.innerHeight) * 100 });
    } else {
      setOrigin({ x: 50, y: 50 });
    }
    setPhase('rising');
    setTimeout(() => {
      navigate(to);
      setPhase('settling');
      setTimeout(() => { setPhase('idle'); busy.current = false; }, 900);
    }, 620);
  }, [navigate, location.pathname]);

  return (
    <VeilCtx.Provider value={enter}>
      {children}
      <div
        className={`veil veil--${phase}`}
        style={{ '--vx': `${origin.x}%`, '--vy': `${origin.y}%` }}
        aria-hidden="true"
      />
    </VeilCtx.Provider>
  );
}

/** Returns enter(to, event): navigate through the light. */
export function useVeil() {
  return useContext(VeilCtx);
}
