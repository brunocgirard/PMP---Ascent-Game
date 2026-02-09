/**
 * task-flow-manager.js - Task Learning Flow Management
 *
 * Purpose: Manages the 3-phase learning flow for each task:
 * 1. Learn Phase (Base Camp)
 * 2. Flashcard Phase (Mid Camp)
 * 3. Quiz Phase (Summit Push)
 *
 * Features:
 * - Task landing page with briefing
 * - Progress tracking across phases
 * - Resume functionality
 * - Smart phase unlocking
 * - Celebration modals
 */

import state from './state.js';
import gamification from './gamification.js';
import missionManager from './missions.js';

class TaskFlowManager {
  constructor() {
    this.currentTaskId = null;
    this.currentPhase = null;
  }

  /**
   * Get task progress from state
   * @param {string} taskId - Task ID
   * @returns {Object} Task progress data
   */
  getTaskProgress(taskId) {
    return state.get(`taskProgress.${taskId}`) || {
      learnPhase: {
        completed: false,
        currentSection: 0,
        visitedSections: [],
        timeSpent: 0,
        startedAt: null
      },
      flashcardsPhase: {
        completed: false,
        cardsReviewed: 0,
        totalCards: 0,
        sessionActive: false,
        bestScore: 0
      },
      quizPhase: {
        completed: false,
        attempts: 0,
        highScore: 0,
        lastAttemptScore: 0,
        passed: false
      },
      simulationPhase: {
        completed: false,
        attempts: 0,
        highScore: 0,
        lastScore: 0,
        passed: false
      },
      overallCompleted: false,
      altitude: 0 // Progress meters gained
    };
  }

  /**
   * Update task progress
   * @param {string} taskId - Task ID
   * @param {Object} updates - Progress updates
   */
  updateTaskProgress(taskId, updates) {
    const current = this.getTaskProgress(taskId);
    const updated = { ...current, ...updates };
    state.set(`taskProgress.${taskId}`, updated);
    return updated;
  }

  /**
   * Render task landing page (Mission Briefing)
   * @param {string} taskId - Task ID
   * @returns {string} HTML
   */
  renderTaskLanding(taskId) {
    const taskData = missionManager.getTask(taskId);
    if (!taskData) {
      return '<div class="error">Task not found</div>';
    }

    const progress = this.getTaskProgress(taskId);
    const hasResumePoint = this.hasResumePoint(progress);

    return `
      <div class="task-landing-page">
        <div class="task-header">
          <div class="task-icon">${this.getTaskIcon(taskData)}</div>
          <h1 class="task-title">${taskData.taskNumber || taskId}: ${taskData.name}</h1>
          <div class="task-meta">
            <span class="altitude-marker">📍 Altitude: ${this.getAltitudeRange(taskData)}</span>
            <span class="time-estimate">⏱️ Estimated: 15-20 minutes</span>
            <span class="domain-badge">${taskData.domain || 'Core'} Domain</span>
          </div>
        </div>

        ${hasResumePoint ? this.renderResumePrompt(taskId, progress) : ''}

        <div class="three-phase-briefing">
          <h2>🏔️ Your 4-Step Ascent</h2>
          <p class="briefing-intro">
            Complete all four phases to master this topic and earn maximum XP!
          </p>

          ${this.renderPhaseCard('learn', taskId, taskData, progress)}
          ${this.renderPhaseCard('flashcards', taskId, taskData, progress)}
          ${this.renderPhaseCard('quiz', taskId, taskData, progress)}
          ${this.renderPhaseCard('simulation', taskId, taskData, progress)}
        </div>

        <div class="learning-tips">
          <h3>💡 Tips for Success</h3>
          <ul>
            <li>✅ <strong>Recommended:</strong> Complete phases in order for best retention</li>
            <li>🎯 Each phase builds on the previous one</li>
            <li>⏸️ You can pause and resume anytime - progress is saved</li>
            <li>🔁 Failed the quiz? Review flashcards and try again!</li>
          </ul>
        </div>

        <div class="task-footer">
          <button class="btn btn-outline" onclick="router.back()">
            ← Back to Mission
          </button>
          <button class="btn btn-lg btn-primary" onclick="taskFlow.startPhase('learn', '${taskId}')">
            ${hasResumePoint ? 'Continue Learning' : 'Start Learning'} →
          </button>
        </div>
      </div>
    `;
  }

