import { useEffect, useRef, useState } from 'react';
import { starsFor } from '../data/explorerConfig';
import { t } from '../data/i18n';
import Stars from './Stars';

const ID_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

const certificateNumber = () => {
  let code = '';
  for (let i = 0; i < 5; i++) code += ID_CHARS[Math.floor(Math.random() * ID_CHARS.length)];
  return `CGDE-${String(new Date().getFullYear()).slice(-2)}-${code}`;
};

/**
 * Certificate shown over the stage after the finale. The name is optional, lives only
 * in this component's state, and is gone on Close, Restart or the idle reset.
 */
export default function Certificate({ lang, firstTry, total, onClose }) {
  const [name, setName] = useState('');
  const [number] = useState(certificateNumber);
  const [issued] = useState(() => new Date());
  const closeRef = useRef(null);
  const date = new Intl.DateTimeFormat(lang === 'hi' ? 'hi-IN' : 'en-IN', { day: 'numeric', month: 'long', year: 'numeric' }).format(issued);

  useEffect(() => {
    closeRef.current?.focus({ preventScroll: true });
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div className="cert-wrap" role="dialog" aria-modal="true" aria-labelledby="cert-title">
      <div className="cert">
        <div className="cert-frame">
          <div className="cert-brand">
            <svg viewBox="0 0 24 24" width="26" height="26" aria-hidden="true">
              <polygon points="12,2.4 21,7.2 21,16.8 12,21.6 3,16.8 3,7.2" fill="none" stroke="#a86e18" strokeWidth="1.6" strokeLinejoin="round" />
              <circle cx="12" cy="12" r="3.4" fill="#c98a24" />
            </svg>
            <span>CHiPS · {t(lang, 'gov')}</span>
            <span className="dot">·</span>
            <span>{t(lang, 'fest')}</span>
          </div>

          <h2 id="cert-title">{t(lang, 'certTitle')}</h2>
          <div className="cert-sub">{t(lang, 'certSub')}</div>

          <p className="cert-certify">{t(lang, 'certCertify')}</p>
          <label className="cert-name">
            <span className="sr-only">{t(lang, 'certNameLabel')}</span>
            <input
              type="text"
              value={name}
              maxLength={40}
              autoComplete="off"
              spellCheck={false}
              placeholder={t(lang, 'certNamePh')}
              onChange={(e) => setName(e.target.value)}
            />
          </label>
          <p className="cert-body">{t(lang, 'certBody')}</p>

          <div className="cert-score">
            <Stars count={starsFor(firstTry)} lang={lang} size={26} />
            <span>{t(lang, 'firstTry', { n: firstTry, total })}</span>
          </div>

          <div className="cert-foot">
            <span>
              {t(lang, 'certDate')}: <b>{date}</b>
            </span>
            <span className="cert-seal" aria-hidden="true">
              <svg viewBox="0 0 48 48" width="54" height="54">
                <circle cx="24" cy="24" r="21" fill="#c98a24" stroke="#7d4f10" strokeWidth="2" />
                <circle cx="24" cy="24" r="16" fill="none" stroke="#fff3d6" strokeWidth="1.2" strokeDasharray="2 2.4" />
                <rect x="14" y="22" width="20" height="11" rx="2" fill="#fff3d6" />
                <path d="M14 22q0-6 10-6t10 6z" fill="#f3d178" />
                <rect x="22" y="22" width="4" height="11" fill="#c98a24" />
              </svg>
            </span>
            <span>
              {t(lang, 'certNo')}: <b>{number}</b>
            </span>
          </div>
        </div>
      </div>

      <div className="cert-actions">
        <span className="cert-privacy">{t(lang, 'certPrivacy')}</span>
        <button type="button" className="bt" onClick={() => window.print()}>
          {t(lang, 'print')}
        </button>
        <button type="button" className="bt o" ref={closeRef} onClick={onClose}>
          {t(lang, 'close')}
        </button>
      </div>
    </div>
  );
}
