import { useId, useState } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { keptLabel, shortDate } from './format';

const EASE = [0.22, 1, 0.36, 1];
const LONG = 280; // characters before a kept reply is folded

/**
 * One kept thing on the shelf. A verse lies as a palm leaf with its cord
 * hole; a reply from Gitaarth is a folded slip of paper beside it.
 */
export default function KeptLeaf({ item, index, still, onRemove }) {
  const [open, setOpen] = useState(false);
  const bodyId = useId();
  const isVerse = item.kind === 'verse';
  const firstLine = (item.sanskrit || '').split('\n').find(Boolean);
  const long = !isVerse && (item.text || '').length > LONG;
  const date = shortDate(item.keptAt);
  const refLine = isVerse
    ? [item.ref, item.chapterName].filter(Boolean).join(' · ')
    : item.ref || 'Guidance from Gitaarth';

  return (
    <motion.li
      layout={still ? false : 'position'}
      className={`kept-item kept-item--${isVerse ? 'leaf' : 'slip'}`}
      initial={still ? false : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={still ? { opacity: 0, transition: { duration: 0 } } : { opacity: 0, y: -12, transition: { duration: 0.2, ease: EASE } }}
      transition={{ duration: 0.6, ease: EASE, delay: still ? 0 : Math.min(index, 5) * 0.06 }}
    >
      <article className={`kept-card ${isVerse ? 'leaf' : 'paper'}`} aria-label={isVerse ? item.ref || 'Kept verse' : 'Kept guidance'}>
        {isVerse && <span className="kept-card__hole" aria-hidden="true" />}
        <div className="kept-card__body">
          {!isVerse && <p className="kept-card__kind">Guidance from Gitaarth</p>}
          {firstLine && (
            <p className="kept-card__sa sanskrit" lang="sa">{firstLine}</p>
          )}
          <p id={bodyId} className={`kept-card__text${long && !open ? ' is-folded' : ''}`}>
            {isVerse ? `“${item.text}”` : item.text}
          </p>
          {long && (
            <button
              type="button"
              className="kept-card__more"
              aria-expanded={open}
              aria-controls={bodyId}
              onClick={() => setOpen((v) => !v)}
            >
              {open ? 'Fold it again' : 'Read all of it'}
            </button>
          )}
          {!isVerse && item.verseText && <p className="kept-card__verse">“{item.verseText}”</p>}
          <div className="kept-card__foot">
            <p className="kept-card__ref">
              <span>{refLine}</span>
              {date && <span className="kept-card__date">Kept {date}</span>}
            </p>
            <button
              type="button"
              className="icon-btn kept-card__remove"
              onClick={() => onRemove(item)}
              aria-label={`Remove ${keptLabel(item)} from kept words`}
            >
              <X aria-hidden="true" />
            </button>
          </div>
        </div>
      </article>
    </motion.li>
  );
}
