import { useEffect } from 'react';
import { starsFor } from '../data/explorerConfig';
import { t } from '../data/i18n';
import { LAUNCHER_URL } from '../data/platform';
import { sound } from '../utils/audio';
import HomeCountdown from './HomeCountdown';
import Stars from './Stars';
import TopicIcon from './TopicIcon';

// When the first star pops in after the panel opens, and the gap between stars (ms; App.css .finale .stars)
const STAR_START = 450;
const STAR_DELAY = 280;

/**
 * Win panel: score, time, and the certificate from the Rajyotsav API as a QR code to scan.
 * cert: { status: 'loading' | 'ready' | 'error', qrCode? }
 */
export default function FinaleBanner({ lang, topic, name, firstTry, total, time, cert, onRetry, onPlayAgain }) {
  const stars = starsFor(firstTry);

  // The stars pop in one by one (CSS, STAR_DELAY apart), each with a chime
  useEffect(() => {
    const timers = Array.from({ length: stars }, (_, i) => setTimeout(() => sound.star(i), STAR_START + i * STAR_DELAY));
    return () => timers.forEach(clearTimeout);
  }, [stars]);

  // A chime when the QR code is there, after the stars if it was ready before the panel opened
  useEffect(() => {
    if (cert.status !== 'ready') return undefined;
    const timer = setTimeout(sound.ready, STAR_START + 3 * STAR_DELAY);
    return () => clearTimeout(timer);
  }, [cert.status]);

  return (
    <section className="finale glass" role="dialog" aria-labelledby="finale-title">
      <h2 id="finale-title">{t(lang, 'won')}</h2>
      {name && <div className="who">{name}</div>}
      {topic && (
        <div className="topic-pill">
          <TopicIcon id={topic} size={16} />
          {t(lang, `cat_${topic}`)}
        </div>
      )}
      <div className="en">A CHHATTISGARH DIGITAL EXPLORER</div>
      <div className="score">
        <Stars count={stars} lang={lang} size={30} />
        <span>
          {t(lang, 'firstTry', { n: firstTry, total })} · {t(lang, 'timeTaken', { time })}
        </span>
      </div>

      <div className={`cert-qr ${cert.status}`} aria-live="polite">
        {cert.status === 'ready' && (
          <>
            <img src={cert.qrCode} width="150" height="150" alt={t(lang, 'certQrAlt')} />
            <p>{t(lang, 'certScan')}</p>
          </>
        )}
        {cert.status === 'loading' && (
          <>
            <span className="spinner" aria-hidden="true" />
            <p>{t(lang, 'certLoading')}</p>
          </>
        )}
        {cert.status === 'error' && (
          <>
            <p>{t(lang, 'certFailed')}</p>
            <button type="button" className="bt o retry" onClick={onRetry}>
              {t(lang, 'retry')}
            </button>
          </>
        )}
      </div>

      <div className="finale-actions">
        <button type="button" className="bt" onClick={onPlayAgain} autoFocus>
          {t(lang, 'again')}
        </button>
        <a className="bt o" href={LAUNCHER_URL}>
          {t(lang, 'home')} →
        </a>
      </div>
      <HomeCountdown lang={lang} />
    </section>
  );
}
