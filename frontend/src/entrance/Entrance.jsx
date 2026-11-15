import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useScroll, useSpring } from 'framer-motion';
import { ARRIVAL, SCROLLED, createFilm, shotAt, supportsAvif } from './frames';
import { FILM_END, grainTile, markEntered } from './shots';
import Rest from './Rest';
import './Entrance.css';

/**
 * The entrance: one film, one pinned stage.
 *
 * While the site loads, the arrival plays on its own (black, golden haze, his
 * face). Then the page's scroll runs the film forward and back: the crown,
 * discus and conch, the discus on a fingertip, the conch, the discus igniting,
 * the four-armed form, light. The light becomes the site's ivory, and the
 * stage comes to rest on the Home hero. Nothing is written over the film.
 */

const clamp = (v, lo = 0, hi = 1) => Math.min(hi, Math.max(lo, v));
const smooth = (e0, e1, v) => { const t = clamp((v - e0) / (e1 - e0)); return t * t * (3 - 2 * t); };
const lerp = (a, b, t) => a + (b - a) * t;

const TOTAL_SHARE = SCROLLED.reduce((a, s) => a + s.share, 0);
const LAST = SCROLLED[SCROLLED.length - 1];

/** Scroll (0..1) → playhead, a fractional frame index. Scroll 0 is the arrival's last frame. */
function playheadAt(v) {
  const u = clamp(v / FILM_END) * TOTAL_SHARE;
  let acc = 0;
  for (const s of SCROLLED) {
    if (u <= acc + s.share || s === LAST) return s.start - 1 + clamp((u - acc) / s.share) * s.count;
    acc += s.share;
  }
  return LAST.start + LAST.count - 1;
}

