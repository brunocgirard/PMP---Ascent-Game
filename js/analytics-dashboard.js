/**
 * analytics-dashboard.js - Learning Progress Analytics
 * Tracks and visualizes user learning progress, patterns, and achievements
 */

const ANALYTICS_LIMITS = {
  sessions: 200,
  activitiesPerSession: 500,
  achievements: 200,
  dailyStatsDays: 370
};

class AnalyticsDashboard {
  constructor() {
    this.saveTimeout = null;
    this.saveDelayMs = 300;
    this.data = this.loadAnalyticsData();
    this.trimData();
  }

  /**
   * Load analytics data from localStorage
   */
  loadAnalyticsData() {
    const rawData = localStorage.getItem('pmp_analytics');
    if (rawData) {
      try {
        return JSON.parse(rawData);
      } catch (error) {
        console.error('Failed to parse analytics data:', error);
      }
    }

    // Initialize default analytics structure
    return {
      sessions: [],
      dailyStats: {},
      weeklyStats: {},
      totalStats: {
        tasksStarted: 0,
        tasksCompleted: 0,
        learnPhasesCompleted: 0,
        flashcardSessionsCompleted: 0,
        quizzesPassed: 0,
        quizzesFailed: 0,
        totalXPEarned: 0,
        totalTimeSpent: 0, // in minutes
        streakDays: 0,
        longestStreak: 0
      },
      achievements: [],
      studyPatterns: {
        preferredTimeOfDay: null, // morning, afternoon, evening, night
        averageSessionLength: 0,
        mostProductiveDayOfWeek: null
      }
    };
  }

  /**
   * Save analytics data to localStorage
   */
  saveAnalyticsData(immediate = false) {
    if (!immediate) {
      clearTimeout(this.saveTimeout);
      this.saveTimeout = setTimeout(() => this.saveAnalyticsData(true), this.saveDelayMs);
      return;
    }

    clearTimeout(this.saveTimeout);
    this.trimData();

    try {
      localStorage.setItem('pmp_analytics', JSON.stringify(this.data));
    } catch (error) {
      console.error('Failed to save analytics data:', error);
    }
  }

  trimData() {
    this.data.sessions = Array.isArray(this.data.sessions)
      ? this.data.sessions.slice(-ANALYTICS_LIMITS.sessions)
      : [];

    this.data.sessions.forEach(session => {
      if (Array.isArray(session.activities) && session.activities.length > ANALYTICS_LIMITS.activitiesPerSession) {
        session.activities = session.activities.slice(-ANALYTICS_LIMITS.activitiesPerSession);
      }
    });

    if (Array.isArray(this.data.achievements)) {
      const uniqueAchievements = [...new Set(this.data.achievements)];
      this.data.achievements = uniqueAchievements.slice(-ANALYTICS_LIMITS.achievements);
    } else {
      this.data.achievements = [];
    }

    if (this.data.dailyStats && typeof this.data.dailyStats === 'object') {
      const dailyKeys = Object.keys(this.data.dailyStats).sort();
      if (dailyKeys.length > ANALYTICS_LIMITS.dailyStatsDays) {
        const keysToDrop = dailyKeys.slice(0, dailyKeys.length - ANALYTICS_LIMITS.dailyStatsDays);
        keysToDrop.forEach(key => delete this.data.dailyStats[key]);
      }
    } else {
      this.data.dailyStats = {};
    }
  }

  /**
   * Track session start
   */
  startSession() {
    const session = {
      id: Date.now(),
      startTime: new Date().toISOString(),
      endTime: null,
      duration: 0,
      tasksCompleted: 0,
      xpEarned: 0,
      activities: []
    };

    this.data.sessions.push(session);
    this.trimData();
    this.currentSession = session;
    this.saveAnalyticsData();
  }

  /**
   * Track session end
   */
  endSession(forceSave = false) {
    if (!this.currentSession) return;

    this.currentSession.endTime = new Date().toISOString();
    this.currentSession.duration = Math.round(
      (new Date(this.currentSession.endTime) - new Date(this.currentSession.startTime)) / 60000
    );

    this.updateDailyStats(this.currentSession);
    this.updateStudyPatterns();
    this.saveAnalyticsData(forceSave);
  }

