export const DAY_MS = 86400000;
export const INTERVAL_DAYS = [1, 3, 7];

export function answerHash(q) {
  const text = JSON.stringify({ answer: q.answer, options: q.options ?? null });
  let hash = 0x811c9dc5;
  for (let i = 0; i < text.length; i++) {
    hash ^= text.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193) >>> 0;
  }
  return hash.toString(16).padStart(8, '0');
}

export function newRecord(hash) {
  return { box: 0, due: null, attempts: 0, correct: 0, lastCorrect: null, flagged: false, hash, last: 0 };
}

export function applyOutcome(rec, { correct, flagged, now, hash }) {
  const base = rec && rec.hash === hash ? rec : newRecord(hash);
  let box = base.box;
  if (!correct) box = 1;
  else if (flagged) box = box === 0 || box === 4 ? 1 : box;
  else if (box >= 1 && box <= 3) box += 1;

  const due = box >= 1 && box <= 3 ? now + INTERVAL_DAYS[box - 1] * DAY_MS : null;
  return {
    box,
    due,
    attempts: base.attempts + 1,
    correct: base.correct + (correct ? 1 : 0),
    lastCorrect: correct,
    flagged: Boolean(flagged),
    hash,
    last: now,
  };
}

export function isDue(rec, now) {
  return rec.box >= 1 && rec.box <= 3 && rec.due !== null && rec.due <= now;
}
