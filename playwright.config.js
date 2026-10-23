import { defineConfig, devices } from '@playwright/test';

// The iPhone (WebKit) project needs system libraries that may be missing locally.
// Enable it with PW_IPHONE=1 once `npx playwright install-deps webkit` has been run.
const projects = [{ name: 'pixel', use: { ...devices['Pixel 7'] } }];
if (process.env.PW_IPHONE === '1') projects.push({ name: 'iphone', use: { ...devices['iPhone 13'] } });

export default defineConfig({
  testDir: 'tests/e2e',
  timeout: 30000,
  fullyParallel: true,
  reporter: [['list']],
  use: { baseURL: 'http://localhost:4173', serviceWorkers: 'block' },
  projects,
  webServer: {
    command: 'node tools/build-site.js --out _site --data tests/fixtures/data && node tools/serve.js --root _site --port 4173',
    url: 'http://localhost:4173/index.html',
    reuseExistingServer: !process.env.CI,
    timeout: 30000,
  },
});
