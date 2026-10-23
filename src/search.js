export function searchQuestions(questions, query) {
  const needle = String(query || '').trim().toLowerCase();
  if (!needle) return [];
  const scored = [];
  for (const q of questions) {
    let score = 0;
    if ((q.tags || []).some((tag) => tag.toLowerCase().includes(needle))) score = 3;
    else if (String(q.subtopic || '').toLowerCase().includes(needle)) score = 2;
    else if (String(q.question || '').toLowerCase().includes(needle)) score = 1;
    if (score > 0) scored.push({ q, score });
  }
  scored.sort((a, b) => b.score - a.score || a.q.id.localeCompare(b.q.id));
  return scored.map((s) => s.q);
}