  /**
   * Render phase card in landing page
   * @param {string} phase - Phase name
   * @param {string} taskId - Task ID
   * @param {Object} taskData - Task data
   * @param {Object} progress - Task progress
   * @returns {string} HTML
   */
  renderPhaseCard(phase, taskId, taskData, progress) {
    const phaseConfig = this.getPhaseConfig(phase, taskData);
    const phaseProgress = progress[`${phase}Phase`];
    const isCompleted = phaseProgress?.completed;
    const isUnlocked = this.isPhaseUnlocked(phase, progress);
    const isCurrent = this.getCurrentPhase(progress) === phase;

    let statusIcon = '⚪';
    let statusClass = 'pending';

    if (isCompleted) {
      statusIcon = '✅';
      statusClass = 'completed';
    } else if (isCurrent) {
      statusIcon = '🔵';
      statusClass = 'current';
    } else if (!isUnlocked) {
      statusIcon = '🔒';
      statusClass = 'locked';
    }

    return `
      <div class="phase-card ${statusClass}" data-phase="${phase}">
        <div class="phase-header">
          <div class="phase-number">${phaseConfig.number}</div>
          <div class="phase-status">${statusIcon}</div>
        </div>

        <div class="phase-body">
          <h3>${phaseConfig.icon} ${phaseConfig.title}</h3>
          <p class="phase-description">${phaseConfig.description}</p>

          <div class="phase-details">
            <div class="detail-item">
              <span class="detail-icon">⏱️</span>
              <span>${phaseConfig.duration}</span>
            </div>
            <div class="detail-item">
              <span class="detail-icon">⭐</span>
              <span>${phaseConfig.xp} XP</span>
            </div>
          </div>

          ${isCompleted ? this.renderPhaseCompleteInfo(phase, phaseProgress) : ''}
          ${!isCompleted && isCurrent ? this.renderPhaseProgressInfo(phase, phaseProgress) : ''}
        </div>

        <div class="phase-footer">
          ${this.renderPhaseAction(phase, taskId, isUnlocked, isCompleted, isCurrent)}
        </div>
      </div>
    `;
  }

  /**
   * Get phase configuration
   * @param {string} phase - Phase name
   * @param {Object} taskData - Task data
   * @returns {Object} Phase config
   */
  getPhaseConfig(phase, taskData) {
    const configs = {
      learn: {
        number: 1,
        icon: '🏕️',
        title: 'Learn (Base Camp)',
        description: 'Study frameworks, scenarios, and key concepts through interactive content',
        duration: '10 min',
        xp: 50
      },
      flashcards: {
        number: 2,
        icon: '🎴',
        title: 'Flashcards (Mid Camp)',
        description: 'Practice and reinforce with spaced repetition flashcards',
        duration: '5 min',
        xp: 30
      },
      quiz: {
        number: 3,
        icon: '🏆',
        title: 'Quiz (Summit Push)',
        description: '10 questions • 75% to pass • Unlimited retakes',
        duration: '5 min',
        xp: 70
      },
      simulation: {
        number: 4,
        icon: '🎮',
        title: 'Simulation (Summit Challenge)',
        description: '5 PM decisions with trade-offs • 60% to pass • See consequences unfold',
        duration: '5-8 min',
        xp: 80
      }
    };

    return configs[phase];
  }

