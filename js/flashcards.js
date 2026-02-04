/**
 * flashcards.js - Leitner Flashcard System
 *
 * Purpose: Implements the Leitner 5-box spaced repetition system
 * for flashcard review and retention.
 *
 * Leitner System:
 * - Box 1 (New): Review every session
 * - Box 2 (Learning): Review every 2 days
 * - Box 3 (Familiar): Review every 4 days
 * - Box 4 (Known): Review every 7 days
 * - Box 5 (Mastered): Review every 14 days
 *
 * Card Movement Rules:
 * - Hard: Move back to Box 1
 * - Medium: Stay in current box
 * - Easy: Move up one box
 *
 * Features:
 * - Load flashcards from data/flashcards-mapped.json
 * - Filter by topic/task ID
 * - Track review statistics
 * - Calculate due dates
 * - Flip animation
 */

import state from './state.js';
import { shuffle, getLeitnerInterval, isCardDue } from './utils.js';

/**
 * Leitner Flashcard System
 * Implements spaced repetition for optimal retention
 */
class FlashcardSystem {
  constructor() {
    this.flashcardBank = null;
    this.currentSession = null;
    this.currentCardIndex = 0;
  }

  /**
   * Initialize flashcard system with card bank
   * @param {Array} cardBank - Array of all flashcards
   */
  init(cardBank) {
    this.flashcardBank = cardBank;
    console.log(`Flashcard system initialized with ${cardBank.length} cards`);
  }

  /**
   * Get flashcard review data from state
   * @param {number} cardId - Card ID
   * @returns {Object} Card review data
   */
  getCardData(cardId) {
    return state.get(`flashcards.${cardId}`) || {
      box: 1,
      lastSeen: null,
      timesReviewed: 0,
      easeFactor: 2.5
    };
  }

  /**
   * Start a flashcard session for a specific task
   * @param {string} taskId - Task ID (e.g., 'd1t1')
   * @param {Object} options - Session options
   * @returns {Object} Session object
   */
  startSession(taskId, options = {}) {
    const {
      maxCards = 20,
      reviewDue = true,  // Include cards due for review
      includeNew = true,  // Include new cards (never seen)
      randomize = true
    } = options;

    if (!this.flashcardBank) {
      throw new Error('Flashcard system not initialized');
    }

    // Filter cards by task ID
    let cards = this.flashcardBank.filter(card => {
      // First try direct mappedTasks match
      if (card.mappedTasks && card.mappedTasks.includes(taskId)) {
        return true;
      }

      // Fallback: Match Mission 1 special IDs by category or domain
      // These are: principles, domains, ethics, exam-strategy
      if (card.category && card.category.toLowerCase() === taskId.toLowerCase()) {
        return true;
      }
      if (card.domain && card.domain.toLowerCase() === taskId.toLowerCase()) {
        return true;
      }

      // Match domain tasks (d1t1-d1t14, d2t1-d2t17, d3t1-d3t4) by domain
      if (taskId.startsWith('d1') && (card.domain === 'people' || card.category === 'People' || card.category === 'Agile')) {
        return true;
      }
      if (taskId.startsWith('d2') && (card.domain === 'process' || (card.category && card.category.startsWith('Process')))) {
        return true;
      }
      if (taskId.startsWith('d3') && (card.domain === 'business' || card.category === 'Business')) {
        return true;
      }

      return false;
    });

    if (cards.length === 0) {
      console.warn(`No flashcards found for task ${taskId}`);
      return null;
    }

    // Categorize cards by review status
    const categorized = cards.map(card => {
      const cardData = this.getCardData(card.id);
      const isDue = isCardDue(cardData);
      const isNew = !cardData.lastSeen;

      return {
        ...card,
        cardData,
        isDue,
        isNew
      };
    });

    // Filter based on options
    let sessionCards = categorized.filter(card => {
      if (includeNew && card.isNew) return true;
      if (reviewDue && card.isDue && !card.isNew) return true;
      return false;
    });

    // If no cards due/new, include some from box 1-2
    if (sessionCards.length === 0) {
      sessionCards = categorized
        .filter(card => card.cardData.box <= 2)
        .slice(0, maxCards);
    }

    // Sort by priority (new cards first, then by box number)
    sessionCards.sort((a, b) => {
      if (a.isNew && !b.isNew) return -1;
      if (!a.isNew && b.isNew) return 1;
      return a.cardData.box - b.cardData.box;
    });

    // Limit to max cards
    sessionCards = sessionCards.slice(0, maxCards);

    // Randomize if requested
    if (randomize) {
      sessionCards = shuffle(sessionCards);
    }

    this.currentSession = {
      taskId,
      cards: sessionCards,
      totalCards: sessionCards.length,
      reviewedCards: 0,
      correctCount: 0,
      startTime: Date.now()
    };

    this.currentCardIndex = 0;

    return this.currentSession;
  }

