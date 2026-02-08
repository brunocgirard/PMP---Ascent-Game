/**
 * 03 - Distribution Compliance Tests
 * Validates domain weights, difficulty spread, per-task balance, and methodology mix.
 */
const { loadQuizBank, ALL_TASKS } = require('./lib/loader');

function pct(count, total) {
  return total === 0 ? 0 : (count / total) * 100;
}

function checkRange(reporter, label, actual, low, high, margin = 2) {
  const rounded = Math.round(actual * 10) / 10;
  if (actual >= low && actual <= high) {
    reporter.pass(`${label}: ${rounded}% (target ${low}-${high}%)`);
  } else if (actual >= low - margin && actual <= high + margin) {
    reporter.warn(`${label}: ${rounded}% (target ${low}-${high}%, within ${margin}% margin)`);
  } else {
    reporter.fail(`${label}: ${rounded}% (target ${low}-${high}%)`);
  }
}

async function run(reporter) {
  const questions = loadQuizBank();
  const total = questions.length;

  // --- Domain Weight Distribution ---
  reporter.section('Domain Weight Distribution');

  const domainCounts = { people: 0, process: 0, business: 0 };
  for (const q of questions) {
    const d = (q.domain || '').toLowerCase();
    if (d in domainCounts) domainCounts[d]++;
  }

  checkRange(reporter, 'People', pct(domainCounts.people, total), 28, 38);
  checkRange(reporter, 'Process', pct(domainCounts.process, total), 36, 46);
  checkRange(reporter, 'Business', pct(domainCounts.business, total), 21, 31);

  // --- Difficulty Distribution ---
  reporter.section('Difficulty Distribution');

  const diffCounts = { easy: 0, medium: 0, hard: 0 };
  for (const q of questions) {
    const d = (q.difficulty || '').toLowerCase();
    if (d in diffCounts) diffCounts[d]++;
  }

  checkRange(reporter, 'Easy', pct(diffCounts.easy, total), 20, 35);
  checkRange(reporter, 'Medium', pct(diffCounts.medium, total), 35, 50);
  checkRange(reporter, 'Hard', pct(diffCounts.hard, total), 20, 35);

  // --- Per-Task Balance ---
  reporter.section('Per-Task Balance');

  const taskCounts = {};
  for (const t of ALL_TASKS) taskCounts[t] = 0;
  for (const q of questions) {
    const t = q.taskId;
    if (t && t in taskCounts) taskCounts[t]++;
  }

  const counts = Object.values(taskCounts);
  const avg = counts.reduce((a, b) => a + b, 0) / counts.length;
  const min = Math.min(...counts);
  const max = Math.max(...counts);
  const minTask = Object.keys(taskCounts).find(t => taskCounts[t] === min);
  const maxTask = Object.keys(taskCounts).find(t => taskCounts[t] === max);

  if (max > 3 * avg) {
    reporter.fail(`Max task ${maxTask} has ${max} questions (>${Math.round(3 * avg)}, 3x avg ${avg.toFixed(1)})`);
  } else if (max > 2.5 * avg) {
    reporter.warn(`Max task ${maxTask} has ${max} questions (>${Math.round(2.5 * avg)}, 2.5x avg ${avg.toFixed(1)})`);
  } else {
    reporter.pass(`Max task ${maxTask} has ${max} questions (avg ${avg.toFixed(1)})`);
  }

  if (min < 0.5 * avg) {
    reporter.fail(`Min task ${minTask} has ${min} questions (<${(0.5 * avg).toFixed(1)}, 50% of avg ${avg.toFixed(1)})`);
  } else if (min < 0.6 * avg) {
    reporter.warn(`Min task ${minTask} has ${min} questions (<${(0.6 * avg).toFixed(1)}, 60% of avg ${avg.toFixed(1)})`);
  } else {
    reporter.pass(`Min task ${minTask} has ${min} questions (avg ${avg.toFixed(1)})`);
  }

  // --- Methodology Mix ---
  reporter.section('Methodology Mix');

  const methCounts = {};
  for (const q of questions) {
    const m = (q.methodology || '').toLowerCase();
    if (m) methCounts[m] = (methCounts[m] || 0) + 1;
  }

  const methTotal = Object.values(methCounts).reduce((a, b) => a + b, 0);
  const hasHybrid = 'hybrid' in methCounts;

  // Report actual percentages
  for (const [m, c] of Object.entries(methCounts)) {
    const p = pct(c, methTotal);
    reporter.pass(`${m}: ${c} questions (${Math.round(p * 10) / 10}%)`);
  }

  if (hasHybrid) {
    checkRange(reporter, 'Predictive range', pct(methCounts.predictive || 0, methTotal), 30, 50);
    checkRange(reporter, 'Agile range', pct(methCounts.agile || 0, methTotal), 25, 45);
    checkRange(reporter, 'Hybrid range', pct(methCounts.hybrid || 0, methTotal), 15, 35);
  } else {
    // No hybrid — adjusted ranges
    checkRange(reporter, 'Predictive range (no hybrid)', pct(methCounts.predictive || 0, methTotal), 35, 55);
    checkRange(reporter, 'Agile range (no hybrid)', pct(methCounts.agile || 0, methTotal), 45, 65);
  }
}

module.exports = { run };
