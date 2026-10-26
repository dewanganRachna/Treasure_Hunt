import React from 'react';

/**
 * Custom SVG Treasure Chest with 3 states:
 * - 'locked': Metallic titanium chest with glowing cyan lock and locked padlock
 * - 'active': Vibrant golden chest with pulsating aura, floating glow, and unlocked keyhole
 * - 'unlocked': Wide-open golden chest with overflowing digital gems, light beams, and checkmark
 */
export default function TreasureChestIcon({ state = 'locked', size = 52, className = '' }) {
  if (state === 'unlocked') {
    return (
      <div
        className={`treasure-icon-wrapper unlocked ${className}`}
        style={{ width: size, height: size, position: 'relative' }}
      >
        <svg viewBox="0 0 100 100" width={size} height={size} className="chest-svg">
          <defs>
            <radialGradient id="goldGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ffea79" stopOpacity="0.9" />
              <stop offset="50%" stopColor="#f59e0b" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#b45309" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fff3a8" />
              <stop offset="50%" stopColor="#fbbf24" />
              <stop offset="100%" stopColor="#d97706" />
            </linearGradient>
            <linearGradient id="chestInterior" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#78350f" />
              <stop offset="100%" stopColor="#451a03" />
            </linearGradient>
            <filter id="glowFilter" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Background Aura */}
          <circle cx="50" cy="50" r="46" fill="url(#goldGlow)" className="chest-aura" />

          {/* Light Beams Radiating */}
          <polygon points="50,45 30,10 40,10" fill="rgba(255, 234, 121, 0.45)" />
          <polygon points="50,45 45,6 55,6" fill="rgba(255, 255, 255, 0.7)" />
          <polygon points="50,45 60,10 70,10" fill="rgba(255, 234, 121, 0.45)" />

          {/* Chest Interior (visible because lid is open) */}
          <rect x="22" y="44" width="56" height="38" rx="6" fill="url(#chestInterior)" stroke="#fbbf24" strokeWidth="2" />

          {/* Overflowing gems / digital crystals */}
          <circle cx="36" cy="48" r="5" fill="#00f2fe" filter="url(#glowFilter)" />
          <polygon points="50,38 56,48 44,48" fill="#ffd700" filter="url(#glowFilter)" />
          <circle cx="64" cy="47" r="5" fill="#4facfe" />
          <circle cx="43" cy="52" r="4" fill="#fbbf24" />
          <circle cx="57" cy="52" r="4.5" fill="#38ef7d" />

          {/* Chest Base Lower Front */}
          <path
            d="M 20 54 L 80 54 L 77 82 A 5 5 0 0 1 72 86 L 28 86 A 5 5 0 0 1 23 82 Z"
            fill="url(#goldGrad)"
            stroke="#b45309"
            strokeWidth="2"
          />

          {/* Chest Front Straps / Hardware */}
          <rect x="32" y="54" width="6" height="32" fill="#92400e" stroke="#fbbf24" strokeWidth="1" />
          <rect x="62" y="54" width="6" height="32" fill="#92400e" stroke="#fbbf24" strokeWidth="1" />

          {/* Open Chest Lid (tilted back) */}
          <path
            d="M 16 32 Q 50 16 84 32 L 80 44 Q 50 30 20 44 Z"
            fill="url(#goldGrad)"
            stroke="#fbbf24"
            strokeWidth="2"
          />
          {/* Lid Straps */}
          <path d="M 32 30 L 32 40" stroke="#92400e" strokeWidth="4" />
          <path d="M 62 30 L 62 40" stroke="#92400e" strokeWidth="4" />

          {/* Green Unlocked Checkmark Badge */}
          <circle cx="82" cy="22" r="14" fill="#10b981" stroke="#ffffff" strokeWidth="2" filter="url(#glowFilter)" />
          <path d="M 77 22 L 81 26 L 88 18" fill="none" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    );
  }

  if (state === 'active') {
    return (
      <div
        className={`treasure-icon-wrapper active ${className}`}
        style={{ width: size, height: size, position: 'relative' }}
      >
        <svg viewBox="0 0 100 100" width={size} height={size} className="chest-svg active-chest-icon">
          <defs>
            <radialGradient id="activeCyanGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#00f2fe" stopOpacity="0.8" />
              <stop offset="60%" stopColor="#00c6ff" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#0072ff" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="activeChestGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fffbeb" />
              <stop offset="30%" stopColor="#fcd34d" />
              <stop offset="70%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#d97706" />
            </linearGradient>
            <filter id="activeGlow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="3.5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Pulsing Cyan Hologram Halo */}
          <circle cx="50" cy="50" r="46" fill="url(#activeCyanGlow)" />
          <circle cx="50" cy="50" r="42" fill="none" stroke="#00f2fe" strokeWidth="2" strokeDasharray="6 4" className="halo-spin" />

          {/* Chest Body */}
          <path
            d="M 22 46 L 78 46 L 75 78 A 6 6 0 0 1 69 84 L 31 84 A 6 6 0 0 1 25 78 Z"
            fill="url(#activeChestGrad)"
            stroke="#92400e"
            strokeWidth="2.5"
          />

          {/* Lid (closed, shimmering) */}
          <path
            d="M 20 46 C 20 32 32 24 50 24 C 68 24 80 32 80 46 Z"
            fill="url(#activeChestGrad)"
            stroke="#fbbf24"
            strokeWidth="2.5"
          />

          {/* Metal Straps */}
          <path d="M 34 26 L 34 84" stroke="#92400e" strokeWidth="5" />
          <path d="M 34 26 L 34 84" stroke="#fef08a" strokeWidth="1.5" />
          <path d="M 66 26 L 66 84" stroke="#92400e" strokeWidth="5" />
          <path d="M 66 26 L 66 84" stroke="#fef08a" strokeWidth="1.5" />

          {/* Central Glowing Lock / Power Core */}
          <rect x="43" y="44" width="14" height="18" rx="3" fill="#0369a1" stroke="#00f2fe" strokeWidth="2" />
          <circle cx="50" cy="51" r="3" fill="#00f2fe" filter="url(#activeGlow)" />
          <path d="M 50 54 L 50 58" stroke="#00f2fe" strokeWidth="2" strokeLinecap="round" />

          {/* Pulsing beacon star */}
          <circle cx="82" cy="22" r="12" fill="#00f2fe" stroke="#ffffff" strokeWidth="2" filter="url(#activeGlow)" />
          <text x="82" y="27" textAnchor="middle" fill="#050b1a" fontSize="13" fontWeight="900" fontFamily="sans-serif">!</text>
        </svg>
      </div>
    );
  }

  // Locked State (metallic, tech-locked)
  return (
    <div
      className={`treasure-icon-wrapper locked ${className}`}
      style={{ width: size, height: size, position: 'relative', opacity: 0.8 }}
    >
      <svg viewBox="0 0 100 100" width={size} height={size} className="chest-svg">
        <defs>
          <linearGradient id="lockedChestGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#475569" />
            <stop offset="50%" stopColor="#334155" />
            <stop offset="100%" stopColor="#1e293b" />
          </linearGradient>
        </defs>

        {/* Muted Subdued Halo */}
        <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(0, 242, 254, 0.2)" strokeWidth="1.5" strokeDasharray="4 4" />

        {/* Chest Body */}
        <path
          d="M 24 48 L 76 48 L 73 78 A 5 5 0 0 1 68 83 L 32 83 A 5 5 0 0 1 27 78 Z"
          fill="url(#lockedChestGrad)"
          stroke="#0f172a"
          strokeWidth="2.5"
        />

        {/* Lid */}
        <path
          d="M 22 48 C 22 35 33 28 50 28 C 67 28 78 35 78 48 Z"
          fill="url(#lockedChestGrad)"
          stroke="#64748b"
          strokeWidth="2"
        />

        {/* Straps */}
        <path d="M 35 30 L 35 83" stroke="#0f172a" strokeWidth="4" />
        <path d="M 65 30 L 65 83" stroke="#0f172a" strokeWidth="4" />

        {/* Locked Padlock */}
        <rect x="44" y="52" width="12" height="14" rx="2" fill="#0f172a" stroke="#94a3b8" strokeWidth="1.5" />
        <path d="M 46 52 L 46 47 C 46 44 54 44 54 47 L 54 52" fill="none" stroke="#94a3b8" strokeWidth="2" />
        <circle cx="50" cy="58" r="1.5" fill="#94a3b8" />

        {/* Lock indicator */}
        <circle cx="82" cy="22" r="10" fill="#1e293b" stroke="#64748b" strokeWidth="1.5" />
        <path d="M 79 23 L 79 20 C 79 18 85 18 85 20 L 85 23" fill="none" stroke="#94a3b8" strokeWidth="1.5" />
        <rect x="78" y="22" width="8" height="7" rx="1" fill="#475569" stroke="#94a3b8" strokeWidth="1" />
      </svg>
    </div>
  );
}
