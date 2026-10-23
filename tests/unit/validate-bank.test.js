import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { distribution, validateBank, loadBank } from '../../tools/validate.js';
import { DOMAINS, SECTORS } from '../../src/taxonomy.js';

const FIXTURES = path.resolve('tests/fixtures/data');
const fixture = () => structuredClone(loadBank(FIXTURES).input);
const has = (list, re) => list.some((m) => re.test(m));

test('clean fixtures produce no errors', () => {
  const r = validateBank(fixture());
  assert.deepEqual(r.errors, []);
});

test('distribution returns percentages', () => {
  const d = distribution([{ domain: 'dlp' }, { domain: 'dlp' }, { domain: 'siem' }, { domain: 'siem' }], 'domain');
  assert.deepEqual(d, { dlp: 50, siem: 50 });
});

test('duplicate question id', () => {
  const input = fixture();
  input.questions.push(structuredClone(input.questions[0]));
  assert.ok(has(validateBank(input).errors, /duplicate/));
});

test('retired id reuse', () => {
  const input = fixture();
  const q = structuredClone(input.questions[0]);
  q.id = 'dlp-9999';
  input.questions.push(q);
  assert.ok(has(validateBank(input).errors, /retired/));
});

test('per-question errors are reported', () => {
  const input = fixture();
  delete input.questions[0].explanation.correct;
  assert.ok(has(validateBank(input).errors, /explanation\.correct/));
});

test('scenario referencing a missing question', () => {
  const input = fixture();
  input.scenarios[0].questions.push('incident-response-9998');
  assert.ok(has(validateBank(input).errors, /scenario/));
});

test('scenario_id question not referenced by any scenario', () => {
  const input = fixture();
  input.scenarios[0].questions = input.scenarios[0].questions.slice(0, 3);
  assert.ok(has(validateBank(input).errors, /scenario/));
});

test('scenario referencing a question that belongs to another scenario', () => {
  const input = fixture();
  const q = input.questions.find((x) => x.id === 'incident-response-0005');
  input.scenarios[0].questions.push(q.id);
  assert.ok(has(validateBank(input).errors, /scenario/));
});

test('scenario with fewer than 3 questions', () => {
  const input = fixture();
  for (const id of input.scenarios[0].questions.slice(2)) {
    input.questions.find((x) => x.id === id).scenario_id = null;
  }
  input.scenarios[0].questions = input.scenarios[0].questions.slice(0, 2);
  assert.ok(has(validateBank(input).errors, /scenario scn-001: .*3/));
});

test('index counts must match', () => {
  const input = fixture();
  input.index.domains[0].served += 1;
  assert.ok(has(validateBank(input).errors, /index/));
});

test('small banks only get distribution warnings', () => {
  const r = validateBank(fixture());
  assert.deepEqual(r.errors, []);
  assert.ok(has(r.warnings, /distribution/));
});

function synthetic(mutate) {
  const counts = Object.fromEntries(DOMAINS.map((d) => [d.id, d.weight * 8]));
  const domains = DOMAINS.flatMap((d) => Array(counts[d.id]).fill(d.id));
  const sectors = Object.entries(SECTORS).flatMap(([s, pct]) => Array(pct * 8).fill(s));
  const difficulties = [...Array(300).fill('basic'), ...Array(320).fill('intermediate'), ...Array(180).fill('advanced')];
  const seq = {};
  const questions = domains.map((domain, i) => {
    seq[domain] = (seq[domain] || 0) + 1;
    const isOpen = seq[domain] <= (domain === 'dlp' ? 4 : 4);
    const base = {
      id: `${domain}-${String(seq[domain]).padStart(4, '0')}`, domain, sector: sectors[i], difficulty: difficulties[i],
      type: isOpen ? 'open' : 'single', scenario_id: null, reviewed: true,
    };
    return base;
  });
  mutate?.(questions);
  const index = { bankVersion: 'x', target: 800, domains: [], scenarios: { file: 'scenarios.json', count: 0 } };
  return { questions, scenarios: [], retiredIds: [], index };
}

const distMessages = (r) => r.errors.filter((m) => /distribution|eligible|open share/.test(m));

test('perfectly distributed 800-question bank has no distribution errors', () => {
  assert.deepEqual(distMessages(validateBank(synthetic())), []);
});

test('domain more than 3 points off its weight', () => {
  const input = synthetic((qs) => {
    qs.filter((q) => q.domain === 'dlp').slice(0, 40).forEach((q) => { q.domain = 'siem'; });
  });
  assert.ok(has(distMessages(validateBank(input)), /domain/));
});

test('sector more than 5 points off target', () => {
  const input = synthetic((qs) => {
    qs.filter((q) => q.sector === 'general').slice(0, 60).forEach((q) => { q.sector = 'finance'; });
  });
  assert.ok(has(distMessages(validateBank(input)), /sector/));
});

test('too few advanced questions', () => {
  const input = synthetic((qs) => qs.forEach((q) => { if (q.difficulty === 'advanced') q.difficulty = 'intermediate'; }));
  assert.ok(has(distMessages(validateBank(input)), /advanced/));
});

test('a domain with fewer than 20 eligible questions', () => {
  const input = synthetic((qs) => {
    qs.filter((q) => q.domain === 'linux-forensics' && q.type !== 'open').slice(0, 10).forEach((q) => { q.scenario_id = 'scn-001'; });
  });
  assert.ok(has(distMessages(validateBank(input)), /eligible.*linux-forensics/));
});

test('open questions outside 3 to 7 percent', () => {
  const none = synthetic((qs) => qs.forEach((q) => { q.type = 'single'; }));
  assert.ok(has(distMessages(validateBank(none)), /open share/));
  const many = synthetic((qs) => qs.slice(0, 100).forEach((q) => { q.type = 'open'; }));
  assert.ok(has(distMessages(validateBank(many)), /open share/));
});

function tempCopy() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'bank-'));
  fs.cpSync(FIXTURES, dir, { recursive: true });
  return dir;
}
const cli = (dir) => spawnSync(process.execPath, ['tools/validate.js', dir], { encoding: 'utf8' });

test('CLI exits 0 on the fixtures', () => {
  const r = cli(FIXTURES);
  assert.equal(r.status, 0, r.stdout + r.stderr);
});

test('CLI exits 1 on duplicate ids', () => {
  const dir = tempCopy();
  const file = path.join(dir, 'dlp.json');
  const data = JSON.parse(fs.readFileSync(file, 'utf8'));
  data.questions.push(structuredClone(data.questions[0]));
  fs.writeFileSync(file, JSON.stringify(data));
  const r = cli(dir);
  assert.equal(r.status, 1);
  assert.match(r.stdout + r.stderr, /duplicate/);
});

test('CLI exits 1 when a domain file declares another domain', () => {
  const dir = tempCopy();
  const file = path.join(dir, 'siem.json');
  const data = JSON.parse(fs.readFileSync(file, 'utf8'));
  data.questions[0].domain = 'dlp';
  fs.writeFileSync(file, JSON.stringify(data));
  const r = cli(dir);
  assert.equal(r.status, 1);
  assert.match(r.stdout + r.stderr, /domain/);
});

test('CLI exits 1 on malformed JSON and names the file', () => {
  const dir = tempCopy();
  fs.writeFileSync(path.join(dir, 'dlp.json'), '{ nope');
  const r = cli(dir);
  assert.equal(r.status, 1);
  assert.match(r.stdout + r.stderr, /dlp\.json/);
});

test('the real, empty data folder validates', () => {
  const r = cli(path.resolve('data'));
  assert.equal(r.status, 0, r.stdout + r.stderr);
});
