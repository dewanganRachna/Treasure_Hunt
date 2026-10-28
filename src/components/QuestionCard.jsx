import { CATEGORY_LABELS } from '../data/journey';
import { WAYPOINTS } from '../data/explorerConfig';
import { t } from '../data/i18n';

const LETTERS = 'ABCD';

/**
 * Question card in the left column. Stays mounted so it can fade out with its
 * last question still showing.
 */
export default function QuestionCard({ open, question, index, wrong, correct, shake, lang, onPick }) {
  const useEn = lang === 'en' && Boolean(question?.questionEn);

  let feedback = '';
  let feedbackClass = '';
  if (correct !== null) {
    feedback = t(lang, 'correct');
    feedbackClass = 'ok';
  } else if (wrong.length) {
    feedback = t(lang, 'tryAgain');
    feedbackClass = 'bad';
  }

  return (
    <section className={`card glass${open ? ' show' : ''}${shake ? ' sh' : ''}`} inert={!open} aria-hidden={!open}>
      {question && (
        <>
          <div className="top" />
          <div className="in">
            <div className="hd">
              <span className="num">{String(index + 1).padStart(2, '0')}</span>
              <span className="chip">{CATEGORY_LABELS[question.categoryId]}</span>
              <span className="pos">{WAYPOINTS[index].name}</span>
            </div>
            <div className="qt">{useEn ? question.questionEn : question.question}</div>
            <div className="ops">
              {question.options.map((opt, m) => {
                const state = correct === m ? ' ok' : wrong.includes(m) ? ' no' : '';
                return (
                  <button
                    type="button"
                    key={m}
                    className={`op${state}`}
                    aria-disabled={Boolean(state) || correct !== null}
                    onClick={(e) => {
                      e.currentTarget.blur();
                      onPick(m);
                    }}
                  >
                    <b>{LETTERS[m]}</b>
                    {useEn && opt.textEn ? opt.textEn : opt.text}
                  </button>
                );
              })}
            </div>
            <div className={`fb ${feedbackClass}`} role="status" aria-live="polite">
              {feedback}
            </div>
          </div>
        </>
      )}
    </section>
  );
}
