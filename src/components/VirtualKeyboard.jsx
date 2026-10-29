import { t } from '../data/i18n';
import { sound } from '../utils/audio';

const ROWS = ['QWERTYUIOP', 'ASDFGHJKL', 'ZXCVBNM'];

/**
 * On-screen keyboard for typing a name on a touch kiosk, so the device's own keyboard
 * never needs to open. Letters only (plus space, dot and hyphen): the name is printed on
 * the certificate. Keys don't take focus, so a physical keyboard keeps working too.
 */
export default function VirtualKeyboard({ lang, onKey, onBackspace, onClear, onDone }) {
  // Keep focus where it is (the name field); the action runs on click
  const keepFocus = (e) => e.preventDefault();
  const press = (fn) => () => {
    sound.key();
    fn();
  };

  const key = (label, action, className = '', aria) => (
    <button
      type="button"
      className={`vk ${className}`}
      onPointerDown={keepFocus}
      onMouseDown={keepFocus}
      onClick={press(action)}
      aria-label={aria}
      key={aria ?? label}
    >
      {label}
    </button>
  );

  return (
    <div className="vkb glass" role="group" aria-label={t(lang, 'keyboard')}>
      {ROWS.map((row, r) => (
        <div className="vk-row" key={row}>
          {[...row].map((ch) => key(ch, () => onKey(ch)))}
          {r === 2 && key('⌫', onBackspace, 'wide', t(lang, 'keyBackspace'))}
        </div>
      ))}
      <div className="vk-row">
        {key(t(lang, 'keyClear'), onClear, 'wide muted')}
        {key('.', () => onKey('.'))}
        {key(t(lang, 'keySpace'), () => onKey(' '), 'space')}
        {key('-', () => onKey('-'))}
        {key(`${t(lang, 'keyDone')} ✓`, onDone, 'wide done')}
      </div>
    </div>
  );
}
