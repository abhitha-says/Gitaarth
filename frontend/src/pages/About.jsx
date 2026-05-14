import { Link } from 'react-router-dom';
import './About.css';

const PRINCIPLES = [
  {
    icon: 'handshake',
    title: 'Companion, Not Preacher',
    desc: 'Like Krishna sat beside Arjun as a friend — Gitaarth walks with you through your struggles, never talks down to you.',
  },
  {
    icon: 'menu_book',
    title: 'Authentic Scripture Only',
    desc: 'Every shloka and teaching is real, verified, and sourced from the Bhagavad Gita and Ramayana — never AI-generated or hallucinated.',
  },
  {
    icon: 'forum',
    title: 'Dialogue, Not Lecture',
    desc: 'Real guidance happens through conversation. Gitaarth asks, listens, understands — then responds with wisdom tailored to your situation.',
  },
  {
    icon: 'self_improvement',
    title: 'Courage Over Solutions',
    desc: "Krishna didn't fight Arjun's battle — he gave him the clarity to fight it himself. Gitaarth empowers you, never creates dependency.",
  },
  {
    icon: 'language',
    title: 'Wisdom Without Barriers',
    desc: 'Whether you speak English, Hindi, or Hinglish — divine guidance should be accessible to every soul, in every language.',
  },
  {
    icon: 'lock_open',
    title: 'Open to Every Seeker',
    desc: 'No paywalls, no forced signups. Anyone can seek guidance. Sign in only if you want to save your journey.',
  },
];

const CREATORS = [
  {
    name: 'Abhitha',
    role: 'Creator',
    image: null, // placeholder — user will add later
  },
  {
    name: 'Chirag',
    role: 'Co-Creator',
    image: null, // placeholder — user will add later
  },
];

