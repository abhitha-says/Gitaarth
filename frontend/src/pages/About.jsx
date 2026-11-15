import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Morning from '../components/Morning';
import VersePlate from '../components/VersePlate';
import { LotusMark, Ornament } from '../components/Marks';
import { useArrive } from '../components/sanctuary/useArrive';
import LivingImage from '../scene/LivingImage';
import { art } from '../scene/art';
import { useVeil } from '../context/VeilContext';
import { findVerse, toDevanagari } from '../utils/verses';
import { HELPLINE } from '../utils/constants';
import './About.css';

const PRINCIPLES = [
  { title: 'A companion, not a preacher', body: 'Krishna sat beside Arjuna as his charioteer and friend. Gitaarth speaks with you, never down to you.' },
  { title: 'Dialogue, not lecture', body: 'Guidance grows out of conversation. Gitaarth listens to what you actually said, asks when it needs to, and answers your situation, not a generic one.' },
  { title: 'Clarity, not dependence', body: 'Krishna did not fight Arjuna’s battle. Gitaarth tries to help you see your own way, then steps back.' },
  { title: 'Honest about what it is', body: 'It is an AI. It does not claim to be God, to know your future, or to replace the people and professionals in your life.' },
  { title: 'Faithful to the text', body: 'Verses come from a curated collection of the Gita. When none truly fits, it offers guidance without inventing a reference.' },
  { title: 'Open to every seeker', body: 'No paywall and no forced sign-up. Anyone can begin, in English or Hinglish, whenever they need to.' },
];

const SHAPE = [
  'Understanding your situation',
  'A perspective inspired by the Gita',
  'A verse, when one truly fits',
  'Its meaning, in plain words',
  'One small step you can take',
];

const CREATORS = [{ name: 'Abhitha', role: 'Creator' }, { name: 'Chirag', role: 'Co-creator' }];

/**
 * At most two pictures. The painted moment of the Gita, when it exists, stands
 * alone; until then Arjuna kneels beside the story and Krishna stands beside
 * the promises (both are low-resolution stand-ins, so they are kept small and hazed).
 */
function pictures() {
  if (art('gita-moment')) return { story: 'gita-moment', friend: null };
  const arjuna = art('arjuna-kneeling') ? 'arjuna-kneeling' : null;
  const krishna = art('krishna-standing') ? 'krishna-standing' : null;
  if (arjuna) return { story: arjuna, friend: krishna };
  return { story: krishna, friend: null };
}

const ALT = {
  'gita-moment': 'Krishna speaking to Arjuna beside the chariot on the field of Kurukshetra',
  'arjuna-kneeling': 'Arjuna kneeling on the field, his bow laid down',
  'krishna-standing': 'Krishna standing at ease in the morning light',
};

function Figure({ slot, still, className = '' }) {
  const entry = slot ? art(slot) : null;
  if (!entry) return null;
  return (
    <figure className={`about__fig ${className}`} style={{ '--ar': entry.w / entry.h }}>
      <LivingImage slot={slot} alt={ALT[slot] || ''} live={!still} haze={entry.standIn ? 0.25 : 0.15} />
    </figure>
  );
}

