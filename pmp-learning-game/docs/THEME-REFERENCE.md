# 🎨 PMP Summit Quest - Theme Reference Guide

## Visual Design System

This document provides a complete reference for the 8-bit mountain hiking theme used throughout the PMP learning game.

---

## 🎨 Color Palette

### Primary Colors

#### Mountain Deep Blue
- **Hex**: `#2E5266`
- **RGB**: `46, 82, 102`
- **Usage**: Headers, primary buttons, mission borders, emphasis text
- **Represents**: Deep mountain valleys, primary brand color

#### Mountain Gray Blue
- **Hex**: `#6E8898`
- **RGB**: `110, 136, 152`
- **Usage**: Secondary elements, borders, subdued backgrounds
- **Represents**: Rocky mountain surfaces, neutral elements

#### Mountain Green
- **Hex**: `#87A96B`
- **RGB**: `135, 169, 107`
- **Usage**: Success states, progress indicators, completed items
- **Represents**: Forest trails, growth, achievement

#### Mountain Gold
- **Hex**: `#FFD93D`
- **RGB**: `255, 217, 61`
- **Usage**: Achievements, completed missions, highlights, rewards
- **Represents**: Summit glory, treasures, excellence

#### Mountain Snow
- **Hex**: `#F0F4F8`
- **RGB**: `240, 244, 248`
- **Usage**: Light backgrounds, cards, clean surfaces
- **Represents**: Snow peaks, clarity, clean slate

#### Mountain Rock
- **Hex**: `#4A5568`
- **RGB**: `74, 85, 104`
- **Usage**: Dark text, strong borders, locked items
- **Represents**: Solid rock, obstacles, challenges

#### Mountain Sky
- **Hex**: `#7FA7C0`
- **RGB**: `127, 167, 192`
- **Usage**: Gradient backgrounds, sky elements
- **Represents**: Clear skies, openness, journey ahead

### Color Usage Examples

```css
/* Primary Actions */
background: var(--mountain-deep-blue);
color: white;

/* Success States */
border-color: var(--mountain-gold);
background: var(--mountain-green);

/* Locked/Disabled */
background: var(--mountain-snow);
color: var(--mountain-rock);
opacity: 0.6;

/* Progress Bars */
background: linear-gradient(90deg,
    var(--mountain-green) 0%,
    var(--mountain-gold) 100%);

/* Sky Gradients */
background: linear-gradient(to bottom,
    var(--mountain-sky) 0%,
    var(--mountain-snow) 100%);
```

---

## 🗺️ Mission Icons & Emojis

### Mission Icons

```
Mission 1: 🥾 (Hiking Boot)       - Beginning the journey
Mission 2: 🌲 (Evergreen Tree)    - Forest path, nature
Mission 3: ⛰️ (Mountain)          - Rocky challenges
Mission 4: 🏔️ (Snow-Capped Peak) - High altitude mastery
Mission 5: 🌄 (Sunrise Mountains) - Integration, new perspective
Mission 6: 🧗 (Climber)           - Technical practice
Mission 7: 🎯 (Target/Summit)     - Final goal achieved
```

### Status Icons

```
🔒 Locked       - Mission not yet unlocked
✅ Complete     - Task/Mission finished
📍 Start        - Ready to begin
🚩 Waypoint     - Task/Topic marker
💡 Tip          - Exam strategy advice
⏱️ Time         - Duration estimate
📊 Progress     - Statistics
🔥 Streak       - Daily consistency
💎 XP/Points    - Experience earned
🏆 Achievement  - Badge unlocked
```

### Level Icons

```
📝 Level 1: PMP Aspirant        - Notebook (learning)
📚 Level 2: Knowledge Seeker    - Books (studying)
🎯 Level 3: Task Tackler        - Target (focused)
💡 Level 4: Concept Master      - Lightbulb (understanding)
👥 Level 5: People Leader       - Team (people domain)
⚙️ Level 6: Process Pro         - Gear (process domain)
💼 Level 7: Business Strategist - Briefcase (business)
🏆 Level 8: Domain Champion     - Trophy (mastery)
🎓 Level 9: Exam Ready          - Graduation cap (prepared)
✨ Level 10: PMP Master         - Sparkles (excellence)
```

