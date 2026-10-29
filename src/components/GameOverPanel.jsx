import { t } from '../data/i18n';
import { LAUNCHER_URL } from '../data/platform';

/** Shown in the left column when a wrong answer beyond the allowance ends the game. */
export default function GameOverPanel({ lang, question, cleared, total, onPlayAgain }) {
  const useEn = lang === 'en' && Boolean(question.questionEn);
  const right = question.options[question.correctIndex];
  const answer = useEn && right.textEn ? right.textEn : right.text;
  const explanation = useEn ? question.explanationEn : question.explanation;

  return (
    <section className="finale over glass" role="dialog" aria-labelledby="over-title">
      <h2 id="over-title">{t(lang, 'over')}</h2>
      <div className="over-sub">{t(lang, 'overSub')}</div>
      <p>{t(lang, 'overProgress', { n: cleared, total })}</p>
      <div className="answer">
        <small>{t(lang, 'rightAnswer')}</small>
        <b>{answer}</b>
        {explanation && <span>{explanation}</span>}
      </div>
      <div className="finale-actions">
        <button type="button" className="bt" onClick={onPlayAgain} autoFocus>
          {t(lang, 'again')} &nbsp;→
        </button>
        {LAUNCHER_URL && (
          <a className="bt o" href={LAUNCHER_URL}>
            {t(lang, 'allGames')} →
          </a>
        )}
      </div>
    </section>
  );
}
