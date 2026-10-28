import { t } from '../data/i18n';

export default function FinaleBanner({ lang, onCertificate, onPlayAgain }) {
  return (
    <section className="finale glass" role="dialog" aria-labelledby="finale-title">
      <h2 id="finale-title">{t(lang, 'won')}</h2>
      <div className="en">A CHHATTISGARH DIGITAL EXPLORER</div>
      <p>{t(lang, 'wonSub')}</p>
      <button type="button" className="bt" onClick={onCertificate} autoFocus>
        {t(lang, 'cert')}
      </button>
      <button type="button" className="bt o" onClick={onPlayAgain}>
        {t(lang, 'again')}
      </button>
    </section>
  );
}
