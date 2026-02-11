/**
 * Enhanced MVE Renderer
 * Renders Enhanced MVE learn content - supports both paginated and full view
 */

import { escapeHTML, escapeInlineHandlerArg, setSafeInnerHTML } from './security.js';

function safeActionArg(value) {
  return escapeInlineHandlerArg(value);
}

// Section configuration
const LEARN_SECTIONS = [
  { id: 0, name: 'Quick Scenario Challenge', icon: '⚡', key: 'quickScenarioChallenge', renderer: 'renderQuickScenarioChallenge' },
  { id: 1, name: 'Aha Moment Debrief', icon: '💡', key: 'ahaDebrief', renderer: 'renderAhaDebrief' },
  { id: 2, name: 'Core Framework', icon: '🎯', key: 'coreFramework', renderer: 'renderCoreFramework' },
  { id: 3, name: 'Visual Reference', icon: '📐', key: 'visualReferenceCard', renderer: 'renderVisualReferenceCard' },
  { id: 4, name: 'Second Scenario', icon: '🎬', key: 'secondScenario', renderer: 'renderSecondScenario' },
  { id: 5, name: 'PM Wisdom', icon: '🧠', key: 'pmWisdom', renderer: 'renderPMWisdom' },
  { id: 6, name: 'Personal Application', icon: '✍️', key: 'personalApplication', renderer: 'renderPersonalApplication' },
  { id: 7, name: 'Memory Palace', icon: '🏛️', key: 'memoryPalace', renderer: 'renderMemoryPalace' },
  { id: 8, name: 'Spaced Repetition', icon: '🔄', key: 'spacedRepetition', renderer: 'renderSpacedRepetition' },
  { id: 9, name: 'Mission Checklist', icon: '✅', key: 'missionChecklist', renderer: 'renderMissionChecklist' }
];

// Main renderer - supports pagination
function renderEnhancedMVE(taskId, content, taskData, options = {}) {
  if (!content) {
    console.error(`No Enhanced MVE content found for ${taskId}`);
    return renderFallbackContent(taskId);
  }

  const { sectionIndex = null, paginated = false } = options;

  // Paginated mode - render single section with navigation
  if (paginated && sectionIndex !== null) {
    return renderPaginatedSection(taskId, content, taskData, sectionIndex);
  }

  // Full mode - render all sections (original behavior)
  return `
    <div class="enhanced-mve-container">
      ${renderQuickScenarioChallenge(taskId, content.quickScenarioChallenge)}
      ${renderAhaDebrief(content.ahaDebrief)}
      ${renderCoreFramework(content.coreFramework)}
      ${renderVisualReferenceCard(taskId, content.visualReferenceCard)}
      ${renderSecondScenario(taskId, content.secondScenario)}
      ${renderPMWisdom(content.pmWisdom)}
      ${renderPersonalApplication(taskId, content.personalApplication)}
      ${renderMemoryPalace(content.memoryPalace)}
      ${renderSpacedRepetition(taskId, content.spacedRepetition)}
      ${renderMissionChecklist(taskId, content.missionChecklist)}
    </div>
  `;
}

