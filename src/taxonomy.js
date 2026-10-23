export const DOMAINS = [
  { id: 'dlp', weight: 18, group: 'data' },
  { id: 'incident-response', weight: 20, group: 'ops' },
  { id: 'siem', weight: 14, group: 'ops' },
  { id: 'cloud-security', weight: 10, group: 'data' },
  { id: 'windows-forensics', weight: 8, group: 'forensics' },
  { id: 'fundamentals', weight: 8, group: 'base' },
  { id: 'soar', weight: 7, group: 'ops' },
  { id: 'network-forensics', weight: 6, group: 'forensics' },
  { id: 'ai-security', weight: 5, group: 'data' },
  { id: 'linux-forensics', weight: 4, group: 'forensics' },
];

export const DOMAIN_IDS = DOMAINS.map((d) => d.id);
export const LAYERS = ['L1', 'L2', 'L3', 'Engineering', 'Governance'];
export const DIFFICULTIES = ['basic', 'intermediate', 'advanced'];
export const TYPES = ['single', 'multi', 'truefalse', 'ordering', 'matching', 'log-analysis', 'open'];
export const SECTORS = { finance: 40, 'mssp-consulting': 20, 'tech-vendor': 15, general: 25 };
export const SOURCE_TYPES = ['job-description', 'scenario-derived', 'framework', 'tool-docs', 'original'];
