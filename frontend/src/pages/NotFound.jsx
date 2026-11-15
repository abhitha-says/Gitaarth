import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import Morning from '../components/Morning';
import Mist from '../scene/Mist';
import { useArrive } from '../components/sanctuary/useArrive';
import { useVeil } from '../context/VeilContext';
import './NotFound.css';

/** The path is lost in the mist: one line, a way home, a way to the conversation. */
export default function NotFound() {
  const enter = useVeil();
  const [ref, cls, still] = useArrive();

  return (
    <main id="main" className={`page lost${still ? ' is-still' : ''}`}>
      <Morning mist={false} />

      <div className="lost__ground" aria-hidden="true">
        <svg className="lost__path" viewBox="0 0 100 100" preserveAspectRatio="none" focusable="false">
          <defs>
            <linearGradient id="lost-path-fade" x1="0" y1="1" x2="0" y2="0">
              <stop offset="0" stopColor="#d9c39c" stopOpacity="0.55" />
              <stop offset="0.55" stopColor="#e6d5b8" stopOpacity="0.28" />
              <stop offset="1" stopColor="#e6d5b8" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d="M33 100 Q52 64 46.5 36 Q44 16 49.6 0 L50.4 0 Q46.5 16 49.5 36 Q57 64 67 100 Z" fill="url(#lost-path-fade)" />
        </svg>
        <Mist bands={still ? 1 : 3} />
        <div className="lost__haze" />
      </div>

      <div ref={ref} className={`lost__words ${cls}`}>
        <p className="eyebrow eyebrow--center" style={{ '--i': 0 }}>Page not found</p>
        <h1 className="display lost__title" style={{ '--i': 1 }}>
          The path is lost in the <em>mist.</em>
        </h1>
        <p className="lost__line" style={{ '--i': 2 }}>
          The page you were looking for is not here. Every path can still lead back home.
        </p>
        <div className="lost__ways" style={{ '--i': 3 }}>
          <Link to="/" className="btn btn--gold">
            <ArrowLeft aria-hidden="true" /> Return home
          </Link>
          <a href="/chat" className="link-arrow" onClick={(e) => { e.preventDefault(); enter('/chat', e); }}>
            Or begin a conversation <ArrowRight aria-hidden="true" />
          </a>
        </div>
      </div>
    </main>
  );
}
