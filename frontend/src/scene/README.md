# The morning: shared scene system

Read `REDESIGN_DIRECTION.md` in the project root first. This file is the working contract for anyone building a page.

## The world in one paragraph
One morning at Kurukshetra, before anything has begun. The ivory page **is** the mist. One sun stands at the upper left of every page; everything is lit from there and every shadow falls to the lower right. Distance fades into the page colour, never into darkness. About 70% of any screen is light, 25% middle tones, 5% true dark (ink, eyes, a rosewood edge). Gold is metal (a lit edge and a shaded edge), never a glow. Saffron is a pinch: a few percent at most.

## What exists (use these; do not invent parallel ones)
- `src/index.css` tokens: colours `--bg --bg-2 --bg-3 --pearl --sand --stone --champagne --saffron --peacock --leaf --palm --palm-deep --palm-ink --rosewood --ink-900 --gold-deep --gold-ink --text-1/2/3 --line --line-strong`; the sun `--sun` (0..1), `--sun-x`, `--sun-y`; shadows `--shadow-1` (resting), `--shadow-2` (raised), `--shadow-3` (lifted) which all follow the sun; metal `--metal`, `--metal-edge`; motion `--ease-out` (UI), `--ease-camera` (scene moves), `--dur-1` 160ms, `--dur-2` 240ms, `--dur-3` 640ms, `--dur-4` 1200ms, `--dur-camera` 1600ms, `--line-gap` 80ms, wind periods `--wind-1/2/3` (7s, 11s, 17s).
- Classes: `.container`, `.container--narrow`, `.section`, `.eyebrow`, `.display`, `.h1 .h2 .h3`, `.lead`, `.prose`, `.sanskrit`, `.btn .btn--gold .btn--ghost .btn--sm .btn--block`, `.link-arrow`, `.icon-btn`, `.paper` (sunlit paper surface; `.glass` is now the same thing), `.leaf` (palm-leaf surface), `.hairline`, `.arrive` (children arrive one line at a time when `.is-on` is added; set `--i` on each child).
- `components/Morning.jsx`: the fixed page backdrop (sun glow + ground mist). Every inner page renders `<Morning />` once instead of the old `<div className="atmosphere">…<CelestialField/></div>`.
- `scene/LivingImage.jsx`: `<LivingImage slot="krishna-standing" alt="…" />`. A picture whose loose cloth stirs in the wind and which has depth under the pointer; falls back to a plain image. Props: `live` (false = plain image), `wind`, `depth`, `haze` (0..1 toward ivory), `light`, `active`, `eager`, `maxDpr`. It sets its own aspect ratio; give it a width or height in CSS. Returns `null` when the slot has no picture yet, so always lay out so that an empty slot still looks intended.
- `scene/art.js`: `art(slot)` → `{src, map, w, h, alpha, focus:{x,y}, standIn}` or `null`. Slots (file names in `public/img/art/`): `krishna-standing`, `krishna-face`, `krishna-feet`, `rama-standing`, `arjuna-kneeling`, and, once the owner supplies them, `krishna-seated`, `chariot-at-rest`, `gita-moment`, `field-dawn-wide`, `field-dawn-tall`, `foreground-grass`. Today's files are low-resolution stand-ins: never show a stand-in figure taller than about 70% of the viewport height, and soften it with `haze` rather than enlarging it.
- `scene/Mist.jsx` (`<Mist bands={1|2|3} />`, absolutely fills its positioned parent), `scene/Dust.jsx`, `scene/tier.js` (`useTier()` → `'full' | 'lighter' | 'still'`; `still` is reduced motion), `scene/sun.js`.
- `components/Marks.jsx` (`ArchMark`, `LotusMark`, `Ornament`), `components/Reveal.jsx` (fade-up on entering view), `context/VeilContext` (`useVeil()` → `enter(to, event)` for page changes), `context/ToastContext` (`useToast()`).

## Rules of craft (binding)
- Light theme only. No dark panels, no black-and-gold, no neon, no decorative glow, no halo discs, no `backdrop-filter` glass, no heavy gradients.
- Shadows only through `--shadow-1/2/3`. Light only from the sun's side (lit top/left edges, shaded bottom/right edges).
- A deity is treated with reverence: never crop through a face, never put text or controls across a figure, never tilt, spin, bounce or zoom a deity playfully. Faces stay still; only cloth, flowers and feathers move.
- Type: families are fixed (`--font-display`, `--font-read`, `--font-ui`, `--font-sanskrit`). Body text at least 17px on a phone, reading text line-height about 1.8, Devanagari about 15% larger than the Latin beside it, contrast at least 4.5:1 (gold text only as `--gold-ink` on ivory).
- Motion: UI feedback 150–250ms `var(--ease-out)`; scene or camera moves 1.2–2.4s `var(--ease-camera)`; lines of text 60–90ms apart; nothing bounces; animate only `transform` and `opacity`; nothing loops faster than 7s. Every animation needs a purpose you can say in one sentence. Never hijack scrolling.
- `still` tier / `prefers-reduced-motion`: the same page fully usable with nothing moving on its own.
- Targets at least 44×44px; visible `:focus-visible`; real buttons and links; labels on icon buttons; dialogs trap focus and close on Escape (keep what already works).
- Phone first: 360×800. Use `svh`/`dvh` units, never bare `vh` for full-height things. No horizontal scrolling.
- Code: clean up every listener/observer/timer on unmount; no new dependencies; `npx eslint <your files>` clean; no console output.

## What must not change
Every API call and its payload (`utils/api.js`), sign-in (`context/AuthContext`), saved conversations, language choice, kept verses (`utils/kept.js`), the helpline (`utils/constants.js` → `HELPLINE`), the routes, and every feature a page has today. Redesign how it looks and moves, not what it does.
