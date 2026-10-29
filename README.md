# छत्तीसगढ़ डिजिटल एक्सप्लोरर — Chhattisgarh Digital Explorer
### Digital Treasure Hunt for the CHiPS Rajyotsav exhibition

A touchscreen game for exhibition kiosks. Visitors travel across an illustrated map of Chhattisgarh from Surguja to the treasure at Bastar, answering one question at each of 10 stops about **cyber safety**, **digital services** and **AI**. It plays in Hindi or English, and winners get an official Rajyotsav certificate as a QR code to scan.

---

## Where it fits

```
select-game screen (built separately)
   └─ player taps this game ─► https://<server>/treasure_hunt/   (kiosk logged in once, see deploy/)
        name → 10 stops → win ─► POST api/certificate ─► nginx ─► Rajyotsav certificate API
                                 ◄── QR code of the PDF certificate, shown on the finale
        "All games" / 2 min idle ─► back to the select-game screen (LAUNCHER_URL)
```

## How a game goes

1. **Start screen.** The whole state is shown, with the route and a closed treasure chest waiting at Bastar. The player types their **name** (it's printed on the certificate) and presses START. START without a name points them to the field instead.
2. **10 stops.** The camera flies to each stop and a question opens:
   - A right answer turns green and shows a one-line explanation. **Continue** walks the traveller along the trail to the next stop.
   - **Only one wrong answer is allowed in the whole game.** The first wrong answer empties the heart in the progress bar and the player tries the same question again. A second wrong answer anywhere ends the game: the right answer is shown, the stop turns red, and a Game Over panel says how far they got, with the explanation and **Play again**.
   - Topics rotate: Cyber Safety at stops 1, 4, 7, 10; Digital Seva at 2, 5, 8; AI Explorer at 3, 6, 9.
3. **Treasure.** The 10th question is asked at Bastar. Answering it shakes the chest, flips its lid open, and gold coins burst out before the confetti fires.
4. **Finale.** The player's name, 3 stars for a perfect run (2 with the one allowed mistake), and the time taken. The **certificate QR code** appears here: scanning it with a phone downloads the PDF. If the certificate service can't be reached, a message and **Try again** button show instead. Then **Play again** (keeps the name) or **All games**.

## Certificate

On a win the game sends one request to the Rajyotsav certificate API (spec: `Rajyotsav_Certificate_API.docx`):

```json
POST <base>/api/certificate
{ "username": "Asha Verma", "gameName": "Treasure_Hunt", "timeTaken": "3:42" }
```

- `timeTaken` runs from START to the last right answer, as `m:ss`.
- The request goes to our own server. nginx forwards it to `CERT_API_URL`, so the browser never calls another site, and only logged-in kiosks can create certificates.
- The game shows the `qrCode` the API returns; it never makes its own QR.
- Exactly one request is made per win (again only from **Try again** after a failure), because each call creates a new PDF.
- `gameName` and the launcher address are set in [src/data/platform.js](src/data/platform.js).

Kiosk behaviour:
- 2 minutes without a touch returns to the select-game screen (or, with no launcher set, to a fresh start screen in Hindi with the name cleared).
- Typing the name needs an on-screen keyboard on touch-only kiosks (Windows touch keyboard or Android's), see [deploy/README.md](deploy/README.md).
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

Locally, `api/certificate` is answered by a stand-in so testing never creates real certificates. It returns a sample QR after a short delay. Switch it with an environment variable:

| `CERT_API=` | What answers `api/certificate` in `npm run dev` / `npm run preview` |
|---|---|
| *(unset)* | the stand-in, with a sample QR |
| `fail` | the stand-in answering 503, to see the error and **Try again** |
| `real` | the real Rajyotsav API; each win then creates a real PDF |

`VITE_LAUNCHER_URL=https://…` shows the **All games** links locally.

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
    IntroPanel.jsx          start screen and the player's name
    QuestionCard.jsx        question, answers, explanation, Continue
    FinaleBanner.jsx        congratulations, stars, time and the certificate QR
    GameOverPanel.jsx       shown after the second wrong answer
    Stars.jsx, ConfettiCanvas.jsx, ErrorBoundary.jsx
  data/
    questions.json          question bank (Hindi + English)
    questionService.js      validation, random pick without repeats, fallbacks
    journey.js              10 questions per game, topic rotation, answer shuffling
    explorerConfig.js       stage layouts, waypoints, camera, timings, mistakes allowed, star thresholds
    i18n.js                 interface text in Hindi and English
    platform.js             gameName, launcher URL, certificate endpoint
  assets/map-overlay.svg    route, waypoints and treasure drawn over the terrain
  utils/audio.js            Web Audio sound effects (no files)
  utils/motion.js           reduced-motion helpers
  utils/certificate.js      calls the certificate API, formats the time as m:ss
deploy/                     one-command deploy, nginx snippet, server installer
docs/                       design spec, reference prototype and video, original prompts
```

## Tech

React 19 and Vite 8, plain CSS, no UI libraries. Fonts (Outfit, Noto Sans Devanagari, EB Garamond) are self-hosted through Fontsource. Sound effects (including the coin chink) are synthesised with the Web Audio API, and the confetti and gold coins are a small canvas animation.
