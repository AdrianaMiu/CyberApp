import { DATA_BASE } from './config.js';

export function dataUrls(index) {
  const version = encodeURIComponent(index.bankVersion);
  const urls = [`${DATA_BASE}index.json`, ...(index.domains || []).map((d) => `${DATA_BASE}${d.file}?v=${version}`)];
  if (index.scenarios && index.scenarios.file) urls.push(`${DATA_BASE}${index.scenarios.file}?v=${version}`);
  return urls;
}

/** Registers the service worker, warms the data cache and reports shell/content updates through onUpdate(kind). */
export async function registerPwa({ loader, store, onUpdate, nav = navigator }) {
  if (!('serviceWorker' in nav)) return;
  const reg = await nav.serviceWorker.register('sw.js');

  const notifyShell = () => {
    if (reg.waiting && nav.serviceWorker.controller) onUpdate('shell');
  };
  reg.addEventListener('updatefound', () => {
    const worker = reg.installing;
    if (worker) worker.addEventListener('statechange', () => { if (worker.state === 'installed') notifyShell(); });
  });
  notifyShell();

  const index = await loader.loadIndex();
  const seen = store.settings.get().seenBankVersion;
  if (seen && seen !== index.bankVersion) onUpdate('content');
  store.settings.set({ seenBankVersion: index.bankVersion });

  const ready = await nav.serviceWorker.ready;
  const urls = dataUrls(index);
  if (ready.active) {
    ready.active.postMessage({ type: 'precache-data', urls });
    ready.active.postMessage({ type: 'prune-data', keep: urls });
  }
}

/** Activates a waiting worker, then reloads once it controls the page. */
export function applyShellUpdate(nav = navigator, reload = () => location.reload()) {
  nav.serviceWorker.addEventListener('controllerchange', reload, { once: true });
  nav.serviceWorker.getRegistration().then((reg) => {
    if (reg && reg.waiting) reg.waiting.postMessage({ type: 'skip-waiting' });
    else reload();
  });
}
