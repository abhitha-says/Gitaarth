import { motion } from 'framer-motion';
import { RotateCcw, PencilLine } from 'lucide-react';
import { describeError } from '../../utils/api';

const EASE = [0.22, 1, 0.36, 1];

/** The visitor's own words: set apart by alignment, a fine rule and ink, not by a bubble. */
export default function UserMessage({ message, onRetry, onEdit, busy, tier = 'full' }) {
  const err = message.failed ? describeError(message.error) : null;
  const still = tier === 'still';
  return (
    <motion.div
      className="said"
      data-msg={message.id}
      initial={message.fresh && !still ? { opacity: 0, y: 10 } : false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: EASE }}
    >
      <p className={`said__words ${message.failed ? 'is-failed' : ''}`}>
        <span className="sr-only">You said: </span>{message.text}
      </p>

      {err && (
        <motion.div
          className="said__error"
          role="alert"
          initial={still ? false : { opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: EASE }}
        >
          <p className="said__error-title"><span className="said__error-mark" aria-hidden="true" />{err.title}</p>
          <p className="said__error-body">{err.body}</p>
          <div className="said__error-actions">
            <button type="button" className="btn btn--gold btn--sm" onClick={() => onRetry(message)} disabled={busy}>
              <RotateCcw aria-hidden="true" /> Try again
            </button>
            <button type="button" className="btn btn--ghost btn--sm" onClick={() => onEdit(message)} disabled={busy}>
              <PencilLine aria-hidden="true" /> Edit message
            </button>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
