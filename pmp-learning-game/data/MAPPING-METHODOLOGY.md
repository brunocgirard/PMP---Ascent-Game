# Flashcard to Exam Task Mapping Methodology

## Overview

This document describes how the 300+ PMP flashcards were mapped to the specific exam domain tasks (d1t1-d3t4) from the PMP Exam Content Outline.

## Mapping Process

### 1. Keyword-Based Analysis

Each flashcard was analyzed based on:
- **Question content**: The main text of the question
- **Answer content**: The answer text and concepts
- **Category & Subcategory**: Broader classification
- **Tags**: Specific concept tags
- **Related concepts**: Connected topics

### 2. Task Keyword Dictionary

A comprehensive keyword dictionary was created for all 35 exam tasks:

#### Domain 1: People (14 tasks)
- **d1t1** (Manage conflict): conflict, dispute, disagreement, resolution, escalation, deescalate
- **d1t2** (Lead a team): lead, leadership, servant leader, directive, collaborative, inspire, motivate, vision, mission
- **d1t3** (Support team performance): performance, kpi, key performance, assess, coaching, velocity
- **d1t4** (Empower team members): empower, authority, decision making, accountability, ownership
- **d1t5** (Ensure adequate training): training, train, skill development, competency, learning
- **d1t6** (Build a team): build team, team building, select team, resource requirements, skill assessment
- **d1t7** (Remove impediments): impediment, obstacle, blocker, remove, address, barrier
- **d1t8** (Negotiate agreements): negotiate, agreement, contract, vendor, supplier, seller
- **d1t9** (Collaborate with stakeholders): collaborate, stakeholder engagement, transparency, trust
- **d1t10** (Build shared understanding): understanding, misunderstanding, communication, consensus
- **d1t11** (Engage virtual teams): engage, motivate, morale, team engagement, recognition
- **d1t12** (Define ground rules): ground rules, norms, standards, expectations
- **d1t13** (Mentor stakeholders): mentor, coach, coaching, mentoring, guidance
- **d1t14** (Emotional intelligence): emotional intelligence, eq, empathy, self-awareness

#### Domain 2: Process (17 tasks)
- **d2t1** (Execute with urgency): execute, execution, deliverable, produce, implement
- **d2t2** (Manage communications): communication, information, reporting, status
- **d2t3** (Assess and manage risks): risk, threat, opportunity, uncertainty, risk register
- **d2t4** (Engage stakeholders): stakeholder, engagement, participation
- **d2t5** (Plan and manage budget): budget, cost, evm, earned value, resource, funding
- **d2t6** (Plan and manage schedule): schedule, timeline, critical path, duration, milestone
- **d2t7** (Plan and manage quality): quality, quality assurance, quality control, defect
- **d2t8** (Plan and manage scope): requirements, scope, wbs, work breakdown, user story
- **d2t9** (Integrate planning): integration, project charter, integration management
- **d2t10** (Manage changes): change, change control, change request, configuration
- **d2t11** (Plan procurement): procurement, contract, vendor, supplier, rfp, rfq
- **d2t12** (Manage artifacts): metrics, measure, documentation, artifacts
- **d2t13** (Determine methodology): methodology, framework, agile, waterfall, scrum, kanban
- **d2t14** (Establish governance): governance, compliance, policy, standard, regulation
- **d2t15** (Manage issues): issues, problems, issue log
- **d2t16** (Ensure knowledge transfer): lessons learned, knowledge transfer, documentation
- **d2t17** (Manage closure): transition, closure, closeout, handover

#### Domain 3: Business Environment (4 tasks)
- **d3t1** (Plan compliance): business case, compliance, regulatory, legal
- **d3t2** (Deliver benefits): benefits, roi, business value, benefits realization
- **d3t3** (Evaluate external changes): organizational change, transformation, external factors
- **d3t4** (Support organizational change): change management, adoption, resistance

### 3. Scoring Algorithm

1. **Keyword Matching**: Each keyword occurrence in the flashcard text receives 1 point
2. **Concept Matching**: Matches with exam outline key concepts receive 2 points (weighted higher)
3. **Threshold**: Tasks with score ≥ 1 are included in the mapping
4. **Limit**: Top 3 most relevant tasks per flashcard (to avoid over-mapping)

### 4. Special Rules

#### Category-Based Rules
- **Principles → Stewardship**: Auto-map to d1t14 (Emotional intelligence/Ethics)
- **Principles → Team**: Auto-map to d1t2 (Lead a team)
- **Principles → Stakeholders**: Auto-map to d1t9 (Collaborate with stakeholders)
- **Agile/Scrum category**: Auto-map to d2t13 (Determine methodology)

#### Content-Based Rules
- **EVM/Earned Value content**: Priority map to d2t5 (Plan and manage budget)
- **Risk content**: Priority map to d2t3 (Assess and manage risks)
- **Conflict content**: Priority map to d1t1 (Manage conflict)

## Mapping Results

### Overall Statistics
- **Total Flashcards**: 300
- **Mapped Flashcards**: 289 (96.3%)
- **Unmapped Flashcards**: 11 (3.7%)
- **Total Mappings**: 800
- **Average Mappings per Flashcard**: 2.67

