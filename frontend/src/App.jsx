import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Chat from './pages/Chat';
import Library from './pages/Library';
import Profile from './pages/Profile';
import About from './pages/About';

export default function App() {
  const location = useLocation();
  const isChatPage = location.pathname === '/chat';

  return (
    <>
      {/* Hide navbar on chat page — chat has its own sidebar/header */}
      {!isChatPage && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/library" element={<Library />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </>
  );
}
