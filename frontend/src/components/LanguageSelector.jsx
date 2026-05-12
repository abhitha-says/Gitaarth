import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LANGUAGES } from '../utils/constants';
import './LanguageSelector.css';

/* ─── Floating particle data ─── */
const PARTICLES = Array.from({ length: 14 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: 1.5 + Math.random() * 2.5,
  delay: Math.random() * 8,
  duration: 12 + Math.random() * 16,
}));

export default function LanguageSelector({ isOpen, onSelect }) {
  const [hoveredLang, setHoveredLang] = useState(null);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="lang-overlay"
          id="language-selector"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
        >
          {/* ═══ Divine Vishwaroop Background ═══ */}
          <div className="lang-bg-scene">
            <img
              src="/lang-vishwaroop-bg.jpg"
              alt=""
              className="lang-bg-image"
            />
            {/* Soft overlay for readability */}
            <div className="lang-bg-overlay" />
            <div className="lang-bg-overlay-center" />
          </div>

          {/* ═══ Atmospheric Glow Orbs ═══ */}
          <motion.div
            className="lang-glow lang-glow--topleft"
            animate={{
              scale: [1, 1.06, 1],
              opacity: [0.15, 0.3, 0.15],
            }}
            transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="lang-glow lang-glow--topright"
            animate={{
              scale: [1, 1.08, 1],
              opacity: [0.1, 0.25, 0.1],
            }}
            transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
          />
          <motion.div
            className="lang-glow lang-glow--bottom"
            animate={{
              scale: [1, 1.05, 1],
              opacity: [0.08, 0.2, 0.08],
            }}
            transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut', delay: 5 }}
          />

          {/* ═══ Floating Particles ═══ */}
          <div className="lang-particles-container">
            {PARTICLES.map((p) => (
              <motion.div
                key={p.id}
                className="lang-floating-particle"
                style={{
                  left: `${p.x}%`,
                  top: `${p.y}%`,
                  width: p.size,
                  height: p.size,
                }}
                animate={{
                  y: [0, -20, -45, -20, 0],
                  x: [0, 5, -3, 8, 0],
                  opacity: [0, 0.35, 0.2, 0.4, 0],
                  scale: [0.5, 0.9, 0.7, 0.85, 0.5],
                }}
                transition={{
                  duration: p.duration,
                  repeat: Infinity,
                  delay: p.delay,
                  ease: 'easeInOut',
                }}
              />
            ))}
          </div>

          {/* ═══ Sanskrit Glow Section (Left Side) ═══ */}
          <motion.div
            className="lang-sanskrit-section"
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.5, delay: 0.8, ease: 'easeOut' }}
          >
            <div className="lang-sanskrit-geometry" />
            <motion.div
              className="lang-sanskrit-text"
              animate={{
                textShadow: [
                  '0 0 12px rgba(212,164,55,0.08)',
                  '0 0 24px rgba(212,164,55,0.15)',
                  '0 0 12px rgba(212,164,55,0.08)',
                ],
              }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            >
              <span>यदा यदा हि धर्मस्य</span>
              <span>ग्लानिर्भवति भारत ।</span>
              <span>अभ्युत्थानमधर्मस्य</span>
              <span>तदात्मानं सृजाम्यहम् ॥</span>
            </motion.div>
          </motion.div>

          {/* ═══ Center Glass Card ═══ */}
          <motion.div
            className="lang-card-container"
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="lang-modal">
              {/* Card inner glow */}
              <div className="lang-modal__inner-glow" />

              {/* ── Sacred Om Symbol ── */}
              <motion.div
                className="lang-modal__sacred"
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.8, ease: 'easeOut' }}
              >
                <motion.span
                  className="lang-modal__om"
                  animate={{
                    textShadow: [
                      '0 0 10px rgba(198,146,43,0.1)',
                      '0 0 20px rgba(198,146,43,0.2)',
                      '0 0 10px rgba(198,146,43,0.1)',
                    ],
                  }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                >
                  ॐ
                </motion.span>
                <motion.div
                  className="lang-modal__ring"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
                />
              </motion.div>

              {/* ── Greeting ── */}
              <motion.p
                className="lang-modal__greeting"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.0 }}
              >
                Namaste, Dear Seeker 🙏
              </motion.p>

              {/* ── Title ── */}
              <motion.h2
                className="lang-modal__title"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.1 }}
              >
                Listen to the Eternal
              </motion.h2>

              {/* ── Description ── */}
              <motion.p
                className="lang-modal__desc"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 1.3 }}
              >
                "The Gita speaks. The soul remembers."
              </motion.p>

              {/* ── Language Selection Cards ── */}
              <div className="lang-grid">
                {LANGUAGES.map((lang, idx) => (
                  <motion.button
                    key={lang.code}
                    className={`lang-btn ${hoveredLang === lang.code ? 'lang-btn--hover' : ''}`}
                    onClick={() => onSelect(lang)}
                    onMouseEnter={() => setHoveredLang(lang.code)}
                    onMouseLeave={() => setHoveredLang(null)}
                    id={`lang-${lang.code}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.6,
                      delay: 1.5 + idx * 0.15,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    whileHover={{
                      y: -3,
                      boxShadow: '0 12px 40px rgba(198,146,43,0.12), 0 4px 12px rgba(0,0,0,0.04)',
                    }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="lang-btn__glow" />
                    <span className="lang-btn__icon">
                      {lang.code === 'en' ? 'A' : 'अ'}
                    </span>
                    <div className="lang-btn__info">
                      <span className="lang-btn__name">{lang.name}</span>
                      <span className="lang-btn__native">{lang.nativeName}</span>
                    </div>
                    <motion.span
                      className="lang-btn__arrow"
                      animate={hoveredLang === lang.code ? { x: 4, opacity: 1 } : { x: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      →
                    </motion.span>
                  </motion.button>
                ))}
              </div>

              {/* ── Footer ── */}
              <motion.p
                className="lang-modal__footer"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 2 }}
              >
                ✦ This is a safe space for you ✦
              </motion.p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
