import { DOMAIN_IDS, LAYERS, DIFFICULTIES, TYPES, SECTORS, SOURCE_TYPES } from '../src/taxonomy.js';

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
