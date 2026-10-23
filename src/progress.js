import { applyOutcome, isDue, newRecord, answerHash, DAY_MS } from './leitner.js';

const KEY = 'cyberquiz:v1';
const MAX_DAYS = 400;
const DAY_RE = /^\d{4}-\d{2}-\d{2}$/;

const DEFAULT_SETTINGS = { theme: 'auto', textSize: 1 };

function defaultStorage() {
  try {
    return globalThis.localStorage || null;
  } catch (e) {
    return null;
  }
}

function localDay(ms) {
  const d = new Date(ms);
  const p = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

function previousDay(day) {
  const [y, m, d] = day.split('-').map(Number);
  return localDay(new Date(y, m - 1, d - 1, 12).getTime());
}

const isNum = (v) => typeof v === 'number' && Number.isFinite(v);

function validRecord(r) {
  return r !== null && typeof r === 'object'
    && Number.isInteger(r.box) && r.box >= 0 && r.box <= 4
    && (r.due === null || isNum(r.due))
    && isNum(r.attempts) && r.attempts >= 0 && isNum(r.correct) && r.correct >= 0
    && (r.lastCorrect === null || typeof r.lastCorrect === 'boolean')
    && typeof r.flagged === 'boolean' && typeof r.hash === 'string' && isNum(r.last);
}

function cleanSettings(patch) {
  const out = {};
  if (['auto', 'light', 'dark'].includes(patch.theme)) out.theme = patch.theme;
  if (Number.isInteger(patch.textSize) && patch.textSize >= 0 && patch.textSize <= 3) out.textSize = patch.textSize;
  if (patch.lang === 'ro' || patch.lang === 'en') out.lang = patch.lang;
  if (typeof patch.seenBankVersion === 'string') out.seenBankVersion = patch.seenBankVersion;
  return out;
}

function validState(s) {
  return s !== null && typeof s === 'object'
    && s.records !== null && typeof s.records === 'object' && !Array.isArray(s.records)
    && Object.values(s.records).every(validRecord)
    && Array.isArray(s.days) && s.days.every((d) => typeof d === 'string' && DAY_RE.test(d))
    && (s.settings === undefined || (s.settings !== null && typeof s.settings === 'object'));
}

export function createStore({ storage, now = Date.now } = {}) {
  const backend = storage === undefined ? defaultStorage() : storage;
  let persistent = Boolean(backend);
  let state = { records: {}, days: [], settings: { ...DEFAULT_SETTINGS } };

  function load() {
    if (!backend) return;
    try {
      const raw = backend.getItem(KEY);
      if (raw === null || raw === undefined) return;
      const parsed = JSON.parse(raw);
      if (parsed && parsed.schema === 1 && validState(parsed)) {
        state = { records: parsed.records, days: parsed.days, settings: { ...DEFAULT_SETTINGS, ...cleanSettings(parsed.settings || {}) } };
      }
    } catch (e) {
      if (!(e instanceof SyntaxError)) persistent = false;
    }
  }

  function save() {
    if (!backend) return;
    try {
      backend.setItem(KEY, JSON.stringify({ schema: 1, ...state }));
    } catch (e) {
      persistent = false;
    }
  }

  function touchDay(ms) {
    const day = localDay(ms);
    if (state.days[state.days.length - 1] !== day) {
      state.days.push(day);
      if (state.days.length > MAX_DAYS) state.days.shift();
    }
  }

  load();

  const store = {
    get persistent() {
      return persistent;
    },
    recordAnswer(q, correct, o = {}) {
      const existing = state.records[q.id];
      const flagged = o.flagged !== undefined ? o.flagged : Boolean(existing && existing.flagged);
      const t = now();
      const rec = applyOutcome(existing, { correct, flagged, now: t, hash: answerHash(q) });
      state.records[q.id] = rec;
      touchDay(t);
      save();
      return rec;
    },
    setFlag(q, flagged) {
      const hash = answerHash(q);
      const existing = state.records[q.id];
      const rec = existing && existing.hash === hash ? { ...existing } : newRecord(hash);
      rec.flagged = Boolean(flagged);
      if (rec.flagged && (rec.box === 0 || rec.box === 4)) {
        rec.box = 1;
        rec.due = now() + DAY_MS;
      }
      state.records[q.id] = rec;
      save();
    },
    get: (id) => state.records[id],
    dueIds: (at = now()) => Object.keys(state.records).filter((id) => isDue(state.records[id], at)),
    missedIds: () => Object.keys(state.records).filter((id) => state.records[id].lastCorrect === false),
    flaggedIds: () => Object.keys(state.records).filter((id) => state.records[id].flagged),
    stats(questions) {
      const byDomain = {};
      const byDifficulty = {};
      const add = (bucket, key, rec) => {
        const b = (bucket[key] = bucket[key] || { answered: 0, correct: 0, pct: 0 });
        b.answered += rec.attempts;
        b.correct += rec.correct;
        b.pct = Math.round((b.correct / b.answered) * 100);
      };
      for (const q of questions) {
        const rec = state.records[q.id];
        if (!rec || rec.attempts === 0) continue;
        add(byDomain, q.domain, rec);
        add(byDifficulty, q.difficulty, rec);
      }
      return { byDomain, byDifficulty };
    },
    streak(at = now()) {
      const days = new Set(state.days);
      let day = localDay(at);
      if (!days.has(day)) day = previousDay(day);
      let n = 0;
      while (days.has(day)) {
        n += 1;
        day = previousDay(day);
      }
      return n;
    },
    settings: {
      get: () => ({ ...state.settings }),
      set(patch) {
        state.settings = { ...state.settings, ...cleanSettings(patch) };
        save();
      },
    },
    exportJSON() {
      return JSON.stringify({ app: 'cyberquiz', schema: 1, exportedAt: new Date(now()).toISOString(), records: state.records, days: state.days, settings: state.settings });
    },
    importJSON(text) {
      let data;
      try {
        data = JSON.parse(text);
      } catch (e) {
        return { ok: false, error: 'The file is not valid JSON.' };
      }
      if (!data || data.app !== 'cyberquiz') return { ok: false, error: 'This is not a CyberQuiz export.' };
      if (data.schema !== 1) return { ok: false, error: 'Unsupported export version.' };
      if (!validState(data)) return { ok: false, error: 'The export contains malformed progress data.' };
      state = { records: data.records, days: data.days.slice(-MAX_DAYS), settings: { ...DEFAULT_SETTINGS, ...cleanSettings(data.settings || {}) } };
      save();
      return { ok: true, imported: Object.keys(state.records).length };
    },
    reset() {
      state = { records: {}, days: [], settings: { ...DEFAULT_SETTINGS } };
      if (backend) {
        try {
          backend.removeItem(KEY);
        } catch (e) {
          persistent = false;
        }
      }
    },
  };
  return store;
}
