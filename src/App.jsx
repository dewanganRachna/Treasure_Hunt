import React, { useState } from 'react';
import { MAP_CONFIG } from './data/chhattisgarhMapData';
import Header from './components/Header';
import ChhattisgarhMap from './components/ChhattisgarhMap';
import WelcomeScreen from './components/WelcomeScreen';
import QuizModal from './components/QuizModal';
import RetryFeedbackModal from './components/RetryFeedbackModal';
import GameOverModal from './components/GameOverModal';
import TreasureSuccessModal from './components/TreasureSuccessModal';
import FinalAchievementModal from './components/FinalAchievementModal';
import TreasureChestIcon from './components/TreasureChestIcon';
import CyberParticles from './components/CyberParticles';
import { sound } from './utils/audio';
import './App.css';

export default function App() {
  // Game state
  const [screen, setScreen] = useState('WELCOME'); // 'WELCOME' | 'MAP'
  const [currentTreasureId, setCurrentTreasureId] = useState(1); // 1, 2, or 3
  const [unlockedTreasures, setUnlockedTreasures] = useState([]); // [1], [1, 2], [1, 2, 3]

  // Shared Global Retry Rule State
  const [retryUsed, setRetryUsed] = useState(false);

  // Active Modals & Overlays
  const [activeQuizTreasure, setActiveQuizTreasure] = useState(null);
  const [showRetryFeedback, setShowRetryFeedback] = useState(false);
  const [showGameOver, setShowGameOver] = useState(false);
  const [successTreasureId, setSuccessTreasureId] = useState(null); // 1 or 2
  const [showVictory, setShowVictory] = useState(false);

  // Language state ('hi' for Hindi, 'en' for English)
  const [lang, setLang] = useState('hi');

  const toggleLang = () => {
    setLang((prev) => (prev === 'hi' ? 'en' : 'hi'));
  };

  // Audio mute state
  const [isMuted, setIsMuted] = useState(false);

  const toggleMute = () => {
    const muted = sound.toggleMute();
    setIsMuted(muted);
  };

  // Start game from Welcome Screen
  const handleStartGame = () => {
    setScreen('MAP');
    setCurrentTreasureId(1);
    setUnlockedTreasures([]);
    setRetryUsed(false);
  };

  // Completely reset the game
  const handleResetGame = () => {
    setScreen('WELCOME');
    setCurrentTreasureId(1);
    setUnlockedTreasures([]);
    setRetryUsed(false);
    setActiveQuizTreasure(null);
    setShowRetryFeedback(false);
    setShowGameOver(false);
    setSuccessTreasureId(null);
    setShowVictory(false);
  };

  // When a visitor touches the current active treasure on the map or sidebar
  const handleSelectTreasure = (treasure) => {
    // Only current active treasure can be opened
    if (treasure.id === currentTreasureId) {
      setActiveQuizTreasure(treasure);
    }
  };

  // Handle quiz question answer
  const handleAnswer = (isCorrect) => {
    if (isCorrect) {
      // Correct answer!
      setActiveQuizTreasure(null);

      if (currentTreasureId === 1) {
        setUnlockedTreasures([1]);
        setSuccessTreasureId(1);
      } else if (currentTreasureId === 2) {
        setUnlockedTreasures([1, 2]);
        setSuccessTreasureId(2);
      } else if (currentTreasureId === 3) {
        setUnlockedTreasures([1, 2, 3]);
        setShowVictory(true);
      }
    } else {
      // Wrong answer!
      // GLOBAL RETRY RULE CHECK
      setActiveQuizTreasure(null);

      if (!retryUsed) {
        // First wrong answer anywhere: Show dedicated Retry Feedback Screen
        setShowRetryFeedback(true);
      } else {
        // Retry was already consumed earlier: Show Game Over immediately!
        setShowGameOver(true);
      }
    }
  };

  // When visitor clicks RETRY on the retry feedback screen
  const handleRetry = () => {
    // Mark the single shared retry as consumed
    setRetryUsed(true);
    setShowRetryFeedback(false);

    // Reopen the exact same question
    const currentTreasure = MAP_CONFIG.treasures.find((t) => t.id === currentTreasureId);
    setActiveQuizTreasure(currentTreasure);
  };

  // When visitor clicks CONTINUE on Treasure 1 or 2 Success screen
  const handleContinue = () => {
    if (successTreasureId === 1) {
      setCurrentTreasureId(2);
      setSuccessTreasureId(null);
    } else if (successTreasureId === 2) {
      setCurrentTreasureId(3);
      setSuccessTreasureId(null);
    }
  };

  // Active mission information for HUD and sidebar
  const activeMission = MAP_CONFIG.treasures.find((t) => t.id === currentTreasureId);

  return (
    <div className="app-viewport select-none font-outfit">
      {/* Scanline CRT Kiosk overlay */}
      <div className="scanlines-overlay" />

      {/* Ambient Cyber Particles Canvas */}
      <CyberParticles />

      {/* Persistent Header */}
      <Header
        unlockedCount={unlockedTreasures.length}
        totalTreasures={3}
        retryUsed={retryUsed}
        onReset={handleResetGame}
        isMuted={isMuted}
        onToggleMute={toggleMute}
        lang={lang}
        onToggleLang={toggleLang}
      />

      {/* Main Exhibition Stage */}
      {screen === 'WELCOME' ? (
        <WelcomeScreen onStartGame={handleStartGame} />
      ) : (
        <div className="map-view-wrapper">
          {/* Left Exhibition Kiosk Telemetry Sidebar */}
          <aside className="map-sidebar">
            <div>
              {/* Mission Objective Header */}
              <div
                style={{
                  fontSize: '11px',
                  textTransform: 'uppercase',
                  fontFamily: "'Rajdhani', monospace",
                  fontWeight: 800,
                  letterSpacing: '1px',
                  color: '#00f2fe',
                  marginBottom: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <span className="telemetry-ping-dot" />
                ACTIVE MISSION OBJECTIVE
              </div>

              {/* Dynamic Mission Box */}
              <div className="mission-card">
                <div
                  style={{
                    fontSize: '11px',
                    fontFamily: "'Rajdhani', monospace",
                    color: '#67e8f9',
                    fontWeight: 700,
                    marginBottom: '4px'
                  }}
                >
                  SECTOR: {lang === 'en' ? (activeMission?.regionEn || activeMission?.region) : activeMission?.region}
                </div>
                <div
                  style={{
                    fontSize: '18px',
                    fontWeight: 900,
                    color: '#ffffff',
                    fontFamily: lang === 'en' ? "'Outfit', sans-serif" : "'Noto Sans Devanagari', sans-serif",
                    marginBottom: '4px'
                  }}
                >
                  {currentTreasureId === 1 && <span key="m1">{lang === 'en' ? 'Treasure 1: Digital Seva' : 'पहला खज़ाना: डिजिटल सेवा'}</span>}
                  {currentTreasureId === 2 && <span key="m2">{lang === 'en' ? 'Treasure 2: AI Explorer' : 'दूसरा खज़ाना: एआई एक्सप्लोरर'}</span>}
                  {currentTreasureId === 3 && <span key="m3">{lang === 'en' ? 'Final Treasure: Smart Chhattisgarh' : 'अंतिम खज़ाना: स्मार्ट छत्तीसगढ़'}</span>}
                </div>
                <div style={{ fontSize: '12px', color: '#cbd5e1', lineHeight: 1.4 }}>
                  {currentTreasureId === 1 && <span key="d1">{lang === 'en' ? 'Touch highlighted Marker #1 on the map to begin.' : 'मानचित्र पर हाइलाइट किए गए मार्कर #1 को स्पर्श करें।'}</span>}
                  {currentTreasureId === 2 && <span key="d2">{lang === 'en' ? 'Follow the glowing route to Marker #2.' : 'ग्लॉइंग रूट का अनुसरण कर मार्कर #2 को स्पर्श करें।'}</span>}
                  {currentTreasureId === 3 && <span key="d3">{lang === 'en' ? 'Unlock the final treasure to become a Digital Explorer!' : 'अंतिम खज़ाना अनलॉक कर डिजिटल एक्सप्लोरर बनें!'}</span>}
                </div>
              </div>

              {/* 3 Treasures Status Tracker */}
              <div
                style={{
                  fontSize: '11px',
                  textTransform: 'uppercase',
                  fontFamily: "'Rajdhani', monospace",
                  fontWeight: 800,
                  letterSpacing: '0.8px',
                  color: '#94a3b8',
                  marginBottom: '8px'
                }}
              >
                TREASURE QUESTS (खोज सूची)
              </div>

              {MAP_CONFIG.treasures.map((treasure) => {
                const isUnlocked = unlockedTreasures.includes(treasure.id);
                const isActive = treasure.id === currentTreasureId && !isUnlocked;
                const isLocked = !isUnlocked && !isActive;

                return (
                  <div
                    key={treasure.id}
                    onClick={() => isActive && handleSelectTreasure(treasure)}
                    className={`nav-treasure-card ${
                      isUnlocked ? 'unlocked' : isActive ? 'active' : 'locked'
                    }`}
                    style={{ cursor: isActive ? 'pointer' : 'default' }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <TreasureChestIcon
                          state={isUnlocked ? 'unlocked' : isActive ? 'active' : 'locked'}
                          size={36}
                        />
                      </div>
                      <div>
                        <div style={{ fontSize: '13px', fontWeight: 700, color: '#ffffff' }}>
                          {treasure.id}. {treasure.name}
                        </div>
                        <div style={{ fontSize: '11px', color: '#cbd5e1', fontFamily: "'Noto Sans Devanagari', sans-serif" }}>
                          {treasure.hindiName}
                        </div>
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      {isUnlocked && (
                        <span style={{ fontSize: '11px', fontWeight: 800, color: '#34d399', fontFamily: "'Rajdhani', monospace" }}>
                          ✓ UNLOCKED
                        </span>
                      )}
                      {isActive && (
                        <span style={{ fontSize: '11px', fontWeight: 800, color: '#00f2fe', fontFamily: "'Rajdhani', monospace" }}>
                          ▶ ACTIVE
                        </span>
                      )}
                      {isLocked && (
                        <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', fontFamily: "'Rajdhani', monospace" }}>
                          🔒 LOCKED
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom Kiosk Help Info */}
            <div
              style={{
                padding: '12px 14px',
                borderRadius: '12px',
                background: 'rgba(15, 23, 42, 0.75)',
                border: '1px solid rgba(51, 65, 85, 0.8)',
                fontSize: '11px',
                color: '#cbd5e1'
              }}
            >
              <div
                style={{
                  color: '#00f2fe',
                  fontFamily: "'Rajdhani', monospace",
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  marginBottom: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <span>⚡ SINGLE RETRY RULE</span>
              </div>
              <p style={{ lineHeight: 1.35, margin: 0 }}>
                पूरे खेल में केवल 1 री-ट्राई मिलता है। पहला गलत उत्तर आने पर आप सवाल दोबारा कर सकते हैं। दूसरा गलत उत्तर आने पर गेम ओवर हो जाएगा।
              </p>
            </div>
          </aside>

          {/* Central Map Stage */}
          <main className="map-main-stage">
            {/* Top Mission Floating Callout Banner */}
            <div className={`hud-mission-banner ${currentTreasureId === 3 ? 'gold' : ''}`}>
              <span style={{ color: currentTreasureId === 3 ? '#fbbf24' : '#00f2fe', fontSize: '14px', fontWeight: 800, fontFamily: "'Rajdhani', monospace", letterSpacing: '0.5px' }}>
                {currentTreasureId === 1 && <span key="hb1">{lang === 'en' ? '🎯 MISSION 1: Raipur — Unlock Digital Seva' : '🎯 MISSION 1: रायपुर — अनलॉक करें डिजिटल सेवा'}</span>}
                {currentTreasureId === 2 && <span key="hb2">{lang === 'en' ? '🚀 MISSION 2: Bilaspur — Unlock AI Explorer' : '🚀 MISSION 2: बिलासपुर — अनलॉक करें AI Explorer'}</span>}
                {currentTreasureId === 3 && <span key="hb3">{lang === 'en' ? '👑 FINAL MISSION: Bastar — Unlock Smart Chhattisgarh' : '👑 FINAL MISSION: बस्तर — अनलॉक करें Smart Chhattisgarh'}</span>}
              </span>
            </div>

            {/* The Central Glowing Chhattisgarh Interactive Map */}
            <ChhattisgarhMap
              unlockedTreasures={unlockedTreasures}
              currentTreasureId={currentTreasureId}
              onSelectTreasure={handleSelectTreasure}
              isInteractive={!activeQuizTreasure && !showRetryFeedback && !showGameOver && !successTreasureId && !showVictory}
              lang={lang}
            />

            {/* Mobile Bottom Quick Status Bar */}
            <div className="mobile-quick-status-bar">
              <span style={{ color: '#00f2fe', fontWeight: 800, fontFamily: "'Rajdhani', monospace" }}>
                TARGET: {activeMission?.name}
              </span>
              <span style={{ color: '#fbbf24', fontWeight: 800, fontFamily: "'Rajdhani', monospace" }}>
                {unlockedTreasures.length}/3 UNLOCKED
              </span>
            </div>
          </main>
        </div>
      )}

      {/* QUIZ MODAL */}
      {activeQuizTreasure && (
        <QuizModal
          treasure={activeQuizTreasure}
          retryUsed={retryUsed}
          onAnswer={handleAnswer}
          onClose={() => setActiveQuizTreasure(null)}
          lang={lang}
        />
      )}

      {/* RETRY FEEDBACK MODAL (First wrong answer anywhere) */}
      {showRetryFeedback && (
        <RetryFeedbackModal onRetry={handleRetry} />
      )}

      {/* GAME OVER MODAL */}
      {showGameOver && (
        <GameOverModal onPlayAgain={handleResetGame} />
      )}

      {/* TREASURE 1 & 2 SUCCESS MODAL */}
      {successTreasureId && (
        <TreasureSuccessModal
          treasureId={successTreasureId}
          onContinue={handleContinue}
          lang={lang}
        />
      )}

      {/* FINAL ACHIEVEMENT MODAL (3/3 Unlocked) */}
      {showVictory && (
        <FinalAchievementModal onPlayAgain={handleResetGame} />
      )}
    </div>
  );
}
