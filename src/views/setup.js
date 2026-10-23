import { h } from '../dom.js';
import { DOMAINS, LAYERS, DIFFICULTIES, SECTORS } from '../taxonomy.js';
import { buildPractice, isEligibleForPractice } from '../selection.js';

export function renderPracticeSetup(ctx, questions, { onStart }) {
  const { t } = ctx;
  const eligible = questions.filter(isEligibleForPractice);
  const perDomain = Object.fromEntries(DOMAINS.map((d) => [d.id, eligible.filter((q) => q.domain === d.id).length]));

  const boxes = DOMAINS.filter((d) => perDomain[d.id] > 0).map((d) => h('input', { type: 'checkbox', name: 'domain', value: d.id, onchange: update }));
  const domainLabels = boxes.map((b) => h('label', { class: 'choice' }, b,
    h('span', null, `${t(`domain.${b.value}`)} (${perDomain[b.value]})`)));

  const select = (name, label, values, text) => {
    const el = h('select', { name, id: `f-${name}`, onchange: update },
      h('option', { value: '' }, t('setup.any')), ...values.map((v) => h('option', { value: v }, text(v))));
    return { el, row: h('div', { class: 'field' }, h('label', { for: `f-${name}` }, label), el) };
  };
  const layer = select('layer', t('setup.layer'), LAYERS, (v) => t(`layer.${v}`));
  const difficulty = select('difficulty', t('setup.difficulty'), DIFFICULTIES, (v) => t(`difficulty.${v}`));
  const sector = select('sector', t('setup.sector'), Object.keys(SECTORS), (v) => t(`sector.${v}`));
  const count = h('select', { name: 'count', id: 'f-count', onchange: update },
    ...[10, 20, 30].map((n) => h('option', { value: String(n) }, String(n))));

  const available = h('p', { class: 'available', 'aria-live': 'polite' });
  const noMatch = h('p', { class: 'no-match', role: 'status', hidden: true }, t('setup.none'));
  const start = h('button', { type: 'button', id: 'start', class: 'btn primary', onclick: () => onStart(filters()) }, t('setup.start'));

  function filters() {
    const chosen = boxes.filter((b) => b.checked).map((b) => b.value);
    return {
      domains: chosen,
      layers: layer.el.value ? [layer.el.value] : undefined,
      difficulties: difficulty.el.value ? [difficulty.el.value] : undefined,
      sectors: sector.el.value ? [sector.el.value] : undefined,
      count: Number(count.value),
    };
  }

  function update() {
    const n = buildPractice(questions, { ...filters(), count: Infinity }).length;
    available.textContent = t('setup.available', { n });
    noMatch.hidden = n > 0;
    start.disabled = n === 0;
  }

  const root = h('div', { class: 'setup' },
    ctx.store.persistent ? null : h('p', { class: 'notice', role: 'status' }, t('notice.unsaved')),
    h('fieldset', null, h('legend', null, t('setup.domains')), ...domainLabels),
    layer.row, difficulty.row, sector.row,
    h('div', { class: 'field' }, h('label', { for: 'f-count' }, t('setup.count')), count),
    available, noMatch,
    h('div', { class: 'actions' }, start));
  update();
  return root;
}
