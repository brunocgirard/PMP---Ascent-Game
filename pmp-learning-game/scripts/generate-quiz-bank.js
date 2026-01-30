const fs = require('fs');
const path = require('path');

// Load source data
const examOutline = require('../data/exam-content-outline.json');
const flashcards = require('../data/flashcards-mapped.json');
const formulas = require('../data/formulas.json');
const missions = require('../data/missions.json');

// Load practice scenarios
const scenariosPath = path.join(__dirname, '../../04_PRACTICE_SCENARIOS_QUIZ.md');
const scenariosContent = fs.readFileSync(scenariosPath, 'utf8');

// Target distribution (1000 questions)
const TARGET_COUNTS = {
  people: 330,    // 33%
  process: 410,   // 41%
  business: 260   // 26%
};

// Question types distribution
const QUESTION_TYPE_PERCENTAGES = {
  'multiple-choice': 0.70,     // 70%
  'multiple-response': 0.15,   // 15%
  'matching': 0.10,            // 10%
  'fill-blank': 0.05           // 5%
};

// Methodology split
const METHODOLOGY_PERCENTAGES = {
  'agile': 0.60,      // 60%
  'predictive': 0.40  // 40%
};

// Difficulty distribution
const DIFFICULTY_PERCENTAGES = {
  'easy': 0.30,
  'medium': 0.50,
  'hard': 0.20
};

let questionId = 1;
const quizBank = [];

// Helper function to generate question ID
function getQuestionId() {
  return `q${String(questionId++).padStart(4, '0')}`;
}

// Helper function to select methodology based on task content
function selectMethodology(taskId, index, total) {
  // Agile-heavy tasks
  const agileTasks = ['d1t1', 'd1t2', 'd1t4', 'd1t7', 'd1t10', 'd1t12', 'd2t1', 'd2t13', 'd3t4'];
  if (agileTasks.includes(taskId)) {
    return Math.random() < 0.75 ? 'agile' : 'hybrid';
  }

  // Predictive-heavy tasks
  const predictiveTasks = ['d2t5', 'd2t6', 'd2t7', 'd2t11', 'd3t1'];
  if (predictiveTasks.includes(taskId)) {
    return Math.random() < 0.60 ? 'predictive' : 'hybrid';
  }

  // Mixed - use target ratio
  const targetAgileCount = Math.floor(total * 0.60);
  const currentAgileCount = quizBank.filter(q => q.methodology === 'agile' || q.methodology === 'hybrid').length;

  if (currentAgileCount < targetAgileCount) {
    return Math.random() < 0.70 ? 'agile' : 'predictive';
  } else {
    return Math.random() < 0.60 ? 'predictive' : 'agile';
  }
}

// Helper function to select difficulty
function selectDifficulty(index, total) {
  const ratio = index / total;
  if (ratio < 0.30) return 'easy';
  if (ratio < 0.80) return 'medium';
  return 'hard';
}

// Helper function to select question type
function selectQuestionType(index, total) {
  const rand = Math.random();
  if (rand < 0.70) return 'multiple-choice';
  if (rand < 0.85) return 'multiple-response';
  if (rand < 0.95) return 'matching';
  return 'fill-blank';
}

// Generate questions for Domain 1: People (330 questions, 14 tasks = ~24 per task)
console.log('Generating Domain 1: People questions...');
const domain1 = examOutline.domains.find(d => d.id === 'domain1');
domain1.tasks.forEach((task, taskIndex) => {
  const questionsPerTask = Math.round(TARGET_COUNTS.people / domain1.tasks.length);

  for (let i = 0; i < questionsPerTask; i++) {
    const qType = selectQuestionType(i, questionsPerTask);
    const difficulty = selectDifficulty(i, questionsPerTask);
    const methodology = selectMethodology(task.id, i, questionsPerTask);

    quizBank.push(generatePeopleQuestion(task, qType, difficulty, methodology));
  }
});

// Generate questions for Domain 2: Process (410 questions, 17 tasks = ~24 per task)
console.log('Generating Domain 2: Process questions...');
const domain2 = examOutline.domains.find(d => d.id === 'domain2');
domain2.tasks.forEach((task, taskIndex) => {
  const questionsPerTask = Math.round(TARGET_COUNTS.process / domain2.tasks.length);

  for (let i = 0; i < questionsPerTask; i++) {
    const qType = selectQuestionType(i, questionsPerTask);
    const difficulty = selectDifficulty(i, questionsPerTask);
    const methodology = selectMethodology(task.id, i, questionsPerTask);

    quizBank.push(generateProcessQuestion(task, qType, difficulty, methodology));
  }
});

