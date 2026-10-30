import { useEffect, useState } from 'react';
import { t } from '../data/i18n';
import { formatDuration } from '../utils/certificate';

/**
 * The game's time in the header: 0:00 until the first flight, then running until the game is won
 * or lost, where it stops. start and end are performance.now() times, 0 until they happen.
 */
export default function GameClock({ start, end, lang }) {
  const [now, setNow] = useState(start);

  useEffect(() => {
    if (!start || end) return undefined;
    const tick = setInterval(() => setNow(performance.now()), 250);
    return () => clearInterval(tick);
  }, [start, end]);

  const ms = start ? (end || Math.max(now, start)) - start : 0;

  return (
    <span className="clock" role="timer">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" aria-hidden="true">
        <circle cx="12" cy="13.5" r="7.5" />
        <path d="M12 10v3.5l2.3 1.6M10 3h4" />
      </svg>
      <span className="sr-only">{t(lang, 'clock')}: </span>
      {formatDuration(ms)}
    </span>
  );
}