  /**
   * Track activity (learn, flashcard, quiz)
   */
  trackActivity(type, details = {}) {
    if (!this.currentSession) {
      this.startSession();
    }

    const activity = {
      type,
      timestamp: new Date().toISOString(),
      ...details
    };

    this.currentSession.activities.push(activity);
    if (this.currentSession.activities.length > ANALYTICS_LIMITS.activitiesPerSession) {
      this.currentSession.activities = this.currentSession.activities.slice(-ANALYTICS_LIMITS.activitiesPerSession);
    }

    // Update totals
    switch (type) {
      case 'learn_completed':
        this.data.totalStats.learnPhasesCompleted++;
        break;
      case 'flashcard_completed':
        this.data.totalStats.flashcardSessionsCompleted++;
        break;
      case 'quiz_passed':
        this.data.totalStats.quizzesPassed++;
        break;
      case 'quiz_failed':
        this.data.totalStats.quizzesFailed++;
        break;
      case 'task_completed':
        this.data.totalStats.tasksCompleted++;
        this.currentSession.tasksCompleted++;
        break;
    }

    if (details.xpEarned) {
      this.data.totalStats.totalXPEarned += details.xpEarned;
      this.currentSession.xpEarned += details.xpEarned;
    }

    this.saveAnalyticsData();
  }

  /**
   * Update daily statistics
   */
  updateDailyStats(session) {
    const date = new Date(session.startTime).toISOString().split('T')[0];

    if (!this.data.dailyStats[date]) {
      this.data.dailyStats[date] = {
        sessions: 0,
        duration: 0,
        xpEarned: 0,
        tasksCompleted: 0
      };
    }

    this.data.dailyStats[date].sessions++;
    this.data.dailyStats[date].duration += session.duration;
    this.data.dailyStats[date].xpEarned += session.xpEarned;
    this.data.dailyStats[date].tasksCompleted += session.tasksCompleted;

    this.updateStreak();
  }

  /**
   * Update study streak
   */
  updateStreak() {
    const dates = Object.keys(this.data.dailyStats).sort().reverse();
    if (dates.length === 0) return;

    let streak = 0;
    const today = new Date().toISOString().split('T')[0];
    let currentDate = new Date(today);

    for (let i = 0; i < dates.length; i++) {
      const dateStr = currentDate.toISOString().split('T')[0];

      if (this.data.dailyStats[dateStr]) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        break;
      }
    }

