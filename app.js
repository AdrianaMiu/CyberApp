import { createStore } from './src/progress.js';
import { createLoader } from './src/data.js';
import { parseRoute } from './src/router.js';
import { t as translate, detectLang } from './src/i18n.js';
import { renderHome } from './src/views/home.js';
import { renderPractice } from './src/views/practice.js';
import { renderExam } from './src/views/exam.js';
import { renderScenarios } from './src/views/scenarios.js';
import { renderReview } from './src/views/review.js';
import { renderStats } from './src/views/stats.js';
import { renderSettings } from './src/views/settings.js';
import { renderSearch } from './src/views/search.js';
import { registerPwa, applyShellUpdate } from './src/pwa.js';
import { h } from './src/dom.js';
import { renderNotFound, renderError } from './src/views/notfound.js';

const TEXT_SCALES = [0.9, 1, 1.15, 1.3];

const store = createStore();
const loader = createLoader();
const main = document.getElementById('app');
const live = document.getElementById('live');

const ctx = {
  store,
  loader,
  lang: store.settings.get().lang || detectLang(navigator.language),
  t: (key, vars) => translate(ctx.lang, key, vars),
  go: (hash) => { location.hash = hash; },
  announce(text) {
    live.textContent = '';
    requestAnimationFrame(() => { live.textContent = text; });
  },
  rerender: () => render(),
  applySettings() {
    const s = store.settings.get();
    const root = document.documentElement;
    if (s.theme === 'auto') root.removeAttribute('data-theme');
    else root.setAttribute('data-theme', s.theme);
    root.style.setProperty('--text-scale', String(TEXT_SCALES[s.textSize] ?? 1));
    root.setAttribute('lang', ctx.lang);
    document.title = translate(ctx.lang, 'app.title');
  },
  setLang(lang) {
    ctx.lang = lang;
    store.settings.set({ lang });
    ctx.applySettings();
  },
};

const VIEWS = {
  home: renderHome,
  practice: renderPractice,
  exam: renderExam,
  scenarios: renderScenarios,
  scenario: renderScenarios,
  review: renderReview,
  stats: renderStats,
  settings: renderSettings,
  search: renderSearch,
  notfound: renderNotFound,
};

let token = 0;
async function render() {
  const mine = ++token;
  const route = parseRoute(location.hash);
  const view = VIEWS[route.name] || renderNotFound;
  let el;
  try {
    el = await view(ctx, route);
  } catch (e) {
    el = renderError(ctx, e);
  }
  if (mine !== token) return;
  main.replaceChildren(el);
  const heading = el.querySelector('h1');
  if (heading) {
    heading.setAttribute('tabindex', '-1');
    heading.focus({ preventScroll: true });
  }
  window.scrollTo(0, 0);
}

function showBanner(kind) {
  if (document.querySelector('.banner')) return;
  const onReload = kind === 'shell' ? () => applyShellUpdate() : () => location.reload();
  document.body.prepend(h('div', { class: 'banner', role: 'status', dataset: { kind } },
    h('span', null, ctx.t(`banner.${kind}`)),
    h('button', { type: 'button', class: 'btn primary', onclick: onReload }, ctx.t('banner.reload'))));
}

ctx.applySettings();
window.addEventListener('hashchange', render);
render();
registerPwa({ loader, store, onUpdate: showBanner }).catch(() => {});
