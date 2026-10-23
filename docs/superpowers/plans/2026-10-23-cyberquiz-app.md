# CyberQuiz App Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the static CyberQuiz PWA (four study modes, local progress, offline) plus `validate.js`, the site build script and the GitHub Pages deploy workflow.

**Architecture:** A vanilla ES2020 app with no bundler. `index.html` loads `app.js` as a module, which imports small single-purpose modules from `src/`: pure logic (taxonomy, scoring, Leitner, progress store, selection, session) tested in Node, and DOM views tested with Playwright against the real built site. Question data lives in `data/*.json`, fetched per domain; the service worker precaches the shell and caches data files by `?v=<bankVersion>`.

**Tech Stack:** HTML/CSS/JS (ES2020, native modules), Node 22 (`node:test`) for dev tooling, `@playwright/test` and `lighthouse` as dev-only dependencies, GitHub Actions + GitHub Pages.

**Spec:** `CONTEXTi.md` (design, §9 holds all decisions) and `GLOSSARY.md` (canonical terms: Question, Domain, Layer, Difficulty, Scenario, Practice/Exam/Scenario/Review mode, Missed, Flagged, Disputed, Reviewed). Research that informs content, not code: `research/`. **Out of scope for this plan:** writing the 800 questions and 30 scenarios (separate content plan, agents A4/A5); this plan only needs the fixture bank from Task 1.

## Global Constraints

- Stack: "HTML + CSS + JavaScript vanilla (ES2020), fără framework și fără pas de build". Use ES2020 syntax and builtins only (no class fields, top-level await, `.at()`, `Object.hasOwn`).
- Shell budget: `index.html` + `app.js` + `styles.css` + `src/**` + `sw.js` + `manifest.json` under 300 KB total, data excluded.
- Zero runtime external dependencies: no CDN, no web fonts (system font stack), no tracking.
- CSP in a `<meta>` tag, strict: no inline scripts or styles, no `innerHTML`/`outerHTML`/`insertAdjacentHTML`/`document.write` with any JSON-derived content (use `textContent` or the `h()` helper).
- Mobile-first: min width 360 px, touch targets ≥ 44 px, no hover-only interactions, `viewport-fit=cover` with safe-area insets.
- Accessibility: keyboard navigation, `aria-live` for answer feedback, WCAG AA contrast, honour `prefers-color-scheme` and `prefers-reduced-motion`.
- Persistence: `localStorage` for progress (< 1 MB) wrapped in try/catch with in-memory fallback; progress export/import as a JSON file; reset button.
- Data: `data/<domain>.json` loaded with `fetch`, one lazy load per domain; only `reviewed: true` and not `disputed` questions are served.
- Hosting: GitHub Pages deployed by GitHub Actions (`actions/deploy-pages`) on push to `main`, after `validate.js` and unit tests pass; no `gh-pages` branch, no `/docs` folder deploy.
- Quality gate: Lighthouse mobile ≥ 90 on Performance, Accessibility, Best Practices; installable and working offline; tested on a real iPhone (iOS Safari) and Android Chrome emulated in Playwright.
- Licences: MIT for code, CC BY-SA for questions.
- UI language RO and EN (`ro` default when `navigator.language` starts with `ro`, else `en`); question content is English.
- Commit messages end with the line `Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>`.

## Review Focus

Inputs the spec implies but its feature tests do not name. Each has a pinning test in the owning task.

1. `localStorage` throws on every call (private window, blocked storage): the app still runs a full session from memory and says progress will not be saved. (Task 7, Task 11)
2. A question whose text, options or context contains markup such as `<img src=x onerror=...>`: it renders as literal text and never executes. (Task 3, Task 11)
3. A progress import that is not JSON, has the wrong `schema`, or has malformed records: rejected with a message and the existing progress is untouched; records for unknown question IDs are kept but never served or counted. (Task 7, Task 15)
4. A domain file that fails to load (offline without cache, 404), an empty bank, or an exam requested with more questions than the eligible pool: an error state with retry or a smaller exam, never a blank screen or a crash. (Task 4, Task 8, Task 11, Task 12)
5. The exam timer reaching zero while a question is open: the exam closes, unanswered questions count as wrong, and the results screen appears. (Task 9, Task 12)

## File Structure

```text
package.json  .gitignore  LICENSE  playwright.config.js
index.html  app.js  styles.css  manifest.json  sw.js  icons/
src/taxonomy.js     domains, weights, layers, sectors, enums (shared by app and validate.js)
src/config.js       constants, reportIssueUrl()
src/dom.js          createH(doc) / h(): safe element builder
src/i18n.js         STRINGS (ro, en), t(), detectLang()
src/data.js         createLoader(): index, domains, scenarios; reviewed/disputed filtering
src/scoring.js      isCorrect(q, response)
src/leitner.js      answerHash, applyOutcome, isDue
src/progress.js     createStore(): records, stats, streak, settings, export/import
src/selection.js    buildPractice, buildExam, buildReview, buildScenarioRun
src/session.js      createSession(): mode state machine, exam timer, report
src/router.js       parseRoute()
src/views/*.js      home, setup, run (question + feedback), results, scenarios, review, stats, settings, search
tools/validate.js   validateQuestion, validateBank, CLI
tools/serve.js      static dev server
tools/build-site.js listSiteFiles, buildSite (copy, precache.json, stamp sw.js)
tools/make-icons.js one-off PNG icon generator (Playwright)
tests/unit/*.test.js   tests/e2e/*.spec.js   tests/fixtures/data/*
.github/workflows/deploy.yml
```

Data file shapes (decided here; the content plan writes to them):
- `data/<domain-id>.json`: `{"domain": "dlp", "questions": [Question, ...]}`
- `data/scenarios.json`: `{"scenarios": [{"id": "scn-001", "title", "narrative", "artifacts": [string], "questions": [questionId], "debrief"}]}` (`narrative`/`debrief` are strings with `\n` between lines)
- `data/retired-ids.json`: `["dlp-0007", ...]`
- `data/index.json`: `{"bankVersion": "2026.10.23", "target": 800, "domains": [{"id", "file", "authored", "served"}], "scenarios": {"file": "scenarios.json", "count": 0}}`

---

### Task 0: Repository bootstrap and dev server

**Files:**
- Create: `package.json`, `.gitignore`, `LICENSE`, `data/LICENSE.md`, `tools/serve.js`
- Test: `tests/unit/serve.test.js`