// Render paginated section with navigation
function renderPaginatedSection(taskId, content, taskData, sectionIndex) {
  const totalSections = LEARN_SECTIONS.length;
  const currentSection = LEARN_SECTIONS[sectionIndex];
  const progressPercent = Math.round(((sectionIndex + 1) / totalSections) * 100);

  // Estimate time remaining (avg 1.5 min per section)
  const sectionsRemaining = totalSections - sectionIndex - 1;
  const timeRemaining = Math.ceil(sectionsRemaining * 1.5);

  // Get section content
  let sectionContent = '';

  // Call appropriate renderer
  const contentKey = currentSection.key;
  const sectionData = content[contentKey];

  switch(currentSection.renderer) {
    case 'renderQuickScenarioChallenge':
      sectionContent = renderQuickScenarioChallenge(taskId, sectionData);
      break;
    case 'renderAhaDebrief':
      sectionContent = renderAhaDebrief(sectionData);
      break;
    case 'renderCoreFramework':
      sectionContent = renderCoreFramework(sectionData);
      break;
    case 'renderVisualReferenceCard':
      sectionContent = renderVisualReferenceCard(taskId, sectionData);
      break;
    case 'renderSecondScenario':
      sectionContent = renderSecondScenario(taskId, sectionData);
      break;
    case 'renderPMWisdom':
      sectionContent = renderPMWisdom(sectionData);
      break;
    case 'renderPersonalApplication':
      sectionContent = renderPersonalApplication(taskId, sectionData);
      break;
    case 'renderMemoryPalace':
      sectionContent = renderMemoryPalace(sectionData);
      break;
    case 'renderSpacedRepetition':
      sectionContent = renderSpacedRepetition(taskId, sectionData);
      break;
    case 'renderMissionChecklist':
      sectionContent = renderMissionChecklist(taskId, sectionData);
      break;
    default:
      sectionContent = '<p>Section content not available</p>';
  }

  return `
    <div class="enhanced-mve-container paginated">
      <!-- Section Progress Header -->
      <div class="section-progress-header" style="position: sticky; top: 0; z-index: 100; background: white; padding: var(--space-lg); border-bottom: 2px solid var(--color-gray-200); box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-md);">
          <div>
            <div style="font-size: var(--font-size-sm); color: var(--color-text-secondary); margin-bottom: var(--space-xs);">
              Section ${sectionIndex + 1} of ${totalSections}
            </div>
            <h3 style="margin: 0; font-size: var(--font-size-xl); color: var(--color-primary-blue); display: flex; align-items: center; gap: var(--space-sm);">
              <span style="font-size: 1.5rem;">${currentSection.icon}</span>
              ${currentSection.name}
            </h3>
          </div>
          <div style="text-align: right;">
            <div style="font-size: var(--font-size-lg); font-weight: bold; color: var(--color-primary-blue);">
              ${progressPercent}%
            </div>
            <div style="font-size: var(--font-size-xs); color: var(--color-text-muted);">
              ${timeRemaining > 0 ? `~${timeRemaining} min left` : 'Almost done!'}
            </div>
          </div>
        </div>

        <!-- Progress Bar -->
        <div style="height: 8px; background: var(--color-gray-200); border-radius: var(--radius-full); overflow: hidden;">
          <div style="height: 100%; width: ${progressPercent}%; background: linear-gradient(90deg, var(--color-primary-blue), var(--color-trust-green)); border-radius: var(--radius-full); transition: width 0.5s ease;"></div>
        </div>
      </div>

      <!-- Section Content -->
      <div class="section-content" style="padding: var(--space-md); max-width: 100%; margin: 0; padding-bottom: 100px;">
        ${sectionContent}
      </div>

      <!-- Section Navigation Footer -->
      <div class="section-navigation-footer" style="position: sticky; bottom: 0; left: 0; right: 0; background: white; padding: var(--space-md); border-top: 2px solid var(--color-gray-200); box-shadow: 0 -2px 8px rgba(0,0,0,0.1); z-index: 1040;" data-version="fixed-v2">
        <div style="max-width: 100%; margin: 0; display: flex; justify-content: space-between; align-items: center; gap: var(--space-sm);">
          ${sectionIndex > 0 ? `
            <button class="btn btn-outline" onclick="navigateToSection('${safeActionArg(taskId)}', ${sectionIndex - 1})" style="flex: 1; max-width: 48%; min-height: 48px;">
              ← Previous
            </button>
          ` : `
            <button class="btn btn-outline" onclick="router.navigate('/task/${encodeURIComponent(taskId)}')" style="flex: 1; max-width: 48%; min-height: 48px;">
              ← Overview
            </button>
          `}

          <div style="text-align: center; flex: 1; display: none;" class="nav-middle-text">
            <div style="font-size: var(--font-size-sm); color: var(--color-text-secondary);">
              ${sectionIndex < totalSections - 1
                ? `Next: ${LEARN_SECTIONS[sectionIndex + 1].icon} ${LEARN_SECTIONS[sectionIndex + 1].name}`
                : '🎉 Ready to complete!'}
            </div>
          </div>

          ${sectionIndex < totalSections - 1 ? `
            <button class="btn btn-primary" onclick="navigateToSection('${safeActionArg(taskId)}', ${sectionIndex + 1})" style="flex: 1; max-width: 48%; min-height: 48px;">
              Next →
            </button>
          ` : `
            <button class="btn btn-primary" onclick="completeLearnPhase('${safeActionArg(taskId)}')" style="flex: 1; max-width: 48%; min-height: 48px; background: linear-gradient(135deg, var(--color-trust-green), #059669); color: white;">
              Complete ✓
            </button>
          `}
        </div>
      </div>

      <!-- Section indicator dots (mobile/visual feedback) -->
      <div class="section-dots" style="position: fixed; right: var(--space-lg); top: 50%; transform: translateY(-50%); display: flex; flex-direction: column; gap: var(--space-xs); z-index: 50;">
        ${LEARN_SECTIONS.map((section, idx) => `
          <div
            onclick="navigateToSection('${safeActionArg(taskId)}', ${idx})"
            title="${section.name}"
            style="
              width: ${idx === sectionIndex ? '12px' : '8px'};
              height: ${idx === sectionIndex ? '12px' : '8px'};
              border-radius: 50%;
              background: ${idx === sectionIndex ? 'var(--color-primary-blue)' : 'var(--color-gray-300)'};
              cursor: pointer;
              transition: width 0.3s ease, height 0.3s ease, background-color 0.3s ease, transform 0.3s ease;
              ${idx < sectionIndex ? 'background: var(--color-trust-green);' : ''}
            "
          ></div>
        `).join('')}
      </div>
    </div>
  `;
}

