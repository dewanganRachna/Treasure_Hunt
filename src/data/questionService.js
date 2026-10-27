import questionBank from './questions.json';

/**
 * Mapping of Treasure sequence IDs (1, 2, 3) to Category IDs
 */
export const TREASURE_CATEGORY_MAP = {
  1: 'cyber_safety',
  2: 'ai_explorer',
  3: 'digital_seva'
};

/**
 * Validates a single question structure.
 * Checks for ID, question string, exactly 4 options, and valid correct answer index (0-3).
 *
 * @param {Object} q
 * @returns {boolean}
 */
export function validateQuestion(q) {
  if (!q || typeof q !== 'object') return false;
  if (!q.id || typeof q.id !== 'string') return false;
  if (!q.question || typeof q.question !== 'string' || q.question.trim().length === 0) return false;
  if (!Array.isArray(q.options) || q.options.length !== 4) return false;
  if (typeof q.correctAnswer !== 'number' || q.correctAnswer < 0 || q.correctAnswer > 3) return false;
  return true;
}

/**
 * Formats a raw question from questions.json into the UI format expected by QuizModal.
 *
 * @param {Object} rawQuestion
 * @returns {Object}
 */
export function formatQuestion(rawQuestion) {
  const optionLabels = ['A', 'B', 'C', 'D'];
  return {
    id: rawQuestion.id,
    questionId: rawQuestion.id,
    question: rawQuestion.question,
    questionEn: rawQuestion.questionEn || '',
    difficulty: rawQuestion.difficulty || 'medium',
    options: rawQuestion.options.map((optText, index) => ({
      id: optionLabels[index],
      text: optText,
      textEn: Array.isArray(rawQuestion.optionsEn) ? rawQuestion.optionsEn[index] : '',
      isCorrect: index === rawQuestion.correctAnswer
    }))
  };
}

/**
 * Fallback questions if a category is missing, empty, or corrupted.
 */
const DEFAULT_FALLBACKS = {
  cyber_safety: {
    id: 'CS_FALLBACK',
    question: 'अपने Online Accounts को सुरक्षित रखने के लिए क्या करना चाहिए?',
    options: [
      'सभी Accounts में एक ही Password रखना',
      'Strong और अलग-अलग Password रखना',
      'Password दूसरों के साथ Share करना',
      'Password को सार्वजनिक रूप से लिखना'
    ],
    correctAnswer: 1
  },
  ai_explorer: {
    id: 'AI_FALLBACK',
    question: 'AI का Full Form क्या है?',
    options: [
      'Automated Internet',
      'Advanced Information',
      'Artificial Intelligence',
      'Automatic Interface'
    ],
    correctAnswer: 2
  },
  digital_seva: {
    id: 'DS_FALLBACK',
    question: 'Digital Government Services का मुख्य लाभ क्या है?',
    options: [
      'हर सेवा के लिए अनिवार्य रूप से कार्यालय जाना',
      'घर बैठे सरकारी सेवाओं तक आसान और सुविधाजनक पहुँच',
      'सभी Records खो जाना',
      'Internet बंद हो जाना'
    ],
    correctAnswer: 1
  }
};

/**
 * Retrieves all validated questions for a given category ID from questions.json.
 *
 * @param {string} categoryId
 * @returns {Array<Object>}
 */
export function getQuestionsByCategory(categoryId) {
  if (!questionBank || !Array.isArray(questionBank.categories)) {
    return [];
  }
  const category = questionBank.categories.find(
    (c) => c.id === categoryId || c.id === categoryId?.toLowerCase()
  );
  if (!category || !Array.isArray(category.questions)) {
    return [];
  }
  return category.questions.filter(validateQuestion);
}

/**
 * Selects a question for a treasure step (1, 2, 3) or category ID.
 * Ensures questions are not repeated in the same game session.
 *
 * @param {number|string} treasureOrCategory - 1, 2, 3 or category ID
 * @param {Array<string>} usedQuestionIds - IDs of questions already used in current session
 * @returns {Object} Formatted question object ready for QuizModal
 */
export function getDynamicQuestion(treasureOrCategory, usedQuestionIds = []) {
  const categoryId = typeof treasureOrCategory === 'number'
    ? (TREASURE_CATEGORY_MAP[treasureOrCategory] || 'cyber_safety')
    : treasureOrCategory;

  const validQuestions = getQuestionsByCategory(categoryId);

  if (validQuestions.length === 0) {
    const fallback = DEFAULT_FALLBACKS[categoryId] || DEFAULT_FALLBACKS.cyber_safety;
    return formatQuestion(fallback);
  }

  // Filter out questions already used in this session
  const unusedQuestions = validQuestions.filter(
    (q) => !usedQuestionIds.includes(q.id)
  );

  // If all questions in this category have been used in this session, recycle the pool
  const candidatePool = unusedQuestions.length > 0 ? unusedQuestions : validQuestions;

  // Select a random question from candidate pool
  const randomIndex = Math.floor(Math.random() * candidatePool.length);
  const selectedQuestion = candidatePool[randomIndex];

  return formatQuestion(selectedQuestion);
}
