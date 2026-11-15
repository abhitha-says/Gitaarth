import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Plus, X, Home, BookOpen, Sparkles, Info, LogIn } from 'lucide-react';
import { useVeil } from '../../context/VeilContext';
import { LotusMark } from '../Marks';

const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

function groupSessions(sessions) {
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  const startOfYesterday = new Date(startOfToday.getTime() - 86400000);
  const startOfWeek = new Date(startOfToday.getTime() - 6 * 86400000);
  const groups = { Today: [], Yesterday: [], 'This week': [], Earlier: [] };
  for (const s of sessions) {
    const at = new Date(s.updatedAt);
    if (at >= startOfToday) groups.Today.push(s);
    else if (at >= startOfYesterday) groups.Yesterday.push(s);
    else if (at >= startOfWeek) groups['This week'].push(s);
    else groups.Earlier.push(s);
  }
  return Object.entries(groups).filter(([, list]) => list.length > 0);
}

/**
 * Past conversations. A sheet that rises from the lower edge on a phone, a
 * panel from the right on a wide screen. While open it holds the focus,
 * Escape closes it (handled by the page) and focus returns to the opener.
 */
export default function HistoryPanel({
  open, onClose, sessions, historyState, activeSessionId, loadingSession, onOpen, onNew, user, onSignIn,
}) {
  const panelRef = useRef(null);
  const enter = useVeil();

  useEffect(() => {
    if (!open) return undefined;
    const panel = panelRef.current;
    const opener = document.activeElement;
    const first = panel?.querySelector('.panel__close');
    const t = setTimeout(() => first?.focus({ preventScroll: true }), 60);
    const onKey = (e) => {
      if (e.key !== 'Tab' || !panel) return;
      const items = [...panel.querySelectorAll(FOCUSABLE)].filter((el) => el.offsetParent !== null);
      if (items.length === 0) return;
      const a = items[0];
      const z = items[items.length - 1];
      if (e.shiftKey && (document.activeElement === a || !panel.contains(document.activeElement))) {
        e.preventDefault(); z.focus();
      } else if (!e.shiftKey && (document.activeElement === z || !panel.contains(document.activeElement))) {
        e.preventDefault(); a.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      clearTimeout(t);
      document.removeEventListener('keydown', onKey);
      if (opener && opener instanceof HTMLElement && document.contains(opener)) opener.focus({ preventScroll: true });
    };
  }, [open]);

  const go = (to) => (e) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    e.preventDefault();
    enter(to, e);
  };

  return (
    <div className={`drawer ${open ? 'is-open' : ''}`} inert={!open}>
      <div className="drawer__scrim" onClick={onClose} aria-hidden="true" />
      <aside
        ref={panelRef}
        className="panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="panel-title"
      >
        <span className="panel__grip" aria-hidden="true" />
        <div className="panel__top">
          <h2 id="panel-title" className="panel__title">Your conversations</h2>
          <button type="button" className="icon-btn panel__close" onClick={onClose} aria-label="Close conversations">
            <X />
          </button>
        </div>

        <button type="button" className="panel__new" onClick={onNew}>
          <Plus aria-hidden="true" /> New conversation
        </button>

        <div className="panel__history">
          {historyState === 'loading' && <p className="panel__empty">Gathering your conversations…</p>}
          {historyState === 'unavailable' && (
            <p className="panel__empty">
              Past conversations can&rsquo;t be shown right now. You can still talk; this conversation simply won&rsquo;t be saved.
            </p>
          )}
          {historyState === 'ready' && sessions.length === 0 && (
            <p className="panel__empty">
              <LotusMark size={22} className="panel__empty-mark" />
              Your conversations will gather here.
            </p>
          )}
          {historyState === 'ready' && groupSessions(sessions).map(([label, list]) => (
            <div key={label} className="panel__group">
              <p className="panel__label">{label}</p>
              <ul>
                {list.map((s) => (
                  <li key={s.sessionId}>
                    <button
                      type="button"
                      className={`panel__item ${s.sessionId === activeSessionId ? 'is-active' : ''}`}
                      onClick={() => onOpen(s.sessionId)}
                      disabled={loadingSession}
                      title={s.title}
                      aria-current={s.sessionId === activeSessionId ? 'true' : undefined}
                    >
                      {s.title || 'Untitled conversation'}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="panel__foot">
          <div className="panel__account">
            {user ? (
              <div className="panel__user">
                {user.avatar ? <img src={user.avatar} alt="" referrerPolicy="no-referrer" /> : <span>{user.name?.[0]}</span>}
                <div>
                  <p>{user.name}</p>
                  <p className="panel__muted">Conversations follow you across devices</p>
                </div>
              </div>
            ) : (
              <button type="button" className="panel__signin" onClick={onSignIn}>
                <LogIn aria-hidden="true" />
                <span>
                  <strong>Sign in with Google</strong>
                  <span className="panel__muted">Keep conversations across devices</span>
                </span>
              </button>
            )}
          </div>

          <nav className="panel__nav" aria-label="Elsewhere in Gitaarth">
            <Link to="/" onClick={go('/')}><Home aria-hidden="true" /> Home</Link>
            <Link to="/library" onClick={go('/library')}><BookOpen aria-hidden="true" /> The Bhagavad Gita</Link>
            <Link to="/profile" onClick={go('/profile')}><Sparkles aria-hidden="true" /> Your sanctuary</Link>
            <Link to="/about" onClick={go('/about')}><Info aria-hidden="true" /> About Gitaarth</Link>
          </nav>
        </div>
      </aside>
    </div>
  );
}