  /**
   * Check if phase is unlocked
   * @param {string} phase - Phase name
   * @param {Object} progress - Task progress
   * @returns {boolean} Is unlocked
   */
  isPhaseUnlocked(phase, progress) {
    // Learn is always unlocked
    if (phase === 'learn') return true;

    // Flashcards unlocked after Learn OR user can skip
    if (phase === 'flashcards') {
      return progress.learnPhase.completed || progress.learnPhase.currentSection > 0;
    }

    // Quiz unlocked after Flashcards OR user can skip
    if (phase === 'quiz') {
      return progress.flashcardsPhase.completed || progress.flashcardsPhase.cardsReviewed > 0;
    }

    // Simulation unlocked after Quiz OR user has attempted quiz
    if (phase === 'simulation') {
      return progress.quizPhase.completed || progress.quizPhase.attempts > 0;
    }

    return false;
  }

  /**
   * Get current active phase
   * @param {Object} progress - Task progress
   * @returns {string} Current phase name
   */
  getCurrentPhase(progress) {
    if (!progress.learnPhase.completed) return 'learn';
    if (!progress.flashcardsPhase.completed) return 'flashcards';
    if (!progress.quizPhase.completed) return 'quiz';
    if (!progress.simulationPhase.completed) return 'simulation';
    return null; // All complete
  }

  /**
   * Check if there's a resume point
   * @param {Object} progress - Task progress
   * @returns {boolean} Has resume point
   */
  hasResumePoint(progress) {
    return (
      (progress.learnPhase.currentSection > 0 && !progress.learnPhase.completed) ||
      (progress.flashcardsPhase.cardsReviewed > 0 && !progress.flashcardsPhase.completed) ||
      (progress.quizPhase.attempts > 0 && !progress.quizPhase.passed)
    );
  }

  /**
   * Render resume prompt
   * @param {string} taskId - Task ID
   * @param {Object} progress - Task progress
   * @returns {string} HTML
   */
  renderResumePrompt(taskId, progress) {
    let resumeText = '';
    let resumePhase = '';

    if (progress.learnPhase.currentSection > 0 && !progress.learnPhase.completed) {
      const totalSections = 10; // Enhanced MVE sections
      resumeText = `You're on section ${progress.learnPhase.currentSection + 1} of ${totalSections} in the Learn phase`;
      resumePhase = 'learn';
    } else if (progress.flashcardsPhase.cardsReviewed > 0 && !progress.flashcardsPhase.completed) {
      resumeText = `You've reviewed ${progress.flashcardsPhase.cardsReviewed} flashcards`;
      resumePhase = 'flashcards';
    } else if (progress.quizPhase.attempts > 0 && !progress.quizPhase.passed) {
      resumeText = `Your best quiz score: ${progress.quizPhase.highScore}% (need 75% to pass)`;
      resumePhase = 'quiz';
    }

    return `
      <div class="resume-prompt">
        <div class="resume-icon">📍</div>
        <div class="resume-content">
          <h3>Continue Where You Left Off</h3>
          <p>${resumeText}</p>
        </div>
        <div class="resume-actions">
          <button class="btn btn-primary" onclick="taskFlow.startPhase('${resumePhase}', '${taskId}')">
            Resume →
          </button>
          <button class="btn btn-outline btn-sm" onclick="taskFlow.resetTaskProgress('${taskId}')">
            Start Over
          </button>
        </div>
      </div>
    `;
  }

  /**
   * Render phase action button
   * @param {string} phase - Phase name
   * @param {string} taskId - Task ID
   * @param {boolean} isUnlocked - Is phase unlocked
   * @param {boolean} isCompleted - Is phase completed
   * @param {boolean} isCurrent - Is current phase
   * @returns {string} HTML
   */
  renderPhaseAction(phase, taskId, isUnlocked, isCompleted, isCurrent) {
    if (isCompleted) {
      return `
        <button class="btn btn-success btn-full" onclick="taskFlow.startPhase('${phase}', '${taskId}')">
          ✓ Review Again
        </button>
      `;
    }

    if (!isUnlocked) {
      return `
        <div class="locked-phase">
          <span class="lock-message">🔒 Complete previous phase first</span>
          <button class="btn btn-outline btn-sm" onclick="taskFlow.skipToPhase('${phase}', '${taskId}')">
            Skip Ahead Anyway
          </button>
        </div>
      `;
    }

    const buttonText = isCurrent ? 'Continue →' : 'Start →';
    const buttonClass = isCurrent ? 'btn-primary' : 'btn-outline';

    return `
      <button class="btn ${buttonClass} btn-full" onclick="taskFlow.startPhase('${phase}', '${taskId}')">
        ${buttonText}
      </button>
    `;
  }

