# 🚀 MVE Quick Reference Card

Print this and keep it handy while creating content!

---

## The 7-Section Checklist

For each task, create:

### 1️⃣ Hero (2 min)
- [ ] Task number, name, domain (from missions.json)
- [ ] Question count, exam weight (from missions.json)
- [ ] **One-line hook** (1-2 sentences showing why it matters)

**Test**: Does it grab attention in under 10 seconds?

---

### 2️⃣ Framework (8 min)
- [ ] Name (e.g., "I.S.E. Framework for Conflict")
- [ ] 3-5 steps (verb-based, actionable)
- [ ] Icons for each step
- [ ] Optional: table/list/diagram

**Test**: Can you explain it in 30 seconds? Is it memorable?
**Bonus**: Use an acronym/mnemonic if possible!

---

### 3️⃣ Scenario (7 min)
- [ ] 2-4 sentence setup (project + problem)
- [ ] Keyword: FIRST, BEST, or NEXT
- [ ] 4 options (1 correct, 3 plausible but wrong)
- [ ] Explanation: Why correct + why wrong + principle

**Test**: Does the correct answer align with PMI values?
**Common PMI values**: Inclusive, collaborative, servant leadership, follows process

---

### 4️⃣ Mindset (2 min)
- [ ] ✅ ALWAYS choose: [inclusive/collaborative approach]
- [ ] ❌ NEVER choose: [autocratic/exclusive approach]
- [ ] One-liner golden rule (under 10 words)

**Test**: Is it quotable? Can users tweet it?

---

### 5️⃣ Checkpoints (1 min)
- [ ] Can I [explain/name] the [framework/concepts]?
- [ ] Can I [identify/spot] [patterns/principles] in scenarios?
- [ ] Can I [apply/choose] the right [approach/answer]?

**Test**: Do they progress from knowledge → application?

---

### 6️⃣ Exam Tip (1 min)
- [ ] One sentence (max 15 words)
- [ ] Actionable decision rule or shortcut

**Formulas**:
- "Ask yourself: '[Question]' → That's your answer"
- "When in doubt, [action]"
- "Always [X], never [Y]"

---

### 7️⃣ Next Action (1 min)
- [ ] Flashcard count (from flashcards-mapped.json)
- [ ] Next phase = "Flashcards"

**Auto-filled!**

---

## Framework Creation Formulas

### Option 1: Acronym
**I.S.E.** = Interpret, Solve, Engage
**S.E.R.V.E.** = Support, Empower, Remove, Value, Enable

### Option 2: Process Flow
1. **Assess** → What's the situation?
2. **Plan** → What's the approach?
3. **Act** → What's the action?
4. **Monitor** → What's the outcome?

### Option 3: Questions to Ask
1. What's the **source/cause**?
2. What are the **options/approaches**?
3. What's the **PMI-aligned choice**?

---

## Wrong Answer Patterns (Scenarios)

Use these for 3 wrong options:

