import { test } from 'node:test';
import assert from 'node:assert/strict';
import { searchQuestions } from '../../src/search.js';

const q = (id, over) => ({ id, domain: 'dlp', subtopic: 'x', tags: [], question: 'Plain text', ...over });
const bank = [
  q('dlp-0001', { question: 'Why does email exfiltration matter?' }),
  q('dlp-0002', { tags: ['exfiltration'], question: 'Something else' }),
  q('dlp-0003', { subtopic: 'Exfiltration channels' }),
  q('dlp-0004', { tags: ['unrelated'] }),
];

test('tag matches outrank subtopic matches, which outrank text matches', () => {
  assert.deepEqual(searchQuestions(bank, 'exfiltration').map((x) => x.id), ['dlp-0002', 'dlp-0003', 'dlp-0001']);
});

test('search is case-insensitive and trims', () => {
  assert.deepEqual(searchQuestions(bank, '  EXFILTRATION ').map((x) => x.id), ['dlp-0002', 'dlp-0003', 'dlp-0001']);
});

test('an empty query returns nothing', () => {
  assert.deepEqual(searchQuestions(bank, ''), []);
  assert.deepEqual(searchQuestions(bank, '   '), []);
});

test('no match returns an empty list', () => {
  assert.deepEqual(searchQuestions(bank, 'kerberos'), []);
});
