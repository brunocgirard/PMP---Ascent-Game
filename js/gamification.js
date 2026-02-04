/**
 * gamification.js - XP, Levels, and Achievements
 *
 * Purpose: Manages all gamification mechanics including XP rewards,
 * leveling system, achievement badges, and streak tracking.
 *
 * XP Rewards:
 * - Complete learning content: 50 XP
 * - Complete flashcard session: 50 XP
 * - Pass quiz (75%+): 100 XP
 * - Pass quiz (90%+): 150 XP (bonus)
 * - Complete mission: 500 XP
 * - Pass mock exam (75%+): 1,000 XP
 *
 * Levels (0-20,000 XP):
 * 1. PMP Aspirant (0 XP)
 * 2. Novice Hiker (500 XP)
 * 3. Trail Seeker (1,500 XP)
 * 4. Mountain Explorer (3,000 XP)
 * 5. Peak Climber (5,000 XP)
 * 6. Ridge Runner (7,500 XP)
 * 7. Summit Challenger (10,000 XP)
 * 8. Altitude Master (13,000 XP)
 * 9. PMP Candidate (16,000 XP)
 * 10. PMP Master (20,000 XP)
 *
 * Features:
 * - Award XP for activities
 * - Calculate current level
 * - Unlock achievement badges
 * - Track daily streaks
 * - Display level-up animations
 */

import state from './state.js';
import { triggerConfetti, showXPGain } from './utils.js';

/**
 * ============================================
 * XP Rewards Configuration
 * ============================================
 */
export const XP_REWARDS = {
  // Learning activities
  COMPLETE_LEARNING: 50,
  COMPLETE_FLASHCARD_SESSION: 50,
  CORRECT_FLASHCARD_EASY: 15,
  CORRECT_FLASHCARD_MEDIUM: 10,
  CORRECT_FLASHCARD_HARD: 5,

  // Quiz activities
  QUIZ_BASE: 50,
  QUIZ_PERFECT: 25,  // Bonus for 100%
  QUIZ_PASS_BONUS: 25,  // Bonus for passing (75%+)

  // Mission completion
  COMPLETE_TOPIC: 100,
  COMPLETE_MISSION: 500,

  // Mock exam
  MOCK_EXAM_PASS: 1000,
  MOCK_EXAM_PERFECT: 500,  // Bonus

  // Daily activities
  DAILY_LOGIN: 10,
  MAINTAIN_STREAK_7: 50,
  MAINTAIN_STREAK_30: 200,
  MAINTAIN_STREAK_100: 1000
};

/**
 * ============================================
 * Level Definitions
 * ============================================
 */
export const LEVELS = [
  { level: 1, name: 'PMP Aspirant', xpRequired: 0, icon: '🏕️' },
  { level: 2, name: 'Base Camp Explorer', xpRequired: 500, icon: '🥾' },
  { level: 3, name: 'Trail Navigator', xpRequired: 1500, icon: '🧭' },
  { level: 4, name: 'Ridge Climber', xpRequired: 3000, icon: '⛰️' },
  { level: 5, name: 'Peak Challenger', xpRequired: 5000, icon: '🏔️' },
  { level: 6, name: 'Summit Seeker', xpRequired: 7500, icon: '🎯' },
  { level: 7, name: 'Mountain Master', xpRequired: 10000, icon: '👑' },
  { level: 8, name: 'Alpine Expert', xpRequired: 13000, icon: '⭐' },
  { level: 9, name: 'Elevation Elite', xpRequired: 16000, icon: '💎' },
  { level: 10, name: 'PMP Certified', xpRequired: 20000, icon: '🏆' }
];

/**
 * ============================================
 * Achievement Definitions
 * ============================================
 */
