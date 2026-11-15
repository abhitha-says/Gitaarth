import { motion } from 'framer-motion';
import LivingImage from '../../scene/LivingImage';
import { art } from '../../scene/art';
import { LotusMark } from '../Marks';

const EASE = [0.65, 0, 0.35, 1];

const COPY = {
  en: {
    title: 'Welcome, dear soul.',
    lines: [
      'Whatever rests upon your heart, you may share it here.',
      'Sometimes, clarity begins with expressing what troubles us.',
    ],
    ask: 'What would you like to talk about today?',
    hint: 'Choose a beginning, or write your own',
    starters: [
      "I can't decide what to do about my career.",
      "I've been feeling lonely lately.",
      "I'm afraid I'm going to fail.",
      'I lost someone, and I miss them.',
    ],
  },
  hi: {
    title: 'Aaiye, swagat hai.',
    lines: [
      'Jo bhi aapke mann par bhaari hai, aap yahan keh sakte hain.',
      'Kabhi kabhi spashtata wahin se shuru hoti hai, jab hum apni pareshani keh dete hain.',
    ],
    ask: 'Aaj aap kis baare mein baat karna chahenge?',
    hint: 'Ek shuruaat chuniye, ya apne shabdon mein likhiye',
    starters: [
      'Career ko lekar faisla nahi kar paa raha hoon.',
      'Aajkal bahut akela mehsoos hota hai.',
      'Mujhe darr hai ki main fail ho jaunga.',
      'Maine kisi apne ko khoya hai.',
    ],
  },
};

/**
 * The empty conversation: where the visitor sits down. On a phone Krishna's
 * face rests above the words and melts into the page; on a wide screen he is
 * already seated beside the column, so only the words are shown here.
 */
export default function Welcome({ language = 'en', onPick, showFace = true, tier = 'full' }) {
  const c = COPY[language] || COPY.en;
  const still = tier === 'still';
  const face = showFace && art('krishna-face');
  // Lines arrive one after another, rising a little through the morning air.
  const arrive = (i) => (still
    ? {}
    : {
      initial: { opacity: 0, y: 14 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 1.2, ease: EASE, delay: 0.25 + i * 0.09 },
    });

  return (
    <section className="welcome" aria-labelledby="welcome-title">
      {face ? (
        <motion.div
          className="welcome__face"
          initial={still ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.6, ease: EASE }}
        >
          <LivingImage slot="krishna-face" alt="Krishna, smiling gently" live={tier === 'full'} haze={0.15} light={0.85} eager />
        </motion.div>
      ) : (
        showFace && <LotusMark size={28} className="welcome__mark" />
      )}

      <motion.h1 id="welcome-title" className="welcome__title" {...arrive(0)}>{c.title}</motion.h1>

      <div className="welcome__lines">
        {c.lines.map((l, i) => <motion.p key={l} {...arrive(i + 1)}>{l}</motion.p>)}
        <motion.p className="welcome__ask" {...arrive(c.lines.length + 1)}>{c.ask}</motion.p>
      </div>

      <motion.div className="welcome__openings" {...arrive(c.lines.length + 3)}>
        <p className="welcome__hint" id="welcome-hint">{c.hint}</p>
        <ul className="welcome__paths" aria-labelledby="welcome-hint">
          {c.starters.map((s) => (
            <li key={s}>
              <button type="button" className="welcome__path" onClick={() => onPick(s)}>
                {s}
              </button>
            </li>
          ))}
        </ul>
      </motion.div>
    </section>
  );
}
