import React from 'react';

/**
 * FeedbackToast - Compact Correct-Answer Feedback Card
 * Positioned immediately below the question card, aligned with the card's width.
 * Displays green circular checkmark + "सही जवाब!" (Hindi) + "Great!" (English)
 * Surrounded by subtle celebration golden star & sparkle particles.
 */
export default function FeedbackToast({ isVisible = false }) {
  if (!isVisible) return null;

  return (
    <div
      className="correct-feedback-card feedback-toast-widget"
      role="status"
      aria-live="polite"
    >
      {/* Celebration Star Particles around card */}
      <div className="feedback-stars-container" aria-hidden="true">
        {/* Star 1: Top-Left */}
        <span className="feedback-star star-tl">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="#F59E0B">
            <path d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6Z" />
          </svg>
        </span>
        {/* Star 2: Top-Right */}
        <span className="feedback-star star-tr">
          <svg viewBox="0 0 24 24" width="17" height="17" fill="#FDE68A">
            <path d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6Z" />
          </svg>
        </span>
        {/* Star 3: Mid-Left */}
        <span className="feedback-star star-ml">
          <svg viewBox="0 0 20 20" width="13" height="13" fill="#D4AF37">
            <polygon points="10,2 12,8 18,10 12,12 10,18 8,12 2,10 8,8" />
          </svg>
        </span>
        {/* Star 4: Mid-Right */}
        <span className="feedback-star star-mr">
          <svg viewBox="0 0 24 24" width="19" height="19" fill="#F59E0B">
            <path d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6Z" />
          </svg>
        </span>
        {/* Star 5: Bottom-Left */}
        <span className="feedback-star star-bl">
          <svg viewBox="0 0 20 20" width="14" height="14" fill="#FDE68A">
            <polygon points="10,2 12,8 18,10 12,12 10,18 8,12 2,10 8,8" />
          </svg>
        </span>
        {/* Star 6: Bottom-Right */}
        <span className="feedback-star star-br">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="#D4AF37">
            <path d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6Z" />
          </svg>
        </span>
      </div>

      {/* Green Circular Checkmark Icon */}
      <div className="feedback-icon-wrap" aria-hidden="true">
        <svg viewBox="0 0 40 40" width="40" height="40" fill="none">
          <circle cx="20" cy="20" r="19" fill="#15803D" stroke="#86EFAC" strokeWidth="2" />
          <path
            d="M 12 20.5 L 17.5 26 L 28.5 15"
            stroke="#FFFFFF"
            strokeWidth="3.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {/* Bilingual Congratulatory Text */}
      <div className="feedback-text-stack">
        <h3 className="feedback-title-hi">सही जवाब!</h3>
        <p className="feedback-subtitle-en">Great!</p>
      </div>
    </div>
  );
}
