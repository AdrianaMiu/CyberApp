import fs from 'node:fs';
import path from 'node:path';
import { expect } from '@playwright/test';

const DIR = path.resolve('tests/fixtures/data');
const read = (f) => JSON.parse(fs.readFileSync(path.join(DIR, f), 'utf8'));

export const index = read('index.json');
export const questions = index.domains.flatMap((d) => read(d.file).questions);
export const scenarios = read('scenarios.json').scenarios;
export const byText = (text) => questions.find((q) => q.question === text.trim());

const firstWrong = (q) => q.options.find((o) => !q.answer.includes(o.id)).id;

/** Answers the question currently on screen. Returns the ids chosen when wrong (for choice types). */
export async function answerQuestion(page, q, correct) {
  switch (q.type) {
    case 'single':
    case 'multi':
    case 'truefalse':
    case 'log-analysis': {
      const ids = correct ? q.answer : [firstWrong(q)];
      for (const id of ids) await page.locator(`.q input[value="${id}"]`).check();
      return ids;
    }
    case 'ordering': {
      const target = correct ? q.answer : q.answer.slice().reverse();
      for (let i = 0; i < target.length; i++) {
        for (;;) {
          const order = await page.locator('.q ol.order li').evaluateAll((els) => els.map((e) => e.dataset.id));
          const at = order.indexOf(target[i]);
          if (at <= i) break;
          await page.locator(`.q ol.order li[data-id="${target[i]}"] button.move-up`).click();
        }
      }
      return target;
    }
    case 'matching': {
      let spoiled = !correct;
      for (const left of q.options.left) {
        let value = q.answer[left.id];
        if (spoiled) {
          value = q.options.right.find((r) => r.id !== q.answer[left.id]).id;
          spoiled = false;
        }
        await page.locator(`.q select[data-left="${left.id}"]`).selectOption(value);
      }
      return [];
    }
    case 'open':
      await page.locator('.q button.show-model').click();
      await page.locator(`.q button[data-assess="${correct ? 'got' : 'missed'}"]`).click();
      return [];
    default:
      throw new Error(`unknown type ${q.type}`);
  }
}

/**
 * Plays every question of the run on screen. decide(q, i) says whether to answer correctly.
 * Returns [{q, verdict}] and leaves the results screen showing.
 */
export async function playRun(page, decide = () => true, hooks = {}) {
  const played = [];
  for (let i = 0; ; i++) {
    await page.locator('.question-text').waitFor();
    const q = byText(await page.locator('.question-text').innerText());
    if (!q) throw new Error('question on screen is not in the fixtures');
    if (hooks.before) await hooks.before(q, i);
    const correct = decide(q, i);
    const chosen = await answerQuestion(page, q, correct);
    if (q.type !== 'open') await page.locator('#submit').click();
    await expect(page.locator('#feedback .verdict')).toBeVisible();
    const verdict = (await page.locator('#feedback .verdict').innerText()).trim();
    if (hooks.after) await hooks.after(q, { correct, chosen, verdict });
    played.push({ q, verdict, chosen });
    const finishing = /^(Finish|Termină)$/.test((await page.locator('#next').innerText()).trim());
    await page.locator('#next').click();
    if (finishing) break;
  }
  return played;
}

export async function startPractice(page, domains, { count } = {}) {
  await page.goto('/#/practice');
  for (const d of domains) await page.locator(`input[name="domain"][value="${d}"]`).check();
  if (count) await page.locator('select[name="count"]').selectOption(String(count));
  await page.locator('#start').click();
}
