import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { DOMAINS, DOMAIN_IDS, LAYERS, DIFFICULTIES, TYPES, SECTORS, SOURCE_TYPES } from '../src/taxonomy.js';

const isObj = (v) => v !== null && typeof v === 'object' && !Array.isArray(v);
const isStr = (v) => typeof v === 'string' && v.trim() !== '';
const BANNED_OPTIONS = ['all of the above', 'toate de mai sus'];

function sameSet(a, b) {
  return a.length === b.length && a.every((x) => b.includes(x));
}

function checkEnum(errs, q, field, allowed) {
  if (!allowed.includes(q[field])) errs.push(`${field} "${q[field]}" is not one of ${allowed.join(', ')}`);
}

function checkOptionList(errs, list, label) {
  if (!Array.isArray(list) || list.length < 2) {
    errs.push(`${label} must be a list of at least 2 items`);
    return [];
  }
  const ids = [];
  for (const o of list) {
    if (!isObj(o) || !isStr(o.id) || !isStr(o.text)) {
      errs.push(`${label} items need non-empty id and text`);
      continue;
    }
    if (ids.includes(o.id)) errs.push(`${label} has duplicate id "${o.id}"`);
    ids.push(o.id);
    if (BANNED_OPTIONS.includes(o.text.trim().toLowerCase())) errs.push(`${label} contains an "all of the above" option`);
  }
  return ids;
}

function checkDistractors(errs, d, expectedKeys) {
  if (!isObj(d)) {
    errs.push('explanation.distractors must be an object');
    return;
  }
  const keys = Object.keys(d);
  if (!sameSet(keys, expectedKeys)) {
    errs.push(`explanation.distractors keys [${keys}] must equal [${expectedKeys}]`);
  }
  for (const k of keys) if (!isStr(d[k])) errs.push(`explanation.distractors.${k} must be a non-empty string`);
}

function checkChoice(errs, q) {
  const ids = checkOptionList(errs, q.options, 'options');
  if (q.type === 'truefalse') {
    if (!(ids.length === 2 && ids[0] === 'a' && ids[1] === 'b')) errs.push('options for truefalse must be exactly ids a and b');
  }
  const answer = q.answer;
  if (!Array.isArray(answer) || answer.length === 0 || !answer.every((a) => ids.includes(a)) || new Set(answer).size !== answer.length) {
    errs.push('answer must be a non-empty list of distinct option ids');
    return;
  }
  if ((q.type === 'single' || q.type === 'truefalse') && answer.length !== 1) errs.push(`answer must have exactly one id for ${q.type}`);
  checkDistractors(errs, q.explanation?.distractors, ids.filter((i) => !answer.includes(i)));
  if (q.type === 'log-analysis' && !isStr(q.context)) errs.push('context is required for log-analysis');
}

function checkOrdering(errs, q) {
  const ids = checkOptionList(errs, q.options, 'options');
  if (!Array.isArray(q.answer) || !sameSet(q.answer, ids) || new Set(q.answer).size !== ids.length) {
    errs.push('answer must be a permutation of all option ids');
  } else if (q.answer.every((id, i) => id === ids[i])) {
    errs.push('options are already in the correct order; shuffle them so Submit alone cannot pass');
  }
  checkDistractors(errs, q.explanation?.distractors, []);
}

function checkMatching(errs, q) {
  const o = q.options;
  if (!isObj(o)) {
    errs.push('options must be {left, right} for matching');
    return;
  }
  const left = checkOptionList(errs, o.left, 'options.left');
  const right = checkOptionList(errs, o.right, 'options.right');
  if (right.length < left.length) errs.push('options.right must have at least as many items as options.left');
  const a = q.answer;
  if (!isObj(a)) {
    errs.push('answer must be an object {leftId: rightId} for matching');
    return;
  }
  const keys = Object.keys(a);
  if (!sameSet(keys, left)) errs.push('answer must map every left id');
  const vals = Object.values(a);
  if (!vals.every((v) => right.includes(v))) errs.push('answer references an unknown right id');
  if (new Set(vals).size !== vals.length) errs.push('answer maps two left ids to the same right id');
  const d = q.explanation?.distractors;
  if (!isObj(d)) errs.push('explanation.distractors must be an object');
  else if (!Object.keys(d).every((k) => left.includes(k))) errs.push('explanation.distractors keys must be left ids');
}

