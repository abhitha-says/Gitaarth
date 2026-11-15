import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { diaryDate } from './format';

const WITH = { krishna: 'with Krishna', ram: 'with Rama' };

function Entry({ s }) {
  const date = diaryDate(s.updatedAt || s.createdAt);
  const meta = [WITH[s.lastPersona], s.messageCount > 0 ? `${s.messageCount} ${s.messageCount === 1 ? 'message' : 'messages'}` : '']
    .filter(Boolean)
    .join(' · ');
  return (
    <li>
      <Link to={`/chat?session=${encodeURIComponent(s.sessionId)}`} className="entry">
        <span className="entry__date">
          {date && (
            <time dateTime={date.iso} title={date.full}>
              <span className="entry__day">{date.day}</span>
              <span className="entry__month">{date.month}</span>
            </time>
          )}
        </span>
        <span className="entry__body">
          <span className="entry__words">{s.title || 'Untitled conversation'}</span>
          {meta && <span className="entry__meta">{meta}</span>}
        </span>
        <ArrowRight className="entry__arrow" aria-hidden="true" />
      </Link>
    </li>
  );
}

/**
 * Past conversations as a page of a diary: a date in the margin and the
 * first words of what was said, one line each.
 */
export default function Diary({ sessions, signedIn, style }) {
  return (
    <section className="diary-wrap" aria-labelledby="convo-title" style={style}>
      <div className="room__head">
        <h2 id="convo-title" className="display room__title">Conversations</h2>
        <p className="room__sub">{signedIn ? 'From your account' : 'From this browser'}</p>
      </div>

      <div className="diary paper">
        {sessions === null && (
          <div className="diary__quiet" role="status">
            <p>Gathering your conversations…</p>
            <span className="diary__rule" aria-hidden="true" />
            <span className="diary__rule" aria-hidden="true" />
            <span className="diary__rule" aria-hidden="true" />
          </div>
        )}

        {sessions === false && (
          <div className="diary__quiet">
            <p>Past conversations can&rsquo;t be shown right now. Your words in new conversations still reach Gitaarth.</p>
          </div>
        )}

        {Array.isArray(sessions) && sessions.length === 0 && (
          <div className="diary__quiet diary__quiet--empty">
            <p>No conversations yet. Whenever you are ready, Gitaarth is here.</p>
            <Link to="/chat" className="link-arrow">Begin a conversation <ArrowRight aria-hidden="true" /></Link>
          </div>
        )}

        {Array.isArray(sessions) && sessions.length > 0 && (
          <ol className="diary__lines">
            {sessions.map((s) => <Entry key={s.sessionId} s={s} />)}
          </ol>
        )}
      </div>
    </section>
  );
}
