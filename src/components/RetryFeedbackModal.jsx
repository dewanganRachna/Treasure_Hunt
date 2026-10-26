import React, { useEffect } from 'react';
import { sound } from '../utils/audio';

export default function RetryFeedbackModal({ onRetry = () => {} }) {
  useEffect(() => {
    sound.playWrong();
  }, []);

  const handleRetryClick = () => {
    sound.playClick();
    onRetry();
  };

  return (
    <div className="retry-modal-overlay">
      <div className="retry-card">
        {/* Pulsing Warning Hologram Icon */}
        <div
          style={{
            width: '88px',
            height: '88px',
            borderRadius: '50%',
            background: 'rgba(245, 158, 11, 0.12)',
            border: '2px solid #fbbf24',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '20px',
            boxShadow: '0 0 25px rgba(251, 191, 36, 0.5)'
          }}
          className="animate-bounce-subtle"
        >
          <svg viewBox="0 0 48 48" width="48" height="48" fill="none">
            <path
              d="M 24 6 L 44 40 L 4 40 Z"
              stroke="#fbbf24"
              strokeWidth="3.5"
              strokeLinejoin="round"
            />
            <line x1="24" y1="18" x2="24" y2="28" stroke="#fbbf24" strokeWidth="4" strokeLinecap="round" />
            <circle cx="24" cy="34" r="2.5" fill="#fbbf24" />
          </svg>
        </div>

        {/* Required Headline */}
        <h2
          style={{
            fontSize: '34px',
            fontWeight: 900,
            color: '#fcd34d',
            fontFamily: "'Noto Sans Devanagari', sans-serif",
            margin: '0 0 6px 0',
            textShadow: '0 2px 15px rgba(251, 191, 36, 0.5)'
          }}
        >
          Oops! गलत जवाब!
        </h2>

        {/* Required Subtitle */}
        <p
          style={{
            fontSize: '20px',
            fontWeight: 800,
            color: '#ffffff',
            fontFamily: "'Noto Sans Devanagari', sans-serif",
            margin: '0 0 16px 0'
          }}
        >
          आपके पास एक Retry बाकी है।
        </p>

        {/* Tactical Advice */}
        <div
          style={{
            padding: '14px 18px',
            borderRadius: '12px',
            background: 'rgba(15, 23, 42, 0.85)',
            border: '1px solid rgba(148, 163, 184, 0.3)',
            fontSize: '14px',
            color: '#cbd5e1',
            lineHeight: 1.5,
            maxWidth: '380px',
            marginBottom: '24px'
          }}
        >
          <p>
            ध्यान से सोचकर दोबारा प्रयास करें। इस बार सही उत्तर देने पर ही खज़ाना अनलॉक होगा!
          </p>
        </div>

        {/* RETRY Button */}
        <div style={{ width: '100%', maxWidth: '300px' }}>
          <button
            type="button"
            onClick={handleRetryClick}
            className="kiosk-gold-btn"
          >
            <span>↺</span>
            <span>RETRY</span>
          </button>
        </div>
      </div>
    </div>
  );
}
