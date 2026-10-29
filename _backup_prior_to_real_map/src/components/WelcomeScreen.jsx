import React from 'react';
import ChestIllustration from './ChestIllustration';

/**
 * WelcomeScreen - Matches Panel 1
 * Ivory/golden-hour sky with faint layered hills, corner leaves,
 * CHiPS logo at top-left, centered ornate title, ChestIllustration,
 * and START GAME button.
 */
export default function WelcomeScreen({ onStartGame = () => {} }) {
  return (
    <div className="welcome-screen-stage">
      {/* 1. Background Scenic Layers (Faint layered hills and ivory sunrise) */}
      <div className="welcome-scenic-bg">
        {/* Soft morning sun radial glow */}
        <div className="welcome-sun-glow" />

        {/* Distant rolling hill SVG silhouettes */}
        <svg
          viewBox="0 0 1920 1080"
          className="welcome-hills-svg"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Far Mountains */}
          <path
            d="M 0 680 Q 320 540 680 620 T 1380 580 T 1920 640 L 1920 1080 L 0 1080 Z"
            fill="#D5E3D8"
            opacity="0.55"
          />
          {/* Mid Range Hills */}
          <path
            d="M 0 740 Q 420 650 880 720 T 1640 680 T 1920 730 L 1920 1080 L 0 1080 Z"
            fill="#B9D3BF"
            opacity="0.65"
          />
          {/* Near Gentle Green Slopes */}
          <path
            d="M 0 820 Q 520 760 1040 820 T 1920 790 L 1920 1080 L 0 1080 Z"
            fill="#8FB59A"
            opacity="0.4"
          />
        </svg>

        {/* Corner Botanical Foliage (Sal/Teak leaves framing corners) */}
        <div className="corner-foliage foliage-bottom-left" />
        <div className="corner-foliage foliage-bottom-right" />
      </div>

      {/* 2. Top-Left: CHiPS Logo */}
      <div className="welcome-top-bar">
        <img
          src="/assets/chips-logo.svg"
          alt="CHiPS - Chhattisgarh Infotech Promotion Society"
          className="welcome-chips-logo"
        />
      </div>

      {/* 3. Centered Title Stack */}
      <div className="welcome-center-content">
        {/* Ornate Top Filigree Divider */}
        <div className="title-filigree-divider">
          <svg viewBox="0 0 240 24" width="220" height="22" fill="none">
            <path
              d="M 10 12 L 80 12 M 160 12 L 230 12"
              stroke="#C9A24A"
              strokeWidth="1.5"
            />
            <polygon points="120,4 126,12 120,20 114,12" fill="#C9A24A" />
            <circle cx="95" cy="12" r="3" fill="#14452F" stroke="#C9A24A" strokeWidth="1" />
            <circle cx="145" cy="12" r="3" fill="#14452F" stroke="#C9A24A" strokeWidth="1" />
            <path d="M 102 7 Q 120 2 138 7" stroke="#C9A24A" strokeWidth="1.2" fill="none" />
          </svg>
        </div>

        {/* Main Title: CHHATTISGARH DIGITAL EXPLORER */}
        <h1 className="welcome-main-title">
          <span className="title-word-state">CHHATTISGARH</span>
          <span className="title-word-explorer">DIGITAL EXPLORER</span>
        </h1>

        {/* Subtitle: A DIGITAL TREASURE HUNT */}
        <p className="welcome-subtitle">A DIGITAL TREASURE HUNT</p>

        {/* Ornate Bottom Diamond Ornament */}
        <div className="title-bottom-ornament">
          <svg viewBox="0 0 100 16" width="90" height="14" fill="none">
            <line x1="5" y1="8" x2="38" y2="8" stroke="#C9A24A" strokeWidth="1.2" />
            <line x1="62" y1="8" x2="95" y2="8" stroke="#C9A24A" strokeWidth="1.2" />
            <polygon points="50,2 56,8 50,14 44,8" fill="#14452F" stroke="#C9A24A" strokeWidth="1.2" />
          </svg>
        </div>

        {/* 4. Open Glowing Treasure Chest Illustration */}
        <div className="welcome-chest-wrap">
          <ChestIllustration />
        </div>

        {/* 5. Wide Dark-Green Gold-Trimmed START GAME Button */}
        <div className="welcome-action-wrap">
          <button
            type="button"
            className="welcome-start-btn"
            onClick={onStartGame}
            aria-label="Start Game - Begin the Digital Treasure Hunt"
            autoFocus
          >
            <span>START GAME</span>
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" className="start-btn-chevron">
              <path
                d="M 9 6 L 15 12 L 9 18"
                stroke="currentColor"
                strokeWidth="2.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
