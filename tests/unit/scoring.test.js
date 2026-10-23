import { test } from 'node:test';
import assert from 'node:assert/strict';
import { isCorrect } from '../../src/scoring.js';

const multi = { type: 'multi', answer: ['a', 'b'] };
const single = { type: 'single', answer: ['b'] };
const ordering = { type: 'ordering', answer: ['b', 'd', 'a', 'c'] };
const matching = { type: 'matching', answer: { l1: 'r1', l2: 'r2' } };
const open = { type: 'open', answer: [] };
const truefalse = { type: 'truefalse', answer: ['a'] };
const log = { type: 'log-analysis', answer: ['c'] };

test('single and truefalse and log-analysis need the exact id', () => {
  assert.equal(isCorrect(single, ['b']), true);
  assert.equal(isCorrect(single, ['a']), false);
  assert.equal(isCorrect(truefalse, ['a']), true);
  assert.equal(isCorrect(log, ['c']), true);
  assert.equal(isCorrect(log, ['c', 'a']), false);
});

test('multi is all-or-nothing and order-insensitive', () => {
  assert.equal(isCorrect(multi, ['a']), false);
  assert.equal(isCorrect(multi, ['a', 'b', 'c']), false);
  assert.equal(isCorrect(multi, ['b', 'a']), true);
});

test('ordering needs the exact sequence', () => {
  assert.equal(isCorrect(ordering, ['b', 'd', 'a', 'c']), true);
  assert.equal(isCorrect(ordering, ['d', 'b', 'a', 'c']), false);
});

test('matching needs every pair and no extras', () => {
  assert.equal(isCorrect(matching, { l1: 'r1', l2: 'r2' }), true);
  assert.equal(isCorrect(matching, { l1: 'r1', l2: 'r3' }), false);
  assert.equal(isCorrect(matching, { l1: 'r1' }), false);
  assert.equal(isCorrect(matching, { l1: 'r1', l2: 'r2', l3: 'r3' }), false);
});

test('open counts only "got"', () => {
  assert.equal(isCorrect(open, 'got'), true);
  assert.equal(isCorrect(open, 'partial'), false);
  assert.equal(isCorrect(open, 'missed'), false);
});

test('null or missing response is wrong for every type', () => {
  for (const q of [single, multi, ordering, matching, open, truefalse, log]) {
    assert.equal(isCorrect(q, null), false, q.type);
    assert.equal(isCorrect(q, undefined), false, q.type);
  }
});
