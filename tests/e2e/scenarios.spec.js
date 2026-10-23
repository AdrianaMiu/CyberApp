import { test, expect } from '@playwright/test';
import { playRun, scenarios, questions } from './helpers.js';

const scn = scenarios[0];

test('the list shows the fixture scenario with its question count', async ({ page }) => {
  await page.goto('/#/scenarios');
  await expect(page.locator('h1')).toHaveText('Scenarios');
  const card = page.locator(`a.mode[href="#/scenarios/${scn.id}"]`);
  await expect(card).toContainText(scn.title);
  await expect(card).toContainText(`${scn.questions.length} questions`);
});

test('the detail page shows the narrative and the evidence as text', async ({ page }) => {
  await page.goto(`/#/scenarios/${scn.id}`);
  await expect(page.locator('h1')).toHaveText(scn.title);
  const lines = scn.narrative.split('\n');
  await expect(page.locator('.narrative p')).toHaveCount(lines.length);
  await expect(page.locator('.narrative')).toContainText(lines[1]);
  await expect(page.locator('.artifacts pre')).toHaveCount(scn.artifacts.length);
  await expect(page.locator('.artifacts pre').first()).toContainText(scn.artifacts[0]);
});

test('a scenario run asks the chained questions in order and ends with the debrief', async ({ page }) => {
  await page.goto(`/#/scenarios/${scn.id}`);
  await page.locator('#start-scenario').click();
  const played = await playRun(page);
  expect(played.map((p) => p.q.id)).toEqual(scn.questions);
  expect(played.map((p) => p.q.type)).toEqual(['single', 'multi', 'open', 'open']);
  await expect(page.locator('h2.results-score')).toHaveText(`Score: ${scn.questions.length} / ${scn.questions.length}`);
  const debrief = scn.debrief.split('\n');
  await expect(page.locator('.debrief p')).toHaveCount(debrief.length);
  await expect(page.locator('.debrief')).toContainText(debrief[0]);
});

test('an open question reveals the model answer and rubric; "partly" counts as wrong', async ({ page }) => {
  await page.goto(`/#/scenarios/${scn.id}`);
  await page.locator('#start-scenario').click();
  for (const id of scn.questions.slice(0, 2)) {
    const q = questions.find((x) => x.id === id);
    for (const opt of q.answer) await page.locator(`.q input[value="${opt}"]`).check();
    await page.locator('#submit').click();
    await page.locator('#next').click();
  }
  await expect(page.locator('.q textarea')).toBeVisible();
  await expect(page.locator('.q .model')).toBeHidden();
  await page.locator('.q button.show-model').click();
  const open = questions.find((q) => q.id === scn.questions[2]);
  await expect(page.locator('.q .model')).toContainText(open.explanation.correct);
  await expect(page.locator('.q .model li')).toHaveCount(open.rubric.length);
  await page.locator('.q button[data-assess="partial"]').click();
  await expect(page.locator('#feedback .verdict')).toHaveText('Partly');
  await expect(page.locator('#feedback .verdict')).toHaveClass(/bad/);
});

test('a scenario whose questions are not all served is listed as unavailable (Review Focus 4)', async ({ page }) => {
  await page.route('**/data/incident-response.json*', async (route) => {
    const response = await route.fetch();
    const data = await response.json();
    data.questions = data.questions.filter((q) => q.id !== scn.questions[1]);
    await route.fulfill({ response, json: data });
  });
  await page.goto('/#/scenarios');
  await expect(page.locator('li.unavailable')).toContainText(scn.title);
  await expect(page.locator(`a[href="#/scenarios/${scn.id}"]`)).toHaveCount(0);
  await page.goto(`/#/scenarios/${scn.id}`);
  await expect(page.locator('#start-scenario')).toHaveCount(0);
  await expect(page.locator('.unavailable-note')).toBeVisible();
});

test('an unknown scenario id shows a not-found message', async ({ page }) => {
  await page.goto('/#/scenarios/scn-404');
  await expect(page.locator('.not-found')).toBeVisible();
  await page.locator('a[href="#/scenarios"]').click();
  await expect(page.locator('h1')).toHaveText('Scenarios');
});
