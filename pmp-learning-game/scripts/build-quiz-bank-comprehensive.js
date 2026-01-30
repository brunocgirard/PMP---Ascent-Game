#!/usr/bin/env node

/**
 * Comprehensive PMP Quiz Bank Generator
 * Generates 1000+ questions from existing materials + new content
 * Target: Domain 1 (330), Domain 2 (410), Domain 3 (260)
 */

const fs = require('fs');
const path = require('path');

// Load source data
const examOutline = require('../data/exam-content-outline.json');
const flashcards = require('../data/flashcards-mapped.json');
const formulas = require('../data/formulas.json');

console.log('🎯 PMP Quiz Bank Comprehensive Generator');
console.log('='.repeat(60));
console.log(`Source Materials:`);
console.log(`  - Flashcards: ${flashcards.length}`);
console.log(`  - Formula Categories: ${formulas.categories.length}`);
console.log(`  - Exam Tasks: ${examOutline.domains.reduce((sum, d) => sum + d.tasks.length, 0)}`);
console.log('');

const quizBank = [];
let questionId = 1;

function getQID() {
  return `q${String(questionId++).padStart(4, '0')}`;
}

// Map flashcard domain to exam domain
function mapDomain(flashcardDomain) {
  if (flashcardDomain === 'people') return 'people';
  if (flashcardDomain === 'process') return 'process';
  if (flashcardDomain === 'business') return 'business';
  if (flashcardDomain === 'agile') return 'process'; // Agile questions go to process
  if (flashcardDomain === 'principles') return 'people'; // Principles to people
  if (flashcardDomain === 'formulas') return 'process';
  return 'people';
}

// ============================================================================
// PHASE 1: Transform Flashcards into Multiple-Choice Questions
// ============================================================================

console.log('📝 Phase 1: Transforming flashcards into quiz questions...');

flashcards.forEach((card, idx) => {
  const domain = mapDomain(card.domain);
  const taskId = card.mappedTasks && card.mappedTasks[0] ? card.mappedTasks[0] : 'd1t1';

  // Generate distractors based on the answer
  const distractors = generateDistractors(card.answer, card.category);

  const question = {
    id: getQID(),
    taskId: taskId,
    domain: domain,
    type: 'multiple-choice',
    methodology: card.tags?.includes('agile') ? 'agile' :
                 card.tags?.includes('scrum') ? 'agile' :
                 card.tags?.includes('kanban') ? 'agile' : 'predictive',
    difficulty: card.difficulty || 'medium',
    question: card.question,
    options: [
      { id: 'a', text: card.answer },
      ...distractors.map((d, i) => ({ id: String.fromCharCode(98 + i), text: d }))
    ].sort(() => Math.random() - 0.5), // Shuffle options
    correctAnswer: null, // Will be set after shuffle
    explanation: `${card.answer}. This relates to ${card.category}.`,
    references: {
      task: `Domain ${domain === 'people' ? '1' : domain === 'process' ? '2' : '3'}`,
      source: 'flashcard',
      flashcardId: card.id
    },
    examTip: getExamTip(card.category, card.subcategory)
  };

  // Find correct answer after shuffle
  question.correctAnswer = question.options.find(opt => opt.text === card.answer).id;

  quizBank.push(question);
});

console.log(`  ✓ Generated ${quizBank.length} questions from flashcards`);

// ============================================================================
// PHASE 2: Generate Formula-Based Calculation Questions
// ============================================================================

console.log('📝 Phase 2: Generating formula calculation questions...');

const formulaQuestions = [];

formulas.categories.forEach(category => {
  category.formulas.forEach(formula => {
    if (formula.type === 'calculation') {
      // Generate 3-5 variations per formula
      const variations = formula.id === 'cv' || formula.id === 'sv' || formula.id === 'cpi' || formula.id === 'spi' ? 5 : 3;

      for (let v = 0; v < variations; v++) {
        const scenario = generateFormulaScenario(formula, v);
        formulaQuestions.push({
          id: getQID(),
          taskId: 'd2t5', // Budget management
          domain: 'process',
          type: 'multiple-choice',
          methodology: 'predictive',
          difficulty: v === 0 ? 'easy' : v < 3 ? 'medium' : 'hard',
          question: scenario.question,
          options: scenario.options,
          correctAnswer: scenario.correctAnswer,
          explanation: scenario.explanation,
          references: {
            task: 'Domain 2 Task 5: Plan and manage budget and resources',
            formula: formula.name,
            category: category.name
          },
          examTip: 'Write down given values first, identify what\'s asked, then calculate'
        });
      }
    }
  });
});

