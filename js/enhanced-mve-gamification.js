/**
 * Enhanced MVE Gamification Extension
 * Adds gamification features specific to Enhanced MVE learn sections
 */

import gamification, { XP_REWARDS } from './gamification.js';
import state from './state.js';

// Enhanced MVE specific XP rewards
export const ENHANCED_MVE_XP = {
  SCENARIO_CORRECT_FIRST: 10,      // Correct on first try
  SCENARIO_BONUS_APPLY: 10,        // Bonus for applying framework in scenario 2
  REFLECTION_SAVED: 5,             // Save personal reflection
  REFERENCE_CARD_DOWNLOAD: 2,      // Download reference card
  SPACED_REP_COMPLETED: 5,         // Complete spaced repetition review
  ALL_CHECKBOXES_CHECKED: 3        // Check all knowledge checkpoints
};

/**
 * Enhanced MVE Progress Tracking
 */
class EnhancedMVETracker {
  constructor() {
    this.initializeStorage();
  }

  /**
   * Initialize localStorage for Enhanced MVE tracking
   */
  initializeStorage() {
    if (!localStorage.getItem('enhanced_mve_progress')) {
      const initialData = {
        reflectionsSaved: {},
        referenceCardsDownloaded: {},
        spacedRepCompleted: {},
        scenarioFirstAttempts: {},
        checklistProgress: {}
      };
      localStorage.setItem('enhanced_mve_progress', JSON.stringify(initialData));
    }
  }

  /**
   * Get Enhanced MVE progress data
   */
  getProgress() {
    return JSON.parse(localStorage.getItem('enhanced_mve_progress') || '{}');
  }

  /**
   * Update Enhanced MVE progress
   */
  updateProgress(data) {
    const current = this.getProgress();
    const updated = { ...current, ...data };
    localStorage.setItem('enhanced_mve_progress', JSON.stringify(updated));
    return updated;
  }

  /**
   * Track reflection saved
   */
  trackReflectionSaved(taskId) {
    const progress = this.getProgress();

    if (!progress.reflectionsSaved[taskId]) {
      progress.reflectionsSaved[taskId] = {
        savedAt: new Date().toISOString(),
        count: 1
      };

      // Award XP
      awardXP(ENHANCED_MVE_XP.REFLECTION_SAVED, 'reflection-saved');

      this.updateProgress(progress);
      return true;
    }

    return false; // Already saved
  }

  /**
   * Track reference card download
   */
  trackReferenceCardDownload(taskId) {
    const progress = this.getProgress();

    if (!progress.referenceCardsDownloaded[taskId]) {
      progress.referenceCardsDownloaded[taskId] = {
        downloadedAt: new Date().toISOString()
      };

      // Award XP
      awardXP(ENHANCED_MVE_XP.REFERENCE_CARD_DOWNLOAD, 'reference-card');

      this.updateProgress(progress);
      return true;
    }

    return false;
  }

  /**
   * Track spaced repetition completion
   */
  trackSpacedRepCompletion(taskId, reviewIndex) {
    const progress = this.getProgress();

    if (!progress.spacedRepCompleted[taskId]) {
      progress.spacedRepCompleted[taskId] = {};
    }

    const reviewKey = `review_${reviewIndex}`;

    if (!progress.spacedRepCompleted[taskId][reviewKey]) {
      progress.spacedRepCompleted[taskId][reviewKey] = {
        completedAt: new Date().toISOString()
      };

      // Award XP
      awardXP(ENHANCED_MVE_XP.SPACED_REP_COMPLETED, 'spaced-rep');

      this.updateProgress(progress);
      return true;
    }

    return false;
  }

  /**
   * Track scenario first attempt
   */
  trackScenarioAttempt(taskId, scenarioNum, isCorrect) {
    const progress = this.getProgress();
    const key = `${taskId}_scenario${scenarioNum}`;

    if (!progress.scenarioFirstAttempts[key]) {
      progress.scenarioFirstAttempts[key] = {
        attemptedAt: new Date().toISOString(),
        firstAttemptCorrect: isCorrect
      };

      // Award XP for correct first attempt
      if (isCorrect) {
        awardXP(ENHANCED_MVE_XP.SCENARIO_CORRECT_FIRST, 'scenario-correct');
      }

      this.updateProgress(progress);
      return true;
    }

    return false;
  }

  /**
   * Track checklist completion
   */
  trackChecklistComplete(taskId) {
    const progress = this.getProgress();

    if (!progress.checklistProgress[taskId]) {
      progress.checklistProgress[taskId] = {
        completedAt: new Date().toISOString()
      };

      // Award XP
      awardXP(ENHANCED_MVE_XP.ALL_CHECKBOXES_CHECKED, 'checklist-complete');

      this.updateProgress(progress);
      return true;
    }

    return false;
  }

