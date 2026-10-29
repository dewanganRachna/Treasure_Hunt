import React from 'react';

/**
 * Unnumbered Checkpoint Marker component
 * States:
 * - 'locked': Grey-brown round marker with padlock icon
 * - 'active': Gold glowing pin with pulsing concentric double rings and keyhole
 * - 'completed': Emerald green circle with crisp white checkmark
 * - 'failed': Crimson red circle with white X icon
 */
export default function Checkpoint({
  id,
  x,
  y,
  state = 'locked', // 'locked' | 'active' | 'completed' | 'failed'
  onClick = () => {}
}) {
  return (
    <g
      className={`checkpoint-node checkpoint-${state}`}
      transform={`translate(${x}, ${y})`}
      onClick={onClick}
      style={{ cursor: state === 'active' ? 'pointer' : 'default' }}
      role="button"
      aria-label={`Checkpoint ${id}: ${state}`}
    >
      {/* 1. ACTIVE STATE: Pulsing Concentric Rings & Golden Glowing Pin */}
      {state === 'active' && (
        <g className="active-marker-group">
          {/* Outer Pulsing Ripple Ring */}
          <circle cx="0" cy="0" r="42" className="pulse-ripple-outer" />
          {/* Inner Pulsing Ripple Ring */}
          <circle cx="0" cy="0" r="28" className="pulse-ripple-inner" />

          {/* Soft Ground Shadow */}
          <ellipse cx="0" cy="12" rx="20" ry="8" fill="#000000" opacity="0.3" filter="blur(3px)" />

          {/* Golden Radial Ground Glow Halo */}
          <circle cx="0" cy="0" r="32" fill="url(#activeGroundGlow)" />

          {/* Golden Pin Body (Raised 3D Pin with Keyhole/Lock Emblem) */}
          <g transform="translate(0, -6)">
            {/* Golden Base Medallion */}
            <circle cx="0" cy="0" r="20" fill="url(#goldPinGrad)" stroke="#FFE082" strokeWidth="2.5" filter="drop-shadow(0 4px 8px rgba(0,0,0,0.4))" />
            <circle cx="0" cy="0" r="16.5" fill="none" stroke="#D99B1A" strokeWidth="1.2" />

            {/* Inner Keyhole / Lock Icon */}
            <circle cx="0" cy="-2.5" r="4" fill="#2E1B0A" />
            <polygon points="-2.5,-1 2.5,-1 3.5,6 -3.5,6" fill="#2E1B0A" />
          </g>
        </g>
      )}

      {/* 2. LOCKED STATE: Round Grey-Brown Medallion with Padlock */}
      {state === 'locked' && (
        <g className="locked-marker-group">
          {/* Drop Shadow */}
          <ellipse cx="0" cy="8" rx="14" ry="6" fill="#000000" opacity="0.25" />

          {/* Bronze/Stone Rim & Disk */}
          <circle cx="0" cy="0" r="15" fill="#4B5563" stroke="#D1D5DB" strokeWidth="1.8" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.3))" />
          <circle cx="0" cy="0" r="12" fill="#374151" stroke="#1F2937" strokeWidth="1" />

          {/* Padlock Icon */}
          {/* Shackle */}
          <path d="M -4 -2 L -4 -6 C -4 -9, 4 -9, 4 -6 L 4 -2" fill="none" stroke="#E5E7EB" strokeWidth="1.8" strokeLinecap="round" />
          {/* Body */}
          <rect x="-6" y="-2" width="12" height="9" rx="1.5" fill="#D1D5DB" stroke="#9CA3AF" strokeWidth="0.8" />
          {/* Keyhole */}
          <circle cx="0" cy="2" r="1.2" fill="#374151" />
        </g>
      )}

      {/* 3. COMPLETED STATE: Emerald Green Circle with White Checkmark */}
      {state === 'completed' && (
        <g className="completed-marker-group">
          {/* Drop Shadow */}
          <ellipse cx="0" cy="8" rx="15" ry="6" fill="#000000" opacity="0.25" />

          {/* Green Badge */}
          <circle cx="0" cy="0" r="16" fill="#15803D" stroke="#86EFAC" strokeWidth="2.2" filter="drop-shadow(0 3px 6px rgba(0,0,0,0.35))" />
          <circle cx="0" cy="0" r="13" fill="#16A34A" />

          {/* Crisp White Checkmark */}
          <path
            d="M -5.5 0.5 L -2 4 L 5.5 -3.5"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="2.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
      )}

      {/* 4. FAILED STATE: Ruby Red Circle with White X */}
      {state === 'failed' && (
        <g className="failed-marker-group">
          {/* Drop Shadow & Crimson Glow */}
          <circle cx="0" cy="0" r="26" fill="rgba(220, 38, 38, 0.35)" filter="blur(4px)" className="pulse-ripple-red" />
          <ellipse cx="0" cy="8" rx="15" ry="6" fill="#000000" opacity="0.3" />

          {/* Red Badge */}
          <circle cx="0" cy="0" r="16" fill="#B91C1C" stroke="#FCA5A5" strokeWidth="2.2" filter="drop-shadow(0 3px 6px rgba(0,0,0,0.4))" />
          <circle cx="0" cy="0" r="13" fill="#DC2626" />

          {/* Crisp White X */}
          <path
            d="M -4.5 -4.5 L 4.5 4.5 M 4.5 -4.5 L -4.5 4.5"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="2.8"
            strokeLinecap="round"
          />
        </g>
      )}
    </g>
  );
}
