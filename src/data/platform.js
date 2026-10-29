/**
 * How the game fits into the Rajyotsav exhibition: the select-game launcher that sends players
 * here, and the certificate API that a win is reported to.
 */

/** Identifier sent to the certificate API as `gameName`. */
export const GAME_NAME = 'Treasure_Hunt';

/**
 * The select-game screen. Set at build time (VITE_LAUNCHER_URL, filled from LAUNCHER_URL in
 * deploy/deploy.env). Empty means there is no launcher: no "All games" button, and the idle
 * reset returns to this game's start screen.
 */
export const LAUNCHER_URL = import.meta.env.VITE_LAUNCHER_URL || '';

/**
 * Same-origin path for the certificate API. nginx forwards it to the real API (see
 * deploy/nginx/treasure_hunt.conf); `npm run dev` answers it with a stand-in (vite.config.js).
 */
export const CERTIFICATE_ENDPOINT = `${import.meta.env.BASE_URL}api/certificate`;

/** Longest name printed on the certificate. */
export const NAME_MAX = 40;