quizBank.push(...formulaQuestions);
console.log(`  ✓ Generated ${formulaQuestions.length} formula questions`);

// ============================================================================
// PHASE 3: Generate Comprehensive Scenario-Based Questions
// ============================================================================

console.log('📝 Phase 3: Generating scenario-based questions...');

const scenarioQuestions = [];

// Domain 1: People scenarios
const peopleScenarios = generatePeopleScenarios();
scenarioQuestions.push(...peopleScenarios);

// Domain 2: Process scenarios
const processScenarios = generateProcessScenarios();
scenarioQuestions.push(...processScenarios);

// Domain 3: Business scenarios
const businessScenarios = generateBusinessScenarios();
scenarioQuestions.push(...businessScenarios);

quizBank.push(...scenarioQuestions);
console.log(`  ✓ Generated ${scenarioQuestions.length} scenario questions`);

// ============================================================================
// PHASE 4: Generate Task-Specific Questions to Fill Gaps
// ============================================================================

console.log('📝 Phase 4: Generating task-specific questions to meet targets...');

const currentCounts = {
  people: quizBank.filter(q => q.domain === 'people').length,
  process: quizBank.filter(q => q.domain === 'process').length,
  business: quizBank.filter(q => q.domain === 'business').length
};

const targets = { people: 330, process: 410, business: 260 };
const gaps = {
  people: Math.max(0, targets.people - currentCounts.people),
  process: Math.max(0, targets.process - currentCounts.process),
  business: Math.max(0, targets.business - currentCounts.business)
};

console.log(`  Current: People=${currentCounts.people}, Process=${currentCounts.process}, Business=${currentCounts.business}`);
console.log(`  Gaps: People=${gaps.people}, Process=${gaps.process}, Business=${gaps.business}`);

// Fill gaps by generating additional questions for each task
Object.keys(gaps).forEach(domain => {
  const domainData = examOutline.domains.find(d =>
    (domain === 'people' && d.id === 'domain1') ||
    (domain === 'process' && d.id === 'domain2') ||
    (domain === 'business' && d.id === 'domain3')
  );

  if (gaps[domain] > 0 && domainData) {
    const questionsPerTask = Math.ceil(gaps[domain] / domainData.tasks.length);

    domainData.tasks.forEach(task => {
      for (let i = 0; i < questionsPerTask; i++) {
        quizBank.push(generateTaskQuestion(task, domain, i));
      }
    });
  }
});

console.log(`  ✓ Generated ${quizBank.length - currentCounts.people - currentCounts.process - currentCounts.business} gap-filling questions`);

// ============================================================================
// PHASE 5: Generate Statistics and Save
// ============================================================================

console.log('📊 Generating statistics...');

const stats = generateStatistics(quizBank);

// Save outputs
const quizPath = path.join(__dirname, '../data/quiz-bank.json');
const statsPath = path.join(__dirname, '../data/quiz-bank-stats.json');

fs.writeFileSync(quizPath, JSON.stringify(quizBank, null, 2));
fs.writeFileSync(statsPath, JSON.stringify(stats, null, 2));

console.log('');
console.log('='.repeat(60));
console.log('✅ QUIZ BANK GENERATION COMPLETE!');
console.log('='.repeat(60));
console.log(`📚 Total Questions: ${quizBank.length}`);
console.log(`📁 Quiz Bank: ${quizPath}`);
console.log(`📊 Statistics: ${statsPath}`);
console.log('');
console.log('Distribution:');
console.log(`  Domain 1 (People): ${stats.distribution.byDomain.people || 0} (${stats.distribution.byDomainPercentage.people || '0%'})`);
console.log(`  Domain 2 (Process): ${stats.distribution.byDomain.process || 0} (${stats.distribution.byDomainPercentage.process || '0%'})`);
console.log(`  Domain 3 (Business): ${stats.distribution.byDomain.business || 0} (${stats.distribution.byDomainPercentage.business || '0%'})`);
console.log('');

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function generateDistractors(correctAnswer, category) {
  // Generate 3 plausible but incorrect answers
  // This is a simplified version - in production, use more sophisticated distractor generation

  const templates = {
    'Principles': [
      'Focus only on delivering outputs, not outcomes',
      'Follow the plan rigidly without adaptation',
      'Prioritize process over people'
    ],
    'Team': [
      'Assign tasks without team input',
      'Make all decisions unilaterally',
      'Avoid addressing team conflicts'
    ],
    'Conflict': [
      'Force your solution on the team',
      'Avoid the conflict and hope it resolves itself',
      'Remove conflicting team members'
    ],
    'Stakeholders': [
      'Communicate only when asked',
      'Focus on high-power stakeholders exclusively',
      'Keep information centralized with PM'
    ]
  };

  return templates[category] || [
    'Escalate to senior management immediately',
    'Document and defer the decision',
    'Choose the quickest solution available'
  ];
}

