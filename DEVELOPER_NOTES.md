# Developer Notes - Gamification System

## Architecture Overview

The gamification system is built as a modular enhancement to the existing PMP Learning Game. It integrates seamlessly without disrupting core functionality.

---

## Core Manager Classes

### GamificationManager
**Location**: Lines 3709-3950
**Purpose**: Manages character progression, equipment, and achievements

```javascript
const gamificationManager = new GamificationManager();
```

**Key Methods:**
- `updateCharacterClass()` - Updates character based on level
- `updateCharacterDisplay()` - Refreshes sidebar UI
- `updateEquipmentDisplay()` - Renders equipment icons
- `unlockEquipment(missionId)` - Awards equipment on mission completion
- `checkAchievements()` - Evaluates all achievement conditions
- `unlockAchievement(achievement)` - Triggers achievement unlock sequence
- `showAchievementPopup(achievement)` - Displays achievement overlay
- `updateAchievementBadge()` - Updates notification badge

**Character Classes Array:**
```javascript
[
  { level: [1, 2], icon: '🥾', title: 'Novice Hiker', description: 'Just starting the journey' },
  { level: [3, 4], icon: '🎒', title: 'Trail Explorer', description: 'Learning the ropes' },
  { level: [5, 6], icon: '⛏️', title: 'Mountain Climber', description: 'Gaining altitude' },
  { level: [7, 8], icon: '🧗', title: 'Peak Challenger', description: 'Approaching the summit' },
  { level: [9, 10], icon: '🏔️', title: 'Summit Master', description: 'At the top!' }
]
```

**Equipment List:**
```javascript
[
  { id: 'trail-map', name: 'Trail Map', icon: '🗺️', mission: 'm1' },
  { id: 'compass', name: 'Compass', icon: '🧭', mission: 'm2' },
  { id: 'ice-axe', name: 'Ice Axe', icon: '⛏️', mission: 'm3' },
  { id: 'oxygen-tank', name: 'Oxygen Tank', icon: '🎒', mission: 'm4' },
  { id: 'climbing-rope', name: 'Climbing Rope', icon: '🪢', mission: 'm5' },
  { id: 'carabiner-set', name: 'Carabiner Set', icon: '🔗', mission: 'm6' },
  { id: 'summit-flag', name: 'Summit Flag', icon: '🚩', mission: 'm7' }
]
```

---

### DailyChallengeManager
**Location**: Lines 3951-4070
**Purpose**: Manages daily challenges and progress tracking

```javascript
const dailyChallengeManager = new DailyChallengeManager();
```

**Key Methods:**
- `initializeDaily()` - Resets challenges at midnight
- `updateProgress(type, amount)` - Updates challenge progress
- `updateDailyChallengeDisplay()` - Renders challenge UI
- `updateDailyChallengeBadge()` - Updates sidebar badge

**Challenge Types:**
```javascript
[
  { id: 'review-20-cards', type: 'flashcards', target: 20, xpReward: 100 },
  { id: 'complete-1-task', type: 'tasks', target: 1, xpReward: 150 },
  { id: 'practice-5-formulas', type: 'formulas', target: 5, xpReward: 75 }
]
```

**Integration Points:**
- Flashcard review: `dailyChallengeManager.updateProgress('flashcards', 1)`
- Task completion: `dailyChallengeManager.updateProgress('tasks', 1)`
- Formula practice: `dailyChallengeManager.updateProgress('formulas', 1)`

---

### StreakManager
**Location**: Lines 4071-4170
**Purpose**: Tracks study streaks and multipliers

```javascript
const streakManager = new StreakManager();
```

**Key Methods:**
- `updateStreak()` - Daily streak check and update
- `updateStreakMultiplier()` - Calculates XP bonus
- `checkStreakMilestones()` - Awards milestone rewards
- `renderStreakCalendar()` - Displays 30-day calendar

**Streak Logic:**
```javascript
const today = new Date().toISOString().split('T')[0];
const lastDate = AppState.userData.lastStudyDate;

// Check if consecutive day
const yesterday = new Date();
yesterday.setDate(yesterday.getDate() - 1);
const yesterdayStr = yesterday.toISOString().split('T')[0];

if (lastDate === yesterdayStr) {
  // Continue streak
  AppState.userData.streak += 1;
} else if (lastDate !== today) {
  // Streak broken (unless freeze available)
  if (AppState.userData.streakFreezes > 0) {
    AppState.userData.streakFreezes -= 1;
    // Keep streak
  } else {
    AppState.userData.streak = 1;
  }
}
```

