import { test } from 'node:test';
import assert from 'node:assert/strict';
import { validateQuestion } from '../../tools/validate.js';

function valid() {
  return {
    id: 'dlp-0042',
    domain: 'dlp',
    subtopic: 'triage',
    layer: 'L2',
    sector: 'finance',
    difficulty: 'intermediate',
    type: 'single',
    scenario_id: null,
    tags: ['exfiltration', 'email'],
    attack: ['T1048.003', 'T1567.002'],
    question: 'An employee emailed 2,300 IBANs to a personal Gmail address. What is the first step?',
    options: [
      { id: 'a', text: 'Block the account immediately' },
      { id: 'b', text: 'Check the alert metadata: recipient, classification, history, delivery status' },
      { id: 'c', text: 'Close the alert as a false positive' },
      { id: 'd', text: 'Call the employee' },
    ],
    answer: ['b'],
    explanation: {
      correct: 'Triage starts by validating the alert from data already logged.',
      distractors: { a: 'Disproportionate containment.', c: 'Closing without checking.', d: 'Tipping off.' },
      interview_angle: 'Validate, then act proportionally.',
    },
    references: [{ title: 'NIST SP 800-61r3', url: 'https://csrc.nist.gov/pubs/sp/800/61/r3/final' }],
    source_type: 'scenario-derived',
    version: 1,
    reviewed: false,
  };
}

function expectError(q, re) {
  const errors = validateQuestion(q);
  assert.ok(errors.some((m) => re.test(m)), `expected ${re} in ${JSON.stringify(errors)}`);
}

test('valid single question has no errors', () => {
  assert.deepEqual(validateQuestion(valid()), []);
});

test('messages start with the question id', () => {
  const q = valid();
  delete q.explanation.correct;
  assert.ok(validateQuestion(q).every((m) => m.startsWith('dlp-0042: ')));
});

test('missing explanation.correct', () => {
  const q = valid();
  delete q.explanation.correct;
  expectError(q, /explanation\.correct/);
});

test('answer not among options', () => {
  const q = valid();
  q.answer = ['z'];
  expectError(q, /answer/);
});

test('distractors missing a wrong option', () => {
  const q = valid();
  delete q.explanation.distractors.c;
  expectError(q, /distractors/);
});

test('distractors with an extra key', () => {
  const q = valid();
  q.explanation.distractors.b = 'explains the correct one';
  expectError(q, /distractors/);
});

test('id prefix must match domain', () => {
  const q = valid();
  q.id = 'siem-0001';
  expectError(q, /\bid\b/);
});

for (const [field, value] of [
  ['domain', 'nope'],
  ['layer', 'L9'],
  ['sector', 'retail'],
  ['difficulty', 'easy'],
  ['type', 'essay'],
  ['source_type', 'blog'],
]) {
  test(`unknown ${field}`, () => {
    const q = valid();
    q[field] = value;
    expectError(q, new RegExp(field));
  });
}

test('duplicate option ids', () => {
  const q = valid();
  q.options[1].id = 'a';
  expectError(q, /options/);
});

test('"all of the above" option is rejected', () => {
  const q = valid();
  q.options[3].text = 'All of the above';
  expectError(q, /all of the above/);
});

test('references must not be empty', () => {
  const q = valid();
  q.references = [];
  expectError(q, /references/);
});

test('reference url must be https', () => {
  const q = valid();
  q.references[0].url = 'http://example.com';
  expectError(q, /url/);
});

test('attack ids must look like ATT&CK technique ids', () => {
  const q = valid();
  q.attack = ['1048'];
  expectError(q, /attack/);
  q.attack = ['T1048.003'];
  assert.deepEqual(validateQuestion(q), []);
});

test('single with two answers', () => {
  const q = valid();
  q.answer = ['a', 'b'];
  expectError(q, /answer/);
});

test('scenario_id format', () => {
  const q = valid();
  q.scenario_id = 'abc';
  expectError(q, /scenario_id/);
});

