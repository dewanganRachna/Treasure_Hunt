# छत्तीसगढ़ डिजिटल एक्सप्लोरर — Chhattisgarh Digital Explorer
### Digital Treasure Hunt for the CHiPS Rajyotsav exhibition

A touchscreen game for exhibition kiosks. Visitors travel across an illustrated map of Chhattisgarh from Surguja to the treasure at Bastar, answering one question at each of 10 stops about **cyber safety**, **digital services** and **AI**. It plays in Hindi or English and ends with a printable certificate.

---

## How a game goes

1. **Start screen.** The whole state is shown, with the route and a closed treasure chest waiting at Bastar.
2. **10 stops.** The camera flies to each stop and a question opens:
   - A right answer turns green and shows a one-line explanation. **Continue** walks the traveller along the trail to the next stop.
   - **Only one wrong answer is allowed in the whole game.** The first wrong answer empties the heart in the progress bar and the player tries the same question again. A second wrong answer anywhere ends the game: the right answer is shown, the stop turns red, and a Game Over panel says how far they got, with the explanation and **Play again**.
   - Topics rotate: Cyber Safety at stops 1, 4, 7, 10; Digital Seva at 2, 5, 8; AI Explorer at 3, 6, 9.
3. **Treasure.** The 10th question is asked at Bastar. Answering it shakes the chest, flips its lid open, and gold coins burst out before the confetti fires.
4. **Finale.** 3 stars for a perfect run, 2 with the one allowed mistake. From here: **Get certificate** (optional name, printable) or **Play again**.

Kiosk behaviour:
- 2 minutes without a touch returns to a fresh start screen in Hindi.
- Answer order is shuffled every game, so the right answer isn't always in the same place.
- Works offline once loaded: fonts and the map are bundled.
- On phones held upright it switches to a portrait layout.
- Respects the system's reduced-motion setting.

## Question bank

All questions live in [src/data/questions.json](src/data/questions.json) (14 cyber safety, 11 AI, 20 digital seva). Each game picks 10 without repeats. A question looks like this:

```json
{
  "id": "CS002",
  "question": "OTP का उपयोग करते समय क्या ध्यान रखना चाहिए?",
  "questionEn": "What should you keep in mind when using an OTP?",
  "options": ["…", "…", "…", "…"],
  "optionsEn": ["…", "…", "…", "…"],
  "correctAnswer": 2,
  "difficulty": "easy",
  "explanation": "OTP आपके Account की चाबी है — …",
  "explanationEn": "An OTP is the key to your account; …"
}
```

`correctAnswer` is the 0-based index in `options` (the game shuffles them on screen). `questionEn`, `optionsEn` and the explanations are optional, but every current question has them. [src/data/questionService.js](src/data/questionService.js) checks each question has an id, text, exactly 4 options and a valid answer, and has a fallback question per topic if a category is empty.

## Running it

```bash
npm install
npm run dev        # http://localhost:5173
npm run lint
npm run build      # production build for /treasure_hunt/ in dist/
npm run preview    # serves that build at http://localhost:4173/treasure_hunt/
```

The production build is made for the `/treasure_hunt/` path. Use `BASE_PATH=/ npm run build` to build for a site root instead.

## Deploying

```bash
npm run deploy
```

This builds the game, uploads it over SSH and adds it to the server's existing nginx at `/treasure_hunt/`, behind an admin login that each kiosk enters once. It needs a `deploy/deploy.env` with the server address. See **[deploy/README.md](deploy/README.md)** for setup, what it changes on the server, rollback and password commands.

## Project layout

```
index.html                  page shell
public/
  map/cg-map-terrain.jpg    illustrated terrain (1924×2704)
  login/                    admin login page (public; the game itself needs the login cookie)
src/
  App.jsx                   picks the 16:9 or portrait stage and scales it to the screen; language, sound, restart
  components/
    Game.jsx                one playthrough: intro → 10 stops → treasure → finale, idle reset
    ExplorerMap.jsx         terrain + SVG overlay, camera, traveller and trail animation
    Header.jsx              title, progress dots, language / sound / fullscreen / restart
    IntroPanel.jsx          start screen
    QuestionCard.jsx        question, answers, explanation, Continue
    FinaleBanner.jsx        congratulations + stars
    GameOverPanel.jsx       shown after the second wrong answer
    Certificate.jsx         certificate overlay and print layout
    Stars.jsx, ConfettiCanvas.jsx, ErrorBoundary.jsx
  data/
    questions.json          question bank (Hindi + English)
    questionService.js      validation, random pick without repeats, fallbacks
    journey.js              10 questions per game, topic rotation, answer shuffling
    explorerConfig.js       stage layouts, waypoints, camera, timings, mistakes allowed, star thresholds
    i18n.js                 interface text in Hindi and English
  assets/map-overlay.svg    route, waypoints and treasure drawn over the terrain
  utils/audio.js            Web Audio sound effects (no files)
  utils/motion.js           reduced-motion helpers
deploy/                     one-command deploy, nginx snippet, server installer
docs/                       design spec, reference prototype and video, original prompts
```

## Tech

React 19 and Vite 8, plain CSS, no UI libraries. Fonts (Outfit, Noto Sans Devanagari, EB Garamond) are self-hosted through Fontsource. Sound effects (including the coin chink) are synthesised with the Web Audio API, and the confetti and gold coins are a small canvas animation.
