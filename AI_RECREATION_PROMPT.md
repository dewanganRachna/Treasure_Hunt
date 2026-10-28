# MASTER AI PROMPT: Recreate "छत्तीसगढ़ डिजिटल एक्सप्लोरर" (Retro 16-Bit Pixel RPG Edition)

> **Purpose**: This file contains the complete, standalone prompt and architectural specification required for an AI agent, autonomous developer, or frontend engineer to build the **"छत्तीसगढ़ डिजिटल एक्सप्लोरर — Chhattisgarh Digital Explorer (Digital Treasure Hunt)"** web exhibition game from scratch.
> 
> **Design Pivot**: Updated to match the **16-Bit Retro Pixel Art RPG Overworld & JRPG Dialogue Box UI** demonstrated in the reference exhibition gameplay video (`WhatsApp Video 2026-10-27 at 12.43.16.mp4`).

---

```markdown
# MISSION SPECIFICATION: Recreate Chhattisgarh Digital Explorer (16-Bit Retro RPG Edition)

## 1. EXECUTIVE SUMMARY & TARGET DEPLOYMENT

You are an expert full-stack frontend engineer, retro pixel-art illustrator, and interactive game designer. Your task is to build a complete, production-ready interactive web application:
**"छत्तीसगढ़ डिजिटल एक्सप्लोरर — Chhattisgarh Digital Explorer (Digital Treasure Hunt)"**.

- **Client / Host**: CHiPS (Chhattisgarh Infotech Promotion Society) for the **Rajyotsav State Exhibition**.
- **Target Form Factor**: 16:9 public exhibition touchscreens (1920×1080 and 1366×768), kiosk terminals, tablets, and responsive desktop/mobile viewports.
- **Aesthetic**: **16-Bit Retro Pixel Art RPG Overworld Adventure** (classic SNES / GameBoy Advance / Super Mario World / Pokémon / Zelda aesthetic).
  - Pixel-rendered geographic overworld map of Chhattisgarh featuring lush green pixel grassland, shaded rocky mountain ridges, dense pine and deciduous tree clusters, winding blue rivers, shimmering coastal water with twinkling pixel stars, and a pixel stone castle fortress.
  - Waypoints connected by dotted path tracks across the kingdom.
  - Dynamic animated **yellow path line** that physically traces and extends along the road from node to node as quests unlock.
  - JRPG-style parchment dialogue cards with pixel borders, decorative corner studs, blinking downward cursor (`▾`), and retro console button badges (`[A] Select`, `[B] Enter`, `[LB] Scroll`).
  - Climax at an iconic yellow pixel **`X`** ("X marks the spot") where a 16-bit golden treasure chest lands, springs open, and explodes with radiant golden pixel sparkles and chiptune fanfare!
- **Core Experience**: A state-wide quest connecting:
  1. **Raipur Hub / Capital Sector** (Question 1: *"What is the capital of Chhattisgarh?"* / Cyber Safety)
  2. **Bastar Sector** (Question 2: *"Name the famous waterfall in Bastar."* / AI & Digital Heritage)
  3. **Surguja Sector** (Question 3: *"Which dance is famous in Surguja?"* / Digital Seva & Culture)
  4. **The Treasure Site (Yellow `X`)**: Opening the grand 16-bit Golden Treasure Chest!

---

## 2. TECH STACK & SYSTEM CONSTRAINTS

- **Framework**: React 19 + Vite (JavaScript / JSX).
- **Styling**: Pure Vanilla CSS with pixel-art rendering rules (`image-rendering: pixelated;`, custom 16-bit borders, zero external CSS frameworks like Tailwind or Bootstrap).
- **Typography**: Google Fonts:
  - `'Press Start 2P'` or `'Pixelify Sans'`: Authentic retro pixel font for headings, dialogue boxes, quest titles, and console buttons.
  - `'Noto Sans Devanagari'`: Clean font for Hindi text, styled in retro high-contrast dialogue boxes.
  - `'Silkscreen'` / `'Rajdhani'`: For HUD status indicators and telemetry.
- **Celebration Effects**:
  - `canvas-confetti` configured with gold, amber, and cyan square/pixel particle bursts.
  - CSS-animated 16-bit pixel sparkle stars bursting from the chest.
- **Audio Engine**: Custom procedural Web Audio API 8-bit/16-bit Chiptune Synthesizer (`AudioContext` square wave, triangle wave, and noise oscillators). Zero external audio files.
- **Map & Icons**: Native SVG and canvas pixel-art rendering for Chhattisgarh terrain, waypoints, routes, and custom 16-bit pixel chest.

---

## 3. PROJECT DIRECTORY STRUCTURE

Recreate the project using this exact directory structure:

```
Treasure_Hunt/
├── index.html                           # Kiosk shell with Pixel Google Fonts & viewport rules
├── package.json                         # React 19, Vite, canvas-confetti
├── vite.config.js                       # Vite React plugin setup
├── src/
│   ├── main.jsx                        # React root entry point
│   ├── index.css                       # Pixel design tokens, keyframes, retro CRT scanline filters
│   ├── App.jsx                         # Master state machine & overworld orchestrator
│   ├── App.css                         # 16-bit RPG component styles & responsive layouts
│   ├── components/
│   │   ├── Header.jsx                  # Retro RPG Status HUD (Hearts/Retries, Progress, Audio, Lang)
│   │   ├── WelcomeScreen.jsx           # 16-bit Title Screen with glowing pixel chest & Press Start
│   │   ├── ChhattisgarhMap.jsx         # Pixel Overworld Map, animated yellow path & waypoints
│   │   ├── QuizModal.jsx               # JRPG Parchment Dialogue Box with console prompt buttons
│   │   ├── RetryFeedbackModal.jsx      # Retro Warning Dialogue Box (1 Retry Remaining)
│   │   ├── GameOverModal.jsx           # Retro 8-Bit "Game Over" Screen with continue prompt
│   │   ├── TreasureSuccessModal.jsx    # Intermediate Waypoint Unlocked / Chest reveal
│   │   ├── FinalAchievementModal.jsx   # Grand Victory Screen with 16-bit Opening Chest at "X"
│   │   ├── PixelChest.jsx              # Handcrafted SVG 16-bit Pixel Treasure Chest (closed/open)
│   │   ├── CyberParticles.jsx          # Ambient floating pixel stars & motes
│   │   └── ErrorBoundary.jsx           # Fallback error boundary
│   ├── data/
│   │   ├── chhattisgarhMapData.js      # Pixel map nodes, SVG terrain paths, and quest locations
│   │   ├── questions.json              # Dynamic question bank (Capital, Bastar, Surguja, Cyber/AI)
│   │   └── questionService.js          # Question loader, session tracker, and fallback logic
│   └── utils/
│       └── audio.js                    # Web Audio API 8-bit / 16-bit Chiptune Synthesizer
```

---

## 4. GLOBAL STATE MACHINE & GAMEPLAY RULES

### Overworld Gameplay Loop:
```
[ TITLE / WELCOME SCREEN ]
       │
       ▼ (Tap "PRESS START • शुरू करें")
