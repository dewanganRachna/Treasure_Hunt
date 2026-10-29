import { t } from '../data/i18n';
import { CATEGORIES } from '../data/journey';
import TopicIcon from './TopicIcon';

/** Step after the name: the player picks one topic, and all 10 questions come from it. */
export default function TopicPanel({ lang, name, onBack, onPick }) {
  return (
    <section className="intro topicstep glass" aria-labelledby="topic-title">
      <button type="button" className="back-link" onClick={onBack}>
        ← {t(lang, 'back')}
      </button>
      <h1 id="topic-title">{t(lang, 'topicTitle', { name })}</h1>
      <div className="tag">{t(lang, 'topicSub')}</div>

      <div className="topics">
        {CATEGORIES.map((id, i) => (
          <button type="button" className="topic" key={id} onClick={() => onPick(id)} autoFocus={i === 0}>
            <span className="topic-icon">
              <TopicIcon id={id} size={30} />
            </span>
            <span className="topic-text">
              <b>{t(lang, `cat_${id}`)}</b>
              <small>{t(lang, `catDesc_${id}`)}</small>
            </span>
            <span className="topic-go" aria-hidden="true">
              {t(lang, 'topicCount')} →
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
