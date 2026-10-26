import React, { useState } from 'react';
import { sound } from '../utils/audio';

export default function QuizModal({
  treasure,
  retryUsed = false,
  onAnswer = () => {},
  onClose = () => {},
  lang = 'hi'
}) {
  const [selectedOptionId, setSelectedOptionId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!treasure) return null;

  const handleSelectOption = (option) => {
    if (isSubmitting) return;
    sound.playClick();
    setSelectedOptionId(option.id);
    setIsSubmitting(true);

    setTimeout(() => {
      onAnswer(option.isCorrect);
    }, 400);
  };

  return (
    <div className="quiz-overlay">
      <div className="quiz-card">
        {/* Cyber Tech Corner Brackets */}
        <div className="tech-corner-accent tech-corner-tl" />
        <div className="tech-corner-accent tech-corner-tr" />
        <div className="tech-corner-accent tech-corner-bl" />
        <div className="tech-corner-accent tech-corner-br" />

        {/* Glowing Top Beam */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: 'linear-gradient(90deg, transparent, #00f2fe, transparent)'
          }}
        />

        {/* Top Header Information */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingBottom: '16px',
            borderBottom: '1px solid rgba(0, 242, 254, 0.2)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                background: '#082f49',
                border: '1px solid #00f2fe',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                color: '#00f2fe',
                fontFamily: "'Rajdhani', monospace"
              }}
            >
              0{treasure.id}
            </div>
            <div>
              <div
                style={{
                  fontSize: '11px',
                  textTransform: 'uppercase',
                  fontFamily: "'Rajdhani', monospace",
                  fontWeight: 700,
                  letterSpacing: '1px',
                  color: '#00f2fe'
                }}
              >
                TREASURE CHALLENGE
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#ffffff', margin: 0 }}>
                {treasure.name} <span style={{ color: '#fbbf24' }}>({treasure.hindiName})</span>
              </h3>
            </div>
          </div>

          {/* Retry Status Indicator */}
          <div
            style={{
              padding: '6px 12px',
              borderRadius: '8px',
              background: '#040d21',
              border: '1px solid rgba(148, 163, 184, 0.3)',
              fontSize: '12px',
              fontFamily: "'Rajdhani', monospace",
              fontWeight: 700
            }}
          >
            {!retryUsed ? (
              <span style={{ color: '#34d399', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span className="status-ping-dot green" />
                1 Retry Available
              </span>
            ) : (
              <span style={{ color: '#f43f5e', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span className="status-ping-dot red" />
                Retry Consumed
              </span>
            )}
          </div>
        </div>

        {/* The Quiz Question */}
        <div style={{ margin: '20px 0 16px 0' }}>
          <div
            style={{
              fontSize: '11px',
              fontFamily: "'Rajdhani', monospace",
              color: '#00f2fe',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              marginBottom: '6px'
            }}
          >
            SECTOR: {lang === 'en' ? (treasure.regionEn || treasure.region) : treasure.region}
          </div>
          <h2 className="quiz-question-heading" style={{ margin: '0 0 4px 0' }}>
            {lang === 'en' ? (treasure.questionEn || treasure.question) : treasure.question}
          </h2>
          <div style={{ fontSize: '13px', color: '#94a3b8', fontStyle: 'italic' }}>
            {lang === 'en' ? treasure.question : (treasure.questionEn || '')}
          </div>
        </div>

        {/* Options List */}
        <div className="quiz-options-list">
          {treasure.options.map((option) => {
            const isSelected = selectedOptionId === option.id;
            const primaryText = lang === 'en' ? (option.textEn || option.text) : option.text;
            const subText = lang === 'en' ? option.text : (option.textEn || '');

            return (
              <button
                key={option.id}
                type="button"
                onClick={() => handleSelectOption(option)}
                disabled={isSubmitting}
                className={`quiz-option-button ${isSelected ? 'selected' : ''}`}
              >
                <div className="quiz-opt-badge">
                  {option.id}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0, textAlign: 'left' }}>
                  <span className="quiz-opt-text" style={{ fontSize: '15px', fontWeight: 700, color: '#ffffff' }}>
                    {primaryText}
                  </span>
                  {subText && (
                    <span style={{ fontSize: '12px', color: '#94a3b8' }}>
                      {subText}
                    </span>
                  )}
                </div>
                <div
                  style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    border: '2px solid',
                    borderColor: isSelected ? '#00f2fe' : '#475569',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}
                >
                  {isSelected && (
                    <div
                      style={{
                        width: '10px',
                        height: '10px',
                        borderRadius: '50%',
                        background: '#00f2fe'
                      }}
                    />
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Hint / Back Link */}
        <div
          style={{
            paddingTop: '12px',
            borderTop: '1px solid rgba(0, 242, 254, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '12px',
            color: '#94a3b8',
            fontFamily: "'Rajdhani', monospace"
          }}
        >
          <span>👆 सही उत्तर चुनने के लिए स्पर्श करें (Touch to select)</span>
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            style={{
              background: 'none',
              border: 'none',
              color: '#00f2fe',
              cursor: 'pointer',
              textDecoration: 'underline',
              fontSize: '12px',
              fontFamily: 'inherit'
            }}
          >
            वापस मानचित्र देखें (Back to Map)
          </button>
        </div>
      </div>
    </div>
  );
}