**Multiplier Tiers:**
```javascript
if (streak >= 30) multiplier = 25; // +25%
else if (streak >= 7) multiplier = 10; // +10%
else multiplier = 0; // No bonus
```

---

## Utility Functions

### Toast Notifications
**Function**: `showToast(type, title, message)`
**Location**: Lines 5680-5710

```javascript
showToast('success', 'XP Gained', '+50 XP');
showToast('achievement', 'Week Warrior Unlocked!', '+150 XP');
showToast('warning', 'Streak at risk!', 'Study today');
showToast('error', 'Incorrect', 'Review this topic');
```

**Implementation:**
- Creates toast element dynamically
- Appends to `#toast-container`
- Auto-removes after 5 seconds
- Plays sound if enabled
- Stacks multiple toasts

---

### Level Up Animation
**Function**: `showLevelUpAnimation(level)`
**Location**: Lines 5711-5730

```javascript
showLevelUpAnimation({
  level: 5,
  name: 'Mountain Climber',
  icon: '⛏️'
});
```

**Implementation:**
- Shows full-screen overlay
- Displays new level info
- Triggers confetti
- Plays fanfare sound
- Waits for user to dismiss

---

### Confetti System
**Function**: `createConfetti()`
**Location**: Lines 5740-5765

```javascript
createConfetti(); // Spawns 50 particles
```

**Implementation:**
- Creates 50 div elements
- Random colors from palette
- Random horizontal positions
- Cascading delay for natural fall
- Self-cleaning after 3 seconds

---

### Particle Burst
**Function**: `createParticles(element, color)`
**Location**: Lines 5767-5800

```javascript
const button = document.getElementById('know-it');
createParticles(button, '#10b981'); // Green particles
```

**Implementation:**
- 12 particles in circular pattern
- Radiates from element center
- Customizable color
- CSS variables for animation
- Self-cleaning after 800ms

---

### Sound System
**Function**: `playSound(type)`
**Location**: Lines 5802-5850

```javascript
playSound('success');    // Rising beep
playSound('achievement'); // Ascending notes
playSound('levelup');    // Fanfare
playSound('error');      // Low buzz
```

**Implementation:**
- Uses Web Audio API
- Creates oscillator nodes
- Very quiet (10% volume)
- Respects user preference
- Non-blocking

---

### Weather Icons
**Function**: `getWeatherIcon(missionId)`
**Location**: Lines 5870-5880

```javascript
const weather = {
  'm1': '☀️', 'm2': '☁️', 'm3': '🌫️', 'm4': '⛈️',
  'm5': '❄️', 'm6': '🌤️', 'm7': '🌟'
};
```

---

### Motivational Messages
**Function**: `getMotivationalMessage()`
**Location**: Lines 5882-5900

Returns random message from array of 10 motivational quotes.

---

## Enhanced Core Functions

### addXP() Enhancement
**Location**: Lines 5600-5640

**Before:**
```javascript
function addXP(amount) {
  AppState.userData.xp += amount;
  // Check level up
  // Save data
}
```

**After:**
```javascript
function addXP(amount, showToastNotif = true) {
  // Apply streak multiplier
  const multiplier = 1 + (streakMultiplier / 100);
  const bonusAmount = Math.round(amount * multiplier);

  // Add XP
  AppState.userData.xp += bonusAmount;
  AppState.userData.todayXP += bonusAmount;

  // Check level up (with animation)
  if (leveledUp) {
    showLevelUpAnimation(nextLevel);
    gamificationManager.updateCharacterClass();
  }

  // Check achievements
  gamificationManager.checkAchievements();

  // Show toast with bonus
  if (showToastNotif) {
    showToast('success', `+${amount} XP (+${bonus} bonus)`);
  }
}
```

**Key Changes:**
- Applies streak multiplier
- Tracks daily XP
- Shows level up animation
- Checks achievements
- Optional toast notification
- Shows bonus in toast

---

### reviewFlashcard() Enhancement
**Location**: Lines 6396-6435

**Added:**
```javascript
if (correct) {
  // ... existing logic ...

  // NEW: Update daily challenge
  dailyChallengeManager.updateProgress('flashcards', 1);

  // NEW: Particle effect
  const btn = document.getElementById('know-it');
  if (btn) createParticles(btn, '#10b981');
} else {
  // NEW: Shake animation
  const card = document.getElementById('flashcard');
  if (card) {
    card.classList.add('shake');
    setTimeout(() => card.classList.remove('shake'), 400);
  }
}
```

