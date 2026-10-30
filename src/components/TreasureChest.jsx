import { useImperativeHandle, useRef } from 'react';
import { t } from '../data/i18n';

// The drawing's box, in its own units: x -180…180, y -235…125 (the hint goes below the ground
// at 100). The chest's mouth, where the treasure flies out of, is at (0, MOUTH_Y).
const VIEW = { x: -180, y: -235, w: 360, h: 360 };
const MOUTH_Y = -40;

/** A small random generator with a fixed seed, so the heap is drawn the same every game. */
function seeded(seed) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

/** Coins heaped above the rim: rows that narrow towards the top, back rows first. */
const HEAP = (() => {
  const rand = seeded(11);
  const coins = [];
  for (let row = 9; row >= 0; row--) {
    const y = -4 - row * 9.6;
    const half = 108 * Math.sqrt(1 - row / 10.4);
    const n = Math.max(1, Math.round((half * 2) / 18));
    for (let i = 0; i < n; i++) {
      const x = -half + ((i + 0.5) * 2 * half) / n + (rand() - 0.5) * 6;
      coins.push({
        x: Math.round(x * 10) / 10,
        y: Math.round((y + (rand() - 0.5) * 4) * 10) / 10,
        id: rand() < 0.09 ? 'tcCE' : rand() < 0.4 ? 'tcC2' : 'tcC1',
        rot: Math.round((rand() - 0.5) * 24)
      });
    }
  }
  return coins;
})();

// Gems on the heap: [symbol, x, y, scale]
const JEWELS = [
  ['tcR', -82, -22, 1],
  ['tcE', 80, -18, 1],
  ['tcS', -88, -6, 0.9],
  ['tcR', 34, -26, 0.9],
  ['tcS', 8, -50, 1],
  ['tcE', -34, -40, 0.9],
  ['tcBar', 66, -56, 1],
  ['tcD', -52, -54, 1.25],
  ['tcD', 58, -40, 1],
  ['tcD', -16, -80, 0.9],
  ['tcD', 30, -76, 0.8],
  ['tcCrown', 0, -104, 1]
];

// Coins and gems tipped over the front edge and onto the ground: [symbol, x, y, rotation]
const SPILL = [
  ['tcC1', -98, -2, -14],
  ['tcCE', -66, 2, 12],
  ['tcC2', 72, 0, 10],
  ['tcC1', 100, -2, 16]
];
const GROUND = [
  ['tcC1', -146, 88, -8],
  ['tcC2', -126, 96, 6],
  ['tcCE', -108, 86, 20],
  ['tcD', -158, 80, 0],
  ['tcC1', 124, 94, 10],
  ['tcC2', 146, 86, -6],
  ['tcR', 108, 96, 0],
  ['tcC1', 160, 96, 4]
];

// A pearl necklace draped over the front: pearls along a curve
const PEARLS = Array.from({ length: 15 }, (_, i) => {
  const u = i / 14;
  // quadratic curve from (-74,-8) through a dip at (-34,34) to (8,-8)
  const x = (1 - u) * (1 - u) * -74 + 2 * (1 - u) * u * -34 + u * u * 8;
  const y = (1 - u) * (1 - u) * -8 + 2 * (1 - u) * u * 34 + u * u * -8;
  return [Math.round(x * 10) / 10, Math.round(y * 10) / 10];
});

// Twinkles over the open chest: [x, y, scale, delay s]
const SPARKS = [
  [-60, -70, 1, 0],
  [52, -60, 0.8, 0.35],
  [0, -138, 1.2, 0.7],
  [-100, -30, 0.7, 0.2],
  [96, -28, 0.9, 0.55],
  [-22, -96, 0.7, 0.9],
  [30, -110, 0.8, 0.15],
  [-128, -80, 0.9, 0.45],
  [126, -96, 1, 0.8]
];

const STAR4 = 'M0,-10 L2.4,-2.4 L10,0 L2.4,2.4 L0,10 L-2.4,2.4 L-10,0 L-2.4,-2.4 Z';

