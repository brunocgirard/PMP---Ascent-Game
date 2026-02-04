/**
 * quiz.js - Quiz Engine
 *
 * Purpose: Handles quiz generation, presentation, scoring, and feedback.
 * Supports multiple question types and provides detailed analytics.
 *
 * Question Types:
 * - Multiple choice (single answer)
 * - Multiple response (select all that apply)
 * - Matching (drag-and-drop)
 * - True/False
 *
 * Features:
 * - Generate quiz from question bank by topic/task ID
 * - Randomize question and answer order
 * - Track answer selection
 * - Calculate score (require 75%+ to pass)
 * - Provide immediate feedback with explanations
 * - Display final results with domain breakdown
 * - Allow retakes for failed quizzes
 * - Track weak concepts
 *
 * Data Source: data/quiz-bank.json (1,159 questions)
 */

import state from './state.js';
import { shuffle, percentage, getGrade, triggerConfetti, showXPGain } from './utils.js';

/**
 * Quiz Engine Class
 * Manages quiz generation, presentation, and scoring
 */
class QuizEngine {
  constructor() {
    this.quizBank = null;
    this.currentQuiz = null;
    this.currentQuestionIndex = 0;
    this.userAnswers = [];
    this.startTime = null;
    this.questionStartTime = null;
  }

  /**
   * Initialize quiz engine with question bank
   * @param {Array} questionBank - Array of all questions
   */
  init(questionBank) {
    this.quizBank = questionBank;
    console.log(`Quiz engine initialized with ${questionBank.length} questions`);
  }

  /**
   * Generate quiz for a specific task
   * @param {string} taskId - Task ID (e.g., 'd1t1')
   * @param {Object} options - Quiz options
   * @returns {Object} Quiz object
   */
  generateQuiz(taskId, options = {}) {
    const {
      questionCount = 10,
      difficulty = 'mixed',  // 'easy', 'medium', 'hard', 'mixed'
      randomize = true
    } = options;

    if (!taskId) {
      console.error('generateQuiz called with undefined taskId');
      return null;
    }

    if (!this.quizBank) {
      throw new Error('Quiz engine not initialized');
    }

    // Filter questions by task ID
    let questions = this.quizBank.filter(q => {
      // First try direct taskId match
      if (q.taskId === taskId) {
        return true;
      }

      // Fallback: Match Mission 1 special IDs by category or domain
      // These are: principles, domains, ethics, exam-strategy
      if (q.category && q.category.toLowerCase() === taskId.toLowerCase()) {
        return true;
      }
      if (q.domain && q.domain.toLowerCase() === taskId.toLowerCase()) {
        return true;
      }

      // Additional fallback: Match by explanation content for Mission 1 topics
      if (taskId === 'principles' && q.explanation && q.explanation.includes('This relates to Principles')) {
        return true;
      }
      if (taskId === 'domains' && q.explanation && q.explanation.includes('This relates to Domains')) {
        return true;
      }
      if (taskId === 'ethics' && q.explanation && q.explanation.includes('This relates to Ethics')) {
        return true;
      }
      if (taskId === 'exam-strategy' && q.explanation && q.explanation.includes('exam strategy')) {
        return true;
      }

      // Match domain tasks (d1t1-d1t14, d2t1-d2t17, d3t1-d3t4) by domain
      if (taskId.startsWith('d1') && q.domain === 'people') {
        return true;
      }
      if (taskId.startsWith('d2') && q.domain === 'process') {
        return true;
      }
      if (taskId.startsWith('d3') && q.domain === 'business') {
        return true;
      }

      return false;
    });

    if (questions.length === 0) {
      console.warn(`No questions found for task ${taskId}`);
      return null;
    }

    // Filter by difficulty if specified
    if (difficulty !== 'mixed') {
      const filtered = questions.filter(q => q.difficulty === difficulty);
      if (filtered.length > 0) {
        questions = filtered;
      }
    }

    // Randomize if requested
    if (randomize) {
      questions = shuffle(questions);
    }

    // Limit to requested count
    questions = questions.slice(0, Math.min(questionCount, questions.length));

    // Randomize answer options for each question
    questions = questions.map(q => ({
      ...q,
      options: shuffle([...q.options])
    }));

    this.currentQuiz = {
      taskId,
      questions,
      totalQuestions: questions.length,
      passThreshold: 0.75,  // 75% to pass
      difficulty,
      createdAt: new Date().toISOString()
    };

    this.currentQuestionIndex = 0;
    this.userAnswers = [];
    this.startTime = Date.now();
    this.questionStartTime = Date.now();

    return this.currentQuiz;
  }

  /**
   * Get current question
   * @returns {Object} Current question
   */
  getCurrentQuestion() {
    if (!this.currentQuiz) return null;
    return this.currentQuiz.questions[this.currentQuestionIndex];
  }