  /**
   * Render phase complete info
   * @param {string} phase - Phase name
   * @param {Object} phaseProgress - Phase progress data
   * @returns {string} HTML
   */
  renderPhaseCompleteInfo(phase, phaseProgress) {
    if (phase === 'quiz') {
      return `
        <div class="completion-info">
          <div class="completion-badge">
            🏆 Passed with ${phaseProgress.highScore}%
          </div>
        </div>
      `;
    }

    if (phase === 'simulation') {
      return `
        <div class="completion-info">
          <div class="completion-badge">
            🎮 Best score: ${phaseProgress.highScore}%
          </div>
        </div>
      `;
    }

    return `
      <div class="completion-info">
        <div class="completion-badge">✓ Completed</div>
      </div>
    `;
  }

  /**
   * Render phase progress info
   * @param {string} phase - Phase name
   * @param {Object} phaseProgress - Phase progress data
   * @returns {string} HTML
   */
  renderPhaseProgressInfo(phase, phaseProgress) {
    if (phase === 'learn' && phaseProgress.currentSection > 0) {
      return `
        <div class="progress-info">
          <div class="progress-bar-mini">
            <div class="progress-fill" style="width: ${(phaseProgress.currentSection / 10) * 100}%"></div>
          </div>
          <span class="progress-text">${phaseProgress.currentSection}/10 sections</span>
        </div>
      `;
    }

    if (phase === 'flashcards' && phaseProgress.cardsReviewed > 0) {
      return `
        <div class="progress-info">
          <span class="progress-text">${phaseProgress.cardsReviewed} cards reviewed</span>
        </div>
      `;
    }

    return '';
  }

  /**
   * Start a phase
   * @param {string} phase - Phase name
   * @param {string} taskId - Task ID
   */
  startPhase(phase, taskId) {
    this.currentTaskId = taskId;
    this.currentPhase = phase;

    // For Learn phase, use pagination and check for resume point
    if (phase === 'learn') {
      const progress = this.getTaskProgress(taskId);
      const currentSection = progress.learnPhase?.currentSection || 0;
      window.location.hash = `/learn/${taskId}/${currentSection}`;
      return;
    }

    // Navigate to appropriate route for other phases
    const routes = {
      flashcards: `/flashcards/${taskId}`,
      quiz: `/quiz/${taskId}`,
      simulation: `/simulation/${taskId}`
    };

    window.location.hash = routes[phase];
  }

  /**
   * Skip to phase (bypass unlocking)
   * @param {string} phase - Phase name
   * @param {string} taskId - Task ID
   */
  skipToPhase(phase, taskId) {
    // Show confirmation
    if (confirm(`Skip ahead to ${phase}? We recommend completing phases in order for best learning.`)) {
      this.startPhase(phase, taskId);
    }
  }

  /**
   * Reset task progress
   * @param {string} taskId - Task ID
   */
  resetTaskProgress(taskId) {
    if (confirm('Start this task over from the beginning? Your progress will be reset.')) {
      state.delete(`taskProgress.${taskId}`);
      window.location.reload();
    }
  }

  /**
   * Complete a phase and show celebration
   * @param {string} phase - Phase name
   * @param {string} taskId - Task ID
   * @param {Object} results - Phase completion results
   */
  async completePhase(phase, taskId, results = {}) {
    const progress = this.getTaskProgress(taskId);

    // Update phase completion
    progress[`${phase}Phase`].completed = true;

    // Update altitude (progress meters)
    const altitudeGains = { learn: 50, flashcards: 30, quiz: 70, simulation: 80 };
    progress.altitude += altitudeGains[phase];

    // Check if all phases complete
    if (progress.learnPhase.completed && progress.flashcardsPhase.completed && progress.quizPhase.completed && progress.simulationPhase.completed) {
      progress.overallCompleted = true;
    }

    this.updateTaskProgress(taskId, progress);

    // Award XP
    const xpRewards = { learn: 50, flashcards: 30, quiz: 70, simulation: 80 };
    gamification.awardXP(xpRewards[phase], `Completed ${phase} phase`);

    // Show celebration modal
    this.showPhaseCompletionModal(phase, taskId, results);
  }

