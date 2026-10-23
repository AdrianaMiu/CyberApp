import { isCorrect } from './scoring.js';
import { PER_QUESTION_MS } from './config.js';

export function createSession({ mode, questions, store, now = Date.now, perQuestionMs = PER_QUESTION_MS }) {
  const exam = mode === 'exam';
  const total = questions.length;
  const startedAt = now();
  const results = new Map();
  const flags = new Map();
  let index = 0;
  let done = false;
  let expired = false;
  let finishedAt = null;

  function finish(byExpiry) {
    if (done) return;
    done = true;
    expired = byExpiry;
    finishedAt = now();
    if (exam) {
      questions.forEach((q, i) => {
        const r = results.get(i) || { response: null, correct: false };
        results.set(i, r);
        store.recordAnswer(q, r.correct, { flagged: flags.get(i) });
      });
    }
  }

  const session = {
    mode,
    questions,
    total,
    get index() {
      return index;
    },
    current: () => (done || index >= total ? null : questions[index]),
    finished: () => done || index >= total,
    submit(response) {
      if (session.finished()) throw new Error('session finished');
      if (results.has(index)) throw new Error('question already answered');
      const q = questions[index];
      const correct = isCorrect(q, response);
      results.set(index, { response, correct });
      if (exam) return { recorded: true };
      store.recordAnswer(q, correct, { flagged: flags.get(index) });
      return { correct };
    },
    setFlag(flagged) {
      if (session.finished()) return;
      flags.set(index, flagged);
      if (!exam) store.setFlag(questions[index], flagged);
    },
    next() {
      if (session.finished()) return;
      if (exam && !results.has(index)) results.set(index, { response: null, correct: false });
      index += 1;
      if (index >= total) finish(false);
    },
    tick() {
      if (exam && !done && now() - startedAt >= total * perQuestionMs) finish(true);
    },
    remainingMs() {
      if (!exam) return null;
      const at = finishedAt === null ? now() : finishedAt;
      return Math.max(0, total * perQuestionMs - (at - startedAt));
    },
    report() {
      const items = [];
      const byDomain = {};
      questions.forEach((q, i) => {
        const r = results.get(i);
        if (!r) return;
        items.push({ id: q.id, correct: r.correct, flagged: Boolean(flags.get(i)), response: r.response });
        const d = (byDomain[q.domain] = byDomain[q.domain] || { total: 0, correct: 0 });
        d.total += 1;
        if (r.correct) d.correct += 1;
      });
      return {
        mode,
        total,
        answered: [...results.values()].filter((r) => r.response !== null).length,
        correct: items.filter((x) => x.correct).length,
        expired,
        durationMs: (finishedAt === null ? now() : finishedAt) - startedAt,
        byDomain,
        items,
      };
    },
  };
  return session;
}