  /**
   * Submit answer for current question
   * @param {string|Array} answer - User's answer
   * @returns {Object} Answer result with feedback
   */
  submitAnswer(answer) {
    if (!this.currentQuiz) {
      throw new Error('No active quiz');
    }

    const question = this.getCurrentQuestion();
    const timeSpent = (Date.now() - this.questionStartTime) / 1000;

    // Check if answer is correct
    const isCorrect = this.checkAnswer(question, answer);

    // Store answer
    this.userAnswers.push({
      questionId: question.id,
      question: question.question,
      userAnswer: answer,
      correctAnswer: question.correctAnswer,
      isCorrect,
      timeSpent,
      difficulty: question.difficulty
    });

    // Prepare feedback
    const feedback = {
      isCorrect,
      explanation: question.explanation,
      correctAnswer: question.correctAnswer,
      userAnswer: answer,
      timeSpent
    };

    return feedback;
  }

  /**
   * Check if answer is correct
   * @param {Object} question - Question object
   * @param {string|Array} answer - User's answer
   * @returns {boolean} True if correct
   */
  checkAnswer(question, answer) {
    const correctAnswer = question.correctAnswer;

    if (question.type === 'multiple-response') {
      // For multiple response, compare arrays
      if (!Array.isArray(answer)) return false;

      const sortedAnswer = [...answer].sort();
      const sortedCorrect = [...correctAnswer].sort();

      return JSON.stringify(sortedAnswer) === JSON.stringify(sortedCorrect);
    } else {
      // For single answer
      return answer === correctAnswer;
    }
  }

  /**
   * Move to next question
   * @returns {boolean} True if more questions available
   */
  nextQuestion() {
    if (!this.currentQuiz) return false;

    this.currentQuestionIndex++;
    this.questionStartTime = Date.now();

    return this.currentQuestionIndex < this.currentQuiz.totalQuestions;
  }

  /**
   * Move to previous question
   * @returns {boolean} True if previous question exists
   */
  previousQuestion() {
    if (!this.currentQuiz || this.currentQuestionIndex === 0) return false;

    this.currentQuestionIndex--;
    this.questionStartTime = Date.now();

    return true;
  }

  /**
   * Get quiz progress
   * @returns {Object} Progress object
   */
  getProgress() {
    if (!this.currentQuiz) return null;

    return {
      current: this.currentQuestionIndex + 1,
      total: this.currentQuiz.totalQuestions,
      percentage: percentage(this.currentQuestionIndex + 1, this.currentQuiz.totalQuestions)
    };
  }

  /**
   * Calculate quiz results
   * @returns {Object} Quiz results
   */
  calculateResults() {
    if (!this.currentQuiz || this.userAnswers.length === 0) {
      return null;
    }

    const totalQuestions = this.userAnswers.length;
    const correctAnswers = this.userAnswers.filter(a => a.isCorrect).length;
    const score = percentage(correctAnswers, totalQuestions);
    const passed = score >= (this.currentQuiz.passThreshold * 100);

    // Calculate time spent
    const totalTime = (Date.now() - this.startTime) / 1000;
    const avgTimePerQuestion = totalTime / totalQuestions;

    // Group by difficulty
    const byDifficulty = {
      easy: { correct: 0, total: 0 },
      medium: { correct: 0, total: 0 },
      hard: { correct: 0, total: 0 }
    };

    this.userAnswers.forEach(answer => {
      const diff = answer.difficulty;
      if (byDifficulty[diff]) {
        byDifficulty[diff].total++;
        if (answer.isCorrect) {
          byDifficulty[diff].correct++;
        }
      }
    });

    // Calculate XP reward
    const baseXP = 50;
    const bonusXP = Math.floor(score / 10) * 5; // 5 XP per 10%
    const perfectBonus = score === 100 ? 25 : 0;
    const totalXP = baseXP + bonusXP + perfectBonus;

    const results = {
      taskId: this.currentQuiz.taskId,
      totalQuestions,
      correctAnswers,
      score,
      passed,
      grade: getGrade(score),
      totalTime,
      avgTimePerQuestion,
      byDifficulty,
      xpEarned: totalXP,
      userAnswers: this.userAnswers,
      date: new Date().toISOString()
    };

    // Save results to state
    this.saveResults(results);

    return results;
  }

  /**
   * Save quiz results to state
   * @param {Object} results - Quiz results
   */
  saveResults(results) {
    // Record quiz result
    state.recordQuizResult({
      taskId: results.taskId,
      score: results.correctAnswers,
      totalQuestions: results.totalQuestions,
      timeSpent: results.totalTime,
      difficulty: this.currentQuiz.difficulty
    });

    // Add XP
    const xpResult = state.addXP(results.xpEarned);

    // If passed, complete the topic
    if (results.passed) {
      state.completeTopic(results.taskId);
    }

    // Check for achievements
    this.checkAchievements(results, xpResult);
  }

  /**
   * Check and unlock achievements based on quiz results
   * @param {Object} results - Quiz results
   * @param {Object} xpResult - XP addition result
   */
  checkAchievements(results, xpResult) {
    // Perfect score achievement
    if (results.score === 100) {
      state.unlockAchievement('perfect_score');
      triggerConfetti(100);
    }

    // Level up achievement
    if (xpResult.leveledUp) {
      state.unlockAchievement(`level_${xpResult.newLevel}`);
      triggerConfetti(50);
    }

    // First quiz passed
    const quizHistory = state.get('quizHistory');
    if (results.passed && quizHistory.length === 1) {
      state.unlockAchievement('first_quiz_passed');
    }

    // 10 quizzes completed
    if (quizHistory.length === 10) {
      state.unlockAchievement('quiz_master_10');
    }

    // 50 quizzes completed
    if (quizHistory.length === 50) {
      state.unlockAchievement('quiz_master_50');
    }
  }

