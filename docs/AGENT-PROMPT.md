# Prompt for the VS Code Claude agent

Copy everything below the line into the agent.

---

## Task

Rebuild the UI of this React app (`dewanganRachna/Treasure_Hunt`, branch `feature/attractive`) to match the approved "Chhattisgarh Digital Explorer" design. Work on a new branch `feature/explorer-map`.

**There is a complete, working single-file reference implementation in `docs/reference-prototype.html`. Read it first and read it fully** — it contains the final HTML, CSS, SVG map overlay and game logic. Your job is to port it into the existing React + Vite structure, not to invent a new design. When this prompt and the reference disagree, the reference wins.

Supporting files:
- `docs/reference-prototype.html` — the full working reference
- `public/map/cg-map-terrain.jpg` — the rendered map background (1924×2704)
- `src/assets/map-overlay.svg` — the SVG overlay (route, waypoints, treasure, labels, terrain symbols)
- `docs/design-spec.json` — geometry, camera, palette and waypoint coordinates as data

## Keep

- React 19 + Vite, vanilla CSS, `canvas-confetti` may be removed (the reference has its own canvas confetti).
- `src/data/questions.json` and `src/data/questionService.js` exactly as they are. Do not edit the question bank.
- The existing repo conventions: components in `src/components/`, one component per file.

## Replace

Delete or rewrite the old screens: `WelcomeScreen`, `QuizModal`, `RetryFeedbackModal`, `GameOverModal`, `TreasureSuccessModal`, `FinalAchievementModal`, `TreasureChestIcon`, `ChhattisgarhMap`, `CyberParticles`, `Header`.

## Layout

A fixed 1280×720 stage, scaled to the viewport with `transform: scale(min(vw/1280, vh/720))` so it fits any kiosk screen.

- **Header** (full width, 66px): hexagon logo, Hindi title `छत्तीसगढ़ डिजिटल एक्सप्लोरर`, two chips (`CHiPS · छत्तीसगढ़ शासन`, `राज्योत्सव विशेष`); centre: `PROGRESS` + 10 dots + `0/10`; right: `ENG`, `SOUND`, fullscreen, `RESTART` buttons.
- **Left column** (x 16, width 472): holds the intro panel, then the question card, then the finale banner. Only one is visible at a time.
- **Right area** (x 504–1280): the map.

## The map

- `public/map/cg-map-terrain.jpg` sits in a world div of 1628×2288 px, with the SVG overlay on top sharing viewBox `-110 -110 740 1040`. One map unit = 2.2 px.
- Camera is a CSS `transform: translate(tx,ty) scale(z)` on the world div, transition `transform 2.2s cubic-bezier(.45,.05,.2,1)`.
- Two zoom levels: **fit** `0.277` (whole state, used on the intro) and **play** `0.8` (follows the traveller).
- Clamp so the map never leaves the map area: `tx ∈ [1280 − 1628·z, 504]`, `ty ∈ [720 − 2288·z, 66]`; when the world is smaller than the area, centre it instead.
- While the intro is showing, the SVG carries class `ov` (overview): CSS scales up the route strokes, waypoint radii and the X mark so they stay readable at fit zoom. Remove the class when the game starts.
- A blurred copy of the terrain image fills the page behind the map as a backdrop.

## Waypoints and flow

Ten stops, taken from `design-spec.json`. Nine are question waypoints; **the tenth is the treasure at Bastar**.

1. Intro panel visible, map at fit zoom, whole state in view.
2. START → hide intro, remove `ov`, camera flies to stop 1, question 1 opens.
3. Correct answer → stop turns green with a tick, sparks burst, camera moves to the next stop while the traveller animates along the trail and the dotted leg fills in gold behind it, then the next question opens.
4. Wrong answer → the option turns red, the card shakes, a retry message shows. Unlimited retries, progress does not advance. **Do not reinstate the old single-retry / Game Over rule.**
5. Question 10 is asked at the treasure itself. On the correct answer the X fades, the chest shakes, scales up and opens, and the confetti cannons fire.
6. Finale banner replaces the card in the left column, with `प्रमाण पत्र पाएं` and `फिर से खेलें`.

Animate the traveller with `path.getPointAtLength()` along each leg and drive the gold trail with `stroke-dashoffset`. Ease with a cubic in-out over ~2300 ms.

## Features to port

- **Confetti**: canvas-based cannon, ~500 pieces, two from the bottom corners, two from below centre 520 ms later, corners again at 1250 ms. Gravity 0.42, drag 0.992, per-piece rotation.
- **Sound**: Web Audio synth — tap, correct chime, wrong buzz, win fanfare — with a mute toggle.
- **Language**: `ENG` toggles interface strings only. The question bank has no English yet; leave the questions in Hindi and keep the i18n map ready so `questionEn`/`optionsEn` can be used when added.
- **Fullscreen** and **Restart** buttons.
- Lock the stage against focus-scrolling: blur the option button after click and reset `scrollLeft/scrollTop` on scroll. This bug shifted the whole layout sideways in the prototype.

## Design tokens

Take exact values from `design-spec.json`. Fonts: Outfit (UI), Noto Sans Devanagari (Hindi), EB Garamond (map labels). Accent `#c98a24`, deep `#7d4f10`, correct `#2f7d5f`, wrong `#b4442f`, text `#3f3318`, glass panels `rgba(253,246,228,.88)` with `backdrop-filter: blur(14px) saturate(1.3)`.

Waypoints are a gold ring with a soft gold disc inside: idle `#dcc289`, current `#c98a24` with a pulsing ring, done `#3f7a4e` with a cream tick. **No numbers on the waypoints.**

## Quality bar

- No console errors through a full 10-question playthrough.
- Keyboard accessible: real `<button>` elements, visible focus, Enter/Space work.
- Respect `prefers-reduced-motion`.
- Kiosk-safe: no login, no personal data, works offline once loaded, idle reset after inactivity.
- Run `npm run lint` and fix what it reports.

When you are done, give me a short summary of the component structure and anything in the reference you could not port.