// Section 1: Quick Scenario Challenge
function renderQuickScenarioChallenge(taskId, scenario) {
  if (!scenario) return '';

  return `
    <div class="scenario-challenge">
      <div class="challenge-header">
        <h4>⚡ Quick Challenge: Can you solve this?</h4>
        <p class="challenge-subtitle">${scenario.challengeSubtitle || "Don't worry if you get it wrong—that's how you learn!"}</p>
      </div>

      <div class="scenario-story">
        <p><strong>The Situation:</strong></p>
        <p>${scenario.scenarioStory}</p>
        <p><strong>What should you do ${scenario.question || 'FIRST'}?</strong></p>
      </div>

      <form class="scenario-quiz" id="scenario-1-${taskId}">
        ${Object.entries(scenario.options).map(([key, option]) => `
          <label class="quiz-option">
            <input type="radio" name="answer-1" value="${key}">
            <span class="option-text">
              <strong>${key}.</strong> ${typeof option === 'string' ? option : option.text}
            </span>
          </label>
        `).join('')}

        <button type="button" class="btn btn-primary" onclick="checkScenarioAnswer('scenario-1-${safeActionArg(taskId)}', '${safeActionArg(scenario.correctAnswer)}', '${safeActionArg(taskId)}')">
          Check My Answer
        </button>
      </form>

      <div class="answer-feedback" id="feedback-scenario-1-${taskId}" style="display:none;">
        <!-- Filled by JavaScript after user answers -->
      </div>
    </div>
  `;
}

// Section 2: "Aha!" Debrief
function renderAhaDebrief(debrief) {
  if (!debrief) return '';

  return `
    <div class="aha-debrief">
      <div class="correct-answer-box">
        <h4>✅ The Answer: ${debrief.correctAnswer}</h4>
      </div>

      <div class="why-section">
        <h5>🤔 Why is this the PMI way?</h5>
        <ul class="insight-list">
          ${debrief.whySection?.insights?.map(insight => `
            <li>
              <strong>${insight.principle}</strong>: ${insight.explanation}
              ${insight.pmbokSupport ? `<br><em class="pmbok-support">"${insight.pmbokSupport}"</em>` : ''}
            </li>
          `).join('') || ''}
        </ul>
      </div>

      ${debrief.trapSection ? `
        <div class="trap-section">
          <h5>⚠️ Why the others are traps</h5>
          <div class="trap-explanation">
            <p>${debrief.trapSection.explanation}</p>
            ${debrief.trapSection.trapTable ? `
              <table class="trap-table">
                <tr>
                  <th>Option</th>
                  <th>Violation</th>
                  <th>PMI Value Broken</th>
                </tr>
                ${debrief.trapSection.trapTable.map(trap => `
                  <tr>
                    <td>${trap.option}</td>
                    <td>${trap.violation}</td>
                    <td>${trap.pmiValueBroken}</td>
                  </tr>
                `).join('')}
              </table>
            ` : ''}
          </div>
        </div>
      ` : ''}

      ${debrief.patternRecognition ? `
        <div class="pattern-recognition">
          <h5>🎯 The Pattern You'll See Again</h5>
          <div class="pattern-box">
            <p>When you see ${debrief.patternRecognition.scenario || 'similar scenarios'}, ask yourself:</p>
            <ul>
              ${debrief.patternRecognition.checklist?.map(item => `<li>${item}</li>`).join('') || ''}
            </ul>
            <p class="pattern-rule">${debrief.patternRecognition.patternRule}</p>
          </div>
        </div>
      ` : ''}
    </div>
  `;
}

