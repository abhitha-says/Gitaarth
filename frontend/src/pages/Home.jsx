import { ArrowRight } from 'lucide-react';
import VersePlate from '../components/VersePlate';
import Reveal from '../components/Reveal';
import { LotusMark } from '../components/Marks';
import { useVeil } from '../context/VeilContext';
import { useState } from 'react';
import Entrance from '../entrance/Entrance';
import EntranceHero from '../entrance/EntranceHero';
import { hasEntered } from '../entrance/shots';
import { useTier } from '../scene/tier';
import { art } from '../scene/art';
import { verseOfTheDay, reflectPrompt, toDevanagari } from '../utils/verses';
import { HELPLINE } from '../utils/constants';
import './Home.css';

const STEPS = [
  {
    title: 'Share what weighs on you',
    body: 'Write the way you would speak to someone you trust. There is no right way to begin, and nothing is too small.',
  },
  {
    title: 'Receive a perspective',
    body: 'Gitaarth reflects on your situation through the teachings of the Gita, and shares a verse only when one truly fits.',
  },
  {
    title: 'Take one small step',
    body: 'Clarity rarely arrives all at once. You leave with something gentle and practical you can do today.',
  },
];

const PATHS = [
  { label: 'Career & purpose', note: 'When you cannot see which way to go', prompt: "I feel lost about my career and what I am meant to do. I don't know which path to choose." },
  { label: 'Fear of failure', note: 'When fear stops you from beginning', prompt: 'I am afraid of failing, and the fear is stopping me from even trying.' },
  { label: 'Relationships', note: 'When love has become confusing', prompt: "I am struggling in a relationship and I don't know whether to hold on or let go." },
  { label: 'Family & duty', note: 'When what you want and what is expected collide', prompt: 'There is a conflict between what I want and what my family expects of me.' },
  { label: 'Loneliness', note: 'When you feel alone, even among people', prompt: 'I have been feeling very alone lately, even around people.' },
  { label: 'Anxiety & unrest', note: 'When the mind will not be still', prompt: "My mind is restless and anxious, and I can't find peace." },
  { label: 'Grief & loss', note: 'When someone you love is gone', prompt: 'I lost someone close to me and the pain feels too heavy to carry.' },
  { label: 'Right & wrong', note: 'When every choice seems to cost something', prompt: "I am facing a decision where I can't tell what the right thing to do is." },
];

const HONEST = [
  {
    title: 'It is an AI',
    body: 'Gitaarth is software. Its words are not revelation, and it never claims to be Krishna. It offers reflections inspired by his teachings.',
  },
  {
    title: 'It draws on real verses',
    body: 'Verses come from a curated collection of the Bhagavad Gita. When none truly fits, it gives guidance without inventing a reference.',
  },
  {
    title: 'It is not a substitute for care',
    body: 'For medical, legal, financial or mental-health concerns, please also reach out to a qualified person who can help.',
  },
];

