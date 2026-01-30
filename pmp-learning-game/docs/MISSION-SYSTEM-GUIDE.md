# 🗺️ PMP Summit Quest - Mission System Implementation Guide

## Overview

The PMP learning game has been transformed into an **8-bit mountain hiking adventure** called "PMP Summit Quest". Students climb through 7 missions from base camp to summit, mastering all PMP exam content along the way.

## 🎨 Visual Theme

### Color Palette
- **Deep Blue** (`#2E5266`) - Primary mountain color, headers, emphasis
- **Gray Blue** (`#6E8898`) - Secondary elements, borders
- **Mountain Green** (`#87A96B`) - Success states, progress indicators
- **Gold** (`#FFD93D`) - Achievements, completed missions, highlights
- **Snow** (`#F0F4F8`) - Light backgrounds
- **Sky** (`#7FA7C0`) - Gradient backgrounds

### Design Style
- **8-bit/Pixel Art Aesthetic** - Retro gaming feel
- **Mountain Path Visualization** - Vertical progression from base to summit
- **Weather/Terrain Indicators** - Visual context for each mission
- **Character Progress** - Player advancement through the mountain

## 📁 File Structure

```
pmp-learning-game/
├── index.html                          # Main app with mission system
├── data/
│   ├── missions.json                   # Mission structure and content
│   ├── flashcards-mapped.json         # Flashcards mapped to tasks
│   ├── formulas.json                   # Formula reference
│   └── exam-content-outline.json      # Exam structure reference
├── MISSION-SYSTEM-GUIDE.md            # This file
└── PROJECT_SUMMARY.txt                # Overall project documentation
```

## 🗺️ Mission Structure

### 7 Missions to Summit

1. **🥾 Trail Head - Foundation Training** (0m → 500m)
   - 12 Principles, 8 Domains, Ethics, Exam Strategy
   - Unlocked by default
   - Reward: 500 XP + Trail Blazer badge

2. **🌲 Forest Path - Domain I: People** (500m → 1500m)
   - 14 tasks covering team leadership and stakeholder management
   - 33% of exam content
   - Reward: 2000 XP + Forest Guide badge

3. **⛰️ Rocky Slopes - Domain II: Process** (1500m → 2500m)
   - 17 tasks covering technical project processes
   - 41% of exam content (HIGHEST)
   - Reward: 2500 XP + Mountain Climber badge

4. **🏔️ High Altitude - Domain III: Business Environment** (2500m → 3500m)
   - 4 tasks covering strategy and organizational context
   - 26% of exam content (MAJOR 2026 FOCUS)
   - Reward: 1500 XP + Peak Challenger badge

5. **🌄 Integration Ridge - Agile & Hybrid Mastery** (3500m → 4000m)
   - Agile Manifesto, Scrum, Kanban, Hybrid approaches
   - Appears in 60% of exam questions
   - Reward: 2000 XP + Ridge Walker badge

6. **🧗 Practice Cliffs - Training Ground** (4000m → 4500m)
   - Timed mini-tests, weak area drills, formula mastery
   - Build speed and confidence
   - Reward: 2500 XP + Cliff Conqueror badge

7. **🎯 Final Ascent - Exam Simulation** (4500m → 5000m - SUMMIT!)
   - 3 full-length mock exams (185 questions each)
   - Readiness assessment
   - Reward: 5000 XP + Summit Master badge

## 🎮 Game Mechanics

### XP and Leveling System

**Total XP Available**: ~20,000 XP across all missions

**Level Progression** (10 levels):
```
Level 1: PMP Aspirant 📝         (0 XP)
Level 2: Knowledge Seeker 📚     (500 XP)
Level 3: Task Tackler 🎯         (1,500 XP)
Level 4: Concept Master 💡       (3,000 XP)
Level 5: People Leader 👥        (5,000 XP)
Level 6: Process Pro ⚙️          (7,500 XP)
Level 7: Business Strategist 💼  (10,000 XP)
Level 8: Domain Champion 🏆      (13,000 XP)
Level 9: Exam Ready 🎓           (16,000 XP)
Level 10: PMP Master ✨          (20,000 XP)
```

**XP Sources**:
- Flashcard reviewed correctly: +10 XP
- Quiz question correct: +25 XP
- Task completed: +50 XP
- Mission completed: +500 to +2500 XP (varies by mission)

### Progressive Unlocking