// Section 3: Core Framework
function renderCoreFramework(framework) {
  if (!framework) return '';

  return `
    <div class="core-framework">
      <h4>🧠 ${framework.frameworkName}</h4>

      ${framework.frameworkIntro ? `
        <div class="framework-intro">
          <p>${framework.frameworkIntro}</p>
        </div>
      ` : ''}

      ${framework.frameworkTable ? renderFrameworkTable(framework.frameworkTable) : ''}

      ${framework.additionalContent ? `
        <div class="framework-additional">
          ${typeof framework.additionalContent === 'string' ?
            framework.additionalContent :
            renderAdditionalContent(framework.additionalContent)}
        </div>
      ` : ''}

      ${framework.pmbokConnection ? `
        <div class="pmbok-connection">
          <h5>📘 PMBOK Connection</h5>
          <p><strong>Performance Domain:</strong> ${framework.pmbokConnection.performanceDomain}</p>
          <p><strong>Principle:</strong> ${framework.pmbokConnection.principle}</p>
          ${framework.pmbokConnection.quote ? `
            <blockquote class="pmbok-quote">"${framework.pmbokConnection.quote}"</blockquote>
          ` : ''}
        </div>
      ` : ''}
    </div>
  `;
}

function renderFrameworkTable(table) {
  return `
    <div class="framework-visual">
      <div class="table-scroll-wrapper">
        <table class="framework-table">
          <thead>
            <tr>
              ${table.columns?.map(col => `<th>${col}</th>`).join('') || ''}
            </tr>
          </thead>
          <tbody>
            ${table.rows?.map(row => `
              <tr class="framework-row">
                <td class="step-badge">
                  <div class="badge ${row.step.color || 'blue'}">${row.step.badge}</div>
                  <strong>${row.step.name}</strong>
                </td>
                <td>${row.action}</td>
                <td>
                  <ul>
                    ${row.keyQuestions?.map(q => `<li>${q}</li>`).join('') || ''}
                  </ul>
                </td>
                <td>${row.examKeywords}</td>
              </tr>
            `).join('') || ''}
          </tbody>
        </table>
      </div>
      <p class="table-scroll-hint">💡 Swipe left to see more</p>
    </div>
  `;
}

function renderAdditionalContent(additional) {
  if (additional.deepDive) {
    return `
      <div class="framework-deepdive">
        <h5>${additional.deepDive.title}</h5>
        ${additional.deepDive.levels ? renderLevels(additional.deepDive.levels) : ''}
      </div>
    `;
  }
  return '';
}

function renderLevels(levels) {
  return `
    <div class="escalation-chart">
      ${levels.map(level => `
        <div class="level level-${level.level}">
          <div class="level-header">Level ${level.level} ${level.icon}</div>
          <div class="level-name">${level.name}</div>
          <div class="level-desc">${level.description}</div>
          <div class="level-action"><strong>Action:</strong> ${level.action}</div>
        </div>
      `).join('')}
    </div>
  `;
}

// Section 4: Visual Reference Card
function renderVisualReferenceCard(taskId, card) {
  if (!card) return '';

  return `
    <div class="reference-card">
      <h4>🎴 Quick Reference Card - Save This!</h4>

      <div class="card-printable" id="ref-card-${taskId}">
        <div class="card-front">
          <div class="card-title">${card.taskTitle}</div>

          <div class="card-framework">
            <div class="card-acronym">${card.framework?.acronym || ''}</div>
            <div class="card-steps">
              ${card.framework?.steps?.map(step => `<div>${step}</div>`).join('') || ''}
            </div>
          </div>

          ${card.quickReference ? `
            <div class="card-levels">
              <strong>Quick Reference:</strong><br>
              ${card.quickReference}
            </div>
          ` : ''}

          <div class="card-rule">
            <strong>Golden Rule:</strong><br>
            ${card.goldenRule}
          </div>

          <div class="card-exam-tip">
            <strong>Exam Tip:</strong><br>
            ${card.examTip}
          </div>

          ${card.pmbokPrinciple ? `
            <div class="card-principle">
              <strong>PMBOK:</strong> ${card.pmbokPrinciple}
            </div>
          ` : ''}
        </div>

      </div>
    </div>
  `;
}