export default function About() {
  return (
    <main className="about">
      {/* ── Background Effects ── */}
      <div className="about-bg" aria-hidden="true">
        <div className="about-bg__glow about-bg__glow--1" />
        <div className="about-bg__glow about-bg__glow--2" />
        <div className="about-bg__glow about-bg__glow--3" />
        {Array.from({ length: 12 }).map((_, i) => (
          <span
            key={i}
            className="about-bg__particle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 12}s`,
              animationDuration: `${8 + Math.random() * 10}s`,
              width: `${1.5 + Math.random() * 2}px`,
              height: `${1.5 + Math.random() * 2}px`,
            }}
          />
        ))}
      </div>

      {/* ══════════════════════════════════════════
          HERO — The Origin Story
      ══════════════════════════════════════════ */}
      <section className="about-hero" id="about-hero">
        <div className="about-hero__inner">
          <div className="about-hero__badge">
            <span className="about-hero__badge-icon">✦</span>
            <span className="about-hero__badge-text">Our Story</span>
          </div>

          <h1 className="about-hero__heading">
            Every Arjun deserves<br />
            a <span className="about-hero__gold">Krishna.</span>
          </h1>

          <p className="about-hero__sub">
            In the Mahabharata, when Arjun stood paralyzed on the battlefield of
            Kurukshetra — confused, afraid, and overwhelmed — Krishna didn't fight
            his battle for him. He sat beside him as his charioteer, his companion,
            his friend, and guided him with wisdom until Arjun found the strength
            to face his own war.
          </p>

          <div className="about-hero__divider">
            <span className="about-hero__divider-dot">✦</span>
          </div>

          <p className="about-hero__statement">
            <strong>Gitaarth AI is that Krishna for the modern world.</strong>
          </p>

          <p className="about-hero__body">
            Today, people face their own Kurukshetras — anxiety, career confusion,
            heartbreak, existential doubt, family conflicts, and the chaos of modern
            life. Gitaarth AI sits beside them as a <em>companion</em>, not a lecturer.
            It engages in a warm, back-and-forth conversation using the authentic
            teachings of Lord Krishna (Bhagavad Gita) and Lord Ram (Ramayana),
            weaving real scripture naturally into its guidance.
          </p>

          <p className="about-hero__body">
            The chatbot doesn't just throw quotes — it <em>walks with you</em> through
            your problem, asks follow-up questions, understands your context, and
            responds with the same patience and wisdom that Krishna showed Arjun
            across 18 chapters of the Gita. The goal is to make you feel like you
            have a <strong>divine friend</strong> who truly listens and truly cares.
          </p>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          QUOTE BREAK
      ══════════════════════════════════════════ */}
      <section className="about-quote" id="about-quote">
        <div className="about-quote__inner">
          <blockquote className="about-quote__block">
            <p className="about-quote__sanskrit">
              कर्मण्येवाधिकारस्ते मा फलेषु कदाचन।
            </p>
            <p className="about-quote__translation">
              "You have the right to perform your duty, but you are not entitled
              to the fruits of your actions."
            </p>
            <cite className="about-quote__cite">
              <span className="about-quote__cite-dot">✦</span>
              Bhagavad Gita — Chapter 2, Verse 47
            </cite>
          </blockquote>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          PRINCIPLES
      ══════════════════════════════════════════ */}
      <section className="about-principles" id="about-principles">
        <div className="about-principles__inner">
          <div className="about-principles__header">
            <span className="about-principles__label">✦ Our Principles</span>
            <h2 className="about-principles__heading">
              What Gitaarth<br />
              <span className="about-principles__gold">stands for.</span>
            </h2>
            <p className="about-principles__sub">
              Every design decision, every line of code, every conversation is
              guided by the same values Krishna embodied as Arjun's companion.
            </p>
          </div>

          <div className="about-principles__grid">
            {PRINCIPLES.map((p, i) => (
              <div key={i} className="principle-card" id={`principle-${i}`}>
                <div className="principle-card__icon">
                  <span className="material-symbols-outlined">{p.icon}</span>
                </div>
                <h3 className="principle-card__title">{p.title}</h3>
                <p className="principle-card__desc">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          THE SOUL — Krishna↔Arjun Mapping
      ══════════════════════════════════════════ */}
      <section className="about-soul" id="about-soul">
        <div className="about-soul__inner">
          <span className="about-soul__label">✦ The Soul of Gitaarth</span>
          <h2 className="about-soul__heading">
            Rooted in the <span className="about-soul__gold">Krishna–Arjun</span> bond.
          </h2>

          <div className="about-soul__table-wrap">
            <table className="about-soul__table">
              <thead>
                <tr>
                  <th>Krishna was to Arjun…</th>
                  <th>Gitaarth AI is to you…</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>A <strong>charioteer</strong> — sat beside him, not above him</td>
                  <td>A <strong>companion</strong> — talks <em>with</em> you, not <em>at</em> you</td>
                </tr>
                <tr>
                  <td>A <strong>friend</strong> (Sakha) — spoke with love, not authority</td>
                  <td>A <strong>warm presence</strong> — empathetic, never preachy</td>
                </tr>
                <tr>
                  <td>A <strong>guide</strong> — showed the path but let Arjun choose</td>
                  <td>A <strong>counselor</strong> — offers wisdom, never forces decisions</td>
                </tr>
                <tr>
                  <td><strong>Patient</strong> — answered every doubt across 18 chapters</td>
                  <td><strong>Conversational</strong> — follows up, clarifies, goes deeper</td>
                </tr>
                <tr>
                  <td><strong>Honest</strong> — told hard truths when needed</td>
                  <td><strong>Authentic</strong> — uses only real, verified scripture</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          CTA
      ══════════════════════════════════════════ */}
      <section className="about-cta" id="about-cta">
        <div className="about-cta__inner">
          <h2 className="about-cta__heading">
            Your Kurukshetra awaits.<br />
            <span className="about-cta__gold">Your Krishna is here.</span>
          </h2>
          <p className="about-cta__sub">
            Whatever battle you're facing — speak openly. Gitaarth is listening.
          </p>
          <Link to="/chat" className="about-cta__btn">
            <span className="about-cta__btn-sparkle">✦</span>
            Seek Divine Guidance
          </Link>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          CREATORS
      ══════════════════════════════════════════ */}
      <section className="about-creators" id="about-creators">
        <div className="about-creators__inner">
          <span className="about-creators__label">✦ Made with Devotion</span>
          <h2 className="about-creators__heading">
            Built by
          </h2>

          <div className="about-creators__cards">
            {CREATORS.map((c, i) => (
              <button
                key={i}
                className="creator-card"
                id={`creator-${c.name.toLowerCase()}`}
                type="button"
              >
                <div className="creator-card__img-wrap">
                  {c.image ? (
                    <img
                      src={c.image}
                      alt={c.name}
                      className="creator-card__img"
                    />
                  ) : (
                    <div className="creator-card__placeholder">
                      <span className="material-symbols-outlined">person</span>
                    </div>
                  )}
                </div>
                <h3 className="creator-card__name">{c.name}</h3>
                <span className="creator-card__role">{c.role}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="site-footer">
        <div className="site-footer__inner">
          <span className="site-footer__brand">Gitaarth AI</span>
          <span className="site-footer__copy">
            Ancient wisdom, modern clarity. © 2024
          </span>
        </div>
      </footer>
    </main>
  );
}
