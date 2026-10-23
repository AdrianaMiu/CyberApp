import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { listSiteFiles, buildSite } from '../../tools/build-site.js';

function project() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'site-'));
  const put = (rel, text = 'x') => {
    fs.mkdirSync(path.dirname(path.join(root, rel)), { recursive: true });
    fs.writeFileSync(path.join(root, rel), text);
  };
  for (const f of ['index.html', 'app.js', 'styles.css', 'manifest.json', 'src/a.js', 'src/views/b.js', 'data/index.json', 'data/dlp.json', 'icons/i.png']) put(f);
  put('sw.js', "const BUILD = '__BUILD__';");
  for (const f of ['tests/t.js', 'research/r.md', 'tools/z.js', 'package.json', 'node_modules/n/index.js', 'CONTEXTi.md', 'docs/p.md', '.git/config']) put(f);
  return root;
}

test('listSiteFiles returns only site files', () => {
  const files = listSiteFiles(project());
  assert.deepEqual(files, [
    'app.js', 'data/dlp.json', 'data/index.json', 'icons/i.png', 'index.html', 'manifest.json', 'src/a.js', 'src/views/b.js', 'styles.css', 'sw.js',
  ]);
});

test('buildSite copies files, writes precache.json and stamps sw.js', () => {
  const root = project();
  const out = path.join(root, '_site');
  buildSite({ root, out, build: 'abc123' });
  assert.ok(fs.existsSync(path.join(out, 'index.html')));
  assert.ok(!fs.existsSync(path.join(out, 'tests')));
  assert.ok(!fs.existsSync(path.join(out, 'research')));
  assert.match(fs.readFileSync(path.join(out, 'sw.js'), 'utf8'), /'abc123'/);
  const precache = JSON.parse(fs.readFileSync(path.join(out, 'precache.json'), 'utf8'));
  assert.ok(precache.includes('./'));
  assert.ok(precache.includes('index.html'));
  assert.ok(precache.includes('src/views/b.js'));
  assert.ok(!precache.some((p) => p.startsWith('data/')));
  assert.ok(!precache.includes('precache.json'));
});

test('build defaults to "dev" and tolerates a missing sw.js', () => {
  const root = project();
  fs.rmSync(path.join(root, 'sw.js'));
  const out = path.join(root, '_site');
  assert.doesNotThrow(() => buildSite({ root, out }));
  assert.ok(fs.existsSync(path.join(out, 'precache.json')));
});

test('dataDir replaces data/', () => {
  const root = project();
  const alt = fs.mkdtempSync(path.join(os.tmpdir(), 'alt-'));
  fs.writeFileSync(path.join(alt, 'index.json'), '{"alt":true}');
  const out = path.join(root, '_site');
  buildSite({ root, out, dataDir: alt });
  assert.equal(fs.readFileSync(path.join(out, 'data', 'index.json'), 'utf8'), '{"alt":true}');
  assert.ok(!fs.existsSync(path.join(out, 'data', 'dlp.json')));
});

test('stamping sw.js leaves no placeholder', () => {
  const root = project();
  const out = path.join(root, '_site');
  buildSite({ root, out });
  assert.ok(!fs.readFileSync(path.join(out, 'sw.js'), 'utf8').includes('__BUILD__'));
});
