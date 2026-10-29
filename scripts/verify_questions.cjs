const fs = require('fs');
const path = require('path');

const filePath = path.resolve(__dirname, '../src/data/questions.json');
const raw = fs.readFileSync(filePath, 'utf8');
const data = JSON.parse(raw);

console.log('Total questions:', data.questions.length);
const categories = {};

data.questions.forEach((q, idx) => {
  categories[q.category] = (categories[q.category] || 0) + 1;

  // Check required fields
  const required = ['id', 'category', 'questionHindi', 'questionEnglish', 'options', 'correctAnswer', 'correctIndex', 'explanationHindi', 'explanationEnglish'];
  for (const f of required) {
    if (q[f] === undefined || q[f] === null || q[f] === '') {
      throw new Error(`Question at index ${idx} missing field: ${f}`);
    }
  }

  // Check options
  if (!Array.isArray(q.options) || q.options.length !== 4) {
    throw new Error(`Question ${q.id} must have exactly 4 options`);
  }

  q.options.forEach((opt, optIdx) => {
    if (!opt.id || !opt.hi || !opt.en) {
      throw new Error(`Question ${q.id} option ${optIdx} missing fields`);
    }
  });

  // Verify correctIndex matches correctAnswer letter
  const expectedIndex = ['A', 'B', 'C', 'D'].indexOf(q.correctAnswer);
  if (expectedIndex !== q.correctIndex) {
    throw new Error(`Question ${q.id} correctAnswer ${q.correctAnswer} does not match correctIndex ${q.correctIndex}`);
  }
});

console.log('Category breakdown:');
console.log(categories);
console.log('[Verification] All 32 questions passed schema and consistency checks!');

