/**
 * 07 — Orphan Detection Tests
 * Finds orphaned references, missing content, and cross-data inconsistencies.
 */
const {
  loadQuizBank, loadFlashcardsMapped, loadLearningContent,
  loadMVEModules, loadFormulas, ALL_TASKS, domainForTask
} = require('./lib/loader');

async function run(reporter) {
  const quizBank = loadQuizBank();
  const flashcards = loadFlashcardsMapped();
  const learning = loadLearningContent();
  const mveModules = loadMVEModules();
  const formulas = loadFormulas();

  const taskSet = new Set(ALL_TASKS);
  const questions = quizBank.questions || quizBank;

  // --- Orphan Quiz TaskIds ---
  reporter.section('Orphan Quiz TaskIds');
  {
    const orphans = [];
    for (const q of questions) {
      const tid = q.taskId || q.task_id;
      if (tid && !taskSet.has(tid)) {
        orphans.push({ id: q.id, taskId: tid });
      }
    }
    const examples = orphans.slice(0, 10).map(o => `${o.id} -> ${o.taskId}`).join(', ');
    if (orphans.length === 0) {
      reporter.pass('All quiz questions reference valid task IDs');
    } else if (orphans.length < 5) {
      reporter.warn(`${orphans.length} orphan quiz taskId(s): ${examples}`);
    } else {
      reporter.fail(`${orphans.length} orphan quiz taskId(s): ${examples}`);
    }
  }

  // --- Orphan Flashcard Mappings ---
  reporter.section('Orphan Flashcard Mappings');
  {
    const cards = flashcards.cards || flashcards;
    let orphanCount = 0;
    const examples = [];
    for (const card of (Array.isArray(cards) ? cards : [])) {
      const mapped = card.mappedTasks || card.mapped_tasks || [];
      for (const tid of mapped) {
        if (!taskSet.has(tid)) {
          orphanCount++;
          if (examples.length < 10) examples.push(`${card.id || '?'} -> ${tid}`);
        }
      }
    }
    if (orphanCount === 0) {
      reporter.pass('All flashcard mappedTasks reference valid task IDs');
    } else if (orphanCount < 5) {
      reporter.warn(`${orphanCount} orphan flashcard mapping(s): ${examples.join(', ')}`);
    } else {
      reporter.fail(`${orphanCount} orphan flashcard mapping(s): ${examples.join(', ')}`);
    }
  }

  // --- Tasks Missing Content ---
  reporter.section('Tasks Missing Content');
  {
    // Build lookup sets
    const quizTasks = new Set();
    for (const q of questions) {
      const tid = q.taskId || q.task_id;
      if (tid) quizTasks.add(tid);
    }

    const learningTasks = new Set();
    const learningArr = learning.topics || learning.content || learning;
    if (Array.isArray(learningArr)) {
      for (const entry of learningArr) {
        const tid = entry.taskId || entry.task_id || entry.id;
        if (tid) learningTasks.add(tid);
      }
    } else if (typeof learningArr === 'object') {
      for (const key of Object.keys(learningArr)) {
        learningTasks.add(key);
      }
    }

    const mveTasks = new Set();
    for (const [key, mod] of Object.entries(mveModules)) {
      // Key might be a taskId or module might contain taskId
      mveTasks.add(key);
      const tid = mod.taskId || mod.task_id;
      if (tid) mveTasks.add(tid);
    }

    const missingQuiz = ALL_TASKS.filter(t => !quizTasks.has(t));
    const missingLearn = ALL_TASKS.filter(t => !learningTasks.has(t));
    const missingMVE = ALL_TASKS.filter(t => !mveTasks.has(t));

    if (missingQuiz.length === 0) {
      reporter.pass('All tasks have at least 1 quiz question');
    } else {
      reporter.fail(`${missingQuiz.length} task(s) missing quiz questions: ${missingQuiz.join(', ')}`);
    }

    if (missingLearn.length === 0) {
      reporter.pass('All tasks have learning content');
    } else {
      reporter.fail(`${missingLearn.length} task(s) missing learning content: ${missingLearn.join(', ')}`);
    }

    if (missingMVE.length === 0) {
      reporter.pass('All tasks have MVE modules');
    } else {
      reporter.fail(`${missingMVE.length} task(s) missing MVE modules: ${missingMVE.join(', ')}`);
    }
  }

  // --- Domain-TaskId Consistency ---
  reporter.section('Domain-TaskId Consistency');
  {
    let mismatches = 0;
    const examples = [];
    for (const q of questions) {
      const tid = q.taskId || q.task_id;
      const qDomain = (q.domain || '').toLowerCase();
      if (!tid || !qDomain) continue;
      const expected = domainForTask(tid);
      if (expected && expected !== qDomain) {
        mismatches++;
        if (examples.length < 10) {
          examples.push(`${q.id}: domain="${qDomain}" but taskId ${tid} expects "${expected}"`);
        }
      }
    }
    if (mismatches === 0) {
      reporter.pass('All quiz question domains match their taskId prefix');
    } else if (mismatches < 10) {
      reporter.warn(`${mismatches} domain mismatch(es): ${examples.join('; ')}`);
    } else {
      reporter.fail(`${mismatches} domain mismatch(es): ${examples.join('; ')}`);
    }
  }

  // --- Formula Reference Check ---
  reporter.section('Formula Reference Check');
  {
    const formulaIds = new Set();
    const categories = formulas.categories || formulas;
    if (Array.isArray(categories)) {
      for (const cat of categories) {
        const fList = cat.formulas || [];
        for (const f of fList) {
          if (f.id) formulaIds.add(f.id.toLowerCase());
        }
      }
    }

    const required = ['cv', 'sv', 'cpi', 'spi', 'eac'];
    const missing = required.filter(id => {
      if (formulaIds.has(id)) return false;
      // Accept prefixed variants (e.g., eac-typical matches eac)
      for (const fid of formulaIds) { if (fid.startsWith(id + '-') || fid.startsWith(id)) return false; }
      return true;
    });

    if (missing.length === 0) {
      reporter.pass(`All major formulas present in formulas file (${required.join(', ')})`);
    } else {
      reporter.fail(`Missing major formulas: ${missing.join(', ')}. Found: ${[...formulaIds].join(', ')}`);
    }
  }
}

module.exports = { run };
