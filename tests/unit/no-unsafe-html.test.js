import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const FORBIDDEN = [/innerHTML/, /outerHTML/, /insertAdjacentHTML/, /document\.write/, /\beval\(/];

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(dir, e.name);
    return e.isDirectory() ? walk(p) : p.endsWith('.js') ? [p] : [];
  });
}

export function scanSources(root = '.') {
  const files = [path.join(root, 'app.js'), path.join(root, 'sw.js')].filter((f) => fs.existsSync(f));
  const src = path.join(root, 'src');
  if (fs.existsSync(src)) files.push(...walk(src));
  const hits = [];
  for (const f of files) {
    const text = fs.readFileSync(f, 'utf8');
    for (const re of FORBIDDEN) if (re.test(text)) hits.push(`${f}: ${re}`);
  }
  return hits;
}

test('app sources never use unsafe HTML or eval APIs', () => {
  assert.deepEqual(scanSources(), []);
});

test('the scanner flags a file that uses innerHTML', () => {
  const dir = fs.mkdtempSync(path.join(fs.realpathSync(process.env.TMPDIR || '/tmp'), 'scan-'));
  fs.mkdirSync(path.join(dir, 'src'));
  fs.writeFileSync(path.join(dir, 'src', 'bad.js'), 'el.' + 'innerHTML = x;');
  assert.equal(scanSources(dir).length, 1);
});
