# GITAARTH AI — ULTIMATE CREATIVE MASTER PROMPT

You are the creative director, motion director and front-end lead for the next version of my website, Gitaarth AI. I am giving you a free hand and I expect work at the level of an award-winning studio. Read this whole document before you touch anything. It tells you what the project is, what my taste is and why, what must not change, and the standard the result has to meet. Where it gives you an idea, treat it as a starting point you are expected to beat.

## 1. The project

Gitaarth AI is a place where a person says what is weighing on them and receives guidance drawn from Krishna's teaching in the Bhagavad Gita, with material from the Ramayana and Mahabharata, in English or Hinglish. People arrive sad, confused, searching for direction, curious about the Gita, or simply wanting a quiet place. Most are on a phone and many are in India.

The site has to do two things: make the visitor feel they have stepped out of their day into somewhere peaceful, sacred and out of the ordinary, and lead them gently to the conversation. It must never look like a chatbot product, a dashboard, a typical religious website or a spiritual landing-page template. It must never feel intimidating, preachy or crowded. Someone who has never opened the Gita should feel as welcome as a devotee.

## 2. Before you change anything

1. Inspect the project. `frontend/` is React 19, Vite, Tailwind 4, Framer Motion and React Router. `backend/` is a Node server for sign-in (including Google), chat and saved conversations. Read every page (`Home`, `Chat`, `Library`, `Profile` which also serves `/sanctuary`, `About`, `NotFound`), every component, the contexts (`Auth`, `Toast`, `Veil`), the utilities, the design tokens in `frontend/src/index.css` and every file in `frontend/public`. Run the site and look at each page at phone and desktop sizes.
2. Write down what exists: routes, features, states (signed in, signed out, empty, loading, error), API calls, stored keys, assets and the present design system. This is your list of things that must still work at the end.
3. If the local branch `backup/before-vaikuntha-redesign` does not exist, save the present state as a commit on a new backup branch before editing. Do not push.
4. If you cannot open my files or the videos below, say exactly which ones and ask for them. Do not design blind and do not pretend to have seen something you have not.

## 3. My references and what they tell you about my taste

Three screen recordings show what moves me. If they are available (`/mnt/chromeos/MyFiles/Downloads/Screen recording 2026-11-15 12.05.09.webm`, `12.06.16.webm`, `12.09.36.webm`), pull frames from them and study them shot by shot, including how long each move and each hold lasts. They are recordings of rendered films, not of scrolling websites, and they have no sound. Study them for picture, camera and timing.

**Reference A, a Kurukshetra film (39 seconds, four cuts).** A flag with Hanuman snaps in the wind. Arjuna is seen from behind with folded hands, his cloth streaming. The camera sweeps past the chariot, a quarter-second wash of light hides the cut, and we are at ground level watching Krishna's feet walk, with a soft contact shadow beneath them and the army out of focus behind. For three seconds we see only feet and anklets. For three more the camera climbs through moving silk and a garland. Only then the face, smiling, held for two seconds. The camera pulls back and the chariot slides into the foreground. Lines of a shloka appear in the air one after another. Then the picture holds for fifteen seconds and nothing moves except cloth, sparks and light.

**Reference B, a reel from Bhagavad Gita For All (35 seconds, 21 of them without a cut).** A tiny white human figure stays at the same point of the frame the whole time while vast forms of Vishnu and Krishna rise behind it and melt into each other, each held about three seconds, each dissolve about a second and a half, with one slow push-in underneath everything. It ends by flooding to white light, and then Krishna is speaking to you from a phone.

**Reference C, a cosmic composition (one 14-second shot).** A sleeping face of Krishna fills the left of the frame, a figure of light lifts the chakra at the centre, another figure reaches from the right. Nothing happens except a slow push-in during which the three layers drift at different speeds and the nearest slides out of frame, while a few stars glint.

**Why I like them. These are the qualities to carry forward:**