  /**
   * Show phase completion modal
   * @param {string} phase - Phase name
   * @param {string} taskId - Task ID
   * @param {Object} results - Results data
   */
  showPhaseCompletionModal(phase, taskId, results) {
    const phaseConfig = this.getPhaseConfig(phase, {});
    const progress = this.getTaskProgress(taskId);
    const nextPhase = this.getNextPhase(phase);

    // Enhanced messages with mountain metaphors
    const celebrationTitles = {
      learn: '🏕️ Base Camp Established!',
      flashcards: '🎴 Mid Camp Reached!',
      quiz: '🏆 Summit Conquered!',
      simulation: '🎮 Summit Challenge Complete!'
    };

    const motivationalQuotes = {
      learn: '"The best view comes after the hardest climb." — You\'ve laid the foundation!',
      flashcards: '"One step at a time, one day at a time." — You\'re building mastery!',
      quiz: '"The summit is what drives us, but the climb itself is what matters." — Well done!',
      simulation: '"Leadership is not about being in charge. It\'s about taking care of those in your charge." — You led the project!'
    };

    // Calculate some stats
    const progressPercent = Math.round((progress.altitude / 230) * 100);
    const totalXP = (progress.learnPhase?.completed ? 50 : 0) +
                    (progress.flashcardsPhase?.completed ? 30 : 0) +
                    (progress.quizPhase?.completed ? 70 : 0) +
                    (progress.simulationPhase?.completed ? 80 : 0);

    const modal = `
      <div class="modal-backdrop" onclick="this.remove()" style="animation: fadeIn 0.3s ease;">
        <div class="modal phase-completion-modal" onclick="event.stopPropagation()" style="animation: slideUpBounce 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);">
          <div class="modal-header" style="background: linear-gradient(135deg, ${this.getPhaseGradient(phase)}); border-bottom: none; padding: var(--space-2xl);">
            <div class="completion-icon" style="font-size: 6rem; margin-bottom: var(--space-md); animation: celebrationBounce 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55);">
              ${phaseConfig.icon}
            </div>
            <h2 style="font-size: var(--font-size-3xl); color: var(--color-primary-blue); margin-bottom: var(--space-sm);">
              ${celebrationTitles[phase]}
            </h2>
            <p style="font-size: var(--font-size-lg); color: var(--color-text-secondary); margin: 0; font-style: italic;">
              ${motivationalQuotes[phase]}
            </p>
          </div>

          <div class="modal-body" style="padding: var(--space-2xl);">
            <p class="completion-message" style="text-align: center; font-size: var(--font-size-lg); color: var(--color-text-secondary); margin-bottom: var(--space-xl); line-height: var(--line-height-relaxed);">
              ${this.getCompletionMessage(phase, results)}
            </p>

            <!-- Enhanced Rewards Grid -->
            <div class="rewards-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: var(--space-lg); margin-bottom: var(--space-2xl);">
              <div class="reward-item" style="background: linear-gradient(135deg, #FEF3C7, white); border: 2px solid var(--color-accent-gold); border-radius: var(--radius-lg); padding: var(--space-lg); text-align: center; animation: popIn 0.4s ease 0.2s both;">
                <div class="reward-icon" style="font-size: 2.5rem; margin-bottom: var(--space-sm);">⭐</div>
                <div class="reward-text" style="font-size: var(--font-size-2xl); font-weight: bold; color: var(--color-accent-gold); margin-bottom: var(--space-xs);">
                  +${phaseConfig.xp} XP
                </div>
                <div style="font-size: var(--font-size-xs); color: var(--color-text-muted);">
                  Total: ${totalXP} XP
                </div>
              </div>
              <div class="reward-item" style="background: linear-gradient(135deg, #DBEAFE, white); border: 2px solid var(--color-primary-blue); border-radius: var(--radius-lg); padding: var(--space-lg); text-align: center; animation: popIn 0.4s ease 0.3s both;">
                <div class="reward-icon" style="font-size: 2.5rem; margin-bottom: var(--space-sm);">📊</div>
                <div class="reward-text" style="font-size: var(--font-size-2xl); font-weight: bold; color: var(--color-primary-blue); margin-bottom: var(--space-xs);">
                  ${progressPercent}%
                </div>
                <div style="font-size: var(--font-size-xs); color: var(--color-text-muted);">
                  Task Progress
                </div>
              </div>
              <div class="reward-item" style="background: linear-gradient(135deg, #D1FAE5, white); border: 2px solid var(--color-trust-green); border-radius: var(--radius-lg); padding: var(--space-lg); text-align: center; animation: popIn 0.4s ease 0.4s both;">
                <div class="reward-icon" style="font-size: 2.5rem; margin-bottom: var(--space-sm);">🏔️</div>
                <div class="reward-text" style="font-size: var(--font-size-2xl); font-weight: bold; color: var(--color-trust-green); margin-bottom: var(--space-xs);">
                  +${this.getAltitudeGain(phase)}m
                </div>
                <div style="font-size: var(--font-size-xs); color: var(--color-text-muted);">
                  Altitude Gained
                </div>
              </div>
            </div>

            ${nextPhase ? this.renderNextPhasePrompt(nextPhase, taskId) : this.renderAllPhasesComplete(taskId)}
          </div>

          <div class="modal-footer" style="padding: var(--space-xl); background: var(--color-background); border-top: 1px solid var(--color-gray-200); display: flex; justify-content: space-between; gap: var(--space-md); flex-wrap: wrap;">
            ${nextPhase ? `
              <button class="btn btn-outline" onclick="this.closest('.modal-backdrop').remove()" style="min-width: 140px;">
                ☕ Take a Break
              </button>
              <button class="btn btn-lg btn-primary" onclick="taskFlow.startPhase('${nextPhase}', '${taskId}'); this.closest('.modal-backdrop').remove();" style="background: linear-gradient(135deg, var(--color-primary-blue), #2563EB); min-width: 180px;">
                Continue to ${this.getPhaseConfig(nextPhase, {}).icon} ${this.getPhaseConfig(nextPhase, {}).title.split('(')[0].trim()} →
              </button>
            ` : `
              <button class="btn btn-lg" onclick="router.navigate('/'); this.closest('.modal-backdrop').remove();" style="background: linear-gradient(135deg, var(--color-trust-green), #059669); color: white; flex: 1;">
                🗺️ Back to Mission Map
              </button>
            `}
          </div>
        </div>
      </div>

      <style>
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUpBounce {
          0% { transform: translateY(100px); opacity: 0; }
          60% { transform: translateY(-10px); opacity: 1; }
          80% { transform: translateY(5px); }
          100% { transform: translateY(0); }
        }
        @keyframes popIn {
          0% { transform: scale(0.8); opacity: 0; }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); opacity: 1; }
        }
      </style>
    `;

    document.body.insertAdjacentHTML('beforeend', modal);
  }