[ 16-BIT RETRO OVERWORLD MAP ]
       │
       ├──► Step 1: Starting Castle / Raipur Node
       │         │
       │         ├── JRPG Dialogue Box: Question 1 ("What is the capital of Chhattisgarh?")
       │         ├── Wrong Answer? (Retry available) ──► [ Retry Dialog ] ──► (Re-attempt Q1)
       │         ├── Wrong Answer? (Retry consumed)  ──► [ Game Over Dialog ] ──► (Reset to Start)
       │         └── Correct! ──► Yellow path line animates & extends along mountain pass to Bastar!
       │
       ├──► Step 2: Bastar Waypoint Node
       │         │
       │         ├── JRPG Dialogue Box: Question 2 ("Name the famous waterfall in Bastar.")
       │         ├── Wrong Answer? (Follows Global Retry Rule)
       │         └── Correct! ──► Yellow path line animates & extends across plains to Surguja!
       │
       ├──► Step 3: Surguja Waypoint Node
       │         │
       │         ├── JRPG Dialogue Box: Question 3 ("Which dance is famous in Surguja?")
       │         ├── Wrong Answer? (Follows Global Retry Rule)
       │         └── Correct! ──► Yellow path line extends to the final destination: Yellow "X"!
       │
       └──► Climax: The Yellow "X" (Treasure Site)
                 │
                 └──► 16-bit Golden Treasure Chest lands on "X", springs open, bursts with
                      golden pixel sparkles, and triggers triumphant JRPG Victory Fanfare!
