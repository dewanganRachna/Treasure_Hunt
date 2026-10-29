import React from 'react';

/**
 * Ornate Compass Rose for Panel 2 / Map Overview
 * Pure SVG group component, centered at (0, 0) with radius ~70px.
 */
export default function CompassRose({ className = '' }) {
  return (
    <g className={`compass-rose-widget ${className}`}>
      <defs>
        <linearGradient id="compassGoldGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FFF2B2" />
          <stop offset="40%" stopColor="#F5C443" />
          <stop offset="70%" stopColor="#C9941A" />
          <stop offset="100%" stopColor="#8C630D" />
        </linearGradient>

        <linearGradient id="compassSilverGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#F8FAFC" />
          <stop offset="100%" stopColor="#94A3B8" />
        </linearGradient>
      </defs>

      {/* Drop Shadow underneath Compass */}
      <circle cx="0" cy="4" r="68" fill="#0A1E12" opacity="0.25" />

      {/* Compass Disc Background */}
      <circle cx="0" cy="0" r="68" fill="#FBF6E9" fillOpacity="0.85" stroke="#C9A24A" strokeWidth="1.8" />
      <circle cx="0" cy="0" r="64" fill="none" stroke="#C9A24A" strokeWidth="1" strokeDasharray="3 4" opacity="0.7" />
      <circle cx="0" cy="0" r="56" fill="none" stroke="#8C6E2E" strokeWidth="0.8" opacity="0.4" />

      {/* 4 Secondary Diagonal Points (NE, SE, SW, NW) */}
      <g opacity="0.65">
        {/* NE */}
        <polygon points="0,0 -3,0 35,-35" fill="url(#compassSilverGrad)" />
        <polygon points="0,0 0,-3 35,-35" fill="#64748B" />
        {/* SE */}
        <polygon points="0,0 0,3 35,35" fill="url(#compassSilverGrad)" />
        <polygon points="0,0 -3,0 35,35" fill="#64748B" />
        {/* SW */}
        <polygon points="0,0 3,0 -35,35" fill="url(#compassSilverGrad)" />
        <polygon points="0,0 0,3 -35,35" fill="#64748B" />
        {/* NW */}
        <polygon points="0,0 0,-3 -35,-35" fill="url(#compassSilverGrad)" />
        <polygon points="0,0 3,0 -35,-35" fill="#64748B" />
      </g>

      {/* 4 Primary Cardinal Points */}
      {/* North Pointer (Large Bright Gold with Red/Gold Trim) */}
      <polygon points="0,0 -6,0 0,-62" fill="url(#compassGoldGrad)" stroke="#B4821E" strokeWidth="0.8" />
      <polygon points="0,0 6,0 0,-62" fill="#9C6F12" stroke="#B4821E" strokeWidth="0.8" />

      {/* South Pointer */}
      <polygon points="0,0 -6,0 0,62" fill="#64748B" stroke="#475569" strokeWidth="0.8" />
      <polygon points="0,0 6,0 0,62" fill="url(#compassSilverGrad)" stroke="#475569" strokeWidth="0.8" />

      {/* East Pointer */}
      <polygon points="0,0 0,-6 62,0" fill="url(#compassSilverGrad)" stroke="#475569" strokeWidth="0.8" />
      <polygon points="0,0 0,6 62,0" fill="#64748B" stroke="#475569" strokeWidth="0.8" />

      {/* West Pointer */}
      <polygon points="0,0 0,6 -62,0" fill="url(#compassSilverGrad)" stroke="#475569" strokeWidth="0.8" />
      <polygon points="0,0 0,-6 -62,0" fill="#64748B" stroke="#475569" strokeWidth="0.8" />

      {/* Center Ornate Hub */}
      <circle cx="0" cy="0" r="9" fill="#14452F" stroke="#C9A24A" strokeWidth="2" />
      <circle cx="0" cy="0" r="4.5" fill="#FDE68A" />

      {/* Cardinal Labels (N, E, S, W) */}
      <text x="0" y="-68" textAnchor="middle" fontFamily="'Cinzel', Georgia, serif" fontWeight="900" fontSize="16" fill="#14452F">N</text>
      <text x="72" y="5" textAnchor="middle" fontFamily="'Cinzel', Georgia, serif" fontWeight="700" fontSize="12" fill="#5A4E3D">E</text>
      <text x="0" y="77" textAnchor="middle" fontFamily="'Cinzel', Georgia, serif" fontWeight="700" fontSize="12" fill="#5A4E3D">S</text>
      <text x="-72" y="5" textAnchor="middle" fontFamily="'Cinzel', Georgia, serif" fontWeight="700" fontSize="12" fill="#5A4E3D">W</text>
    </g>
  );
}
