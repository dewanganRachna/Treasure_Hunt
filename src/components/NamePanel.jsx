import { useEffect, useRef, useState } from 'react';
import { t } from '../data/i18n';
import { NAME_MAX } from '../data/platform';
import { sound } from '../utils/audio';
import VirtualKeyboard from './VirtualKeyboard';

/** Names shorter than this are taken as not typed yet. */
const NAME_MIN = 2;
const SEPARATORS = /[ .-]$/;

/**
 * Add one on-screen-keyboard character to a name: letters are capitalised at the start of
 * each word ("asha verma" → "Asha Verma"); spaces, dots and hyphens only follow a letter.
 */
function typeInto(name, ch) {
  if (name.length >= NAME_MAX) return name;
  if (ch === ' ' || ch === '.' || ch === '-') {
    return name === '' || SEPARATORS.test(name) ? name : name + ch;
  }
  const wordStart = name === '' || SEPARATORS.test(name);
  return name + (wordStart ? ch.toUpperCase() : ch.toLowerCase());
}

/**
 * Step between START and the first question: the player's name, which the certificate API
 * prints on their certificate. Typed on an on-screen keyboard; the field never opens the
 * device's own keyboard (inputMode="none"), but a physical keyboard still works.
 */
export default function NamePanel({ lang, name, onNameChange, onBack, onGo }) {
  const [hint, setHint] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus({ preventScroll: true });
  }, []);

  const change = (next) => {
    onNameChange(next);
    if (hint) setHint(false);
  };

  const go = () => {
    if (name.trim().length < NAME_MIN) {
      sound.wrong();
      setHint(true);
      return;
    }
    onGo();
  };

  return (
    <>
      <section className="namestep glass" aria-labelledby="name-title">
        <button type="button" className="back-link" onClick={onBack}>
          ← {t(lang, 'back')}
        </button>
        <h1 id="name-title">{t(lang, 'nameTitle')}</h1>
        <div className="tag">{t(lang, 'nameSub')}</div>

        <form
          className="name-row"
          onSubmit={(e) => {
            e.preventDefault();
            go();
          }}
          noValidate
        >
          <label className="name-field">
            <span className="sr-only">{t(lang, 'namePh')}</span>
            <input
              ref={inputRef}
              type="text"
              inputMode="none"
              value={name}
              maxLength={NAME_MAX}
              autoComplete="off"
              autoCapitalize="words"
              spellCheck={false}
              placeholder={t(lang, 'namePh')}
              aria-invalid={hint}
              aria-describedby={hint ? 'name-hint' : undefined}
              onChange={(e) => change(e.target.value)}
            />
          </label>
          <button type="submit" className="bt">
            {t(lang, 'nameGo')} &nbsp;→
          </button>
        </form>
        <div id="name-hint" className="name-hint" role="alert">
          {hint ? t(lang, 'nameNeeded') : ''}
        </div>
      </section>

      <VirtualKeyboard
        lang={lang}
        onKey={(ch) => change(typeInto(name, ch))}
        onBackspace={() => change(name.slice(0, -1))}
        onClear={() => change('')}
        onDone={go}
      />
    </>
  );
}
