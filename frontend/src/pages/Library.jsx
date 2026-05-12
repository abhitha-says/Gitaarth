import { useState } from 'react';
import { Search, ChevronDown, ChevronUp, BookOpen } from 'lucide-react';
import ShlokaCard from '../components/ShlokaCard';
import { SAMPLE_SHLOKAS } from '../utils/constants';
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
  const [expandedChapter, setExpandedChapter] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const toggleChapter = (num) => {
    setExpandedChapter(expandedChapter === num ? null : num);
  };

  // Get sample shlokas for expanded chapter
  const getChapterShlokas = (chapterNum) => {
    return SAMPLE_SHLOKAS.filter((s) => s.chapter === chapterNum);
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
            Explore the 18 chapters of the Bhagavad Gita — 700 shlokas of divine wisdom
          </p>
        </div>

        {/* Search */}
        <div className="library__search glass-strong">
          <Search size={18} className="library__search-icon" />
          <input
            type="text"
            className="library__search-input"
            placeholder="Search shlokas, chapters, or keywords..."
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
            <span className="library__stat-label">Shlokas</span>
          </div>
          <div className="library__stat card-glass">
            <span className="library__stat-num text-gradient-blue">200+</span>
            <span className="library__stat-label">Ram Quotes</span>
          </div>
        </div>

        {/* Chapters Accordion */}
        <div className="library__chapters">
          <h2 className="library__section-title">
            <BookOpen size={20} />
            Bhagavad Gita Chapters
          </h2>

          {CHAPTERS.map((chapter) => {
            const shlokas = getChapterShlokas(chapter.num);
            const isExpanded = expandedChapter === chapter.num;

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

                {isExpanded && (
                  <div className="chapter-card__content">
                    {shlokas.length > 0 ? (
                      shlokas.map((shloka) => (
                        <ShlokaCard key={shloka.id} shloka={shloka} lang="en" />
                      ))
                    ) : (
                      <p className="chapter-card__empty">
                        Full shlokas will be available once the scripture database is connected.
                        {chapter.num === 2 && ' Try Chapter 2, 4, 6, 9, or 11 for sample shlokas!'}
                      </p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
