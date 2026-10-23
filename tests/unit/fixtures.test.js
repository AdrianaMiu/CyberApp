import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { validateQuestion } from '../../tools/validate.js';

const dir = new URL('../fixtures/data/', import.meta.url);
const read = (name) => JSON.parse(fs.readFileSync(new URL(name, dir), 'utf8'));
const index = read('index.json');
const questions = index.domains.flatMap((d) => read(d.file).questions);

test('every fixture question is valid', () => {
  const errors = questions.flatMap(validateQuestion);
  assert.deepEqual(errors, []);
});

test('fixture bank covers every type, sector and difficulty', () => {
  assert.equal(questions.length, 20);
  for (const type of ['single', 'multi', 'truefalse', 'ordering', 'matching', 'log-analysis', 'open']) {
    assert.ok(questions.filter((q) => q.type === type).length >= 2, `two ${type} questions`);
  }
  for (const sector of ['finance', 'mssp-consulting', 'tech-vendor', 'general']) {
    assert.ok(questions.some((q) => q.sector === sector), sector);
  }
  for (const d of ['basic', 'intermediate', 'advanced']) assert.ok(questions.some((q) => q.difficulty === d), d);
});

test('fixture index counts match the files', () => {
  for (const d of index.domains) {
    const qs = read(d.file).questions;
    assert.equal(d.authored, qs.length, `${d.id} authored`);
    assert.equal(d.served, qs.filter((q) => q.reviewed && !q.disputed).length, `${d.id} served`);
  }
});

test('fixture scenario chains its questions in order', () => {
  const [scenario] = read('scenarios.json').scenarios;
  assert.equal(scenario.id, 'scn-001');
  const chained = questions.filter((q) => q.scenario_id === 'scn-001').map((q) => q.id);
  assert.deepEqual(scenario.questions, chained);
});
