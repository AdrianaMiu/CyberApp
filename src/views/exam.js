import { h } from '../dom.js';
import { buildExam, isEligibleForPractice } from '../selection.js';
import { createSession } from '../session.js';
import { PER_QUESTION_MS } from '../config.js';
import { renderQuestion } from './question.js';
import { renderResults } from './results.js';

const MIN_QUESTIONS = 5;

function clock(ms) {
  const total = Math.max(0, Math.ceil(ms / 1000));
  return `${String(Math.floor(total / 60)).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`;
}

function renderExamRun(ctx, session, finish) {
  const { t } = ctx;
  const timer = h('p', { class: 'timer', 'aria-live': 'off' }, clock(session.remainingMs()));
  const body = h('div', { class: 'exam-question' });
  const root = h('section', { class: 'run exam-run' }, timer, body);

  const interval = setInterval(() => {
    if (!root.isConnected) {
      clearInterval(interval);
      return;
    }
    session.tick();
    if (session.finished()) {
      clearInterval(interval);
      finish(session.report());
      return;
    }
    timer.textContent = clock(session.remainingMs());
  }, 1000);

  function show() {
    const q = session.current();
    if (!q) {
      clearInterval(interval);
      finish(session.report());
      return;
    }
    let response = null;
    let submitted = false;
    const last = session.index === session.total - 1;
    const submitBtn = h('button', { type: 'button', id: 'submit', class: 'btn primary', disabled: true }, t('exam.save'));
    const nextBtn = h('button', { type: 'button', id: 'next', class: 'btn' }, t(last ? 'run.finish' : 'run.next'));
    const saved = h('p', { class: 'saved', role: 'status', hidden: true }, t('exam.saved'));
    const flag = h('button', { type: 'button', class: 'btn flag', 'aria-pressed': 'false' }, t('run.flag'));
    const qv = renderQuestion(q, {
      t,
      onChange(r) {
        response = r;
        if (!submitted) submitBtn.disabled = r === null;
      },
    });
    submitBtn.addEventListener('click', () => {
      if (submitted || response === null) return;
      submitted = true;
      session.submit(response);
      qv.lock();
      submitBtn.hidden = true;
      saved.hidden = false;
    });
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
    body.replaceChildren(
      h('p', { class: 'run-progress' }, t('run.progress', { n: session.index + 1, total: session.total })),
      qv.el,
      h('div', { class: 'actions' }, submitBtn, flag),
      saved,
      h('div', { class: 'actions' }, nextBtn));
    const text = body.querySelector('.question-text');
    if (text) text.focus();
  }
  show();
  return root;
}

export async function renderExam(ctx) {
  const { t } = ctx;
  const questions = await ctx.loader.loadAll();
  const byId = new Map(questions.map((q) => [q.id, q]));
  const pool = questions.filter(isEligibleForPractice).length;
  const body = h('div', { class: 'exam-body' });
  const root = h('section', { class: 'exam' }, h('h1', null, t('mode.exam')), body);

  function showSetup() {
    const count = h('select', { name: 'count', id: 'f-count', onchange: note }, ...[30, 45, 60].map((n) => h('option', { value: String(n) }, String(n))));
    const poolNote = h('p', { class: 'pool-note', 'aria-live': 'polite' });
    const start = h('button', { type: 'button', id: 'start', class: 'btn primary', disabled: pool < MIN_QUESTIONS, onclick: begin }, t('setup.start'));
    function note() {
      poolNote.textContent = pool < MIN_QUESTIONS
        ? t('exam.tooFew', { min: MIN_QUESTIONS })
        : t('exam.pool', { n: pool, m: Math.min(pool, Number(count.value)) });
    }
    function begin() {
      const picked = buildExam(questions, { count: Number(count.value) });
      const session = createSession({ mode: 'exam', questions: picked, store: ctx.store, perQuestionMs: PER_QUESTION_MS });
      ctx.leaveGuard = t('exam.confirmLeave');
      body.replaceChildren(renderExamRun(ctx, session, finished));
    }
    note();
    body.replaceChildren(
      ctx.store.persistent ? null : h('p', { class: 'notice', role: 'status' }, t('notice.unsaved')),
      h('p', null, t('mode.exam.desc')),
      h('div', { class: 'field' }, h('label', { for: 'f-count' }, t('setup.count')), count),
      poolNote,
      h('div', { class: 'actions' }, start));
  }

  function finished(report) {
    ctx.leaveGuard = null;
    const results = renderResults(ctx, report, byId, { onAgain: showSetup });
    if (report.expired) results.prepend(h('p', { class: 'notice expired-note', role: 'status' }, t('exam.expired')));
    body.replaceChildren(results);
    const score = body.querySelector('.results-score');
    if (score) score.focus();
  }

  showSetup();
  return root;
}
