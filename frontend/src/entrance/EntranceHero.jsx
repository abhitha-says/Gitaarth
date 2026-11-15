import { useState } from 'react';
import Rest from './Rest';
import './Entrance.css';

/**
 * Where the entrance comes to rest, without the film: for a visitor who has
 * already entered this session, or who has asked for less motion.
 */
export default function EntranceHero({ paths, onAsk, onReplay }) {
  const [text, setText] = useState('');
  return (
    <section className="ent ent--static" aria-label="Gitaarth">
      <div className="ent__stage is-bright is-asking">
        <Rest
          inputId="ent-hero-input"
          text={text}
          setText={setText}
          onSubmit={(e) => { e.preventDefault(); onAsk(e, text.trim()); }}
          paths={paths}
          onAsk={onAsk}
          onReplay={onReplay}
          alt="Shri Krishna in his four-armed form, holding the discus and the conch, in golden cloud"
        />
      </div>
    </section>
  );
}