export const ACHIEVEMENTS = {
  // First time achievements
  first_login: {
    id: 'first_login',
    name: 'Welcome to the Mountain',
    description: 'Log in for the first time',
    icon: '🏔️',
    xp: 10
  },
  first_quiz_passed: {
    id: 'first_quiz_passed',
    name: 'First Summit',
    description: 'Pass your first quiz',
    icon: '✅',
    xp: 50
  },
  first_mission_complete: {
    id: 'first_mission_complete',
    name: 'Mission Accomplished',
    description: 'Complete your first mission',
    icon: '🎯',
    xp: 100
  },

  // Perfect scores
  perfect_score: {
    id: 'perfect_score',
    name: 'Flawless Victory',
    description: 'Score 100% on a quiz',
    icon: '💯',
    xp: 100
  },
  perfect_score_5: {
    id: 'perfect_score_5',
    name: 'Perfectionist',
    description: 'Score 100% on 5 quizzes',
    icon: '🌟',
    xp: 250
  },

  // Streak achievements
  streak_7: {
    id: 'streak_7',
    name: 'Week Warrior',
    description: 'Maintain a 7-day streak',
    icon: '🔥',
    xp: 100
  },
  streak_30: {
    id: 'streak_30',
    name: 'Monthly Dedication',
    description: 'Maintain a 30-day streak',
    icon: '🔥🔥',
    xp: 500
  },
  streak_100: {
    id: 'streak_100',
    name: 'Unstoppable Force',
    description: 'Maintain a 100-day streak',
    icon: '🔥🔥🔥',
    xp: 2000
  },

  // Quiz mastery
  quiz_master_10: {
    id: 'quiz_master_10',
    name: 'Quiz Novice',
    description: 'Complete 10 quizzes',
    icon: '📝',
    xp: 100
  },
  quiz_master_50: {
    id: 'quiz_master_50',
    name: 'Quiz Expert',
    description: 'Complete 50 quizzes',
    icon: '📚',
    xp: 500
  },
  quiz_master_100: {
    id: 'quiz_master_100',
    name: 'Quiz Legend',
    description: 'Complete 100 quizzes',
    icon: '🏅',
    xp: 1000
  },

  // Flashcard achievements
  flashcard_100: {
    id: 'flashcard_100',
    name: 'Card Collector',
    description: 'Review 100 flashcards',
    icon: '🃏',
    xp: 100
  },
  flashcard_500: {
    id: 'flashcard_500',
    name: 'Memory Master',
    description: 'Review 500 flashcards',
    icon: '🧠',
    xp: 500
  },

  // Level achievements
  level_5: {
    id: 'level_5',
    name: 'Halfway There',
    description: 'Reach level 5',
    icon: '⛰️',
    xp: 250
  },
  level_10: {
    id: 'level_10',
    name: 'Summit Reached',
    description: 'Reach level 10',
    icon: '🏆',
    xp: 1000
  },

  // Domain mastery
  people_master: {
    id: 'people_master',
    name: 'People Domain Master',
    description: 'Complete all People domain missions',
    icon: '👥',
    xp: 500
  },
  process_master: {
    id: 'process_master',
    name: 'Process Domain Master',
    description: 'Complete all Process domain missions',
    icon: '⚙️',
    xp: 500
  },
  business_master: {
    id: 'business_master',
    name: 'Business Domain Master',
    description: 'Complete all Business domain missions',
    icon: '💼',
    xp: 500
  },

  // Mock exam
  mock_exam_passed: {
    id: 'mock_exam_passed',
    name: 'Practice Makes Perfect',
    description: 'Pass a mock exam',
    icon: '📋',
    xp: 500
  }
};

/**
 * ============================================
 * Gamification Manager Class
 * ============================================
 */
class GamificationManager {
  constructor() {
    this.listeners = [];
  }

  /**
   * Get level info for current XP
   * @param {number} xp - Current XP
   * @returns {Object} Level info
   */
  getLevelInfo(xp) {
    let currentLevel = LEVELS[0];
    let nextLevel = LEVELS[1];

    for (let i = LEVELS.length - 1; i >= 0; i--) {
      if (xp >= LEVELS[i].xpRequired) {
        currentLevel = LEVELS[i];
        nextLevel = LEVELS[i + 1] || LEVELS[i];
        break;
      }
    }

    const xpInLevel = xp - currentLevel.xpRequired;
    const xpForNextLevel = nextLevel.xpRequired - currentLevel.xpRequired;
    const progress = nextLevel.level > currentLevel.level
      ? (xpInLevel / xpForNextLevel) * 100
      : 100;

    return {
      currentLevel,
      nextLevel,
      xpInLevel,
      xpForNextLevel,
      progress,
      isMaxLevel: currentLevel.level === LEVELS[LEVELS.length - 1].level
    };
  }

  /**
   * Award XP and check for level up
   * @param {number} amount - XP amount
   * @param {HTMLElement} element - Element to show XP gain animation
   * @returns {Object} Result with levelUp info
   */
  awardXP(amount, element = null) {
    const beforeLevel = state.get('progress.level');
    const result = state.addXP(amount);

    // Show XP gain animation
    if (element) {
      showXPGain(amount, element);
    }

    // Check for level up
    if (result.leveledUp) {
      this.handleLevelUp(result.newLevel);
    }

    return result;
  }

  /**
   * Handle level up event
   * @param {number} newLevel - New level
   */
  handleLevelUp(newLevel) {
    const levelInfo = LEVELS.find(l => l.level === newLevel);

    if (!levelInfo) return;

    // Trigger celebration
    triggerConfetti(100);

    // Show level up modal/toast
    this.showLevelUpNotification(levelInfo);

    // Unlock level achievement
    if (ACHIEVEMENTS[`level_${newLevel}`]) {
      this.unlockAchievement(`level_${newLevel}`);
    }
  }

