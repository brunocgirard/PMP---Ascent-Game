/**
 * app.js - Main Application Entry Point
 *
 * Purpose: Initializes the PMP Prep application, sets up the router,
 * loads data files, and manages the application lifecycle.
 *
 * Responsibilities:
 * - Initialize app on DOM ready
 * - Load JSON data files (missions, flashcards, quizzes)
 * - Set up router and initial route
 * - Initialize state management
 * - Handle app-level events
 *
 * Usage: Loaded as <script type="module" src="js/app.js"></script>
 */

import router from './router.js';
import state from './state.js';
import storage from './storage.js';
import missionManager from './missions.js';
import flashcardSystem from './flashcards.js';
import quizEngine from './quiz.js';
import gamification from './gamification.js';
import { renderEnhancedMVE } from './enhanced-mve-renderer.js?v=4';
import enhancedMVETracker from './enhanced-mve-gamification.js';
import taskFlow from './task-flow-manager.js';
import simulationEngine from './simulation.js';
import { escapeHTML, escapeInlineHandlerArg, setSafeInnerHTML } from './security.js';

/**
 * Application Data Store
 * Loaded from JSON files
 */
const appData = {
  missions: null,
  flashcards: null,
  quizBank: null,
  learningContent: null,
  formulas: null,
  simulationScenarios: null
};

function safeActionArg(value) {
  return escapeInlineHandlerArg(value);
}

/**
 * Load JSON data file
 * @param {string} path - Path to JSON file
 * @returns {Promise<Object>} Parsed JSON data
 */
