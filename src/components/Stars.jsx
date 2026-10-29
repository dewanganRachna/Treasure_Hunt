import { t } from '../data/i18n';

const STAR_PATH = 'M12 2.6l2.85 5.8 6.4.93-4.63 4.5 1.1 6.37L12 17.2l-5.72 3 1.1-6.37-4.63-4.5 6.4-.93z';

/** Three stars, the first `count` filled. */
export default function Stars({ count, lang, size = 34 }) {
  return (
    <span className="stars" role="img" aria-label={t(lang, 'stars', { n: count })}>
      {[0, 1, 2].map((i) => (
        <svg key={i} viewBox="0 0 24 24" width={size} height={size} className={i < count ? 'on' : ''} aria-hidden="true">
          <path d={STAR_PATH} strokeWidth="1.4" strokeLinejoin="round" />
        </svg>
      ))}
    </span>
  );
}
