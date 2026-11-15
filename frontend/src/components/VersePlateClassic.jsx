// The verse card exactly as it was before the palm-leaf Library; used only by LibraryClassic.
import { Bookmark, BookmarkCheck, Copy, MessageCircle } from 'lucide-react';
import { Ornament } from './Marks';
import { useKept, keyFor } from '../utils/kept';
import { useToast } from '../context/ToastContext';
import { chapterOf } from '../utils/verses';
import './VersePlateClassic.css';

function translationOf(verse, lang) {
  const t = verse.translation;
  if (!t) return '';
  if (typeof t === 'string') return t;
  return t[lang] || t.en || '';
}

/**
 * A verse, set like an inscription: Sanskrit, a lotus rule, the meaning,
 * and its place in the text. Used on the landing page, in the library and
 * inside guidance.
 *
 * source: 'gita' | 'ramayana'
 */
export default function VersePlateClassic({
  verse,
  source = 'gita',
  size = 'md',
  lang = 'en',
  showAlt = false,
  actions = false,
  onReflect,
  className = '',
}) {
  const { isKept, toggle } = useKept();
  const toast = useToast();
  if (!verse) return null;

  const isGita = source === 'gita';
  const chapter = isGita ? chapterOf(verse.chapter) : null;
  const meaning = translationOf(verse, lang);
  const alt = showAlt && typeof verse.translation === 'object' && lang === 'en' ? verse.translation.hi : '';
  const ref = isGita ? `Bhagavad Gita ${verse.chapter}.${verse.verse}` : verse.reference || 'Valmiki Ramayana';
  const chapterName = isGita ? verse.chapterName || chapter?.name : '';
  const id = isGita ? `gita-${verse.chapter}-${verse.verse}` : keyFor('ram', verse.sanskrit || meaning);
  const kept = isKept(id);
  const lines = (verse.sanskrit || '').split('\n').filter(Boolean);

  const onKeep = () => {
    const nowKept = toggle({
      id,
      kind: 'verse',
      source,
      ref,
      chapterName: chapterName || '',
      sanskrit: verse.sanskrit || '',
      text: meaning,
    });
    toast(nowKept ? 'Kept in your sanctuary' : 'Removed from your sanctuary');
  };

  const onCopy = async () => {
    const body = `${verse.sanskrit ? `${verse.sanskrit}\n\n` : ''}“${meaning}”\n— ${ref}`;
    try {
      await navigator.clipboard.writeText(body);
      toast('Verse copied');
    } catch {
      toast('Copying is not available here');
    }
  };

  return (
    <figure className={`cverse cverse--${size} ${className}`}>
      {lines.length > 0 && (
        <blockquote className="cverse__sanskrit" lang="sa">
          {lines.map((line, i) => <span key={i}>{line}</span>)}
        </blockquote>
      )}
      <Ornament className="cverse__ornament" />
      {meaning && <p className="cverse__meaning">“{meaning}”</p>}
      {alt && <p className="cverse__alt">{alt}</p>}
      <figcaption className="cverse__ref">
        <span>{ref}</span>
        {chapterName && <><span className="cverse__ref-dot" aria-hidden="true" /><span>{chapterName}</span></>}
      </figcaption>

      {actions && (
        <div className="cverse__actions">
          {onReflect && (
            <button type="button" className="cverse__action verse__action--primary" onClick={onReflect}>
              <MessageCircle aria-hidden="true" /> Reflect on this
            </button>
          )}
          <button type="button" className={`cverse__action ${kept ? 'is-on' : ''}`} onClick={onKeep} aria-pressed={kept}>
            {kept ? <BookmarkCheck aria-hidden="true" /> : <Bookmark aria-hidden="true" />}
            {kept ? 'Kept' : 'Keep'}
          </button>
          <button type="button" className="cverse__action" onClick={onCopy}>
            <Copy aria-hidden="true" /> Copy
          </button>
        </div>
      )}
    </figure>
  );
}
