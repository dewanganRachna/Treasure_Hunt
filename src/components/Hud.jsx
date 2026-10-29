import React from 'react';

/**
 * Top HUD Overlay for gameplay screens
 * Matches Panel 2: CHiPS logo (left), Ribbon plaque (center), Progress pill (right)
 */
export default function Hud({ progressCount = 0, totalLevels = 10 }) {
  return (
    <header className="game-hud-overlay" role="banner">
      {/* 1. Top-Left: CHiPS Official Logo */}
      <div className="hud-logo-wrap">
        <img
          src="/assets/chips-logo.svg"
          alt="CHiPS - Chhattisgarh Infotech Promotion Society"
          className="hud-chips-logo"
        />
      </div>

      {/* 2. Top-Center: Dark-Green Gold-Trimmed Ribbon Plaque */}
      <div className="hud-ribbon-plaque">
        <div className="ribbon-tail-left" />
        <div className="ribbon-center-body">
          <div className="ribbon-gold-inner-border">
            <h1 className="ribbon-main-title">YOUR ADVENTURE MAP</h1>
            <p className="ribbon-subtitle">Complete all {totalLevels} checkpoints</p>
          </div>
        </div>
        <div className="ribbon-tail-right" />
      </div>

      {/* 3. Top-Right: Cream Progress Pill with Map Pin */}
      <div className="hud-progress-pill" aria-label={`Progress: ${progressCount} of ${totalLevels} completed`}>
        <div className="progress-pin-icon">
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none">
            <path
              d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"
              fill="#C9A24A"
              stroke="#8C6E2E"
              strokeWidth="1.5"
            />
            <circle cx="12" cy="9" r="2.8" fill="#FFFFFF" />
          </svg>
        </div>
        <span className="progress-counter-text">
          {progressCount}/{totalLevels}
        </span>
      </div>
    </header>
  );
}

