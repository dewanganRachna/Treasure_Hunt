import { t } from '../data/i18n';

const THEMES = [
  { n: '01', label: 't1', name: 'c1' },
  { n: '02', label: 't2', name: 'c2' },
  { n: '03', label: 't3', name: 'c3' }
];

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
        {THEMES.map((th) => (
          <div className="c" key={th.n}>
            <span className="n">{th.n}</span>
            <span className="t">
              <small>{t(lang, th.label)}</small>
              <b>{t(lang, th.name)}</b>
            </span>
          </div>
        ))}
      </div>

      <div className="intro-note">{t(lang, 'note')}</div>
      <button type="button" className="bt" onClick={onStart} autoFocus>
        {t(lang, 'start')} &nbsp;→
      </button>
    </section>
  );
}
