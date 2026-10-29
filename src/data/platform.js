/**
 * How the game fits into the Rajyotsav exhibition: the select-game launcher that sends players
 * here, and the certificate API that a win is reported to.
 */

/** Sent to the certificate API as `gameName`; it is printed on the certificate as written. */
export const GAME_NAME = 'Treasure Hunt';

/**
 * The select-game screen. Set at build time (VITE_LAUNCHER_URL, filled from LAUNCHER_URL in
 * deploy/deploy.env). Empty means there is no launcher: no "All games" button, and the idle
 * reset returns to this game's start screen.
 */
export const LAUNCHER_URL = import.meta.env.VITE_LAUNCHER_URL || '';

/**
 * Rajyotsav certificate API. The browser calls it directly: it allows cross-site requests
 * (Access-Control-Allow-Origin: *). Its server uses an old TLS setup that browsers accept but
 * OpenSSL 3 (Node, newer nginx) refuses, so it must not be routed through our server.
 * VITE_CERT_API_URL overrides it (deploy sets it from CERT_API_URL; `CERT_API=mock npm run dev`
 * points it at a local stand-in).
 */
export const CERTIFICATE_ENDPOINT =
  import.meta.env.VITE_CERT_API_URL || 'https://cggeomap.cgstate.gov.in/rajyotsav/api/certificate';

/** Longest name printed on the certificate. */
export const NAME_MAX = 40;