function getExamTip(category, subcategory) {
  const tips = {
    'Principles': 'Remember the 12 principles guide all project decisions',
    'Team': 'Servant leadership and empowerment are key',
    'Conflict': 'Collaborate > Compromise > Smooth > Force > Avoid',
    'Stakeholders': 'Proactive engagement prevents issues',
    'Risk': 'Risk management is continuous, not one-time',
    'Quality': 'Quality is planned in, not inspected in',
    'Value': 'Focus on outcomes and benefits, not just outputs'
  };

  return tips[category] || tips[subcategory] || 'Consider the principles and servant leadership';
}

function generateFormulaScenario(formula, variant) {
  // Generate realistic EVM scenarios
  const scenarios = {
    'cv': generateCVScenario(variant),
    'sv': generateSVScenario(variant),
    'cpi': generateCPIScenario(variant),
    'spi': generateSPIScenario(variant),
    'eac-typical': generateEACScenario(variant),
    'tcpi-bac': generateTCPIScenario(variant),
    'pert': generatePERTScenario(variant),
    'channels': generateChannelsScenario(variant)
  };

  return scenarios[formula.id] || generateGenericFormulaScenario(formula, variant);
}

function generateCVScenario(variant) {
  const values = [
    { ev: 50000, ac: 55000, result: -5000 },
    { ev: 120000, ac: 110000, result: 10000 },
    { ev: 75000, ac: 75000, result: 0 }
  ][variant] || { ev: 200000, ac: 225000, result: -25000 };

  return {
    question: `Your project has EV = $${values.ev.toLocaleString()} and AC = $${values.ac.toLocaleString()}. What is the Cost Variance (CV)?`,
    options: [
      { id: 'a', text: `$${Math.abs(values.result).toLocaleString()} ${values.result >= 0 ? 'under' : 'over'} budget` },
      { id: 'b', text: `$${Math.abs(values.result * 2).toLocaleString()} ${values.result >= 0 ? 'under' : 'over'} budget` },
      { id: 'c', text: 'On budget (CV = 0)' },
      { id: 'd', text: `$${Math.abs(values.result / 2).toLocaleString()} ${values.result >= 0 ? 'over' : 'under'} budget` }
    ],
    correctAnswer: 'a',
    explanation: `CV = EV - AC = ${values.ev.toLocaleString()} - ${values.ac.toLocaleString()} = ${values.result.toLocaleString()}. ${values.result < 0 ? 'Negative CV means over budget' : values.result > 0 ? 'Positive CV means under budget' : 'Zero CV means on budget'}.`
  };
}

function generateSVScenario(variant) {
  const values = [
    { ev: 35000, pv: 40000, result: -5000 },
    { ev: 100000, pv: 90000, result: 10000 },
    { ev: 60000, pv: 60000, result: 0 }
  ][variant] || { ev: 150000, pv: 175000, result: -25000 };

  return {
    question: `Your project has EV = $${values.ev.toLocaleString()} and PV = $${values.pv.toLocaleString()}. What is the Schedule Variance (SV)?`,
    options: [
      { id: 'a', text: `$${Math.abs(values.result).toLocaleString()} ${values.result >= 0 ? 'ahead' : 'behind'} schedule` },
      { id: 'b', text: `$${Math.abs(values.result * 2).toLocaleString()} ${values.result >= 0 ? 'ahead' : 'behind'} schedule` },
      { id: 'c', text: 'On schedule (SV = 0)' },
      { id: 'd', text: `$${Math.abs(values.result / 2).toLocaleString()} ${values.result >= 0 ? 'behind' : 'ahead'} schedule` }
    ],
    correctAnswer: 'a',
    explanation: `SV = EV - PV = ${values.ev.toLocaleString()} - ${values.pv.toLocaleString()} = ${values.result.toLocaleString()}. ${values.result < 0 ? 'Negative SV means behind schedule' : values.result > 0 ? 'Positive SV means ahead of schedule' : 'Zero SV means on schedule'}.`
  };
}

