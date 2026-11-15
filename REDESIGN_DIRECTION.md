# Gitaarth — Redesign Direction

## What is wrong today
The site is ivory with thin gold lines, a framed picture in an arch, and sections that fade up. Nothing in it has a light source, depth, weather or life, and Krishna appears only as a small framed illustration. It reads as a tidy template. The lightness is not the fault; the flatness is.

## Three concepts considered
1. **The Lamp.** The visitor carries a flame that reveals a shrine. Ordinary: light-as-cursor is a known trick, and it only works in darkness, which this site must not have.
2. **The Leaf.** The whole site is a palm-leaf manuscript whose engravings come alive. Ordinary: storybook sites are common, and God stays an illustration instead of a presence.
3. **The Hour Before Sunrise (chosen).** The whole site is one morning at Kurukshetra, before anything has begun. The page's ivory is the mist. Scrolling raises the sun. The visitor is a small warm light that stays in one place while the world arrives around it, and Krishna is reached by degrees. It is chosen because the light theme becomes the subject instead of a constraint, and one physical law (a single sun) ties the film and the interface together. The Leaf survives inside it: verses are kept on palm leaf, in the Library and in answers.

## The sun (the law of the site)
- Position: behind the scene, to the viewer's upper left. Shadows fall toward the lower right.
- On Home its height is the scroll position (`--sun`, 0 before dawn to 1 full morning). Elsewhere it follows the visitor's local time, clamped to a gentle range, so evening is lamp-warm cream and never dark.
- Everything reads it through CSS variables: shadow offset and length, shadow warmth, page tint (pearl → ivory → warm gold), highlight angle on gold.
- Shadows are umber with a touch of violet, soft, never grey. Things that touch the ground get a contact shadow.

## Palette (evolved from the present tokens)
Ivory `#fbf7ee` (page, mist) · pearl `#f1eee9` (before dawn) · cream `#f4ecdc` · sand `#e6d5b8` · stone `#cdb891` · champagne gold `#d9be8a` · deep gold `#a97d2f` · gold ink `#87611f` (small gold text) · saffron `#e39a3b` (a few percent only) · ink indigo `#1c2040` (words, the true dark) · peacock `#1f5e6b` · leaf `#6f7f4f` · palm leaf `#e9d9ae` · rosewood `#5a3424` (Library only) · shade `rgba(92, 62, 40, α)`.
Tonal budget: about 70% light, 25% middle, 5% true dark.

## Type
Unchanged families, used with more intent. Cormorant Garamond for display lines (300 at large sizes, tight tracking, hand-set breaks). Newsreader for reading (17–19 px, 1.7). Instrument Sans for controls. Tiro Devanagari Sanskrit for verses, 15% larger than neighbouring Latin, line height 1.8.

## Ornament
One tradition: **Odisha palm-leaf engraving** (fine incised line, lotus and creeper, rubbed dark). Used only as a verse's border, a section mark and in the Library. No filler.

## Motion tokens
- Camera (scroll): spring-smoothed progress, about 0.8 s settle, always reversible.
- `--ease-camera: cubic-bezier(0.65, 0, 0.35, 1)`, 1200–2400 ms. `--ease-out: cubic-bezier(0.22, 1, 0.36, 1)`, 160–240 ms for controls. Exits at 70% of entrances.
- Life: wind is layered noise with periods of 7, 11 and 17 s, so nothing visibly loops. Dust drifts 4–10 px/s.
- Passages between pictures go through mist, 0.8–1.6 s. No cuts, no flashes, no bounce.
- Text: lines rise through a mask, 80 ms apart. A verse is written left to right at reading speed.

## The journey on Home (one pinned stage, about 5.5 screens of scroll)
| Scroll | Beat | What is seen | Words |
|---|---|---|---|
| 0–10% | Mist | Blank pearl-ivory, drifting mist, the visitor's small light | "Some answers are not found. They are understood." |
| 10–28% | First light | The sun's edge clears the horizon; far ridges, a tree line, a chariot at rest and a flag appear out of haze; the camera drifts forward | "Before the Gita was a book, it was a morning." |
| 28–44% | The question | Arjuna, seen from behind, bow on the ground, hands folded | His question (2.7), then "So he turned, and he asked." |
| 44–72% | The approach | Ground level: sunlit earth, Krishna's feet and their shadow; the camera rises through silk and garland; only then his face | none until the face: "And Krishna smiled." |
| 72–88% | Darshan | He stands at ease, whole, looking at you; the camera rests | 18.66 is written in the air, ending "मा शुचः — do not grieve." |
| 88–100% | Speak | The small light drifts into the question box and becomes its cursor | "What rests on your heart today?" + paths |

After the stage: how it works, today's verse on a palm leaf, the honest note, and a closing invitation, all under the same sun.
A fixed "Speak now" control is present from the first frame, and the navbar's Seek Guidance stays.

## How each scene is made
- **Mist and haze:** soft noise textures generated once on a canvas and moved with transforms; they thin as `--sun` rises.
- **Landscape:** layered ridges fading toward ivory with distance (drawn in code until the painted plate arrives).
- **Figures:** a `LivingImage` (one small WebGL program): the still is given depth from a depth map (pointer, tilt and camera shift it), and wind from a motion mask (cloth sways, faces never move). Without WebGL it is the plain image.
- **Flag:** a strip of cloth simulated on canvas, lit from the sun's side.
- **Dust:** a 2D canvas of motes that catch the light near the sun and fade elsewhere.
- **Verse writing:** real text revealed by a moving soft mask.
- **The small light:** one DOM element with a warm core and a soft halo, the only thing on the site allowed to glow.

## Three versions
- **Full:** everything above.
- **Lighter** (low memory, few cores, data-saver, or measured slow frames): no WebGL, no flag simulation, fewer mist layers and motes, stills only.
- **Still** (reduced motion): no pinned stage. The six beats become six composed stills in normal page flow with the same words, cross-fading in.

## Other pages
- **Chat:** the shade beside him. Krishna rests at the edge of the screen, never across the text; answers arrive as a calm reading column; verses sit on a palm leaf; waiting is a peacock feather stirring.
- **Library:** a sunlit room of manuscripts. Each chapter is a bundle between rosewood covers tied with a cord; opening one fans out its leaves; text is incised.
- **Sanctuary, About, not-found, navbar, footer, sign-in, toasts, veil:** the same morning and the same sun. Page changes are mist closing and opening.

## References studied
My three recordings (for camera, depth, holds and reveal). Atmos by Leeroy (scroll as flight, fake depth of field). Persepolis Reimagined, Getty (walking into a place). David Whyte Experience (camera path replayed on scroll, hand-made reveals). Pendragon Cycle (fog and light for depth). Ponpon Mania (illustration split into planes). bhagavadgitaforall.com (its feeling comes from video, not from web technique).
