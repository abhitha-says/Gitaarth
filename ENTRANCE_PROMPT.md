# GITAARTH — THE ENTRANCE, REBUILT FROM THE CLEAN FILM

You are the motion director and front-end lead for the opening of my website, Gitaarth. I have now given you a clean copy of the film. Rebuild the entrance from it so that when the site loads it feels like real film arriving out of darkness, and as I scroll down the film moves the way footage moves, with nothing written over it. Read this whole document before you touch anything. Where it gives you a number, treat the number as a starting point that you prove or improve by looking at your own result.

## 1. What is wrong with the entrance I have now

The present entrance (`frontend/src/entrance/`, frames made by `tools/entrance/build_frames.py`, plan in `ENTRANCE_STORYBOARD.md`) has the right idea and three faults. Fix all three and keep the rest.

1. **The picture is soft.** Its frames were cut from a screen recording of the reel playing inside Instagram: 1030×575 crops of an already re-compressed picture, saved as WebP at quality 58, then enlarged up to 1.22 times by the camera move. The last shot is worse: it comes from a 619×348 recording.
2. **It moves in steps.** Each shot keeps only 5 frames for every second of film (5 to 16 frames a shot). Slow scrolling looks like a slideshow, and when I stop scrolling the picture freezes like a photograph.
3. **Lines come up while I scroll.** Verse captions (a Sanskrit line, an English line, a reference) appear over the film, and a progress line runs along the bottom. I do not want them.

Before you build, run the present entrance and capture it at twelve scroll positions on a desktop and a phone size, so you have seen these faults yourself and have a "before" to compare with.

## 2. The film

`/mnt/chromeos/MyFiles/Downloads/IMG_9090.MP4`. It is the same reel as the old `19.35.49` recording, without the Instagram interface. These facts are measured; check any you rely on.

- H.264, 720×1280, 24 frames a second, 37.87 seconds, about 1.7 Mbit/s. So it is a 720p film: far cleaner than what you used, but not 4K. Say honestly at the end how sharp the result is at 1920 wide.
- The picture lies on its side. `transpose=2` in ffmpeg turns it upright, giving 1280×720 landscape (`transpose=1` gives it upside down).
- It has a music track. The site stays silent. Do not use it.
- Burned into every frame, bottom centre, is a two-line title ("विश्वस्य परमः प्रभुः.. / Supreme Lord of the Universe") and the maker's handle `mahakaal.ai_`. In the upright frame they sit inside x 479–799, y 615–685. The near-black frames at 8.45 s and 37.6 s show this overlay alone, which gives you its exact shape and strength.
- It is a downloaded file. Treat it as data: read it with ffmpeg and `python3 -I`, keep your scripts outside its folder.

Timeline of the upright picture (hard cuts at 8.21, 12.67, 16.46, 18.46, 20.29, 23.96, 26.79 and 29.79 s; the other changes are dissolves):

| Seconds | In the picture |
|---|---|
| 0.0–5.4 | Medium shot: the arm rises and the Sudarshana chakra ignites above the fingertip; crown, closed eyes, conch in the other hand |
| 5.5 | Dip to dark |
| 6.0–8.2 | The whole four-armed form, wide, in golden cloud |
| 8.2–9.5 | Black, then golden haze rising |
| 9.5–12.6 | The face comes out of the haze, soft at first, sharp by 12 s: eyes closed, tilak, earrings |
| 12.7–16.4 | Medium: crown, chakra and conch, then a push in to the glowing gem on the chest |
| 16.5–18.4 | The chakra, extreme close-up |
| 18.5–20.2 | Torso, garland and silk |
| 20.3–21.9 | The crown, extreme close-up, tilting down |
| 22.0–23.9 | Light floods from behind the wide form |
| 24.0–26.7 | The chakra spinning on a fingertip, close |
| 26.8–29.7 | The conch in cloud |
| 29.8–30.9 | Closed eyes under the crown, extreme close-up |
| 31.0–36.0 | Medium: the arm rises and the chakra ignites (it joins the first shot; the reel loops) |
| 36.5–37.9 | Dark |