async function loadJSON(path) {
  try {
    const response = await fetch(path);
    if (!response.ok) {
      throw new Error(`Failed to load ${path}: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error loading ${path}:`, error);
    throw error;
  }
}

/**
 * Load all application data files
 */
async function loadAppData() {
  try {
    console.log('Loading application data...');

    const [missionsData, flashcards, quizBank, learningContent, formulas, simulationScenarios] = await Promise.all([
      loadJSON('data/missions.json'),
      loadJSON('data/flashcards-mapped.json'),
      loadJSON('data/quiz-bank.json'),
      loadJSON('data/learning-content.json'),
      loadJSON('data/formulas.json'),
      loadJSON('data/simulation-scenarios.json').catch(() => ({}))
    ]);

    // Extract missions array from the data object
    const missions = missionsData.missions || missionsData;

    appData.missions = missions;
    appData.flashcards = flashcards;
    appData.quizBank = quizBank;
    appData.learningContent = learningContent;
    appData.formulas = formulas;
    appData.simulationScenarios = simulationScenarios;

    // Initialize modules with data
    missionManager.init(missions);
    flashcardSystem.init(flashcards);
    quizEngine.init(quizBank);
    simulationEngine.init(simulationScenarios);

    console.log('Application data loaded successfully');
    console.log(`- Missions: ${missions.length}`);
    console.log(`- Flashcards: ${flashcards.length}`);
    console.log(`- Quiz Questions: ${quizBank.length}`);

    return true;
  } catch (error) {
    console.error('Failed to load application data:', error);
    showErrorScreen('Failed to load application data. Please refresh the page.');
    return false;
  }
}

/**
 * Show error screen
 * @param {string} message - Error message
 */
function showErrorScreen(message) {
  const appView = document.getElementById('app-view');
  if (appView) {
    setSafeInnerHTML(appView, `
      <div style="text-align: center; padding: 4rem 2rem;">
        <h1 style="font-size: 4rem; margin-bottom: 1rem;">⚠️</h1>
        <h2 style="margin-bottom: 1rem;">Unable to Load Application</h2>
        <p style="color: var(--color-text-secondary); margin-bottom: 2rem;">
          ${escapeHTML(message)}
        </p>
        <button onclick="window.location.reload()" class="btn btn-primary">
          Reload Page
        </button>
      </div>
    `);
  }
  hideLoadingScreen();
}

/**
 * Hide loading screen
 */
function hideLoadingScreen() {
  const loadingScreen = document.getElementById('loading-screen');
  if (loadingScreen) {
    loadingScreen.style.display = 'none';
  }
}

/**
 * Update header stats (XP, level, streak)
 */
function updateHeaderStats() {
  const progress = state.get('progress');
  const streak = state.get('streak');

  // Update streak counter
  const streakCount = document.getElementById('streak-count');
  if (streakCount) {
    streakCount.textContent = streak.current;
  }

  // Update XP bar
  const xpForNextLevel = progress.level * 500;
  const xpProgress = (progress.xp / xpForNextLevel) * 100;

  const xpBar = document.getElementById('xp-bar');
  const xpText = document.getElementById('xp-text');

  if (xpBar) {
    xpBar.style.width = `${Math.min(100, xpProgress)}%`;
  }

  if (xpText) {
    xpText.textContent = `${progress.xp} / ${xpForNextLevel} XP`;
  }

  // Update level badge
  const levelBadge = document.getElementById('level-badge');
  if (levelBadge) {
    const levelName = getLevelName(progress.level);
    setSafeInnerHTML(levelBadge, `
      <span class="level-number">${progress.level}</span>
      <span class="level-name">${levelName}</span>
    `);
  }
}

/**
 * Get level name based on level number
 * @param {number} level - Current level
 * @returns {string} Level name
 */
function getLevelName(level) {
  const levels = [
    'PMP Aspirant',      // 1
    'Base Camp Explorer', // 2
    'Trail Navigator',    // 3
    'Ridge Climber',      // 4
    'Peak Challenger',    // 5
    'Summit Seeker',      // 6
    'Mountain Master',    // 7
    'Alpine Expert',      // 8
    'Elevation Elite',    // 9
    'PMP Certified'       // 10+
  ];

  return levels[Math.min(level - 1, levels.length - 1)] || 'PMP Expert';
}

/**
 * Setup routes
 */
function setupRoutes() {
  // Home / Mission Map
  router.register('/', async () => {
    router.render(renderMissionMap());
  }, { title: 'Mission Map' });

  // Dashboard
  router.register('/dashboard', async () => {
    router.render(renderDashboard());
  }, { title: 'Dashboard' });

  // Settings
  router.register('/settings', async () => {
    router.render(renderSettings());
  }, { title: 'Settings' });

  // Mission detail
  router.register('/mission/:id', async (params) => {
    router.render(renderMissionDetail(params.id));
  }, { title: 'Mission' });

  // Task landing page
  router.register('/task/:taskId', async (params) => {
    const content = taskFlow.renderTaskLanding(params.taskId);
    router.render(content);
  }, { title: 'Task Overview' });

  // Learn phase
  // Learn phase - default (non-paginated for backward compatibility)
  router.register('/learn/:taskId', async (params) => {
    const content = await renderLearnPhase(params.taskId);
    router.render(content);
  }, { title: 'Learn' });

  // Learn phase - paginated (section by section)
  router.register('/learn/:taskId/:sectionIndex', async (params) => {
    const sectionIndex = parseInt(params.sectionIndex, 10);
    const content = await renderLearnPhase(params.taskId, { paginated: true, sectionIndex });
    router.render(content);
  }, { title: 'Learn' });

  // Flashcards
  router.register('/flashcards/:taskId', async (params) => {
    router.render(renderFlashcards(params.taskId));
  }, { title: 'Flashcards' });

  // Quiz
  router.register('/quiz/:taskId', async (params) => {
    router.render(renderQuiz(params.taskId));
  }, { title: 'Quiz' });

  // Simulation
  router.register('/simulation/:taskId', async (params) => {
    router.render(renderSimulation(params.taskId));
  }, { title: 'Simulation' });

  // Onboarding
  router.register('/onboarding', async () => {
    router.render(renderOnboarding());
  }, { title: 'Welcome' });

  // Mock Exam
  router.register('/mock-exam', async () => {
    router.render(renderMockExam());
  }, { title: 'Mock Exam' });

  // Mission 6 Practice Routes
  router.register('/mission/m6/mini-test/:domain', async (params) => {
    router.render(renderMission6MiniTest(params.domain));
  }, { title: 'Mini Test' });

  router.register('/mission/m6/weak-areas', async () => {
    router.render(renderMission6WeakAreas());
  }, { title: 'Weak Area Practice' });

  router.register('/mission/m6/formulas', async () => {
    router.render(renderMission6Formulas());
  }, { title: 'Formula Mastery' });

  router.register('/mission/m6/scenarios', async () => {
    router.render(renderMission6Scenarios());
  }, { title: 'Scenario Practice' });

  // About and Privacy Pages
  router.register('/about', async () => {
    router.render(renderAbout());
  }, { title: 'About' });

  router.register('/privacy', async () => {
    router.render(renderPrivacy());
  }, { title: 'Privacy' });

  console.log('Routes registered');
}

/**
 * Render Mission Map
 */
function renderMissionMap() {
  if (!appData.missions || appData.missions.length === 0) {
    return `
      <div class="card" style="text-align: center; padding: 3rem;">
        <h2>🗺️ Loading Missions...</h2>
        <p style="color: var(--color-text-secondary);">
          Please wait while we load your journey.
        </p>
      </div>
    `;
  }

  return `
    <div class="mission-map">
      <h2>🗺️ Your PMP Journey</h2>
      <p style="color: var(--color-text-secondary); margin-bottom: 2rem;">
        Choose a mission to begin your ascent to PMP certification.
      </p>

      <div style="display: grid; gap: 1.5rem; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));">
        ${appData.missions.map(mission => renderMissionCard(mission)).join('')}
      </div>
    </div>
  `;
}

/**
 * Render Mission Card
 */
function renderMissionCard(mission) {
  if (!mission || !mission.id) {
    console.error('renderMissionCard called with invalid mission:', mission);
    return '<div class="card"><p>Invalid mission data</p></div>';
  }

  const completedTasks = state.get('progress.completedTopics') || [];
  const missionTasks = mission.tasks || mission.topics || [];
  const completedCount = missionTasks.filter(t => t && t.id && completedTasks.includes(t.id)).length;
  const progress = missionTasks.length > 0 ? (completedCount / missionTasks.length) * 100 : 0;
  const isLocked = mission.unlockLevel > state.get('progress.level');

  return `
    <div class="card card-interactive ${isLocked ? 'card-locked' : ''}"
         ${!isLocked ? `onclick="navigateTo('/mission/${encodeURIComponent(mission.id)}')"` : ''}>
      <div class="card-header">
        <h3 class="card-title">${mission.icon} ${mission.name}</h3>
      </div>
      <div class="card-body">
        <p style="color: var(--color-text-secondary); margin-bottom: 1rem;">
          ${mission.description}
        </p>
        <div class="progress-container">
          <div class="progress-label">
            <span>${completedCount} / ${missionTasks.length} tasks</span>
            <span>${Math.round(progress)}%</span>
          </div>
          <div class="progress-bar-wrapper">
            <div class="progress-bar-fill" style="width: ${progress}%"></div>
          </div>
        </div>
      </div>
      ${isLocked ? `<div class="badge badge-warning">Unlock at Level ${mission.unlockLevel}</div>` : ''}
    </div>
  `;
}

/**
 * Render Dashboard with achievements
 */
function renderDashboard() {
  const progress = state.get('progress');
  const streak = state.get('streak');
  const achievementProgress = gamification.getAchievementProgress();
  const unlockedAchievements = gamification.getUnlockedAchievements();
  const overallProgress = missionManager.getOverallProgress();

  return `
    <div class="dashboard">
      <h2>📊 Your Progress Dashboard</h2>

      <!-- Stats Grid -->
      <div style="display: grid; gap: 1.5rem; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); margin-top: 2rem;">
        <div class="card">
          <h3>🔥 Current Streak</h3>
          <p style="font-size: 3rem; font-weight: bold; color: var(--color-primary-blue); margin: 1rem 0;">
            ${streak.current}
          </p>
          <p style="color: var(--color-text-secondary);">
            days • Best: ${streak.longest}
          </p>
        </div>

        <div class="card">
          <h3>⭐ Total XP</h3>
          <p style="font-size: 3rem; font-weight: bold; color: var(--color-trust-green); margin: 1rem 0;">
            ${progress.xp}
          </p>
          <p style="color: var(--color-text-secondary);">
            Level ${progress.level}
          </p>
        </div>

        <div class="card">
          <h3>✅ Questions Answered</h3>
          <p style="font-size: 3rem; font-weight: bold; color: var(--color-accent-gold); margin: 1rem 0;">
            ${progress.totalQuestionsAnswered}
          </p>
          <p style="color: var(--color-text-secondary);">
            ${progress.totalQuestionsAnswered > 0
              ? `${Math.round((progress.correctAnswers / progress.totalQuestionsAnswered) * 100)}% correct`
              : 'Start learning!'}
          </p>
        </div>

        <div class="card">
          <h3>📚 Flashcards Reviewed</h3>
          <p style="font-size: 3rem; font-weight: bold; color: var(--color-primary-blue); margin: 1rem 0;">
            ${progress.totalFlashcardsReviewed}
          </p>
          <p style="color: var(--color-text-secondary);">total reviews</p>
        </div>
      </div>

      <!-- Overall Progress -->
      <div class="card" style="margin-top: 2rem;">
        <h3>🗺️ Mission Progress</h3>
        <div style="margin-top: 1rem;">
          <div class="progress-label">
            <span>Tasks Completed</span>
            <span>${overallProgress.completedTasks} / ${overallProgress.totalTasks}</span>
          </div>
          <div class="progress-bar-wrapper">
            <div class="progress-bar-fill" style="width: ${overallProgress.taskProgress}%"></div>
          </div>
        </div>
        <div style="margin-top: 1rem;">
          <div class="progress-label">
            <span>Missions Completed</span>
            <span>${overallProgress.completedMissions} / ${overallProgress.totalMissions}</span>
          </div>
          <div class="progress-bar-wrapper">
            <div class="progress-bar-fill" style="width: ${overallProgress.missionProgress}%"></div>
          </div>
        </div>
      </div>

      <!-- Achievements -->
      <div class="card" style="margin-top: 2rem;">
        <div class="card-header">
          <h3>🏆 Achievements</h3>
          <span class="badge badge-primary">${achievementProgress.unlocked} / ${achievementProgress.total}</span>
        </div>
        <div class="card-body">
          ${unlockedAchievements.length > 0 ? `
            <h4 style="margin-bottom: 1rem; color: var(--color-trust-green);">Unlocked (${unlockedAchievements.length})</h4>
            <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 2rem;">
              ${unlockedAchievements.slice(0, 6).map(achievement => `
                <div style="padding: 1rem; border: 2px solid var(--color-trust-green); border-radius: var(--radius-md); text-align: center;">
                  <div style="font-size: 2rem; margin-bottom: 0.5rem;">${achievement.icon}</div>
                  <div style="font-weight: var(--font-weight-semibold); margin-bottom: 0.25rem;">${achievement.name}</div>
                  <div style="font-size: var(--font-size-xs); color: var(--color-text-secondary);">${achievement.description}</div>
                </div>
              `).join('')}
            </div>
            ${unlockedAchievements.length > 6 ? `<p style="text-align: center; color: var(--color-text-muted);">+ ${unlockedAchievements.length - 6} more</p>` : ''}
          ` : `
            <p style="color: var(--color-text-secondary); text-align: center; padding: 2rem;">
              No achievements unlocked yet. Start learning to earn your first badge!
            </p>
          `}

          <button class="btn btn-outline" onclick="showAllAchievements()">
            View All Achievements
          </button>
        </div>
      </div>
    </div>
  `;
}

/**
 * Show all achievements modal
 */
window.showAllAchievements = function() {
  const unlockedAchievements = gamification.getUnlockedAchievements();
  const lockedAchievements = gamification.getLockedAchievements();

  const modal = document.createElement('div');
  modal.className = 'modal-backdrop';
  setSafeInnerHTML(modal, `
    <div class="modal" style="max-width: 900px;">
      <div class="modal-header">
        <h2 class="modal-title">🏆 All Achievements</h2>
        <span class="modal-close" onclick="this.closest('.modal-backdrop').remove()">×</span>
      </div>
      <div class="modal-body">
        <h3 style="color: var(--color-trust-green); margin-bottom: 1rem;">
          Unlocked (${unlockedAchievements.length})
        </h3>
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 2rem;">
          ${unlockedAchievements.map(achievement => `
            <div style="padding: 1rem; border: 2px solid var(--color-trust-green); border-radius: var(--radius-md); text-align: center;">
              <div style="font-size: 2.5rem; margin-bottom: 0.5rem;">${achievement.icon}</div>
              <div style="font-weight: var(--font-weight-semibold); margin-bottom: 0.25rem;">${achievement.name}</div>
              <div style="font-size: var(--font-size-xs); color: var(--color-text-secondary); margin-bottom: 0.5rem;">
                ${achievement.description}
              </div>
              <div class="badge badge-success">+${achievement.xp} XP</div>
            </div>
          `).join('') || '<p style="text-align: center; color: var(--color-text-muted);">None yet</p>'}
        </div>

        <h3 style="color: var(--color-text-secondary); margin-bottom: 1rem;">
          Locked (${lockedAchievements.length})
        </h3>
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 1rem;">
          ${lockedAchievements.map(achievement => `
            <div style="padding: 1rem; border: 2px solid var(--color-gray-300); border-radius: var(--radius-md); text-align: center; opacity: 0.6;">
              <div style="font-size: 2.5rem; margin-bottom: 0.5rem; filter: grayscale(100%);">${achievement.icon}</div>
              <div style="font-weight: var(--font-weight-semibold); margin-bottom: 0.25rem;">${achievement.name}</div>
              <div style="font-size: var(--font-size-xs); color: var(--color-text-secondary); margin-bottom: 0.5rem;">
                ${achievement.description}
              </div>
              <div class="badge badge-secondary">+${achievement.xp} XP</div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `);

  document.body.appendChild(modal);
};

/**
 * Render Settings (placeholder)
 */
function renderSettings() {
  const settings = state.get('settings');

  return `
    <div class="settings">
      <h2>⚙️ Settings</h2>

      <div class="card" style="margin-top: 2rem;">
        <h3>Preferences</h3>
        <div class="form-group">
          <label class="form-label">
            <input type="checkbox" ${settings.soundEnabled ? 'checked' : ''}
                   onchange="updateSetting('soundEnabled', this.checked)">
            Enable Sound Effects
          </label>
        </div>
        <div class="form-group">
          <label class="form-label">
            <input type="checkbox" ${settings.animationsEnabled ? 'checked' : ''}
                   onchange="updateSetting('animationsEnabled', this.checked)">
            Enable Animations
          </label>
        </div>
      </div>

      <div class="card" style="margin-top: 1.5rem;">
        <h3>Data Management</h3>
        <button class="btn btn-secondary" onclick="downloadBackup()">
          📥 Download Backup
        </button>
        <button class="btn btn-danger" onclick="resetProgress()" style="margin-left: 1rem;">
          🗑️ Reset All Progress
        </button>
      </div>
    </div>
  `;
}

/**
 * Render About Page
 */
function renderAbout() {
  return `
    <div class="about-page">
      <div class="card">
        <div class="card-header">
          <h2 class="card-title">🏔️ About Ascent to PMP</h2>
        </div>
        <div class="card-body" style="max-width: 800px; margin: 0 auto; line-height: 1.8;">
          <h3 style="color: var(--color-primary-blue); margin-bottom: 1rem;">Transform Your PMP Journey</h3>
          <p style="margin-bottom: 1.5rem;">
            Ascent to PMP: The Summit Quest is a gamified learning platform designed to make PMP exam
            preparation engaging, effective, and achievable through daily 15-20 minute sessions.
          </p>

          <h3 style="color: var(--color-primary-blue); margin-bottom: 1rem; margin-top: 2rem;">🎯 How It Works</h3>
          <p style="margin-bottom: 1rem;">
            Your PMP preparation journey is structured like climbing a mountain, with each mission
            representing a crucial skill or knowledge area:
          </p>
          <ul style="margin-bottom: 1.5rem; padding-left: 2rem;">
            <li><strong>Learn Phase:</strong> Comprehensive content for each topic</li>
            <li><strong>Flashcards:</strong> Spaced repetition for long-term retention</li>
            <li><strong>Quiz:</strong> Test your knowledge with practice questions</li>
            <li><strong>Progress Tracking:</strong> XP, levels, streaks, and achievements</li>
            <li><strong>Mock Exams:</strong> Full-length practice exams when you're ready</li>
          </ul>

          <h3 style="color: var(--color-primary-blue); margin-bottom: 1rem; margin-top: 2rem;">🏔️ The Mountain Metaphor</h3>
          <p style="margin-bottom: 1.5rem;">
            Just as climbing a mountain requires preparation, persistence, and taking it one step at a time,
            your PMP certification journey is broken down into manageable daily goals. Each mission completed
            brings you higher up the mountain toward certification success.
          </p>

          <h3 style="color: var(--color-primary-blue); margin-bottom: 1rem; margin-top: 2rem;">📚 Content Alignment</h3>
          <p style="margin-bottom: 1.5rem;">
            All content is aligned with the PMI PMP Exam Content Outline (2026 edition), covering:
          </p>
          <ul style="margin-bottom: 1.5rem; padding-left: 2rem;">
            <li><strong>People:</strong> 42% of exam (Leadership, Team Management)</li>
            <li><strong>Process:</strong> 50% of exam (Predictive, Agile, Hybrid)</li>
            <li><strong>Business Environment:</strong> 8% of exam (Strategy, Compliance)</li>
          </ul>

          <h3 style="color: var(--color-primary-blue); margin-bottom: 1rem; margin-top: 2rem;">🙏 Credits & Acknowledgments</h3>
          <p style="margin-bottom: 1rem;">
            Built with modern web technologies for an optimal learning experience:
          </p>
          <ul style="margin-bottom: 1.5rem; padding-left: 2rem;">
            <li>Pure vanilla JavaScript (ES6+) - no dependencies</li>
            <li>Responsive CSS Grid and Flexbox</li>
            <li>Client-side routing for smooth navigation</li>
            <li>LocalStorage for data persistence</li>
          </ul>

          <div style="margin-top: 3rem; padding: 1.5rem; background: var(--color-blue-light); border-left: 4px solid var(--color-primary-blue); border-radius: var(--radius-md);">
            <h4 style="margin-top: 0; color: var(--color-primary-blue);">💡 Study Tips</h4>
            <p style="margin-bottom: 0;">
              Consistency beats intensity. Aim for daily 15-20 minute sessions rather than long
              cramming sessions. The spaced repetition system will help you retain information
              long-term, not just memorize for the exam.
            </p>
          </div>
        </div>
        <div class="card-footer">
          <button class="btn btn-primary" onclick="navigateTo('/')">
            ← Back to Mission Map
          </button>
        </div>
      </div>
    </div>
  `;
}

/**
 * Render Privacy Page
 */
function renderPrivacy() {
  return `
    <div class="privacy-page">
      <div class="card">
        <div class="card-header">
          <h2 class="card-title">🔒 Privacy Policy</h2>
        </div>
        <div class="card-body" style="max-width: 800px; margin: 0 auto; line-height: 1.8;">
          <p style="color: var(--color-text-secondary); margin-bottom: 2rem;">
            <em>Last updated: January 30, 2026</em>
          </p>

          <h3 style="color: var(--color-primary-blue); margin-bottom: 1rem;">Your Data, Your Control</h3>
          <p style="margin-bottom: 1.5rem;">
            Ascent to PMP is designed with privacy as a priority. All your data stays on your device
            and is completely under your control.
          </p>

          <h3 style="color: var(--color-primary-blue); margin-bottom: 1rem; margin-top: 2rem;">📱 Local Storage Only</h3>
          <p style="margin-bottom: 1.5rem;">
            Your progress, preferences, and study data are stored exclusively in your browser's
            localStorage. This means:
          </p>
          <ul style="margin-bottom: 1.5rem; padding-left: 2rem;">
            <li>No data is sent to external servers</li>
            <li>No account creation or login required</li>
            <li>Your data never leaves your device</li>
            <li>You can clear your data at any time in Settings</li>
          </ul>

          <h3 style="color: var(--color-primary-blue); margin-bottom: 1rem; margin-top: 2rem;">🍪 No Cookies or Tracking</h3>
          <p style="margin-bottom: 1.5rem;">
            We do not use:
          </p>
          <ul style="margin-bottom: 1.5rem; padding-left: 2rem;">
            <li>Cookies (except essential localStorage for app functionality)</li>
            <li>Third-party analytics or tracking scripts</li>
            <li>Advertising networks or trackers</li>
            <li>Any form of user profiling</li>
          </ul>

          <h3 style="color: var(--color-primary-blue); margin-bottom: 1rem; margin-top: 2rem;">💾 What Data We Store Locally</h3>
          <p style="margin-bottom: 1rem;">
            The following data is stored in your browser's localStorage:
          </p>
          <ul style="margin-bottom: 1.5rem; padding-left: 2rem;">
            <li><strong>Progress:</strong> XP, level, completed missions and tasks</li>
            <li><strong>Quiz History:</strong> Answers, scores, and statistics</li>
            <li><strong>Flashcard Reviews:</strong> Spaced repetition schedule</li>
            <li><strong>Achievements:</strong> Unlocked badges and milestones</li>
            <li><strong>Settings:</strong> Your preferences (sound, animations)</li>
            <li><strong>Streaks:</strong> Daily study streak counter</li>
          </ul>

          <h3 style="color: var(--color-primary-blue); margin-bottom: 1rem; margin-top: 2rem;">🔄 Data Export & Import</h3>
          <p style="margin-bottom: 1.5rem;">
            You can export your data as a JSON file at any time from the Settings page. This allows you to:
          </p>
          <ul style="margin-bottom: 1.5rem; padding-left: 2rem;">
            <li>Create backups of your progress</li>
            <li>Transfer data between devices</li>
            <li>Keep a personal record of your learning journey</li>
          </ul>

          <h3 style="color: var(--color-primary-blue); margin-bottom: 1rem; margin-top: 2rem;">🗑️ Data Deletion</h3>
          <p style="margin-bottom: 1.5rem;">
            You have complete control to delete your data:
          </p>
          <ul style="margin-bottom: 1.5rem; padding-left: 2rem;">
            <li>Use the "Reset All Progress" button in Settings</li>
            <li>Clear your browser's localStorage</li>
            <li>Delete the app files from your device</li>
          </ul>

          <h3 style="color: var(--color-primary-blue); margin-bottom: 1rem; margin-top: 2rem;">⚠️ Important Notes</h3>
          <ul style="margin-bottom: 1.5rem; padding-left: 2rem;">
            <li>If you clear browser data or use private/incognito mode, your progress will be lost</li>
            <li>Data is not synced between devices - export/import to transfer manually</li>
            <li>localStorage has a size limit (typically 5-10MB) - export regularly for safety</li>
          </ul>

          <h3 style="color: var(--color-primary-blue); margin-bottom: 1rem; margin-top: 2rem;">📧 Contact</h3>
          <p style="margin-bottom: 1.5rem;">
            For questions about this privacy policy or the app, please open an issue on our
            <a href="https://github.com/anthropics/claude-code/issues" target="_blank" rel="noopener"
               style="color: var(--color-primary-blue); text-decoration: underline;">GitHub repository</a>.
          </p>

          <div style="margin-top: 3rem; padding: 1.5rem; background: var(--color-green-light); border-left: 4px solid var(--color-trust-green); border-radius: var(--radius-md);">
            <h4 style="margin-top: 0; color: var(--color-trust-green);">✅ Privacy-First Design</h4>
            <p style="margin-bottom: 0;">
              This app is built to respect your privacy. Your learning data is yours alone,
              stored locally on your device, and never shared with anyone.
            </p>
          </div>
        </div>
        <div class="card-footer">
          <button class="btn btn-primary" onclick="navigateTo('/')">
            ← Back to Mission Map
          </button>
        </div>
      </div>
    </div>
  `;
}

/**
 * Render Mission Detail with all tasks
 */
function renderMissionDetail(missionId) {
  const mission = missionManager.getMission(missionId);

  if (!mission) {
    return `<div class="card"><h2>Mission not found</h2><p>The requested mission does not exist.</p></div>`;
  }

  // Special handling for Mission 6 (Practice Modules)
  if (missionId === 'm6') {
    return renderMission6Detail(mission);
  }

  // Special handling for Mission 7 (Exam Simulation)
  if (missionId === 'm7') {
    return renderMission7Detail(mission);
  }

  const progress = missionManager.getMissionProgress(missionId);
  const counts = missionManager.getMissionTaskCounts(missionId);
  const isCompleted = missionManager.isMissionCompleted(missionId);

  // Handle both "tasks" and "topics" property names
  const missionTasks = mission.tasks || mission.topics || [];

  const breadcrumbs = renderBreadcrumbs([
    { label: 'Mission Map', path: '/' },
    { label: mission.name, path: `/mission/${missionId}` }
  ]);

  return `
    <div class="mission-detail">
      ${breadcrumbs}
      <div class="card">
        <div class="card-header">
          <h2 class="card-title">${mission.icon} ${mission.name}</h2>
          ${isCompleted ? `<span class="badge badge-success">✓ Completed</span>` : ''}
        </div>
        <div class="card-body">
          <p style="color: var(--color-text-secondary); margin-bottom: 1.5rem;">
            ${mission.description}
          </p>

          <div class="progress-container">
            <div class="progress-label">
              <span>${counts.completed} / ${counts.total} tasks completed</span>
              <span>${progress}%</span>
            </div>
            <div class="progress-bar-wrapper">
              <div class="progress-bar-fill" style="width: ${progress}%"></div>
            </div>
          </div>
        </div>
      </div>

      <h3 style="margin-top: 2rem; margin-bottom: 1rem;">Tasks</h3>
      <div style="display: grid; gap: 1rem;">
        ${missionTasks.length > 0
          ? missionTasks.map((task, index) => renderTaskCard(task, index + 1, missionId)).join('')
          : '<p style="color: var(--color-text-secondary); text-align: center; padding: 2rem;">No tasks defined for this mission yet.</p>'
        }
      </div>
    </div>
  `;
}

/**
 * Render Mission 6 Detail (Practice Modules)
 */
function renderMission6Detail(mission) {
  const practiceModules = mission.practiceModules || [];
  const miniTests = state.get('progress.miniTests') || [];
  const formulaMastery = state.get('progress.formulaMastery') || {};
  const scenariosPracticed = state.get('progress.scenariosPracticed') || 0;

  // Calculate overall progress
  const miniTestsCompleted = miniTests.filter(t => t.passed).length;
  const totalFormulas = appData.formulas ? appData.formulas.categories.reduce((sum, cat) => sum + cat.formulas.length, 0) : 33;
  const masteredFormulas = Object.values(formulaMastery).filter(m => m.mastered).length;

  const modulesCompleted = [
    miniTestsCompleted >= 3 ? 1 : 0,
    scenariosPracticed >= 20 ? 1 : 0,
    masteredFormulas >= totalFormulas * 0.9 ? 1 : 0
  ].reduce((sum, val) => sum + val, 0);

  const overallProgress = Math.round((modulesCompleted / 3) * 100);

  return `
    <div class="mission-detail mission6-detail">
      <div class="card">
        <div class="card-header">
          <h2 class="card-title">${mission.icon} ${mission.name}</h2>
        </div>
        <div class="card-body">
          <p style="color: var(--color-text-secondary); margin-bottom: 1.5rem;">
            ${mission.description}
          </p>

          <div class="progress-container">
            <div class="progress-label">
              <span>Overall Progress</span>
              <span>${overallProgress}%</span>
            </div>
            <div class="progress-bar-wrapper">
              <div class="progress-bar-fill" style="width: ${overallProgress}%"></div>
            </div>
          </div>
        </div>
      </div>

      <h3 style="margin-top: 2rem; margin-bottom: 1rem;">Practice Modules</h3>
      <div style="display: grid; gap: 1.5rem; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));">

        <!-- Timed Mini-Tests -->
        <div class="card card-interactive">
          <div class="card-header">
            <h3 class="card-title">🎯 Timed Mini-Tests</h3>
          </div>
          <div class="card-body">
            <p style="color: var(--color-text-secondary); margin-bottom: 1rem;">
              20 questions in 30 minutes, domain-specific practice.
            </p>
            <div style="margin-bottom: 1rem; display: flex; gap: 0.75rem; flex-wrap: wrap;">
              <span style="background: #3b82f6; color: white; padding: 0.375rem 0.875rem; border-radius: 0.5rem; font-size: 0.875rem; white-space: nowrap;">People</span>
              <span style="background: #3b82f6; color: white; padding: 0.375rem 0.875rem; border-radius: 0.5rem; font-size: 0.875rem; white-space: nowrap;">Process</span>
              <span style="background: #3b82f6; color: white; padding: 0.375rem 0.875rem; border-radius: 0.5rem; font-size: 0.875rem; white-space: nowrap;">Business</span>
            </div>
            <p style="font-size: var(--font-size-sm); color: var(--color-text-muted);">
              ${miniTests.length} tests completed
            </p>
          </div>
          <div class="card-footer">
            <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
              <button class="btn btn-sm btn-primary" onclick="navigateTo('/mission/m6/mini-test/people')">
                People
              </button>
              <button class="btn btn-sm btn-primary" onclick="navigateTo('/mission/m6/mini-test/process')">
                Process
              </button>
              <button class="btn btn-sm btn-primary" onclick="navigateTo('/mission/m6/mini-test/business')">
                Business
              </button>
            </div>
          </div>
        </div>

        <!-- Weak Area Drills -->
        <div class="card card-interactive" onclick="navigateTo('/mission/m6/weak-areas')">
          <div class="card-header">
            <h3 class="card-title">📚 Weak Area Drills</h3>
          </div>
          <div class="card-body">
            <p style="color: var(--color-text-secondary); margin-bottom: 1rem;">
              Adaptive practice focused on your lowest-scoring topics.
            </p>
            <p style="font-size: var(--font-size-sm); color: var(--color-text-muted);">
              Minimum 50 questions from weak areas
            </p>
          </div>
          <div class="card-footer">
            <button class="btn btn-primary" onclick="navigateTo('/mission/m6/weak-areas'); event.stopPropagation();">
              Start Practice
            </button>
          </div>
        </div>

        <!-- Formula Mastery -->
        <div class="card card-interactive" onclick="navigateTo('/mission/m6/formulas')">
          <div class="card-header">
            <h3 class="card-title">🧮 Formula Mastery</h3>
          </div>
          <div class="card-body">
            <p style="color: var(--color-text-secondary); margin-bottom: 1rem;">
              Master all ${totalFormulas} PMP formulas with practice problems.
            </p>
            <div class="progress-container">
              <div class="progress-label">
                <span>Mastered</span>
                <span>${masteredFormulas}/${totalFormulas}</span>
              </div>
              <div class="progress-bar-wrapper">
                <div class="progress-bar-fill" style="width: ${(masteredFormulas / totalFormulas) * 100}%"></div>
              </div>
            </div>
          </div>
          <div class="card-footer">
            <button class="btn btn-primary" onclick="navigateTo('/mission/m6/formulas'); event.stopPropagation();">
              Practice Formulas
            </button>
          </div>
        </div>

        <!-- Scenario Practice -->
        <div class="card card-interactive" onclick="navigateTo('/mission/m6/scenarios')">
          <div class="card-header">
            <h3 class="card-title">🎭 Scenario Practice</h3>
          </div>
          <div class="card-body">
            <p style="color: var(--color-text-secondary); margin-bottom: 1rem;">
              Complex multi-part scenarios with detailed explanations.
            </p>
            <p style="font-size: var(--font-size-sm); color: var(--color-text-muted);">
              ${scenariosPracticed}/20 scenarios completed
            </p>
          </div>
          <div class="card-footer">
            <button class="btn btn-primary" onclick="navigateTo('/mission/m6/scenarios'); event.stopPropagation();">
              Practice Scenarios
            </button>
          </div>
        </div>
      </div>

      <!-- Mission 6 Stats -->
      <div class="card" style="margin-top: 2rem;">
        <div class="card-header">
          <h3>📊 Your Practice Stats</h3>
        </div>
        <div class="card-body">
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1.5rem;">
            <div style="text-align: center; padding: 1rem; background: var(--color-blue-light); border-radius: 8px;">
              <div style="font-size: 2rem; font-weight: bold; color: var(--color-primary-blue);">
                ${miniTests.length}
              </div>
              <div style="color: var(--color-text-secondary);">Mini-Tests Taken</div>
            </div>
            <div style="text-align: center; padding: 1rem; background: var(--color-green-light); border-radius: 8px;">
              <div style="font-size: 2rem; font-weight: bold; color: var(--color-trust-green);">
                ${masteredFormulas}
              </div>
              <div style="color: var(--color-text-secondary);">Formulas Mastered</div>
            </div>
            <div style="text-align: center; padding: 1rem; background: var(--color-surface); border-radius: 8px;">
              <div style="font-size: 2rem; font-weight: bold; color: var(--color-accent-gold);">
                ${scenariosPracticed}
              </div>
              <div style="color: var(--color-text-secondary);">Scenarios Completed</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

/**
 * Render Mission 7 Detail (Exam Simulation)
 */
function renderMission7Detail(mission) {
  const mockExams = mission.mockExams || [];
  const completedExams = state.get('mockExams') || [];

  // Calculate progress based on completed mock exams
  const exam1 = completedExams.find(e => e.examId === 'mock-exam-1');
  const exam2 = completedExams.find(e => e.examId === 'mock-exam-2');
  const exam3 = completedExams.find(e => e.examId === 'mock-exam-3');

  const exam1Passed = exam1 && exam1.score >= 75;
  const exam2Passed = exam2 && exam2.score >= 75;
  const exam3Passed = exam3 && exam3.score >= 75;

  const examsCompleted = [exam1, exam2, exam3].filter(e => e).length;
  const examsPassed = [exam1Passed, exam2Passed, exam3Passed].filter(p => p).length;

  const overallProgress = Math.round((examsCompleted / mockExams.length) * 100);
  const isReady = exam2Passed; // Passing Mock Exam 2 means you're ready

  const breadcrumbs = renderBreadcrumbs([
    { label: 'Mission Map', path: '/' },
    { label: mission.name, path: `/mission/m7` }
  ]);

  return `
    <div class="mission-detail mission7-detail">
      ${breadcrumbs}

      <div class="card">
        <div class="card-header">
          <h2 class="card-title">${mission.icon} ${mission.name}</h2>
          ${isReady ? `<span class="badge badge-success">🎓 Exam Ready!</span>` : ''}
        </div>
        <div class="card-body">
          <p style="color: var(--color-text-secondary); margin-bottom: 1.5rem;">
            ${mission.description}
          </p>

          ${isReady ? `
            <div style="padding: 1rem; background: linear-gradient(135deg, var(--color-trust-green), #059669); color: white; border-radius: var(--radius-md); margin-bottom: 1.5rem;">
              <h4 style="margin: 0 0 0.5rem 0; color: white;">🎉 Congratulations!</h4>
              <p style="margin: 0; color: white; opacity: 0.95;">
                You've passed Mock Exam 2! You're ready to schedule your real PMP exam.
              </p>
            </div>
          ` : ''}

          <div class="progress-container">
            <div class="progress-label">
              <span>${examsCompleted} / ${mockExams.length} exams completed (${examsPassed} passed)</span>
              <span>${overallProgress}%</span>
            </div>
            <div class="progress-bar-wrapper">
              <div class="progress-bar-fill" style="width: ${overallProgress}%"></div>
            </div>
          </div>
        </div>
      </div>

      <h3 style="margin-top: 2rem; margin-bottom: 1rem;">Full-Length Mock Exams</h3>
      <div style="display: grid; gap: 1.5rem;">
        ${mockExams.map((mockExam, index) => {
          const examResult = completedExams.find(e => e.examId === mockExam.id);
          const isPassed = examResult && examResult.score >= mockExam.passingScore;
          const isOptional = mockExam.name.includes('Optional');

          return `
            <div class="card card-interactive">
              <div class="card-header">
                <h3 class="card-title">
                  ${mockExam.name}
                  ${isOptional ? `<span class="badge badge-secondary">Optional</span>` : ''}
                  ${isPassed ? `<span class="badge badge-success">✓ Passed</span>` : ''}
                  ${examResult && !isPassed ? `<span class="badge badge-warning">Completed</span>` : ''}
                </h3>
              </div>
              <div class="card-body">
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 1rem;">
                  <div>
                    <div style="font-size: var(--font-size-lg); font-weight: bold; color: var(--color-primary-blue);">
                      ${mockExam.questionCount}
                    </div>
                    <div style="color: var(--color-text-secondary); font-size: var(--font-size-sm);">Questions</div>
                  </div>
                  <div>
                    <div style="font-size: var(--font-size-lg); font-weight: bold; color: var(--color-primary-blue);">
                      ${mockExam.timeLimit} min
                    </div>
                    <div style="color: var(--color-text-secondary); font-size: var(--font-size-sm);">Time Limit</div>
                  </div>
                  <div>
                    <div style="font-size: var(--font-size-lg); font-weight: bold; color: var(--color-primary-blue);">
                      ${mockExam.breaks}
                    </div>
                    <div style="color: var(--color-text-secondary); font-size: var(--font-size-sm);">Breaks (10 min each)</div>
                  </div>
                  <div>
                    <div style="font-size: var(--font-size-lg); font-weight: bold; color: var(--color-primary-blue);">
                      ${mockExam.passingScore}%
                    </div>
                    <div style="color: var(--color-text-secondary); font-size: var(--font-size-sm);">Passing Score</div>
                  </div>
                </div>

                <div style="margin-bottom: 1rem;">
                  <strong>Domain Distribution:</strong>
                  <div style="display: flex; gap: 1rem; margin-top: 0.5rem; flex-wrap: wrap;">
                    <span style="background: #e0e7ff; padding: 0.5rem 1rem; border-radius: 0.5rem; white-space: nowrap;">
                      People: ${mockExam.domainDistribution.people}
                    </span>
                    <span style="background: #ddd6fe; padding: 0.5rem 1rem; border-radius: 0.5rem; white-space: nowrap;">
                      Process: ${mockExam.domainDistribution.process}
                    </span>
                    <span style="background: #fce7f3; padding: 0.5rem 1rem; border-radius: 0.5rem; white-space: nowrap;">
                      Business: ${mockExam.domainDistribution.business}
                    </span>
                  </div>
                </div>

                ${examResult ? `
                  <div style="padding: 1rem; background: ${isPassed ? 'var(--color-green-light)' : 'var(--color-yellow-light)'}; border-radius: var(--radius-sm); margin-bottom: 1rem;">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                      <strong>Your Score:</strong>
                      <strong style="color: ${isPassed ? 'var(--color-trust-green)' : 'var(--color-warning)'};">
                        ${examResult.score}%
                      </strong>
                    </div>
                    <div style="font-size: var(--font-size-sm); color: var(--color-text-secondary);">
                      Completed on ${new Date(examResult.completedAt).toLocaleDateString()}
                    </div>
                  </div>
                ` : ''}

                <p style="color: var(--color-text-secondary); font-size: var(--font-size-sm); margin-bottom: 1rem;">
                  ${mockExam.description || 'Full-length exam simulation matching the real PMP exam format.'}
                </p>
              </div>
              <div class="card-footer">
                <button
                  class="btn btn-primary"
                  onclick="startMockExam('${safeActionArg(mockExam.id)}')"
                  ${!examResult && index > 0 && !completedExams.find(e => e.examId === mockExams[index-1].id) ? 'disabled' : ''}>
                  ${examResult ? '🔄 Retake Exam' : '🎯 Start Exam'}
                </button>
                ${examResult ? `
                  <button class="btn btn-outline" onclick="viewMockExamResults('${safeActionArg(mockExam.id)}')">
                    📊 View Results
                  </button>
                ` : ''}
              </div>
            </div>
          `;
        }).join('')}
      </div>

      ${mission.readinessCheck ? `
        <div class="card" style="margin-top: 2rem; background: linear-gradient(135deg, #EEF2FF, #DBEAFE);">
          <div class="card-header">
            <h3 class="card-title">📋 ${mission.readinessCheck.name}</h3>
          </div>
          <div class="card-body">
            <p style="margin-bottom: 1rem;">${mission.readinessCheck.description}</p>
            <ul style="list-style: none; padding: 0;">
              ${Object.entries(mission.readinessCheck.criteria).map(([key, value]) => {
                const criteriaLabels = {
                  mockExam2Passed: 'Pass Mock Exam 2 with 75%+',
                  allDomainsAbove70: 'Score 70%+ in all three domains',
                  weakAreasIdentified: 'Identify and address weak areas',
                  confidenceLevel: 'Feel confident and ready'
                };
                const label = criteriaLabels[key] || key;
                const isComplete = key === 'mockExam2Passed' ? exam2Passed : false;

                return `
                  <li style="padding: 0.75rem; margin-bottom: 0.5rem; background: white; border-radius: var(--radius-sm); display: flex; align-items: center; gap: 0.75rem;">
                    <span style="font-size: 1.25rem;">${isComplete ? '✅' : '⬜'}</span>
                    <span>${label}</span>
                  </li>
                `;
              }).join('')}
            </ul>
          </div>
        </div>
      ` : ''}
    </div>
  `;
}

/**
 * Render breadcrumb navigation
 * @param {Array} crumbs - Array of {label, path} objects
 * @returns {string} HTML for breadcrumb navigation
 */
function renderBreadcrumbs(crumbs) {
  if (!crumbs || crumbs.length === 0) return '';

  return `
    <nav class="breadcrumbs" aria-label="Breadcrumb" style="margin-bottom: 1.5rem;">
      <ol style="display: flex; gap: 0.5rem; list-style: none; padding: 0; flex-wrap: wrap; color: var(--color-text-secondary); font-size: var(--font-size-sm);">
        ${crumbs.map((crumb, index) => `
          <li style="display: flex; align-items: center; gap: 0.5rem;">
            ${index > 0 ? '<span aria-hidden="true">›</span>' : ''}
            ${index < crumbs.length - 1
              ? `<a href="#${crumb.path}" style="color: var(--color-primary-blue); text-decoration: none; hover: text-decoration: underline;">${crumb.label}</a>`
              : `<span style="color: var(--color-text-primary); font-weight: var(--font-weight-medium);">${crumb.label}</span>`
            }
          </li>
        `).join('')}
      </ol>
    </nav>
  `;
}

/**
 * Render individual task card
 */
function renderTaskCard(task, taskNumber, missionId) {
  if (!task || !task.id) {
    console.error('renderTaskCard called with invalid task:', task);
    return '<div class="card"><p>Invalid task data</p></div>';
  }

  const isCompleted = missionManager.isTaskCompleted(task.id);
  const stats = flashcardSystem.getTaskStatistics(task.id);

  return `
    <div class="card ${isCompleted ? '' : 'card-interactive'}"
         ${!isCompleted ? `onclick="startTask('${safeActionArg(task.id)}')"` : ''}>
      <div class="card-header">
        <div style="display: flex; justify-content: space-between; align-items: start;">
          <div>
            <h4 style="margin-bottom: 0.5rem;">
              ${taskNumber}. ${task.name}
              ${isCompleted ? ' <span style="color: var(--color-trust-green);">✓</span>' : ''}
            </h4>
            <p style="color: var(--color-text-secondary); font-size: var(--font-size-sm);">
              ${task.description || 'Click to start learning'}
            </p>
          </div>
          ${isCompleted ? `<span class="badge badge-success">Complete</span>` : `<span class="badge badge-primary">Start</span>`}
        </div>
      </div>

      ${stats ? `
        <div class="card-footer">
          <div style="font-size: var(--font-size-sm); color: var(--color-text-secondary);">
            <span>📚 ${stats.totalCards} flashcards</span>
            ${stats.dueForReview > 0 ? `<span style="color: var(--color-accent-gold);"> • ${stats.dueForReview} due</span>` : ''}
          </div>
        </div>
      ` : ''}
    </div>
  `;
}

/**
 * Global navigation helper for onclick handlers
 */
window.navigateTo = function(path) {
  router.navigate(path);
};

/**
 * Start a task (Learn → Flashcards → Quiz flow)
 */
window.startTask = function(taskId) {
  if (!taskId) {
    console.error('startTask called with undefined taskId');
    showToast('Error: Task ID is missing', 'error');
    return;
  }
  router.navigate(`/task/${taskId}`);
};

/**
 * Render Learn Phase
 * @param {string} taskId - Task ID
 * @param {Object} options - Rendering options { paginated: boolean, sectionIndex: number }
 */
async function renderLearnPhase(taskId, options = {}) {
  const task = missionManager.getTask(taskId);

  if (!task) {
    return `<div class="card"><h2>Task not found</h2></div>`;
  }

  // Check for Enhanced MVE content
  let enhancedContent = null;
  try {
    const response = await fetch(`data/enhanced-mve/${taskId}.json`);
    if (response.ok) {
      enhancedContent = await response.json();
    }
  } catch (error) {
    console.log(`No Enhanced MVE content found for ${taskId}, using standard content`);
  }

  // If Enhanced MVE content exists, render it
  if (enhancedContent) {
    return renderEnhancedMVE(taskId, enhancedContent, task, options);
  }

  // Otherwise, use standard content
  // Find learning content for this task
  // Handle both array and object structures
  let content = null;
  if (Array.isArray(appData.learningContent)) {
    content = appData.learningContent.find(c => c.taskId === taskId);
  } else if (appData.learningContent && appData.learningContent.topics) {
    // learningContent is an object with topics
    content = appData.learningContent.topics[taskId];
  }

  const breadcrumbs = renderBreadcrumbs([
    { label: 'Mission Map', path: '/' },
    { label: task.missionName || 'Mission', path: `/mission/${task.missionId}` },
    { label: task.name, path: `/learn/${taskId}` }
  ]);

  return `
    <div class="learn-phase">
      ${breadcrumbs}
      <div class="card">
        <div class="card-header">
          <h2 class="card-title">📚 Learn: ${task.name}</h2>
        </div>
        <div class="card-body">
          ${content ? `
            <div style="max-width: 900px; margin: 0 auto; line-height: 1.8;">
              ${content.content ? `
                <div class="learning-content">
                  ${content.content}
                </div>
              ` : content.sections ? content.sections.map(section => `
                <div style="margin-bottom: 2rem;">
                  <h3 style="color: var(--color-primary-blue); margin-bottom: 1rem;">${section.title}</h3>
                  <p style="line-height: 1.8; color: var(--color-text-primary);">${section.content}</p>
                  ${section.keyPoints ? `
                    <ul style="margin-top: 1rem; padding-left: 1.5rem; line-height: 1.8;">
                      ${section.keyPoints.map(point => `<li>${point}</li>`).join('')}
                    </ul>
                  ` : ''}
                </div>
              `).join('') : '<p>Learning content structure not recognized.</p>'}

              ${content.examTip ? `
                <div style="margin-top: 3rem; padding: 1.5rem; background: var(--color-blue-light); border-left: 4px solid var(--color-primary-blue); border-radius: var(--radius-md);">
                  <h3 style="margin-top: 0;">💡 Exam Tips</h3>
                  <p style="margin-bottom: 0;">${content.examTip}</p>
                </div>
              ` : ''}
            </div>
          ` : `
            <div style="text-align: center; padding: 3rem;">
              <h3>Learning Content</h3>
              <p style="color: var(--color-text-secondary); margin: 1rem 0 2rem;">
                This topic covers: ${task.name}
              </p>
              <p style="color: var(--color-text-muted); font-size: var(--font-size-sm);">
                Detailed learning content will be available soon.
              </p>
            </div>
          `}
        </div>
        <div class="card-footer">
          <button class="btn btn-secondary" onclick="navigateTo('/mission/${encodeURIComponent(task.missionId)}')">
            ← Back to Mission
          </button>
          <button class="btn btn-primary" onclick="completeLearnAndContinue('${safeActionArg(taskId)}')">
            Continue to Flashcards →
          </button>
        </div>
      </div>
    </div>
  `;
}

/**
 * Complete learn phase and continue to flashcards
 */
window.completeLearnAndContinue = function(taskId) {
  if (!taskId) {
    console.error('completeLearnAndContinue called with undefined taskId');
    showToast('Error: Task ID is missing', 'error');
    return;
  }
  gamification.awardXP(50); // 50 XP for completing learning
  showToast('Learning phase complete! +50 XP', 'success');
  router.navigate(`/flashcards/${taskId}`);
};

/**
 * Render Flashcards Phase
 */
function renderFlashcards(taskId) {
  const task = missionManager.getTask(taskId);

  if (!task) {
    return `<div class="card"><h2>Task not found</h2></div>`;
  }

  const stats = flashcardSystem.getTaskStatistics(taskId);

  if (!stats || stats.totalCards === 0) {
    return `
      <div class="card">
        <div class="card-header">
          <h2 class="card-title">🃏 Flashcards: ${task.name}</h2>
        </div>
        <div class="card-body" style="text-align: center; padding: 3rem;">
          <p>No flashcards available for this task yet.</p>
        </div>
        <div class="card-footer">
          <button class="btn btn-secondary" onclick="navigateTo('/mission/${encodeURIComponent(task.missionId)}')">
            ← Back to Mission
          </button>
          <button class="btn btn-primary" onclick="navigateTo('/quiz/${encodeURIComponent(taskId)}')">
            Skip to Quiz →
          </button>
        </div>
      </div>
    `;
  }

  const cardsToReview = Math.min(stats.dueForReview + stats.new, 20);
  const estimatedMinutes = Math.ceil(cardsToReview * 0.4); // ~24 seconds per card

  return `
    <div class="flashcards-phase">
      <div class="card" style="max-width: 900px; margin: 0 auto;">
        <!-- Header -->
        <div class="card-header" style="text-align: center; padding: var(--space-2xl); background: linear-gradient(135deg, #EDE9FE, #DBEAFE); border-bottom: 2px solid var(--color-primary-blue);">
          <div style="font-size: 4rem; margin-bottom: var(--space-md); animation: bounce 2s ease-in-out infinite;">🎴</div>
          <h2 class="card-title" style="font-size: var(--font-size-3xl); color: var(--color-primary-blue); margin-bottom: var(--space-sm);">
            Flashcard Practice
          </h2>
          <p style="font-size: var(--font-size-lg); color: var(--color-text-secondary); margin: 0;">
            ${task.name}
          </p>
        </div>

        <!-- Body -->
        <div class="card-body" style="padding: var(--space-2xl);">

          <!-- Session Overview -->
          <div style="text-align: center; margin-bottom: var(--space-2xl);">
            <h3 style="font-size: var(--font-size-2xl); color: var(--color-text-primary); margin-bottom: var(--space-md);">
              📋 Your Session Today
            </h3>
            <p style="color: var(--color-text-secondary); margin-bottom: var(--space-xl); line-height: var(--line-height-relaxed);">
              Review ${cardsToReview} flashcards using spaced repetition to master this topic.
              Estimated time: <strong>${estimatedMinutes} minutes</strong>.
            </p>
          </div>

          <!-- Stats Grid -->
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: var(--space-lg); max-width: 700px; margin: 0 auto var(--space-2xl);">
            <div class="card" style="text-align: center; padding: var(--space-lg); border: 2px solid var(--color-primary-blue); background: linear-gradient(135deg, #DBEAFE, white);">
              <div style="font-size: 3rem; font-weight: bold; color: var(--color-primary-blue); margin-bottom: var(--space-xs);">
                ${stats.totalCards}
              </div>
              <div style="font-size: var(--font-size-sm); color: var(--color-text-secondary); font-weight: var(--font-weight-semibold);">
                Total Cards
              </div>
            </div>

            <div class="card" style="text-align: center; padding: var(--space-lg); border: 2px solid var(--color-accent-gold); background: linear-gradient(135deg, #FEF3C7, white);">
              <div style="font-size: 3rem; font-weight: bold; color: var(--color-accent-gold); margin-bottom: var(--space-xs);">
                ${cardsToReview}
              </div>
              <div style="font-size: var(--font-size-sm); color: var(--color-text-secondary); font-weight: var(--font-weight-semibold);">
                To Review Today
              </div>
            </div>

            <div class="card" style="text-align: center; padding: var(--space-lg); border: 2px solid var(--color-trust-green); background: linear-gradient(135deg, #D1FAE5, white);">
              <div style="font-size: 3rem; font-weight: bold; color: var(--color-trust-green); margin-bottom: var(--space-xs);">
                ${stats.mastered}
              </div>
              <div style="font-size: var(--font-size-sm); color: var(--color-text-secondary); font-weight: var(--font-weight-semibold);">
                Mastered
              </div>
            </div>
          </div>

          <!-- How It Works -->
          <div style="background: linear-gradient(135deg, #EFF6FF, #DBEAFE); border-left: 4px solid var(--color-primary-blue); border-radius: var(--radius-lg); padding: var(--space-xl); margin-bottom: var(--space-2xl);">
            <h3 style="color: var(--color-primary-blue); margin: 0 0 var(--space-md) 0; font-size: var(--font-size-xl);">
              🧠 How the Leitner System Works
            </h3>
            <p style="margin-bottom: var(--space-md); line-height: var(--line-height-relaxed);">
              Cards are organized into 5 boxes based on how well you know them. Your ratings move cards between boxes:
            </p>
            <ul style="list-style: none; padding: 0; margin: 0;">
              <li style="margin-bottom: var(--space-sm); display: flex; align-items: flex-start; gap: var(--space-sm);">
                <span style="font-size: 1.5rem;">❌</span>
                <div>
                  <strong>Hard:</strong> Didn't know it → Moves to Box 1 (review every session)
                </div>
              </li>
              <li style="margin-bottom: var(--space-sm); display: flex; align-items: flex-start; gap: var(--space-sm);">
                <span style="font-size: 1.5rem;">⚠️</span>
                <div>
                  <strong>Medium:</strong> Knew it with effort → Stays in current box
                </div>
              </li>
              <li style="display: flex; align-items: flex-start; gap: var(--space-sm);">
                <span style="font-size: 1.5rem;">✅</span>
                <div>
                  <strong>Easy:</strong> Knew it instantly → Moves up one box (longer review interval)
                </div>
              </li>
            </ul>
          </div>

          <!-- Session Tips -->
          <div style="background: linear-gradient(135deg, #FEFCE8, #FEF3C7); border-left: 4px solid var(--color-accent-gold); border-radius: var(--radius-lg); padding: var(--space-xl); margin-bottom: var(--space-2xl);">
            <h3 style="color: var(--color-accent-gold); margin: 0 0 var(--space-md) 0; font-size: var(--font-size-xl);">
              💡 Tips for Success
            </h3>
            <ul style="list-style: none; padding: 0; margin: 0;">
              <li style="margin-bottom: var(--space-sm);">✅ Read the question carefully before flipping</li>
              <li style="margin-bottom: var(--space-sm);">✅ Be honest with your ratings - it helps you learn</li>
              <li style="margin-bottom: var(--space-sm);">✅ Focus on understanding, not memorization</li>
              <li>✅ Review daily for best retention (even 5 minutes helps!)</li>
            </ul>
          </div>

          <!-- Start Button -->
          <div style="text-align: center; margin-top: var(--space-2xl);">
            <button class="btn btn-primary btn-lg" onclick="startFlashcardSession('${safeActionArg(taskId)}')" style="min-width: 200px; font-size: var(--font-size-lg); padding: var(--space-lg) var(--space-2xl);">
              🎴 Begin Session →
            </button>
            <p style="font-size: var(--font-size-sm); color: var(--color-text-muted); margin-top: var(--space-md);">
              Earn <strong>+${cardsToReview * 10} XP</strong> by completing this session
            </p>
          </div>
        </div>

        <!-- Footer -->
        <div class="card-footer" style="padding: var(--space-xl); background: var(--color-background); border-top: 1px solid var(--color-gray-200);">
          <div style="display: flex; justify-content: space-between; gap: var(--space-md); flex-wrap: wrap;">
            <button class="btn btn-outline" onclick="router.navigate('/task/${encodeURIComponent(taskId)}')">
              ← Back to Task Overview
            </button>
            <button class="btn btn-secondary" onclick="router.navigate('/quiz/${encodeURIComponent(taskId)}')">
              Skip to Quiz →
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
}

/**
 * Flashcard session state
 */
let flashcardSession = null;

/**
 * Start interactive flashcard session
 */
window.startFlashcardSession = function(taskId) {
  if (!taskId) {
    console.error('startFlashcardSession called with undefined taskId');
    showToast('Error: Task ID is missing', 'error');
    return;
  }

  // Start the session
  const session = flashcardSystem.startSession(taskId, {
    maxCards: 20,
    reviewDue: true,
    includeNew: true,
    randomize: true
  });

  if (!session) {
    showToast('No flashcards available for this task', 'error');
    return;
  }

  flashcardSession = {
    taskId,
    cards: session.cards,
    currentIndex: 0,
    flipped: false,
    reviewed: 0
  };

  renderFlashcardSession();
};

/**
 * Render interactive flashcard session
 */
function renderFlashcardSession() {
  if (!flashcardSession) return;

  const { cards, currentIndex, flipped } = flashcardSession;
  const card = cards[currentIndex];
  const progress = Math.round(((currentIndex + 1) / cards.length) * 100);

  const appView = document.getElementById('app-view');
  setSafeInnerHTML(appView, `
    <div class="flashcard-session">
      <div class="card">
        <div class="card-header">
          <h2>🃏 Flashcard Review</h2>
          <p style="color: var(--color-text-secondary);">
            Card ${currentIndex + 1} of ${cards.length}
          </p>
        </div>

        <div class="progress-bar" style="margin: 0 1.5rem 1rem 1.5rem;">
          <div class="progress-fill" style="width: ${progress}%;"></div>
        </div>

        <div class="card-body" style="min-height: 300px; display: flex; flex-direction: column; align-items: center; justify-content: center;">
          <div class="flashcard ${flipped ? 'flipped' : ''}" onclick="flipFlashcard()"
               style="width: 100%; max-width: 600px; min-height: 250px; cursor: pointer; perspective: 1000px;">
            <div style="position: relative; width: 100%; height: 100%; transition: transform 0.6s; transform-style: preserve-3d; ${flipped ? 'transform: rotateY(180deg);' : ''}">

              <!-- Front (Question) -->
              <div style="position: absolute; width: 100%; height: 100%; backface-visibility: hidden; background: linear-gradient(135deg, var(--color-integrity-blue) 0%, var(--color-trust-blue) 100%); color: white; border-radius: 12px; padding: 2rem; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; min-height: 250px;">
                <p style="font-size: 0.875rem; opacity: 0.9; margin-bottom: 1rem;">QUESTION</p>
                <h3 style="font-size: 1.25rem; line-height: 1.6; margin: 0;">
                  ${card.question}
                </h3>
                <p style="font-size: 0.875rem; opacity: 0.8; margin-top: 1.5rem;">
                  💡 Click to reveal answer
                </p>
              </div>

              <!-- Back (Answer) -->
              <div style="position: absolute; width: 100%; height: 100%; backface-visibility: hidden; transform: rotateY(180deg); background: linear-gradient(135deg, var(--color-trust-green) 0%, var(--color-stewardship-teal) 100%); color: white; border-radius: 12px; padding: 2rem; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; min-height: 250px;">
                <p style="font-size: 0.875rem; opacity: 0.9; margin-bottom: 1rem;">ANSWER</p>
                <h3 style="font-size: 1.125rem; line-height: 1.6; margin: 0;">
                  ${card.answer}
                </h3>
                ${card.difficulty ? `
                  <p style="font-size: 0.875rem; opacity: 0.8; margin-top: 1rem;">
                    Difficulty: ${card.difficulty}
                  </p>
                ` : ''}
              </div>
            </div>
          </div>

          ${flipped ? `
            <div style="margin-top: 2rem; text-align: center;">
              <p style="margin-bottom: 1rem; color: var(--color-text-secondary);">
                How well did you know this?
              </p>
              <div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
                <button class="btn btn-outline" onclick="rateFlashcard(1)"
                        style="background: var(--color-urgency-red); color: white; border-color: var(--color-urgency-red); min-width: 120px; font-size: 1rem;">
                  <span style="font-size: 1.5rem;">😰</span> Hard
                </button>
                <button class="btn btn-outline" onclick="rateFlashcard(3)"
                        style="background: var(--color-warning-yellow); color: var(--color-text-primary); border-color: var(--color-warning-yellow); min-width: 120px; font-size: 1rem;">
                  <span style="font-size: 1.5rem;">🤔</span> Medium
                </button>
                <button class="btn btn-primary" onclick="rateFlashcard(5)"
                        style="min-width: 120px; font-size: 1rem;">
                  <span style="font-size: 1.5rem;">✅</span> Easy
                </button>
              </div>
            </div>
          ` : ''}
        </div>

        <div class="card-footer">
          <button class="btn btn-secondary" onclick="exitFlashcardSession()">
            Exit Session
          </button>
          <div>
            <span style="color: var(--color-text-secondary); margin-right: 1rem;">
              Reviewed: ${flashcardSession.reviewed} / ${cards.length}
            </span>
          </div>
        </div>
      </div>
    </div>
  `);
}

/**
 * Flip the current flashcard
 */
window.flipFlashcard = function() {
  if (!flashcardSession) return;
  flashcardSession.flipped = !flashcardSession.flipped;
  renderFlashcardSession();
};

/**
 * Rate current flashcard and move to next
 */
window.rateFlashcard = function(rating) {
  if (!flashcardSession) return;

  const { cards, currentIndex, taskId } = flashcardSession;
  const card = cards[currentIndex];

  // Update card in flashcard system based on rating
  flashcardSystem.reviewCard(card.id, rating >= 4);

  flashcardSession.reviewed++;

  // Move to next card
  if (currentIndex + 1 < cards.length) {
    flashcardSession.currentIndex++;
    flashcardSession.flipped = false;
    renderFlashcardSession();
  } else {
    // Session complete
    completeFlashcardSession();
  }
};

/**
 * Exit flashcard session early
 */
window.exitFlashcardSession = function() {
  if (!flashcardSession) return;

  const { reviewed } = flashcardSession;

  if (reviewed > 0) {
    gamification.awardXP(reviewed * 2); // 2 XP per card reviewed
    showToast(`Session ended. +${reviewed * 2} XP for ${reviewed} cards reviewed!`, 'info');
  }

  flashcardSession = null;
  router.navigate(`/flashcards/${flashcardSession?.taskId || ''}`);
};

/**
 * Complete flashcard session
 */
function completeFlashcardSession() {
  if (!flashcardSession) return;

  const { reviewed, taskId } = flashcardSession;
  const xpEarned = reviewed * 3; // 3 XP per card when completing full session

  gamification.awardXP(xpEarned);

  const appView = document.getElementById('app-view');
  setSafeInnerHTML(appView, `
    <div class="flashcard-session">
      <div class="card" style="max-width: 600px; margin: 0 auto; text-align: center;">
        <div class="card-header">
          <h2>🎉 Session Complete!</h2>
        </div>
        <div class="card-body">
          <div style="font-size: 4rem; margin: 1rem 0;">✅</div>
          <h3>Great job!</h3>
          <p style="color: var(--color-text-secondary); margin: 1rem 0;">
            You reviewed <strong>${reviewed}</strong> flashcards
          </p>
          <p style="color: var(--color-trust-green); font-size: 1.25rem; font-weight: 600;">
            +${xpEarned} XP
          </p>
        </div>
        <div class="card-footer">
          <button class="btn btn-secondary" onclick="navigateTo('/flashcards/${encodeURIComponent(taskId)}')">
            ← Back to Flashcards
          </button>
          <button class="btn btn-primary" onclick="navigateTo('/quiz/${encodeURIComponent(taskId)}')">
            Take Quiz →
          </button>
        </div>
      </div>
    </div>
  `);

  flashcardSession = null;
  showToast(`Flashcard session complete! +${xpEarned} XP`, 'success');
};

/**
 * Render Quiz Phase
 */
function renderQuiz(taskId) {
  const task = missionManager.getTask(taskId);

  if (!task) {
    return `<div class="card"><h2>Task not found</h2></div>`;
  }

  // Check progress to show preparation status
  const progress = taskFlow.getTaskProgress(taskId);
  const learnComplete = progress.learnPhase?.completed || false;
  const flashcardsComplete = progress.flashcardsPhase?.completed || false;
  const quizAttempts = progress.quizPhase?.attempts || 0;
  const highScore = progress.quizPhase?.highScore || 0;

  // Calculate readiness score
  let readinessScore = 0;
  let readinessStatus = [];

  if (learnComplete) {
    readinessScore += 40;
    readinessStatus.push({ icon: '✅', text: 'Completed Learn phase', status: 'complete' });
  } else {
    readinessStatus.push({ icon: '⚠️', text: 'Learn phase not completed', status: 'warning' });
  }

  if (flashcardsComplete) {
    readinessScore += 40;
    readinessStatus.push({ icon: '✅', text: 'Completed Flashcards', status: 'complete' });
  } else {
    readinessStatus.push({ icon: '⚠️', text: 'Flashcards not completed', status: 'warning' });
  }

  if (quizAttempts > 0) {
    readinessScore += 20;
    readinessStatus.push({ icon: '📊', text: `Previous best score: ${highScore}%`, status: quizAttempts > 0 ? 'info' : 'none' });
  } else {
    readinessScore += 20; // Give full points for first attempt
    readinessStatus.push({ icon: '🆕', text: 'First attempt', status: 'info' });
  }

  let readinessColor = '#10B981'; // Green
  let readinessLabel = 'Well Prepared';
  if (readinessScore < 60) {
    readinessColor = '#F59E0B'; // Amber
    readinessLabel = 'Moderately Prepared';
  }
  if (readinessScore < 40) {
    readinessColor = '#EF4444'; // Red
    readinessLabel = 'Needs More Preparation';
  }

  return `
    <div class="quiz-phase">
      <div class="card" style="max-width: 900px; margin: 0 auto;">
        <!-- Header -->
        <div class="card-header" style="text-align: center; padding: var(--space-2xl); background: linear-gradient(135deg, #D1FAE5, #DBEAFE); border-bottom: 2px solid var(--color-trust-green);">
          <div style="font-size: 4rem; margin-bottom: var(--space-md); animation: bounce 2s ease-in-out infinite;">🏆</div>
          <h2 class="card-title" style="font-size: var(--font-size-3xl); color: var(--color-trust-green); margin-bottom: var(--space-sm);">
            Summit Push: Final Quiz
          </h2>
          <p style="font-size: var(--font-size-lg); color: var(--color-text-secondary); margin: 0;">
            ${task.name}
          </p>
        </div>

        <!-- Body -->
        <div class="card-body" style="padding: var(--space-2xl);">

          <!-- Readiness Check -->
          <div style="background: linear-gradient(135deg, #EFF6FF, white); border: 2px solid ${readinessColor}; border-radius: var(--radius-xl); padding: var(--space-xl); margin-bottom: var(--space-2xl); text-align: center;">
            <h3 style="font-size: var(--font-size-xl); color: ${readinessColor}; margin-bottom: var(--space-md);">
              📊 Preparation Status: ${readinessLabel}
            </h3>
            <div style="background: white; border-radius: var(--radius-lg); padding: var(--space-md); margin-bottom: var(--space-lg);">
              <div style="height: 20px; background: #E5E7EB; border-radius: var(--radius-full); overflow: hidden;">
                <div style="height: 100%; width: ${readinessScore}%; background: linear-gradient(90deg, ${readinessColor}, var(--color-primary-blue)); transition: width 0.5s ease;"></div>
              </div>
            </div>
            <div style="display: grid; grid-template-columns: 1fr; gap: var(--space-sm); text-align: left; max-width: 400px; margin: 0 auto;">
              ${readinessStatus.map(item => `
                <div style="display: flex; align-items: center; gap: var(--space-sm); padding: var(--space-sm); background: white; border-radius: var(--radius-md);">
                  <span style="font-size: 1.5rem;">${item.icon}</span>
                  <span style="color: var(--color-text-secondary);">${item.text}</span>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Quiz Details -->
          <div style="margin-bottom: var(--space-2xl);">
            <h3 style="text-align: center; font-size: var(--font-size-2xl); color: var(--color-text-primary); margin-bottom: var(--space-xl);">
              🎯 What to Expect
            </h3>

            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: var(--space-lg); margin-bottom: var(--space-xl);">
              <div class="card" style="text-align: center; padding: var(--space-lg); border: 2px solid var(--color-primary-blue);">
                <div style="font-size: 3rem; margin-bottom: var(--space-sm);">10</div>
                <div style="color: var(--color-text-secondary); font-weight: var(--font-weight-semibold);">Questions</div>
                <div style="font-size: var(--font-size-xs); color: var(--color-text-muted); margin-top: var(--space-xs);">Mixed difficulty</div>
              </div>

              <div class="card" style="text-align: center; padding: var(--space-lg); border: 2px solid var(--color-trust-green);">
                <div style="font-size: 3rem; margin-bottom: var(--space-sm);">75%</div>
                <div style="color: var(--color-text-secondary); font-weight: var(--font-weight-semibold);">To Pass</div>
                <div style="font-size: var(--font-size-xs); color: var(--color-text-muted); margin-top: var(--space-xs);">8 out of 10</div>
              </div>

              <div class="card" style="text-align: center; padding: var(--space-lg); border: 2px solid var(--color-accent-gold);">
                <div style="font-size: 3rem; margin-bottom: var(--space-sm);">∞</div>
                <div style="color: var(--color-text-secondary); font-weight: var(--font-weight-semibold);">Retakes</div>
                <div style="font-size: var(--font-size-xs); color: var(--color-text-muted); margin-top: var(--space-xs);">Unlimited attempts</div>
              </div>

              <div class="card" style="text-align: center; padding: var(--space-lg); border: 2px solid #8B5CF6;">
                <div style="font-size: 3rem; margin-bottom: var(--space-sm);">+70</div>
                <div style="color: var(--color-text-secondary); font-weight: var(--font-weight-semibold);">XP Reward</div>
                <div style="font-size: var(--font-size-xs); color: var(--color-text-muted); margin-top: var(--space-xs);">When you pass</div>
              </div>
            </div>
          </div>

          <!-- Quiz Features -->
          <div style="background: linear-gradient(135deg, #FEFCE8, #FEF3C7); border-left: 4px solid var(--color-accent-gold); border-radius: var(--radius-lg); padding: var(--space-xl); margin-bottom: var(--space-2xl);">
            <h3 style="color: var(--color-accent-gold); margin: 0 0 var(--space-md) 0; font-size: var(--font-size-xl);">
              ✨ Quiz Features
            </h3>
            <ul style="list-style: none; padding: 0; margin: 0; display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: var(--space-sm);">
              <li style="display: flex; align-items: flex-start; gap: var(--space-sm);">
                <span>✅</span> Immediate feedback on each answer
              </li>
              <li style="display: flex; align-items: flex-start; gap: var(--space-sm);">
                <span>✅</span> Detailed explanations provided
              </li>
              <li style="display: flex; align-items; gap: var(--space-sm);">
                <span>✅</span> No time limit - take your time
              </li>
              <li style="display: flex; align-items: flex-start; gap: var(--space-sm);">
                <span>✅</span> Progress saved automatically
              </li>
            </ul>
          </div>

          <!-- Tips -->
          <div style="background: linear-gradient(135deg, #EFF6FF, #DBEAFE); border-left: 4px solid var(--color-primary-blue); border-radius: var(--radius-lg); padding: var(--space-xl); margin-bottom: var(--space-2xl);">
            <h3 style="color: var(--color-primary-blue); margin: 0 0 var(--space-md) 0; font-size: var(--font-size-xl);">
              💡 Tips for Success
            </h3>
            <ul style="list-style: none; padding: 0; margin: 0;">
              <li style="margin-bottom: var(--space-sm);">🎯 Read each question carefully - watch for keywords like "FIRST", "NEXT", "BEST"</li>
              <li style="margin-bottom: var(--space-sm);">🧠 Use process of elimination to narrow down choices</li>
              <li style="margin-bottom: var(--space-sm);">📚 Review the explanation even when you get it right</li>
              <li>🔄 Don't worry if you don't pass - learn from mistakes and retry!</li>
            </ul>
          </div>

          <!-- Start Button -->
          <div style="text-align: center;">
            <button class="btn btn-lg" onclick="startQuiz('${safeActionArg(taskId)}')" style="background: linear-gradient(135deg, var(--color-trust-green), #059669); color: white; min-width: 220px; font-size: var(--font-size-lg); padding: var(--space-lg) var(--space-2xl); box-shadow: var(--shadow-lg);">
              ${quizAttempts > 0 ? '🔄 Retry Quiz' : '🚀 Start Quiz'} →
            </button>
            <p style="font-size: var(--font-size-sm); color: var(--color-text-muted); margin-top: var(--space-md);">
              ${readinessScore < 60 ? '⚠️ Consider reviewing Learn or Flashcards first for better results' : '💪 You\'re prepared - good luck!'}
            </p>
          </div>
        </div>

        <!-- Footer -->
        <div class="card-footer" style="padding: var(--space-xl); background: var(--color-background); border-top: 1px solid var(--color-gray-200);">
          <div style="display: flex; justify-content: space-between; gap: var(--space-md); flex-wrap: wrap;">
            <button class="btn btn-outline" onclick="router.navigate('/task/${encodeURIComponent(taskId)}')">
              ← Back to Task Overview
            </button>
            <button class="btn btn-secondary" onclick="router.navigate('/flashcards/${encodeURIComponent(taskId)}')">
              📚 Review Flashcards
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
}

/**
 * Quiz session state
 */
let quizSession = null;

/**
 * Start interactive quiz
 */
window.startQuiz = function(taskId) {
  if (!taskId) {
    console.error('startQuiz called with undefined taskId');
    showToast('Error: Task ID is missing', 'error');
    return;
  }

  const quiz = quizEngine.generateQuiz(taskId, {
    questionCount: 10,
    difficulty: 'mixed',
    randomize: true
  });

  if (!quiz) {
    showToast('No quiz questions available for this task', 'error');
    return;
  }

  quizSession = {
    taskId,
    quiz,
    currentQuestionIndex: 0,
    selectedAnswer: null,
    answers: [],
    showingFeedback: false
  };

  renderQuizSession();
};

/**
 * Render interactive quiz session
 */
function renderQuizSession() {
  if (!quizSession) return;

  const { quiz, currentQuestionIndex, selectedAnswer, showingFeedback } = quizSession;
  const question = quiz.questions[currentQuestionIndex];
  const progress = Math.round(((currentQuestionIndex + 1) / quiz.questions.length) * 100);
  const isLastQuestion = currentQuestionIndex === quiz.questions.length - 1;

  const appView = document.getElementById('app-view');
  setSafeInnerHTML(appView, `
    <div class="quiz-session">
      <div class="card" style="max-width: 900px; margin: 0 auto;">
        <div class="card-header">
          <h2>📝 Quiz</h2>
          <p style="color: var(--color-text-secondary);">
            Question ${currentQuestionIndex + 1} of ${quiz.questions.length}
          </p>
        </div>

        <div class="progress-bar" style="margin: 0 1.5rem 1.5rem 1.5rem;">
          <div class="progress-fill" style="width: ${progress}%;"></div>
        </div>

        <div class="card-body">
          <!-- Question -->
          <div style="margin-bottom: 2rem;">
            <div style="display: inline-block; padding: 0.25rem 0.75rem; background: var(--color-integrity-blue); color: white; border-radius: 4px; font-size: 0.875rem; margin-bottom: 1rem;">
              ${question.difficulty || 'medium'}
            </div>
            <h3 style="font-size: 1.25rem; line-height: 1.6; margin-bottom: 1.5rem;">
              ${question.question}
            </h3>
          </div>

          <!-- Answer Options -->
          <div style="display: grid; gap: 1rem;">
            ${question.options
              .map((option, index) => {
              const isSelected = selectedAnswer === option.id;
              const isCorrect = option.id === question.correctAnswer;
              const showCorrect = showingFeedback && isCorrect;
              const showIncorrect = showingFeedback && isSelected && !isCorrect;
              const displayLetter = String.fromCharCode(65 + index); // A, B, C, D based on position

              let bgColor = 'var(--color-surface)';
              let borderColor = 'var(--color-border)';
              let borderWidth = '2px';

              if (showCorrect) {
                bgColor = 'var(--color-trust-green-light)';
                borderColor = 'var(--color-trust-green)';
                borderWidth = '3px';
              } else if (showIncorrect) {
                bgColor = 'var(--color-urgency-red-light)';
                borderColor = 'var(--color-urgency-red)';
                borderWidth = '3px';
              } else if (isSelected) {
                bgColor = '#EFF6FF'; // Light blue background when selected
                borderColor = 'var(--color-integrity-blue)';
                borderWidth = '3px';
              }

              return `
                <div class="quiz-option ${showingFeedback ? 'disabled' : ''}"
                     onclick="${showingFeedback ? '' : `selectQuizAnswer('${safeActionArg(option.id)}')`}"
                     style="padding: 1rem 1.5rem; border: ${borderWidth} solid ${borderColor}; border-radius: 8px; cursor: ${showingFeedback ? 'default' : 'pointer'}; transition: background-color 0.2s, border-color 0.2s, box-shadow 0.2s, transform 0.2s, opacity 0.2s; background: ${bgColor}; ${showingFeedback ? '' : 'hover:border-color: var(--color-integrity-blue); hover:background: var(--color-surface-hover);'}">
                  <div style="display: flex; align-items: start; gap: 1rem;">
                    <div style="flex-shrink: 0; width: 24px; height: 24px; border: 2px solid ${borderColor}; border-radius: 50%; display: flex; align-items: center; justify-content: center; background: ${isSelected || showCorrect ? borderColor : 'transparent'};">
                      ${(isSelected || showCorrect) ? '<span style="color: white; font-weight: bold;">✓</span>' : ''}
                    </div>
                    <div style="flex: 1;">
                      <strong style="margin-right: 0.5rem;">${displayLetter}.</strong>
                      ${option.text}
                      ${showCorrect ? '<span style="margin-left: 0.5rem; color: var(--color-trust-green); font-weight: 600;">✓ Correct</span>' : ''}
                      ${showIncorrect ? '<span style="margin-left: 0.5rem; color: var(--color-urgency-red); font-weight: 600;">✗ Incorrect</span>' : ''}
                    </div>
                  </div>
                </div>
              `);
            }).join('')}
          </div>

          <!-- Enhanced Feedback Banner -->
          ${showingFeedback ? (() => {
            const isCorrect = selectedAnswer === question.correctAnswer;
            const correctCount = quizSession.answers.filter(a => a.isCorrect).length;
            const currentScore = Math.round((correctCount / quizSession.answers.length) * 100);

            // Consecutive correct streak
            let streak = 0;
            for (let i = quizSession.answers.length - 1; i >= 0; i--) {
              if (quizSession.answers[i].isCorrect) streak++;
              else break;
            }

            const correctMessages = [
              { emoji: '🎯', text: 'Perfect! You nailed it!', subtext: 'Great understanding of the concept!' },
              { emoji: '⭐', text: 'Excellent work!', subtext: 'You\'re on the right track!' },
              { emoji: '💪', text: 'Well done!', subtext: 'Your preparation is paying off!' },
              { emoji: '🎊', text: 'Spot on!', subtext: 'You really know your stuff!' },
              { emoji: '🏆', text: 'Outstanding!', subtext: 'That\'s how it\'s done!' }
            ];

            const incorrectMessages = [
              { emoji: '📚', text: 'Not quite, but you\'re learning!', subtext: 'Every mistake is a step forward.' },
              { emoji: '💡', text: 'Good try!', subtext: 'Let\'s learn from this one.' },
              { emoji: '🎯', text: 'Almost there!', subtext: 'Review the explanation below.' },
              { emoji: '📖', text: 'Keep going!', subtext: 'Understanding comes with practice.' }
            ];

            const randomMsg = isCorrect ?
              correctMessages[Math.floor(Math.random() * correctMessages.length)] :
              incorrectMessages[Math.floor(Math.random() * incorrectMessages.length)];

            return `
              <div style="margin-top: 2rem; padding: 1.5rem; background: linear-gradient(135deg, ${isCorrect ? '#D1FAE5, #DBEAFE' : '#FEE2E2, #FEF3C7'}); border: 3px solid ${isCorrect ? 'var(--color-trust-green)' : 'var(--color-urgency-red)'}; border-radius: var(--radius-xl); animation: feedbackSlideIn 0.4s ease;">
                <div style="display: flex; align-items: center; gap: var(--space-lg); margin-bottom: var(--space-md);">
                  <div style="font-size: 3rem; animation: ${isCorrect ? 'celebrationBounce' : 'shake'} 0.5s ease;">${randomMsg.emoji}</div>
                  <div style="flex: 1;">
                    <h4 style="margin: 0 0 var(--space-xs) 0; color: ${isCorrect ? 'var(--color-trust-green)' : 'var(--color-urgency-red)'}; font-size: var(--font-size-xl); font-weight: bold;">
                      ${randomMsg.text}
                    </h4>
                    <p style="margin: 0; color: var(--color-gray-700);">
                      ${randomMsg.subtext}
                    </p>
                  </div>
                  <div style="text-align: center; padding: var(--space-md); background: white; border-radius: var(--radius-lg); box-shadow: var(--shadow-sm);">
                    <div style="font-size: var(--font-size-2xl); font-weight: bold; color: ${currentScore >= 75 ? 'var(--color-trust-green)' : currentScore >= 50 ? 'var(--color-accent-gold)' : 'var(--color-urgency-red)'};">
                      ${currentScore}%
                    </div>
                    <div style="font-size: var(--font-size-xs); color: var(--color-text-muted);">
                      Current Score
                    </div>
                  </div>
                </div>
                ${streak >= 3 && isCorrect ? `
                  <div style="padding: var(--space-sm) var(--space-md); background: linear-gradient(135deg, #FEF3C7, #FEE2E2); border-radius: var(--radius-md); text-align: center; margin-bottom: var(--space-md); animation: popIn 0.3s ease 0.2s both;">
                    <span style="font-size: 1.2rem;">🔥</span>
                    <strong style="color: var(--color-accent-gold); margin-left: var(--space-xs);">${streak} in a row!</strong>
                    <span style="color: var(--color-gray-600); margin-left: var(--space-xs);">You're on fire!</span>
                  </div>
                ` : ''}
              </div>

              <!-- Explanation -->
              ${question.explanation ? `
                <div style="margin-top: var(--space-lg); padding: var(--space-xl); background: linear-gradient(135deg, #EFF6FF, white); border-left: 4px solid var(--color-primary-blue); border-radius: var(--radius-lg);">
                  <h4 style="margin-bottom: var(--space-md); color: var(--color-primary-blue); font-size: var(--font-size-lg); display: flex; align-items: center; gap: var(--space-sm);">
                    <span style="font-size: 1.5rem;">💡</span> Explanation
                  </h4>
                  <p style="margin: 0; line-height: var(--line-height-relaxed); color: var(--color-gray-700);">
                    ${question.explanation}
                  </p>
                </div>
              ` : ''}

              <style>
                @keyframes feedbackSlideIn {
                  from { transform: translateY(-20px); opacity: 0; }
                  to { transform: translateY(0); opacity: 1; }
                }
                @keyframes shake {
                  0%, 100% { transform: translateX(0); }
                  25% { transform: translateX(-10px); }
                  75% { transform: translateX(10px); }
                }
              </style>
            `;
          })() : ''}

          <!-- Score Summary (bottom right) -->
          <div style="margin-top: 2rem; text-align: right; color: var(--color-text-secondary);">
            Answered: ${quizSession.answers.length} / ${quiz.questions.length}
          </div>
        </div>

        <div class="card-footer">
          <button class="btn btn-secondary" onclick="exitQuizSession()">
            Exit Quiz
          </button>
          ${!showingFeedback ? `
            <button class="btn btn-primary"
                    onclick="submitQuizAnswer()"
                    ${!selectedAnswer ? 'disabled' : ''}
                    style="${!selectedAnswer ? 'opacity: 0.5; cursor: not-allowed;' : ''}">
              Submit Answer
            </button>
          ` : `
            <button class="btn btn-primary" onclick="nextQuizQuestion()">
              ${isLastQuestion ? 'Finish Quiz →' : 'Next Question →'}
            </button>
          `}
        </div>
      </div>
    </div>
  `;
}

/**
 * Select quiz answer
 */
window.selectQuizAnswer = function(answerId) {
  if (!quizSession || quizSession.showingFeedback) return;
  quizSession.selectedAnswer = answerId;
  renderQuizSession();
};

/**
 * Submit quiz answer
 */
window.submitQuizAnswer = function() {
  if (!quizSession || !quizSession.selectedAnswer) return;

  const { quiz, currentQuestionIndex, selectedAnswer } = quizSession;
  const question = quiz.questions[currentQuestionIndex];
  const isCorrect = selectedAnswer === question.correctAnswer;

  // Record answer
  quizSession.answers.push({
    questionId: question.id,
    selectedAnswer,
    correctAnswer: question.correctAnswer,
    isCorrect
  });

  // Submit to quiz engine
  quizEngine.submitAnswer(selectedAnswer);

  // Show feedback
  quizSession.showingFeedback = true;
  renderQuizSession();
};

/**
 * Move to next question or finish quiz
 */
window.nextQuizQuestion = function() {
  if (!quizSession) return;

  const { quiz, currentQuestionIndex } = quizSession;
  const isLastQuestion = currentQuestionIndex === quiz.questions.length - 1;

  if (isLastQuestion) {
    finishQuizSession();
  } else {
    quizEngine.nextQuestion();
    quizSession.currentQuestionIndex++;
    quizSession.selectedAnswer = null;
    quizSession.showingFeedback = false;
    renderQuizSession();
  }
};

/**
 * Exit quiz session early
 */
window.exitQuizSession = function() {
  if (!quizSession) return;

  if (quizSession.answers.length > 0) {
    if (!confirm(`You've answered ${quizSession.answers.length} questions. Exit quiz anyway?`)) {
      return;
    }
  }

  quizEngine.reset();
  quizSession = null;
  router.navigate(`/quiz/${quizSession?.taskId || ''}`);
};

/**
 * Finish quiz and show results
 */
function finishQuizSession() {
  if (!quizSession) return;

  const results = quizEngine.calculateResults();
  const { taskId, answers } = quizSession;
  const task = missionManager.getTask(taskId);

  const appView = document.getElementById('app-view');
  setSafeInnerHTML(appView, `
    <div class="quiz-session">
      <div class="card" style="max-width: 700px; margin: 0 auto; text-align: center;">
        <div class="card-header">
          <h2>${results.passed ? '🎉' : '📚'} Quiz ${results.passed ? 'Passed!' : 'Complete'}</h2>
        </div>
        <div class="card-body">
          <div style="font-size: 4rem; margin: 1rem 0;">
            ${results.passed ? '✅' : '📊'}
          </div>

          <h3 style="font-size: 2rem; color: ${results.passed ? 'var(--color-trust-green)' : 'var(--color-text-primary)'}; margin-bottom: 1rem;">
            ${results.score}%
          </h3>

          <p style="font-size: 1.125rem; color: var(--color-text-secondary); margin-bottom: 2rem;">
            ${results.correctAnswers} out of ${results.totalQuestions} correct
          </p>

          ${results.passed ? `
            <div style="padding: 1rem; background: var(--color-trust-green-light); border-radius: 8px; margin-bottom: 2rem;">
              <p style="margin: 0; color: var(--color-trust-green); font-weight: 600;">
                Passing score achieved! (75% required)
              </p>
            </div>
          ` : `
            <div style="padding: 1rem; background: var(--color-warning-yellow-light); border-radius: 8px; margin-bottom: 2rem;">
              <p style="margin: 0; color: var(--color-text-primary);">
                You need 75% to pass. Review the material and try again!
              </p>
            </div>
          `}

          <div style="padding: 1.5rem; background: var(--color-integrity-blue-light); border-radius: 8px; margin-bottom: 2rem;">
            <h4 style="margin-bottom: 0.5rem;">XP Earned</h4>
            <p style="font-size: 1.5rem; font-weight: 600; color: var(--color-integrity-blue); margin: 0;">
              +${results.xpEarned} XP
            </p>
          </div>
        </div>
        <div class="card-footer">
          <button class="btn btn-secondary" onclick="navigateTo('/learn/${encodeURIComponent(taskId)}')">
            ← Review Material
          </button>
          ${results.passed ? `
            <button class="btn btn-primary" onclick="navigateTo('/mission/${encodeURIComponent(task?.missionId || 'm1')}')">
              Continue Journey →
            </button>
          ` : `
            <button class="btn btn-primary" onclick="navigateTo('/quiz/${encodeURIComponent(taskId)}')">
              Try Again
            </button>
          `}
        </div>
      </div>
    </div>
  `);

  // Award XP
  gamification.awardXP(results.xpEarned);

  if (results.passed) {
    gamification.triggerConfetti(50);
    showToast(`Quiz passed! +${results.xpEarned} XP`, 'success');

    // Mark task as complete
    if (task) {
      missionManager.completeTask(taskId);
    }
  } else {
    showToast(`Score: ${results.score}%. Review and try again!`, 'info');
  }

  quizEngine.reset();
  quizSession = null;
};

// ============================================
// SIMULATION PHASE
// ============================================

/**
 * Simulation session state
 */
let simulationSession = null;

/**
 * Render simulation landing page
 */
function renderSimulation(taskId) {
  const task = missionManager.getTask(taskId);
  if (!task) {
    return `<div class="card"><h2>Task not found</h2></div>`;
  }

  const scenario = appData.simulationScenarios?.[taskId];
  if (!scenario) {
    return `
      <div class="simulation-phase">
        <div class="card" style="max-width: 900px; margin: 0 auto; text-align: center; padding: var(--space-2xl);">
          <div style="font-size: 4rem; margin-bottom: var(--space-md);">🎮</div>
          <h2>Simulation Coming Soon</h2>
          <p style="color: var(--color-text-secondary); margin-bottom: var(--space-xl);">
            The simulation scenario for this task is not yet available.
          </p>
          <button class="btn btn-outline" onclick="router.navigate('/task/${encodeURIComponent(taskId)}')">
            ← Back to Task Overview
          </button>
        </div>
      </div>
    `;
  }

  const progress = taskFlow.getTaskProgress(taskId);
  const simAttempts = progress.simulationPhase?.attempts || 0;
  const highScore = progress.simulationPhase?.highScore || 0;

  return `
    <div class="simulation-phase">
      <div class="card" style="max-width: 900px; margin: 0 auto;">
        <!-- Header -->
        <div class="card-header" style="text-align: center; padding: var(--space-2xl); background: linear-gradient(135deg, #FEF3C7, #FDE68A); border-bottom: 2px solid var(--color-accent-gold);">
          <div style="font-size: 4rem; margin-bottom: var(--space-md);">🎮</div>
          <h2 class="card-title" style="font-size: var(--font-size-3xl); color: var(--color-gray-900); margin-bottom: var(--space-sm);">
            Summit Challenge: ${scenario.title}
          </h2>
          <p style="font-size: var(--font-size-lg); color: var(--color-text-secondary); margin: 0;">
            ${task.name}
          </p>
        </div>

        <!-- Body -->
        <div class="card-body" style="padding: var(--space-2xl);">

          <!-- Project Briefing -->
          <div class="simulation-briefing" style="background: linear-gradient(135deg, #EFF6FF, white); border: 2px solid var(--color-primary-blue); border-radius: var(--radius-xl); padding: var(--space-xl); margin-bottom: var(--space-2xl);">
            <h3 style="color: var(--color-primary-blue); margin: 0 0 var(--space-md) 0; font-size: var(--font-size-xl);">
              📋 Project Briefing
            </h3>
            <p style="margin: 0; line-height: var(--line-height-relaxed); color: var(--color-gray-700); font-size: var(--font-size-md);">
              ${scenario.projectContext}
            </p>
          </div>

          <!-- Starting KPIs -->
          <div style="margin-bottom: var(--space-2xl);">
            <h3 style="text-align: center; font-size: var(--font-size-xl); color: var(--color-text-primary); margin-bottom: var(--space-lg);">
              📊 Starting Project KPIs
            </h3>
            <div class="kpi-dashboard" style="display: grid; gap: var(--space-md);">
              ${renderKPIBar('Budget Health', 'budget', 70, null)}
              ${renderKPIBar('Schedule Status', 'schedule', 70, null)}
              ${renderKPIBar('Team Morale', 'morale', 70, null)}
              ${renderKPIBar('Stakeholder Satisfaction', 'stakeholders', 70, null)}
              ${renderKPIBar('Risk Exposure', 'risk', 30, null)}
            </div>
          </div>

          <!-- What to Expect -->
          <div style="margin-bottom: var(--space-2xl);">
            <h3 style="text-align: center; font-size: var(--font-size-xl); color: var(--color-text-primary); margin-bottom: var(--space-lg);">
              🎯 What to Expect
            </h3>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: var(--space-lg);">
              <div class="card" style="text-align: center; padding: var(--space-lg); border: 2px solid var(--color-primary-blue);">
                <div style="font-size: 3rem; margin-bottom: var(--space-sm);">5</div>
                <div style="color: var(--color-text-secondary); font-weight: var(--font-weight-semibold);">Decisions</div>
                <div style="font-size: var(--font-size-xs); color: var(--color-text-muted); margin-top: var(--space-xs);">Trade-off choices</div>
              </div>
              <div class="card" style="text-align: center; padding: var(--space-lg); border: 2px solid var(--color-trust-green);">
                <div style="font-size: 3rem; margin-bottom: var(--space-sm);">60%</div>
                <div style="color: var(--color-text-secondary); font-weight: var(--font-weight-semibold);">To Pass</div>
                <div style="font-size: var(--font-size-xs); color: var(--color-text-muted); margin-top: var(--space-xs);">Stable or above</div>
              </div>
              <div class="card" style="text-align: center; padding: var(--space-lg); border: 2px solid var(--color-accent-gold);">
                <div style="font-size: 3rem; margin-bottom: var(--space-sm);">+80</div>
                <div style="color: var(--color-text-secondary); font-weight: var(--font-weight-semibold);">XP Reward</div>
                <div style="font-size: var(--font-size-xs); color: var(--color-text-muted); margin-top: var(--space-xs);">When you pass</div>
              </div>
              <div class="card" style="text-align: center; padding: var(--space-lg); border: 2px solid #8B5CF6;">
                <div style="font-size: 3rem; margin-bottom: var(--space-sm);">∞</div>
                <div style="color: var(--color-text-secondary); font-weight: var(--font-weight-semibold);">Replays</div>
                <div style="font-size: var(--font-size-xs); color: var(--color-text-muted); margin-top: var(--space-xs);">Try different paths</div>
              </div>
            </div>
          </div>

          <!-- Key difference from quiz -->
          <div style="background: linear-gradient(135deg, #FEFCE8, #FEF3C7); border-left: 4px solid var(--color-accent-gold); border-radius: var(--radius-lg); padding: var(--space-xl); margin-bottom: var(--space-2xl);">
            <h3 style="color: var(--color-accent-gold); margin: 0 0 var(--space-md) 0; font-size: var(--font-size-xl);">
              🎮 How Simulations Differ from Quizzes
            </h3>
            <ul style="list-style: none; padding: 0; margin: 0;">
              <li style="margin-bottom: var(--space-sm);">
                🔄 <strong>No right/wrong answers</strong> — every choice has trade-offs, just like the real PMP exam
              </li>
              <li style="margin-bottom: var(--space-sm);">
                📈 <strong>Decisions compound</strong> — early choices affect later situations
              </li>
              <li style="margin-bottom: var(--space-sm);">
                👀 <strong>Visible consequences</strong> — watch KPIs change after each decision
              </li>
              <li>
                🧠 <strong>Situational judgment</strong> — trains PM decision-making, not memorization
              </li>
            </ul>
          </div>

          ${simAttempts > 0 ? `
            <div style="background: linear-gradient(135deg, #EFF6FF, #DBEAFE); border-left: 4px solid var(--color-primary-blue); border-radius: var(--radius-lg); padding: var(--space-xl); margin-bottom: var(--space-2xl);">
              <h3 style="color: var(--color-primary-blue); margin: 0 0 var(--space-md) 0;">
                📊 Previous Attempts
              </h3>
              <p style="margin: 0; color: var(--color-gray-700);">
                Attempts: ${simAttempts} | Best Score: ${highScore}% | Try different choices for a better outcome!
              </p>
            </div>
          ` : ''}

          <!-- Start Button -->
          <div style="text-align: center;">
            <button class="btn btn-lg" onclick="startSimulation('${safeActionArg(taskId)}')" style="background: linear-gradient(135deg, var(--color-accent-gold), #D97706); color: white; min-width: 220px; font-size: var(--font-size-lg); padding: var(--space-lg) var(--space-2xl); box-shadow: var(--shadow-lg);">
              ${simAttempts > 0 ? '🔄 Replay Simulation' : '🚀 Start Simulation'} →
            </button>
          </div>
        </div>

        <!-- Footer -->
        <div class="card-footer" style="padding: var(--space-xl); background: var(--color-background); border-top: 1px solid var(--color-gray-200);">
          <div style="display: flex; justify-content: space-between; gap: var(--space-md); flex-wrap: wrap;">
            <button class="btn btn-outline" onclick="router.navigate('/task/${encodeURIComponent(taskId)}')">
              ← Back to Task Overview
            </button>
            <button class="btn btn-secondary" onclick="router.navigate('/quiz/${encodeURIComponent(taskId)}')">
              🏆 Review Quiz
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
}

/**
 * Render a single KPI bar
 */
function renderKPIBar(label, type, value, change) {
  const icons = { budget: '💰', schedule: '📅', morale: '😊', stakeholders: '🤝', risk: '⚠️' };
  const colors = { budget: '#3B82F6', schedule: '#8B5CF6', morale: '#F59E0B', stakeholders: '#10B981', risk: '#EF4444' };
  const changeHtml = change !== null && change !== undefined ? `
    <span class="kpi-change ${change > 0 && type !== 'risk' ? 'positive' : change < 0 && type !== 'risk' ? 'negative' : change > 0 && type === 'risk' ? 'negative' : change < 0 && type === 'risk' ? 'positive' : ''}" style="font-size: var(--font-size-sm); font-weight: var(--font-weight-bold); margin-left: var(--space-sm);">
      ${change > 0 ? '+' : ''}${change}
    </span>
  ` : '';

  return `
    <div class="kpi-item" style="display: flex; align-items: center; gap: var(--space-md);">
      <div class="kpi-label" style="min-width: 160px; display: flex; align-items: center; gap: var(--space-sm); font-size: var(--font-size-sm); font-weight: var(--font-weight-semibold); color: var(--color-gray-700);">
        <span>${icons[type]}</span> ${label}
      </div>
      <div class="kpi-bar-track" style="flex: 1; height: 24px; background: var(--color-gray-200); border-radius: var(--radius-full); overflow: hidden;">
        <div class="kpi-bar-fill ${type}" style="height: 100%; width: ${value}%; background: ${colors[type]}; border-radius: var(--radius-full); transition: width 0.8s ease;"></div>
      </div>
      <div class="kpi-value" style="min-width: 60px; text-align: right; font-weight: var(--font-weight-bold); color: ${colors[type]};">
        ${value}%${changeHtml}
      </div>
    </div>
  `;
}

/**
 * Start simulation session
 */
window.startSimulation = function(taskId) {
  const simulation = simulationEngine.generateSimulation(taskId);

  if (!simulation) {
    showToast('No simulation scenario available for this task', 'error');
    return;
  }

  simulationSession = {
    taskId,
    simulation,
    selectedOption: null,
    showingFeedback: false,
    lastResult: null
  };

  renderSimulationSession();
};

/**
 * Render interactive simulation session
 */
function renderSimulationSession() {
  if (!simulationSession) return;

  const { simulation, selectedOption, showingFeedback, lastResult } = simulationSession;
  const decision = simulationEngine.getCurrentDecision();
  const kpis = simulationEngine.projectKPIs;
  const progress = simulationEngine.getProgress();
  const isLastDecision = progress.current === progress.total;

  const appView = document.getElementById('app-view');
  setSafeInnerHTML(appView, `
    <div class="simulation-session">
      <div class="card" style="max-width: 900px; margin: 0 auto;">
        <!-- Header -->
        <div class="card-header" style="padding: var(--space-lg) var(--space-xl); background: linear-gradient(135deg, #FEF3C7, #FDE68A);">
          <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: var(--space-md);">
            <h2 style="margin: 0; font-size: var(--font-size-xl);">🎮 ${simulation.title}</h2>
            <span style="font-size: var(--font-size-sm); color: var(--color-gray-600);">
              Decision ${progress.current} of ${progress.total}
            </span>
          </div>
          <div class="progress-bar" style="margin-top: var(--space-md); height: 8px; background: rgba(0,0,0,0.1); border-radius: var(--radius-full); overflow: hidden;">
            <div style="height: 100%; width: ${progress.percentage}%; background: var(--color-accent-gold); transition: width 0.5s ease;"></div>
          </div>
        </div>

        <div class="card-body" style="padding: var(--space-xl);">
          <!-- KPI Dashboard -->
          <div class="kpi-dashboard" style="display: grid; gap: var(--space-sm); margin-bottom: var(--space-xl); padding: var(--space-lg); background: var(--color-surface); border-radius: var(--radius-lg); border: 1px solid var(--color-gray-200);">
            <h4 style="margin: 0 0 var(--space-sm) 0; font-size: var(--font-size-sm); color: var(--color-text-muted); text-transform: uppercase; letter-spacing: 0.05em;">Project KPIs</h4>
            ${renderKPIBar('Budget Health', 'budget', kpis.budget, lastResult?.kpiChanges?.budget)}
            ${renderKPIBar('Schedule Status', 'schedule', kpis.schedule, lastResult?.kpiChanges?.schedule)}
            ${renderKPIBar('Team Morale', 'morale', kpis.morale, lastResult?.kpiChanges?.morale)}
            ${renderKPIBar('Stakeholders', 'stakeholders', kpis.stakeholders, lastResult?.kpiChanges?.stakeholders)}
            ${renderKPIBar('Risk Exposure', 'risk', kpis.risk, lastResult?.kpiChanges?.risk)}
          </div>

          <!-- Decision Narrative -->
          <div class="decision-narrative" style="border-left: 4px solid var(--color-accent-gold); padding: var(--space-lg); margin-bottom: var(--space-xl); background: linear-gradient(135deg, #FFFBEB, white); border-radius: 0 var(--radius-lg) var(--radius-lg) 0;">
            <div style="font-size: var(--font-size-sm); color: var(--color-accent-gold); font-weight: var(--font-weight-bold); margin-bottom: var(--space-sm);">
              📅 ${decision.week}
            </div>
            <p style="margin: 0; line-height: var(--line-height-relaxed); color: var(--color-gray-700); font-size: var(--font-size-md);">
              ${decision.narrative}
            </p>
          </div>

          <!-- Decision Options -->
          <div class="decision-options" style="display: grid; gap: var(--space-md); margin-bottom: var(--space-xl);">
            <h4 style="margin: 0; color: var(--color-text-primary);">What do you do?</h4>
            ${decision.options.map((option, index) => {
              const isSelected = selectedOption === index;
              let borderColor = 'var(--color-border)';
              let bgColor = 'var(--color-surface)';
              let borderWidth = '2px';

              if (isSelected && !showingFeedback) {
                borderColor = 'var(--color-primary-blue)';
                bgColor = '#EFF6FF';
                borderWidth = '3px';
              }
              if (showingFeedback && isSelected) {
                borderColor = 'var(--color-accent-gold)';
                bgColor = '#FFFBEB';
                borderWidth = '3px';
              }

              return `
                <div class="decision-option ${showingFeedback ? 'disabled' : ''} ${isSelected ? 'selected' : ''}"
                     onclick="${showingFeedback ? '' : `selectSimulationOption(${index})`}"
                     style="padding: var(--space-lg); border: ${borderWidth} solid ${borderColor}; border-radius: var(--radius-lg); cursor: ${showingFeedback ? 'default' : 'pointer'}; background: ${bgColor}; transition: background-color 0.2s, border-color 0.2s, box-shadow 0.2s, transform 0.2s, opacity 0.2s;">
                  <div style="display: flex; align-items: start; gap: var(--space-md);">
                    <div style="flex-shrink: 0; width: 28px; height: 28px; border: 2px solid ${borderColor}; border-radius: 50%; display: flex; align-items: center; justify-content: center; background: ${isSelected ? borderColor : 'transparent'}; font-size: var(--font-size-sm); color: ${isSelected ? 'white' : 'var(--color-text-secondary)'}; font-weight: var(--font-weight-bold);">
                      ${isSelected ? '✓' : String.fromCharCode(65 + index)}
                    </div>
                    <div style="flex: 1; line-height: var(--line-height-relaxed);">
                      ${option.text}
                    </div>
                  </div>
                </div>
              `);
            }).join('')}
          </div>

          <!-- Feedback -->
          ${showingFeedback && lastResult ? `
            <div class="simulation-feedback" style="margin-bottom: var(--space-xl); padding: var(--space-xl); background: linear-gradient(135deg, #EFF6FF, white); border: 2px solid var(--color-primary-blue); border-radius: var(--radius-xl); animation: feedbackSlideIn 0.4s ease;">
              <h4 style="margin: 0 0 var(--space-md) 0; color: var(--color-primary-blue); display: flex; align-items: center; gap: var(--space-sm);">
                <span style="font-size: 1.5rem;">💡</span> Consequence & Insight
              </h4>
              <p style="margin: 0; line-height: var(--line-height-relaxed); color: var(--color-gray-700);">
                ${lastResult.feedback}
              </p>
            </div>
          ` : ''}
        </div>

        <!-- Footer -->
        <div class="card-footer" style="padding: var(--space-lg) var(--space-xl); display: flex; justify-content: space-between;">
          <button class="btn btn-secondary" onclick="exitSimulationSession()">
            Exit Simulation
          </button>
          ${!showingFeedback ? `
            <button class="btn btn-primary"
                    onclick="submitSimulationDecision()"
                    ${selectedOption === null ? 'disabled style="opacity: 0.5; cursor: not-allowed;"' : ''}>
              Commit Decision →
            </button>
          ` : `
            <button class="btn btn-primary" onclick="nextSimulationDecision()">
              ${isLastDecision ? 'See Project Outcome →' : 'Next Situation →'}
            </button>
          `}
        </div>
      </div>
    </div>
  `;
}

/**
 * Select simulation option
 */
window.selectSimulationOption = function(index) {
  if (!simulationSession || simulationSession.showingFeedback) return;
  simulationSession.selectedOption = index;
  renderSimulationSession();
};

/**
 * Submit simulation decision
 */
window.submitSimulationDecision = function() {
  if (!simulationSession || simulationSession.selectedOption === null) return;

  const result = simulationEngine.submitDecision(simulationSession.selectedOption);
  simulationSession.lastResult = result;
  simulationSession.showingFeedback = true;
  renderSimulationSession();
};

/**
 * Advance to next decision or finish
 */
window.nextSimulationDecision = function() {
  if (!simulationSession) return;

  const hasMore = simulationEngine.nextDecision();

  if (!hasMore) {
    finishSimulationSession();
  } else {
    simulationSession.selectedOption = null;
    simulationSession.showingFeedback = false;
    simulationSession.lastResult = null;
    renderSimulationSession();
  }
};

/**
 * Exit simulation early
 */
window.exitSimulationSession = function() {
  if (!simulationSession) return;

  if (simulationEngine.decisions.length > 0) {
    if (!confirm(`You've made ${simulationEngine.decisions.length} decisions. Exit simulation anyway?`)) {
      return;
    }
  }

  const taskId = simulationSession.taskId;
  simulationEngine.reset();
  simulationSession = null;
  router.navigate(`/simulation/${taskId}`);
};

