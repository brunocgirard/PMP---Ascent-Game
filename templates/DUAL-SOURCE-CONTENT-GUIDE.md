# 📚 Enhanced MVE Content Generation Using Both Sources

## Your Sources

### 1. **Udemy Transcript** (`PMP_udemy_transcript.txt`)
- ✅ **Strengths**: Exam tips, real-world examples, practical scenarios, instructor insights, "what PMI wants you to know"
- ✅ **Best for**: Scenarios, exam patterns, golden rules, memory techniques, common mistakes

### 2. **PMBOK Guide 7th Edition** (`PMI - A guide to the project management body of knowledge. PMBOK guide_SevenEdition.txt`)
- ✅ **Strengths**: Official definitions, principles, performance domains, authoritative guidance
- ✅ **Best for**: Frameworks, official terminology, theoretical foundation, PMI's actual position

## Why Use Both?

**PMBOK Guide** = What PMI says officially
**Udemy Transcript** = How to apply it on the exam

**Combined** = Authoritative + Practical = Best learning

---

## The Enhanced MVE Template (10 Sections)

Here's which source to use for each section:

| Section | Primary Source | Secondary Source | Why |
|---------|----------------|------------------|-----|
| **0. Progress Dashboard** | Auto-generated | N/A | From your app data |
| **1. Quick Scenario** | Udemy | PMBOK examples | Udemy has exam-style scenarios |
| **2. "Aha!" Debrief** | Both | Both | Udemy for "why", PMBOK for official stance |
| **3. Core Framework** | PMBOK + Udemy | Both | PMBOK for structure, Udemy for exam application |
| **4. Visual Reference Card** | Both | Both | Combine official + practical |
| **5. Second Scenario** | Udemy | PMBOK examples | Udemy has more scenarios |
| **6. Real PM Wisdom** | Udemy | PMBOK quotes | Udemy for instructor quotes, PMBOK for official |
| **7. Apply to YOUR Job** | Template | N/A | User reflection exercise |
| **8. Memory Palace** | Creative | Both | Create story based on concepts from both |
| **9. Spaced Repetition** | Template | N/A | Standard schedule |
| **10. Mission Checklist** | Auto-generated | N/A | From your flashcard/quiz data |

---

## Step-by-Step Workflow (Per Task)

### Step 1: Extract from PMBOK Guide (15 min)

#### Find the Relevant Performance Domain

The 35 tasks map to these PMBOK 7 Performance Domains:

**People Domain tasks (d1t1-d1t14) → Map to:**
- Team Performance Domain
- Stakeholder Performance Domain

**Process Domain tasks (d2t1-d2t17) → Map to:**
- Planning Performance Domain
- Project Work Performance Domain
- Delivery Performance Domain
- Measurement Performance Domain
- Uncertainty Performance Domain

**Business Domain tasks (d3t1-d3t4) → Map to:**
- Stakeholder Performance Domain
- Development Approach and Life Cycle Performance Domain

#### Search Strategy for PMBOK

For **d1t1 (Manage Conflict)**, search for:

```bash
# Search for conflict-related content
grep -i "conflict\|disagree\|resolution\|dispute" "PMI - PMBOK guide_SevenEdition.txt" -C 5

# Search for Team Performance Domain
grep -i "Team Performance Domain" "PMI - PMBOK guide_SevenEdition.txt" -A 100

# Search for servant leadership (key to conflict)
grep -i "servant leadership" "PMI - PMBOK guide_SevenEdition.txt" -C 3
```

#### What to Extract from PMBOK:

✅ **Official definitions** (e.g., "What is conflict?")
✅ **Principles** (e.g., Principle 6: Demonstrate Leadership Behaviors)
✅ **Performance domain guidance** (e.g., Team Performance Domain outcomes)
✅ **Official PMI position** (e.g., "Some conflict is beneficial")
✅ **Models/methods** mentioned (e.g., conflict resolution techniques if listed)
✅ **Key outcomes** for the domain

#### Example for d1t1:

**Search Results:**
```
PMBOK Section: Team Performance Domain
Quote: "Some level of conflict is inevitable and even beneficial when it is
openly discussed and managed. Project managers should create an environment
where differences are respected and diverse perspectives are encouraged."

PMBOK Section: Leadership
Quote: "Servant leaders place emphasis on developing project team members to
their fullest potential. They enable the project team to perform at their
highest level by removing impediments and constraints."
```

**Store these** for Section 3 (Framework) and Section 6 (PM Wisdom)