- God is shown, with a face you want to keep looking at, and is revealed by degrees. The wait is the emotion.
- The camera is always moving, slowly, and each move has one intention: approach, rise, or step back to show scale.
- Depth is real: near things are soft and pass close to the lens, the subject is sharp, the distance is hazy.
- The world is alive while the composition holds still: wind in cloth, dust in light. Long holds are allowed.
- One picture becomes the next through light. Cuts are hidden; nothing slides in as a box.
- A small human stands before something immeasurable, and that human is me, the viewer.
- Words appear as part of the scene, at reading pace.

**What must not be carried over:**

- Their darkness and their saturated magenta, crimson and orange. My site is light (section 4).
- Any shot, layout, sequence or composition as it appears. Take principles, never pictures.
- Armies, weapons, elephants, lightning. Mine is the quiet field before anything begins.
- Repeated white flashes, heavy glow and lens effects.
- The overwhelming many-armed and many-headed forms. I want awe that comforts, never awe that frightens an anxious person.
- The waxy 3D faces and staring eyes of TV-serial graphics, and captions laid across a deity.

A finished film can only be watched. My site can be entered: the visitor's hand moves the camera, the world answers their touch, and at the end they speak and are answered. That is how the result goes beyond the references.

## 4. The light theme is not negotiable, and it is the hard part

Gitaarth is a light site: warm ivory, soft cream, champagne gold, a little saffron, warm beige, natural sunlight and soft shadows. No dark interface, no black and gold, no saturated orange, no neon, no heavy gradients, no glow as decoration, no divine effect that looks stuck on. It must stay bright, calm and easy on the eyes.

My references are dark and my site is light. Do not solve that by dimming the site, and do not solve it by going flat. The site today is ivory with thin gold lines, small ornaments and sections that fade in; it is tidy and lifeless. It fails because it has no picture, no depth, no light source and no life, not because it is light. Your task is to bring everything in section 3 into daylight. These rules make that possible:

- **The page is the light.** Treat the ivory of the page as morning light and mist. Scenes come out of it and return to it. An image never sits in a rectangle; its edges dissolve into the page colour.
- **Distance fades to light.** Far layers are paler, warmer and lower in contrast until they join the page; near layers carry more colour and detail; the very nearest are out of focus. Morning haze works this way, and it gives depth without darkness.
- **Keep a tonal range.** Roughly seven parts light (ivory, cream), two and a half parts middle (sandstone, gold, cloth, leaf, peacock blue) and a small part true dark (ink-indigo text, hair, the cores of shadows, Krishna's skin). Without that small dark part everything turns to milk. Squint at every screen: if no shape survives, it is flat.
- **One sun.** Choose where the sun is and keep it for the whole site. Every painted scene, every shadow under a card or button, every highlight on gold obeys it. Shadows are soft, warm or faintly violet, never grey or black, and things that touch the ground have a contact shadow.
- **Gold is a metal.** It has a highlight that moves when the view moves. It is not a yellow gradient. Small gold text uses a deep gold that passes contrast.
- **Light comes from sources.** The sun, a flame, light through cloth or leaves. Only real highlights bloom, softly. Text, buttons and cards never glow.
- **Saffron is a spice.** Keep it to a few percent of any screen so it means something when it appears.

Start from the tokens in `frontend/src/index.css` and evolve them. Do not throw the identity away.

## 5. Creative direction: yours to set

Three things must become one thing: the realism of a film (camera, depth, natural motion), a sacred presence (Krishna and Arjuna, Kurukshetra at sunrise, quiet reverence, Indian craft) and contemporary editorial design (confident type, generous space, restraint). They must not sit side by side as a film strip, a temple border and a landing page. A test: any still frame of the site should read as one composed picture in which the type belongs to the scene.

Set your own concept and write it down before building. One direction is offered here so you know the level I expect; improve it or replace it with something stronger.

*The hour before sunrise.* The whole site is one morning. It opens as almost-blank ivory mist with one line of text and a small warm light, which is the visitor. Scrolling raises the sun: the scroll position is the sun's height. Mist thins, the still field of Kurukshetra appears with a chariot at rest and a flag barely stirring, shadows shorten and turn across the entire interface, the colour of the light moves from pearl to gold. The small light stays at one place on the screen while the world changes around it, and Krishna is approached by degrees (devotees traditionally take darshan from the feet upward) until he is simply there, at ease, looking at you. A line of the Gita is written into the air at reading pace. The small light settles into the question box and becomes its cursor: speak. Other pages are the same morning in other places: the conversation in the shade beside him, the library a sunlit room of manuscripts.

Ideas none of my references use, to take, improve or discard: the sun following the visitor's real time of day (evening is lamp-lit cream, still light); mist that parts under the pointer or thumb; tilting the phone shifting the scene in depth; the worry a visitor types lifting off as petals or dust on the wind; the verse in an answer being inked onto a palm leaf; raking sunlight moving across engraved letters as you scroll; page changes as mist closing and opening; optional sound of flute, tanpura and morning birds.

Before you settle, sketch at least three different concepts in a paragraph each, say what is ordinary about each, and choose the one a visitor would describe to a friend the next day. If your idea is better than everything here, follow it. Do not ask me to choose between options; decide.

Every animation must be able to answer "what does this tell the visitor or make them feel?" If the only answer is "it looks impressive", remove it. Fades, slide-ins and hover effects may support; they are never the main event.

## 6. Every page, one world

- **Home.** The journey above, ending in a clear invitation to speak. Then what the page says today (how it works, the paths by what rests on your heart, today's thought, the honest note that Gitaarth is a companion and not a deity), remade to belong.
- **Chat.** The moment they came for. It should feel like sitting beside Krishna and being heard, not like a chat window. The waiting state is part of the world. Long answers and Sanskrit verses must be comfortable to read, and typing on a phone must be effortless. Here the motion becomes very quiet.
- **Library.** Verses kept as they were kept in old times: palm-leaf manuscripts between carved wooden covers, tied with a cord, with real grain and engraved lettering in sunlight. A chapter can be a bundle you untie and leaf through. Keep all it does now: 18 chapters, search, finding a verse by number such as 2.47, the Ramayana tab, and "reflect on this verse" opening the chat. Build it so the present version can be restored in one step.
- **Profile / Sanctuary, About, not-found, navbar, footer, sign-in, page transitions, toasts.** The same world. Nothing may look left over from the old site.

At every moment the visitor knows what to do next. A person in distress can reach the conversation in one tap from anywhere without watching anything, and the Tele-MANAS helpline stays where it is.

## 7. The pictures decide everything

Realism comes from artwork. Code can make mist, dust, light and wind; it cannot paint Krishna's face.

- As soon as the concept is fixed and before building, give me a numbered list (Image 1, Image 2, …) and save it as `IMAGE_PROMPTS.md`. For each: a prompt I can paste into ChatGPT unchanged, size and orientation, the background required (transparent, or flat page ivory), the file name, and whether it is essential. Eight to twelve images. One shared style paragraph so all belong to one morning: naturalistic painted realism, soft early sunlight from your chosen direction, high-key ivory and gold, real cloth and skin, serene faces, correct hands, no text, nothing waxy or cartoonish. Ask for separate layers (figure, foreground, background) wherever depth needs them.
- Where a short moving clip would beat a still (silk in wind, a flag, mist), add an optional video prompt.
- Do not wait for me. Build with stand-ins: the images in `frontend/public`, free-to-use art, and whatever you can draw in code. Keep an artwork manifest so that putting my images in means replacing files and nothing else.
- Anything not from me must be public domain, CC0 or similarly free, listed with source and licence in `frontend/public/img/CREDITS.md`. Image search and Pinterest are for mood only; never ship an image whose licence is unconfirmed.
- Every image of Krishna, Arjuna, Ram or any deity is treated with reverence: no distortion, no careless crop, no text or button across a face or body, no gimmick applied to the figure itself. Reject any generated image with wrong hands, eyes or anatomy.

## 8. Rules of craft

**Lighting**
- Section 4 is the lighting law for the whole site: one sun, warm soft shadows, haze for distance, light only from real sources. Check every screen against it.

**Motion quality**
- There are two kinds of motion. *Camera* motion belongs to the visitor: it is driven by scroll, follows the hand with a short smoothed lag (about 0.6 to 1 second) and can be reversed at any point. *Life* motion belongs to the world: it runs on time and continues when scrolling stops.
- Natural things do not move on a metronome. Wind arrives in gusts; cloth, leaves and dust follow layered noise with different periods (roughly 6 to 20 seconds) so no loop is ever noticed. Keep amplitudes small. If a visitor can see the loop point, it is wrong.
- Allow stillness. After a reveal, hold the picture and let only the life motion continue.
- No hard cuts and no flashing. Pictures change through mist or light in about 0.8 to 1.6 seconds. Never more than one soft brightening in a transition.
- Nothing bounces, overshoots or wobbles. Nothing spins for show.

**Timing and easing**
- Define durations and easings once, as named tokens, and use only those.
- Timed camera moves take 1.2 to 2.4 seconds with a slow start and slow finish (about `cubic-bezier(0.65, 0, 0.35, 1)`). Interface responses take 150 to 250 ms and decelerate (about `cubic-bezier(0.22, 1, 0.36, 1)`). Leaving is quicker than arriving. Anything the visitor triggers responds within 100 ms.
- Text arrives line by line through a soft mask, 60 to 90 ms apart. Never letter by letter except a verse being written, which moves at reading speed.

**Visual consistency**
- One sun, one palette, one grain, one set of radii, one shadow recipe, one family of ornament drawn from a single Indian craft tradition that you choose and name. Ornament is used sparingly and never as filler.
- Give whitespace real room. A screen with one picture, one line and one action is better than a full one.

**Typography**
- Begin with the present families (Cormorant Garamond, Newsreader, Instrument Sans, Tiro Devanagari Sanskrit). Change them only for a stated reason. At most three Latin families plus Devanagari.
- Large display lines are set with care: tight tracking, deliberate line breaks, no orphans. Body text is at least 17 px on a phone, 60 to 72 characters wide, line height 1.6 or more. Devanagari is set about 15% larger than the Latin beside it with line height near 1.8, in real Unicode text, never as an image.
- Text over artwork sits only on calm areas and meets a contrast of 4.5 to 1. Text never crosses a face.

**Background video**
- Use a clip only where moving pixels beat a layered still. Muted, inline, looping with no visible seam, 4 to 8 seconds, with a poster image, colour-matched and feathered into the page so no rectangle shows.
- Offer modern formats with a fallback, about 1.5 MB or less per clip on phones, a smaller cut for portrait screens. Load when near the screen, pause when off it or when the tab is hidden, and skip video on data-saver or slow connections. A scroll-scrubbed sequence needs every frame to be a keyframe, or an image sequence on canvas.

**Image treatment**
- One colour grade for everything, matched to the sun. Edges dissolve; no frames, no drop-shadowed photos.
- Prepare each key image for depth (a depth map or separated layers). Serve AVIF or WebP in several sizes with a page-coloured placeholder, and reserve space so nothing jumps.

**Scroll behaviour**
- The visitor's scroll is never taken away: no forced snapping, no changed scroll distance, native touch scrolling on phones. Keyboard scrolling, anchor links, browser back and refresh all behave.
- The journey on a phone is no longer than about five to six screens of scrolling, shows how far along the visitor is, and can always be skipped.
- Size pinned scenes with small-viewport units so the phone's address bar does not make them jump.

**Interactive elements**
- Controls look like part of the world and still look like controls. Touch targets are at least 44 px. Everything that reacts to hover has a touch and keyboard equivalent, with a visible focus state drawn in the site's own style.
- Pointer and tilt effects are slight (a few degrees, a few pixels) and the site is complete without them. Ask for motion-sensor permission only after the visitor chooses it.

**Accessibility**
- Everything the journey says exists as real headings and text for screen readers and search engines. Decorative canvases are hidden from assistive technology. Meaningful images have respectful descriptions.
- Fully usable by keyboard. Sound is off until the visitor turns it on with a visible switch. Nothing flashes more than three times a second.

**Reduced motion**
- People who ask their device for less motion get a designed still version: the same pictures as composed stills, gentle cross-fades, no parallax, no autoplaying video, nothing scroll-driven. It must still be beautiful.

**Responsive layout**
- Every page is composed, not merely shrunk, for a 360 px phone, a tablet and a wide desktop, in portrait and landscape. Scenes are re-framed for tall screens so the subject is never cropped badly.

**Mobile performance**
- Design for a mid-range Android phone at 360 × 800 on 4G first. The first screen is visible within about 2.5 seconds and holds 60 frames per second; first-view weight stays near 1.5 MB.
- Animate only transform, opacity and shader values. Load heavy libraries and scenes on demand. Cap pixel ratio at 2. Stop every loop that is off screen or in a hidden tab.
- Detect weaker devices (memory, cores, data-saver, measured frame time) and give them a lighter version automatically: fewer layers, no shaders, stills in place of video.
- The wait is part of the experience (mist clearing, a flame steadying), never a blank screen or a spinner.

**Code quality**
- Follow the project's existing conventions. Each scene is a self-contained component that cleans up after itself on unmount (scroll triggers, animation frames, observers, graphics memory), so moving between pages leaks nothing.
- Colours, durations, easings and the sun's direction live in one place. No dead code, no leftover old styles, no placeholder text. `npm run build` and `npm run lint` pass and the browser console is clean.
- You may add libraries that earn their weight (for example GSAP with ScrollTrigger, Lenis, a small WebGL layer). Check current versions, licences and React 19 compatibility yourself before relying on them.

## 9. What must not change

- The backend and every call the front end makes to it. Sign-in, chat, saved conversations, language choice, kept verses, the helpline.
- The page addresses and what each page lets a person do. This is a new skin, new staging and new motion, not a new product. Do not remove, rename or rearrange a feature because it is inconvenient for the design. If something truly has to change, say so in your report with the reason.

## 10. How to work

1. Inspect the project and study the references (section 2 and 3).
2. Study the best scroll-driven storytelling on the web and how it is built (for example Atmos by Leeroy, Persepolis Reimagined by the Getty, the David Whyte Experience, Pendragon Cycle, Ponpon Mania). Learn technique; copy nothing.
3. Write `REDESIGN_DIRECTION.md`: what is wrong today, your three concepts and the chosen one, the journey beat by beat, the sun, palette, type, the motion tokens, how each scene is built, the lighter version and the still version.
4. Give me the image prompts. Then continue without waiting and without asking for approval.
5. Build one scene, the approach to Krishna, to finished quality first. Look at it in the browser at phone and desktop sizes and judge it with section 11. Do not go wide until one scene is truly good.
6. Build the rest of the journey, then every page and shared part.
7. Check every page and state from your list in section 2 on phone and desktop, with motion reduced, and on the lighter version.
8. Refine. Do at least two full passes of looking, criticising and improving after you first think it is finished.

## 11. Judge your own work before showing me

- **Still test.** Pause anywhere. Is the frame a composed picture you would hang?
- **Squint test.** Do shapes and depth survive, or is it milk?
- **Template test.** Could this screen belong to any other site if the logo changed? Then it is not done.
- **Sun test.** Does every shadow and highlight agree?
- **Loop test.** Watch for a minute without scrolling. Can you see anything repeat?
- **Purpose test.** Can each animation say what it is for?
- **Calm test.** Would an anxious person feel safer after ten seconds here?
- **Thumb test.** One hand, small phone, weak signal: smooth, readable, obvious what to do?
- **Reference test.** Put your frame beside my references. Does yours have their presence and life, in daylight, without resembling any shot of theirs?

If any answer is no, keep working.

## 12. When you finish, tell me

What you built page by page with screenshots of the key moments; the concept and why you chose it; which scenes still use stand-ins and await my images; what you learned from which sites; credits for everything not mine; anything unfinished or that you could not check; and the exact step to restore the old Library page.

I am not looking for a beautiful website. I am looking for a morning people remember having spent with Krishna.