function checkOpen(errs, q) {
  if (!isStr(q.scenario_id)) errs.push('open questions require a scenario_id');
  if (q.options !== undefined) errs.push('options must be absent for open questions');
  if (!Array.isArray(q.answer) || q.answer.length !== 0) errs.push('answer must be [] for open questions');
  if (!Array.isArray(q.rubric) || q.rubric.length < 3 || q.rubric.length > 6 || !q.rubric.every(isStr)) {
    errs.push('rubric must list 3 to 6 non-empty points for open questions');
  }
  checkDistractors(errs, q.explanation?.distractors, []);
}

export function validateQuestion(q) {
  const id = isObj(q) && isStr(q.id) ? q.id : '?';
  const errs = [];
  if (!isObj(q)) return [`${id}: question must be an object`];

  const idMatch = /^([a-z]+(?:-[a-z]+)*)-\d{4}$/.exec(q.id ?? '');
  if (!idMatch) errs.push('id must look like <domain>-NNNN');
  else if (idMatch[1] !== q.domain) errs.push(`id prefix "${idMatch[1]}" must equal domain "${q.domain}"`);

  checkEnum(errs, q, 'domain', DOMAIN_IDS);
  checkEnum(errs, q, 'layer', LAYERS);
  checkEnum(errs, q, 'sector', Object.keys(SECTORS));
  checkEnum(errs, q, 'difficulty', DIFFICULTIES);
  checkEnum(errs, q, 'type', TYPES);
  checkEnum(errs, q, 'source_type', SOURCE_TYPES);

  if (!isStr(q.subtopic)) errs.push('subtopic is required');
  if (!Array.isArray(q.tags) || !q.tags.every(isStr)) errs.push('tags must be a list of strings');
  if (q.attack !== undefined && !(Array.isArray(q.attack) && q.attack.every((t) => /^T\d{4}(\.\d{3})?$/.test(t)))) {
    errs.push('attack ids must look like T1048 or T1048.003');
  }
  if (!isStr(q.question)) errs.push('question text is required');
  if (q.context !== undefined && typeof q.context !== 'string') errs.push('context must be a string');
  if (q.scenario_id != null && !/^scn-\d{3}$/.test(q.scenario_id)) errs.push('scenario_id must look like scn-NNN');
  if (!Number.isInteger(q.version) || q.version < 1) errs.push('version must be a positive integer');
  if (typeof q.reviewed !== 'boolean') errs.push('reviewed must be a boolean');
  if (q.disputed !== undefined && typeof q.disputed !== 'boolean') errs.push('disputed must be a boolean');

  if (!Array.isArray(q.references) || q.references.length === 0) {
    errs.push('references must contain at least one entry');
  } else {
    for (const r of q.references) {
      if (!isObj(r) || !isStr(r.title)) errs.push('each reference needs a title');
      if (!isObj(r) || typeof r.url !== 'string' || !r.url.startsWith('https://')) errs.push('each reference url must start with https://');
    }
  }

  if (!isObj(q.explanation) || !isStr(q.explanation.correct)) errs.push('explanation.correct is required');
  if (isObj(q.explanation) && q.explanation.interview_angle !== undefined && typeof q.explanation.interview_angle !== 'string') {
    errs.push('explanation.interview_angle must be a string');
  }

  switch (q.type) {
    case 'single':
    case 'multi':
    case 'truefalse':
    case 'log-analysis':
      checkChoice(errs, q);
      break;
    case 'ordering':
      checkOrdering(errs, q);
      break;
    case 'matching':
      checkMatching(errs, q);
      break;
    case 'open':
      checkOpen(errs, q);
      break;
    default:
      break;
  }
  return errs.map((m) => `${id}: ${m}`);
}