/**
 * The big treasure chest of the win. It grows out of the small chest on the map (from), rattles,
 * then flips its lid open on a heap of gold, gems and diamonds. Once open, a tap throws more
 * treasure out (onTap).
 * stage: 'in' | 'rattle' | 'open'. x, y: its centre on the stage; size: its width and height.
 */
export default function TreasureChest({ ref, stage, x, y, size, from, lang, onTap }) {
  const btnRef = useRef(null);
  const open = stage === 'open';

  useImperativeHandle(ref, () => ({
    /** Where the treasure flies out of, in stage pixels. */
    mouth() {
      return { x, y: y + ((MOUTH_Y - VIEW.y) / VIEW.h - 0.5) * size };
    }
  }));

  const tap = () => {
    if (!open) return;
    const el = btnRef.current;
    if (el) {
      el.classList.remove('jig');
      void el.offsetWidth; // restart the bounce
      el.classList.add('jig');
    }
    onTap();
  };

  return (
    <button
      type="button"
      ref={btnRef}
      className={`tc ${stage}`}
      style={{
        left: x - size / 2,
        top: y - size / 2,
        width: size,
        height: size,
        '--fx': `${from ? from.x - x : 0}px`,
        '--fy': `${from ? from.y - y : 0}px`
      }}
      onClick={tap}
      aria-label={t(lang, 'tapChest')}
      tabIndex={open ? 0 : -1}
    >
      <svg viewBox={`${VIEW.x} ${VIEW.y} ${VIEW.w} ${VIEW.h}`} width={size} height={size} aria-hidden="true">
        <defs>
          <linearGradient id="tcWood" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#b8692a" />
            <stop offset="1" stopColor="#6e3410" />
          </linearGradient>
          <linearGradient id="tcWoodL" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#cf8840" />
            <stop offset="1" stopColor="#8a4818" />
          </linearGradient>
          <linearGradient id="tcIn" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#6b3c16" />
            <stop offset="1" stopColor="#2e1806" />
          </linearGradient>
          <linearGradient id="tcGold" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#fff0b8" />
            <stop offset=".42" stopColor="#e6b448" />
            <stop offset=".62" stopColor="#c08a12" />
            <stop offset="1" stopColor="#8a5f12" />
          </linearGradient>
          <radialGradient id="tcCoinA" cx=".38" cy=".32">
            <stop offset="0" stopColor="#fff6c4" />
            <stop offset=".5" stopColor="#f4c64e" />
            <stop offset="1" stopColor="#c8901e" />
          </radialGradient>
          <radialGradient id="tcCoinB" cx=".38" cy=".32">
            <stop offset="0" stopColor="#ffe9a0" />
            <stop offset=".55" stopColor="#dca232" />
            <stop offset="1" stopColor="#a86e10" />
          </radialGradient>
          <linearGradient id="tcDia" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#ffffff" />
            <stop offset=".5" stopColor="#d4f1ff" />
            <stop offset="1" stopColor="#8fcdf0" />
          </linearGradient>
          <radialGradient id="tcRuby" cx=".35" cy=".3">
            <stop offset="0" stopColor="#ffa196" />
            <stop offset=".5" stopColor="#dc3328" />
            <stop offset="1" stopColor="#861a12" />
          </radialGradient>
          <radialGradient id="tcEm" cx=".35" cy=".3">
            <stop offset="0" stopColor="#a6f0c6" />
            <stop offset=".5" stopColor="#2aa368" />
            <stop offset="1" stopColor="#135236" />
          </radialGradient>
          <radialGradient id="tcSap" cx=".35" cy=".3">
            <stop offset="0" stopColor="#a8dcff" />
            <stop offset=".5" stopColor="#2f7fd0" />
            <stop offset="1" stopColor="#163f78" />
          </radialGradient>
          <radialGradient id="tcGlow">
            <stop offset="0" stopColor="#fff6cf" stopOpacity=".95" />
            <stop offset=".5" stopColor="#ffd96e" stopOpacity=".45" />
            <stop offset="1" stopColor="#ffc93c" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="tcFlash">
            <stop offset="0" stopColor="#ffffff" />
            <stop offset=".6" stopColor="#fff3c0" stopOpacity=".7" />
            <stop offset="1" stopColor="#ffe28a" stopOpacity="0" />
          </radialGradient>
          <filter id="tcBlur" x="-20%" y="-300%" width="140%" height="700%">
            <feGaussianBlur stdDeviation="3" />
          </filter>
          <clipPath id="tcDome">
            <path d="M-118,-6 Q-120,-96 0,-100 Q120,-96 118,-6 Z" />
          </clipPath>

          <g id="tcC1">
            <ellipse rx="12" ry="7" fill="url(#tcCoinA)" stroke="#8a5a0c" strokeWidth="1.1" />
            <ellipse rx="7.6" ry="4.2" fill="none" stroke="#fff1bf" strokeOpacity=".75" />
            <ellipse cx="-4" cy="-2.4" rx="3.2" ry="1.4" fill="#fffbe8" fillOpacity=".8" />
          </g>
          <g id="tcC2">
            <ellipse rx="12" ry="7" fill="url(#tcCoinB)" stroke="#7a4e08" strokeWidth="1.1" />
            <ellipse rx="7.6" ry="4.2" fill="none" stroke="#ffe7a0" strokeOpacity=".6" />
          </g>
          <g id="tcCE">
            <rect x="-3.4" y="-10.5" width="6.8" height="21" rx="3.2" fill="url(#tcCoinB)" stroke="#7a4e08" strokeWidth="1.1" />
            <path d="M-1,-8 V8" stroke="#fff3c4" strokeOpacity=".7" strokeWidth="1.2" />
          </g>
          <g id="tcD">
            <path d="M-14,-3 L-8,-11 H8 L14,-3 Z" fill="#f4fcff" stroke="#4f9ccc" strokeWidth="1.1" strokeLinejoin="round" />
            <path d="M-14,-3 H14 L0,15 Z" fill="url(#tcDia)" stroke="#4f9ccc" strokeWidth="1.1" strokeLinejoin="round" />
            <path d="M-8,-11 L-4,-3 L0,15 L4,-3 L8,-11 M0,-11 L-4,-3 M0,-11 L4,-3 M-14,-3 L0,15 M14,-3 L0,15" fill="none" stroke="#6fb4dc" strokeWidth=".7" />
            <path d="M-10,-4 L-6,-9 L-4,-4 Z" fill="#fff" />
          </g>
          <g id="tcR">
            <ellipse rx="9" ry="7.2" fill="url(#tcRuby)" stroke="#6d1610" strokeWidth="1" />
            <path d="M-5,-2 L0,-5 L5,-2 L0,1 Z" fill="#ffc9c2" fillOpacity=".55" />
            <ellipse cx="-3.4" cy="-3.2" rx="2" ry="1.2" fill="#fff" fillOpacity=".85" />
          </g>
          <g id="tcE">
            <path d="M-7,-8 H7 L10,-5 V5 L7,8 H-7 L-10,5 V-5 Z" fill="url(#tcEm)" stroke="#0f4029" strokeWidth="1" />
            <rect x="-5" y="-4.5" width="10" height="9" fill="none" stroke="#c6f5dc" strokeOpacity=".55" />
            <path d="M-6,-6 L-2,-6 L-5,-3 Z" fill="#fff" fillOpacity=".85" />
          </g>
          <g id="tcS">
            <path d="M0,-9 L9,0 L0,9 L-9,0 Z" fill="url(#tcSap)" stroke="#12305c" strokeWidth="1" strokeLinejoin="round" />
            <path d="M0,-9 L0,9 M-9,0 L9,0" stroke="#cfe9ff" strokeOpacity=".45" strokeWidth=".7" />
            <path d="M-2,-6 L-5,-2 L-2,-3 Z" fill="#fff" fillOpacity=".9" />
          </g>
          <g id="tcBar">
            <path d="M-17,6 L-12,-6 H12 L17,6 Z" fill="url(#tcGold)" stroke="#7a4e08" strokeWidth="1.1" strokeLinejoin="round" transform="rotate(-18)" />
            <path d="M-9,-3 H6" stroke="#fff6cc" strokeOpacity=".8" strokeWidth="1.4" transform="rotate(-18)" />
          </g>
          <g id="tcCrown">
            <path d="M-26,12 L-30,-14 L-15,-2 L0,-22 L15,-2 L30,-14 L26,12 Z" fill="url(#tcGold)" stroke="#7a4e08" strokeWidth="1.4" strokeLinejoin="round" />
            <rect x="-27" y="6" width="54" height="8" rx="2" fill="url(#tcGold)" stroke="#7a4e08" strokeWidth="1.2" />
            <circle cx="-30" cy="-15" r="3.4" fill="#fff4cc" stroke="#7a4e08" />
            <circle cx="0" cy="-23" r="3.8" fill="#fff4cc" stroke="#7a4e08" />
            <circle cx="30" cy="-15" r="3.4" fill="#fff4cc" stroke="#7a4e08" />
            <use href="#tcR" transform="translate(0 0) scale(.55)" />
            <use href="#tcS" transform="translate(-15 4) scale(.4)" />
            <use href="#tcE" transform="translate(15 4) scale(.4)" />
          </g>
        </defs>

        <ellipse className="tc-glow" cx="0" cy="-60" rx="168" ry="152" fill="url(#tcGlow)" />
        <g className="tc-rays">
          {Array.from({ length: 12 }, (_, i) => (
            <polygon key={i} points="0,-50 -13,-280 13,-280" fill="#fff0b0" fillOpacity=".34" transform={`rotate(${i * 30} 0 -50)`} />
          ))}
        </g>

        <ellipse cx="0" cy="88" rx="140" ry="14" fill="#3a2410" opacity=".28" />

        <g className="tc-chest">
          {/* Inside of the open lid, behind the treasure */}
          <g className="tc-olid">
            <path d="M-112,-14 L-124,-150 Q0,-176 124,-150 L112,-14 Z" fill="url(#tcIn)" stroke="#3d1f08" strokeWidth="2.4" strokeLinejoin="round" />
            <path d="M-100,-24 L-110,-140 Q0,-162 110,-140 L100,-24" fill="none" stroke="#241204" strokeOpacity=".45" strokeWidth="2" />
            <path d="M-86,-14 L-94,-158 L-76,-161 L-68,-14 Z M86,-14 L94,-158 L76,-161 L68,-14 Z" fill="url(#tcGold)" stroke="#5a3a0a" strokeWidth="1.2" />
            <path d="M-124,-150 Q0,-176 124,-150" fill="none" stroke="url(#tcGold)" strokeWidth="7" strokeLinecap="round" />
          </g>

          {/* The heap of treasure, rising out of the box when it opens */}
          <g className="tc-pile">
            <path d="M-112,-6 Q-110,-60 -60,-84 Q0,-112 60,-84 Q110,-60 112,-6 Z" fill="#e7b443" />
            {HEAP.map((c, i) => (
              <use key={i} href={`#${c.id}`} transform={`translate(${c.x} ${c.y}) rotate(${c.rot})`} />
            ))}
            {JEWELS.map(([id, jx, jy, s], i) => (
              <use key={i} href={`#${id}`} transform={`translate(${jx} ${jy}) scale(${s})`} />
            ))}
          </g>

          {/* Front of the box */}
          <path d="M-116,-8 H116 V72 Q116,84 104,84 H-104 Q-116,84 -116,72 Z" fill="url(#tcWood)" stroke="#3d1f08" strokeWidth="2.4" strokeLinejoin="round" />
          <path d="M-116,22 H116 M-116,52 H116" stroke="#3d1f08" strokeOpacity=".35" strokeWidth="1.4" />
          <path d="M-56,8 Q-30,4 -10,10 M20,36 Q44,32 56,38 M-50,66 Q-30,62 -14,68" fill="none" stroke="#3d1f08" strokeOpacity=".18" strokeWidth="1.2" />
          <rect x="-86" y="-8" width="18" height="92" fill="url(#tcGold)" stroke="#5a3a0a" strokeWidth="1.2" />
          <rect x="68" y="-8" width="18" height="92" fill="url(#tcGold)" stroke="#5a3a0a" strokeWidth="1.2" />
          {[6, 32, 58, 76].map((ry) => (
            <g key={ry} fill="#6b4712">
              <circle cx="-77" cy={ry} r="2.2" />
              <circle cx="77" cy={ry} r="2.2" />
            </g>
          ))}
          <path d="M-116,56 V72 Q-116,84 -104,84 H-92 V70 Q-102,70 -102,56 Z M116,56 V72 Q116,84 104,84 H92 V70 Q102,70 102,56 Z" fill="url(#tcGold)" stroke="#5a3a0a" strokeWidth="1.2" />
          <rect x="-122" y="-16" width="244" height="12" rx="4" fill="url(#tcGold)" stroke="#5a3a0a" strokeWidth="1.4" />
          <path d="M-20,-4 H20 V26 Q20,40 0,47 Q-20,40 -20,26 Z" fill="url(#tcGold)" stroke="#5a3a0a" strokeWidth="1.5" strokeLinejoin="round" />
          <circle cy="14" r="4.6" fill="#3a2208" />
          <path d="M-2,16 H2 L3,29 H-3 Z" fill="#3a2208" />

          {/* Overflowing: coins over the rim and a pearl necklace hanging down the front */}
          <g className="tc-spill">
            {SPILL.map(([id, sx, sy, r], i) => (
              <use key={i} href={`#${id}`} transform={`translate(${sx} ${sy}) rotate(${r})`} />
            ))}
            {PEARLS.map(([px, py], i) => (
              <circle key={i} cx={px} cy={py} r="3.4" fill="#fffdf6" stroke="#c9b68a" strokeWidth=".7" />
            ))}
            <use href="#tcR" transform="translate(-33 41) scale(.8)" />
          </g>

          {/* Seam of light while the chest rattles */}
          <rect className="tc-seam" x="-114" y="-13" width="228" height="7" rx="3.5" fill="#fff6cf" filter="url(#tcBlur)" />

          {/* Closed lid */}
          <g className="tc-lid">
            <path d="M-118,-6 Q-120,-96 0,-100 Q120,-96 118,-6 Z" fill="url(#tcWoodL)" stroke="#3d1f08" strokeWidth="2.4" strokeLinejoin="round" />
            <path d="M-117,-34 Q0,-62 117,-34 M-114,-62 Q0,-88 114,-62" fill="none" stroke="#3d1f08" strokeOpacity=".28" strokeWidth="1.4" />
            <g clipPath="url(#tcDome)">
              <rect x="-86" y="-104" width="18" height="100" fill="url(#tcGold)" stroke="#5a3a0a" strokeWidth="1.2" />
              <rect x="68" y="-104" width="18" height="100" fill="url(#tcGold)" stroke="#5a3a0a" strokeWidth="1.2" />
            </g>
            <path d="M-92,-52 Q-64,-86 -6,-92" fill="none" stroke="#fff" strokeOpacity=".22" strokeWidth="7" strokeLinecap="round" />
            <rect x="-122" y="-16" width="244" height="12" rx="4" fill="url(#tcGold)" stroke="#5a3a0a" strokeWidth="1.4" />
            <path d="M-13,-44 H13 V-10 Q0,-2 -13,-10 Z" fill="url(#tcGold)" stroke="#5a3a0a" strokeWidth="1.4" strokeLinejoin="round" />
            <rect x="-3" y="-34" width="6" height="14" rx="3" fill="#3a2208" />
          </g>
        </g>

        {/* Treasure that tumbled onto the ground */}
        <g className="tc-ground">
          {GROUND.map(([id, gx, gy, r], i) => (
            <g key={i} transform={`translate(${gx} ${gy})`}>
              <g className="tc-drop" style={{ animationDelay: `${0.35 + i * 0.07}s` }}>
                <use href={`#${id}`} transform={`rotate(${r})`} />
              </g>
            </g>
          ))}
        </g>

        <g className="tc-spk">
          {SPARKS.map(([sx, sy, s, d], i) => (
            <g key={i} transform={`translate(${sx} ${sy}) scale(${s})`}>
              <path d={STAR4} fill="#fffdf0" style={{ animationDelay: `${d}s` }} />
            </g>
          ))}
        </g>

        <circle className="tc-flash" cx="0" cy="-40" r="80" fill="url(#tcFlash)" />
      </svg>
      {open && <span className="tc-hint">{t(lang, 'tapChest')}</span>}
    </button>
  );
}
