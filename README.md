# छत्तीसगढ़ डिजिटल एक्सप्लोरर — Chhattisgarh Digital Explorer
### Digital Treasure Hunt (CHiPS Rajyotsav Interactive Exhibition Game)

An interactive, futuristic web-based exhibition game created for the **CHiPS (Chhattisgarh Infotech Promotion Society) Rajyotsav Exhibition**. Designed for 16:9 public exhibition touchscreens and kiosk terminals.

---

## 🌟 Features & Highlights

- **Exhibition Kiosk Interface**: High-tech cyberpunk aesthetic featuring deep navy palettes (`#04091a`), radiant neon cyan glows (`#00f2fe`), golden treasure chests, subtle CRT scanlines, and animated radar sweeps.
- **Authentic Central Chhattisgarh Map**: Renders real geographic vector boundaries of Chhattisgarh and its 27 districts, with animated glowing pulse-dash routes connecting the three treasure quests across the state.
- **Interactive Quests**:
  1. **Cyber Safety (Raipur Hub)** — Online security, passwords, fraud prevention, and digital safety.
  2. **AI Explorer (Bilaspur Sector)** — Artificial intelligence, voice assistants, and responsible AI.
  3. **Digital Seva (Bastar Sector)** — Online government portals, DigiLocker, UPI security, and citizen helplines.
- **Dynamic Question Bank Engine**: Decoupled question bank (`questions.json`) loaded dynamically with session tracking, repeat prevention, 4-option validation, and zero UI dependencies.
- **Strict Global Shared Retry Rule**: Exactly one retry shared across the entire game (not per question). The first wrong answer provides a dedicated retry chance; the second wrong answer triggers `Game Over`.
- **Chest Opening & Celebratory Fanfare**: Animated 3D-styled golden chest opening with bursting light beams and confetti effects, concluding with the grand golden trophy achievement screen (`बधाई हो! YOU ARE A CHHATTISGARH DIGITAL EXPLORER`).
- **Tactile Sound Effects**: Custom zero-dependency audio synthesizer using the Web Audio API with a global mute toggle.

---

## 🎮 Game Flow & Architecture

```
[ Welcome Screen ]
       │
       ▼ (Tap "START GAME")
[ Interactive Chhattisgarh Map ]
       │
       ├──► Treasure 1: Cyber Safety (Raipur)
       │         │
       │         ├── Wrong? (Retry available) ──► [ Retry Modal ] ──► (Re-attempt same Q)
       │         ├── Wrong? (Retry consumed)  ──► [ Game Over ] ──► (Play Again Reset)
       │         └── Correct! ────────────────► [ Chest 1 Unlocked Modal ] (1/3)
       │
       ├──► Treasure 2: AI Explorer (Bilaspur)
       │         │
       │         └── Correct! ────────────────► [ Chest 2 Unlocked Modal ] (2/3)
       │
       └──► Treasure 3: Digital Seva (Bastar)
                 │
                 └── Correct! ────────────────► [ Final Victory Modal ] (3/3 Complete)
```

### Dynamic Question Engine Method

1. **Storage (`questions.json`)**: All questions reside in a separate JSON file organized under category IDs (`cyber_safety`, `ai_explorer`, `digital_seva`).
2. **Service (`questionService.js`)**:
   - `getQuestionsByCategory(categoryId)`: Filters questions by category.
   - `validateQuestion(q)`: Enforces valid ID, question text, exactly 4 options, and valid `correctAnswer` (0-3).
   - `getDynamicQuestion(treasureId, usedQuestionIds)`: Filters out questions already played in this session to prevent repetition, picks randomly from remaining candidates, and returns a formatted question object.
   - Built-in fallback prevents game crashes if question files are empty or misconfigured.
3. **Retry Preservation**: When a player consumes their 1 shared retry, the active question object is preserved so they re-attempt the exact same question they missed.

---

## 🚀 Tech Stack

- **Framework**: React 19 + Vite
- **Styling**: Pure Vanilla CSS (custom design system, zero third-party CSS dependencies)
- **Effects**: `canvas-confetti` + Web Audio API synthesizer
- **Map & Icons**: Native SVG with authentic GeoJSON-derived Chhattisgarh boundary coordinates

---

## 🛠️ Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm / pnpm / yarn

### Installation & Running Locally

1. Clone the repository:
   ```bash
   git clone https://github.com/dewanganRachna/Treasure_Hunt.git
   cd Treasure_Hunt
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the local development server:
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173) in your browser.

4. Build for production:
   ```bash
   npm run build
   ```

---

## 📂 Project Structure

```
Treasure_Hunt/
├── index.html                           # Exhibition kiosk shell with Google Fonts & metadata
├── src/
│   ├── components/
│   │   ├── ChhattisgarhMap.jsx         # Central glowing vector state map & interactive markers
│   │   ├── Header.jsx                  # Kiosk telemetry header with live HUD & controls
│   │   ├── WelcomeScreen.jsx           # Welcome hero portal with quest teasers
│   │   ├── QuizModal.jsx               # Interactive Hindi Devanagari quiz card
│   │   ├── RetryFeedbackModal.jsx      # Dedicated single shared retry feedback modal
│   │   ├── GameOverModal.jsx           # Game over screen with play again reset
│   │   ├── TreasureSuccessModal.jsx    # Animated opening golden chest modal
│   │   ├── FinalAchievementModal.jsx   # 3/3 Victory celebration with golden trophy
│   │   └── TreasureChestIcon.jsx       # Custom SVG golden chest (locked / active / unlocked)
│   ├── data/
│   │   ├── chhattisgarhMapData.js      # District coordinates, treasure metadata, and routes
│   │   ├── questions.json              # Dynamic question bank (Cyber Safety, AI, Digital Seva)
│   │   └── questionService.js          # Dynamic question loader, validator & session tracker
│   ├── utils/
│   │   └── audio.js                    # Web Audio API synthesizer for tactile exhibition SFX
│   ├── App.jsx                         # State machine and gameplay orchestrator
│   ├── App.css                         # Vanilla CSS component styles & responsive layouts
│   ├── index.css                       # Core theme tokens, fonts, and animation keyframes
│   └── main.jsx                        # React root entry point
└── package.json
```