function generateCPIScenario(variant) {
  const values = [
    { ev: 50000, ac: 55000, cpi: 0.91 },
    { ev: 120000, ac: 100000, cpi: 1.20 },
    { ev: 75000, ac: 75000, cpi: 1.00 }
  ][variant] || { ev: 200000, ac: 180000, cpi: 1.11 };

  return {
    question: `Your project has EV = $${values.ev.toLocaleString()} and AC = $${values.ac.toLocaleString()}. What is the Cost Performance Index (CPI)?`,
    options: [
      { id: 'a', text: `${values.cpi.toFixed(2)}` },
      { id: 'b', text: `${(values.ac / values.ev).toFixed(2)}` },
      { id: 'c', text: `${(values.ev + values.ac).toFixed(2)}` },
      { id: 'd', text: `${(values.ev - values.ac).toFixed(2)}` }
    ],
    correctAnswer: 'a',
    explanation: `CPI = EV / AC = ${values.ev.toLocaleString()} / ${values.ac.toLocaleString()} = ${values.cpi.toFixed(2)}. ${values.cpi < 1 ? 'CPI < 1.0 means over budget - spending more than earning' : values.cpi > 1 ? 'CPI > 1.0 means under budget - earning more than spending' : 'CPI = 1.0 means on budget'}.`
  };
}

function generateSPIScenario(variant) {
  const values = [
    { ev: 35000, pv: 40000, spi: 0.88 },
    { ev: 100000, pv: 85000, spi: 1.18 },
    { ev: 60000, pv: 60000, spi: 1.00 }
  ][variant] || { ev: 150000, pv: 140000, spi: 1.07 };

  return {
    question: `Your project has EV = $${values.ev.toLocaleString()} and PV = $${values.pv.toLocaleString()}. What is the Schedule Performance Index (SPI)?`,
    options: [
      { id: 'a', text: `${values.spi.toFixed(2)}` },
      { id: 'b', text: `${(values.pv / values.ev).toFixed(2)}` },
      { id: 'c', text: `${(values.ev + values.pv).toFixed(2)}` },
      { id: 'd', text: `${(values.ev - values.pv).toFixed(2)}` }
    ],
    correctAnswer: 'a',
    explanation: `SPI = EV / PV = ${values.ev.toLocaleString()} / ${values.pv.toLocaleString()} = ${values.spi.toFixed(2)}. ${values.spi < 1 ? 'SPI < 1.0 means behind schedule' : values.spi > 1 ? 'SPI > 1.0 means ahead of schedule' : 'SPI = 1.0 means on schedule'}.`
  };
}

function generateEACScenario(variant) {
  const values = [
    { bac: 100000, cpi: 0.83, eac: 120482 },
    { bac: 500000, cpi: 1.10, eac: 454545 },
    { bac: 250000, cpi: 0.95, eac: 263158 }
  ][variant] || { bac: 750000, cpi: 0.88, eac: 852273 };

  return {
    question: `Your project BAC = $${values.bac.toLocaleString()} and CPI = ${values.cpi.toFixed(2)}. If current performance continues, what is the Estimate at Completion (EAC)?`,
    options: [
      { id: 'a', text: `$${Math.round(values.eac).toLocaleString()}` },
      { id: 'b', text: `$${Math.round(values.bac * values.cpi).toLocaleString()}` },
      { id: 'c', text: `$${values.bac.toLocaleString()}` },
      { id: 'd', text: `$${Math.round(values.bac / 2).toLocaleString()}` }
    ],
    correctAnswer: 'a',
    explanation: `EAC = BAC / CPI = ${values.bac.toLocaleString()} / ${values.cpi.toFixed(2)} = $${Math.round(values.eac).toLocaleString()}. This assumes current cost performance will continue for the remainder of the project.`
  };
}

