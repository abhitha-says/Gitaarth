import { Link } from 'react-router-dom';
import { ArrowLeft, BookOpen, History, SquarePen } from 'lucide-react';
import { useVeil } from '../../context/VeilContext';
import { LANGUAGES } from '../../utils/constants';

/**
 * The only way-finding on the conversation page (the site navbar is hidden
 * here): home, the Library, past conversations, a new one, and the reply
 * language, each one tap away and kept small so the words stay central.
 */
export default function SeatHeader({ language, onLanguage, onHistory, onNew, panelOpen }) {
  const enter = useVeil();
  const go = (to) => (e) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    e.preventDefault();
    enter(to, e);
  };

  return (
    <header className="seat-head">
      <nav className="seat-head__way" aria-label="Site">
        <Link to="/" className="seat-head__link seat-head__home" onClick={go('/')} aria-label="Back to Home">
          <ArrowLeft aria-hidden="true" />
          <span className="seat-head__word" aria-hidden="true">Gitaarth</span>
        </Link>
        <Link to="/library" className="seat-head__link" onClick={go('/library')} aria-label="The Library">
          <BookOpen aria-hidden="true" />
          <span className="seat-head__label" aria-hidden="true">Library</span>
        </Link>
      </nav>

      <div className="seat-head__tools">
        <div className="seat-lang" role="group" aria-label="Reply language">
          {LANGUAGES.map((l) => (
            <button
              key={l.code}
              type="button"
              className={`seat-lang__opt ${language === l.code ? 'is-on' : ''}`}
              aria-pressed={language === l.code}
              aria-label={`Reply in ${l.short}`}
              onClick={() => onLanguage(l.code)}
            >
              <span className="seat-lang__full" aria-hidden="true">{l.short}</span>
              <span className="seat-lang__abbr" aria-hidden="true">{l.code === 'hi' ? 'HI' : 'EN'}</span>
            </button>
          ))}
        </div>
        <button
          type="button"
          className="seat-head__link"
          onClick={onHistory}
          aria-label="Your conversations"
          aria-haspopup="dialog"
          aria-expanded={panelOpen}
        >
          <History aria-hidden="true" />
          <span className="seat-head__label" aria-hidden="true">Conversations</span>
        </button>
        <button type="button" className="seat-head__link" onClick={onNew} aria-label="New conversation">
          <SquarePen aria-hidden="true" />
          <span className="seat-head__label" aria-hidden="true">New</span>
        </button>
      </div>
    </header>
  );
}
