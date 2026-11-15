import './DeityAvatar.css';

/**
 * A small circular window onto the supplied Vishwaroop artwork, framed on
 * Krishna's face. The artwork itself is untouched; only the framing changes.
 */
export default function DeityAvatar({ size = 40, className = '' }) {
  return (
    <span
      className={`deity-avatar ${className}`}
      style={{ '--size': `${size}px` }}
      role="img"
      aria-label="Krishna, from the Vishwaroop artwork"
    />
  );
}