**Interfaces:**
- Produces: `resolveRequest(urlPath: string, root: string): string | null` (absolute file path inside `root`, `/` maps to `index.html`, `null` for traversal), `contentType(path: string): string`, CLI `node tools/serve.js [--root <dir>] [--port <n>]` (defaults `.`, `4173`).

- [ ] **Step 1: Initialise the repo.** In `/home/adriana/Desktop/PROIECTE/cybersecurity` run `git init -b main`. Create `package.json` (`"type": "module"`, `"private": true`, `"engines": {"node": ">=22"}`, scripts `test` = `node --test tests/unit/`, `validate` = `node tools/validate.js`, `serve` = `node tools/serve.js`, `build` = `node tools/build-site.js --out _site`, `test:e2e` = `playwright test`), `.gitignore` (`node_modules/`, `_site/`, `playwright-report/`, `test-results/`, `precache.json`), `LICENSE` (MIT, holder "CyberQuiz contributors", year 2026), `data/LICENSE.md` (one paragraph: questions licensed CC BY-SA 4.0, link `https://creativecommons.org/licenses/by-sa/4.0/`).
- [ ] **Step 2: Write failing tests** in `tests/unit/serve.test.js`: `resolveRequest('/', root)` ends with `index.html`; `resolveRequest('/data/dlp.json?v=1', root)` ignores the query string; `resolveRequest('/../package.json', root)` and `resolveRequest('/%2e%2e/package.json', root)` return `null`; `contentType('a.json')` is `application/json; charset=utf-8`, `.js` is `text/javascript; charset=utf-8`, `.webmanifest`/`manifest.json` is `application/manifest+json`, `.png` is `image/png`, `.svg` is `image/svg+xml`.
- [ ] **Step 3: Run** `npm test` → FAIL (module missing).
- [ ] **Step 4: Implement** `tools/serve.js` with `node:http`, no dependencies; serve `Cache-Control: no-cache`; exit-safe on unknown files (404 text).
- [ ] **Step 5: Run** `npm test` → PASS. Run `node tools/serve.js &` then `curl -sI localhost:4173/` → `404` is acceptable (no index yet); kill the server.
- [ ] **Step 6: Commit** everything currently in the folder (spec, glossary, research, plan) as `chore: bootstrap repo, spec and research`.

---

### Task 1: Taxonomy, question validator, fixture bank

**Files:**
- Create: `src/taxonomy.js`, `tools/validate.js` (validator part only), `tests/fixtures/data/{index.json,dlp.json,siem.json,incident-response.json,scenarios.json,retired-ids.json}`
- Test: `tests/unit/validate-question.test.js`

**Interfaces:**
- Produces from `src/taxonomy.js`: `DOMAINS: {id, weight, group}[]` (ids/weights: `dlp` 18, `incident-response` 20, `siem` 14, `cloud-security` 10, `windows-forensics` 8, `fundamentals` 8, `soar` 7, `network-forensics` 6, `ai-security` 5, `linux-forensics` 4; groups: `data` = dlp, cloud-security, ai-security; `ops` = siem, soar, incident-response; `forensics` = windows-forensics, linux-forensics, network-forensics; `base` = fundamentals), `LAYERS = ['L1','L2','L3','Engineering','Governance']`, `DIFFICULTIES = ['basic','intermediate','advanced']`, `TYPES = ['single','multi','truefalse','ordering','matching','log-analysis','open']`, `SECTORS: Record<string, number>` target percent `{finance: 40, 'mssp-consulting': 20, 'tech-vendor': 15, general: 25}`, `SOURCE_TYPES = ['job-description','scenario-derived','framework','tool-docs','original']`.
- Produces from `tools/validate.js`: `validateQuestion(q: unknown): string[]` (empty = valid; each message starts with `<id>: `).

- [ ] **Step 1: Write failing tests** in `tests/unit/validate-question.test.js` using a `valid()` factory returning the §5 example question (single, `dlp-0042`). Cases, each asserting the returned array contains a message matching the quoted regex: valid question → `[]`; missing `explanation.correct` → `/explanation\.correct/`; `answer: ['z']` not in options → `/answer/`; `distractors` missing one wrong option or with an extra key → `/distractors/`; `id: 'siem-0001'` with `domain: 'dlp'` → `/id/`; unknown `domain`/`layer`/`sector`/`difficulty`/`type`/`source_type` → one message each naming the field; duplicate option ids → `/options/`; option text equal (case-insensitive) to `all of the above` → `/all of the above/`; `references: []` → `/references/`; reference URL not starting `https://` → `/url/`; `attack: ['T1048.003']` accepted, `['1048']` rejected → `/attack/`; `type: 'open'` without `scenario_id` → `/open/`; `open` with `options` present → `/options/`; `open` with `rubric` length 2 or 7 → `/rubric/`; `ordering` whose `answer` is not a permutation of option ids → `/answer/`; `matching` with `options: {left, right}` and an answer key not in `left` or value not in `right` → `/answer/`; `truefalse` options must be exactly `a`/`b` and answer one of them; `single` with 2 answers → `/answer/`; `scenario_id: 'abc'` → `/scenario_id/`; `version` not a positive integer → `/version/`; `reviewed` not boolean → `/reviewed/`.
- [ ] **Step 2: Run** `node --test tests/unit/validate-question.test.js` → FAIL.
- [ ] **Step 3: Implement** `src/taxonomy.js` and `validateQuestion` in `tools/validate.js` (export only; the CLI comes in Task 2). Field shapes per type are the table in `CONTEXTi.md` §5 ("Forma câmpurilor pe tipuri"); `multi` and `log-analysis` may have any positive number of answers; `log-analysis` requires non-empty `context`.
- [ ] **Step 4: Run** the test → PASS.
- [ ] **Step 5: Author the fixture bank** in `tests/fixtures/data/` (hand-written, short, technically correct, `source_type: "original"`, `reviewed: true` except one `single` marked `reviewed: false` and one marked `disputed: true`): 20 valid questions across `dlp`, `siem`, `incident-response` with at least 2 of every type, all four sectors, all three difficulties, at least two `open` questions and three chained questions sharing `scenario_id: "scn-001"` (plus `scenarios.json` with that one scenario referencing them in order, and `retired-ids.json` = `["dlp-9999"]`), and one `single` question whose question text, an option and `context` contain the literal string `<img src=x onerror="window.__pwned=1">`. `index.json` counts must match the files (`authored` counts all, `served` counts reviewed and not disputed), `bankVersion: "test.1"`.
- [ ] **Step 6: Add a test** `fixtures are valid` that runs `validateQuestion` over every fixture question and expects no errors. Run `npm test` → PASS.
- [ ] **Step 7: Commit** `feat: taxonomy, question validator and fixture bank`.

