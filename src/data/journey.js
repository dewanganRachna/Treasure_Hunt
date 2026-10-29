import { getDynamicQuestion } from './questionService';
import { WAYPOINTS } from './explorerConfig';

/** The topics a player can choose from, in the order they are shown. */
export const CATEGORIES = ['cyber_safety', 'digital_seva', 'ai_explorer'];

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
 * Picks one question per waypoint, all from the chosen topic, never repeating a question
 * within the journey (a topic needs at least as many questions as there are stops; if it
 * has fewer, getDynamicQuestion starts reusing them). Options are shuffled so the right
 * answer isn't always in the same place for returning players.
 *
 * @param {string} categoryId one of CATEGORIES
 * @returns {Array<Object>}
 */
export function buildJourneyQuestions(categoryId) {
  const used = [];
  return WAYPOINTS.map(() => {
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