### Navigation Icons

```
🗺️ Mission Map    - Overview of journey
📊 Dashboard      - Statistics and summary
🃏 Flashcards     - Study cards
📝 Quiz           - Practice tests
📐 Formulas       - Reference guide
🎯 Mock Exam      - Full simulation
📈 Progress       - Achievements and analytics
```

---

## 🏔️ Typography

### Font Families

```css
/* Primary Font */
font-family: -apple-system, BlinkMacSystemFont,
             'Segoe UI', Roboto, 'Helvetica Neue',
             Arial, sans-serif;

/* Retro/8-bit Style (for special effects) */
font-family: 'Courier New', monospace;
letter-spacing: 2px;
text-transform: uppercase;
```

### Font Sizes

```css
/* Headers */
h1: 2.5rem (mission headers)
h2: 2rem (section headers)
h3: 1.5rem (card headers)

/* Body Text */
Normal: 1rem (16px)
Large: 1.25rem (important content)
Small: 0.875rem (14px, secondary info)
Tiny: 0.75rem (12px, metadata)

/* Display Text */
XP Value: 2rem (stats)
Level Number: 3rem (prominent)
Mission Icon: 3rem
```

### Font Weights

```css
Normal: 400
Medium: 500 (buttons, labels)
Semibold: 600 (headers)
Bold: 700 (emphasis)
```

---

## 📐 Spacing System

### Margin & Padding Scale

```css
0.25rem = 4px   (xs - tight spacing)
0.5rem  = 8px   (sm - compact)
0.75rem = 12px  (md - regular)
1rem    = 16px  (base unit)
1.5rem  = 24px  (lg - comfortable)
2rem    = 32px  (xl - spacious)
3rem    = 48px  (2xl - very spacious)
```

### Usage Examples

```css
/* Cards */
padding: 1.5rem (24px)

/* Buttons */
padding: 0.75rem 1.5rem (12px 24px)

/* Section Spacing */
margin-bottom: 2rem (32px)

/* Grid Gaps */
gap: 1rem (16px standard)
gap: 1.5rem (24px comfortable)
```

---

## 🎭 Component Styles

### Mission Node

```css
.mission-node {
    background: white;
    border: 4px solid var(--mountain-deep-blue);
    border-radius: 1rem;
    padding: 2rem;
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
    transition: all 0.3s ease;
}

.mission-node.completed {
    border-color: var(--mountain-gold);
    background: linear-gradient(135deg, #fffef0 0%, #ffffff 100%);
}

.mission-node.locked {
    opacity: 0.6;
    background: #e2e8f0;
}
```

### Waypoint Card

```css
.waypoint-card {
    background: white;
    border: 3px solid var(--mountain-deep-blue);
    border-radius: 0.75rem;
    padding: 1.5rem;
    transition: all 0.3s ease;
}

.waypoint-card:hover {
    transform: translateX(10px);
    box-shadow: -5px 5px 15px rgba(0, 0, 0, 0.1);
}
```

### Progress Bar

```css
.progress-bar {
    height: 20px;
    background: var(--border);
    border-radius: 1rem;
    overflow: hidden;
    border: 2px solid var(--mountain-deep-blue);
}

.progress-fill {
    height: 100%;
    background: linear-gradient(90deg,
        var(--mountain-green) 0%,
        var(--mountain-gold) 100%);
    transition: width 0.5s ease;
}
```

### Button Styles

```css
.btn-primary {
    background: var(--mountain-deep-blue);
    color: white;
    padding: 0.75rem 1.5rem;
    border-radius: 0.5rem;
    border: none;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
}

.btn-primary:hover {
    background: #1e3a4d;
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}
```

### XP Bar

