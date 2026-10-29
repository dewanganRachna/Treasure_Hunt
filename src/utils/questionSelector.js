import questionsData from '../data/questions.json';

/**
 * Category Constants
 */
export const CATEGORIES = {
  CYBER_SAFETY: 'cyber_safety',
  AI_EXPLORER: 'ai_explorer',
  DIGITAL_SEVA: 'digital_seva'
};

/**
 * Returns the 10 balanced questions for a given session index.
 * 
 * Category distribution rules:
 * - Session 1 (index 0): Cyber Safety 4, AI Explorer 3, Digital Seva 3
 * - Session 2 (index 1): Cyber Safety 3, AI Explorer 4, Digital Seva 3
 * - Session 3 (index 2): Cyber Safety 3, AI Explorer 3, Digital Seva 4
 * - Subsequent sessions repeat this rotation deterministically.
 * 
 * Interleaves categories across the 10 checkpoints so that questions from
 * any single topic are never clumped together.
 *
 * @param {number} sessionIndex - 0-based session counter
 * @returns {Array} Array of exactly 10 question objects
 */
export function getQuizQuestionsForSession(sessionIndex = 0) {
  const allQuestions = questionsData.questions;

  const cyberPool = allQuestions.filter((q) => q.category === CATEGORIES.CYBER_SAFETY);
  const aiPool = allQuestions.filter((q) => q.category === CATEGORIES.AI_EXPLORER);
  const digitalPool = allQuestions.filter((q) => q.category === CATEGORIES.DIGITAL_SEVA);

  const rotation = Math.abs(sessionIndex) % 3;

  // Quotas for the 3 categories
  let cyberCount = 3;
  let aiCount = 3;
  let digitalCount = 3;

  if (rotation === 0) {
    cyberCount = 4; // Session 1: 4 Cyber, 3 AI, 3 Digital
  } else if (rotation === 1) {
    aiCount = 4; // Session 2: 3 Cyber, 4 AI, 3 Digital
  } else {
    digitalCount = 4; // Session 3: 3 Cyber, 3 AI, 4 Digital
  }

  // Pick non-repeating questions from each pool using session-based rotating offset
  const pickFromPool = (pool, count, offsetMultiplier) => {
    const offset = (Math.abs(sessionIndex) * offsetMultiplier) % pool.length;
    const selected = [];
    for (let i = 0; i < count; i++) {
      const idx = (offset + i) % pool.length;
      selected.push(pool[idx]);
    }
    return selected;
  };

  const selectedCyber = pickFromPool(cyberPool, cyberCount, 4);
  const selectedAi = pickFromPool(aiPool, aiCount, 3);
  const selectedDigital = pickFromPool(digitalPool, digitalCount, 3);

  // Interleave questions across the 10 levels
  const result = [];
  let cIdx = 0;
  let aIdx = 0;
  let dIdx = 0;

  if (rotation === 0) {
    // Cyber has 4: [Cyber, AI, Digital, Cyber, AI, Digital, Cyber, AI, Digital, Cyber]
    for (let i = 0; i < 3; i++) {
      result.push(selectedCyber[cIdx++]);
      result.push(selectedAi[aIdx++]);
      result.push(selectedDigital[dIdx++]);
    }
    result.push(selectedCyber[cIdx++]); // 10th
  } else if (rotation === 1) {
    // AI has 4: [AI, Cyber, Digital, AI, Cyber, Digital, AI, Cyber, Digital, AI]
    for (let i = 0; i < 3; i++) {
      result.push(selectedAi[aIdx++]);
      result.push(selectedCyber[cIdx++]);
      result.push(selectedDigital[dIdx++]);
    }
    result.push(selectedAi[aIdx++]); // 10th
  } else {
    // Digital has 4: [Digital, Cyber, AI, Digital, Cyber, AI, Digital, Cyber, AI, Digital]
    for (let i = 0; i < 3; i++) {
      result.push(selectedDigital[dIdx++]);
      result.push(selectedCyber[cIdx++]);
      result.push(selectedAi[aIdx++]);
    }
    result.push(selectedDigital[dIdx++]); // 10th
  }

  return result;
}

export default getQuizQuestionsForSession;

