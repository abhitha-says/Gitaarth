import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { LogOut, X } from 'lucide-react';
import { ArchMark } from './Marks';
import { useAuth } from '../context/AuthContext';
import { useVeil } from '../context/VeilContext';
import './Navbar.css';

const LINKS = [
  { to: '/library', label: 'The Gita' },
  { to: '/about', label: 'About' },
  { to: '/profile', label: 'Sanctuary' },
];

const EASE = [0.22, 1, 0.36, 1];

export default function Navbar() {
  const { user, signIn, signOut } = useAuth();
  const enter = useVeil();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const userRef = useRef(null);

  useEffect(() => {
    // Over the entrance the bar stays out of the picture; it settles once the page begins.
    const onScroll = () => {
      const walk = document.querySelector('.journey, .ent');
      const over = walk && walk.getBoundingClientRect().bottom > 80;
      setScrolled(window.scrollY > 24 && !over);
    };
    onScroll();
    const id = requestAnimationFrame(onScroll);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => { cancelAnimationFrame(id); window.removeEventListener('scroll', onScroll); };
  }, [location.pathname]);

  // Close menus when the route changes (adjusted during render, not in an effect)
  const [lastPath, setLastPath] = useState(location.pathname);
  if (lastPath !== location.pathname) {
    setLastPath(location.pathname);
    setMenuOpen(false);
    setUserOpen(false);
  }

  // Lock scroll behind the mobile menu; Escape closes it
  useEffect(() => {
    if (!menuOpen) return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e) => e.key === 'Escape' && setMenuOpen(false);
    window.addEventListener('keydown', onKey);
    return () => { document.body.style.overflow = prev; window.removeEventListener('keydown', onKey); };
  }, [menuOpen]);

  // Click outside closes the account menu
  useEffect(() => {
    if (!userOpen) return undefined;
    const onDown = (e) => { if (!userRef.current?.contains(e.target)) setUserOpen(false); };
    const onKey = (e) => e.key === 'Escape' && setUserOpen(false);
    document.addEventListener('pointerdown', onDown);
    window.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('pointerdown', onDown); window.removeEventListener('keydown', onKey); };
  }, [userOpen]);

  const seek = (e) => { e.preventDefault(); enter('/chat', e); };

  return (
    <header className={`nav ${scrolled ? 'nav--solid' : ''}`}>
      <div className="nav__inner container">
        <Link to="/" className="brand" aria-label="Gitaarth, home">
          <ArchMark size={30} />
          <span className="brand__word">Gitaarth</span>
        </Link>

        <nav className="nav__links" aria-label="Primary">
          {LINKS.map((l) => (
            <NavLink key={l.to} to={l.to} className={({ isActive }) => `nav__link ${isActive ? 'is-active' : ''}`}>
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="nav__end">
          {user ? (
            <div className="nav__user" ref={userRef}>
              <button
                type="button"
                className="nav__avatar-btn"
                onClick={() => setUserOpen((v) => !v)}
                aria-expanded={userOpen}
                aria-haspopup="menu"
                aria-label={`Account menu for ${user.name}`}
              >
                {user.avatar ? (
                  <img src={user.avatar} alt="" referrerPolicy="no-referrer" />
                ) : (
                  <span>{user.name?.[0] || '·'}</span>
                )}
              </button>
              <AnimatePresence>
                {userOpen && (
                  <motion.div
                    className="nav__menu glass"
                    role="menu"
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.25, ease: EASE }}
                  >
                    <p className="nav__menu-name">{user.name}</p>
                    {user.email && <p className="nav__menu-email">{user.email}</p>}
                    <Link to="/profile" className="nav__menu-item" role="menuitem">Your sanctuary</Link>
                    <button type="button" className="nav__menu-item" role="menuitem" onClick={signOut}>
                      <LogOut aria-hidden="true" /> Sign out
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <button type="button" className="nav__signin" onClick={signIn}>Sign in</button>
          )}
          <a href="/chat" className="btn btn--gold btn--sm nav__cta" onClick={seek}>Seek Guidance</a>
          <button
            type="button"
            className="nav__burger"
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
            aria-expanded={menuOpen}
          >
            <span /><span />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="sheet"
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: EASE }}
          >
            <div className="sheet__top container">
              <Link to="/" className="brand" aria-label="Gitaarth, home">
                <ArchMark size={30} />
                <span className="brand__word">Gitaarth</span>
              </Link>
              <button type="button" className="icon-btn" onClick={() => setMenuOpen(false)} aria-label="Close menu">
                <X />
              </button>
            </div>
            <nav className="sheet__links container" aria-label="Mobile">
              {[{ to: '/', label: 'Home' }, ...LINKS].map((l, i) => (
                <motion.div
                  key={l.to}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease: EASE, delay: 0.08 + i * 0.06 }}
                >
                  <NavLink to={l.to} end={l.to === '/'} className={({ isActive }) => `sheet__link ${isActive ? 'is-active' : ''}`}>
                    {l.label}
                  </NavLink>
                </motion.div>
              ))}
            </nav>
            <div className="sheet__foot container">
              <a href="/chat" className="btn btn--gold btn--block" onClick={(e) => { setMenuOpen(false); seek(e); }}>
                Seek Guidance
              </a>
              {user ? (
                <button type="button" className="btn btn--ghost btn--block" onClick={signOut}>Sign out of {user.name?.split(' ')[0]}</button>
              ) : (
                <button type="button" className="btn btn--ghost btn--block" onClick={signIn}>Sign in with Google</button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
