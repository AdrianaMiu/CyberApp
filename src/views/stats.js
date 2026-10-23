import { h } from '../dom.js';
import { DOMAINS, DIFFICULTIES } from '../taxonomy.js';

export async function renderStats(ctx) {
  const { t, store } = ctx;
  const questions = await ctx.loader.loadAll();
  const byId = new Map(questions.map((q) => [q.id, q]));
  const stats = store.stats(questions);
  const missed = store.missedIds().filter((id) => byId.has(id));
  const flagged = store.flaggedIds().filter((id) => byId.has(id));
  const any = Object.keys(stats.byDomain).length > 0;

  const row = (cls, key, label, s) => h('li', { class: cls, dataset: { [cls === 'domain-row' ? 'domain' : 'difficulty']: key } },
    h('span', { class: 'stat-label' }, label),
    h('progress', { max: '100', value: String(s.pct), 'aria-label': `${label}: ${s.pct}%` }),
    h('span', { class: 'stat-value' }, `${s.pct}% (${s.correct}/${s.answered})`));

  return h('section', { class: 'stats' },
    h('h1', null, t('nav.stats')),
    h('p', { class: 'streak' }, t('stats.streak', { n: store.streak() })),
    h('p', { class: 'count-missed' }, t('stats.missed', { n: missed.length })),
    h('p', { class: 'count-flagged' }, t('stats.flagged', { n: flagged.length })),
    any ? null : h('p', { class: 'notice stats-empty', role: 'status' }, t('stats.empty')),
    any ? h('h2', null, t('stats.domains')) : null,
    any ? h('ul', { class: 'bars' }, ...DOMAINS.filter((d) => stats.byDomain[d.id]).map((d) => row('domain-row', d.id, t(`domain.${d.id}`), stats.byDomain[d.id]))) : null,
    any ? h('h2', null, t('stats.difficulty')) : null,
    any ? h('ul', { class: 'bars' }, ...DIFFICULTIES.filter((d) => stats.byDifficulty[d]).map((d) => row('difficulty-row', d, t(`difficulty.${d}`), stats.byDifficulty[d]))) : null,
    flagged.length ? h('h2', null, t('stats.flaggedList')) : null,
    flagged.length ? h('ul', { class: 'flagged-list' }, ...flagged.map((id) => h('li', null, byId.get(id).question))) : null,
    h('div', { class: 'actions' }, h('a', { class: 'btn', href: '#/' }, t('results.home'))));
}
