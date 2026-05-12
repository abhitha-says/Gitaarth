import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ChatBubble from '../components/ChatBubble';
import LanguageSelector from '../components/LanguageSelector';
import { API_BASE_URL, SAMPLE_SHLOKAS } from '../utils/constants';
import './Chat.css';

// ─── Greeting detection ───
const GREETING_PATTERNS = /^(hi|hello|hey|namaste|namaskar|namasthe|hii+|helo|hola|yo|sup|good\s?(morning|evening|afternoon|night)|jai\s?shri\s?(krishna|ram|rama)|har\s?har\s?mahadev|om|radhe\s?radhe|ram\s?ram|jai\s?hanuman)\b/i;
function isGreeting(text) {
  const cleaned = text.trim().replace(/[!.,?]+$/, '');
  return GREETING_PATTERNS.test(cleaned) && cleaned.split(/\s+/).length <= 5;
}

// ─── Fallback responses ───
const FALLBACK = [
  { persona: 'krishna', text: 'Namaste, dear one 🙏\n\nI am glad you have come. Just as Arjuna came to me on the battlefield — not with answers, but with questions — you too can share anything that weighs upon your heart.\n\nTell me, what is troubling you today?', shloka: null, counseling: null },
  { persona: 'krishna', text: 'I hear the weight you are carrying. The speed of the modern world often pulls our minds into the future, creating a turbulent sea of worries. But remember, true peace is not found by slowing down the world, but by anchoring your own mind.', shloka: SAMPLE_SHLOKAS[0], counseling: 'Focus on giving your best to whatever path you choose, rather than being paralyzed by the outcomes. The anxiety you feel comes from trying to control results that are not yet yours to know. Tell me more — what specifically makes this so difficult?' },
  { persona: 'ram', text: 'Dear friend, I understand the weight you carry. During my fourteen years of exile, there were moments when the path ahead seemed endless. But I learned that every challenge is not a punishment — it is a preparation for who we are becoming.', shloka: null, counseling: 'What feels like your exile right now? Sometimes naming our struggles gives us power over them.' },
];

