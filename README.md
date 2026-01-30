# Ascent to PMP: The Summit Quest

Transform your PMP certification journey into an epic mountain climbing adventure!

## Overview

**Ascent to PMP: The Summit Quest** is a gamified learning platform designed to help you prepare for the Project Management Professional (PMP) certification exam. Instead of dry flashcards and practice tests, you embark on a journey from Base Camp to Summit, conquering seven challenging missions that mirror the PMP exam domains.

### Current State (v1.0 - Web App)

This is a **functional web-based learning platform** (70% complete) with gamification elements:
- Clean, intuitive web interface with tab-based navigation
- Mission-based progression system
- Integrated flashcards, quizzes, and full mock exam
- XP, levels, and achievement tracking
- Progress analytics and performance insights

### Future Vision (v2.0 - True Game)

The ultimate goal is to transform this into a **Dragon Quest-style learning RPG**:
- 8-bit pixel art overworld map you can explore
- Character sprite with tile-based movement (arrow keys/WASD)
- Animated walking, climbing, and victory sequences
- Battle-screen style quiz interface with transitions
- NPC interactions, sound effects, and chiptune music
- Visual progression as you climb higher up the mountain

## Features

### Current Features (v1.0)

- **7 Mountain Missions**: Progress from Base Camp (Foundation Camp) through increasingly challenging terrain to reach Summit (Exam Simulation)
- **338 Flashcards**: Comprehensive coverage mapped to PMP exam tasks with spaced repetition
- **1,159 Practice Questions**: Domain-specific quizzes with detailed explanations
- **Full Mock Exam Simulator**: 185-question exam matching actual PMP format (175 scored + 10 pretest)
- **RPG-Style Progression**: Earn XP, level up, unlock achievements
- **Analytics Dashboard**: Track performance across domains, identify weak areas
- **Mission Gating**: Must achieve 70% on previous mission to unlock next
- **Study Tools**: Learn content, flashcards, and quizzes all in one interface

### Planned Features (v2.0 Game)

- Tile-based overworld map with collision detection
- Animated character sprites and NPCs
- Screen transitions and particle effects
- Battle-style quiz encounters
- Game-style menu system with RPG cursor
- Background music and sound effects
- Save/load system (replacing localStorage)

## Getting Started

### Prerequisites

- Modern web browser (Chrome, Firefox, Safari, or Edge)
- Python 3.x (for local server to avoid CORS issues)

### Installation

1. Clone or download this repository

2. Navigate to the `pmp-learning-game` folder:
   ```bash
   cd pmp-learning-game
   ```

3. Start the local server:

   **Windows:**
   ```bash
   START-APP.bat
   ```

   **Mac/Linux:**
   ```bash
   python3 -m http.server 8000
   ```

4. Open your browser to:
   ```
   http://localhost:8000
   ```

### First Time Setup

1. The app will load with a fresh player profile
2. Start at Mission 1: Foundation Camp
3. Work through Learn → Flashcards → Quiz in each mission
4. Achieve 70% or higher on quizzes to unlock the next mission
5. Export your progress regularly (Settings → Export Progress)

## Mission Structure

The learning journey consists of 7 missions, each focusing on specific PMP domains:

| Mission | Name | Focus Areas | Difficulty |
|---------|------|-------------|------------|
| 1 | Foundation Camp | 12 Principles, Ethics, Agile Manifesto | Easy |
| 2 | Trailhead | People Domain, Stakeholders, Team | Medium |
| 3 | Forest Path | Process Domain, Planning, Execution | Medium |
| 4 | Rocky Ascent | Measurement, EVM, Performance | Hard |
| 5 | Above Treeline | Uncertainty, Risk Management, Change | Hard |
| 6 | Snow Line | Business Environment, Delivery, Value | Hard |
| 7 | Summit | Full Mock Exam (185 questions) | Expert |

### Study Flow Per Mission

1. **Learn Tab**: Read comprehensive content covering the mission topics
2. **Flashcards Tab**: Review flashcards with spaced repetition (front/back flip)
3. **Quiz Tab**: Take practice quizzes to test knowledge (10-30 questions)
4. **Pass Requirement**: Score 70% or higher to unlock next mission

## Project Structure

```
pmp-learning-game/
├── index.html              # Main application (525 KB, 7,553 lines)
├── diagnostic.html         # Test suite for data loading
├── START-APP.bat          # Windows launcher script
├── data/                  # All learning content (JSON)
│   ├── missions.json      # Mission definitions
│   ├── flashcards-mapped.json  # 338 flashcards
│   ├── quiz-bank.json     # 1,159 quiz questions
│   ├── learning-content.json   # Learn tab content
│   ├── formulas.json      # EVM and calculation formulas
│   └── exam-content-outline.json  # Official PMP ECO
├── scripts/               # Utility JavaScript
│   ├── data-loader.js     # JSON loading utilities
│   ├── quiz-generator.js  # Dynamic quiz generation
│   ├── flashcard-engine.js  # Spaced repetition logic
│   └── analytics.js       # Performance tracking
└── docs/                  # Documentation
    ├── MISSION-SYSTEM-GUIDE.md
    ├── TROUBLESHOOTING.md
    ├── THEME-REFERENCE.md
    ├── VISUAL-WALKTHROUGH.md
    ├── EXAM_FLOW_DIAGRAM.md
    └── MOCK_EXAM_GUIDE.md
```