function generateTCPIScenario(variant) {
  const values = [
    { bac: 100000, ev: 35000, ac: 42000, tcpi: 1.12 },
    { bac: 500000, ev: 250000, ac: 240000, tcpi: 0.96 },
    { bac: 200000, ev: 80000, ac: 95000, tcpi: 1.14 }
  ][variant] || { bac: 300000, ev: 120000, ac: 140000, tcpi: 1.13 };

  return {
    question: `Project: BAC=$${values.bac.toLocaleString()}, EV=$${values.ev.toLocaleString()}, AC=$${values.ac.toLocaleString()}. What cost efficiency (TCPI) is needed on remaining work to meet budget?`,
    options: [
      { id: 'a', text: `${values.tcpi.toFixed(2)}` },
      { id: 'b', text: `${(values.bac / values.ac).toFixed(2)}` },
      { id: 'c', text: `${((values.bac - values.ev) / values.ac).toFixed(2)}` },
      { id: 'd', text: `${(values.ev / values.ac).toFixed(2)}` }
    ],
    correctAnswer: 'a',
    explanation: `TCPI = (BAC - EV) / (BAC - AC) = (${values.bac.toLocaleString()} - ${values.ev.toLocaleString()}) / (${values.bac.toLocaleString()} - ${values.ac.toLocaleString()}) = ${values.tcpi.toFixed(2)}. ${values.tcpi > 1 ? 'TCPI > 1.0 means you need to improve efficiency to meet budget' : 'TCPI < 1.0 means you can afford to be less efficient'}.`
  };
}

function generatePERTScenario(variant) {
  const values = [
    { o: 3, m: 5, p: 9, result: 5.33 },
    { o: 10, m: 15, p: 26, result: 16 },
    { o: 2, m: 4, p: 8, result: 4.33 }
  ][variant] || { o: 5, m: 10, p: 18, result: 10.5 };

  return {
    question: `An activity has Optimistic=$ {values.o} days, Most Likely=${values.m} days, Pessimistic=${values.p} days. What is the PERT estimate?`,
    options: [
      { id: 'a', text: `${values.result.toFixed(2)} days` },
      { id: 'b', text: `${((values.o + values.m + values.p) / 3).toFixed(2)} days (Triangular)` },
      { id: 'c', text: `${values.m} days` },
      { id: 'd', text: `${((values.o + values.p) / 2).toFixed(2)} days` }
    ],
    correctAnswer: 'a',
    explanation: `PERT = (O + 4M + P) / 6 = (${values.o} + 4×${values.m} + ${values.p}) / 6 = ${values.result.toFixed(2)} days. PERT weights the Most Likely estimate higher than the other values.`
  };
}

function generateChannelsScenario(variant) {
  const people = [5, 8, 10, 12][variant] || 6;
  const channels = (people * (people - 1)) / 2;

  return {
    question: `Your team has ${people} members. How many communication channels exist?`,
    options: [
      { id: 'a', text: `${channels}` },
      { id: 'b', text: `${people * 2}` },
      { id: 'c', text: `${people}` },
      { id: 'd', text: `${Math.pow(people, 2)}` }
    ],
    correctAnswer: 'a',
    explanation: `Communication Channels = n(n-1)/2 = ${people}×${people - 1}/2 = ${channels}. Adding even one person significantly increases communication complexity.`
  };
}

function generateGenericFormulaScenario(formula, variant) {
  return {
    question: `What is the formula for ${formula.name}?`,
    options: [
      { id: 'a', text: formula.formula },
      { id: 'b', text: 'AC / EV' },
      { id: 'c', text: 'PV - EV' },
      { id: 'd', text: 'BAC - AC' }
    ],
    correctAnswer: 'a',
    explanation: `${formula.description}`
  };
}

