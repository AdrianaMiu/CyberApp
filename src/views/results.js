import { h } from '../dom.js';

export function renderResults(ctx, report, byId, { onAgain } = {}) {
  const { t } = ctx;
  const missed = report.items.filter((i) => !i.correct);
  return h('div', { class: 'results' },
    h('h2', { class: 'results-score', tabindex: '-1' }, t('results.score', { n: report.correct, total: report.total })),
    h('table', { class: 'by-domain' },
      h('caption', null, t('results.byDomain')),
      h('thead', null, h('tr', null,
        h('th', { scope: 'col' }, t('results.domain')), h('th', { scope: 'col' }, t('results.correct')), h('th', { scope: 'col' }, t('results.total')))),
      h('tbody', null, ...Object.entries(report.byDomain).map(([id, d]) => h('tr', null,
        h('th', { scope: 'row' }, t(`domain.${id}`)), h('td', null, d.correct), h('td', null, d.total))))),
    missed.length ? h('h3', null, t('results.missed')) : null,
    missed.length ? h('ul', { class: 'missed-list' }, ...missed.map((i) => {
      const q = byId.get(i.id);
      return h('li', null, h('p', null, h('strong', null, q.question)), h('p', null, q.explanation.correct));
    })) : null,
    h('div', { class: 'actions' },
      onAgain ? h('button', { type: 'button', class: 'btn primary', onclick: onAgain }, t('results.again')) : null,
      h('a', { class: 'btn', href: '#/' }, t('results.home'))));
}
