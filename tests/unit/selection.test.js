import { test } from 'node:test';
import assert from 'node:assert/strict';
import { isEligibleForPractice, buildPractice, buildExam, buildReview, buildScenarioRun } from '../../src/selection.js';
import { DOMAINS } from '../../src/taxonomy.js';

function seeded(seed = 7) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}
const mk = (domain, i, over = {}) => ({
  id: `${domain}-${String(i).padStart(4, '0')}`, domain, layer: 'L1', sector: 'general', difficulty: 'basic', type: 'single', scenario_id: null, ...over,
});
function pool(perDomain) {
  return DOMAINS.flatMap((d) => Array.from({ length: perDomain[d.id] ?? 0 }, (_, i) => mk(d.id, i + 1)));
}
const even = Object.fromEntries(DOMAINS.map((d) => [d.id, 40]));

test('isEligibleForPractice excludes open and scenario questions', () => {
  assert.equal(isEligibleForPractice(mk('dlp', 1)), true);
  assert.equal(isEligibleForPractice(mk('dlp', 1, { type: 'open' })), false);
  assert.equal(isEligibleForPractice(mk('dlp', 1, { scenario_id: 'scn-001' })), false);
});

test('buildPractice filters and truncates', () => {
  const qs = [
    mk('dlp', 1), mk('dlp', 2, { difficulty: 'advanced' }), mk('siem', 1, { layer: 'L2' }), mk('siem', 2, { sector: 'finance' }),
    mk('dlp', 3, { type: 'open' }), mk('dlp', 4, { scenario_id: 'scn-001' }),
  ];
  const rng = seeded();
  assert.deepEqual(buildPractice(qs, { count: 10, rng }).map((q) => q.id).sort(), ['dlp-0001', 'dlp-0002', 'siem-0001', 'siem-0002']);
  assert.deepEqual(buildPractice(qs, { domains: ['siem'], count: 10, rng }).map((q) => q.domain), ['siem', 'siem']);
  assert.deepEqual(buildPractice(qs, { layers: ['L2'], count: 10, rng }).map((q) => q.id), ['siem-0001']);
  assert.deepEqual(buildPractice(qs, { difficulties: ['advanced'], count: 10, rng }).map((q) => q.id), ['dlp-0002']);
  assert.deepEqual(buildPractice(qs, { sectors: ['finance'], count: 10, rng }).map((q) => q.id), ['siem-0002']);
  assert.equal(buildPractice(qs, { count: 2, rng }).length, 2);
});

test('buildExam follows the domain weights without duplicates', () => {
  const exam = buildExam(pool(even), { count: 30, rng: seeded() });
  assert.equal(exam.length, 30);
  assert.equal(new Set(exam.map((q) => q.id)).size, 30);
  for (const d of DOMAINS) {
    const n = exam.filter((q) => q.domain === d.id).length;
    assert.ok(Math.abs(n - (d.weight * 30) / 100) <= 1, `${d.id}: ${n}`);
  }
});

test('a thin domain is filled from its own group before any other', () => {
  const thin = { ...even, dlp: 3 };
  const exam = buildExam(pool(thin), { count: 60, rng: seeded() });
  assert.equal(exam.length, 60);
  assert.equal(exam.filter((q) => q.domain === 'dlp').length, 3);
  const groupCount = (g) => exam.filter((q) => DOMAINS.find((d) => d.id === q.domain).group === g).length;
  // the data group (dlp 18 + cloud 10 + ai 5 = 33%) keeps about 20 of 60 questions: the dlp shortfall goes to cloud and ai
  assert.ok(Math.abs(groupCount('data') - 20) <= 1, `data group got ${groupCount('data')}`);
});

test('exam excludes open and scenario questions and never exceeds the pool (Review Focus 4)', () => {
  const qs = [...pool({ dlp: 8, siem: 4 }), mk('dlp', 90, { type: 'open' }), mk('siem', 90, { scenario_id: 'scn-001' })];
  const exam = buildExam(qs, { count: 60, rng: seeded() });
  assert.equal(exam.length, 12);
  assert.ok(exam.every(isEligibleForPractice));
});

test('buildReview returns only due ids ordered by due date', () => {
  const qs = [mk('dlp', 1), mk('dlp', 2), mk('dlp', 3, { scenario_id: 'scn-001' }), mk('dlp', 4)];
  const due = { 'dlp-0001': 300, 'dlp-0002': 100, 'dlp-0003': 200 };
  const store = { dueIds: () => Object.keys(due), get: (id) => ({ due: due[id] }), missedIds: () => [] };
  assert.deepEqual(buildReview(qs, store, 1000).map((q) => q.id), ['dlp-0002', 'dlp-0003', 'dlp-0001']);
});

test('buildScenarioRun keeps scenario order and rejects missing ids', () => {
  const qs = [mk('dlp', 2), mk('dlp', 1), mk('dlp', 3)];
  const scenario = { id: 'scn-001', questions: ['dlp-0001', 'dlp-0002', 'dlp-0003'] };
  assert.deepEqual(buildScenarioRun(scenario, qs).map((q) => q.id), ['dlp-0001', 'dlp-0002', 'dlp-0003']);
  assert.throws(() => buildScenarioRun({ id: 'scn-001', questions: ['dlp-0001', 'dlp-0404'] }, qs), /scenario scn-001: missing question dlp-0404/);
});