  /**
   * Show level up notification
   * @param {Object} levelInfo - Level info
   */
  showLevelUpNotification(levelInfo) {
    // Create modal or toast notification
    const modal = document.createElement('div');
    modal.className = 'modal-backdrop';
    modal.innerHTML = `
      <div class="modal level-up-animation">
        <div class="modal-body" style="text-align: center; padding: 3rem;">
          <h2 style="font-size: 3rem; margin-bottom: 1rem;">${levelInfo.icon}</h2>
          <h3 style="margin-bottom: 0.5rem;">Level Up!</h3>
          <p style="font-size: 2rem; font-weight: bold; color: var(--color-primary-blue); margin: 1rem 0;">
            Level ${levelInfo.level}
          </p>
          <p style="font-size: 1.5rem; color: var(--color-text-secondary); margin-bottom: 2rem;">
            ${levelInfo.name}
          </p>
          <button class="btn btn-primary" onclick="this.closest('.modal-backdrop').remove()">
            Continue Climbing! 🏔️
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    // Auto-remove after 5 seconds
    setTimeout(() => {
      if (modal.parentNode) {
        modal.remove();
      }
    }, 5000);
  }

  /**
   * Unlock achievement
   * @param {string} achievementId - Achievement ID
   * @returns {boolean} True if newly unlocked
   */
  unlockAchievement(achievementId) {
    const achievement = ACHIEVEMENTS[achievementId];

    if (!achievement) {
      console.warn(`Achievement ${achievementId} not found`);
      return false;
    }

    const unlocked = state.unlockAchievement(achievementId);

    if (unlocked) {
      // Show achievement notification
      this.showAchievementNotification(achievement);

      // Award XP
      if (achievement.xp) {
        state.addXP(achievement.xp);
      }
    }

    return unlocked;
  }

  /**
   * Show achievement notification
   * @param {Object} achievement - Achievement object
   */
  showAchievementNotification(achievement) {
    const toast = document.createElement('div');
    toast.className = 'toast toast-success achievement-toast';
    toast.innerHTML = `
      <div style="display: flex; align-items: center; gap: 1rem;">
        <span style="font-size: 2rem;">${achievement.icon}</span>
        <div>
          <div class="toast-title">Achievement Unlocked!</div>
          <div class="toast-message">${achievement.name}</div>
          <div style="font-size: 0.75rem; color: var(--color-text-muted);">+${achievement.xp} XP</div>
        </div>
      </div>
    `;

    const container = document.getElementById('toast-container');
    if (container) {
      container.appendChild(toast);

      setTimeout(() => toast.remove(), 5000);
    }
  }

  /**
   * Check and unlock streak achievements
   */
  checkStreakAchievements() {
    const streak = state.get('streak.current');

    if (streak >= 7 && !state.get('progress.achievements').includes('streak_7')) {
      this.unlockAchievement('streak_7');
      this.awardXP(XP_REWARDS.MAINTAIN_STREAK_7);
    }

    if (streak >= 30 && !state.get('progress.achievements').includes('streak_30')) {
      this.unlockAchievement('streak_30');
      this.awardXP(XP_REWARDS.MAINTAIN_STREAK_30);
    }

    if (streak >= 100 && !state.get('progress.achievements').includes('streak_100')) {
      this.unlockAchievement('streak_100');
      this.awardXP(XP_REWARDS.MAINTAIN_STREAK_100);
    }
  }

  /**
   * Check flashcard achievements
   */
  checkFlashcardAchievements() {
    const totalReviewed = state.get('progress.totalFlashcardsReviewed');

    if (totalReviewed >= 100) {
      this.unlockAchievement('flashcard_100');
    }

    if (totalReviewed >= 500) {
      this.unlockAchievement('flashcard_500');
    }
  }

  /**
   * Check quiz achievements
   */
  checkQuizAchievements() {
    const quizHistory = state.get('quizHistory');
    const totalQuizzes = quizHistory.length;

    if (totalQuizzes >= 10) {
      this.unlockAchievement('quiz_master_10');
    }

    if (totalQuizzes >= 50) {
      this.unlockAchievement('quiz_master_50');
    }

    if (totalQuizzes >= 100) {
      this.unlockAchievement('quiz_master_100');
    }

    // Check for perfect scores
    const perfectScores = quizHistory.filter(q => {
      return (q.score / q.totalQuestions) === 1;
    }).length;

    if (perfectScores >= 5) {
      this.unlockAchievement('perfect_score_5');
    }
  }

  /**
   * Get all unlocked achievements
   * @returns {Array} Unlocked achievements
   */
  getUnlockedAchievements() {
    const unlockedIds = state.get('progress.achievements');
    return unlockedIds.map(id => ACHIEVEMENTS[id]).filter(a => a);
  }

  /**
   * Get locked achievements
   * @returns {Array} Locked achievements
   */
  getLockedAchievements() {
    const unlockedIds = state.get('progress.achievements');
    return Object.values(ACHIEVEMENTS).filter(a => !unlockedIds.includes(a.id));
  }

  /**
   * Get achievement progress
   * @returns {Object} Progress stats
   */
  getAchievementProgress() {
    const total = Object.keys(ACHIEVEMENTS).length;
    const unlocked = state.get('progress.achievements').length;

    return {
      total,
      unlocked,
      locked: total - unlocked,
      percentage: Math.round((unlocked / total) * 100)
    };
  }
}

// Create and export singleton instance
const gamification = new GamificationManager();

// Make available globally
if (typeof window !== 'undefined') {
  window.PMP_GAMIFICATION = gamification;
}

export default gamification;
