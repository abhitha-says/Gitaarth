import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Morning from '../components/Morning';
import SeatHeader from '../components/chat/SeatHeader';
import Presence, { useWide, presenceSlot } from '../components/chat/Presence';
import Welcome from '../components/chat/Welcome';
import GuidanceMessage from '../components/chat/GuidanceMessage';
import UserMessage from '../components/chat/UserMessage';
import Reflecting from '../components/chat/Reflecting';
import Composer from '../components/chat/Composer';
import HistoryPanel from '../components/chat/HistoryPanel';
import { useAuth } from '../context/AuthContext';
import { useTier } from '../scene/tier';
import { sendChat, listSessions, getSession, describeError } from '../utils/api';
import './Chat.css';

const LANG_KEY = 'gitaarth_lang';

/** Shape stored messages the same way live ones arrive. */
function fromStored(m, i, sid) {
  return {
    id: `${sid}-${i}`,
    role: m.role,
    text: m.text,
    persona: m.persona,
    shloka: m.shloka?.sanskrit
      ? { ...m.shloka, translation: { en: m.shloka.translation, hi: m.shloka.translation } }
      : null,
    counseling: m.counseling,
  };
}

export default function Chat() {
  const { user, signIn } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  const [language, setLanguage] = useState(() => (localStorage.getItem(LANG_KEY) === 'hi' ? 'hi' : 'en'));
  const [messages, setMessages] = useState([]);
  const [draft, setDraft] = useState('');
  const [pending, setPending] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);

  const [sessions, setSessions] = useState([]);
  const [historyState, setHistoryState] = useState('loading'); // loading | ready | unavailable
  const [activeSessionId, setActiveSessionId] = useState(null);
  const [loadingSession, setLoadingSession] = useState(false);
  const [notice, setNotice] = useState(null);

  const sessionIdRef = useRef(null);
  const messagesRef = useRef(messages);
  const pendingRef = useRef(false);
  const epochRef = useRef(0);        // bumps on new/opened conversation; stale replies are dropped
  const abortRef = useRef(null);
  const msgSeq = useRef(0);
  const scrollRef = useRef(null);
  const composerRef = useRef(null);
  const scrollIntent = useRef(null); // { type: 'bottom' } | { type: 'reply', id }
  const paramsHandled = useRef(false);

  const nextId = () => `m${++msgSeq.current}`;

  useEffect(() => { messagesRef.current = messages; }, [messages]);
  useEffect(() => { localStorage.setItem(LANG_KEY, language); }, [language]);

  /* ── History ── */
  const refreshSessions = useCallback(async () => {
    const list = await listSessions(30);
    if (list === null) { setHistoryState('unavailable'); return; }
    setSessions(list);
    setHistoryState('ready');
  }, []);

  useEffect(() => { refreshSessions(); }, [refreshSessions]);

  /* ── Scrolling: own words go to the bottom; a reply is read from its start ── */
  useLayoutEffect(() => {
    const box = scrollRef.current;
    const intent = scrollIntent.current;
    if (!box || !intent) return;
    scrollIntent.current = null;
    if (intent.type === 'reply') {
      const el = box.querySelector(`[data-msg="${intent.id}"]`);
      if (el && el.offsetHeight > box.clientHeight * 0.6) {
        box.scrollTo({ top: el.offsetTop - 28, behavior: 'smooth' });
        return;
      }
    }
    box.scrollTo({ top: box.scrollHeight, behavior: intent.instant ? 'auto' : 'smooth' });
  }, [messages, pending]);

  /* ── Sending ── */
  const send = useCallback(async (rawText, { retryOf } = {}) => {
    const text = (rawText || '').trim();
    if (!text || pendingRef.current) return;

    pendingRef.current = true;
    setPending(true);
    setNotice(null);
    const epoch = epochRef.current;

    // History = everything already said in this thread that actually went through.
    const history = messagesRef.current
      .filter((m) => !m.failed && m.id !== retryOf)
      .map((m) => ({ role: m.role, text: m.text, persona: m.persona, shloka: m.shloka, counseling: m.counseling }));

    const userId = retryOf || nextId();
    if (retryOf) {
      setMessages((prev) => prev.map((m) => (m.id === retryOf ? { ...m, failed: false, error: null } : m)));
    } else {
      setMessages((prev) => [...prev, { id: userId, role: 'user', text, fresh: true }]);
    }
    scrollIntent.current = { type: 'bottom' };

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const data = await sendChat({
        message: text,
        language,
        history,
        sessionId: sessionIdRef.current,
        signal: controller.signal,
      });
      if (epoch !== epochRef.current) return; // the person moved on to another conversation

      if (data.sessionId) {
        sessionIdRef.current = data.sessionId;
        setActiveSessionId(data.sessionId);
      }
      const replyId = nextId();
      scrollIntent.current = { type: 'reply', id: replyId };
      setMessages((prev) => [...prev, {
        id: replyId,
        role: 'assistant',
        persona: data.persona || 'krishna',
        text: data.text,
        shloka: data.shloka,
        counseling: data.counseling,
        fresh: true,
      }]);
      refreshSessions();
    } catch (err) {
      if (epoch !== epochRef.current || err?.name === 'AbortError') return;
      setMessages((prev) => prev.map((m) => (m.id === userId ? { ...m, failed: true, error: err } : m)));
      scrollIntent.current = { type: 'bottom' };
    } finally {
      if (epoch === epochRef.current) {
        pendingRef.current = false;
        setPending(false);
        abortRef.current = null;
      }
    }
  }, [language, refreshSessions]);

  const onSendDraft = () => {
    const text = draft;
    setDraft('');
    send(text);
  };

  const onRetry = (m) => send(m.text, { retryOf: m.id });
  const onEdit = (m) => {
    setMessages((prev) => prev.filter((x) => x.id !== m.id));
    setDraft(m.text);
    setTimeout(() => composerRef.current?.focus(), 0);
  };

  /* ── Conversations ── */
  const resetThread = () => {
    epochRef.current += 1;
    abortRef.current?.abort();
    abortRef.current = null;
    pendingRef.current = false;
    setPending(false);
  };

  /** New chat is a new thread, not a new person: long-term memory lives on the server. */
  const startNew = () => {
    resetThread();
    setMessages([]);
    setNotice(null);
    sessionIdRef.current = null;
    setActiveSessionId(null);
    setPanelOpen(false);
    requestAnimationFrame(() => composerRef.current?.focus());
  };

  const openSession = useCallback(async (sid) => {
    if (!sid || sid === sessionIdRef.current) { setPanelOpen(false); return; }
    resetThread();
    const epoch = epochRef.current;
    setLoadingSession(true);
    setPanelOpen(false);
    setNotice(null);
    try {
      const data = await getSession(sid);
      if (epoch !== epochRef.current) return;
      const list = (data?.messages || []).map((m, i) => fromStored(m, i, sid));
      sessionIdRef.current = sid;
      setActiveSessionId(sid);
      scrollIntent.current = { type: 'bottom', instant: true };
      setMessages(list);
    } catch (err) {
      if (epoch !== epochRef.current) return;
      setNotice(
        err?.kind === 'notfound'
          ? 'That conversation could not be found. It may belong to another browser or account.'
          : err?.kind === 'unavailable'
            ? 'Past conversations are not available right now.'
            : describeError(err).body
      );
    } finally {
      if (epoch === epochRef.current) setLoadingSession(false);
    }
  }, []);

  /* ── Arriving with a topic (from the landing page) or a stored conversation ── */
  useEffect(() => {
    if (paramsHandled.current) return;
    paramsHandled.current = true;
    const topic = searchParams.get('topic');
    const sid = searchParams.get('session');
    const draftOnly = searchParams.get('draft') === '1';
    if (topic || sid) {
      // Only the arrival params are consumed; anything else (such as ?tier=) stays.
      const rest = new URLSearchParams(searchParams);
      ['topic', 'session', 'draft'].forEach((k) => rest.delete(k));
      setSearchParams(rest, { replace: true });
    }
    if (sid) openSession(sid);
    else if (topic && draftOnly) {
      setDraft(topic.slice(0, 3000));
      setTimeout(() => composerRef.current?.focus(), 500);
    } else if (topic) send(topic);
    else setTimeout(() => composerRef.current?.focus(), 700);
    // Runs once on arrival by design.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ── Drawer: Escape closes ── */
  useEffect(() => {
    if (!panelOpen) return undefined;
    const onKey = (e) => e.key === 'Escape' && setPanelOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [panelOpen]);

  /* ── On-screen keyboard: keep the header and the writing box inside what is visible ── */
  const seatRef = useRef(null);
  useEffect(() => {
    const vv = window.visualViewport;
    const seat = seatRef.current;
    if (!vv || !seat) return undefined;
    let frame = 0;
    const fit = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const keyboard = window.innerHeight - vv.height > 80;
        if (keyboard) {
          seat.style.setProperty('--seat-h', `${Math.round(vv.height)}px`);
          seat.style.setProperty('--seat-top', `${Math.round(vv.offsetTop)}px`);
        } else {
          seat.style.removeProperty('--seat-h');
          seat.style.removeProperty('--seat-top');
        }
      });
    };
    vv.addEventListener('resize', fit);
    vv.addEventListener('scroll', fit);
    return () => {
      cancelAnimationFrame(frame);
      vv.removeEventListener('resize', fit);
      vv.removeEventListener('scroll', fit);
    };
  }, []);

  const empty = messages.length === 0 && !loadingSession;

  const tier = useTier();
  const wide = useWide();
  const seated = wide && presenceSlot() !== null;
  const pickOpening = (s) => { setDraft(s); setTimeout(() => composerRef.current?.focus(), 0); };

  return (
    <div ref={seatRef} className={`seat ${seated ? 'seat--beside' : ''} ${empty ? 'is-empty' : ''}`} data-tier={tier}>
      <Morning />

      <SeatHeader
        language={language}
        onLanguage={setLanguage}
        onHistory={() => setPanelOpen(true)}
        onNew={startNew}
        panelOpen={panelOpen}
      />

      {seated && <Presence tier={tier} />}

      <main id="main" className="seat__main">
        <div className="seat__thread" ref={scrollRef}>
          <div className="seat__column">
            {notice && <p className="seat__notice" role="alert">{notice}</p>}

            {loadingSession && (
              <div className="seat__opening" role="status">
                <span className="ember ember--rest" aria-hidden="true" />
                <span>Opening your conversation…</span>
              </div>
            )}

            {empty && <Welcome language={language} onPick={pickOpening} showFace={!seated} tier={tier} />}

            {!empty && !loadingSession && (
              <div className="seat__list" aria-live="polite" aria-relevant="additions">
                {messages.map((m) =>
                  m.role === 'user' ? (
                    <UserMessage key={m.id} message={m} onRetry={onRetry} onEdit={onEdit} busy={pending} tier={tier} />
                  ) : (
                    <GuidanceMessage key={m.id} message={m} lang={language} tier={tier} />
                  )
                )}
                <AnimatePresence>{pending && <Reflecting key="reflecting" language={language} tier={tier} />}</AnimatePresence>
              </div>
            )}
          </div>
        </div>

        <div className="seat__composer">
          <Composer
            ref={composerRef}
            value={draft}
            onChange={setDraft}
            onSend={onSendDraft}
            pending={pending}
            language={language}
          />
        </div>
      </main>

      <HistoryPanel
        open={panelOpen}
        onClose={() => setPanelOpen(false)}
        sessions={sessions}
        historyState={historyState}
        activeSessionId={activeSessionId}
        loadingSession={loadingSession}
        onOpen={openSession}
        onNew={startNew}
        user={user}
        onSignIn={signIn}
      />
    </div>
  );
}