/**
 * Finish simulation and show results
 */
function finishSimulationSession() {
  if (!simulationSession) return;

  const results = simulationEngine.calculateResults();
  const { taskId } = simulationSession;
  const task = missionManager.getTask(taskId);
  const kpis = results.finalKPIs;

  // Rating styles
  const ratingStyles = {
    'Crisis': { color: '#DC2626', bg: '#FEE2E2', icon: '🚨' },
    'Struggling': { color: '#F59E0B', bg: '#FEF3C7', icon: '⚠️' },
    'Stable': { color: '#3B82F6', bg: '#DBEAFE', icon: '✅' },
    'Thriving': { color: '#10B981', bg: '#D1FAE5', icon: '🌟' },
    'Exemplary': { color: '#7C3AED', bg: '#EDE9FE', icon: '🏆' }
  };
  const rStyle = ratingStyles[results.rating] || ratingStyles['Stable'];

  const appView = document.getElementById('app-view');
  setSafeInnerHTML(appView, `
    <div class="simulation-results">
      <div class="card" style="max-width: 800px; margin: 0 auto;">
        <!-- Header -->
        <div class="card-header" style="text-align: center; padding: var(--space-2xl); background: linear-gradient(135deg, ${rStyle.bg}, white);">
          <div style="font-size: 5rem; margin-bottom: var(--space-md);">${rStyle.icon}</div>
          <h2 style="font-size: var(--font-size-3xl); color: ${rStyle.color}; margin-bottom: var(--space-sm);">
            Project Outcome: ${results.rating}
          </h2>
          <p style="font-size: var(--font-size-lg); color: var(--color-text-secondary); margin: 0;">
            ${results.passed ? 'You kept the project on track!' : 'The project faced significant challenges.'}
          </p>
        </div>

        <div class="card-body" style="padding: var(--space-2xl);">
          <!-- Score -->
          <div style="text-align: center; margin-bottom: var(--space-2xl);">
            <div style="font-size: var(--font-size-3xl); font-weight: var(--font-weight-bold); color: ${rStyle.color};">
              ${results.score}%
            </div>
            <div style="font-size: var(--font-size-sm); color: var(--color-text-muted);">
              Project Health Score (60% to pass)
            </div>
          </div>

          <!-- Final KPIs -->
          <div style="margin-bottom: var(--space-2xl);">
            <h3 style="text-align: center; margin-bottom: var(--space-lg);">📊 Final Project KPIs</h3>
            <div class="kpi-dashboard" style="display: grid; gap: var(--space-sm);">
              ${renderKPIBar('Budget Health', 'budget', kpis.budget, null)}
              ${renderKPIBar('Schedule Status', 'schedule', kpis.schedule, null)}
              ${renderKPIBar('Team Morale', 'morale', kpis.morale, null)}
              ${renderKPIBar('Stakeholders', 'stakeholders', kpis.stakeholders, null)}
              ${renderKPIBar('Risk Exposure', 'risk', kpis.risk, null)}
            </div>
          </div>

          <!-- XP Earned -->
          <div style="text-align: center; padding: var(--space-xl); background: linear-gradient(135deg, #DBEAFE, white); border: 2px solid var(--color-primary-blue); border-radius: var(--radius-xl); margin-bottom: var(--space-2xl);">
            <h4 style="margin: 0 0 var(--space-sm) 0; color: var(--color-primary-blue);">XP Earned</h4>
            <div style="font-size: var(--font-size-3xl); font-weight: var(--font-weight-bold); color: var(--color-primary-blue);">
              +${results.xpEarned} XP
            </div>
          </div>

          <!-- Decision Summary -->
          <div style="margin-bottom: var(--space-xl);">
            <h3 style="margin-bottom: var(--space-lg);">📝 Your Decisions</h3>
            ${results.decisions.map((d, i) => `
              <div style="padding: var(--space-md); margin-bottom: var(--space-sm); background: var(--color-surface); border-radius: var(--radius-md); border-left: 4px solid var(--color-accent-gold);">
                <div style="font-size: var(--font-size-sm); color: var(--color-text-muted); margin-bottom: var(--space-xs);">Decision ${i + 1}</div>
                <div style="color: var(--color-text-primary);">${d.optionText}</div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Footer -->
        <div class="card-footer" style="padding: var(--space-xl); display: flex; justify-content: space-between; gap: var(--space-md); flex-wrap: wrap;">
          <button class="btn btn-outline" onclick="router.navigate('/task/${encodeURIComponent(taskId)}')">
            ← Back to Task
          </button>
          <div style="display: flex; gap: var(--space-md);">
            <button class="btn btn-secondary" onclick="router.navigate('/simulation/${encodeURIComponent(taskId)}')">
              🔄 Try Again
            </button>
            ${results.passed ? `
              <button class="btn btn-primary" onclick="finishSimulation('${safeActionArg(taskId)}', ${results.score})">
                Complete Phase ✓
              </button>
            ` : ''}
          </div>
        </div>
      </div>
    </div>
  `);

  // Update progress
  const progress = taskFlow.getTaskProgress(taskId);
  progress.simulationPhase.attempts = (progress.simulationPhase.attempts || 0) + 1;
  progress.simulationPhase.lastScore = results.score;
  if (results.score > (progress.simulationPhase.highScore || 0)) {
    progress.simulationPhase.highScore = results.score;
  }
  if (results.passed) {
    progress.simulationPhase.passed = true;
  }
  taskFlow.updateTaskProgress(taskId, progress);

  // Award XP
  gamification.awardXP(results.xpEarned);

  if (results.passed) {
    showToast(`Simulation complete! +${results.xpEarned} XP`, 'success');
  } else {
    showToast(`Score: ${results.score}%. Try different approaches!`, 'info');
  }

  // Check achievements
  const simHistory = state.get('simulationHistory') || [];
  simHistory.push({ taskId, score: results.score, date: new Date().toISOString() });
  state.set('simulationHistory', simHistory);

  if (results.passed && simHistory.length === 1) {
    gamification.unlockAchievement('first_simulation_passed');
  }
  if (results.score >= 90) {
    gamification.unlockAchievement('simulation_exemplary');
  }
  if (simHistory.length >= 10) {
    gamification.unlockAchievement('simulation_master_10');
  }

  simulationEngine.reset();
  simulationSession = null;
}

/**
 * Complete simulation phase (called from results screen)
 */
window.finishSimulation = function(taskId, score) {
  taskFlow.completePhase('simulation', taskId, { score });
};

/**
 * Render Onboarding Tutorial
 */
function renderOnboarding() {
  return `
    <div class="onboarding">
      <div class="card" style="max-width: 800px; margin: 0 auto;">
        <div class="card-body" style="text-align: center; padding: 3rem;">
          <h1 style="font-size: 3rem; margin-bottom: 1rem;">🏔️</h1>
          <h2 style="margin-bottom: 1rem;">Welcome to Ascent to PMP!</h2>
          <p style="font-size: var(--font-size-lg); color: var(--color-text-secondary); margin-bottom: 2rem;">
            Your journey to PMP certification starts here.
          </p>

          <div style="text-align: left; max-width: 600px; margin: 0 auto 2rem;">
            <h3 style="margin-bottom: 1rem;">🎯 How It Works</h3>
            <div class="card" style="padding: 1.5rem; margin-bottom: 1rem; background: var(--color-blue-light);">
              <h4 style="margin-bottom: 0.5rem;">1️⃣ Choose a Mission</h4>
              <p style="color: var(--color-text-secondary); margin: 0;">
                Start with Mission 1 or choose any unlocked mission from the map.
              </p>
            </div>

            <div class="card" style="padding: 1.5rem; margin-bottom: 1rem; background: var(--color-green-light);">
              <h4 style="margin-bottom: 0.5rem;">2️⃣ Learn → Practice → Test</h4>
              <p style="color: var(--color-text-secondary); margin: 0;">
                Each task follows a proven 3-phase approach: Learn the concepts, review flashcards, then take a quiz.
              </p>
            </div>

            <div class="card" style="padding: 1.5rem; margin-bottom: 1rem; background: var(--color-background-gray);">
              <h4 style="margin-bottom: 0.5rem;">3️⃣ Earn XP & Level Up</h4>
              <p style="color: var(--color-text-secondary); margin: 0;">
                Gain experience points, unlock achievements, and climb to Level 10: PMP Certified!
              </p>
            </div>

            <div class="card" style="padding: 1.5rem; background: linear-gradient(135deg, var(--color-accent-gold) 0%, #FCA5A5 100%);">
              <h4 style="margin-bottom: 0.5rem;">🔥 Build Your Streak</h4>
              <p style="color: var(--color-text-primary); margin: 0;">
                Study daily to maintain your streak and unlock bonus XP rewards!
              </p>
            </div>
          </div>

          <div style="margin-bottom: 2rem;">
            <h3 style="margin-bottom: 1rem;">📚 Study Recommendations</h3>
            <p style="color: var(--color-text-secondary);">
              Aim for 15-20 minutes per day. Consistency beats cramming!
            </p>
          </div>

          <div style="margin-bottom: 2rem;">
            <label class="form-label" style="display: flex; align-items: center; justify-content: center; gap: 0.5rem;">
              <input type="checkbox" id="understand-checkbox">
              <span>I understand and I'm ready to start my PMP journey!</span>
            </label>
          </div>

          <button class="btn btn-primary btn-lg" onclick="completeOnboarding()">
            🚀 Begin Your Ascent
          </button>
        </div>
      </div>
    </div>
  `;
}

/**
 * Complete onboarding and start app
 */
window.completeOnboarding = function() {
  const checkbox = document.getElementById('understand-checkbox');

  if (!checkbox || !checkbox.checked) {
    showToast('Please confirm you understand by checking the box', 'error');
    return;
  }

  state.set('user.tutorialCompleted', true);
  gamification.unlockAchievement('first_login');
  gamification.awardXP(10);
  showToast('Welcome aboard! +10 XP', 'success');

  setTimeout(() => {
    router.navigate('/');
  }, 1000);
};

/**
 * Render Mock Exam View
 */
function renderMockExam() {
  const mockExams = state.get('mockExams') || [];
  const totalQuestions = appData.quizBank ? appData.quizBank.length : 0;

  return `
    <div class="mock-exam">
      <div class="card">
        <div class="card-header">
          <h2 class="card-title">📋 PMP Mock Exam</h2>
        </div>
        <div class="card-body">
          <div style="text-align: center; padding: 2rem;">
            <h3 style="margin-bottom: 1rem;">Full-Length Practice Exam</h3>
            <p style="color: var(--color-text-secondary); margin-bottom: 2rem; max-width: 600px; margin-left: auto; margin-right: auto;">
              Take a full 180-question mock exam that simulates the actual PMP certification test.
              Test your knowledge across all three domains with real exam conditions.
            </p>

            <div class="card" style="max-width: 500px; margin: 0 auto 2rem; padding: 2rem; background: var(--color-blue-light);">
              <h4 style="margin-bottom: 1.5rem;">📊 Exam Details</h4>
              <div style="text-align: left;">
                <ul style="line-height: 2;">
                  <li><strong>Questions:</strong> 180 (randomly selected)</li>
                  <li><strong>Domain Mix:</strong>
                    <ul style="margin-left: 1.5rem; margin-top: 0.5rem;">
                      <li>People: ~76 questions (42%)</li>
                      <li>Process: ~90 questions (50%)</li>
                      <li>Business: ~14 questions (8%)</li>
                    </ul>
                  </li>
                  <li><strong>Passing Score:</strong> 61% (110/180)</li>
                  <li><strong>Time Limit:</strong> 230 minutes (self-timed)</li>
                  <li><strong>Format:</strong> Multiple choice</li>
                </ul>
              </div>
            </div>

            <div style="margin-bottom: 2rem;">
              <p style="color: var(--color-text-muted); font-size: var(--font-size-sm); margin-bottom: 1rem;">
                Available questions in bank: ${totalQuestions}
              </p>
              ${totalQuestions < 180 ? `
                <p style="color: var(--color-alert-red); font-size: var(--font-size-sm);">
                  ⚠️ Not enough questions for a full mock exam. Complete more missions to unlock more questions.
                </p>
              ` : ''}
            </div>

            <button class="btn btn-primary btn-lg"
                    ${totalQuestions < 180 ? 'disabled' : ''}
                    onclick="startMockExam()">
              ${totalQuestions >= 180 ? '🚀 Start Mock Exam' : '🔒 Complete More Missions'}
            </button>
          </div>
        </div>
      </div>

      ${mockExams.length > 0 ? `
        <div class="card" style="margin-top: 2rem;">
          <div class="card-header">
            <h3>📈 Your Mock Exam History</h3>
          </div>
          <div class="card-body">
            <div style="display: grid; gap: 1rem;">
              ${mockExams.slice(0, 5).map((exam, index) => `
                <div class="card" style="padding: 1rem;">
                  <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div>
                      <h4>Mock Exam #${exam.examNumber || index + 1}</h4>
                      <p style="font-size: var(--font-size-sm); color: var(--color-text-secondary);">
                        ${new Date(exam.date).toLocaleDateString()}
                      </p>
                    </div>
                    <div style="text-align: right;">
                      <div style="font-size: 1.5rem; font-weight: bold; color: ${exam.passed ? 'var(--color-trust-green)' : 'var(--color-alert-red)'};">
                        ${exam.score}%
                      </div>
                      <div style="font-size: var(--font-size-sm);">
                        ${exam.passed ? 'PASSED ✅' : 'FAILED ❌'}
                      </div>
                    </div>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      ` : ''}
    </div>
  `;
}

/**
 * Start mock exam
 */
/**
 * Mock exam session state
 */
let mockExamSession = null;
let mockExamTimer = null;

window.startMockExam = function(examId = 'mock-exam-1') {
  // Get the mission 7 data to find exam configuration
  const mission7 = missionManager.getMission('m7');
  if (!mission7 || !mission7.mockExams) {
    showToast('Mock exam configuration not found', 'error');
    return;
  }

  const examConfig = mission7.mockExams.find(e => e.id === examId);
  if (!examConfig) {
    showToast('Exam not found', 'error');
    return;
  }

  if (!appData.quizBank || appData.quizBank.length < examConfig.questionCount) {
    showToast('Not enough questions available', 'error');
    return;
  }

  showToast('Generating mock exam...', 'info');

  // Generate exam with proper domain distribution from config
  const peopleQuestions = appData.quizBank.filter(q => q.domain === 'people');
  const processQuestions = appData.quizBank.filter(q => q.domain === 'process');
  const businessQuestions = appData.quizBank.filter(q => q.domain === 'business');

  const shufflePeople = [...peopleQuestions].sort(() => Math.random() - 0.5).slice(0, examConfig.domainDistribution.people);
  const shuffleProcess = [...processQuestions].sort(() => Math.random() - 0.5).slice(0, examConfig.domainDistribution.process);
  const shuffleBusiness = [...businessQuestions].sort(() => Math.random() - 0.5).slice(0, examConfig.domainDistribution.business);

  const examQuestions = [
    ...shufflePeople,
    ...shuffleProcess,
    ...shuffleBusiness
  ].sort(() => Math.random() - 0.5); // Mix them randomly

  mockExamSession = {
    examId: examId,
    examName: examConfig.name,
    questions: examQuestions,
    currentQuestionIndex: 0,
    answers: new Array(examConfig.questionCount).fill(null), // Pre-allocate answers array
    flaggedQuestions: new Set(),
    startTime: Date.now(),
    timeLimit: examConfig.timeLimit * 60, // Convert minutes to seconds
    timeRemaining: examConfig.timeLimit * 60,
    breakTaken: { after60: false, after120: false },
    onBreak: false,
    passingScore: examConfig.passingScore
  };

  // Start countdown timer
  mockExamTimer = setInterval(() => {
    if (mockExamSession && !mockExamSession.onBreak) {
      mockExamSession.timeRemaining--;
      updateMockExamTimer();

      if (mockExamSession.timeRemaining <= 0) {
        clearInterval(mockExamTimer);
        autoSubmitMockExam();
      }
    }
  }, 1000);

  renderMockExamSession();
};

/**
 * MISSION 6 PRACTICE FEATURES
 */

/**
 * Render Mission 6 Mini Test
 */
function renderMission6MiniTest(domain) {
  const validDomains = ['people', 'process', 'business'];
  if (!validDomains.includes(domain)) {
    return `
      <div class="card">
        <h2>Invalid Domain</h2>
        <p>Please select a valid domain: People, Process, or Business.</p>
        <button class="btn btn-primary" onclick="navigateTo('/mission/m6')">Back to Mission 6</button>
      </div>
    `;
  }

  return `
    <div class="mission6-mini-test">
      <div class="card">
        <div class="card-header">
          <h2 class="card-title">🎯 Timed Mini-Test: ${domain.charAt(0).toUpperCase() + domain.slice(1)} Domain</h2>
        </div>
        <div class="card-body">
          <div style="text-align: center; padding: 2rem;">
            <h3 style="margin-bottom: 1rem;">Ready for a Challenge?</h3>
            <p style="color: var(--color-text-secondary); margin-bottom: 2rem;">
              Test your knowledge with 20 questions from the ${domain} domain in 30 minutes.
            </p>

            <div class="card" style="max-width: 500px; margin: 0 auto 2rem; padding: 2rem; background: var(--color-blue-light);">
              <h4 style="margin-bottom: 1.5rem;">📊 Test Details</h4>
              <div style="text-align: left;">
                <ul style="line-height: 2;">
                  <li><strong>Questions:</strong> 20</li>
                  <li><strong>Time Limit:</strong> 30 minutes</li>
                  <li><strong>Domain:</strong> ${domain.charAt(0).toUpperCase() + domain.slice(1)}</li>
                  <li><strong>Passing Score:</strong> 75%</li>
                  <li><strong>Auto-submit:</strong> When time expires</li>
                </ul>
              </div>
            </div>

            <button class="btn btn-primary btn-lg" onclick="startMiniTest('${safeActionArg(domain)}')">
              🚀 Start Mini-Test
            </button>
          </div>
        </div>
        <div class="card-footer">
          <button class="btn btn-secondary" onclick="navigateTo('/mission/m6')">
            ← Back to Mission 6
          </button>
        </div>
      </div>
    </div>
  `;
}

/**
 * Mini test session state
 */
let miniTestSession = null;
let miniTestTimer = null;

/**
 * Start mini test
 */
window.startMiniTest = function(domain) {
  const domainQuestions = appData.quizBank.filter(q => q.domain === domain);

  if (domainQuestions.length < 20) {
    showToast('Not enough questions available for this domain', 'error');
    return;
  }

  // Select 20 random questions
  const shuffled = [...domainQuestions].sort(() => Math.random() - 0.5);
  const questions = shuffled.slice(0, 20);

  miniTestSession = {
    domain,
    questions,
    currentQuestionIndex: 0,
    selectedAnswer: null,
    answers: [],
    showingFeedback: false,
    startTime: Date.now(),
    timeLimit: 30 * 60 * 1000, // 30 minutes in milliseconds
    timeRemaining: 30 * 60 // 30 minutes in seconds
  };

  // Start countdown timer
  miniTestTimer = setInterval(() => {
    if (miniTestSession) {
      miniTestSession.timeRemaining--;
      updateMiniTestTimer();

      if (miniTestSession.timeRemaining <= 0) {
        clearInterval(miniTestTimer);
        autoSubmitMiniTest();
      }
    }
  }, 1000);

  renderMiniTestSession();
};

/**
 * Update mini test timer display
 */
function updateMiniTestTimer() {
  const timerElement = document.getElementById('mini-test-timer');
  if (!timerElement || !miniTestSession) return;

  const minutes = Math.floor(miniTestSession.timeRemaining / 60);
  const seconds = miniTestSession.timeRemaining % 60;
  const timeString = `${minutes}:${seconds.toString().padStart(2, '0')}`;

  timerElement.textContent = timeString;

  // Change color when time is running low
  if (miniTestSession.timeRemaining < 60) {
    timerElement.style.color = 'var(--color-urgency-red)';
  } else if (miniTestSession.timeRemaining < 300) {
    timerElement.style.color = 'var(--color-warning-yellow)';
  }
}

/**
 * Render mini test session
 */
function renderMiniTestSession() {
  if (!miniTestSession) return;

  const { questions, currentQuestionIndex, selectedAnswer, showingFeedback, timeRemaining } = miniTestSession;
  const question = questions[currentQuestionIndex];
  const progress = Math.round(((currentQuestionIndex + 1) / questions.length) * 100);
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;

  const appView = document.getElementById('app-view');
  setSafeInnerHTML(appView, `
    <div class="mini-test-session">
      <div class="card" style="max-width: 900px; margin: 0 auto;">
        <div class="card-header">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <h2>🎯 Mini-Test</h2>
            <div style="display: flex; align-items: center; gap: 1rem;">
              <span style="color: var(--color-text-secondary);">
                Question ${currentQuestionIndex + 1} / ${questions.length}
              </span>
              <span style="font-size: 1.25rem; font-weight: bold; color: var(--color-primary-blue);" id="mini-test-timer">
                ${minutes}:${seconds.toString().padStart(2, '0')}
              </span>
            </div>
          </div>
        </div>

        <div class="progress-bar" style="margin: 0 1.5rem 1.5rem 1.5rem;">
          <div class="progress-fill" style="width: ${progress}%;"></div>
        </div>

        <div class="card-body">
          <div style="margin-bottom: 2rem;">
            <h3 style="font-size: 1.25rem; line-height: 1.6; margin-bottom: 1.5rem;">
              ${question.question}
            </h3>
          </div>

          <div style="display: grid; gap: 1rem;">
            ${question.options
              .sort((a, b) => a.id.localeCompare(b.id))
              .map(option => {
              const isSelected = selectedAnswer === option.id;
              const isCorrect = option.id === question.correctAnswer;
              const showCorrect = showingFeedback && isCorrect;
              const showIncorrect = showingFeedback && isSelected && !isCorrect;

              let bgColor = 'var(--color-surface)';
              let borderColor = 'var(--color-border)';
              let borderWidth = '2px';

              if (showCorrect) {
                bgColor = 'var(--color-trust-green-light)';
                borderColor = 'var(--color-trust-green)';
                borderWidth = '3px';
              } else if (showIncorrect) {
                bgColor = 'var(--color-urgency-red-light)';
                borderColor = 'var(--color-urgency-red)';
                borderWidth = '3px';
              } else if (isSelected) {
                borderColor = 'var(--color-integrity-blue)';
                borderWidth = '3px';
              }

              return `
                <div class="quiz-option ${showingFeedback ? 'disabled' : ''}"
                     onclick="${showingFeedback ? '' : `selectMiniTestAnswer('${safeActionArg(option.id)}')`}"
                     style="padding: 1rem 1.5rem; border: ${borderWidth} solid ${borderColor}; border-radius: 8px; cursor: ${showingFeedback ? 'default' : 'pointer'}; transition: background-color 0.2s, border-color 0.2s, box-shadow 0.2s, transform 0.2s, opacity 0.2s; background: ${bgColor};">
                  <div style="display: flex; align-items: start; gap: 1rem;">
                    <div style="flex-shrink: 0; width: 24px; height: 24px; border: 2px solid ${borderColor}; border-radius: 50%; display: flex; align-items: center; justify-content: center; background: ${isSelected || showCorrect ? borderColor : 'transparent'};">
                      ${(isSelected || showCorrect) ? '<span style="color: white; font-weight: bold;">✓</span>' : ''}
                    </div>
                    <div style="flex: 1;">
                      <strong style="margin-right: 0.5rem;">${option.id.toUpperCase()}.</strong>
                      ${option.text}
                      ${showCorrect ? '<span style="margin-left: 0.5rem; color: var(--color-trust-green); font-weight: 600;">✓ Correct</span>' : ''}
                      ${showIncorrect ? '<span style="margin-left: 0.5rem; color: var(--color-urgency-red); font-weight: 600;">✗ Incorrect</span>' : ''}
                    </div>
                  </div>
                </div>
              `);
            }).join('')}
          </div>

          ${showingFeedback && question.explanation ? `
            <div style="margin-top: 2rem; padding: 1.5rem; background: var(--color-blue-light); border-left: 4px solid var(--color-integrity-blue); border-radius: 4px;">
              <h4 style="margin-bottom: 0.5rem; color: var(--color-integrity-blue);">💡 Explanation</h4>
              <p style="margin: 0; line-height: 1.6;">${question.explanation}</p>
            </div>
          ` : ''}
        </div>

        <div class="card-footer">
          <button class="btn btn-secondary" onclick="exitMiniTest()">
            Exit Test
          </button>
          ${!showingFeedback ? `
            <button class="btn btn-primary"
                    onclick="submitMiniTestAnswer()"
                    ${!selectedAnswer ? 'disabled' : ''}
                    style="${!selectedAnswer ? 'opacity: 0.5; cursor: not-allowed;' : ''}">
              Submit Answer
            </button>
          ` : `
            <button class="btn btn-primary" onclick="nextMiniTestQuestion()">
              ${isLastQuestion ? 'Finish Test →' : 'Next Question →'}
            </button>
          `}
        </div>
      </div>
    </div>
  `;
}

/**
 * Select mini test answer
 */
window.selectMiniTestAnswer = function(answerId) {
  if (!miniTestSession || miniTestSession.showingFeedback) return;
  miniTestSession.selectedAnswer = answerId;
  renderMiniTestSession();
};

/**
 * Submit mini test answer
 */
window.submitMiniTestAnswer = function() {
  if (!miniTestSession || !miniTestSession.selectedAnswer) return;

  const { questions, currentQuestionIndex, selectedAnswer } = miniTestSession;
  const question = questions[currentQuestionIndex];
  const isCorrect = selectedAnswer === question.correctAnswer;

  miniTestSession.answers.push({
    questionId: question.id,
    selectedAnswer,
    correctAnswer: question.correctAnswer,
    isCorrect
  });

  miniTestSession.showingFeedback = true;
  renderMiniTestSession();
};

/**
 * Move to next mini test question
 */
window.nextMiniTestQuestion = function() {
  if (!miniTestSession) return;

  const { questions, currentQuestionIndex } = miniTestSession;
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  if (isLastQuestion) {
    finishMiniTest();
  } else {
    miniTestSession.currentQuestionIndex++;
    miniTestSession.selectedAnswer = null;
    miniTestSession.showingFeedback = false;
    renderMiniTestSession();
  }
};

/**
 * Auto-submit mini test when time expires
 */
function autoSubmitMiniTest() {
  if (!miniTestSession) return;

  showToast('Time expired! Submitting test...', 'warning');

  // If there's an unanswered question, mark it as incorrect
  if (miniTestSession.currentQuestionIndex < miniTestSession.questions.length && !miniTestSession.showingFeedback) {
    const question = miniTestSession.questions[miniTestSession.currentQuestionIndex];
    miniTestSession.answers.push({
      questionId: question.id,
      selectedAnswer: null,
      correctAnswer: question.correctAnswer,
      isCorrect: false
    });
  }

  setTimeout(() => finishMiniTest(), 1000);
}

/**
 * Exit mini test early
 */
window.exitMiniTest = function() {
  if (!miniTestSession) return;

  if (miniTestSession.answers.length > 0) {
    if (!confirm(`You've answered ${miniTestSession.answers.length} questions. Exit test anyway?`)) {
      return;
    }
  }

  if (miniTestTimer) {
    clearInterval(miniTestTimer);
    miniTestTimer = null;
  }

  miniTestSession = null;
  router.navigate(`/mission/m6`);
};

/**
 * Finish mini test and show results
 */
function finishMiniTest() {
  if (!miniTestSession) return;

  if (miniTestTimer) {
    clearInterval(miniTestTimer);
    miniTestTimer = null;
  }

  const { domain, answers, questions, startTime } = miniTestSession;
  const correctCount = answers.filter(a => a.isCorrect).length;
  const totalQuestions = questions.length;
  const score = Math.round((correctCount / totalQuestions) * 100);
  const passed = score >= 75;
  const timeSpent = Math.round((Date.now() - startTime) / 1000);

  // Save to state
  const miniTestHistory = state.get('progress.miniTests') || [];
  miniTestHistory.push({
    domain,
    score,
    correctCount,
    totalQuestions,
    timeSpent,
    date: new Date().toISOString(),
    passed
  });
  state.set('progress.miniTests', miniTestHistory);

  const xpEarned = passed ? 200 : 100;
  gamification.awardXP(xpEarned);

  const appView = document.getElementById('app-view');
  setSafeInnerHTML(appView, `
    <div class="mini-test-session">
      <div class="card" style="max-width: 700px; margin: 0 auto; text-align: center;">
        <div class="card-header">
          <h2>${passed ? '🎉' : '📚'} Mini-Test ${passed ? 'Passed!' : 'Complete'}</h2>
        </div>
        <div class="card-body">
          <div style="font-size: 4rem; margin: 1rem 0;">
            ${passed ? '✅' : '📊'}
          </div>

          <h3 style="font-size: 2rem; color: ${passed ? 'var(--color-trust-green)' : 'var(--color-text-primary)'}; margin-bottom: 1rem;">
            ${score}%
          </h3>

          <p style="font-size: 1.125rem; color: var(--color-text-secondary); margin-bottom: 2rem;">
            ${correctCount} out of ${totalQuestions} correct
          </p>

          <div class="card" style="padding: 1.5rem; background: var(--color-blue-light); margin-bottom: 2rem;">
            <h4>Domain Breakdown</h4>
            <p style="margin: 0.5rem 0;">
              <strong>${domain.charAt(0).toUpperCase() + domain.slice(1)} Domain:</strong> ${score}%
            </p>
            <p style="margin: 0.5rem 0; color: var(--color-text-secondary);">
              Time: ${Math.floor(timeSpent / 60)}m ${timeSpent % 60}s
            </p>
          </div>

          ${passed ? `
            <div style="padding: 1rem; background: var(--color-trust-green-light); border-radius: 8px; margin-bottom: 2rem;">
              <p style="margin: 0; color: var(--color-trust-green); font-weight: 600;">
                Great job! +${xpEarned} XP
              </p>
            </div>
          ` : `
            <div style="padding: 1rem; background: var(--color-warning-yellow-light); border-radius: 8px; margin-bottom: 2rem;">
              <p style="margin: 0; color: var(--color-text-primary);">
                Keep practicing! +${xpEarned} XP
              </p>
            </div>
          `}
        </div>
        <div class="card-footer">
          <button class="btn btn-secondary" onclick="navigateTo('/mission/m6')">
            ← Back to Mission 6
          </button>
          <button class="btn btn-primary" onclick="startMiniTest('${safeActionArg(domain)}')">
            Try Again
          </button>
        </div>
      </div>
    </div>
  `);

  if (passed) {
    gamification.triggerConfetti(30);
    showToast(`Mini-test passed! +${xpEarned} XP`, 'success');
  } else {
    showToast(`Score: ${score}%. Keep practicing!`, 'info');
  }

  miniTestSession = null;
}

/**
 * Render Mock Exam Session
 */
function renderMockExamSession() {
  if (!mockExamSession) return;

  const { questions, currentQuestionIndex, answers, flaggedQuestions, timeRemaining, onBreak } = mockExamSession;
  const question = questions[currentQuestionIndex];
  const selectedAnswer = answers[currentQuestionIndex];
  const progress = Math.round(((currentQuestionIndex + 1) / questions.length) * 100);
  const answeredCount = answers.filter(a => a !== null).length;

  // Check if break is required
  if (!onBreak && !mockExamSession.breakTaken.after60 && currentQuestionIndex >= 60 && currentQuestionIndex < 61) {
    showMockExamBreak('first');
    return;
  }
  if (!onBreak && !mockExamSession.breakTaken.after120 && currentQuestionIndex >= 120 && currentQuestionIndex < 121) {
    showMockExamBreak('second');
    return;
  }

  const hours = Math.floor(timeRemaining / 3600);
  const minutes = Math.floor((timeRemaining % 3600) / 60);
  const seconds = timeRemaining % 60;

  const appView = document.getElementById('app-view');
  setSafeInnerHTML(appView, `
    <div class="mock-exam-session">
      <div class="card" style="max-width: 1000px; margin: 0 auto;">
        <div class="card-header" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white;">
          <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
            <h2 style="margin: 0; color: white;">🎯 PMP Mock Exam</h2>
            <div style="display: flex; align-items: center; gap: 1.5rem; flex-wrap: wrap;">
              <span style="color: white;">
                Q ${currentQuestionIndex + 1} / ${questions.length}
              </span>
              <span style="color: white;">
                Answered: ${answeredCount} / ${questions.length}
              </span>
              <span style="font-size: 1.25rem; font-weight: bold; color: ${timeRemaining < 600 ? '#ff6b6b' : 'white'};" id="mock-exam-timer">
                ${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}
              </span>
            </div>
          </div>
        </div>

        <div class="progress-bar" style="margin: 0 1.5rem 1.5rem 1.5rem;">
          <div class="progress-fill" style="width: ${progress}%; background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);"></div>
        </div>

        <div class="card-body">
          <div style="margin-bottom: 2rem;">
            <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 1rem;">
              <h3 style="font-size: 1.25rem; line-height: 1.6; flex: 1;">
                ${question.question}
              </h3>
              <button class="btn btn-sm ${flaggedQuestions.has(currentQuestionIndex) ? 'btn-warning' : 'btn-secondary'}"
                      onclick="toggleMockExamFlag()"
                      style="margin-left: 1rem;">
                ${flaggedQuestions.has(currentQuestionIndex) ? '🚩 Flagged' : '🏴 Flag'}
              </button>
            </div>
            ${question.domain ? `<span class="badge badge-primary">${question.domain}</span>` : ''}
          </div>

          <div style="display: grid; gap: 1rem;">
            ${question.options
              .sort((a, b) => a.id.localeCompare(b.id))
              .map(option => {
              const isSelected = selectedAnswer === option.id;
              let bgColor = isSelected ? '#EFF6FF' : 'var(--color-surface)';
              let borderColor = isSelected ? 'var(--color-integrity-blue)' : 'var(--color-border)';
              let borderWidth = isSelected ? '3px' : '2px';

              return `
                <div class="quiz-option"
                     onclick="selectMockExamAnswer('${safeActionArg(option.id)}')"
                     style="padding: 1rem 1.5rem; border: ${borderWidth} solid ${borderColor}; border-radius: 8px; cursor: pointer; transition: background-color 0.2s, border-color 0.2s, box-shadow 0.2s, transform 0.2s, opacity 0.2s; background: ${bgColor};">
                  <div style="display: flex; align-items: start; gap: 1rem;">
                    <div style="flex-shrink: 0; width: 24px; height: 24px; border: 2px solid ${borderColor}; border-radius: 50%; display: flex; align-items: center; justify-content: center; background: ${isSelected ? borderColor : 'transparent'};">
                      ${isSelected ? '<span style="color: white; font-weight: bold;">✓</span>' : ''}
                    </div>
                    <div style="flex: 1;">
                      <strong style="margin-right: 0.5rem;">${option.id.toUpperCase()}.</strong>
                      ${option.text}
                    </div>
                  </div>
                </div>
              `);
            }).join('')}
          </div>
        </div>

        <div class="card-footer" style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
          <div style="display: flex; gap: 0.5rem;">
            <button class="btn btn-secondary" onclick="mockExamReview()">
              📋 Review
            </button>
            <button class="btn btn-secondary" onclick="exitMockExam()">
              Exit Exam
            </button>
          </div>
          <div style="display: flex; gap: 0.5rem;">
            <button class="btn btn-secondary"
                    onclick="navigateMockExam(${currentQuestionIndex - 1})"
                    ${currentQuestionIndex === 0 ? 'disabled' : ''}>
              ← Previous
            </button>
            <button class="btn btn-primary"
                    onclick="navigateMockExam(${currentQuestionIndex + 1})">
              ${currentQuestionIndex === questions.length - 1 ? 'Review & Submit' : 'Next →'}
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
}

/**
 * Show mock exam break screen
 */
function showMockExamBreak(breakType) {
  if (!mockExamSession) return;

  mockExamSession.onBreak = true;
  const breakNumber = breakType === 'first' ? 1 : 2;
  const questionNumber = breakType === 'first' ? 60 : 120;

  const appView = document.getElementById('app-view');
  setSafeInnerHTML(appView, `
    <div class="mock-exam-break">
      <div class="card" style="max-width: 600px; margin: 0 auto; text-align: center;">
        <div class="card-header">
          <h2>☕ Optional Break ${breakNumber}/2</h2>
        </div>
        <div class="card-body" style="padding: 3rem;">
          <div style="font-size: 4rem; margin-bottom: 1rem;">⏸️</div>
          <h3>Great Progress!</h3>
          <p style="color: var(--color-text-secondary); margin: 1rem 0 2rem;">
            You've completed ${questionNumber} questions. Take a 10-minute break if you need it, or continue immediately.
          </p>
          <p style="font-size: var(--font-size-sm); color: var(--color-text-muted); margin-bottom: 2rem;">
            💡 On the real PMP exam, you get two 10-minute breaks (after questions 60 and 120). The timer pauses during breaks.
          </p>
          <button class="btn btn-primary btn-lg" onclick="resumeFromMockExamBreak('${safeActionArg(breakType)}')">
            Continue Exam →
          </button>
        </div>
      </div>
    </div>
  `);
}

/**
 * Resume from mock exam break
 */
window.resumeFromMockExamBreak = function(breakType) {
  if (!mockExamSession) return;

  mockExamSession.onBreak = false;
  if (breakType === 'first') {
    mockExamSession.breakTaken.after60 = true;
  } else {
    mockExamSession.breakTaken.after120 = true;
  }
  renderMockExamSession();
};

/**
 * Select mock exam answer
 */
window.selectMockExamAnswer = function(answerId) {
  if (!mockExamSession) return;
  mockExamSession.answers[mockExamSession.currentQuestionIndex] = answerId;
  renderMockExamSession();
};

/**
 * Navigate to specific question in mock exam
 */
window.navigateMockExam = function(questionIndex) {
  if (!mockExamSession) return;

  if (questionIndex < 0) return;

  if (questionIndex >= mockExamSession.questions.length) {
    mockExamReview();
    return;
  }

  mockExamSession.currentQuestionIndex = questionIndex;
  renderMockExamSession();
};

/**
 * Toggle flag on current question
 */
window.toggleMockExamFlag = function() {
  if (!mockExamSession) return;

  const { currentQuestionIndex, flaggedQuestions } = mockExamSession;
  if (flaggedQuestions.has(currentQuestionIndex)) {
    flaggedQuestions.delete(currentQuestionIndex);
  } else {
    flaggedQuestions.add(currentQuestionIndex);
  }
  renderMockExamSession();
};

/**
 * Show review screen before submitting
 */
window.mockExamReview = function() {
  if (!mockExamSession) return;

  const { questions, answers, flaggedQuestions } = mockExamSession;
  const answeredCount = answers.filter(a => a !== null).length;
  const unansweredCount = questions.length - answeredCount;
  const flaggedCount = flaggedQuestions.size;

  const appView = document.getElementById('app-view');
  setSafeInnerHTML(appView, `
    <div class="mock-exam-review">
      <div class="card" style="max-width: 1000px; margin: 0 auto;">
        <div class="card-header">
          <h2>📋 Review Your Answers</h2>
        </div>
        <div class="card-body">
          <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 1.5rem; margin-bottom: 2rem;">
            <div class="card" style="padding: 1.5rem; text-align: center; background: var(--color-trust-green-light);">
              <div style="font-size: 2rem; font-weight: bold; color: var(--color-trust-green);">${answeredCount}</div>
              <div style="color: var(--color-text-secondary);">Answered</div>
            </div>
            <div class="card" style="padding: 1.5rem; text-align: center; background: var(--color-urgency-red-light);">
              <div style="font-size: 2rem; font-weight: bold; color: var(--color-urgency-red);">${unansweredCount}</div>
              <div style="color: var(--color-text-secondary);">Unanswered</div>
            </div>
            <div class="card" style="padding: 1.5rem; text-align: center; background: var(--color-warning-yellow-light);">
              <div style="font-size: 2rem; font-weight: bold; color: var(--color-warning-yellow);">${flaggedCount}</div>
              <div style="color: var(--color-text-secondary);">Flagged</div>
            </div>
          </div>

          <h3 style="margin-bottom: 1rem;">Question Navigator</h3>
          <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(50px, 1fr)); gap: 0.5rem; margin-bottom: 2rem;">
            ${questions.map((q, index) => {
              const isAnswered = answers[index] !== null;
              const isFlagged = flaggedQuestions.has(index);
              let bgColor = isAnswered ? 'var(--color-trust-green)' : 'var(--color-urgency-red)';
              if (isFlagged) bgColor = 'var(--color-warning-yellow)';

              return `
                <button class="btn btn-sm" style="background: ${bgColor}; color: white; min-width: 50px;"
                        onclick="navigateMockExam(${index})">
                  ${index + 1}${isFlagged ? ' 🚩' : ''}
                </button>
              `);
            }).join('')}
          </div>

          ${unansweredCount > 0 ? `
            <div style="padding: 1.5rem; background: var(--color-urgency-red-light); border-left: 4px solid var(--color-urgency-red); border-radius: 8px; margin-bottom: 2rem;">
              <h4 style="color: var(--color-urgency-red); margin-bottom: 0.5rem;">⚠️ Warning</h4>
              <p style="margin: 0;">You have ${unansweredCount} unanswered question${unansweredCount > 1 ? 's' : ''}. These will be marked as incorrect.</p>
            </div>
          ` : ''}
        </div>
        <div class="card-footer" style="display: flex; justify-content: space-between;">
          <button class="btn btn-secondary" onclick="renderMockExamSession()">
            ← Back to Exam
          </button>
          <button class="btn btn-primary" onclick="submitMockExam()">
            Submit Exam
          </button>
        </div>
      </div>
    </div>
  `;
};

/**
 * Submit mock exam
 */
window.submitMockExam = function() {
  if (!mockExamSession) return;

  if (!confirm('Submit your mock exam? You cannot change your answers after submission.')) {
    return;
  }

  finishMockExam();
};

/**
 * Auto-submit mock exam when time expires
 */
function autoSubmitMockExam() {
  if (!mockExamSession) return;
  showToast('Time expired! Submitting exam...', 'warning');
  setTimeout(() => finishMockExam(), 1000);
}

/**
 * Exit mock exam early
 */
window.exitMockExam = function() {
  if (!mockExamSession) return;

  const answeredCount = mockExamSession.answers.filter(a => a !== null).length;
  if (answeredCount > 0) {
    if (!confirm(`You've answered ${answeredCount} questions. Exit exam anyway? Your progress will NOT be saved.`)) {
      return;
    }
  }

  if (mockExamTimer) {
    clearInterval(mockExamTimer);
    mockExamTimer = null;
  }
  mockExamSession = null;
  router.navigate('/mock-exam');
};

