import fs from 'node:fs';
import { test, expect } from '@playwright/test';
import { startPractice, playRun } from './helpers.js';

test('switching the language changes the page and the html lang', async ({ page }) => {
  await page.goto('/#/settings');
  await expect(page.locator('h1')).toHaveText('Settings');
  await page.locator('select[name="lang"]').selectOption('ro');
  await expect(page.locator('h1')).toHaveText('Setări');
  await expect(page.locator('html')).toHaveAttribute('lang', 'ro');
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('lang', 'ro');
});

test('dark theme is applied and persists across reload', async ({ page }) => {
  await page.goto('/#/settings');
  await page.locator('select[name="theme"]').selectOption('dark');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await page.locator('select[name="theme"]').selectOption('auto');
  await expect(page.locator('html')).not.toHaveAttribute('data-theme', /.+/);
});

test('text size changes the scale variable', async ({ page }) => {
  await page.goto('/#/settings');
  await page.locator('select[name="textSize"]').selectOption('3');
  expect(await page.evaluate(() => document.documentElement.style.getPropertyValue('--text-scale'))).toBe('1.3');
});

test('export downloads a schema-1 JSON file', async ({ page }) => {
  await startPractice(page, ['dlp']);
  await playRun(page);
  await page.goto('/#/settings');
  const [download] = await Promise.all([page.waitForEvent('download'), page.locator('#export').click()]);
  expect(download.suggestedFilename()).toMatch(/^cyberquiz-progress-\d{4}-\d{2}-\d{2}\.json$/);
  const data = JSON.parse(fs.readFileSync(await download.path(), 'utf8'));
  expect(data.schema).toBe(1);
  expect(Object.keys(data.records).length).toBeGreaterThan(0);
});

test('importing a corrupt file shows an error and leaves progress untouched (Review Focus 3)', async ({ page }) => {
  page.on('dialog', (d) => d.accept());
  await startPractice(page, ['dlp']);
  await playRun(page, (q, i) => i !== 0);
  const before = await page.evaluate(() => localStorage.getItem('cyberquiz:v1'));
  await page.goto('/#/settings');
  await page.locator('#import-file').setInputFiles({ name: 'x.json', mimeType: 'application/json', buffer: Buffer.from('not json') });
  await expect(page.locator('.import-error')).toBeVisible();
  const after = await page.evaluate(() => localStorage.getItem('cyberquiz:v1'));
  expect(after).toBe(before);
  await page.locator('#import-file').setInputFiles({ name: 'y.json', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify({ app: 'cyberquiz', schema: 2 })) });
  await expect(page.locator('.import-error')).toBeVisible();
  expect(await page.evaluate(() => localStorage.getItem('cyberquiz:v1'))).toBe(before);
});

test('an export imported into a fresh browser restores the answers', async ({ page, browser, baseURL }) => {
  await startPractice(page, ['dlp']);
  const played = await playRun(page);
  await page.goto('/#/settings');
  const [download] = await Promise.all([page.waitForEvent('download'), page.locator('#export').click()]);
  const file = await download.path();

  const other = await browser.newContext({ baseURL });
  const page2 = await other.newPage();
  page2.on('dialog', (d) => d.accept());
  await page2.goto('/#/stats');
  await expect(page2.locator('.stats-empty')).toBeVisible();
  await page2.goto('/#/settings');
  await page2.locator('#import-file').setInputFiles(file);
  await expect(page2.locator('.import-ok')).toBeVisible();
  await page2.goto('/#/stats');
  await expect(page2.locator('.domain-row[data-domain="dlp"]')).toContainText(`${played.length}/${played.length}`);
  await other.close();
});

test('reset empties the progress after confirmation', async ({ page }) => {
  page.on('dialog', (d) => d.accept());
  await startPractice(page, ['dlp']);
  await playRun(page);
  await page.goto('/#/settings');
  await page.locator('#reset').click();
  await page.goto('/#/stats');
  await expect(page.locator('.stats-empty')).toBeVisible();
});

test('declining the reset confirmation keeps the progress', async ({ page }) => {
  page.on('dialog', (d) => d.dismiss());
  await startPractice(page, ['dlp']);
  await playRun(page);
  await page.goto('/#/settings');
  await page.locator('#reset').click();
  await page.goto('/#/stats');
  await expect(page.locator('.stats-empty')).toHaveCount(0);
});

test('search finds questions by tag and opens one as a single-question run', async ({ page }) => {
  await page.goto('/#/search');
  await page.locator('input[type="search"]').fill('triage');
  const results = page.locator('li.result');
  // incident-response-0001 also has the tag but is scenario-chained, so only the dlp question is offered
  await expect(results).toHaveCount(1);
  await expect(results.first()).toContainText(/DLP/i);
  await results.first().locator('button.open-result').click();
  await expect(page.locator('.question-text')).toBeVisible();
  await expect(page.locator('.run-progress')).toContainText('1 / 1');
});

test('search with no match says so, and the query can come from the URL', async ({ page }) => {
  await page.goto('/#/search?q=kerberos');
  await expect(page.locator('input[type="search"]')).toHaveValue('kerberos');
  await expect(page.locator('.search-none')).toBeVisible();
});

test('the Report link opens a prefilled issue on the configured repository', async ({ page }) => {
  await startPractice(page, ['dlp']);
  await playRun(page, () => true, {
    after: async (q) => {
      const link = page.getByRole('link', { name: 'Report a problem' });
      await expect(link).toHaveCount(1);
      const href = await link.getAttribute('href');
      expect(href.startsWith('https://github.com/AdrianaMiu/CyberApp/issues/new?')).toBe(true);
      expect(decodeURIComponent(href)).toContain(`Report ${q.id}`);
      await expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    },
  });
});

test('search never offers open or scenario-chained questions', async ({ page }) => {
  await page.goto('/#/search?q=containment');
  await expect(page.locator('li.result')).toHaveCount(0);
  await expect(page.locator('.search-none')).toBeVisible();
});