// Section 5: Second Scenario
function renderSecondScenario(taskId, scenario) {
  if (!scenario) return '';

  return `
    <div class="application-scenario">
      <h4>💪 ${scenario.title || 'Apply What You Learned'}</h4>
      <p class="scenario-intro">${scenario.intro || 'Now let\'s see if you can apply the framework!'}</p>

      <div class="scenario-story">
        <p><strong>New Situation:</strong></p>
        <p>${scenario.scenarioStory}</p>
        <p><strong>${scenario.question}</strong></p>
      </div>

      <form class="scenario-quiz" id="scenario-2-${taskId}">
        ${Object.entries(scenario.options).map(([key, option]) => `
          <label class="quiz-option">
            <input type="radio" name="answer-2" value="${key}">
            <span class="option-text">
              <strong>${key}.</strong> ${typeof option === 'string' ? option : option.text}
            </span>
          </label>
        `).join('')}

        <button type="button" class="btn btn-primary" onclick="checkScenarioAnswer('scenario-2-${safeActionArg(taskId)}', '${safeActionArg(scenario.correctAnswer)}', '${safeActionArg(taskId)}', true)">
          Check Answer
        </button>
      </form>

      <div class="answer-feedback" id="feedback-scenario-2-${taskId}" style="display:none;">
        <!-- Filled by JavaScript -->
      </div>
    </div>
  `;
}

// Section 6: Real PM Wisdom
function renderPMWisdom(wisdom) {
  if (!wisdom) return '';

  return `
    <div class="pm-wisdom">
      <h4>💬 From Real Project Managers</h4>

      ${wisdom.quotes?.map(quote => `
        <div class="wisdom-quote ${quote.type}-quote">
          <div class="quote-icon">${quote.icon}</div>
          <div class="quote-content">
            <p class="quote-text">${quote.text}</p>
            <p class="quote-author">— ${quote.author}${quote.source ? `, ${quote.source}` : ''}</p>
          </div>
        </div>
      `).join('') || ''}

      ${wisdom.fieldInsights ? `
        <div class="wisdom-insights">
          <h5>🔍 Key Insights from the Field</h5>
          <ul class="insight-list">
            ${wisdom.fieldInsights.map(insight => `
              <li><strong>${insight.title}</strong>: ${insight.insight}</li>
            `).join('')}
          </ul>
        </div>
      ` : ''}
    </div>
  `;
}

// Section 7: Apply to YOUR Job
function renderPersonalApplication(taskId, application) {
  if (!application) return '';

  return `
    <div class="personal-application">
      <h4>🏢 ${application.title || 'Apply to YOUR Work'}</h4>

      <div class="reflection-prompt">
        <p>${application.reflectionPrompt}</p>
      </div>

      <div class="reflection-exercise">
        <form id="reflection-form-${taskId}">
          ${application.questions?.map((q, idx) => `
            <div class="input-group">
              <label><strong>${idx + 1}. ${q.question}</strong></label>
              ${q.type === 'dropdown' ? `
                <select class="form-control" id="${q.id}-${taskId}" name="${q.id}">
                  <option value="">Select one...</option>
                  ${q.options?.map(opt => `<option value="${opt}">${opt}</option>`).join('') || ''}
                </select>
              ` : q.type === 'textarea' ? `
                <textarea class="form-control" id="${q.id}-${taskId}" name="${q.id}" rows="3"
                  placeholder="${q.placeholder || ''}"></textarea>
              ` : `
                <input type="text" class="form-control" id="${q.id}-${taskId}" name="${q.id}"
                  placeholder="${q.placeholder || ''}">
              `}
            </div>
          `).join('') || ''}

          <button type="button" class="btn btn-primary" onclick="savePersonalReflection('${safeActionArg(taskId)}')">
            💾 Save My Reflection
          </button>
        </form>

        ${application.valueStatement ? `
          <div class="reflection-value">
            <p>${application.valueStatement}</p>
            ${application.xpReward ? `
              <p class="bonus-note">✨ <strong>Bonus:</strong> Saving your reflection earns +${application.xpReward} XP!</p>
            ` : ''}
          </div>
        ` : ''}
      </div>
    </div>
  `;
}

