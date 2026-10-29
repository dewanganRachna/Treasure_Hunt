import React from 'react';

/**
 * Rich Dimensional SVG Open Treasure Chest Illustration
 * Features:
 * - Rich mahogany/chestnut wood planks with beveled highlights and grooves
 * - Burnished gold and brass hardware with decorative corner brackets, rivets, and side handles
 * - Open lid with warm golden aura, radiating volumetric light rays
 * - Overflowing treasure: gold coins, faceted ruby, emerald, and sapphire gems
 * - Carved stone dais base with contact shadows
 * - Floating magical sparkles with staggered keyframe animations
 */
export default function ChestIllustration({ className = '' }) {
  return (
    <div className={`chest-illustration-container ${className}`}>
      <svg
        viewBox="0 0 540 400"
        width="510"
        height="370"
        className="chest-svg"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Volumetric Radiating Light Rays Gradient */}
          <radialGradient id="chestRayGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFFEE6" stopOpacity="0.9" />
            <stop offset="25%" stopColor="#FDE68A" stopOpacity="0.6" />
            <stop offset="60%" stopColor="#F59E0B" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#D97706" stopOpacity="0" />
          </radialGradient>

          {/* Intense Core Glow Behind Chest Contents */}
          <radialGradient id="chestCoreGlow" cx="50%" cy="45%" r="50%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="1" />
            <stop offset="20%" stopColor="#FFF7C2" stopOpacity="0.95" />
            <stop offset="55%" stopColor="#FFC107" stopOpacity="0.65" />
            <stop offset="85%" stopColor="#FF9800" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#FF9800" stopOpacity="0" />
          </radialGradient>

          {/* Warm Halo Around Plinth Base */}
          <radialGradient id="chestBaseGlow" cx="50%" cy="40%" r="55%">
            <stop offset="0%" stopColor="#FDE68A" stopOpacity="0.55" />
            <stop offset="45%" stopColor="#F59E0B" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#F59E0B" stopOpacity="0" />
          </radialGradient>

          {/* Rich Mahogany / Chestnut Wood Gradients */}
          <linearGradient id="chestWoodPlank1" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#7E4720" />
            <stop offset="18%" stopColor="#673614" />
            <stop offset="70%" stopColor="#4F260C" />
            <stop offset="100%" stopColor="#381907" />
          </linearGradient>

          <linearGradient id="chestWoodPlank2" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#8A4E24" />
            <stop offset="20%" stopColor="#703C17" />
            <stop offset="75%" stopColor="#552B0E" />
            <stop offset="100%" stopColor="#3C1C08" />
          </linearGradient>

          <linearGradient id="chestWoodLidOuter" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#98582B" />
            <stop offset="25%" stopColor="#7D4219" />
            <stop offset="70%" stopColor="#5A2E0F" />
            <stop offset="100%" stopColor="#3D1D08" />
          </linearGradient>

          <linearGradient id="chestWoodLidInner" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3E1E09" />
            <stop offset="50%" stopColor="#2A1305" />
            <stop offset="100%" stopColor="#1E0D03" />
          </linearGradient>

          {/* Rich Burnished Gold Trim Gradient */}
          <linearGradient id="chestGoldTrim" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#FFF9D2" />
            <stop offset="22%" stopColor="#FDE074" />
            <stop offset="48%" stopColor="#E2AC28" />
            <stop offset="74%" stopColor="#B88015" />
            <stop offset="90%" stopColor="#F8DF7B" />
            <stop offset="100%" stopColor="#8A5A0B" />
          </linearGradient>

          <linearGradient id="chestGoldRimTop" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#C9941A" />
            <stop offset="25%" stopColor="#FDE68A" />
            <stop offset="50%" stopColor="#FFFDF0" />
            <stop offset="75%" stopColor="#F5C443" />
            <stop offset="100%" stopColor="#A87410" />
          </linearGradient>

          {/* Heavy Cast Brass Metal Gradient for Brackets */}
          <linearGradient id="chestBrassBand" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#5C3B12" />
            <stop offset="20%" stopColor="#9C6B22" />
            <stop offset="50%" stopColor="#D4A034" />
            <stop offset="80%" stopColor="#8C5C1B" />
            <stop offset="100%" stopColor="#4A2F0D" />
          </linearGradient>

          {/* Ornate Sandstone Dais Pedestal Gradient */}
          <linearGradient id="chestStoneDais" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FAF4E8" />
            <stop offset="25%" stopColor="#EDE2CB" />
            <stop offset="65%" stopColor="#D6C5A2" />
            <stop offset="100%" stopColor="#B39F78" />
          </linearGradient>

          <linearGradient id="chestStoneRim" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FFFDF8" />
            <stop offset="100%" stopColor="#DDD0B5" />
          </linearGradient>

          {/* Soft Glow Filter */}
          <filter id="chestSoftGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <filter id="chestSparkleGlow" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="glow" />
            <feMerge>
              <feMergeNode in="glow" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* 1. Base Environment: Warm Ground Halo & Pedestal */}
        <g id="chest-environment-base">
          {/* Warm radiating ground aura */}
          <ellipse cx="270" cy="355" rx="230" ry="32" fill="url(#chestBaseGlow)" />

          {/* Deep Contact Shadow on Floor */}
          <ellipse cx="270" cy="360" rx="205" ry="24" fill="#1C2E20" opacity="0.32" filter="blur(6px)" />
          <ellipse cx="270" cy="358" rx="175" ry="16" fill="#0C1B10" opacity="0.45" filter="blur(3px)" />

          {/* Stepped Carved Stone Plinth (Low tiered dais with traditional Indian moulding) */}
          {/* Lower Stone Step */}
          <polygon
            points="65,362 475,362 455,378 85,378"
            fill="#8E7852"
            stroke="#73603F"
            strokeWidth="1"
          />
          {/* Lower Step Top Lip */}
          <polygon
            points="80,352 460,352 475,362 65,362"
            fill="url(#chestStoneDais)"
            stroke="#C4B28E"
            strokeWidth="1"
          />

          {/* Main Stone Base Block */}
          <polygon
            points="95,332 445,332 458,352 82,352"
            fill="url(#chestStoneDais)"
            stroke="#C0AE8B"
            strokeWidth="1.2"
          />
          {/* Top Stone Dais Surface */}
          <polygon
            points="115,316 425,316 445,332 95,332"
            fill="url(#chestStoneRim)"
            stroke="#E0D3BC"
            strokeWidth="1.2"
          />

          {/* Stone Decorative Indian Relief Pattern (Carved frieze & lotus buds on plinth face) */}
          <path
            d="M 140,344 Q 270,350 400,344"
            fill="none"
            stroke="#8A734C"
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0.6"
          />
          <circle cx="270" cy="344" r="4.5" fill="#C9A24A" stroke="#7A633B" strokeWidth="0.8" />
          <circle cx="220" cy="344" r="3" fill="#A88B57" />
          <circle cx="320" cy="344" r="3" fill="#A88B57" />
          <circle cx="170" cy="343" r="2.5" fill="#8A734C" />
          <circle cx="370" cy="343" r="2.5" fill="#8A734C" />
        </g>

        {/* 2. Radiating Golden Volumetric Light Beams */}
        <g id="chest-light-beams" className="chest-light-rays">
          {/* Fan of golden light rays bursting upwards from chest opening */}
          <polygon points="270,215 110,25 170,12" fill="url(#chestRayGrad)" opacity="0.5" />
          <polygon points="270,215 195,5 255,0" fill="url(#chestRayGrad)" opacity="0.6" />
          <polygon points="270,215 285,0 345,5" fill="url(#chestRayGrad)" opacity="0.65" />
          <polygon points="270,215 370,15 430,35" fill="url(#chestRayGrad)" opacity="0.5" />
          <polygon points="270,215 435,55 490,95" fill="url(#chestRayGrad)" opacity="0.4" />
          <polygon points="270,215 50,75 105,45" fill="url(#chestRayGrad)" opacity="0.4" />
          <polygon points="270,215 20,135 65,95" fill="url(#chestRayGrad)" opacity="0.3" />
          <polygon points="270,215 475,155 520,115" fill="url(#chestRayGrad)" opacity="0.3" />
        </g>

        {/* 3. Deep Ambient Glow Behind Chest Rim */}
        <circle cx="270" cy="180" r="115" fill="url(#chestCoreGlow)" className="chest-core-pulse" />

        {/* 4. Open Chest Lid (Arched Top Tilted Backwards) */}
        <g id="chest-open-lid" transform="translate(0, -6)">
          {/* Shadow Behind Open Lid */}
          <path
            d="M 132,145 C 132,95 178,65 270,65 C 362,65 408,95 408,145 Z"
            fill="#1E0D03"
            opacity="0.85"
          />

          {/* Inner Lid Cavity (Dark Depth with warm light edge) */}
          <path
            d="M 138,146 C 138,102 182,72 270,72 C 358,72 402,102 402,146 Z"
            fill="url(#chestWoodLidInner)"
            stroke="#3C1A06"
            strokeWidth="2.5"
          />

          {/* Inner Wooden Rib Bracing */}
          <path d="M 195,146 C 195,115 220,86 270,86" fill="none" stroke="#52280C" strokeWidth="2.2" opacity="0.75" />
          <path d="M 345,146 C 345,115 320,86 270,86" fill="none" stroke="#52280C" strokeWidth="2.2" opacity="0.75" />

          {/* Outer Arched Rim of the Lid (Rich Wood Structure) */}
          <path
            d="M 130,146 C 130,90 174,58 270,58 C 366,58 410,90 410,146"
            fill="none"
            stroke="url(#chestWoodLidOuter)"
            strokeWidth="10"
            strokeLinecap="round"
          />

          {/* Heavy Polished Golden Arch Trim along Lid Crest */}
          <path
            d="M 128,146 C 128,88 172,56 270,56 C 368,56 412,88 412,146"
            fill="none"
            stroke="url(#chestGoldTrim)"
            strokeWidth="5"
            strokeLinecap="round"
          />

          {/* Arched Gold Reinforcing Straps across the Lid */}
          {/* Left Lid Strap */}
          <path d="M 190,67 L 194,146" stroke="url(#chestGoldTrim)" strokeWidth="5.5" strokeLinecap="round" />
          <circle cx="192" cy="100" r="3.2" fill="#FFEAA7" stroke="#8A5A0B" strokeWidth="0.8" />
          <circle cx="193" cy="128" r="3.2" fill="#FFEAA7" stroke="#8A5A0B" strokeWidth="0.8" />

          {/* Center Lid Strap */}
          <path d="M 269,56 L 270,146" stroke="url(#chestGoldTrim)" strokeWidth="6" strokeLinecap="round" />
          <circle cx="269.5" cy="85" r="3.5" fill="#FFEAA7" stroke="#8A5A0B" strokeWidth="0.8" />
          <circle cx="270" cy="118" r="3.5" fill="#FFEAA7" stroke="#8A5A0B" strokeWidth="0.8" />

          {/* Right Lid Strap */}
          <path d="M 350,67 L 346,146" stroke="url(#chestGoldTrim)" strokeWidth="5.5" strokeLinecap="round" />
          <circle cx="348" cy="100" r="3.2" fill="#FFEAA7" stroke="#8A5A0B" strokeWidth="0.8" />
          <circle cx="347" cy="128" r="3.2" fill="#FFEAA7" stroke="#8A5A0B" strokeWidth="0.8" />

          {/* Sturdy Cast Brass Hinges Connecting Lid to Box */}
          <rect x="155" y="140" width="18" height="12" rx="2" fill="url(#chestBrassBand)" stroke="#3E270A" strokeWidth="1" />
          <circle cx="164" cy="146" r="2.2" fill="#FDE68A" />
          <rect x="367" y="140" width="18" height="12" rx="2" fill="url(#chestBrassBand)" stroke="#3E270A" strokeWidth="1" />
          <circle cx="376" cy="146" r="2.2" fill="#FDE68A" />
        </g>

        {/* 5. Treasure Interior: Mounds of Sparkling Gold Coins & Faceted Gems */}
        <g id="chest-treasure-contents" filter="url(#chestSoftGlow)">
          {/* Deep Radiant Gold Core Mound */}
          <ellipse cx="270" cy="198" rx="114" ry="26" fill="#F59E0B" />
          <ellipse cx="270" cy="194" rx="104" ry="21" fill="#FBBF24" />
          <ellipse cx="270" cy="190" rx="78" ry="14" fill="#FDE68A" />
          <ellipse cx="270" cy="188" rx="46" ry="8" fill="#FFFBE6" />

          {/* Individual Gold Coins with Embossed Rim Highlights */}
          <ellipse cx="225" cy="195" rx="9" ry="6.5" fill="#FDE68A" stroke="#D97706" strokeWidth="1.2" />
          <ellipse cx="245" cy="190" rx="10" ry="7" fill="#FEF08A" stroke="#B45309" strokeWidth="1.2" />
          <ellipse cx="268" cy="193" rx="10.5" ry="7.5" fill="#FFF9C4" stroke="#D97706" strokeWidth="1.2" />
          <ellipse cx="292" cy="189" rx="9.5" ry="6.5" fill="#FEF08A" stroke="#B45309" strokeWidth="1.2" />
          <ellipse cx="315" cy="194" rx="8.5" ry="6" fill="#FDE68A" stroke="#D97706" strokeWidth="1.2" />
          <ellipse cx="205" cy="198" rx="8" ry="5.5" fill="#F59E0B" stroke="#92400E" strokeWidth="1" />
          <ellipse cx="332" cy="198" rx="7.5" ry="5.5" fill="#F59E0B" stroke="#92400E" strokeWidth="1" />
          <ellipse cx="258" cy="185" rx="8.5" ry="6" fill="#FFFFFF" stroke="#F59E0B" strokeWidth="1" />
          <ellipse cx="282" cy="184" rx="8" ry="5.5" fill="#FEF9C3" stroke="#D97706" strokeWidth="1" />

          {/* Multi-Colored Faceted Jewels & Gems Catching the Golden Light */}
          {/* 1. Brilliant Crimson Ruby (Oval cut) */}
          <polygon points="210,192 216,183 224,192 218,200" fill="#EF4444" stroke="#FECACA" strokeWidth="1" />
          <polygon points="216,183 220,188 214,193 210,192" fill="#F87171" />

          {/* 2. Deep Royal Blue Sapphire (Diamond cut) */}
          <polygon points="274,180 282,171 290,180 282,189" fill="#2563EB" stroke="#BFDBFE" strokeWidth="1" />
          <polygon points="282,171 286,177 282,185 278,178" fill="#60A5FA" />

          {/* 3. Radiant Forest Emerald (Hexagonal cut) */}
          <polygon points="302,187 310,180 318,185 318,193 310,198 302,193" fill="#10B981" stroke="#A7F3D0" strokeWidth="1" />
          <polygon points="310,180 315,185 310,192 305,186" fill="#34D399" />

          {/* 4. Golden Topaz */}
          <polygon points="238,182 244,175 250,182 244,188" fill="#F59E0B" stroke="#FEF08A" strokeWidth="0.8" />

          {/* 5. Sparkling Royal Amethyst */}
          <polygon points="325,190 331,183 337,190 331,196" fill="#8B5CF6" stroke="#DDD6FE" strokeWidth="0.8" />
        </g>

        {/* 6. Main Chest Body (Lower Box with Wooden Planks & Brass Straps) */}
        <g id="chest-main-box">
          {/* Box Under-Shadow */}
          <polygon points="128,202 412,202 396,322 144,322" fill="#1C0C04" />

          {/* Top Wooden Plank */}
          <polygon points="132,202 408,202 403,242 137,242" fill="url(#chestWoodPlank2)" stroke="#220E03" strokeWidth="1.5" />
          {/* Middle Wooden Plank */}
          <polygon points="137,242 403,242 398,282 142,282" fill="url(#chestWoodPlank1)" stroke="#220E03" strokeWidth="1.5" />
          {/* Bottom Wooden Plank */}
          <polygon points="142,282 398,282 393,320 147,320" fill="url(#chestWoodPlank2)" stroke="#220E03" strokeWidth="1.5" />

          {/* Plank Separation Grooves & Natural Highlights */}
          <line x1="135" y1="242" x2="405" y2="242" stroke="#1A0A02" strokeWidth="2.5" />
          <line x1="135" y1="244" x2="405" y2="244" stroke="#8D5224" strokeWidth="1" opacity="0.6" />
          <line x1="140" y1="282" x2="400" y2="282" stroke="#1A0A02" strokeWidth="2.5" />
          <line x1="140" y1="284" x2="400" y2="284" stroke="#8D5224" strokeWidth="1" opacity="0.6" />

          {/* Heavy Brass Reinforcing Corner Straps (Vertical bindings) */}
          {/* Left Vertical Strap */}
          <polygon points="132,202 158,202 170,320 147,320" fill="url(#chestBrassBand)" stroke="url(#chestGoldTrim)" strokeWidth="1.6" />
          {/* Right Vertical Strap */}
          <polygon points="382,202 408,202 393,320 370,320" fill="url(#chestBrassBand)" stroke="url(#chestGoldTrim)" strokeWidth="1.6" />
          {/* Center Vertical Strap */}
          <polygon points="253,202 287,202 284,320 256,320" fill="url(#chestBrassBand)" stroke="url(#chestGoldTrim)" strokeWidth="1.6" />

          {/* Solid Golden Rim along Top Opening Lip */}
          <line x1="130" y1="202" x2="410" y2="202" stroke="url(#chestGoldRimTop)" strokeWidth="6" strokeLinecap="round" />
          {/* Golden Rim along Bottom Base Lip */}
          <line x1="146" y1="320" x2="394" y2="320" stroke="url(#chestGoldTrim)" strokeWidth="5" strokeLinecap="round" />

          {/* Decorative Heavy Brass Corner L-Brackets */}
          <polygon points="132,202 170,202 170,224 152,224 152,246 135,246" fill="url(#chestGoldTrim)" stroke="#5C3B12" strokeWidth="1" />
          <polygon points="408,202 370,202 370,224 388,224 388,246 405,246" fill="url(#chestGoldTrim)" stroke="#5C3B12" strokeWidth="1" />
          <polygon points="147,320 178,320 178,300 162,300 162,280 144,280" fill="url(#chestGoldTrim)" stroke="#5C3B12" strokeWidth="1" />
          <polygon points="393,320 362,320 362,300 378,300 378,280 396,280" fill="url(#chestGoldTrim)" stroke="#5C3B12" strokeWidth="1" />

          {/* Spherical Gold/Brass Rivets on Straps */}
          <circle cx="147" cy="222" r="3.6" fill="#FFF2A3" stroke="#5C3B12" strokeWidth="0.8" />
          <circle cx="152" cy="262" r="3.6" fill="#FFF2A3" stroke="#5C3B12" strokeWidth="0.8" />
          <circle cx="158" cy="302" r="3.6" fill="#FFF2A3" stroke="#5C3B12" strokeWidth="0.8" />

          <circle cx="393" cy="222" r="3.6" fill="#FFF2A3" stroke="#5C3B12" strokeWidth="0.8" />
          <circle cx="388" cy="262" r="3.6" fill="#FFF2A3" stroke="#5C3B12" strokeWidth="0.8" />
          <circle cx="382" cy="302" r="3.6" fill="#FFF2A3" stroke="#5C3B12" strokeWidth="0.8" />

          <circle cx="270" cy="272" r="3.6" fill="#FFF2A3" stroke="#5C3B12" strokeWidth="0.8" />
          <circle cx="270" cy="304" r="3.6" fill="#FFF2A3" stroke="#5C3B12" strokeWidth="0.8" />

          {/* Heavy Cast Brass Drop Handles on Left & Right Sides */}
          {/* Left Handle */}
          <path
            d="M 132,246 C 112,246 112,274 133,274"
            fill="none"
            stroke="url(#chestGoldTrim)"
            strokeWidth="6"
            strokeLinecap="round"
          />
          <circle cx="132" cy="246" r="4.5" fill="#8C5C1B" stroke="#FFEAA7" strokeWidth="0.8" />
          <circle cx="133" cy="274" r="4.5" fill="#8C5C1B" stroke="#FFEAA7" strokeWidth="0.8" />

          {/* Right Handle */}
          <path
            d="M 408,246 C 428,246 428,274 407,274"
            fill="none"
            stroke="url(#chestGoldTrim)"
            strokeWidth="6"
            strokeLinecap="round"
          />
          <circle cx="408" cy="246" r="4.5" fill="#8C5C1B" stroke="#FFEAA7" strokeWidth="0.8" />
          <circle cx="407" cy="274" r="4.5" fill="#8C5C1B" stroke="#FFEAA7" strokeWidth="0.8" />

          {/* Grand Ornate Golden Lock Escutcheon & Keyhole */}
          <g id="chest-lock-escutcheon" filter="url(#chestSoftGlow)">
            {/* Ornate Shield Backplate */}
            <path
              d="M 248,202 L 292,202 L 292,245 C 292,258 270,268 270,268 C 270,268 248,258 248,245 Z"
              fill="url(#chestGoldTrim)"
              stroke="#6B4307"
              strokeWidth="2"
            />
            {/* Embossed Inner Rim */}
            <path
              d="M 252,205 L 288,205 L 288,242 C 288,252 270,261 270,261 C 270,261 252,252 252,242 Z"
              fill="none"
              stroke="#FFF9D2"
              strokeWidth="1.2"
              opacity="0.8"
            />
            {/* Traditional Keyhole */}
            <circle cx="270" cy="225" r="5" fill="#1C0C04" />
            <polygon points="267,226 273,226 274,242 266,242" fill="#1C0C04" />
            {/* Keyhole Golden Rim Accent */}
            <circle cx="270" cy="225" r="6.2" fill="none" stroke="#FFE680" strokeWidth="1" />
          </g>
        </g>

        {/* 7. Floating Animated Magical Sparkles & Starlight */}
        <g id="chest-sparkles" filter="url(#chestSparkleGlow)">
          {/* Sparkle 1 - High Left */}
          <g className="sparkle-star" transform="translate(200, 125)">
            <path d="M 0,-14 Q 0,0 14,0 Q 0,0 0,14 Q 0,0 -14,0 Q 0,0 0,-14" fill="#FFFFFF" />
            <circle cx="0" cy="0" r="3" fill="#FFF9C4" />
          </g>

          {/* Sparkle 2 - High Right */}
          <g className="sparkle-star sparkle-delay-1" transform="translate(340, 115)">
            <path d="M 0,-16 Q 0,0 16,0 Q 0,0 0,16 Q 0,0 -16,0 Q 0,0 0,-16" fill="#FFFBE6" />
            <circle cx="0" cy="0" r="3.5" fill="#FDE68A" />
          </g>

          {/* Sparkle 3 - Center Summit */}
          <g className="sparkle-star sparkle-delay-2" transform="translate(270, 55)">
            <path d="M 0,-20 Q 0,0 20,0 Q 0,0 0,20 Q 0,0 -20,0 Q 0,0 0,-20" fill="#FFFFFF" />
            <circle cx="0" cy="0" r="4" fill="#FCD34D" />
          </g>

          {/* Sparkle 4 - Lower Left Glint */}
          <g className="sparkle-star sparkle-delay-3" transform="translate(150, 175)">
            <path d="M 0,-10 Q 0,0 10,0 Q 0,0 0,10 Q 0,0 -10,0 Q 0,0 0,-10" fill="#FFF59D" />
          </g>

          {/* Sparkle 5 - Lower Right Glint */}
          <g className="sparkle-star sparkle-delay-1" transform="translate(385, 165)">
            <path d="M 0,-12 Q 0,0 12,0 Q 0,0 0,12 Q 0,0 -12,0 Q 0,0 0,-12" fill="#FEF08A" />
          </g>

          {/* Sparkle 6 - Gem Glint Center */}
          <g className="sparkle-star sparkle-delay-2" transform="translate(282, 174)">
            <polygon points="0,-7 2,-2 7,0 2,2 0,7 -2,2 -7,0 -2,-2" fill="#E0F2FE" />
          </g>
        </g>
      </svg>
    </div>
  );
}
