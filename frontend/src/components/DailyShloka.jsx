import { useState, useEffect } from 'react';
import { SAMPLE_SHLOKAS } from '../utils/constants';
import './DailyShloka.css';

export default function DailyShloka() {
  const [shloka, setShloka] = useState(null);
  const [lang] = useState('en');

  useEffect(() => {
    // Pick a "daily" shloka based on the day of the year
    const dayOfYear = Math.floor(
      (Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000
    );
    const index = dayOfYear % SAMPLE_SHLOKAS.length;
    setShloka(SAMPLE_SHLOKAS[index]);
  }, []);

  if (!shloka) return null;

  return (
    <div className="daily-shloka" id="daily-shloka">
      <div className="daily-shloka__header">
        <span className="material-symbols-outlined daily-shloka__icon">menu_book</span>
        <span className="daily-shloka__label">Shloka of the Day</span>
      </div>

      <div className="daily-shloka__sanskrit sanskrit-text">
        {shloka.sanskrit}
      </div>

      <div className="daily-shloka__divider">
        <span className="daily-shloka__om">ॐ</span>
      </div>

      <p className="daily-shloka__translation">
        {shloka.translation[lang]}
      </p>

      <div className="daily-shloka__footer">
        <span className="daily-shloka__ref">
          Bhagavad Gita · Chapter {shloka.chapter} ({shloka.chapterNameSanskrit}) · Verse {shloka.verse}
        </span>
        <button className="daily-shloka__share" aria-label="Share shloka" id="share-daily-shloka">
          <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>share</span>
        </button>
      </div>
    </div>
  );
}