export default function Chat() {
  const [showLangSelector, setShowLangSelector] = useState(true);
  const [language, setLanguage] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const fallbackIdx = useRef(0);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleLanguageSelect = (lang) => {
    setLanguage(lang);
    setShowLangSelector(false);
    setMessages([]);
    setTimeout(() => inputRef.current?.focus(), 400);
  };

  const callBackend = async (userText) => {
    const history = messages.map(m => ({ role: m.role, text: m.text, persona: m.persona, shloka: m.shloka, counseling: m.counseling }));
    const res = await fetch(`${API_BASE_URL}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: userText, language: language?.code || 'en', history }),
    });
    if (!res.ok) throw new Error('Server error');
    return res.json();
  };

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;
    const userText = input.trim();
    setMessages(prev => [...prev, { id: Date.now(), role: 'user', text: userText }]);
    setInput('');
    setIsTyping(true);

    try {
      const response = await callBackend(userText);
      setMessages(prev => [...prev, { id: Date.now() + 1, role: 'assistant', persona: response.persona || 'krishna', text: response.text, shloka: response.shloka, counseling: response.counseling }]);
    } catch {
      const fb = FALLBACK[Math.min(fallbackIdx.current, FALLBACK.length - 1)];
      fallbackIdx.current++;
      await new Promise(r => setTimeout(r, 800 + Math.random() * 800));
      setMessages(prev => [...prev, { id: Date.now() + 1, role: 'assistant', persona: fb.persona, text: fb.text, shloka: fb.shloka, counseling: fb.counseling }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  return (
    <div className="chat-layout">
      <LanguageSelector isOpen={showLangSelector} onSelect={handleLanguageSelect} />

      {!showLangSelector && (
        <>
          {/* ═══ Sidebar ═══ */}
          <nav className={`chat-sidebar ${sidebarOpen ? 'chat-sidebar--open' : ''}`}>
            <div className="chat-sidebar__header">
              <div className="chat-sidebar__avatar">
                <img src="/mandala-avatar.png" alt="Gitaarth" />
              </div>
              <div>
                <h1 className="chat-sidebar__brand">Gitaarth AI</h1>
                <p className="chat-sidebar__sub">Modern Divine Counselor</p>
              </div>
            </div>

            <button className="chat-sidebar__new-btn divine-glow" onClick={() => { setMessages([]); fallbackIdx.current = 0; }}>
              Begin New Guidance
            </button>

            <ul className="chat-sidebar__nav">
              <li><Link to="/" className="chat-sidebar__link"><span className="material-symbols-outlined">auto_stories</span>Daily Verse</Link></li>
              <li><a href="#" className="chat-sidebar__link chat-sidebar__link--active"><span className="material-symbols-outlined icon-filled">chat_bubble</span>Sacred Chats</a></li>
              <li><Link to="/profile" className="chat-sidebar__link"><span className="material-symbols-outlined">auto_awesome</span>My Journey</Link></li>
              <li><Link to="/library" className="chat-sidebar__link"><span className="material-symbols-outlined">menu_book</span>Library</Link></li>
              <li><Link to="/" className="chat-sidebar__link"><span className="material-symbols-outlined">spa</span>Sanctuary</Link></li>
            </ul>

            <div className="chat-sidebar__footer">
              <a href="#" className="chat-sidebar__link"><span className="material-symbols-outlined">settings</span>Settings</a>
              <a href="#" className="chat-sidebar__link"><span className="material-symbols-outlined">help_outline</span>Support</a>
            </div>
          </nav>

          {/* ═══ Main Chat Area ═══ */}
          <main className="chat-main">
            {/* Mobile Header */}
            <header className="chat-mobile-header">
              <button className="chat-mobile-header__menu" onClick={() => setSidebarOpen(!sidebarOpen)} aria-label="Menu">
                <span className="material-symbols-outlined">menu</span>
              </button>
              <span className="chat-mobile-header__brand">Gitaarth AI</span>
              <div className="chat-mobile-header__actions">
                <button aria-label="Settings"><span className="material-symbols-outlined">settings</span></button>
                <button aria-label="Account"><span className="material-symbols-outlined">account_circle</span></button>
              </div>
            </header>

            {/* Messages */}
            <div className="chat-messages">
              <div className="chat-messages__inner">
                {/* Session Header */}
                <div className="chat-session-header">
                  <p className="text-label text-muted">Counselor Session</p>
                  <h2>Seeking Divine Guidance</h2>
                </div>

                {messages.map(msg => (
                  <ChatBubble key={msg.id} message={msg} lang={language?.code || 'en'} />
                ))}

                {isTyping && (
                  <div className="chat-typing">
                    <div className="chat-typing__avatar">
                      <img src="/mandala-avatar.png" alt="" />
                    </div>
                    <span className="chat-typing__label">Divine Counselor</span>
                    <div className="chat-typing__dots"><span /><span /><span /></div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Input Area */}
            <div className="chat-input-area">
              <div className="chat-input-area__inner">
                <div className="chat-input">
                  <textarea
                    ref={inputRef}
                    className="chat-input__field"
                    placeholder="Write in your sacred journal..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    rows={1}
                  />
                  <button
                    className={`chat-input__send ${input.trim() ? 'chat-input__send--active' : ''}`}
                    onClick={handleSend}
                    disabled={!input.trim() || isTyping}
                    aria-label="Send"
                  >
                    <span className="material-symbols-outlined">send</span>
                  </button>
                </div>
                <p className="chat-input__hint">Gitaarth AI - Modern Divine Wisdom</p>
              </div>
            </div>
          </main>

          {/* Sidebar overlay (mobile) */}
          {sidebarOpen && <div className="chat-sidebar-overlay" onClick={() => setSidebarOpen(false)} />}
        </>
      )}
    </div>
  );
}