---

### Task 2: Bank validator and CLI

**Files:**
- Modify: `tools/validate.js`
- Create: `data/index.json`, `data/<domain-id>.json` for all 10 domains (each `{"domain": id, "questions": []}`), `data/scenarios.json` (`{"scenarios": []}`), `data/retired-ids.json` (`[]`)
- Test: `tests/unit/validate-bank.test.js`

**Interfaces:**
- Consumes: `validateQuestion`, `DOMAINS`, `SECTORS`.
- Produces: `distribution(questions: Question[], key: 'domain'|'sector'|'difficulty'|'type'): Record<string, number>` (percent, 0–100); `validateBank(input: {questions, scenarios, retiredIds, index}, opts?: {enforceDistribution?: boolean}): {errors: string[], warnings: string[]}` where `enforceDistribution` defaults to `questions.length >= index.target`; CLI `node tools/validate.js [dataDir]` (default `data`) printing errors and warnings, exit code 1 on any error.

- [ ] **Step 1: Write failing tests** (`validateBank` on fixture-derived objects, then CLI via `spawnSync(process.execPath, ['tools/validate.js', dir])`): clean fixtures → no errors and exit 0; duplicate question id → error `/duplicate/`; id listed in `retired-ids` → `/retired/`; scenario referencing a missing id, or a `scenario_id` question not referenced by exactly one scenario, or the scenario's `questions` order not matching its questions' `scenario_id` → `/scenario/`; scenario with fewer than 3 or more than 6 questions → `/scenario/`; `index.json` `authored`/`served` not matching actual counts → `/index/`; a domain file whose `domain` differs from a question's `domain` → `/domain/`. Distribution: with 20 questions the domain/sector/difficulty deviations are **warnings**, never errors; with `enforceDistribution: true` and a synthetic 800-question set, a domain off its weight by more than 3 points, a sector off by more than 5 points, `intermediate` < 30 %, `advanced` < 20 %, a domain with fewer than 20 Practice/Exam-eligible questions (not `open`, no `scenario_id`), or `open` outside 3–7 % of the bank each yield an error. A question with `reviewed: false` still counts as authored.
- [ ] **Step 2: Run** → FAIL.
- [ ] **Step 3: Implement** `distribution`, `validateBank` and the CLI (reads `index.json`, each domain file listed there, `scenarios.json`, `retired-ids.json`; a malformed JSON file is an error naming the file). Create the empty `data/` files with `bankVersion: "0.0.0"`, `target: 800`, all counts 0.
- [ ] **Step 4: Run** `npm test` and `npm run validate` → PASS, exit 0 on the empty bank.
- [ ] **Step 5: Commit** `feat: bank validator, CLI and empty data files`.

---

### Task 3: Safe DOM helper, config, i18n

**Files:**
- Create: `src/dom.js`, `src/config.js`, `src/i18n.js`
- Test: `tests/unit/dom.test.js`, `tests/unit/i18n.test.js`, `tests/unit/no-unsafe-html.test.js`

**Interfaces:**
- Produces: `createH(doc: Document): (tag: string, attrs?: Record<string, unknown> | null, ...children: (Node | string | null | false)[]) => HTMLElement` (string children become text nodes; attrs: `class`, `dataset` object, `on<event>` functions, boolean attrs, everything else `setAttribute`; throws on `innerHTML`, `outerHTML`, `srcdoc`, `style` string); `h = createH(document)` exported only when `document` exists; `REPO_SLUG = ''`, `DATA_BASE = 'data/'`, `PER_QUESTION_MS = 90000`, `reportIssueUrl(slug: string, q: {id: string, question: string}): string | null` (null when slug is empty; otherwise `https://github.com/<slug>/issues/new?title=<encoded "Report <id>">&body=<encoded>`); `STRINGS: {ro: Record<string,string>, en: Record<string,string>}`, `t(lang: 'ro'|'en', key: string, vars?: Record<string, string|number>): string` (replaces `{name}`; missing key returns the key), `detectLang(navigatorLanguage: string): 'ro'|'en'`.

- [ ] **Step 1: Write failing tests.** `dom.test.js` uses a ~25-line fake document (elements with `children`, `attributes`, `textContent`, `append`, `setAttribute`, `addEventListener`): a string child containing `<b>x</b>` ends up as a text node, never as markup; `h('div', {innerHTML: 'x'})` throws; `h('button', {onclick: fn})` registers a listener; `null`/`false` children are skipped. `i18n.test.js`: `Object.keys(STRINGS.ro)` equals `Object.keys(STRINGS.en)` (sorted), no empty values, `t('ro','missing.key')` returns `missing.key`, `t('en','results.score',{n:3,total:5})` interpolates (seed that key), `detectLang('ro-RO')` → `ro`, `detectLang('de-DE')` → `en`. `config` check inside `i18n.test.js` or its own: `reportIssueUrl('', q)` is `null`; with `'o/r'` the URL starts `https://github.com/o/r/issues/new?`. `no-unsafe-html.test.js`: reads `app.js` and every `src/**/*.js` and fails if any contains `innerHTML`, `outerHTML`, `insertAdjacentHTML`, `document.write` or `eval(`.
- [ ] **Step 2: Run** → FAIL.
- [ ] **Step 3: Implement** the three modules. Seed `STRINGS` only with keys needed by this task; later tasks add keys to both languages together (the parity test guards that).
- [ ] **Step 4: Run** `npm test` → PASS.
- [ ] **Step 5: Commit** `feat: safe DOM helper, config and i18n`.

---

### Task 4: Data loader

**Files:**
- Create: `src/data.js`
- Test: `tests/unit/data.test.js`

**Interfaces:**
- Consumes: `DATA_BASE`.
- Produces: `class DataLoadError extends Error { file: string }`; `createLoader(opts?: {fetchFn?: typeof fetch, base?: string, includeUnreviewed?: boolean}): {loadIndex(): Promise<Index>, loadDomain(id: string): Promise<Question[]>, loadAll(): Promise<Question[]>, loadScenarios(): Promise<Scenario[]>}`. `loadIndex` always fetches fresh (`cache: 'no-cache'`) and caches the result in memory for the session; `loadDomain` requests `<base><file>?v=<bankVersion>`, filters out `reviewed !== true` and `disputed === true` (unless `includeUnreviewed`), and memoises the promise; a non-OK response or invalid JSON throws `DataLoadError` carrying the file name and clears the memo so a retry refetches.