  /**
   * Get current card
   * @returns {Object} Current flashcard
   */
  getCurrentCard() {
    if (!this.currentSession) return null;
    return this.currentSession.cards[this.currentCardIndex];
  }

  /**
   * Record card review
   * @param {string} response - User response: 'hard', 'medium', 'easy'
   * @returns {Object} Updated card data
   */
  reviewCard(response) {
    if (!this.currentSession) {
      throw new Error('No active flashcard session');
    }

    const card = this.getCurrentCard();
    const isCorrect = response !== 'hard';

    // Record in state (handles box movement)
    state.recordFlashcardReview(card.id, isCorrect);

    // Update session stats
    this.currentSession.reviewedCards++;
    if (isCorrect) {
      this.currentSession.correctCount++;
    }

    // Get updated card data
    const updatedCardData = this.getCardData(card.id);

    // Calculate XP based on difficulty
    const xpRewards = {
      hard: 5,    // Failed, minimal XP
      medium: 10, // Stayed in box, moderate XP
      easy: 15    // Moved up, good XP
    };

    const xpEarned = xpRewards[response] || 10;
    state.addXP(xpEarned);

    return {
      cardData: updatedCardData,
      xpEarned,
      response
    };
  }

  /**
   * Move to next card
   * @returns {boolean} True if more cards available
   */
  nextCard() {
    if (!this.currentSession) return false;

    this.currentCardIndex++;
    return this.currentCardIndex < this.currentSession.totalCards;
  }

  /**
   * Move to previous card
   * @returns {boolean} True if previous card exists
   */
  previousCard() {
    if (!this.currentSession || this.currentCardIndex === 0) return false;

    this.currentCardIndex--;
    return true;
  }

  /**
   * Get session progress
   * @returns {Object} Progress object
   */
  getProgress() {
    if (!this.currentSession) return null;

    return {
      current: this.currentCardIndex + 1,
      total: this.currentSession.totalCards,
      reviewed: this.currentSession.reviewedCards,
      percentage: Math.round((this.currentSession.reviewedCards / this.currentSession.totalCards) * 100)
    };
  }

  /**
   * Complete session and get results
   * @returns {Object} Session results
   */
  completeSession() {
    if (!this.currentSession) return null;

    const totalTime = (Date.now() - this.currentSession.startTime) / 1000;
    const avgTimePerCard = totalTime / this.currentSession.reviewedCards;

    const results = {
      taskId: this.currentSession.taskId,
      totalCards: this.currentSession.totalCards,
      reviewedCards: this.currentSession.reviewedCards,
      correctCount: this.currentSession.correctCount,
      accuracy: Math.round((this.currentSession.correctCount / this.currentSession.reviewedCards) * 100),
      totalTime,
      avgTimePerCard,
      date: new Date().toISOString()
    };

    // Award bonus XP for completing session
    const bonusXP = 25;
    state.addXP(bonusXP);

    return results;
  }

  /**
   * Get cards due for review for a specific task
   * @param {string} taskId - Task ID
   * @returns {Array} Cards due for review
   */
  getDueCards(taskId) {
    if (!this.flashcardBank) return [];

    const cards = this.flashcardBank.filter(card => {
      return card.mappedTasks && card.mappedTasks.includes(taskId);
    });

    return cards.filter(card => {
      const cardData = this.getCardData(card.id);
      return isCardDue(cardData);
    });
  }

