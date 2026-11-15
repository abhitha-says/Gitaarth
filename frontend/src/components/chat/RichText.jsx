/* eslint-disable react-refresh/only-export-components */
/**
 * Renders guidance text as paragraphs. Supports **bold** and *italic*
 * without ever injecting HTML.
 */
function inline(text, keyBase) {
  const parts = [];
  const re = /(\*\*[^*]+\*\*|\*[^*\n]+\*)/g;
  let last = 0, m, i = 0;
  while ((m = re.exec(text))) {
    if (m.index > last) parts.push(text.slice(last, m.index));
    const tok = m[0];
    parts.push(
      tok.startsWith('**')
        ? <strong key={`${keyBase}-${i++}`}>{tok.slice(2, -2)}</strong>
        : <em key={`${keyBase}-${i++}`}>{tok.slice(1, -1)}</em>
    );
    last = m.index + tok.length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return parts;
}

/** Lines written in Devanagari are set in the Sanskrit face, a size larger. */
const DEVANAGARI = /[\u0900-\u097F]/;

export function toParagraphs(text = '') {
  return String(text).replace(/\r\n/g, '\n').split(/\n{2,}/).map((p) => p.trim()).filter(Boolean);
}

export function Paragraph({ text, k }) {
  const lines = text.split('\n');
  return (
    <p>
      {lines.map((line, i) => (
        <span key={i} {...(DEVANAGARI.test(line) ? { className: 'rich-sa' } : {})}>
          {inline(line, `${k}-${i}`)}
          {i < lines.length - 1 && <br />}
        </span>
      ))}
    </p>
  );
}
