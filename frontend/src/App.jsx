import { lazy, Suspense, useEffect, useLayoutEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';

// The landing page ships first; every other page loads when it is visited.
const Chat = lazy(() => import('./pages/Chat'));
// The palm-leaf Library. To bring back the earlier Library, change './pages/Library'
// on the next line to './pages/LibraryClassic'.
const Library = lazy(() => import('./pages/Library'));
const Profile = lazy(() => import('./pages/Profile'));
const About = lazy(() => import('./pages/About'));
const NotFound = lazy(() => import('./pages/NotFound'));

const TITLES = {
  '/': 'Gitaarth — Wisdom of the Bhagavad Gita',
  '/chat': 'Seek Guidance · Gitaarth',
  '/library': 'The Bhagavad Gita · Gitaarth',
  '/profile': 'Your Sanctuary · Gitaarth',
  '/sanctuary': 'Your Sanctuary · Gitaarth',
  '/about': 'About · Gitaarth',
};

export default function App() {
  const location = useLocation();
  const isChat = location.pathname === '/chat';

  useEffect(() => {
    document.title = TITLES[location.pathname] || 'Gitaarth';
  }, [location.pathname]);

  // Each page begins at its top, before it is painted
  useLayoutEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [location.pathname]);

  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      {!isChat && <Navbar />}
      {/* Keyed by path so every arrival fades in. Enter-only on purpose:
          an exit that waits on animation frames can strand a page. */}
      <div key={location.pathname} className="route-fade">
        <Suspense fallback={<div className="page" aria-busy="true" />}>
        <Routes location={location}>
          <Route path="/" element={<Home />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/library" element={<Library />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/sanctuary" element={<Profile />} />
          <Route path="/about" element={<About />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        </Suspense>
        {!isChat && <Footer />}
      </div>
    </>
  );
}
