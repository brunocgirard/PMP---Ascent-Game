@prd.md @activity.md

We are building "Ascent to PMP: The Summit Quest" - a Dragon Quest-style PMP learning game.

First read activity.md to see what was recently accomplished.

## Start the Application

**Current Version (v1.0 - Web App):**
```bash
cd pmp-learning-game
python3 -m http.server 8000 --bind 127.0.0.1
```
Then open http://localhost:8000

**Future Version (v2.0 - Game Engine - Not Yet Built):**
```bash
cd pmp-learning-game-v2
npm install
npm run dev
```
Then open http://localhost:5173 (or the port Vite specifies)

**Important:** Always use the Python HTTP server for v1.0 to avoid CORS issues when loading JSON files.

## Work on Tasks

Open prd.md and find the single highest priority task where `"passes": false`.

Work on exactly ONE task:
1. Implement the change according to the task steps
2. Run any available checks:
   - **v1.0 Web App**: Open pmp-learning-game/diagnostic.html (7 tests should pass)
   - **v2.0 Game**: `npm run lint`, `npm run build`, `npm run typecheck`

## Verify in Browser

After implementing, use agent-browser to verify your work:

**v1.0 Web App Verification:**
1. Open the local server URL:
   ```
   agent-browser open http://localhost:8000
   ```

2. Run diagnostic tests first:
   ```
   agent-browser open http://localhost:8000/diagnostic.html
   agent-browser screenshot screenshots/diagnostic-[date].png
   ```
   Verify all 7 tests pass ✅

3. Take snapshot to see page structure:
   ```
   agent-browser snapshot -i -c
   ```

4. Take screenshot for visual verification:
   ```
   agent-browser screenshot screenshots/[task-name].png
   ```

5. Test key features:
   - Click mission selector: `agent-browser click "[data-mission='1']"`
   - Switch tabs: `agent-browser click ".nav-link[onclick*='flashcards']"`
   - Verify flashcard count (should show 338 total after merge)
   - Test quiz generation

**v2.0 Game Verification (Future):**
1. Open game server:
   ```
   agent-browser open http://localhost:5173
   ```

2. Test game controls (manual testing required):
   - Arrow keys for character movement
   - ENTER to interact with study points/NPCs
   - ESC to open menu
   - Check collision detection works
   - Verify quiz battles trigger correctly

3. Take screenshots of game scenes:
   ```
   agent-browser screenshot screenshots/game-overworld-[date].png
   agent-browser screenshot screenshots/game-battle-[date].png
   ```

4. Check console for Phaser warnings/errors

## Log Progress

Append a dated progress entry to activity.md describing:
- What you changed
- What commands you ran
- The screenshot filename
- Any issues encountered and how you resolved them

## Update Task Status

When the task is confirmed working, update that task's `"passes"` field in prd.md from `false` to `true`.

## Commit Changes

Make one git commit for that task only with a clear, descriptive message:
```
git add .
git commit -m "feat: [brief description of what was implemented]"
```

Do NOT run `git init`, do NOT change git remotes, and do NOT push.

## Important Rules

- ONLY work on a SINGLE task per iteration
- Always verify in browser before marking a task as passing
- Always log your progress in activity.md
- Always commit after completing a task

## Completion

When ALL tasks have `"passes": true`, output:

<promise>COMPLETE</promise>
