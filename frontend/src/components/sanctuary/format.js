/** Small helpers for dates and names on the Sanctuary page. */

export function shortDate(ts) {
  if (!ts) return '';
  const d = new Date(ts);
  if (Number.isNaN(d.getTime())) return '';
  const year = d.getFullYear() !== new Date().getFullYear();
  return d.toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: year ? 'numeric' : undefined });
}

/** Day and month apart, for the margin of the diary. */
export function diaryDate(ts) {
  if (!ts) return null;
  const d = new Date(ts);
  if (Number.isNaN(d.getTime())) return null;
  const year = d.getFullYear() !== new Date().getFullYear();
  return {
    iso: d.toISOString(),
    day: d.toLocaleDateString(undefined, { day: 'numeric' }),
    month: d.toLocaleDateString(undefined, { month: 'short' }) + (year ? ` ${d.getFullYear()}` : ''),
    full: d.toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' }),
  };
}

/** What a kept item is called when it is mentioned in a sentence. */
export function keptLabel(k) {
  if (k.kind === 'verse') return k.ref || 'a verse';
  return k.ref ? `guidance on ${k.ref}` : 'a piece of guidance';
}
