import { useRef, useState } from 'react';
import { t } from '../data/i18n';
import { CATEGORY_ROTATION, STOPS_BY_CATEGORY } from '../data/journey';
import { LAUNCHER_URL, NAME_MAX } from '../data/platform';

/** Names shorter than this are taken as not typed yet. */
const NAME_MIN = 2;

export default function IntroPanel({ lang, name, onNameChange, onStart }) {
  const [hint, setHint] = useState(false);
  const nameRef = useRef(null);

  // The certificate needs a name, so START asks for one first instead of starting
  const submit = (e) => {
    e.preventDefault();
    if (name.trim().length < NAME_MIN) {
      setHint(true);
      nameRef.current?.focus({ preventScroll: true });
      return;
    }
    onStart();
  };

  return (
    <section className="intro glass" aria-labelledby="intro-title">
      {LAUNCHER_URL && (
        <a className="back-link" href={LAUNCHER_URL}>
          ← {t(lang, 'allGames')}
        </a>
      )}
      <div className="eyebrow">
        <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="#a86e18" strokeWidth="1.7" aria-hidden="true">
          <path d="M3 9.5 12 4l9 5.5M5 10v8M19 10v8M3 20h18M9 10v8M15 10v8" />
        </svg>
        <span>{t(lang, 'eyebrow')}</span>
      </div>

      <h1 id="intro-title">{t(lang, 'title')}</h1>
      <div className="en">CHHATTISGARH DIGITAL TREASURE HUNT</div>
      <div className="tag">{t(lang, 'tag')}</div>

      <div className="intro-cards">
        {CATEGORY_ROTATION.map((id, c) => (
          <div className="c" key={id}>
            <span className="n">{String(c + 1).padStart(2, '0')}</span>
            <span className="t">
              <small>{t(lang, 'theme', { n: c + 1, list: STOPS_BY_CATEGORY[id].join(', ') })}</small>
              <b>{t(lang, `cat_${id}`)}</b>
            </span>
          </div>
        ))}
      </div>

      <div className="intro-note">{t(lang, 'note')}</div>

      <form className="intro-start" onSubmit={submit} noValidate>
        <label className="name-field">
          <span>{t(lang, 'nameLabel')}</span>
          <input
            ref={nameRef}
            type="text"
            value={name}
            maxLength={NAME_MAX}
            autoComplete="off"
            autoCapitalize="words"
            spellCheck={false}
            enterKeyHint="go"
            placeholder={t(lang, 'namePh')}
            aria-invalid={hint}
            aria-describedby={hint ? 'name-hint' : undefined}
            onChange={(e) => {
              onNameChange(e.target.value);
              if (hint) setHint(false);
            }}
          />
        </label>
        {hint && (
          <div id="name-hint" className="name-hint" role="alert">
            {t(lang, 'nameNeeded')}
          </div>
        )}
        <button type="submit" className="bt" autoFocus>
          {t(lang, 'start')} &nbsp;→
        </button>
      </form>
    </section>
  );
}