---

### Step 2: Extract from Udemy Transcript (15 min)

#### Search Strategy for Udemy

For **d1t1 (Manage Conflict)**:

```bash
# Search for the specific task section
grep -i "Domain 1.*Task 1\|manage conflict" "PMP_udemy_transcript.txt" -A 150

# Search for conflict resolution section
grep -i "conflict resolution\|five conflict" "PMP_udemy_transcript.txt" -A 50

# Search for exam tips
grep -i "exam tip.*conflict\|conflict.*exam" "PMP_udemy_transcript.txt" -C 5
```

#### What to Extract from Udemy:

✅ **Exam tips** (e.g., "Always choose inclusive solutions")
✅ **Real-world scenarios** (e.g., Bob and Jane dispute)
✅ **Decision frameworks** (e.g., "Interpret source and stage")
✅ **Common mistakes** (e.g., "Never exclude stakeholders")
✅ **Instructor quotes** (e.g., "PM = problem management")
✅ **What PMI wants** (e.g., "PMI wants you to know...")
✅ **Golden rules** (e.g., "Bring people together")

#### Example for d1t1:

**Search Results:**
```
Udemy - Domain 1 Task 1 section:
"Managing conflicts. I personally believe that project management shouldn't be
called project management. It should be called problem management."

"The answer is always gonna be to involve people in the solution and use tools
that are inclusive, not exclusive."

"Source and stage of the conflict. Where did it come from? What started it?
What's the stage? What's the conflict? What's being affected on a project?"

5 Levels of Conflict:
Level 1: Information sharing
Level 2: Personal protection
Level 3: Contest (win/lose)
Level 4: Crusade
Level 5: Destruction
```

**Store these** for Section 1 (Scenario), Section 2 (Debrief), Section 8 (Memory)

---

### Step 3: Build Section 0 - Progress Dashboard (2 min)

**Auto-generated from app data:**

```javascript
{
  "progressDashboard": {
    "taskNumber": "d1t1",
    "tasksCompleted": "12/35",  // From user progress
    "totalXP": "600",           // From gamification system
    "dayStreak": "5",           // From user activity
    "currentLevel": "Level 3",  // From XP thresholds
    "domainProgress": {
      "domain": "People",
      "completed": "3",
      "total": "14",
      "percentage": "21%"
    },
    "taskMeta": {
      "name": "Manage Conflict",
      "questionCount": "27",
      "domain": "People",
      "xpAvailable": "50"
    }
  }
}
```

**No content extraction needed** - pulls from your system

---

### Step 4: Build Section 1 - Quick Scenario Challenge (15 min)

**Primary source**: Udemy transcript
**Secondary source**: PMBOK examples (if available)

#### Process:

1. **Find scenario in Udemy** (often in task-specific section)
2. **If no scenario exists**, create one using:
   - Udemy's guidance on "what PMI wants"
   - PMBOK's performance domain context
   - Real project situations

#### Template:

```json
{
  "quickScenarioChallenge": {
    "challengeHeader": "⚡ Quick Challenge: Can you solve this?",
    "challengeSubtitle": "Don't worry if you get it wrong—that's how you learn!",
    "scenarioStory": "[2-4 sentence realistic project situation]",
    "question": "What should you do FIRST/BEST/NEXT?",
    "options": {
      "A": {
        "text": "[Wrong - autocratic/exclusive]",
        "correct": false,
        "reasoning": "Violates [PMI principle]"
      },
      "B": {
        "text": "[Wrong - excludes someone]",
        "correct": false,
        "reasoning": "Not inclusive"
      },
      "C": {
        "text": "[Wrong - shortcuts process]",
        "correct": false,
        "reasoning": "Doesn't follow PMI approach"
      },
      "D": {
        "text": "[Correct - PMI way]",
        "correct": true,
        "reasoning": "Aligns with [servant leadership/inclusiveness/etc]"
      }
    }
  }
}
```

#### Example (d1t1) from Udemy:

```json
{
  "quickScenarioChallenge": {
    "scenarioStory": "You're managing a software project. Two senior developers, Bob and Jane, are in a heated disagreement about which programming methodology to use. The conflict started during sprint planning and has now escalated—voices are raised and other team members feel uncomfortable.",
    "question": "What should you do FIRST?",
    "options": {
      "A": {
        "text": "Research both methodologies yourself and decide which is best, then inform the team",
        "correct": false,
        "reasoning": "PM makes decision alone - not servant leadership"
      },
      "D": {
        "text": "Bring Bob and Jane together for a face-to-face discussion to collaboratively find a solution",
        "correct": true,
        "reasoning": "Inclusive, collaborative, servant leadership approach"
      }
    }
  }
}
```

