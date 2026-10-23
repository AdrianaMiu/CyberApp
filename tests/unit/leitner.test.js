import { test } from 'node:test';
import assert from 'node:assert/strict';
import { DAY_MS, INTERVAL_DAYS, answerHash, newRecord, applyOutcome, isDue } from '../../src/leitner.js';

const NOW = Date.UTC(2026, 9, 23, 12, 0, 0);
const H = 'h1';
const rec = (over) => ({ ...newRecord(H), ...over });
const go = (r, correct, flagged = false, hash = H) => applyOutcome(r, { correct, flagged, now: NOW, hash });

test('constants', () => {
  assert.equal(DAY_MS, 86400000);
  assert.deepEqual(INTERVAL_DAYS, [1, 3, 7]);
});

test('a new record starts out of the queue', () => {
  const r = newRecord(H);
  assert.deepEqual([r.box, r.due, r.attempts, r.correct, r.lastCorrect, r.flagged], [0, null, 0, 0, null, false]);
});

test('wrong answer goes to box 1 due in 1 day', () => {
  const r = go(undefined, false);
  assert.equal(r.box, 1);
  assert.equal(r.due, NOW + DAY_MS);
  assert.equal(r.lastCorrect, false);
  assert.equal(r.attempts, 1);
  assert.equal(r.correct, 0);
});

test('correct answers climb 1 -> 2 -> 3 -> graduated', () => {
  let r = rec({ box: 1, due: NOW });
  r = go(r, true);
  assert.deepEqual([r.box, r.due], [2, NOW + 3 * DAY_MS]);
  r = go(r, true);
  assert.deepEqual([r.box, r.due], [3, NOW + 7 * DAY_MS]);
  r = go(r, true);
  assert.deepEqual([r.box, r.due], [4, null]);
  r = go(r, true);
  assert.deepEqual([r.box, r.due], [4, null]);
});

test('first-time correct answer stays out of the queue', () => {
  const r = go(undefined, true);
  assert.deepEqual([r.box, r.due, r.lastCorrect, r.correct], [0, null, true, 1]);
});

test('wrong at box 3 returns to box 1', () => {
  const r = go(rec({ box: 3, due: NOW }), false);
  assert.deepEqual([r.box, r.due], [1, NOW + DAY_MS]);
});

test('flagged and correct enters box 1 from box 0 or graduated', () => {
  assert.deepEqual([go(undefined, true, true).box, go(undefined, true, true).due], [1, NOW + DAY_MS]);
  const r = go(rec({ box: 4 }), true, true);
  assert.deepEqual([r.box, r.due], [1, NOW + DAY_MS]);
});

test('flagged and correct in boxes 1-3 stays in the same box', () => {
  const r = go(rec({ box: 2, due: NOW }), true, true);
  assert.deepEqual([r.box, r.due, r.flagged], [2, NOW + 3 * DAY_MS, true]);
});

test('a changed answer hash resets the record first', () => {
  const r = go(rec({ box: 3, due: NOW, attempts: 5, correct: 5 }), true, false, 'h2');
  assert.deepEqual([r.box, r.attempts, r.correct, r.hash], [0, 1, 1, 'h2']);
});

test('isDue covers boxes 1-3 only', () => {
  assert.equal(isDue(rec({ box: 1, due: NOW }), NOW), true);
  assert.equal(isDue(rec({ box: 2, due: NOW + 1 }), NOW), false);
  assert.equal(isDue(rec({ box: 0 }), NOW), false);
  assert.equal(isDue(rec({ box: 4 }), NOW), false);
  assert.equal(isDue(rec({ box: 3, due: NOW - 5 }), NOW), true);
});

test('answerHash depends on answer and options only', () => {
  const q = { id: 'x', question: 'one', answer: ['a'], options: [{ id: 'a', text: 'A' }] };
  const edited = { ...q, question: 'edited text' };
  assert.equal(answerHash(q), answerHash(edited));
  assert.notEqual(answerHash(q), answerHash({ ...q, answer: ['b'] }));
  assert.notEqual(answerHash(q), answerHash({ ...q, options: [{ id: 'a', text: 'Changed' }] }));
  assert.equal(typeof answerHash(q), 'string');
});
