import { starsFor } from '../data/explorerConfig';
import { t } from '../data/i18n';
import Stars from './Stars';

export default function FinaleBanner({ lang, firstTry, total, onCertificate, onPlayAgain }) {
  return (
    <section className="finale glass" role="dialog" aria-labelledby="finale-title">
      <h2 id="finale-title">{t(lang, 'won')}</h2>
      <div className="en">A CHHATTISGARH DIGITAL EXPLORER</div>
      <p>{t(lang, 'wonSub')}</p>
      <div className="score">
        <Stars count={starsFor(firstTry)} lang={lang} />
        <span>{t(lang, 'firstTry', { n: firstTry, total })}</span>
      </div>
      <div className="finale-actions">
        <button type="button" className="bt" onClick={onCertificate} autoFocus>
          {t(lang, 'cert')}
        </button>
        <button type="button" className="bt o" onClick={onPlayAgain}>
          {t(lang, 'again')}
        </button>
      </div>
    </section>
  );
}
