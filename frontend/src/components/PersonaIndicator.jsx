import './PersonaIndicator.css';

export default function PersonaIndicator({ persona, isTyping = false }) {
  const isKrishna = persona === 'krishna';

  return (
    <div className={`persona-indicator persona-indicator--${persona}`} id={`persona-${persona}`}>
      <div className="persona-indicator__avatar">
        <img
          src={isKrishna ? '/krishna-vishwaroop.png' : '/rama-vanvas.png'}
          alt={isKrishna ? 'Lord Krishna' : 'Lord Ram'}
          className="persona-indicator__avatar-img"
        />
      </div>
      <div className="persona-indicator__info">
        <span className="persona-indicator__name">
          {isKrishna ? 'Lord Krishna' : 'Lord Ram'}
        </span>
        <span className="persona-indicator__source">
          {isKrishna ? 'Bhagavad Gita' : 'Ramayana'}
        </span>
      </div>
      {isTyping && (
        <div className="persona-indicator__typing">
          <span /><span /><span />
        </div>
      )}
    </div>
  );
}