  /**
   * Get new cards (never reviewed) for a task
   * @param {string} taskId - Task ID
   * @returns {Array} New cards
   */
  getNewCards(taskId) {
    if (!this.flashcardBank) return [];

    const cards = this.flashcardBank.filter(card => {
      return card.mappedTasks && card.mappedTasks.includes(taskId);
    });

    return cards.filter(card => {
      const cardData = this.getCardData(card.id);
      return !cardData.lastSeen;
    });
  }

  /**
   * Get flashcard statistics for a task
   * @param {string} taskId - Task ID
   * @returns {Object} Statistics
   */
  getTaskStatistics(taskId) {
    if (!this.flashcardBank) return null;

    const cards = this.flashcardBank.filter(card => {
      // First try direct mappedTasks match
      if (card.mappedTasks && card.mappedTasks.includes(taskId)) {
        return true;
      }

      // Fallback: Match Mission 1 special IDs by category or domain
      if (card.category && card.category.toLowerCase() === taskId.toLowerCase()) {
        return true;
      }
      if (card.domain && card.domain.toLowerCase() === taskId.toLowerCase()) {
        return true;
      }

      // Match domain tasks (d1t1-d1t14, d2t1-d2t17, d3t1-d3t4) by domain
      if (taskId.startsWith('d1') && (card.domain === 'people' || card.category === 'People' || card.category === 'Agile')) {
        return true;
      }
      if (taskId.startsWith('d2') && (card.domain === 'process' || (card.category && card.category.startsWith('Process')))) {
        return true;
      }
      if (taskId.startsWith('d3') && (card.domain === 'business' || card.category === 'Business')) {
        return true;
      }

      return false;
    });

    const stats = {
      totalCards: cards.length,
      new: 0,
      learning: 0,    // Box 1-2
      familiar: 0,    // Box 3
      known: 0,       // Box 4
      mastered: 0,    // Box 5
      dueForReview: 0
    };

    cards.forEach(card => {
      const cardData = this.getCardData(card.id);

      if (!cardData.lastSeen) {
        stats.new++;
      } else {
        if (cardData.box <= 2) stats.learning++;
        else if (cardData.box === 3) stats.familiar++;
        else if (cardData.box === 4) stats.known++;
        else if (cardData.box === 5) stats.mastered++;
      }

      if (isCardDue(cardData)) {
        stats.dueForReview++;
      }
    });

    return stats;
  }

  /**
   * Get overall flashcard statistics
   * @returns {Object} Overall statistics
   */
  getOverallStatistics() {
    const progress = state.get('progress');
    const flashcardData = state.get('flashcards');

    const stats = {
      totalReviewed: progress.totalFlashcardsReviewed,
      uniqueCards: Object.keys(flashcardData).length,
      byBox: {
        box1: 0,
        box2: 0,
        box3: 0,
        box4: 0,
        box5: 0
      },
      avgReviewsPerCard: 0
    };

    let totalReviews = 0;

    Object.values(flashcardData).forEach(card => {
      stats.byBox[`box${card.box}`]++;
      totalReviews += card.timesReviewed;
    });

    if (stats.uniqueCards > 0) {
      stats.avgReviewsPerCard = Math.round(totalReviews / stats.uniqueCards * 10) / 10;
    }

    return stats;
  }

  /**
   * Reset current session
   */
  reset() {
    this.currentSession = null;
    this.currentCardIndex = 0;
  }

  /**
   * Get recommended study cards (mix of due + new)
   * @param {string} taskId - Task ID
   * @param {number} count - Number of cards
   * @returns {Array} Recommended cards
   */
  getRecommendedCards(taskId, count = 10) {
    const dueCards = this.getDueCards(taskId);
    const newCards = this.getNewCards(taskId);

    // Mix: 70% due cards, 30% new cards
    const dueCount = Math.min(dueCards.length, Math.ceil(count * 0.7));
    const newCount = Math.min(newCards.length, count - dueCount);

    const recommended = [
      ...dueCards.slice(0, dueCount),
      ...newCards.slice(0, newCount)
    ];

    return shuffle(recommended);
  }
}

// Create and export singleton instance
const flashcardSystem = new FlashcardSystem();

// Make available globally for debugging
if (typeof window !== 'undefined') {
  window.PMP_FLASHCARDS = flashcardSystem;
  window.flashcardSystem = flashcardSystem;  // Alias for easier access
}

export default flashcardSystem;
