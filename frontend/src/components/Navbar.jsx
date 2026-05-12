import { NavLink } from 'react-router-dom';
import './Navbar.css';

const LINKS = [
  { to: '/', label: 'Home' },
  { to: '/chat', label: 'Seek Guidance' },
  { to: '/library', label: 'Library' },
  { to: '/about', label: 'About' },
];

export default function Navbar() {
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
          <button className="nav__signin">Sign In</button>
          <button className="nav__icon-btn" aria-label="Settings">
            <span className="material-symbols-outlined">brightness_5</span>
          </button>
        </div>
      </div>
    </nav>
  );
}
