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
              <span className="hero__badge-icon">🪷</span>
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
              <span className="hero__search-sparkle">🪷</span>
              <input
                className="hero__search-field"
                type="text"
                placeholder="Hey Paarth..."
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
                <span className="hero__btn-sparkle">🪷</span>
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
                src="/gitaarth-hero-light-Photoroom.png"
                alt="Gitaarth AI — Ancient Wisdom for Modern Problems"
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
                <span className="card-wisdom__dot">🪷</span>
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
                <span className="card-wisdom__ref-dot">🪷</span>
                Bhagavad Gita 2.47
              </div>
              <button className="card-wisdom__share" aria-label="Share">
                <span className="material-symbols-outlined">content_copy</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          SCRIPTURE SHOWCASE
      ══════════════════════════════════════════ */}
      <section className="scripture-section" id="scripture-section">
        <div className="scripture__wrap">
          <div className="section-header">
            <span className="section-header__label">🪷 Sacred Sources</span>
            <h2 className="section-header__title">Wisdom from the Eternal Scriptures</h2>
            <p className="section-header__sub">
              Three timeless epics, one universal truth — guidance for every struggle, every soul.
            </p>
          </div>

          <div className="scripture__grid">
            {[
              {
                title: 'Bhagavad Gita',
                sanskrit: 'भगवद्गीता',
                chapters: '18 Chapters',
                verses: '700 Verses',
                desc: 'The divine song of Lord Krishna on the battlefield of Kurukshetra — the ultimate guide to duty, devotion, and self-realization.',
                img: '/icon-gita.png',
                accent: 'gold',
              },
              {
                title: 'Ramayana',
                sanskrit: 'रामायण',
                chapters: '7 Kandas',
                verses: '24,000 Verses',
                desc: 'The journey of Lord Rama — embodying dharma, sacrifice, and the triumph of righteousness over darkness.',
                img: '/image copy.png',
                accent: 'blue',
              },
              {
                title: 'Mahabharata',
                sanskrit: 'महाभारत',
                chapters: '18 Parvas',
                verses: '100,000 Verses',
                desc: 'The greatest epic of humanity — a tapestry of war, wisdom, love, and the eternal struggle between right and wrong.',
                img: '/image copy 2.png',
                accent: 'deep',
              },
            ].map((s, i) => (
              <div key={i} className={`scripture-card scripture-card--${s.accent}`}>
                <div className="scripture-card__glow" />
                <div className="scripture-card__icon">
                  <img src={s.img} alt={s.title} className="scripture-card__icon-img" />
                </div>
                <span className="scripture-card__sanskrit">{s.sanskrit}</span>
                <h3 className="scripture-card__title">{s.title}</h3>
                <p className="scripture-card__desc">{s.desc}</p>
                <div className="scripture-card__meta">
                  <span className="scripture-card__tag">{s.chapters}</span>
                  <span className="scripture-card__tag">{s.verses}</span>
                </div>
                <Link to="/library" className="scripture-card__link">
                  Explore <span className="material-symbols-outlined">arrow_forward</span>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          WISDOM PATHS / TOPICS
      ══════════════════════════════════════════ */}
      <section className="paths-section" id="paths-section">
        <div className="paths__wrap">
          <div className="section-header">
            <span className="section-header__label">🪷 Wisdom Paths</span>
            <h2 className="section-header__title">What Troubles Your Soul?</h2>
            <p className="section-header__sub">
              Select a path and receive personalized guidance drawn from ancient wisdom.
            </p>
          </div>

          <div className="paths__grid">
            {[
              { icon: 'psychology', label: 'Anxiety & Fear', color: '#8B5CF6', prompt: 'I am struggling with anxiety and fear. My mind feels restless and I cannot find peace. Please guide me with wisdom from the scriptures.' },
              { icon: 'favorite', label: 'Love & Relationships', color: '#EC4899', prompt: 'I am facing difficulties in my relationships and matters of the heart. Please share divine wisdom to help me navigate love and connections.' },
              { icon: 'work', label: 'Career & Purpose', color: '#F59E0B', prompt: 'I feel lost about my career and life purpose. I don\'t know which path to choose. Please guide me with ancient wisdom about finding one\'s true calling.' },
              { icon: 'family_restroom', label: 'Family & Duty', color: '#10B981', prompt: 'I am struggling with family responsibilities and duties. There are conflicts between what I want and what is expected of me. Please share wisdom about dharma and family duty.' },
              { icon: 'self_improvement', label: 'Self Discovery', color: '#6366F1', prompt: 'I want to understand myself better and discover who I truly am. Please guide me on the path of self-discovery with scriptural wisdom.' },
              { icon: 'balance', label: 'Moral Dilemmas', color: '#EF4444', prompt: 'I am facing a difficult moral dilemma where I cannot tell right from wrong. Please help me understand what is dharma in my situation.' },
              { icon: 'mood_bad', label: 'Grief & Loss', color: '#64748B', prompt: 'I am going through deep grief and loss. The pain feels unbearable. Please share divine wisdom to help me find strength and acceptance.' },
              { icon: 'temple_buddhist', label: 'Spiritual Growth', color: '#C6922B', prompt: 'I want to grow spiritually and deepen my connection with the divine. Please guide me on the path of spiritual evolution with wisdom from the scriptures.' },
            ].map((p, i) => (
              <Link
                to={`/chat?topic=${encodeURIComponent(p.prompt)}`}
                key={i}
                className="path-chip"
                style={{ '--chip-color': p.color }}
              >
                <span className="path-chip__icon material-symbols-outlined">{p.icon}</span>
                <span className="path-chip__label">{p.label}</span>
                <span className="path-chip__arrow material-symbols-outlined">arrow_forward</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          IMPACT STATS
      ══════════════════════════════════════════ */}
      <section className="stats-section" id="stats-section">
        <div className="stats__wrap">
          <div className="stats__grid">
            {[
              { number: '10,000+', label: 'Seekers Guided', icon: 'group' },
              { number: '50,000+', label: 'Conversations', icon: 'forum' },
              { number: '700+', label: 'Gita Verses', icon: 'menu_book' },
              { number: '3', label: 'Sacred Scriptures', icon: 'auto_stories' },
            ].map((s, i) => (
              <div key={i} className="stat-card">
                <div className="stat-card__icon">
                  <span className="material-symbols-outlined">{s.icon}</span>
                </div>
                <span className="stat-card__number">{s.number}</span>
                <span className="stat-card__label">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          TESTIMONIALS
      ══════════════════════════════════════════ */}
      <section className="testimonials-section" id="testimonials-section">
        <div className="testimonials__wrap">
          <div className="section-header">
            <span className="section-header__label">🪷 Seeker Stories</span>
            <h2 className="section-header__title">Voices of Transformation</h2>
            <p className="section-header__sub">
              Real people who found clarity through the wisdom of the ancients.
            </p>
          </div>

          <div className="testimonials__grid">
            {[
              {
                quote: 'I was lost after losing my job. Gitaarth reminded me of the Gita\'s teaching — focus on effort, not outcomes. It changed my entire perspective.',
                name: 'Arjun Mehta',
                role: 'Software Engineer, Bangalore',
                avatar: 'https://randomuser.me/api/portraits/men/45.jpg',
              },
              {
                quote: 'The way it connected my relationship struggle with Ram and Sita\'s story… I felt truly understood. No AI has ever made me feel this seen.',
                name: 'Priya Sharma',
                role: 'Teacher, Delhi',
                avatar: 'https://randomuser.me/api/portraits/women/65.jpg',
              },
              {
                quote: 'As someone who doesn\'t read Sanskrit, Gitaarth opened the Bhagavad Gita for me in a way that felt personal, alive, and deeply relevant.',
                name: 'Rahul Desai',
                role: 'Student, Mumbai',
                avatar: 'https://randomuser.me/api/portraits/men/22.jpg',
              },
            ].map((t, i) => (
              <div key={i} className="testimonial-card">
                <div className="testimonial-card__stars">
                  {'★★★★★'.split('').map((s, j) => (
                    <span key={j} className="testimonial-card__star">{s}</span>
                  ))}
                </div>
                <p className="testimonial-card__quote">"{t.quote}"</p>
                <div className="testimonial-card__author">
                  <img className="testimonial-card__avatar" src={t.avatar} alt={t.name} />
                  <div>
                    <span className="testimonial-card__name">{t.name}</span>
                    <span className="testimonial-card__role">{t.role}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          FAQ SECTION
      ══════════════════════════════════════════ */}
      <section className="faq-section" id="faq-section">
        <div className="faq__wrap">
          <div className="section-header">
            <span className="section-header__label">🪷 Questions</span>
            <h2 className="section-header__title">Frequently Asked Questions</h2>
          </div>

          <div className="faq__list">
            {[
              {
                q: 'What is Gitaarth AI?',
                a: 'Gitaarth AI is a spiritual counseling platform that provides personalized guidance using wisdom from the Bhagavad Gita, Ramayana, and Mahabharata. It uses advanced AI to understand your struggles and connect them with relevant ancient teachings.',
              },
              {
                q: 'Is the scripture interpretation accurate?',
                a: 'Yes. Every shloka and verse referenced is sourced directly from authenticated texts. Our AI has been trained on verified translations and commentaries from renowned scholars to ensure authenticity.',
              },
              {
                q: 'Can I use it in Hindi or Hinglish?',
                a: 'Absolutely! Gitaarth understands and responds in English, Hindi, and Hinglish. Speak naturally — the way you would with a wise elder.',
              },
              {
                q: 'Is my conversation private?',
                a: 'Your privacy is sacred to us. All conversations are encrypted and we never share your personal data. Your spiritual journey remains yours alone.',
              },
              {
                q: 'Is Gitaarth free to use?',
                a: 'Yes, Gitaarth is currently free for all seekers. Our mission is to make ancient wisdom accessible to everyone, regardless of background or means.',
              },
            ].map((faq, i) => (
              <details key={i} className="faq-item">
                <summary className="faq-item__question">
                  <span>{faq.q}</span>
                  <span className="faq-item__chevron material-symbols-outlined">expand_more</span>
                </summary>
                <p className="faq-item__answer">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          FINAL CTA
      ══════════════════════════════════════════ */}
      <section className="cta-section" id="cta-section">
        <div className="cta__wrap">
          <div className="cta__glow" aria-hidden="true" />
          <span className="cta__sparkle">🪷</span>
          <h2 className="cta__title">
            Your Kurukshetra awaits.<br />
            <span className="cta__title-gold">Seek the answer within.</span>
          </h2>
          <p className="cta__sub">
            Begin your conversation with the wisdom that has guided millions for millennia.
          </p>
          <div className="cta__btns">
            <Link to="/chat" className="hero__btn hero__btn--primary cta__btn">
              <span className="hero__btn-sparkle">🪷</span>
              Start Your Journey
            </Link>
            <Link to="/library" className="hero__btn hero__btn--ghost cta__btn">
              <span className="material-symbols-outlined">auto_stories</span>
              Browse Scriptures
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="site-footer">
        <div className="site-footer__inner">
          <div className="site-footer__top">
            <div className="site-footer__brand-block">
              <span className="site-footer__brand">Gitaarth AI</span>
              <p className="site-footer__tagline">Ancient wisdom for modern souls.</p>
            </div>
            <div className="site-footer__links">
              <Link to="/chat" className="site-footer__link">Seek Guidance</Link>
              <Link to="/library" className="site-footer__link">Scripture Library</Link>
            </div>
          </div>
          <div className="site-footer__bottom">
            <span className="site-footer__copy">© 2024 Gitaarth AI — Made with ♡ for seekers everywhere</span>
          </div>
        </div>
      </footer>
    </main>
  );
}