```css
.xp-bar-container {
    background: white;
    border: 3px solid var(--mountain-deep-blue);
    border-radius: 1rem;
    padding: 1rem;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.xp-fill {
    background: linear-gradient(90deg,
        var(--mountain-green) 0%,
        var(--mountain-gold) 100%);
    height: 30px;
    border-radius: 1rem;
    display: flex;
    align-items: center;
    padding-left: 1rem;
    font-weight: bold;
    color: white;
}
```

---

## 🎬 Animations

### Fade In Up

```css
@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(30px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.mission-node {
    animation: fadeInUp 0.5s ease;
}
```

### Slide In Right

```css
@keyframes slideInRight {
    from {
        opacity: 0;
        transform: translateX(-30px);
    }
    to {
        opacity: 1;
        transform: translateX(0);
    }
}

.waypoint-card {
    animation: slideInRight 0.3s ease;
}
```

### Pulse

```css
@keyframes pulse {
    0%, 100% {
        opacity: 1;
    }
    50% {
        opacity: 0.5;
    }
}

.warning {
    animation: pulse 1s infinite;
}
```

---

## 🌈 Gradients

### Sky to Ground

```css
background: linear-gradient(to bottom,
    #7FA7C0 0%,    /* Sky blue */
    #B8D4E6 30%,   /* Light blue */
    #87A96B 60%,   /* Mountain green */
    #6B8E54 100%   /* Dark green */
);
```

### Mission Header

```css
background: linear-gradient(135deg,
    var(--mountain-deep-blue) 0%,
    var(--mountain-gray-blue) 100%
);
color: white;
```

### Achievement Badge

```css
background: linear-gradient(135deg,
    var(--mountain-gold) 0%,
    #FFE66D 100%
);
box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
```

### Progress Bar Fill

```css
background: linear-gradient(90deg,
    var(--mountain-green) 0%,
    var(--mountain-gold) 100%
);
```

---

## 🖼️ Layout Patterns

### Mission Map Layout

```
┌─────────────────────────────────┐
│  XP Bar (Level Progress)        │
├─────────────────────────────────┤
│                                  │
│    ┌───────────────────┐        │
│    │  Mission 1 🥾     │        │
│    │  Trail Head       │        │
│    │  [Progress: 100%] │        │
│    └───────────────────┘        │
│           │                      │
│           ├─ Path Connector      │
│           │                      │
│    ┌───────────────────┐        │
│    │  Mission 2 🌲     │        │
│    │  Forest Path      │        │
│    │  [Progress: 45%]  │        │
│    └───────────────────┘        │
│           │                      │
│          ...                     │
│                                  │
└─────────────────────────────────┘
```

### Mission Detail Layout

```
┌─────────────────────────────────┐
│  ← Back to Map                  │
├─────────────────────────────────┤
│  Mission Header                  │
│  🥾 Trail Head                   │
│  [Mission Stats Grid]            │
├─────────────────────────────────┤
│  Tasks & Topics                  │
│                                  │
│  🚩 Topic 1 ───────────────→ ✅  │
│  🚩 Topic 2 ───────────────→ 📍  │
│  🚩 Topic 3 ───────────────→ 📍  │
│  🚩 Topic 4 ───────────────→ 📍  │
│                                  │
└─────────────────────────────────┘
```

### Task Detail Layout

```
┌─────────────────────────────────┐
│  ← Back to Mission              │
├─────────────────────────────────┤
│  Task Header                     │
│  Mission > Task                  │
│  💡 Exam Tip                     │
├─────────────────────────────────┤
│  [📚 Learn] [🃏 Cards] [📝 Quiz]│
├─────────────────────────────────┤
│                                  │
│  Task Content                    │
│  (Changes based on tab)          │
│                                  │
│  [Mark Complete Button]          │
│                                  │
└─────────────────────────────────┘
```

---

## 🎯 Interactive States

### Hover Effects

```css
/* Mission Node Hover */
.mission-node:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.3);
}

/* Waypoint Card Hover */
.waypoint-card:hover {
    transform: translateX(10px);
    box-shadow: -5px 5px 15px rgba(0, 0, 0, 0.1);
}

/* Button Hover */
.btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}
```

### Active States

