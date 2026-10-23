import { DATA_BASE } from './config.js';

export class DataLoadError extends Error {
  constructor(file, reason) {
    super(`Could not load ${file}: ${reason}`);
    this.name = 'DataLoadError';
    this.file = file;
  }
}

export function createLoader({ fetchFn, base = DATA_BASE, includeUnreviewed = false } = {}) {
  const doFetch = fetchFn || ((url, opts) => globalThis.fetch(url, opts));
  const memo = new Map();

  async function getJson(file, query, opts) {
    let res;
    try {
      res = await doFetch(`${base}${file}${query}`, opts);
    } catch (e) {
      throw new DataLoadError(file, e.message || 'network error');
    }
    if (!res.ok) throw new DataLoadError(file, `HTTP ${res.status}`);
    try {
      return await res.json();
    } catch (e) {
      throw new DataLoadError(file, 'invalid JSON');
    }
  }

  function once(key, make) {
    if (!memo.has(key)) {
      memo.set(key, make().catch((e) => {
        memo.delete(key);
        throw e;
      }));
    }
    return memo.get(key);
  }

  const loadIndex = () => once('index', () => getJson('index.json', '', { cache: 'no-cache' }));

  async function loadDomain(id) {
    return once(`domain:${id}`, async () => {
      const index = await loadIndex();
      const entry = (index.domains || []).find((d) => d.id === id);
      if (!entry) return [];
      const data = await getJson(entry.file, `?v=${encodeURIComponent(index.bankVersion)}`);
      return (data.questions || []).filter((q) => q.disputed !== true && (includeUnreviewed || q.reviewed === true));
    });
  }

  async function loadAll() {
    const index = await loadIndex();
    const lists = await Promise.all((index.domains || []).map((d) => loadDomain(d.id)));
    return lists.flat();
  }

  async function loadScenarios() {
    return once('scenarios', async () => {
      const index = await loadIndex();
      const file = index.scenarios && index.scenarios.file;
      if (!file) return [];
      const data = await getJson(file, `?v=${encodeURIComponent(index.bankVersion)}`);
      return data.scenarios || [];
    });
  }

  return { loadIndex, loadDomain, loadAll, loadScenarios };
}