/**
 * Finish mock exam and calculate results
 */
function finishMockExam() {
  if (!mockExamSession) return;

  clearInterval(mockExamTimer);
  mockExamTimer = null;

  const { examId, examName, questions, answers, startTime, passingScore } = mockExamSession;

  // Calculate scores
  let correctCount = 0;
  const domainScores = { people: { correct: 0, total: 0 }, process: { correct: 0, total: 0 }, business: { correct: 0, total: 0 } };

  questions.forEach((question, index) => {
    const userAnswer = answers[index];
    const isCorrect = userAnswer === question.correctAnswer;

    if (isCorrect) correctCount++;

    const domain = question.domain || 'people';
    if (domainScores[domain]) {
      domainScores[domain].total++;
      if (isCorrect) domainScores[domain].correct++;
    }
  });

  const totalQuestions = questions.length;
  const score = Math.round((correctCount / totalQuestions) * 100);
  const passed = score >= passingScore; // Use dynamic passing score

  const timeSpent = Math.floor((Date.now() - startTime) / 1000); // in seconds

  // Calculate domain percentages
  const domainPercentages = {
    people: domainScores.people.total > 0 ? Math.round((domainScores.people.correct / domainScores.people.total) * 100) : 0,
    process: domainScores.process.total > 0 ? Math.round((domainScores.process.correct / domainScores.process.total) * 100) : 0,
    business: domainScores.business.total > 0 ? Math.round((domainScores.business.correct / domainScores.business.total) * 100) : 0
  };

  // Save to state
  const mockExamHistory = state.get('mockExams') || [];
  const mockExam = {
    examId: examId,
    examName: examName,
    examNumber: mockExamHistory.filter(e => e.examId === examId).length + 1, // Count attempts for this specific exam
    score,
    correctCount,
    totalQuestions,
    domainScores: domainPercentages,
    completedAt: new Date().toISOString(),
    timeSpent,
    passed,
    passingScore
  };

  mockExamHistory.push(mockExam);
  state.set('mockExams', mockExamHistory);
  state.saveToStorage();

  // Award XP
  if (passed) {
    gamification.awardXP(1000);
    gamification.unlockAchievement('mock_exam_passed');
    gamification.triggerConfetti(100);
  } else {
    gamification.awardXP(500);
  }

  mockExamSession = null;

  // Show results
  showMockExamResults(mockExam);
}

