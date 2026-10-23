import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { createLoader, DataLoadError } from '../../src/data.js';

const FIX = path.resolve('tests/fixtures/data');

function stub(overrides = {}) {
  const calls = [];
  const fetchFn = async (url) => {
    calls.push(url);
    const file = url.split('?')[0].replace(/^data\//, '');
    if (overrides[file] === 404) return { ok: false, status: 404, json: async () => ({}) };
    if (overrides[file] === 'bad') return { ok: true, status: 200, json: async () => { throw new SyntaxError('bad json'); } };
    const text = overrides[file] ?? fs.readFileSync(path.join(FIX, file), 'utf8');
    return { ok: true, status: 200, json: async () => JSON.parse(text) };
  };
  return { fetchFn, calls };
}

test('loadAll returns only served questions', async () => {
  const { fetchFn } = stub();
  const loader = createLoader({ fetchFn });
  const all = await loader.loadAll();
  const index = JSON.parse(fs.readFileSync(path.join(FIX, 'index.json'), 'utf8'));
  assert.equal(all.length, index.domains.reduce((n, d) => n + d.served, 0));
  assert.ok(all.every((q) => q.reviewed === true && q.disputed !== true));
  assert.ok(!all.some((q) => q.id === 'dlp-0007' || q.id === 'dlp-0008'));
});

test('includeUnreviewed keeps unreviewed but still drops disputed', async () => {
  const { fetchFn } = stub();
  const all = await createLoader({ fetchFn, includeUnreviewed: true }).loadAll();
  assert.ok(all.some((q) => q.id === 'dlp-0007'));
  assert.ok(!all.some((q) => q.id === 'dlp-0008'));
});

test('domain files are requested with the bank version', async () => {
  const { fetchFn, calls } = stub();
  await createLoader({ fetchFn }).loadDomain('dlp');
  assert.ok(calls.some((u) => u.endsWith('dlp.json?v=test.1')), calls.join(','));
});

test('concurrent loads of one domain fetch once', async () => {
  const { fetchFn, calls } = stub();
  const loader = createLoader({ fetchFn });
  await Promise.all([loader.loadDomain('dlp'), loader.loadDomain('dlp')]);
  assert.equal(calls.filter((u) => u.includes('dlp.json')).length, 1);
});

test('a failed domain load throws DataLoadError naming the file and can be retried', async () => {
  const bad = stub({ 'dlp.json': 404 });
  const loader = createLoader({ fetchFn: bad.fetchFn });
  await assert.rejects(loader.loadDomain('dlp'), (e) => e instanceof DataLoadError && e.file === 'dlp.json');
  const good = stub();
  const retry = createLoader({ fetchFn: good.fetchFn });
  assert.ok((await retry.loadDomain('dlp')).length > 0);
});

test('a retry on the same loader refetches after a failure', async () => {
  let fail = true;
  const real = stub();
  const fetchFn = async (url) => {
    if (fail && url.includes('dlp.json')) return { ok: false, status: 503, json: async () => ({}) };
    return real.fetchFn(url);
  };
  const loader = createLoader({ fetchFn });
  await assert.rejects(loader.loadDomain('dlp'), DataLoadError);
  fail = false;
  assert.ok((await loader.loadDomain('dlp')).length > 0);
});

test('invalid JSON becomes a DataLoadError', async () => {
  const { fetchFn } = stub({ 'siem.json': 'bad' });
  await assert.rejects(createLoader({ fetchFn }).loadDomain('siem'), (e) => e instanceof DataLoadError && e.file === 'siem.json');
});

test('an empty bank loads as an empty list', async () => {
  const empty = JSON.stringify({ bankVersion: '0', target: 800, domains: [], scenarios: { file: 'scenarios.json', count: 0 } });
  const { fetchFn } = stub({ 'index.json': empty });
  assert.deepEqual(await createLoader({ fetchFn }).loadAll(), []);
});

test('loadScenarios returns the fixture scenario', async () => {
  const { fetchFn } = stub();
  const scenarios = await createLoader({ fetchFn }).loadScenarios();
  assert.equal(scenarios.length, 1);
  assert.equal(scenarios[0].id, 'scn-001');
});

test('loadIndex is fetched once per loader', async () => {
  const { fetchFn, calls } = stub();
  const loader = createLoader({ fetchFn });
  await loader.loadIndex();
  await loader.loadIndex();
  assert.equal(calls.filter((u) => u.includes('index.json')).length, 1);
});
