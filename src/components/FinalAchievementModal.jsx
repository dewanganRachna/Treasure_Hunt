import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { sound } from '../utils/audio';

export default function FinalAchievementModal({ onPlayAgain = () => {} }) {
  useEffect(() => {
    sound.playVictory();

    const end = Date.now() + 3.5 * 1000;
    const colors = ['#00f2fe', '#ffd700', '#38ef7d', '#ffffff', '#f59e0b'];

    const frame = () => {
      try {
        confetti({
          particleCount: 5,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors
        });
        confetti({
          particleCount: 5,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors
        });
      } catch {
        // Fallback
      }

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  }, []);

  const handlePlayAgainClick = () => {
    sound.playClick();
    onPlayAgain();
  };

  return (
    <div className="victory-overlay">
      <div className="victory-card">
        {/* Glowing Top Beam */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: 'linear-gradient(90deg, #00f2fe, #ffd700, #00f2fe)'
          }}
        />

        {/* Top Badges */}
        <div
          style={{
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
            letterSpacing: '1px',
            marginBottom: '10px'
          }}
        >
          <span>🏆 CHiPS RAJYOTSAV DIGITAL MISSION COMPLETE</span>
        </div>

        {/* Required Hindi Congratulatory Text */}
        <h2
          style={{
            fontSize: '44px',
            fontWeight: 900,
            color: '#b45309',
            fontFamily: "'Noto Sans Devanagari', sans-serif",
            letterSpacing: '1px',
            margin: '2px 0 4px 0'
          }}
        >
          बधाई हो!
        </h2>

        {/* Required Main Text */}
        <h1
          style={{
            fontSize: '26px',
            fontWeight: 900,
            color: '#0f172a',
            fontFamily: "'Outfit', sans-serif",
            textTransform: 'uppercase',
            letterSpacing: '1.5px',
            margin: '0 0 10px 0'
          }}
        >
          YOU ARE A CHHATTISGARH DIGITAL EXPLORER
        </h1>

        {/* Required Progress text */}
        <div
          style={{
            display: 'inline-block',
            padding: '6px 20px',
            borderRadius: '12px',
            background: '#f0f9ff',
            border: '1.5px solid #bae6fd',
            color: '#0284c7',
            fontFamily: "'Rajdhani', monospace",
            fontSize: '14px',
            fontWeight: 800,
            letterSpacing: '1px',
            marginBottom: '14px'
          }}
        >
          PROGRESS: 3/3 TREASURES UNLOCKED
        </div>

        {/* Grand Golden Trophy Visual */}
        <div style={{ position: 'relative', width: '180px', height: '180px', margin: '4px 0 12px 0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {/* Rotating Radiant Sunburst */}
          <div
            className="sunburst-spin"
            style={{
              position: 'absolute',
              width: '280px',
              height: '280px',
              opacity: 0.35,
              pointerEvents: 'none'
            }}
          >
            <svg viewBox="0 0 200 200" width="100%" height="100%">
              {[0, 22.5, 45, 67.5, 90, 112.5, 135, 157.5, 180, 202.5, 225, 247.5, 270, 292.5, 315, 337.5].map((deg) => (
                <polygon
                  key={deg}
                  points="100,100 92,0 108,0"
                  fill="url(#trophySunburstGradient)"
                  transform={`rotate(${deg} 100 100)`}
                />
              ))}
              <defs>
                <linearGradient id="trophySunburstGradient" x1="0" y1="1" x2="0" y2="0">
                  <stop offset="0%" stopColor="#ffd700" stopOpacity="0" />
                  <stop offset="60%" stopColor="#ffd700" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.9" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          <div
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(251, 191, 36, 0.4) 0%, rgba(245, 158, 11, 0.15) 50%, transparent 70%)',
              filter: 'blur(24px)'
            }}
            className="animate-pulse"
          />

          <svg viewBox="0 0 160 160" width="100%" height="100%" style={{ position: 'relative', zIndex: 2 }} className="animate-bounce-subtle">
            <defs>
              <linearGradient id="trophyGold" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fffbeb" />
                <stop offset="35%" stopColor="#ffd700" />
                <stop offset="70%" stopColor="#f59e0b" />
                <stop offset="100%" stopColor="#b45309" />
              </linearGradient>
              <linearGradient id="trophyBase" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#334155" />
                <stop offset="100%" stopColor="#0f172a" />
              </linearGradient>
            </defs>

            {/* Laurel Wreath Left */}
            <path
              d="M 40 90 C 25 70 28 40 46 25 M 34 80 C 20 60 25 35 40 22"
              fill="none"
              stroke="#fbbf24"
              strokeWidth="3"
              strokeLinecap="round"
            />
            {/* Laurel Wreath Right */}
            <path
              d="M 120 90 C 135 70 132 40 114 25 M 126 80 C 140 60 135 35 120 22"
              fill="none"
              stroke="#fbbf24"
              strokeWidth="3"
              strokeLinecap="round"
            />

            {/* Trophy Cup */}
            <path
              d="M 50 35 L 110 35 L 102 85 C 98 100 62 100 58 85 Z"
              fill="url(#trophyGold)"
              stroke="#fbbf24"
              strokeWidth="2"
            />

            {/* Left Handle */}
            <path
              d="M 50 42 C 30 42 30 72 54 75"
              fill="none"
              stroke="url(#trophyGold)"
              strokeWidth="5"
              strokeLinecap="round"
            />
            {/* Right Handle */}
            <path
              d="M 110 42 C 130 42 130 72 106 75"
              fill="none"
              stroke="url(#trophyGold)"
              strokeWidth="5"
              strokeLinecap="round"
            />

            {/* Trophy Stem & Base */}
            <path d="M 74 96 L 86 96 L 88 120 L 72 120 Z" fill="url(#trophyGold)" />
            <rect x="52" y="120" width="56" height="18" rx="4" fill="url(#trophyBase)" stroke="#fbbf24" strokeWidth="2" />
            <rect x="60" y="124" width="40" height="10" rx="2" fill="#ffd700" />

            {/* Center Star on Cup */}
            <polygon
              points="80,50 84,62 96,62 86,70 90,82 80,74 70,82 74,70 64,62 76,62"
              fill="#ffffff"
            />

            {/* Sparkles */}
            <circle cx="44" cy="24" r="3" fill="#ffffff" />
            <circle cx="116" cy="24" r="3" fill="#ffffff" />
            <circle cx="80" cy="18" r="4" fill="#00f2fe" />
          </svg>
        </div>

        {/* 3 Unlocked Treasures Summary List */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '10px',
            width: '100%',
            maxWidth: '520px',
            marginBottom: '20px'
          }}
        >
          <div
            style={{
              padding: '10px',
              borderRadius: '12px',
              background: '#f0fdf4',
              border: '1px solid #bbf7d0',
              textAlign: 'left',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <span style={{ color: '#10b981', fontWeight: 800, fontSize: '18px' }}>✓</span>
            <div>
              <div style={{ fontSize: '10px', color: '#059669', fontWeight: 700, textTransform: 'uppercase', fontFamily: "'Rajdhani', monospace" }}>
                Treasure 1
              </div>
              <div style={{ fontSize: '12px', fontWeight: 700, color: '#0f172a' }}>Digital Seva</div>
            </div>
          </div>

          <div
            style={{
              padding: '10px',
              borderRadius: '12px',
              background: '#f0fdf4',
              border: '1px solid #bbf7d0',
              textAlign: 'left',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <span style={{ color: '#10b981', fontWeight: 800, fontSize: '18px' }}>✓</span>
            <div>
              <div style={{ fontSize: '10px', color: '#059669', fontWeight: 700, textTransform: 'uppercase', fontFamily: "'Rajdhani', monospace" }}>
                Treasure 2
              </div>
              <div style={{ fontSize: '12px', fontWeight: 700, color: '#0f172a' }}>AI Explorer</div>
            </div>
          </div>

          <div
            style={{
              padding: '10px',
              borderRadius: '12px',
              background: '#f0fdf4',
              border: '1px solid #bbf7d0',
              textAlign: 'left',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <span style={{ color: '#10b981', fontWeight: 800, fontSize: '18px' }}>✓</span>
            <div>
              <div style={{ fontSize: '10px', color: '#059669', fontWeight: 700, textTransform: 'uppercase', fontFamily: "'Rajdhani', monospace" }}>
                Treasure 3
              </div>
              <div style={{ fontSize: '12px', fontWeight: 700, color: '#0f172a' }}>Smart Chhattisgarh</div>
            </div>
          </div>
        </div>

        {/* Required PLAY AGAIN Button */}
        <div style={{ width: '100%', maxWidth: '300px' }}>
          <button
            type="button"
            onClick={handlePlayAgainClick}
            className="kiosk-gold-btn"
          >
            <span>↺</span>
            <span>PLAY AGAIN</span>
          </button>
        </div>
      </div>
    </div>
  );
}
