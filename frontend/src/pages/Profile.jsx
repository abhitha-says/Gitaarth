import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { ArrowRight, LogIn, LogOut } from 'lucide-react';
import Morning from '../components/Morning';
import KeptLeaf from '../components/sanctuary/KeptLeaf';
import Diary from '../components/sanctuary/Diary';
import { useArrive } from '../components/sanctuary/useArrive';
import { keptLabel } from '../components/sanctuary/format';
import { useAuth } from '../context/AuthContext';
import { useKept } from '../utils/kept';
import { listSessions } from '../utils/api';
import './Profile.css';

/** The visitor's own quiet place: what they have kept, and where they have been. */
export default function Profile() {
  const { user, ready, signIn, signOut, authError, clearAuthError } = useAuth();
  const { items, remove, toggle, isKept } = useKept();
  const [sessions, setSessions] = useState(null); // null = gathering, false = unavailable
  const [removed, setRemoved] = useState(null);
  const [headRef, headClass, still] = useArrive();
  const [roomRef, roomClass] = useArrive();

  useEffect(() => {
    let cancelled = false;
    listSessions(20).then((list) => { if (!cancelled) setSessions(list === null ? false : list); });
    return () => { cancelled = true; };
  }, [user]);

  const first = user?.name?.split(' ')[0];

  const onRemove = (item) => {
    remove(item.id);
    setRemoved(item);
  };
  const putBack = () => {
    if (!removed) return;
    if (!isKept(removed.id)) toggle(removed);
    setRemoved(null);
  };

  return (
    <main id="main" className={`page sanctuary${still ? ' is-still' : ''}`}>
      <Morning />

      <header className="sanctuary__head container">
        <div ref={headRef} className={`sanctuary__words ${headClass}`}>
          <p className="eyebrow" style={{ '--i': 0 }}>Your sanctuary</p>
          <h1 className="display sanctuary__title" style={{ '--i': 1 }}>
            {first
              ? <>Welcome back, <em>{first}.</em></>
              : <>A quiet place for what <em>stayed with&nbsp;you.</em></>}
          </h1>
          <p className="sanctuary__lead" style={{ '--i': 2 }}>
            The verses and guidance you keep, and the conversations you have had, gathered in one place.
          </p>
        </div>

        <div className="sanctuary__door">
          {authError && (
            <p className="sanctuary__alert" role="alert">
              <span>Signing in with Google did not complete. Please try again.</span>
              <button type="button" className="sanctuary__alert-close" onClick={clearAuthError}>Dismiss</button>
            </p>
          )}
          {!ready && <p className="threshold threshold--waiting" role="status">Opening the door…</p>}
          {ready && user && (
            <div className="threshold">
              <span className="threshold__face" aria-hidden="true">
                {user.avatar ? <img src={user.avatar} alt="" referrerPolicy="no-referrer" /> : user.name?.[0]}
              </span>
              <div className="threshold__who">
                <p className="threshold__name">{user.name}</p>
                {user.email && <p className="threshold__note">{user.email}</p>}
              </div>
              <button type="button" className="btn btn--ghost btn--sm threshold__btn" onClick={signOut}>
                <LogOut aria-hidden="true" /> Sign out
              </button>
            </div>
          )}
          {ready && !user && (
            <div className="threshold threshold--guest">
              <div className="threshold__who">
                <p className="threshold__name">You are here as a guest</p>
                <p className="threshold__note">
                  Conversations are remembered on this browser. Sign in to carry them across your devices.
                </p>
              </div>
              <button type="button" className="btn btn--gold btn--sm threshold__btn" onClick={signIn}>
                <LogIn aria-hidden="true" /> Sign in with Google
              </button>
            </div>
          )}
        </div>
      </header>

      <div ref={roomRef} className={`sanctuary__room container ${roomClass}`}>
        <section className="shelf" aria-labelledby="kept-title" style={{ '--i': 0 }}>
          <div className="room__head">
            <h2 id="kept-title" className="display room__title">Kept words</h2>
            <p className="room__sub">
              Saved on this device{items.length > 0 && <> · {items.length} {items.length === 1 ? 'leaf' : 'leaves'}</>}
            </p>
          </div>

          <div className="shelf__undo" aria-live="polite">
            {removed && (
              <p>
                Removed {keptLabel(removed)}.
                <button type="button" className="shelf__undo-btn" onClick={putBack}>Put it back</button>
              </p>
            )}
          </div>

          {items.length === 0 ? (
            <div className="shelf__empty">
              <div className="niche" aria-hidden="true">
                <span className="niche__shaft" />
                <span className="niche__sill" />
              </div>
              <p className="shelf__line">
                Nothing kept yet. When a verse or a reply speaks to you, choose <strong>Keep</strong> and it will rest here.
              </p>
              <Link to="/library" className="link-arrow">Read the Bhagavad Gita <ArrowRight aria-hidden="true" /></Link>
            </div>
          ) : (
            <div className="shelf__stack">
              <ul className="shelf__leaves">
                <AnimatePresence initial={false}>
                  {items.map((k, i) => (
                    <KeptLeaf key={k.id} item={k} index={i} still={still} onRemove={onRemove} />
                  ))}
                </AnimatePresence>
              </ul>
              <div className="ledge" aria-hidden="true" />
            </div>
          )}
        </section>

        <Diary sessions={sessions} signedIn={Boolean(user)} style={{ '--i': 1 }} />
      </div>
    </main>
  );
}
