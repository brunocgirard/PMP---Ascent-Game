/**
 * Coverage Completeness Tests
 * Verifies every PMP task has adequate coverage across all content types.
 * Zero dependencies — pure Node.js.
 */
const { loadQuizBank, loadFlashcardsMapped, loadLearningContent, loadMVEModules, loadSimulations, ALL_TASKS } = require('./lib/loader');

async function run(reporter) {
  const quizBank = loadQuizBank();
  const flashcards = loadFlashcardsMapped();
  const learningContent = loadLearningContent();
  const mveModules = loadMVEModules();
  const simulations = loadSimulations();

  // --- Task Quiz Coverage ---
  reporter.section('Task Quiz Coverage');
  for (const task of ALL_TASKS) {
    const count = quizBank.filter(q => q.taskId === task).length;
    if (count >= 5) {
      reporter.pass(`${task}: ${count} quiz questions`);
    } else if (count >= 1) {
      reporter.warn(`${task}: only ${count} quiz questions (want >=5)`);
    } else {
      reporter.fail(`${task}: 0 quiz questions`);
    }
  }

  // --- Task Flashcard Coverage ---
  reporter.section('Task Flashcard Coverage');
  for (const task of ALL_TASKS) {
    const count = flashcards.filter(f => f.mappedTasks && f.mappedTasks.includes(task)).length;
    if (count >= 1) {
      reporter.pass(`${task}: ${count} flashcards`);
    } else {
      reporter.fail(`${task}: 0 flashcards`);
    }
  }

  // --- Task Learning Content ---
  reporter.section('Task Learning Content');
  const topics = learningContent.topics || {};
  for (const task of ALL_TASKS) {
    if (topics[task]) {
      reporter.pass(`${task}: learning content exists`);
    } else {
      reporter.fail(`${task}: no learning content`);
    }
  }

  // --- Task MVE Coverage ---
  reporter.section('Task MVE Coverage');
  for (const task of ALL_TASKS) {
    if (mveModules[task]) {
      reporter.pass(`${task}: MVE module exists`);
    } else {
      reporter.fail(`${task}: no MVE module`);
    }
  }

  // --- PMBOK Principles ---
  reporter.section('PMBOK Principles');
  const allText = JSON.stringify(learningContent).toLowerCase();
  const principles = [
    'Stewardship', 'Team', 'Stakeholders', 'Value', 'Systems Thinking',
    'Leadership', 'Tailoring', 'Quality', 'Complexity', 'Risk',
    'Adaptability', 'Change'
  ];
  for (const p of principles) {
    if (allText.includes(p.toLowerCase())) {
      reporter.pass(`Principle mentioned: ${p}`);
    } else {
      reporter.fail(`Principle NOT mentioned: ${p}`);
    }
  }

  // --- Performance Domains ---
  reporter.section('Performance Domains');
  const domains = [
    'Stakeholders', 'Team', 'Development Approach', 'Planning',
    'Project Work', 'Delivery', 'Measurement', 'Uncertainty'
  ];
  for (const d of domains) {
    if (allText.includes(d.toLowerCase())) {
      reporter.pass(`Domain mentioned: ${d}`);
    } else {
      reporter.fail(`Domain NOT mentioned: ${d}`);
    }
  }

  // --- Foundation Topics ---
  reporter.section('Foundation Topics');
  const foundationTopics = [
    'principles', 'domains', 'ethics', 'exam-strategy', 'agile-manifesto',
    'scrum-framework', 'kanban-lean', 'hybrid-approaches', 'value-delivery'
  ];
  for (const ft of foundationTopics) {
    if (topics[ft] || mveModules[ft]) {
      reporter.pass(`Foundation topic exists: ${ft}`);
    } else {
      reporter.fail(`Foundation topic missing: ${ft}`);
    }
  }

  // --- Simulation Coverage ---
  reporter.section('Simulation Coverage');
  const simKeys = typeof simulations === 'object' && !Array.isArray(simulations)
    ? Object.keys(simulations)
    : [];
  const tasksWithSim = ALL_TASKS.filter(t => simKeys.includes(t)).length;
  const simPct = (tasksWithSim / ALL_TASKS.length) * 100;
  if (simPct >= 80) {
    reporter.pass(`Simulation coverage: ${tasksWithSim}/${ALL_TASKS.length} tasks (${simPct.toFixed(1)}%)`);
  } else if (simPct >= 60) {
    reporter.warn(`Simulation coverage: ${tasksWithSim}/${ALL_TASKS.length} tasks (${simPct.toFixed(1)}%) — want >=80%`);
  } else {
    reporter.fail(`Simulation coverage: ${tasksWithSim}/${ALL_TASKS.length} tasks (${simPct.toFixed(1)}%) — want >=80%`);
  }

  // --- Methodology Coverage ---
  reporter.section('Methodology Coverage');
  const total = quizBank.length;
  const methCounts = {};
  for (const q of quizBank) {
    const m = (q.methodology || 'unknown').toLowerCase();
    methCounts[m] = (methCounts[m] || 0) + 1;
  }
  const predictiveCount = methCounts['predictive'] || methCounts['waterfall'] || 0;
  const agileCount = methCounts['agile'] || 0;
  const hybridCount = methCounts['hybrid'] || 0;
  const predPct = (predictiveCount / total) * 100;
  const agilePct = (agileCount / total) * 100;
  const hybridPct = (hybridCount / total) * 100;

  if (predPct > 10) {
    reporter.pass(`Predictive: ${predictiveCount}/${total} (${predPct.toFixed(1)}%)`);
  } else {
    reporter.fail(`Predictive: ${predictiveCount}/${total} (${predPct.toFixed(1)}%) — want >10%`);
  }
  if (agilePct > 10) {
    reporter.pass(`Agile: ${agileCount}/${total} (${agilePct.toFixed(1)}%)`);
  } else {
    reporter.fail(`Agile: ${agileCount}/${total} (${agilePct.toFixed(1)}%) — want >10%`);
  }
  if (hybridCount > 0) {
    reporter.pass(`Hybrid: ${hybridCount}/${total} (${hybridPct.toFixed(1)}%)`);
  } else {
    reporter.warn(`Hybrid: 0 questions found`);
  }

  // Report all methodology breakdown
  for (const [m, c] of Object.entries(methCounts).sort((a, b) => b[1] - a[1])) {
    const pct = ((c / total) * 100).toFixed(1);
    console.log(`    ${m}: ${c} (${pct}%)`);
  }
}

module.exports = { run };