- [ ] **Step 1: Write failing tests** with a stub `fetchFn` serving the fixture files from disk: `loadAll()` returns only served questions (count equals `served` sum from the fixture index) and none with `disputed`; `loadDomain('dlp')` requests a URL ending `dlp.json?v=test.1`; two concurrent `loadDomain('dlp')` calls cause one fetch; a 404 rejects with `DataLoadError` whose `file` is `dlp.json`, and a later successful stub makes the retry resolve; an index with `domains: []` makes `loadAll()` resolve to `[]`; `loadScenarios()` returns the fixture scenario.
- [ ] **Step 2: Run** → FAIL. **Step 3: Implement.** **Step 4: Run** → PASS.
- [ ] **Step 5: Commit** `feat: data loader with reviewed filtering and retryable errors`.

---

### Task 5: Scoring

**Files:**
- Create: `src/scoring.js`
- Test: `tests/unit/scoring.test.js`

**Interfaces:**
- Produces: `type Response = string[] | Record<string,string> | 'got' | 'partial' | 'missed'`; `isCorrect(q: Question, response: Response | null): boolean`. Rules (all-or-nothing): `single`, `multi`, `truefalse`, `log-analysis` → selected ids equal the `answer` set (order-insensitive, no extras); `ordering` → same sequence; `matching` → every pair equal and no extra pairs; `open` → `'got'` only; `null`/missing response → `false`.

- [ ] **Step 1: Write failing tests**: multi with a subset → false, with an extra → false, exact in different order → true; ordering with two swapped ids → false; matching with one wrong pair → false and with all correct → true; `open` `'got'` → true, `'partial'` and `'missed'` → false; `null` → false for every type.
- [ ] **Step 2–4:** run → FAIL, implement, run → PASS.
- [ ] **Step 5: Commit** `feat: all-or-nothing answer scoring`.

---

### Task 6: Leitner scheduling

**Files:**
- Create: `src/leitner.js`
- Test: `tests/unit/leitner.test.js`

**Interfaces:**
- Produces: `DAY_MS = 86400000`, `INTERVAL_DAYS = [1, 3, 7]`; `answerHash(q: Question): string` (FNV-1a 32-bit hex over `JSON.stringify({answer: q.answer, options: q.options ?? null})`); `type Rec = {box: 0|1|2|3|4, due: number | null, attempts: number, correct: number, lastCorrect: boolean | null, flagged: boolean, hash: string, last: number}`; `newRecord(hash: string): Rec` (box 0, zeros, `lastCorrect: null`); `applyOutcome(rec: Rec | undefined, o: {correct: boolean, flagged: boolean, now: number, hash: string}): Rec`; `isDue(rec: Rec, now: number): boolean`. Semantics (box 0 = not queued, 1–3 = queued with intervals 1/3/7 days, 4 = graduated): wrong → box 1, `due = now + 1 day`; correct and not flagged: box 0 stays 0, box 1→2 (due +3 d), 2→3 (+7 d), 3→4 (due `null`), 4 stays 4; correct and flagged: box 0 or 4 → box 1 (due +1 d), box 1–3 stay with `due = now + INTERVAL_DAYS[box-1]` days; `rec.hash !== o.hash` first resets the record to `newRecord(o.hash)` (keeping nothing); `attempts`, `correct`, `lastCorrect`, `flagged`, `last` always updated; `isDue` is true for box 1–3 with `due <= now`, and also for `flagged` records in box 1–3 regardless of order; box 0 and 4 are never due.

- [ ] **Step 1: Write failing tests** for each transition above using a fixed `now`, plus: the same `answer`/`options` with edited text elsewhere gives the same `answerHash`, changed `answer` gives a different one; hash mismatch resets a box-3 record to box 0 before applying; wrong at box 3 returns to box 1.
- [ ] **Step 2–4:** run → FAIL, implement, run → PASS.
- [ ] **Step 5: Commit** `feat: Leitner scheduling and answer hash`.

---

### Task 7: Progress store

**Files:**
- Create: `src/progress.js`
- Test: `tests/unit/progress.test.js`

**Interfaces:**
- Consumes: `applyOutcome`, `isDue`, `answerHash`, `newRecord`.
- Produces: `createStore(opts?: {storage?: Storage-like, now?: () => number}): Store` where storage defaults to `globalThis.localStorage` guarded by try/catch; persisted under key `cyberquiz:v1` as `{schema: 1, records: Record<string, Rec>, days: string[], settings: {lang?: 'ro'|'en', theme: 'auto'|'light'|'dark', textSize: 0|1|2|3, seenBankVersion?: string}}`. `Store`: `persistent: boolean` (false after any storage failure), `recordAnswer(q, correct: boolean, o?: {flagged?: boolean}): Rec`, `setFlag(q, flagged: boolean): void`, `get(id): Rec | undefined`, `dueIds(now?): string[]`, `missedIds(): string[]` (`lastCorrect === false`), `flaggedIds(): string[]`, `stats(questions: Question[]): {byDomain: Record<string,{answered,correct,pct}>, byDifficulty: Record<string,{answered,correct,pct}>}` (only questions present in the argument are counted, answered = `attempts`), `streak(now?): number` (consecutive local-date days with at least one answer, ending today or yesterday), `settings: {get(): Settings, set(patch): void}`, `exportJSON(): string` (`{app: 'cyberquiz', schema: 1, exportedAt, records, days, settings}`), `importJSON(text: string): {ok: true, imported: number} | {ok: false, error: string}`, `reset(): void`.

- [ ] **Step 1: Write failing tests.** Storage failures (Review Focus 1): a storage stub whose `getItem`/`setItem` always throw → `createStore` does not throw, `recordAnswer` works, `persistent === false`, `get(id)` returns the record. Normal path: `recordAnswer` then a second `createStore` on the same storage sees the record; `recordAnswer` with a changed `answer` (new hash) resets the box; `stats` ignores records whose question is not in the argument and computes `pct`; `streak` is 0 with no answers, 1 after an answer today, 2 with answers today and yesterday, 1 when the last answer was yesterday and none today with one earlier gap, and uses the local date at midnight boundaries (use `now` values 23:59 and 00:01 local); 800 records serialise to under 200 KB (`JSON.stringify(...).length`). Import (Review Focus 3): invalid JSON, `schema: 2`, `app: 'other'`, records not an object, a record with a non-numeric `box` or `box: 9` each return `{ok: false}` and leave `exportJSON()` byte-identical to before; a valid export imported into a fresh store round-trips records, days and settings; records for question ids that are not in any bank are kept in the export. `reset()` clears records, days and settings.
- [ ] **Step 2–4:** run → FAIL, implement (serialise on every mutation, wrapped in try/catch), run → PASS.
- [ ] **Step 5: Commit** `feat: progress store with fallback, stats, streak and import/export`.