- **Mission 1** unlocked by default
- **Missions 2-4** unlock sequentially (complete previous mission)
- **Mission 5** requires completion of Missions 2, 3, and 4
- **Mission 6** requires Mission 5
- **Mission 7** requires Mission 6

### Task/Topic Waypoints

Each mission contains multiple waypoints:
- **Topics** (for foundation/knowledge missions)
- **Tasks** (for domain-based missions)

Each waypoint includes:
- Learning content
- Related flashcards
- Task-specific quiz
- Exam tips

## 🎯 User Interface Components

### 1. Mission Map (Default View)

**Features**:
- XP bar showing current level and progress
- Vertical mountain path with all 7 missions
- Mission nodes showing:
  - Icon, name, altitude
  - Terrain type
  - Progress percentage
  - Lock/unlock status
  - Completion status
- Path connectors between missions
- Click to enter unlocked missions

**Visual Indicators**:
- 🔒 Locked missions (grayed out, not clickable)
- ✅ Completed missions (gold border, gold highlight)
- Regular unlocked missions (white background, blue border)

### 2. Mission Detail View

**Components**:
- Mission header with stats:
  - Altitude range
  - Progress percentage
  - Estimated time
  - XP reward
- List of all tasks/topics (waypoints)
- Each waypoint shows:
  - Icon/waypoint marker
  - Title and description
  - Exam tip
  - Completion status
- Back to map button

### 3. Task Detail View

**Three Tabs**:

**📚 Learn Tab**:
- Task description
- Exam strategy tips
- Mark complete button

**🃏 Flashcards Tab**:
- Shows number of related flashcards
- Button to start flashcard review
- Integrates with existing flashcard system

**📝 Quiz Tab**:
- Task-specific quiz
- Specified number of questions
- Integrates with existing quiz system

### 4. Enhanced Dashboard

**New Features**:
- Current mission progress card
- Quick stats:
  - Missions completed
  - Missions unlocked
  - Total missions
- Click to continue active mission
- Shows summit reached message when all complete

### 5. Navigation Sidebar

**Updated Menu** (in order):
1. 🗺️ **Mission Map** (default view)
2. 📊 **Dashboard** (stats overview)
3. 🃏 **Flashcards** (spaced repetition)
4. 📝 **Quiz** (practice modes)
5. 📐 **Formulas** (reference guide)
6. 🎯 **Mock Exam** (full simulations - locked until Mission 6)
7. 📈 **Progress** (achievements & analytics)

### 6. Mock Exam Page

- Locked until Mission 6 complete
- Shows what to expect:
  - 185 questions
  - 240 minutes (4 hours)
  - Domain distribution
  - 75% pass score

## 🏆 Achievement System

**26 Achievements** across categories:

### Foundation (5)
- First Step (review first flashcard)
- Trail Blazer (complete Mission 1)
- Dedicated (10 flashcards)
- Scholar (50 flashcards)

### Mission Completion (6)
- One for each mission completion (Missions 2-7)

### Quiz Excellence (3)
- First quiz completed
- 5 quizzes completed
- Perfect score (100%)

### Level Milestones (4)
- Level 3, 5, 7, and 10 reached

### Streak Dedication (3)
- 3 day, 7 day, 30 day streaks

### XP Collection (3)
- 1,000 XP, 5,000 XP, 10,000 XP

### Ultimate (2)
- Summit Reached (all 7 missions complete)
- PMP Master (Level 10)

## 💾 Data Structure

### AppState (JavaScript)

```javascript
AppState = {
    missions: null,                    // Loaded from missions.json
    flashcards: [],                    // Loaded from flashcards-mapped.json
    formulas: [],                      // Loaded from formulas.json
    userData: {
        xp: 0,                        // Total XP earned
        level: 1,                     // Current level (1-10)
        points: 0,                    // Legacy points (kept for compatibility)
        streak: 0,                    // Daily study streak
        missionProgress: {},          // Progress per mission
        taskProgress: {},             // Completion status per task
        unlockedMissions: ['m1'],     // Array of unlocked mission IDs
        completedMissions: [],        // Array of completed mission IDs
        flashcardProgress: {},        // Leitner box system
        quizHistory: [],              // All quiz attempts
        achievements: []              // Unlocked achievements
    }
}
```

### MissionManager Class

