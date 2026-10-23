import { test, expect } from '@playwright/test';
import { playRun, startPractice, questions } from './helpers.js';

const eligible = (domain) => questions.filter((q) => q.domain === domain && q.reviewed && !q.disputed && q.type !== 'open' && !q.scenario_id);

test('a fully correct dlp run says Correct each time and ends with a perfect score', async ({ page }) => {
  await startPractice(page, ['dlp']);
  const total = eligible('dlp').length;
  await expect(page.locator('.run-progress')).toContainText(`1 / ${total}`);
  const played = await playRun(page);
  expect(played).toHaveLength(total);
  for (const p of played) expect(p.verdict).toBe('Correct');
  await expect(page.locator('h2.results-score')).toHaveText(`Score: ${total} / ${total}`);
  await expect(page.locator('table.by-domain tbody tr')).toHaveCount(1);
});

test('wrong answers say Incorrect and explain the chosen distractor', async ({ page }) => {
  await startPractice(page, ['dlp']);
  const played = await playRun(page, () => false, {
    after: async (q, { chosen, verdict }) => {
      expect(verdict).toBe('Incorrect');
      if (q.type === 'single') {
        await expect(page.locator('#feedback')).toContainText(q.explanation.distractors[chosen[0]]);
      }
      await expect(page.locator('#feedback')).toContainText(q.explanation.correct);
    },
  });
  expect(played.length).toBeGreaterThan(0);
  await expect(page.locator('h2.results-score')).toHaveText(`Score: 0 / ${played.length}`);
  await expect(page.locator('.missed-list li')).toHaveCount(played.length);
});

test('log-analysis, ordering and matching questions can be answered', async ({ page }) => {
  await startPractice(page, ['siem']);
  const played = await playRun(page);
  expect(new Set(played.map((p) => p.q.type))).toEqual(new Set(['log-analysis', 'ordering', 'matching']));
  const total = played.length;
  await expect(page.locator('h2.results-score')).toHaveText(`Score: ${total} / ${total}`);
});

test('wrong ordering and matching answers are marked incorrect', async ({ page }) => {
  await startPractice(page, ['siem']);
  const played = await playRun(page, () => false);
  for (const p of played) expect(p.verdict).toBe('Incorrect');
});

test('multi-select Submit stays disabled until something is ticked', async ({ page }) => {
  await startPractice(page, ['dlp']);
  let checked = false;
  await playRun(page, () => true, {
    before: async (q) => {
      if (q.type === 'multi' && !checked) {
        checked = true;
        await expect(page.locator('#submit')).toBeDisabled();
        await page.locator(`.q input[value="${q.answer[0]}"]`).check();
        await expect(page.locator('#submit')).toBeEnabled();
        await page.locator(`.q input[value="${q.answer[0]}"]`).uncheck();
        await expect(page.locator('#submit')).toBeDisabled();
      }
    },
  });
  expect(checked).toBe(true);
});

test('ordering can be changed with the keyboard', async ({ page }) => {
  await startPractice(page, ['siem']);
  let tried = false;
  await playRun(page, () => true, {
    before: async (q) => {
      if (q.type === 'ordering' && !tried) {
        tried = true;
        const before = await page.locator('.q ol.order li').evaluateAll((els) => els.map((e) => e.dataset.id));
        const button = page.locator(`.q ol.order li[data-id="${before[0]}"] button.move-down`);
        await button.focus();
        await page.keyboard.press('Enter');
        const after = await page.locator('.q ol.order li').evaluateAll((els) => els.map((e) => e.dataset.id));
        expect(after[1]).toBe(before[0]);
      }
    },
  });
  expect(tried).toBe(true);
});

test('markup in a question is shown as text and never runs (Review Focus 2)', async ({ page }) => {
  await startPractice(page, ['dlp']);
  const markup = '<img src=x onerror="window.__pwned=1">';
  let seen = false;
  await playRun(page, () => true, {
    before: async (q) => {
      if (q.id === 'dlp-0002') {
        seen = true;
        await expect(page.locator('.question-text')).toContainText(markup);
        await expect(page.locator('.q pre.context')).toContainText(markup);
        await expect(page.locator('.q label.choice').filter({ hasText: markup })).toHaveCount(1);
        await expect(page.locator('.q img')).toHaveCount(0);
        expect(await page.evaluate(() => window.__pwned)).toBeUndefined();
      }
    },
  });
  expect(seen).toBe(true);
  expect(await page.evaluate(() => window.__pwned)).toBeUndefined();
});

test('"Not sure" toggles and is remembered for the question', async ({ page }) => {
  await startPractice(page, ['dlp']);
  await page.locator('.question-text').waitFor();
  const flag = page.locator('button.flag');
  await expect(flag).toHaveAttribute('aria-pressed', 'false');
  await flag.click();
  await expect(flag).toHaveAttribute('aria-pressed', 'true');
  const stored = await page.evaluate(() => JSON.parse(localStorage.getItem('cyberquiz:v1')).records);
  expect(Object.values(stored).some((r) => r.flagged)).toBe(true);
});

test('open and scenario questions never appear in Practice', async ({ page }) => {
  await startPractice(page, ['incident-response']);
  const total = eligible('incident-response').length;
  await expect(page.locator('.run-progress')).toContainText(`1 / ${total}`);
  const played = await playRun(page);
  expect(played.every((p) => p.q.type !== 'open' && !p.q.scenario_id)).toBe(true);
});

test('a domain that fails to load shows an error with Retry, not a blank page (Review Focus 4)', async ({ page }) => {
  await page.route('**/data/dlp.json*', (route) => route.abort());
  await page.goto('/#/practice');
  await expect(page.locator('[role="alert"]')).toContainText(/could not load/i);
  await page.unroute('**/data/dlp.json*');
  await page.getByRole('button', { name: 'Try again' }).click();
  await expect(page.locator('input[name="domain"][value="dlp"]')).toBeVisible();
});

test('with every data request failing the page still shows an error, not a blank screen', async ({ page }) => {
  await page.route('**/data/**', (route) => route.abort());
  await page.goto('/#/practice');
  await expect(page.locator('h1')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Try again' })).toBeVisible();
});

test('a practice run works when localStorage is blocked and warns that progress is not saved (Review Focus 1)', async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(window, 'localStorage', { get() { throw new Error('blocked'); } });
  });
  await page.goto('/#/practice');
  await expect(page.locator('.notice[role="status"]')).toContainText(/cannot be saved/i);
  await page.locator('input[name="domain"][value="dlp"]').check();
  await page.locator('#start').click();
  const played = await playRun(page);
  await expect(page.locator('h2.results-score')).toHaveText(`Score: ${played.length} / ${played.length}`);
});

test('an impossible filter combination disables Start', async ({ page }) => {
  await page.goto('/#/practice');
  await page.locator('select[name="difficulty"]').selectOption('advanced');
  await page.locator('select[name="sector"]').selectOption('tech-vendor');
  await page.locator('input[name="domain"][value="dlp"]').check();
  await expect(page.locator('#start')).toBeDisabled();
  await expect(page.locator('.no-match')).toBeVisible();
});