  /**
   * Get gradient colors for phase
   * @param {string} phase - Phase name
   * @returns {string} CSS gradient
   */
  getPhaseGradient(phase) {
    const gradients = {
      learn: '#DBEAFE, #EDE9FE',
      flashcards: '#EDE9FE, #FEF3C7',
      quiz: '#D1FAE5, #DBEAFE',
      simulation: '#FEF3C7, #FDE68A'
    };
    return gradients[phase] || '#DBEAFE, white';
  }

  /**
   * Get next phase after current
   * @param {string} currentPhase - Current phase
   * @returns {string|null} Next phase or null
   */
  getNextPhase(currentPhase) {
    const order = ['learn', 'flashcards', 'quiz', 'simulation'];
    const currentIndex = order.indexOf(currentPhase);
    return currentIndex < order.length - 1 ? order[currentIndex + 1] : null;
  }

  /**
   * Get completion message
   * @param {string} phase - Phase name
   * @param {Object} results - Results data
   * @returns {string} Message
   */
  getCompletionMessage(phase, results) {
    if (phase === 'learn') {
      const messages = [
        'You\'ve built a solid foundation of knowledge. The frameworks are now part of your toolkit!',
        'Excellent work studying the material! You\'re ready to reinforce what you\'ve learned.',
        'Base camp secured! You\'ve absorbed the key concepts and are ready for practice.',
        'Knowledge checkpoint reached! Time to turn theory into mastery.'
      ];
      return messages[Math.floor(Math.random() * messages.length)];
    }

    if (phase === 'flashcards') {
      const messages = [
        'Outstanding practice session! Your memory pathways are strengthening with each review.',
        'Great job reinforcing your knowledge! Repetition is the mother of learning.',
        'Mid camp established! You\'re building muscle memory for exam day.',
        'Excellent review! The concepts are becoming second nature to you.'
      ];
      return messages[Math.floor(Math.random() * messages.length)];
    }

    if (phase === 'quiz') {
      const score = results.score || 0;
      if (score === 100) {
        return `🎯 Perfect score! You achieved ${score}% - absolute mastery of this topic!`;
      } else if (score >= 90) {
        return `🌟 Exceptional! You scored ${score}% - you've truly mastered this material!`;
      } else if (score >= 80) {
        return `💪 Strong performance! You scored ${score}% - well above the passing threshold!`;
      } else if (score >= 75) {
        return `✅ Success! You scored ${score}% and passed the assessment. Well done!`;
      } else {
        return `You scored ${score}% (need 75% to pass). Review the material and try again - you're close!`;
      }
    }

    if (phase === 'simulation') {
      const score = results.score || 0;
      if (score >= 90) {
        return `🌟 Exemplary leadership! You scored ${score}% — your project thrived under your decisions!`;
      } else if (score >= 75) {
        return `💪 Strong PM skills! You scored ${score}% — your project is thriving!`;
      } else if (score >= 60) {
        return `✅ Stable project! You scored ${score}% — you kept things on track through tough decisions.`;
      } else {
        return `You scored ${score}%. Every PM faces setbacks — review and try different approaches!`;
      }
    }

    return 'Great work completing this phase!';
  }