export default function About() {
  const enter = useVeil();
  const gita247 = findVerse(2, 47);
  const { story, friend } = pictures();
  const [openRef, openClass, still] = useArrive();
  const [storyRef, storyClass] = useArrive();
  const [promRef, promClass] = useArrive();
  const [shapeRef, shapeClass] = useArrive();
  const [byRef, byClass] = useArrive();
  const [endRef, endClass] = useArrive();

  return (
    <main id="main" className={`page about${still ? ' is-still' : ''}`}>
      <Morning />

      <article className="about__read">
        <header ref={openRef} className={`about__open ${openClass}`}>
          <p className="eyebrow" style={{ '--i': 0 }}>About Gitaarth</p>
          <h1 className={`display about__title ${openClass}`}>
            <span className="about__line" style={{ '--i': 1 }}>Every Arjuna</span>
            <span className="about__line" style={{ '--i': 2 }}>deserves a moment</span>
            <span className="about__line" style={{ '--i': 3 }}>of <em>clarity.</em></span>
          </h1>
          <p className="about__lead" style={{ '--i': 4 }}>
            Gitaarth means the meaning of the Gita. It is a digital companion for the moments when
            life leaves you with a question you cannot answer alone.
          </p>
        </header>

        <section className={`about__story${story ? ' has-fig' : ''}`} aria-labelledby="why-title">
          <Figure slot={story} still={still} className="about__fig--story" />
          <div ref={storyRef} className={`about__col ${storyClass}`}>
            <p className="eyebrow" style={{ '--i': 0 }}>Why it exists</p>
            <h2 id="why-title" className="display about__h2" style={{ '--i': 1 }}>
              When clarity is hard to find, people look <em>upward.</em>
            </h2>
            <div className="about__prose" style={{ '--i': 2 }}>
              <p className="about__first">
                On a field at Kurukshetra, before anything had begun, a man let his bow slip from his
                hands. Arjuna could not go on. His friend Krishna, who held the reins of his chariot,
                did not command him and did not turn away. He stayed beside him, and spoke.
              </p>
              <p>
                Career decisions, relationships, family, fear of failure, loneliness, grief, the
                question of what is right. Everyone meets dilemmas like these, and many of us turn
                towards God when we cannot find clarity anywhere else.
              </p>
              <p>
                God may not appear before us to solve our problems. But the teachings Krishna gave
                Arjuna can offer the wisdom, perspective, courage and strength to face them.
              </p>
              <p>
                Gitaarth brings those teachings into a quiet conversation. You may not leave with
                every problem solved. We hope you leave a little stronger, calmer, and less alone.
              </p>
            </div>
          </div>
        </section>

        {gita247 && (
          <section className="about__verse" aria-label="Bhagavad Gita 2.47">
            <VersePlate verse={gita247} size="lg" />
          </section>
        )}

        <section className={`about__promises${friend ? ' has-fig' : ''}`} aria-labelledby="promise-title">
          <div ref={promRef} className={`about__col ${promClass}`}>
            <p className="eyebrow" style={{ '--i': 0 }}>What it stands for</p>
            <h2 id="promise-title" className="display about__h2" style={{ '--i': 1 }}>Six quiet <em>promises.</em></h2>
            <ol className="promises" style={{ '--i': 2 }}>
              {PRINCIPLES.map((p, i) => (
                <li key={p.title} className="promise">
                  <span className="promise__num sanskrit" aria-hidden="true">{toDevanagari(i + 1)}</span>
                  <h3 className="promise__title">{p.title}</h3>
                  <p className="promise__body">{p.body}</p>
                </li>
              ))}
            </ol>
          </div>
          <Figure slot={friend} still={still} className="about__fig--friend" />
        </section>

        <section className="about__shape" aria-labelledby="shape-title">
          <div ref={shapeRef} className={`about__col ${shapeClass}`}>
            <p className="eyebrow" style={{ '--i': 0 }}>How guidance is shaped</p>
            <h2 id="shape-title" className="display about__h2" style={{ '--i': 1 }}>Not a script, but a <em>shape.</em></h2>
            <p className="about__prose" style={{ '--i': 2 }}>
              When the moment calls for it, a reply may move through these steps. Many replies are
              simpler: a few honest sentences, or a single question back to you. Gitaarth is built
              to answer you, not to fill a template.
            </p>
            <ol className="steps" style={{ '--i': 3 }}>
              {SHAPE.map((s, i) => (
                <li key={s} className="steps__step">
                  <span className="steps__n" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                  <span>{s}</span>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="about__by" aria-labelledby="by-title">
          <div ref={byRef} className={`about__col ${byClass}`}>
            <Ornament className="about__orn" />
            <p className="eyebrow" style={{ '--i': 1 }}>Made with devotion</p>
            <h2 id="by-title" className="display about__h2 about__h2--small" style={{ '--i': 2 }}>Built by</h2>
            <ul className="makers" style={{ '--i': 3 }}>
              {CREATORS.map((c) => (
                <li key={c.name} className="maker">
                  <span className="maker__name">{c.name}</span>
                  <span className="maker__role">{c.role}</span>
                </li>
              ))}
            </ul>
            <aside className="care" style={{ '--i': 4 }} aria-label="A note on care">
              <LotusMark size={22} className="care__mark" />
              <p>
                Gitaarth is not a substitute for medical, legal, financial or mental-health care. If
                you are in crisis in India, call {HELPLINE.name} at <a href={HELPLINE.tel}>{HELPLINE.number}</a>.
              </p>
            </aside>
          </div>
        </section>

        <section ref={endRef} className={`about__end ${endClass}`} aria-labelledby="end-title">
          <h2 id="end-title" className="display about__h2" style={{ '--i': 0 }}>
            Whatever you are carrying, you may set it down <em>here.</em>
          </h2>
          <div className="about__actions" style={{ '--i': 1 }}>
            <a href="/chat" className="btn btn--gold" onClick={(e) => { e.preventDefault(); enter('/chat', e); }}>
              Seek Guidance <ArrowRight aria-hidden="true" />
            </a>
            <Link to="/library" className="link-arrow">Explore the Bhagavad Gita <ArrowRight aria-hidden="true" /></Link>
          </div>
        </section>
      </article>
    </main>
  );
}
