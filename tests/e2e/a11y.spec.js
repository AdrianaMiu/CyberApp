import { test, expect } from '@playwright/test';
import { startPractice, playRun, answerQuestion, byText } from './helpers.js';

async function smallTargets(page) {
  return page.evaluate(() => {
    const bad = [];
    const sel = 'button, a[href], select, textarea, input:not([type="hidden"])';
    for (const el of document.querySelectorAll(sel)) {
      if (el.closest('[hidden]') || el.classList.contains('skip')) continue;
      const r = el.getBoundingClientRect();
      if (r.width === 0 || r.height === 0) continue;
      const box = el.matches('input[type="checkbox"], input[type="radio"]') ? el.closest('label').getBoundingClientRect() : r;
      if (Math.min(box.width, box.height) < 44) bad.push(`${el.tagName.toLowerCase()} ${el.textContent.trim().slice(0, 30) || el.name || ''} ${Math.round(box.width)}x${Math.round(box.height)}`);
    }
    return bad;
  });
}

test.beforeEach(async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 740 });
});

test('touch targets are at least 44px on every main screen', async ({ page }) => {
  const screens = ['/', '/#/practice', '/#/exam', '/#/scenarios', '/#/review', '/#/stats', '/#/settings', '/#/search'];
  for (const url of screens) {
    await page.goto(url);
    await page.locator('h1').waitFor();
    expect(await smallTargets(page), url).toEqual([]);
  }
});

test('touch targets are large enough during a question and its feedback', async ({ page }) => {
  await startPractice(page, ['dlp']);
  await page.locator('.question-text').waitFor();
  expect(await smallTargets(page)).toEqual([]);
  const q = byText(await page.locator('.question-text').innerText());
  await answerQuestion(page, q, true);
  await page.locator('#submit').click();
  await expect(page.locator('#feedback .verdict')).toBeVisible();
  expect(await smallTargets(page)).toEqual([]);
});

test('no element uses a positive tabindex and the skip link is reachable by keyboard', async ({ page }) => {
  await page.goto('/');
  await page.locator('h1').waitFor();
  expect(await page.evaluate(() => [...document.querySelectorAll('[tabindex]')].filter((e) => Number(e.getAttribute('tabindex')) > 0).length)).toBe(0);
  // after render the view heading holds focus; Tab continues into the page, Shift+Tab reaches the skip link
  await expect(page.locator('h1')).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(page.locator('a.mode').first()).toBeFocused();
  await page.keyboard.press('Shift+Tab');
  await expect(page.locator('a.skip')).toBeFocused();
});

test('the answer verdict lands in the polite live region', async ({ page }) => {
  await startPractice(page, ['dlp']);
  await playRun(page, () => true, {
    after: async () => { await expect(page.locator('#live')).toHaveText('Correct'); },
  });
  await expect(page.locator('#live')).toHaveAttribute('aria-live', 'polite');
});

test('every form control has an accessible name', async ({ page }) => {
  for (const url of ['/#/practice', '/#/settings', '/#/search']) {
    await page.goto(url);
    await page.locator('h1').waitFor();
    const unnamed = await page.evaluate(() => [...document.querySelectorAll('input:not([type="hidden"]), select, textarea')]
      .filter((el) => !(el.labels && el.labels.length) && !el.getAttribute('aria-label') && !el.getAttribute('aria-labelledby'))
      .map((el) => el.outerHTML.slice(0, 60)));
    expect(unnamed, url).toEqual([]);
  }
});

test('reduced motion removes animations and transitions', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await page.locator('h1').waitFor();
  const moving = await page.evaluate(() => [...document.querySelectorAll('*')].filter((el) => {
    const s = getComputedStyle(el);
    return parseFloat(s.animationDuration) > 0 || parseFloat(s.transitionDuration) > 0;
  }).length);
  expect(moving).toBe(0);
});

test('dark and light themes keep text readable (contrast of body text and primary button)', async ({ page }) => {
  const ratio = async () => page.evaluate(() => {
    const lum = (c) => {
      const [r, g, b] = c.match(/\d+(\.\d+)?/g).slice(0, 3).map((v) => {
        const s = Number(v) / 255;
        return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
      });
      return 0.2126 * r + 0.7152 * g + 0.0722 * b;
    };
    const pair = (fg, bg) => {
      const a = lum(fg); const b = lum(bg);
      return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
    };
    const body = getComputedStyle(document.body);
    const btn = document.createElement('button');
    btn.className = 'btn primary';
    document.body.append(btn);
    const bs = getComputedStyle(btn);
    const out = [pair(body.color, body.backgroundColor), pair(bs.color, bs.backgroundColor)];
    btn.remove();
    return out;
  });
  await page.goto('/');
  await page.locator('h1').waitFor();
  for (const theme of ['light', 'dark']) {
    await page.evaluate((t) => document.documentElement.setAttribute('data-theme', t), theme);
    for (const r of await ratio()) expect(r, theme).toBeGreaterThanOrEqual(4.5);
  }
});
