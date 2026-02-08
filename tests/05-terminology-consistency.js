/**
 * Test 05: Terminology Consistency
 * Verifies PMP content uses correct, current terminology.
 */
const { loadQuizBank, loadFlashcardsMapped, loadLearningContent, loadFormulas } = require('./lib/loader');
const { searchText, flattenText } = require('./lib/text-search');

function countOccurrences(text, phrase) {
  const lower = text.toLowerCase();
  const target = phrase.toLowerCase();
  let count = 0;
  let pos = 0;
  while ((pos = lower.indexOf(target, pos)) !== -1) {
    count++;
    pos += target.length;
  }
  return count;
}

async function run(reporter) {
  // Load all content
  const quizBank = loadQuizBank();
  const flashcards = loadFlashcardsMapped();
  const learningContent = loadLearningContent();
  let formulas;
  try {
    formulas = loadFormulas();
  } catch (e) {
    formulas = null;
  }

  // Build one big string of all content
  const allText = [
    flattenText(quizBank),
    flattenText(flashcards),
    flattenText(learningContent),
  ].join(' ');

  // --- Deprecated PMBOK 6 Terms ---
  reporter.section('Deprecated PMBOK 6 Terms');

  const kaCount = countOccurrences(allText, 'knowledge area');
  if (kaCount > 0) {
    reporter.warn(`"knowledge area" found ${kaCount} time(s) — may be outdated PMBOK 6 terminology`);
  } else {
    reporter.pass('No "knowledge area" references found');
  }

  const pgCount = countOccurrences(allText, 'process group');
  if (pgCount > 0) {
    reporter.warn(`"process group" found ${pgCount} time(s) — may be outdated PMBOK 6 terminology`);
  } else {
    reporter.pass('No "process group" references found');
  }

  // --- Agile Terminology ---
  reporter.section('Agile Terminology');

  const prodManagerCount = countOccurrences(allText, 'product manager');
  const prodOwnerCount = countOccurrences(allText, 'product owner');
  if (prodManagerCount > 5 && prodManagerCount > prodOwnerCount) {
    reporter.fail(`"Product Manager" (${prodManagerCount}) used more than "Product Owner" (${prodOwnerCount}) — should use "Product Owner" for Scrum role`);
  } else {
    reporter.pass(`"Product Owner" terminology used correctly (${prodOwnerCount} occurrences)`);
  }

  if (searchText(allText, 'project backlog')) {
    reporter.fail(`"Project Backlog" found — should be "Product Backlog"`);
  } else {
    reporter.pass('"Product Backlog" used correctly (no "Project Backlog" found)');
  }

  if (searchText(allText, 'scrum leader')) {
    reporter.fail(`"Scrum Leader" found — should be "Scrum Master"`);
  } else {
    reporter.pass('"Scrum Master" used correctly (no "Scrum Leader" found)');
  }

  // --- Formula Accuracy ---
  reporter.section('Formula Accuracy');

  if (!formulas) {
    reporter.warn('Could not load formulas.json — skipping formula checks');
  } else {
    // formulas.json has nested structure: { categories: [{ formulas: [...] }] }
    const formulaList = [];
    if (formulas.categories && Array.isArray(formulas.categories)) {
      for (const cat of formulas.categories) {
        if (Array.isArray(cat.formulas)) formulaList.push(...cat.formulas);
      }
    } else if (Array.isArray(formulas)) {
      formulaList.push(...formulas);
    }
    const byId = {};
    for (const f of formulaList) {
      if (f.id) byId[f.id] = f;
    }

    const checks = [
      { id: 'cv', terms: ['EV', 'AC'], label: 'Cost Variance = EV - AC' },
      { id: 'sv', terms: ['EV', 'PV'], label: 'Schedule Variance = EV - PV' },
      { id: 'cpi', terms: ['EV', 'AC'], label: 'CPI = EV/AC' },
      { id: 'spi', terms: ['EV', 'PV'], label: 'SPI = EV/PV' },
    ];

    for (const check of checks) {
      const f = byId[check.id];
      if (!f) {
        reporter.warn(`Formula "${check.id}" not found in formulas data`);
        continue;
      }
      const formulaText = flattenText(f).toUpperCase();
      const allPresent = check.terms.every(t => formulaText.includes(t));
      if (allPresent) {
        reporter.pass(`Formula "${check.id}" correctly contains ${check.terms.join(', ')} (${check.label})`);
      } else {
        reporter.fail(`Formula "${check.id}" missing expected terms ${check.terms.join(', ')} (${check.label})`);
      }
    }

    // EAC check — look for eac-typical or any eac
    const eacKey = byId['eac-typical'] ? 'eac-typical' : Object.keys(byId).find(k => k.startsWith('eac'));
    if (!eacKey) {
      reporter.warn('No EAC formula found in formulas data');
    } else {
      const eacText = flattenText(byId[eacKey]).toUpperCase();
      const hasBAC = eacText.includes('BAC');
      const hasCPI = eacText.includes('CPI');
      if (hasBAC && hasCPI) {
        reporter.pass(`Formula "${eacKey}" correctly contains BAC and CPI`);
      } else {
        reporter.fail(`Formula "${eacKey}" missing BAC and/or CPI`);
      }
    }
  }

  // --- Key PMI Terms Present ---
  reporter.section('Key PMI Terms Present');

  const keyTerms = [
    'servant leadership', 'WBS', 'work breakdown structure', 'risk register',
    'earned value', 'scope creep', 'stakeholder engagement', 'change control',
    'lessons learned', 'sprint retrospective', 'product backlog', 'sprint planning',
    'daily standup', 'burndown', 'velocity', 'kanban', 'definition of done',
    'acceptance criteria', 'project charter', 'scope baseline', 'critical path',
    'resource leveling', 'procurement', 'quality assurance', 'risk response',
    'Monte Carlo', 'RACI', 'communication plan', 'change request', 'benefits realization',
  ];

  for (const term of keyTerms) {
    if (searchText(allText, term)) {
      reporter.pass(`Key term "${term}" found in content`);
    } else {
      reporter.warn(`Key term "${term}" not found in any content`);
    }
  }
}

module.exports = { run };
