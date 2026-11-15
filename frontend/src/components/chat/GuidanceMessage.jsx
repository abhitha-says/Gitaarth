import { motion } from 'framer-motion';
import { Bookmark, BookmarkCheck, Copy, Share2 } from 'lucide-react';
import { LotusMark } from '../Marks';
import VersePlate from '../VersePlate';
import { toParagraphs, Paragraph } from './RichText';
import { useKept, keyFor } from '../../utils/kept';
import { useToast } from '../../context/ToastContext';

const EASE = [0.65, 0, 0.35, 1];

function plainText(message) {
  const parts = [message.text];
  if (message.shloka) {
    const t = message.shloka.translation?.en || message.shloka.translation || '';
    parts.push(`${message.shloka.sanskrit || ''}\n“${t}”\n— Bhagavad Gita ${message.shloka.chapter}.${message.shloka.verse}`);
  }
  if (message.counseling) parts.push(message.counseling);
  return parts.filter(Boolean).join('\n\n');
}

export default function GuidanceMessage({ message, lang, tier = 'full' }) {
  const { isKept, toggle } = useKept();
  const toast = useToast();
  const paragraphs = toParagraphs(message.text);
  const id = keyFor('guidance', message.text || '');
  const kept = isKept(id);
  const canShare = typeof navigator !== 'undefined' && typeof navigator.share === 'function';
  const fresh = message.fresh && tier !== 'still';

  const onKeep = () => {
    const now = toggle({
      id,
      kind: 'guidance',
      text: message.text,
      counseling: message.counseling || '',
      ref: message.shloka ? `Bhagavad Gita ${message.shloka.chapter}.${message.shloka.verse}` : '',
      sanskrit: message.shloka?.sanskrit || '',
      verseText: message.shloka ? (message.shloka.translation?.en || message.shloka.translation || '') : '',
    });
    toast(now ? 'Kept in your sanctuary' : 'Removed from your sanctuary');
  };

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(plainText(message));
      toast('Copied');
    } catch {
      toast('Copying is not available here');
    }
  };

  const onShare = async () => {
    try {
      await navigator.share({ title: 'Guidance from Gitaarth', text: plainText(message) });
    } catch (err) {
      if (err?.name !== 'AbortError') onCopy();
    }
  };

  // Words spoken slowly: each paragraph rises through the air a breath after
  // the one before it, so a long answer arrives at about reading pace.
  const reveal = (i) =>
    fresh
      ? { initial: { opacity: 0, y: 8 }, animate: { opacity: 1, y: 0 }, transition: { duration: 1.1, ease: EASE, delay: 0.15 + i * 0.42 } }
      : {};

  return (
    <motion.article
      className="guidance"
      data-msg={message.id}
      aria-label="Guidance from Gitaarth"
      initial={fresh ? { opacity: 0 } : false}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <header className="guidance__head">
        <LotusMark size={16} className="guidance__mark" />
        <span className="guidance__src">
          {message.persona === 'ram' ? 'In the light of the Ramayana' : 'In the light of the Gita'}
        </span>
      </header>

      <div className="guidance__body">
        {paragraphs.map((p, i) => (
          <motion.div key={i} {...reveal(i)}>
            <Paragraph text={p} k={`${message.id}-${i}`} />
          </motion.div>
        ))}
      </div>

      {message.shloka && (
        <motion.div className="guidance__verse" {...reveal(paragraphs.length)}>
          <VersePlate verse={message.shloka} size="sm" lang={lang} />
        </motion.div>
      )}

      {message.counseling && (
        <motion.div className="guidance__ask" {...reveal(paragraphs.length + 1)}>
          <span className="guidance__ask-label">To sit with</span>
          <p>{message.counseling}</p>
        </motion.div>
      )}

      <motion.div className="guidance__actions" {...reveal(paragraphs.length + 2)}>
        <button type="button" className={`guidance__action ${kept ? 'is-on' : ''}`} onClick={onKeep} aria-pressed={kept}>
          {kept ? <BookmarkCheck aria-hidden="true" /> : <Bookmark aria-hidden="true" />}
          {kept ? 'Kept' : 'Keep'}
        </button>
        <button type="button" className="guidance__action" onClick={onCopy}>
          <Copy aria-hidden="true" /> Copy
        </button>
        {canShare && (
          <button type="button" className="guidance__action" onClick={onShare}>
            <Share2 aria-hidden="true" /> Share
          </button>
        )}
      </motion.div>
    </motion.article>
  );
}
