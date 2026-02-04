/**
 * missions.js - Mission Logic & Management
 *
 * Purpose: Handles all mission-related logic including loading mission data,
 * tracking completion, and managing unlock conditions.
 *
 * Responsibilities:
 * - Load missions from data/missions.json
 * - Check mission unlock conditions
 * - Calculate mission completion percentage
 * - Track task completion within missions
 * - Award XP and badges on mission completion
 *
 * Data Structure:
 * - 7 missions (m1-m7)
 * - 35 tasks across domains (d1t1-d1t14, d2t1-d2t17, d3t1-d3t4)
 * - Progress tracking per task
 */

import state from './state.js';
import gamification, { XP_REWARDS } from './gamification.js';

/**
 * Mission Manager Class
 * Handles mission tracking, completion, and unlocking
 */
class MissionManager {
  constructor() {
    this.missions = null;
  }

  /**
   * Initialize mission manager with mission data
   * @param {Array} missionData - Mission data from JSON
   */
  init(missionData) {
    this.missions = missionData;
    console.log(`Mission manager initialized with ${missionData.length} missions`);
  }

  /**
   * Get all missions
   * @returns {Array} All missions
   */
  getAllMissions() {
    return this.missions || [];
  }

  /**
   * Get mission by ID
   * @param {string} missionId - Mission ID (e.g., 'm1')
   * @returns {Object} Mission object
   */
  getMission(missionId) {
    if (!this.missions) return null;
    return this.missions.find(m => m.id === missionId);
  }

  /**
   * Helper: Get tasks array from mission (handles both "tasks" and "topics")
   * @param {Object} mission - Mission object
   * @returns {Array} Tasks/topics array
   */
  getMissionTasksArray(mission) {
    return mission.tasks || mission.topics || [];
  }

  /**
   * Get task by ID
   * @param {string} taskId - Task ID (e.g., 'd1t1')
   * @returns {Object} Task object with parent mission
   */
  getTask(taskId) {
    if (!this.missions) return null;

    for (const mission of this.missions) {
      const tasks = this.getMissionTasksArray(mission);
      const task = tasks.find(t => t.id === taskId);
      if (task) {
        return {
          ...task,
          missionId: mission.id,
          missionName: mission.name
        };
      }
    }

    return null;
  }

  /**
   * Check if mission is unlocked
   * @param {string} missionId - Mission ID
   * @returns {boolean} True if unlocked
   */
  isMissionUnlocked(missionId) {
    const mission = this.getMission(missionId);
    if (!mission) return false;

    const currentLevel = state.get('progress.level');
    return currentLevel >= (mission.unlockLevel || 1);
  }

  /**
   * Check if task is completed
   * @param {string} taskId - Task ID
   * @returns {boolean} True if completed
   */
  isTaskCompleted(taskId) {
    const completedTopics = state.get('progress.completedTopics') || [];
    return completedTopics.includes(taskId);
  }

  /**
   * Check if mission is completed
   * @param {string} missionId - Mission ID
   * @returns {boolean} True if completed
   */
  isMissionCompleted(missionId) {
    const completedMissions = state.get('progress.completedMissions') || [];
    return completedMissions.includes(missionId);
  }

  /**
   * Get mission completion percentage
   * @param {string} missionId - Mission ID
   * @returns {number} Completion percentage (0-100)
   */
  getMissionProgress(missionId) {
    const mission = this.getMission(missionId);
    if (!mission) return 0;

    const tasks = this.getMissionTasksArray(mission);
    if (tasks.length === 0) return 0;

    const completedTopics = state.get('progress.completedTopics') || [];
    const completedCount = tasks.filter(t =>
      completedTopics.includes(t.id)
    ).length;

    return Math.round((completedCount / tasks.length) * 100);
  }

  /**
   * Get completed task count for mission
   * @param {string} missionId - Mission ID
   * @returns {Object} { completed, total }
   */
  getMissionTaskCounts(missionId) {
    const mission = this.getMission(missionId);
    if (!mission) return { completed: 0, total: 0 };

    const tasks = this.getMissionTasksArray(mission);
    const completedTopics = state.get('progress.completedTopics') || [];
    const completed = tasks.filter(t =>
      completedTopics.includes(t.id)
    ).length;

    return {
      completed,
      total: tasks.length
    };
  }

  /**
   * Complete a task
   * @param {string} taskId - Task ID
   * @returns {Object} Result with mission completion info
   */
  completeTask(taskId) {
    // Mark task as completed
    state.completeTopic(taskId);

    // Award XP
    gamification.awardXP(XP_REWARDS.COMPLETE_TOPIC);

    // Get parent mission
    const task = this.getTask(taskId);
    if (!task) return { taskCompleted: true };

    // Check if mission is now complete
    const progress = this.getMissionProgress(task.missionId);
    const missionCompleted = progress === 100;

    if (missionCompleted && !this.isMissionCompleted(task.missionId)) {
      this.completeMission(task.missionId);
    }

    return {
      taskCompleted: true,
      missionCompleted,
      missionId: task.missionId,
      progress
    };
  }

  /**
   * Complete a mission
   * @param {string} missionId - Mission ID
   */
  completeMission(missionId) {
    const mission = this.getMission(missionId);
    if (!mission) return;

    // Mark mission as completed
    state.completeMission(missionId);

    // Award mission completion XP
    gamification.awardXP(XP_REWARDS.COMPLETE_MISSION);

    // Check for first mission achievement
    const completedMissions = state.get('progress.completedMissions');
    if (completedMissions.length === 1) {
      gamification.unlockAchievement('first_mission_complete');
    }

    // Check for domain mastery achievements
    this.checkDomainMastery();

    console.log(`Mission ${missionId} completed!`);
  }

