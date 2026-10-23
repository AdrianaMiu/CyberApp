import { h } from '../dom.js';
import { buildReview } from '../selection.js';

export async function renderHome(ctx) {
  const { t, store } = ctx;
  let due = 0;
  let status = null;
  try {
    const questions = await ctx.loader.loadAll();
    if (questions.length === 0) status = h('p', { class: 'notice' }, t('home.empty'));
    due = buildReview(questions, store, Date.now()).length;
  } catch (e) {
    status = h('div', { class: 'notice', role: 'alert' },
      h('p', null, t('error.data')),
      h('button', { type: 'button', class: 'btn', onclick: () => ctx.rerender() }, t('action.retry')));
  }

  const mode = (name, extra) => h('li', null,
    h('a', { class: 'mode', href: `#/${name}` },
      h('strong', null, t(`mode.${name}`)),
      h('span', null, t(`mode.${name}.desc`)),
      extra ? h('span', { class: 'badge' }, extra) : null));

  return h('section', { class: 'home' },
    h('h1', null, t('app.title')),
    h('p', { class: 'tagline' }, t('home.tagline')),
    store.persistent ? null : h('p', { class: 'notice', role: 'status' }, t('notice.unsaved')),
    status,
    h('nav', { 'aria-label': t('nav.modes') },
      h('ul', { class: 'modes' },
        mode('practice'), mode('exam'), mode('scenarios'), mode('review', t('mode.review.due', { n: due })))),
    h('nav', { class: 'more', 'aria-label': t('nav.more') },
      h('a', { class: 'btn', href: '#/stats' }, t('nav.stats')),
      h('a', { class: 'btn', href: '#/search' }, t('nav.search')),
      h('a', { class: 'btn', href: '#/settings' }, t('nav.settings'))));
}
