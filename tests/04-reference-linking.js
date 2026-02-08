/**
 * 04 – Reference Linking Tests
 * Validates cross-references between quizzes, flashcards, missions,
 * learning content, and MVE modules.
 */
const {
  loadQuizBank,
  loadFlashcardsMapped,
  loadLearningContent,
  loadMVEModules,
  loadMissions,
  ALL_TASKS,
} = require('./lib/loader');

const TASK_RE = /^d[123]t\d{1,2}$/;
const taskSet = new Set(ALL_TASKS);

async function run(reporter) {
  const quizzes = loadQuizBank();
  const flashcards = loadFlashcardsMapped();
  const learningContent = loadLearningContent();
  const mveModules = loadMVEModules();
  const missionsData = loadMissions();

  // --- Quiz Task References ---
  reporter.section('Quiz Task References');
  {
    const invalid = [];
    let valid = 0;
    for (const q of quizzes) {
      if (q.taskId && TASK_RE.test(q.taskId) && taskSet.has(q.taskId)) {
        valid++;
      } else {
        invalid.push({ id: q.id, taskId: q.taskId });
      }
    }
    if (invalid.length === 0) {
      reporter.pass(`All ${valid} quiz taskIds are valid`);
    } else {
      const examples = invalid.slice(0, 10).map(e => `${e.id}→${e.taskId}`).join(', ');
      reporter.fail(`${invalid.length} invalid quiz taskIds (${valid} valid). Examples: ${examples}`);
    }
  }

  // --- Flashcard Task Mapping ---
  reporter.section('Flashcard Task Mapping');
  {
    const invalid = [];
    let total = 0;
    for (const fc of flashcards) {
      if (!fc.mappedTasks) continue;
      for (const t of fc.mappedTasks) {
        total++;
        if (!taskSet.has(t)) {
          invalid.push({ id: fc.id, task: t });
        }
      }
    }
    if (invalid.length === 0) {
      reporter.pass(`All ${total} flashcard task mappings are valid`);
    } else {
      const examples = invalid.slice(0, 10).map(e => `${e.id}→${e.task}`).join(', ');
      reporter.fail(`${invalid.length} invalid flashcard task refs. Examples: ${examples}`);
    }
  }

  // --- Quiz-Flashcard Cross-Reference ---
  reporter.section('Quiz-Flashcard Cross-Reference');
  {
    const fcIdSet = new Set(flashcards.map(fc => fc.id));
    let checked = 0;
    let missing = 0;
    const examples = [];
    for (const q of quizzes) {
      const ref = q.references;
      if (ref && ref.source === 'flashcard' && ref.flashcardId) {
        checked++;
        if (!fcIdSet.has(ref.flashcardId)) {
          missing++;
          if (examples.length < 10) examples.push(`${q.id}→fc:${ref.flashcardId}`);
        }
      }
    }
    if (missing === 0) {
      reporter.pass(`All ${checked} quiz-flashcard cross-references resolve`);
    } else {
      reporter.fail(`${missing}/${checked} quizzes reference missing flashcards. Examples: ${examples.join(', ')}`);
    }
  }

  // --- Mission Topic References ---
  reporter.section('Mission Topic References');
  {
    const topicKeys = new Set(Object.keys(learningContent.topics || {}));
    let total = 0;
    let missing = 0;
    const examples = [];
    const missions = missionsData.missions || [];
    for (const m of missions) {
      for (const topic of (m.topics || [])) {
        total++;
        if (!topicKeys.has(topic.id)) {
          missing++;
          if (examples.length < 10) examples.push(topic.id);
        }
      }
    }
    if (missing === 0) {
      reporter.pass(`All ${total} mission topic references found in learning content`);
    } else {
      reporter.fail(`${missing}/${total} mission topics missing from learning content. Examples: ${examples.join(', ')}`);
    }
  }

  // --- MVE TaskId-Filename Match ---
  reporter.section('MVE TaskId-Filename Match');
  {
    let checked = 0;
    let mismatches = 0;
    const examples = [];
    for (const [key, mod] of Object.entries(mveModules)) {
      if (mod.taskId) {
        checked++;
        if (mod.taskId !== key) {
          mismatches++;
          if (examples.length < 10) examples.push(`${key}≠${mod.taskId}`);
        }
      }
    }
    if (mismatches === 0) {
      reporter.pass(`All ${checked} MVE modules have matching taskId and filename`);
    } else {
      reporter.fail(`${mismatches}/${checked} MVE taskId-filename mismatches. Examples: ${examples.join(', ')}`);
    }
  }
}

module.exports = { run };
