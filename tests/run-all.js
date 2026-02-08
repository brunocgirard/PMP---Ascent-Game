#!/usr/bin/env node
/**
 * PMP Content Verification Suite — Main Runner
 * Usage: node tests/run-all.js
 * Exit code 1 on any failure, 0 otherwise.
 */
const { createReporter, printCoverageMatrix, BOLD, CYAN, GREEN, YELLOW, RED, RESET } = require('./lib/reporter');
const { loadQuizBank, loadFlashcardsMapped, loadLearningContent, loadMVEModules, loadSimulations, ALL_TASKS } = require('./lib/loader');

const suites = [
  { name: '01 Structural Integrity',    file: './01-structural-integrity' },
  { name: '02 Coverage Completeness',   file: './02-coverage-completeness' },
  { name: '03 Distribution Compliance', file: './03-distribution-compliance' },
  { name: '04 Reference Linking',       file: './04-reference-linking' },
  { name: '05 Terminology Consistency', file: './05-terminology-consistency' },
  { name: '06 Accuracy Spot-Checks',   file: './06-accuracy-spot-checks' },
  { name: '07 Orphan Detection',        file: './07-orphan-detection' },
];

async function main() {
  console.log(`\n${BOLD}${CYAN}╔══════════════════════════════════════════════╗${RESET}`);
  console.log(`${BOLD}${CYAN}║   PMP Content Verification Suite             ║${RESET}`);
  console.log(`${BOLD}${CYAN}╚══════════════════════════════════════════════╝${RESET}\n`);

  let totalPass = 0, totalWarn = 0, totalFail = 0;

  for (const suite of suites) {
    const reporter = createReporter(suite.name);
    reporter.printSuiteHeader();
    try {
      const mod = require(suite.file);
      await mod.run(reporter);
    } catch (err) {
      reporter.fail(`Suite crashed: ${err.message}`);
    }
    const s = reporter.summary();
    totalPass += s.passCount;
    totalWarn += s.warnCount;
    totalFail += s.failCount;
  }

  // Coverage matrix
  try {
    const quizzes = loadQuizBank();
    const flashcards = loadFlashcardsMapped();
    const learning = loadLearningContent();
    const mve = loadMVEModules();
    const sims = loadSimulations();

    const matrix = ALL_TASKS.map(task => ({
      task,
      quiz: quizzes.filter(q => q.taskId === task).length,
      flash: flashcards.filter(f => f.mappedTasks && f.mappedTasks.includes(task)).length,
      learn: !!(learning.topics && learning.topics[task]),
      mve: !!mve[task],
      sim: !!sims[task],
    }));

    printCoverageMatrix(matrix);
  } catch (err) {
    console.log(`\n${RED}Coverage matrix generation failed: ${err.message}${RESET}`);
  }

  // Final summary
  console.log(`\n${BOLD}${CYAN}━━━ Final Summary ━━━${RESET}`);
  console.log(`  ${GREEN}✓ Pass: ${totalPass}${RESET}`);
  console.log(`  ${YELLOW}⚠ Warn: ${totalWarn}${RESET}`);
  console.log(`  ${RED}✗ Fail: ${totalFail}${RESET}`);
  console.log(`  Total: ${totalPass + totalWarn + totalFail}\n`);

  if (totalFail > 0) {
    console.log(`${RED}${BOLD}RESULT: FAILED${RESET}\n`);
    process.exit(1);
  } else if (totalWarn > 0) {
    console.log(`${YELLOW}${BOLD}RESULT: PASSED WITH WARNINGS${RESET}\n`);
  } else {
    console.log(`${GREEN}${BOLD}RESULT: ALL PASSED${RESET}\n`);
  }
}

main().catch(err => {
  console.error(`Fatal error: ${err.message}`);
  process.exit(1);
});
