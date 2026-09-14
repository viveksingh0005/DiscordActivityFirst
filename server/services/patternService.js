// Generates a random pattern for a 4x4 grid (16 boxes, indexes 0-15)
// difficulty scales the number of highlighted boxes for progressive rounds
export const generatePattern = (roundNumber) => {
  const totalBoxes = 16;

  // Progressive difficulty: start at 3 highlighted boxes, cap at 9
  const highlightCount = Math.min(3 + Math.floor((roundNumber - 1) / 2), 9);

  const indexes = [];
  while (indexes.length < highlightCount) {
    const candidate = Math.floor(Math.random() * totalBoxes);
    if (!indexes.includes(candidate)) {
      indexes.push(candidate);
    }
  }

  return indexes;
};

// Shrinking reveal time, floors at 5s (matches the earlier design idea)
export const getRevealDuration = (roundNumber) => {
  const base = 10000;
  const shrinkPerRound = 500;
  const floor = 5000;
  return Math.max(floor, base - (roundNumber - 1) * shrinkPerRound);
};

// Compares a submitted guess against the real pattern — this is the only place
// "correct" is ever decided, and it only runs server-side after guessing closes
export const scoreSubmission = ({ pattern, selectedIndexes }) => {
  const correctSet = new Set(pattern);
  const selectedSet = new Set(selectedIndexes);

  let correctCount = 0;
  let wrongCount = 0;

  selectedSet.forEach((index) => {
    if (correctSet.has(index)) correctCount += 1;
    else wrongCount += 1;
  });

  const missedCount = pattern.length - correctCount;
  const isPerfect = correctCount === pattern.length && wrongCount === 0;

  // Partial-credit scoring (from the earlier design): points scale with accuracy,
  // a wrong pick costs a bit to discourage "select everything" spamming
  const rawPoints = correctCount * 10 - wrongCount * 5;
  const points = Math.max(0, isPerfect ? rawPoints + 20 : rawPoints); // bonus for a clean sweep

  return { correctCount, wrongCount, missedCount, isPerfect, points };
};