```javascript
class MissionManager {
    loadMissions()                     // Load missions.json
    getMission(missionId)              // Get mission by ID
    isMissionUnlocked(missionId)       // Check unlock status
    isMissionCompleted(missionId)      // Check completion status
    getMissionProgress(missionId)      // Calculate % complete
    unlockMission(missionId)           // Unlock a mission
    completeMission(missionId)         // Complete mission + award XP
    completeTask(taskId)               // Complete task + check mission
    getTasksByMission(missionId)       // Get all tasks/topics
    getRelatedFlashcards(task)         // Get mapped flashcards
}
```

## 🔗 Integration Points

### Existing Systems Maintained

1. **Flashcard System**
   - Leitner spaced repetition (5 boxes)
   - +10 XP per correct review
   - Filter by box level
   - Can filter by task (new)

2. **Quiz System**
   - 3 modes: Sprint (timed), Domain Focus, Quick Quiz
   - +25 XP per correct answer
   - Explanations shown
   - Results page with stats

3. **Formula Reference**
   - Searchable formula list
   - Organized by category
   - Expandable sections

4. **Progress Tracking**
   - All data in localStorage
   - Export/import functionality
   - Reset option
   - Chart visualization

5. **Daily Goals**
   - Review 10 flashcards
   - Complete a quiz
   - Review formulas

## 🚀 Usage Flow

### New User Journey

1. **Start**: Opens app → sees Mission Map
2. **Mission 1 Unlocked**: Clicks Mission 1 (Foundation)
3. **Explore Topics**: Sees 4 topics (Principles, Domains, Ethics, Exam Strategy)
4. **Learn**: Clicks topic → reads content → reviews flashcards → takes quiz
5. **Complete**: Marks topics complete → earns 50 XP per topic
6. **Mission Complete**: All topics done → +500 XP → Mission 2 unlocks
7. **Progress**: Level up messages, XP bar fills, achievements unlock
8. **Climb**: Continue through Missions 2-7 to summit

### Returning User

1. Opens app → sees Mission Map
2. Dashboard shows current active mission
3. Can click to continue or explore other features
4. Daily streak tracked
5. Can review any completed mission

## 🎨 Visual Enhancements

### CSS Animations
- **fadeInUp**: Mission nodes appear
- **slideInRight**: Waypoint cards slide in
- **pulse**: Warning animations
- **fadeIn**: General content transitions

### Hover Effects
- Mission nodes lift on hover
- Waypoint cards slide right
- Buttons have lift effect
- Color transitions

### Progress Indicators
- Circular XP bar at top
- Progress bars in mission nodes
- Completion checkmarks
- Lock icons for locked content

## 📱 Responsive Design

- **Desktop**: Full sidebar navigation, wide mission cards
- **Tablet**: Collapsible sidebar, adaptive grid layouts
- **Mobile**: Hidden sidebar (can toggle), stacked layouts

## 🔧 Technical Implementation

### Key Functions

```javascript
// Rendering
renderMissionMap()              // Render all missions on map
showMissionDetail(missionId)    // Show mission detail view
renderMissionWaypoints(mission) // Render tasks/topics
showTaskDetail(missionId, taskId) // Show task detail view
renderTaskContent(task)         // Populate task tabs

// Progress Management
markTaskComplete(taskId)        // Complete a task
addXP(amount)                   // Award XP and check level up
updateXPBar()                   // Update XP display
updateDashboardMissionSummary() // Update dashboard stats

// Navigation
navigateTo(pageName)            // Switch between pages
setupEventListeners()           // Bind all event handlers

// Data Management
loadUserData()                  // Load from localStorage
saveUserData()                  // Save to localStorage
checkDailyReset()               // Reset daily counters
```

### Event Handlers

- Navigation links (sidebar)
- Mission node clicks (map)
- Waypoint clicks (mission detail)
- Tab switches (task detail)
- Back buttons (navigation)
- Complete buttons (mark progress)

## 🎯 Learning Pedagogy

### Spaced Repetition
- Flashcards use Leitner system
- Review intervals increase with success
- 5 boxes: New → Learning → Review → Mastered → Expert

### Contextual Learning
- Tasks organized by exam domains
- Flashcards mapped to specific tasks
- Exam tips for each task
- Formula reference always accessible

### Active Recall
- Quizzes test knowledge
- Scenario-based questions
- Immediate feedback with explanations
- Multiple quiz modes for variety

### Gamification
- XP and levels create progression sense
- Achievements provide milestones
- Mission structure creates clear path
- Daily streaks encourage consistency