---

### Mission Completion Enhancement
**Location**: Lines 3632-3660

**Added:**
```javascript
completeMission(missionId) {
  // ... existing logic ...

  // NEW: Unlock equipment
  gamificationManager.unlockEquipment(missionId);

  // NEW: Check achievements
  gamificationManager.checkAchievements();

  // NEW: Toast notification
  showToast('achievement', `Mission Complete: ${mission.name}`,
    `+${mission.rewards.xp} XP`);

  // NEW: Confetti
  createConfetti();
}
```

---

### Task Completion Enhancement
**Location**: Lines 3656-3680

**Added:**
```javascript
completeTask(taskId) {
  // ... existing logic ...

  // NEW: Update daily challenge
  dailyChallengeManager.updateProgress('tasks', 1);
}
```

---

## Render Functions

### renderMissionMap() Enhancement
**Location**: Lines 5255-5330

**Key Additions:**
```javascript
// Calculate current position
const currentMission = AppState.userData.unlockedMissions[...].length - 1];
const isCurrent = mission.id === currentMission && !isCompleted;
const weather = getWeatherIcon(mission.id);

// Character indicator at current mission
const characterIndicator = isCurrent ?
  `<div style="...animation: bounce 2s infinite;">
    ${AppState.userData.characterIcon}
  </div>` : '';

// Weather icon display
<span class="weather-icon">${weather}</span>

// Glow effect on current mission
className += isCurrent ? ' glow' : '';

// Exam weight display
${mission.examWeight ? `${mission.examWeight}% of exam` : ''}

// Rewards preview
${mission.rewards ? `Rewards: ${mission.rewards.xp} XP...` : ''}
```

---

### renderDailyChallengeMenu()
**Location**: Lines 6685-6745

**Renders:**
1. Current date
2. Streak count and today's XP
3. 30-day streak calendar
4. Best streak and multiplier
5. Challenge list with progress bars
6. Bonus XP section
7. Milestone indicators
8. Motivational message

**Key Logic:**
```javascript
// Build challenge HTML
container.innerHTML = challenges.map(challenge => {
  const percentage = (challenge.progress / challenge.target) * 100;
  return `
    <div>
      ${challenge.icon} ${challenge.name}
      Progress: ${challenge.progress} / ${challenge.target}
      <div class="progress-bar">
        <div style="width: ${percentage}%"></div>
      </div>
    </div>
  `;
}).join('');

// Show bonus if all complete
if (allCompleted) {
  bonusDiv.style.display = 'block';
}
```

---

### renderAchievementsPage()
**Location**: Lines 6747-6820

**Renders:**
1. Achievement stats (unlocked/total)
2. Total achievement XP
3. Completion percentage
4. Achievement grid with cards
5. Rarity badges
6. Locked/unlocked states

**Key Logic:**
```javascript
achievements.map(achievement => {
  const isUnlocked = unlocked.includes(achievement.id);
  const rarity = getRarity(achievement);

  return `
    <div class="achievement ${isUnlocked ? 'unlocked' : 'locked'}"
         data-category="${achievement.category}"
         data-status="${isUnlocked ? 'unlocked' : 'locked'}">
      ${achievement.icon}
      ${achievement.name}
      <div class="rarity-${rarity}">${rarity}</div>
      ${isUnlocked ? 'Unlocked ✓' : `+${achievement.xpReward} XP`}
    </div>
  `;
});
```

**Filter System:**
```javascript
buttons.forEach(btn => {
  btn.addEventListener('click', () => {
    const filter = btn.dataset.filter;
    achievements.forEach(ach => {
      // Show/hide based on filter
      ach.style.display = shouldShow ? 'block' : 'none';
    });
  });
});
```

---

## Data Structure

### AppState.userData Additions
```javascript
{
  // Character progression
  characterClass: 'novice-hiker',
  characterIcon: '🥾',
  characterTitle: 'Novice Hiker',
  equipment: [], // Array of equipment IDs

  // Achievements
  unlockedAchievements: [], // Array of achievement IDs

  // Daily challenges
  dailyChallenge: {
    date: '2026-01-28',
    challenges: [
      {
        id: 'review-20-cards',
        name: 'Review 20 flashcards',
        icon: '🃏',
        progress: 12,
        target: 20,
        xpReward: 100,
        completed: false,
        type: 'flashcards'
      },
      // ... other challenges
    ],
    allCompleted: false
  },
  dailyChallengeProgress: {}, // Backup tracking

  // Streak system
  streakHistory: ['2026-01-21', '2026-01-22', ...], // Array of dates
  bestStreak: 7,
  streakFreezes: 1,
  streakMultiplier: 10, // Percentage

  // Login rewards
  lastLoginDate: '2026-01-28',
  consecutiveLoginDays: 7,
  totalLoginDays: 45,

  // Daily stats
  todayXP: 250,
  todayDate: '2026-01-28',

  // Sound settings
  soundEnabled: false
}
```

