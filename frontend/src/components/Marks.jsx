/** Gitaarth brand marks: a temple doorway holding a lotus flame. */
export function ArchMark({ size = 28, className = '' }) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="am-g" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#d1a24c" />
          <stop offset="1" stopColor="#87611f" />
        </linearGradient>
      </defs>
      <path d="M8 27V14.5a8 8 0 0 1 16 0V27" stroke="url(#am-g)" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M16 10.5c-2 2.3-2 5.4 0 7.7 2-2.3 2-5.4 0-7.7z" fill="url(#am-g)" />
      <path d="M11.4 19.6c1.6 0 3.3.8 4.6 2.4 1.3-1.6 3-2.4 4.6-2.4-.7 2.4-2.5 4-4.6 4s-3.9-1.6-4.6-4z" fill="url(#am-g)" opacity=".8" />
      <path d="M5.5 27h21" stroke="url(#am-g)" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

export function LotusMark({ size = 22, className = '' }) {
  return (
    <svg className={className} width={size} height={size * 0.62} viewBox="0 0 40 25" fill="none" aria-hidden="true">
      <path d="M20 2c-3.6 4.2-3.6 10 0 15 3.6-5 3.6-10.8 0-15z" fill="currentColor" />
      <path d="M8.5 7.5c2.9 1.2 6.7 4.6 9.6 10.6C12.4 17.5 9 13.4 8.5 7.5z" fill="currentColor" opacity=".7" />
      <path d="M31.5 7.5c-2.9 1.2-6.7 4.6-9.6 10.6 5.7-.6 9.1-4.7 9.6-10.6z" fill="currentColor" opacity=".7" />
      <path d="M1 14c4.4-.6 10.6 1.6 17.4 6.6C10.6 22.4 4.4 19.6 1 14z" fill="currentColor" opacity=".45" />
      <path d="M39 14c-4.4-.6-10.6 1.6-17.4 6.6 7.8 1.8 14-1 17.4-6.6z" fill="currentColor" opacity=".45" />
      <path d="M6 23.5h28" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity=".6" />
    </svg>
  );
}

/** A centred hairline with a lotus, used to divide sacred text. */
export function Ornament({ className = '' }) {
  return (
    <div className={`ornament ${className}`} aria-hidden="true">
      <span className="ornament__line" />
      <LotusMark size={22} className="ornament__lotus" />
      <span className="ornament__line" />
    </div>
  );
}
