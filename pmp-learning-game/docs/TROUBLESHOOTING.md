# 🔧 Troubleshooting Guide - PMP Summit Quest

## Common Issues and Solutions

### Issue 1: Mission Map Not Showing

**Symptoms**: Blank page when opening the app

**Solutions**:
1. Check browser console for errors (F12 → Console tab)
2. Verify `data/missions.json` exists and is valid JSON
3. Clear browser cache and reload (Ctrl+F5)
4. Check that you're opening `index.html` from the correct folder

**How to Fix**:
```bash
# Verify files exist
cd "C:\Users\Lenovo\Desktop\PMP - PREP EXAM\pmp-learning-game"
dir data\missions.json
dir data\flashcards-mapped.json
```

### Issue 2: XP Bar Shows NaN or 0/0

**Symptoms**: XP bar displays "NaN%" or "0/0 XP"

**Cause**: User data not initialized properly

**Solution**:
1. Open browser console (F12)
2. Clear localStorage:
```javascript
localStorage.removeItem('pmpUserData');
location.reload();
```
3. Or click "Reset All Progress" in Progress page

### Issue 3: Missions All Locked

**Symptoms**: Only Mission 1 should be unlocked, but all show locks

**Cause**: User data corruption or not saved properly

**Solution**:
1. Open browser console (F12)
2. Check unlocked missions:
```javascript
const data = JSON.parse(localStorage.getItem('pmpUserData'));
console.log(data.unlockedMissions);
```
3. If empty or wrong, unlock Mission 1:
```javascript
const data = JSON.parse(localStorage.getItem('pmpUserData'));
data.unlockedMissions = ['m1'];
localStorage.setItem('pmpUserData', JSON.stringify(data));
location.reload();
```

### Issue 4: Flashcards Not Loading

**Symptoms**: "No cards in this category" or blank flashcard page

**Solutions**:
1. Check that `data/flashcards-mapped.json` exists
2. Verify file is valid JSON (no syntax errors)
3. Check browser console for fetch errors
4. Try accessing file directly: `data/flashcards-mapped.json` in browser

**Fallback**:
The app will try `data/flashcards.json` if mapped version fails.

### Issue 5: Mission Completed But Not Showing Complete

**Symptoms**: All tasks done but mission still shows incomplete

**Cause**: Task progress not saved properly

**Solution**:
1. Go to mission detail page
2. Click each task again to verify completion
3. Check browser console for save errors
4. Verify localStorage is enabled in browser

**Manual Fix** (Console):
```javascript
// Mark Mission 1 as complete
const data = JSON.parse(localStorage.getItem('pmpUserData'));
if (!data.completedMissions.includes('m1')) {
    data.completedMissions.push('m1');
    data.unlockedMissions.push('m2');  // Unlock next mission
}
localStorage.setItem('pmpUserData', JSON.stringify(data));
location.reload();
```

### Issue 6: Level Not Updating After Earning XP

**Symptoms**: XP increases but level stays the same

**Cause**: Level calculation logic issue

**Check**:
```javascript
const data = JSON.parse(localStorage.getItem('pmpUserData'));
console.log('Current XP:', data.xp);
console.log('Current Level:', data.level);
```

**Level Thresholds**:
- Level 1: 0 XP
- Level 2: 500 XP
- Level 3: 1,500 XP
- Level 4: 3,000 XP
- Level 5: 5,000 XP
- Level 6: 7,500 XP
- Level 7: 10,000 XP
- Level 8: 13,000 XP
- Level 9: 16,000 XP
- Level 10: 20,000 XP

**Manual Fix**:
Recalculate level based on XP:
```javascript
const data = JSON.parse(localStorage.getItem('pmpUserData'));
const xp = data.xp || 0;

if (xp >= 20000) data.level = 10;
else if (xp >= 16000) data.level = 9;
else if (xp >= 13000) data.level = 8;
else if (xp >= 10000) data.level = 7;
else if (xp >= 7500) data.level = 6;
else if (xp >= 5000) data.level = 5;
else if (xp >= 3000) data.level = 4;
else if (xp >= 1500) data.level = 3;
else if (xp >= 500) data.level = 2;
else data.level = 1;

localStorage.setItem('pmpUserData', JSON.stringify(data));
location.reload();
```

### Issue 7: Task Quiz Not Starting

**Symptoms**: Click "Start Task Quiz" but nothing happens

**Cause**: Feature not fully implemented yet

**Current Status**: Task-specific quizzes are planned but not yet implemented.

**Workaround**: Use the main Quiz page with domain-specific modes.

### Issue 8: Mock Exam Page Shows "Locked"

**Symptoms**: Can't access mock exams

**Explanation**: This is intentional! Mock exams unlock after completing Mission 6.

**To Unlock**:
1. Complete Missions 1-6
2. Mock exam page will become accessible
3. Or manually unlock for testing:
```javascript
const data = JSON.parse(localStorage.getItem('pmpUserData'));
data.completedMissions = ['m1', 'm2', 'm3', 'm4', 'm5', 'm6'];
localStorage.setItem('pmpUserData', JSON.stringify(data));
location.reload();
```

### Issue 9: Daily Streak Reset Unexpectedly

**Symptoms**: Streak shows 0 after you studied yesterday