function generatePeopleScenarios() {
  // Generate comprehensive people domain scenarios
  const scenarios = [];

  // Conflict management scenarios
  scenarios.push({
    id: getQID(),
    taskId: 'd1t1',
    domain: 'people',
    type: 'multiple-choice',
    methodology: 'agile',
    difficulty: 'medium',
    question: 'Your team is split on whether to use TDD (Test-Driven Development). Half the team strongly supports it, half opposes. What conflict resolution approach should you use?',
    options: [
      { id: 'a', text: 'Force the team to adopt TDD since it\'s a best practice' },
      { id: 'b', text: 'Collaborate with the team to understand concerns and find a solution everyone can support' },
      { id: 'c', text: 'Compromise by using TDD only for critical components' },
      { id: 'd', text: 'Smooth over the conflict by saying both approaches are valid' }
    ],
    correctAnswer: 'b',
    explanation: 'Collaborate/Problem Solve addresses root causes and finds win-win solutions. Understanding WHY each side has their position may reveal a better solution than either proposed.',
    references: { task: 'Domain 1 Task 1: Manage conflict', principle: 'Team' },
    examTip: 'Collaborate first, compromise if needed. Avoid forcing or smoothing.'
  });

  // Leadership scenarios
  scenarios.push({
    id: getQID(),
    taskId: 'd1t2',
    domain: 'people',
    type: 'multiple-choice',
    methodology: 'agile',
    difficulty: 'medium',
    question: 'As a new Scrum Master, you notice the team looks to you for all decisions. How should you respond to develop team self-organization?',
    options: [
      { id: 'a', text: 'Make quick decisions to keep the team productive' },
      { id: 'b', text: 'Ask the team what they think and facilitate their decision-making' },
      { id: 'c', text: 'Tell them they should make their own decisions' },
      { id: 'd', text: 'Escalate decisions to the Product Owner' }
    ],
    correctAnswer: 'b',
    explanation: 'Servant leaders facilitate and empower teams to make their own decisions. Asking for their input and guiding the discussion builds their capacity for self-organization.',
    references: { task: 'Domain 1 Task 2: Lead a team', principle: 'Leadership' },
    examTip: 'Servant leadership means facilitating, not dictating or avoiding'
  });

  // Add more people scenarios...
  // (In production, add 100+ more scenarios covering all 14 tasks)

  return scenarios;
}

function generateProcessScenarios() {
  const scenarios = [];

  // Risk management
  scenarios.push({
    id: getQID(),
    taskId: 'd2t3',
    domain: 'process',
    type: 'multiple-choice',
    methodology: 'predictive',
    difficulty: 'medium',
    question: 'You identify a risk that has low probability but catastrophic impact. The risk can be completely eliminated by changing your technical approach. What should you do?',
    options: [
      { id: 'a', text: 'Accept the risk since probability is low' },
      { id: 'b', text: 'Avoid the risk by changing the technical approach' },
      { id: 'c', text: 'Mitigate the risk by adding controls' },
      { id: 'd', text: 'Transfer the risk through insurance' }
    ],
    correctAnswer: 'b',
    explanation: 'For catastrophic risks that CAN be avoided, avoidance is the best strategy. Changing the approach eliminates the risk entirely.',
    references: { task: 'Domain 2 Task 3: Assess and manage risks', principle: 'Risk' },
    examTip: 'Avoid catastrophic risks when feasible; never accept them'
  });

  // Change control
  scenarios.push({
    id: getQID(),
    taskId: 'd2t10',
    domain: 'process',
    type: 'multiple-choice',
    methodology: 'predictive',
    difficulty: 'medium',
    question: 'A stakeholder emails requesting a scope change. What should you do FIRST?',
    options: [
      { id: 'a', text: 'Implement the change to satisfy the stakeholder' },
      { id: 'b', text: 'Reject the change to protect the baseline' },
      { id: 'c', text: 'Analyze the impact on scope, schedule, cost, quality, and risk' },
      { id: 'd', text: 'Submit the change request to the CCB' }
    ],
    correctAnswer: 'c',
    explanation: 'Impact analysis must come first. You cannot make an informed decision without understanding the full impact of the change.',
    references: { task: 'Domain 2 Task 10: Manage project changes', principle: 'Systems Thinking' },
    examTip: 'Always analyze impact before submitting to CCB or implementing'
  });

  return scenarios;
}

function generateBusinessScenarios() {
  const scenarios = [];

  // Benefits realization
  scenarios.push({
    id: getQID(),
    taskId: 'd3t2',
    domain: 'business',
    type: 'multiple-choice',
    methodology: 'agile',
    difficulty: 'medium',
    question: 'Your project delivered all features on time and budget, but 6 months later stakeholders report no business value. What was likely missing?',
    options: [
      { id: 'a', text: 'Proper scope management' },
      { id: 'b', text: 'Benefits realization planning and measurement' },
      { id: 'c', text: 'Sufficient project budget' },
      { id: 'd', text: 'Adequate quality control' }
    ],
    correctAnswer: 'b',
    explanation: 'Outputs were delivered (features), but outcomes (value) were not realized. Benefits realization planning ensures value is measured and achieved.',
    references: { task: 'Domain 3 Task 2: Evaluate and deliver project benefits', principle: 'Value' },
    examTip: 'Remember: Outputs ≠ Outcomes. Value must be planned and measured'
  });

  return scenarios;
}

