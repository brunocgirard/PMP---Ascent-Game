/**
 * 06 — Accuracy Spot-Checks
 * Validates quiz answers against learning content, domain weights,
 * D1T1 alignment, and MVE answer keys.
 */
const { loadQuizBank, loadLearningContent, loadExamOutline, loadMVEModules } = require('./lib/loader');
const { searchText, flattenText } = require('./lib/text-search');

const COMMON_WORDS = new Set([
  'should', 'would', 'about', 'which', 'their', 'these', 'there',
  'project', 'answer', 'could', 'might', 'being', 'other', 'every',
  'after', 'before', 'under', 'above', 'between', 'through', 'during',
]);

function extractSignificantWords(text, count = 5) {
  const words = text.replace(/<[^>]+>/g, ' ').split(/\W+/)
    .map(w => w.toLowerCase())
    .filter(w => w.length > 4 && !COMMON_WORDS.has(w));
  const unique = [...new Set(words)];
  return unique.slice(0, count);
}

async function run(reporter) {

  // ── Quiz Answer Spot-Check ──────────────────────────────────
  reporter.section('Quiz Answer Spot-Check');

  let quizzes, learningContent;
  try {
    quizzes = loadQuizBank();
    learningContent = loadLearningContent();
  } catch (e) {
    reporter.fail(`Could not load data: ${e.message}`);
    return;
  }

  const allLearningText = flattenText(learningContent).toLowerCase();
  let sampled = 0;
  let matched = 0;

  for (let i = 0; i < quizzes.length; i += 10) {
    const q = quizzes[i];
    sampled++;

    // Find correct answer text
    const correctId = Array.isArray(q.correctAnswer) ? q.correctAnswer[0] : q.correctAnswer;
    const correctOption = q.options.find(o => o.id === correctId);
    if (!correctOption) continue;

    const words = extractSignificantWords(correctOption.text, 5);
    if (words.length < 2) continue;

    let wordHits = 0;
    for (const w of words) {
      if (allLearningText.includes(w)) wordHits++;
    }
    if (wordHits >= 2) matched++;
  }

  const rate = sampled > 0 ? matched / sampled : 0;
  const pct = (rate * 100).toFixed(1);
  if (rate >= 0.8) {
    reporter.pass(`${pct}% of sampled quiz answers found in learning content (${matched}/${sampled})`);
  } else if (rate >= 0.6) {
    reporter.warn(`${pct}% of sampled quiz answers found in learning content (${matched}/${sampled}) — below 80% target`);
  } else {
    reporter.fail(`${pct}% of sampled quiz answers found in learning content (${matched}/${sampled}) — below 60% minimum`);
  }

  // ── Domain Weight Cross-Check ───────────────────────────────
  reporter.section('Domain Weight Cross-Check');

  let examOutline;
  try {
    examOutline = loadExamOutline();
  } catch (e) {
    reporter.fail(`Could not load exam outline: ${e.message}`);
    examOutline = null;
  }

  if (examOutline && examOutline.domains) {
    const expected = { people: 33, process: 41, business: 26 };
    const domainNames = { people: 'People', process: 'Process', business: 'Business' };

    for (const domain of examOutline.domains) {
      const key = (domain.name || domain.id || '').toLowerCase().replace(/[^a-z]/g, '');
      let matchedKey = null;
      for (const k of Object.keys(expected)) {
        if (key.includes(k)) { matchedKey = k; break; }
      }
      if (!matchedKey) continue;

      const outlineWeight = parseInt(String(domain.examWeight || '').replace('%', ''), 10);
      const reqWeight = expected[matchedKey];
      if (outlineWeight !== reqWeight) {
        reporter.warn(`exam-content-outline.json says ${domainNames[matchedKey]}=${outlineWeight}% but PMP-EXAM-REQUIREMENTS.md says ${reqWeight}%`);
      } else {
        reporter.pass(`${domainNames[matchedKey]} domain weight matches: ${outlineWeight}%`);
      }
    }
  }

  // ── D1T1 Conflict Resolution Alignment ──────────────────────
  reporter.section('D1T1 Conflict Resolution Alignment');

  const d1t1Questions = quizzes.filter(q => q.taskId === 'd1t1');
  if (d1t1Questions.length === 0) {
    reporter.fail('No d1t1 questions found in quiz bank');
  } else {
    let alignedCount = 0;
    for (const q of d1t1Questions) {
      const blob = flattenText(q).toLowerCase();
      if (blob.includes('inclusive') || blob.includes('collaborative') ||
          blob.includes('collaborate') || blob.includes('inclusion') ||
          blob.includes('involve') || blob.includes('face-to-face') ||
          blob.includes('together') || blob.includes('facilitat')) {
        alignedCount++;
      }
    }
    const alignRate = alignedCount / d1t1Questions.length;
    const alignPct = (alignRate * 100).toFixed(1);
    if (alignRate >= 0.5) {
      reporter.pass(`${alignPct}% of d1t1 questions reference inclusive/collaborative (${alignedCount}/${d1t1Questions.length})`);
    } else if (alignRate >= 0.3) {
      reporter.warn(`${alignPct}% of d1t1 questions reference inclusive/collaborative (${alignedCount}/${d1t1Questions.length}) — below 50% target`);
    } else {
      reporter.fail(`${alignPct}% of d1t1 questions reference inclusive/collaborative (${alignedCount}/${d1t1Questions.length}) — below 30% minimum`);
    }
  }

  // ── MVE Answer Alignment ────────────────────────────────────
  reporter.section('MVE Answer Alignment');

  let mveModules;
  try {
    mveModules = loadMVEModules();
  } catch (e) {
    reporter.fail(`Could not load MVE modules: ${e.message}`);
    mveModules = null;
  }

  if (mveModules) {
    const validKeys = new Set(['A', 'B', 'C', 'D', 'a', 'b', 'c', 'd']);
    let checked = 0;
    let valid = 0;

    for (const [name, mod] of Object.entries(mveModules)) {
      const challenge = mod.quickScenarioChallenge;
      if (!challenge) continue;
      checked++;
      const ans = challenge.correctAnswer;
      if (validKeys.has(ans)) {
        valid++;
        reporter.pass(`${name}: correctAnswer "${ans}" is valid`);
      } else {
        reporter.fail(`${name}: correctAnswer "${ans}" is not a valid option key (A/B/C/D)`);
      }
    }

    if (checked === 0) {
      reporter.warn('No MVE modules with quickScenarioChallenge found');
    } else {
      reporter.pass(`${valid}/${checked} MVE modules have valid answer keys`);
    }
  }
}

module.exports = { run };