  /**
   * Get user progress for Progress Dashboard
   */
  getUserProgress() {
    const stateProgress = state.get('progress');
    const enhancedProgress = this.getProgress();

    // Calculate level info
    const totalXP = stateProgress.totalXP || 0;
    const levelInfo = gamification.getLevelInfo(totalXP);

    // Calculate task completion
    const completedTasks = Object.keys(stateProgress.completedTopics || {}).length;

    // Calculate day streak
    const dayStreak = state.get('streak.current') || 0;

    return {
      tasksCompleted: completedTasks,
      totalXP: totalXP,
      dayStreak: dayStreak,
      level: `Level ${levelInfo.currentLevel.level}`,
      levelName: levelInfo.currentLevel.name,
      levelIcon: levelInfo.currentLevel.icon,
      nextLevelProgress: Math.round(levelInfo.progress),

      // Enhanced MVE specific
      reflectionsSaved: Object.keys(enhancedProgress.reflectionsSaved || {}).length,
      referenceCardsDownloaded: Object.keys(enhancedProgress.referenceCardsDownloaded || {}).length,
      spacedRepReviews: this.countSpacedRepReviews(enhancedProgress),
      scenariosCompleted: Object.keys(enhancedProgress.scenarioFirstAttempts || {}).length
    };
  }

  /**
   * Get domain-specific progress
   */
  getDomainProgress(domain) {
    const missions = {
      'People': { total: 14, domainCode: 'd1' },
      'Process': { total: 17, domainCode: 'd2' },
      'Business': { total: 4, domainCode: 'd3' }
    };

    const config = missions[domain];
    if (!config) return { completed: 0, total: 0, percentage: 0 };

    const completedTopics = state.get('progress.completedTopics') || {};
    const completed = Object.keys(completedTopics).filter(key =>
      key.startsWith(config.domainCode)
    ).length;

    const percentage = Math.round((completed / config.total) * 100);

    return {
      completed,
      total: config.total,
      percentage
    };
  }

  /**
   * Count total spaced repetition reviews completed
   */
  countSpacedRepReviews(progress) {
    const spacedRep = progress.spacedRepCompleted || {};
    let count = 0;

    Object.values(spacedRep).forEach(taskReviews => {
      count += Object.keys(taskReviews).length;
    });

    return count;
  }

  /**
   * Get statistics for analytics
   */
  getStatistics() {
    const progress = this.getProgress();

    return {
      totalReflections: Object.keys(progress.reflectionsSaved || {}).length,
      totalReferenceCards: Object.keys(progress.referenceCardsDownloaded || {}).length,
      totalSpacedRepReviews: this.countSpacedRepReviews(progress),
      totalScenariosAttempted: Object.keys(progress.scenarioFirstAttempts || {}).length,
      scenarioFirstAttemptAccuracy: this.calculateScenarioAccuracy(progress)
    };
  }

  /**
   * Calculate scenario first attempt accuracy
   */
  calculateScenarioAccuracy(progress) {
    const attempts = Object.values(progress.scenarioFirstAttempts || {});
    if (attempts.length === 0) return 0;

    const correct = attempts.filter(a => a.firstAttemptCorrect).length;
    return Math.round((correct / attempts.length) * 100);
  }
}

// Create singleton instance
const enhancedMVETracker = new EnhancedMVETracker();

/**
 * Award XP (wrapper function)
 */
export function awardXP(amount, source = '') {
  return gamification.awardXP(amount);
}

/**
 * Global helper functions for use in Enhanced MVE renderer
 */
if (typeof window !== 'undefined') {
  // Make tracker available globally
  window.ENHANCED_MVE_TRACKER = enhancedMVETracker;

  // Helper function for getUserProgress (used by Progress Dashboard)
  window.getUserProgress = () => enhancedMVETracker.getUserProgress();

  // Helper function for getDomainProgress
  window.getDomainProgress = (domain) => enhancedMVETracker.getDomainProgress(domain);

  // Helper function to award XP globally
  window.awardXP = awardXP;

  // Expose tracking functions
  window.trackReflectionSaved = (taskId) => {
    return enhancedMVETracker.trackReflectionSaved(taskId);
  };

  window.trackReferenceCardDownload = (taskId) => {
    return enhancedMVETracker.trackReferenceCardDownload(taskId);
  };

  window.trackSpacedRepCompletion = (taskId, reviewIndex) => {
    return enhancedMVETracker.trackSpacedRepCompletion(taskId, reviewIndex);
  };

  window.trackScenarioAttempt = (taskId, scenarioNum, isCorrect) => {
    return enhancedMVETracker.trackScenarioAttempt(taskId, scenarioNum, isCorrect);
  };

  window.trackChecklistComplete = (taskId) => {
    return enhancedMVETracker.trackChecklistComplete(taskId);
  };
}

export default enhancedMVETracker;
