import { useEffect, useState } from 'react';
import { TIMING } from '../data/explorerConfig';
import { t } from '../data/i18n';
import { LAUNCHER_URL } from '../data/platform';
import { formatDuration } from '../utils/certificate';

/**
 * Under the win and game-over panels: the time left before the kiosk goes back to the portal's
 * home page, which it does TIMING.endToHome after the panel opens, touched or not.
 */
export default function HomeCountdown({ lang }) {
  const [left, setLeft] = useState(TIMING.endToHome);

  useEffect(() => {
    // Counted from the clock, not from ticks, so a slow tab can't stretch the wait
    const end = Date.now() + TIMING.endToHome;
    const tick = setInterval(() => {
      const ms = Math.max(end - Date.now(), 0);
      setLeft(ms);
      if (ms === 0) {
        clearInterval(tick);
        window.location.assign(LAUNCHER_URL);
      }
    }, 1000);
    return () => clearInterval(tick);
  }, []);

  return <p className="home-in">{t(lang, 'homeIn', { time: formatDuration(left) })}</p>;
}
