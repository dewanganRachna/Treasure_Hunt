import React from 'react';

/**
 * Rich SVG Open Treasure Chest Illustration
 * Warm golden glow, radiating light rays, sparkles, on an ornate stone pedestal
 */
export default function ChestIllustration({ className = '' }) {
  return (
    <div className={`chest-illustration-container ${className}`}>
      <svg
        viewBox="0 0 500 380"
        width="480" height="340" className="chest-svg"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Radiating Light Rays Gradient */}
          <radialGradient id="rayGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFF9D2" stopOpacity="0.9" />
            <stop offset="35%" stopColor="#FBD365" stopOpacity="0.5" />
            <stop offset="70%" stopColor="#E6A820" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#C9A24A" stopOpacity="0" />
          </radialGradient>

          {/* Intense Core Golden Light */}
          <radialGradient id="coreGlow" cx="50%" cy="45%" r="50%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="1" />
            <stop offset="25%" stopColor="#FFF59D" stopOpacity="0.95" />
            <stop offset="60%" stopColor="#FFC107" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#FF9800" stopOpacity="0" />
          </radialGradient>

          {/* Wood Plank Gradients */}
          <linearGradient id="woodFront" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#7C4A21" />
            <stop offset="30%" stopColor="#5E3314" />
            <stop offset="70%" stopColor="#4A250B" />
            <stop offset="100%" stopColor="#361905" />
          </linearGradient>

          <linearGradient id="woodLid" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#8D5527" />
            <stop offset="50%" stopColor="#693916" />
            <stop offset="100%" stopColor="#4A250B" />
          </linearGradient>

          {/* Gold Metal Trim Gradient */}
          <linearGradient id="goldTrim" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#FFF2A3" />
            <stop offset="25%" stopColor="#E5B842" />
            <stop offset="50%" stopColor="#C99726" />
            <stop offset="75%" stopColor="#EFCB68" />
            <stop offset="100%" stopColor="#9C6F12" />
          </linearGradient>

          {/* Dark Brass Iron Metal */}
          <linearGradient id="brassMetal" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#3E2723" />
            <stop offset="30%" stopColor="#5D4037" />
            <stop offset="50%" stopColor="#8D6E63" />
            <stop offset="70%" stopColor="#5D4037" />
            <stop offset="100%" stopColor="#2E1B17" />
          </linearGradient>

          {/* Stone Pedestal Gradient */}
          <linearGradient id="stonePedestal" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#EADEC7" />
            <stop offset="30%" stopColor="#D8C7A5" />
            <stop offset="70%" stopColor="#BAA47C" />
            <stop offset="100%" stopColor="#96805B" />
          </linearGradient>

          {/* Glow Filter */}
          <filter id="softGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* 1. Stone Carved Pedestal Base */}
        <g id="stone-base">
          {/* Soft Drop Shadow under stone */}
          <ellipse cx="250" cy="355" rx="210" ry="22" fill="#000000" opacity="0.22" filter="blur(8px)" />
          
          {/* Bottom stepped stone layer */}
          <path d="M 60 350 L 440 350 L 420 365 L 80 365 Z" fill="#7D6745" />
          {/* Middle stone block */}
          <path d="M 80 325 L 420 325 L 440 350 L 60 350 Z" fill="url(#stonePedestal)" stroke="#C5B18E" stroke-width="1.5" />
          {/* Top stone ledge */}
          <polygon points="100,310 400,310 420,325 80,325" fill="#F4ECE1" stroke="#D3C3A3" stroke-width="1" />
          
          {/* Ornate decorative carving on stone face */}
          <path d="M 160 338 Q 250 345 340 338" stroke="#8C7550" stroke-width="2" fill="none" opacity="0.6" />
          <circle cx="250" cy="338" r="4" fill="#C9A24A" />
          <circle cx="200" cy="338" r="2.5" fill="#8C7550" />
          <circle cx="300" cy="338" r="2.5" fill="#8C7550" />
        </g>

        {/* 2. Radiating Golden Light Rays (Animated in CSS) */}
        <g id="light-rays" className="chest-light-rays">
          {/* Fan of polygon rays emanating from chest interior */}
          <polygon points="250,210 130,20 180,10" fill="url(#rayGrad)" opacity="0.45" />
          <polygon points="250,210 200,0 260,0" fill="url(#rayGrad)" opacity="0.55" />
          <polygon points="250,210 290,0 350,15" fill="url(#rayGrad)" opacity="0.45" />
          <polygon points="250,210 380,30 430,70" fill="url(#rayGrad)" opacity="0.4" />
          <polygon points="250,210 80,60 120,30" fill="url(#rayGrad)" opacity="0.4" />
          <polygon points="250,210 40,110 80,80" fill="url(#rayGrad)" opacity="0.3" />
          <polygon points="250,210 420,130 460,90" fill="url(#rayGrad)" opacity="0.3" />
        </g>

        {/* 3. Ambient Core Glow Behind Open Chest */}
        <circle cx="250" cy="180" r="100" fill="url(#coreGlow)" className="chest-core-pulse" />

        {/* 4. Open Chest Lid (Tilted Backward and Upward) */}
        <g id="chest-lid" transform="translate(0, -10)">
          {/* Lid Backing Shadow/Depth */}
          <path d="M 125 145 C 125 110, 160 85, 250 85 C 340 85, 375 110, 375 145 Z" fill="#2E1605" />
          
          {/* Inner Lid Arch */}
          <path d="M 130 145 C 130 115, 165 92, 250 92 C 335 92, 370 115, 370 145 Z" fill="url(#woodLid)" stroke="#5A2E0C" stroke-width="2" />
          
          {/* Inner Planks highlight lines */}
          <path d="M 180 145 C 180 120, 200 100, 250 100" fill="none" stroke="#8D5527" stroke-width="1.5" opacity="0.6" />
          <path d="M 320 145 C 320 120, 300 100, 250 100" fill="none" stroke="#8D5527" stroke-width="1.5" opacity="0.6" />

          {/* Outer Gold/Brass Lid Rim */}
          <path d="M 122 145 C 122 105, 158 80, 250 80 C 342 80, 378 105, 378 145" fill="none" stroke="url(#goldTrim)" stroke-width="6" />
          
          {/* Lid Gold Brackets & Studs */}
          <path d="M 175 88 L 180 145" stroke="url(#goldTrim)" stroke-width="4.5" />
          <path d="M 248 80 L 250 145" stroke="url(#goldTrim)" stroke-width="5" />
          <path d="M 325 88 L 320 145" stroke="url(#goldTrim)" stroke-width="4.5" />
          
          <circle cx="178" cy="115" r="3" fill="#FFE082" />
          <circle cx="249" cy="110" r="3" fill="#FFE082" />
          <circle cx="322" cy="115" r="3" fill="#FFE082" />
        </g>

        {/* 5. Treasure Contents: Mounds of Gold Coins & Sparkling Gems */}
        <g id="treasure-contents" filter="url(#softGlow)">
          {/* Golden mound fill */}
          <ellipse cx="250" cy="195" rx="100" ry="24" fill="#FFB300" />
          <ellipse cx="250" cy="192" rx="90" ry="18" fill="#FFD54F" />
          <ellipse cx="250" cy="190" rx="60" ry="12" fill="#FFF9C4" />
          
          {/* Individual sparkling coins & gems */}
          <ellipse cx="210" cy="192" rx="7" ry="5" fill="#FFE082" stroke="#FFB300" stroke-width="1" />
          <ellipse cx="230" cy="188" rx="8" ry="6" fill="#FFF59D" stroke="#FFA000" stroke-width="1" />
          <ellipse cx="265" cy="189" rx="8" ry="5" fill="#FFE082" stroke="#FFB300" stroke-width="1" />
          <ellipse cx="290" cy="193" rx="7" ry="5" fill="#FFF9C4" stroke="#FF8F00" stroke-width="1" />
          <ellipse cx="245" cy="184" rx="9" ry="6" fill="#FFFFFF" stroke="#FFD54F" stroke-width="1" />

          {/* Rubies & Emerald Jewels */}
          <polygon points="195,190 200,183 206,190 200,196" fill="#E53935" stroke="#FFCDD2" stroke-width="0.8" />
          <polygon points="280,186 286,180 292,186 286,192" fill="#2E7D32" stroke="#C8E6C9" stroke-width="0.8" />
          <polygon points="248,178 253,172 258,178 253,184" fill="#0288D1" stroke="#E1F5FE" stroke-width="0.8" />
        </g>

        {/* 6. Chest Body (Lower Box) */}
        <g id="chest-box">
          {/* Chest Box Shadow */}
          <path d="M 120 195 L 380 195 L 365 310 L 135 310 Z" fill="#2A1406" />

          {/* Main Wooden Front Face */}
          <path d="M 125 195 L 375 195 L 360 305 L 140 305 Z" fill="url(#woodFront)" stroke="#261203" stroke-width="2" />

          {/* Wood Planks Horizontal Grooves */}
          <line x1="128" y1="230" x2="372" y2="230" stroke="#261203" stroke-width="2.5" />
          <line x1="132" y1="268" x2="368" y2="268" stroke="#261203" stroke-width="2.5" />
          
          <line x1="128" y1="232" x2="372" y2="232" stroke="#7A4720" stroke-width="1" opacity="0.6" />
          <line x1="132" y1="270" x2="368" y2="270" stroke="#7A4720" stroke-width="1" opacity="0.6" />

          {/* Heavy Iron & Gold Trim Corner Straps */}
          {/* Left strap */}
          <path d="M 125 195 L 148 195 L 158 305 L 140 305 Z" fill="url(#brassMetal)" stroke="url(#goldTrim)" stroke-width="1.5" />
          {/* Right strap */}
          <path d="M 352 195 L 375 195 L 360 305 L 342 305 Z" fill="url(#brassMetal)" stroke="url(#goldTrim)" stroke-width="1.5" />
          {/* Center strap */}
          <path d="M 235 195 L 265 195 L 262 305 L 238 305 Z" fill="url(#brassMetal)" stroke="url(#goldTrim)" stroke-width="1.5" />

          {/* Golden Rim Along Top Opening */}
          <line x1="124" y1="195" x2="376" y2="195" stroke="url(#goldTrim)" stroke-width="5" stroke-linecap="round" />
          
          {/* Golden Rim Along Bottom Edge */}
          <line x1="139" y1="305" x2="361" y2="305" stroke="url(#goldTrim)" stroke-width="4.5" stroke-linecap="round" />

          {/* Rivets / Studs on Straps */}
          <circle cx="138" cy="212" r="3.2" fill="#FFE082" stroke="#5D4037" stroke-width="0.8" />
          <circle cx="142" cy="250" r="3.2" fill="#FFE082" stroke="#5D4037" stroke-width="0.8" />
          <circle cx="146" cy="288" r="3.2" fill="#FFE082" stroke="#5D4037" stroke-width="0.8" />

          <circle cx="362" cy="212" r="3.2" fill="#FFE082" stroke="#5D4037" stroke-width="0.8" />
          <circle cx="358" cy="250" r="3.2" fill="#FFE082" stroke="#5D4037" stroke-width="0.8" />
          <circle cx="354" cy="288" r="3.2" fill="#FFE082" stroke="#5D4037" stroke-width="0.8" />

          <circle cx="250" cy="265" r="3.2" fill="#FFE082" stroke="#5D4037" stroke-width="0.8" />
          <circle cx="250" cy="292" r="3.2" fill="#FFE082" stroke="#5D4037" stroke-width="0.8" />

          {/* Heavy Ornate Golden Lock Plate & Keyhole */}
          <g id="lock-plate">
            {/* Backplate */}
            <path d="M 232 195 L 268 195 L 268 238 L 250 252 L 232 238 Z" fill="url(#goldTrim)" stroke="#8C6615" stroke-width="2" filter="url(#softGlow)" />
            {/* Embossed border */}
            <path d="M 236 198 L 264 198 L 264 235 L 250 246 L 236 235 Z" fill="none" stroke="#FFE97D" stroke-width="1.2" />
            {/* Keyhole */}
            <circle cx="250" cy="218" r="4.5" fill="#2E1605" />
            <polygon points="248,220 252,220 253,232 247,232" fill="#2E1605" />
          </g>

          {/* Heavy Cast Iron Side Handles */}
          <path d="M 124 240 C 108 240, 108 262, 124 262" fill="none" stroke="url(#goldTrim)" stroke-width="5" stroke-linecap="round" />
          <path d="M 376 240 C 392 240, 392 262, 376 262" fill="none" stroke="url(#goldTrim)" stroke-width="5" stroke-linecap="round" />
        </g>

        {/* 7. Floating Magically Animated Sparkles */}
        <g id="sparkles">
          {/* Sparkle 1 */}
          <g className="sparkle-star" transform="translate(190, 130)">
            <path d="M 0,-12 Q 0,0 12,0 Q 0,0 0,12 Q 0,0 -12,0 Q 0,0 0,-12" fill="#FFFFFF" filter="url(#softGlow)" />
          </g>
          {/* Sparkle 2 */}
          <g className="sparkle-star sparkle-delay-1" transform="translate(310, 120)">
            <path d="M 0,-14 Q 0,0 14,0 Q 0,0 0,14 Q 0,0 -14,0 Q 0,0 0,-14" fill="#FFF9C4" filter="url(#softGlow)" />
          </g>
          {/* Sparkle 3 */}
          <g className="sparkle-star sparkle-delay-2" transform="translate(250, 70)">
            <path d="M 0,-18 Q 0,0 18,0 Q 0,0 0,18 Q 0,0 -18,0 Q 0,0 0,-18" fill="#FFFFFF" filter="url(#softGlow)" />
          </g>
          {/* Sparkle 4 */}
          <g className="sparkle-star sparkle-delay-3" transform="translate(145, 175)">
            <path d="M 0,-9 Q 0,0 9,0 Q 0,0 0,9 Q 0,0 -9,0 Q 0,0 0,-9" fill="#FFF176" />
          </g>
          {/* Sparkle 5 */}
          <g className="sparkle-star sparkle-delay-1" transform="translate(355, 160)">
            <path d="M 0,-10 Q 0,0 10,0 Q 0,0 0,10 Q 0,0 -10,0 Q 0,0 0,-10" fill="#FFF9C4" />
          </g>
        </g>
      </svg>
    </div>
  );
}
