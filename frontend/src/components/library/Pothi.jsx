import { useEffect, useRef, useState } from 'react';
import { toDevanagari, toRoman } from '../../utils/verses';
import './Pothi.css';

/* How long the cord takes to loosen and the leaf to slide out before the chapter opens */
const DRAW_MS = 360;

/* Leaves in a real bundle are never cut to one length: each end differs by a
   few pixels while the string holes stay in line. Fixed, so it never jumps. */
const ENDS = [[0, 2], [3, 0], [1, 4], [4, 1], [0, 0], [2, 3], [5, 1], [1, 2], [3, 5],
  [0, 1], [2, 0], [4, 3], [1, 5], [3, 1], [0, 3], [5, 0], [2, 2], [1, 4]];
const AGE = [0.02, 0.06, 0.03, 0.08, 0.01, 0.05, 0.09, 0.04, 0.02, 0.07, 0.03, 0.05, 0.1, 0.02, 0.06, 0.04, 0.08, 0.03];

function leafVars(i) {
  const [l, r] = ENDS[i % ENDS.length];
  return { '--el': `${l}px`, '--er': `${r}px`, '--age': AGE[i % AGE.length] };
}

/** The bow the cord is tied in, resting on the top cover. */
function Knot() {
  return (
    <svg className="pothi__knot" viewBox="0 0 44 58" width="44" height="58" aria-hidden="true">
      <g fill="none" strokeLinecap="round" strokeLinejoin="round">
        <g className="pothi__knot-shade" stroke="rgba(92, 62, 40, 0.28)" strokeWidth="3.4" transform="translate(1.4 1.8)">
          <path d="M22 17C13 5 3 9 8 17.5c3 4.6 9.5 3.2 14-.5" />
          <path d="M22 17c9-12 19-8 14 .5-3 4.6-9.5 3.2-14-.5" />
          <path d="M21 19c-2 9-5 18-10 34" />
          <path d="M23 19c2.5 8 6.5 15.5 13 27" />
        </g>
        <g stroke="#a24a25" strokeWidth="3.2">
          <path d="M22 17C13 5 3 9 8 17.5c3 4.6 9.5 3.2 14-.5" />
          <path d="M22 17c9-12 19-8 14 .5-3 4.6-9.5 3.2-14-.5" />
          <path d="M21 19c-2 9-5 18-10 34" />
          <path d="M23 19c2.5 8 6.5 15.5 13 27" />
        </g>
        <g stroke="rgba(246, 196, 140, 0.75)" strokeWidth="1.1" strokeDasharray="1.6 2.4">
          <path d="M22 17C13 5 3 9 8 17.5c3 4.6 9.5 3.2 14-.5" />
          <path d="M22 17c9-12 19-8 14 .5-3 4.6-9.5 3.2-14-.5" />
          <path d="M21 19c-2 9-5 18-10 34" />
          <path d="M23 19c2.5 8 6.5 15.5 13 27" />
        </g>
        <ellipse cx="22" cy="17.6" rx="3.9" ry="3.4" fill="#8f3f1f" stroke="none" />
        <ellipse cx="21.2" cy="16.7" rx="1.6" ry="1.2" fill="rgba(246, 196, 140, 0.55)" stroke="none" />
      </g>
    </svg>
  );
}

/**
 * The chapter index as a pothi: eighteen palm leaves between two rosewood
 * covers, strung on a cord through two holes and tied in a bow. Choosing a
 * leaf loosens the cord and draws that leaf out; then the chapter opens.
 */
export default function Pothi({ chapters, onOpen, still = false }) {
  const [drawing, setDrawing] = useState(null);
  const timer = useRef(0);

  useEffect(() => () => clearTimeout(timer.current), []);

  const open = (n) => {
    if (drawing) return;
    if (still) { onOpen(n); return; }
    setDrawing(n);
    timer.current = setTimeout(() => onOpen(n), DRAW_MS);
  };

  return (
    <div className={`pothi ${still ? '' : 'pothi--arrive'} ${drawing ? 'is-untied' : ''}`}>
      <span className="pothi__cord pothi__cord--l" aria-hidden="true" />
      <span className="pothi__cord pothi__cord--r" aria-hidden="true" />

      <div className="pothi__cover pothi__cover--top" aria-hidden="true">
        <span className="pothi__tie pothi__tie--l" />
        <span className="pothi__tie pothi__tie--r" />
        <Knot />
      </div>

      <ol className="pothi__leaves">
        {chapters.map((c, i) => (
          <li key={c.num} className={`pleaf ${drawing === c.num ? 'is-drawn' : ''}`} style={leafVars(i)}>
            <button type="button" className="pleaf__face" onClick={() => open(c.num)}>
              <span className="pleaf__num">
                <span className="pleaf__dev sanskrit" aria-hidden="true">{toDevanagari(c.num)}</span>
                <span className="pleaf__roman"><span className="sr-only">Chapter </span>{toRoman(c.num)}</span>
              </span>
              <span className="pleaf__main">
                <span className="pleaf__names">
                  <span className="pleaf__name">{c.name}</span>
                  <span className="pleaf__sa sanskrit" lang="sa">{c.nameSanskrit}</span>
                </span>
                <span className="pleaf__theme">{c.theme}</span>
              </span>
              <span className="pleaf__count">
                <b>{c.verses}</b>
                <span>verses</span>
              </span>
            </button>
          </li>
        ))}
      </ol>

      <div className="pothi__cover pothi__cover--bottom" aria-hidden="true" />
    </div>
  );
}
