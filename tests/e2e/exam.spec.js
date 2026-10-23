import { test, expect } from '@playwright/test';
import { answerQuestion, byText, questions } from './helpers.js';

const eligible = questions.filter((q) => q.reviewed && !q.disputed && q.type !== 'open' && !q.scenario_id);

async function startExam(page, count) {
  await page.goto('/#/exam');
  if (count) await page.locator('select[name="count"]').selectOption(String(count));
  await page.locator('#start').click();
  await page.locator('.question-text').waitFor();
}

async function current(page) {
  return byText(await page.locator('.question-text').innerText());
}

test('exam setup caps the count to the eligible pool and says so (Review Focus 4)', async ({ page }) => {
  await page.goto('/#/exam');
  await expect(page.locator('select[name="count"] option')).toHaveText(['30', '45', '60']);
  await expect(page.locator('.pool-note')).toContainText(String(eligible.length));
  await page.locator('#start').click();
  await expect(page.locator('.run-progress')).toContainText(`1 / ${eligible.length}`);
});

test('the timer starts at total x 1.5 minutes and counts down', async ({ page }) => {
  await page.clock.install();
  await startExam(page);
  const minutes = (eligible.length * 90) / 60;
  const expected = `${String(Math.floor(minutes)).padStart(2, '0')}:${String(Math.round((minutes % 1) * 60)).padStart(2, '0')}`;
  await expect(page.locator('.timer')).toHaveText(expected);
  await page.clock.fastForward(5000);
  await expect(page.locator('.timer')).not.toHaveText(expected);
});

test('an exam shows no verdict, then a score with a per-domain table at the end', async ({ page }) => {
  await startExam(page);
  for (let i = 0; i < eligible.length; i++) {
    const q = await current(page);
    await answerQuestion(page, q, true);
    await page.locator('#submit').click();
    await expect(page.locator('#feedback .verdict')).toHaveCount(0);
    await page.locator('#next').click();
  }
  await expect(page.locator('h2.results-score')).toHaveText(`Score: ${eligible.length} / ${eligible.length}`);
  await expect(page.locator('table.by-domain tbody tr')).toHaveCount(new Set(eligible.map((q) => q.domain)).size);
});

test('skipping questions counts them as wrong', async ({ page }) => {
  await startExam(page);
  for (let i = 0; i < eligible.length; i++) await page.locator('#next').click();
  await expect(page.locator('h2.results-score')).toHaveText(`Score: 0 / ${eligible.length}`);
  await expect(page.locator('.missed-list li')).toHaveCount(eligible.length);
});

test('time running out while a question is open ends the exam (Review Focus 5)', async ({ page }) => {
  await page.clock.install();
  await startExam(page);
  const q = await current(page);
  await answerQuestion(page, q, true);
  await page.locator('#submit').click();
  await page.locator('#next').click();
  await page.locator('.question-text').waitFor();
  await page.clock.fastForward(eligible.length * 90000 + 2000);
  await expect(page.locator('h2.results-score')).toBeVisible();
  await expect(page.locator('.expired-note')).toBeVisible();
  await expect(page.locator('h2.results-score')).toHaveText(`Score: 1 / ${eligible.length}`);
  const stored = await page.evaluate(() => Object.keys(JSON.parse(localStorage.getItem('cyberquiz:v1')).records).length);
  expect(stored).toBe(eligible.length);
});

test('reloading during an exam returns to setup without an error', async ({ page }) => {
  await startExam(page);
  await page.reload();
  await expect(page.locator('#start')).toBeVisible();
  await expect(page.locator('[role="alert"]')).toHaveCount(0);
});