---

### Task 8: Question selection

**Files:**
- Create: `src/selection.js`
- Test: `tests/unit/selection.test.js`

**Interfaces:**
- Consumes: `DOMAINS` (weights, groups), `isDue` via store.
- Produces: `isEligibleForPractice(q: Question): boolean` (`type !== 'open'` and no `scenario_id`); `buildPractice(questions: Question[], o: {domains?: string[], layers?: string[], difficulties?: string[], sectors?: string[], count: number, rng?: () => number}): Question[]` (filtered, shuffled, truncated); `buildExam(questions: Question[], o: {count: number, rng?: () => number}): Question[]` (eligible only; per-domain quotas by weight using largest remainder; a domain with too few eligible questions yields all it has and the shortfall is filled first from domains in the same `group`, then from any domain; never more than the eligible pool, never duplicates); `buildReview(questions: Question[], store: Pick<Store,'dueIds'|'missedIds'>, now: number): Question[]` (questions whose id is due; scenario-chained ones included, ordered by `due` ascending); `buildScenarioRun(scenario: Scenario, questions: Question[]): Question[]` (in scenario order; throws `Error('scenario scn-001: missing question <id>')` when an id is absent from `questions`). A seeded `rng` is a function of the form `() => number` in `[0,1)`.

- [ ] **Step 1: Write failing tests**: practice excludes `open` and `scenario_id` questions and honours each filter and `count`; exam of 30 from a synthetic pool with weights respected (±1 per domain) and no duplicates; with `linux-forensics` having only 2 eligible questions the exam contains exactly 2 of them and the shortfall comes from `windows-forensics`/`network-forensics` before any other group; an exam requested with `count` 60 from a pool of 12 eligible returns 12 (Review Focus 4); `buildReview` returns only due ids and includes scenario questions; `buildScenarioRun` order and the missing-id error.
- [ ] **Step 2–4:** run → FAIL, implement, run → PASS.
- [ ] **Step 5: Commit** `feat: practice, exam, review and scenario selection`.

---

### Task 9: Session state machine

**Files:**
- Create: `src/session.js`
- Test: `tests/unit/session.test.js`

**Interfaces:**
- Consumes: `isCorrect`, `PER_QUESTION_MS`, a `Store`.
- Produces: `createSession(o: {mode: 'practice'|'exam'|'scenario'|'review', questions: Question[], store: Store, now?: () => number, perQuestionMs?: number}): Session`; `Session`: `current(): Question | null`, `index: number`, `total: number`, `submit(response: Response): {correct: boolean} | {recorded: true}` (practice/scenario/review return `{correct}` and call `store.recordAnswer` immediately; exam returns `{recorded: true}` and writes nothing to the store until the session finishes; submitting twice for one question throws), `setFlag(flagged: boolean): void` (immediate `store.setFlag` outside exam; remembered and applied at finish in exam), `next(): void` (skipping an unanswered exam question counts it as wrong), `tick(): void` (exam only: when `now() - startedAt >= total * perQuestionMs` the session finishes with `expired: true`), `remainingMs(): number | null` (exam only), `finished(): boolean`, `report(): Report` with `Report = {mode, total, answered, correct, expired: boolean, durationMs, byDomain: Record<string,{total,correct}>, items: {id, correct, flagged, response}[]}`.

- [ ] **Step 1: Write failing tests** with a fake `store` (records calls) and a controllable clock: practice `submit` records immediately and returns `correct`; exam `submit` records nothing until the last `next()` and then records every item including unanswered as wrong; exam `tick()` after `total * 90 s` while on question 3 finishes the session, `report().expired` is true, unanswered count as wrong and are recorded (Review Focus 5); `remainingMs()` decreases with the clock and is `null` in practice; double `submit` throws; report `byDomain` totals add up; flag set in exam appears in `items[].flagged` and in the store after finish.
- [ ] **Step 2–4:** run → FAIL, implement, run → PASS.
- [ ] **Step 5: Commit** `feat: session state machine with exam timer`.

---

### Task 10: App shell, router, home view, Playwright infrastructure

**Files:**
- Create: `index.html`, `styles.css`, `app.js`, `src/router.js`, `src/views/home.js`, `tools/build-site.js` (build part only), `playwright.config.js`, `tests/e2e/home.spec.js`
- Test: `tests/unit/router.test.js`, `tests/unit/build-site.test.js`

**Interfaces:**
- Produces: `parseRoute(hash: string): {name: 'home'|'practice'|'exam'|'scenarios'|'scenario'|'review'|'stats'|'settings'|'search'|'notfound', params: Record<string,string>}`: `''`, `'#/'` → home; `'#/scenarios/scn-001'` → `{name: 'scenario', params: {id: 'scn-001'}}`; `'#/search?q=dlp%20leak'` → `params.q = 'dlp leak'`; unknown → notfound. `listSiteFiles(root: string): string[]` (relative paths of `index.html`, `app.js`, `styles.css`, `sw.js`, `manifest.json`, `icons/**`, `src/**`, `data/**` that exist; nothing else) and `buildSite(o: {root, out, dataDir?: string, build?: string}): {files: string[]}` which copies those files to `out`, replaces `data/` with `dataDir` when given, writes `out/precache.json` (shell files only, no `data/`) and replaces `__BUILD__` in `out/sw.js` with `build` (default `dev`) when `sw.js` exists (it is created in Task 16); CLI `node tools/build-site.js --out <dir> [--data <dir>] [--build <id>]`. View contract used by every later view: `render(ctx: Ctx, route): HTMLElement | Promise<HTMLElement>` with `Ctx = {store, loader, lang, t: (key, vars?) => string, go: (hash) => void, announce: (text) => void}`; `announce` writes to the page-level `aria-live="polite"` region.

