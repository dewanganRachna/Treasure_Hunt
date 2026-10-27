import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { sound } from '../utils/audio';

export default function TreasureSuccessModal({
  treasureId = 1,
  onContinue = () => {},
  lang = 'hi'
}) {
  const [chestOpened, setChestOpened] = useState(false);

  useEffect(() => {
    sound.playCorrect();
    const timer = setTimeout(() => {
      setChestOpened(true);
      sound.playChestOpen();

      try {
        confetti({
          particleCount: 70,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#00f2fe', '#ffd700', '#fbbf24', '#38ef7d', '#ffffff']
        });
      } catch {
        // Fallback
      }
    }, 350);

    return () => clearTimeout(timer);
  }, []);

  const handleContinueClick = () => {
    sound.playClick();
    onContinue();
  };

  const isTreasure1 = treasureId === 1;
  const title = isTreasure1 ? 'Congratulations! Treasure 1 Unlocked!' : 'Amazing! Treasure 2 Unlocked!';
  const hindiTitle = isTreasure1 ? 'बधाई! खज़ाना 1 (डिजिटल सेवा) अनलॉक हुआ!' : 'शानदार! खज़ाना 2 (एआई एक्सप्लोरर) अनलॉक हुआ!';
  const progressText = isTreasure1 ? '1/3' : '2/3';

  return (
    <div className="success-overlay">
      <div className="success-card">
        {/* Radiating Light Rays Background */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <div
            style={{
              width: '500px',
              height: '500px',
              borderRadius: '50%',
              background: 'rgba(251, 191, 36, 0.16)',
              filter: 'blur(80px)',
              transform: chestOpened ? 'scale(1.2)' : 'scale(0.8)',
              opacity: chestOpened ? 1 : 0.4,
              transition: 'all 0.8s ease'
            }}
          />
          {/* Rotating Sunburst Rays */}
          <div
            className="sunburst-spin"
            style={{
              position: 'absolute',
              width: '420px',
              height: '420px',
              opacity: chestOpened ? 0.28 : 0.08,
              transition: 'opacity 0.8s ease'
            }}
          >
            <svg viewBox="0 0 200 200" width="100%" height="100%">
              {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
                <polygon
                  key={deg}
                  points="100,100 92,0 108,0"
                  fill="#ffd700"
                  transform={`rotate(${deg} 100 100)`}
                />
              ))}
            </svg>
          </div>
        </div>

        {/* Top Progress Badge */}
        <div
          style={{
            zIndex: 10,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '5px 16px',
            borderRadius: '9999px',
            background: '#fef3c7',
            border: '1px solid #fde68a',
            color: '#b45309',
            fontFamily: "'Rajdhani', monospace",
            fontSize: '12px',
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '0.8px',
            marginBottom: '10px'
          }}
        >
          <span>PROGRESS UPDATE:</span>
          <span style={{ fontSize: '14px', fontWeight: 900, color: '#0284c7' }}>{progressText} UNLOCKED</span>
        </div>

        {/* Animated 3D-Style Chest Opening Showcase */}
        <div style={{ position: 'relative', width: '240px', height: '200px', margin: '8px 0', zIndex: 10 }}>
          <svg viewBox="0 0 200 180" width="100%" height="100%">
            <defs>
              <radialGradient id="chestInteriorGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#fffbeb" stopOpacity="1" />
                <stop offset="40%" stopColor="#ffd700" stopOpacity="0.8" />
                <stop offset="80%" stopColor="#f59e0b" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#000000" stopOpacity="0" />
              </radialGradient>
              <linearGradient id="goldPlate" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fff3a8" />
                <stop offset="40%" stopColor="#fbbf24" />
                <stop offset="80%" stopColor="#d97706" />
                <stop offset="100%" stopColor="#92400e" />
              </linearGradient>
            </defs>

            {/* Glowing Light Pillars when opened */}
            {chestOpened && (
              <g className="light-beams">
                <polygon points="100,85 50,0 75,0" fill="rgba(255, 234, 121, 0.45)" />
                <polygon points="100,85 90,0 110,0" fill="rgba(255, 255, 255, 0.7)" />
                <polygon points="100,85 125,0 150,0" fill="rgba(255, 234, 121, 0.45)" />
                <circle cx="100" cy="85" r="45" fill="url(#chestInteriorGlow)" />
              </g>
            )}

            {/* Floating Coins & Crystals */}
            {chestOpened && (
              <g className="floating-loot">
                <circle cx="70" cy="55" r="7" fill="#00f2fe" />
                <circle cx="130" cy="50" r="8" fill="#ffd700" />
                <circle cx="100" cy="35" r="9" fill="#fbbf24" />
                <polygon points="85,45 92,30 99,45" fill="#38ef7d" />
                <polygon points="115,55 122,40 129,55" fill="#00f2fe" />
              </g>
            )}

            {/* Chest Lower Base Box */}
            <path
              d="M 40 90 L 160 90 L 152 155 A 10 10 0 0 1 142 165 L 58 165 A 10 10 0 0 1 48 155 Z"
              fill="url(#goldPlate)"
              stroke="#78350f"
              strokeWidth="4"
            />
            {/* Base Vertical Straps */}
            <rect x="65" y="90" width="12" height="75" fill="#78350f" stroke="#fbbf24" strokeWidth="1.5" />
            <rect x="123" y="90" width="12" height="75" fill="#78350f" stroke="#fbbf24" strokeWidth="1.5" />

            {/* Chest Open Interior */}
            <rect x="46" y="78" width="108" height="24" rx="8" fill="#451a03" stroke="#ffd700" strokeWidth="2" />

            {/* Chest Lid - ANIMATED FROM CLOSED TO OPEN */}
            <g
              style={{
                transformOrigin: '100px 85px',
                transform: chestOpened ? 'rotate(-60deg) translateY(-18px)' : 'rotate(0deg)',
                transition: 'transform 0.7s cubic-bezier(0.34, 1.56, 0.64, 1)'
              }}
            >
              <path
                d="M 36 90 C 36 60 60 45 100 45 C 140 45 164 60 164 90 Z"
                fill="url(#goldPlate)"
                stroke="#78350f"
                strokeWidth="4"
              />
              <path d="M 65 48 L 65 90" stroke="#78350f" strokeWidth="12" />
              <path d="M 65 48 L 65 90" stroke="#fbbf24" strokeWidth="3" />
              <path d="M 123 48 L 123 90" stroke="#78350f" strokeWidth="12" />
              <path d="M 123 48 L 123 90" stroke="#fbbf24" strokeWidth="3" />

              {/* Lid Lock Plate */}
              <circle cx="100" cy="85" r="10" fill="#78350f" stroke="#ffd700" strokeWidth="2" />
              <circle cx="100" cy="85" r="4" fill="#00f2fe" />
            </g>
          </svg>
        </div>

        {/* Required Headline */}
        <h2
          style={{
            zIndex: 10,
            fontSize: '28px',
            fontWeight: 900,
            color: '#b45309',
            fontFamily: "'Outfit', sans-serif",
            textTransform: 'uppercase',
            letterSpacing: '1px',
            margin: '6px 0 2px 0'
          }}
        >
          {title}
        </h2>

        {/* Hindi Subtitle */}
        <h3
          style={{
            zIndex: 10,
            fontSize: '18px',
            fontWeight: 800,
            color: '#0f172a',
            fontFamily: "'Noto Sans Devanagari', sans-serif",
            margin: '0 0 20px 0'
          }}
        >
          {hindiTitle}
        </h3>

        {/* CONTINUE Button */}
        <div style={{ zIndex: 10, width: '100%', maxWidth: '320px' }}>
          <button
            type="button"
            onClick={handleContinueClick}
            className="kiosk-primary-btn"
            id="continue-treasure-btn"
          >
            <span>{lang === 'en' ? 'CONTINUE TO NEXT TREASURE' : 'अगला खज़ाना खोजें (CONTINUE)'}</span>
            <span>➔</span>
          </button>
        </div>
      </div>
    </div>
  );
}