// Section 8: Memory Palace
function renderMemoryPalace(memory) {
  if (!memory) return '';

  return `
    <div class="memory-palace">
      <h4>🧠 ${memory.title || 'Memory Technique: The Story Method'}</h4>

      <div class="memory-intro">
        <p>${memory.intro}</p>
      </div>

      <div class="memory-story">
        <div class="story-visual">
          <div class="story-scene">
            <h5>${memory.story?.title}</h5>
            <p>${memory.story?.narrative}</p>

            ${memory.story?.scenes ? `
              <div class="story-steps">
                ${memory.story.scenes.map(scene => `
                  <div class="story-step">
                    <div class="step-icon">${scene.visual}</div>
                    <p><strong>${scene.step}:</strong> ${scene.description}</p>
                  </div>
                `).join('')}
              </div>
            ` : ''}

            ${memory.story?.moral ? `
              <p class="story-moral"><strong>The moral:</strong> ${memory.story.moral}</p>
            ` : ''}
          </div>
        </div>
      </div>

      ${memory.selfTest ? `
        <div class="memory-test">
          <p>${memory.selfTest}</p>
        </div>
      ` : ''}
    </div>
  `;
}

// Section 9: Spaced Repetition Scheduler
function renderSpacedRepetition(taskId, repetition) {
  if (!repetition) return '';

  return `
    <div class="spaced-repetition">
      <h4>🔄 ${repetition.title || 'Lock It In: Your Review Schedule'}</h4>

      <div class="repetition-intro">
        <p>${repetition.intro}</p>
      </div>

      <div class="review-schedule">
        ${repetition.schedule?.map((review, idx) => `
          <div class="review-item ${idx === 0 ? 'upcoming' : ''}">
            <div class="review-time">${review.icon || '📅'} ${review.timeframe}</div>
            <div class="review-task">
              <strong>${review.title || 'Review'} (${review.duration}):</strong>
              <ul>
                ${review.tasks?.map(task => `<li>${task}</li>`).join('') || ''}
              </ul>
            </div>
            ${review.reminderButton !== false ? `
              <button class="btn btn-sm btn-outline" onclick="setReminder('${safeActionArg(taskId)}', ${idx})">
                🔔 Set Reminder
              </button>
            ` : ''}
          </div>
        `).join('') || ''}
      </div>

      ${repetition.calendarIntegration ? `
        <div class="repetition-calendar">
          <button class="btn btn-primary" onclick="addAllToCalendar('${safeActionArg(taskId)}')">
            📆 Add All to Calendar
          </button>
          <p class="calendar-note">Adds review events to Google Calendar / Outlook</p>
        </div>
      ` : ''}

      ${repetition.retentionVisualization ? `
        <div class="retention-graph">
          <h5>📊 Your Expected Retention</h5>
          <div class="graph-placeholder">
            <p><strong>Without review:</strong> ${repetition.retentionVisualization.withoutReview}</p>
            <p><strong>With this schedule:</strong> ${repetition.retentionVisualization.withReview}</p>
          </div>
        </div>
      ` : ''}
    </div>
  `;
}

