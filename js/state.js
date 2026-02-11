/**
 * state.js - Centralized State Management
 *
 * Purpose: Manages all application state using Observable pattern.
 * Provides a single source of truth for user progress, settings, and game state.
 *
 * State Structure:
 * - user: { examDate, dailyGoal, tutorialCompleted }
 * - progress: { completedTopics, completedMissions, xp, level, achievements }
 * - flashcards: { [cardId]: { box, lastSeen, timesReviewed } }
 * - quizHistory: [ { topicId, score, date, timeSpent } ]
 * - mockExams: [ { examNumber, score, domainScores, date } ]
 * - streak: { current, longest, lastActiveDate }
 *
 * Features:
 * - Observable pattern for state changes
 * - Auto-save to localStorage
 * - State hydration from localStorage
 * - Export/import functionality
 */

/**
 * Observable State Manager
 * Implements the Observer pattern for reactive state updates
 */
const STATE_LIMITS = {
  quizHistory: 500,
  mockExams: 100,
  completedTopics: 1000,
  completedMissions: 200,
  achievements: 300,
  miniTests: 300
};

class StateManager {
  constructor() {
    this.state = this.getInitialState();
    this.listeners = new Map(); // key: stateKey, value: Set of callback functions
    this.saveTimeout = null;
    this.saveDelayMs = 250;
    this.loadFromStorage();

    if (typeof window !== 'undefined') {
      window.addEventListener('beforeunload', () => this.saveToStorage(true));
    }
  }

  /**
   * Get initial/default state structure
   */
  getInitialState() {
    return {
      user: {
        examDate: null,
        dailyGoal: 15, // minutes per day
        tutorialCompleted: false,
        name: '',
        startDate: new Date().toISOString()
      },
      progress: {
        completedTopics: [], // Array of topic IDs
        completedMissions: [], // Array of mission IDs
        xp: 0,
        level: 1,
        achievements: [], // Array of achievement IDs
        totalQuestionsAnswered: 0,
        correctAnswers: 0,
        totalFlashcardsReviewed: 0,
        // Mission 6 specific tracking
        miniTests: [], // Array of mini test results
        formulaMastery: {}, // { [formulaId]: { attempts, correct, mastered } }
        scenariosPracticed: 0,
        weakAreasPracticed: 0
      },
      flashcards: {
        // Structure: { [cardId]: { box: 1-5, lastSeen: Date, timesReviewed: 0, easeFactor: 2.5 } }
      },
      quizHistory: [
        // { topicId, score, totalQuestions, date, timeSpent, difficulty }
      ],
      mockExams: [
        // { examNumber, score, domainScores: {people, process, business}, date, timeSpent, passed }
      ],
      streak: {
        current: 0,
        longest: 0,
        lastActiveDate: null
      },
      settings: {
        soundEnabled: true,
        animationsEnabled: true,
        theme: 'light',
        dailyReminderTime: '09:00'
      },
      currentSession: {
        startTime: null,
        currentMission: null,
        currentTask: null,
        todayMinutes: 0
      }
    };
  }

  /**
   * Subscribe to state changes for a specific key
   * @param {string} key - State key to watch (e.g., 'progress', 'streak')
   * @param {Function} callback - Function to call when state changes
   * @returns {Function} Unsubscribe function
   */
  subscribe(key, callback) {
    if (!this.listeners.has(key)) {
      this.listeners.set(key, new Set());
    }
    this.listeners.get(key).add(callback);

    // Return unsubscribe function
    return () => {
      this.listeners.get(key).delete(callback);
    };
  }

  /**
   * Notify all listeners for a specific state key
   * @param {string} key - State key that changed
   * @param {*} newValue - New value of the state
   */
  notify(key, newValue) {
    if (this.listeners.has(key)) {
      this.listeners.get(key).forEach(callback => {
        try {
          callback(newValue, key);
        } catch (error) {
          console.error(`Error in state listener for ${key}:`, error);
        }
      });
    }

    // Also notify global listeners (subscribed to '*')
    if (this.listeners.has('*')) {
      this.listeners.get('*').forEach(callback => {
        try {
          callback(this.state, key);
        } catch (error) {
          console.error('Error in global state listener:', error);
        }
      });
    }
  }

  /**
   * Get state value
   * @param {string} path - Dot-notation path (e.g., 'progress.xp')
   * @returns {*} State value
   */
  get(path) {
    if (!path) return this.state;

    const keys = path.split('.');
    let value = this.state;

    for (const key of keys) {
      if (value === undefined || value === null) return undefined;
      value = value[key];
    }

    return value;
  }

  /**
   * Set state value and notify listeners
   * @param {string} path - Dot-notation path (e.g., 'progress.xp')
   * @param {*} value - New value
   * @param {boolean} save - Whether to auto-save to localStorage (default: true)
   */
  set(path, value, save = true) {
    const keys = path.split('.');
    const topLevelKey = keys[0];

    // Navigate to the nested property
    let current = this.state;
    for (let i = 0; i < keys.length - 1; i++) {
      if (!(keys[i] in current)) {
        current[keys[i]] = {};
      }
      current = current[keys[i]];
    }

    // Set the value
    const lastKey = keys[keys.length - 1];
    current[lastKey] = value;

    // Notify listeners
    this.notify(topLevelKey, this.state[topLevelKey]);

    // Auto-save to localStorage
    if (save) {
      this.saveToStorage();
    }
  }

