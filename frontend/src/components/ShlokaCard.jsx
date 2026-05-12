import './ShlokaCard.css';

export default function ShlokaCard({ shloka, lang = 'en', compact = false }) {
  if (!shloka) return null;

  const ref = `Bhagavad Gita ${shloka.chapter}.${shloka.verse}`;

  return (
    <div className={`shloka-card ${compact ? 'shloka-card--compact' : ''}`} id={`shloka-${shloka.id}`}>
      <div className="shloka-card__header">
        <span className="verse-chip">{ref}</span>
        <button className="shloka-card__bookmark" aria-label="Bookmark verse">
          <span className="material-symbols-outlined">bookmark_add</span>
        </button>
      </div>

      <p className="shloka-card__quote">
        "{shloka.translation?.[lang] || shloka.translation?.en || shloka.sanskrit}"
      </p>
    </div>
  );
}
