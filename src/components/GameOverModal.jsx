import React, { useEffect } from 'react';
import { sound } from '../utils/audio';

export default function GameOverModal({ onPlayAgain = () => {} }) {
  useEffect(() => {
    sound.playGameOver();
  }, []);

  const handlePlayAgainClick = () => {
    sound.playClick();
    onPlayAgain();
  };

  return (
    <div className="game-over-overlay">
      <div className="game-over-card">
        {/* Cyber Tech Corner Brackets */}
        <div className="tech-corner-accent tech-corner-tl" style={{ borderColor: '#f43f5e' }} />
        <div className="tech-corner-accent tech-corner-tr" style={{ borderColor: '#f43f5e' }} />
        <div className="tech-corner-accent tech-corner-bl" style={{ borderColor: '#f43f5e' }} />
        <div className="tech-corner-accent tech-corner-br" style={{ borderColor: '#f43f5e' }} />

        {/* Skull / Terminal Failure Hologram */}
        <div
          style={{
            width: '88px',
            height: '88px',
            borderRadius: '50%',
            background: 'rgba(244, 63, 94, 0.12)',
            border: '2px solid #f43f5e',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '18px',
            boxShadow: '0 0 30px rgba(244, 63, 94, 0.5)'
          }}
          className="animate-pulse"
        >
          <svg viewBox="0 0 48 48" width="48" height="48" fill="none">
            <circle cx="24" cy="24" r="20" stroke="#f43f5e" strokeWidth="3" strokeDasharray="5 4" />
            <line x1="16" y1="16" x2="32" y2="32" stroke="#f43f5e" strokeWidth="4" strokeLinecap="round" />
            <line x1="32" y1="16" x2="16" y2="32" stroke="#f43f5e" strokeWidth="4" strokeLinecap="round" />
          </svg>
        </div>

        {/* Headings */}
        <h2
          style={{
            fontSize: '40px',
            fontWeight: 900,
            color: '#fb7185',
            fontFamily: "'Outfit', sans-serif",
            textTransform: 'uppercase',
            letterSpacing: '2px',
            margin: '0 0 4px 0',
            textShadow: '0 2px 15px rgba(244, 63, 94, 0.7)'
          }}
        >
          GAME OVER
        </h2>
        <h3
          style={{
            fontSize: '22px',
            fontWeight: 800,
            color: '#ffffff',
            fontFamily: "'Noto Sans Devanagari', sans-serif",
            margin: '0 0 14px 0'
          }}
        >
          खेल समाप्त
        </h3>

        {/* Explanation Message */}
        <div
          style={{
            padding: '16px 20px',
            borderRadius: '14px',
            background: 'rgba(15, 23, 42, 0.85)',
            border: '1px solid rgba(244, 63, 94, 0.35)',
            fontSize: '14px',
            color: '#cbd5e1',
            lineHeight: 1.5,
            maxWidth: '380px',
            marginBottom: '24px'
          }}
        >
          <p style={{ fontWeight: 700, color: '#fecdd3', marginBottom: '8px' }}>
            आपके सभी अवसर (Single Retry) समाप्त हो चुके हैं।
          </p>
          <p style={{ fontSize: '13px', color: '#94a3b8', margin: 0 }}>
            चिंता न करें! डिजिटल एक्सप्लोरर बनने के लिए फिर से खेलें और सभी 3 खजाने अनलॉक करें।
          </p>
        </div>

        {/* PLAY AGAIN Button */}
        <div style={{ width: '100%', maxWidth: '300px' }}>
          <button
            type="button"
            onClick={handlePlayAgainClick}
            className="kiosk-danger-btn"
          >
            <span>↺</span>
            <span>PLAY AGAIN</span>
          </button>
        </div>
      </div>
    </div>
  );
}