export function distribution(questions, key) {
  const counts = {};
  for (const q of questions) counts[q[key]] = (counts[q[key]] || 0) + 1;
  const out = {};
  for (const [k, n] of Object.entries(counts)) out[k] = (n / questions.length) * 100;
  return out;
}

const MIN_ELIGIBLE_PER_DOMAIN = 20;
const isEligible = (q) => q.type !== 'open' && !q.scenario_id;
const fmt = (n) => `${n.toFixed(1)}%`;

function distributionFindings(questions, label) {
  const found = [];
  if (questions.length === 0) return found;
  const byDomain = distribution(questions, 'domain');
  for (const d of DOMAINS) {
    const actual = byDomain[d.id] || 0;
    if (Math.abs(actual - d.weight) > 3) found.push(`${label}: domain ${d.id} is ${fmt(actual)}, target ${d.weight}% (+-3)`);
  }
  const bySector = distribution(questions, 'sector');
  for (const [s, target] of Object.entries(SECTORS)) {
    const actual = bySector[s] || 0;
    if (Math.abs(actual - target) > 5) found.push(`${label}: sector ${s} is ${fmt(actual)}, target ${target}% (+-5)`);
  }
  const byDifficulty = distribution(questions, 'difficulty');
  if ((byDifficulty.intermediate || 0) < 30) found.push(`${label}: intermediate is ${fmt(byDifficulty.intermediate || 0)}, needs at least 30%`);
  if ((byDifficulty.advanced || 0) < 20) found.push(`${label}: advanced is ${fmt(byDifficulty.advanced || 0)}, needs at least 20%`);
  const open = distribution(questions, 'type').open || 0;
  if (open < 3 || open > 7) found.push(`${label}: open share is ${fmt(open)}, expected 3-7%`);
  for (const d of DOMAINS) {
    const n = questions.filter((q) => q.domain === d.id && isEligible(q)).length;
    if (n < MIN_ELIGIBLE_PER_DOMAIN) found.push(`${label}: eligible questions for Practice/Exam: ${d.id} has ${n}, needs ${MIN_ELIGIBLE_PER_DOMAIN}`);
  }
  return found;
}

function checkScenarios(errors, questions, scenarios) {
  const byId = new Map(questions.map((q) => [q.id, q]));
  const referenced = new Map();
  const seen = new Set();
  for (const s of scenarios) {
    const tag = `scenario ${s.id}`;
    if (!/^scn-\d{3}$/.test(s.id ?? '')) errors.push(`${tag}: id must look like scn-NNN`);
    if (seen.has(s.id)) errors.push(`${tag}: duplicate scenario id`);
    seen.add(s.id);
    for (const f of ['title', 'narrative', 'debrief']) if (!isStr(s[f])) errors.push(`${tag}: ${f} is required`);
    if (!Array.isArray(s.artifacts) || !s.artifacts.every(isStr)) errors.push(`${tag}: artifacts must be a list of strings`);
    const ids = Array.isArray(s.questions) ? s.questions : [];
    if (ids.length < 3 || ids.length > 6) errors.push(`${tag}: must chain 3 to 6 questions, has ${ids.length}`);
    for (const qid of ids) {
      const q = byId.get(qid);
      if (!q) errors.push(`${tag}: references missing question ${qid}`);
      else if (q.scenario_id !== s.id) errors.push(`${tag}: question ${qid} has scenario_id ${q.scenario_id}`);
      referenced.set(qid, (referenced.get(qid) || 0) + 1);
    }
  }
  for (const q of questions) {
    if (q.scenario_id && (referenced.get(q.id) || 0) !== 1) {
      errors.push(`scenario ${q.scenario_id}: question ${q.id} must be referenced by exactly one scenario`);
    }
  }
}

