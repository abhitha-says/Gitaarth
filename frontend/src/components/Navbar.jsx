import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import './Navbar.css';

const LINKS = [
  { to: '/', label: 'Home' },
  { to: '/chat', label: 'Seek Guidance' },
  { to: '/library', label: 'Library' },
  { to: '/about', label: 'About' },
];

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function Navbar() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check for token in URL (returned from Google OAuth callback)
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');

    if (token) {
      localStorage.setItem('gitaarth_token', token);
      // Clean up the URL
      window.history.replaceState({}, '', window.location.pathname);
    }

    // Load user from stored token
    const stored = localStorage.getItem('gitaarth_token');
    if (stored) {
      fetch(`${API_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${stored}` },
      })
        .then((r) => (r.ok ? r.json() : Promise.reject()))
        .then((data) => setUser(data.user))
        .catch(() => {
          // Token invalid/expired — clear it
          localStorage.removeItem('gitaarth_token');
          setUser(null);
        });
    }
  }, []);

  function handleSignIn() {
    window.location.href = `${API_URL}/auth/google`;
  }

  function handleSignOut() {
    localStorage.removeItem('gitaarth_token');
    setUser(null);
  }

  return (
    <nav className="nav" id="main-navbar">
      <div className="nav__inner">
        {/* Brand */}
        <a href="/" className="nav__brand">Gitaarth AI</a>

        {/* Center Links */}
        <div className="nav__center">
          {LINKS.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `nav__link ${isActive ? 'nav__link--active' : ''}`
              }
              end={l.to === '/'}
            >
              {l.label}
            </NavLink>
          ))}
        </div>

        {/* Right Actions */}
        <div className="nav__right">
          {user ? (
            <div className="nav__user">
              <img
                src={user.avatar}
                alt={user.name}
                className="nav__avatar"
                referrerPolicy="no-referrer"
              />
              <span className="nav__username">{user.name.split(' ')[0]}</span>
              <button className="nav__signout" onClick={handleSignOut}>
                Sign Out
              </button>
            </div>
          ) : (
            <button className="nav__signin" onClick={handleSignIn}>
              Sign In
            </button>
          )}
          <button className="nav__icon-btn" aria-label="Settings">
            <span className="material-symbols-outlined">brightness_5</span>
          </button>
        </div>
      </div>
    </nav>
  );
}
