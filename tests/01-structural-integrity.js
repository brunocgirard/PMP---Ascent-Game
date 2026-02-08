/**
 * 01 — Structural Integrity Tests
 * Validates schemas and uniqueness of all data files.
 */
const { loadQuizBank, loadFlashcardsMapped, loadFormulas, loadSimulations, loadMVEModules } = require('./lib/loader');

async function run(reporter) {

  // ── Quiz Schema ──────────────────────────────────────────
  reporter.section('Quiz Schema');
  let quizzes;
  try {
    quizzes = loadQuizBank();
  } catch (e) {
    reporter.fail(`Could not load quiz-bank.json: ${e.message}`);
    quizzes = null;
  }

  if (quizzes) {
    const validDomains = ['people', 'process', 'business'];
    const validTypes = ['multiple-choice', 'multiple-response', 'matching', 'fill-blank'];
    let schemaFails = 0;
    for (const q of quizzes) {
      let ok = true;
      if (typeof q.id !== 'string' || !/^q\d{4}$/.test(q.id)) ok = false;
      if (typeof q.taskId !== 'string') ok = false;
      if (!validDomains.includes(q.domain)) ok = false;
      if (!validTypes.includes(q.type)) ok = false;
      if (!Array.isArray(q.options) || q.options.length === 0) ok = false;
      else if (!q.options.every(o => typeof o.id === 'string' && typeof o.text === 'string')) ok = false;
      if (typeof q.correctAnswer !== 'string' && !Array.isArray(q.correctAnswer)) ok = false;
      if (typeof q.explanation !== 'string') ok = false;
      if (!ok) schemaFails++;
    }
    if (schemaFails === 0) reporter.pass(`All ${quizzes.length} quizzes pass core schema`);
    else reporter.fail(`${schemaFails}/${quizzes.length} quizzes failed core schema`);

    let metaFails = 0;
    for (const q of quizzes) {
      if (typeof q.methodology !== 'string' || typeof q.difficulty !== 'string') metaFails++;
    }
    if (metaFails === 0) reporter.pass(`All quizzes have methodology and difficulty`);
    else reporter.fail(`${metaFails}/${quizzes.length} quizzes missing methodology or difficulty`);
  }

  // ── Flashcard Schema ─────────────────────────────────────
  reporter.section('Flashcard Schema');
  let flashcards;
  try {
    flashcards = loadFlashcardsMapped();
  } catch (e) {
    reporter.fail(`Could not load flashcards-mapped.json: ${e.message}`);
    flashcards = null;
  }

  if (flashcards) {
    let fails = 0;
    for (const c of flashcards) {
      if (typeof c.id !== 'number') { fails++; continue; }
      if (typeof c.category !== 'string') { fails++; continue; }
      if (typeof c.question !== 'string') { fails++; continue; }
      if (typeof c.answer !== 'string') { fails++; continue; }
      if (!Array.isArray(c.mappedTasks) || !c.mappedTasks.every(t => typeof t === 'string')) fails++;
    }
    if (fails === 0) reporter.pass(`All ${flashcards.length} flashcards pass schema`);
    else reporter.fail(`${fails}/${flashcards.length} flashcards failed schema`);
  }

  // ── Formula Schema ───────────────────────────────────────
  reporter.section('Formula Schema');
  let formulas;
  try {
    formulas = loadFormulas();
  } catch (e) {
    reporter.fail(`Could not load formulas.json: ${e.message}`);
    formulas = null;
  }

  if (formulas) {
    let catFails = 0;
    let fmlaFails = 0;
    let totalFormulas = 0;
    for (const cat of formulas.categories) {
      if (typeof cat.id !== 'string' || typeof cat.name !== 'string' || !Array.isArray(cat.formulas)) {
        catFails++;
        continue;
      }
      for (const f of cat.formulas) {
        totalFormulas++;
        if (typeof f.id !== 'string' || typeof f.name !== 'string' || typeof f.formula !== 'string' || typeof f.description !== 'string') {
          fmlaFails++;
        }
      }
    }
    if (catFails === 0) reporter.pass(`All ${formulas.categories.length} formula categories valid`);
    else reporter.fail(`${catFails} formula categories failed schema`);
    if (fmlaFails === 0) reporter.pass(`All ${totalFormulas} formulas valid`);
    else reporter.fail(`${fmlaFails}/${totalFormulas} formulas failed schema`);
  }

  // ── Simulation Schema ────────────────────────────────────
  reporter.section('Simulation Schema');
  let sims;
  try {
    sims = loadSimulations();
  } catch (e) {
    reporter.fail(`Could not load simulation-scenarios.json: ${e.message}`);
    sims = null;
  }

  if (sims) {
    const kpiKeys = ['budget', 'schedule', 'morale', 'stakeholders', 'risk'];
    let fails = 0;
    const entries = Object.values(sims);
    for (const s of entries) {
      if (!Array.isArray(s.decisions)) { fails++; continue; }
      for (const d of s.decisions) {
        if (!Array.isArray(d.options)) { fails++; continue; }
        for (const o of d.options) {
          if (typeof o.text !== 'string') { fails++; continue; }
          if (typeof o.feedback !== 'string') { fails++; continue; }
          if (!o.kpiImpact || !kpiKeys.every(k => k in o.kpiImpact)) { fails++; continue; }
        }
      }
    }
    if (fails === 0) reporter.pass(`All ${entries.length} simulation scenarios pass schema`);
    else reporter.fail(`${fails} simulation schema issues found`);
  }

  // ── Enhanced MVE Schema ──────────────────────────────────
  reporter.section('Enhanced MVE Schema');
  let mve;
  try {
    mve = loadMVEModules();
  } catch (e) {
    reporter.fail(`Could not load MVE modules: ${e.message}`);
    mve = null;
  }

  if (mve) {
    let fails = 0;
    const keys = Object.keys(mve).filter(k => /^d\d/.test(mve[k].taskId || ''));
    for (const key of keys) {
      const m = mve[key];
      if (m.taskId !== key) { fails++; continue; }
      const qsc = m.quickScenarioChallenge;
      if (!qsc || !qsc.options || typeof qsc.correctAnswer !== 'string') { fails++; continue; }
      if (!m.ahaDebrief) { fails++; continue; }
    }
    if (fails === 0) reporter.pass(`All ${keys.length} MVE modules pass schema`);
    else reporter.fail(`${fails}/${keys.length} MVE modules failed schema`);
  }

  // ── Duplicate IDs ────────────────────────────────────────
  reporter.section('Duplicate IDs');

  if (quizzes) {
    const ids = quizzes.map(q => q.id);
    const dupes = ids.filter((v, i) => ids.indexOf(v) !== i);
    if (dupes.length === 0) reporter.pass(`No duplicate quiz IDs (${ids.length} total)`);
    else reporter.fail(`${dupes.length} duplicate quiz IDs: ${[...new Set(dupes)].slice(0, 5).join(', ')}`);
  }

  if (flashcards) {
    const ids = flashcards.map(c => c.id);
    const dupes = ids.filter((v, i) => ids.indexOf(v) !== i);
    if (dupes.length === 0) reporter.pass(`No duplicate flashcard IDs (${ids.length} total)`);
    else reporter.fail(`${dupes.length} duplicate flashcard IDs`);
  }

  if (formulas) {
    const ids = formulas.categories.flatMap(c => c.formulas.map(f => f.id));
    const dupes = ids.filter((v, i) => ids.indexOf(v) !== i);
    if (dupes.length === 0) reporter.pass(`No duplicate formula IDs (${ids.length} total)`);
    else reporter.fail(`${dupes.length} duplicate formula IDs: ${[...new Set(dupes)].slice(0, 5).join(', ')}`);
  }
}

module.exports = { run };