test('version must be a positive integer', () => {
  const q = valid();
  q.version = 0;
  expectError(q, /version/);
});

test('reviewed must be boolean', () => {
  const q = valid();
  q.reviewed = 'yes';
  expectError(q, /reviewed/);
});

test('multi accepts several answers', () => {
  const q = valid();
  q.type = 'multi';
  q.answer = ['a', 'b'];
  q.explanation.distractors = { c: 'wrong c', d: 'wrong d' };
  assert.deepEqual(validateQuestion(q), []);
});

test('truefalse needs options a/b and one answer', () => {
  const q = valid();
  q.type = 'truefalse';
  q.options = [{ id: 'a', text: 'True' }, { id: 'b', text: 'False' }];
  q.answer = ['a'];
  q.explanation.distractors = { b: 'It is true because ...' };
  assert.deepEqual(validateQuestion(q), []);
  q.options = [{ id: 'x', text: 'True' }, { id: 'y', text: 'False' }];
  expectError(q, /options/);
});

function ordering() {
  const q = valid();
  q.type = 'ordering';
  q.options = [
    { id: 'a', text: 'Containment' },
    { id: 'b', text: 'Preparation' },
    { id: 'c', text: 'Detection and analysis' },
  ];
  q.answer = ['b', 'c', 'a'];
  q.explanation.distractors = {};
  return q;
}

test('ordering valid and permutation check', () => {
  const q = ordering();
  assert.deepEqual(validateQuestion(q), []);
  q.answer = ['b', 'c'];
  expectError(q, /answer/);
  q.answer = ['b', 'b', 'a'];
  expectError(q, /answer/);
});

function matching() {
  const q = valid();
  q.type = 'matching';
  q.options = {
    left: [{ id: 'l1', text: '4624' }, { id: 'l2', text: '4688' }],
    right: [{ id: 'r1', text: 'Logon' }, { id: 'r2', text: 'Process creation' }, { id: 'r3', text: 'Log cleared' }],
  };
  q.answer = { l1: 'r1', l2: 'r2' };
  q.explanation.distractors = { l1: 'Not process creation.' };
  return q;
}

test('matching valid and answer id checks', () => {
  const q = matching();
  assert.deepEqual(validateQuestion(q), []);
  q.answer = { l1: 'r1', l9: 'r2' };
  expectError(q, /answer/);
  q.answer = { l1: 'r1', l2: 'r9' };
  expectError(q, /answer/);
  q.answer = { l1: 'r1' };
  expectError(q, /answer/);
});

test('open questions need scenario_id, no options, rubric of 3 to 6', () => {
  const q = valid();
  q.type = 'open';
  delete q.options;
  q.answer = [];
  q.scenario_id = 'scn-001';
  q.explanation.distractors = {};
  q.rubric = ['one', 'two', 'three'];
  assert.deepEqual(validateQuestion(q), []);

  const noScenario = structuredClone(q);
  noScenario.scenario_id = null;
  expectError(noScenario, /open/);

  const withOptions = structuredClone(q);
  withOptions.options = [{ id: 'a', text: 'x' }];
  expectError(withOptions, /options/);

  for (const n of [2, 7]) {
    const bad = structuredClone(q);
    bad.rubric = Array.from({ length: n }, (_, i) => `point ${i}`);
    expectError(bad, /rubric/);
  }
});

test('log-analysis requires context', () => {
  const q = valid();
  q.type = 'log-analysis';
  expectError(q, /context/);
  q.context = '4625 x 40 from 10.0.0.5';
  assert.deepEqual(validateQuestion(q), []);
});

test('ordering whose options are already in the correct order is rejected', () => {
  const q = ordering();
  q.options = [
    { id: 'a', text: 'Preparation' },
    { id: 'b', text: 'Detection and analysis' },
    { id: 'c', text: 'Containment' },
  ];
  q.answer = ['a', 'b', 'c'];
  expectError(q, /already in the correct order/);
});

test('a shuffled ordering question is still accepted', () => {
  const q = ordering();
  assert.deepEqual(validateQuestion(q), []);
});
