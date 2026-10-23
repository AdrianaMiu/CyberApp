import { h } from '../dom.js';
import { reportIssueUrl, REPO_SLUG } from '../config.js';

function choiceBody(q, emit) {
  const multi = q.type === 'multi' || (q.type === 'log-analysis' && q.answer.length > 1);
  const inputs = q.options.map((o) => h('input', { type: multi ? 'checkbox' : 'radio', name: 'opt', value: o.id, onchange: emit }));
  const labels = q.options.map((o, i) => h('label', { class: 'choice' }, inputs[i], h('span', null, o.text)));
  return {
    el: h('fieldset', { 'aria-labelledby': 'qtext' }, ...labels),
    getResponse() {
      const ids = inputs.filter((i) => i.checked).map((i) => i.value);
      return ids.length ? ids : null;
    },
  };
}

function orderingBody(q, t, emit) {
  const byId = Object.fromEntries(q.options.map((o) => [o.id, o]));
  let order = q.options.map((o) => o.id);
  const list = h('ol', { class: 'order' });
  function draw(focus) {
    list.replaceChildren(...order.map((id, i) => h('li', { dataset: { id } },
      h('span', { class: 'order-text' }, byId[id].text),
      h('button', { type: 'button', class: 'move move-up', 'aria-label': t('order.up', { item: byId[id].text }), disabled: i === 0, onclick: () => move(id, -1) }, '↑'),
      h('button', { type: 'button', class: 'move move-down', 'aria-label': t('order.down', { item: byId[id].text }), disabled: i === order.length - 1, onclick: () => move(id, 1) }, '↓'))));
    if (focus) {
      const li = [...list.children].find((c) => c.dataset.id === focus.id);
      const wanted = li && li.querySelector(focus.dir === -1 ? '.move-up' : '.move-down');
      const other = li && li.querySelector(focus.dir === -1 ? '.move-down' : '.move-up');
      if (wanted && !wanted.disabled) wanted.focus();
      else if (other) other.focus();
    }
  }
  function move(id, dir) {
    const i = order.indexOf(id);
    const j = i + dir;
    if (j < 0 || j >= order.length) return;
    order = order.slice();
    [order[i], order[j]] = [order[j], order[i]];
    draw({ id, dir });
    emit();
  }
  draw();
  return { el: h('fieldset', { 'aria-labelledby': 'qtext' }, list), getResponse: () => order.slice() };
}

function matchingBody(q, t, emit) {
  const selects = q.options.left.map((l) => h('select', { id: `m-${l.id}`, 'data-left': l.id, onchange: emit },
    h('option', { value: '' }, t('match.choose')),
    ...q.options.right.map((r) => h('option', { value: r.id }, r.text))));
  const rows = q.options.left.map((l, i) => h('div', { class: 'pair' }, h('label', { for: `m-${l.id}` }, l.text), selects[i]));
  return {
    el: h('fieldset', { 'aria-labelledby': 'qtext' }, ...rows),
    getResponse() {
      const out = {};
      for (const s of selects) {
        if (!s.value) return null;
        out[s.getAttribute('data-left')] = s.value;
      }
      return out;
    },
  };
}

function openBody(q, t, emit, setValue) {
  const model = h('div', { class: 'model', hidden: true },
    h('p', null, q.explanation.correct),
    h('p', { class: 'muted' }, t('open.rubric')),
    h('ul', null, ...(q.rubric || []).map((r) => h('li', null, r))),
    h('div', { class: 'actions' },
      ...['got', 'partial', 'missed'].map((k) => h('button', { type: 'button', class: 'btn', 'data-assess': k, onclick: () => { setValue(k); emit(); } }, t(`open.${k}`)))));
  const reveal = h('button', { type: 'button', class: 'btn show-model', onclick: () => { model.hidden = false; reveal.hidden = true; } }, t('open.show'));
  return {
    el: h('div', { class: 'open-answer' },
      h('label', { for: 'notes' }, t('open.notes')),
      h('textarea', { id: 'notes', rows: 4 }),
      reveal,
      model),
  };
}

export function renderQuestion(q, { t, onChange }) {
  let chosen = null;
  const emit = () => onChange(body.getResponse());
  let body;
  if (q.type === 'ordering') body = orderingBody(q, t, emit);
  else if (q.type === 'matching') body = matchingBody(q, t, emit);
  else if (q.type === 'open') {
    body = openBody(q, t, emit, (v) => { chosen = v; });
    body.getResponse = () => chosen;
  } else body = choiceBody(q, emit);

  const el = h('div', { class: 'q' },
    h('p', { class: 'question-text', id: 'qtext', tabindex: '-1' }, q.question),
    q.context ? h('pre', { class: 'context' }, q.context) : null,
    body.el);

  return {
    el,
    getResponse: body.getResponse,
    lock() {
      for (const c of el.querySelectorAll('input, select, textarea, button')) c.setAttribute('disabled', '');
    },
  };
}

function optionLabel(q, id) {
  if (Array.isArray(q.options)) {
    const o = q.options.find((x) => x.id === id);
    if (o) return o.text;
  } else if (q.options && q.options.left) {
    const o = q.options.left.find((x) => x.id === id);
    if (o) return o.text;
  }
  return id;
}

export function renderFeedback(q, { t, correct, response }) {
  const parts = [];
  if (q.type === 'open') {
    parts.push(h('p', { class: `verdict ${response === 'got' ? 'ok' : 'bad'}` }, t(`open.${response}`)));
  } else {
    parts.push(h('p', { class: `verdict ${correct ? 'ok' : 'bad'}` }, t(correct ? 'run.correct' : 'run.incorrect')));
    parts.push(h('p', { class: 'explanation' }, q.explanation.correct));
    const entries = Object.entries(q.explanation.distractors || {});
    if (entries.length) {
      parts.push(h('h3', null, t('run.whyWrong')));
      parts.push(h('ul', { class: 'why' }, ...entries.map(([id, reason]) => h('li', null, h('strong', null, `${optionLabel(q, id)}: `), reason))));
    }
  }
  if (q.explanation.interview_angle) {
    parts.push(h('p', { class: 'interview' }, h('strong', null, `${t('run.interview')}: `), q.explanation.interview_angle));
  }
  if (q.references && q.references.length) {
    parts.push(h('h3', null, t('run.references')));
    parts.push(h('ul', { class: 'refs' }, ...q.references.map((r) => h('li', null,
      h('a', { href: r.url, target: '_blank', rel: 'noopener noreferrer' }, r.title)))));
  }
  const report = reportIssueUrl(REPO_SLUG, q);
  if (report) parts.push(h('p', null, h('a', { class: 'btn', href: report, target: '_blank', rel: 'noopener noreferrer' }, t('run.report'))));
  return h('div', { class: 'feedback' }, ...parts);
}
