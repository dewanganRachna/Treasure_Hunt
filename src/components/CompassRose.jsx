import React from 'react';

/**
 * Ornate Compass Rose for Panel 2 / Map Overview
 * Positioned at bottom-right of the adventure map
 */
export default function CompassRose({ className = '' }) {
  return (
    <div className={`compass-rose-widget ${className}`}>
      <svg
        viewBox="0 0 160 160"
        width="140"
        height="140"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="compassGold" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#FDE68A" />
            <stop offset="50%" stopColor="#D4AF37" />
            <stop offset="100%" stopColor="#9C7821" />
          </linearGradient>

          <linearGradient id="compassSilver" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#F1F5F9" />
            <stop offset="100%" stopColor="#94A3B8" />
          </linearGradient>
        </defs>

        {/* Outer Ring */}
        <circle cx="80" cy="80" r="70" fill="none" stroke="#C9A24A" stroke-width="1.8" opacity="0.7" />
        <circle cx="80" cy="80" r="66" fill="none" stroke="#C9A24A" stroke-width="1" stroke-dasharray="2 4" opacity="0.6" />
        <circle cx="80" cy="80" r="58" fill="none" stroke="#8C6E2E" stroke-width="0.8" opacity="0.4" />

        {/* 4 Secondary Diagonal Points */}
        <g opacity="0.65">
          {/* NE */}
          <polygon points="80,80 77,80 115,45" fill="url(#compassSilver)" />
          <polygon points="80,80 80,77 115,45" fill="#64748B" />
          {/* SE */}
          <polygon points="80,80 80,83 115,115" fill="url(#compassSilver)" />
          <polygon points="80,80 77,80 115,115" fill="#64748B" />
          {/* SW */}
          <polygon points="80,80 83,80 45,115" fill="url(#compassSilver)" />
          <polygon points="80,80 80,83 45,115" fill="#64748B" />
          {/* NW */}
          <polygon points="80,80 80,77 45,45" fill="url(#compassSilver)" />
          <polygon points="80,80 83,80 45,45" fill="#64748B" />
        </g>

        {/* 4 Primary Cardinal Points */}
        {/* North Pointer (Bright Gold & Red Accent) */}
        <polygon points="80,80 74,80 80,18" fill="url(#compassGold)" stroke="#B4821E" stroke-width="0.8" />
        <polygon points="80,80 86,80 80,18" fill="#9C6F12" stroke="#B4821E" stroke-width="0.8" />
        
        {/* South Pointer */}
        <polygon points="80,80 74,80 80,142" fill="#64748B" stroke="#475569" stroke-width="0.8" />
        <polygon points="80,80 86,80 80,142" fill="url(#compassSilver)" stroke="#475569" stroke-width="0.8" />

        {/* East Pointer */}
        <polygon points="80,80 80,74 142,80" fill="url(#compassSilver)" stroke="#475569" stroke-width="0.8" />
        <polygon points="80,80 80,86 142,80" fill="#64748B" stroke="#475569" stroke-width="0.8" />

        {/* West Pointer */}
        <polygon points="80,80 80,86 18,80" fill="url(#compassSilver)" stroke="#475569" stroke-width="0.8" />
        <polygon points="80,80 80,74 18,80" fill="#64748B" stroke="#475569" stroke-width="0.8" />

        {/* Center Hub */}
        <circle cx="80" cy="80" r="9" fill="#14452F" stroke="#C9A24A" stroke-width="2" />
        <circle cx="80" cy="80" r="4" fill="#FDE68A" />

        {/* Cardinal Labels (N, E, S, W) */}
        <text x="80" y="14" textAnchor="middle" fontFamily="'Cinzel', serif" fontWeight="900" fontSize="16" fill="#14452F">N</text>
        <text x="152" y="85" textAnchor="middle" fontFamily="'Cinzel', serif" fontWeight="700" fontSize="12" fill="#78716C">E</text>
        <text x="80" y="156" textAnchor="middle" fontFamily="'Cinzel', serif" fontWeight="700" fontSize="12" fill="#78716C">S</text>
        <text x="9" y="85" textAnchor="middle" fontFamily="'Cinzel', serif" fontWeight="700" fontSize="12" fill="#78716C">W</text>
      </svg>
    </div>
  );
}
