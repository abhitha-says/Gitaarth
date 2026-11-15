import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { motion, useMotionTemplate, useMotionValueEvent, useScroll, useSpring, useTransform } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import LivingImage from './LivingImage';
import Mist from './Mist';
import Dust from './Dust';
import Grass from './Grass';
import { art } from './art';
import { setSun } from './sun';
import './scene.css';
import './Journey.css';

/**
 * The walk to Krishna. One pinned stage; the page's own scroll is the camera
 * and the height of the sun. Scenery is scrubbed by scroll, words are not:
 * they arrive at reading pace once their moment has come.
 *
 *   mist → first light → Arjuna's question → the approach (feet, silk, face)
 *   → darshan (18.66 written in the air) → "What rests on your heart today?"
 */
const MARK = { mist: 0, light: 0.1, question: 0.28, approach: 0.44, face: 0.64, darshan: 0.74, speak: 0.89 };
const STOPS = Object.values(MARK);
const beatAt = (v) => {
  let b = 0;
  for (let i = 0; i < STOPS.length; i += 1) if (v >= STOPS[i]) b = i;
  return b;
};

const VERSE = {
  lines: ['सर्वधर्मान्परित्यज्य मामेकं शरणं व्रज ।', 'अहं त्वां सर्वपापेभ्यो मोक्षयिष्यामि मा शुचः ॥'],
  meaning: 'Set down every burden and come to me alone. I will free you from all that weighs on you. Do not grieve.',
  ref: 'Bhagavad Gita 18.66',
};

function useWide() {
  const query = '(min-width: 900px) and (min-aspect-ratio: 1/1)';
  const [wide, setWide] = useState(() => window.matchMedia(query).matches);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const on = () => setWide(mq.matches);
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);
  return wide;
}

function Plate() {
  const wide = art('field-dawn-wide');
  const tall = art('field-dawn-tall');
  if (!wide && !tall) return <div className="j-plate__bare" />;
  return (
    <picture>
      {tall && wide && <source media="(max-aspect-ratio: 4/5)" srcSet={tall.src} />}
      <img src={(wide || tall).src} alt="" decoding="async" fetchPriority="high" />
    </picture>
  );
}

function Caption({ on, className = '', children }) {
  return <div className={`j-cap arrive ${on ? 'is-on' : ''} ${className}`}>{children}</div>;
}

