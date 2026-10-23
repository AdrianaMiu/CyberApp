// GitHub repository that receives "Report a problem" issues; leave empty to hide the link.
export const REPO_SLUG = 'AdrianaMiu/CyberApp';
export const DATA_BASE = 'data/';
export const PER_QUESTION_MS = 90000;

export function reportIssueUrl(slug, q) {
  if (!slug) return null;
  const title = encodeURIComponent(`Report ${q.id}`);
  const body = encodeURIComponent(`Question ${q.id}\n\n${q.question}\n\nWhat is wrong:\n`);
  return `https://github.com/${slug}/issues/new?title=${title}&body=${body}`;
}