  /**
   * Check and unlock domain mastery achievements
   */
  checkDomainMastery() {
    const completedMissions = state.get('progress.completedMissions');

    // People domain: missions 1-4 (m1, m2, m3, m4)
    const peopleMissions = ['m1', 'm2', 'm3', 'm4'];
    if (peopleMissions.every(m => completedMissions.includes(m))) {
      gamification.unlockAchievement('people_master');
    }

    // Process domain: mission 5 (m5)
    if (completedMissions.includes('m5')) {
      gamification.unlockAchievement('process_master');
    }

    // Business domain: missions 6-7 (m6, m7)
    const businessMissions = ['m6', 'm7'];
    if (businessMissions.every(m => completedMissions.includes(m))) {
      gamification.unlockAchievement('business_master');
    }
  }

  /**
   * Get tasks for a mission
   * @param {string} missionId - Mission ID
   * @returns {Array} Tasks
   */
  getMissionTasks(missionId) {
    const mission = this.getMission(missionId);
    return mission?.tasks || [];
  }

  /**
   * Get next uncompleted task in mission
   * @param {string} missionId - Mission ID
   * @returns {Object} Next task or null
   */
  getNextTask(missionId) {
    const tasks = this.getMissionTasks(missionId);
    const completedTopics = state.get('progress.completedTopics') || [];

    return tasks.find(t => !completedTopics.includes(t.id)) || null;
  }

  /**
   * Get available (unlocked, uncompleted) missions
   * @returns {Array} Available missions
   */
  getAvailableMissions() {
    if (!this.missions) return [];

    const currentLevel = state.get('progress.level');
    const completedMissions = state.get('progress.completedMissions') || [];

    return this.missions.filter(mission => {
      const isUnlocked = currentLevel >= (mission.unlockLevel || 1);
      const isCompleted = completedMissions.includes(mission.id);
      return isUnlocked && !isCompleted;
    });
  }

  /**
   * Get completed missions
   * @returns {Array} Completed missions
   */
  getCompletedMissions() {
    if (!this.missions) return [];

    const completedMissions = state.get('progress.completedMissions') || [];
    return this.missions.filter(m => completedMissions.includes(m.id));
  }

  /**
   * Get locked missions
   * @returns {Array} Locked missions
   */
  getLockedMissions() {
    if (!this.missions) return [];

    const currentLevel = state.get('progress.level');
    return this.missions.filter(m => currentLevel < (m.unlockLevel || 1));
  }

  /**
   * Get overall progress statistics
   * @returns {Object} Progress stats
   */
  getOverallProgress() {
    if (!this.missions) {
      return {
        totalMissions: 0,
        completedMissions: 0,
        totalTasks: 0,
        completedTasks: 0,
        overallProgress: 0
      };
    }

    const completedMissions = state.get('progress.completedMissions') || [];
    const completedTopics = state.get('progress.completedTopics') || [];

    const totalMissions = this.missions.length;
    const totalTasks = this.missions.reduce((sum, m) => sum + (m.tasks?.length || 0), 0);

    return {
      totalMissions,
      completedMissions: completedMissions.length,
      missionProgress: Math.round((completedMissions.length / totalMissions) * 100),
      totalTasks,
      completedTasks: completedTopics.length,
      taskProgress: Math.round((completedTopics.length / totalTasks) * 100),
      overallProgress: Math.round((completedTopics.length / totalTasks) * 100)
    };
  }

  /**
   * Get domain progress breakdown
   * @returns {Object} Progress by domain
   */
  getDomainProgress() {
    if (!this.missions) return {};

    const completedTopics = state.get('progress.completedTopics') || [];

    const domains = {
      people: { name: 'People', missions: [], tasks: 0, completed: 0 },
      process: { name: 'Process', missions: [], tasks: 0, completed: 0 },
      business: { name: 'Business Environment', missions: [], tasks: 0, completed: 0 }
    };

    this.missions.forEach(mission => {
      const domain = mission.domain?.toLowerCase();
      if (!domains[domain]) return;

      const tasks = this.getMissionTasksArray(mission);

      domains[domain].missions.push(mission.id);
      domains[domain].tasks += tasks.length;

      const missionCompleted = tasks.filter(t =>
        completedTopics.includes(t.id)
      ).length;

      domains[domain].completed += missionCompleted;
    });

    // Calculate percentages
    Object.keys(domains).forEach(key => {
      domains[key].progress = domains[key].tasks > 0
        ? Math.round((domains[key].completed / domains[key].tasks) * 100)
        : 0;
    });

    return domains;
  }

  /**
   * Get recommended next task
   * @returns {Object} Recommended task
   */
  getRecommendedTask() {
    const availableMissions = this.getAvailableMissions();

    if (availableMissions.length === 0) {
      return null;
    }

    // Get mission with lowest progress
    const missionWithProgress = availableMissions.map(m => ({
      mission: m,
      progress: this.getMissionProgress(m.id)
    }));

    missionWithProgress.sort((a, b) => a.progress - b.progress);

    const recommendedMission = missionWithProgress[0].mission;
    const nextTask = this.getNextTask(recommendedMission.id);

    return nextTask ? {
      ...nextTask,
      missionId: recommendedMission.id,
      missionName: recommendedMission.name
    } : null;
  }
}

// Create and export singleton instance
const missionManager = new MissionManager();

// Make available globally
if (typeof window !== 'undefined') {
  window.PMP_MISSIONS = missionManager;
}

export default missionManager;
