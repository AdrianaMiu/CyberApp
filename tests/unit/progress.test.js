import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createStore } from '../../src/progress.js';
import { DAY_MS, answerHash } from '../../src/leitner.js';

function memoryStorage(initial = {}) {
  const data = { ...initial };
  return {
    data,
    getItem: (k) => (k in data ? data[k] : null),
    setItem: (k, v) => { data[k] = String(v); },
    removeItem: (k) => { delete data[k]; },
  };
}
const throwingStorage = {
  getItem() { throw new Error('blocked'); },
  setItem() { throw new Error('blocked'); },
  removeItem() { throw new Error('blocked'); },
};
const q = (id, over = {}) => ({ id, domain: 'dlp', difficulty: 'basic', type: 'single', answer: ['a'], options: [{ id: 'a', text: 'A' }, { id: 'b', text: 'B' }], ...over });
const clock = (t) => { const f = () => f.t; f.t = t; return f; };
const T0 = new Date(2026, 9, 23, 12, 0, 0).getTime();

test('storage that throws on every call does not break the store (Review Focus 1)', () => {
  const store = createStore({ storage: throwingStorage, now: clock(T0) });
  const rec = store.recordAnswer(q('dlp-0001'), false);
  assert.equal(rec.box, 1);
  assert.equal(store.persistent, false);
  assert.equal(store.get('dlp-0001').lastCorrect, false);
  assert.deepEqual(store.missedIds(), ['dlp-0001']);
});

test('corrupt stored JSON starts a fresh store', () => {
  const store = createStore({ storage: memoryStorage({ 'cyberquiz:v1': '{nope' }), now: clock(T0) });
  assert.equal(store.get('dlp-0001'), undefined);
  assert.deepEqual(store.dueIds(T0), []);
});

test('records persist across store instances', () => {
  const storage = memoryStorage();
  createStore({ storage, now: clock(T0) }).recordAnswer(q('dlp-0001'), false);
  const again = createStore({ storage, now: clock(T0) });
  assert.equal(again.get('dlp-0001').attempts, 1);
  assert.equal(again.persistent, true);
});

test('a changed answer or options resets the box', () => {
  const store = createStore({ storage: memoryStorage(), now: clock(T0) });
  store.recordAnswer(q('dlp-0001'), false);
  const edited = q('dlp-0001', { answer: ['b'] });
  store.recordAnswer(edited, true);
  const rec = store.get('dlp-0001');
  assert.equal(rec.box, 0);
  assert.equal(rec.attempts, 1);
  assert.equal(rec.hash, answerHash(edited));
});

test('dueIds, missedIds and flaggedIds', () => {
  const t = clock(T0);
  const store = createStore({ storage: memoryStorage(), now: t });
  store.recordAnswer(q('dlp-0001'), false);
  store.recordAnswer(q('dlp-0002'), true);
  store.setFlag(q('dlp-0002'), true);
  assert.deepEqual(store.dueIds(T0), []);
  assert.deepEqual(store.dueIds(T0 + DAY_MS).sort(), ['dlp-0001', 'dlp-0002']);
  assert.deepEqual(store.missedIds(), ['dlp-0001']);
  assert.deepEqual(store.flaggedIds(), ['dlp-0002']);
});

test('stats counts only questions present in the argument', () => {
  const store = createStore({ storage: memoryStorage(), now: clock(T0) });
  const a = q('dlp-0001');
  const b = q('siem-0001', { domain: 'siem', difficulty: 'advanced' });
  store.recordAnswer(a, true);
  store.recordAnswer(a, false);
  store.recordAnswer(b, true);
  store.recordAnswer(q('dlp-0099'), true);
  const s = store.stats([a, b]);
  assert.deepEqual(s.byDomain.dlp, { answered: 2, correct: 1, pct: 50 });
  assert.deepEqual(s.byDomain.siem, { answered: 1, correct: 1, pct: 100 });
  assert.deepEqual(s.byDifficulty.advanced, { answered: 1, correct: 1, pct: 100 });
  assert.equal(s.byDomain.fundamentals, undefined);
});

test('streak', () => {
  const t = clock(new Date(2026, 9, 23, 12, 0).getTime());
  const store = createStore({ storage: memoryStorage(), now: t });
  assert.equal(store.streak(), 0);
  store.recordAnswer(q('dlp-0001'), true);
  assert.equal(store.streak(), 1);
  t.t = new Date(2026, 9, 24, 12, 0).getTime();
  assert.equal(store.streak(), 1, 'yesterday still counts');
  store.recordAnswer(q('dlp-0001'), true);
  assert.equal(store.streak(), 2);
  t.t = new Date(2026, 9, 27, 12, 0).getTime();
  assert.equal(store.streak(), 0, 'two idle days break it');
});

