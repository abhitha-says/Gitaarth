import { ArrowRight } from 'lucide-react';

/**
 * Where the entrance comes to rest, which is also the Home hero: his form in an
 * arched window, and beneath it the question.
 */
export default function Rest({ heroRef, on = true, inputId, text, setText, onSubmit, onFocus, paths, onAsk, onReplay, alt = '' }) {
  const tab = on ? 0 : -1;
  return (
    <div className="ent__rest">
      <div ref={heroRef} className="ent__hero">
        <div className="ent__arch">
          <picture>
            <source media="(max-aspect-ratio: 9/10)" type="image/avif" srcSet="/entrance/hero-tall.avif" />
            <source media="(max-aspect-ratio: 9/10)" type="image/webp" srcSet="/entrance/hero-tall.webp" />
            <source type="image/avif" srcSet="/entrance/hero.avif" />
            <img src="/entrance/hero.webp" alt={alt} decoding="async" fetchPriority="high" />
          </picture>
        </div>
      </div>
      <div className={`ent__ask arrive ${on ? 'is-on' : ''}`}>
        <h1 className="ent__q display" style={{ '--i': 0 }}>What rests on your heart <em>today?</em></h1>
        <form className="ent__form" style={{ '--i': 5 }} onSubmit={onSubmit}>
          <label className="sr-only" htmlFor={inputId}>Write what is on your heart</label>
          <div className="ent__box">
            <input
              id={inputId}
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              onFocus={onFocus}
              placeholder="Say it as you would to a friend"
              autoComplete="off"
              enterKeyHint="go"
              maxLength={600}
              tabIndex={tab}
            />
            <button type="submit" className="ent__go" aria-label="Seek guidance" tabIndex={tab}><ArrowRight aria-hidden="true" /></button>
          </div>
        </form>
        <ul className="ent__paths" style={{ '--i': 9 }}>
          {paths.map((path) => (
            <li key={path.label}><button type="button" tabIndex={tab} onClick={(e) => onAsk(e, path.prompt)}>{path.label}</button></li>
          ))}
        </ul>
        <p className="ent__note" style={{ '--i': 12 }}>
          Free · No sign-up needed · English &amp; Hinglish
          {onReplay && <> · <button type="button" className="ent__replay" onClick={onReplay}>See the entrance again</button></>}
        </p>
      </div>
    </div>
  );
}
