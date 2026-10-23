import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const text = fs.readFileSync('.github/workflows/deploy.yml', 'utf8');
const deploy = text.slice(text.indexOf('\n  deploy:'));

test('the deploy job can read the repository and write Pages', () => {
  assert.match(deploy, /permissions:[\s\S]*contents: read/);
  assert.match(deploy, /pages: write/);
  assert.match(deploy, /id-token: write/);
});

test('deploy only runs for pushes to main after verify', () => {
  assert.match(deploy, /needs: verify/);
  assert.match(deploy, /github\.ref == 'refs\/heads\/main'/);
});
