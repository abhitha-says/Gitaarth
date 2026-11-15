import { motion } from 'framer-motion';
import './PortalArch.css';

const EASE = [0.22, 1, 0.36, 1];

/**
 * The door of light: the supplied Vishwaroop artwork set inside a temple
 * doorway, with slow rays and a sacred-geometry halo behind it.
 */
export default function PortalArch({ caption = true }) {
  return (
    <motion.figure
      className="portal"
      initial={{ opacity: 0, y: 40, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 1.8, ease: EASE, delay: 0.15 }}
    >
      <div className="portal__rays" aria-hidden="true" />
      <div className="portal__bloom" aria-hidden="true" />

      <svg className="portal__halo" viewBox="0 0 400 400" aria-hidden="true">
        <circle cx="200" cy="200" r="196" />
        <circle cx="200" cy="200" r="168" className="portal__halo-dots" />
        <circle cx="200" cy="200" r="140" />
        {Array.from({ length: 24 }).map((_, i) => {
          const a = (i / 24) * Math.PI * 2;
          return (
            <line
              key={i}
              x1={200 + Math.cos(a) * 144}
              y1={200 + Math.sin(a) * 144}
              x2={200 + Math.cos(a) * 164}
              y2={200 + Math.sin(a) * 164}
            />
          );
        })}
      </svg>

      <svg className="portal__frame" viewBox="0 0 300 560" preserveAspectRatio="none" aria-hidden="true">
        <path d="M6 556V150A144 144 0 0 1 294 150V556" />
        <path d="M22 556V156A128 128 0 0 1 278 156V556" className="portal__frame-inner" />
      </svg>

      <div className="portal__arch">
        <img
          src="/img/vishwaroop-portal.webp"
          alt="Krishna reveals the Vishwaroop, his universal form, to Arjuna, who kneels before him in prayer"
          width="1024"
          height="1024"
          fetchPriority="high"
          decoding="async"
        />
        <div className="portal__inner-light" aria-hidden="true" />
      </div>

      <div className="portal__plinth" aria-hidden="true" />

      {caption && (
        <figcaption className="portal__caption">
          <span className="sanskrit">विश्वरूप</span>
          <span className="portal__caption-sep" />
          <span>Bhagavad Gita · Chapter XI</span>
        </figcaption>
      )}
    </motion.figure>
  );
}