## Documentation

- **[PRD.md](PRD.md)** - Product requirements and development roadmap
- **[PMP-EXAM-REQUIREMENTS.md](PMP-EXAM-REQUIREMENTS.md)** - Official PMP Exam Content Outline
- **[DEVELOPER_NOTES.md](DEVELOPER_NOTES.md)** - Technical implementation notes
- **[PROJECT-STATUS-AND-NEXT-STEPS.md](PROJECT-STATUS-AND-NEXT-STEPS.md)** - Current status and next steps
- **[docs/MISSION-SYSTEM-GUIDE.md](pmp-learning-game/docs/MISSION-SYSTEM-GUIDE.md)** - How the mission system works
- **[docs/TROUBLESHOOTING.md](pmp-learning-game/docs/TROUBLESHOOTING.md)** - Common issues and solutions
- **[docs/MOCK_EXAM_GUIDE.md](pmp-learning-game/docs/MOCK_EXAM_GUIDE.md)** - Mock exam feature guide

## Technology Stack

**Current (v1.0):**
- Vanilla HTML/CSS/JavaScript (no frameworks)
- LocalStorage for progress persistence
- Modular script architecture
- Python HTTP server for local development

**Planned (v2.0):**
- Phaser 3 game engine
- Tiled Map Editor for level design
- Sprite animation system
- HTML5 Canvas rendering
- Same data files (JSON) for content

## Current State & Development Roadmap

### What Works Today (v1.0 - 70% Complete)

- All 7 missions load correctly
- 338 flashcards with domain mapping
- 1,159 quiz questions across all domains
- Full 185-question mock exam
- XP and leveling system
- Achievement tracking
- Analytics dashboard
- Progress export/import

### Known Issues

- Visual design is "web app with game theme" not true "game experience"
- No animations or transitions
- Mobile responsiveness needs improvement
- No sound effects or music
- Achievement notifications could be more engaging

### Development Paths

**Path A: Enhanced Web App (v1.5)** - 8-12 weeks
- Improve visual design with pixel art styling
- Add CSS animations and transitions
- Implement battle-screen style quiz interface
- Add keyboard navigation
- Add sound effects (8-bit chiptune)

**Path B: Full Game Rebuild (v2.0)** - 16-24 weeks
- Rebuild with Phaser.js game engine
- Create pixel art assets (character, tileset, UI)
- Implement tile-based movement and collision
- Build overworld map with camera system
- Create battle scene for quizzes
- Add animations, particles, music

See [PRD.md](PRD.md) for detailed roadmap.

## Important Notes

### Why Use START-APP.bat?

Modern browsers block file:// protocol from loading JSON files due to CORS security. The local Python server solves this:
- Serves files via http://localhost:8000
- No CORS restrictions
- Simulates production environment

### Progress & Data Safety

- Your progress is saved in **browser localStorage**
- Data persists between sessions on the same browser
- **Export your progress regularly** (Settings → Export Progress)
- Clearing browser data will erase your progress
- Exported JSON can be imported to restore progress

### Content Accuracy

- Study content derived from **PMBOK Guide 7th Edition**
- Quiz questions aligned with **PMP Exam Content Outline 2026**
- Flashcards mapped to official PMI exam tasks
- Not affiliated with or endorsed by PMI

## Verification & Testing

Run the diagnostic suite:

1. Open http://localhost:8000/diagnostic.html
2. All 7 tests should pass:
   - Missions JSON loads
   - Flashcards JSON loads
   - Quiz bank JSON loads
   - Learning content JSON loads
   - Formulas JSON loads
   - Exam content outline JSON loads
   - LocalStorage works

## Contributing

This project was created as a personal study tool. If you'd like to contribute:

1. Report issues via GitHub Issues
2. Suggest features or improvements
3. Submit pull requests with enhancements

Areas where contributions are especially welcome:
- Pixel art assets for game version
- Additional quiz questions
- UI/UX improvements
- Mobile responsiveness
- Accessibility enhancements

## License

MIT License - See [LICENSE](LICENSE) file for details

## Acknowledgments

- **PMI (Project Management Institute)** for the PMP certification framework
- **PMBOK Guide 7th Edition** as primary study reference
- Inspired by **Dragon Quest** (game design), **Celeste** (mountain theme), and **Duolingo** (gamified learning)
- Study content compiled from various PMP prep resources and practice exams

## Support & Feedback

- For technical issues, see [docs/TROUBLESHOOTING.md](pmp-learning-game/docs/TROUBLESHOOTING.md)
- For feature requests or questions, open a GitHub issue
- For general PMP exam questions, consult official PMI resources

## Disclaimer

This is an independent study tool and is **not affiliated with, endorsed by, or sponsored by PMI (Project Management Institute)**. PMP and PMBOK are registered marks of the Project Management Institute, Inc.

Use this tool as a supplement to official PMI study materials. Always refer to the official PMP Exam Content Outline and PMBOK Guide for authoritative information.

---

**Ready to begin your ascent?** Start the app and conquer Foundation Camp!

```bash
cd pmp-learning-game
START-APP.bat  # Windows
# or
python3 -m http.server 8000  # Mac/Linux
```

Then open http://localhost:8000 and start climbing!
