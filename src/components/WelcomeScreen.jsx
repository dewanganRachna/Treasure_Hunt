import React from 'react';
import TreasureChestIcon from './TreasureChestIcon';
import { sound } from '../utils/audio';

export default function WelcomeScreen({ onStartGame = () => {} }) {
  const handleStart = () => {
    sound.playClick();
    sound.playCorrect();
    onStartGame();
  };

  return (
    <div className="welcome-screen select-none">
      {/* Background Animated Hologram Glow */}
      <div className="welcome-halo-bg">
        <div className="halo-glow-1 animate-pulse" />
      </div>

      <div className="welcome-content-container">
        {/* Sleek Exhibition Category Pill */}
        <div className="welcome-tag-pill">
          <span className="telemetry-ping-dot" />
          <span>राज्योत्सव 2024 • डिजिटल खोज अभियान</span>
        </div>

        {/* Central Holographic Treasure Seal */}
        <div className="welcome-hero-hologram">
          {/* Cyber Ring Rotation */}
          <div className="welcome-holo-ring ring-outer" />
          <div className="welcome-holo-ring ring-inner" />

          {/* Hologram Pedestal Base with Icon */}
          <div className="welcome-holo-core">
            <TreasureChestIcon state="active" size={74} />
          </div>

          {/* Floating Shadow Flare */}
          <div className="welcome-holo-flare" />
        </div>

        {/* Prominent Hindi Title & Subtitle */}
        <div className="welcome-title-group">
          <h1 className="welcome-title-hindi">
            छत्तीसगढ़ डिजिटल एक्सप्लोरर
          </h1>
          <h2 className="welcome-subtitle-english">
            CHHATTISGARH DIGITAL TREASURE HUNT
          </h2>
          <p className="welcome-tagline-text">
            3 डिजिटल खज़ानों को खोजें, सही उत्तर दें और प्रमाणित एक्सप्लोरर बनें!
          </p>
        </div>

        {/* Three Streamlined Quest Cards */}
        <div className="welcome-quests-grid">
          <div className="quest-teaser-card">
            <div className="quest-num-box">01</div>
            <div className="quest-info-box">
              <div className="quest-step-label">TREASURE 1 • रायपुर</div>
              <div className="quest-name-text">डिजिटल सेवा</div>
            </div>
          </div>

          <div className="quest-teaser-card">
            <div className="quest-num-box">02</div>
            <div className="quest-info-box">
              <div className="quest-step-label">TREASURE 2 • बिलासपुर</div>
              <div className="quest-name-text">एआई एक्सप्लोरर</div>
            </div>
          </div>

          <div className="quest-teaser-card">
            <div className="quest-num-box">03</div>
            <div className="quest-info-box">
              <div className="quest-step-label">TREASURE 3 • बस्तर</div>
              <div className="quest-name-text">स्मार्ट छत्तीसगढ़</div>
            </div>
          </div>
        </div>

        {/* Concise Single-Retry Rule Badge */}
        <div className="welcome-rule-pill">
          <span className="rule-bolt-icon">⚡</span>
          <span>पूरे गेम में केवल <strong>1 Retry</strong> उपलब्ध है • सोच-समझकर चुनें!</span>
        </div>

        {/* Bold, Striking Touch-Friendly Action Button */}
        <div className="welcome-btn-wrapper">
          <button
            type="button"
            onClick={handleStart}
            className="kiosk-primary-btn welcome-start-btn"
            id="start-mission-btn"
          >
            <span>START GAME • शुरू करें</span>
            <span className="btn-arrow-icon">➔</span>
          </button>
        </div>
      </div>
    </div>
  );
}