/**
 * Show mock exam results
 */
function showMockExamResults(exam) {
  const hours = Math.floor(exam.timeSpent / 3600);
  const minutes = Math.floor((exam.timeSpent % 3600) / 60);

  const appView = document.getElementById('app-view');
  setSafeInnerHTML(appView, `
    <div class="mock-exam-results">
      <div class="card" style="max-width: 800px; margin: 0 auto;">
        <div class="card-header" style="background: ${exam.passed ? 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' : 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'}; color: white; text-align: center;">
          <div style="font-size: 4rem; margin-bottom: 1rem;">${exam.passed ? '🎉' : '📚'}</div>
          <h2 style="margin: 0; color: white;">${exam.passed ? 'PASSED!' : 'Keep Studying!'}</h2>
          <div style="font-size: 3rem; font-weight: bold; margin: 1rem 0; color: white;">${exam.score}%</div>
          <p style="margin: 0; color: white;">${exam.correctCount} / ${exam.totalQuestions} correct</p>
        </div>

        <div class="card-body">
          <h3 style="margin-bottom: 1.5rem;">Domain Breakdown</h3>
          <div style="display: grid; gap: 1rem; margin-bottom: 2rem;">
            ${Object.entries(exam.domainScores).map(([domain, score]) => `
              <div style="display: flex; justify-content: space-between; align-items: center; padding: 1rem; background: var(--color-surface); border-radius: 8px;">
                <span style="font-weight: 600; text-transform: capitalize;">${domain}</span>
                <div style="flex: 1; margin: 0 1rem;">
                  <div style="background: var(--color-border); border-radius: 4px; height: 8px; overflow: hidden;">
                    <div style="width: ${score}%; height: 100%; background: ${score >= 61 ? 'var(--color-trust-green)' : 'var(--color-urgency-red)'}; transition: width 0.3s;"></div>
                  </div>
                </div>
                <span style="font-weight: bold; color: ${score >= 61 ? 'var(--color-trust-green)' : 'var(--color-urgency-red)'};">${score}%</span>
              </div>
            `).join('')}
          </div>

          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 1rem; margin-bottom: 2rem;">
            <div class="card" style="padding: 1rem; text-align: center;">
              <div style="font-size: 1.5rem; font-weight: bold;">${hours}h ${minutes}m</div>
              <div style="color: var(--color-text-secondary); font-size: var(--font-size-sm);">Time Spent</div>
            </div>
            <div class="card" style="padding: 1rem; text-align: center;">
              <div style="font-size: 1.5rem; font-weight: bold;">${exam.passed ? '+1,000' : '+500'} XP</div>
              <div style="color: var(--color-text-secondary); font-size: var(--font-size-sm);">Earned</div>
            </div>
          </div>

          ${exam.passed ? `
            <div style="padding: 1.5rem; background: var(--color-trust-green-light); border-left: 4px solid var(--color-trust-green); border-radius: 8px;">
              <h4 style="color: var(--color-trust-green); margin-bottom: 0.5rem;">🎯 Great Work!</h4>
              <p style="margin: 0;">You're scoring at a passing level. Keep practicing to maintain your readiness!</p>
            </div>
          ` : `
            <div style="padding: 1.5rem; background: var(--color-blue-light); border-left: 4px solid var(--color-integrity-blue); border-radius: 8px;">
              <h4 style="color: var(--color-integrity-blue); margin-bottom: 0.5rem;">💡 Recommendations</h4>
              <ul style="margin: 0.5rem 0 0; padding-left: 1.5rem; line-height: 1.8;">
                ${exam.domainScores.people < 61 ? '<li>Review People domain tasks (Domain I)</li>' : ''}
                ${exam.domainScores.process < 61 ? '<li>Study Process domain tasks (Domain II)</li>' : ''}
                ${exam.domainScores.business < 61 ? '<li>Focus on Business Environment (Domain III)</li>' : ''}
                <li>Practice weak area drills in Mission 6</li>
                <li>Review formulas and calculations</li>
              </ul>
            </div>
          `}
        </div>

        <div class="card-footer" style="display: flex; justify-content: space-between; gap: 1rem;">
          <button class="btn btn-secondary" onclick="navigateTo('/mission/m7')">
            ← Back to Mission 7
          </button>
          <button class="btn btn-primary" onclick="startMockExam()">
            Take Another Mock Exam
          </button>
        </div>
      </div>
    </div>
  `);
}

