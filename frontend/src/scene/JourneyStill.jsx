import { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import LivingImage from './LivingImage';
import { art } from './art';
import { setSun } from './sun';
import './scene.css';
import './Journey.css';

/**
 * The same morning, held still, for visitors who ask for less motion:
 * nothing is pinned, nothing moves. The sun is already up, Krishna is
 * already there, and the question is already waiting.
 */
export default function JourneyStill({ paths, question, onAsk }) {
  const [text, setText] = useState('');
  const plate = art('field-dawn-wide') || art('field-dawn-tall');
  useEffect(() => { setSun(0.8); }, []);

  return (
    <section className="j-still" aria-label="A morning at Kurukshetra">
      <div className="j-still__land" aria-hidden="true">
        {plate ? <img src={plate.src} alt="" decoding="async" /> : <div className="j-plate__bare" />}
        <div className="j-still__sun" />
      </div>
      <div className="j-still__inner">
        <div className="j-still__face">
          <LivingImage slot="krishna-face" live={false} eager alt="Shri Krishna, smiling gently" />
        </div>
        <div className="j-still__words">
          <h1 className="j-title display">
            <span>Some answers</span>
            <span>are not found.</span>
            <span><em>They are understood.</em></span>
          </h1>
          <blockquote className="j-still__quote">
            <p className="j-quote">“{question.text}”</p>
            <footer className="j-ref">{question.ref}</footer>
          </blockquote>
          <div className="j-ask is-on j-still__ask">
            <h2 className="j-ask__q display">What rests on your heart <em>today?</em></h2>
            <form className="j-ask__form" onSubmit={(e) => { e.preventDefault(); onAsk(e, text.trim()); }}>
              <label className="sr-only" htmlFor="j-still-input">Write what is on your heart</label>
              <div className="j-ask__box">
                <input
                  id="j-still-input"
                  type="text"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Say it as you would to a friend"
                  autoComplete="off"
                  enterKeyHint="go"
                  maxLength={600}
                />
                <button type="submit" className="j-ask__go" aria-label="Seek guidance"><ArrowRight aria-hidden="true" /></button>
              </div>
            </form>
            <ul className="j-ask__paths">
              {paths.map((path) => (
                <li key={path.label}>
                  <button type="button" onClick={(e) => onAsk(e, path.prompt)}>{path.label}</button>
                </li>
              ))}
            </ul>
            <p className="j-ask__note">Free · No sign-up needed · English &amp; Hinglish</p>
          </div>
        </div>
      </div>
    </section>
  );
}
