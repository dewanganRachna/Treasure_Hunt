import React from 'react';
import ChestIllustration from './ChestIllustration';

/**
 * WelcomeScreen - Premium, Immersive Chhattisgarh Digital Explorer Welcome Stage
 * Inspired by Chhattisgarh's natural heritage and cultural identity:
 * - Layered Maikal/Bastar misty hills, soft golden sunrise, and atmospheric depth
 * - Silhouetted Sirpur/Bhoramdeo heritage temple on left slopes
 * - Cascading Chitrakote-inspired waterfall gorge on right cliffs
 * - Stylized Sal trees (state tree of Chhattisgarh) and meandering river Mahanadi
 * - Foreground tropical foliage and natural grassy knoll anchoring the chest
 * - Refined royal title with traditional Indian filigree separators
 * - Rich dimensional open treasure chest with golden light rays and gems
 * - Premium gold-trimmed forest green START GAME button
 * - Official CHiPS branding at top-left
 */
export default function WelcomeScreen({ onStartGame = () => {} }) {
  return (
    <div className="welcome-screen-stage">
      {/* 1. Background Environmental Scenery (Layered SVG Artwork) */}
      <div className="welcome-scenic-bg" aria-hidden="true">
        <svg
          viewBox="0 0 1920 1080"
          className="welcome-hills-svg"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Morning Sunrise Sky Gradients */}
            <linearGradient id="scenicSkyGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FFFDF7" />
              <stop offset="35%" stopColor="#FBF4E4" />
              <stop offset="70%" stopColor="#F3E6CB" />
              <stop offset="100%" stopColor="#E6D3B1" />
            </linearGradient>

            <radialGradient id="scenicSunAura" cx="50%" cy="32%" r="48%">
              <stop offset="0%" stopColor="#FFF9E0" stopOpacity="0.85" />
              <stop offset="30%" stopColor="#FDEAB8" stopOpacity="0.5" />
              <stop offset="65%" stopColor="#F6DB9E" stopOpacity="0.18" />
              <stop offset="100%" stopColor="#F6DB9E" stopOpacity="0" />
            </radialGradient>

            {/* Layer 1: Distant Maikal Mountains */}
            <linearGradient id="mountFarGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#C8DBCF" stopOpacity="0.85" />
              <stop offset="40%" stopColor="#ADC9B6" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#8EAFA0" />
            </linearGradient>

            {/* Layer 2: Mid Forested Ridges */}
            <linearGradient id="mountMidGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#7DA888" />
              <stop offset="60%" stopColor="#5E8A6B" />
              <stop offset="100%" stopColor="#436F50" />
            </linearGradient>

            {/* Layer 3: Lower River Valley Slopes */}
            <linearGradient id="valleySlopeGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#4D7F5C" />
              <stop offset="50%" stopColor="#356643" />
              <stop offset="100%" stopColor="#224E30" />
            </linearGradient>

            {/* Layer 4: Foreground Grassy Knoll */}
            <linearGradient id="foregroundKnollGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2F6E41" />
              <stop offset="40%" stopColor="#225432" />
              <stop offset="100%" stopColor="#143A21" />
            </linearGradient>

            {/* Waterfall Cyan Stream */}
            <linearGradient id="waterfallStreamGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#E0F2FE" />
              <stop offset="25%" stopColor="#BAE6FD" />
              <stop offset="65%" stopColor="#38BDF8" />
              <stop offset="100%" stopColor="#0284C7" />
            </linearGradient>

            {/* River Mahanadi Gradient */}
            <linearGradient id="riverMahanadiGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#BAE6FD" stopOpacity="0.65" />
              <stop offset="45%" stopColor="#7DD3FC" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#38BDF8" stopOpacity="0.95" />
            </linearGradient>

            {/* Sal Tree Trunk & Foliage */}
            <linearGradient id="salTrunkGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#2A1B12" />
              <stop offset="40%" stopColor="#4A3425" />
              <stop offset="100%" stopColor="#24160E" />
            </linearGradient>

            <linearGradient id="salLeafGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#489E5F" />
              <stop offset="50%" stopColor="#2E7544" />
              <stop offset="100%" stopColor="#1B4D2A" />
            </linearGradient>

            {/* Mist Soft Filter */}
            <filter id="atmosphericMist" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="12" />
            </filter>

            {/* Stylized Sal Tree Symbol Definition */}
            <g id="stylized-sal-tree">
              {/* Slender straight trunk */}
              <rect x="-3" y="0" width="6" height="52" fill="url(#salTrunkGrad)" rx="1.5" />
              {/* Lower Tier Canopy */}
              <ellipse cx="0" cy="-4" rx="28" ry="11" fill="#184827" />
              <ellipse cx="0" cy="-6" rx="25" ry="10" fill="url(#salLeafGrad)" />
              {/* Mid Tier Canopy */}
              <ellipse cx="0" cy="-18" rx="22" ry="9" fill="#1D542E" />
              <ellipse cx="0" cy="-20" rx="19" ry="8" fill="url(#salLeafGrad)" />
              {/* Top Tier Canopy */}
              <ellipse cx="0" cy="-30" rx="15" ry="7" fill="#256B3A" />
              <ellipse cx="0" cy="-32" rx="13" ry="6" fill="#52B76D" />
            </g>
          </defs>

          {/* 1. Base Sky Fill */}
          <rect width="1920" height="1080" fill="url(#scenicSkyGrad)" />

          {/* 2. Soft Sunrise Light Glow & Atmospheric Dust */}
          <ellipse cx="960" cy="380" rx="680" ry="380" fill="url(#scenicSunAura)" />

          {/* Gentle Sun Rays from Horizon */}
          <g opacity="0.16">
            <polygon points="960,340 400,0 480,0" fill="#FFE899" />
            <polygon points="960,340 700,0 800,0" fill="#FFE899" />
            <polygon points="960,340 1120,0 1220,0" fill="#FFE899" />
            <polygon points="960,340 1440,0 1520,0" fill="#FFE899" />
            <polygon points="960,340 1800,100 1880,180" fill="#FFE899" />
            <polygon points="960,340 40,180 120,100" fill="#FFE899" />
          </g>

          {/* 3. Layer 1: Distant Maikal & Bastar Mountain Ridges */}
          <path
            d="M 0,440 Q 260,350 560,420 T 1140,390 T 1640,430 T 1920,400 L 1920,1080 L 0,1080 Z"
            fill="url(#mountFarGrad)"
            opacity="0.85"
          />

          {/* Distant Valley Mist Band */}
          <ellipse cx="960" cy="450" rx="900" ry="40" fill="#FAF3E6" opacity="0.45" filter="url(#atmosphericMist)" />

          {/* 4. Layer 2: Mid-Range Ridge with Ancient Sirpur Heritage Temple (Left) */}
          <path
            d="M 0,520 Q 320,450 680,540 T 1360,520 T 1920,480 L 1920,1080 L 0,1080 Z"
            fill="url(#mountMidGrad)"
            opacity="0.9"
          />

          {/* Silhouetted Sirpur / Bhoramdeo Temple Complex on Left Slope */}
          <g id="scenic-temple-complex" transform="translate(190, 410)" opacity="0.6">
            {/* Ground plinth base */}
            <rect x="0" y="70" width="160" height="24" rx="2" fill="#3D684A" />
            <rect x="25" y="62" width="110" height="12" fill="#4E7E5D" />

            {/* Mandapa (Entry Pillared Hall) */}
            <rect x="15" y="42" width="55" height="26" fill="#447352" />
            <polygon points="12,42 73,42 66,32 19,32" fill="#528761" />

            {/* Main Shikhara Spire (Tiered Nagara/Kalinga Tower) */}
            <polygon points="75,62 105,-20 135,62" fill="#386144" />
            <polygon points="83,62 105,-20 127,62" fill="#4A7A57" />
            <polygon points="91,62 105,-20 119,62" fill="#5B916A" />

            {/* Horizontal Carved Ridge Bands across Shikhara */}
            <line x1="84" y1="44" x2="126" y2="44" stroke="#71A882" strokeWidth="2" />
            <line x1="89" y1="28" x2="121" y2="28" stroke="#71A882" strokeWidth="1.8" />
            <line x1="94" y1="12" x2="116" y2="12" stroke="#71A882" strokeWidth="1.5" />
            <line x1="99" y1="-4" x2="111" y2="-4" stroke="#71A882" strokeWidth="1.2" />

            {/* Kalasha Golden Finial Spire Crown */}
            <circle cx="105" cy="-26" r="4.5" fill="#FDE68A" stroke="#C9A24A" strokeWidth="1" />
            <polygon points="105,-34 103,-27 107,-27" fill="#FDE68A" />

            {/* Subsidiary Shrine 1 (Left) */}
            <polygon points="4,62 18,18 32,62" fill="#3A6346" />
            <circle cx="18" cy="14" r="2.5" fill="#FDE68A" />

            {/* Subsidiary Shrine 2 (Right) */}
            <polygon points="132,62 144,24 156,62" fill="#3A6346" />
            <circle cx="144" cy="20" r="2.5" fill="#FDE68A" />

            {/* Soft Temple Base Morning Mist */}
            <ellipse cx="80" cy="82" rx="90" ry="14" fill="#FAF3E6" opacity="0.5" filter="url(#atmosphericMist)" />
          </g>

          {/* 5. Layer 3: Chitrakote Waterfall Gorge on Right Rocky Cliffs */}
          <g id="scenic-waterfall-gorge" transform="translate(1540, 440)" opacity="0.85">
            {/* Rocky Cliff Headland */}
            <path
              d="M 60,30 Q 140,45 220,35 L 380,80 L 380,260 L 40,260 Z"
              fill="#345B3F"
            />
            {/* Tiered Rock Strata Ledges */}
            <path d="M 50,45 L 230,45 L 210,65 L 65,65 Z" fill="#284831" />
            <path d="M 80,120 L 250,120 L 230,140 L 95,140 Z" fill="#223D2A" />

            {/* Wide Cascading Waterfall Curtain (Chitrakote "Niagara of India") */}
            <path
              d="M 115,50 L 105,175 L 185,175 L 175,50 Z"
              fill="url(#waterfallStreamGrad)"
              opacity="0.9"
            />
            {/* Foam & Water Plume Streaks */}
            <path
              d="M 125,55 L 118,170 M 138,55 L 133,170 M 150,55 L 148,170 M 162,55 L 163,168 M 172,55 L 176,165"
              stroke="#FFFFFF"
              strokeWidth="2.2"
              strokeDasharray="14 6"
              strokeLinecap="round"
              opacity="0.95"
            />

            {/* Secondary Lower Cascade Step */}
            <path
              d="M 95,175 L 85,225 L 205,225 L 195,175 Z"
              fill="url(#waterfallStreamGrad)"
              opacity="0.8"
            />
            <path
              d="M 110,175 L 105,222 M 135,175 L 132,222 M 160,175 L 160,222 M 185,175 L 188,220"
              stroke="#FFFFFF"
              strokeWidth="2"
              strokeDasharray="10 5"
              opacity="0.9"
            />

            {/* Rising Water Mist / Foam Pool at Gorge Base */}
            <ellipse cx="145" cy="225" rx="85" ry="24" fill="#E0F2FE" opacity="0.85" filter="url(#atmosphericMist)" />
            <ellipse cx="145" cy="220" rx="55" ry="14" fill="#FFFFFF" opacity="0.95" />
          </g>

          {/* 6. Mid-Ground Valleys & Sal Tree Groves */}
          {/* Valley Forest Contours */}
          <path
            d="M 0,610 Q 380,550 780,630 T 1520,590 T 1920,620 L 1920,1080 L 0,1080 Z"
            fill="url(#valleySlopeGrad)"
            opacity="0.9"
          />

          {/* Stylized Sal Trees Planted along Left Valley Slope */}
          <use href="#stylized-sal-tree" x="120" y="550" transform="scale(0.85)" />
          <use href="#stylized-sal-tree" x="200" y="570" transform="scale(0.95)" />
          <use href="#stylized-sal-tree" x="290" y="590" transform="scale(0.8)" />
          <use href="#stylized-sal-tree" x="80" y="620" transform="scale(1.05)" />
          <use href="#stylized-sal-tree" x="180" y="640" transform="scale(0.9)" />
          <use href="#stylized-sal-tree" x="330" y="650" transform="scale(1.0)" />

          {/* Stylized Sal Trees Planted along Right Valley Slope */}
          <use href="#stylized-sal-tree" x="1760" y="540" transform="scale(0.85)" />
          <use href="#stylized-sal-tree" x="1660" y="565" transform="scale(0.95)" />
          <use href="#stylized-sal-tree" x="1820" y="610" transform="scale(1.05)" />
          <use href="#stylized-sal-tree" x="1590" y="625" transform="scale(0.85)" />
          <use href="#stylized-sal-tree" x="1710" y="645" transform="scale(1.0)" />

          {/* 7. Winding River Mahanadi through Center Valley */}
          <g id="scenic-river-mahanadi">
            {/* Cyan river ribbon weaving from misty distance to foreground */}
            <path
              d="M 945,510 Q 980,580 920,680 T 960,860 T 890,1080 L 1030,1080 Q 990,860 980,680 T 985,510 Z"
              fill="url(#riverMahanadiGrad)"
            />
            {/* Water reflections / sparkle streaks */}
            <path
              d="M 945,570 Q 960,610 935,660 M 940,710 Q 965,760 950,820 M 945,880 Q 970,950 930,1030"
              stroke="#FFFFFF"
              strokeWidth="2.5"
              strokeDasharray="18 12"
              strokeLinecap="round"
              opacity="0.75"
            />
            <path
              d="M 960,530 Q 972,555 962,580 M 970,730 Q 985,780 975,830"
              stroke="#E0F2FE"
              strokeWidth="1.8"
              opacity="0.8"
            />
          </g>

          {/* 8. Layer 4: Foreground Central Grassy Knoll (Grounds the Treasure Chest) */}
          <path
            d="M 0,730 Q 480,670 960,705 T 1920,715 L 1920,1080 L 0,1080 Z"
            fill="url(#foregroundKnollGrad)"
          />

          {/* Central elevated grassy mound supporting the stone dais */}
          <ellipse cx="960" cy="800" rx="420" ry="85" fill="#1B4729" opacity="0.6" filter="blur(8px)" />
          <ellipse cx="960" cy="790" rx="360" ry="65" fill="#255D36" opacity="0.75" />

          {/* Subtle grassy texture highlights */}
          <g opacity="0.5">
            <path d="M 720,780 L 725,768 M 724,780 L 731,770 M 728,780 L 735,772" stroke="#489E5F" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M 840,800 L 845,788 M 844,800 L 851,790 M 848,800 L 855,792" stroke="#489E5F" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M 1080,800 L 1075,788 M 1076,800 L 1069,790 M 1072,800 L 1065,792" stroke="#489E5F" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M 1200,780 L 1195,768 M 1196,780 L 1189,770 M 1192,780 L 1185,772" stroke="#489E5F" strokeWidth="1.5" strokeLinecap="round" />
          </g>

          {/* 9. Layer 5: Foreground Botanical Framing (Sal & Teak Corner Foliage) */}
          {/* Bottom-Left Lush Sal Foliage Leaves */}
          <g id="fg-foliage-left" transform="translate(-10, 810)">
            {/* Dark back leaves */}
            <path d="M 0,270 C 60,180 140,120 280,70 C 210,130 150,190 0,270 Z" fill="#143A21" />
            <path d="M 0,270 C 90,160 190,130 330,120 C 240,180 160,220 0,270 Z" fill="#1A4A2B" />
            {/* Mid green leaves with leaf rib highlights */}
            <path d="M 0,270 C 40,120 110,60 230,10 C 180,80 130,150 0,270 Z" fill="#25663B" />
            <path d="M 10,250 Q 110,130 220,20" stroke="#489E5F" strokeWidth="2.2" fill="none" opacity="0.75" />
            <path d="M 0,270 C 80,210 170,180 270,190 C 190,220 110,250 0,270 Z" fill="#2E7A46" />
            {/* Bright front accent leaf */}
            <path d="M 0,270 C 120,250 200,220 290,180 C 200,230 110,260 0,270 Z" fill="#3D9B58" opacity="0.9" />
            <path d="M 10,265 Q 150,235 280,185" stroke="#7FE09C" strokeWidth="1.8" fill="none" opacity="0.8" />
          </g>

          {/* Bottom-Right Lush Sal Foliage Leaves (Mirrored & Distinct) */}
          <g id="fg-foliage-right" transform="translate(1930, 810) scale(-1, 1)">
            {/* Dark back leaves */}
            <path d="M 0,270 C 60,180 140,120 280,70 C 210,130 150,190 0,270 Z" fill="#143A21" />
            <path d="M 0,270 C 90,160 190,130 330,120 C 240,180 160,220 0,270 Z" fill="#1A4A2B" />
            {/* Mid green leaves with leaf rib highlights */}
            <path d="M 0,270 C 40,120 110,60 230,10 C 180,80 130,150 0,270 Z" fill="#25663B" />
            <path d="M 10,250 Q 110,130 220,20" stroke="#489E5F" strokeWidth="2.2" fill="none" opacity="0.75" />
            <path d="M 0,270 C 80,210 170,180 270,190 C 190,220 110,250 0,270 Z" fill="#2E7A46" />
            {/* Bright front accent leaf */}
            <path d="M 0,270 C 120,250 200,220 290,180 C 200,230 110,260 0,270 Z" fill="#3D9B58" opacity="0.9" />
            <path d="M 10,265 Q 150,235 280,185" stroke="#7FE09C" strokeWidth="1.8" fill="none" opacity="0.8" />
          </g>

          {/* 10. Ambient Golden Pollen / Light Dust Particles */}
          <g id="ambient-particles" opacity="0.6">
            <circle cx="480" cy="310" r="2" fill="#FDE68A" />
            <circle cx="620" cy="240" r="2.5" fill="#FFFBE6" />
            <circle cx="820" cy="280" r="2" fill="#FCD34D" />
            <circle cx="1120" cy="270" r="2.5" fill="#FDE68A" />
            <circle cx="1320" cy="230" r="2" fill="#FFFBE6" />
            <circle cx="1480" cy="320" r="2.5" fill="#FCD34D" />
            <circle cx="740" cy="460" r="1.8" fill="#FDE68A" />
            <circle cx="1180" cy="470" r="1.8" fill="#FFFBE6" />
          </g>
        </svg>
      </div>

      {/* 2. Top-Left: Official CHiPS Logo */}
      <div className="welcome-top-bar">
        <img
          src="/assets/chips-logo.svg"
          alt="CHiPS - Chhattisgarh Infotech Promotion Society"
          className="welcome-chips-logo"
        />
      </div>

      {/* 3. Centered Main Title, Chest & Action Stack */}
      <div className="welcome-center-content">
        {/* Ornate Indian Traditional Lotus & Filigree Divider */}
        <div className="title-filigree-divider" aria-hidden="true">
          <svg viewBox="0 0 320 32" width="280" height="28" fill="none">
            {/* Flanking Gold Vine Lines */}
            <path
              d="M 15 16 L 105 16 M 215 16 L 305 16"
              stroke="url(#filigreeGoldGrad)"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
            {/* Outer Diamond Finials */}
            <polygon points="12,16 16,12 20,16 16,20" fill="#C9A24A" />
            <polygon points="308,16 304,12 300,16 304,20" fill="#C9A24A" />

            {/* Symmetrical Scroll Vine Arches */}
            <path d="M 80,16 C 95,9 110,9 125,16" stroke="#C9A24A" strokeWidth="1.4" fill="none" />
            <path d="M 240,16 C 225,9 210,9 195,16" stroke="#C9A24A" strokeWidth="1.4" fill="none" />
            <circle cx="102" cy="12" r="2.5" fill="#14452F" stroke="#C9A24A" strokeWidth="1" />
            <circle cx="218" cy="12" r="2.5" fill="#14452F" stroke="#C9A24A" strokeWidth="1" />

            {/* Central Traditional Lotus Motif */}
            <g transform="translate(160, 16)">
              {/* Center Lotus Petal */}
              <path d="M 0,-12 C 4,-6 5,2 0,6 C -5,2 -4,-6 0,-12 Z" fill="#C9A24A" />
              {/* Left Lotus Petals */}
              <path d="M -2,-8 C -7,-5 -9,1 -5,6 C -2,4 -1,-1 -2,-8 Z" fill="#B88928" />
              <path d="M -5,-3 C -13,-1 -14,6 -9,9 C -6,7 -4,2 -5,-3 Z" fill="#8C6314" />
              {/* Right Lotus Petals */}
              <path d="M 2,-8 C 7,-5 9,1 5,6 C 2,4 1,-1 2,-8 Z" fill="#E2B74B" />
              <path d="M 5,-3 C 13,-1 14,6 9,9 C 6,7 4,2 5,-3 Z" fill="#C9A24A" />
              {/* Central Golden Bindi Jewel */}
              <circle cx="0" cy="0" r="2.5" fill="#FFFFFF" />
            </g>

            <defs>
              <linearGradient id="filigreeGoldGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#C9A24A" stopOpacity="0.1" />
                <stop offset="35%" stopColor="#C9A24A" />
                <stop offset="50%" stopColor="#FFF2A3" />
                <stop offset="65%" stopColor="#C9A24A" />
                <stop offset="100%" stopColor="#C9A24A" stopOpacity="0.1" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Main Title: CHHATTISGARH DIGITAL EXPLORER */}
        <h1 className="welcome-main-title">
          <span className="title-word-state">CHHATTISGARH</span>
          <span className="title-word-explorer">DIGITAL EXPLORER</span>
        </h1>

        {/* Subtitle: A DIGITAL TREASURE HUNT */}
        <p className="welcome-subtitle">A DIGITAL TREASURE HUNT</p>

        {/* Ornate Bottom Indian Cartouche Flourish */}
        <div className="title-bottom-ornament" aria-hidden="true">
          <svg viewBox="0 0 140 20" width="120" height="18" fill="none">
            {/* Central Diamond Jewel */}
            <polygon points="70,2 78,10 70,18 62,10" fill="#14452F" stroke="#C9A24A" strokeWidth="1.5" />
            <polygon points="70,5 75,10 70,15 65,10" fill="#C9A24A" />
            <circle cx="70" cy="10" r="2" fill="#FFFFFF" />

            {/* Left Wing Flourish */}
            <line x1="8" y1="10" x2="52" y2="10" stroke="#C9A24A" strokeWidth="1.4" strokeLinecap="round" />
            <circle cx="22" cy="10" r="2.5" fill="#14452F" stroke="#C9A24A" strokeWidth="1" />
            <circle cx="42" cy="10" r="2" fill="#C9A24A" />

            {/* Right Wing Flourish */}
            <line x1="88" y1="10" x2="132" y2="10" stroke="#C9A24A" strokeWidth="1.4" strokeLinecap="round" />
            <circle cx="98" cy="10" r="2" fill="#C9A24A" />
            <circle cx="118" cy="10" r="2.5" fill="#14452F" stroke="#C9A24A" strokeWidth="1" />
          </svg>
        </div>

        {/* 4. Dimensional Open Glowing Treasure Chest */}
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
            <span className="start-btn-icon-wrap" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" className="start-btn-chevron">
                <path
                  d="M 9 5 L 16 12 L 9 19"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
