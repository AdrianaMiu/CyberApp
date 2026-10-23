import { test } from 'node:test';
import assert from 'node:assert/strict';
import { STRINGS, t, detectLang } from '../../src/i18n.js';
import { reportIssueUrl, PER_QUESTION_MS, DATA_BASE } from '../../src/config.js';

test('ro and en define the same keys', () => {
  assert.deepEqual(Object.keys(STRINGS.ro).sort(), Object.keys(STRINGS.en).sort());
});

test('no empty strings', () => {
  for (const lang of ['ro', 'en']) {
    for (const [key, value] of Object.entries(STRINGS[lang])) assert.ok(value.trim() !== '', `${lang}.${key}`);
  }
});

test('missing key returns the key', () => {
  assert.equal(t('ro', 'missing.key'), 'missing.key');
});

test('interpolates variables', () => {
  assert.equal(t('en', 'results.score', { n: 3, total: 5 }), 'Score: 3 / 5');
  assert.equal(t('ro', 'results.score', { n: 3, total: 5 }), 'Scor: 3 / 5');
});

test('detectLang', () => {
  assert.equal(detectLang('ro-RO'), 'ro');
  assert.equal(detectLang('ro'), 'ro');
  assert.equal(detectLang('de-DE'), 'en');
  assert.equal(detectLang(undefined), 'en');
});

test('reportIssueUrl is null without a slug and a github issue url with one', () => {
  const q = { id: 'dlp-0001', question: 'What?' };
  assert.equal(reportIssueUrl('', q), null);
  const url = reportIssueUrl('owner/repo', q);
  assert.ok(url.startsWith('https://github.com/owner/repo/issues/new?'));
  assert.ok(url.includes(encodeURIComponent('Report dlp-0001')));
});

test('config constants', () => {
  assert.equal(PER_QUESTION_MS, 90000);
  assert.equal(DATA_BASE, 'data/');
});
