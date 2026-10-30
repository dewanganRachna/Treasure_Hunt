import { TIME_LIMIT } from '../data/explorerConfig';
import { t } from '../data/i18n';
import { LAUNCHER_URL } from '../data/platform';
import HomeCountdown from './HomeCountdown';

/**
 * Shown in the left column when the game is lost: by a wrong answer beyond the allowance, with
 * that question's right answer, or by the time running out (timeUp, no question).
 */
export default function GameOverPanel({ lang, timeUp, question, cleared, total, onPlayAgain }) {
  return (
    <section className="finale over glass" role="dialog" aria-labelledby="over-title">
      <h2 id="over-title">{t(lang, timeUp ? 'timeUp' : 'over')}</h2>
      <div className="over-sub">{timeUp ? t(lang, 'timeUpSub', { min: TIME_LIMIT / 60000 }) : t(lang, 'overSub')}</div>
      <p>{t(lang, 'overProgress', { n: cleared, total })}</p>
      {!timeUp && <RightAnswer lang={lang} question={question} />}
      <div className="finale-actions">
        <button type="button" className="bt" onClick={onPlayAgain} autoFocus>
          {t(lang, 'again')} &nbsp;→
        </button>
        <a className="bt o" href={LAUNCHER_URL}>
          {t(lang, 'home')} →
        </a>
      </div>
      <HomeCountdown lang={lang} />
    </section>
  );
}

/** The question that ended the game: its right answer and explanation. */
function RightAnswer({ lang, question }) {
  const useEn = lang === 'en' && Boolean(question.questionEn);
  const right = question.options[question.correctIndex];
  const answer = useEn && right.textEn ? right.textEn : right.text;
  const explanation = useEn ? question.explanationEn : question.explanation;

  return (
    <div className="answer">
      <small>{t(lang, 'rightAnswer')}</small>
      <b>{answer}</b>
      {explanation && <span>{explanation}</span>}
    </div>
  );
}
