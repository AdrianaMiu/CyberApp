import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createSession } from '../../src/session.js';

const mkq = (id, domain) => ({ id, domain, type: 'single', answer: ['a'], options: [{ id: 'a', text: 'A' }, { id: 'b', text: 'B' }] });
const QS = [mkq('dlp-0001', 'dlp'), mkq('siem-0001', 'siem'), mkq('dlp-0002', 'dlp')];

function fakeStore() {
  const calls = [];
  return {
    calls,
    recordAnswer: (q, correct, o) => calls.push(['rec', q.id, correct, o && o.flagged]),
    setFlag: (q, flagged) => calls.push(['flag', q.id, flagged]),
  };
}
const clock = (t = 1000000) => { const f = () => f.t; f.t = t; return f; };

test('practice records immediately and returns correctness', () => {
  const store = fakeStore();
  const s = createSession({ mode: 'practice', questions: QS, store, now: clock() });
  assert.equal(s.current().id, 'dlp-0001');
  assert.deepEqual(s.submit(['a']), { correct: true });
  assert.deepEqual(store.calls, [['rec', 'dlp-0001', true, undefined]]);
  s.next();
  assert.deepEqual(s.submit(['b']), { correct: false });
  assert.equal(store.calls[1][2], false);
});

test('double submit on one question throws', () => {
  const s = createSession({ mode: 'practice', questions: QS, store: fakeStore(), now: clock() });
  s.submit(['a']);
  assert.throws(() => s.submit(['a']), /already answered/);
});

test('practice finishes after the last next() without extra store writes', () => {
  const store = fakeStore();
  const s = createSession({ mode: 'practice', questions: QS, store, now: clock() });
  for (let i = 0; i < 3; i++) { s.submit(['a']); s.next(); }
  assert.equal(s.finished(), true);
  assert.equal(s.current(), null);
  assert.equal(store.calls.length, 3);
});

test('exam shows no verdict and writes nothing until it finishes', () => {
  const store = fakeStore();
  const s = createSession({ mode: 'exam', questions: QS, store, now: clock() });
  assert.deepEqual(s.submit(['a']), { recorded: true });
  s.next();
  assert.equal(store.calls.length, 0);
  s.next();
  s.next();
  assert.equal(s.finished(), true);
  assert.deepEqual(store.calls.map((c) => [c[1], c[2]]), [['dlp-0001', true], ['siem-0001', false], ['dlp-0002', false]]);
  const r = s.report();
  assert.deepEqual([r.total, r.answered, r.correct, r.expired], [3, 1, 1, false]);
});

test('exam expiry while a question is open closes the exam and counts unanswered as wrong (Review Focus 5)', () => {
  const store = fakeStore();
  const t = clock();
  const s = createSession({ mode: 'exam', questions: QS, store, now: t, perQuestionMs: 90000 });
  s.submit(['a']);
  s.next();
  t.t += 3 * 90000 - 1;
  s.tick();
  assert.equal(s.finished(), false);
  t.t += 1;
  s.tick();
  assert.equal(s.finished(), true);
  assert.equal(s.current(), null);
  const r = s.report();
  assert.equal(r.expired, true);
  assert.equal(r.correct, 1);
  assert.equal(r.items.length, 3);
  assert.equal(store.calls.filter((c) => c[0] === 'rec').length, 3);
  assert.deepEqual(store.calls.filter((c) => c[2] === false).map((c) => c[1]), ['siem-0001', 'dlp-0002']);
  assert.throws(() => s.submit(['a']), /finished/);
});

test('remainingMs counts down in exam mode and is null elsewhere', () => {
  const t = clock();
  const exam = createSession({ mode: 'exam', questions: QS, store: fakeStore(), now: t, perQuestionMs: 90000 });
  assert.equal(exam.remainingMs(), 270000);
  t.t += 10000;
  assert.equal(exam.remainingMs(), 260000);
  const practice = createSession({ mode: 'practice', questions: QS, store: fakeStore(), now: t });
  assert.equal(practice.remainingMs(), null);
});

test('report byDomain totals add up to the items', () => {
  const s = createSession({ mode: 'exam', questions: QS, store: fakeStore(), now: clock() });
  s.submit(['a']); s.next(); s.submit(['b']); s.next(); s.submit(['a']); s.next();
  const r = s.report();
  assert.deepEqual(r.byDomain, { dlp: { total: 2, correct: 2 }, siem: { total: 1, correct: 0 } });
  assert.equal(Object.values(r.byDomain).reduce((n, d) => n + d.total, 0), r.items.length);
});

test('flags: immediate outside exam, deferred in exam', () => {
  const practiceStore = fakeStore();
  const p = createSession({ mode: 'practice', questions: QS, store: practiceStore, now: clock() });
  p.submit(['a']);
  p.setFlag(true);
  assert.deepEqual(practiceStore.calls[1], ['flag', 'dlp-0001', true]);

  const examStore = fakeStore();
  const e = createSession({ mode: 'exam', questions: QS, store: examStore, now: clock() });
  e.submit(['a']);
  e.setFlag(true);
  assert.equal(examStore.calls.length, 0);
  e.next(); e.next(); e.next();
  assert.equal(examStore.calls[0][3], true);
  assert.equal(e.report().items[0].flagged, true);
});