  /**
   * Get altitude gain for phase
   * @param {string} phase - Phase name
   * @returns {number} Altitude in meters
   */
  getAltitudeGain(phase) {
    return { learn: 50, flashcards: 30, quiz: 70, simulation: 80 }[phase];
  }

  /**
   * Render next phase prompt in completion modal
   * @param {string} nextPhase - Next phase name
   * @param {string} taskId - Task ID
   * @returns {string} HTML
   */
  renderNextPhasePrompt(nextPhase, taskId) {
    const nextConfig = this.getPhaseConfig(nextPhase, {});

    const encouragement = {
      flashcards: 'Now let\'s reinforce what you\'ve learned through spaced repetition!',
      quiz: 'Time for the final push! Test your mastery and claim the summit.',
      simulation: 'Put your PM skills to the test! Make real decisions with real consequences.'
    };

    return `
      <div class="next-phase-prompt" style="background: linear-gradient(135deg, #FEFCE8, #FEF3C7); border: 2px solid var(--color-accent-gold); border-radius: var(--radius-xl); padding: var(--space-xl); text-align: left; margin-top: var(--space-lg);">
        <div style="display: flex; align-items: center; gap: var(--space-md); margin-bottom: var(--space-md);">
          <div style="font-size: 3rem;">${nextConfig.icon}</div>
          <div>
            <h3 style="margin: 0; color: var(--color-gray-900); font-size: var(--font-size-xl);">
              Next: ${nextConfig.title}
            </h3>
            <p style="margin: var(--space-xs) 0 0 0; color: var(--color-gray-600); font-size: var(--font-size-sm);">
              ${encouragement[nextPhase]}
            </p>
          </div>
        </div>
        <p style="margin-bottom: var(--space-md); color: var(--color-gray-700); line-height: var(--line-height-relaxed);">
          ${nextConfig.description}
        </p>
        <div class="next-phase-meta" style="display: flex; gap: var(--space-lg); font-size: var(--font-size-sm); color: var(--color-gray-600); font-weight: var(--font-weight-semibold);">
          <span style="display: flex; align-items: center; gap: var(--space-xs);">
            <span>⏱️</span> ${nextConfig.duration}
          </span>
          <span style="display: flex; align-items: center; gap: var(--space-xs);">
            <span>⭐</span> ${nextConfig.xp} XP reward
          </span>
        </div>
      </div>
    `;
  }

