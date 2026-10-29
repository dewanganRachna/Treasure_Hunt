/**
 * Geometry, camera and timing for the Explorer map.
 * Values mirror docs/design-spec.json; map units are the overlay SVG's viewBox units.
 */

export const WORLD = { w: 1628, h: 2288, unitToPx: 2.2, viewBoxOrigin: -110 };

export const CAMERA = {
  playZoom: 0.8,
  transition: 'transform 2.2s cubic-bezier(.45,.05,.2,1)'
};

/** Point the overview camera is centred on (map units) */
const OVERVIEW = { x: 250, y: 420 };

/**
 * 16:9 kiosk layout: fixed 1280×720 stage, panels in a left column, map on the right.
 * mapBottom is how far down the map may be shown; overview* is used while the intro is up.
 */
export const LANDSCAPE = {
  portrait: false,
  w: 1280,
  h: 720,
  headerH: 66,
  mapLeft: 504,
  mapRight: 1280,
  mapBottom: 720,
  yAnchor: 393,
  fitZoom: 0.277,
  overview: OVERVIEW,
  overviewAnchor: 393,
  overviewBottom: 720
};

// Portrait (phones held upright): the stage is one panel wide and as tall as the screen allows
const PORTRAIT_W = 504;
const PORTRAIT_HEADER = 100;
const PORTRAIT_INTRO = 596; // intro panel (with the name field) plus its bottom gap
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
  if (vw >= vh) return LANDSCAPE;
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
  intoFirstStop: 2300,
  travel: 2300,
  beforeQuestion: 260,
  cardClose: 380,
  treasureShake: 850,
  treasureReveal: 600,
  confettiAfterCoins: 450,
  bannerDelay: 2600,
  shake: 420,
  gameOverReveal: 1600,
  idleReset: 120000
};

/** Wrong answers allowed in a whole game; the next one ends it. */
export const MISTAKES_ALLOWED = 1;

/** Stars for answers that were right on the first try: a perfect run gets 3, one mistake gets 2 */
export const STAR_THRESHOLDS = [10, 9]; // ≥10 → 3 stars, ≥9 → 2 stars, otherwise 1

export const starsFor = (firstTry) => (firstTry >= STAR_THRESHOLDS[0] ? 3 : firstTry >= STAR_THRESHOLDS[1] ? 2 : 1);

/** Map units → world pixels */
export const toPx = (u) => (u - WORLD.viewBoxOrigin) * WORLD.unitToPx;
