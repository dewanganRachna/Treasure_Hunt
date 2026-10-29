const fs = require('fs');
const path = require('path');

const data = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../src/data/questions.json'), 'utf8'));

function getQuizQuestionsForSession(sessionIndex = 0) {
  const allQuestions = data.questions;

  const cyberPool = allQuestions.filter((q) => q.category === 'cyber_safety');
  const aiPool = allQuestions.filter((q) => q.category === 'ai_explorer');
  const digitalPool = allQuestions.filter((q) => q.category === 'digital_seva');

  const rotation = Math.abs(sessionIndex) % 3;

  let cyberCount = 3;
  let aiCount = 3;
  let digitalCount = 3;

  if (rotation === 0) {
    cyberCount = 4;
  } else if (rotation === 1) {
    aiCount = 4;
  } else {
    digitalCount = 4;
  }

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

  const result = [];
  let cIdx = 0;
  let aIdx = 0;
  let dIdx = 0;

  if (rotation === 0) {
    for (let i = 0; i < 3; i++) {
      result.push(selectedCyber[cIdx++]);
      result.push(selectedAi[aIdx++]);
      result.push(selectedDigital[dIdx++]);
    }
    result.push(selectedCyber[cIdx++]);
  } else if (rotation === 1) {
    for (let i = 0; i < 3; i++) {
      result.push(selectedAi[aIdx++]);
      result.push(selectedCyber[cIdx++]);
      result.push(selectedDigital[dIdx++]);
    }
    result.push(selectedAi[aIdx++]);
  } else {
    for (let i = 0; i < 3; i++) {
      result.push(selectedDigital[dIdx++]);
      result.push(selectedCyber[cIdx++]);
      result.push(selectedAi[aIdx++]);
    }
    result.push(selectedDigital[dIdx++]);
  }

  return result;
}

for (let s = 0; s < 6; s++) {
  const sessionNum = s + 1;
  const questions = getQuizQuestionsForSession(s);

  if (questions.length !== 10) {
    throw new Error(`Session ${sessionNum} did not return 10 questions`);
  }

  const counts = { cyber_safety: 0, ai_explorer: 0, digital_seva: 0 };
  const ids = new Set();

  questions.forEach((q) => {
    counts[q.category]++;
    if (ids.has(q.id)) {
      throw new Error(`Session ${sessionNum} has duplicate question id ${q.id}`);
    }
    ids.add(q.id);
  });

  console.log(`Session ${sessionNum} (index ${s}):`, counts, '-> Total:', questions.length);

  const expectedRotation = s % 3;
  if (expectedRotation === 0 && (counts.cyber_safety !== 4 || counts.ai_explorer !== 3 || counts.digital_seva !== 3)) {
    throw new Error(`Session ${sessionNum} wrong counts: expected 4/3/3`);
  }
  if (expectedRotation === 1 && (counts.cyber_safety !== 3 || counts.ai_explorer !== 4 || counts.digital_seva !== 3)) {
    throw new Error(`Session ${sessionNum} wrong counts: expected 3/4/3`);
  }
  if (expectedRotation === 2 && (counts.cyber_safety !== 3 || counts.ai_explorer !== 3 || counts.digital_seva !== 4)) {
    throw new Error(`Session ${sessionNum} wrong counts: expected 3/3/4`);
  }
}

console.log('[Success] All sessions verified! Equal 4/3/3 rotation with 0 duplicates verified.');

