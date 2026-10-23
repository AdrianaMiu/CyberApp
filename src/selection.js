import { DOMAINS } from './taxonomy.js';

export const isEligibleForPractice = (q) => q.type !== 'open' && !q.scenario_id;

function shuffled(list, rng) {
  const a = list.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const allows = (list, value) => !list || list.length === 0 || list.includes(value);

export function buildPractice(questions, { domains, layers, difficulties, sectors, count, rng = Math.random }) {
  const pool = questions.filter((q) => isEligibleForPractice(q)
    && allows(domains, q.domain) && allows(layers, q.layer) && allows(difficulties, q.difficulty) && allows(sectors, q.sector));
  return shuffled(pool, rng).slice(0, count);
}

function quotas(count) {
  const raw = DOMAINS.map((d) => ({ id: d.id, exact: (d.weight * count) / 100 }));
  const out = Object.fromEntries(raw.map((r) => [r.id, Math.floor(r.exact)]));
  let left = count - Object.values(out).reduce((a, b) => a + b, 0);
  const byFraction = raw.slice().sort((a, b) => (b.exact - Math.floor(b.exact)) - (a.exact - Math.floor(a.exact)));
  for (const r of byFraction) {
    if (left <= 0) break;
    out[r.id] += 1;
    left -= 1;
  }
  return out;
}

export function buildExam(questions, { count, rng = Math.random }) {
  const eligible = questions.filter(isEligibleForPractice);
  const target = Math.min(count, eligible.length);
  const remaining = new Map(DOMAINS.map((d) => [d.id, shuffled(eligible.filter((q) => q.domain === d.id), rng)]));
  const quota = quotas(target);
  const chosen = [];
  const shortfalls = [];
  for (const d of DOMAINS) {
    const list = remaining.get(d.id);
    const take = list.splice(0, quota[d.id]);
    chosen.push(...take);
    if (take.length < quota[d.id]) shortfalls.push({ domain: d, need: quota[d.id] - take.length });
  }
  for (const { domain, need } of shortfalls.sort((a, b) => b.domain.weight - a.domain.weight)) {
    const sameGroup = shuffled(DOMAINS.filter((d) => d.group === domain.group && d.id !== domain.id).flatMap((d) => remaining.get(d.id)), rng);
    const fromGroup = sameGroup.slice(0, need);
    const used = new Set(fromGroup.map((q) => q.id));
    for (const list of remaining.values()) for (let i = list.length - 1; i >= 0; i--) if (used.has(list[i].id)) list.splice(i, 1);
    chosen.push(...fromGroup);
    let stillNeeded = need - fromGroup.length;
    if (stillNeeded > 0) {
      const anywhere = shuffled([...remaining.values()].flat(), rng).slice(0, stillNeeded);
      const usedAny = new Set(anywhere.map((q) => q.id));
      for (const list of remaining.values()) for (let i = list.length - 1; i >= 0; i--) if (usedAny.has(list[i].id)) list.splice(i, 1);
      chosen.push(...anywhere);
      stillNeeded -= anywhere.length;
    }
  }
  return shuffled(chosen, rng);
}

export function buildReview(questions, store, now) {
  const due = new Set(store.dueIds(now));
  return questions
    .filter((q) => due.has(q.id))
    .sort((a, b) => store.get(a.id).due - store.get(b.id).due);
}

export function buildScenarioRun(scenario, questions) {
  const byId = new Map(questions.map((q) => [q.id, q]));
  return scenario.questions.map((id) => {
    const q = byId.get(id);
    if (!q) throw new Error(`scenario ${scenario.id}: missing question ${id}`);
    return q;
  });
}
