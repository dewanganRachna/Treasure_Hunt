import React from 'react';

/**
 * GameOverPanel - Matches Panel 7
 * Cream card on left side with red circular X overlapping top edge.
 * Shows 'GAME OVER', 'खेल समाप्त!', 'Oops! गलत जवाब!', message, and 'PLAY AGAIN' button.
 * Resets state completely back to WELCOME screen.
 */
export default function GameOverPanel({ onPlayAgain = () => {} }) {
  return (
    <div className="game-over-panel-overlay">
      <div className="game-over-card" role="alertdialog" aria-labelledby="game-over-heading">
        {/* Ornate Corner Flourishes */}
        <div className="corner-flourish corner-tl" />
        <div className="corner-flourish corner-tr" />
        <div className="corner-flourish corner-bl" />
        <div className="corner-flourish corner-br" />

        {/* 1. Large Red Circular X Icon Overlapping Top Edge */}
        <div className="game-over-x-badge">
          <svg viewBox="0 0 72 72" width="72" height="72" fill="none">
            {/* Outer Gold Rim */}
            <circle cx="36" cy="36" r="35" fill="none" stroke="#FDE68A" strokeWidth="2.5" />
            {/* Crimson Red Disk with Radial Shading */}
            <circle cx="36" cy="36" r="32" fill="#C0392B" stroke="#962D22" strokeWidth="2" />
            {/* Crisp White Bold X */}
            <path
              d="M 24 24 L 48 48 M 48 24 L 24 48"
              stroke="#FFFFFF"
              strokeWidth="5"
              strokeLinecap="round"
            />
          </svg>
        </div>

        {/* 2. Text Stack */}
        <div className="game-over-content">
          <h2 className="game-over-title-en" id="game-over-heading">GAME OVER</h2>
          <h3 className="game-over-title-hi">खेल समाप्त!</h3>

          <div className="game-over-alert-box">
            <p className="game-over-oops-text">Oops! गलत जवाब!</p>
            <p className="game-over-msg-line1">आपकी यात्रा यहीं समाप्त हुई!</p>
            <p className="game-over-msg-line2">अगली बार फिर कोशिश करें!</p>
          </div>

          {/* 3. Dark-Green Gold-Trimmed PLAY AGAIN Button */}
          <button
            type="button"
            className="game-action-btn play-again-btn"
            onClick={onPlayAgain}
            aria-label="Play Again - Restart game from Welcome screen"
            autoFocus
          >
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" className="btn-refresh-icon">
              <path
                d="M4 12a8 8 0 0114.93-4M20 12a8 8 0 01-14.93 4"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <polyline points="20 4 20 10 14 10" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              <polyline points="4 20 4 14 10 14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span>PLAY AGAIN</span>
          </button>
        </div>
      </div>
    </div>
  );
}