export function validateBank({ questions, scenarios, retiredIds, index }, opts = {}) {
  const errors = [];
  const warnings = [];
  const enforce = opts.enforceDistribution ?? questions.length >= (index?.target ?? Infinity);

  const seen = new Set();
  const retired = new Set(retiredIds || []);
  for (const q of questions) {
    errors.push(...validateQuestion(q));
    if (seen.has(q.id)) errors.push(`${q.id}: duplicate question id`);
    seen.add(q.id);
    if (retired.has(q.id)) errors.push(`${q.id}: id is retired and must not be reused`);
  }

  checkScenarios(errors, questions, scenarios || []);

  if (!isStr(index?.bankVersion)) errors.push('index: bankVersion is required');
  const listed = new Set();
  for (const d of index?.domains ?? []) {
    listed.add(d.id);
    const mine = questions.filter((q) => q.domain === d.id);
    const served = mine.filter((q) => q.reviewed === true && q.disputed !== true).length;
    if (d.authored !== mine.length) errors.push(`index: ${d.id} authored is ${d.authored}, files hold ${mine.length}`);
    if (d.served !== served) errors.push(`index: ${d.id} served is ${d.served}, files serve ${served}`);
  }
  for (const q of questions) if (!listed.has(q.domain) && DOMAIN_IDS.includes(q.domain)) errors.push(`index: ${q.id} belongs to domain ${q.domain} which index.json does not list`);
  if (index?.scenarios?.count !== (scenarios || []).length) errors.push(`index: scenarios.count is ${index?.scenarios?.count}, found ${(scenarios || []).length}`);

  const all = distributionFindings(questions, 'distribution');
  (enforce ? errors : warnings).push(...all);
  if (enforce) {
    const served = questions.filter((q) => q.reviewed === true && q.disputed !== true);
    warnings.push(...distributionFindings(served, 'distribution (served subset)'));
  }
  return { errors, warnings };
}

export function loadBank(dir) {
  const errors = [];
  const read = (file, fallback) => {
    try {
      return JSON.parse(fs.readFileSync(path.join(dir, file), 'utf8'));
    } catch (e) {
      errors.push(`${file}: ${e.code === 'ENOENT' ? 'file is missing' : `invalid JSON (${e.message})`}`);
      return fallback;
    }
  };
  const index = read('index.json', { bankVersion: '', target: 800, domains: [], scenarios: { file: 'scenarios.json', count: 0 } });
  const questions = [];
  for (const d of index.domains ?? []) {
    const data = read(d.file, { domain: d.id, questions: [] });
    if (data.domain !== d.id) errors.push(`${d.file}: file declares domain "${data.domain}" but index.json lists "${d.id}"`);
    for (const q of data.questions ?? []) {
      if (q.domain !== d.id) errors.push(`${d.file}: question ${q.id} has domain "${q.domain}", expected "${d.id}"`);
      questions.push(q);
    }
  }
  const scenarios = read(index.scenarios?.file ?? 'scenarios.json', { scenarios: [] }).scenarios ?? [];
  const retiredIds = read('retired-ids.json', []);
  return { input: { questions, scenarios, retiredIds, index }, errors };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const dir = path.resolve(process.argv[2] ?? 'data');
  const loaded = loadBank(dir);
  const result = validateBank(loaded.input);
  const errors = [...loaded.errors, ...result.errors];
  for (const m of result.warnings) console.log(`warning: ${m}`);
  for (const m of errors) console.log(`error: ${m}`);
  console.log(`${loaded.input.questions.length} questions, ${loaded.input.scenarios.length} scenarios: ${errors.length} errors, ${result.warnings.length} warnings`);
  process.exit(errors.length > 0 ? 1 : 0);
}