```

### Critical Rules & State Variables:
1. `screen`: `'WELCOME'` | `'MAP'`.
2. `currentStep`: `1` (Raipur) | `2` (Bastar) | `3` (Surguja) | `4` (Treasure `X` Reached).
3. `pathProgress`: Controls the animated extension of the bold yellow route line along the dotted road:
   - `0%` -> Castle / Raipur
   - `33%` -> Down through mountain pass to Bastar
   - `66%` -> Across central plains to Surguja
   - `100%` -> Completes to the yellow `X` mark.
4. **Strict Global Shared Retry Rule (`retryUsed: boolean`)**:
   - Player receives **exactly ONE retry for the ENTIRE game**.
   - If player answers incorrectly:
     - If `!retryUsed`: Show `RetryFeedbackModal` with 8-bit warning chime; consumes the retry (`setRetryUsed(true)`). Player re-attempts the exact same question.
     - If `retryUsed === true`: Immediate 8-bit `GameOverModal` with descending game-over arpeggio.
5. **Dynamic Question Bank (`questions.json`)**:
   - Organized into categories: `capital_hub` (Raipur / Cyber Safety), `bastar_sector` (Chitrakote / AI), and `surguja_sector` (Karma Dance / Digital Seva).
   - Session tracking prevents question repetition during the same play session.
6. **Bilingual Toggle (`lang`: `'hi'` | `'en'`)**:
   - Smoothly updates dialogue cards, question text, and HUD between English and Hindi.
7. **Audio Synthesizer (`isMuted: boolean`)**:
   - Pure chiptune audio synthesis using Web Audio API square/triangle waves. Global mute toggle in header.

---

## 5. UI DESIGN SPECIFICATIONS (VIDEO-FAITHFUL PIXEL ART)

### Stage 1: Retro RPG Header & Status HUD (`Header.jsx`)
- **Visual Style**: Sleek 16-bit status bar at the top with dark wood/slate border and gold pixel bevel.
- **Left Branding**:
  - Pixel crest emblem (8-bit style state shield).
  - Pixel badges: `CHiPS • GOVT OF CG` and `RAJYOTSAV 2026`.
  - Title: `CHHATTISGARH DIGITAL EXPLORER` (styled in pixel font).
- **Center RPG Telemetry**:
  - **Hearts / Life HUD**: 2 pixel hearts (representing the 1 allowed mistake):
    - When retry is available: `❤️❤️ 1 RETRY READY` (green glow).
    - When retry is consumed: `💔🖤 0 RETRIES LEFT` (flickering red).
  - **Quest Progress**: Retro level indicator: `LVL 1/3`, `LVL 2/3`, `LVL 3/3`, `MAX QUEST`.
- **Right Controller Badges**:
  - `[LANG: ENG/हिंदी]` toggle button.
  - `[AUDIO: ON/OFF]` with animated 8-bit equalizer bars.
  - `[RESET ↺]` cartridge reset button.

---

### Stage 2: 16-Bit Title / Welcome Screen (`WelcomeScreen.jsx`)
- **Visual Style**: Classic arcade / JRPG title screen.
- **Background**: Scrolling 16-bit pixel clouds over the Chhattisgarh landscape.
- **Center Showcase**:
  - Pixel art golden treasure chest hovering above a stone pedestal with twinkling 8-bit stars.
  - Main Title: `छत्तीसगढ़ डिजिटल एक्सप्लोरर` in large gold 3D pixel letters with black drop shadow.
  - Subtitle: `CHHATTISGARH DIGITAL TREASURE HUNT`.
- **Quest Overview Scroll**:
  - Parchment scroll displaying the 3 regional waypoints:
    - `STAGE 1: RAIPUR (CAPITAL HUB)`
    - `STAGE 2: BASTAR (WATERFALL & HERITAGE)`
    - `STAGE 3: SURGUJA (DANCE & CULTURE)`
    - `FINAL: THE LEGENDARY CHEST AT "X"`
- **Start Button**:
  - Flashing retro arcade button: `▶ PRESS START • खेल शुरू करें ◀` (blinking every 800ms).
  - Clicking triggers an 8-bit coin sound and opens the Overworld Map.

---

### Stage 3: The 16-Bit Overworld Map (`ChhattisgarhMap.jsx`)
*Directly matching the visual layout in the reference video:*
- **Terrain & Map Canvas**:
  - Detailed pixel art rendering of Chhattisgarh geography:
    - **Top-Left**: Stone medieval castle fortress with red roof flags.
    - **Mountains**: Multiple shaded pixel mountain ridges dividing the central and southern regions.
    - **Forests**: Lush clumps of 16-bit pine and green deciduous trees across the valleys.
    - **Water Bodies**: Light blue winding rivers with bridges, small lakes, and southeast coastline with sparkling pixel stars.
- **The Route Network**:
  - Dotted black lines connecting circular waypoint nodes across the map.
  - **The Animated Yellow Path**:
    - A bold, solid yellow line that traces the road from node to node.
    - Extends smoothly with an animated arrow cursor pointing forward as each question is solved.
  - **Waypoints**:
    - Circular nodes that turn from white to glowing yellow when activated, and green when completed.
    - Pixel text labels floating beside active nodes (e.g., `Bastar`, `Surguja`, `Raipur`).
  - **The Target `X`**:
    - A bold yellow pixel cross **`X`** placed on the map to signify the ultimate treasure destination.
- **Interaction**:
  - Touching an active waypoint node or the moving yellow arrow triggers the JRPG Dialogue Box for that quest.

---

### Stage 4: JRPG Dialogue Box Quiz Card (`QuizModal.jsx`)
*Directly matching the dialogue boxes shown in the video:*
- **Card Frame**:
  - Authentic 16-bit JRPG dialogue box:
    - Background: Off-white / light cream parchment (`#fdfcf7`).
    - Border: Double-line pixel frame with decorative metal corner studs (`#3e2723` outer, `#795548` inner).
    - Pixel drop shadow (`box-shadow: 4px 4px 0px rgba(0, 0, 0, 0.4)`).