- [ ] **Step 1: Write failing unit tests** for `parseRoute` (cases above) and `listSiteFiles`/`buildSite` (temp dir fixture: excludes `tests/`, `research/`, `tools/`, `node_modules`, `package.json`; `precache.json` has no `data/` entries; `__BUILD__` replaced; `dataDir` replaces `data/`).
- [ ] **Step 2: Write the failing E2E test** `tests/e2e/home.spec.js` (Playwright): home shows an `h1`, four mode links (Practice, Exam, Scenarios, Review) each ≥ 44 px tall, a due-count for Review, at 360 px wide `document.documentElement.scrollWidth <= 360`, and no CSP violation messages in the console. `playwright.config.js`: `webServer.command` = `node tools/build-site.js --out _site --data tests/fixtures/data && node tools/serve.js --root _site --port 4173`, `baseURL http://localhost:4173`, projects `iphone` (`devices['iPhone 13']`, webkit) and `pixel` (`devices['Pixel 7']`, chromium), `testDir tests/e2e`. Run `npm install -D @playwright/test lighthouse && npx playwright install chromium webkit` (if webkit lacks system libraries, keep both projects in the config but run `--project=pixel` locally and note it in `README.md`).
- [ ] **Step 3: Run** `npm test` and `npm run test:e2e` → FAIL.
- [ ] **Step 4: Implement.** `index.html`: `<meta http-equiv="Content-Security-Policy" content="default-src 'none'; script-src 'self'; style-src 'self'; img-src 'self' data:; connect-src 'self'; manifest-src 'self'; worker-src 'self'; base-uri 'none'; form-action 'none'">`, viewport with `viewport-fit=cover`, `theme-color`, `<link rel="manifest">`, `<main id="app">`, `<div id="live" class="sr-only" aria-live="polite">`, `<noscript>` message, `<script type="module" src="app.js">`. `styles.css`: colour tokens on `:root`, dark overrides under `@media (prefers-color-scheme: dark)` guarded by `:root:not([data-theme="light"])` and again for `[data-theme="dark"]`, system font stack, `--text-scale` multiplier, safe-area padding, `min-height: 44px` interactive elements, reduced-motion rule. `app.js`: build the `Ctx`, apply `settings` (theme attribute, `--text-scale` via `documentElement.style.setProperty`, `lang` attribute), hash router that renders views and moves focus to the view's `h1`; views not yet built render a notfound stub. `home.js`: title, four mode links, due-review count from `store.dueIds()` and `loader.loadAll()`, and an empty-bank message when no questions are served. Add `STRINGS` keys for both languages.
- [ ] **Step 5: Run** `npm test` and `npm run test:e2e -- --project=pixel` → PASS.
- [ ] **Step 6: Commit** `feat: app shell, router, home view and Playwright setup`.

---

### Task 11: Question rendering and Practice mode

**Files:**
- Create: `src/views/question.js`, `src/views/setup.js`, `src/views/run.js`, `src/views/results.js`
- Modify: `app.js` (routes `practice`), `styles.css`, `src/i18n.js`
- Test: `tests/e2e/practice.spec.js`

**Interfaces:**
- Consumes: `buildPractice`, `createSession`, `h`, `Ctx`.
- Produces: `renderQuestion(q: Question, o: {t, onChange: (response: Response | null) => void}): {el: HTMLElement, getResponse(): Response | null, lock(): void}`: `single`/`truefalse` radios in a `fieldset` with `legend`, `multi` checkboxes, `log-analysis` shows `context` in a `<pre>` then single or multi by `answer.length`, `ordering` a list with up/down buttons (≥ 44 px, no drag), `matching` one `<select>` per left item over the right items, `open` a textarea plus a "Show model answer" button that reveals `explanation.correct` and the `rubric`, then three buttons (got it / partially / missed) producing `'got'|'partial'|'missed'`. `renderFeedback(q: Question, o: {t, correct: boolean}): HTMLElement`: verdict, `explanation.correct`, one line per wrong option from `distractors`, optional `interview_angle`, references as `https://` links with `rel="noopener noreferrer" target="_blank"`, a "Not sure" toggle button (`aria-pressed`) and, when `reportIssueUrl` is non-null, a "Report" link. `run.js` exports `renderRun(ctx, session)` (shows progress "n / total", question, a Submit button disabled until `getResponse()` is non-null, feedback in the `aria-live` region, Next); `results.js` exports `renderResults(ctx, report)` (score, per-domain table, list of missed questions). The `setup.js` practice form lets the user choose domains (with the served count per domain), layer, difficulty, sector filter and count 10/20/30 (capped at the available pool; zero available disables Start with a message).

- [ ] **Step 1: Write failing E2E tests** against the fixture bank: start a Practice run with `dlp`, answer a `single` correctly → "Correct" appears inside the live region, answer another wrongly → the distractor line for the chosen option is shown; `multi` Submit stays disabled until one box is ticked; `ordering` moves an item with the keyboard (Enter on a down button) and submits; `matching` with selects; an `open` question shows no auto verdict, reveals the model answer, and "missed" counts as wrong; the markup question (Review Focus 2) shows `<img src=x onerror=...>` as visible text in question, option and context and `await page.evaluate(() => window.__pwned)` is `undefined`; "Not sure" sets `aria-pressed="true"` and the question later appears in Review (checked in Task 14); finishing shows results with a per-domain row. Failure path (Review Focus 4): `page.route('**/data/dlp.json*', r => r.abort())` → starting Practice on `dlp` shows an error message and a Retry button, and after un-routing and clicking Retry the run starts; with every route aborted the app does not show a blank page. Storage failure (Review Focus 1): `page.addInitScript(() => { Object.defineProperty(window, 'localStorage', {get() { throw new Error('blocked'); }}); })` → a Practice run still completes and a "progress will not be saved" notice is visible.
- [ ] **Step 2: Run** `npm run test:e2e -- --project=pixel tests/e2e/practice.spec.js` → FAIL.
- [ ] **Step 3: Implement** the four view modules and wire the route; scenario-chained and `open` questions never appear here (guaranteed by `buildPractice`).
- [ ] **Step 4: Run** the spec on both projects (`iphone` where available) → PASS.
- [ ] **Step 5: Commit** `feat: question rendering and Practice mode`.

---

### Task 12: Exam mode

**Files:**
- Create: `src/views/exam.js`
- Modify: `app.js`, `src/views/results.js`, `src/i18n.js`, `styles.css`
- Test: `tests/e2e/exam.spec.js`

**Interfaces:**
- Consumes: `buildExam`, `createSession` (mode `exam`), `renderQuestion`, `renderResults`.
- Produces: `renderExam(ctx, route)` — setup (count 30/45/60 capped to the eligible pool, message when fewer than 5 eligible), then a run view with a visible countdown (`mm:ss`, updated each second from `session.remainingMs()`, not announced to screen readers), no feedback after submit, Next/Skip, and on finish `renderResults` with per-domain percentages and a list of missed questions with their explanations.