test('streak ignores gaps before the latest run', () => {
  const t = clock(new Date(2026, 9, 20, 12, 0).getTime());
  const store = createStore({ storage: memoryStorage(), now: t });
  store.recordAnswer(q('dlp-0001'), true);
  t.t = new Date(2026, 9, 22, 12, 0).getTime();
  store.recordAnswer(q('dlp-0001'), true);
  t.t = new Date(2026, 9, 23, 12, 0).getTime();
  assert.equal(store.streak(), 1);
});

test('streak uses the local date across midnight', () => {
  const t = clock(new Date(2026, 9, 23, 23, 59).getTime());
  const store = createStore({ storage: memoryStorage(), now: t });
  store.recordAnswer(q('dlp-0001'), true);
  t.t = new Date(2026, 9, 24, 0, 1).getTime();
  assert.equal(store.streak(), 1);
  store.recordAnswer(q('dlp-0001'), true);
  assert.equal(store.streak(), 2);
});

test('800 records stay well under the size budget', () => {
  const store = createStore({ storage: memoryStorage(), now: clock(T0) });
  for (let i = 0; i < 800; i++) store.recordAnswer(q(`dlp-${String(i).padStart(4, '0')}`), i % 2 === 0);
  assert.ok(store.exportJSON().length < 200000);
});

test('settings default and persist', () => {
  const storage = memoryStorage();
  const store = createStore({ storage, now: clock(T0) });
  assert.deepEqual(store.settings.get(), { theme: 'auto', textSize: 1 });
  store.settings.set({ theme: 'dark', textSize: 3, lang: 'ro' });
  assert.deepEqual(createStore({ storage }).settings.get(), { theme: 'dark', textSize: 3, lang: 'ro' });
});

test('export then import round-trips records, days and settings', () => {
  const a = createStore({ storage: memoryStorage(), now: clock(T0) });
  a.recordAnswer(q('dlp-0001'), false);
  a.settings.set({ theme: 'light' });
  const b = createStore({ storage: memoryStorage(), now: clock(T0) });
  assert.deepEqual(b.importJSON(a.exportJSON()), { ok: true, imported: 1 });
  assert.deepEqual(b.get('dlp-0001'), a.get('dlp-0001'));
  assert.equal(b.settings.get().theme, 'light');
  assert.equal(b.streak(), 1);
});

test('records for unknown question ids are kept in the export', () => {
  const a = createStore({ storage: memoryStorage(), now: clock(T0) });
  a.recordAnswer(q('dlp-4242'), true);
  const b = createStore({ storage: memoryStorage(), now: clock(T0) });
  b.importJSON(a.exportJSON());
  assert.ok(JSON.parse(b.exportJSON()).records['dlp-4242']);
});

test('invalid imports are rejected and leave progress untouched (Review Focus 3)', () => {
  const store = createStore({ storage: memoryStorage(), now: clock(T0) });
  store.recordAnswer(q('dlp-0001'), false);
  const before = store.exportJSON().replace(/"exportedAt":"[^"]*"/, '');
  const good = JSON.parse(store.exportJSON());
  const cases = [
    'not json',
    JSON.stringify({ ...good, schema: 2 }),
    JSON.stringify({ ...good, app: 'other' }),
    JSON.stringify({ ...good, records: [] }),
    JSON.stringify({ ...good, records: { 'dlp-0001': { ...good.records['dlp-0001'], box: 'x' } } }),
    JSON.stringify({ ...good, records: { 'dlp-0001': { ...good.records['dlp-0001'], box: 9 } } }),
    JSON.stringify({ ...good, days: ['yesterday'] }),
  ];
  for (const text of cases) {
    const r = store.importJSON(text);
    assert.equal(r.ok, false, text);
    assert.equal(typeof r.error, 'string');
  }
  assert.equal(store.exportJSON().replace(/"exportedAt":"[^"]*"/, ''), before);
});

test('reset clears records, days and settings', () => {
  const store = createStore({ storage: memoryStorage(), now: clock(T0) });
  store.recordAnswer(q('dlp-0001'), false);
  store.settings.set({ theme: 'dark' });
  store.reset();
  assert.equal(store.get('dlp-0001'), undefined);
  assert.equal(store.streak(), 0);
  assert.equal(store.settings.get().theme, 'auto');
});
