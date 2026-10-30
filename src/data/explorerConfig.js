/**
 * Geometry, camera and timing for the Explorer map.
 * Values mirror docs/design-spec.json; map units are the overlay SVG's viewBox units.
 */

export const WORLD = { w: 1628, h: 2288, unitToPx: 2.2, viewBoxOrigin: -110 };

export const CAMERA = {
  playZoom: 0.8,
  // Area the overview fits into the map column: the state plus the title cartouche (map units)
  overviewBounds: { x0: -110, y0: -112, x1: 520, y1: 812 },
  flightMs: 2200,
  transition: 'transform 2.2s cubic-bezier(.45,.05,.2,1)'
};

/** Point the portrait overview camera is centred on (map units) */
const OVERVIEW = { x: 250, y: 420 };

// Landscape (kiosks, laptops): the 1280×720 design scaled to the screen, then stretched along
// the longer side so it fills the whole display; panels in a left column, map to the right.
const BASE_W = 1280;
const BASE_H = 720;
const HEADER_H = 66;
const MAP_LEFT = 504;
const PANEL_RIGHT = 488; // right edge of the left column

const landscapeCache = new Map();

function landscapeLayout(vw, vh) {
  const scale = Math.min(vw / BASE_W, vh / BASE_H);
  const w = Math.round(vw / scale);
  const h = Math.round(vh / scale);
  const key = `${w}x${h}`;
  if (!landscapeCache.has(key)) {
    // Overview: fit the state and its title cartouche into the map column
    const b = CAMERA.overviewBounds;
    const areaW = w - MAP_LEFT;
    const areaH = h - HEADER_H;
    const centreY = Math.round(HEADER_H + areaH / 2);
    landscapeCache.set(key, {
      portrait: false,
      w,
      h,
      headerH: HEADER_H,
      mapLeft: MAP_LEFT,
      mapRight: w,
      mapBottom: h,
      panelRight: PANEL_RIGHT,
      yAnchor: centreY,
      fitZoom: Math.min(areaW / ((b.x1 - b.x0) * WORLD.unitToPx), areaH / ((b.y1 - b.y0) * WORLD.unitToPx)),
      overview: { x: (b.x0 + b.x1) / 2, y: (b.y0 + b.y1) / 2 },
      overviewAnchor: centreY,
      overviewBottom: h
    });
  }
  return landscapeCache.get(key);
}

// Portrait (phones held upright): the stage is one panel wide and as tall as the screen allows
const PORTRAIT_W = 504;
const PORTRAIT_HEADER = 100;
const PORTRAIT_INTRO = 552; // intro panel plus its bottom gap
const PORTRAIT_CARD = 470; // typical question card plus its bottom gap
const STATE_SHARE_OF_WORLD_H = 0.76; // the state fills about this much of the terrain image's height

const portraitCache = new Map();

function portraitLayout(h) {
  if (!portraitCache.has(h)) {
    const overviewBottom = h - PORTRAIT_INTRO;
    const overviewH = overviewBottom - PORTRAIT_HEADER;
    portraitCache.set(h, {
      portrait: true,
      w: PORTRAIT_W,
      h,
      headerH: PORTRAIT_HEADER,
      mapLeft: 0,
      mapRight: PORTRAIT_W,
      panelRight: null, // panels sit below the map, not beside it
      // The card covers the bottom, so the map may scroll up to its top edge (lets Bastar clear the card)
      mapBottom: h - PORTRAIT_CARD,
      yAnchor: Math.round(PORTRAIT_HEADER + Math.max(90, (h - PORTRAIT_HEADER - PORTRAIT_CARD) / 2)),
      fitZoom: Math.min(0.45, Math.max(0.18, overviewH / (WORLD.h * STATE_SHARE_OF_WORLD_H))),
      overview: OVERVIEW,
      overviewAnchor: Math.round(PORTRAIT_HEADER + overviewH / 2),
      overviewBottom
    });
  }
  return portraitCache.get(h);
}

/** Pick the stage layout for a viewport. Returns cached objects so equal layouts compare equal. */
export function getLayout(vw, vh) {
  if (vw >= vh) return landscapeLayout(vw, vh);
  const h = Math.round(Math.min(1120, Math.max(820, (PORTRAIT_W * vh) / vw)) / 10) * 10;
  return portraitLayout(h);
}

/** Ten stops; the last one is the treasure at Bastar. */
export const WAYPOINTS = [
  { name: 'Surguja', nameHi: 'सरगुजा', x: 363.7, y: 166.6 },
  { name: 'Raigarh', nameHi: 'रायगढ़', x: 372.7, y: 270.4 },
  { name: 'Korba', nameHi: 'कोरबा', x: 292.8, y: 215.1 },
  { name: 'Bilaspur', nameHi: 'बिलासपुर', x: 231.6, y: 231.2 },
  { name: 'Kabirdham', nameHi: 'कबीरधाम', x: 134.0, y: 269.4 },
  { name: 'Rajnandgaon', nameHi: 'राजनांदगांव', x: 87.8, y: 398.7 },
  { name: 'Durg', nameHi: 'दुर्ग', x: 152.4, y: 376.5 },
  { name: 'Raipur', nameHi: 'रायपुर', x: 202.5, y: 368.5 },
  { name: 'Kanker', nameHi: 'कांकेर', x: 122.6, y: 509.5 },
  { name: 'Bastar', nameHi: 'बस्तर', x: 208.0, y: 639.3, isTreasure: true }
];

export const TIMING = {
  // Arrival sequence: ring at 0, thread at 60, card at 180 (CSS delays), each 1300 long
  arrival: 1300,
  arrivalCardDelay: 180,
  travel: 2300,
  cardClose: 380,
  treasureShake: 850,
  treasureReveal: 600,
  confettiAfterCoins: 450,
  bannerDelay: 2600,
  shake: 420,
  gameOverReveal: 1600,
  idleReset: 120000,
  // The win and game-over panels go to the home page this long after they open, touched or not
  endToHome: 240000
};

/** Wrong answers allowed in a whole game; the next one ends it. */
export const MISTAKES_ALLOWED = 1;

/** Stars for answers that were right on the first try: a perfect run gets 3, one mistake gets 2 */
export const STAR_THRESHOLDS = [10, 9]; // ≥10 → 3 stars, ≥9 → 2 stars, otherwise 1

export const starsFor = (firstTry) => (firstTry >= STAR_THRESHOLDS[0] ? 3 : firstTry >= STAR_THRESHOLDS[1] ? 2 : 1);

/** Map units → world pixels */
export const toPx = (u) => (u - WORLD.viewBoxOrigin) * WORLD.unitToPx;