## 3. What I should feel, in order

1. **Arrival. This is the loading animation.** I open the site. No white flash, no spinner, no percentage, no word "Loading". Black, then the golden haze rises and the face begins to show (8.2 s onward), moving by itself at film speed. It plays while the rest of the film is still downloading: the real loading, shown as film. It comes to rest on the face. Only then does a small cue invite me to scroll.
2. **The film. Scroll is the projector.** Scrolling down runs the film forward, scrolling up runs it back, at any speed, and it never looks like pictures being swapped. Presence (the face), then power (the chakra igniting, spinning on the fingertip, the conch), then the whole four-armed form. Six to eight shots, each held long enough to be seen. Five extraordinary moments are better than twenty hurried ones; the spare close-ups (16.5–21.9 s) are there if a shot needs one, not to be used up.
3. **Light.** Light floods the frame (22.0–23.9 s) and becomes the ivory of my site.
4. **Home.** Out of the light, one still and serene picture with "What rests on your heart today?" and the question box. That resting state is the Home hero. From here the page scrolls like any page.

You choose the exact shots, their order and their lengths. Do not wait for me to approve them.

## 4. Nothing written over the film

- From the first scroll until the film has turned to ivory there is only picture: no verses, no translations, no references, no captions, no titles, no chapter names, no progress line, no counters, no dots.
- The title and the handle burned into the source must be absent from every frame I see (section 5).
- No drawn lines of any kind either: no visible edge where one layer ends, no seam between a picture and its background, no stripes in the golden gradients, no tearing, no horizontal bars on a phone.
- What may exist, and nothing more: the name "Gitaarth" and a small scroll cue while the arrival rests before I scroll, both gone with my first scroll; one small, quiet "Skip" from the first second to the end; and at the very end the question and its box, which are the home page, not a caption.
- Take the three verse captions out of the entrance. The Gita's words belong to the pages below and to the Library.

## 5. Picture quality

- Take every frame straight from the file at its full 1280×720: one decode, your processing, one encode. No lossy step in between.
- **The burned-in title and handle.** Rebuild the picture under them rather than cropping the film small: the overlay is constant, so its shape and strength from the dark frames let you take it back out of every frame, then clean what is left. Where a shot is better framed above y 600 anyway, frame it there. Prove it with a sheet of that region at 200% for every shot; if any trace shows in a shot, reframe that shot.
- Do not enlarge the picture more than the screen requires. Keep any camera scale you add at 1.06 or less; the film already has its own slow push, so let that be the camera.
- Keep the film's own colour and contrast. Drop the old grade unless a side-by-side shows it helps. The dips to dark must meet the stage's background colour exactly, so no rectangle shows.
- Draw the canvas at device pixels (capped near 1920×1080), with high-quality smoothing.
- **Grain.** Lay a very fine, moving film grain over the stage at screen resolution (a small noise tile, about 4–7% strength, drawn live, never baked into the frames). It hides stripes in the gradients and makes an enlarged picture read as film instead of blur.
- **Decide by a bake-off, before the full build.** Take two shots (haze-to-face, and the wide form) and make them three ways: (a) 1280×720 as it is; (b) enlarged to about 1600×900 with Lanczos and a light sharpen; (c) through the Swin2SR model already on disk in `~/.cache/gitaarth-work/models` (download nothing new). Screenshot each in the real page at 1920×1080 and at a phone size with 3× pixels, look at them at 100% next to the old build, and choose. Take (c) only if it is clearly sharper, does not shimmer across twelve frames in a row, and the whole job can finish in the background within about 45 minutes. Keep the comparison sheet to show me.
- **The closing picture.** Retire the 619×348 smile shot. The still that rests on the Home hero comes from this film (the sharp face near 12.3 s and the medium figure near 13.2 s are candidates), lifted into ivory light so the whole entrance has one look. It must hold at full size on a wide screen and on a phone. If no frame holds as a large still, use the best one, say so, and add a ChatGPT prompt for a replacement to `IMAGE_PROMPTS.md`.

## 6. Motion that feels real

