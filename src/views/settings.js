import { h } from '../dom.js';

function download(name, text) {
  const url = URL.createObjectURL(new Blob([text], { type: 'application/json' }));
  const a = h('a', { href: url, download: name });
  document.body.append(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function renderSettings(ctx) {
  const { t, store } = ctx;
  const s = store.settings.get();
  const message = h('div', { class: 'import-message', 'aria-live': 'polite' });

  const select = (name, label, options, value, onchange) => h('div', { class: 'field' },
    h('label', { for: `s-${name}` }, label),
    h('select', { name, id: `s-${name}`, onchange: (e) => onchange(e.target.value) },
      ...options.map(([v, text]) => h('option', { value: String(v), selected: String(v) === String(value) }, text))));

  const file = h('input', { type: 'file', id: 'import-file', accept: 'application/json,.json', onchange: onImport });

  async function onImport() {
    const chosen = file.files && file.files[0];
    if (!chosen) return;
    const text = await chosen.text();
    file.value = '';
    if (!window.confirm(t('settings.confirmImport'))) return;
    const result = store.importJSON(text);
    if (result.ok) {
      const next = store.settings.get();
      if (next.lang) ctx.lang = next.lang;
      ctx.applySettings();
      message.replaceChildren(h('p', { class: 'notice import-ok', role: 'status' }, t('settings.importOk', { n: result.imported })));
    } else {
      message.replaceChildren(h('p', { class: 'notice import-error', role: 'alert' }, `${t('settings.importFailed')} ${result.error}`));
    }
  }

  return h('section', { class: 'settings' },
    h('h1', null, t('nav.settings')),
    store.persistent ? null : h('p', { class: 'notice', role: 'status' }, t('notice.unsaved')),
    select('lang', t('settings.language'), [['en', 'English'], ['ro', 'Română']], ctx.lang, (v) => { ctx.setLang(v); ctx.rerender(); }),
    select('theme', t('settings.theme'), [['auto', t('settings.theme.auto')], ['light', t('settings.theme.light')], ['dark', t('settings.theme.dark')]], s.theme,
      (v) => { store.settings.set({ theme: v }); ctx.applySettings(); }),
    select('textSize', t('settings.textSize'), [0, 1, 2, 3].map((n) => [n, t(`settings.textSize.${n}`)]), s.textSize,
      (v) => { store.settings.set({ textSize: Number(v) }); ctx.applySettings(); }),
    h('h2', null, t('settings.data')),
    h('div', { class: 'actions' },
      h('button', { type: 'button', id: 'export', class: 'btn', onclick: () => download(`cyberquiz-progress-${new Date().toISOString().slice(0, 10)}.json`, store.exportJSON()) }, t('settings.export'))),
    h('div', { class: 'field' }, h('label', { for: 'import-file' }, t('settings.import')), file),
    message,
    h('div', { class: 'actions' },
      h('button', { type: 'button', id: 'reset', class: 'btn', onclick: () => {
        if (!window.confirm(t('settings.confirmReset'))) return;
        store.reset();
        ctx.applySettings();
        ctx.rerender();
      } }, t('settings.reset'))));
}
