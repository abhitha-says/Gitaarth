import { useState } from 'react';
import { Search, ChevronDown, ChevronUp, BookOpen, Quote } from 'lucide-react';
import { GITA_SHLOKAS } from '../utils/shlokaData';
import { RAM_QUOTES } from '../utils/ramayanaData';
import './Library.css';

const CHAPTERS = [
  { num: 1, name: 'Arjuna Vishada Yoga', nameSanskrit: 'अर्जुनविषादयोग', verses: 47 },
  { num: 2, name: 'Sankhya Yoga', nameSanskrit: 'सांख्ययोग', verses: 72 },
  { num: 3, name: 'Karma Yoga', nameSanskrit: 'कर्मयोग', verses: 43 },
  { num: 4, name: 'Jnana Karma Sanyasa Yoga', nameSanskrit: 'ज्ञानकर्मसंन्यासयोग', verses: 42 },
  { num: 5, name: 'Karma Sanyasa Yoga', nameSanskrit: 'कर्मसंन्यासयोग', verses: 29 },
  { num: 6, name: 'Dhyana Yoga', nameSanskrit: 'ध्यानयोग', verses: 47 },
  { num: 7, name: 'Jnana Vijnana Yoga', nameSanskrit: 'ज्ञानविज्ञानयोग', verses: 30 },
  { num: 8, name: 'Akshara Brahma Yoga', nameSanskrit: 'अक्षरब्रह्मयोग', verses: 28 },
  { num: 9, name: 'Raja Vidya Raja Guhya Yoga', nameSanskrit: 'राजविद्याराजगुह्ययोग', verses: 34 },
  { num: 10, name: 'Vibhuti Yoga', nameSanskrit: 'विभूतियोग', verses: 42 },
  { num: 11, name: 'Vishwaroop Darshan Yoga', nameSanskrit: 'विश्वरूपदर्शनयोग', verses: 55 },
  { num: 12, name: 'Bhakti Yoga', nameSanskrit: 'भक्तियोग', verses: 20 },
  { num: 13, name: 'Kshetra Kshetrajna Vibhaga Yoga', nameSanskrit: 'क्षेत्रक्षेत्रज्ञविभागयोग', verses: 35 },
  { num: 14, name: 'Gunatraya Vibhaga Yoga', nameSanskrit: 'गुणत्रयविभागयोग', verses: 27 },
  { num: 15, name: 'Purushottama Yoga', nameSanskrit: 'पुरुषोत्तमयोग', verses: 20 },
  { num: 16, name: 'Daivasura Sampad Vibhaga Yoga', nameSanskrit: 'दैवासुरसम्पद्विभागयोग', verses: 24 },
  { num: 17, name: 'Shraddhatraya Vibhaga Yoga', nameSanskrit: 'श्रद्धात्रयविभागयोग', verses: 28 },
  { num: 18, name: 'Moksha Sanyasa Yoga', nameSanskrit: 'मोक्षसंन्यासयोग', verses: 78 },
];

