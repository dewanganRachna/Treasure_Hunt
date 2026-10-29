import { CERTIFICATE_ENDPOINT, GAME_NAME } from '../data/platform';

const TIMEOUT_MS = 20000;

/** Milliseconds as "m:ss", the format the certificate API expects (105000 → "1:45"). */
export function formatDuration(ms) {
  const s = Math.max(0, Math.round(ms / 1000));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}

/**
 * Asks the Rajyotsav certificate API for a certificate. Each call creates a new PDF on the
 * server, so call it once per won game. Resolves to { certificateUrl, qrCode }, where qrCode is
 * an image data URL that opens certificateUrl when scanned.
 */
export async function requestCertificate({ username, timeTaken }) {
  const abort = new AbortController();
  const timer = setTimeout(() => abort.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(CERTIFICATE_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, gameName: GAME_NAME, timeTaken }),
      // Another site: send none of our cookies (the kiosk login stays with our server)
      credentials: 'omit',
      cache: 'no-store',
      signal: abort.signal
    });
    if (!res.ok) throw new Error(`Certificate API answered ${res.status}`);
    const data = await res.json();
    // The QR string is several KB; never log it
    if (typeof data.qrCode !== 'string' || !data.qrCode.startsWith('data:image/')) {
      throw new Error('Certificate API sent no QR code');
    }
    return { certificateUrl: typeof data.certificateUrl === 'string' ? data.certificateUrl : '', qrCode: data.qrCode };
  } finally {
    clearTimeout(timer);
  }
}
