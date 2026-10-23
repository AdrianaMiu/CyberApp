const sameSet = (a, b) => a.length === b.length && a.every((x) => b.includes(x)) && new Set(a).size === a.length;

export function isCorrect(q, response) {
  if (response === null || response === undefined) return false;
  switch (q.type) {
    case 'single':
    case 'multi':
    case 'truefalse':
    case 'log-analysis':
      return Array.isArray(response) && sameSet(response, q.answer);
    case 'ordering':
      return Array.isArray(response) && response.length === q.answer.length && response.every((id, i) => id === q.answer[i]);
    case 'matching': {
      if (typeof response !== 'object' || Array.isArray(response)) return false;
      const keys = Object.keys(q.answer);
      return Object.keys(response).length === keys.length && keys.every((k) => response[k] === q.answer[k]);
    }
    case 'open':
      return response === 'got';
    default:
      return false;
  }
}
