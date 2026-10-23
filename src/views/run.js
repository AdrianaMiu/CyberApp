import { h } from '../dom.js';
import { renderQuestion, renderFeedback } from './question.js';

/** Runs a session with immediate feedback (practice, review, scenario). Calls onFinished(report) when done. */
export function renderRun(ctx, session, onFinished, { onQuestion } = {}) {
  const { t } = ctx;
  const root = h('section', { class: 'run' });

  function show() {
    const q = session.current();
    if (!q) {
      onFinished(session.report());
      return;
    }
    let response = null;
    let submitted = false;
    const last = session.index === session.total - 1;

    const submitBtn = h('button', { type: 'button', id: 'submit', class: 'btn primary', disabled: true, hidden: q.type === 'open' }, t('run.submit'));
    const nextBtn = h('button', { type: 'button', id: 'next', class: 'btn primary', hidden: true }, t(last ? 'run.finish' : 'run.next'));
    const feedback = h('div', { id: 'feedback', 'aria-live': 'polite' });
    const record = ctx.store.get(q.id);
    const flag = h('button', { type: 'button', class: 'btn flag', 'aria-pressed': String(Boolean(record && record.flagged)) }, t('run.flag'));

    function doSubmit() {
      if (submitted || response === null) return;
      submitted = true;
      const result = session.submit(response);
      qv.lock();
      submitBtn.hidden = true;
      feedback.replaceChildren(renderFeedback(q, { t, correct: result.correct, response }));
      ctx.announce(t(result.correct ? 'run.correct' : 'run.incorrect'));
      nextBtn.hidden = false;
      nextBtn.focus();
    }

    const qv = renderQuestion(q, {
      t,
      onChange(r) {
        response = r;
        if (submitted) return;
        if (q.type === 'open') doSubmit();
        else submitBtn.disabled = r === null;
      },
    });
    submitBtn.addEventListener('click', doSubmit);
    nextBtn.addEventListener('click', () => {
      session.next();
      show();
    });
    flag.addEventListener('click', () => {
      const pressed = flag.getAttribute('aria-pressed') === 'true';
      session.setFlag(!pressed);
      flag.setAttribute('aria-pressed', String(!pressed));
    });
    response = qv.getResponse();
    submitBtn.disabled = response === null;

    root.replaceChildren(
      h('p', { class: 'run-progress' }, t('run.progress', { n: session.index + 1, total: session.total })),
      onQuestion ? onQuestion(q) : null,
      qv.el,
      h('div', { class: 'actions' }, submitBtn, flag),
      feedback,
      h('div', { class: 'actions' }, nextBtn));
    const text = root.querySelector('.question-text');
    if (text) text.focus({ preventScroll: false });
  }

  show();
  return root;
}
