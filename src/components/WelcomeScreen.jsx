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

      {/* Top Exhibition Badge */}
      <div className="animate-fade-in" style={{ zIndex: 10 }}>
        <div className="chips-state-badge" style={{ padding: '6px 18px', borderRadius: '20px', fontSize: '13px' }}>
          <span className="telemetry-ping-dot" style={{ marginRight: '8px' }} />
          <span>CHiPS RAJYOTSAV EXHIBITION • छत्तीसगढ़ इन्फोटेक प्रमोशन सोसाइटी</span>
        </div>
      </div>

      {/* Hero Visual & Titles */}
      <div className="welcome-content-container" style={{ zIndex: 10 }}>
        {/* Animated Central Holographic Seal with Treasure Chest */}
        <div style={{ position: 'relative', margin: '14px 0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {/* Outer Counter-Rotating Ring with Tech Ticks */}
          <div
            style={{
              position: 'absolute',
              width: '240px',
              height: '240px',
              borderRadius: '50%',
              border: '1.5px dashed rgba(0, 242, 254, 0.35)',
              animation: 'spinSlow 16s linear infinite reverse',
              pointerEvents: 'none'
            }}
          />
          {/* Rotating Cybernetic Ring */}
          <div
            className="animate-spin-slow"
            style={{
              position: 'absolute',
              width: '190px',
              height: '190px',
              borderRadius: '50%',
              border: '2px dotted rgba(251, 191, 36, 0.45)',
              pointerEvents: 'none'
            }}
          />
          {/* Inner Glowing Hexagon Radar Grid */}
          <div
            style={{
              position: 'absolute',
              width: '160px',
              height: '160px',
              borderRadius: '50%',
              border: '1px solid rgba(0, 242, 254, 0.3)',
              boxShadow: '0 0 25px rgba(0, 242, 254, 0.25)',
              pointerEvents: 'none'
            }}
          />

          {/* Pulsing Aura Box */}
          <div
            style={{
              width: '140px',
              height: '140px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(0, 242, 254, 0.3) 0%, rgba(251, 191, 36, 0.25) 55%, transparent 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1.5px solid rgba(0, 242, 254, 0.6)',
              boxShadow: '0 0 45px rgba(0, 242, 254, 0.45)'
            }}
          >
            <TreasureChestIcon state="active" size={88} />
          </div>
        </div>

        {/* Hindi Title */}
        <h1 className="welcome-title-hindi">
          छत्तीसगढ़ डिजिटल एक्सप्लोरर
        </h1>

        {/* English Subtitle */}
        <h2 className="welcome-subtitle-english">
          A Digital Treasure Hunt
        </h2>

        <p className="welcome-desc-para">
          छत्तीसगढ़ के डिजिटल रूपांतरण की रोमांचक यात्रा! तीन डिजिटल खज़ानों को खोजें, 
          क्विज़ का सही उत्तर दें और प्रमाणित डिजिटल एक्सप्लोरर बनें।
        </p>

        {/* Three Mission Steps Teaser */}
        <div className="welcome-quests-grid">
          <div className="quest-teaser-card">
            <div className="quest-num-box">01</div>
            <div>
              <div style={{ fontSize: '11px', color: '#00f2fe', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Treasure 1
              </div>
              <div style={{ fontSize: '14px', fontWeight: 700, color: '#ffffff' }}>Digital Seva</div>
            </div>
          </div>

          <div className="quest-teaser-card">
            <div className="quest-num-box">02</div>
            <div>
              <div style={{ fontSize: '11px', color: '#00f2fe', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Treasure 2
              </div>
              <div style={{ fontSize: '14px', fontWeight: 700, color: '#ffffff' }}>AI Explorer</div>
            </div>
          </div>

          <div className="quest-teaser-card">
            <div className="quest-num-box">03</div>
            <div>
              <div style={{ fontSize: '11px', color: '#00f2fe', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Treasure 3
              </div>
              <div style={{ fontSize: '14px', fontWeight: 700, color: '#ffffff' }}>Smart Chhattisgarh</div>
            </div>
          </div>
        </div>

        {/* Global Retry Rule Notice */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 16px',
            borderRadius: '10px',
            background: 'rgba(120, 53, 15, 0.35)',
            border: '1px solid rgba(251, 191, 36, 0.4)',
            color: '#fef3c7',
            fontSize: '13px',
            marginBottom: '24px'
          }}
        >
          <span>⚡</span>
          <span>
            <strong>नियम:</strong> पूरे खेल में केवल <strong>1 Retry</strong> (पुनः प्रयास) उपलब्ध है। ध्यान से उत्तर चुनें!
          </span>
        </div>

        {/* Touch-Friendly Start Button */}
        <div style={{ width: '100%', maxWidth: '360px' }}>
          <button
            type="button"
            onClick={handleStart}
            className="kiosk-primary-btn"
          >
            <span>START GAME</span>
            <span style={{ fontSize: '24px' }}>➔</span>
          </button>
        </div>
      </div>
    </div>
  );
}