**Source**: Udemy transcript, Domain 1 Task 1 section

---

### Step 5: Build Section 2 - "Aha!" Debrief (10 min)

**Combine**: Udemy's "why" + PMBOK's official position

#### Template:

```json
{
  "ahaDebrief": {
    "correctAnswer": "D - [Answer text]",
    "whySection": {
      "title": "🤔 Why is this the PMI way?",
      "insights": [
        {
          "principle": "Inclusive",
          "explanation": "Both parties involved in solution",
          "pmbokSupport": "[PMBOK quote if available]"
        },
        {
          "principle": "Collaborative",
          "explanation": "Team solves own problems (servant leadership)",
          "pmbokSupport": "[PMBOK quote]"
        }
      ]
    },
    "trapSection": {
      "title": "⚠️ Why the others are traps",
      "explanation": "Options A, B, C all violate the same principle: They exclude someone or have the PM make the decision alone.",
      "trapTable": [
        {
          "option": "A",
          "violation": "PM decides alone",
          "pmiValueBroken": "Not servant leadership"
        }
      ]
    },
    "patternRecognition": {
      "title": "🎯 The Pattern You'll See Again",
      "checklist": [
        "Does this choice include ALL affected parties?",
        "Am I facilitating or dictating?",
        "Would a servant leader do this?"
      ],
      "patternRule": "If ANY answer is NO → Wrong choice!"
    }
  }
}
```

#### Example (d1t1):

**From Udemy**:
- "The answer is always gonna be to involve people in the solution"
- "Use tools that are inclusive, not exclusive"

**From PMBOK**:
- "Servant leaders enable the project team to perform at their highest level"
- "Create an environment where differences are respected"

**Combined** into debrief explaining WHY D is correct

---

### Step 6: Build Section 3 - Core Framework (20 min)

**Primary source**: PMBOK structure + Udemy application
**This is the most important section**

#### Process:

1. **Extract structure from PMBOK**:
   - What does PMBOK say about this task/domain?
   - What are the key activities?
   - What are the outcomes?

2. **Extract exam application from Udemy**:
   - How does instructor teach this?
   - What framework does instructor use?
   - What keywords to watch for?

3. **Create acronym/mnemonic** if possible

#### Template:

```json
{
  "coreFramework": {
    "frameworkName": "[Acronym] Framework for [Task]",
    "frameworkIntro": "You just experienced [task] in action. Now here's the systematic approach PMI expects:",
    "frameworkTable": {
      "columns": ["Step", "Action", "Key Questions", "Exam Keywords"],
      "rows": [
        {
          "step": {
            "badge": "I",
            "name": "Interpret",
            "color": "blue"
          },
          "action": "Identify the SOURCE and STAGE of conflict",
          "keyQuestions": [
            "What caused this?",
            "What level (1-5)?",
            "Who's affected?"
          ],
          "examKeywords": "The conflict arose because...",
          "pmbokBasis": "[PMBOK domain guidance]",
          "udemyInsight": "[Udemy exam tip]"
        }
      ]
    },
    "additionalContent": {
      "deepDive": {
        "title": "📊 The 5 Levels of Conflict Escalation",
        "source": "Udemy transcript + general PM knowledge",
        "levels": [
          {
            "level": 1,
            "icon": "🟢",
            "name": "Information Sharing",
            "description": "Let's share info. Here's how I'd do it.",
            "action": "Facilitate discussion"
          }
        ]
      }
    },
    "pmbokConnection": {
      "performanceDomain": "Team Performance Domain",
      "principle": "Principle 6: Demonstrate Leadership Behaviors",
      "quote": "[Relevant PMBOK quote]"
    }
  }
}
```

#### Example (d1t1) - Combining Sources:

**From PMBOK**:
- Team Performance Domain emphasizes servant leadership
- "Create environment where differences are respected"

**From Udemy**:
- I.S.E. structure: Interpret source/stage, Solve, Engage inclusively
- 5 levels of conflict escalation

**Combined Framework**:
```
I.S.E. Framework for Conflict Management
  + PMBOK: Servant leadership foundation
  + Udemy: 5 levels escalation model
  + Udemy: Exam keywords
  = Complete actionable framework
```

---

### Step 7: Build Section 4 - Visual Reference Card (5 min)

