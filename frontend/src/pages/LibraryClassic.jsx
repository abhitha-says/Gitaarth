import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Search, X } from 'lucide-react';
import VersePlate from '../components/VersePlateClassic';
import Reveal from '../components/Reveal';
import CelestialField from '../components/CelestialField';
import { useVeil } from '../context/VeilContext';
import { GITA_SHLOKAS } from '../utils/shlokaData';
import { RAM_QUOTES } from '../utils/ramayanaData';
import { CHAPTERS, chapterOf, versesOfChapter, reflectPrompt, toDevanagari, toRoman } from '../utils/verses';
import './LibraryClassic.css';

const EASE = [0.22, 1, 0.36, 1];

function matches(q, ...fields) {
  return fields.some((f) => (f || '').toLowerCase().includes(q));
}

export default function LibraryClassic() {
  const [params, setParams] = useSearchParams();
  const [query, setQuery] = useState('');
  const enter = useVeil();

  const tab = params.get('tab') === 'ramayana' ? 'ramayana' : 'gita';
  const chapterNum = Number(params.get('chapter')) || null;
  const chapter = chapterNum ? chapterOf(chapterNum) : null;

  const setTab = (t) => setParams(t === 'ramayana' ? { tab: 'ramayana' } : {}, { replace: false });
  const openChapter = (n) => setParams({ chapter: String(n) });
  const closeChapter = () => setParams({});

  // Opening or leaving a chapter starts reading from the top
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [chapterNum]);

  const q = query.trim().toLowerCase();
  const results = useMemo(() => {
    if (q.length < 2) return null;
    // A reference like 2.47 or 2:47 means that exact verse
    const ref = q.match(/^(\d{1,2})\s*[.:]\s*(\d{1,2})$/);
    if (ref) {
      const [c, v] = [Number(ref[1]), Number(ref[2])];
      return { gita: GITA_SHLOKAS.filter((s) => s.chapter === c && s.verse === v), ram: [] };
    }
    const gita = GITA_SHLOKAS.filter((s) =>
      matches(q, s.translation?.en, s.translation?.hi, s.sanskrit, `${s.chapter}.${s.verse}`, chapterOf(s.chapter)?.name)
    );
    const ram = RAM_QUOTES.filter((r) => matches(q, r.translation?.en, r.translation?.hi, r.sanskrit, r.reference));
    return { gita, ram };
  }, [q]);

  const reflect = (verse) => (e) => {
    const text = verse.chapter ? reflectPrompt(verse) : `I'd like to reflect on these words of Shri Ram (${verse.reference}): "${verse.translation?.en}" What might they mean for my life right now?`;
    enter(`/chat?topic=${encodeURIComponent(text)}&draft=1`, e);
  };

  return (
    <main id="main" className="page library">
      <div className="atmosphere"><CelestialField stars={80} motes={10} origin={{ x: 0.5, y: 0.2 }} spread={0.3} /></div>

      <header className="library__hero container">
        <motion.p
          className="library__sanskrit sanskrit"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, ease: EASE }}
        >
          श्रीमद्भगवद्गीता
        </motion.p>
        <motion.h1
          className="display h1"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: EASE, delay: 0.1 }}
        >
          The song that answers <em>a question.</em>
        </motion.h1>
        <motion.p
          className="lead library__lead"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.3 }}
        >
          Eighteen chapters of dialogue between Krishna and Arjuna. Read a selection of verses in
          Sanskrit with their meaning, and take any of them into a conversation.
        </motion.p>

        <motion.div
          className="library__search"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: EASE, delay: 0.4 }}
        >
          <Search aria-hidden="true" />
          <label htmlFor="library-search" className="sr-only">Search verses</label>
          <input
            id="library-search"
            type="search"
            placeholder="Search a word, a feeling, or a verse like 2.47"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoComplete="off"
          />
          {query && (
            <button type="button" className="icon-btn" onClick={() => setQuery('')} aria-label="Clear search"><X /></button>
          )}
        </motion.div>
      </header>

      <div className="container library__body">
        {results ? (
          <section aria-live="polite" aria-label="Search results">
            <p className="library__count">
              {results.gita.length + results.ram.length === 0
                ? `Nothing found for “${query.trim()}”. Try a simpler word, like “fear” or “duty”.`
                : `${results.gita.length + results.ram.length} ${results.gita.length + results.ram.length === 1 ? 'verse' : 'verses'} for “${query.trim()}”`}
            </p>
            <div className="library__verses">
              {results.gita.slice(0, 40).map((s) => (
                <VersePlate key={`g-${s.id}`} verse={s} actions showAlt onReflect={reflect(s)} />
              ))}
              {results.ram.slice(0, 20).map((r) => (
                <VersePlate key={`r-${r.id}`} verse={r} source="ramayana" actions showAlt onReflect={reflect(r)} />
              ))}
            </div>
          </section>
        ) : chapter ? (
          <section aria-labelledby="chapter-title">
            <button type="button" className="library__back" onClick={closeChapter}>
              <ArrowLeft aria-hidden="true" /> All chapters
            </button>
            <div className="chapter-head">
              <span className="chapter-head__num sanskrit" aria-hidden="true">{toDevanagari(chapter.num)}</span>
              <p className="eyebrow">Chapter {toRoman(chapter.num)} · {chapter.verses} verses</p>
              <h2 id="chapter-title" className="display h2">{chapter.name}</h2>
              <p className="chapter-head__sa sanskrit">{chapter.nameSanskrit}</p>
              <p className="chapter-head__theme">{chapter.theme}</p>
            </div>
            <p className="library__count library__count--center">
              {versesOfChapter(chapter.num).length} selected verses from this chapter
            </p>
            <div className="library__verses">
              {versesOfChapter(chapter.num).map((s, i) => (
                <Reveal key={s.id} delay={Math.min(i, 3) * 0.06} y={20}>
                  <VersePlate verse={s} actions showAlt onReflect={reflect(s)} />
                </Reveal>
              ))}
            </div>
            <nav className="chapter-pager" aria-label="Chapters">
              {chapter.num > 1 ? (
                <button type="button" onClick={() => openChapter(chapter.num - 1)}>
                  <ArrowLeft aria-hidden="true" />
                  <span><small>Previous</small>{chapterOf(chapter.num - 1).name}</span>
                </button>
              ) : <span />}
              {chapter.num < 18 && (
                <button type="button" className="is-next" onClick={() => openChapter(chapter.num + 1)}>
                  <span><small>Next</small>{chapterOf(chapter.num + 1).name}</span>
                  <ArrowRight aria-hidden="true" />
                </button>
              )}
            </nav>
          </section>
        ) : (
          <>
            <div className="tabs" role="tablist" aria-label="Collections">
              <button type="button" role="tab" aria-selected={tab === 'gita'} className={`tabs__tab ${tab === 'gita' ? 'is-on' : ''}`} onClick={() => setTab('gita')}>
                Bhagavad Gita
              </button>
              <button type="button" role="tab" aria-selected={tab === 'ramayana'} className={`tabs__tab ${tab === 'ramayana' ? 'is-on' : ''}`} onClick={() => setTab('ramayana')}>
                Words of Shri Ram
              </button>
            </div>

            {tab === 'gita' ? (
              <section aria-label="Chapters of the Bhagavad Gita">
                <ol className="chapters">
                  {CHAPTERS.map((c, i) => (
                    <Reveal as="li" key={c.num} delay={(i % 3) * 0.06} y={18}>
                      <button type="button" className="chapter-card" onClick={() => openChapter(c.num)}>
                        <span className="chapter-card__num sanskrit" aria-hidden="true">{toDevanagari(c.num)}</span>
                        <span className="chapter-card__meta">Chapter {toRoman(c.num)} · {c.verses} verses</span>
                        <span className="chapter-card__name">{c.name}</span>
                        <span className="chapter-card__sa sanskrit">{c.nameSanskrit}</span>
                        <span className="chapter-card__theme">{c.theme}</span>
                        <ArrowRight className="chapter-card__arrow" aria-hidden="true" />
                      </button>
                    </Reveal>
                  ))}
                </ol>
              </section>
            ) : (
              <section aria-label="Words of Shri Ram from the Valmiki Ramayana">
                <p className="library__count library__count--center">
                  {RAM_QUOTES.length} passages from the Valmiki Ramayana
                </p>
                <div className="library__verses">
                  {RAM_QUOTES.map((r, i) => (
                    <Reveal key={r.id} delay={Math.min(i, 3) * 0.05} y={18}>
                      <VersePlate verse={r} source="ramayana" actions showAlt onReflect={reflect(r)} />
                    </Reveal>
                  ))}
                </div>
              </section>
            )}
          </>
        )}

        <p className="library__note">
          Translations are offered as gentle renderings for reflection. For deeper study, read the Gita
          alongside a trusted commentary. <Link to="/about">How Gitaarth uses these verses</Link>
        </p>
      </div>
    </main>
  );
}
