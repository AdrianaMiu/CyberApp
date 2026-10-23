export const STRINGS = {
  ro: {
    'app.title': 'CyberQuiz',
    'results.score': 'Scor: {n} / {total}',
  },
  en: {
    'app.title': 'CyberQuiz',
    'results.score': 'Score: {n} / {total}',
  },
};

export function t(lang, key, vars) {
  const table = STRINGS[lang] || STRINGS.en;
  const template = table[key];
  if (template === undefined) return key;
  return template.replace(/\{(\w+)\}/g, (m, name) => (vars && name in vars ? String(vars[name]) : m));
}

export function detectLang(navigatorLanguage) {
  return typeof navigatorLanguage === 'string' && navigatorLanguage.toLowerCase().startsWith('ro') ? 'ro' : 'en';
}