  /**
   * Update state by merging with existing state
   * @param {string} path - Dot-notation path
   * @param {Object} updates - Object with updates to merge
   * @param {boolean} save - Whether to auto-save
   */
  update(path, updates, save = true) {
    const currentValue = this.get(path);
    const newValue = { ...currentValue, ...updates };
    this.set(path, newValue, save);
  }

  limitArray(array, max) {
    if (!Array.isArray(array)) return [];
    if (array.length <= max) return array;
    return array.slice(-max);
  }

  limitUniqueArray(array, max) {
    if (!Array.isArray(array)) return [];
    const seen = new Set();
    const deduped = [];
    for (let i = array.length - 1; i >= 0; i--) {
      const value = array[i];
      if (!seen.has(value)) {
        seen.add(value);
        deduped.push(value);
      }
    }
    deduped.reverse();
    if (deduped.length <= max) return deduped;
    return deduped.slice(-max);
  }

  getBoundedStateSnapshot() {
    return {
      ...this.state,
      progress: {
        ...this.state.progress,
        completedTopics: this.limitUniqueArray(this.state.progress.completedTopics, STATE_LIMITS.completedTopics),
        completedMissions: this.limitUniqueArray(this.state.progress.completedMissions, STATE_LIMITS.completedMissions),
        achievements: this.limitUniqueArray(this.state.progress.achievements, STATE_LIMITS.achievements),
        miniTests: this.limitArray(this.state.progress.miniTests, STATE_LIMITS.miniTests)
      },
      quizHistory: this.limitArray(this.state.quizHistory, STATE_LIMITS.quizHistory),
      mockExams: this.limitArray(this.state.mockExams, STATE_LIMITS.mockExams)
    };
  }

  /**
   * Save entire state to localStorage
   */
  saveToStorage(immediate = false) {
    if (!immediate) {
      clearTimeout(this.saveTimeout);
      this.saveTimeout = setTimeout(() => this.saveToStorage(true), this.saveDelayMs);
      return;
    }

    clearTimeout(this.saveTimeout);

    try {
      const boundedState = this.getBoundedStateSnapshot();
      this.state = boundedState;
      localStorage.setItem('pmpPrepState', JSON.stringify(boundedState));
    } catch (error) {
      console.error('Failed to save state to localStorage:', error);
    }
  }

  /**
   * Load state from localStorage
   */
  loadFromStorage() {
    try {
      const saved = localStorage.getItem('pmpPrepState');
      if (saved) {
        const loadedState = JSON.parse(saved);
        // Merge with initial state to ensure all keys exist
        this.state = this.deepMerge(this.getInitialState(), loadedState);
        this.state = this.getBoundedStateSnapshot();

        // Update streak on load
        this.updateStreak();

        console.log('State loaded from localStorage');
      }
    } catch (error) {
      console.error('Failed to load state from localStorage:', error);
      this.state = this.getInitialState();
    }
  }

  /**
   * Deep merge two objects
   * @param {Object} target - Target object
   * @param {Object} source - Source object
   * @returns {Object} Merged object
   */
  deepMerge(target, source) {
    const result = { ...target };

    for (const key in source) {
      if (source[key] instanceof Object && !Array.isArray(source[key])) {
        result[key] = this.deepMerge(result[key] || {}, source[key]);
      } else {
        result[key] = source[key];
      }
    }

    return result;
  }

  /**
   * Reset state to initial values
   */
  reset() {
    if (confirm('Are you sure you want to reset all progress? This cannot be undone.')) {
      this.state = this.getInitialState();
      this.saveToStorage(true);
      this.notify('*', this.state);
      console.log('State reset to initial values');
    }
  }

  /**
   * Export state as JSON string
   * @returns {string} JSON string of state
   */
  exportState() {
    return JSON.stringify(this.state, null, 2);
  }

  /**
   * Import state from JSON string
   * @param {string} jsonString - JSON string of state
   * @returns {boolean} Success status
   */
  importState(jsonString) {
    try {
      const importedState = JSON.parse(jsonString);
      this.state = this.deepMerge(this.getInitialState(), importedState);
      this.state = this.getBoundedStateSnapshot();
      this.saveToStorage(true);
      this.notify('*', this.state);
      console.log('State imported successfully');
      return true;
    } catch (error) {
      console.error('Failed to import state:', error);
      return false;
    }
  }

