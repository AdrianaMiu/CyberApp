import { test } from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import { resolveRequest, contentType } from '../../tools/serve.js';

const root = path.resolve('/tmp/site-root');

test('root path maps to index.html', () => {
  assert.equal(resolveRequest('/', root), path.join(root, 'index.html'));
});

test('query string is ignored', () => {
  assert.equal(resolveRequest('/data/dlp.json?v=1', root), path.join(root, 'data', 'dlp.json'));
});

test('path traversal returns null', () => {
  assert.equal(resolveRequest('/../package.json', root), null);
  assert.equal(resolveRequest('/%2e%2e/package.json', root), null);
});

test('content types', () => {
  assert.equal(contentType('a.json'), 'application/json; charset=utf-8');
  assert.equal(contentType('a.js'), 'text/javascript; charset=utf-8');
  assert.equal(contentType('manifest.json'), 'application/manifest+json');
  assert.equal(contentType('a.png'), 'image/png');
  assert.equal(contentType('a.svg'), 'image/svg+xml');
});
