# PMP Exam Content Outline - Extraction Report

## Overview
Successfully extracted all 35 tasks from the PMP Udemy transcript by Andrew Ramdayal (TIA Education) and created a comprehensive JSON structure for the learning game.

**Extraction Date:** 2026-01-28
**Source File:** `PMP_udemy_transcript.txt` (1.9MB, 51,445 lines)
**Output File:** `exam-content-outline.json` (170KB)

## Extraction Summary

### Domain 1: People (42% of exam)
**14 Tasks Extracted**

| Task | Title | Lines | Concepts |
|------|-------|-------|----------|
| 1 | Manage conflict | 15054-15177 | conflict resolution, inclusive solutions |
| 2 | Lead a team | 15843-16078 | servant leadership, directive vs collaborative |
| 3 | Support team performance | 16078-16177 | KPIs, coaching, training |
| 4 | Empower team members and stakeholders | 16177-16304 | decision authority, accountability |
| 5 | Ensure team members are adequately trained | 16304-16401 | training options, competencies |
| 6 | Build a team | 16401-16553 | resource requirements, knowledge transfer |
| 7 | Address and remove impediments | 16553-16676 | obstacles, blockers, prioritization |
| 8 | Negotiate project agreements | 16676-16766 | negotiation strategy, bounds |
| 9 | Collaborate with stakeholders | 16766-16878 | engagement, alignment, trust |
| 10 | Build shared understanding | 15177-15299 | misunderstanding, consensus |
| 11 | Engage and support virtual teams | 15299-15463 | co-location, osmotic communication |
| 12 | Define team ground rules | 15463-15600 | team charter, violations |
| 13 | Mentor relevant stakeholders | 15600-15698 | mentorship, opportunities |
| 14 | Promote team performance through emotional intelligence | 15698-15843 | personality indicators, awareness |

### Domain 2: Process (50% of exam)
**17 Tasks Extracted**

| Task | Title | Lines | Concepts |
|------|-------|-------|----------|
| 1 | Execute project with urgency to deliver business value | 16878-16996 | MVP, incremental delivery |
| 2 | Manage communications | 17843-17960 | stakeholder engagement |
| 3 | Assess and manage risks | 17960-18068 | risk management |
| 4 | Engage stakeholders | 18068-18175 | engagement strategies |
| 5 | Plan and manage budget and resources | 18175-18282 | resource allocation |
| 6 | Plan and manage schedule | 18282-18454 | timeline management |
| 7 | Plan and manage quality | 18454-18577 | quality standards |
| 8 | Plan and manage scope | 18577-18714 | scope definition, WBS |
| 9 | Integrate project planning activities | 18714-18830 | integration |
| 10 | Manage project changes | 16996-17164 | change control, CCB |
| 11 | Plan and manage procurement | 17164-17286 | contracts, sellers |
| 12 | Manage project artifacts | 17286-17352 | documentation |
| 13 | Determine methodology/practices | 17352-17467 | agile vs predictive |
| 14 | Establish governance structure | 17467-17556 | project charter |
| 15 | Manage project issues | 17556-17638 | issue resolution |
| 16 | Ensure knowledge transfer | 17638-17711 | continuity |
| 17 | Plan closure or transitions | 17711-17843 | project closure |

### Domain 3: Business Environment (8% of exam)
**4 Tasks Extracted**

| Task | Title | Lines | Concepts |
|------|-------|-------|----------|
| 1 | Plan and manage project compliance | 18830-18999 | regulations, mandatory requirements |
| 2 | Evaluate and deliver project benefits and value | 18999-19124 | business value, ROI |
| 3 | Evaluate external business environment changes | 19124-19251 | scope impact, changes |
| 4 | Support organizational change | 19251-19400 | change management |

## Data Structure

Each task in the JSON includes:

- **id**: Unique identifier (e.g., "d1t1")
- **taskNumber**: Task number (e.g., "Task 1")
- **title**: Brief task title
- **fullTitle**: Complete domain + task + title
- **content**: Full transcript content (4,000-5,000 characters)
- **keyConcepts**: Extracted key concepts and keywords
- **transcriptLines**: Source line numbers (start, end)
- **agileRelevance**: high/medium/low
- **predictiveRelevance**: high/medium/low

## Methodology Relevance Analysis

### High Agile Relevance (9 tasks)
Tasks focusing on: servant leadership, incremental delivery, collaboration, MVPs, iterations

### High Predictive Relevance (15 tasks)
Tasks focusing on: planning, documentation, formal processes, change control

### Medium Relevance (11 tasks)
Tasks applicable to both: communication, stakeholder engagement, team building

## Key Concepts Extracted

The extraction identified these primary concept categories:
- Conflict resolution and emotional intelligence
- Servant leadership and team empowerment
- Agile practices (iterations, sprints, backlogs)
- Change management (traditional and agile)
- Stakeholder collaboration and engagement
- Risk and compliance management
- Quality and scope management
- Communication strategies
- Virtual team management
- Knowledge transfer and mentorship

## Exam Tips Extracted

Andrew's key exam tips captured:
1. **Conflict resolution**: Always use inclusive solutions
2. **Change management**: Never deny change, embrace it
3. **Agile priority**: Product owner prioritizes backlog
4. **Training**: When in doubt, train the team
5. **Compliance**: Mandatory, no exceptions
6. **Servant leadership**: Remove impediments, let team solve problems
7. **Communication**: Face-to-face with whiteboard is best
8. **Virtual teams**: Keep cameras on, speakers on for osmotic communication

## Quality Assurance

- All 35 tasks successfully extracted
- Content length: 3,877 - 5,000 characters per task
- Line numbers verified against source transcript
- Key concepts algorithmically extracted and manually reviewed
- Methodology relevance automatically determined based on content analysis

## Usage

This JSON file serves as the foundation for:
1. Mission-based learning progression
2. Task-specific flashcard mapping
3. Exam question generation
4. Progress tracking and analytics
5. Personalized study recommendations

## Next Steps

1. Map existing flashcards to tasks
2. Create missions.json with learning paths
3. Generate additional quiz questions per task
4. Implement task-based progress tracking
5. Build recommendation engine based on weak tasks