### Mastery-Based Progression
- Must complete tasks to progress
- Domain assessments validate learning
- Mock exams simulate real conditions
- Readiness assessment before exam

## 📊 Analytics Tracked

- XP earned per session
- Time spent per mission
- Task completion rate
- Quiz accuracy per domain
- Flashcard mastery progression
- Study streak maintenance
- Achievement unlocks
- Level progression timeline

## 🔮 Future Enhancements

### Planned Features (Not Yet Implemented)

1. **Adaptive Learning**
   - Identify weak areas
   - Recommend specific tasks
   - Adjust difficulty dynamically

2. **Social Features**
   - Leaderboards
   - Study groups
   - Peer challenges

3. **Advanced Analytics**
   - Predictive readiness score
   - Time-to-exam calculator
   - Weak area heat maps

4. **Content Expansion**
   - Video lessons per task
   - Audio summaries
   - Downloadable cheat sheets
   - Real exam questions (if legally obtained)

5. **Mobile App**
   - Native iOS/Android apps
   - Offline mode
   - Push notifications for study reminders

## 🐛 Known Limitations

1. **Flashcard-Task Mapping**: Not all flashcards mapped yet (287/300 mapped)
2. **Quiz Generation**: Uses flashcard-based questions (not scenario-rich yet)
3. **Mock Exams**: Placeholder only (need 555 unique questions)
4. **Formula Practice**: Basic reference only (no interactive calculations)
5. **Domain Assessments**: Not yet implemented

## 📖 User Guide Summary

### For Students

**Getting Started**:
1. Open the app
2. You'll see the Mountain Path with Mission 1 unlocked
3. Click Mission 1 to start your foundation training

**Learning Workflow**:
1. Click a mission → see all tasks/topics
2. Click a task → learn content → review flashcards → take quiz
3. Mark complete to earn XP
4. Complete all tasks → mission complete → next mission unlocks

**Building Consistency**:
- Study daily to maintain streak
- Complete daily goals (visible on Dashboard)
- Review flashcards in different boxes
- Take quizzes in different modes

**Tracking Progress**:
- XP bar shows level progress
- Mission Map shows overall completion
- Dashboard shows current mission
- Progress page shows achievements

**Preparing for Exam**:
- Complete Missions 1-5 for content mastery
- Mission 6 for speed and confidence
- Mission 7 for full exam simulations
- Check readiness assessment

### For Instructors/Reviewers

**Data Files**:
- `missions.json`: Mission structure (can edit)
- `flashcards-mapped.json`: Learning content (can expand)
- `formulas.json`: Formula reference (complete)

**Customization Points**:
- Missions (add/remove/reorder)
- Tasks per mission (edit content)
- XP rewards (adjust difficulty)
- Level thresholds (change progression)
- Achievements (add new ones)

**Analytics**:
- All data in localStorage
- Can export for analysis
- Quiz history tracked
- Flashcard progress tracked

## 🎓 Pedagogical Alignment

### Bloom's Taxonomy

**Remember** (Mission 1): Foundation concepts
**Understand** (Missions 2-4): Domain knowledge
**Apply** (Mission 5): Agile/Hybrid scenarios
**Analyze** (Mission 6): Practice problems
**Evaluate** (Mission 7): Mock exam decisions
**Create** (Real Exam): Original solutions

### Adult Learning Principles

- **Self-directed**: Choose learning path
- **Experiential**: Active practice, not passive reading
- **Problem-centered**: Real exam scenarios
- **Ready to learn**: Mission structure shows why
- **Internally motivated**: Gamification drives engagement

## ✅ Success Metrics

**Student is Ready When**:
- All 7 missions complete
- Level 9 or 10 reached
- 75%+ on both Mock Exams 1 & 2
- All domains above 70%
- Weak areas identified and addressed
- Confident in exam strategies

**App is Successful When**:
- Users maintain 7+ day streaks
- 80%+ mission completion rate
- 70%+ average quiz scores
- Positive user feedback
- Real exam pass rate improvement

---

## 📞 Support

For questions about the mission system:
- Review this guide
- Check `PROJECT_SUMMARY.txt` for overall project info
- Check `data/IMPLEMENTATION-GUIDE.md` for data structure details
- Examine `missions.json` for mission configuration

**Version**: 1.0.0
**Last Updated**: 2026-01-28
**Author**: Claude (Anthropic) + User Collaboration
