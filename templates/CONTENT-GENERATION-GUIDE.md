# 📚 MVE Content Generation Guide

## How to Create All 35 Learn Sections (30-45 min each)

This guide shows you how to generate engaging learn sections for all 35 PMP tasks using the **Minimal Viable Engagement (MVE)** template.

---

## 🎯 The MVE Template Structure

Every task gets these **7 standard sections**:

1. **Hero** - Quick hook (30 sec read)
2. **Framework** - Core mental model (2 min read)
3. **Scenario** - Exam-style question (1 min practice)
4. **Mindset** - Golden rule (30 sec memorize)
5. **Checkpoints** - Self-check (1 min)
6. **Exam Tip** - One-liner (10 sec)
7. **Next Action** - Clear next step (5 sec)

**Total read time per task: ~5 minutes**

---

## ⚡ Quick Start: 3-Step Process

### Step 1: Extract Source Content (10 min)

Use the Udemy transcript and PMBOK guide to find task-specific content.

**Search Pattern for Udemy Transcript:**
```bash
# Search for Domain X Task Y
grep -i "Domain 1.*Task 1\|Domain 1:Task 1\|d1t1" PMP_udemy_transcript.txt -A 100
```

**What to look for:**
- ✅ Exam tips ("Here's the exam tip", "Remember this")
- ✅ Real-world examples
- ✅ "What PMI wants you to know"
- ✅ Common mistakes
- ✅ Decision frameworks
- ✅ "Always choose" / "Never choose" statements

**AI Prompt for Extraction:**
```
I'm creating learn content for PMP Task: [TASK NAME]

Please analyze this Udemy transcript excerpt and extract:
1. Key exam tips mentioned
2. Decision frameworks or mental models
3. Real-world scenarios or examples
4. PMI mindset rules (always/never statements)
5. Common exam traps or mistakes

[PASTE TRANSCRIPT EXCERPT]
```

---

### Step 2: Fill the Template (20 min)

Use the `d1t1-example.json` as your guide. Fill in each section:

#### 1️⃣ Hero Section (2 min)
**Auto-filled from missions.json:**
- Task number, name, domain ✅ (already in data)
- Question count (get from missions.json) ✅
- Exam weight (get from missions.json) ✅

**Write yourself:**
- One-line hook (1-2 sentences showing relevance)

**Template:**
```json
"hero": {
  "taskNumber": "Task 1",
  "taskName": "Manage conflict",
  "questionCount": "27",
  "examWeight": "33",
  "domainName": "People",
  "oneLineHook": "[Why this task matters in 1-2 sentences]"
}
```

**AI Prompt:**
```
Write a compelling 1-2 sentence hook for this PMP task that shows why it matters:
Task: [TASK NAME]
Context: [Brief description]
Tone: Direct, action-oriented, exam-focused
```

---

#### 2️⃣ Framework Section (8 min)
**Create ONE memorable decision framework** (3-5 steps max)

**Look for in source material:**
- Existing acronyms or mnemonics
- Step-by-step processes
- Key questions to ask
- Decision trees

**Template:**
```json
"framework": {
  "frameworkName": "[Name] Framework for [Task]",
  "frameworkDescription": "When you see a [task] question:",
  "steps": [
    {
      "label": "Step 1",
      "icon": "🔍",
      "description": "What to do/ask"
    },
    {
      "label": "Step 2",
      "icon": "💡",
      "description": "What to do/ask"
    },
    {
      "label": "Step 3",
      "icon": "🤝",
      "description": "What to do/ask"
    }
  ],
  "additionalContent": "<p>Optional: Lists, tables, or extra context</p>"
}
```

**AI Prompt:**
```
Create a 3-step decision framework for this PMP task:
Task: [TASK NAME]
Key concepts: [List from transcript]
Requirements:
- Use a memorable acronym if possible
- Each step should be actionable (verb-based)
- Include what to look for or ask
- Keep each description under 15 words
```

