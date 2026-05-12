import { LANGUAGES } from '../utils/constants';
import './LanguageSelector.css';

export default function LanguageSelector({ isOpen, onSelect }) {
  if (!isOpen) return null;

  return (
    <div className="lang-overlay" id="language-selector">
      {/* Atmospheric particles */}
      <div className="lang-particles">
        {Array.from({ length: 18 }).map((_, i) => (
          <span
            key={i}
            className="lang-particle"
            style={{
              left: `${5 + Math.random() * 90}%`,
              top: `${5 + Math.random() * 90}%`,
              animationDelay: `${Math.random() * 8}s`,
              animationDuration: `${6 + Math.random() * 10}s`,
              width: `${2 + Math.random() * 3}px`,
              height: `${2 + Math.random() * 3}px`,
            }}
          />
        ))}
      </div>

      {/* Glow orbs */}
      <div className="lang-glow lang-glow--1" />
      <div className="lang-glow lang-glow--2" />
      <div className="lang-glow lang-glow--3" />

      <div className="lang-modal">
        {/* Sacred Om Symbol */}
        <div className="lang-modal__sacred">
          <span className="lang-modal__om">ॐ</span>
          <div className="lang-modal__ring" />
        </div>

        <p className="lang-modal__greeting">Namaste, Dear Seeker 🙏</p>

        <h2 className="lang-modal__title">Choose Your Path</h2>
        <p className="lang-modal__desc">
          Select the language for your spiritual counsel.<br />
          The wisdom remains the same; only the vessel changes.
        </p>

        <div className="lang-grid">
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              className="lang-card"
              onClick={() => onSelect(lang)}
              id={`lang-${lang.code}`}
            >
              <div className="lang-card__glow" />
              <span className="lang-card__flag">{lang.flag}</span>
              <div className="lang-card__info">
                <span className="lang-card__name">{lang.name}</span>
                <span className="lang-card__native">{lang.nativeName}</span>
              </div>
              <span className="material-symbols-outlined lang-card__arrow">arrow_forward</span>
            </button>
          ))}
        </div>

        <p className="lang-modal__footer">
          ✦ This is a safe space for you ✦
        </p>
      </div>
    </div>
  );
}