---

## CSS Classes

### Animation Classes
```css
.shake { animation: shake 0.4s ease; }
.pulse { animation: pulse 0.5s ease; }
.glow { animation: glow 1.5s ease-in-out infinite; }
```

### Component Classes
```css
.toast { /* Toast notification */ }
.toast-success { /* Green toast */ }
.toast-achievement { /* Gold toast */ }
.level-up-overlay { /* Full screen overlay */ }
.achievement-unlock-popup { /* Achievement popup */ }
.confetti { /* Confetti particle */ }
.particle { /* Burst particle */ }
.equipment-item { /* Equipment icon */ }
.equipment-item.unlocked { /* Unlocked equipment */ }
.challenge-progress-bar { /* Progress bar container */ }
.challenge-progress-fill { /* Progress bar fill */ }
.streak-calendar { /* Calendar grid */ }
.streak-day { /* Calendar day */ }
.streak-day.active { /* Active study day */ }
.streak-day.today { /* Today marker */ }
.achievement-rarity { /* Rarity badge */ }
.rarity-common { /* Common achievement */ }
.rarity-rare { /* Rare achievement */ }
.rarity-epic { /* Epic achievement */ }
.rarity-legendary { /* Legendary achievement */ }
.mountain-texture { /* Mountain pattern background */ }
.pixel-border { /* 8-bit style border */ }
```

---

## Event Listeners

### Initialization
```javascript
function initApp() {
  // Initialize managers
  streakManager.updateStreak();
  dailyChallengeManager.initializeDaily();
  gamificationManager.updateCharacterClass();

  // Render pages
  renderDailyChallengeMenu();
  renderAchievementsPage();

  // Show welcome modal
  showWelcomeModal();
}
```

### Page Navigation
Navigation handled by existing event system. New pages:
- `data-page="daily-challenge"` → Daily Challenge page
- `data-page="achievements"` → Achievements page

---

## Performance Considerations

### Efficient Rendering
```javascript
// Only render when page is visible
if (document.getElementById('daily-challenge').classList.contains('active')) {
  renderDailyChallengeMenu();
}
```

### Element Cleanup
```javascript
// Remove particles after animation
setTimeout(() => particle.remove(), 800);

// Remove confetti after fall
setTimeout(() => confetti.remove(), 3000);

// Remove toast after display
setTimeout(() => toast.remove(), 5000);
```

### Memory Management
```javascript
// Clear old streak history (keep last 90 days)
if (streakHistory.length > 90) {
  streakHistory = streakHistory.slice(-90);
}
```

---

## Testing Scenarios

### Test Daily Challenge Reset
```javascript
// Simulate next day
AppState.userData.dailyChallenge.date = '2026-01-27';
dailyChallengeManager.initializeDaily();
// Should reset all challenges
```

### Test Streak Logic
```javascript
// Test streak continuation
AppState.userData.lastStudyDate = '2026-01-27';
streakManager.updateStreak();
// Should increment streak

// Test streak break
AppState.userData.lastStudyDate = '2026-01-25';
streakManager.updateStreak();
// Should reset streak or use freeze
```

### Test Achievement Unlock
```javascript
// Simulate 7-day streak
AppState.userData.streak = 7;
gamificationManager.checkAchievements();
// Should unlock Week Warrior
```

### Test Level Up
```javascript
// Add enough XP for level up
addXP(500); // Should trigger level 2
// Check animation shown
// Check character class updated
```

### Test Equipment Unlock
```javascript
// Complete mission
missionManager.completeMission('m1');
// Check equipment array includes 'trail-map'
// Check equipment display updated
```

---

## Extension Points

### Adding New Challenges
```javascript
// In DailyChallengeManager constructor
this.challenges.push({
  id: 'new-challenge',
  name: 'New Challenge',
  icon: '🎯',
  target: 10,
  xpReward: 200,
  type: 'custom-type'
});

// In relevant function
dailyChallengeManager.updateProgress('custom-type', 1);
```

