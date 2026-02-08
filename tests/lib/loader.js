/**
 * Data loader for PMP content verification tests.
 * Loads all JSON data files from the data/ directory.
 * Zero dependencies — pure Node.js.
 */
const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', '..', 'data');
const MVE_DIR = path.join(DATA_DIR, 'enhanced-mve');

function loadJSON(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
}

function loadQuizBank() {
  return loadJSON(path.join(DATA_DIR, 'quiz-bank.json'));
}

function loadFlashcards() {
  return loadJSON(path.join(DATA_DIR, 'flashcards.json'));
}

function loadFlashcardsMapped() {
  return loadJSON(path.join(DATA_DIR, 'flashcards-mapped.json'));
}

function loadFormulas() {
  return loadJSON(path.join(DATA_DIR, 'formulas.json'));
}

function loadSimulations() {
  return loadJSON(path.join(DATA_DIR, 'simulation-scenarios.json'));
}

function loadLearningContent() {
  return loadJSON(path.join(DATA_DIR, 'learning-content.json'));
}

function loadExamOutline() {
  return loadJSON(path.join(DATA_DIR, 'exam-content-outline.json'));
}

function loadMissions() {
  return loadJSON(path.join(DATA_DIR, 'missions.json'));
}

function loadMVEModules() {
  const modules = {};
  const files = fs.readdirSync(MVE_DIR).filter(f => f.endsWith('.json'));
  for (const file of files) {
    const key = path.basename(file, '.json');
    modules[key] = loadJSON(path.join(MVE_DIR, file));
  }
  return modules;
}

/** All 35 valid task IDs */
const ALL_TASKS = [];
for (let t = 1; t <= 14; t++) ALL_TASKS.push(`d1t${t}`);
for (let t = 1; t <= 17; t++) ALL_TASKS.push(`d2t${t}`);
for (let t = 1; t <= 4; t++) ALL_TASKS.push(`d3t${t}`);

const DOMAIN_FOR_PREFIX = { d1: 'people', d2: 'process', d3: 'business' };

function domainForTask(taskId) {
  const prefix = taskId.replace(/t\d+$/, '');
  return DOMAIN_FOR_PREFIX[prefix] || null;
}

module.exports = {
  loadQuizBank,
  loadFlashcards,
  loadFlashcardsMapped,
  loadFormulas,
  loadSimulations,
  loadLearningContent,
  loadExamOutline,
  loadMissions,
  loadMVEModules,
  ALL_TASKS,
  DOMAIN_FOR_PREFIX,
  domainForTask,
  DATA_DIR,
  MVE_DIR,
};
