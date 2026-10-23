import { test, expect } from '@playwright/test';

test('home shows the title, four mode links and the review count', async ({ page }) => {
  const problems = [];
  page.on('console', (m) => { if (/Content Security Policy/i.test(m.text())) problems.push(m.text()); });
  page.on('pageerror', (e) => problems.push(String(e)));

  await page.setViewportSize({ width: 360, height: 740 });
  await page.goto('/');
  await expect(page.locator('h1')).toHaveText('CyberQuiz');

  const modes = page.locator('a.mode');
  await expect(modes).toHaveCount(4);
  for (const name of ['practice', 'exam', 'scenarios', 'review']) {
    const link = page.locator(`a.mode[href="#/${name}"]`);
    await expect(link).toBeVisible();
    const box = await link.boundingBox();
    expect(box.height).toBeGreaterThanOrEqual(44);
  }
  await expect(page.locator('a.mode[href="#/review"]')).toContainText('0');

  const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
  expect(scrollWidth).toBeLessThanOrEqual(360);
  expect(problems).toEqual([]);
});

test('an unknown route shows a not-found page with a way home', async ({ page }) => {
  await page.goto('/#/definitely-not-a-route');
  await expect(page.locator('h1')).toContainText(/not found|negăsit/i);
  await page.locator('a[href="#/"]').first().click();
  await expect(page.locator('h1')).toHaveText('CyberQuiz');
});

test('switching the stored language shows Romanian', async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('cyberquiz:v1', JSON.stringify({ schema: 1, records: {}, days: [], settings: { theme: 'auto', textSize: 1, lang: 'ro' } }));
  });
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('lang', 'ro');
  await expect(page.locator('a.mode[href="#/practice"]')).toContainText('Exersare');
});
