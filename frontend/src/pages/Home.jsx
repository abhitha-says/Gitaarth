import { Link } from 'react-router-dom';
import './Home.css';

export default function Home() {
  return (
    <main className="home">
      {/* ── Background Effects ── */}
      <div className="bg-effects" aria-hidden="true">
        {/* Glow orbs */}
        <div className="bg-glow bg-glow--1" />
        <div className="bg-glow bg-glow--2" />
        <div className="bg-glow bg-glow--3" />
        <div className="bg-glow bg-glow--4" />
        <div className="bg-glow bg-glow--5" />
        <div className="bg-glow bg-glow--6" />
        <div className="bg-glow bg-glow--7" />

        {/* Atmospheric fog */}
        <div className="bg-fog bg-fog--1" />
        <div className="bg-fog bg-fog--2" />
        <div className="bg-fog bg-fog--3" />

        {/* Divine haze */}
        <div className="bg-haze" />

        {/* Gold particles */}
        {Array.from({ length: 16 }).map((_, i) => (
          <span
            key={`g${i}`}
            className="bg-particle bg-particle--gold"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 14}s`,
              animationDuration: `${8 + Math.random() * 10}s`,
              width: `${1.5 + Math.random() * 2}px`,
              height: `${1.5 + Math.random() * 2}px`,
            }}
          />
        ))}
        {/* White sparkles */}
        {Array.from({ length: 10 }).map((_, i) => (
          <span
            key={`w${i}`}
            className="bg-particle bg-particle--white"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 16}s`,
              animationDuration: `${10 + Math.random() * 12}s`,
              width: `${1 + Math.random() * 1.5}px`,
              height: `${1 + Math.random() * 1.5}px`,
            }}
          />
        ))}
        {/* Shimmer motes */}
        {Array.from({ length: 8 }).map((_, i) => (
          <span
            key={`s${i}`}
            className="bg-particle bg-particle--shimmer"
            style={{
              left: `${40 + Math.random() * 50}%`,
              top: `${10 + Math.random() * 60}%`,
              animationDelay: `${Math.random() * 10}s`,
              animationDuration: `${5 + Math.random() * 8}s`,
              width: `${2.5 + Math.random() * 3}px`,
              height: `${2.5 + Math.random() * 3}px`,
            }}
          />
        ))}
      </div>

      {/* ══════════════════════════════════════════
          HERO
      ══════════════════════════════════════════ */}
      <section className="hero" id="hero-section">
        <div className="hero__wrap">
          {/* ── Left ── */}
          <div className="hero__left">
            <div className="hero__badge">
              <span className="hero__badge-icon">✦</span>
              <span className="hero__badge-text">Guided by Ancient Wisdom</span>
            </div>

            <h1 className="hero__heading">
              Every soul faces<br />
              a <span className="hero__heading-gold">Kurukshetra.</span>
            </h1>

            <p className="hero__sub">
              When life becomes a battlefield…<br />
              Seek guidance from those who walked before you.
            </p>

            <div className="hero__search-box">
              <span className="hero__search-sparkle">✦</span>
              <input
                className="hero__search-field"
                type="text"
                placeholder="What burdens your heart today, Paarth?"
                readOnly
                onClick={() => (window.location.href = '/chat')}
              />
              <button
                className="hero__search-go"
                onClick={() => (window.location.href = '/chat')}
                aria-label="Seek Guidance"
              >
                <span className="material-symbols-outlined">arrow_forward</span>
              </button>
            </div>

            <div className="hero__btns">
              <Link to="/chat" className="hero__btn hero__btn--primary">
                <span className="hero__btn-sparkle">✦</span>
                Seek Guidance
              </Link>
              <Link to="/library" className="hero__btn hero__btn--ghost">
                <span className="material-symbols-outlined">auto_stories</span>
                Explore Scriptures
              </Link>
            </div>

            <div className="hero__social">
              <div className="hero__avatars">
                <img className="hero__av" src="https://randomuser.me/api/portraits/women/44.jpg" alt="Seeker" />
                <img className="hero__av" src="https://randomuser.me/api/portraits/men/32.jpg" alt="Seeker" />
                <img className="hero__av" src="https://randomuser.me/api/portraits/women/68.jpg" alt="Seeker" />
                <img className="hero__av" src="https://randomuser.me/api/portraits/men/75.jpg" alt="Seeker" />
                <img className="hero__av" src="https://randomuser.me/api/portraits/women/90.jpg" alt="Seeker" />
              </div>
              <span className="hero__star">★</span>
              <span className="hero__trusted">Trusted by 10,000+ seekers</span>
            </div>
          </div>

          {/* ── Right ── */}
          <div className="hero__right">
            <div className="hero__visual">
              {/* Divine glow swirls */}
              <div className="hero__swirl hero__swirl--1" />
              <div className="hero__swirl hero__swirl--2" />
              <div className="hero__swirl hero__swirl--3" />
              <div className="hero__swirl hero__swirl--4" />
              <div className="hero__swirl hero__swirl--5" />
              <div className="hero__swirl hero__swirl--6" />

              {/* Light ribbons */}
              <div className="hero__ribbon hero__ribbon--1" />
              <div className="hero__ribbon hero__ribbon--2" />
              <div className="hero__ribbon hero__ribbon--3" />
              <div className="hero__ribbon hero__ribbon--4" />
              <div className="hero__ribbon hero__ribbon--5" />

              {/* Main artwork */}
              <img
                src="/gitaarth-hero-light.png"
                alt="Gitaarth AI — Lord Krishna and Lord Ram"
                className="hero__img"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          FEATURE CARDS
      ══════════════════════════════════════════ */}
      <section className="cards-section" id="cards-section">
        <div className="cards__wrap">
          {/* 3 How-it-works cards */}
          <div className="cards__trio">
            {[
              { icon: 'chat_bubble_outline', title: 'Share Your Struggle', desc: 'Speak openly about what troubles your mind' },
              { icon: 'self_improvement', title: 'Receive Divine Guidance', desc: 'Get wisdom from Krishna & Ram with authentic scriptures' },
              { icon: 'trending_up', title: 'Reflect & Grow', desc: 'Save, reflect, and transform your inner Kurukshetra' },
            ].map((c, i) => (
              <div key={i} className="card-how">
                <div className="card-how__icon">
                  <span className="material-symbols-outlined">{c.icon}</span>
                </div>
                <h3 className="card-how__title">{c.title}</h3>
                <p className="card-how__desc">{c.desc}</p>
              </div>
            ))}
          </div>

          {/* Daily Wisdom card */}
          <div className="card-wisdom">
            <div className="card-wisdom__head">
              <div className="card-wisdom__head-left">
                <span className="card-wisdom__dot">✦</span>
                <span className="card-wisdom__label">Today's Wisdom</span>
              </div>
              <Link to="/library" className="card-wisdom__link">
                View all <span className="material-symbols-outlined">arrow_forward</span>
              </Link>
            </div>
            <p className="card-wisdom__sanskrit">
              कर्मण्येवाधिकारस्ते मा फलेषु कदाचन ।
            </p>
            <div className="card-wisdom__body">
              <p className="card-wisdom__trans">
                You have the right to perform your duty, but never to the fruits of action.
              </p>
              <button className="card-wisdom__bookmark" aria-label="Bookmark">
                <span className="material-symbols-outlined">bookmark</span>
              </button>
            </div>
            <div className="card-wisdom__foot">
              <div className="card-wisdom__ref">
                <span className="card-wisdom__ref-dot">✦</span>
                Bhagavad Gita 2.47
              </div>
              <button className="card-wisdom__share" aria-label="Share">
                <span className="material-symbols-outlined">content_copy</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="site-footer">
        <div className="site-footer__inner">
          <span className="site-footer__brand">Gitaarth AI</span>
          <span className="site-footer__copy">Ancient wisdom, modern clarity. © 2024</span>
        </div>
      </footer>
    </main>
  );
}