- [ ] **Step 1: Write failing E2E tests** using `page.clock.install()`: starting an exam with the fixture pool (capped count) shows the timer at `total × 1.5` minutes; answering shows no verdict; finishing shows the score and a per-domain table; fast-forwarding `page.clock.fastForward` by `total × 90 s` while a question is open shows the results screen, `expired` message, unanswered counted wrong (Review Focus 5); a request for 60 questions with a smaller pool starts with the pool size and says so (Review Focus 4); reloading during a run returns to the exam setup without an error.
- [ ] **Step 2: Run** → FAIL. **Step 3: Implement** (interval created on run, cleared on finish and on navigation). **Step 4: Run** → PASS.
- [ ] **Step 5: Commit** `feat: Exam mode with timer and domain report`.

---

### Task 13: Scenario mode

**Files:**
- Create: `src/views/scenarios.js`
- Modify: `app.js`, `src/i18n.js`, `styles.css`
- Test: `tests/e2e/scenarios.spec.js`

**Interfaces:**
- Consumes: `loader.loadScenarios()`, `buildScenarioRun`, `createSession` (mode `scenario`).
- Produces: `renderScenarios(ctx, route)` — list at `#/scenarios` (title, number of questions), detail at `#/scenarios/<id>`: narrative split on `\n` into paragraphs, `artifacts` as a list in `<pre>` blocks, Start; the run shows questions in scenario order with immediate feedback (including `open` self-assessment); the end shows the `debrief` (paragraphs) and the results. A scenario whose question ids are missing from the served bank is listed as unavailable, not crashing.

- [ ] **Step 1: Write failing E2E tests** with the fixture scenario `scn-001`: list shows it; detail shows narrative and artifacts as text; run presents the three chained questions in order; the debrief appears after the last; unreviewed/disputed fixture questions referenced by a scenario make it show "unavailable"; opening `#/scenarios/unknown` shows a not-found message.
- [ ] **Step 2: Run** → FAIL. **Step 3: Implement.** **Step 4: Run** → PASS.
- [ ] **Step 5: Commit** `feat: Scenario mode`.

---

### Task 14: Review mode and statistics

**Files:**
- Create: `src/views/review.js`, `src/views/stats.js`
- Modify: `app.js`, `src/i18n.js`, `styles.css`
- Test: `tests/e2e/review-stats.spec.js`

**Interfaces:**
- Consumes: `buildReview`, `createSession` (mode `review`), `store.stats`, `store.streak`, `store.flaggedIds`, `store.missedIds`.
- Produces: `renderReview(ctx, route)` — shows the number due and the number Missed or Flagged but not yet due; Start runs the due questions with immediate feedback; a question with `scenario_id` shows the scenario title and narrative above it; with nothing due it shows an empty state. `renderStats(ctx, route)` — per-domain and per-difficulty percent as `<progress>` elements (no inline styles), streak in days, counts of Missed and Flagged questions with a list of Flagged question texts.

- [ ] **Step 1: Write failing E2E tests**: answer a fixture question wrongly in Practice, open Review → it is not yet due (shows "next review tomorrow" count); using `page.clock` to advance 25 hours it is due and Review serves it, and a correct answer then moves it out of the due list; a Flagged question answered correctly stays queued; a chained scenario question in Review shows the scenario title; Stats shows the domain bar value matching answers given and streak `1`; stats and review work after a reload (persisted).
- [ ] **Step 2: Run** → FAIL. **Step 3: Implement.** **Step 4: Run** → PASS.
- [ ] **Step 5: Commit** `feat: Review mode and statistics`.

---

### Task 15: Settings, import/export, search, issue reporting

**Files:**
- Create: `src/views/settings.js`, `src/views/search.js`
- Modify: `app.js`, `src/i18n.js`, `styles.css`
- Test: `tests/e2e/settings-search.spec.js`

**Interfaces:**
- Consumes: `store.settings`, `store.exportJSON`, `store.importJSON`, `store.reset`, `loader.loadAll`.
- Produces: `renderSettings(ctx, route)` — language (RO/EN), theme (auto/light/dark), text size (4 steps) applied immediately and persisted; Export (downloads `cyberquiz-progress-<date>.json` via a Blob link); Import (file input, confirmation before replacing, error message on `{ok: false}`); Reset (confirmation). `searchQuestions(questions: Question[], query: string): Question[]` (case-insensitive match on `tags`, `subtopic`, and question text; tags ranked first) in `src/views/search.js` with `renderSearch(ctx, route)` listing results (domain, difficulty, text) and opening a single-question practice run.

- [ ] **Step 1: Write failing tests.** Unit (`tests/unit/search.test.js`): tag match outranks text match, case-insensitive, empty query returns `[]`. E2E: switching language changes the `h1` and `<html lang>`; dark theme sets `data-theme="dark"` and persists across reload; text size changes `--text-scale`; Export downloads a file whose JSON has `schema: 1` (`page.waitForEvent('download')`); Import of a corrupt file shows the error and Stats are unchanged (Review Focus 3); Import of a valid export from a second context restores answers; Reset after confirmation empties Stats; searching `exfiltration` lists matching fixture questions and clicking one opens it.
- [ ] **Step 2: Run** → FAIL. **Step 3: Implement.** **Step 4: Run** → PASS.
- [ ] **Step 5: Commit** `feat: settings, import/export, search`.

---

### Task 16: PWA — manifest, icons, service worker, update banners

**Files:**
- Create: `manifest.json`, `icons/` (192, 512, maskable-512, `apple-touch-icon.png` 180), `tools/make-icons.js`, `sw.js`, `src/pwa.js`
- Modify: `index.html` (icon links), `app.js` (register), `src/i18n.js`, `styles.css`
- Test: `tests/e2e/pwa.spec.js`

**Interfaces:**
- Produces: `sw.js` with `const BUILD = '__BUILD__'`; install precaches every path listed in `./precache.json` into cache `cyberquiz-shell-<BUILD>` (tolerates a missing `precache.json`); activate deletes caches not named `cyberquiz-shell-<BUILD>` or `cyberquiz-data`; fetch: `data/index.json` network-first falling back to cache, other `data/*` cache-first on the exact URL (including `?v=`), everything else same-origin GET cache-first with network fallback; message `{type: 'precache-data', urls: string[]}` adds those URLs to `cyberquiz-data`; message `{type: 'prune-data', keep: string[]}` deletes other entries; message `{type: 'skip-waiting'}`. `src/pwa.js` exports `registerPwa(o: {loader, store, onUpdate: (kind: 'shell'|'content') => void}): Promise<void>`: registers `sw.js` (no-op when `serviceWorker` is unavailable), after load sends `precache-data` for every served domain file URL and `prune-data` for the rest, calls `onUpdate('shell')` when a new worker is waiting, and `onUpdate('content')` when `index.bankVersion` differs from `settings.seenBankVersion` (then stores the new value). The banner "Content updated, reload" (or "Update available") has a reload button that sends `skip-waiting` for shell updates and reloads.
- `manifest.json`: `name` "CyberQuiz", `short_name` "CyberQuiz", `start_url` "./", `scope` "./", `display` "standalone", `background_color` and `theme_color` matching the CSS tokens, the icons above with `purpose` `any` and `maskable`.
- `tools/make-icons.js`: one-off script that renders an SVG shield glyph to the four PNG sizes with Playwright; run it once and commit the PNGs.

