import React, { useEffect } from 'react';
import OptionButton from './OptionButton';
import FeedbackToast from './FeedbackToast';

const OPTION_LETTERS = ['A', 'B', 'C', 'D'];

/**
 * QuestionPanel component - Matches Panel 3 & 6
 * Positioned on the RIGHT (~38% width, vertically centered).
 * Cream with gold border, ornate corner flourishes.
 * Bilingual question + 4 bilingual options with immediate validation.
 */
export default function QuestionPanel({
  levelIndex = 0,
  questionData = null,
  selectedOption = null,
  isLocked = false,
  onSelectOption = () => {},
  isExiting = false,
  showFeedback = false
}) {
  // Keyboard navigation: A-D or 1-4 keys to select option
  useEffect(() => {
    if (!questionData) return;
    const handleKeyDown = (e) => {
      if (isLocked) return;
      const key = e.key.toUpperCase();
      let chosenIndex = -1;

      if (key === 'A' || key === '1') chosenIndex = 0;
      else if (key === 'B' || key === '2') chosenIndex = 1;
      else if (key === 'C' || key === '3') chosenIndex = 2;
      else if (key === 'D' || key === '4') chosenIndex = 3;

      if (chosenIndex >= 0 && chosenIndex < questionData.options.length) {
        onSelectOption(chosenIndex);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLocked, questionData, onSelectOption]);

  if (!questionData) return null;

  const currentLevelNum = levelIndex + 1;
  const paddedLevelStr = currentLevelNum < 10 ? `0${currentLevelNum}` : `${currentLevelNum}`;


  return (
    <aside
      className={`question-panel-card ${isExiting ? 'panel-exit-slide' : 'panel-enter-slide'}`}
      role="region"
      aria-labelledby="question-level-header"
    >
      {/* Ornate Corner Flourishes */}
      <div className="corner-flourish corner-tl" />
      <div className="corner-flourish corner-tr" />
      <div className="corner-flourish corner-bl" />
      <div className="corner-flourish corner-br" />

      {/* 1. Header Pill: Dark-Green with Map Pin Icon */}
      <div className="question-header-pill" id="question-level-header">
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" className="header-pin-icon">
          <path
            d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"
            fill="#F3D98B"
          />
          <circle cx="12" cy="9" r="2.5" fill="#14452F" />
        </svg>
        <span className="level-pill-text">LEVEL {paddedLevelStr}/10</span>
      </div>

      {/* 2. Bilingual Question Stack */}
      <div className="question-title-stack">
        <h2 className="question-title-en">
          <span className="question-prefix">Q{currentLevelNum}.</span> {questionData.en}
        </h2>
        <p className="question-title-hi">
          <span className="question-prefix-hi">प्र.{currentLevelNum}.</span> {questionData.hi}
        </p>
      </div>

      {/* 3. Four Option Rows (A - D) */}
      <div className="question-options-list" role="group" aria-label="Answer options">
        {questionData.options.map((opt, idx) => {
          const letter = OPTION_LETTERS[idx] || `${idx + 1}`;
          const isSelected = selectedOption === idx;
          const isCorrect = idx === questionData.correctIndex;

          return (
            <OptionButton
              key={`option-${idx}`}
              letter={letter}
              enText={opt.en}
              hiText={opt.hi}
              index={idx}
              isSelected={isSelected}
              isCorrect={isCorrect}
              isLocked={isLocked}
              onSelect={onSelectOption}
            />
          );
        })}
      </div>

      {/* 4. Correct-Answer Feedback Card immediately below question card */}
      {showFeedback && <FeedbackToast isVisible={true} />}
    </aside>
  );
}
