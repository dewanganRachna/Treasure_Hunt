import React from 'react';

/**
 * Large Golden Trophy Illustration for Panel 8 Victory Screen
 * Golden chalice with embossed star, two-sided laurel wreath, and red banner ribbon with 'बधाई हो!'
 */
export default function TrophyIcon({ className = '' }) {
  return (
    <div className={`trophy-illustration-container ${className}`}>
      <svg
        viewBox="0 0 460 360"
        width="360" height="280" className="trophy-svg"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="trophyGold" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#FFF4A3" />
            <stop offset="30%" stopColor="#F5C443" />
            <stop offset="60%" stopColor="#D99B1A" />
            <stop offset="85%" stopColor="#FDE68A" />
            <stop offset="100%" stopColor="#B47D14" />
          </linearGradient>

          <linearGradient id="trophyDarkGold" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#DFAC28" />
            <stop offset="50%" stopColor="#B37E17" />
            <stop offset="100%" stopColor="#8A5C0E" />
          </linearGradient>

          <linearGradient id="ribbonRed" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#E53935" />
            <stop offset="40%" stopColor="#C62828" />
            <stop offset="80%" stopColor="#B71C1C" />
            <stop offset="100%" stopColor="#7F0000" />
          </linearGradient>

          <linearGradient id="ribbonFold" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#8E0000" />
            <stop offset="100%" stopColor="#490000" />
          </linearGradient>

          <radialGradient id="trophyGlow" cx="50%" cy="40%" r="50%">
            <stop offset="0%" stopColor="#FFF9D2" stopOpacity="0.8" />
            <stop offset="40%" stopColor="#FCD34D" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#F59E0B" stopOpacity="0" />
          </radialGradient>

          <filter id="goldShine" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="glow" />
            <feMerge>
              <feMergeNode in="glow" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Ambient Golden Background Glow */}
        <circle cx="230" cy="150" r="140" fill="url(#trophyGlow)" />

        {/* 1. Golden Laurel Wreath (Both Sides) */}
        <g id="laurel-wreath">
          {/* Left Wreath Branch */}
          <g transform="translate(0, 0)">
            <path d="M 170 230 C 120 210, 85 160, 95 100 C 100 80, 110 65, 120 50" fill="none" stroke="#D99B1A" stroke-width="3" stroke-linecap="round" />
            
            {/* Left Leaves */}
            <path d="M 115 55 Q 100 45 92 60 Q 108 65 115 55" fill="url(#trophyGold)" stroke="#B37E17" stroke-width="1" />
            <path d="M 125 70 Q 105 70 100 88 Q 118 85 125 70" fill="url(#trophyGold)" stroke="#B37E17" stroke-width="1" />
            <path d="M 110 95 Q 85 100 88 120 Q 105 112 110 95" fill="url(#trophyGold)" stroke="#B37E17" stroke-width="1" />
            <path d="M 102 125 Q 78 135 85 155 Q 102 142 102 125" fill="url(#trophyGold)" stroke="#B37E17" stroke-width="1" />
            <path d="M 105 160 Q 85 175 96 195 Q 110 180 105 160" fill="url(#trophyGold)" stroke="#B37E17" stroke-width="1" />
            <path d="M 120 190 Q 105 210 120 226 Q 132 208 120 190" fill="url(#trophyGold)" stroke="#B37E17" stroke-width="1" />
            <path d="M 140 215 Q 130 235 150 246 Q 158 226 140 215" fill="url(#trophyGold)" stroke="#B37E17" stroke-width="1" />
          </g>

          {/* Right Wreath Branch */}
          <g transform="translate(460, 0) scale(-1, 1)">
            <path d="M 170 230 C 120 210, 85 160, 95 100 C 100 80, 110 65, 120 50" fill="none" stroke="#D99B1A" stroke-width="3" stroke-linecap="round" />
            
            {/* Right Leaves */}
            <path d="M 115 55 Q 100 45 92 60 Q 108 65 115 55" fill="url(#trophyGold)" stroke="#B37E17" stroke-width="1" />
            <path d="M 125 70 Q 105 70 100 88 Q 118 85 125 70" fill="url(#trophyGold)" stroke="#B37E17" stroke-width="1" />
            <path d="M 110 95 Q 85 100 88 120 Q 105 112 110 95" fill="url(#trophyGold)" stroke="#B37E17" stroke-width="1" />
            <path d="M 102 125 Q 78 135 85 155 Q 102 142 102 125" fill="url(#trophyGold)" stroke="#B37E17" stroke-width="1" />
            <path d="M 105 160 Q 85 175 96 195 Q 110 180 105 160" fill="url(#trophyGold)" stroke="#B37E17" stroke-width="1" />
            <path d="M 120 190 Q 105 210 120 226 Q 132 208 120 190" fill="url(#trophyGold)" stroke="#B37E17" stroke-width="1" />
            <path d="M 140 215 Q 130 235 150 246 Q 158 226 140 215" fill="url(#trophyGold)" stroke="#B37E17" stroke-width="1" />
          </g>
        </g>

        {/* 2. Trophy Handles (Sweeping Decorative Loops) */}
        <g id="trophy-handles">
          {/* Left Handle */}
          <path d="M 172 75 C 110 75, 105 155, 175 165" fill="none" stroke="url(#trophyGold)" stroke-width="12" stroke-linecap="round" />
          <path d="M 172 75 C 110 75, 105 155, 175 165" fill="none" stroke="url(#trophyDarkGold)" stroke-width="4" stroke-linecap="round" opacity="0.5" />
          
          {/* Right Handle */}
          <path d="M 288 75 C 350 75, 355 155, 285 165" fill="none" stroke="url(#trophyGold)" stroke-width="12" stroke-linecap="round" />
          <path d="M 288 75 C 350 75, 355 155, 285 165" fill="none" stroke="url(#trophyDarkGold)" stroke-width="4" stroke-linecap="round" opacity="0.5" />
        </g>

        {/* 3. Trophy Cup & Pedestal */}
        <g id="trophy-body">
          {/* Pedestal Foot */}
          <ellipse cx="230" cy="275" rx="55" ry="12" fill="url(#trophyDarkGold)" />
          <path d="M 180 270 L 280 270 L 270 250 L 190 250 Z" fill="url(#trophyGold)" stroke="#B37E17" stroke-width="1.5" />
          <ellipse cx="230" cy="250" rx="40" ry="8" fill="#FFF4A3" />

          {/* Stem */}
          <path d="M 215 250 C 215 210, 218 200, 222 195 L 238 195 C 242 200, 245 210, 245 250 Z" fill="url(#trophyGold)" stroke="#B37E17" stroke-width="1" />
          {/* Stem Ring */}
          <ellipse cx="230" cy="225" rx="18" ry="5" fill="url(#trophyDarkGold)" />
          <ellipse cx="230" cy="223" rx="16" ry="4" fill="#FFE082" />

          {/* Main Chalice Cup */}
          <path d="M 165 65 C 165 140, 195 195, 230 195 C 265 195, 295 140, 295 65 Z" fill="url(#trophyGold)" stroke="#B37E17" stroke-width="2" />
          
          {/* Cup Rim Lip */}
          <ellipse cx="230" cy="65" rx="65" ry="14" fill="url(#trophyGold)" stroke="#B37E17" stroke-width="2" />
          <ellipse cx="230" cy="63" rx="58" ry="10" fill="#FFE082" opacity="0.7" />

          {/* Cup Interior Shadow */}
          <ellipse cx="230" cy="65" rx="55" ry="9" fill="#9C6F12" />

          {/* Specular Highlight Strip along Cup Side */}
          <path d="M 180 75 C 178 120, 195 160, 215 178" fill="none" stroke="#FFFFFF" stroke-width="4.5" stroke-linecap="round" opacity="0.65" />

          {/* Large Embossed Five-Pointed Star */}
          <g transform="translate(230, 115) scale(1.15)">
            <polygon
              points="0,-24 7,-7 24,-6 11,6 16,23 0,13 -16,23 -11,6 -24,-6 -7,-7"
              fill="url(#trophyGold)"
              stroke="#B37E17"
              stroke-width="1.8"
              filter="url(#goldShine)"
            />
            <polygon
              points="0,-20 5,-6 20,-5 9,5 13,19 0,11 -13,19 -9,5 -20,-5 -5,-6"
              fill="#FFF8E1"
              opacity="0.8"
            />
          </g>
        </g>

        {/* 4. Grand Red Ribbon Banner across Pedestal ('बधाई हो!') */}
        <g id="ribbon-banner" transform="translate(0, 10)">
          {/* Ribbon Shadow / Under-fold Left */}
          <polygon points="105,255 135,240 135,275 105,290 120,272" fill="url(#ribbonFold)" />
          {/* Ribbon Shadow / Under-fold Right */}
          <polygon points="355,255 325,240 325,275 355,290 340,272" fill="url(#ribbonFold)" />

          {/* Ribbon Tails (Left & Right Dovetail Notch) */}
          <path d="M 90 250 L 135 240 L 135 285 L 90 295 L 105 272 Z" fill="url(#ribbonRed)" stroke="#B71C1C" stroke-width="1" />
          <path d="M 370 250 L 325 240 L 325 285 L 370 295 L 355 272 Z" fill="url(#ribbonRed)" stroke="#B71C1C" stroke-width="1" />

          {/* Center Curving Ribbon Banner Front */}
          <path d="M 125 245 C 180 238, 280 238, 335 245 L 335 285 C 280 295, 180 295, 125 285 Z" fill="url(#ribbonRed)" stroke="#FFCDD2" stroke-width="1.5" filter="drop-shadow(0 4px 6px rgba(0,0,0,0.3))" />
          
          {/* Golden Border Edge on Ribbon */}
          <path d="M 126 248 C 180 241, 280 241, 334 248" fill="none" stroke="#FDE68A" stroke-width="1.8" />
          <path d="M 126 282 C 180 291, 280 291, 334 282" fill="none" stroke="#FDE68A" stroke-width="1.8" />

          {/* Ribbon Text: बधाई हो! */}
          <text
            x="230"
            y="272"
            textAnchor="middle"
            fontFamily="'Noto Sans Devanagari', 'Playfair Display', serif"
            fontWeight="900"
            fontSize="24"
            fill="#FFFFFF"
            stroke="#5C0000"
            strokeWidth="0.8"
            letterSpacing="2"
          >
            बधाई हो!
          </text>
        </g>

        {/* 5. Specular Star Sparkles */}
        <g id="trophy-sparkles">
          {/* Sparkle 1 at Top Left Rim */}
          <g transform="translate(165, 65)">
            <path d="M 0,-10 Q 0,0 10,0 Q 0,0 0,10 Q 0,0 -10,0 Q 0,0 0,-10" fill="#FFFFFF" filter="url(#goldShine)" />
          </g>
          {/* Sparkle 2 on Star Center */}
          <g transform="translate(230, 115)">
            <circle cx="0" cy="0" r="3" fill="#FFFFFF" filter="url(#goldShine)" />
          </g>
          {/* Sparkle 3 at Right Laurel */}
          <g transform="translate(345, 80)">
            <path d="M 0,-8 Q 0,0 8,0 Q 0,0 0,8 Q 0,0 -8,0 Q 0,0 0,-8" fill="#FFF9C4" />
          </g>
        </g>
      </svg>
    </div>
  );
}
