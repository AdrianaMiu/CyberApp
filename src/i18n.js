export const STRINGS = {
  ro: {
    'app.title': 'CyberQuiz',
    'app.loading': 'Se încarcă…',
    'results.score': 'Scor: {n} / {total}',
    'home.tagline': 'Exersează pentru interviuri SOC, DLP și răspuns la incidente.',
    'home.empty': 'Banca de întrebări este încă goală.',
    'nav.modes': 'Moduri de lucru',
    'nav.more': 'Mai mult',
    'nav.home': 'Acasă',
    'nav.stats': 'Statistici',
    'nav.search': 'Căutare',
    'nav.settings': 'Setări',
    'mode.practice': 'Exersare',
    'mode.practice.desc': 'Alegi domeniile și primești explicația după fiecare răspuns.',
    'mode.exam': 'Examen',
    'mode.exam.desc': 'Simulare cronometrată, cu raport pe domenii la final.',
    'mode.scenarios': 'Scenarii',
    'mode.scenarios.desc': 'Un caz real și întrebări înlănțuite.',
    'mode.review': 'Recapitulare',
    'mode.review.desc': 'Întrebările greșite sau marcate, reluate la intervale.',
    'mode.review.due': '{n} de reluat acum',
    'notice.unsaved': 'Progresul nu poate fi salvat în acest browser și se va pierde la închidere.',
    'action.retry': 'Încearcă din nou',
    'error.title': 'Ceva nu a mers',
    'error.data': 'Nu am putut încărca întrebările. Verifică conexiunea și încearcă din nou.',
    'notfound.title': 'Pagină negăsită',
    'notfound.back': 'Înapoi acasă',
  },
  en: {
    'app.title': 'CyberQuiz',
    'app.loading': 'Loading…',
    'results.score': 'Score: {n} / {total}',
    'home.tagline': 'Train for SOC, DLP and incident response interviews.',
    'home.empty': 'The question bank is still empty.',
    'nav.modes': 'Study modes',
    'nav.more': 'More',
    'nav.home': 'Home',
    'nav.stats': 'Statistics',
    'nav.search': 'Search',
    'nav.settings': 'Settings',
    'mode.practice': 'Practice',
    'mode.practice.desc': 'Pick domains and get an explanation after every answer.',
    'mode.exam': 'Exam',
    'mode.exam.desc': 'Timed simulation with a per-domain report at the end.',
    'mode.scenarios': 'Scenarios',
    'mode.scenarios.desc': 'One realistic case with chained questions.',
    'mode.review': 'Review',
    'mode.review.desc': 'Missed or flagged questions, repeated at intervals.',
    'mode.review.due': '{n} due now',
    'notice.unsaved': 'Progress cannot be saved in this browser and will be lost when you close it.',
    'action.retry': 'Try again',
    'error.title': 'Something went wrong',
    'error.data': 'Could not load the questions. Check your connection and try again.',
    'notfound.title': 'Page not found',
    'notfound.back': 'Back to home',
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
