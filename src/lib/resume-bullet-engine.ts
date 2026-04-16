const ACTION_VERBS = new Set([
  'accelerated',
  'achieved',
  'analyzed',
  'automated',
  'built',
  'collaborated',
  'created',
  'decreased',
  'delivered',
  'designed',
  'drove',
  'enhanced',
  'established',
  'executed',
  'implemented',
  'improved',
  'increased',
  'initiated',
  'launched',
  'led',
  'managed',
  'optimized',
  'organized',
  'owned',
  'reduced',
  'resolved',
  'scaled',
  'streamlined',
]);

const WEAK_LEADERS = [
  'responsible for',
  'worked on',
  'helped with',
  'helped',
  'assisted with',
  'assisted',
  'involved in',
];

const METRIC_PATTERN = /(\d+([.,]\d+)?\s?%|\d+[xX]|\$\s?\d+[kKmM]?|₹\s?\d+[kKmM]?|\d+\s?(ms|s|sec|hours?|days?|weeks?|months?|years?|users?|clients?|customers?|tickets?|requests?|records?|bugs?))/;
const CONTEXT_CONNECTOR_PATTERN = /\b(by|using|through|via|with|across|to)\b/i;

export type BulletIssueCode =
  | 'too_short'
  | 'missing_action_verb'
  | 'missing_task_context'
  | 'missing_impact_metric'
  | 'weak_leading_phrase';

export interface BulletValidationResult {
  bullet: string;
  isValid: boolean;
  score: number; // 0-100
  issues: BulletIssueCode[];
  suggestions: string[];
}

export interface BulletEnhancementResult {
  original: string;
  enhanced: string;
  changed: boolean;
  appliedFixes: string[];
}

function normalizeWhitespace(text: string): string {
  return text.replace(/\s+/g, ' ').trim();
}

function startsWithActionVerb(text: string): boolean {
  const firstWord = text.toLowerCase().match(/^[a-z]+/)?.[0];
  return firstWord ? ACTION_VERBS.has(firstWord) : false;
}

function hasWeakLeadingPhrase(text: string): boolean {
  const lower = text.toLowerCase();
  return WEAK_LEADERS.some((phrase) => lower.startsWith(`${phrase} `) || lower === phrase);
}

function stripWeakLeadingPhrase(text: string): string {
  let result = text;
  for (const phrase of WEAK_LEADERS) {
    const matcher = new RegExp(`^${phrase}\\s+`, 'i');
    if (matcher.test(result)) {
      result = result.replace(matcher, '');
      break;
    }
  }
  return normalizeWhitespace(result);
}

function ensureSentencePunctuation(text: string): string {
  return /[.!?]$/.test(text) ? text : `${text}.`;
}

/**
 * Validates one resume bullet against the expected hiring-focused pattern:
 * Action Verb + Task Context + Impact Metric.
 */
export function validateBullet(bullet: string): BulletValidationResult {
  const normalized = normalizeWhitespace(bullet);
  const issues: BulletIssueCode[] = [];
  const suggestions: string[] = [];

  const wordCount = normalized.split(' ').filter(Boolean).length;
  const actionVerbPresent = startsWithActionVerb(normalized);
  const taskContextPresent = CONTEXT_CONNECTOR_PATTERN.test(normalized);
  const impactMetricPresent = METRIC_PATTERN.test(normalized);
  const weakLeaderPresent = hasWeakLeadingPhrase(normalized);

  if (wordCount < 8) {
    issues.push('too_short');
    suggestions.push('Expand this bullet with concrete task context and outcome details.');
  }
  if (!actionVerbPresent) {
    issues.push('missing_action_verb');
    suggestions.push('Start with a strong action verb (e.g., Improved, Built, Reduced, Led).');
  }
  if (!taskContextPresent) {
    issues.push('missing_task_context');
    suggestions.push('Add execution context using words like "by", "using", or "through".');
  }
  if (!impactMetricPresent) {
    issues.push('missing_impact_metric');
    suggestions.push('Add measurable impact (e.g., %, time saved, users reached, cost reduced).');
  }
  if (weakLeaderPresent) {
    issues.push('weak_leading_phrase');
    suggestions.push('Avoid weak starters like "Responsible for" and use direct ownership verbs.');
  }

  const score = Math.max(0, 100 - issues.length * 20 - (wordCount < 8 ? 10 : 0));

  return {
    bullet: normalized,
    isValid: issues.length === 0,
    score,
    issues,
    suggestions,
  };
}

export function validateBullets(bullets: string[]): BulletValidationResult[] {
  return bullets.map(validateBullet);
}

/**
 * Enhances weak bullets without inventing fake numbers.
 * If a metric is missing, it inserts a measurable placeholder phrase.
 */
export function enhanceWeakBullet(bullet: string): BulletEnhancementResult {
  const original = normalizeWhitespace(bullet);
  if (!original) {
    return {
      original,
      enhanced: original,
      changed: false,
      appliedFixes: [],
    };
  }

  let enhanced = original;
  const appliedFixes: string[] = [];

  if (hasWeakLeadingPhrase(enhanced)) {
    enhanced = stripWeakLeadingPhrase(enhanced);
    appliedFixes.push('removed_weak_leading_phrase');
  }

  if (!startsWithActionVerb(enhanced)) {
    enhanced = `Delivered ${enhanced.charAt(0).toLowerCase()}${enhanced.slice(1)}`;
    appliedFixes.push('added_action_verb_prefix');
  }

  if (!CONTEXT_CONNECTOR_PATTERN.test(enhanced)) {
    enhanced = `${enhanced} by improving process execution`;
    appliedFixes.push('added_task_context');
  }

  if (!METRIC_PATTERN.test(enhanced)) {
    enhanced = `${enhanced}, resulting in measurable gains (for example: reduced turnaround time by X%).`;
    appliedFixes.push('added_metric_placeholder');
  }

  enhanced = ensureSentencePunctuation(normalizeWhitespace(enhanced));

  return {
    original,
    enhanced,
    changed: enhanced !== original,
    appliedFixes,
  };
}

