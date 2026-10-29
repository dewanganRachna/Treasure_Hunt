import { getDynamicQuestion } from './questionService';
import { WAYPOINTS } from './explorerConfig';

/** Categories cycle across the ten stops in this order. */
export const CATEGORY_ROTATION = ['cyber_safety', 'digital_seva', 'ai_explorer'];

/** Stop numbers (1-based) that ask questions from each category, e.g. cyber_safety → [1, 4, 7, 10]. */
export const STOPS_BY_CATEGORY = Object.fromEntries(
  CATEGORY_ROTATION.map((id, c) => [
    id,
    WAYPOINTS.map((_, i) => i + 1).filter((n) => (n - 1) % CATEGORY_ROTATION.length === c)
  ])
);

/** Fisher–Yates shuffle of a copy. */
function shuffled(items) {
  const a = [...items];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * Picks one question per waypoint, rotating categories and never repeating
 * a question within the same journey. Options are shuffled so the right
 * answer isn't always in the same place for returning players.
 *
 * @returns {Array<Object>}
 */
export function buildJourneyQuestions() {
  const used = [];
  return WAYPOINTS.map((_, i) => {
    const categoryId = CATEGORY_ROTATION[i % CATEGORY_ROTATION.length];
    const q = getDynamicQuestion(categoryId, used);
    used.push(q.id);
    const options = shuffled(q.options);
    return {
      ...q,
      options,
      categoryId,
      correctIndex: options.findIndex((o) => o.isCorrect)
    };
  });
}
