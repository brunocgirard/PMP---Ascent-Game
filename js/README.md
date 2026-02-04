# JavaScript Modules

This directory contains all JavaScript modules for the PMP Prep application.

## Module Overview

### Core Modules

1. **app.js** - Main application entry point
   - Initializes the app
   - Loads data files
   - Sets up router

2. **state.js** - Centralized state management
   - Observable pattern
   - Auto-save to localStorage
   - Export/import functionality

3. **router.js** - Client-side navigation
   - Hash-based routing
   - Dynamic component rendering
   - Breadcrumb support

4. **storage.js** - localStorage wrapper
   - Safe CRUD operations
   - Error handling
   - Storage monitoring

### Feature Modules

5. **missions.js** - Mission management
   - Load mission data
   - Track completion
   - Unlock logic

6. **flashcards.js** - Leitner flashcard system
   - 5-box spaced repetition
   - Topic filtering
   - Review scheduling

7. **quiz.js** - Quiz engine
   - Question generation
   - Multiple question types
   - Scoring and feedback

8. **gamification.js** - XP, levels, achievements
   - Award XP
   - Level calculation
   - Badge unlocking
   - Streak tracking

9. **utils.js** - Utility functions
   - Date/time helpers
   - String manipulation
   - Array operations
   - DOM helpers

## Development Notes

- All modules use ES6+ syntax
- Modules are loaded with `type="module"` in HTML
- No external dependencies (vanilla JS only)
- Each module is self-contained and focused