const PORTRAIT = '(max-aspect-ratio: 9/10)';
function usePortrait() {
  const [m, setM] = useState(() => window.matchMedia(PORTRAIT).matches);
  useEffect(() => {
    const mq = window.matchMedia(PORTRAIT);
    const on = () => setM(mq.matches);
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);
  return m;
}

export default function Entrance({ tier, paths, onAsk }) {
  const portrait = usePortrait();
  const portraitRef = useRef(portrait);
  useLayoutEffect(() => { portraitRef.current = portrait; }, [portrait]);
  const ref = useRef(null);
  const canvasRef = useRef(null);
  const ambientRef = useRef(null);
  const lightRef = useRef(null);
  const heroRef = useRef(null);
  const [ui, setUi] = useState({ beat: 'arrive', ready: false });
  const [text, setText] = useState('');
  const [grain] = useState(grainTile);

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  const v = useSpring(scrollYProgress, { stiffness: 190, damping: 34, mass: 0.5, restDelta: 0.00005 });

  useEffect(() => {
    let film = null;
    let raf = 0;
    let gone = false;
    let phase = scrollYProgress.get() > 0.002 ? 'film' : 'arrive';
    let arrival = -1;              // the arrival's own clock, in frames
    let lastT = 0;
    let lastRaw = scrollYProgress.get();
    let movedAt = 0;
    let idle = 0;
    let drawn = '';
    let ui0 = { beat: '', ready: false };
    let odd = false;

    const draw = (p) => {
      film.focus(p);
      const step = film.step;
      const lo = Math.floor(p / step) * step;
      const a = film.near(lo, -1);
      const b = film.near(lo + step, 1);
      if (!a && !b) return;                                   // keep the last picture rather than a hole
      const [ia, ba] = a || b;
      const [ib, bb] = b || a;
      const f = ia === ib ? 0 : clamp((p - ia) / (ib - ia));
      const cv = canvasRef.current;
      const s = shotAt(Math.round(p));
      const t = s.count > 1 ? clamp((p - s.start) / (s.count - 1)) : 0;
      const port = portraitRef.current;
      const fw = ba.width;
      const fh = ba.height;
      const w = port ? Math.round(fh * 0.8) : fw;
      const sx = port ? Math.round(clamp(lerp(s.focus[0], s.focus[1], t) * fw - w / 2, 0, fw - w)) : 0;
      const key = `${ia}|${f > 0.02 ? ib : ia}|${Math.round(f * 40)}|${sx}|${w}`;
      if (key === drawn) return;
      drawn = key;
      if (cv.width !== w || cv.height !== fh) { cv.width = w; cv.height = fh; }
      const ctx = cv.getContext('2d', { alpha: false });
      ctx.imageSmoothingQuality = 'high';
      ctx.globalAlpha = 1;
      ctx.drawImage(ba, sx, 0, w, fh, 0, 0, w, fh);
      if (f > 0.02) { ctx.globalAlpha = f; ctx.drawImage(bb, sx, 0, w, fh, 0, 0, w, fh); ctx.globalAlpha = 1; }
      const amb = ambientRef.current;
      if (port && amb) {
        const actx = amb.getContext('2d');
        actx.drawImage(ba, sx, 0, w, fh, 0, 0, amb.width, amb.height);
      }
    };

    const tick = (now) => {
      raf = requestAnimationFrame(tick);
      const dt = lastT ? Math.min(now - lastT, 100) : 16;
      lastT = now;
      const raw = scrollYProgress.get();
      if (Math.abs(raw - lastRaw) > 0.00002) { movedAt = now; lastRaw = raw; }
      const val = v.get();
      if (phase !== 'film' && raw > 0.002) phase = 'film';

      // The arrival plays on the clock, holding (never blanking) while frames are still on their way
      if (phase === 'arrive' && film) {
        const end = ARRIVAL.start + ARRIVAL.count - 1;
        if (arrival < 0) { if (film.get(0)) arrival = 0; }
        else {
          const next = Math.min(end - (end % film.step), (Math.floor(arrival / film.step) + 1) * film.step);
          if (film.get(next)) arrival = Math.min(end, arrival + (dt * ARRIVAL.fps) / 1000);
          if (arrival >= end) { phase = 'rest'; movedAt = now; }
        }
      }

      // Still for a moment: the shot keeps breathing, the playhead drifting a few frames to and fro
      const still = now - movedAt > 400 && phase !== 'arrive';
      idle = clamp(idle + (still ? dt / 1400 : -dt / 160));
      const ease = idle * idle * (3 - 2 * idle);

      if (film && val < 0.95) {
        let p = phase === 'arrive' ? Math.max(0, arrival) : playheadAt(val);
        if (ease > 0) {
          const s = shotAt(Math.round(p));
          const amp = 0.2 * s.fps;
          const lo = s.start;
          const hi = s.start + s.count - 1;
          const centre = clamp(p, lo + amp, Math.max(lo + amp, hi - amp));
          const sway = 0.72 * Math.sin(now / 1050) + 0.28 * Math.sin(now / 2330 + 1.3);
          p = clamp(lerp(p, centre + amp * sway, ease), lo, hi);
        }
        odd = !odd;
        if (ease < 0.999 || odd) draw(p);   // the slow idle sway needs only half the frames
      }

      // Light floods in and becomes the ivory; the resting picture comes out of it
      if (lightRef.current) lightRef.current.style.opacity = smooth(FILM_END - 0.07, FILM_END + 0.02, val).toFixed(3);
      if (heroRef.current) heroRef.current.style.opacity = smooth(FILM_END + 0.015, 0.95, val).toFixed(3);
      if (val > 0.97) markEntered();

      const beat = val >= 0.945 ? 'ask' : val >= FILM_END - 0.03 ? 'light' : phase === 'film' && val > 0.004 ? 'film' : phase;
      const ready = ui0.ready || (!!film && film.loaded(SCROLLED[0].start, SCROLLED[0].start + 4));
      if (beat !== ui0.beat || ready !== ui0.ready) { ui0 = { beat, ready }; setUi(ui0); }
    };

    supportsAvif().then((avif) => {
      if (gone) return;
      film = createFilm({ format: avif ? 'avif' : 'webp', step: !avif || tier === 'lighter' ? 2 : 1, ahead: portraitRef.current ? 12 : 18, behind: portraitRef.current ? 6 : 8 });
      film.onFrame(() => { drawn = ''; });
    });
    raf = requestAnimationFrame(tick);
    return () => { gone = true; cancelAnimationFrame(raf); film?.dispose(); };
  }, [tier]); // eslint-disable-line react-hooks/exhaustive-deps

  // The site's own bar steps aside until the stage arrives at the question
  useEffect(() => {
    const root = document.documentElement;
    root.dataset.intro = ui.beat === 'ask' ? 'done' : 'on';
    return () => { delete root.dataset.intro; };
  }, [ui.beat]);

  const skip = () => {
    markEntered();
    const el = ref.current;
    if (el) window.scrollTo({ top: el.offsetTop + el.offsetHeight - window.innerHeight, behavior: 'instant' });
  };
  const skipRef = useRef(skip);
  useLayoutEffect(() => { skipRef.current = skip; });
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') skipRef.current(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const submit = (e) => { e.preventDefault(); onAsk(e, text.trim()); };
  const { beat, ready } = ui;
  const asking = beat === 'ask';
  const bright = beat === 'light' || asking;
  const resting = beat === 'rest';

  return (
    <section ref={ref} className={`ent ent--${tier} ${portrait ? 'ent--portrait' : ''}`} aria-label="Entering Gitaarth">
      <div className={`ent__stage ${bright ? 'is-bright' : ''} ${asking ? 'is-asking' : ''}`}>
        {portrait && <canvas ref={ambientRef} className="ent__ambient" width="16" height="20" aria-hidden="true" />}
        <canvas ref={canvasRef} className="ent__film" aria-hidden="true" />
        {grain && tier === 'full' && <div className="ent__grain" style={{ '--grain': `url(${grain})` }} aria-hidden="true" />}
        <div ref={lightRef} className="ent__light" aria-hidden="true" />
        <div className={`ent__welcome ${resting ? 'is-on' : ''} ${resting && ready ? 'is-ready' : ''}`}>
          <p className="ent__brand">Gitaarth</p>
          <p className="ent__cue">Scroll to enter</p>
        </div>

        <Rest
          heroRef={heroRef}
          on={asking}
          inputId="ent-input"
          text={text}
          setText={setText}
          onSubmit={submit}
          onFocus={() => { if (!asking) skip(); }}
          paths={paths}
          onAsk={onAsk}
        />

        <button type="button" className={`ent__skip ${asking ? 'is-done' : ''}`} onClick={skip}>Skip</button>
      </div>
    </section>
  );
}
