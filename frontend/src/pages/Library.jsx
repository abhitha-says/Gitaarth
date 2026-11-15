import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Search, X } from 'lucide-react';
import VersePlate from '../components/VersePlate';
import Morning from '../components/Morning';
import Pothi from '../components/library/Pothi';
import LivingImage from '../scene/LivingImage';
import { art } from '../scene/art';
import { useTier } from '../scene/tier';
import { useVeil } from '../context/VeilContext';
import { GITA_SHLOKAS } from '../utils/shlokaData';
import { RAM_QUOTES } from '../utils/ramayanaData';
import { CHAPTERS, chapterOf, versesOfChapter, reflectPrompt, toDevanagari, toRoman } from '../utils/verses';
import './Library.css';

const EASE = [0.22, 1, 0.36, 1];

function matches(q, ...fields) {
  return fields.some((f) => (f || '').toLowerCase().includes(q));
}

/**
 * Verse leaves laid out one under another. When `arrive` is set the first
 * ten slide out from under the one above, 75ms apart; the rest are simply there.
 */
function Leaves({ items, arrive = false, render }) {
  return (
    <ol className={`leaves ${arrive ? 'leaves--arrive' : ''}`}>
      {items.map((item, i) => (
        <li key={item.key} className="leaves__leaf" style={i < 10 ? { '--i': i } : undefined}>
          {render(item.value)}
        </li>
      ))}
    </ol>
  );
}

export default function Library() {
  const [params, setParams] = useSearchParams();
  const [query, setQuery] = useState('');
  const enter = useVeil();
  const still = useTier() === 'still';

  const tab = params.get('tab') === 'ramayana' ? 'ramayana' : 'gita';
  const chapterNum = Number(params.get('chapter')) || null;
  const chapter = chapterNum ? chapterOf(chapterNum) : null;

  const setTab = (t) => setParams(t === 'ramayana' ? { tab: 'ramayana' } : {}, { replace: false });
  const openChapter = (n) => setParams({ chapter: String(n) });
  const closeChapter = () => setParams({});

  // Opening or leaving a chapter starts reading from the top
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: still ? 'auto' : 'smooth' });
  }, [chapterNum, still]);

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

  const gitaLeaf = (s) => <VersePlate verse={s} actions showAlt onReflect={reflect(s)} />;
  const ramLeaf = (r) => <VersePlate verse={r} source="ramayana" actions showAlt onReflect={reflect(r)} />;
  const rise = (delay, y = 14) => (still ? { initial: false } : {
    initial: { opacity: 0, y },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 1.1, ease: EASE, delay },
  });

  const total = results ? results.gita.length + results.ram.length : 0;
  const ramaArt = tab === 'ramayana' && art('rama-standing');

  return (
    <main id="main" className={`page library ${still ? 'is-still' : ''}`}>
      <Morning />

      <header className="library__hero container">
        <motion.p className="library__sanskrit sanskrit" lang="sa" {...rise(0, 10)}>
          श्रीमद्भगवद्गीता
        </motion.p>
        <motion.h1 className="display h1" {...rise(0.1, 18)}>
          The song that answers <em>a question.</em>
        </motion.h1>
        <motion.p className="lead library__lead" {...rise(0.25, 0)}>
          Eighteen chapters of dialogue between Krishna and Arjuna, kept the old way, on palm leaf.
          Read a selection of verses in Sanskrit with their meaning, and take any of them into a conversation.
        </motion.p>

        <motion.div className="library__search" {...rise(0.35, 12)}>
          <Search aria-hidden="true" />
          <label htmlFor="library-search" className="sr-only">Search verses</label>
          <input
            id="library-search"
            type="search"
            placeholder="Search a word, a feeling, or 2.47"
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
            <p className={`library__count ${total === 0 ? 'library__empty' : ''}`}>
              {total === 0
                ? `Nothing found for “${query.trim()}”. Try a simpler word, like “fear” or “duty”.`
                : `${total} ${total === 1 ? 'verse' : 'verses'} for “${query.trim()}”`}
            </p>
            {total > 0 && (
              <Leaves
                items={[
                  ...results.gita.slice(0, 40).map((s) => ({ key: `g-${s.id}`, value: { s } })),
                  ...results.ram.slice(0, 20).map((r) => ({ key: `r-${r.id}`, value: { r } })),
                ]}
                render={({ s, r }) => (s ? gitaLeaf(s) : ramLeaf(r))}
              />
            )}
          </section>
        ) : chapter ? (
          <section aria-labelledby="chapter-title" key={chapter.num}>
            <button type="button" className="library__back" onClick={closeChapter}>
              <ArrowLeft aria-hidden="true" /> All chapters
            </button>

            <div className={`pothi pothi--single ${still ? '' : 'is-arriving'}`}>
              <div className="pleaf pleaf--title">
                <div className="pleaf__face">
                  <span className="pleaf__num">
                    <span className="pleaf__dev sanskrit" aria-hidden="true">{toDevanagari(chapter.num)}</span>
                  </span>
                  <div className="chapter-head">
                    <p className="chapter-head__meta">Chapter {toRoman(chapter.num)} · {chapter.verses} verses</p>
                    <h2 id="chapter-title" className="chapter-head__name">{chapter.name}</h2>
                    <p className="chapter-head__sa sanskrit" lang="sa">{chapter.nameSanskrit}</p>
                    <p className="chapter-head__theme">{chapter.theme}</p>
                  </div>
                  <span className="pleaf__num" aria-hidden="true">
                    <span className="pleaf__roman pleaf__roman--big">{toRoman(chapter.num)}</span>
                  </span>
                </div>
              </div>
            </div>

            <p className="library__count library__count--center">
              {versesOfChapter(chapter.num).length} selected verses from this chapter
            </p>
            <Leaves
              arrive={!still}
              items={versesOfChapter(chapter.num).map((s) => ({ key: s.id, value: s }))}
              render={gitaLeaf}
            />

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
              {[['gita', 'Bhagavad Gita'], ['ramayana', 'Words of Shri Ram']].map(([id, label]) => (
                <button
                  key={id}
                  type="button"
                  role="tab"
                  aria-selected={tab === id}
                  className={`tabs__tab ${tab === id ? 'is-on' : ''}`}
                  onClick={() => setTab(id)}
                >
                  {label}
                  {tab === id && (
                    <motion.span
                      className="tabs__mark"
                      layoutId="library-tab-mark"
                      transition={still ? { duration: 0 } : { duration: 0.24, ease: EASE }}
                      aria-hidden="true"
                    />
                  )}
                </button>
              ))}
            </div>

            <motion.div
              key={tab}
              initial={still ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.24, ease: EASE }}
            >
              {tab === 'gita' ? (
                <section aria-label="Chapters of the Bhagavad Gita">
                  <p className="library__hint">Eighteen leaves, one for each chapter. Choose one to untie the cord and read.</p>
                  <Pothi chapters={CHAPTERS} onOpen={openChapter} still={still} />
                </section>
              ) : (
                <section aria-label="Words of Shri Ram from the Valmiki Ramayana">
                  {ramaArt && (
                    <div className="library__rama">
                      <LivingImage slot="rama-standing" alt="Shri Ram standing at rest, his bow at his side" haze={0.35} live={!still} />
                    </div>
                  )}
                  <p className="library__count library__count--center">
                    {RAM_QUOTES.length} passages from the Valmiki Ramayana
                  </p>
                  <Leaves
                    arrive={!still}
                    items={RAM_QUOTES.map((r) => ({ key: r.id, value: r }))}
                    render={ramLeaf}
                  />
                </section>
              )}
            </motion.div>
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
