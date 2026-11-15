import { MIST } from './art';

/**
 * Ground mist: a few broad bands of the same soft texture, drifting with the
 * wind (left to right, like every cloth on the site) at different depths.
 * Only transforms move, so it costs the phone almost nothing.
 */
const BANDS = [
  { tex: 'a', h: 38, bottom: 26, opacity: 0.75, t: 150, depth: 'far' },
  { tex: 'b', h: 52, bottom: 4, opacity: 0.85, t: 105, depth: 'mid' },
  { tex: 'a', h: 66, bottom: -18, opacity: 0.9, t: 70, depth: 'near' },
];

export default function Mist({ className = '', bands = 3, style }) {
  const list = bands >= 3 ? BANDS : bands === 2 ? [BANDS[0], BANDS[2]] : [BANDS[1]];
  return (
    <div className={`mist ${className}`} style={style} aria-hidden="true">
      {list.map((b) => (
        <div
          key={b.depth}
          className={`mist__band mist__band--${b.depth}`}
          style={{
            '--h': `${b.h}svh`,
            '--t': `${b.t}s`,
            bottom: `${b.bottom}%`,
            opacity: b.opacity,
            backgroundImage: `url(${MIST[b.tex]})`,
          }}
        />
      ))}
    </div>
  );
}