**Cause**: Last study date comparison issue

**Check**:
```javascript
const data = JSON.parse(localStorage.getItem('pmpUserData'));
console.log('Last Study Date:', data.lastStudyDate);
console.log('Today:', new Date().toDateString());
```

**Fix**: Study again today to restart streak.

### Issue 10: Achievements Not Unlocking

**Symptoms**: Met requirements but achievement still locked

**Debug**:
```javascript
// Check achievement unlock conditions
const data = JSON.parse(localStorage.getItem('pmpUserData'));
console.log('Completed Missions:', data.completedMissions);
console.log('Level:', data.level);
console.log('XP:', data.xp);
console.log('Streak:', data.streak);
console.log('Quiz History:', data.quizHistory.length);
```

**Manual Unlock** (if truly earned):
Achievements are calculated on-the-fly from user data, not stored. If data is correct, achievement will show.

## Browser Compatibility Issues

### Chrome/Edge
✅ **Recommended** - Full support, best performance

### Firefox
✅ Fully supported

### Safari
⚠️ May have localStorage issues on private browsing
- Disable private browsing or allow localStorage

### Internet Explorer
❌ **Not Supported** - Use a modern browser

## Performance Issues

### Issue: Slow Loading

**Solutions**:
1. Clear browser cache
2. Check file sizes (missions.json should be < 100KB)
3. Disable browser extensions
4. Use local file:// protocol instead of web server (faster for local dev)

### Issue: Page Freezing

**Possible Causes**:
1. Large data files (10,000+ flashcards)
2. Too many animations running
3. localStorage quota exceeded

**Solutions**:
1. Export and clear old data
2. Reduce animation complexity in CSS
3. Clear localStorage if > 5MB

## Data Recovery

### Lost Progress - How to Recover

**If you exported data before**:
1. Go to Progress page
2. Click "Import Progress"
3. Select your exported JSON file

**If you didn't export**:
Progress is stored in browser localStorage. It's lost if:
- Browser cache cleared
- Private/incognito mode used
- Different browser/device used

**Prevention**:
- Export progress regularly (Progress page)
- Bookmark the app in non-private browser
- Use same browser consistently

### Backup User Data

**Manual Backup**:
```javascript
// Open console (F12) and run:
const data = localStorage.getItem('pmpUserData');
console.log(data);
// Copy the output and save to a text file
```

**Restore from Backup**:
```javascript
// Paste your saved data string here
const backup = '{"points":1500,"level":3,...}';
localStorage.setItem('pmpUserData', backup);
location.reload();
```

## Development/Testing Tools

### Reset Everything
```javascript
localStorage.clear();
location.reload();
```

### Give Test XP
```javascript
const data = JSON.parse(localStorage.getItem('pmpUserData')) || {xp: 0, level: 1};
data.xp += 5000;  // Add 5000 XP
localStorage.setItem('pmpUserData', JSON.stringify(data));
location.reload();
```

### Unlock All Missions
```javascript
const data = JSON.parse(localStorage.getItem('pmpUserData'));
data.unlockedMissions = ['m1', 'm2', 'm3', 'm4', 'm5', 'm6', 'm7'];
localStorage.setItem('pmpUserData', JSON.stringify(data));
location.reload();
```

### Complete All Missions
```javascript
const data = JSON.parse(localStorage.getItem('pmpUserData'));
data.completedMissions = ['m1', 'm2', 'm3', 'm4', 'm5', 'm6', 'm7'];
data.xp = 20000;
data.level = 10;
localStorage.setItem('pmpUserData', JSON.stringify(data));
location.reload();
```

### View All User Data
```javascript
const data = JSON.parse(localStorage.getItem('pmpUserData'));
console.table(data);
```

## File Validation

### Check missions.json Validity
```bash
# Windows PowerShell
Get-Content "data\missions.json" | ConvertFrom-Json
```

### Check flashcards-mapped.json Validity
```bash
# Windows PowerShell
Get-Content "data\flashcards-mapped.json" | ConvertFrom-Json
```

### Online JSON Validator
If you edit JSON files, validate them at: https://jsonlint.com/

## Still Having Issues?

### Debug Checklist
- [ ] Browser console shows no errors
- [ ] All data files exist and are valid JSON
- [ ] localStorage is enabled
- [ ] Using a modern browser (Chrome/Firefox/Edge)
- [ ] Not in private/incognito mode
- [ ] Tried clearing cache and reloading

### Gather Debug Info
```javascript
// Copy this output when reporting issues
console.log('Browser:', navigator.userAgent);
console.log('LocalStorage Available:', typeof Storage !== 'undefined');
console.log('User Data:', localStorage.getItem('pmpUserData'));
console.log('Files Loaded:', {
    missions: !!AppState.missions,
    flashcards: AppState.flashcards?.length || 0,
    formulas: AppState.formulas?.categories?.length || 0
});
```

### Contact/Support
For additional help:
1. Check `MISSION-SYSTEM-GUIDE.md` for detailed documentation
2. Review `PROJECT_SUMMARY.txt` for project overview
3. Check console for specific error messages
4. Try the solutions above before modifying code

---

**Last Updated**: 2026-01-28
**Version**: 1.0.0