    this.data.totalStats.streakDays = streak;
    this.data.totalStats.longestStreak = Math.max(
      this.data.totalStats.longestStreak,
      streak
    );
  }

  /**
   * Analyze study patterns
   */
  updateStudyPatterns() {
    // Time of day preference
    const timeOfDayCounts = { morning: 0, afternoon: 0, evening: 0, night: 0 };

    this.data.sessions.forEach(session => {
      const hour = new Date(session.startTime).getHours();
      if (hour >= 6 && hour < 12) timeOfDayCounts.morning++;
      else if (hour >= 12 && hour < 17) timeOfDayCounts.afternoon++;
      else if (hour >= 17 && hour < 21) timeOfDayCounts.evening++;
      else timeOfDayCounts.night++;
    });

    this.data.studyPatterns.preferredTimeOfDay = Object.entries(timeOfDayCounts)
      .sort((a, b) => b[1] - a[1])[0][0];

    // Average session length
    const totalDuration = this.data.sessions.reduce((sum, s) => sum + s.duration, 0);
    this.data.studyPatterns.averageSessionLength = Math.round(
      totalDuration / this.data.sessions.length
    );

    // Most productive day of week
    const dayOfWeekCounts = {};
    Object.entries(this.data.dailyStats).forEach(([date, stats]) => {
      const day = new Date(date).getDay();
      const dayName = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][day];

      if (!dayOfWeekCounts[dayName]) {
        dayOfWeekCounts[dayName] = { sessions: 0, xp: 0 };
      }

      dayOfWeekCounts[dayName].sessions += stats.sessions;
      dayOfWeekCounts[dayName].xp += stats.xpEarned;
    });

    this.data.studyPatterns.mostProductiveDayOfWeek = Object.entries(dayOfWeekCounts)
      .sort((a, b) => b[1].xp - a[1].xp)[0]?.[0] || null;
  }

  /**
   * Get last 7 days statistics
   */
  getLast7Days() {
    const last7Days = [];
    const today = new Date();

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];

      last7Days.push({
        date: dateStr,
        dayName: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][date.getDay()],
        stats: this.data.dailyStats[dateStr] || { sessions: 0, duration: 0, xpEarned: 0, tasksCompleted: 0 }
      });
    }

    return last7Days;
  }

  /**
   * Render analytics dashboard HTML
   */
  renderDashboard() {
    const last7Days = this.getLast7Days();
    const totalXP = this.data.totalStats.totalXPEarned;
    const tasksCompleted = this.data.totalStats.tasksCompleted;
    const streakDays = this.data.totalStats.streakDays;
    const quizPassRate = this.data.totalStats.quizzesPassed + this.data.totalStats.quizzesFailed > 0
      ? Math.round((this.data.totalStats.quizzesPassed / (this.data.totalStats.quizzesPassed + this.data.totalStats.quizzesFailed)) * 100)
      : 0;

    return `
      <div class="analytics-dashboard" style="max-width: 1200px; margin: 0 auto; padding: var(--space-xl);">
        <!-- Header -->
        <div style="margin-bottom: var(--space-2xl);">
          <h2 style="font-size: var(--font-size-3xl); color: var(--color-primary-blue); margin-bottom: var(--space-sm);">
            📊 Your Learning Analytics
          </h2>
          <p style="color: var(--color-text-secondary);">
            Track your progress, identify patterns, and celebrate achievements
          </p>
        </div>

        <!-- Key Metrics -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: var(--space-lg); margin-bottom: var(--space-2xl);">
          <div class="card" style="text-align: center; padding: var(--space-xl); background: linear-gradient(135deg, #DBEAFE, white); border: 2px solid var(--color-primary-blue);">
            <div style="font-size: 3rem; margin-bottom: var(--space-sm);">⭐</div>
            <div style="font-size: var(--font-size-3xl); font-weight: bold; color: var(--color-primary-blue);">${totalXP}</div>
            <div style="color: var(--color-text-secondary); margin-top: var(--space-xs);">Total XP Earned</div>
          </div>

          <div class="card" style="text-align: center; padding: var(--space-xl); background: linear-gradient(135deg, #D1FAE5, white); border: 2px solid var(--color-trust-green);">
            <div style="font-size: 3rem; margin-bottom: var(--space-sm);">✅</div>
            <div style="font-size: var(--font-size-3xl); font-weight: bold; color: var(--color-trust-green);">${tasksCompleted}</div>
            <div style="color: var(--color-text-secondary); margin-top: var(--space-xs);">Tasks Completed</div>
          </div>

          <div class="card" style="text-align: center; padding: var(--space-xl); background: linear-gradient(135deg, #FEF3C7, white); border: 2px solid var(--color-accent-gold);">
            <div style="font-size: 3rem; margin-bottom: var(--space-sm);">🔥</div>
            <div style="font-size: var(--font-size-3xl); font-weight: bold; color: var(--color-accent-gold);">${streakDays}</div>
            <div style="color: var(--color-text-secondary); margin-top: var(--space-xs);">Day Streak</div>
          </div>

          <div class="card" style="text-align: center; padding: var(--space-xl); background: linear-gradient(135deg, #EDE9FE, white); border: 2px solid #8B5CF6;">
            <div style="font-size: 3rem; margin-bottom: var(--space-sm);">🎯</div>
            <div style="font-size: var(--font-size-3xl); font-weight: bold; color: #8B5CF6;">${quizPassRate}%</div>
            <div style="color: var(--color-text-secondary); margin-top: var(--space-xs);">Quiz Pass Rate</div>
          </div>
        </div>

        <!-- Weekly Activity Chart -->
        <div class="card" style="padding: var(--space-xl); margin-bottom: var(--space-2xl);">
          <h3 style="margin-bottom: var(--space-lg);">📈 Last 7 Days Activity</h3>
          <div style="display: flex; justify-content: space-around; align-items: flex-end; height: 200px; gap: var(--space-sm);">
            ${last7Days.map(day => {
              const maxXP = Math.max(...last7Days.map(d => d.stats.xpEarned), 100);
              const height = (day.stats.xpEarned / maxXP) * 100;

              return `
                <div style="flex: 1; display: flex; flex-direction: column; align-items: center; gap: var(--space-xs);">
                  <div style="font-size: var(--font-size-sm); font-weight: bold; color: var(--color-primary-blue);">
                    ${day.stats.xpEarned > 0 ? `${day.stats.xpEarned} XP` : ''}
                  </div>
                  <div style="
                    width: 100%;
                    height: ${height}%;
                    min-height: ${day.stats.xpEarned > 0 ? '10px' : '0'};
                    background: linear-gradient(180deg, var(--color-primary-blue), var(--color-trust-green));
                    border-radius: var(--radius-md) var(--radius-md) 0 0;
                    transition: background-color 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease, transform 0.3s ease, width 0.3s ease, height 0.3s ease, opacity 0.3s ease;
                  "></div>
                  <div style="font-size: var(--font-size-sm); color: var(--color-text-secondary); font-weight: var(--font-weight-semibold);">
                    ${day.dayName}
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <!-- Study Patterns -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: var(--space-lg); margin-bottom: var(--space-2xl);">
          <div class="card" style="padding: var(--space-xl);">
            <h4 style="margin-bottom: var(--space-md); display: flex; align-items: center; gap: var(--space-sm);">
              <span style="font-size: 1.5rem;">🌅</span> Study Time Preference
            </h4>
            <p style="font-size: var(--font-size-lg); font-weight: bold; color: var(--color-primary-blue); text-transform: capitalize;">
              ${this.data.studyPatterns.preferredTimeOfDay || 'Not enough data'}
            </p>
            <p style="font-size: var(--font-size-sm); color: var(--color-text-secondary); margin-top: var(--space-xs);">
              You study most during ${this.data.studyPatterns.preferredTimeOfDay} hours
            </p>
          </div>

          <div class="card" style="padding: var(--space-xl);">
            <h4 style="margin-bottom: var(--space-md); display: flex; align-items: center; gap: var(--space-sm);">
              <span style="font-size: 1.5rem;">⏱️</span> Average Session
            </h4>
            <p style="font-size: var(--font-size-lg); font-weight: bold; color: var(--color-primary-blue);">
              ${this.data.studyPatterns.averageSessionLength || 0} minutes
            </p>
            <p style="font-size: var(--font-size-sm); color: var(--color-text-secondary); margin-top: var(--space-xs);">
              Your typical study session length
            </p>
          </div>

          <div class="card" style="padding: var(--space-xl);">
            <h4 style="margin-bottom: var(--space-md); display: flex; align-items: center; gap: var(--space-sm);">
              <span style="font-size: 1.5rem;">📅</span> Most Productive Day
            </h4>
            <p style="font-size: var(--font-size-lg); font-weight: bold; color: var(--color-primary-blue);">
              ${this.data.studyPatterns.mostProductiveDayOfWeek || 'Not enough data'}
            </p>
            <p style="font-size: var(--font-size-sm); color: var(--color-text-secondary); margin-top: var(--space-xs);">
              Your highest XP earning day
            </p>
          </div>
        </div>

        <!-- Detailed Stats -->
        <div class="card" style="padding: var(--space-xl);">
          <h3 style="margin-bottom: var(--space-lg);">📋 Detailed Statistics</h3>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: var(--space-lg);">
            <div>
              <div style="color: var(--color-text-secondary); margin-bottom: var(--space-xs);">Learn Phases</div>
              <div style="font-size: var(--font-size-xl); font-weight: bold;">${this.data.totalStats.learnPhasesCompleted}</div>
            </div>
            <div>
              <div style="color: var(--color-text-secondary); margin-bottom: var(--space-xs);">Flashcard Sessions</div>
              <div style="font-size: var(--font-size-xl); font-weight: bold;">${this.data.totalStats.flashcardSessionsCompleted}</div>
            </div>
            <div>
              <div style="color: var(--color-text-secondary); margin-bottom: var(--space-xs);">Quizzes Passed</div>
              <div style="font-size: var(--font-size-xl); font-weight: bold; color: var(--color-trust-green);">${this.data.totalStats.quizzesPassed}</div>
            </div>
            <div>
              <div style="color: var(--color-text-secondary); margin-bottom: var(--space-xs);">Longest Streak</div>
              <div style="font-size: var(--font-size-xl); font-weight: bold; color: var(--color-accent-gold);">${this.data.totalStats.longestStreak} days</div>
            </div>
          </div>
        </div>
      </div>
    `;
  }
}

// Create singleton instance
const analyticsDashboard = new AnalyticsDashboard();

// Auto-track session on page load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    analyticsDashboard.startSession();
  });
} else {
  analyticsDashboard.startSession();
}

// Auto-end session before page unload
window.addEventListener('beforeunload', () => {
  analyticsDashboard.endSession(true);
});

// Export for use in other modules
window.analyticsDashboard = analyticsDashboard;

export default analyticsDashboard;

console.log('Analytics dashboard loaded ✅');
