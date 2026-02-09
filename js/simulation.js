import state from './state.js';

class SimulationEngine {
  constructor() {
    this.simulationBank = null;
    this.currentSimulation = null;
    this.currentDecisionIndex = 0;
    this.projectKPIs = null;
    this.decisions = [];
    this.kpiHistory = [];
    this.startTime = null;
  }

  init(bank) {
    this.simulationBank = bank;
    console.log(`Simulation engine initialized with ${Object.keys(bank).length} scenarios`);
  }

  generateSimulation(taskId, options = {}) {
    if (!this.simulationBank || !this.simulationBank[taskId]) {
      return null;
    }

    this.currentSimulation = this.simulationBank[taskId];
    this.currentDecisionIndex = 0;
    this.projectKPIs = { budget: 70, schedule: 70, morale: 70, stakeholders: 70, risk: 30 };
    this.decisions = [];
    this.kpiHistory = [{ ...this.projectKPIs }];
    this.startTime = Date.now();

    return this.currentSimulation;
  }

  getCurrentDecision() {
    if (!this.currentSimulation || !this.currentSimulation.decisions) {
      return null;
    }
    if (this.currentDecisionIndex >= this.currentSimulation.decisions.length) {
      return null;
    }
    return this.currentSimulation.decisions[this.currentDecisionIndex];
  }

  submitDecision(optionIndex) {
    const decision = this.getCurrentDecision();
    if (!decision) return null;

    const option = decision.options[optionIndex];
    if (!option) return null;

    const impact = option.kpiImpact || {};

    for (const [key, value] of Object.entries(impact)) {
      if (this.projectKPIs[key] !== undefined) {
        this.projectKPIs[key] = Math.max(0, Math.min(100, this.projectKPIs[key] + value));
      }
    }

    this.decisions.push({
      decisionIndex: this.currentDecisionIndex,
      optionIndex,
      optionText: option.text,
      option,
      kpiImpact: impact
    });

    this.kpiHistory.push({ ...this.projectKPIs });

    return {
      kpiChanges: impact,
      feedback: option.feedback,
      newKPIs: { ...this.projectKPIs },
      option
    };
  }

  nextDecision() {
    this.currentDecisionIndex++;
    return this.currentDecisionIndex < this.currentSimulation.decisions.length;
  }

  getProgress() {
    const total = this.currentSimulation ? this.currentSimulation.decisions.length : 0;
    const current = this.currentDecisionIndex + 1;
    return {
      current,
      total,
      percentage: total > 0 ? Math.round((current / total) * 100) : 0
    };
  }

  calculateResults() {
    const kpi = this.projectKPIs;
    const score = Math.round(
      kpi.budget * 0.25 +
      kpi.schedule * 0.25 +
      kpi.morale * 0.20 +
      kpi.stakeholders * 0.20 +
      (100 - kpi.risk) * 0.10
    );

    let rating;
    if (score >= 90) rating = 'Exemplary';
    else if (score >= 75) rating = 'Thriving';
    else if (score >= 60) rating = 'Stable';
    else if (score >= 40) rating = 'Struggling';
    else rating = 'Crisis';

    const xpEarned = 60 + Math.floor(score / 10) * 3 + (score >= 90 ? 25 : 0);

    return {
      taskId: this.currentSimulation ? this.currentSimulation.taskId || null : null,
      score,
      rating,
      xpEarned,
      finalKPIs: { ...this.projectKPIs },
      kpiHistory: [...this.kpiHistory],
      decisions: [...this.decisions],
      totalTime: this.startTime ? Date.now() - this.startTime : 0,
      passed: score >= 60
    };
  }

  reset() {
    this.currentSimulation = null;
    this.currentDecisionIndex = 0;
    this.projectKPIs = null;
    this.decisions = [];
    this.kpiHistory = [];
    this.startTime = null;
  }
}

const simulationEngine = new SimulationEngine();
if (typeof window !== 'undefined') {
  window.PMP_SIMULATION = simulationEngine;
  window.simulationEngine = simulationEngine;
}
export default simulationEngine;
