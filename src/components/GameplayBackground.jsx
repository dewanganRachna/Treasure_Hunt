import React from 'react';

/**
 * GameplayBackground - Immersive, Polished Chhattisgarh Environmental Background
 * Rendered behind the stationary 3D map world across Panels 2 to 8.
 *
 * Features:
 * - Distant Maikal & Bastar mountain ridges with atmospheric depth and soft misty dissolution
 * - Warm golden morning sunrise glow and subtle expanding light rays
 * - Natural left & right flanking plateaus with sage/forest greens and gold contour lines
 * - Graceful winding river Mahanadi meandering through the left valley
 * - Stylized 2.5D Sal trees positioned along peripheral ridges
 * - Foreground botanical Sal/Teak leaves framing bottom corners
 * - Luminous central ambient light cushion ensuring the hero 3D map has exceptional contrast
 * - Refined royal Indian exhibition gold cartographic border with corner filigree
 */
export default function GameplayBackground() {
  return (
    <div className="gameplay-scenic-bg" aria-hidden="true">
      <svg
        viewBox="0 0 1920 1080"
        className="gameplay-scenic-svg"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* 1. Morning Sky Gradient */}
          <linearGradient id="gameSkyGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FFFDF9" />
            <stop offset="30%" stopColor="#FAF4E3" />
            <stop offset="60%" stopColor="#F4E6C9" />
            <stop offset="85%" stopColor="#E8D4B2" />
            <stop offset="100%" stopColor="#DAC5A2" />
          </linearGradient>

          {/* 2. Soft Sunrise Glow Radial */}
          <radialGradient id="gameSunAura" cx="50%" cy="16%" r="55%">
            <stop offset="0%" stopColor="#FFF8DE" stopOpacity="0.85" />
            <stop offset="25%" stopColor="#FDEAB2" stopOpacity="0.45" />
            <stop offset="60%" stopColor="#F6DA96" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#F6DA96" stopOpacity="0" />
          </radialGradient>

          {/* 3. Central Map Ambient Light Cushion */}
          {/* Luminous soft-cream halo directly behind the 3D map */}
          <radialGradient id="gameMapBacklight" cx="50%" cy="48%" r="48%">
            <stop offset="0%" stopColor="#FFFDF8" stopOpacity="0.95" />
            <stop offset="35%" stopColor="#FBF4E4" stopOpacity="0.8" />
            <stop offset="65%" stopColor="#F3E5C6" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#F3E5C6" stopOpacity="0" />
          </radialGradient>

          {/* 4. Translucent Sunburst Rays Gradient */}
          <linearGradient id="gameRayGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FFF8D5" stopOpacity="0.28" />
            <stop offset="45%" stopColor="#FEE7A0" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#FCE082" stopOpacity="0" />
          </linearGradient>

          {/* 5. Mountain Layer 1 Gradient: Dissolves into valley mist */}
          <linearGradient id="gameMountFarGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#B8CFBF" stopOpacity="0.85" />
            <stop offset="40%" stopColor="#9EBEAC" stopOpacity="0.75" />
            <stop offset="75%" stopColor="#85AC98" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#F8F0DC" stopOpacity="0" />
          </linearGradient>

          {/* 6. Mountain Layer 2 Gradient: Mid Forested Ridges */}
          <linearGradient id="gameMountMidGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#73A081" stopOpacity="0.85" />
            <stop offset="45%" stopColor="#558363" stopOpacity="0.75" />
            <stop offset="80%" stopColor="#3E6B4C" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#F8F0DC" stopOpacity="0" />
          </linearGradient>

          {/* 7. Left Flanking Slope Gradient (fades gracefully into central valley) */}
          <linearGradient id="gameSlopeLeftGrad" x1="0" y1="0" x2="1" y2="0.3">
            <stop offset="0%" stopColor="#255434" stopOpacity="0.92" />
            <stop offset="35%" stopColor="#386A46" stopOpacity="0.85" />
            <stop offset="70%" stopColor="#4E825D" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#4E825D" stopOpacity="0" />
          </linearGradient>

          {/* 8. Right Flanking Slope Gradient (fades gracefully into central valley) */}
          <linearGradient id="gameSlopeRightGrad" x1="1" y1="0" x2="0" y2="0.3">
            <stop offset="0%" stopColor="#224E30" stopOpacity="0.92" />
            <stop offset="35%" stopColor="#32633F" stopOpacity="0.85" />
            <stop offset="70%" stopColor="#4A7B58" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#4A7B58" stopOpacity="0" />
          </linearGradient>

          {/* 9. River Mahanadi Water Gradient */}
          <linearGradient id="gameRiverGrad" x1="0" y1="0" x2="1" y2="0.8">
            <stop offset="0%" stopColor="#BAE6FD" />
            <stop offset="35%" stopColor="#7DD3FC" />
            <stop offset="70%" stopColor="#38BDF8" />
            <stop offset="100%" stopColor="#0284C7" />
          </linearGradient>

          {/* 10. Stylized Sal Tree Symbol (Round Canopy) */}
          <g id="sal-tree-round">
            {/* Ground shadow */}
            <ellipse cx="0" cy="6" rx="13" ry="4.5" fill="#132B1A" opacity="0.28" />
            {/* Wooden Trunk */}
            <path d="M -2 0 L -3 6 L 3 6 L 2 0 Z" fill="#3D291C" />
            {/* Layered Foliage */}
            <circle cx="0" cy="-5" r="11" fill="#1B4D2A" />
            <circle cx="-3" cy="-9" r="9" fill="#2E7544" />
            <circle cx="3" cy="-8" r="8.5" fill="#368650" />
            <circle cx="0" cy="-13" r="6.5" fill="#4CAF50" />
            <circle cx="1.5" cy="-14.5" r="3.5" fill="#81C784" opacity="0.85" />
          </g>

          {/* 11. Stylized Sal Tree Symbol (Conical Variant) */}
          <g id="sal-tree-cone">
            {/* Ground shadow */}
            <ellipse cx="0" cy="8" rx="14" ry="4.8" fill="#132B1A" opacity="0.25" />
            {/* Wooden Trunk */}
            <path d="M -2 0 L -3 8 L 3 8 L 2 0 Z" fill="#362215" />
            {/* Tiered Foliage Cones */}
            <polygon points="0,-2 -13,7 13,7" fill="#174424" />
            <polygon points="0,-2 0,7 13,7" fill="#1E542D" />
            <polygon points="0,-9 -10,0 10,0" fill="#296B3A" />
            <polygon points="0,-9 0,0 10,0" fill="#35854A" />
            <polygon points="0,-16 -7,-6 7,-6" fill="#439E59" />
            <polygon points="0,-16 0,-6 7,-6" fill="#66BB6A" />
            <circle cx="1" cy="-18" r="2.5" fill="#A5D6A7" opacity="0.8" />
          </g>
        </defs>

        {/* ================================================================= */}
        {/* 1. BASE SKY & MORNING SUNLIGHT                                    */}
        {/* ================================================================= */}
        {/* Sky Fill */}
        <rect width="1920" height="1080" fill="url(#gameSkyGrad)" />

        {/* Sunrise Aura */}
        <rect width="1920" height="1080" fill="url(#gameSunAura)" />

        {/* Volumetric Sunburst Rays */}
        <g opacity="0.8">
          <polygon points="960,110 80,0 220,0" fill="url(#gameRayGrad)" />
          <polygon points="960,110 420,0 560,0" fill="url(#gameRayGrad)" />
          <polygon points="960,110 740,0 880,0" fill="url(#gameRayGrad)" />
          <polygon points="960,110 1040,0 1180,0" fill="url(#gameRayGrad)" />
          <polygon points="960,110 1360,0 1500,0" fill="url(#gameRayGrad)" />
          <polygon points="960,110 1700,0 1840,0" fill="url(#gameRayGrad)" />
        </g>

        {/* ================================================================= */}
        {/* 2. LAYER 1: DISTANT MAIKAL MOUNTAIN RIDGES                        */}
        {/* Undulating ridge that dissolves softly into valley mist           */}
        {/* ================================================================= */}
        <path
          d="M 0 310
             C 140 270, 280 230, 420 260
             C 560 290, 700 220, 840 200
             C 980 185, 1100 245, 1220 220
             C 1360 190, 1500 260, 1640 235
             C 1760 215, 1850 265, 1920 240
             L 1920 640
             C 1600 680, 1200 700, 960 700
             C 720 700, 320 680, 0 640 Z"
          fill="url(#gameMountFarGrad)"
        />

        {/* ================================================================= */}
        {/* 3. LAYER 2: MID FORESTRY RIDGES                                   */}
        {/* Forested hilltops dissolving gently into the midground            */}
        {/* ================================================================= */}
        <path
          d="M 0 380
             C 150 340, 300 390, 450 360
             C 600 330, 750 400, 900 370
             C 1050 340, 1200 410, 1350 375
             C 1500 340, 1650 400, 1800 355
             C 1860 340, 1890 365, 1920 350
             L 1920 720
             C 1500 750, 1100 760, 960 760
             C 820 760, 420 750, 0 720 Z"
          fill="url(#gameMountMidGrad)"
        />

        {/* ================================================================= */}
        {/* 4. CENTRAL AMBIENT LIGHT CUSHION                                  */}
        {/* Luminous halo right behind the 3D map, keeping map clear & high contrast */}
        {/* ================================================================= */}
        <ellipse cx="960" cy="520" rx="720" ry="480" fill="url(#gameMapBacklight)" />

        {/* ================================================================= */}
        {/* 5. PERIPHERAL FLANKING PLATEAUS & SLOPES                          */}
        {/* Slopes that frame the left & right sides without invading center  */}
        {/* ================================================================= */}

        {/* Left Side Plateau Slopes */}
        <path
          d="M 0 440
             C 100 440, 180 480, 250 530
             C 320 580, 370 650, 400 730
             C 420 790, 400 870, 360 950
             C 310 1020, 200 1060, 0 1080 Z"
          fill="url(#gameSlopeLeftGrad)"
        />

        {/* Left Topographic Contours (faint gold lines) */}
        <path
          d="M 0 490 C 80 495, 150 530, 210 570 C 270 610, 310 670, 335 740 C 350 790, 335 860, 290 940"
          fill="none"
          stroke="#C9A24A"
          strokeWidth="1.2"
          strokeOpacity="0.22"
          strokeDasharray="6,4"
        />
        <path
          d="M 0 570 C 60 580, 120 610, 170 650 C 220 690, 250 750, 265 810 C 275 850, 260 910, 210 980"
          fill="none"
          stroke="#C9A24A"
          strokeWidth="1"
          strokeOpacity="0.18"
          strokeDasharray="5,4"
        />

        {/* Right Side Plateau & Cliff Slopes */}
        <path
          d="M 1920 420
             C 1820 430, 1740 480, 1670 530
             C 1600 580, 1550 650, 1520 730
             C 1500 800, 1520 870, 1560 940
             C 1610 1010, 1710 1050, 1920 1080 Z"
          fill="url(#gameSlopeRightGrad)"
        />

        {/* Right Topographic Contours */}
        <path
          d="M 1920 470 C 1840 480, 1770 520, 1710 570 C 1650 620, 1610 680, 1585 750 C 1570 800, 1585 870, 1630 950"
          fill="none"
          stroke="#C9A24A"
          strokeWidth="1.2"
          strokeOpacity="0.22"
          strokeDasharray="6,4"
        />
        <path
          d="M 1920 550 C 1860 560, 1800 600, 1750 640 C 1700 680, 1670 740, 1655 800 C 1645 840, 1660 900, 1710 970"
          fill="none"
          stroke="#C9A24A"
          strokeWidth="1"
          strokeOpacity="0.18"
          strokeDasharray="5,4"
        />

        {/* ================================================================= */}
        {/* 6. MEANDERING RIVER MAHANADI (LEFT VALLEY)                         */}
        {/* Graceful ribbon that curls down the left terrain                  */}
        {/* ================================================================= */}
        {/* Sandy Shore */}
        <path
          d="M 0 665
             C 70 680, 140 720, 175 770
             C 210 820, 190 880, 145 940
             C 105 990, 130 1040, 200 1080
             L 165 1080
             C 100 1040, 75 990, 115 940
             C 160 880, 175 830, 145 780
             C 115 730, 50 690, 0 680 Z"
          fill="#DFC9A5"
          opacity="0.6"
        />

        {/* Water Stream */}
        <path
          d="M 0 668
             C 65 683, 135 722, 170 772
             C 205 822, 185 882, 140 940
             C 100 990, 125 1040, 190 1080
             L 170 1080
             C 108 1040, 85 992, 122 942
             C 165 882, 180 832, 150 782
             C 120 732, 55 692, 0 678 Z"
          fill="url(#gameRiverGrad)"
          opacity="0.9"
        />

        {/* River Sparkle / Flow Highlights */}
        <path
          d="M 20 680 C 80 705, 140 745, 165 785"
          fill="none"
          stroke="#E0F2FE"
          strokeWidth="1.6"
          strokeOpacity="0.75"
          strokeLinecap="round"
        />
        <path
          d="M 170 820 C 185 860, 160 910, 135 950"
          fill="none"
          stroke="#E0F2FE"
          strokeWidth="1.5"
          strokeOpacity="0.65"
          strokeLinecap="round"
        />

        {/* ================================================================= */}
        {/* 7. STYLIZED SAL TREE CLUSTERS (PERIPHERAL RIDGES)                  */}
        {/* Carefully clustered on left & right slopes                        */}
        {/* ================================================================= */}
        {/* Left Side Groves */}
        <g transform="translate(60, 480) scale(1.15)"><use href="#sal-tree-round" /></g>
        <g transform="translate(120, 510) scale(1.05)"><use href="#sal-tree-cone" /></g>
        <g transform="translate(170, 545) scale(0.95)"><use href="#sal-tree-round" /></g>
        <g transform="translate(85, 570) scale(1.2)"><use href="#sal-tree-round" /></g>
        <g transform="translate(145, 605) scale(1.1)"><use href="#sal-tree-cone" /></g>

        <g transform="translate(50, 720) scale(1.3)"><use href="#sal-tree-round" /></g>
        <g transform="translate(115, 760) scale(1.25)"><use href="#sal-tree-cone" /></g>
        <g transform="translate(175, 810) scale(1.1)"><use href="#sal-tree-round" /></g>
        <g transform="translate(80, 840) scale(1.35)"><use href="#sal-tree-cone" /></g>
        <g transform="translate(145, 885) scale(1.2)"><use href="#sal-tree-round" /></g>

        {/* Right Side Groves */}
        <g transform="translate(1860, 460) scale(1.1)"><use href="#sal-tree-round" /></g>
        <g transform="translate(1790, 490) scale(1.15)"><use href="#sal-tree-cone" /></g>
        <g transform="translate(1730, 530) scale(1.0)"><use href="#sal-tree-round" /></g>
        <g transform="translate(1840, 560) scale(1.2)"><use href="#sal-tree-cone" /></g>
        <g transform="translate(1770, 595) scale(1.1)"><use href="#sal-tree-round" /></g>

        <g transform="translate(1870, 720) scale(1.25)"><use href="#sal-tree-round" /></g>
        <g transform="translate(1800, 760) scale(1.3)"><use href="#sal-tree-cone" /></g>
        <g transform="translate(1730, 805) scale(1.15)"><use href="#sal-tree-round" /></g>
        <g transform="translate(1835, 845) scale(1.35)"><use href="#sal-tree-cone" /></g>
        <g transform="translate(1765, 895) scale(1.2)"><use href="#sal-tree-round" /></g>

        {/* ================================================================= */}
        {/* 8. FOREGROUND BOTANICAL LEAF FRAMING (CORNERS)                    */}
        {/* Refined Sal/Teak leaves in deep forest green with gold veins      */}
        {/* ================================================================= */}
        {/* Bottom-Left Botanical Corner */}
        <g opacity="0.92">
          <path
            d="M -15 1090 C 25 1030, 80 970, 165 940 C 130 985, 95 1045, 55 1090 Z"
            fill="#123F27"
          />
          <path
            d="M -10 1090 C 28 1032, 82 974, 163 942"
            fill="none"
            stroke="#D4AF37"
            strokeWidth="1.8"
            strokeOpacity="0.7"
          />
          <path
            d="M -20 1020 C 35 980, 100 945, 185 930 C 145 970, 100 1010, 45 1040 Z"
            fill="#185234"
          />
          <path
            d="M -15 1020 C 38 982, 102 948, 183 932"
            fill="none"
            stroke="#FDE68A"
            strokeWidth="1.4"
            strokeOpacity="0.6"
          />
          <path
            d="M 40 1090 C 90 1040, 165 1005, 245 990 C 195 1030, 140 1065, 80 1090 Z"
            fill="#0E331F"
          />
        </g>

        {/* Bottom-Right Botanical Corner */}
        <g opacity="0.92">
          <path
            d="M 1935 1090 C 1895 1030, 1840 970, 1755 940 C 1790 985, 1825 1045, 1865 1090 Z"
            fill="#123F27"
          />
          <path
            d="M 1930 1090 C 1892 1032, 1838 974, 1757 942"
            fill="none"
            stroke="#D4AF37"
            strokeWidth="1.8"
            strokeOpacity="0.7"
          />
          <path
            d="M 1940 1020 C 1885 980, 1820 945, 1735 930 C 1775 970, 1820 1010, 1875 1040 Z"
            fill="#185234"
          />
          <path
            d="M 1935 1020 C 1882 982, 1818 948, 1737 932"
            fill="none"
            stroke="#FDE68A"
            strokeWidth="1.4"
            strokeOpacity="0.6"
          />
          <path
            d="M 1880 1090 C 1830 1040, 1755 1005, 1675 990 C 1725 1030, 1780 1065, 1840 1090 Z"
            fill="#0E331F"
          />
        </g>

        {/* ================================================================= */}
        {/* 9. RESTRAINED ROYAL INDIAN EXHIBITION BORDER & CORNER FLOURISHES   */}
        {/* Fine gold double-line cartographic framing anchored to stage      */}
        {/* ================================================================= */}
        <g opacity="0.65">
          {/* Outer Gold Frame */}
          <rect
            x="20"
            y="18"
            width="1880"
            height="1044"
            rx="10"
            fill="none"
            stroke="#C9A24A"
            strokeWidth="1.6"
          />
          {/* Inner Hairline Frame */}
          <rect
            x="26"
            y="24"
            width="1868"
            height="1032"
            rx="8"
            fill="none"
            stroke="#D4AF37"
            strokeWidth="0.9"
            strokeDasharray="12,6"
          />

          {/* Traditional Indian Corner Filigree Brackets */}
          {/* Top-Left Corner */}
          <g transform="translate(24, 22)">
            <path d="M 0 28 L 0 8 C 0 3.6, 3.6 0, 8 0 L 28 0" fill="none" stroke="#C9A24A" strokeWidth="2.5" />
            <polygon points="6,6 10,2 14,6 10,10" fill="#14452F" stroke="#C9A24A" strokeWidth="1" />
            <circle cx="10" cy="10" r="1.5" fill="#FDE68A" />
          </g>

          {/* Top-Right Corner */}
          <g transform="translate(1896, 22)">
            <path d="M 0 28 L 0 8 C 0 3.6, -3.6 0, -8 0 L -28 0" fill="none" stroke="#C9A24A" strokeWidth="2.5" />
            <polygon points="-6,6 -10,2 -14,6 -10,10" fill="#14452F" stroke="#C9A24A" strokeWidth="1" />
            <circle cx="-10" cy="10" r="1.5" fill="#FDE68A" />
          </g>

          {/* Bottom-Left Corner */}
          <g transform="translate(24, 1058)">
            <path d="M 0 -28 L 0 -8 C 0 -3.6, 3.6 0, 8 0 L 28 0" fill="none" stroke="#C9A24A" strokeWidth="2.5" />
            <polygon points="6,-6 10,-2 14,-6 10,-10" fill="#14452F" stroke="#C9A24A" strokeWidth="1" />
            <circle cx="10" cy="-10" r="1.5" fill="#FDE68A" />
          </g>

          {/* Bottom-Right Corner */}
          <g transform="translate(1896, 1058)">
            <path d="M 0 -28 L 0 -8 C 0 -3.6, -3.6 0, -8 0 L -28 0" fill="none" stroke="#C9A24A" strokeWidth="2.5" />
            <polygon points="-6,-6 -10,-2 -14,-6 -10,-10" fill="#14452F" stroke="#C9A24A" strokeWidth="1" />
            <circle cx="-10" cy="-10" r="1.5" fill="#FDE68A" />
          </g>
        </g>
      </svg>
    </div>
  );
}