- **Header & Question Text**:
  - Top text: `Question 1: What is the capital of Chhattisgarh?`
  - (Or Question 2: `Name the famous waterfall in Bastar.`)
  - (Or Question 3: `Which dance is famous in Surguja?`)
  - Rendered in crisp pixel typography with classic typing effect.
  - Blinking black downward triangle indicator (`▼`) in the bottom-right corner of the dialogue box.
- **Interactive Options**:
  - 4 selectable retro dialogue choices styled like an RPG command menu:
    - `[A] Raipur`
    - `[B] Bilaspur`
    - `[C] Durg`
    - `[D] Jagdalpur`
  - Hover / Touch State: Selected option highlights with a retro pointer hand (`☞`) or golden pixel border.
- **Console Prompt Bar (Bottom)**:
  - Retro console button pills displayed at the bottom of the card:
    - `[A] Select` (green badge with gold border)
    - `[B] Enter` (red badge)
    - `[LB] Scroll` (gray badge)

---

### Stage 5: Single Shared Retry Feedback Dialog (`RetryFeedbackModal.jsx`)
- **Visual Style**: Amber/wood JRPG warning box.
- **Icon**: 8-bit flashing warning symbol `⚠️`.
- **Text**:
  - `Oops! गलत जवाब! (WRONG ANSWER!)`
  - `आपके पास केवल 1 Retry शेष है! (1 RETRY REMAINING)`
- **Advice**: `ध्यान से सोचकर दोबारा उत्तर दें। इस बार गलती होने पर खेल समाप्त हो जाएगा!`
- **Button**: `[A] RETRY • दोबारा प्रयास करें` (plays chiptune reload sound and re-opens the same question).