```css
/* Active Tab */
.task-tab.active {
    color: var(--mountain-deep-blue);
    border-bottom: 3px solid var(--mountain-deep-blue);
}

/* Active Nav Link */
.nav-link.active {
    background: var(--mountain-deep-blue);
    color: white;
}
```

### Disabled States

```css
/* Locked Mission */
.mission-node.locked {
    opacity: 0.6;
    cursor: not-allowed;
}

.mission-node.locked:hover {
    transform: none;
}
```

---

## 📱 Responsive Breakpoints

```css
/* Desktop */
@media (min-width: 1024px) {
    .sidebar { width: 260px; }
    .main-content { margin-left: 260px; }
}

/* Tablet */
@media (max-width: 768px) {
    .sidebar {
        transform: translateX(-100%);
        transition: transform 0.3s;
    }
    .main-content {
        margin-left: 0;
        width: 100%;
    }
    .stats-grid {
        grid-template-columns: 1fr;
    }
}

/* Mobile */
@media (max-width: 480px) {
    .mission-node {
        width: 100%;
        padding: 1rem;
    }
    .mission-icon {
        font-size: 2rem;
    }
}
```

---

## 🎨 Shadow System

```css
/* Subtle shadow (cards) */
--shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1),
          0 1px 2px -1px rgba(0, 0, 0, 0.1);

/* Medium shadow (hover states) */
--shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
             0 2px 4px -2px rgba(0, 0, 0, 0.1);

/* Large shadow (mission nodes) */
--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
             0 4px 6px -4px rgba(0, 0, 0, 0.1);

/* Extra large shadow (dialogs, important) */
--shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1),
             0 8px 10px -6px rgba(0, 0, 0, 0.1);
```

---

## 🎪 Special Effects

### Pixel Art Style

```css
.pixel-art {
    image-rendering: pixelated;
    image-rendering: -moz-crisp-edges;
    image-rendering: crisp-edges;
}
```

### Retro Text

```css
.retro-text {
    font-family: 'Courier New', monospace;
    letter-spacing: 2px;
    text-transform: uppercase;
}
```

### Glow Effect

```css
.glow {
    box-shadow: 0 0 10px rgba(255, 217, 61, 0.5),
                0 0 20px rgba(255, 217, 61, 0.3),
                0 0 30px rgba(255, 217, 61, 0.1);
}
```

---

## 🖌️ Design Principles

### 1. Consistency
- Use the same color for the same purpose
- Maintain spacing scale throughout
- Apply consistent border radius (0.5rem, 0.75rem, 1rem)

### 2. Hierarchy
- Larger = more important
- Color contrast for emphasis
- Z-index for layering (modals, dropdowns)

### 3. Feedback
- Hover states on all interactive elements
- Loading states for async operations
- Success/error messages for actions

### 4. Accessibility
- Color contrast ratio > 4.5:1 for text
- Focus indicators for keyboard navigation
- Alt text for icons (via aria-label)

### 5. Performance
- CSS transitions instead of JavaScript
- Transform for animations (GPU accelerated)
- Minimize repaints and reflows

---

## 📚 Quick Reference

### Most Used Colors

```
Primary:   #2E5266 (deep blue)
Success:   #87A96B (green)
Warning:   #FFD93D (gold)
Secondary: #6E8898 (gray blue)
```

### Most Used Spacing

```
Padding:   1.5rem (cards)
Gap:       1rem (grids)
Margin:    2rem (sections)
```

### Most Used Sizes

```
Icons:     2-3rem
Headers:   1.5-2.5rem
Body:      1rem
Buttons:   0.75rem padding
```

### Most Used Effects

```
Border:    3-4px solid
Radius:    0.5-1rem
Shadow:    var(--shadow-lg)
Hover:     translateY(-2px)
```

---

**Theme Version**: 1.0.0
**Last Updated**: 2026-01-28
**Design System**: Mountain Quest 8-bit

---

*This theme creates a cohesive, engaging 8-bit mountain climbing experience while maintaining professional readability and usability for PMP exam preparation.*