  /**
   * Render all phases complete message
   * @param {string} taskId - Task ID
   * @returns {string} HTML
   */
  renderAllPhasesComplete(taskId) {
    const celebrations = [
      { icon: '🏔️', text: 'Summit reached! You\'ve mastered this topic from base to peak.' },
      { icon: '🎖️', text: 'Mission accomplished! You\'ve earned the full 230 XP for this task.' },
      { icon: '⛰️', text: 'Peak conquered! Your knowledge and leadership are now summit-level.' },
      { icon: '🚩', text: 'Flag planted! You\'ve claimed this peak as your own.' }
    ];

    const randomCelebration = celebrations[Math.floor(Math.random() * celebrations.length)];

    return `
      <div class="all-complete-message" style="background: linear-gradient(135deg, #D1FAE5, #DBEAFE); border: 2px solid var(--color-trust-green); border-radius: var(--radius-xl); padding: var(--space-2xl); text-align: center; margin-top: var(--space-lg);">
        <div style="font-size: 5rem; margin-bottom: var(--space-md); animation: celebrationBounce 0.8s ease;">
          ${randomCelebration.icon}
        </div>
        <h3 style="margin: 0 0 var(--space-md) 0; color: var(--color-trust-green); font-size: var(--font-size-2xl);">
          🎉 Task Mastered!
        </h3>
        <p style="margin: 0 0 var(--space-lg) 0; color: var(--color-gray-700); font-size: var(--font-size-lg); line-height: var(--line-height-relaxed);">
          ${randomCelebration.text}
        </p>
        <div style="background: white; border-radius: var(--radius-lg); padding: var(--space-md); display: inline-block; box-shadow: var(--shadow-md);">
          <div style="font-size: var(--font-size-3xl); font-weight: bold; color: var(--color-trust-green);">
            +230 XP
          </div>
          <div style="font-size: var(--font-size-sm); color: var(--color-text-muted);">
            Total earned this task
          </div>
        </div>
        <p style="margin: var(--space-lg) 0 0 0; color: var(--color-gray-600); font-size: var(--font-size-md);">
          🗺️ Ready for your next adventure? The Mission Map awaits!
        </p>
      </div>
    `;
  }

  /**
   * Helper: Get task icon
   * @param {Object} taskData - Task data
   * @returns {string} Icon emoji
   */
  getTaskIcon(taskData) {
    // Default icons by domain
    const domainIcons = {
      People: '👥',
      Process: '⚙️',
      Business: '💼'
    };

    return domainIcons[taskData.domain] || '📚';
  }

  /**
   * Helper: Get altitude range
   * @param {Object} taskData - Task data
   * @returns {string} Altitude range
   */
  getAltitudeRange(taskData) {
    // Calculate based on task position
    // Could be enhanced with actual data from task
    return '500m → 750m';
  }
}

// Create singleton instance
const taskFlow = new TaskFlowManager();

// Export for use in other modules
export default taskFlow;

// Also expose globally for onclick handlers
window.taskFlow = taskFlow;