/**
 * Update mock exam timer display
 */
function updateMockExamTimer() {
  const timerElement = document.getElementById('mock-exam-timer');
  if (timerElement && mockExamSession) {
    const { timeRemaining } = mockExamSession;
    const hours = Math.floor(timeRemaining / 3600);
    const minutes = Math.floor((timeRemaining % 3600) / 60);
    const seconds = timeRemaining % 60;
    timerElement.textContent = `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

    if (timeRemaining < 600) { // Less than 10 minutes
      timerElement.style.color = '#ff6b6b';
    }
  }
}

/**
 * View mock exam results
 */
window.viewMockExamResults = function(examId) {
  const mockExamHistory = state.get('mockExams') || [];
  const examResults = mockExamHistory.filter(e => e.examId === examId);

  if (examResults.length === 0) {
    showToast('No results found for this exam', 'info');
    return;
  }

  // Show the most recent result
  const latestResult = examResults[examResults.length - 1];
  showMockExamResults(latestResult);
};

/**
 * Render Mission 6 Weak Areas Practice
 */
function renderMission6WeakAreas() {
  // Analyze quiz history to find weak areas
  const quizHistory = state.get('quizHistory') || [];

  if (quizHistory.length === 0) {
    return `
      <div class="card">
        <div class="card-header">
          <h2>📚 Weak Area Practice</h2>
        </div>
        <div class="card-body" style="text-align: center; padding: 3rem;">
          <h3>No Quiz History Yet</h3>
          <p style="color: var(--color-text-secondary); margin: 1rem 0;">
            Complete some quizzes first to identify your weak areas.
          </p>
        </div>
        <div class="card-footer">
          <button class="btn btn-primary" onclick="navigateTo('/mission/m6')">
            ← Back to Mission 6
          </button>
        </div>
      </div>
    `;
  }

  // Calculate accuracy per task
  const taskPerformance = {};

  quizHistory.forEach(quiz => {
    const taskId = quiz.topicId;
    if (!taskPerformance[taskId]) {
      taskPerformance[taskId] = { correct: 0, total: 0 };
    }
    taskPerformance[taskId].total += quiz.totalQuestions;
    taskPerformance[taskId].correct += Math.round((quiz.score / 100) * quiz.totalQuestions);
  });

  // Find tasks with < 75% accuracy
  const weakAreas = Object.entries(taskPerformance)
    .map(([taskId, perf]) => ({
      taskId,
      accuracy: Math.round((perf.correct / perf.total) * 100),
      totalQuestions: perf.total
    }))
    .filter(task => task.accuracy < 75)
    .sort((a, b) => a.accuracy - b.accuracy);

  if (weakAreas.length === 0) {
    return `
      <div class="card">
        <div class="card-header">
          <h2>📚 Weak Area Practice</h2>
        </div>
        <div class="card-body" style="text-align: center; padding: 3rem;">
          <div style="font-size: 4rem; margin-bottom: 1rem;">🎉</div>
          <h3>No Weak Areas Detected!</h3>
          <p style="color: var(--color-text-secondary); margin: 1rem 0;">
            Great job! You're scoring 75% or higher on all tasks.
          </p>
        </div>
        <div class="card-footer">
          <button class="btn btn-primary" onclick="navigateTo('/mission/m6')">
            ← Back to Mission 6
          </button>
        </div>
      </div>
    `;
  }

  return `
    <div class="weak-areas">
      <div class="card">
        <div class="card-header">
          <h2>📚 Weak Area Adaptive Practice</h2>
        </div>
        <div class="card-body">
          <p style="color: var(--color-text-secondary); margin-bottom: 2rem;">
            Based on your quiz history, here are areas where you scored below 75%. Practice these topics to improve!
          </p>

          <div style="margin-bottom: 2rem;">
            <h3 style="margin-bottom: 1rem;">Your Weak Areas (${weakAreas.length})</h3>
            <div style="display: grid; gap: 1rem;">
              ${weakAreas.slice(0, 10).map(area => {
                const task = missionManager.getTask(area.taskId);
                const taskName = task ? task.name : area.taskId;

                return `
                  <div class="card" style="padding: 1rem; background: ${area.accuracy < 50 ? 'var(--color-urgency-red-light)' : 'var(--color-warning-yellow-light)'};">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                      <div>
                        <h4 style="margin-bottom: 0.25rem;">${taskName}</h4>
                        <p style="font-size: var(--font-size-sm); color: var(--color-text-secondary); margin: 0;">
                          ${area.totalQuestions} questions attempted
                        </p>
                      </div>
                      <div style="text-align: right;">
                        <div style="font-size: 1.5rem; font-weight: bold; color: ${area.accuracy < 50 ? 'var(--color-urgency-red)' : 'var(--color-warning-yellow)'};">
                          ${area.accuracy}%
                        </div>
                        <div style="font-size: var(--font-size-sm); color: var(--color-text-secondary);">
                          accuracy
                        </div>
                      </div>
                    </div>
                  </div>
                `;
              }).join('')}
            </div>
          </div>

          <div style="text-align: center; padding: 2rem; background: var(--color-blue-light); border-radius: 8px;">
            <h3 style="margin-bottom: 1rem;">Start Adaptive Practice</h3>
            <p style="color: var(--color-text-secondary); margin-bottom: 2rem;">
              We'll generate a focused quiz with 50 questions from your weakest topics.
            </p>
            <button class="btn btn-primary btn-lg" onclick="startWeakAreaPractice()">
              🚀 Start Practice Quiz
            </button>
          </div>
        </div>
        <div class="card-footer">
          <button class="btn btn-secondary" onclick="navigateTo('/mission/m6')">
            ← Back to Mission 6
          </button>
        </div>
      </div>
    </div>
  `;
}

/**
 * Start weak area practice
 */
window.startWeakAreaPractice = function() {
  const quizHistory = state.get('quizHistory') || [];

  // Calculate task performance
  const taskPerformance = {};
  quizHistory.forEach(quiz => {
    const taskId = quiz.topicId;
    if (!taskPerformance[taskId]) {
      taskPerformance[taskId] = { correct: 0, total: 0 };
    }
    taskPerformance[taskId].total += quiz.totalQuestions;
    taskPerformance[taskId].correct += Math.round((quiz.score / 100) * quiz.totalQuestions);
  });

  // Find weak task IDs
  const weakTaskIds = Object.entries(taskPerformance)
    .filter(([_, perf]) => (perf.correct / perf.total) < 0.75)
    .map(([taskId]) => taskId);

  // Get questions from weak areas
  const weakAreaQuestions = appData.quizBank.filter(q => weakTaskIds.includes(q.taskId));

  if (weakAreaQuestions.length < 10) {
    showToast('Not enough questions available for weak areas', 'error');
    return;
  }

  // Generate adaptive quiz (up to 50 questions)
  const shuffled = [...weakAreaQuestions].sort(() => Math.random() - 0.5);
  const questions = shuffled.slice(0, Math.min(50, weakAreaQuestions.length));

  // Use the standard quiz session with adaptive flag
  quizSession = {
    taskId: 'weak-areas',
    quiz: { questions },
    currentQuestionIndex: 0,
    selectedAnswer: null,
    answers: [],
    showingFeedback: false,
    isWeakAreaPractice: true
  };

  renderQuizSession();
};

/**
 * Render Mission 6 Formulas
 */
function renderMission6Formulas() {
  if (!appData.formulas || !appData.formulas.categories) {
    return `
      <div class="card">
        <h2>Formulas not loaded</h2>
        <p>Unable to load formula data.</p>
      </div>
    `;
  }

  const formulaMastery = state.get('progress.formulaMastery') || {};
  const totalFormulas = appData.formulas.categories.reduce((sum, cat) => sum + cat.formulas.length, 0);
  const masteredFormulas = Object.values(formulaMastery).filter(m => m.mastered).length;

  return `
    <div class="formula-mastery">
      <div class="card">
        <div class="card-header">
          <h2>🧮 Formula Mastery</h2>
          <span class="badge badge-primary">${masteredFormulas} / ${totalFormulas} Mastered</span>
        </div>
        <div class="card-body">
          <p style="color: var(--color-text-secondary); margin-bottom: 2rem;">
            Master all ${totalFormulas} PMP formulas with interactive practice problems. Achieve 90% accuracy to mark each formula as mastered.
          </p>

          <div class="progress-container" style="margin-bottom: 2rem;">
            <div class="progress-label">
              <span>Overall Progress</span>
              <span>${Math.round((masteredFormulas / totalFormulas) * 100)}%</span>
            </div>
            <div class="progress-bar-wrapper">
              <div class="progress-bar-fill" style="width: ${(masteredFormulas / totalFormulas) * 100}%"></div>
            </div>
          </div>

          ${appData.formulas.categories.map(category => {
            const categoryMastered = category.formulas.filter(f => formulaMastery[f.id]?.mastered).length;

            return `
              <div class="card" style="margin-bottom: 1.5rem;">
                <div class="card-header">
                  <h3>${category.name}</h3>
                  <span class="badge badge-secondary">${categoryMastered} / ${category.formulas.length}</span>
                </div>
                <div class="card-body">
                  <div style="display: grid; gap: 1rem;">
                    ${category.formulas.map(formula => {
                      const mastery = formulaMastery[formula.id] || { attempts: 0, correct: 0, mastered: false };
                      const accuracy = mastery.attempts > 0 ? Math.round((mastery.correct / mastery.attempts) * 100) : 0;

                      return `
                        <div class="card" style="padding: 1rem; cursor: pointer; border: 2px solid ${mastery.mastered ? 'var(--color-trust-green)' : 'var(--color-border)'};"
                             onclick="showFormulaDetail('${safeActionArg(formula.id)}')">
                          <div style="display: flex; justify-content: space-between; align-items: start;">
                            <div style="flex: 1;">
                              <h4 style="margin-bottom: 0.5rem;">
                                ${formula.name}
                                ${mastery.mastered ? '<span style="color: var(--color-trust-green); margin-left: 0.5rem;">✓</span>' : ''}
                              </h4>
                              <p style="font-family: monospace; background: var(--color-surface); padding: 0.5rem; border-radius: 4px; margin: 0.5rem 0;">
                                ${formula.formula}
                              </p>
                              <p style="font-size: var(--font-size-sm); color: var(--color-text-secondary); margin: 0;">
                                ${formula.description}
                              </p>
                            </div>
                            ${mastery.attempts > 0 ? `
                              <div style="text-align: right; margin-left: 1rem;">
                                <div style="font-size: 1.25rem; font-weight: bold; color: ${accuracy >= 90 ? 'var(--color-trust-green)' : 'var(--color-text-primary)'};">
                                  ${accuracy}%
                                </div>
                                <div style="font-size: var(--font-size-xs); color: var(--color-text-secondary);">
                                  ${mastery.correct}/${mastery.attempts}
                                </div>
                              </div>
                            ` : ''}
                          </div>
                        </div>
                      `;
                    }).join('')}
                  </div>
                </div>
              </div>
            `;
          }).join('')}

          <div style="text-align: center; margin-top: 2rem;">
            <button class="btn btn-primary btn-lg" onclick="startFormulaPractice()">
              🚀 Practice All Formulas
            </button>
          </div>
        </div>
        <div class="card-footer">
          <button class="btn btn-secondary" onclick="navigateTo('/mission/m6')">
            ← Back to Mission 6
          </button>
        </div>
      </div>
    </div>
  `;
}

/**
 * Show formula detail modal
 */
window.showFormulaDetail = function(formulaId) {
  const formula = appData.formulas.categories
    .flatMap(cat => cat.formulas)
    .find(f => f.id === formulaId);

  if (!formula) return;

  const mastery = state.get(`progress.formulaMastery.${formulaId}`) || { attempts: 0, correct: 0, mastered: false };

  const modal = document.createElement('div');
  modal.className = 'modal-backdrop';
  setSafeInnerHTML(modal, `
    <div class="modal" style="max-width: 700px;">
      <div class="modal-header">
        <h2 class="modal-title">${formula.name}</h2>
        <span class="modal-close" onclick="this.closest('.modal-backdrop').remove()">×</span>
      </div>
      <div class="modal-body">
        <div style="background: var(--color-blue-light); padding: 1.5rem; border-radius: 8px; margin-bottom: 1.5rem;">
          <h3 style="margin-bottom: 0.5rem;">Formula</h3>
          <p style="font-family: monospace; font-size: 1.25rem; margin: 0;">
            ${formula.formula}
          </p>
        </div>

        <div style="margin-bottom: 1.5rem;">
          <h3 style="margin-bottom: 0.5rem;">Description</h3>
          <p style="color: var(--color-text-secondary);">${formula.description}</p>
        </div>

        ${formula.example ? `
          <div style="background: var(--color-surface); padding: 1.5rem; border-radius: 8px; margin-bottom: 1.5rem;">
            <h3 style="margin-bottom: 1rem;">Example</h3>
            <p><strong>Given:</strong> ${formula.example.given}</p>
            <p><strong>Calculation:</strong> ${formula.example.calculation}</p>
            <p><strong>Interpretation:</strong> ${formula.example.interpretation}</p>
          </div>
        ` : ''}

        ${mastery.attempts > 0 ? `
          <div style="text-align: center; padding: 1rem; background: ${mastery.mastered ? 'var(--color-trust-green-light)' : 'var(--color-surface)'}; border-radius: 8px;">
            <h4>Your Progress</h4>
            <p style="font-size: 1.5rem; font-weight: bold; margin: 0.5rem 0;">
              ${Math.round((mastery.correct / mastery.attempts) * 100)}%
            </p>
            <p style="color: var(--color-text-secondary); margin: 0;">
              ${mastery.correct} correct out of ${mastery.attempts} attempts
            </p>
          </div>
        ` : ''}
      </div>
      <div class="modal-footer">
        <button class="btn btn-secondary" onclick="this.closest('.modal-backdrop').remove()">Close</button>
        <button class="btn btn-primary" onclick="practiceFormula('${safeActionArg(formulaId)}'); this.closest('.modal-backdrop').remove();">
          Practice This Formula
        </button>
      </div>
    </div>
  `);

  document.body.appendChild(modal);
};

/**
 * Start formula practice
 */
window.startFormulaPractice = function() {
  showToast('Formula practice feature coming soon!', 'info');
  // This would generate practice problems for formulas
};

/**
 * Practice specific formula
 */
window.practiceFormula = function(formulaId) {
  showToast(`Practice for ${formulaId} coming soon!`, 'info');
};

/**
 * Render Mission 6 Scenarios
 */
function renderMission6Scenarios() {
  // Filter scenario-type questions from quiz bank
  const scenarioQuestions = appData.quizBank.filter(q =>
    q.type === 'scenario' || q.difficulty === 'hard' || (q.question && q.question.length > 200)
  );

  const scenarioProgress = state.get('progress.scenariosPracticed') || 0;
  const targetScenarios = 20;

  return `
    <div class="scenario-practice">
      <div class="card">
        <div class="card-header">
          <h2>🎭 Situational Scenario Practice</h2>
          <span class="badge badge-primary">${scenarioProgress} / ${targetScenarios} Completed</span>
        </div>
        <div class="card-body">
          <p style="color: var(--color-text-secondary); margin-bottom: 2rem;">
            Practice with complex, real-world project scenarios. These multi-part questions test your ability to apply PMP knowledge in context.
          </p>

          <div class="progress-container" style="margin-bottom: 2rem;">
            <div class="progress-label">
              <span>Scenario Progress</span>
              <span>${Math.round((scenarioProgress / targetScenarios) * 100)}%</span>
            </div>
            <div class="progress-bar-wrapper">
              <div class="progress-bar-fill" style="width: ${(scenarioProgress / targetScenarios) * 100}%"></div>
            </div>
          </div>

          <div class="card" style="padding: 2rem; background: var(--color-blue-light); text-align: center; margin-bottom: 2rem;">
            <h3 style="margin-bottom: 1rem;">📊 Scenario Details</h3>
            <ul style="text-align: left; line-height: 2; max-width: 500px; margin: 0 auto;">
              <li><strong>Total Scenarios:</strong> ${scenarioQuestions.length}</li>
              <li><strong>Target Goal:</strong> ${targetScenarios} scenarios</li>
              <li><strong>Complexity:</strong> High (real-world situations)</li>
              <li><strong>Detailed Explanations:</strong> Yes</li>
            </ul>
          </div>

          ${scenarioQuestions.length > 0 ? `
            <div style="text-align: center;">
              <button class="btn btn-primary btn-lg" onclick="startScenarioPractice()">
                🚀 Start Scenario Practice
              </button>
            </div>
          ` : `
            <div style="text-align: center; padding: 2rem;">
              <p style="color: var(--color-text-muted);">
                No scenario questions available yet. Complete more missions to unlock scenarios.
              </p>
            </div>
          `}
        </div>
        <div class="card-footer">
          <button class="btn btn-secondary" onclick="navigateTo('/mission/m6')">
            ← Back to Mission 6
          </button>
        </div>
      </div>
    </div>
  `;
}

/**
 * Start scenario practice
 */
window.startScenarioPractice = function() {
  const scenarioQuestions = appData.quizBank.filter(q =>
    q.type === 'scenario' || q.difficulty === 'hard' || (q.question && q.question.length > 200)
  );

  if (scenarioQuestions.length === 0) {
    showToast('No scenario questions available', 'error');
    return;
  }

  // Select 20 random scenarios
  const shuffled = [...scenarioQuestions].sort(() => Math.random() - 0.5);
  const questions = shuffled.slice(0, Math.min(20, scenarioQuestions.length));

  // Use standard quiz session
  quizSession = {
    taskId: 'scenarios',
    quiz: { questions },
    currentQuestionIndex: 0,
    selectedAnswer: null,
    answers: [],
    showingFeedback: false,
    isScenarioPractice: true
  };

  renderQuizSession();
};

/**
 * Global utility functions for inline event handlers
 */
window.updateSetting = function(key, value) {
  state.set(`settings.${key}`, value);
  showToast('Setting updated', 'success');
};

window.downloadBackup = function() {
  storage.downloadBackup(`pmp-prep-backup-${new Date().toISOString().split('T')[0]}.json`);
  showToast('Backup downloaded', 'success');
};

window.resetProgress = function() {
  if (confirm('Are you sure you want to reset all progress? This cannot be undone.')) {
    state.reset();
    window.location.reload();
  }
};

/**
 * Show toast notification
 */
function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  setSafeInnerHTML(toast, `
    <span class="toast-icon">${type === 'success' ? '✓' : 'ℹ'}</span>
    <div class="toast-content">
      <div class="toast-message">${escapeHTML(message)}</div>
    </div>
  `);

  container.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 3000);
}

/**
 * Subscribe to state changes and update UI
 */
function setupStateSubscriptions() {
  // Update header when progress changes
  state.subscribe('progress', () => {
    updateHeaderStats();
  });

  // Update header when streak changes
  state.subscribe('streak', () => {
    updateHeaderStats();
  });
}

/**
 * Main initialization function
 */
async function init() {
  console.log('Starting PMP Prep application...');

  try {
    // Load all data files
    const dataLoaded = await loadAppData();
    if (!dataLoaded) {
      return; // Error screen already shown
    }

    console.log('Data loaded, missions count:', appData.missions?.length);

    // Initialize router
    router.init({
      viewContainer: document.getElementById('app-view'),
      loadingElement: document.getElementById('loading-screen')
    });

    // Setup routes
    setupRoutes();

    // Setup state subscriptions
    setupStateSubscriptions();

    // Update header stats
    updateHeaderStats();

    // Mark daily activity (update streak)
    const isNewDay = state.markDailyActivity();
    if (isNewDay) {
      console.log('New day streak updated!');
    }

    // Check if first time user
    const tutorialCompleted = state.get('user.tutorialCompleted');
    if (!tutorialCompleted) {
      console.log('First time user, navigating to onboarding');
      router.navigate('/onboarding');
    } else {
      console.log('Returning user, navigating to mission map');
      router.navigate('/');
    }

    console.log('Application initialized successfully!');

    // Run automated content generation and tests after initialization
    setTimeout(async () => {
      // Generate content for all tasks
      if (typeof window.generateAllContent === 'function') {
        console.log('\n🤖 Generating content for all tasks...\n');
        try {
          await window.generateAllContent();
          console.log('\n✅ Content generation complete!');
        } catch (e) {
          console.warn('Content generation failed:', e.message);
        }
      }

      // Run automated tests
      // if (typeof window.autoTestAndFix === 'function') {
      //   console.log('\n🤖 Running automated integration tests...\n');
      //   try {
      //     const result = await window.autoTestAndFix();
      //     if (result.success) {
      //       console.log('\n✅ All systems operational!');
      //     }
      //   } catch (e) {
      //     console.warn('Auto-test failed:', e.message);
      //   }
      // }

      // Run comprehensive functional tests
      if (typeof window.comprehensiveFunctionalTest === 'function') {
        console.log('\n🧪 Running comprehensive functional tests...\n');
        try {
          const result = await window.comprehensiveFunctionalTest();
          if (result.success) {
            console.log('\n🎉 All functional tests passed!');
          }
        } catch (e) {
          console.warn('Functional test failed:', e.message);
        }
      }
    }, 1000);
  } catch (error) {
    console.error('Fatal error during initialization:', error);
    showErrorScreen(`Initialization failed: ${error.message}`);
  }
}

// Start the app when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

// Export for debugging
window.PMP_APP = {
  state,
  router,
  storage,
  appData,
  gamification
};

// Expose objects directly for easier access in console/validation
window.appData = appData;
window.state = state;
window.router = router;
window.gamification = gamification;
