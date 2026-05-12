import ShlokaCard from './ShlokaCard';
import './ChatBubble.css';

export default function ChatBubble({ message, lang = 'en' }) {
  const isUser = message.role === 'user';

  if (isUser) {
    return (
      <div className="chat-bubble chat-bubble--user" id={`msg-${message.id}`}>
        <div className="chat-bubble__user-content">
          <p className="chat-bubble__text">{message.text}</p>
        </div>
      </div>
    );
  }

  // AI Response — match Stitch "Wisdom Thread" pattern
  return (
    <div className="chat-bubble chat-bubble--ai" id={`msg-${message.id}`}>
      {/* Avatar + Label */}
      <div className="chat-bubble__ai-header">
        <div className="chat-bubble__avatar">
          <img src="/mandala-avatar.png" alt="Counselor" />
        </div>
        <span className="chat-bubble__label">Divine Counselor</span>
      </div>

      {/* Content with Wisdom Thread (vertical gold line) */}
      <div className="chat-bubble__ai-body">
        <div className="chat-bubble__wisdom-thread" />

        <div className="chat-bubble__ai-content">
          <p className="chat-bubble__text">{message.text}</p>

          {message.shloka && (
            <ShlokaCard shloka={message.shloka} lang={lang} compact />
          )}

          {message.counseling && (
            <p className="chat-bubble__text">{message.counseling}</p>
          )}

          {/* Action Buttons */}
          <div className="chat-bubble__actions">
            <button className="chat-bubble__action-btn">
              <span className="material-symbols-outlined">favorite</span>
              Save to Sanctuary
            </button>
            <button className="chat-bubble__action-btn">
              <span className="material-symbols-outlined">share</span>
              Share Insight
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
