/**
 * Grass close to the lens, far out of focus, lit from behind. It stands in the
 * way a little, as real foreground does, and falls away as the camera rises.
 * (Replaced by the painted `foreground-grass` picture once that exists.)
 */
import { art } from './art';

const BLADES = [
  [40, 14, -8], [96, 22, 6], [150, 11, -3], [215, 26, 9], [262, 13, -11], [330, 19, 4],
  [398, 9, -6], [455, 24, 10], [520, 15, -4], [590, 21, 7], [655, 10, -9], [720, 25, 3],
  [790, 14, -7], [850, 20, 8], [918, 12, -2], [975, 23, 5],
];

export default function Grass() {
  const painted = art('foreground-grass');
  if (painted) return <img className="grass grass--painted" src={painted.src} alt="" decoding="async" />;
  return (
    <svg className="grass" viewBox="0 0 1000 300" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
      <defs>
        <linearGradient id="grass-g" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#c9c08a" stopOpacity="0.55" />
          <stop offset="0.5" stopColor="#8f9160" stopOpacity="0.8" />
          <stop offset="1" stopColor="#6f7448" stopOpacity="0.95" />
        </linearGradient>
      </defs>
      <g className="grass__sway">
        {BLADES.map(([x, w, lean], i) => {
          const h = 150 + ((i * 53) % 130);
          return (
            <path
              key={x}
              d={`M${x - w} 300 Q${x + lean * 2} ${300 - h * 0.6} ${x + lean * 6} ${300 - h} Q${x + lean * 3 + w * 0.6} ${300 - h * 0.5} ${x + w} 300 Z`}
              fill="url(#grass-g)"
            />
          );
        })}
        <circle cx="180" cy="150" r="9" fill="#fffaf0" opacity="0.8" />
        <circle cx="640" cy="120" r="7" fill="#fffaf0" opacity="0.7" />
        <circle cx="880" cy="170" r="10" fill="#fffaf0" opacity="0.75" />
      </g>
    </svg>
  );
}
