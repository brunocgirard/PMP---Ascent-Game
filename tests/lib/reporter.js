/**
 * Test reporter with pass / warn / fail levels and ANSI colors.
 */

const GREEN = '\x1b[32m';
const YELLOW = '\x1b[33m';
const RED = '\x1b[31m';
const CYAN = '\x1b[36m';
const BOLD = '\x1b[1m';
const RESET = '\x1b[0m';

function createReporter(suiteName) {
  const results = [];
  let passCount = 0;
  let warnCount = 0;
  let failCount = 0;

  function pass(msg) {
    passCount++;
    results.push({ level: 'pass', msg });
    console.log(`  ${GREEN}✓ PASS${RESET}  ${msg}`);
  }

  function warn(msg) {
    warnCount++;
    results.push({ level: 'warn', msg });
    console.log(`  ${YELLOW}⚠ WARN${RESET}  ${msg}`);
  }

  function fail(msg) {
    failCount++;
    results.push({ level: 'fail', msg });
    console.log(`  ${RED}✗ FAIL${RESET}  ${msg}`);
  }

  function section(title) {
    console.log(`\n  ${CYAN}${BOLD}[${title}]${RESET}`);
  }

  function summary() {
    return { passCount, warnCount, failCount, total: results.length, results };
  }

  function hasFailures() {
    return failCount > 0;
  }

  function printSuiteHeader() {
    console.log(`\n${BOLD}${CYAN}━━━ ${suiteName} ━━━${RESET}`);
  }

  return { pass, warn, fail, section, summary, hasFailures, printSuiteHeader };
}

function printCoverageMatrix(matrix) {
  console.log(`\n${BOLD}${CYAN}━━━ Coverage Matrix ━━━${RESET}`);
  const header = 'Task   | Quiz | Flash | Learn | MVE  | Sim  ';
  console.log(`  ${header}`);
  console.log(`  ${'-'.repeat(header.length)}`);
  let totalQuiz = 0, totalFlash = 0, learnYes = 0, mveYes = 0, simYes = 0;
  for (const row of matrix) {
    const q = String(row.quiz).padStart(4);
    const f = String(row.flash).padStart(5);
    const l = row.learn ? ' YES ' : '  -  ';
    const m = row.mve ? ' YES ' : '  -  ';
    const s = row.sim ? ' YES ' : '  -  ';
    console.log(`  ${row.task.padEnd(6)} |${q} |${f} |${l}|${m}|${s}`);
    totalQuiz += row.quiz;
    totalFlash += row.flash;
    if (row.learn) learnYes++;
    if (row.mve) mveYes++;
    if (row.sim) simYes++;
  }
  const total = matrix.length;
  console.log(`  ${'-'.repeat(header.length)}`);
  console.log(`  TOTAL  |${String(totalQuiz).padStart(4)} |${String(totalFlash).padStart(5)} |${learnYes}/${total}  |${mveYes}/${total} |${simYes}/${total}`);
}

module.exports = { createReporter, printCoverageMatrix, GREEN, YELLOW, RED, CYAN, BOLD, RESET };