**Distill Section 3** into one-page printable format

```json
{
  "visualReferenceCard": {
    "taskTitle": "Manage Conflict",
    "framework": {
      "acronym": "I.S.E.",
      "steps": [
        "🔍 Interpret source & stage",
        "💡 Solve with options",
        "🤝 Engage inclusively"
      ]
    },
    "quickReference": "1🟢 Share → 2🟡 Protect → 3🟠 Contest → 4🔴 Crusade → 5⛔ Destroy",
    "goldenRule": "When in doubt, bring people together.",
    "examTip": "Ask: 'Is this inclusive?' → That's your answer.",
    "pmbokPrinciple": "Principle 6: Demonstrate Leadership Behaviors",
    "downloadable": true,
    "printable": true
  }
}
```

**Source**: Condensed from PMBOK principles + Udemy exam tips

---

### Step 8: Build Section 5 - Second Scenario (15 min)

**Create a NEW scenario** that applies the framework from Section 3

#### Guidelines:

1. **Different context** than Scenario 1
2. **More complex** (higher level of difficulty)
3. **Requires applying the framework** you just taught
4. **Feedback maps back to framework** (e.g., "You applied I.S.E.!")

#### Template:

```json
{
  "secondScenario": {
    "title": "💪 Apply What You Learned",
    "intro": "Now let's see if you can apply the [Framework Name]!",
    "scenarioStory": "[New situation, more complex]",
    "question": "Using the [Framework], what should you do FIRST?",
    "options": { /* Same structure as Scenario 1 */ },
    "feedbackCorrect": {
      "title": "🎉 Excellent! You're applying the framework!",
      "frameworkMapping": {
        "step1": "You recognized [X] (Interpret)",
        "step2": "You evaluated [Y] (Solve)",
        "step3": "You chose [Z] (Engage)"
      },
      "xpBonus": "+10 XP for applying framework! 🎯"
    }
  }
}
```

#### Example (d1t1):

**Scenario 1**: Bob and Jane programming dispute (Level 3)
**Scenario 2**: CMO vs Brand Director messaging conflict (Level 3, different context)

**Shows**: Same framework (I.S.E.) applies across contexts

---

### Step 9: Build Section 6 - Real PM Wisdom (10 min)

**Extract quotes from BOTH sources**

#### What to Include:

1. **Udemy instructor quote** (practical/exam-focused)
2. **PMBOK official quote** (authoritative)
3. **Field insights** (from Udemy or general PM knowledge)

#### Template:

```json
{
  "pmWisdom": {
    "quotes": [
      {
        "type": "instructor",
        "icon": "🎓",
        "text": "[Udemy instructor quote]",
        "author": "Andrew Ramdayal, PMP Instructor",
        "source": "Udemy PMP Prep Course"
      },
      {
        "type": "pmbok",
        "icon": "📘",
        "text": "[PMBOK official guidance]",
        "author": "PMBOK Guide, 7th Edition",
        "source": "[Specific section/domain]"
      }
    ],
    "fieldInsights": [
      {
        "title": "Conflict is normal",
        "insight": "Every project has 5-10 significant conflicts",
        "source": "General PM practice"
      }
    ]
  }
}
```

#### Example (d1t1):

**Udemy Quote**:
> "I personally believe project management should be called problem management.
> Throughout the day, you're managing problems."

**PMBOK Quote**:
> "Some level of conflict is inevitable and even beneficial when it is openly
> discussed and managed. Project managers should create an environment where
> differences are respected and diverse perspectives are encouraged."

**Combined**: Theory + Practice

---

### Step 10: Build Section 7 - Apply to YOUR Job (5 min)

**Template-based** - same structure for all tasks

```json
{
  "personalApplication": {
    "title": "🏢 Apply to YOUR Work",
    "reflectionPrompt": "Learning sticks when you connect it to YOUR experience. Take 2 minutes to reflect:",
    "questions": [
      {
        "id": "source",
        "question": "What was the SOURCE of the conflict?",
        "type": "dropdown",
        "options": ["Resources", "Priorities", "Methods", "Personalities", "Scope", "Expectations"]
      },
      {
        "id": "level",
        "question": "What LEVEL was it? (1-5)",
        "type": "dropdown",
        "options": ["Level 1 🟢", "Level 2 🟡", "Level 3 🟠", "Level 4 🔴", "Level 5 ⛔"]
      },
      {
        "id": "resolution",
        "question": "How was it resolved?",
        "type": "textarea",
        "placeholder": "Briefly describe..."
      },
      {
        "id": "improvement",
        "question": "Using [Framework], what would you do differently as a PMP?",
        "type": "textarea",
        "placeholder": "Example: I would have brought both parties together earlier..."
      }
    ],
    "saveable": true,
    "xpReward": 5,
    "valueStatement": "Research shows adult learners retain 2-3x more when connecting to personal experience."
  }
}
```