- [ ] **Step 1: Write failing E2E tests**: after the first load wait for `navigator.serviceWorker.ready`, then `context.setOffline(true)` and `page.reload()` → home renders; Practice on `dlp` still starts offline (domain precached); the manifest is served as `application/manifest+json` with the four icon entries and each icon URL returns 200; bumping `bankVersion` via `page.route('**/data/index.json', ...)` on a second visit shows the content banner and its reload button reloads; the data cache keeps only entries for the current `bankVersion` after pruning.
- [ ] **Step 2: Run** → FAIL. **Step 3: Implement** (run `node tools/make-icons.js` once). **Step 4: Run** the spec on both projects → PASS.
- [ ] **Step 5: Commit** `feat: PWA manifest, service worker and update banners`.

---

### Task 17: CI and deploy workflow

**Files:**
- Create: `.github/workflows/deploy.yml`, `README.md`
- Test: local run of the same commands

**Interfaces:**
- Produces: workflow on `push` to `main` and `pull_request`: job `verify` (checkout, `actions/setup-node` Node 22, `npm ci`, `npm run validate`, `npm test`, `npx playwright install --with-deps chromium`, `npm run test:e2e -- --project=pixel`); job `deploy` (needs `verify`, only on `main`, permissions `pages: write` and `id-token: write`, environment `github-pages`): `node tools/build-site.js --out _site --build ${{ github.sha }}`, `actions/configure-pages`, `actions/upload-pages-artifact` with `path: _site`, `actions/deploy-pages`. Use current major versions of each action (check their repositories before pinning). `README.md`: what the app is, `npm run serve`, `npm run validate`, how to set `REPO_SLUG` in `src/config.js` (the Report link stays hidden until set), how to enable Pages with "GitHub Actions" as the source, licences.

- [ ] **Step 1: Verify locally**: `npm ci && npm run validate && npm test && npm run test:e2e -- --project=pixel && node tools/build-site.js --out _site --build local` → all pass; `_site/sw.js` contains `local` and no `__BUILD__`; `_site/` contains no `tests/`, `research/` or `tools/`.
- [ ] **Step 2: Write the workflow and README.**
- [ ] **Step 3: Validate YAML** with `python3 -c "import yaml,sys; yaml.safe_load(open('.github/workflows/deploy.yml'))"`. Pushing to GitHub and enabling Pages is the user's step; do not push.
- [ ] **Step 4: Commit** `ci: verify and deploy to GitHub Pages`.

---

### Task 18: Quality gates and real-device checks

**Files:**
- Create: `tests/unit/budget.test.js`, `docs/qa-checklist.md`
- Test: `tests/unit/budget.test.js`, `tests/e2e/a11y.spec.js`

**Interfaces:**
- Produces: a unit test failing when the total bytes of `listSiteFiles('.')` excluding `data/` and `icons/` exceed 300 000; an E2E accessibility spec; `docs/qa-checklist.md` with the manual iPhone steps.

- [ ] **Step 1: Write the tests.** `budget.test.js` as above. `a11y.spec.js`: on each route (home, practice setup, a practice question, results, settings) every `button`, `a`, `input`, `select` has a bounding box ≥ 44 px in its smaller dimension at 360 px width; no `[tabindex]` greater than 0; after submitting an answer the live region (`#live`) contains the verdict text; the first Tab from the top reaches a focusable element and Escape/Enter do not trap focus; with `emulateMedia({reducedMotion: 'reduce'})` no element has a non-zero `animation-duration` or `transition-duration`.
- [ ] **Step 2: Run** `npm test` and the spec → fix whatever fails (styles, labels, focus handling) until PASS.
- [ ] **Step 3: Lighthouse.** With the built site served (`npm run build` then `node tools/serve.js --root _site`), run `npx lighthouse http://localhost:4173 --form-factor=mobile --only-categories=performance,accessibility,best-practices --chrome-flags="--headless" --output=json --output-path=./lighthouse.json` (set `CHROME_PATH` to the Playwright Chromium binary if Chrome is absent). Expected: all three scores ≥ 0.90; add `lighthouse.json` to `.gitignore`. Fix findings and rerun.
- [ ] **Step 4: Write `docs/qa-checklist.md`** — the manual iPhone (Safari) steps the user performs: open the deployed URL, run a Practice and an Exam, Add to Home Screen, launch from the icon, switch to airplane mode and relaunch, flag a question and find it in Review, export progress and re-import it, check text size and dark mode, note any layout issue under the notch. Android remains "emulated in Playwright, real device not tested".
- [ ] **Step 5: Commit** `test: shell budget, accessibility checks and QA checklist`.

---

## Self-Review

- **Spec coverage:** modes (Tasks 11–14), question types incl. open self-assessment (11), progress/stats/streak/export/import/reset (7, 14, 15), search (15), dark mode/text size/RO-EN (10, 15), offline/PWA and update banners (16), validate.js rules incl. distribution and eligibility (1–2), deploy (17), Lighthouse/iPhone gates (18), reviewed-only serving and disputed (4), Report link (3, 11), Leitner (6), exam scoring and timer (5, 9, 12), CSP and no-innerHTML (3, 10), shell budget (18).
- **Deferred to the content plan:** the 800 questions, 30 scenarios (EN conversion of `research/02-scenarios-draft.json` with `_meta` removed), `retired-ids.json` contents, real `index.json` counts, and the 10 % human review. `data/` ships empty and the app handles an empty bank (Task 10).
- **Open owner inputs:** `REPO_SLUG` in `src/config.js` (needs the GitHub `owner/repo`); creating the GitHub repository, enabling Pages and pushing are the user's steps.
- **Names checked across tasks:** `createStore`, `recordAnswer`, `setFlag`, `dueIds`, `missedIds`, `flaggedIds`, `createSession`, `buildPractice/Exam/Review/ScenarioRun`, `renderQuestion/Feedback/Run/Results`, `Ctx`, `listSiteFiles/buildSite`, `registerPwa` are used with the same signatures where consumed.
