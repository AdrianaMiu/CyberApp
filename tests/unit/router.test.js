import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseRoute } from '../../src/router.js';

test('home routes', () => {
  assert.deepEqual(parseRoute(''), { name: 'home', params: {} });
  assert.deepEqual(parseRoute('#/'), { name: 'home', params: {} });
  assert.deepEqual(parseRoute('#'), { name: 'home', params: {} });
});

test('mode routes', () => {
  for (const name of ['practice', 'exam', 'scenarios', 'review', 'stats', 'settings', 'search']) {
    assert.equal(parseRoute(`#/${name}`).name, name);
  }
});

test('scenario detail carries the id', () => {
  assert.deepEqual(parseRoute('#/scenarios/scn-001'), { name: 'scenario', params: { id: 'scn-001' } });
});

test('query parameters are decoded', () => {
  assert.deepEqual(parseRoute('#/search?q=dlp%20leak'), { name: 'search', params: { q: 'dlp leak' } });
  assert.deepEqual(parseRoute('#/search?q=a&tag=email').params, { q: 'a', tag: 'email' });
});

test('unknown routes are notfound', () => {
  assert.equal(parseRoute('#/nope').name, 'notfound');
  assert.equal(parseRoute('#/scenarios/a/b').name, 'notfound');
});
