import React from 'react';

/**
 * Small Feedback Toast - Matches Panel 4
 * Floating at top-left (~280x90), cream parchment, gold border.
 * Green checkmark + "सही जवाब!" / "Great!" + subtle sparkle particles.
 * NOT a modal; auto-dismisses without requiring a Continue button.
 */
export default function FeedbackToast({ isVisible = false }) {
  if (!isVisible) return null;

  return (
    <div
      className="feedback-toast-widget toast-slide-down"
      role="status"
      aria-live="polite"
    >
      {/* Green Circular Checkmark Icon */}
      <div className="toast-icon-wrap">
        <svg viewBox="0 0 36 36" width="36" height="36" fill="none">
          <circle cx="18" cy="18" r="17" fill="#15803D" stroke="#86EFAC" strokeWidth="2" />
          <path
            d="M 11 18 L 16 23 L 26 13"
            stroke="#FFFFFF"
            strokeWidth="3.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {/* Bilingual Congratulatory Text */}
      <div className="toast-text-stack">
        <h3 className="toast-title-hi">सही जवाब!</h3>
        <p className="toast-subtitle-en">Great!</p>
      </div>

      {/* Subtle Gold Sparkle Bursts */}
      <div className="toast-sparkle sparkle-1" />
      <div className="toast-sparkle sparkle-2" />
      <div className="toast-sparkle sparkle-3" />
    </div>
  );
}

