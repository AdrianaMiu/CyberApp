import { h } from '../dom.js';
import { buildReview } from '../selection.js';
import { createSession } from '../session.js';
import { renderRun } from './run.js';
import { renderResults } from './results.js';

export async function renderReview(ctx) {
  const { t, store } = ctx;
  const [questions, scenarios] = await Promise.all([ctx.loader.loadAll(), ctx.loader.loadScenarios()]);
  const byId = new Map(questions.map((q) => [q.id, q]));
  const due = buildReview(questions, store, Date.now());
  const dueIds = new Set(due.map((q) => q.id));
  const waiting = new Set([...store.missedIds(), ...store.flaggedIds()].filter((id) => byId.has(id) && !dueIds.has(id)));

  const body = h('div', { class: 'review-body' });
  const root = h('section', { class: 'review' }, h('h1', null, t('mode.review')), body);

  function scenarioContext(q) {
    const s = q.scenario_id && scenarios.find((x) => x.id === q.scenario_id);
    if (!s) return null;
    return h('div', { class: 'scenario-context card' }, h('h2', null, s.title),
      ...s.narrative.split('\n').filter((l) => l.trim() !== '').map((l) => h('p', null, l)));
  }

  function start() {
    const session = createSession({ mode: 'review', questions: due, store });
    body.replaceChildren(renderRun(ctx, session, finished, { onQuestion: scenarioContext }));
  }
  function finished(report) {
    body.replaceChildren(renderResults(ctx, report, byId, { onAgain: () => ctx.rerender() }));
    const score = body.querySelector('.results-score');
    if (score) score.focus();
  }

  body.replaceChildren(
    h('p', null, t('mode.review.desc')),
    h('p', { class: 'review-due' }, t('mode.review.due', { n: due.length })),
    h('p', { class: 'review-waiting' }, t('review.waiting', { n: waiting.size })),
    due.length === 0 && waiting.size === 0 ? h('p', { class: 'notice review-empty', role: 'status' }, t('review.empty')) : null,
    h('div', { class: 'actions' }, h('button', { type: 'button', id: 'start', class: 'btn primary', disabled: due.length === 0, onclick: start }, t('setup.start'))));
  return root;
}
