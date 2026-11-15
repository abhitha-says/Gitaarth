import { useEffect, useRef } from 'react';

/**
 * Dust in the morning light: a few dozen motes drifting on the same wind.
 * They only show against the picture's middle tones, as real dust does.
 */
export default function Dust({ count = 34, className = '' }) {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas.getContext('2d');
    let raf = 0;
    let visible = true;
    let w = 0;
    let h = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const motes = Array.from({ length: count }, () => ({
      x: Math.random(), y: Math.random(),
      r: 0.6 + Math.random() * 1.7,
      vx: 0.004 + Math.random() * 0.01,
      vy: -0.002 - Math.random() * 0.004,
      phase: Math.random() * Math.PI * 2,
      rate: 0.3 + Math.random() * 0.6,
    }));

    const size = () => {
      const rect = canvas.getBoundingClientRect();
      w = rect.width; h = rect.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    const resize = new ResizeObserver(size);
    resize.observe(canvas);

    let prev = performance.now();
    const frame = (now) => {
      raf = 0;
      if (!visible || document.hidden) return;
      const dt = Math.min(0.05, (now - prev) / 1000);
      prev = now;
      ctx.clearRect(0, 0, w, h);
      for (const m of motes) {
        m.x += m.vx * dt; m.y += m.vy * dt; m.phase += m.rate * dt;
        if (m.x > 1.02) m.x = -0.02;
        if (m.y < -0.02) m.y = 1.02;
        const a = 0.25 + 0.45 * (0.5 + 0.5 * Math.sin(m.phase));
        ctx.globalAlpha = a;
        ctx.fillStyle = '#fff6dc';
        ctx.beginPath();
        ctx.arc(m.x * w, m.y * h + Math.sin(m.phase * 0.7) * 6, m.r, 0, Math.PI * 2);
        ctx.fill();
      }
      raf = requestAnimationFrame(frame);
    };
    const wake = () => { prev = performance.now(); if (!raf) raf = requestAnimationFrame(frame); };
    const seen = new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible) wake(); });
    seen.observe(canvas);
    document.addEventListener('visibilitychange', wake);

    return () => {
      cancelAnimationFrame(raf);
      resize.disconnect();
      seen.disconnect();
      document.removeEventListener('visibilitychange', wake);
    };
  }, [count]);

  return <canvas ref={ref} className={`dust ${className}`} aria-hidden="true" />;
}
