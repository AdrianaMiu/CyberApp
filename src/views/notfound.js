import { h } from '../dom.js';

export function renderNotFound(ctx) {
  return h('section', null,
    h('h1', null, ctx.t('notfound.title')),
    h('a', { class: 'btn', href: '#/' }, ctx.t('notfound.back')));
}

export function renderError(ctx, error) {
  return h('section', null,
    h('h1', null, ctx.t('error.title')),
    h('p', { role: 'alert' }, ctx.t(error && error.name === 'DataLoadError' ? 'error.data' : 'error.title')),
    h('button', { type: 'button', class: 'btn', onclick: () => ctx.rerender() }, ctx.t('action.retry')),
    h('a', { class: 'btn', href: '#/' }, ctx.t('notfound.back')));
}