**No source extraction needed** - standard template

---

### Step 11: Build Section 8 - Memory Palace (15 min)

**Creative synthesis** of PMBOK concepts + Udemy framework

#### Process:

1. Take the framework acronym (e.g., I.S.E.)
2. Create a visual/spatial story
3. Incorporate the levels/stages
4. Make it memorable

#### Template:

```json
{
  "memoryPalace": {
    "title": "🧠 Memory Technique: The Story Method",
    "intro": "Your brain remembers stories better than facts. Here's a story to remember [Framework]:",
    "story": {
      "title": "[Memorable Title]",
      "narrative": "[Visual story that incorporates all key elements]",
      "scenes": [
        {
          "step": "I",
          "visual": "🔍",
          "description": "[Story element for this step]"
        }
      ],
      "moral": "[The key takeaway]"
    },
    "selfTest": "Close your eyes. Can you see [the scene]? Can you remember [the acronym]?"
  }
}
```

#### Example (d1t1) - Mountain Conflict Story:

**Elements to include**:
- I.S.E. steps
- 5 levels (as climbing mountain)
- Inclusive principle

**Story**: Two hikers arguing about path → Climb mountain → Escalation levels as altitude → Resolution at base camp

**Basis**: PMBOK servant leadership + Udemy 5 levels

---

### Step 12: Build Section 9 - Spaced Repetition Scheduler (2 min)

**Standard template** for all tasks

```json
{
  "spacedRepetition": {
    "title": "🔄 Lock It In: Your Review Schedule",
    "intro": "Research shows spaced repetition doubles retention. Here's your personalized schedule:",
    "schedule": [
      {
        "timeframe": "Tomorrow",
        "icon": "📅",
        "tasks": [
          "Recite [Framework] from memory",
          "Draw the [levels/model]",
          "Re-do Scenario 1"
        ],
        "duration": "2 min",
        "reminderButton": true
      },
      {
        "timeframe": "3 Days",
        "tasks": ["Review flashcards", "Focus on ones you got wrong"],
        "duration": "3 min"
      },
      {
        "timeframe": "1 Week",
        "tasks": ["Re-take quiz", "Aim for 100%"],
        "duration": "5 min"
      },
      {
        "timeframe": "2 Weeks",
        "tasks": ["Teach framework to someone", "Quiz them"],
        "duration": "10 min"
      }
    ],
    "calendarIntegration": true,
    "retentionVisualization": {
      "withoutReview": "50% forgotten in 1 week",
      "withReview": "90% retained for exam day"
    }
  }
}
```

**No source extraction needed** - research-backed schedule

---

### Step 13: Build Section 10 - Mission Checklist (2 min)

**Auto-generated from your data**

```json
{
  "missionChecklist": {
    "title": "✅ Mission Checklist: Complete This Task",
    "xpAvailable": 50,
    "items": [
      {
        "id": "read",
        "task": "Read the learn section",
        "xp": 10,
        "completed": true
      },
      {
        "id": "reflection",
        "task": "Save your personal reflection",
        "xp": 5,
        "description": "Apply [Framework] to YOUR job"
      },
      {
        "id": "flashcards",
        "task": "Review [X] flashcards",
        "xp": 15,
        "flashcardCount": 15,  // From flashcards-mapped.json
        "ctaButton": "Start Flashcards"
      },
      {
        "id": "quiz",
        "task": "Pass the [X]-question quiz (75%+)",
        "xp": 20,
        "quizQuestions": 5  // From missions.json
      }
    ],
    "progressBar": true,
    "nextActionPrimary": {
      "text": "Continue to Flashcards ([X] cards)",
      "link": "/flashcards/[taskId]"
    }
  }
}
```

**Source**: Your existing missions.json + flashcards data

---

## Content Extraction Prompts

### For AI-Assisted Content Generation

#### Prompt 1: Extract PMBOK Content