  /**
   * Update streak based on last active date
   */
  updateStreak() {
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    const lastActive = this.state.streak.lastActiveDate;

    if (!lastActive) {
      // First time user
      this.set('streak.current', 0, false);
      return;
    }

    const lastActiveDate = new Date(lastActive).toISOString().split('T')[0];
    const daysDiff = Math.floor((now - new Date(lastActive)) / (1000 * 60 * 60 * 24));

    if (today === lastActiveDate) {
      // Already active today, no change
      return;
    } else if (daysDiff === 1) {
      // Consecutive day, increment streak
      // Will be incremented when user completes first activity
      return;
    } else if (daysDiff > 1) {
      // Streak broken
      this.set('streak.current', 0, false);
    }
  }

  /**
   * Mark today as active and update streak
   */
  markDailyActivity() {
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    const lastActive = this.state.streak.lastActiveDate;

    if (!lastActive || new Date(lastActive).toISOString().split('T')[0] !== today) {
      // First activity today
      const newStreak = this.state.streak.current + 1;
      this.update('streak', {
        current: newStreak,
        longest: Math.max(newStreak, this.state.streak.longest),
        lastActiveDate: now.toISOString()
      });

      return true; // New day
    }

    return false; // Already active today
  }

  /**
   * Add XP and check for level up
   * @param {number} amount - XP to add
   * @returns {Object} { leveledUp: boolean, newLevel: number }
   */
  addXP(amount) {
    const currentXP = this.state.progress.xp;
    const currentLevel = this.state.progress.level;
    const newXP = currentXP + amount;

    // XP required for level = level * 500
    const xpForNextLevel = currentLevel * 500;

    let newLevel = currentLevel;
    let leveledUp = false;

    if (newXP >= xpForNextLevel) {
      newLevel = currentLevel + 1;
      leveledUp = true;
    }

    this.set('progress.xp', newXP);

    if (leveledUp) {
      this.set('progress.level', newLevel);
    }

    return { leveledUp, newLevel, xpGained: amount };
  }

  /**
   * Record flashcard review (Leitner system)
   * @param {number} cardId - Flashcard ID
   * @param {boolean} correct - Whether user got it correct
   */
  recordFlashcardReview(cardId, correct) {
    const cardData = this.state.flashcards[cardId] || {
      box: 1,
      lastSeen: null,
      timesReviewed: 0,
      easeFactor: 2.5
    };

    const now = new Date().toISOString();

    if (correct) {
      // Move to next box (max 5)
      cardData.box = Math.min(5, cardData.box + 1);
      cardData.easeFactor = Math.min(3.0, cardData.easeFactor + 0.1);
    } else {
      // Move back to box 1
      cardData.box = 1;
      cardData.easeFactor = Math.max(1.3, cardData.easeFactor - 0.2);
    }

    cardData.lastSeen = now;
    cardData.timesReviewed += 1;

    this.set(`flashcards.${cardId}`, cardData);
    this.set('progress.totalFlashcardsReviewed', this.state.progress.totalFlashcardsReviewed + 1);
  }

  /**
   * Record quiz result
   * @param {Object} quizData - Quiz result data
   */
  recordQuizResult(quizData) {
    this.state.quizHistory.push({
      ...quizData,
      date: new Date().toISOString()
    });
    this.state.quizHistory = this.limitArray(this.state.quizHistory, STATE_LIMITS.quizHistory);

    this.set('progress.totalQuestionsAnswered',
      this.state.progress.totalQuestionsAnswered + quizData.totalQuestions,
      false);
    this.set('progress.correctAnswers',
      this.state.progress.correctAnswers + quizData.score,
      false);

    this.saveToStorage();
    this.notify('quizHistory', this.state.quizHistory);
  }

  /**
   * Unlock achievement
   * @param {string} achievementId - Achievement ID
   */
  unlockAchievement(achievementId) {
    if (!this.state.progress.achievements.includes(achievementId)) {
      this.state.progress.achievements.push(achievementId);
      this.state.progress.achievements = this.limitUniqueArray(
        this.state.progress.achievements,
        STATE_LIMITS.achievements
      );
      this.saveToStorage();
      this.notify('progress', this.state.progress);
      return true; // Achievement newly unlocked
    }
    return false; // Already unlocked
  }

  /**
   * Complete a mission
   * @param {string} missionId - Mission ID
   */
  completeMission(missionId) {
    if (!this.state.progress.completedMissions.includes(missionId)) {
      this.state.progress.completedMissions.push(missionId);
      this.state.progress.completedMissions = this.limitUniqueArray(
        this.state.progress.completedMissions,
        STATE_LIMITS.completedMissions
      );
      this.saveToStorage();
      this.notify('progress', this.state.progress);
    }
  }

  /**
   * Complete a topic/task
   * @param {string} topicId - Topic/Task ID
   */
  completeTopic(topicId) {
    if (!this.state.progress.completedTopics.includes(topicId)) {
      this.state.progress.completedTopics.push(topicId);
      this.state.progress.completedTopics = this.limitUniqueArray(
        this.state.progress.completedTopics,
        STATE_LIMITS.completedTopics
      );
      this.saveToStorage();
      this.notify('progress', this.state.progress);
    }
  }
}

// Create and export singleton instance
const state = new StateManager();

// Make available globally for debugging
if (typeof window !== 'undefined') {
  window.PMP_STATE = state;
}

export default state;
