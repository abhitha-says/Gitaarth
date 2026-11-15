import { useEffect, useRef } from 'react';

/**
 * A quiet dawn sky: fine gold dust that glints, and motes of warm light
 * that rise slowly from a source of light. Canvas-drawn so it costs one layer, pauses when
 * hidden or off-screen, and holds a single still frame for reduced motion.
 */
export default function CelestialField({ stars = 110, motes = 34, origin = { x: 0.7, y: 0.62 }, spread = 0.22, className = '' }) {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return undefined;
    const ctx = canvas.getContext('2d');
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    let w = 0, h = 0, raf = 0, last = 0, onScreen = true;
    let starList = [], moteList = [];
    const rand = (a, b) => a + Math.random() * (b - a);

    const makeMote = (fresh) => ({
      x: (origin.x + rand(-spread, spread)) * w,
      y: fresh ? rand(0.15, 1) * h : (origin.y + rand(0, 0.35)) * h,
      r: rand(0.6, 2.1),
      vy: rand(5, 15),
      drift: rand(-4, 4),
      phase: rand(0, Math.PI * 2),
      life: 0,
      span: rand(9, 20),
      hue: Math.random() < 0.75 ? '214, 166, 76' : '236, 196, 120',
    });

    function seed() {
      const area = Math.min(1.25, (w * h) / (1440 * 860));
      starList = Array.from({ length: Math.round(stars * area) }, () => ({
        x: Math.random() * w,
        y: Math.random() * h * 0.92,
        r: Math.random() < 0.92 ? rand(0.3, 0.9) : rand(0.9, 1.5),
        a: rand(0.1, 0.45),
        tw: rand(0.2, 0.9),
        ph: rand(0, Math.PI * 2),
      }));
      moteList = Array.from({ length: Math.round(motes * Math.max(0.5, area)) }, () => {
        const m = makeMote(true);
        m.life = rand(0, m.span);
        return m;
      });
    }

    function resize() {
      const rect = canvas.getBoundingClientRect();
      w = rect.width; h = rect.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
      if (reduce) draw(0, 0);
    }

    function draw(t, dt) {
      ctx.clearRect(0, 0, w, h);
      for (const s of starList) {
        const a = s.a * (0.65 + 0.35 * Math.sin(t * s.tw + s.ph));
        ctx.fillStyle = `rgba(184, 138, 56, ${a})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
      }
      for (let i = 0; i < moteList.length; i++) {
        const m = moteList[i];
        m.life += dt;
        m.y -= m.vy * dt;
        m.x += Math.sin(t * 0.6 + m.phase) * 0.15 + m.drift * dt * 0.2;
        const p = m.life / m.span;
        if (p >= 1 || m.y < -10) { moteList[i] = makeMote(false); continue; }
        const fade = Math.sin(Math.PI * p);
        const glow = ctx.createRadialGradient(m.x, m.y, 0, m.x, m.y, m.r * 5);
        glow.addColorStop(0, `rgba(${m.hue}, ${0.42 * fade})`);
        glow.addColorStop(1, `rgba(${m.hue}, 0)`);
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(m.x, m.y, m.r * 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = `rgba(196, 146, 58, ${0.75 * fade})`;
        ctx.beginPath();
        ctx.arc(m.x, m.y, m.r * 0.7, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    function frame(now) {
      const t = now / 1000;
      const dt = last ? Math.min(0.05, t - last) : 0.016;
      last = t;
      draw(t, dt);
      raf = requestAnimationFrame(frame);
    }

    function start() {
      if (reduce || raf || !onScreen || document.hidden) return;
      last = 0;
      raf = requestAnimationFrame(frame);
    }
    function stop() { cancelAnimationFrame(raf); raf = 0; }

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    const io = new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting;
      if (onScreen) start(); else stop();
    });
    io.observe(canvas);
    const onVis = () => (document.hidden ? stop() : start());
    document.addEventListener('visibilitychange', onVis);
    start();

    return () => {
      stop();
      ro.disconnect();
      io.disconnect();
      document.removeEventListener('visibilitychange', onVis);
    };
  }, [stars, motes, origin.x, origin.y, spread]);

  return <canvas ref={ref} className={className} aria-hidden="true" />;
}