export default function Library() {
  const [activeTab, setActiveTab] = useState('GITA'); // 'GITA' | 'RAMAYANA'
  const [expandedChapter, setExpandedChapter] = useState(null);
  const [shlokaIndex, setShlokaIndex] = useState({});  // { [chapterNum]: currentIndex }
  const [ramQuoteIndex, setRamQuoteIndex] = useState(0); // For Ramayana quotes
  const [animDir, setAnimDir] = useState('');           // 'next' | 'prev' for animation
  const [searchQuery, setSearchQuery] = useState('');

  const toggleChapter = (num) => {
    if (expandedChapter === num) {
      setExpandedChapter(null);
    } else {
      setExpandedChapter(num);
      if (shlokaIndex[num] === undefined) {
        setShlokaIndex((prev) => ({ ...prev, [num]: 0 }));
      }
    }
  };

  const getChapterShlokas = (chapterNum) => {
    return GITA_SHLOKAS.filter((s) => s.chapter === chapterNum);
  };

  const goToShloka = (chapterNum, direction) => {
    const shlokas = getChapterShlokas(chapterNum);
    const current = shlokaIndex[chapterNum] || 0;
    let next;
    if (direction === 'next') {
      next = current < shlokas.length - 1 ? current + 1 : 0;
    } else {
      next = current > 0 ? current - 1 : shlokas.length - 1;
    }
    setAnimDir(direction);
    setShlokaIndex((prev) => ({ ...prev, [chapterNum]: next }));
    setTimeout(() => setAnimDir(''), 400);
  };

  const goToRamQuote = (direction) => {
    const current = ramQuoteIndex;
    let next;
    if (direction === 'next') {
      next = current < RAM_QUOTES.length - 1 ? current + 1 : 0;
    } else {
      next = current > 0 ? current - 1 : RAM_QUOTES.length - 1;
    }
    setAnimDir(direction);
    setRamQuoteIndex(next);
    setTimeout(() => setAnimDir(''), 400);
  };

  return (
    <main className="library" id="library-page">
      <div className="container">
        {/* Header */}
        <div className="library__header">
          <h1 className="library__title">
            Scripture <span className="text-gradient-gold">Library</span>
          </h1>
          <p className="library__subtitle">
            Explore the timeless wisdom of the Bhagavad Gita and Valmiki Ramayana
          </p>
        </div>

        {/* Search */}
        <div className="library__search glass-strong">
          <Search size={18} className="library__search-icon" />
          <input
            type="text"
            className="library__search-input"
            placeholder="Search verses, chapters, or keywords..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            id="library-search"
          />
        </div>

        {/* Stats */}
        <div className="library__stats">
          <div className="library__stat card-glass">
            <span className="library__stat-num text-gradient-gold">18</span>
            <span className="library__stat-label">Chapters</span>
          </div>
          <div className="library__stat card-glass">
            <span className="library__stat-num text-gradient-gold">700</span>
            <span className="library__stat-label">Gita Shlokas</span>
          </div>
          <div className="library__stat card-glass">
            <span className="library__stat-num text-gradient-blue">{RAM_QUOTES.length}</span>
            <span className="library__stat-label">Ram Quotes</span>
          </div>
        </div>

        {/* Tabs */}
        <div className="library__tabs">
          <button 
            className={`library__tab ${activeTab === 'GITA' ? 'library__tab--active' : ''}`}
            onClick={() => setActiveTab('GITA')}
          >
            <BookOpen size={18} />
            Bhagavad Gita
          </button>
          <button 
            className={`library__tab ${activeTab === 'RAMAYANA' ? 'library__tab--active' : ''}`}
            onClick={() => setActiveTab('RAMAYANA')}
          >
            <Quote size={18} />
            Words of Lord Rama
          </button>
        </div>

        {/* Content Area */}
        <div className="library__content">
          {activeTab === 'GITA' && (
            <div className="library__chapters">
              {CHAPTERS.map((chapter) => {
                const shlokas = getChapterShlokas(chapter.num);
                const isExpanded = expandedChapter === chapter.num;
                const currentIdx = shlokaIndex[chapter.num] || 0;
                const currentShloka = shlokas[currentIdx];

                return (
                  <div
                    key={chapter.num}
                    className={`chapter-card card-glass ${isExpanded ? 'chapter-card--expanded' : ''}`}
                  >
                    <button
                      className="chapter-card__header"
                      onClick={() => toggleChapter(chapter.num)}
                      id={`chapter-${chapter.num}`}
                    >
                      <div className="chapter-card__num">{chapter.num}</div>
                      <div className="chapter-card__info">
                        <span className="chapter-card__name">{chapter.name}</span>
                        <span className="chapter-card__sanskrit">{chapter.nameSanskrit}</span>
                      </div>
                      <div className="chapter-card__meta">
                        <span className="chapter-card__verses">{chapter.verses} verses</span>
                        {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                      </div>
                    </button>

                    {isExpanded && currentShloka && (
                      <div className="chapter-card__content">
                        {/* ── Sacred Scroll Shloka Viewer ── */}
                        <div className={`scroll-viewer ${animDir ? `scroll-viewer--${animDir}` : ''}`}>
                          {/* Decorative top */}
                          <div className="scroll-viewer__ornament scroll-viewer__ornament--top">
                            <span className="scroll-viewer__ornament-line" />
                            <span className="scroll-viewer__om">ॐ</span>
                            <span className="scroll-viewer__ornament-line" />
                          </div>

                          {/* Sanskrit */}
                          <div className="scroll-viewer__sanskrit">
                            {currentShloka.sanskrit.split('\n').map((line, i) => (
                              <span key={i}>
                                {line}
                                {i < currentShloka.sanskrit.split('\n').length - 1 && <br />}
                              </span>
                            ))}
                          </div>

                          {/* Divider */}
                          <div className="scroll-viewer__divider">
                            <span className="scroll-viewer__divider-line" />
                            <span className="scroll-viewer__lotus">🪷</span>
                            <span className="scroll-viewer__divider-line" />
                          </div>

                          {/* Meaning label */}
                          <span className="scroll-viewer__meaning-label">Meaning:</span>

                          {/* Translation */}
                          <p className="scroll-viewer__translation">
                            {currentShloka.translation?.en}
                          </p>

                          {/* Hindi */}
                          {currentShloka.translation?.hi && (
                            <p className="scroll-viewer__hindi">
                              {currentShloka.translation.hi}
                            </p>
                          )}

                          {/* Reference badge */}
                          <div className="scroll-viewer__ref">
                            <span className="scroll-viewer__ref-badge">
                              🪷 SHRIMAD BHAGAVAD GITA {currentShloka.chapter}.{currentShloka.verse} 🪷
                            </span>
                          </div>

                          {/* Decorative bottom */}
                          <div className="scroll-viewer__ornament scroll-viewer__ornament--bottom">
                            <span className="scroll-viewer__ornament-line" />
                            <span className="scroll-viewer__lotus">🪷</span>
                            <span className="scroll-viewer__ornament-line" />
                          </div>
                        </div>

                        {/* ── Navigation ── */}
                        <div className="scroll-nav">
                          <button
                            className="scroll-nav__btn"
                            onClick={() => goToShloka(chapter.num, 'prev')}
                            aria-label="Previous shloka"
                          >
                            <span className="material-symbols-outlined">arrow_back</span>
                            <span className="scroll-nav__btn-text">Previous</span>
                          </button>

                          <div className="scroll-nav__counter">
                            <span className="scroll-nav__current">{currentIdx + 1}</span>
                            <span className="scroll-nav__sep">/</span>
                            <span className="scroll-nav__total">{shlokas.length}</span>
                          </div>

                          <button
                            className="scroll-nav__btn scroll-nav__btn--next"
                            onClick={() => goToShloka(chapter.num, 'next')}
                            aria-label="Next shloka"
                          >
                            <span className="scroll-nav__btn-text">Next</span>
                            <span className="material-symbols-outlined">arrow_forward</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {activeTab === 'RAMAYANA' && RAM_QUOTES.length > 0 && (
            <div className="library__ramayana">
              <div className="chapter-card card-glass chapter-card--expanded">
                <div className="chapter-card__header" style={{ cursor: 'default' }}>
                  <div className="chapter-card__num">R</div>
                  <div className="chapter-card__info">
                    <span className="chapter-card__name">Words of Lord Rama</span>
                    <span className="chapter-card__sanskrit">वाल्मीकि रामायण</span>
                  </div>
                  <div className="chapter-card__meta">
                    <span className="chapter-card__verses">{RAM_QUOTES.length} quotes</span>
                  </div>
                </div>

                <div className="chapter-card__content">
                  {/* ── Sacred Scroll Shloka Viewer ── */}
                  <div className={`scroll-viewer ${animDir ? `scroll-viewer--${animDir}` : ''}`}>
                    {/* Decorative top */}
                    <div className="scroll-viewer__ornament scroll-viewer__ornament--top">
                      <span className="scroll-viewer__ornament-line" />
                      <span className="scroll-viewer__om">ॐ</span>
                      <span className="scroll-viewer__ornament-line" />
                    </div>

                    {/* Sanskrit */}
                    <div className="scroll-viewer__sanskrit">
                      {RAM_QUOTES[ramQuoteIndex].sanskrit.split('\n').map((line, i) => (
                        <span key={i}>
                          {line}
                          {i < RAM_QUOTES[ramQuoteIndex].sanskrit.split('\n').length - 1 && <br />}
                        </span>
                      ))}
                    </div>

                    {/* Divider */}
                    <div className="scroll-viewer__divider">
                      <span className="scroll-viewer__divider-line" />
                      <span className="scroll-viewer__lotus">🪷</span>
                      <span className="scroll-viewer__divider-line" />
                    </div>

                    {/* Meaning label */}
                    <span className="scroll-viewer__meaning-label">Meaning:</span>

                    {/* Translation */}
                    <p className="scroll-viewer__translation">
                      {RAM_QUOTES[ramQuoteIndex].translation?.en}
                    </p>

                    {/* Hindi */}
                    {RAM_QUOTES[ramQuoteIndex].translation?.hi && (
                      <p className="scroll-viewer__hindi">
                        {RAM_QUOTES[ramQuoteIndex].translation.hi}
                      </p>
                    )}

                    {/* Reference badge */}
                    <div className="scroll-viewer__ref">
                      <span className="scroll-viewer__ref-badge" style={{ background: 'linear-gradient(135deg, #1A3A5A, #2C5282, #1A3A5A)', boxShadow: '0 2px 12px rgba(26, 58, 90, 0.3)' }}>
                        🪷 {RAM_QUOTES[ramQuoteIndex].reference} 🪷
                      </span>
                    </div>

                    {/* Decorative bottom */}
                    <div className="scroll-viewer__ornament scroll-viewer__ornament--bottom">
                      <span className="scroll-viewer__ornament-line" />
                      <span className="scroll-viewer__lotus">🪷</span>
                      <span className="scroll-viewer__ornament-line" />
                    </div>
                  </div>

                  {/* ── Navigation ── */}
                  <div className="scroll-nav">
                    <button
                      className="scroll-nav__btn"
                      onClick={() => goToRamQuote('prev')}
                      aria-label="Previous quote"
                    >
                      <span className="material-symbols-outlined">arrow_back</span>
                      <span className="scroll-nav__btn-text">Previous</span>
                    </button>

                    <div className="scroll-nav__counter">
                      <span className="scroll-nav__current">{ramQuoteIndex + 1}</span>
                      <span className="scroll-nav__sep">/</span>
                      <span className="scroll-nav__total">{RAM_QUOTES.length}</span>
                    </div>

                    <button
                      className="scroll-nav__btn scroll-nav__btn--next"
                      onClick={() => goToRamQuote('next')}
                      aria-label="Next quote"
                    >
                      <span className="scroll-nav__btn-text">Next</span>
                      <span className="material-symbols-outlined">arrow_forward</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
