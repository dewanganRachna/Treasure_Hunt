import { t } from '../data/i18n';
import { CATEGORIES } from '../data/journey';
import TopicIcon from './TopicIcon';

export default function IntroPanel({ lang, onStart }) {
  return (
    <section className="intro glass" aria-labelledby="intro-title">
      <div className="eyebrow">
        <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="#a86e18" strokeWidth="1.7" aria-hidden="true">
          <path d="M3 9.5 12 4l9 5.5M5 10v8M19 10v8M3 20h18M9 10v8M15 10v8" />
        </svg>
        <span>{t(lang, 'eyebrow')}</span>
      </div>

      <div className="orb" aria-hidden="true">
        <div className="r1" />
        <div className="r2" />
        <div className="core">
          <svg viewBox="0 0 48 48" width="40" height="40">
            <rect x="8" y="20" width="32" height="18" rx="3" fill="#c98a24" stroke="#7d4f10" strokeWidth="1.6" />
            <path d="M8 20q0-9 16-9t16 9z" fill="#e2b155" stroke="#7d4f10" strokeWidth="1.6" />
            <rect x="20" y="20" width="8" height="18" fill="#f3e3bb" stroke="#7d4f10" strokeWidth="1.2" />
            <circle cx="24" cy="27" r="2.2" fill="#7d4f10" />
          </svg>
        </div>
      </div>

      <h1 id="intro-title">{t(lang, 'title')}</h1>
      <div className="en">CHHATTISGARH DIGITAL TREASURE HUNT</div>
      <div className="tag">{t(lang, 'tag')}</div>

      <div className="intro-cards">
        {CATEGORIES.map((id, c) => (
          <div className="c" key={id}>
            <span className="n">
              <TopicIcon id={id} size={18} />
            </span>
            <span className="t">
              <small>{t(lang, 'topicNo', { n: c + 1 })}</small>
              <b>{t(lang, `cat_${id}`)}</b>
            </span>
          </div>
        ))}
      </div>

      <div className="intro-note">{t(lang, 'note')}</div>
      <button type="button" className="bt bt-start" onClick={onStart}>
        <span className="start-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round">
            <circle cx="12" cy="12" r="9.2" />
            <path d="M15.6 8.4 13.3 13.3 8.4 15.6 10.7 10.7Z" fill="currentColor" fillOpacity=".35" />
            <circle cx="12" cy="12" r="1.1" fill="currentColor" stroke="none" />
          </svg>
        </span>
        <span className="start-text">
          <b>{t(lang, 'start')}</b>
          <small lang={lang}>{t(lang, 'startSub')}</small>
        </span>
        <span className="arrow" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </span>
      </button>
    </section>
  );
}
