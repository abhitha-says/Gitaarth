import { Link } from 'react-router-dom';
import { ArchMark } from './Marks';
import { HELPLINE } from '../utils/constants';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <div className="footer__brand">
          <Link to="/" className="brand" aria-label="Gitaarth, home">
            <ArchMark size={30} />
            <span className="brand__word">Gitaarth</span>
          </Link>
          <p className="footer__line">
            An AI companion inspired by the Bhagavad Gita. It offers reflection, not revelation,
            and it does not speak for God.
          </p>
        </div>

        <nav className="footer__cols" aria-label="Footer">
          <div>
            <p className="footer__head">Explore</p>
            <Link to="/chat">Seek Guidance</Link>
            <Link to="/library">The Bhagavad Gita</Link>
            <Link to="/library?tab=ramayana">Words of Shri Ram</Link>
          </div>
          <div>
            <p className="footer__head">Gitaarth</p>
            <Link to="/about">About</Link>
            <Link to="/profile">Your sanctuary</Link>
          </div>
        </nav>
      </div>

      <div className="container footer__base">
        <p>
          In crisis in India? Call {HELPLINE.name} at <a href={HELPLINE.tel}>{HELPLINE.number}</a>, free, day and night.
        </p>
        <p>© {new Date().getFullYear()} Gitaarth · Made with devotion by Abhitha &amp; Chirag</p>
      </div>
    </footer>
  );
}