export default function Home() {
  const enter = useVeil();
  const tier = useTier();
  // The entrance plays on the first arrival of a visit; after that Home opens where it ended.
  const [intro, setIntro] = useState(() => tier !== 'still' && !hasEntered());
  const today = verseOfTheDay();
  const closing = art('gita-moment') || art('chariot-at-rest') || art('field-dawn-wide');
  const toChat = (e, topic) => {
    e.preventDefault();
    enter(topic ? `/chat?topic=${encodeURIComponent(topic)}&draft=1` : '/chat', e);
  };

  return (
    <main id="main" className="home">
      {intro
        ? <Entrance tier={tier} paths={PATHS} onAsk={toChat} />
        : <EntranceHero paths={PATHS} onAsk={toChat} onReplay={tier === 'still' ? undefined : () => { window.scrollTo(0, 0); setIntro(true); }} />}

      {/* ═══════════════ HOW: three quiet steps ═══════════════ */}
      <section className="section how" aria-labelledby="how-title">
        <div className="container">
          <div className="how__head">
            <Reveal><p className="eyebrow">A conversation, gently</p></Reveal>
            <Reveal delay={0.08}>
              <h2 id="how-title" className="display h2">Three quiet <em>steps.</em></h2>
            </Reveal>
          </div>

          <ol className="how__steps">
            {STEPS.map((s, i) => (
              <Reveal as="li" key={s.title} delay={0.1 + i * 0.12} className="how__step">
                <span className="how__num sanskrit" aria-hidden="true">{toDevanagari(i + 1)}</span>
                <h3 className="h3 how__title">{s.title}</h3>
                <p className="how__body">{s.body}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* ═══════════════ PATHS: what rests on your heart ═══════════════ */}
      <section className="section paths" aria-labelledby="paths-title">
        <div className="container paths__grid">
          <div className="paths__head">
            <Reveal><p className="eyebrow">Eight familiar places</p></Reveal>
            <Reveal delay={0.08}>
              <h2 id="paths-title" className="display h2">Begin from where <em>you are.</em></h2>
            </Reveal>
            <Reveal delay={0.16}>
              <p className="lead paths__lead">
                Choose what is closest to how you feel. Your conversation will begin there, in
                your own words, and you can change them before anything is sent.
              </p>
            </Reveal>
          </div>

          <ul className="paths__list">
            {PATHS.map((p, i) => (
              <Reveal as="li" key={p.label} delay={0.04 * i} y={16}>
                <a
                  href={`/chat?topic=${encodeURIComponent(p.prompt)}&draft=1`}
                  className="path"
                  onClick={(e) => toChat(e, p.prompt)}
                >
                  <span className="path__label">{p.label}</span>
                  <span className="path__note">{p.note}</span>
                  <ArrowRight className="path__arrow" aria-hidden="true" />
                </a>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* ═══════════════ VERSE OF THE DAY ═══════════════ */}
      {today && (
        <section className="section today" aria-labelledby="today-title">
          <div className="today__glow" aria-hidden="true" />
          <div className="container--narrow">
            <div className="today__head">
              <Reveal><p className="eyebrow eyebrow--center">Today&rsquo;s verse</p></Reveal>
              <Reveal delay={0.08}>
                <h2 id="today-title" className="display h2">A thought to carry <em>with you.</em></h2>
              </Reveal>
            </div>
            <Reveal delay={0.16}>
              <VersePlate
                verse={today}
                size="lg"
                actions
                onReflect={(e) => toChat(e, reflectPrompt(today))}
              />
            </Reveal>
          </div>
        </section>
      )}

      {/* ═══════════════ HONESTY ═══════════════ */}
      <section className="section honest" aria-labelledby="honest-title">
        <div className="container">
          <div className="honest__head">
            <Reveal><p className="eyebrow">Honestly described</p></Reveal>
            <Reveal delay={0.08}>
              <h2 id="honest-title" className="display h2">A companion, <em>not a deity.</em></h2>
            </Reveal>
          </div>
          <div className="honest__grid">
            {HONEST.map((h, i) => (
              <Reveal key={h.title} delay={0.1 + i * 0.1} className="honest__item">
                <LotusMark size={26} className="honest__mark" />
                <h3 className="h3">{h.title}</h3>
                <p>{h.body}</p>
              </Reveal>
            ))}
          </div>
          <Reveal delay={0.2}>
            <p className="honest__help">
              If you are in crisis in India, you can call {HELPLINE.name} at{' '}
              <a href={HELPLINE.tel}>{HELPLINE.number}</a>, free and available day and night.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ═══════════════ CLOSING ═══════════════ */}
      <section className="closing" aria-labelledby="closing-title">
        <div className="closing__image" aria-hidden="true">
          {closing && <img src={closing.src} alt="" loading="lazy" decoding="async" width={closing.w} height={closing.h} />}
        </div>
        <div className="container closing__inner">
          <Reveal>
            <h2 id="closing-title" className="display closing__title">
              When life leaves you with questions, let timeless wisdom guide you towards <em>clarity.</em>
            </h2>
          </Reveal>
          <Reveal delay={0.15}>
            <a href="/chat" className="btn btn--gold closing__cta" onClick={(e) => toChat(e)}>
              Seek Guidance
              <ArrowRight aria-hidden="true" />
            </a>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