```
I'm creating PMP exam prep content for: [TASK NAME]

Please analyze this PMBOK Guide 7th Edition excerpt and extract:

1. **Official Definition**: How does PMBOK define this concept?
2. **Performance Domain**: Which domain(s) does this relate to?
3. **Principles**: Which of the 12 principles apply?
4. **Key Outcomes**: What are the desired outcomes?
5. **Official Stance**: What is PMI's position on this topic?
6. **Notable Quotes**: Any quotable official guidance?

[PASTE PMBOK EXCERPT]

Format as structured JSON.
```

#### Prompt 2: Extract Udemy Exam Insights

```
I'm creating PMP exam prep content for: [TASK NAME]

Please analyze this Udemy transcript excerpt and extract:

1. **Exam Tips**: What does the instructor say about the exam?
2. **Scenarios**: Any real-world examples or scenarios?
3. **Golden Rules**: "Always choose X", "Never choose Y" statements
4. **Common Mistakes**: What mistakes do students make?
5. **Decision Framework**: Is there a framework/acronym taught?
6. **Keywords**: What exam keywords are mentioned?
7. **Instructor Quotes**: Any memorable quotes?

[PASTE UDEMY EXCERPT]

Format as structured JSON.
```

#### Prompt 3: Synthesize into Enhanced MVE Section

```
Using this PMBOK content and Udemy content, create Section 3 (Core Framework) for Enhanced MVE:

PMBOK Content:
[PASTE EXTRACTED PMBOK]

Udemy Content:
[PASTE EXTRACTED UDEMY]

Task: [TASK NAME]

Requirements:
- Create a 3-5 step framework
- Use an acronym if possible
- Include PMBOK official position
- Include Udemy exam application
- Show what to look for on exam
- Map to performance domain

Format as JSON following the Section 3 template.
```

---

## Time Estimates (Per Task)

| Step | Activity | Time |
|------|----------|------|
| 1 | Extract from PMBOK | 15 min |
| 2 | Extract from Udemy | 15 min |
| 3 | Section 0 (Progress) | 2 min |
| 4 | Section 1 (Scenario) | 15 min |
| 5 | Section 2 (Debrief) | 10 min |
| 6 | Section 3 (Framework) | 20 min |
| 7 | Section 4 (Card) | 5 min |
| 8 | Section 5 (Scenario 2) | 15 min |
| 9 | Section 6 (PM Wisdom) | 10 min |
| 10 | Section 7 (Personal) | 5 min |
| 11 | Section 8 (Memory) | 15 min |
| 12 | Section 9 (Spaced Rep) | 2 min |
| 13 | Section 10 (Checklist) | 2 min |
| **TOTAL** | | **~2.5 hours per task** |

**For 35 tasks**: ~87.5 hours of content creation

**With AI assistance**: ~50-60 hours (AI drafts, human reviews)

---

## Quality Checklist

Before finalizing each task, verify:

### PMBOK Integration ✅
- [ ] Official definition included
- [ ] Mapped to correct performance domain
- [ ] Connected to relevant principle(s)
- [ ] PMBOK quote in PM Wisdom section
- [ ] Authoritative, not just practical

### Udemy Integration ✅
- [ ] Exam tip included
- [ ] Real scenario from transcript (or created in style)
- [ ] Instructor quote in PM Wisdom
- [ ] Golden rule extracted
- [ ] Framework matches exam application

### Enhanced MVE Complete ✅
- [ ] All 10 sections present
- [ ] Scenarios BEFORE theory
- [ ] Personal connection exercise
- [ ] Spaced repetition scheduler
- [ ] Memory technique/story
- [ ] Multiple practice opportunities
- [ ] Full gamification elements

### Accuracy ✅
- [ ] No contradictions between PMBOK & Udemy
- [ ] PMI values represented correctly
- [ ] Terminology matches official PMBOK
- [ ] Exam tips align with current exam format

---

## Example: Complete d1t1 (Manage Conflict)

See `enhanced-d1t1-example.json` for a fully worked example using both sources.

**Sources used**:
- PMBOK Team Performance Domain
- PMBOK Principle 6 (Leadership)
- Udemy Domain 1 Task 1 section
- Udemy Conflict Resolution section
- Synthesized into cohesive Enhanced MVE format

---

## Next Steps

1. **Read this guide fully** ✅
2. **Practice with d1t1** - Extract from both sources, build all 10 sections
3. **Refine your workflow** - Find what works for you
4. **Use AI prompts** - Speed up extraction
5. **Build remaining 34 tasks** - Consistent quality

**Ready to start? Let's build the first Enhanced MVE task with both sources!** 🚀
