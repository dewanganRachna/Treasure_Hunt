import { useEffect, useState } from 'react';
import { TIME_LIMIT } from '../data/explorerConfig';
import { t } from '../data/i18n';
import { formatDuration } from '../utils/certificate';

/** The last stretch, when the clock turns red */
const LOW = 30000;

/**
 * Time left in the game, in the header: the full TIME_LIMIT until the first flight, then counting
 * down until the game is won or lost, where it stops. start and end are performance.now() times,
 * 0 until they happen. Game ends the game itself when the time runs out.
 */
export default function GameClock({ start, end, lang }) {
  const [now, setNow] = useState(start);

  useEffect(() => {
    if (!start || end) return undefined;
    const tick = setInterval(() => setNow(performance.now()), 250);
    return () => clearInterval(tick);
  }, [start, end]);

  const used = start ? (end || Math.max(now, start)) - start : 0;
  const left = Math.max(TIME_LIMIT - used, 0);
  const low = Boolean(start) && !end && left <= LOW;

  return (
    <span className={`clock${low ? ' low' : ''}`} role="timer">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" aria-hidden="true">
        <circle cx="12" cy="13.5" r="7.5" />
        <path d="M12 10v3.5l2.3 1.6M10 3h4" />
      </svg>
      <span className="sr-only">{t(lang, 'clock')}: </span>
      {/* Rounded up, so 0:00 shows only once the time is really over */}
      {formatDuration(Math.ceil(left / 1000) * 1000)}
    </span>
  );
}