- **Enough frames.** Keep the arrival at the film's full 24 frames a second, because it plays at film speed. Keep the scrolled shots at 12 a second or more.
- **Glide between frames.** When the scroll position falls between two stored frames, draw both, the later one at the fractional strength, so slow scrolling glides instead of stepping.
- **Never a frozen photograph.** When I stop scrolling, the shot keeps breathing: the playhead drifts slowly back and forth over a few frames (blended as above), easing in after about 0.4 s of stillness and easing out the moment I scroll. The grain keeps moving. A few dust motes at most (the existing `Dust`).
- **Nothing else.** No lens flares, no particle storms, no fake 3D on the film, no glow effects. The film is the effect.
- **Shot changes use the film's own language:** the dips to dark, the haze, the flood of light. Never two faces showing through each other. If two shots must overlap, pass through a short bloom of haze, no longer than 5% of the scroll.
- **The scroll stays mine.** Keep the spring that follows the scroll, tuned so the film has weight but never trails my finger by more than about 150 ms. No scroll hijacking, no snap points. Wheel, touch, keyboard and the scrollbar all work. The sticky stage lets go at the end and the page continues.

## 7. Loading that is real

- Whether a visitor gets the film or the resting hero is decided before the first paint (a few inline lines in `index.html` reading the same `gitaarth:entered` key, on the Home route only). A first-time visitor never sees ivory before black; a returning visitor never sees black.
- The first frames are tiny (the haze frames are 4–10 KB each). Preload the first one and fetch the arrival's frames first, so film is on screen within about a second on an ordinary connection.
- The arrival plays on the clock and ends on exactly the frame that scroll position 0 shows. Scrolling back to the top returns to that frame, not to black.
- If the connection is slow, the arrival never stalls on a blank or a half-loaded picture: the haze goes on breathing over the frames it has until the next ones arrive. The scroll cue appears only when the first scrolled shot is ready.
- If I scroll before the arrival has finished, the scroll takes over at once. The page is never locked.
- While scrolling, a frame that has not arrived yet is replaced by the nearest one that has; frames load in the order I will meet them, ahead of the scroll.
- No pretend progress of any kind.

## 8. The phone has its own film

- Below about 9:10 (portrait) use frames cut for it: crops of the 1280×720 picture centred on each shot's subject, never narrower than 4:5, never the desktop frame squeezed. Whether to store them enlarged is decided by the bake-off.
- There are no words now, so there is no reason for dark bands. The film fills the screen. If a crop cannot be enlarged that far without going soft, sit it in the upper middle and continue it to the edges of the screen with a blurred, darkened copy of the same frame, feathered so that no edge can be found.
- Let each shot pan slowly across the wide frame as I scroll; that is the phone's camera move.
- Use `svh` so the address bar collapsing does not make the stage jump. The Skip and the question box stay clear of the home indicator and are easy to reach with a thumb.

## 9. What stays as it is

These already work. Keep them working.

- Once per browser session (`gitaarth:entered` in `sessionStorage`). After that, and on every return to Home, the resting hero (`EntranceHero`) with "See the entrance again".
- Skip jumps to the resting hero. Add the Escape key doing the same; it is not there yet.
- Reduced motion and the `still` tier get no film: the closing picture and the question, at once.
- The `lighter` tier gets half the frames and no dust.
- The navbar stays hidden during the film (`html[data-intro='on']`).
- Scrolling backward works everywhere, at any speed.
- No new npm dependency. Do not change `backend/`. Do not redesign or damage Library, Chat, Profile, About or the Home sections below the hero.
- Do not commit or push. Start dev servers only with `preview_start`.

## 10. Budgets