### Adding New Achievements
```javascript
// In missions.json
{
  "id": "new-achievement",
  "name": "Achievement Name",
  "icon": "🏆",
  "description": "Do something amazing",
  "category": "excellence",
  "xpReward": 300
}

// In GamificationManager.checkAchievementCondition()
case 'new-achievement':
  return /* condition */;
```

### Adding New Character Classes
```javascript
// In GamificationManager constructor
this.characterClasses.push({
  level: [11, 12],
  icon: '👑',
  title: 'PMP Champion',
  description: 'Beyond mastery'
});
```

### Adding New Equipment
```javascript
// In GamificationManager constructor
this.equipmentList.push({
  id: 'special-item',
  name: 'Special Item',
  icon: '⭐',
  mission: 'm8' // For bonus missions
});
```

---

## Debugging Tools

### Console Commands
```javascript
// Check current state
console.log(AppState.userData);

// Force level up
AppState.userData.xp = 1500;
updateXPBar();

// Unlock all achievements
AppState.missions.achievementSystem.achievements.forEach(a => {
  gamificationManager.unlockAchievement(a);
});

// Complete all challenges
AppState.userData.dailyChallenge.challenges.forEach(c => {
  c.progress = c.target;
  c.completed = true;
});
dailyChallengeManager.updateDailyChallengeDisplay();

// Max out streak
AppState.userData.streak = 100;
streakManager.updateStreakMultiplier();

// Unlock all equipment
gamificationManager.equipmentList.forEach(eq => {
  AppState.userData.equipment.push(eq.id);
});
gamificationManager.updateEquipmentDisplay();
```

### Reset Functions
```javascript
// Reset daily challenges
localStorage.removeItem('pmpUserData');
location.reload();

// Clear specific data
delete AppState.userData.dailyChallenge;
dailyChallengeManager.initializeDaily();
```

---

## Known Limitations

1. **Sound System**: Simple beeps only, no complex audio
2. **Confetti**: Limited to 50 particles for performance
3. **Streak Calendar**: Shows last 30 days only
4. **Achievement Conditions**: Hardcoded in checkAchievementCondition()
5. **Weather Icons**: Static, not dynamic based on date/season

---

## Future Improvements

### High Priority
- [ ] Export achievement progress
- [ ] Share achievements on social media
- [ ] Customizable character avatars
- [ ] More complex sound effects

### Medium Priority
- [ ] Leaderboard system
- [ ] Weekly challenges
- [ ] Seasonal events
- [ ] Badge showcase

### Low Priority
- [ ] Mini-games for formula practice
- [ ] Voice narration
- [ ] Animated character sprites
- [ ] Weather-based difficulty

---

## Troubleshooting

### Issue: Toast notifications not showing
**Solution**: Check if `#toast-container` exists in DOM

### Issue: Streak not updating
**Solution**: Verify date comparison logic, check timezone

### Issue: Achievements not unlocking
**Solution**: Check `checkAchievementCondition()` logic, verify data

### Issue: Confetti lag
**Solution**: Reduce particle count from 50 to 30

### Issue: Level up animation stuck
**Solution**: Ensure `closeLevelUp()` is callable, check z-index

---

## Code Quality

### Best Practices Followed
- ✅ Modular manager classes
- ✅ Clear function naming
- ✅ Comprehensive comments
- ✅ Efficient DOM manipulation
- ✅ Event cleanup
- ✅ Memory management
- ✅ Error handling
- ✅ User preference persistence

### Areas for Improvement
- Unit tests for manager classes
- E2E tests for user flows
- Performance profiling
- Accessibility audit
- Code splitting for large functions

---

## Deployment Checklist

- [x] All manager classes initialized
- [x] All render functions called
- [x] Event listeners attached
- [x] CSS animations tested
- [x] Sound effects tested
- [x] LocalStorage persistence verified
- [x] Cross-browser compatibility checked
- [x] Mobile responsiveness verified
- [x] Performance acceptable
- [x] No console errors

---

## Support & Maintenance

### Regular Tasks
- Monitor localStorage size
- Update achievement conditions
- Add new challenges periodically
- Update motivational messages
- Refresh equipment rewards

### Seasonal Updates
- Holiday-themed achievements
- Seasonal weather icons
- Special event challenges
- Limited-time equipment

---

**Last Updated**: January 28, 2026
**Version**: 1.0.0
**Maintainer**: PMP Learning Game Development Team