// Section 10: Mission Checklist
function renderMissionChecklist(taskId, checklist) {
  if (!checklist) return '';

  const completedCount = checklist.items?.filter(item => item.completed).length || 0;
  const totalCount = checklist.items?.length || 0;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return `
    <div class="mission-checklist">
      <h4>✅ ${checklist.title || 'Mission Checklist: Complete This Task'}</h4>

      <div class="checklist-intro">
        <p>To fully master this task and earn <strong>${checklist.xpAvailable} XP</strong>, complete:</p>
      </div>

      <div class="checklist-items">
        ${checklist.items?.map(item => `
          <div class="checklist-item ${item.completed ? 'completed' : ''} ${item.current ? 'current' : ''}">
            <input type="checkbox" id="check-${item.id}" ${item.completed ? 'checked disabled' : ''}>
            <label for="check-${item.id}">
              <strong>${item.completed ? '✅' : ''} ${item.task}</strong>
              ${item.xp ? `<span class="item-xp">+${item.xp} XP</span>` : ''}
              ${item.description ? `<span class="item-desc">${item.description}</span>` : ''}
            </label>
            ${item.ctaButton ? `
              <button class="btn btn-sm btn-primary" onclick="navigateTo('${safeActionArg(item.link || '#')}')">
                ${item.ctaButton} →
              </button>
            ` : ''}
          </div>
        `).join('') || ''}
      </div>

      <div class="checklist-progress">
        <div class="progress-bar">
          <div class="progress-fill" style="width: ${progressPercent}%">
            ${completedCount}/${totalCount} complete
          </div>
        </div>
        <p class="progress-summary">
          <strong>${progressPercent}% complete</strong> |
          ${checklist.items?.reduce((sum, item) => sum + (item.completed ? item.xp || 0 : 0), 0)}/${checklist.xpAvailable} XP earned
          ${checklist.timeEstimate ? ` | <span class="time-estimate">${checklist.timeEstimate}</span>` : ''}
        </p>
      </div>

      ${checklist.nextActionPrimary ? `
        <div class="next-action-primary">
          <button class="btn btn-lg btn-primary" onclick="navigateTo('${safeActionArg(checklist.nextActionPrimary.link)}')">
            ${checklist.nextActionPrimary.text} →
          </button>
        </div>
      ` : ''}
    </div>
  `;
}

// Fallback for missing content
function renderFallbackContent(taskId) {
  return `
    <div class="content-fallback">
      <h3>⚠️ Content Not Yet Available</h3>
      <p>Enhanced MVE content for task ${taskId} is being created.</p>
      <p>Please check back soon or contact support.</p>
    </div>
  `;
}

// Helper function to check scenario answers
function checkScenarioAnswer(formId, correctAnswer, taskId, isSecondScenario = false) {
  console.log('checkScenarioAnswer called', { formId, correctAnswer, taskId, isSecondScenario });

  const form = document.getElementById(formId);
  if (!form) {
    console.error('Form not found:', formId);
    alert('Error: Quiz form not found. Please refresh the page.');
    return;
  }

  const selectedAnswer = form.querySelector('input[type="radio"]:checked');

  if (!selectedAnswer) {
    alert('Please select an answer first!');
    return;
  }

  const userAnswer = selectedAnswer.value;
  const isCorrect = userAnswer === correctAnswer;
  const feedbackId = `feedback-${formId}`;
  const feedbackDiv = document.getElementById(feedbackId);

  if (!feedbackDiv) {
    console.error('Feedback div not found:', feedbackId);
    return;
  }

  // Disable all options to prevent changing answer
  const allOptions = form.querySelectorAll('input[type="radio"]');
  allOptions.forEach(radio => {
    radio.disabled = true;
  });

  // Disable the check button
  const checkButton = form.querySelector('button');
  if (checkButton) {
    checkButton.disabled = true;
    checkButton.style.opacity = '0.5';
    checkButton.style.cursor = 'not-allowed';
  }

  // Visually mark the correct and incorrect answers
  const allLabels = form.querySelectorAll('.quiz-option');
  console.log('Found labels:', allLabels.length);
  allLabels.forEach(label => {
    const radio = label.querySelector('input[type="radio"]');
    if (radio) {
      if (radio.value === correctAnswer) {
        label.classList.add('correct');
        console.log('Added correct class to option', radio.value);
      } else if (radio.value === userAnswer && !isCorrect) {
        label.classList.add('incorrect');
        console.log('Added incorrect class to option', radio.value);
      }
    }
  });

  if (isCorrect) {
    setSafeInnerHTML(feedbackDiv, `
      <div class="feedback-correct">
        <h5>🎉 Excellent! ${isSecondScenario ? "You're applying the framework!" : "Correct!"}</h5>
        ${isSecondScenario ? `<p class="xp-reward">+10 XP Bonus for applying the framework! 🎯</p>` : ''}
      </div>
    `);
    if (isSecondScenario && typeof window.awardXP === 'function') {
      window.awardXP(10, 'scenario-bonus');
    }
  } else {
    setSafeInnerHTML(feedbackDiv, `
      <div class="feedback-incorrect">
        <h5>📚 Not quite! The correct answer is ${escapeHTML(correctAnswer.toUpperCase())}.</h5>
        <p>The correct option is now highlighted in green above. Review the framework to understand why ${escapeHTML(correctAnswer.toUpperCase())} is the PMI way.</p>
      </div>
    `);
  }

  feedbackDiv.style.display = 'block';
  feedbackDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

  console.log('checkScenarioAnswer completed');
}