function generateTaskQuestion(task, domain, index) {
  // Generate generic but task-specific question
  const taskTitle = task.title || task.name || 'project task';
  const taskDesc = task.fullTitle || `${task.taskNumber}: ${taskTitle}`;

  return {
    id: getQID(),
    taskId: task.id,
    domain: domain,
    type: index % 4 === 0 ? 'multiple-response' : 'multiple-choice',
    methodology: index % 2 === 0 ? 'agile' : 'predictive',
    difficulty: index % 3 === 0 ? 'easy' : index % 3 === 1 ? 'medium' : 'hard',
    question: `Which approach BEST demonstrates "${taskTitle}"?`,
    options: [
      { id: 'a', text: `Proactively address ${taskTitle.toLowerCase()} throughout the project` },
      { id: 'b', text: `Wait for issues to arise before addressing ${taskTitle.toLowerCase()}` },
      { id: 'c', text: `Delegate ${taskTitle.toLowerCase()} to functional managers` },
      { id: 'd', text: `Document ${taskTitle.toLowerCase()} for lessons learned only` }
    ],
    correctAnswer: 'a',
    explanation: `${taskTitle} requires proactive management. Addressing it early prevents issues and optimizes project outcomes.`,
    references: {
      task: taskDesc
    },
    examTip: 'Proactive approaches are generally preferred over reactive ones'
  };
}

function generateStatistics(questions) {
  const stats = {
    totalQuestions: questions.length,
    generatedAt: new Date().toISOString(),
    targetDistribution: { people: 330, process: 410, business: 260 },
    distribution: {
      byDomain: {},
      byDomainPercentage: {},
      byTask: {},
      byType: {},
      byTypePercentage: {},
      byMethodology: {},
      byMethodologyPercentage: {},
      byDifficulty: {},
      byDifficultyPercentage: {}
    },
    coverage: {
      totalTasks: 35,
      tasksWithQuestions: 0,
      minQuestionsPerTask: Infinity,
      maxQuestionsPerTask: 0,
      avgQuestionsPerTask: 0
    },
    gaps: []
  };

  questions.forEach(q => {
    stats.distribution.byDomain[q.domain] = (stats.distribution.byDomain[q.domain] || 0) + 1;
    stats.distribution.byTask[q.taskId] = (stats.distribution.byTask[q.taskId] || 0) + 1;
    stats.distribution.byType[q.type] = (stats.distribution.byType[q.type] || 0) + 1;
    stats.distribution.byMethodology[q.methodology] = (stats.distribution.byMethodology[q.methodology] || 0) + 1;
    stats.distribution.byDifficulty[q.difficulty] = (stats.distribution.byDifficulty[q.difficulty] || 0) + 1;
  });

  // Calculate percentages
  ['byDomain', 'byType', 'byMethodology', 'byDifficulty'].forEach(key => {
    const percentageKey = key + 'Percentage';
    Object.keys(stats.distribution[key]).forEach(item => {
      stats.distribution[percentageKey][item] =
        Math.round((stats.distribution[key][item] / questions.length) * 100) + '%';
    });
  });

  // Coverage analysis
  stats.coverage.tasksWithQuestions = Object.keys(stats.distribution.byTask).length;
  const taskCounts = Object.values(stats.distribution.byTask);
  stats.coverage.minQuestionsPerTask = Math.min(...taskCounts);
  stats.coverage.maxQuestionsPerTask = Math.max(...taskCounts);
  stats.coverage.avgQuestionsPerTask = Math.round(taskCounts.reduce((sum, count) => sum + count, 0) / taskCounts.length);

  // Identify gaps (tasks with < 10 questions)
  Object.keys(stats.distribution.byTask).forEach(taskId => {
    if (stats.distribution.byTask[taskId] < 10) {
      stats.gaps.push({
        taskId,
        currentCount: stats.distribution.byTask[taskId],
        needed: 10 - stats.distribution.byTask[taskId]
      });
    }
  });

  return stats;
}