---

### Stage 6: Retro Game Over Screen (`GameOverModal.jsx`)
- **Visual Style**: Classic arcade dark game over overlay with red scanlines.
- **Text**:
  - `GAME OVER` (pulsing 8-bit red font).
  - `खेल समाप्त • ALL LIVES EXHAUSTED`.
  - `स्कोर: बेहतर तैयारी के साथ पुनः प्रयास करें!`
- **Button**: `[CONTINUE?] ↺ PLAY AGAIN` (restarts the game from the castle starting point).

---

### Stage 7: The Grand Treasure Climax at the Yellow "X" (`FinalAchievementModal.jsx` & `PixelChest.jsx`)
*Directly matching the video climax:*
- **The Event Sequence**:
  1. The player correctly answers Question 3 (Surguja).
  2. The animated yellow path line completes its final dash toward the **yellow `X`**.
  3. A large 16-bit golden treasure chest drops/appears squarely on top of the `X`.
  4. With an 8-bit click sound, the chest lid springs open!
  5. **Celebration Eruption**:
     - Dozens of radiant 16-bit golden pixel stars and diamond sparkles burst outward and float upward.
     - Glowing vertical light beams emit from the chest interior.
     - Confetti explosion across the screen.
     - Triumphant 16-bit JRPG victory fanfare plays via the audio synthesizer.
- **Victory Banner**:
  - `★ बधाई हो! YOU FOUND THE CHHATTISGARH TREASURE! ★`
  - `राज्योत्सव प्रमाणित डिजिटल एक्सप्लोरर (CERTIFIED DIGITAL EXPLORER)`
  - Summary of unlocked regions: `✓ Raipur` | `✓ Bastar` | `✓ Surguja`.
- **Action Button**:
  - `[A] PLAY AGAIN • पुनः खेलें ↺`.

---

## 6. CUSTOM ASSETS & PIXEL AUDIO SYNTHESIZER

### A. 16-Bit Pixel Treasure Chest (`PixelChest.jsx`)
Custom handcrafted SVG/CSS pixel-art component supporting two states:
- **`closed`**: Gold pixel chest with brown iron straps, center keyhole, and subtle hover bounce.
- **`open`**: Tilted open lid, glowing white/yellow interior, erupting golden pixel stars, light beams, and floating gems.

### B. Procedural 8-Bit / 16-Bit Chiptune Synthesizer (`utils/audio.js`)
Zero external MP3 files. Uses Web Audio API oscillator synthesis:
- `playTextBeep()`: Short 8-bit dialogue character blip (`square` wave, 900Hz, 25ms).
- `playSelect()`: Classic console menu confirmation chime (`square` wave, 440Hz -> 880Hz, 80ms).
- `playPathAdvance()`: Fast rising 3-note arpeggio simulating route progression.
- `playChestLand()`: Low thud/impact tone as chest lands on `X`.
- `playChestOpen()`: Shimmering arpeggiated 16-bit chiptune cascade.
- `playWrong()`: Harsh low 8-bit buzzer (`sawtooth` wave, 120Hz).
- `playGameOver()`: Descending 4-note minor melody (330Hz -> 160Hz).
- `playVictory()`: Full 16-bit triumphant victory fanfare (triumphant brass-style square wave sequence).

---

## 7. DATA LAYER SPECIFICATIONS

