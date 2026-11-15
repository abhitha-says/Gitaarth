# Gitaarth — the entrance

A film-driven opening shown once per visit, before the Home page. While the site loads, golden haze parts on his face; then the scroll runs the film of the four-armed form (the crown, the discus, the conch, the whole form), light floods it, and the light becomes the ivory of the site, where his four-armed form rests in an arched window above the question "What rests on your heart today?".

Scroll is the projector: forward and back, at any speed, the film moves the way footage moves. Shots join through the film's own dips to dark and its flood of light. Nothing is written over the film.

## The four references, read

| Recording | Length, shape | What it does best | What we take | What we leave |
|---|---|---|---|---|
| **19.35.49** (main) | 37.6 s, landscape film shown sideways in a portrait reel | Extreme close-ups of the four-armed form: eyes closed, the chakra igniting above a raised fist, spinning on a fingertip, the conch in golden cloud; dips to black and haze between shots; a constant slow push | The whole heart of the entrance (Act III), the rhythm "macro, macro, macro, then the wide form", the dips through haze | Instagram overlays, caption text, watermark, the loop |
| **12.05.09** | 39.3 s, 16:9 (After Effects screen) | Ordinary battlefield turning divine: armies in brown dust, Arjuna's flag, Krishna's bare feet and silk walking in, his smile | His human smile, for the last shot. Field, flag and feet are listed as spare shots in `tools/entrance/build_frames.py` | Editor UI, watermark, the many-armed composite with on-screen shloka |
| **12.06.16** | 35.4 s, 16:9 | Cosmic forms that end in a total whiteout | Only the idea of resolving into white light (Act IV) | Every frame: meme caption, mixed deities, purple palette |
| **12.09.36** | 16.6 s, 16:9 | One focal figure in a nebula, slow push | The discipline of one focal point per frame | Its frames: red nebula and mixed iconography would break the gold-and-blue palette |

Palette taken from 19.35.49 and graded: burnished gold highlights, deep umber shadows pushed slightly toward celestial blue, yellows desaturated ~15% so it never turns orange. It resolves into the site's ivory.

## The film (rebuilt from the clean copy, 2026-11-15)

Source: `IMG_9090.MP4`, the same reel as 19.35.49 without the Instagram interface (720×1280 sideways, 24 fps). Every frame is used at the film's full 1280×720: turned upright, the burned-in title and handle rebuilt from their surroundings, and otherwise left exactly as it is (no grade, no resize, no vignette). Nothing is written over the film.

| # | Shot | Film time | Frames | How it moves |
|---|---|---|---|---|
| 0 | Arrival: black, golden haze, the face comes out of it | 8.25–12.62 s | 105 at 24 fps | Plays on its own while the site loads, then rests on the face with "Gitaarth" and "Scroll to enter" |
| 1 | Crown, discus and conch | 12.71–15.00 s | 28 at 12 fps | 12 % of the scroll |
| 2 | The discus spinning on a fingertip | 24.00–26.75 s | 33 | 16 % |
| 3 | Panchajanya in cloud | 26.83–29.75 s | 36 | 16 % |
| 4 | The arm rises, the discus ignites | 0.00–5.42 s | 66 | 24 % |
| 5 | Through the dark: the whole four-armed form | 5.46–8.17 s | 33 | 18 % |
| 6 | Light floods from behind him | 22.00–23.92 s | 24 | 14 %, then the light becomes the site's ivory |
| — | Rest: the four-armed form (7.30 s) in an arched gilt window, the question beneath | still, cut above the old title, upscaled 2× with Real-ESRGAN | 1 | The Home hero (also shown on return visits and with reduced motion) |

Spare close-ups, unused: chest gem 15.0–16.4, discus macro 16.5–18.4, garland 18.5–20.2, crown 20.3–21.9, eyes 29.8–30.9.

### Decisions

- **Sharpness.** The film is 720p. Only the Home hero still is upscaled (Real-ESRGAN, about 4 minutes on CPU); it is shown near its own size inside the arch, so it stays crisp. AI upscaling takes minutes to an hour a frame on this CPU, so it was not usable for 325 frames; sharpened Lanczos was barely different from the browser's own scaling. The frames are stored at native size and the browser scales them.
- **Format.** AVIF (AV1 still, crf 22, 4:2:0, about 29 KB a frame) keeps the picture within about 40 dB of the source, as good as WebP at quality 90 for about half the size. Browsers without AVIF get WebP q86 for every second frame.
- **Motion.** Scroll drives a fractional playhead; the two nearest frames are blended, so slow scrolling glides. Left still, the playhead sways a few frames to and fro within the shot. A fine grain (light and dark specks, normal blending) moves over the film on full-power devices.
- **Memory.** Files are kept as small blobs; only frames near the playhead are decoded (desktop 8 behind / 18 ahead, phone 6 / 12) and the rest are closed.
- **Phone.** A 4:5 window of the frame that pans across each shot towards its subject, continued to the screen edges by a heavily blurred copy of the same window.
- **The burned-in title.** Its shape was measured from the near-black frames (8.3–8.5 s, 36.9–37.9 s) and every frame inpainted under it (`tools/entrance/review/title-region-200.png` shows the region of every shot at 200 %). It reads as nothing; over dense jewellery it is slightly painted when magnified.

Review sheets: `tools/entrance/review/` (before and after at 100 %, the desktop and phone journeys).

## Rules it keeps
- Shown on the first arrival in a browser session only (decided before first paint in `index.html`, so a first visit never flashes ivory). Skip, or Escape, at any time; the sticky stage releases at the end.
- Reduced motion: no film, the resting hero at once. Lighter devices: every second frame, no grain.

## Rights — read before publishing
Every frame comes from @mahakaal.ai_'s reel (`IMG_9090.MP4`). They are used here as **stand-ins for local development only**. Before the site is public, either get the creators' permission or replace each shot with your own footage/pictures; the timeline is in `frontend/src/entrance/frames.json` and rebuilt by `tools/entrance/build_frames.py` (change `SOURCES` and the times in `SHOTS`, run it once).
