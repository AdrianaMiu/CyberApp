// One-off generator: renders icons/icon.svg to the PNG sizes the manifest needs.
// Usage: node tools/make-icons.js   (requires the Playwright chromium browser)
import fs from 'node:fs';
import { chromium } from '@playwright/test';

const svg = fs.readFileSync('icons/icon.svg', 'utf8');
const targets = [
  { file: 'icons/icon-192.png', size: 192, inset: 0 },
  { file: 'icons/icon-512.png', size: 512, inset: 0 },
  { file: 'icons/icon-maskable-512.png', size: 512, inset: 0.14, full: true },
  { file: 'icons/apple-touch-icon.png', size: 180, inset: 0, full: true },
];

const browser = await chromium.launch();
for (const t of targets) {
  const page = await browser.newPage({ viewport: { width: t.size, height: t.size } });
  const pad = Math.round(t.size * t.inset);
  const body = svg.replace(/<svg /, `<svg width="${t.size - pad * 2}" height="${t.size - pad * 2}" `);
  const background = t.full ? '#1d4ed8' : 'transparent';
  await page.setContent(`<body style="margin:0;background:${background};display:grid;place-items:center;width:${t.size}px;height:${t.size}px">${body}</body>`);
  await page.screenshot({ path: t.file, omitBackground: !t.full });
  await page.close();
}
await browser.close();
console.log('icons written');
