import { WAYPOINTS } from '../data/explorerConfig';
import { t } from '../data/i18n';
import { LAUNCHER_URL } from '../data/platform';
import GameClock from './GameClock';

const TOTAL = WAYPOINTS.length;
// Phones such as iPhone have no page fullscreen, so the button would do nothing there
const canFullscreen = typeof document !== 'undefined' && Boolean(document.fullscreenEnabled);

const HEART = 'M12 20.3s-7.6-4.6-9.2-9.4C1.6 7.3 3.9 4 7.3 4c2 0 3.6 1.1 4.7 2.7C13.1 5.1 14.7 4 16.7 4c3.4 0 5.7 3.3 4.5 6.9-1.6 4.8-9.2 9.4-9.2 9.4z';

export default function Header({ cur, mistakesLeft, clock, lang, muted, onToggleLang, onToggleSound, onFullscreen, onRestart }) {
  return (
    <header className="hdr">
      <div className="hdr-logo" aria-hidden="true">
        <svg viewBox="0 0 24 24" width="22" height="22">
          <polygon points="12,2.4 21,7.2 21,16.8 12,21.6 3,16.8 3,7.2" fill="none" stroke="#a86e18" strokeWidth="1.6" strokeLinejoin="round" />
          <circle cx="12" cy="12" r="3.4" fill="#c98a24" />
        </svg>
      </div>
      <div className="hdr-title">
        <div className="cp">
          <span className="chipl">CHiPS · {t(lang, 'gov')}</span>
          <span className="chipl g">{t(lang, 'fest')}</span>
        </div>
        <div className="ti">{t(lang, 'title')}</div>
      </div>

      <div className="progress">
        <span className="lbl">PROGRESS</span>
        <span className="dots" role="progressbar" aria-label="Progress" aria-valuemin={0} aria-valuemax={TOTAL} aria-valuenow={Math.max(cur, 0)}>
          {Array.from({ length: TOTAL }, (_, m) => (
            <i key={m} className={m < cur ? 'on' : m === cur ? 'cu' : ''} />
          ))}
        </span>
        <b>{Math.max(cur, 0)}/{TOTAL}</b>
        <span className={`lives${mistakesLeft > 0 ? '' : ' used'}`} role="img" aria-label={t(lang, 'lives', { n: mistakesLeft })} title={t(lang, 'lives', { n: mistakesLeft })}>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d={HEART} />
          </svg>
        </span>
        <GameClock start={clock.start} end={clock.end} lang={lang} />
      </div>

      <div className="tools">
        <button type="button" className="tb" onClick={onToggleLang}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
            <circle cx="12" cy="12" r="9" />
            <path d="M3 12h18M12 3c2.6 3 2.6 15 0 18M12 3c-2.6 3-2.6 15 0 18" />
          </svg>
          <span lang={lang === 'hi' ? 'en' : 'hi'}>{lang === 'hi' ? 'ENG' : 'हिन्दी'}</span>
        </button>
        <button type="button" className={`tb${muted ? ' off' : ''}`} onClick={onToggleSound} aria-pressed={!muted} aria-label={t(lang, 'sound')}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
            <path d="M4 9v6h4l5 4V5L8 9H4z" strokeLinejoin="round" />
            <path d="M17 9.5a4 4 0 0 1 0 5M19.5 7a7.5 7.5 0 0 1 0 10" opacity={muted ? 0.25 : 1} />
          </svg>
          <span className="tl">{t(lang, 'sound')}</span>
        </button>
        {canFullscreen && (
          <button type="button" className="tb" onClick={onFullscreen} aria-label={t(lang, 'fullscreen')}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
              <path d="M9 4H4v5M15 4h5v5M15 20h5v-5M9 20H4v-5" />
            </svg>
          </button>
        )}
        <button type="button" className="tb" onClick={onRestart} aria-label={t(lang, 'restart')}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
            <path d="M3 12a9 9 0 1 0 3-6.7" />
            <path d="M3 4v5h5" />
          </svg>
          <span className="tl">{t(lang, 'restart')}</span>
        </button>
        <a className="tb" href={LAUNCHER_URL} aria-label={t(lang, 'exit')}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M10 4H5v16h5" />
            <path d="M15 8l4 4-4 4M19 12H9" />
          </svg>
          <span className="tl">{t(lang, 'exit')}</span>
        </a>
      </div>
    </header>
  );
}
