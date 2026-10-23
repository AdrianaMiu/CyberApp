# CyberQuiz

A static quiz app that prepares analysts for Data Leakage Monitoring, SOC and Incident Response interviews. Four study modes (Practice, Exam, Scenarios, Review), explanations for every answer, local progress, and offline use as an installable web app. No backend, no accounts, no tracking.

## Run it locally

```bash
npm install
npm run serve          # http://localhost:4173
npm run validate       # checks data/*.json against the schema and distribution rules
npm test               # unit tests (node:test)
npx playwright install chromium
npm run test:e2e -- --project=pixel
```

The iPhone (WebKit) Playwright project is off by default because it needs system libraries (`sudo npx playwright install-deps webkit`); enable it with `PW_IPHONE=1`.

## Content

Questions live in `data/<domain>.json`, scenarios in `data/scenarios.json`, retired question IDs in `data/retired-ids.json`, and `data/index.json` lists the domains and the bank version. Only questions with `reviewed: true` and not `disputed` are served. The data shapes and field rules are enforced by `tools/validate.js` and `src/taxonomy.js`.

## Report link

The "Report a problem" link opens a prefilled GitHub issue. Set `REPO_SLUG` in `src/config.js` to `owner/repo` once the repository exists; the link stays hidden while it is empty.

## Deploy

1. Create the GitHub repository and push `main`.
2. In the repository settings, set Pages "Source" to "GitHub Actions".
3. The workflow in `.github/workflows/deploy.yml` validates the bank, runs the tests and publishes `_site/` (built by `tools/build-site.js`) on every push to `main`.

## Licences

Code: MIT (`LICENSE`). Questions and scenarios in `data/`: CC BY-SA 4.0 (`data/LICENSE.md`).
