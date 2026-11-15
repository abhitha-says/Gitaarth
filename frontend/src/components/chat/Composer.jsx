import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { ArrowUp } from 'lucide-react';

const MAX = 3000;

/**
 * The place where a person writes, and where the Home journey ends: the
 * small warm light rests at the start of the line until they begin, then
 * gives way to a saffron caret. Grows with their words, never steals them:
 * typing stays open while a reply is on its way.
 */
const Composer = forwardRef(function Composer({ value, onChange, onSend, pending, language }, ref) {
  const areaRef = useRef(null);
  const [focused, setFocused] = useState(false);
  // Focus with the caret after the last word, so a chosen beginning can be continued
  useImperativeHandle(ref, () => ({
    focus: () => {
      const el = areaRef.current;
      if (!el) return;
      el.focus();
      const end = el.value.length;
      el.setSelectionRange(end, end);
    },
  }), []);

  // Auto-grow up to ~7 lines; one line when empty. Re-measure when the width
  // changes, since a measurement taken before layout settles can be far too tall.
  useEffect(() => {
    const el = areaRef.current;
    if (!el) return undefined;
    const fit = () => {
      if (!el.value) { el.style.height = ''; return; }
      el.style.height = 'auto';
      el.style.height = `${Math.min(el.scrollHeight, 220)}px`;
    };
    fit();
    let lastWidth = el.clientWidth;
    const ro = new ResizeObserver(() => {
      if (el.clientWidth !== lastWidth) { lastWidth = el.clientWidth; fit(); }
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [value]);

  const canSend = value.trim().length > 0 && !pending;
  const coarse = typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches;

  const onKeyDown = (e) => {
    if (e.key !== 'Enter' || e.shiftKey || e.nativeEvent.isComposing) return;
    // On touch keyboards Enter makes a new line; the button sends.
    if (coarse) return;
    e.preventDefault();
    if (canSend) onSend();
  };

  const placeholder = language === 'hi' ? 'Jo mann mein hai, yahan likhiye…' : 'Share what is on your mind…';
  const near = value.length > MAX - 300;

  return (
    <form
      className="composer"
      onSubmit={(e) => { e.preventDefault(); if (canSend) onSend(); }}
    >
      <div className={`composer__field ${focused ? 'is-focused' : ''} ${canSend ? 'is-ready' : ''}`}>
        <label htmlFor="composer-input" className="sr-only">Share what is on your mind</label>
        <span className={`composer__ember ${pending ? 'is-away' : focused || value ? 'is-caret' : ''}`} aria-hidden="true" />
        <textarea
          id="composer-input"
          ref={areaRef}
          className="composer__input"
          value={value}
          onChange={(e) => onChange(e.target.value.slice(0, MAX))}
          onKeyDown={onKeyDown}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={placeholder}
          rows={1}
          maxLength={MAX}
          enterKeyHint={coarse ? 'enter' : 'send'}
        />
        <button type="submit" className="composer__send" disabled={!canSend} aria-label="Send message">
          <ArrowUp aria-hidden="true" strokeWidth={2.25} />
        </button>
      </div>
      <p className="composer__note">
        {near ? <span className="composer__count">{value.length} / {MAX}</span> : null}
        Gitaarth is an AI companion inspired by the Bhagavad Gita. It can be mistaken, and it is not a substitute for professional help.
      </p>
    </form>
  );
});

export default Composer;