❌ **Autocratic**: PM decides alone
❌ **Exclusive**: Excludes stakeholders/team
❌ **Shortcuts**: Skips proper process
❌ **Command**: Forces solution (not servant leadership)
❌ **Avoidance**: Ignores/delays the problem
❌ **Escalation**: Escalates immediately (doesn't try to resolve)

**Correct answer should be**: Collaborative, inclusive, follows process, servant leadership

---

## PMI Core Values (Use These!)

✅ **Responsibility** - Own your actions
✅ **Respect** - Listen to all perspectives
✅ **Fairness** - Objective, transparent
✅ **Honesty** - Truthful communication
✅ **Servant Leadership** - Serve, don't command
✅ **Stewardship** - Care for resources
✅ **Team-focused** - Collaborative over individual

---

## Common Exam Keywords

Include these in scenarios:

- **FIRST** - Initial action to take
- **BEST** - Optimal PMI-aligned choice
- **NEXT** - Immediate next step
- **MOST** - Superlative choice
- **PRIMARY** - Main responsibility/action

---

## Time Budget (30-45 min per task)

- ⏱️ **10 min** - Extract content from Udemy/PMBOK
- ⏱️ **2 min** - Hero section
- ⏱️ **8 min** - Framework
- ⏱️ **7 min** - Scenario
- ⏱️ **2 min** - Mindset
- ⏱️ **1 min** - Checkpoints
- ⏱️ **1 min** - Exam tip
- ⏱️ **1 min** - Next action
- ⏱️ **10 min** - Quality check

**Total: ~42 minutes**

---

## Quality Checklist

Before finalizing:

**Content:**
- [ ] All 7 sections complete
- [ ] Framework is memorable (acronym preferred)
- [ ] Scenario feels exam-realistic
- [ ] Golden rule under 10 words
- [ ] Total read time ~5 minutes

**PMI Alignment:**
- [ ] Promotes collaboration
- [ ] Emphasizes inclusiveness
- [ ] Demonstrates servant leadership
- [ ] Follows proper process

**Engagement:**
- [ ] Scenario has expandable explanation
- [ ] Checkpoints are interactive
- [ ] Visual formatting (tables, icons)
- [ ] Clear call-to-action

---

## AI Prompt Templates

### For Hero Hook:
```
Write a compelling 1-2 sentence hook for this PMP task:
Task: [NAME]
Context: [BRIEF DESC]
Tone: Direct, exam-focused
Max: 2 sentences
```

### For Framework:
```
Create a 3-step decision framework for:
Task: [NAME]
Key concepts: [LIST]
Requirements:
- Memorable acronym
- Action verbs
- Each step under 15 words
```

### For Scenario:
```
Create a PMP exam scenario for:
Task: [NAME]
Framework: [YOUR FRAMEWORK]
Requirements:
- 2-4 sentences
- Use keyword: FIRST/BEST/NEXT
- 4 options (3 violate PMI values)
- Include explanation
```

### For Golden Rule:
```
Distill the PMI mindset into a golden rule:
Task: [NAME]
Context: [PRINCIPLES]
Create:
1. ALWAYS choose (10 words)
2. NEVER choose (10 words)
3. One-liner (under 10 words)
```

---

## Example: Full Task Template

```json
{
  "id": "d1t2",
  "title": "Lead a team",
  "domain": "People",
  "taskNumber": "Task 2",

  "hero": {
    "taskNumber": "Task 2",
    "taskName": "Lead a team",
    "questionCount": "25",
    "examWeight": "33",
    "domainName": "People",
    "oneLineHook": "[Your hook here]"
  },

  "framework": {
    "frameworkName": "[Name] Framework",
    "frameworkDescription": "When leading a team:",
    "steps": [
      {"label": "Step1", "icon": "🔍", "description": "..."},
      {"label": "Step2", "icon": "💡", "description": "..."},
      {"label": "Step3", "icon": "🤝", "description": "..."}
    ]
  },

  "scenario": {
    "scenarioText": "[2-4 sentences]",
    "keyword": "FIRST",
    "options": {
      "A": "[Wrong - autocratic]",
      "B": "[Wrong - exclusive]",
      "C": "[Wrong - shortcuts]",
      "D": "[Correct - PMI way]"
    },
    "correctAnswer": "D",
    "explanation": {
      "whyCorrect": "...",
      "whyWrong": "...",
      "keyPrinciple": "..."
    }
  },

  "mindset": {
    "alwaysChoice": "...",
    "neverChoice": "...",
    "oneLinerRule": "..."
  },

  "checkpoints": {
    "questions": [
      "Can I name/explain [X]?",
      "Can I spot/identify [Y]?",
      "Can I apply/choose [Z]?"
    ]
  },

  "examTip": "[One sentence max 15 words]",

  "nextAction": {
    "flashcardCount": "15",
    "nextPhase": "Flashcards"
  }
}
```

---

## Need Help?

**Stuck on frameworks?** Use these patterns:
- Assess → Plan → Act → Monitor
- Identify → Evaluate → Implement
- Understand → Collaborate → Execute

**Stuck on golden rules?** Look for:
- "Always choose..." in transcript
- "Never..." in transcript
- "The answer is to..." in transcript

**Stuck on scenarios?** Formula:
- Setup: [Project context + problem]
- Question: "What should you do [FIRST]?"
- Options: 3 violations + 1 PMI way

---

**Remember**: Done > Perfect. Ship it, then iterate!

🚀 **Now go create amazing content!**
