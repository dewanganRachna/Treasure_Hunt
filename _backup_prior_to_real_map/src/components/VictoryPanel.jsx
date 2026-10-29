import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import TrophyIcon from './TrophyIcon';

/**
 * VictoryPanel - Matches Panel 8
 * Left card showing golden Trophy with laurel wreath and 'बधाई हो!' ribbon banner.
 * 'YOU ARE A CHHATTISGARH DIGITAL EXPLORER', 'ALL 10 LEVELS COMPLETED — 10/10',
 * and 'PLAY AGAIN' button with gentle confetti falling slowly.
 */
export default function VictoryPanel({ onPlayAgain = () => {} }) {
  useEffect(() => {
    // Subtle, gentle confetti burst with gold, green, and cream pieces falling slowly
    const end = Date.now() + 3000;
    const colors = ['#C9A24A', '#F3D98B', '#14452F', '#3E8E4F', '#FBF6E9'];

    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.3 },
        colors,
        gravity: 0.7,
        ticks: 300
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.3 },
        colors,
        gravity: 0.7,
        ticks: 300
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };

    frame();
  }, []);

  return (
    <div className="victory-panel-overlay">
      <div className="victory-card" role="dialog" aria-labelledby="victory-heading">
        {/* Ornate Corner Flourishes */}
        <div className="corner-flourish corner-tl" />
        <div className="corner-flourish corner-tr" />
        <div className="corner-flourish corner-bl" />
        <div className="corner-flourish corner-br" />

        {/* 1. Large Golden Trophy Illustration with Laurel Wreath & 'बधाई हो!' Ribbon */}
        <div className="victory-trophy-wrap">
          <TrophyIcon />
        </div>

        {/* 2. Victory Congratulatory Text Stack */}
        <div className="victory-text-stack">
          <p className="victory-pre-title">YOU ARE A CHHATTISGARH</p>
          <h2 className="victory-main-title" id="victory-heading">DIGITAL EXPLORER</h2>
          
          <div className="victory-score-pill">
            <span className="victory-score-text">ALL 10 LEVELS COMPLETED — 10/10</span>
          </div>

          {/* 3. Dark-Green Gold-Trimmed PLAY AGAIN Button */}
          <button
            type="button"
            className="game-action-btn play-again-btn"
            onClick={onPlayAgain}
            aria-label="Play Again - Return to Welcome screen"
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

