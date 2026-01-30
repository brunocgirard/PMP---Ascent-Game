# Product Requirements Document (PRD)
## Ascent to PMP: The Summit Quest

**Product Name**: Ascent to PMP: The Summit Quest
**Version**: 2.0
**Document Date**: 2026-01-29
**Product Owner**: Learning Platform Development Team
**Target Launch**: Ready for user testing

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Vision & Goals](#vision--goals)
3. [Target Users](#target-users)
4. [Product Overview](#product-overview)
5. [Game Design & Theme](#game-design--theme)
6. [Functional Requirements](#functional-requirements)
7. [Content Requirements](#content-requirements)
8. [Gamification Mechanics](#gamification-mechanics)
9. [Learning Progression System](#learning-progression-system)
10. [Technical Requirements](#technical-requirements)
11. [Success Metrics](#success-metrics)
12. [Development Roadmap](#development-roadmap)
13. [Research & References](#research--references)

---

## Executive Summary

**Ascent to PMP: The Summit Quest** is a gamified, mountain-climbing-themed educational platform designed to prepare users for the PMP (Project Management Professional) certification exam. Inspired by classic RPG mechanics (Dragon Quest style) and modern educational game design, the platform transforms the challenging 8-12 week study journey into an engaging adventure where learners progressively climb a metaphorical mountain, unlocking knowledge and building skills until they reach the summit: PMP certification.

**Core Problem**: Traditional PMP exam preparation is tedious, overwhelming (110,000+ words of content), and has low completion rates (~30% of students complete their courses).

**Our Solution**: Transform learning into a progressive mountain-climbing adventure with:
- 7 mission "altitude zones" from Base Camp (0m) to Summit (5,000m)
- RPG-style skill tree progression with unlockable content
- 3-phase learning loop: Learn → Practice (Flashcards) → Test (Quiz)
- Gamification proven to increase retention by 40% and completion by 50%
- Adaptive difficulty with AI-driven recommendations

**Target Outcome**: Users achieve 75%+ on PMP exam simulation and feel confident to pass the real exam.

---

## Current State vs. Vision

### What Exists Today (v1.0 - Web App - 70% Complete)

**Functional Learning Platform:**
- ✅ 7-mission progression system (Base Camp → Summit)
- ✅ 338 flashcards with spaced repetition and domain mapping
- ✅ 1,159 practice quiz questions across all PMP domains
- ✅ Full 185-question mock exam simulator (175 scored + 10 pretest)
- ✅ XP/leveling system with achievement tracking
- ✅ Analytics dashboard with performance insights
- ✅ Mission gating (70% pass requirement to unlock next)
- ✅ Progress export/import functionality

**Current Implementation:**
- Clean web interface with tab-based navigation
- Sidebar mission selector with emoji icons (🏕️ 🥾 🌲 ⛰️ 🏔️ 🌄 🧗 🎯)
- 3-tab learning flow: Learn | Flashcards | Quiz
- Modal dialogs for content display
- LocalStorage for progress persistence
- Vanilla HTML/CSS/JavaScript (525 KB, 7,553 lines)

**What's Working Well:**
- ✅ Content is comprehensive and well-mapped to PMP exam outline
- ✅ Quiz generation is dynamic and adaptive
- ✅ Progress tracking is reliable
- ✅ Diagnostic tests all pass
- ✅ Gamification elements increase engagement

**Current Limitations:**
- ⚠️ "Gamified webpage" not true "game experience"
- ⚠️ Static mission list rather than explorable map
- ❌ No character sprite or visual avatar
- ❌ No animations or screen transitions
- ❌ No tile-based movement or exploration
- ❌ No sound effects or background music
- ❌ Quiz interface is standard forms, not battle-screen style
- ❌ Limited mobile responsiveness

### The Vision (v2.0 - True Game Experience)

**Transform from "gamified learning website" to "learning adventure game":**

**Dragon Quest-Style Gameplay:**
- 🎮 **Overworld Map**: Top-down pixel art mountain map you can explore
- 🏃 **Character Sprite**: Player avatar with 4-direction walking animation (16x16 or 32x32 pixels)
- 🎨 **8-bit Pixel Art**: NES/SNES era visual style with mountain terrain, camps, trails
- ⌨️ **Tile-Based Movement**: Arrow keys/WASD to move character around map
- 💥 **Battle Transitions**: Screen swipe effect when entering quiz "battles"
- 🎵 **Chiptune Audio**: 8-bit background music and sound effects
- 📜 **Game Menus**: RPG-style menu system with cursor navigation
- ✨ **Animations**: Walking cycles, climbing animations, victory celebrations
- 🗺️ **Progressive Exploration**: Map areas unlock as you climb higher

**Visual Progression:**
- Start at pixel art base camp with tents and campfire
- Walk your character up mountain trails (visible elevation gain)
- Encounter "study points" (glowing book icons) for learning content
- NPCs (mentor, other climbers) provide hints and encouragement
- Each mission is a distinct visual zone (forest, rocky terrain, snow)
- Summit shows panoramic pixel art vista

**Quiz as Battle System:**
- Quiz triggers show battle-screen transition effect
- Battle UI with PMP question in dialog box
- Answer selection uses RPG cursor (not web buttons)
- Correct answer plays victory fanfare, shows XP gain animation
- Wrong answer shows damage/retry mechanics
- Return to overworld after battle completion

**Example Player Flow:**
```
1. Player starts at Base Camp (pixel art campfire scene)
2. Character sprite appears, player uses arrow keys to explore
3. Walk up mountain trail (tile-by-tile movement)
4. Encounter Study Point (glowing book icon)
5. Press ENTER → Battle transition effect
6. Quiz appears in battle-screen format
7. Answer question using RPG cursor
8. Victory fanfare → XP animation → return to overworld
9. Character is now on higher terrain (progress visualized)
10. Continue climbing to unlock new zones
```

**Technology Shift:**
- **From**: Vanilla HTML/CSS/JS webpage
- **To**: Phaser 3 game engine with:
  - Tiled Map Editor for level design
  - Sprite animation system
  - Physics/collision detection
  - Scene management (Title, Overworld, Battle, Menu, Victory)
  - Audio manager for music/SFX

**Why This Matters:**
- Current implementation has ~70% game *content* but only ~20% game *feel*
- Users expect "game experience" based on theme and marketing
- True game mechanics proven to increase engagement by additional 30-50%
- Competitors (Duolingo, Habitica) succeed by being actual games, not gamified websites

---

## Vision & Goals

### Product Vision

> "Every aspiring project manager deserves an engaging, effective, and enjoyable path to PMP certification. We transform the daunting climb to certification into an epic adventure where every step forward builds competence, confidence, and career advancement."

### Primary Goals

1. **Learning Effectiveness**: Achieve 40% higher knowledge retention vs. traditional study methods
2. **Engagement**: Maintain 80%+ daily return rate during active study period (30+ days)
3. **Completion**: 70%+ of users complete all 7 missions (vs. industry 30% average)
4. **Certification Success**: 85%+ of users who complete the program pass PMP exam on first attempt
5. **User Satisfaction**: Net Promoter Score (NPS) of 50+

### Secondary Goals

1. Reduce average study time from 200 hours to 150 hours through efficient learning
2. Create reusable framework for other certification training (CAPM, ACP, etc.)
3. Build community of successful PMPs who recommend the platform

---

## Target Users

### Primary Persona: "Sarah, The Aspiring PM"

**Demographics**:
- Age: 28-42
- Role: Senior team lead, analyst, or coordinator seeking PM promotion
- Experience: 3-5 years in project involvement
- Education: Bachelor's degree (required for PMP)
- Location: Global (primarily US, India, Europe)

**Goals**:
- Pass PMP exam on first attempt
- Get promoted to PM role with 15-25% salary increase
- Gain confidence in project management knowledge
- Study efficiently while balancing work/life

**Pain Points**:
- Overwhelmed by volume of content (3 domains, 35 tasks, 1000+ pages)
- Bored by traditional textbook study
- Struggles to maintain motivation for 8-12 weeks
- Uncertain if they're "ready" for the exam
- Limited time (1-2 hours/day max)

**Behaviors**:
- Prefers mobile/web learning over books
- Uses gamification apps (Duolingo, Habitica)
- Motivated by progress visualization
- Learns best through scenarios vs. theory
- Likes achievement badges and streaks

### Secondary Persona: "Mike, The Experienced PM"

**Demographics**:
- Age: 35-50
- Role: Active PM needing PMP for career advancement
- Experience: 5+ years managing projects
- Situation: Employer requires certification or applying for senior PM roles

**Goals**:
- Validate existing knowledge with certification
- Fill knowledge gaps efficiently
- Prepare for exam in 4-6 weeks (shorter timeline)

**Needs**:
- Skip content they already know
- Focus on exam-specific knowledge
- Quick assessment of weak areas
- Intensive practice mode

---

## Product Overview

### High-Level Concept

**Genre**: Educational RPG / Adventure Game
**Theme**: Mountain Climbing Expedition
**Style**: 8-bit retro pixel art (nostalgic, approachable, non-intimidating)
**Platform**: Web-based (desktop + mobile responsive)
**Core Loop**: Learn → Practice → Test → Progress → Unlock → Repeat

### Mountain Climbing Metaphor

The PMP learning journey is framed as climbing a mountain:

```
🏔️ SUMMIT (5,000m) - PMP Certification
         ⛰️
        /  \
       /    \
🎯 Mission 7: Final Ascent (4,900m) - Mock Exams
🧗 Mission 6: Practice Cliffs (4,500m) - Intensive Drills
🌄 Mission 5: Agile Summit Push (4,000m) - Agile/Hybrid Mastery
🏔️ Mission 4: Business Environment Ridge (3,500m) - Domain 3
⛰️ Mission 3: Process Mountain (2,500m) - Domain 2
🌲 Mission 2: People Peak (1,500m) - Domain 1
🥾 Mission 1: Foundation Training (500m) - Principles & Basics
🏕️ BASE CAMP (0m) - Starting Point
```

### Core Game Mechanics

**1. Mission-Based Progression** (Like Dragon Quest chapters)
- 7 sequential missions, each unlocked after completing previous
- Each mission = 1 major learning domain or theme
- Visual progression up the mountain with altitude markers

**2. Three-Phase Learning Cycle** (Per topic/task)
```
Phase 1: LEARN 📖
- Read comprehensive lesson content (2,000-3,000 words)
- Watch embedded diagrams/charts
- Take notes (optional notepad feature)

Phase 2: PRACTICE 🎴
- Flashcard review with spaced repetition (Leitner system)
- Confidence rating: Hard / Medium / Easy
- Cards move between 5 boxes based on performance

Phase 3: TEST ✅
- 10-15 question quiz on topic
- Must score 75%+ to complete topic
- Immediate feedback with detailed explanations
```

**3. RPG-Style Progression**
- **XP System**: Earn 50-200 XP per completed topic/activity
- **Levels**: 10 levels from "PMP Aspirant" to "PMP Master" (0-20,000 XP)
- **Achievements**: 20+ badges (First Steps, Week Warrior, Domain Champion, etc.)
- **Stats Dashboard**: Track accuracy, streak, study time, weak areas

**4. Adaptive Difficulty**
- System tracks performance per domain and task
- Identifies weak areas (<75% accuracy)
- Recommends targeted practice
- Adjusts quiz difficulty based on performance

---

## Game Design & Theme

### Visual Design (8-bit Mountain Climbing)

**Inspiration**:
- Dragon Quest (NES/SNES era) for UI simplicity and charm
- Celeste for mountain climbing theme and achievement feel
- Duolingo for progress gamification

**Color Palette**:
- Primary: Mountain blues (#2C5F8D), Forest greens (#2D5016), Snow whites (#F0F8FF)
- Accent: Gold (#FFD700) for achievements, Red (#DC3545) for alerts
- Background: Gradient sky (light blue → darker blue with altitude)

**Key Visual Elements**:

1. **Mission Map Screen**
   - Vertical scrolling mountain illustration
   - 7 mission markers at different altitudes
   - Player character sprite at current position
   - Weather effects (clear → cloudy → snow at summit)
   - Completion stars ⭐ on finished missions

2. **Character/Avatar**
   - Simple 8-bit hiker sprite
   - Customizable (basic: 3-4 character options)
   - "Levels up" visually: Novice backpack → Pro gear → Summit flag

3. **UI Elements**
   - Retro pixel font (Press Start 2P or similar)
   - Card-based layouts for content
   - Progress bars with pixel borders
   - Tab navigation (Learn | Flashcards | Quiz)

4. **Animations**
   - Character walks up mountain on completion
   - Star burst on topic completion
   - Level-up fanfare with particle effects
   - Achievement badge "unlock" animation

### Audio Design (Optional - Phase 2)

**8-bit Sound Effects**:
- Topic complete: Ascending chime (♪ do-mi-sol)
- Quiz correct: Success ping
- Quiz wrong: Error buzz
- Level up: Fanfare (8-bit celebration)
- Mission complete: Victory theme (15 sec melody)

**Background Music** (toggleable):
- Base Camp: Calm acoustic loop
- Mid-Mountain: Upbeat adventure theme
- Summit: Triumphant orchestral

---

## Visual & Gameplay Requirements (v2.0 Game Version)

### Art Style Specifications

**Pixel Art Standards:**
- **Tile Size**: 16x16 pixels (NES style) or 32x32 pixels (SNES style)
- **Color Palette**: Limited to 64 colors max (retro aesthetic)
- **Animation Frame Rate**: 8-12 FPS for character animations
- **Screen Resolution**: 1280x720 base (scaled to fit display)

**Character Sprite Requirements:**
- **Size**: 16x16 or 32x32 pixel sprite
- **Animations Required**:
  - Idle (2-4 frames, breathing animation)
  - Walk Down (4 frames)
  - Walk Up (4 frames)
  - Walk Left (4 frames)
  - Walk Right (4 frames)
  - Celebrate/Victory (6-8 frames)
  - Climb (4 frames, optional)
- **Costume Progression**: 3 visual upgrades (Beginner → Intermediate → Expert gear)

**Environment Art:**
- **Base Camp (Mission 1)**: Tents, campfire, training dummies, mentor NPC
- **Forest Trail (Mission 2-3)**: Trees, rocks, path markers, occasional wildlife
- **Mountain Terrain (Mission 4-5)**: Rocky slopes, boulders, narrow paths, cliffs
- **Snow Zone (Mission 6)**: Snow-covered ground, ice patches, wind effects
- **Summit (Mission 7)**: Peak marker, flag, panoramic vista, victory pedestal

**UI Elements (Pixel Art Style):**
- Retro pixel font (Press Start 2P, Silkscreen, or custom)
- 8-bit style borders and frames
- Battle-screen dialog boxes (Dragon Quest style)
- Menu cursor (animated arrow or hand icon)
- HP/XP bars with pixel styling
- Achievement badges (32x32 pixel icons)

### Gameplay Mechanics (v2.0)

**Movement System:**
- **Tile-Based Movement**: Character moves in discrete tiles (not smooth scrolling initially)
- **Controls**:
  - Arrow Keys or WASD: Move character (4 directions)
  - ENTER or SPACE: Interact with objects/NPCs
  - ESC or M: Open menu
  - TAB: Toggle map view
- **Collision Detection**: Cannot walk through mountains, rocks, or NPCs
- **Camera**: Follows character with bounds (doesn't show off-map areas)

**Interaction System:**
- **Study Points**: Glowing book icons on map, triggers learning content
- **Quiz Battles**: Monster/obstacle icons, triggers quiz in battle format
- **NPCs**: Mentor character, other climbers, provide hints/encouragement
- **Signs**: Readable text providing tips or lore
- **Checkpoints**: Rest areas where progress auto-saves

**Battle/Quiz System:**
- **Trigger**: Walk into quiz battle icon or complete study point
- **Transition**: Screen fade or swipe effect (1-2 second animation)
- **Battle Screen Layout**:
  - Question text in Dragon Quest-style dialog box
  - Answer options displayed as menu selections
  - Use arrow keys + ENTER to select (not mouse clicks)
  - Character sprite on left, "question monster" on right (optional)
- **Feedback**:
  - Correct answer: Victory animation, XP gain counter, positive SFX
  - Wrong answer: Damage animation, lose energy/retry, negative SFX
  - Post-battle: Return to overworld with character position updated

**Progression Mechanics:**
- **Visual Altitude Gain**: Character position on map moves upward with each mission
- **Area Unlocking**: New map zones become accessible (fog clears, paths open)
- **Equipment Upgrades**: Character sprite visually improves (better backpack, gear)
- **Skill Tree** (optional): Unlock study boosters (faster XP, hint system, etc.)

**Game Screens/Scenes:**

1. **Title Screen**
   - "Ascent to PMP" logo with pixel art mountain background
   - Menu: New Game | Continue | Settings | Credits
   - Animated clouds/birds in background

2. **Overworld Scene** (Main Gameplay)
   - Top-down view of mountain map
   - Character sprite that player controls
   - NPCs, study points, battle triggers
   - UI overlay: HP/XP bar, current mission, mini-map

3. **Battle Scene** (Quiz Interface)
   - Battle background (mountain cliff, cave, etc.)
   - Character sprite vs. "challenge" sprite
   - Question dialog box
   - Answer selection menu

4. **Menu Scene**
   - Stats (Level, XP, Missions Complete)
   - Inventory (Flashcards collected)
   - Settings (Volume, Controls, Display)
   - Save/Load

5. **Victory Scene**
   - Mission complete fanfare
   - Stats summary (questions correct, XP earned)
   - Achievement unlocked notifications
   - "Continue to Next Mission" button

### Audio Requirements (v2.0)

**Music Tracks Needed:**
- Title screen theme (looping, 1-2 min)
- Base Camp BGM (calm, encouraging)
- Forest/Trail BGM (adventure, upbeat)
- Mountain/Snow BGM (intense, challenging)
- Battle music (quiz encounters, tense)
- Victory fanfare (mission complete, 15-30 sec)
- Summit theme (triumphant, emotional)

**Sound Effects:**
- Footstep sounds (4 variations: grass, rock, snow, wood)
- Menu cursor move (tick sound)
- Menu select (confirmation beep)
- Correct answer (success chime, ♪ do-mi-sol)
- Wrong answer (error buzz)
- XP gain (coins/points collecting sound)
- Level up (triumphant fanfare)
- Achievement unlock (special jingle)
- Door open/close (entering buildings)
- NPC dialog beep (text scroll effect)

**Audio Settings:**
- Master volume control
- Music volume (separate)
- SFX volume (separate)
- Mute all option
- Audio persists across sessions

### Asset Requirements Summary

**To Create or Acquire:**
- Character sprite sheet (16x16 or 32x32, ~40 frames total)
- Tileset (terrain: grass, rock, snow, paths, water) - 64+ tiles
- NPC sprites (mentor, climbers, wildlife) - 3-5 characters
- UI elements (borders, buttons, icons) - 20+ elements
- Battle backgrounds - 7 variations
- Achievement badge icons - 20+ badges
- Music tracks - 7 tracks
- Sound effects - 15+ SFX

**Sources:**
- Commission pixel artist (recommended for cohesive style)
- Use free/paid asset packs (itch.io, OpenGameArt)
- Create in-house using Aseprite or Pixaki
- AI-generated with post-processing (less recommended)

---

## Functional Requirements

### FR-1: User Onboarding

**FR-1.1**: First-Time Tutorial
- **MUST**: Show tutorial overlay on first visit
- **MUST**: Explain mission structure, 3-phase learning, and progression
- **MUST**: Allow user to set exam date and daily study goal
- **SHOULD**: Include skip option for returning users
- **SHOULD**: Save tutorial completion to localStorage

**FR-1.2**: Goal Setting
- **MUST**: Prompt user to select PMP exam date (calendar picker)
- **MUST**: Calculate recommended daily study time based on date
- **SHOULD**: Allow custom daily goal (15 min to 3 hours)

### FR-2: Mission System

**FR-2.1**: Mission Map
- **MUST**: Display all 7 missions with altitude markers
- **MUST**: Show current position (player character sprite)
- **MUST**: Indicate completion status (locked 🔒, in progress 🔄, complete ⭐)
- **MUST**: Unlock next mission only after previous 100% complete
- **SHOULD**: Show percentage completion per mission (e.g., "Mission 2: 8/14 tasks")

**FR-2.2**: Mission Structure
```
Mission 1: Foundation Training
├── Topic: 12 Principles (Learn + Flashcards + Quiz)
├── Topic: 8 Performance Domains (Learn + Flashcards + Quiz)
├── Topic: Ethics & Professional Responsibility (Learn + Flashcards + Quiz)
└── Topic: Exam Strategy & Tips (Learn + Flashcards + Quiz)

Missions 2-4: Domain Tasks
├── Task 1: [Domain Task] (Learn + Flashcards + Quiz)
├── Task 2: [Domain Task] (Learn + Flashcards + Quiz)
└── ... (14 People, 17 Process, 4 Business tasks)

Mission 5: Agile/Hybrid Focus
├── Topic: Agile Manifesto (Learn + Flashcards + Quiz)
├── Topic: Scrum Framework (Learn + Flashcards + Quiz)
├── Topic: Kanban & Lean (Learn + Flashcards + Quiz)
├── Topic: Hybrid Approaches (Learn + Flashcards + Quiz)
└── Topic: Value Delivery (Learn + Flashcards + Quiz)

Mission 6: Practice Cliffs
├── Weak Area Drill (adaptive questions)
├── Timed Mini-Test (20Q, 30min)
├── Domain Drills (50Q per domain)
└── Formula Mastery (33 formulas)

Mission 7: Final Ascent
├── Mock Exam 1 (180Q, 240min)
├── Mock Exam 2 (180Q, 240min)
└── Mock Exam 3 (180Q, 240min)
```

**FR-2.3**: Topic Completion
- **MUST**: Mark topic complete when all 3 phases done (Learn read + Flashcards reviewed + Quiz passed at 75%+)
- **MUST**: Award XP on completion (50 XP for learning, 50 XP for flashcards, 100 XP for quiz pass)
- **MUST**: Unlock next topic/task sequentially within mission
- **SHOULD**: Allow revisiting completed topics

### FR-3: Learn Phase

**FR-3.1**: Content Display
- **MUST**: Render HTML-formatted educational content (2,000-3,000 words per topic)
- **MUST**: Include structured headings, bullet points, examples
- **MUST**: Support embedded images/diagrams (if available)
- **SHOULD**: Show estimated reading time (e.g., "~8 min read")
- **SHOULD**: Highlight key terms on hover/click

**FR-3.2**: Reading Tracking
- **MUST**: Detect scroll to bottom (content fully viewed)
- **MUST**: Enable "Mark as Complete" button only after scrolling to bottom
- **SHOULD**: Show reading progress indicator (e.g., "45% read")
- **SHOULD**: Save scroll position for resuming later

**FR-3.3**: Note-Taking (Nice-to-Have)
- **COULD**: Provide notepad sidebar for personal notes
- **COULD**: Save notes to localStorage per topic

### FR-4: Flashcard Phase

**FR-4.1**: Spaced Repetition System (Leitner 5-Box)
- **MUST**: Implement 5-box Leitner system
  - Box 1: New cards (review every session)
  - Box 2: Review every 2 days
  - Box 3: Review every 4 days
  - Box 4: Review every 7 days
  - Box 5: Mastered (review every 14 days)
- **MUST**: Move cards based on confidence rating:
  - Hard: Move back to Box 1
  - Medium: Stay in current box
  - Easy: Move up one box

**FR-4.2**: Flashcard Interaction
- **MUST**: Show question on front, answer on back (flip animation)
- **MUST**: Provide 3 confidence buttons: Hard | Medium | Easy
- **MUST**: Track card stats (times seen, accuracy, last seen date)
- **SHOULD**: Show progress (e.g., "Card 5 of 36")
- **SHOULD**: Shuffle card order within box

**FR-4.3**: Topic-Specific Filtering
- **MUST**: Show only flashcards relevant to current topic/task
- **MUST**: Use category mapping (e.g., topic "principles" → category "Principles")
- **MUST**: Fallback to domain/tag matching if no category match
- **SHOULD**: Show "No cards for review today" if all mastered

### FR-5: Quiz Phase

**FR-5.1**: Quiz Generation
- **MUST**: Generate 10-15 questions per topic from quiz bank
- **MUST**: Match questions to current topic/task ID
- **MUST**: Support multiple question types:
  - Multiple choice (single answer)
  - Multiple response (select all that apply)
  - Drag-and-drop matching
  - True/False
- **SHOULD**: Randomize question order
- **SHOULD**: Randomize answer choice order

**FR-5.2**: Quiz Interface
- **MUST**: Show one question at a time
- **MUST**: Provide "Next" and "Previous" navigation
- **MUST**: Allow flagging questions for review
- **MUST**: Show progress indicator (e.g., "Question 5 of 12")
- **SHOULD**: Show timer (optional, not enforced)
- **SHOULD**: Enable question navigator sidebar

**FR-5.3**: Quiz Scoring & Feedback
- **MUST**: Calculate score as percentage (correct / total)
- **MUST**: Require 75%+ to pass quiz
- **MUST**: Show immediate feedback per question (correct/incorrect + explanation)
- **MUST**: Display final score with breakdown by domain
- **MUST**: Allow retake if failed (<75%)
- **SHOULD**: Show time taken
- **SHOULD**: Highlight weak concepts for review

### FR-6: Mock Exam Simulator

**FR-6.1**: Exam Setup
- **MUST**: Simulate real PMP exam:
  - 180 questions (170 scored + 10 pretest, pretest not identified)
  - 240-minute timer (4 hours)
  - Domain distribution: 33% People, 41% Process, 26% Business
- **MUST**: Include 2 mandatory 10-minute breaks (after Q60 and Q120)
- **MUST**: Randomize questions from quiz bank
- **SHOULD**: Offer tutorial/practice mode (no timer)

**FR-6.2**: Exam Interface
- **MUST**: Full-screen mode (minimize distractions)
- **MUST**: Question navigator panel (show all 180 questions, flagged, answered status)
- **MUST**: Timer countdown (pause during breaks)
- **MUST**: "Submit Exam" with confirmation dialog
- **SHOULD**: Auto-save answers to localStorage every 30 seconds
- **SHOULD**: Resume capability if browser closes

**FR-6.3**: Exam Results
- **MUST**: Show overall score (e.g., "142/170 = 84%")
- **MUST**: Break down by domain (People: X%, Process: Y%, Business: Z%)
- **MUST**: Show pass/fail status (pass = 75%+)
- **MUST**: Provide detailed question review (correct answer + explanation)
- **SHOULD**: Identify weak tasks for targeted study
- **SHOULD**: Compare to previous mock exam attempts

### FR-7: Gamification Features

**FR-7.1**: XP & Leveling System
- **MUST**: Award XP for activities:
  - Complete learning content: 50 XP
  - Complete flashcard session: 50 XP
  - Pass quiz (75%+): 100 XP
  - Pass quiz (90%+): 150 XP (bonus)
  - Complete mission: 500 XP
  - Pass mock exam (75%+): 1,000 XP
- **MUST**: Define 10 levels (0-20,000 XP):
  - Lvl 1: PMP Aspirant (0 XP)
  - Lvl 2: Novice Hiker (500 XP)
  - Lvl 3: Trail Seeker (1,500 XP)
  - Lvl 4: Mountain Explorer (3,000 XP)
  - Lvl 5: Peak Climber (5,000 XP)
  - Lvl 6: Ridge Runner (7,500 XP)
  - Lvl 7: Summit Challenger (10,000 XP)
  - Lvl 8: Altitude Master (13,000 XP)
  - Lvl 9: PMP Candidate (16,000 XP)
  - Lvl 10: PMP Master (20,000 XP)
- **MUST**: Show XP progress bar and level on all screens

**FR-7.2**: Achievement Badges
- **MUST**: Implement 20+ achievements:
  - **First Steps**: Complete first topic
  - **Foundation Solid**: Complete Mission 1
  - **People Person**: Complete Mission 2 (People Domain)
  - **Process Pro**: Complete Mission 3 (Process Domain)
  - **Business Savvy**: Complete Mission 4 (Business Domain)
  - **Agile Ace**: Complete Mission 5 (Agile/Hybrid)
  - **Practice Makes Perfect**: Complete Mission 6
  - **Mock Master**: Pass all 3 mock exams
  - **Summit Reached**: Complete all 7 missions
  - **Week Warrior**: Maintain 7-day study streak 🔥
  - **Marathon Month**: Maintain 30-day streak 🔥🔥
  - **Quiz Whiz**: Score 90%+ on 10 quizzes
  - **Flashcard Fanatic**: Review 500+ flashcards
  - **Speed Demon**: Complete quiz in <5 minutes
  - **Perfectionist**: Score 100% on any quiz
  - **Comeback Kid**: Retake failed quiz and pass
  - **Domain Dominator**: Score 85%+ across all domain drills
  - **Formula Wizard**: Master all 33 formulas
  - **Ready for Prime**: Score 75%+ on 2 consecutive mock exams
  - **Exam Ready**: Achieve certification-ready status
- **MUST**: Show badge unlock animation
- **SHOULD**: Display badge collection on profile/dashboard

**FR-7.3**: Streak Tracking
- **MUST**: Track consecutive days of study activity
- **MUST**: Display streak count with fire emoji 🔥 (e.g., "7-day streak 🔥")
- **MUST**: Send encouragement notification if streak at risk (optional)
- **SHOULD**: Show streak calendar (heat map of active days)

### FR-8: Analytics Dashboard

**FR-8.1**: Progress Overview
- **MUST**: Show overall completion percentage (e.g., "68% to Summit")
- **MUST**: Display missions completed (e.g., "3 of 7 missions ⭐")
- **MUST**: Show total XP, current level, and next level progress
- **MUST**: Display study streak and total study days
- **SHOULD**: Show estimated time to completion based on current pace

**FR-8.2**: Performance Metrics
- **MUST**: Track accuracy by domain:
  - People Domain: X%
  - Process Domain: Y%
  - Business Domain: Z%
- **MUST**: Track accuracy by task (all 35 tasks)
- **MUST**: Identify weak areas (<75% accuracy) with red flag 🚩
- **MUST**: Calculate weighted exam readiness score:
  - People accuracy × 0.33
  - Process accuracy × 0.41
  - Business accuracy × 0.26
- **SHOULD**: Show performance trend graph (accuracy over time)

**FR-8.3**: Study Recommendations
- **MUST**: Generate study recommendations:
  - "Focus on Domain 2, Task 5 (accuracy: 62%)"
  - "Review Agile concepts (10 weak flashcards)"
  - "Take mock exam 2 to assess readiness"
- **SHOULD**: Provide daily study plan based on exam date
- **SHOULD**: Show "You're ready!" message when criteria met

**FR-8.4**: Certification Readiness Calculator
- **MUST**: Define readiness criteria:
  - ✅ All 7 missions complete
  - ✅ All domains ≥75% accuracy
  - ✅ 2 consecutive mock exams ≥75%
  - ✅ Study streak ≥30 days
  - ✅ All flashcards in Box 4-5
- **MUST**: Show checklist with progress on each criterion
- **MUST**: Display "CERTIFICATION READY ✅" badge when all met

### FR-9: Data Persistence

**FR-9.1**: LocalStorage
- **MUST**: Save to localStorage:
  - User progress (completed topics, missions)
  - Quiz scores and history
  - Flashcard box positions and stats
  - XP, level, achievements
  - Study streak data
  - Exam date and daily goal
- **MUST**: Auto-save after every action
- **MUST**: Load progress on app start

**FR-9.2**: Export/Import
- **MUST**: Provide "Export Progress" button (downloads JSON file)
- **MUST**: Provide "Import Progress" button (uploads JSON file)
- **SHOULD**: Validate imported file before loading
- **SHOULD**: Warn user if import will overwrite existing progress

**FR-9.3**: Reset Option
- **MUST**: Provide "Reset All Progress" option (with confirmation)
- **SHOULD**: Export backup before reset

### FR-10: Mobile Responsiveness

**FR-10.1**: Responsive Design
- **MUST**: Support screen sizes: 320px (mobile) to 1920px (desktop)
- **MUST**: Adapt layouts:
  - Mobile: Single column, collapsed navigation
  - Tablet: Two columns where appropriate
  - Desktop: Full layout with sidebar
- **MUST**: Ensure buttons are tap-friendly (min 44×44px)
- **SHOULD**: Hide non-essential elements on mobile

**FR-10.2**: Touch Interactions
- **MUST**: Support swipe gestures (flashcard flip, quiz navigation)
- **SHOULD**: Provide pinch-zoom for diagrams

---

## Content Requirements

### CR-1: Educational Content

**CR-1.1**: Learning Content Volume
- **MUST**: Provide 110,000+ words total educational content:
  - Mission 1: ~10,000 words (4 topics × 2,500 words)
  - Mission 2: ~35,000 words (14 tasks × 2,500 words)
  - Mission 3: ~42,500 words (17 tasks × 2,500 words)
  - Mission 4: ~10,000 words (4 tasks × 2,500 words)
  - Mission 5: ~12,500 words (5 topics × 2,500 words)

**CR-1.2**: Content Quality Standards
- **MUST**: Align with PMI PMP Exam Content Outline 2026
- **MUST**: Include key concepts, examples, and exam tips per topic
- **MUST**: Use clear, accessible language (avoid jargon overload)
- **SHOULD**: Include real-world scenarios and case studies
- **SHOULD**: Highlight common exam traps and misconceptions

**CR-1.3**: Content Sources
- **MUST**: Extract from:
  - PMBOK Guide 7th Edition (principles, domains, methodologies)
  - PMP Udemy Transcript (task-specific exam tips)
- **SHOULD**: Supplement with industry best practices

### CR-2: Flashcard Content

**CR-2.1**: Flashcard Volume
- **MUST**: Provide 460+ flashcards:
  - Foundation: 60 cards
  - People Domain: 140 cards
  - Process Domain: 170 cards
  - Business Domain: 40 cards
  - Agile/Hybrid: 50 cards

**CR-2.2**: Flashcard Structure
- **MUST**: Each card contains:
  - `id`: Unique identifier
  - `category`: Main category (Principles, People, Process, Business, Agile, Ethics, etc.)
  - `question`: Front of card (concise, clear)
  - `answer`: Back of card (detailed explanation)
  - `tags`: Array of relevant tags (e.g., ["agile", "scrum", "servant-leadership"])
  - `mappedTasks`: Array of related task IDs (e.g., ["d1t2", "d1t3"])
  - `difficulty`: Easy | Medium | Hard

**CR-2.3**: Flashcard Quality
- **MUST**: Follow best practices:
  - One concept per card
  - Clear, unambiguous questions
  - Concise answers (50-150 words)
  - Include examples where helpful
- **SHOULD**: Mix question types (definition, scenario, compare/contrast)

### CR-3: Quiz Question Bank

**CR-3.1**: Question Volume
- **MUST**: Provide 1,300+ questions:
  - Foundation: 100 questions
  - People Domain: 400 questions
  - Process Domain: 500 questions
  - Business Domain: 150 questions
  - Agile/Hybrid: 150 questions

**CR-3.2**: Question Structure
- **MUST**: Each question contains:
  - `id`: Unique identifier
  - `domain`: People | Process | Business
  - `taskId`: Related domain task (e.g., "d1t5")
  - `question`: Question text (scenario-based preferred)
  - `type`: multiple-choice | multiple-response | matching | true-false
  - `options`: Array of answer choices
  - `correctAnswer`: Correct answer(s)
  - `explanation`: Detailed explanation of why answer is correct
  - `difficulty`: 1 (Easy) | 2 (Medium) | 3 (Hard) | 4 (Very Hard)
  - `tags`: Relevant tags for filtering

**CR-3.3**: Question Quality
- **MUST**: Follow PMP exam question style:
  - Scenario-based (not just factual recall)
  - 4 plausible answer choices (A, B, C, D)
  - "What should the PM do NEXT?" or "What is the BEST approach?"
  - Distractors are logical but clearly wrong upon analysis
- **SHOULD**: Balance difficulty (30% Easy, 40% Medium, 25% Hard, 5% Very Hard)

### CR-4: Formula Reference

**CR-4.1**: Formula Bank
- **MUST**: Include all 33 PMP formulas with:
  - Formula name
  - Formula notation (e.g., EV = % Complete × BAC)
  - Description
  - Example calculation
  - When to use
- **MUST**: Cover: EVM, CPM, PERT, probability, communication channels, etc.

### CR-5: Practice Scenarios

**CR-5.1**: Scenario Volume
- **SHOULD**: Provide 130+ practice scenarios:
  - People: 40 scenarios
  - Process: 50 scenarios
  - Business: 15 scenarios
  - Mixed: 25 scenarios

**CR-5.2**: Scenario Structure
- **MUST**: Each scenario contains:
  - Realistic project situation (150-300 words)
  - Complex problem requiring judgment
  - 4 answer choices with detailed rationale for each
  - Explanation of best answer and why others are wrong

---

## Gamification Mechanics

### GM-1: Progression Mechanics (Based on Research)

**Research Insight**: Studies show gamified learning increases knowledge retention by ~40% and course completion by ~50%.

**Implementation**:

1. **Skill Tree Unlocking** (RPG-inspired)
   - Missions unlock sequentially (can't skip ahead)
   - Topics within mission unlock linearly or in small clusters
   - Visual "locked" icons with altitude milestones

2. **XP-Based Leveling**
   - Consistent XP rewards for all activities
   - Level-up provides dopamine hit + visual feedback
   - Higher levels = more prestige + confidence boost

3. **Achievement Badges** (Collectible)
   - Mix of easy, medium, hard achievements
  - Some hidden/surprise achievements
   - Badge showcase on profile

4. **Streak System** (Daily Habit Formation)
   - Fire emoji 🔥 visual (Duolingo-style)
   - Encourages daily study habit
   - Psychological commitment (loss aversion)

5. **Leaderboard** (Self-Competition)
   - Personal bests only (no public leaderboard to reduce anxiety)
   - Beat your own previous mock exam scores
   - Fastest quiz times
   - Longest streak

### GM-2: Immediate Feedback (Critical for Retention)

**Research Insight**: Immediate feedback strengthens neural pathways and improves retention by 25-30%.

**Implementation**:
- Quiz answers show correct/incorrect immediately
- Detailed explanation appears right after selection
- Flashcard confidence rating provides instant meta-cognitive feedback
- Visual feedback (✅ green checkmark, ❌ red X)
- Audio feedback (optional chime/buzz)

### GM-3: Adaptive Difficulty (AI-Driven Progression)

**Research Insight**: AI-driven adaptive systems personalize learning and reduce frustration.

**Implementation**:
- Track accuracy per domain, task, and concept
- Recommend review for weak areas (<75%)
- Adjust quiz difficulty:
  - If user scores 90%+ → Include more Hard/Very Hard questions
  - If user scores <70% → Include more Easy/Medium questions
- Dynamic study plan based on exam date and current pace

### GM-4: Social Proof & Motivation

**Implementation**:
- Display motivational messages:
  - "You're in the top 20% of learners at this stage!"
  - "Users who complete Mission 5 have an 89% pass rate!"
- Show progress milestones:
  - "You've studied more than 10,000 PMPs who came before you!"
- Optional: Share achievements to social media (LinkedIn, Twitter)

---

## Learning Progression System

### LP-1: Spaced Repetition Science

**Research Basis**: Leitner system improves long-term retention by 50-100% vs. massed practice.

**Our Implementation**:
```
Box 1 (New): Review every session
Box 2 (Learning): Review every 2 days
Box 3 (Familiar): Review every 4 days
Box 4 (Known): Review every 7 days
Box 5 (Mastered): Review every 14 days

Move Up: User rates card "Easy"
Stay: User rates card "Medium"
Move Down: User rates card "Hard"
```

**Advantage**: Users spend more time on difficult concepts and less on mastered ones.

### LP-2: Interleaved Practice (Mission 6)

**Research Basis**: Mixing topics improves discrimination and application skills.

**Implementation**:
- Mission 6 provides mixed-domain drills
- Questions randomly pull from all domains
- Forces user to identify which concept applies (vs. knowing topic in advance)

### LP-3: Progressive Difficulty Curve

```
Mission 1-2 (Easy): 60% Easy/Medium, 40% Hard/Very Hard
Mission 3-4 (Medium): 40% Easy/Medium, 60% Hard/Very Hard
Mission 5-7 (Hard): 20% Easy/Medium, 80% Hard/Very Hard
```

### LP-4: Mastery-Based Progression

**Rule**: Cannot advance until current topic mastered (75%+ quiz score)

**Rationale**: Ensures solid foundation before building complexity. Prevents "Swiss cheese" knowledge.

**Flexibility**: Allow retakes without penalty (growth mindset)

---

## Technical Requirements

### TR-1: Platform & Architecture

**TR-1.1**: Technology Stack - Current (v1.0 Web App)
- **Frontend**: HTML5, CSS3, Vanilla JavaScript (ES6+)
- **Architecture**: Fully client-side, no backend required
- **Data Storage**: localStorage API
- **Dependencies**: None (pure vanilla implementation)
- **Server**: Python HTTP server for local development (CORS workaround)

**TR-1.2**: Technology Stack - Future (v2.0 Game Engine)
- **Game Engine**: Phaser 3 (HTML5 game framework)
  - Proven track record for 2D games
  - Active community and documentation
  - Built-in physics, animations, scene management
  - Asset loading and caching
  - Audio management system
- **Map Editor**: Tiled (industry-standard tilemap editor)
  - JSON export compatible with Phaser
  - Layer support (ground, decoration, collision, objects)
  - Tileset management
- **Build Tools**:
  - Vite or Webpack for bundling
  - npm for package management
  - ESLint for code quality
- **Data Storage**: Same JSON files + localStorage (no backend changes)
- **Deployment**: Static hosting (Netlify, Vercel, GitHub Pages)

**TR-1.3**: Game Engine Decision Rationale

**Why Phaser 3:**
- ✅ Purpose-built for 2D tile-based games (our exact use case)
- ✅ Handles sprite animation, collision, physics out-of-the-box
- ✅ Scene management perfect for our screens (Title, Overworld, Battle, etc.)
- ✅ Works with Tiled map editor (industry standard)
- ✅ Still runs in browser (no desktop app needed)
- ✅ Can reuse all existing JSON data files
- ✅ Free and open source

**Alternatives Considered:**
- **Kaboom.js**: Simpler API but less mature, smaller community
- **PixiJS**: Lower-level (more work), but possible if we need more control
- **Unity WebGL**: Overkill for 2D, large file sizes, performance concerns
- **Pure Canvas API**: Too much work to rebuild physics/collision from scratch
- **Enhanced Web App**: Would still feel like "gamified website" not real game

**Migration Path from v1.0 to v2.0:**
- Phase 1: Keep v1.0 web app active and functional
- Phase 2: Build v2.0 in parallel as separate project
- Phase 3: Migrate content from v1.0 JSON files (no data loss)
- Phase 4: Beta test v2.0 with users
- Phase 5: Official launch of v2.0, keep v1.0 as "lite" version

**TR-1.2**: Browser Support
- **MUST**: Support modern browsers:
  - Chrome 90+
  - Firefox 88+
  - Safari 14+
  - Edge 90+
- **SHOULD**: Graceful degradation for older browsers

**TR-1.3**: Performance
- **MUST**: Initial load time <3 seconds on 3G connection
- **MUST**: Smooth 60fps animations
- **SHOULD**: Lazy-load images and heavy content
- **SHOULD**: Service worker for offline support (future)

### TR-2: Data Architecture

**TR-2.1**: JSON Data Files
- `missions.json`: Mission and topic structure
- `learning-content.json`: All educational content by topic ID
- `flashcards-mapped.json`: All flashcards with mappings
- `quiz-bank.json`: All quiz questions
- `formulas.json`: Formula reference
- `exam-content-outline.json`: Raw content from Udemy (backup)

**TR-2.2**: LocalStorage Schema
```javascript
{
  user: {
    examDate: "2026-03-15",
    dailyGoal: 60, // minutes
    tutorialCompleted: true
  },
  progress: {
    completedTopics: ["principles", "domains", "ethics", ...],
    completedMissions: [1, 2],
    xp: 3500,
    level: 4,
    achievements: ["first-steps", "foundation-solid", ...]
  },
  flashcards: {
    "card-1": { box: 3, lastSeen: "2026-01-28", timesReviewed: 5 },
    "card-2": { box: 1, lastSeen: "2026-01-29", timesReviewed: 1 },
    ...
  },
  quizHistory: [
    { topicId: "principles", score: 0.83, date: "2026-01-27", timeSpent: 480 },
    ...
  ],
  mockExams: [
    { examNumber: 1, score: 0.78, domain Scores: {...}, date: "2026-01-28" },
    ...
  ],
  streak: {
    current: 7,
    longest: 12,
    lastActiveDate: "2026-01-29"
  }
}
```

### TR-3: Accessibility

**TR-3.1**: WCAG 2.1 Compliance
- **MUST**: Support keyboard navigation (tab, enter, arrow keys)
- **MUST**: Provide ARIA labels for screen readers
- **MUST**: Maintain 4.5:1 color contrast ratio (WCAG AA)
- **SHOULD**: Support screen reader announcements for dynamic content

**TR-3.2**: Usability
- **MUST**: Focus indicators visible on all interactive elements
- **MUST**: Error messages clear and actionable
- **SHOULD**: Support text resizing up to 200%

### TR-4: Security & Privacy

**TR-4.1**: Data Privacy
- **MUST**: All data stored locally (no cloud sync without consent)
- **MUST**: No personally identifiable information (PII) collected
- **SHOULD**: Provide clear privacy policy

**TR-4.2**: Content Protection
- **SHOULD**: Obfuscate quiz answers in source code (basic protection)
- **COULD**: Implement answer validation server-side (future)

---

## Success Metrics

### SM-1: Learning Effectiveness

**Primary Metrics**:
- **Mock Exam Score**: Average score on 3 mock exams ≥75%
- **Domain Accuracy**: Accuracy ≥75% on all 3 domains
- **Knowledge Retention**: Flashcard mastery rate (Box 4-5) ≥80%

**Target**: 80% of users achieve all three

### SM-2: Engagement & Completion

**Primary Metrics**:
- **Daily Return Rate**: % of active users who return next day ≥80%
- **Mission Completion**: % of users who complete all 7 missions ≥70%
- **Study Streak**: Average study streak ≥21 days

**Target**: 70% complete program, 80% maintain 30+ day streak

### SM-3: Time Efficiency

**Primary Metrics**:
- **Average Study Time**: Total time to complete program ≤150 hours (vs. 200 industry avg)
- **Time to Proficiency**: Days to reach "Certification Ready" ≤60 days

**Target**: 25% time savings vs. traditional methods

### SM-4: User Satisfaction

**Primary Metrics**:
- **Net Promoter Score (NPS)**: ≥50
- **Self-Reported Confidence**: "I feel ready for the exam" ≥8/10
- **Would Recommend**: % who would recommend to colleague ≥85%

**Collection Method**: In-app survey after Mission 7 completion

### SM-5: Certification Success (Post-Launch)

**Primary Metric**:
- **First-Attempt Pass Rate**: % who pass real PMP exam on first try ≥85%

**Collection Method**: Optional user self-report after exam

---

## Development Roadmap

### Phase 1: MVP Foundation (COMPLETE ✅)

**Status**: 70% Complete

**Completed**:
- ✅ Mission structure (7 missions defined)
- ✅ 3-phase learning system (Learn | Flashcards | Quiz)
- ✅ Navigation and UI (mission map, breadcrumbs, tabs)
- ✅ Flashcard system (Leitner boxes)
- ✅ Quiz system (scoring, feedback)
- ✅ Mock exam simulator (180Q, 240min, breaks)
- ✅ Analytics dashboard (domain accuracy, weak areas)
- ✅ Gamification (XP, levels, achievements, streaks)
- ✅ LocalStorage persistence
- ✅ Export/import progress
- ✅ Mission 1 learning content (4 topics complete)
- ✅ 300 flashcards mapped
- ✅ 1,159 quiz questions generated
- ✅ 33 formulas documented

**Remaining**:
- ⚠️ Merge new flashcards (38 cards) into main file
- ⚠️ Verify Mission 2-4 content displays correctly
- ⚠️ Update quiz generation for topic specificity
- ❌ Create Mission 5 learning content (5 topics, ~10,000 words)
- ⚠️ Complete Mission 6 practice features (mini-tests, drills, formulas)
- ❌ Build onboarding tutorial
- ⚠️ Test mobile responsiveness

### Phase 2: Content Completion (IN PROGRESS 🔧)

**Priority 1: Critical Fixes (Est. 4-6 hours)**
- [ ] Task 1.1: Merge new-flashcards.json → flashcards-mapped.json
- [ ] Task 1.2: Verify Mission 2-4 content from exam-content-outline.json displays
- [ ] Task 1.3: Update `generateTopicQuiz()` for specificity (match flashcard logic)

**Priority 2: Core Content (Est. 15-20 hours)**
- [ ] Task 2.1: Extract PMBOK 7 content for principles/domains (enhance Mission 1)
- [ ] Task 2.2: Create Mission 5 learning content (5 topics, ~10,000 words)
  - Agile Manifesto (~2,000 words)
  - Scrum Framework (~2,000 words)
  - Kanban & Lean (~2,000 words)
  - Hybrid Approaches (~2,000 words)
  - Value Delivery (~2,000 words)
- [ ] Task 2.3: Implement Mission 6 practice features
  - Timed mini-tests (20Q, 30min)
  - Domain-specific drills (unlimited questions)
  - Formula mastery practice
- [ ] Task 2.4: Create onboarding tutorial (3-screen flow)

**Priority 3: Polish (Est. 8-10 hours)**
- [ ] Task 3.1: Test and fix mobile responsiveness (3 breakpoints)
- [ ] Task 3.2: Enhance visual feedback (animations, transitions)
- [ ] Task 3.3: Add sound effects (optional, 8-bit style)
- [ ] Task 3.4: Implement personal leaderboard (self-competition)

**Priority 4: Testing & Documentation (Est. 5-8 hours)**
- [ ] Task 4.1: Create comprehensive testing checklist
- [ ] Task 4.2: End-to-end user testing (3-5 testers)
- [ ] Task 4.3: Update HOW-TO-USE.md documentation
- [ ] Task 4.4: Create deployment guide (GitHub Pages, Netlify)

### Phase 3: Launch & Iteration (PLANNED)

**Pre-Launch**:
- [ ] Beta testing with 10-15 PMP candidates
- [ ] Collect feedback and iterate
- [ ] Bug fixes and performance optimization
- [ ] Finalize documentation

**Launch**:
- [ ] Deploy to GitHub Pages or Netlify
- [ ] Create landing page with demo video
- [ ] Soft launch to PM communities (Reddit, LinkedIn)

**Post-Launch**:
- [ ] Monitor user analytics (completion rates, weak areas)
- [ ] Collect NPS and feedback surveys
- [ ] Track certification success rates
- [ ] Iterate based on data

### Phase 4: Future Enhancements (BACKLOG)

**Advanced Features**:
- [ ] AI-powered study recommendations (adaptive learning paths)
- [ ] Community features (discussion forum, study groups)
- [ ] Mobile app (React Native or PWA)
- [ ] Additional certifications (CAPM, PMI-ACP, PgMP)
- [ ] Instructor-led cohort mode
- [ ] Certification exam voucher integration

**Monetization** (Optional):
- [ ] Free tier: Missions 1-2
- [ ] Premium tier ($49-99): Full access + mock exams
- [ ] Enterprise tier: Team licenses

---

## Development Roadmap: v2.0 Game Engine Rebuild

### Two-Track Development Strategy

**Track A: Maintain v1.0 Web App**
- Continue with current web app as "stable" version
- Available for users during v2.0 development
- Bug fixes and minor improvements only
- Tag as "v1.0-stable" in git

**Track B: Build v2.0 Game Version**
- Full rebuild using Phaser 3 game engine
- Parallel development branch "game-v2.0"
- Reuse all JSON content from v1.0
- Beta testing before official release

### v2.0 Development Timeline (16-24 weeks)

#### Week 1-2: Planning & Asset Preparation
- **Design Game Document (GDD)**
  - Finalize game mechanics and controls
  - Create screen mockups for all scenes
  - Define sprite requirements and animations
  - Map out user flow in game context
- **Asset Acquisition/Creation**
  - Commission pixel artist OR source asset packs
  - Character sprite sheet (40+ frames)
  - Tileset for mountain terrain (64+ tiles)
  - UI elements (borders, buttons, icons)
  - Sound effects and music tracks

**Deliverables**: GDD document, Asset list, Asset pack or artist contract

#### Week 3-4: Project Setup & Core Engine
- **Phaser 3 Project Initialization**
  - Set up Vite/Webpack build system
  - Configure Phaser game config
  - Create scene structure (Boot, Menu, Overworld, Battle, Victory)
  - Implement scene transitions
- **Asset Loading System**
  - Preloader scene with progress bar
  - Load sprites, tilesets, audio
  - Test asset loading performance

**Deliverables**: Phaser project scaffold, Working scene manager, Asset loader

#### Week 5-7: Overworld Map Implementation
- **Tiled Map Integration**
  - Create base camp map in Tiled
  - Export to JSON and load in Phaser
  - Implement tilemap rendering
  - Add collision layer
- **Character Movement**
  - Implement tile-based movement (arrow keys/WASD)
  - Character sprite animation (walk, idle)
  - Collision detection with terrain
  - Camera following player
- **Interactive Objects**
  - Study point triggers
  - Quiz battle triggers
  - NPC interaction system
  - Sign reading

**Deliverables**: Playable overworld, Character movement, Collision system

#### Week 8-10: Battle/Quiz System
- **Battle Scene Creation**
  - Battle screen UI layout (Dragon Quest style)
  - Question display in dialog boxes
  - Answer selection with RPG cursor
  - Transition effects (screen swipe)
- **Quiz Integration**
  - Load quiz data from existing quiz-bank.json
  - Implement answer validation
  - XP calculation and rewards
  - Return to overworld after quiz
- **Feedback Animations**
  - Correct answer: victory animation, XP counter
  - Wrong answer: damage/retry effect
  - Battle complete: return transition

**Deliverables**: Working battle system, Quiz functionality, Reward animations

#### Week 11-13: All 7 Missions/Maps
- **Create Mission Maps**
  - Mission 1: Base Camp (forest, tents, training area)
  - Mission 2-3: Forest Trail (trees, paths)
  - Mission 4-5: Mountain Terrain (rocks, cliffs)
  - Mission 6: Snow Zone (snow, ice)
  - Mission 7: Summit (peak, flag, vista)
- **Mission Progression**
  - Area unlocking system (fog/gates)
  - Mission complete triggers
  - Character position persistence
  - Visual progression (altitude markers)

**Deliverables**: 7 complete maps, Mission flow, Area unlocking

#### Week 14-15: UI, Menus, Polish
- **Game Menus**
  - Title screen with menu
  - Pause menu (ESC key)
  - Stats/inventory screen
  - Settings screen (audio, controls)
- **HUD Elements**
  - HP/XP bar overlay
  - Current mission indicator
  - Mini-map (optional)
- **Visual Polish**
  - Particle effects (level up, achievements)
  - Screen shake on events
  - Weather effects (Mission 6 snow)
  - Day/night cycle (optional)

**Deliverables**: Complete UI system, Polished visuals

#### Week 16-17: Audio Implementation
- **Music Integration**
  - Load and play background music per scene
  - Music volume controls
  - Fade in/out on scene transitions
- **Sound Effects**
  - Footsteps, menu navigation, battle SFX
  - Achievement unlock sounds
  - Level up fanfare
- **Audio Settings**
  - Master/music/SFX volume sliders
  - Mute toggle
  - Audio persistence

**Deliverables**: Complete audio system, All music/SFX integrated

#### Week 18-19: Data Migration & Testing
- **Content Migration**
  - Migrate all 338 flashcards
  - Migrate 1,159 quiz questions
  - Migrate learning content
  - Verify data integrity
- **Save System**
  - Implement save/load using localStorage
  - Progress persistence across sessions
  - Export/import functionality
- **Testing**
  - End-to-end playthrough
  - Bug fixing
  - Performance optimization
  - Browser compatibility testing

**Deliverables**: Full content integration, Working save system, Bug fixes

#### Week 20-22: Beta Testing & Iteration
- **Beta Release**
  - Deploy beta build to testers
  - Collect feedback on game feel
  - Monitor for bugs and issues
- **Iteration**
  - Fix critical bugs
  - Adjust difficulty/pacing
  - Improve UX based on feedback
  - Performance tuning

**Deliverables**: Beta-tested game, Bug fixes, UX improvements

#### Week 23-24: Launch Preparation
- **Final Polish**
  - Last round of bug fixes
  - Performance optimization
  - Loading time improvements
  - Documentation updates
- **Deployment**
  - Build production version
  - Deploy to hosting (Netlify/Vercel)
  - Create landing page
  - Prepare launch materials (screenshots, demo video)

**Deliverables**: Production-ready v2.0, Deployment, Launch materials

### Alternative: Enhanced Web App (v1.5)

**If full game engine rebuild is too ambitious, consider v1.5 path:**

#### Week 1-4: Visual Enhancement (v1.5)
- Replace mission list with illustrated mountain map (SVG/Canvas)
- Add CSS animations for character sprite movement
- Implement pixel art styling (fonts, borders, buttons)
- Add keyboard navigation (arrow keys, ENTER)

#### Week 5-6: Battle-Screen Quiz (v1.5)
- Redesign quiz interface to look like RPG battle screen
- Add transition animations
- Implement cursor-based selection
- Add basic sound effects

#### Week 7-8: Polish & Launch (v1.5)
- Mobile responsiveness improvements
- Performance optimization
- Beta testing
- Launch

**Timeline**: 8-12 weeks (vs. 16-24 for full v2.0)
**Outcome**: "Game-styled web app" (70% game feel) vs. "True game" (100% game feel)

---

## Research & References

### Gamification Research

1. **Deloitte Leadership Academy Case Study**
   - Result: 37% increase in weekly returning users, 50% higher completion rates
   - Source: [Gamification in Learning 2026](https://www.gocadmium.com/resources/gamification-in-learning)

2. **Knowledge Retention Studies**
   - Finding: Gamified learning increases retention by ~40%
   - Source: [Effectiveness of Gamification in Statistics Education](https://pmc.ncbi.nlm.nih.gov/articles/PMC10611935/)

3. **Best Practices**
   - Points, badges, leaderboards correlate with retention
   - Immediate feedback critical for learning
   - Spaced repetition improves long-term memory by 50-100%
   - Sources: [Gamification Best Practices](https://elearningindustry.com/gamification-for-learning-strategies-and-examples), [Gamified Learning 2026](https://www.infoprolearning.com/blog/how-gamification-in-learning-boosts-engagement-and-improves-knowledge-retention/)

### RPG Progression Mechanics

1. **Skill Tree Design**
   - Linear unlocking reduces overwhelm
   - Branching paths increase autonomy
   - Sources: [RPG Progression Systems](https://adrianfr99.github.io/RPG-progression-system/), [Pathways to Mastery Taxonomy](https://www.intechopen.com/online-first/1221745)

2. **XP-Based Leveling**
   - Clear milestones provide motivation
   - Exponential XP curves maintain challenge
   - Source: [Game Progression Systems](https://gamedesignskills.com/game-design/game-progression/)

### PMP Exam Research

1. **Official PMI Resources**
   - [PMP Exam Content Outline 2026](https://www.pmi.org/-/media/pmi/documents/public/pdf/certifications/new-pmp-examination-content-outline-2026.pdf)
   - [PMI New Exam Announcement](https://www.pmi.org/certifications/project-management-pmp/new-exam)

2. **Exam Changes Analysis**
   - [2026 PMP Exam Changes Explained](https://projectmanagementacademy.net/resources/blog/pmp-exam-update-2026/)
   - [PMP Guru Content Outline Guide](https://www.pmpguru.com/pmp-exam-content-outline-2026/)

3. **Study Materials**
   - PMBOK Guide 7th Edition (PMI, 2021)
   - Agile Practice Guide (PMI, 2017)
   - Andrew Ramdayal TIA Education Udemy Course

---

## Appendix: Open Questions & Decisions

### Design Decisions Needed

1. **Character Customization**
   - Q: How much customization to offer?
   - Options: A) None (single sprite), B) 3-4 preset characters, C) Full customization (color, gear)
   - Recommendation: Start with B (3-4 presets) for MVP

2. **Sound Effects**
   - Q: Implement in Phase 2 or Phase 4?
   - Recommendation: Phase 3 (nice-to-have for launch, not critical)

3. **Social Features**
   - Q: Add public leaderboard or keep personal-only?
   - Recommendation: Personal-only for MVP (reduces anxiety, better for adult learners)

4. **Monetization**
   - Q: Free forever or freemium model?
   - Recommendation: Decide post-beta based on costs and user feedback

### Technical Decisions

1. **Offline Support**
   - Q: Implement service worker for PWA?
   - Recommendation: Phase 4 (not critical for web-first launch)

2. **Backend/Database**
   - Q: Add backend for cloud sync?
   - Recommendation: Phase 4 (localStorage sufficient for MVP)

---

**Document Status**: ✅ PRD Complete & Ready for Development
**Next Steps**: Begin Phase 2 content completion tasks
**Questions?**: Contact product owner or refer to PROJECT-STATUS-AND-NEXT-STEPS.md

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2026-01-28 | Initial PRD based on existing implementation |
| 2.0 | 2026-01-29 | Comprehensive rewrite with research integration, content requirements, and roadmap |
