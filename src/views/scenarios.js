import { h } from '../dom.js';
import { buildScenarioRun } from '../selection.js';
import { createSession } from '../session.js';
import { renderRun } from './run.js';
import { renderResults } from './results.js';

const paragraphs = (text) => String(text).split('\n').filter((l) => l.trim() !== '').map((l) => h('p', null, l));

export async function renderScenarios(ctx, route) {
  const { t } = ctx;
  const [questions, scenarios] = await Promise.all([ctx.loader.loadAll(), ctx.loader.loadScenarios()]);
  const byId = new Map(questions.map((q) => [q.id, q]));
  const available = (s) => s.questions.every((id) => byId.has(id));

  if (route.name === 'scenarios') {
    return h('section', null,
      h('h1', null, t('mode.scenarios')),
      scenarios.length === 0 ? h('p', { class: 'notice' }, t('scenario.none')) : null,
      h('ul', { class: 'modes' }, ...scenarios.map((s) => (available(s)
        ? h('li', null, h('a', { class: 'mode', href: `#/scenarios/${s.id}` },
          h('strong', null, s.title), h('span', null, t('scenario.questions', { n: s.questions.length }))))
        : h('li', { class: 'unavailable mode' }, h('strong', null, s.title), h('span', null, t('scenario.unavailable')))))));
  }

  const scenario = scenarios.find((s) => s.id === route.params.id);
  if (!scenario) {
    return h('section', null,
      h('h1', null, t('mode.scenarios')),
      h('p', { class: 'not-found', role: 'alert' }, t('scenario.notfound')),
      h('a', { class: 'btn', href: '#/scenarios' }, t('scenario.back')));
  }

  const body = h('div', { class: 'scenario-body' });
  const root = h('section', { class: 'scenario' }, h('h1', null, scenario.title), body);

  function showIntro() {
    const ok = available(scenario);
    body.replaceChildren(
      h('div', { class: 'narrative card' }, ...paragraphs(scenario.narrative)),
      scenario.artifacts && scenario.artifacts.length
        ? h('div', { class: 'artifacts' }, h('h2', null, t('scenario.evidence')), ...scenario.artifacts.map((a) => h('pre', null, a)))
        : null,
      ok ? h('div', { class: 'actions' }, h('button', { type: 'button', id: 'start-scenario', class: 'btn primary', onclick: start }, t('scenario.start')))
        : h('p', { class: 'notice unavailable-note', role: 'status' }, t('scenario.unavailable')),
      h('a', { class: 'btn', href: '#/scenarios' }, t('scenario.back')));
  }

  function start() {
    const session = createSession({ mode: 'scenario', questions: buildScenarioRun(scenario, questions), store: ctx.store });
    body.replaceChildren(renderRun(ctx, session, finished));
  }

  function finished(report) {
    const results = renderResults(ctx, report, byId, { onAgain: showIntro });
    body.replaceChildren(
      results,
      h('div', { class: 'debrief card' }, h('h2', null, t('scenario.debrief')), ...paragraphs(scenario.debrief)));
    const score = body.querySelector('.results-score');
    if (score) score.focus();
  }

  showIntro();
  return root;
}