// Generate questions for Domain 3: Business (260 questions, 4 tasks = ~65 per task)
console.log('Generating Domain 3: Business questions...');
const domain3 = examOutline.domains.find(d => d.id === 'domain3');
domain3.tasks.forEach((task, taskIndex) => {
  const questionsPerTask = Math.round(TARGET_COUNTS.business / domain3.tasks.length);

  for (let i = 0; i < questionsPerTask; i++) {
    const qType = selectQuestionType(i, questionsPerTask);
    const difficulty = selectDifficulty(i, questionsPerTask);
    const methodology = selectMethodology(task.id, i, questionsPerTask);

    quizBank.push(generateBusinessQuestion(task, qType, difficulty, methodology));
  }
});

// Add formula-based questions
console.log('Adding formula-based questions...');
formulas.categories.forEach(category => {
  category.formulas.forEach(formula => {
    if (formula.type === 'calculation') {
      // Add 2-3 questions per formula
      for (let i = 0; i < 3; i++) {
        quizBank.push(generateFormulaQuestion(formula, i));
      }
    }
  });
});

// Question generation functions
function generatePeopleQuestion(task, qType, difficulty, methodology) {
  const templates = getPeopleQuestionTemplates(task, methodology, difficulty);
  const template = templates[Math.floor(Math.random() * templates.length)];

  return {
    id: getQuestionId(),
    taskId: task.id,
    domain: 'people',
    type: qType,
    methodology: methodology,
    difficulty: difficulty,
    question: template.question,
    options: qType === 'multiple-choice' || qType === 'multiple-response'
      ? template.options
      : undefined,
    correctAnswer: template.correctAnswer,
    explanation: template.explanation,
    references: {
      task: `Domain 1 ${task.taskNumber}: ${task.name}`,
      principle: template.principle || 'Team',
      ...(template.transcriptLines && { transcriptLines: template.transcriptLines })
    },
    examTip: template.examTip || task.examTip
  };
}

function generateProcessQuestion(task, qType, difficulty, methodology) {
  const templates = getProcessQuestionTemplates(task, methodology, difficulty);
  const template = templates[Math.floor(Math.random() * templates.length)];

  return {
    id: getQuestionId(),
    taskId: task.id,
    domain: 'process',
    type: qType,
    methodology: methodology,
    difficulty: difficulty,
    question: template.question,
    options: qType === 'multiple-choice' || qType === 'multiple-response'
      ? template.options
      : undefined,
    correctAnswer: template.correctAnswer,
    explanation: template.explanation,
    references: {
      task: `Domain 2 ${task.taskNumber}: ${task.name}`,
      principle: template.principle || 'Value',
      ...(template.transcriptLines && { transcriptLines: template.transcriptLines })
    },
    examTip: template.examTip || task.examTip
  };
}

function generateBusinessQuestion(task, qType, difficulty, methodology) {
  const templates = getBusinessQuestionTemplates(task, methodology, difficulty);
  const template = templates[Math.floor(Math.random() * templates.length)];

  return {
    id: getQuestionId(),
    taskId: task.id,
    domain: 'business',
    type: qType,
    methodology: methodology,
    difficulty: difficulty,
    question: template.question,
    options: qType === 'multiple-choice' || qType === 'multiple-response'
      ? template.options
      : undefined,
    correctAnswer: template.correctAnswer,
    explanation: template.explanation,
    references: {
      task: `Domain 3 ${task.taskNumber}: ${task.name}`,
      principle: template.principle || 'Value',
      ...(template.transcriptLines && { transcriptLines: template.transcriptLines })
    },
    examTip: template.examTip || task.examTip
  };
}

function generateFormulaQuestion(formula, variant) {
  const scenarios = getFormulaScenarios(formula, variant);

  return {
    id: getQuestionId(),
    taskId: 'd2t5', // Budget/Resource management
    domain: 'process',
    type: 'multiple-choice',
    methodology: 'predictive',
    difficulty: variant === 0 ? 'easy' : variant === 1 ? 'medium' : 'hard',
    question: scenarios.question,
    options: scenarios.options,
    correctAnswer: scenarios.correctAnswer,
    explanation: scenarios.explanation,
    references: {
      task: 'Domain 2 Task 5: Plan and manage budget and resources',
      formula: formula.name,
      category: formula.category
    },
    examTip: 'Write down all formula values first, then solve step by step'
  };
}

