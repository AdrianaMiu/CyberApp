import { h } from '../dom.js';
import { searchQuestions } from '../search.js';
import { createSession } from '../session.js';
import { renderRun } from './run.js';
import { renderResults } from './results.js';
import { isEligibleForPractice } from '../selection.js';

export async function renderSearch(ctx, route) {
  const { t } = ctx;
  // open and scenario-chained questions only make sense inside Scenario and Review mode (spec section 9)
  const questions = (await ctx.loader.loadAll()).filter(isEligibleForPractice);
  const byId = new Map(questions.map((q) => [q.id, q]));
  const list = h('ul', { class: 'results-list' });
  const none = h('p', { class: 'search-none', role: 'status', hidden: true }, t('search.none'));
  const count = h('p', { class: 'muted', 'aria-live': 'polite' });
  const body = h('div', { class: 'search-body' });
  const input = h('input', { type: 'search', id: 'q', name: 'q', value: route.params.q || '', oninput: update });
  const root = h('section', { class: 'search' }, h('h1', null, t('nav.search')), body);

  function open(q) {
    const session = createSession({ mode: 'practice', questions: [q], store: ctx.store });
    body.replaceChildren(renderRun(ctx, session, (report) => {
      body.replaceChildren(renderResults(ctx, report, byId, { onAgain: () => ctx.rerender() }));
    }));
  }

  function update() {
    const found = searchQuestions(questions, input.value);
    list.replaceChildren(...found.map((q) => h('li', { class: 'result', dataset: { id: q.id } },
      h('p', null, h('strong', null, q.question)),
      h('p', { class: 'muted' }, `${t(`domain.${q.domain}`)} · ${t(`difficulty.${q.difficulty}`)}`),
      h('button', { type: 'button', class: 'btn open-result', onclick: () => open(q) }, t('search.open')))));
    none.hidden = found.length > 0 || input.value.trim() === '';
    count.textContent = input.value.trim() === '' ? '' : t('search.results', { n: found.length });
  }

  body.replaceChildren(
    h('div', { class: 'field' }, h('label', { for: 'q' }, t('search.label')), input),
    count, none, list);
  update();
  return root;
}
