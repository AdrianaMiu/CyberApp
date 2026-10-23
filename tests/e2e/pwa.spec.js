import { test, expect } from '@playwright/test';

test.use({ serviceWorkers: 'allow' });

async function waitForDataCache(page, needle = 'data/dlp.json') {
  await page.evaluate(() => navigator.serviceWorker.ready);
  await expect.poll(() => page.evaluate(async (n) => {
    const keys = await (await caches.open('cyberquiz-data')).keys();
    return keys.map((k) => k.url).some((u) => u.includes(n));
  }, needle)).toBe(true);
}

test('the manifest is served with the right type and every icon exists', async ({ request, page }) => {
  const res = await request.get('/manifest.json');
  expect(res.status()).toBe(200);
  expect(res.headers()['content-type']).toContain('application/manifest+json');
  const manifest = await res.json();
  expect(manifest.name).toBe('CyberQuiz');
  expect(manifest.display).toBe('standalone');
  expect(manifest.start_url).toBe('./');
  const sizes = manifest.icons.map((i) => i.sizes);
  expect(sizes).toEqual(expect.arrayContaining(['192x192', '512x512']));
  expect(manifest.icons.some((i) => (i.purpose || '').includes('maskable'))).toBe(true);
  for (const icon of manifest.icons) expect((await request.get(`/${icon.src}`)).status()).toBe(200);
  await page.goto('/');
  await expect(page.locator('link[rel="manifest"]')).toHaveCount(1);
  await expect(page.locator('link[rel="apple-touch-icon"]')).toHaveCount(1);
  expect((await request.get('/icons/apple-touch-icon.png')).status()).toBe(200);
});

test('after the first visit the app works offline, including a practice run', async ({ page, context }) => {
  await page.goto('/');
  await expect(page.locator('h1')).toHaveText('CyberQuiz');
  await waitForDataCache(page);
  await waitForDataCache(page, 'data/index.json');

  await context.setOffline(true);
  await page.reload();
  await expect(page.locator('h1')).toHaveText('CyberQuiz');
  await page.goto('/#/practice');
  await page.locator('input[name="domain"][value="dlp"]').check();
  await page.locator('#start').click();
  await expect(page.locator('.question-text')).toBeVisible();
});

test('a changed content version shows the update banner and reload hides it', async ({ page }) => {
  await page.goto('/');
  await waitForDataCache(page);
  await page.evaluate(() => {
    const s = JSON.parse(localStorage.getItem('cyberquiz:v1'));
    s.settings.seenBankVersion = 'older';
    localStorage.setItem('cyberquiz:v1', JSON.stringify(s));
  });
  await page.reload();
  const banner = page.locator('.banner[data-kind="content"]');
  await expect(banner).toBeVisible();
  await banner.getByRole('button').click();
  await expect(page.locator('.banner')).toHaveCount(0);
});

test('data cache entries for other bank versions are pruned', async ({ page }) => {
  await page.goto('/');
  await waitForDataCache(page);
  await page.evaluate(async () => {
    const cache = await caches.open('cyberquiz-data');
    await cache.put('data/dlp.json?v=stale', new Response('{}'));
  });
  await page.reload();
  await expect.poll(() => page.evaluate(async () => {
    const keys = await (await caches.open('cyberquiz-data')).keys();
    return keys.map((k) => k.url).filter((u) => u.includes('v=stale')).length;
  })).toBe(0);
  await waitForDataCache(page);
});

test('only the current shell cache is kept', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => navigator.serviceWorker.ready);
  const names = await page.evaluate(() => caches.keys());
  expect(names.filter((n) => n.startsWith('cyberquiz-shell-'))).toHaveLength(1);
  expect(names).toContain('cyberquiz-data');
});
