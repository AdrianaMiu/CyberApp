import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { listSiteFiles } from '../../tools/build-site.js';

test('the shell stays under 300 KB (data and icons excluded)', () => {
  const files = listSiteFiles('.').filter((f) => !f.startsWith('data/') && !f.startsWith('icons/'));
  const bytes = files.reduce((n, f) => n + fs.statSync(f).size, 0);
  assert.ok(bytes < 300000, `shell is ${bytes} bytes across ${files.length} files`);
});

test('the shell has no external runtime dependency', () => {
  const files = listSiteFiles('.').filter((f) => /\.(html|js|css)$/.test(f) && !f.startsWith('data/'));
  for (const f of files) {
    const text = fs.readFileSync(f, 'utf8');
    const external = text.match(/(?:src|href)=["']https?:\/\/[^"']+/g) || [];
    const imports = text.match(/\bimport\s[^;]*from\s+["']https?:/g) || [];
    const cssUrls = text.match(/url\(\s*["']?https?:/g) || [];
    assert.deepEqual([...external, ...imports, ...cssUrls], [], f);
  }
});