// Save quiz bank
const outputPath = path.join(__dirname, '../data/quiz-bank.json');
fs.writeFileSync(outputPath, JSON.stringify(quizBank, null, 2));

// Generate statistics
const stats = generateStatistics(quizBank);
const statsPath = path.join(__dirname, '../data/quiz-bank-stats.json');
fs.writeFileSync(statsPath, JSON.stringify(stats, null, 2));

console.log(`\n✅ Generated ${quizBank.length} questions`);
console.log(`📊 Statistics saved to: ${statsPath}`);
console.log(`💾 Quiz bank saved to: ${outputPath}`);

function generateStatistics(questions) {
  const stats = {
    totalQuestions: questions.length,
    generatedAt: new Date().toISOString(),
    distribution: {
      byDomain: {},
      byTask: {},
      byType: {},
      byMethodology: {},
      byDifficulty: {}
    },
    targetDistribution: TARGET_COUNTS,
    coverage: {
      totalTasks: 35,
      tasksWithQuestions: new Set(questions.map(q => q.taskId)).size,
      questionsPerTask: {}
    }
  };

  questions.forEach(q => {
    // By domain
    stats.distribution.byDomain[q.domain] = (stats.distribution.byDomain[q.domain] || 0) + 1;

    // By task
    stats.distribution.byTask[q.taskId] = (stats.distribution.byTask[q.taskId] || 0) + 1;

    // By type
    stats.distribution.byType[q.type] = (stats.distribution.byType[q.type] || 0) + 1;

    // By methodology
    stats.distribution.byMethodology[q.methodology] = (stats.distribution.byMethodology[q.methodology] || 0) + 1;

    // By difficulty
    stats.distribution.byDifficulty[q.difficulty] = (stats.distribution.byDifficulty[q.difficulty] || 0) + 1;
  });

  // Calculate percentages
  stats.distribution.byDomainPercentage = {};
  Object.keys(stats.distribution.byDomain).forEach(domain => {
    stats.distribution.byDomainPercentage[domain] =
      Math.round((stats.distribution.byDomain[domain] / questions.length) * 100) + '%';
  });

  stats.distribution.byTypePercentage = {};
  Object.keys(stats.distribution.byType).forEach(type => {
    stats.distribution.byTypePercentage[type] =
      Math.round((stats.distribution.byType[type] / questions.length) * 100) + '%';
  });

  stats.distribution.byMethodologyPercentage = {};
  Object.keys(stats.distribution.byMethodology).forEach(method => {
    stats.distribution.byMethodologyPercentage[method] =
      Math.round((stats.distribution.byMethodology[method] / questions.length) * 100) + '%';
  });

  stats.distribution.byDifficultyPercentage = {};
  Object.keys(stats.distribution.byDifficulty).forEach(diff => {
    stats.distribution.byDifficultyPercentage[diff] =
      Math.round((stats.distribution.byDifficulty[diff] / questions.length) * 100) + '%';
  });

  // Coverage analysis
  stats.coverage.questionsPerTask = stats.distribution.byTask;

  // Find gaps
  stats.coverage.gaps = [];
  Object.keys(stats.distribution.byTask).forEach(taskId => {
    if (stats.distribution.byTask[taskId] < 10) {
      stats.coverage.gaps.push({
        taskId: taskId,
        questionCount: stats.distribution.byTask[taskId],
        needed: 10 - stats.distribution.byTask[taskId]
      });
    }
  });

  return stats;
}

// Template generation functions (these would contain the actual question content)
function getPeopleQuestionTemplates(task, methodology, difficulty) {
  // This is a placeholder - in real implementation, this would return varied question templates
  // For now, I'll load this from a comprehensive templates file
  return require('./question-templates/people-templates.js')(task, methodology, difficulty);
}

function getProcessQuestionTemplates(task, methodology, difficulty) {
  return require('./question-templates/process-templates.js')(task, methodology, difficulty);
}

function getBusinessQuestionTemplates(task, methodology, difficulty) {
  return require('./question-templates/business-templates.js')(task, methodology, difficulty);
}

function getFormulaScenarios(formula, variant) {
  return require('./question-templates/formula-templates.js')(formula, variant);
}
