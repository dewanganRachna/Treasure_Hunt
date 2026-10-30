import { useEffect, useRef } from 'react';
import { t } from '../data/i18n';

const LETTERS = 'ABCD';

/**
 * Question card in the left column. Stays mounted so it can fade out with its
 * last question still showing.
 */
export default function QuestionCard({ open, arrive, question, index, wrong, correct, revealed, shake, lang, isLast, onPick, onContinue }) {
  const opsRef = useRef(null);
  const nextRef = useRef(null);
  const answered = correct !== null;
  const lost = revealed !== null;
  const useEn = lang === 'en' && Boolean(question?.questionEn);
  const explanation = useEn ? question?.explanationEn : question?.explanation;

  // Keyboard players land on the first answer when a question opens, and on Continue once it's answered.
  // preventScroll keeps the clipped stage from shifting; pointer users get no focus ring from this.
  useEffect(() => {
    if (open && !answered) opsRef.current?.querySelector('.op')?.focus({ preventScroll: true });
  }, [open, index, answered]);

  useEffect(() => {
    if (open && answered) nextRef.current?.focus({ preventScroll: true });
  }, [open, answered]);

  let feedback = '';
  let feedbackClass = '';
  if (answered) {
    feedback = t(lang, 'correct');
    feedbackClass = 'ok';
  } else if (lost) {
    feedback = t(lang, 'wrongFinal');
    feedbackClass = 'bad';
  } else if (wrong.length) {
    feedback = t(lang, 'usedRetry');
    feedbackClass = 'bad';
  }

  return (
    <section className={`card glass${open ? ' show' : ''}${arrive ? ' arrive' : ''}${shake ? ' sh' : ''}`} inert={!open} aria-hidden={!open}>
      {question && (
        <>
          <div className="top" />
          <div className="in">
            <div className="hd">
              <span className="num">{String(index + 1).padStart(2, '0')}</span>
              <span className="chip" lang={lang}>{t(lang, `cat_${question.categoryId}`)}</span>
            </div>
            <div className="qt">{useEn ? question.questionEn : question.question}</div>
            <div className="ops" ref={opsRef}>
              {question.options.map((opt, m) => {
                const state = correct === m || revealed === m ? ' ok' : wrong.includes(m) ? ' no' : '';
                return (
                  <button
                    type="button"
                    key={opt.id}
                    className={`op${state}`}
                    aria-disabled={Boolean(state) || answered || lost}
                    onClick={(e) => {
                      // A pointer tap leaves no focus behind; keyboard activation (detail 0) keeps it
                      if (e.detail !== 0) e.currentTarget.blur();
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
              {answered && explanation ? (
                <div className="why">
                  <b>{feedback}</b>
                  <span>{explanation}</span>
                </div>
              ) : (
                feedback
              )}
            </div>
            {answered && (
              <div className="next-row">
                <button type="button" className="bt next" ref={nextRef} onClick={onContinue}>
                  {t(lang, isLast ? 'openTreasure' : 'next')} &nbsp;→
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </section>
  );
}