  /**
   * Get weak areas based on quiz history
   * @param {number} minQuizzes - Minimum quizzes to analyze
   * @returns {Array} Weak topics
   */
  getWeakAreas(minQuizzes = 3) {
    const quizHistory = state.get('quizHistory');

    if (quizHistory.length < minQuizzes) {
      return [];
    }

    // Group by task ID and calculate average score
    const byTask = {};

    quizHistory.forEach(quiz => {
      if (!byTask[quiz.taskId]) {
        byTask[quiz.taskId] = {
          taskId: quiz.taskId,
          totalQuizzes: 0,
          totalScore: 0,
          totalQuestions: 0,
          correctAnswers: 0
        };
      }

      byTask[quiz.taskId].totalQuizzes++;
      byTask[quiz.taskId].totalQuestions += quiz.totalQuestions;
      byTask[quiz.taskId].correctAnswers += quiz.score;
    });

    // Calculate averages and find weak areas (below 75%)
    const weakAreas = Object.values(byTask)
      .map(task => ({
        ...task,
        avgScore: percentage(task.correctAnswers, task.totalQuestions)
      }))
      .filter(task => task.avgScore < 75)
      .sort((a, b) => a.avgScore - b.avgScore);

    return weakAreas;
  }

  /**
   * Reset current quiz
   */
  reset() {
    this.currentQuiz = null;
    this.currentQuestionIndex = 0;
    this.userAnswers = [];
    this.startTime = null;
    this.questionStartTime = null;
  }

  /**
   * Get quiz statistics
   * @returns {Object} Overall quiz statistics
   */
  getStatistics() {
    const quizHistory = state.get('quizHistory');

    if (quizHistory.length === 0) {
      return {
        totalQuizzes: 0,
        avgScore: 0,
        totalQuestions: 0,
        correctAnswers: 0,
        passRate: 0
      };
    }

    const totalQuizzes = quizHistory.length;
    const totalQuestions = quizHistory.reduce((sum, q) => sum + q.totalQuestions, 0);
    const correctAnswers = quizHistory.reduce((sum, q) => sum + q.score, 0);
    const avgScore = percentage(correctAnswers, totalQuestions);
    const passed = quizHistory.filter(q => {
      const score = percentage(q.score, q.totalQuestions);
      return score >= 75;
    }).length;
    const passRate = percentage(passed, totalQuizzes);

    return {
      totalQuizzes,
      avgScore,
      totalQuestions,
      correctAnswers,
      passRate
    };
  }

  /**
   * Get quiz statistics for a specific task
   * @param {string} taskId - Task ID
   * @returns {Object} Task quiz statistics
   */
  getTaskStatistics(taskId) {
    if (!taskId || !this.quizBank) {
      return { totalQuestions: 0 };
    }

    const questions = this.quizBank.filter(q => {
      // First try direct taskId match
      if (q.taskId === taskId) {
        return true;
      }

      // Fallback: Match Mission 1 special IDs by category or domain
      if (q.category && q.category.toLowerCase() === taskId.toLowerCase()) {
        return true;
      }
      if (q.domain && q.domain.toLowerCase() === taskId.toLowerCase()) {
        return true;
      }

      // Additional fallback: Match by explanation content for Mission 1 topics
      if (taskId === 'principles' && q.explanation && q.explanation.includes('This relates to Principles')) {
        return true;
      }
      if (taskId === 'domains' && q.explanation && q.explanation.includes('This relates to Domains')) {
        return true;
      }
      if (taskId === 'ethics' && q.explanation && q.explanation.includes('This relates to Ethics')) {
        return true;
      }
      if (taskId === 'exam-strategy' && q.explanation && q.explanation.includes('exam strategy')) {
        return true;
      }

      // Match domain tasks (d1t1-d1t14, d2t1-d2t17, d3t1-d3t4) by domain
      if (taskId.startsWith('d1') && q.domain === 'people') {
        return true;
      }
      if (taskId.startsWith('d2') && q.domain === 'process') {
        return true;
      }
      if (taskId.startsWith('d3') && q.domain === 'business') {
        return true;
      }

      return false;
    });

    return {
      totalQuestions: questions.length,
      easy: questions.filter(q => q.difficulty === 'easy').length,
      medium: questions.filter(q => q.difficulty === 'medium').length,
      hard: questions.filter(q => q.difficulty === 'hard').length
    };
  }
}

// Create and export singleton instance
const quizEngine = new QuizEngine();

// Make available globally for debugging
if (typeof window !== 'undefined') {
  window.PMP_QUIZ = quizEngine;
  window.quizEngine = quizEngine;  // Alias for easier access
}

export default quizEngine;