export default function Journey({ tier, paths, question, onAsk }) {
  const full = tier === 'full';
  const wide = useWide();
  const ref = useRef(null);
  const askRef = useRef(null);
  const [beat, setBeat] = useState(0);
  const [awake, setAwake] = useState(false);
  const [text, setText] = useState('');
  const [typing, setTyping] = useState(false);
  const [caret, setCaret] = useState({ x: 0, y: 0 });

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  const p = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.5, restDelta: 0.0005 });

  useMotionValueEvent(p, 'change', (v) => {
    setSun((v - 0.06) / 0.8);
    const b = beatAt(v);
    setBeat((prev) => (prev === b ? prev : b));
  });
  useEffect(() => {
    setSun(0);
    const id = requestAnimationFrame(() => setAwake(true));
    return () => cancelAnimationFrame(id);
  }, []);

  // Where the visitor's light comes to rest: the start of the question box.
  useLayoutEffect(() => {
    const measure = () => {
      const stage = ref.current?.querySelector('.j-stage');
      const box = askRef.current;
      if (!stage || !box) return;
      const s = stage.getBoundingClientRect();
      const r = box.getBoundingClientRect();
      setCaret({ x: r.left - s.left + 42 - s.width / 2, y: r.top - s.top + r.height / 2 - s.height * 0.9 });
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [wide, beat >= 6]); // eslint-disable-line react-hooks/exhaustive-deps

  const t = (input, output) => useTransform(p, input, output); // eslint-disable-line react-hooks/rules-of-hooks

  // The land and the light
  const plateO = t([0.05, 0.26, 0.72, 0.9], [0, 1, 1, 0.5]);
  const plateS = t([0, 1], [1.14, 1.02]);
  const plateY = t([0.44, 0.72], ['0%', '5%']);
  // The one sun climbs on the left, then the camera turns until it stands
  // directly behind his head: the only halo he is given is the morning.
  const sunX = t([0.06, 0.44, 0.66, 0.74, 0.8], ['-28vw', '-24vw', '0vw', '0vw', wide ? '-21vw' : '0vw']);
  const sunY = t([0.06, 0.44, 0.66, 0.74, 0.8], ['14svh', '-12svh', '-15svh', '-15svh', wide ? '-16svh' : '-27svh']);
  const sunO = t([0.04, 0.2, 0.9, 1], [0, 1, 1, 0.8]);
  const veilO = t([0, 0.07, 0.24, 0.5, 0.528, 0.555], [1, 0.9, 0, 0, 0.55, 0]);
  // Before the face, the camera looks into the sun for a breath: a whiteout of warm light, not a cut.
  const flareO = t([0.598, 0.624, 0.652], [0, 0.92, 0]);
  const mistO = t([0, 0.26, 0.44, 0.74, 1], [1, 0.75, 0.95, 0.6, 0.5]);
  const grassO = t([0.2, 0.3, 0.52, 0.56], [0, 1, 1, 0]);
  const grassY = t([0.44, 0.56], ['0%', '90%']);

  // Arjuna, from behind
  const arjO = t([0.28, 0.33, 0.41, 0.455], [0, 1, 1, 0]);
  const arjH = t([0.28, 0.35], [0.9, 0.3]);
  const arjS = t([0.28, 0.455], [0.96, 1.05]);

  // Krishna, by degrees. The camera rises, so each picture sinks as it passes.
  const feetO = t([0.445, 0.475, 0.505, 0.535], [0, 1, 1, 0]);
  const feetH = t([0.445, 0.485, 0.505, 0.535], [1, 0.04, 0.04, 0.9]);
  const feetY = t([0.445, 0.535], ['-3svh', '11svh']);
  const feetS = t([0.445, 0.535], [1, 1.07]);
  const bodyO = t([0.525, 0.555, 0.6, 0.628], [0, 1, 1, 0]);
  const bodyH = t([0.525, 0.56, 0.6, 0.628], [1, 0.06, 0.06, 0.9]);
  const bodyY = t([0.525, 0.628], ['-60svh', '-32svh']);
  const faceO = t([0.615, 0.665], [0, 1]);
  const closedO = t([0.675, 0.705], [1, 0]); // his eyes open as he turns to you

  // Each picture arrives out of focus and the lens finds it (full tier only)
  const feetB = t([0.445, 0.49], [9, 0]);
  const bodyB = t([0.525, 0.565], [9, 0]);
  const faceB = t([0.615, 0.675], [12, 0]);
  const feetF = useMotionTemplate`blur(${feetB}px)`;
  const bodyF = useMotionTemplate`blur(${bodyB}px)`;
  const faceF = useMotionTemplate`blur(${faceB}px)`;
  const focus = (f) => (full ? f : undefined);
  const closed = art('krishna-face-closed');
  const bodySlot = art('krishna-hands') ? 'krishna-hands' : 'krishna-standing';
  const faceH = t([0.615, 0.69, 0.89, 0.96], [1, 0, 0, 0.32]);
  const faceY = t([0.615, 0.7, 0.74, 0.8], wide ? ['5svh', '0svh', '0svh', '0svh'] : ['5svh', '0svh', '0svh', '-3svh']);
  const faceX = t([0.74, 0.8], wide ? ['0vw', '-21vw'] : ['0vw', '0vw']);
  const faceS = t([0.615, 0.7, 0.74, 0.8], wide ? [1.06, 1, 1, 0.94] : [1.06, 1, 1, 0.6]);
  const light = t([0.44, 0.7], [0.35, 1]);
  const lift = t([0.44, 0.74], [0.5, -0.2]);

  const seekerO = t([0, 0.015], [0, 1]);

  const skip = () => {
    const el = ref.current;
    if (!el) return;
    window.scrollTo({ top: el.offsetTop + el.offsetHeight - window.innerHeight, behavior: 'smooth' });
  };
  const submit = (e) => {
    e.preventDefault();
    onAsk(e, text.trim());
  };

  const near = (from, to) => beat >= from && beat <= to;
  const settled = beat >= 6;

  return (
    <section ref={ref} className={`journey journey--${tier} ${awake ? 'is-awake' : ''}`} aria-label="A morning at Kurukshetra">
      <div className="j-stage">
        <motion.div className="j-layer j-plate" style={{ opacity: plateO, scale: plateS, y: plateY }}><Plate /></motion.div>
        <motion.div className="j-layer j-sun" style={{ opacity: sunO, x: sunX, y: sunY }} />
        <motion.div className="j-layer j-veil" style={{ opacity: veilO }} />
        <motion.div className="j-layer j-flare" style={{ opacity: flareO, x: sunX, y: sunY }} />
        <motion.div className="j-layer" style={{ opacity: mistO }}><Mist bands={full ? 3 : 2} /></motion.div>

        <motion.div className="j-layer j-fig j-fig--arjuna" style={{ opacity: arjO, scale: arjS }}>
          <LivingImage slot="arjuna-kneeling" live={full} active={near(1, 3)} haze={arjH} light={light} wind={0.003} />
        </motion.div>
        <motion.div className="j-layer j-fig j-fig--feet" style={{ opacity: feetO, y: feetY, scale: feetS, filter: focus(feetF) }}>
          <LivingImage slot="krishna-feet" live active={near(3, 3)} haze={feetH} light={light} lift={lift} />
        </motion.div>
        <div className="j-layer j-veil-top">
          <motion.div className="j-layer j-fig j-fig--body" style={{ opacity: bodyO, y: bodyY, filter: focus(bodyF) }}>
            <LivingImage slot={bodySlot} live={full} active={near(3, 4)} haze={bodyH} light={light} wind={0.0028} />
          </motion.div>
        </div>
        <motion.div className="j-layer j-fig j-fig--face" style={{ opacity: faceO, x: faceX, y: faceY, scale: faceS, filter: focus(faceF) }}>
          <span className="j-face">
            <LivingImage slot="krishna-face" live active={beat >= 3} haze={faceH} light={light} wind={0.002} depth={0.012} alt="Shri Krishna, smiling gently" />
            {closed && (
              <motion.span className="j-face__closed" style={{ opacity: closedO }}>
                <LivingImage slot="krishna-face-closed" live={false} haze={faceH} />
              </motion.span>
            )}
          </span>
        </motion.div>

        <motion.div className="j-layer j-grass" style={{ opacity: grassO, y: grassY }}><Grass /></motion.div>
        {full && <Dust className="j-dust" />}

        <Caption on={awake && beat === 0} className="j-cap--title">
          <h1 className="j-title display">
            <span style={{ '--i': 0 }}>Some answers</span>
            <span style={{ '--i': 4 }}>are not found.</span>
            <span style={{ '--i': 12 }}><em>They are understood.</em></span>
          </h1>
        </Caption>
        <Caption on={beat === 1} className="j-cap--low">
          <p className="j-line" style={{ '--i': 0 }}>Before the Gita was a book,</p>
          <p className="j-line" style={{ '--i': 9 }}><em>it was a morning.</em></p>
        </Caption>
        <Caption on={beat === 2} className="j-cap--low j-cap--quote">
          <p className="j-quote" style={{ '--i': 0 }}>“{question.text}”</p>
          <p className="j-ref" style={{ '--i': 10 }}>{question.ref}</p>
          <p className="j-line" style={{ '--i': 28 }}>So he turned, and he asked.</p>
        </Caption>
        <Caption on={beat === 4} className="j-cap--low j-cap--smile">
          <p className="j-line" style={{ '--i': 6 }}>And Krishna <em>smiled.</em></p>
        </Caption>
        <Caption on={beat === 5} className="j-cap--verse">
          <p className="j-verse sanskrit" lang="sa" style={{ '--i': 0 }}>
            {VERSE.lines.map((line, i) => <span key={line} style={{ '--n': i }}>{line}</span>)}
          </p>
          <p className="j-meaning" style={{ '--i': 34 }}>{VERSE.meaning}</p>
          <p className="j-ref" style={{ '--i': 42 }}>{VERSE.ref}</p>
        </Caption>

        <div className={`j-ask arrive ${settled ? 'is-on' : ''}`}>
          <h2 className="j-ask__q display" style={{ '--i': 0 }}>What rests on your heart <em>today?</em></h2>
          <form className="j-ask__form" style={{ '--i': 5 }} onSubmit={submit}>
            <label className="sr-only" htmlFor="j-ask-input">Write what is on your heart</label>
            <div className="j-ask__box" ref={askRef}>
              <input
                id="j-ask-input"
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                onFocus={() => { setTyping(true); if (!settled) skip(); }}
                onBlur={() => setTyping(false)}
                placeholder="Say it as you would to a friend"
                autoComplete="off"
                enterKeyHint="go"
                maxLength={600}
              />
              <button type="submit" className="j-ask__go" aria-label="Seek guidance"><ArrowRight aria-hidden="true" /></button>
            </div>
          </form>
          <ul className="j-ask__paths" style={{ '--i': 9 }}>
            {paths.map((path) => (
              <li key={path.label}>
                <button type="button" onClick={(e) => onAsk(e, path.prompt)}>{path.label}</button>
              </li>
            ))}
          </ul>
          <p className="j-ask__note" style={{ '--i': 12 }}>Free · No sign-up needed · English &amp; Hinglish</p>
        </div>

        <motion.div className="j-seeker" style={{ opacity: seekerO }} aria-hidden="true">
          <span
            className={`j-seeker__light ${settled ? 'is-caret' : ''} ${typing || text ? 'is-gone' : ''}`}
            style={settled ? { transform: `translate3d(${caret.x}px, ${caret.y}px, 0)` } : undefined}
          />
        </motion.div>

        <div className={`j-foot ${beat === 0 && awake ? 'is-start' : ''} ${settled ? 'is-done' : ''}`}>
          <span className="j-foot__cue" aria-hidden="true">Walk into the morning</span>
          <button type="button" className="j-foot__skip" onClick={skip}>Skip to the question</button>
        </div>
      </div>
    </section>
  );
}