**Examples:**
- d1t1 Manage Conflict → **I.S.E.** (Interpret, Solve, Engage)
- d1t2 Lead a Team → **S.E.R.V.E.** (Support, Empower, Remove, Value, Enable)
- d2t4 Determine Delivery → **C.H.O.O.S.E.** (Context, Hybrid, Options, Org culture, Stakeholder needs, Evaluate)

---

#### 3️⃣ Scenario Section (7 min)
**Write ONE exam-style question with 4 options**

**Formula:**
1. Setup (2-4 sentences): Project context + problem/conflict
2. Question: "What should you do **FIRST/BEST/NEXT**?"
3. 4 Options:
   - 3 wrong (but plausible) answers that violate PMI values
   - 1 correct answer aligned with PMI mindset
4. Explanation: Why correct + why others wrong + key principle

**Template:**
```json
"scenario": {
  "scenarioText": "[2-4 sentence project situation with a problem]",
  "keyword": "FIRST",
  "options": {
    "A": "[Wrong answer - usually autocratic/exclusive]",
    "B": "[Wrong answer - usually excludes someone]",
    "C": "[Wrong answer - usually shortcuts process]",
    "D": "[Correct answer - collaborative/inclusive/PMI way]"
  },
  "correctAnswer": "D",
  "explanation": {
    "whyCorrect": "[Why D aligns with PMI values - 2-3 sentences]",
    "whyWrong": "[Why A/B/C violate principles - 2-3 sentences]",
    "keyPrinciple": "[Underlying principle - 1 sentence]"
  }
}
```

**AI Prompt:**
```
Create a PMP exam-style scenario question for:
Task: [TASK NAME]
Framework: [The framework you created]

Requirements:
- Realistic project situation (2-4 sentences)
- Use keyword: FIRST, BEST, or NEXT
- 4 options where only 1 aligns with PMI values
- Wrong answers should be plausible but violate: inclusiveness, collaboration,
  servant leadership, or proper process
- Include full explanation
```

