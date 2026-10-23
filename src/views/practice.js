import { h } from '../dom.js';
import { buildPractice } from '../selection.js';
import { createSession } from '../session.js';
import { renderPracticeSetup } from './setup.js';
import { renderRun } from './run.js';
import { renderResults } from './results.js';

export async function renderPractice(ctx) {
  const questions = await ctx.loader.loadAll();
  const byId = new Map(questions.map((q) => [q.id, q]));
  const body = h('div', { class: 'practice-body' });
  const root = h('section', { class: 'practice' }, h('h1', null, ctx.t('mode.practice')), body);

  function showSetup() {
    body.replaceChildren(renderPracticeSetup(ctx, questions, { onStart: start }));
  }
  function start(filters) {
    const picked = buildPractice(questions, filters);
    if (picked.length === 0) return;
    const session = createSession({ mode: 'practice', questions: picked, store: ctx.store });
    body.replaceChildren(renderRun(ctx, session, finished));
  }
  function finished(report) {
    body.replaceChildren(renderResults(ctx, report, byId, { onAgain: showSetup }));
    const score = body.querySelector('.results-score');
    if (score) score.focus();
  }
  showSetup();
  return root;
}
