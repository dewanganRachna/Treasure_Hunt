import React, { useState } from 'react';
import { sound } from '../utils/audio';

export default function Header({
  unlockedCount = 0,
  totalTreasures = 3,
  retryUsed = false,
  onReset = () => {},
  isMuted = false,
  onToggleMute = () => {}
}) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = () => {
    sound.playClick();
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => {
        setIsFullscreen(true);
      }).catch(() => {});
    } else {
      document.exitFullscreen().then(() => {
        setIsFullscreen(false);
      }).catch(() => {});
    }
  };

  return (
    <header className="kiosk-header">
      {/* Left: Branding & CHiPS Rajyotsav Logo Emblem */}
      <div className="header-brand-container">
        {/* Emblem Crest */}
        <div className="header-emblem-crest">
          <svg viewBox="0 0 40 40" width="28" height="28">
            <polygon points="20,2 36,10 36,30 20,38 4,30 4,10" fill="none" stroke="#00f2fe" strokeWidth="2.5" />
            <circle cx="20" cy="20" r="7" fill="#ffd700" />
            <path d="M 20 7 L 20 12 M 20 28 L 20 33 M 7 20 L 12 20 M 28 20 L 33 20" stroke="#00f2fe" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>

        <div className="header-brand-text">
          <div className="header-tag-row">
            <span className="chips-state-badge">
              CHiPS • छत्तीसगढ़ शासन
            </span>
            <span className="rajyotsav-badge">
              राज्य उत्सव विशेष
            </span>
          </div>
          <h1 className="header-main-title">
            छत्तीसगढ़ डिजिटल एक्सप्लोरर
          </h1>
        </div>
      </div>

      {/* Center: Live Mission Progress & Shared Retry Indicator */}
      <div className="header-center-hud">
        {/* Progress Display */}
        <div className="hud-badge hud-badge-progress">
          <span className="hud-label">PROGRESS:</span>
          <div className="progress-dots-row">
            {[1, 2, 3].map((step) => (
              <div
                key={step}
                className={`progress-dot ${step <= unlockedCount ? 'active' : ''}`}
              />
            ))}
          </div>
          <span className="progress-counter-text">
            {unlockedCount}/{totalTreasures}
          </span>
        </div>

        {/* Global Shared Retry Status Badge */}
        <div
          className={`hud-badge ${!retryUsed ? 'hud-badge-retry-available' : 'hud-badge-retry-consumed'}`}
          title="Single retry shared across all 3 quiz questions"
        >
          {!retryUsed ? (
            <>
              <span className="status-ping-dot green" />
              <span>⚡ 1 RETRY AVAILABLE</span>
            </>
          ) : (
            <>
              <span className="status-ping-dot red" />
              <span>⚠️ 0 RETRIES LEFT</span>
            </>
          )}
        </div>
      </div>

      {/* Right: Audio Toggle, Fullscreen, and Reset */}
      <div className="header-controls-group">
        {/* Mute / Unmute Button */}
        <button
          type="button"
          onClick={onToggleMute}
          className="header-btn"
          title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
          aria-label="Sound Toggle"
        >
          <span>{isMuted ? '🔇' : '🔊'}</span>
          <span className="btn-label-desktop">{isMuted ? 'MUTE' : 'SOUND'}</span>
        </button>

        {/* Fullscreen Button */}
        <button
          type="button"
          onClick={toggleFullscreen}
          className="header-btn btn-fullscreen"
          title="Toggle Fullscreen (Exhibition Kiosk)"
          aria-label="Toggle Fullscreen"
        >
          {isFullscreen ? '⤓' : '⤢'}
        </button>

        {/* Play Again / Reset Button */}
        <button
          type="button"
          onClick={() => {
            sound.playClick();
            onReset();
          }}
          className="header-btn header-btn-restart"
          title="Restart Game"
        >
          <span>↺</span>
          <span>RESTART</span>
        </button>
      </div>
    </header>
  );
}
