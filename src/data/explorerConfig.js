/**
 * Geometry, camera and timing for the Explorer map.
 * Values mirror design-spec.json; map units are the overlay SVG's viewBox units.
 */

export const STAGE = { w: 1280, h: 720, headerH: 66 };

export const WORLD = { w: 1628, h: 2288, unitToPx: 2.2, viewBoxOrigin: -110 };

export const CAMERA = {
  fitZoom: 0.277,
  playZoom: 0.8,
  mapLeft: 504,
  mapRight: 1280,
  yAnchor: 393,
  // Point the overview camera is centred on (map units)
  overview: { x: 250, y: 420 },
  transition: 'transform 2.2s cubic-bezier(.45,.05,.2,1)'
};

/** Ten stops; the last one is the treasure at Bastar. */
export const WAYPOINTS = [
  { name: 'Surguja', x: 363.7, y: 166.6 },
  { name: 'Raigarh', x: 372.7, y: 270.4 },
  { name: 'Korba', x: 292.8, y: 215.1 },
  { name: 'Bilaspur', x: 231.6, y: 231.2 },
  { name: 'Kabirdham', x: 134.0, y: 269.4 },
  { name: 'Rajnandgaon', x: 87.8, y: 398.7 },
  { name: 'Durg', x: 152.4, y: 376.5 },
  { name: 'Raipur', x: 202.5, y: 368.5 },
  { name: 'Kanker', x: 122.6, y: 509.5 },
  { name: 'Bastar', x: 208.0, y: 639.3, isTreasure: true }
];

export const TIMING = {
  intoFirstStop: 2300,
  afterCorrect: 1050,
  travel: 2300,
  beforeQuestion: 260,
  treasureShake: 850,
  treasureReveal: 600,
  bannerDelay: 2100,
  shake: 420,
  toast: 2800,
  idleReset: 120000
};

/** Map units → world pixels */
export const toPx = (u) => (u - WORLD.viewBoxOrigin) * WORLD.unitToPx;
