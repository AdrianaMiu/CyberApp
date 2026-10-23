const SIMPLE = ['practice', 'exam', 'scenarios', 'review', 'stats', 'settings', 'search'];

export function parseRoute(hash) {
  const raw = (hash || '').replace(/^#/, '');
  const [pathPart, query = ''] = raw.split('?');
  const segs = pathPart.split('/').filter(Boolean);
  const params = Object.fromEntries(new URLSearchParams(query));
  if (segs.length === 0) return { name: 'home', params: {} };
  if (segs.length === 1 && SIMPLE.includes(segs[0])) return { name: segs[0], params };
  if (segs.length === 2 && segs[0] === 'scenarios') return { name: 'scenario', params: { ...params, id: segs[1] } };
  return { name: 'notfound', params: {} };
}
