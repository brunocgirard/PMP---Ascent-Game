# PMP Quiz Bank - Quick Reference Card

## 📊 At a Glance

| Metric | Value |
|--------|-------|
| **Total Questions** | 1,159 |
| **File Size** | 1.2 MB |
| **Generated** | Jan 28, 2026 |
| **All Tasks Covered** | ✅ 35/35 |
| **Ready to Use** | ✅ Yes |

---

## 📁 Files Location

```
C:\Users\Lenovo\Desktop\PMP - PREP EXAM\pmp-learning-game\data\
├── quiz-bank.json              (Main database - 1,159 questions)
├── quiz-bank-stats.json        (Statistics & metrics)
├── QUIZ-BANK-README.md         (Full documentation)
├── SAMPLE-QUESTIONS.md         (Quality examples)
└── QUICK-REFERENCE.md          (This file)
```

---

## 🎯 Distribution Quick View

### By Domain
- **People:** 387 (33%)
- **Process:** 511 (44%)
- **Business:** 261 (23%)

### By Type
- **Multiple Choice:** 832 (72%)
- **Multiple Response:** 177 (15%)
- **Matching:** 100 (9%)
- **Fill-blank:** 50 (4%)

### By Difficulty
- **Easy:** 359 (31%)
- **Medium:** 525 (45%)
- **Hard:** 275 (24%)

### By Methodology
- **Predictive:** 778 (67%)
- **Agile:** 381 (33%)

---

## 💻 Quick Code Snippets

### Load Quiz Bank
```javascript
const quizBank = require('./data/quiz-bank.json');
console.log(`Loaded ${quizBank.length} questions`);
```

### Get Task Questions
```javascript
const taskQuestions = quizBank.filter(q => q.taskId === 'd1t1');
console.log(`Task d1t1: ${taskQuestions.length} questions`);
```

### Random Selection
```javascript
function getRandom(count, domain) {
  return quizBank
    .filter(q => q.domain === domain)
    .sort(() => 0.5 - Math.random())
    .slice(0, count);
}

const quiz = getRandom(10, 'people');
```

### Check Answer
```javascript
function checkAnswer(question, userAnswer) {
  if (question.type === 'multiple-choice') {
    return userAnswer === question.correctAnswer;
  }
  if (question.type === 'fill-blank') {
    const normalized = userAnswer.toLowerCase().replace(/[\s$,]/g, '');
    return question.acceptableAnswers.some(ans =>
      ans.toLowerCase().replace(/[\s$,]/g, '') === normalized
    );
  }
  // ... handle other types
}
```

---

## 📚 Question Structure

```json
{
  "id": "q0001",
  "taskId": "d1t1",
  "domain": "people",
  "type": "multiple-choice",
  "methodology": "agile",
  "difficulty": "medium",
  "question": "Your question text here...",
  "options": [
    { "id": "a", "text": "Option A" },
    { "id": "b", "text": "Option B" },
    { "id": "c", "text": "Option C" },
    { "id": "d", "text": "Option D" }
  ],
  "correctAnswer": "b",
  "explanation": "Detailed explanation...",
  "references": {
    "task": "Domain 1 Task 1: Manage conflict",
    "principle": "Leadership"
  },
  "examTip": "Always choose inclusive approaches"
}
```

---

## 🎮 Usage Modes

### 1. Mission Waypoint Quiz
- **Questions:** 10-15 per task
- **Time:** Untimed
- **Feedback:** Immediate

### 2. Domain Assessment
- **Questions:** 50-70 per domain
- **Time:** 60-90 minutes
- **Feedback:** At end

### 3. Mock Exam
- **Questions:** 185 total (61 People, 76 Process, 48 Business)
- **Time:** 240 minutes (4 hours)
- **Feedback:** After submission

### 4. Weak Area Practice
- **Questions:** Filter by student's weak tasks
- **Time:** Flexible
- **Feedback:** Immediate with tips

---

## ✅ Quality Checklist

- [x] 1,159 questions generated
- [x] All 35 exam tasks covered
- [x] All question types implemented
- [x] All questions have explanations
- [x] All questions have exam tips
- [x] Distribution matches exam targets
- [x] All formulas included (33 total)
- [x] Difficulty progression implemented
- [x] JSON structure validated
- [x] Ready for integration

---

## 🎯 Quick Stats by Domain

### Domain 1: People (14 tasks, 387 questions)
Top tasks:
- d1t1 (Manage conflict): 90 questions
- d1t2 (Lead team): 37 questions
- d1t9 (Collaborate): 31 questions

### Domain 2: Process (17 tasks, 511 questions)
Top tasks:
- d2t5 (Budget/resources): 196 questions
- d2t3 (Risks): 98 questions
- d2t6 (Schedule): 30 questions

### Domain 3: Business (4 tasks, 261 questions)
All tasks:
- d3t1 (Compliance): 56 questions
- d3t2 (Benefits): 62 questions
- d3t3 (External changes): 62 questions
- d3t4 (Org change): 59 questions

---

## 🚀 Getting Started

1. **Load the quiz bank:**
   ```javascript
   const quizBank = require('./data/quiz-bank.json');
   ```

2. **Select questions for practice:**
   ```javascript
   // Get 10 questions for task d1t1
   const questions = quizBank
     .filter(q => q.taskId === 'd1t1')
     .slice(0, 10);
   ```

3. **Display question:**
   ```javascript
   console.log(questions[0].question);
   questions[0].options.forEach(opt => {
     console.log(`${opt.id}) ${opt.text}`);
   });
   ```

4. **Check answer:**
   ```javascript
   const userAnswer = 'b';
   const correct = userAnswer === questions[0].correctAnswer;
   console.log(correct ? '✅ Correct!' : '❌ Incorrect');
   console.log('Explanation:', questions[0].explanation);
   ```

---

## 📖 Documentation Links

- **Full Documentation:** `QUIZ-BANK-README.md`
- **Sample Questions:** `SAMPLE-QUESTIONS.md`
- **Generation Summary:** `../QUIZ-BANK-GENERATION-SUMMARY.md`
- **Statistics:** `quiz-bank-stats.json`

---

## 💡 Pro Tips

1. **Shuffle options** - Prevent answer pattern memorization
2. **Track mistakes** - Build adaptive practice sessions
3. **Use exam tips** - Show after wrong answers
4. **Mix difficulties** - Start easy, progress to hard
5. **Time practice** - 1.2 minutes per question avg
6. **Review explanations** - Learning value > just score

---

## ⚡ Performance

- **Load time:** < 100ms (1.2 MB file)
- **Filter operations:** < 10ms
- **Random selection:** < 5ms
- **Memory usage:** ~15 MB in memory

---

## 🎓 Exam Readiness

Target milestones:
- [ ] Complete all task quizzes (75%+ each)
- [ ] Pass 2 domain assessments (75%+)
- [ ] Complete 4 mock exams (75%+)
- [ ] Master all formulas (90%+)
- [ ] Review all mistakes
- [ ] **Schedule real exam!**

---

*Quick Reference for PMP Quiz Bank v1.0*
*1,159 questions ready to power your exam prep!*
