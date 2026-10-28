import { getDynamicQuestion } from './questionService';
import { WAYPOINTS } from './explorerConfig';

/** Categories cycle across the ten stops in this order. */
export const CATEGORY_ROTATION = ['cyber_safety', 'digital_seva', 'ai_explorer'];

export const CATEGORY_LABELS = {
  cyber_safety: 'Cyber Safety',
  digital_seva: 'Digital Seva',
  ai_explorer: 'AI Explorer'
};

/**
 * Picks one question per waypoint, rotating categories and never repeating
 * a question within the same journey.
 *
 * @returns {Array<Object>}
 */
export function buildJourneyQuestions() {
  const used = [];
  return WAYPOINTS.map((_, i) => {
    const categoryId = CATEGORY_ROTATION[i % CATEGORY_ROTATION.length];
    const q = getDynamicQuestion(categoryId, used);
    used.push(q.id);
    return {
      ...q,
      categoryId,
      correctIndex: q.options.findIndex((o) => o.isCorrect)
    };
  });
}
