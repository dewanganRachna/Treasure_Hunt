import React from 'react';
import ChestIllustration from './ChestIllustration';

/**
 * WelcomeScreen - Matches Storyboard Panel 1
 * Ivory/golden-hour sky with faint layered hills, temple spires on the left,
 * cascading waterfall mist on the right, corner leaves, CHiPS logo at top-left,
 * centered ornate title, ChestIllustration, and START GAME button.
 */
export default function WelcomeScreen({ onStartGame = () => {} }) {
  return (
    <div className="welcome-screen-stage">
      {/* 1. Background Scenic Layers (Layered hills, temple spires, waterfall gorge, ivory sunrise) */}
      <div className="welcome-scenic-bg">
        {/* Soft morning sun radial glow */}
        <div className="welcome-sun-glow" />

        {/* Scenic Landscape SVG: distant hills, temples, waterfall */}
        <svg
          viewBox="0 0 1920 1080"
          className="welcome-hills-svg"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="skyMornGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FBF6E9" />
              <stop offset="60%" stopColor="#F3EAD3" />
              <stop offset="100%" stopColor="#E2D6BC" />
            </linearGradient>

            <linearGradient id="farHillGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#D2E3D6" stopOpacity="0.75" />
              <stop offset="100%" stopColor="#AFC9B6" stopOpacity="0.85" />
            </linearGradient>

            <linearGradient id="midHillGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#9EBEA7" />
              <stop offset="100%" stopColor="#769C81" />
            </linearGradient>

            <linearGradient id="foreHillGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#5B8766" />
              <stop offset="100%" stopColor="#315B3C" />
            </linearGradient>

            <linearGradient id="waterfallStream" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#E0F2FE" />
              <stop offset="40%" stopColor="#7DD3FC" />
              <stop offset="100%" stopColor="#38BDF8" />
            </linearGradient>
          </defs>

          {/* Far Distant Mountain Range */}
          <path
            d="M 0 520 Q 240 430 480 490 T 960 460 T 1440 480 T 1920 450 L 1920 1080 L 0 1080 Z"
            fill="url(#farHillGrad)"
            opacity="0.65"
          />

          {/* Left Silhouetted Ancient Heritage Temples (Sirpur / Bhoramdeo style) */}
          <g id="welcome-temple-silhouettes" opacity="0.45">
            {/* Far Small Temple Spire 1 */}
            <polygon points="170,480 185,410 200,480" fill="#769C81" />
            <rect x="175" y="480" width="20" height="30" fill="#769C81" />
            <circle cx="185" cy="405" r="3" fill="#C9A24A" />

            {/* Main Ancient Temple Shikhara Tower */}
            <polygon points="230,510 265,360 300,510" fill="#5B8766" />
            <polygon points="245,450 265,360 285,450" fill="#4B7756" />
            {/* Kalasha Golden Finial */}
            <circle cx="265" cy="354" r="4.5" fill="#F3D98B" stroke="#C9A24A" strokeWidth="1" />
            {/* Tiered Temple Ridges */}
            <line x1="242" y1="470" x2="288" y2="470" stroke="#7BA887" strokeWidth="2.5" />
            <line x1="248" y1="430" x2="282" y2="430" stroke="#7BA887" strokeWidth="2" />
            <line x1="254" y1="395" x2="276" y2="395" stroke="#7BA887" strokeWidth="1.5" />
            {/* Mandapa Hall Base */}
            <rect x="215" y="500" width="100" height="45" rx="3" fill="#5B8766" />
            <rect x="250" y="515" width="30" height="30" rx="2" fill="#315B3C" />

            {/* Secondary Small Temple Spire 3 */}
            <polygon points="320,520 340,430 360,520" fill="#5B8766" />
            <circle cx="340" cy="425" r="3" fill="#F3D98B" />
          </g>

          {/* Right Cascading Waterfall Gorge (Chitrakote style) */}
          <g id="welcome-waterfall-scenery" opacity="0.55">
            {/* Rocky Gorge Cliff on Right */}
            <path
              d="M 1600 480 Q 1660 500 1720 490 L 1920 540 L 1920 850 L 1600 850 Z"
              fill="#527D5E"
            />
            {/* Cascading Water Curtain */}
            <path
              d="M 1660 495 L 1650 680 L 1710 680 L 1700 495 Z"
              fill="url(#waterfallStream)"
              opacity="0.85"
            />
            <path
              d="M 1675 500 L 1670 670 M 1685 500 L 1682 670 M 1695 500 L 1695 660"
              stroke="#FFFFFF"
              strokeWidth="2"
              strokeDasharray="12 6"
              opacity="0.9"
            />
            {/* Secondary Lower Cascade */}
            <path
              d="M 1640 680 L 1625 780 L 1730 780 L 1715 680 Z"
              fill="url(#waterfallStream)"
              opacity="0.75"
            />
            {/* Foaming Water Spray / Mist at Base */}
            <ellipse cx="1675" cy="780" rx="70" ry="22" fill="#E0F2FE" opacity="0.8" />
            <ellipse cx="1675" cy="775" rx="50" ry="15" fill="#FFFFFF" opacity="0.9" />
          </g>

          {/* Mid Range Rolling Green Hills */}
          <path
            d="M 0 620 Q 360 560 760 630 T 1480 600 T 1920 650 L 1920 1080 L 0 1080 Z"
            fill="url(#midHillGrad)"
            opacity="0.75"
          />

          {/* Near Rolling Forest Ridge & Valley */}
          <path
            d="M 0 740 Q 480 680 960 750 T 1920 720 L 1920 1080 L 0 1080 Z"
            fill="url(#foreHillGrad)"
            opacity="0.45"
          />

          {/* River Stream Winding Through Valley Center */}
          <path
            d="M 880 750 Q 940 820 920 900 T 1000 1080 L 910 1080 Q 840 920 830 830 Z"
            fill="#7DD3FC"
            opacity="0.35"
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