// Helper function to save personal reflections
function savePersonalReflection(taskId) {
  const form = document.getElementById(`reflection-form-${taskId}`);
  const formData = new FormData(form);
  const reflection = {};

  for (let [key, value] of formData.entries()) {
    reflection[key] = value;
  }

  // Save to localStorage (or send to backend)
  const reflections = JSON.parse(localStorage.getItem('pmp_reflections') || '{}');
  reflections[taskId] = {
    ...reflection,
    savedAt: new Date().toISOString()
  };
  localStorage.setItem('pmp_reflections', JSON.stringify(reflections));

  // Award XP
  awardXP(5, 'reflection-saved');

  // Show success message
  alert('✅ Reflection saved! +5 XP earned');
}

// Helper function to download reference card
function downloadReferenceCard(taskId) {
  const card = document.getElementById(`ref-card-${taskId}`);
  // Use html2canvas or similar library to convert to image
  console.log('Downloading reference card for', taskId);
  alert('Reference card download feature coming soon!');
}

// Helper function to print reference card
function printReferenceCard(taskId) {
  const card = document.getElementById(`ref-card-${taskId}`);
  const printWindow = window.open('', '', 'width=800,height=600');
  printWindow.document.write('<html><head><title>Reference Card</title>');
  printWindow.document.write('<link rel="stylesheet" href="css/enhanced-mve.css">');
  printWindow.document.write('</head><body>');
  printWindow.document.write(card.innerHTML);
  printWindow.document.write('</body></html>');
  printWindow.document.close();
  printWindow.print();
}

// Helper function to set reminders
function setReminder(taskId, dayIndex) {
  const schedules = {
    0: 1,   // Tomorrow
    1: 3,   // 3 days
    2: 7,   // 1 week
    3: 14   // 2 weeks
  };

  const daysUntil = schedules[dayIndex];
  const reminderDate = new Date();
  reminderDate.setDate(reminderDate.getDate() + daysUntil);

  // Save reminder to localStorage
  const reminders = JSON.parse(localStorage.getItem('pmp_reminders') || '[]');
  const reminder = {
    taskId,
    date: reminderDate.toISOString(),
    type: `review-${dayIndex}`
  };
  const existingIndex = reminders.findIndex(r => r.taskId === taskId && r.type === reminder.type);
  if (existingIndex >= 0) {
    reminders[existingIndex] = reminder;
  } else {
    reminders.push(reminder);
  }
  localStorage.setItem('pmp_reminders', JSON.stringify(reminders.slice(-250)));

  alert(`✅ Reminder set for ${reminderDate.toLocaleDateString()}`);
}

// Helper function to add all reviews to calendar
function addAllToCalendar(taskId) {
  console.log('Adding all reviews to calendar for', taskId);
  alert('Calendar integration coming soon!');
}

// Navigation functions for paginated mode
window.navigateToSection = function(taskId, sectionIndex) {
  // Save progress
  if (window.taskFlow) {
    const progress = window.taskFlow.getTaskProgress(taskId);
    window.taskFlow.updateTaskProgress(taskId, {
      learnPhase: {
        ...progress.learnPhase,
        currentSection: sectionIndex,
        visitedSections: [...new Set([...(progress.learnPhase.visitedSections || []), sectionIndex])]
      }
    });
  }

  // Navigate to section
  window.location.hash = `/learn/${taskId}/${sectionIndex}`;

  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

window.completeLearnPhase = async function(taskId) {
  // Mark Learn phase as complete
  if (window.taskFlow) {
    await window.taskFlow.completePhase('learn', taskId);
  } else {
    // Fallback if taskFlow not available
    alert('Learn phase completed! Continue to Flashcards.');
    window.location.hash = `/task/${taskId}`;
  }
};

// Make helper functions globally available for onclick handlers
if (typeof window !== 'undefined') {
  window.checkScenarioAnswer = checkScenarioAnswer;
  window.savePersonalReflection = savePersonalReflection;
  window.downloadReferenceCard = downloadReferenceCard;
  window.printReferenceCard = printReferenceCard;
  window.setReminder = setReminder;
  window.addAllToCalendar = addAllToCalendar;
}

// Export for use in app.js
export { renderEnhancedMVE, LEARN_SECTIONS };
