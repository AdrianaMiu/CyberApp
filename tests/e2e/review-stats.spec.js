import { test, expect } from '@playwright/test';
import { answerQuestion, byText, playRun, startPractice, scenarios, questions } from './helpers.js';

const HOURS_25 = 25 * 60 * 60 * 1000;

async function currentQuestion(page) {
  await page.locator('.question-text').waitFor();
  return byText(await page.locator('.question-text').innerText());
}

async function answerOne(page, correct) {
  const q = await currentQuestion(page);
  await answerQuestion(page, q, correct);
  if (q.type !== 'open') await page.locator('#submit').click();
  await expect(page.locator('#feedback .verdict')).toBeVisible();
  return q;
}

const hash = (page, value) => page.evaluate((v) => { location.hash = v; }, value);

test('a missed question is not due at once, is due after a day, and leaves the due list once answered correctly', async ({ page }) => {
  await page.clock.install({ time: new Date('2026-10-23T10:00:00') });
  await startPractice(page, ['dlp']);
  const missed = await answerOne(page, false);

  await hash(page, '#/review');
  await expect(page.locator('.review-due')).toContainText('0');
  await expect(page.locator('.review-waiting')).toContainText('1');
  await expect(page.locator('#start')).toBeDisabled();

  await page.clock.fastForward(HOURS_25);
  await hash(page, '#/stats');
  await hash(page, '#/review');
  await expect(page.locator('.review-due')).toContainText('1');
  await page.locator('#start').click();
  const served = await currentQuestion(page);
  expect(served.id).toBe(missed.id);
  await answerOne(page, true);
  await page.locator('#next').click();
  await expect(page.locator('h2.results-score')).toHaveText('Score: 1 / 1');

  await hash(page, '#/stats');
  await hash(page, '#/review');
  await expect(page.locator('.review-due')).toContainText('0');
});

test('a flagged question answered correctly stays in the queue', async ({ page }) => {
  await page.clock.install({ time: new Date('2026-10-23T10:00:00') });
  await startPractice(page, ['dlp']);
  const q = await currentQuestion(page);
  await answerQuestion(page, q, true);
  await page.locator('button.flag').click();
  await page.locator('#submit').click();
  await expect(page.locator('#feedback .verdict')).toBeVisible();

  await page.clock.fastForward(HOURS_25);
  await hash(page, '#/review');
  await expect(page.locator('.review-due')).toContainText('1');
  await page.locator('#start').click();
  await answerOne(page, true);
  const rec = await page.evaluate((id) => JSON.parse(localStorage.getItem('cyberquiz:v1')).records[id], q.id);
  expect(rec.flagged).toBe(true);
  expect(rec.box).toBe(1);
});

test('a chained scenario question in Review shows the scenario above it', async ({ page }) => {
  await page.clock.install({ time: new Date('2026-10-23T10:00:00') });
  await page.goto(`/#/scenarios/${scenarios[0].id}`);
  await page.locator('#start-scenario').click();
  await answerOne(page, false);

  await page.clock.fastForward(HOURS_25);
  await hash(page, '#/review');
  await page.locator('#start').click();
  await expect(page.locator('.scenario-context')).toContainText(scenarios[0].title);
  await expect(page.locator('.scenario-context')).toContainText(scenarios[0].narrative.split('\n')[0]);
});

test('with nothing to review the page says so', async ({ page }) => {
  await page.goto('/#/review');
  await expect(page.locator('.review-empty')).toBeVisible();
  await expect(page.locator('#start')).toBeDisabled();
});

test('stats show per-domain percentages, the streak and counts, and survive a reload', async ({ page }) => {
  await startPractice(page, ['dlp']);
  const played = await playRun(page, (q, i) => i !== 0);
  const total = played.length;
  const pct = Math.round(((total - 1) / total) * 100);

  await page.goto('/#/stats');
  const row = page.locator('.domain-row[data-domain="dlp"]');
  await expect(row.locator('progress')).toHaveAttribute('value', String(pct));
  await expect(row).toContainText(`${pct}%`);
  await expect(page.locator('.difficulty-row').first()).toBeVisible();
  await expect(page.locator('.streak')).toContainText('1');
  await expect(page.locator('.count-missed')).toContainText('1');

  await page.reload();
  await expect(page.locator('.domain-row[data-domain="dlp"] progress')).toHaveAttribute('value', String(pct));
});

test('flagged questions are listed on the stats page', async ({ page }) => {
  await startPractice(page, ['dlp']);
  const q = await currentQuestion(page);
  await page.locator('button.flag').click();
  await page.goto('/#/stats');
  await expect(page.locator('.count-flagged')).toContainText('1');
  await expect(page.locator('.flagged-list')).toContainText(q.question);
});

test('stats with no answers show an empty state', async ({ page }) => {
  await page.goto('/#/stats');
  await expect(page.locator('.stats-empty')).toBeVisible();
  expect(questions.length).toBeGreaterThan(0);
});