**Common Wrong Answer Patterns:**
- ❌ PM makes decision alone (not collaborative)
- ❌ Excludes stakeholders (not inclusive)
- ❌ Skips proper process (shortcuts)
- ❌ Forces solution (not servant leadership)
- ❌ Escalates immediately (doesn't try to resolve)
- ❌ Ignores the problem (avoidance)

---

#### 4️⃣ Mindset Section (2 min)
**ONE golden rule as do's vs don'ts**

**Look for in transcript:**
- "Always choose..."
- "Never choose..."
- "The answer is to..."
- "PMI wants you to..."

**Template:**
```json
"mindset": {
  "alwaysChoice": "[What to always choose - action-oriented]",
  "neverChoice": "[What to never choose - opposite behavior]",
  "oneLinerRule": "[Memorable quote - under 10 words]"
}
```

**AI Prompt:**
```
Distill the PMI mindset for this task into a golden rule:
Task: [TASK NAME]
Context: [Key principles from transcript]

Create:
1. What to ALWAYS choose (action-oriented, ~10 words)
2. What to NEVER choose (opposite behavior, ~10 words)
3. Memorable one-liner summary (under 10 words)
```

**Examples:**
- d1t1: "When in doubt, bring people together."
- d1t2: "Lead by serving, not by commanding."
- d2t2: "Communicate early, often, and inclusively."

---

#### 5️⃣ Checkpoints Section (1 min)
**3 self-check questions** (these are templated!)

**Formula:**
```
1. "Can I [explain/name/list] the [framework/key concepts]?"
2. "Can I [identify/spot] [exam patterns/principles] in scenarios?"
3. "Can I [apply/choose] the right [approach/answer] on exam questions?"
```

**Template:**
```json
"checkpoints": {
  "questions": [
    "Can I name the [X] steps of the [Framework Name]?",
    "Can I explain why [key principle] is always preferred on the PMP exam?",
    "Can I spot [wrong pattern] in exam answer options?"
  ]
}
```

**No AI needed** - Just fill in the blanks based on your framework!

---

#### 6️⃣ Exam Tip (1 min)
**ONE memorable one-liner** (max 15 words)

**Look for in transcript:**
- Instructor's "exam tips"
- Recurring advice
- Decision shortcuts

**Template:**
```json
"examTip": "[One sentence exam strategy or decision rule]"
```

**Formula:**
- "Ask yourself: '[Question]' → That's your answer"
- "When in doubt, [action]"
- "Always [principle], never [opposite]"
- "[Key concept] beats [lesser concept] on the exam"

**Examples:**
- "Ask yourself: 'Is this choice inclusive?' That's your answer."
- "Collaborate first, escalate last."
- "When in doubt, follow the process."
- "Servant leadership beats command-and-control every time."

---

#### 7️⃣ Next Action (1 min)
**Auto-filled from your flashcard data**

**Template:**
```json
"nextAction": {
  "flashcardCount": "15",  // Get from flashcards-mapped.json
  "nextPhase": "Flashcards"
}
```

---

### Step 3: Quality Check (10 min)

Before finalizing, verify:

**Content Checklist:**
- [ ] Hero hook grabs attention and shows exam relevance
- [ ] Framework is memorable (acronym/mnemonic preferred)
- [ ] Framework has 3-5 steps (not too many)
- [ ] Scenario is realistic and exam-like
- [ ] Correct answer aligns with PMI values (inclusive, collaborative, servant leadership)
- [ ] Wrong answers are plausible but violate PMI principles
- [ ] Golden rule is quotable (under 10 words)
- [ ] Checkpoints test knowledge → application
- [ ] Exam tip is actionable
- [ ] Total read time: ~5 minutes

**PMI Values Check:**
- [ ] Promotes collaboration over autocracy
- [ ] Emphasizes inclusiveness
- [ ] Demonstrates servant leadership
- [ ] Follows proper process
- [ ] Engages stakeholders appropriately

**Engagement Check:**
- [ ] Scenario has interactive explanation (details tag)
- [ ] Checkpoints have checkboxes for user interaction
- [ ] Visual elements (tables, icons, formatting)
- [ ] Clear progression (read → practice → check → continue)

---

## 🤖 AI-Assisted Batch Generation

### Batch Processing Script (Python)

```python
import json
import openai  # or anthropic

# Load your data
with open('data/missions.json') as f:
    missions = json.load(f)

with open('PMP_udemy_transcript.txt') as f:
    transcript = f.read()

# Template
template = {
    "id": "",
    "title": "",
    "domain": "",
    "taskNumber": "",
    "hero": {},
    "framework": {},
    "scenario": {},
    "mindset": {},
    "checkpoints": {},
    "examTip": "",
    "nextAction": {}
}

def generate_task_content(task):
    task_id = task['id']
    task_name = task['name']

    # Extract relevant transcript section
    # (search for Domain X Task Y)
    relevant_content = extract_transcript_section(transcript, task_id)

    # Use AI to generate each section
    hero = generate_hero(task, relevant_content)
    framework = generate_framework(task, relevant_content)
    scenario = generate_scenario(task, framework, relevant_content)
    mindset = generate_mindset(task, relevant_content)
    checkpoints = generate_checkpoints(framework)
    exam_tip = generate_exam_tip(task, relevant_content)

    # Fill template
    content = template.copy()
    content['id'] = task_id
    content['title'] = task_name
    content['hero'] = hero
    content['framework'] = framework
    content['scenario'] = scenario
    content['mindset'] = mindset
    content['checkpoints'] = checkpoints
    content['examTip'] = exam_tip

    return content

# Process all tasks
all_content = {}
for mission in missions['missions']:
    if 'tasks' in mission:
        for task in mission['tasks']:
            print(f"Generating content for {task['id']}...")
            all_content[task['id']] = generate_task_content(task)

# Save
with open('data/mve-content.json', 'w') as f:
    json.dump(all_content, f, indent=2)
```

---

## 📊 Time Estimates

### Per Task:
- **Extract source content**: 10 min
- **Fill template**: 20 min
- **Quality check**: 10 min
- **Total per task**: 30-45 min

### For All 35 Tasks:
- **With manual effort**: 18-26 hours
- **With AI assistance**: 10-15 hours
- **With batch script**: 5-8 hours (review time)

### Recommended Approach:
1. **Day 1**: Create 5 People domain tasks manually (understand pattern)
2. **Day 2**: Create batch AI prompts
3. **Day 3-4**: Generate remaining 30 tasks with AI
4. **Day 5**: Quality review and polish

---

## 💡 Pro Tips

### Creating Great Frameworks:
1. **Use acronyms**: Easier to remember (I.S.E., S.E.R.V.E.)
2. **Action verbs**: Each step should be a verb (Analyze, Build, Collaborate)
3. **3-5 steps only**: More than 5 = too complex
4. **Test it**: Can you explain it in 30 seconds?

### Writing Scenarios:
1. **Use real project situations**: Team conflicts, scope changes, stakeholder issues
2. **Include context**: Project type, who's involved, what happened
3. **Make it exam-like**: Use FIRST/BEST/NEXT keywords
4. **Wrong answers should tempt**: They should sound reasonable but violate PMI values

### Golden Rules:
1. **Must be quotable**: Can users tweet it?
2. **Under 10 words**: Longer = less memorable
3. **Action-oriented**: "Do X" not "X is important"
4. **Contrast helps**: "Choose X over Y" or "X not Y"

---

## 📂 File Structure

```
/templates/
  ├── learn-section-template.json      # Template definition
  ├── d1t1-example.json                # Completed example
  ├── content-renderer.js              # Renders JSON to HTML
  ├── mve-styles.css                   # Styles for all sections
  └── CONTENT-GENERATION-GUIDE.md      # This file

/data/
  ├── mve-content.json                 # All 35 generated tasks (create this)
  ├── missions.json                    # Source for task metadata
  ├── flashcards-mapped.json           # For flashcard counts
  └── learning-content.json            # Legacy content (keep as backup)

/js/
  └── app.js                           # Update renderLearnPhase() to use MVE content
```

---

## 🚀 Next Steps

1. **Review the example**: Study `d1t1-example.json` thoroughly
2. **Test one task**: Create d1t2 manually to understand the process
3. **Extract patterns**: Document any task-specific patterns you find
4. **Generate remaining tasks**: Use AI assistance for scale
5. **Quality review**: Ensure consistency across all 35 tasks

---

## ✅ Success Criteria

You'll know your MVE content is ready when:
- [ ] All 35 tasks have complete JSON files
- [ ] Each task reads in ~5 minutes
- [ ] Frameworks are memorable (ideally acronyms)
- [ ] Scenarios feel exam-realistic
- [ ] Golden rules are quotable
- [ ] No section feels like "filler content"
- [ ] Users can immediately apply the framework

---

## 🆘 Need Help?

**Common Questions:**

**Q: What if the transcript doesn't have clear exam tips for a task?**
A: Use the PMBOK guide, cross-reference similar tasks, or infer from PMI's 12 Principles and servant leadership mindset.

**Q: How do I create a framework when there isn't an obvious one?**
A: Use this formula:
1. What to analyze/assess
2. What to plan/decide
3. What to do/implement
4. What to monitor/adapt

**Q: Can I skip sections for simpler tasks?**
A: No - consistency is key. Even simple tasks need all 7 sections. Keep them shorter if needed, but maintain structure.

**Q: How do I know if my golden rule is good?**
A: Ask: "Could a test-taker recite this under pressure?" If yes, it's good.

---

**Remember**: Simple > Perfect. Ship all 35 tasks with this template, then iterate based on user feedback!
