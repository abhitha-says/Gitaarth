import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

/**
 * Listening, not loading: the small warm light the visitor carried through
 * the morning rests where the answer will begin and breathes slowly.
 */
export default function Reflecting({ language = 'en', tier = 'full' }) {
  const [slow, setSlow] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setSlow(true), 9000);
    return () => clearTimeout(t);
  }, []);

  const text = language === 'hi'
    ? (slow ? 'Thoda aur samay lag raha hai…' : 'Aapki baat par vichaar ho raha hai')
    : (slow ? 'Taking a little longer than usual…' : 'Reflecting on what you shared');
  const still = tier === 'still';

  return (
    <motion.div
      className="listening"
      role="status"
      aria-live="polite"
      initial={still ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.3 } }}
      transition={{ duration: 0.9, ease: [0.65, 0, 0.35, 1] }}
    >
      <span className="ember" aria-hidden="true" />
      <span className="listening__text">{text}</span>
    </motion.div>
  );
}