### Questions JSON (`questions.json`)
Includes the questions demonstrated in the reference video alongside cyber/digital awareness topics:
```json
{
  "categories": [
    {
      "id": "raipur_hub",
      "name": "Capital Hub (Raipur)",
      "hindiName": "रायपुर (राजधानी)",
      "questions": [
        {
          "id": "Q_RAIPUR_01",
          "question": "What is the capital of Chhattisgarh?",
          "questionHi": "छत्तीसगढ़ की राजधानी कौन-सी है?",
          "options": ["Raipur", "Bilaspur", "Durg", "Jagdalpur"],
          "optionsHi": ["रायपुर", "बिलासपुर", "दुर्ग", "जगदलपुर"],
          "correctAnswer": 0
        },
        {
          "id": "Q_RAIPUR_02",
          "question": "What is the primary rule for safe online banking?",
          "questionHi": "सुरक्षित ऑनलाइन बैंकिंग का मुख्य नियम क्या है?",
          "options": ["Share OTP with bank staff", "Never share OTP or PIN with anyone", "Use public Wi-Fi", "Write PIN on card"],
          "optionsHi": ["बैंक कर्मचारी से OTP साझा करें", "OTP या PIN कभी किसी से साझा न करें", "सार्वजनिक वाई-फाई का उपयोग करें", "कार्ड पर PIN लिखें"],
          "correctAnswer": 1
        }
      ]
    },
    {
      "id": "bastar_sector",
      "name": "Bastar Sector",
      "hindiName": "बस्तर संभाग",
      "questions": [
        {
          "id": "Q_BASTAR_01",
          "question": "Name the famous waterfall in Bastar often called the Niagara of India.",
          "questionHi": "बस्तर के प्रसिद्ध जलप्रपात का नाम बताइए जिसे 'भारत का नियाग्रा' कहा जाता है।",
          "options": ["Chitrakote Waterfall", "Tirathgarh Waterfall", "Dudhsagar", "Kanger Dhara"],
          "optionsHi": ["चित्रकोट जलप्रपात", "तीरथगढ़ जलप्रपात", "दूधसागर", "कांगेर धारा"],
          "correctAnswer": 0
        }
      ]
    },
    {
      "id": "surguja_sector",
      "name": "Surguja Sector",
      "hindiName": "सरगुजा संभाग",
      "questions": [
        {
          "id": "Q_SURGUJA_01",
          "question": "Which traditional folk dance is famous in Surguja?",
          "questionHi": "सरगुजा क्षेत्र का प्रसिद्ध पारंपरिक लोक नृत्य कौन-सा है?",
          "options": ["Karma Dance", "Garba", "Kathak", "Bhangra"],
          "optionsHi": ["कर्मा नृत्य", "गरबा", "कथक", "भांगड़ा"],
          "correctAnswer": 0
        }
      ]
    }
  ]
}
```

---

## 8. STEP-BY-STEP AGENT EXECUTION PHASES

1. **Phase 1: Project Setup & Typography**:
   - Install dependencies (`canvas-confetti`).
   - Add retro pixel fonts (`'Press Start 2P'`, `'Pixelify Sans'`, `'Noto Sans Devanagari'`) to `index.html`.
2. **Phase 2: Chiptune Audio Synthesizer**:
   - Implement `src/utils/audio.js` with square/triangle wave oscillators for authentic 8-bit/16-bit sound effects.
3. **Phase 3: 16-Bit Overworld Map & Animated Route**:
   - Construct the pixel art terrain map of Chhattisgarh in `ChhattisgarhMap.jsx`.
   - Implement the animated yellow path line that physically extends along the dotted routes to Bastar, Surguja, and the yellow `X`.
4. **Phase 4: JRPG Dialogue Box Quiz System**:
   - Build `QuizModal.jsx` matching the video's parchment dialogue frame, corner studs, blinking downward cursor, and `[A] Select` / `[B] Enter` button prompts.
5. **Phase 5: Golden Chest & Climax at "X"**:
   - Build `PixelChest.jsx` with opening animation.
   - Build `FinalAchievementModal.jsx` with chest landing on `X`, sparkling starburst explosion, and chiptune victory fanfare.
6. **Phase 6: Gameplay State Machine & Retry Enforcement**:
   - Wire `App.jsx` to enforce sequential step unlocking (Raipur $\rightarrow$ Bastar $\rightarrow$ Surguja $\rightarrow$ `X`).
   - Strictly enforce the single shared retry rule across all questions.
7. **Phase 7: Polish & CRT Filter**:
   - Fine-tune pixel ratios, hover states, and touch targets (minimum 48px) for exhibition kiosks.
```

---
*Updated to match the 16-bit Retro Pixel Art RPG Overworld & JRPG Dialogue UI from the reference exhibition gameplay video.*