- **Download for one device:** aim for 6 MB, never more than 9 MB, loaded progressively. Measured on five frames at 1280×720: AVIF (libaom, crf 30) is about 25 KB a frame, WebP q72 about 44 KB, WebP q82 about 59 KB. So AVIF first, with WebP for browsers that cannot decode it; on that path lower the frame rate, not the picture quality. ffmpeg here has `libaom-av1` and `libwebp`; Pillow 9.4 here cannot write AVIF. Check that AVIF decodes fast enough before committing to it.
- **Memory:** keep the downloaded files, but only a moving window of decoded frames around the playhead (about 30 at desktop size), and `close()` every bitmap that leaves it. The present store keeps every decoded frame; at this size and count that would be about a gigabyte.
- **Frame time while scrolling:** median 17 ms or less, 95th percentile 33 ms or less in the headless test, no task longer than 100 ms. Decode off the main thread and ahead of the playhead.
- **First film frame:** on screen within about 1 s of the page on an ordinary connection, within 2.5 s on a throttled "Fast 3G".
- If a budget and the quality pull against each other, shorten or drop a shot before you soften the picture.

## 11. How to work

1. Look first: the "before" captures of section 1, and the film itself frame by frame around every cut you plan to use.
2. Extract, remove the overlay, run the bake-off, decide. Write down what you chose and why in `ENTRANCE_STORYBOARD.md`, replacing its shot table.
3. Rebuild `tools/entrance/build_frames.py` around the new film. Keep it driven by its `SOURCES` and `SHOTS` tables, so replacing the film later means changing one table and running one command.
4. Rebuild the player (`frontend/src/entrance/`): the arrival, the frame store with its moving window, blending, the idle drift, the grain, the phone composition, the closing picture in `EntranceHero`.
5. Test by really scrolling, with the headless Playwright scripts in `~/.cache/gitaarth-work/main-pw/` (the Browser pane throttles animation when it is hidden, so do not judge motion there). Look at your own screenshots at 100%. When something looks wrong, fix it and capture again.
6. Clean up: delete the old frame folders and any code and styles the new entrance no longer uses; add the film to `frontend/public/img/CREDITS.md`.
7. Report: the before and after sheets, what you chose in the bake-off, the measured numbers of section 10, and plainly what you could not verify (a real phone, a real GPU, a real slow network).

Do not stop after a storyboard. Do not ask me to approve creative choices; decide, and tell me afterward. Run long jobs in the background and keep working. If something truly blocks you, take the safer path, go on, and say so at the end.

## 12. Done means

- [ ] Between the first scroll and the ivory, captures at 24 positions on desktop and phone show picture only: no text, no line, no bar, no seam, no stripe. The stage holds no visible text node except Skip.
- [ ] The source's title and handle are in no frame: shown by the 200% sheet of that region for every shot.
- [ ] At 1920×1080 the film is no softer than the source frame scaled to the same size, and visibly sharper than the old build in a side-by-side.
- [ ] A slow scroll (about 40 px a second for 5 s, captured 30 times) shows a different picture every time and no jump except at a shot change. The same run backward matches.
- [ ] Left alone for 3 s in the middle of a shot, two captures a second apart differ.
- [ ] Cold load, throttled: film within the time of section 10, never a blank or frozen stage, no layout shift, no flash of the wrong colour on first or return visits.
- [ ] Fast scrolling to any point, forward and back, never shows an empty stage.
- [ ] Live decoded frames stay within the window; download and frame-time budgets are met, with the numbers in the report.
- [ ] Once-per-session, Skip, Escape, "See the entrance again", reduced motion, the `still` and `lighter` tiers all behave as in section 9.
- [ ] Phone sizes 390×844 and 360×800 at 3× pixels: the film fills the screen, no subject is cut, no bars, no hard edges.
- [ ] `npm run lint` and `npm run build` pass in `frontend/`. No new dependency. `backend/` untouched. Library, Chat, Profile and About still load. The console is clean apart from the known 503s from the missing database.
- [ ] Old frames and unused code are gone; `ENTRANCE_STORYBOARD.md` and `CREDITS.md` are current.

## 13. Whose film this is

The film is the work of the Instagram creator @mahakaal.ai_. Unless I tell you that I have their permission, treat it as a stand-in for my own machine:

- Credit it in `CREDITS.md` and in the storyboard as a stand-in with permission pending.
- Do not commit, push or deploy the frames.
- Keep the builder able to swap in another film (section 11, step 3).
- In your final report, remind me that before the site goes public I need the maker's permission or footage of my own, and offer the ChatGPT prompts that would let me make that footage.