### Coverage by Domain

#### Domain 1: People (42% of exam)
- Total mappings: 282
- Average per task: 20.1 flashcards
- Coverage status: **EXCELLENT**
- Gap: d1t6 (Build a team) - 0 flashcards

#### Domain 2: Process (50% of exam)
- Total mappings: 460
- Average per task: 27.1 flashcards
- Coverage status: **EXCELLENT**
- Low coverage: d2t11 (Plan procurement) - 1 flashcard

#### Domain 3: Business Environment (8% of exam)
- Total mappings: 58
- Average per task: 14.5 flashcards
- Coverage status: **GOOD**
- All tasks have adequate coverage

### Top Covered Tasks
1. **d2t5** (Plan and manage budget): 70 flashcards
2. **d2t14** (Establish governance): 63 flashcards
3. **d1t2** (Lead a team): 49 flashcards
4. **d1t1** (Manage conflict): 47 flashcards
5. **d2t3** (Assess and manage risks): 44 flashcards

### Coverage Gaps
1. **d1t6** (Build a team): 0 flashcards - **NEEDS CONTENT**
2. **d2t11** (Plan and manage procurement): 1 flashcard - **NEEDS MORE CONTENT**
3. **d1t13** (Mentor relevant stakeholders): 4 flashcards - **LOW COVERAGE**

## Using the Mapped Flashcards

### File Location
- **Mapped Flashcards**: `data/flashcards-mapped.json`
- **Mapping Report**: `data/mapping-report.txt`

### Data Structure
Each flashcard now includes a `mappedTasks` field:

```json
{
  "id": 1,
  "category": "Principles",
  "subcategory": "Stewardship",
  "question": "What does the Stewardship principle emphasize?",
  "answer": "Acting responsibly with integrity...",
  "difficulty": "medium",
  "mappedTasks": ["d1t14", "d2t9", "d3t1"]
}
```

### Application Features

#### 1. Task-Based Study Mode
Filter flashcards by specific exam tasks:
```javascript
const d1t1Cards = flashcards.filter(fc =>
  fc.mappedTasks.includes('d1t1')
);
```

#### 2. Domain-Based Practice
Study by exam domain:
```javascript
const domain1Tasks = ['d1t1', 'd1t2', ..., 'd1t14'];
const peopleCards = flashcards.filter(fc =>
  fc.mappedTasks.some(task => domain1Tasks.includes(task))
);
```

#### 3. Weighted Practice
Focus on high-weight domains:
- Domain 2 (50%): Study these cards most
- Domain 1 (42%): Study these cards frequently
- Domain 3 (8%): Study these cards least

#### 4. Gap Analysis
Identify weak areas by tracking performance per task:
```javascript
const taskPerformance = {};
// Track correct/incorrect answers per task
// Identify tasks needing more study
```

#### 5. Mission Structure
Organize missions around tasks:
- **Mission 1**: Master People domain (d1t1-d1t14)
- **Mission 2**: Master Process domain (d2t1-d2t17)
- **Mission 3**: Master Business Environment (d3t1-d3t4)

## Quality Assurance

### Validation Checks Performed
1. ✅ EVM flashcards map to d2t5 (Plan and manage budget)
2. ✅ Risk flashcards map to d2t3 (Assess and manage risks)
3. ✅ Conflict flashcards map to d1t1 (Manage conflict)
4. ✅ Servant leadership maps to d1t2 (Lead a team)
5. ✅ Stewardship maps to d1t14 (Ethics/Emotional intelligence)

### Example Mappings

**Conflict Resolution**:
- ID 48: "What are the 5 conflict resolution techniques?" → d1t1, d1t9, d2t15 ✓

**Servant Leadership**:
- ID 37: "What is Servant Leadership?" → d1t2, d1t7 ✓

**EVM**:
- ID 108: "What is Earned Value (EV)?" → d2t5, d2t17 ✓

**Risk Management**:
- ID 166: "What is a Risk?" → d2t3, d2t12, d2t13 ✓

## Recommendations

### For Content Creation
1. **Create 5-10 flashcards for d1t6** (Build a team):
   - Team selection criteria
   - Resource requirements analysis
   - Team development stages
   - Knowledge transfer practices

2. **Create 5-10 flashcards for d2t11** (Plan procurement):
   - Contract types (FFP, CPFF, T&M)
   - Procurement documents (RFP, RFQ, RFI)
   - Vendor selection criteria
   - Make-or-buy analysis

3. **Add 5-10 more for d1t13** (Mentor stakeholders):
   - Coaching techniques
   - Mentoring best practices
   - Skill development approaches

### For Application Development
1. **Implement task filtering** in study mode
2. **Add progress tracking** per task
3. **Show coverage gaps** to users
4. **Create missions** aligned with tasks
5. **Enable targeted practice** for weak areas

## Version History
- **v1.0** (2026-01-28): Initial mapping of 300 flashcards to 35 exam tasks
- Mapping algorithm: Keyword-based with concept weighting
- Coverage: 96.3% of flashcards mapped, 2.67 average tasks per card
