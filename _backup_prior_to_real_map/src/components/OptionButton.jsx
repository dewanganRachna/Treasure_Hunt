import React from 'react';

/**
 * OptionButton component for Question Panel
 * Rows A-D with dark-green letter circle on left, English text on top, Hindi beneath.
 * States:
 * - default: cream fill, light border
 * - hover/press: gold border
 * - correct: solid emerald green fill with white text
 * - wrong: solid red fill with white text
 */
export default function OptionButton({
  letter = 'A',
  enText = '',
  hiText = '',
  index = 0,
  isSelected = false,
  isCorrect = false,
  isLocked = false,
  onSelect = () => {}
}) {
  let stateClass = 'option-default';
  if (isSelected) {
    stateClass = isCorrect ? 'option-correct' : 'option-wrong';
  }

  const handleClick = () => {
    if (isLocked) return;
    onSelect(index);
  };

  return (
    <button
      type="button"
      className={`question-option-btn ${stateClass}`}
      onClick={handleClick}
      disabled={isLocked && !isSelected}
      aria-label={`Option ${letter}: ${enText} (${hiText})`}
      tabIndex={0}
    >
      {/* Left Circle with Letter (A, B, C, D) */}
      <div className="option-letter-badge">
        <span>{letter}</span>
      </div>

      {/* Two-Line Bilingual Option Text Stack */}
      <div className="option-text-stack">
        <span className="option-text-en">{enText}</span>
        <span className="option-text-hi">{hiText}</span>
      </div>
    </button>
  );
}

