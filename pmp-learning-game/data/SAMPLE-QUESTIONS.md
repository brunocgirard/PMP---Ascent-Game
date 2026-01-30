# Sample Questions from PMP Quiz Bank

This document showcases sample questions from each domain and question type to demonstrate the quality and style of the quiz bank.

---

## Domain 1: People - Conflict Management

### Multiple Choice - Medium

**Question:** Two developers on your Scrum team disagree about the technical approach for a critical feature. The conflict is escalating. What should you do FIRST as Scrum Master?

A) Decide the best approach and direct the team to follow it
B) Facilitate a team discussion to find consensus
C) Escalate to the Product Owner for decision
D) Let the technical lead make the final call

**Correct Answer:** B

**Explanation:** Collaborate/Problem Solve is the best conflict resolution technique. As a servant leader, facilitate discussion to address root causes and find win-win solutions. This maintains team morale and may result in a better technical solution.

**Exam Tip:** Always choose inclusive, collaborative approaches in conflict situations.

---

### Matching - Medium

**Question:** Match each conflict resolution technique to its description:

| Technique | Description |
|-----------|-------------|
| Collaborate | Win-win solution addressing root causes |
| Compromise | Both parties give up something |
| Smooth | Emphasize agreement, downplay differences |
| Force | Push your viewpoint at expense of others |
| Avoid | Withdraw from conflict situation |

**Explanation:** Collaborate > Compromise > Smooth > Force > Avoid is the preferred order for conflict resolution in most situations.

**Exam Tip:** Know the order of conflict resolution preferences and when each is appropriate.

---

## Domain 1: People - Team Development

### Multiple Choice - Medium

**Question:** Your project team has just formed. Team members are polite but reserved, asking many questions about project goals and their roles. According to Tuckman's model, which stage is the team in, and what should you focus on?

A) Norming - Establish team processes and working agreements
B) Storming - Facilitate conflict resolution
C) Forming - Provide clarity on goals, roles, and expectations
D) Performing - Delegate and empower the team

**Correct Answer:** C

**Explanation:** The team is in the Forming stage - characterized by politeness, uncertainty, and questions about roles/goals. PM should provide structure, clarity, and direction.

**Tuckman's Stages:**
1. **Forming:** Polite, uncertain, need direction → Provide clarity
2. **Storming:** Conflict, competition → Facilitate resolution
3. **Norming:** Agreement, collaboration → Establish processes
4. **Performing:** Productive, self-managing → Delegate
5. **Adjourning:** Project ends → Celebrate, capture lessons

**Exam Tip:** Match your leadership style to the team's development stage.

---

### Multiple Response - Medium

**Question:** You notice your team's velocity declining over the past 3 sprints. Which TWO actions should you take FIRST? (Select 2)

A) Replace underperforming team members
B) Conduct a retrospective to identify root causes
C) Reduce story point estimates to inflate velocity
D) Investigate potential impediments or technical debt
E) Extend sprint duration to allow more time

**Correct Answers:** B, D

**Explanation:**
- **B is correct:** Retrospectives are designed to identify what's working and what isn't. This is continuous improvement in action.
- **D is correct:** Declining velocity often indicates impediments, technical debt, or external interruptions. Investigate before acting.
- **A is wrong:** Premature and destructive without understanding root cause.
- **C is wrong:** Gaming metrics doesn't solve the real problem.
- **E is wrong:** Doesn't address root cause and violates timebox principle.

**Exam Tip:** Always investigate before taking corrective action.

---

## Domain 2: Process - Budget Management

### Fill-in-the-Blank - Medium

**Question:** If EV = $50,000 and AC = $55,000, then Cost Variance (CV) = ______.

**Correct Answer:** -$5,000

**Acceptable Answers:**
- -5000
- -5,000
- -$5000
- -$ 5000
- negative 5000
- -5k

**Explanation:** CV = EV - AC = 50,000 - 55,000 = -$5,000. Negative CV means over budget (spending more than earning).

**Exam Tip:** Pay attention to the sign. Negative CV and CPI < 1.0 both mean over budget.

---

### Multiple Choice - Hard

**Question:** Your project has the following metrics:
- BAC = $500,000
- PV = $250,000
- EV = $200,000
- AC = $225,000

What is the current status of your project?

A) On schedule and on budget
B) Ahead of schedule but over budget
C) Behind schedule and over budget
D) Behind schedule but under budget

**Correct Answer:** C

**Explanation:**

**Calculations:**
- **CV** = EV - AC = 200,000 - 225,000 = **-$25,000** (NEGATIVE = Over budget ❌)
- **SV** = EV - PV = 200,000 - 250,000 = **-$50,000** (NEGATIVE = Behind schedule ❌)
- **CPI** = EV / AC = 200,000 / 225,000 = **0.89** (< 1.0 = Over budget ❌)
- **SPI** = EV / PV = 200,000 / 250,000 = **0.80** (< 1.0 = Behind schedule ❌)

**Interpretation:**
- Project is **behind schedule** (should have earned $250k value, only earned $200k)
- Project is **over budget** (spent $225k but only earned $200k value)

**Exam Tip:** Negative variances and indexes < 1.0 are bad. Positive variances and indexes > 1.0 are good.

---

### Matching - Medium

**Question:** Match each EVM metric to its formula:

| Metric | Formula |
|--------|---------|
| Cost Variance (CV) | EV - AC |
| Schedule Variance (SV) | EV - PV |
| Cost Performance Index (CPI) | EV / AC |
| Schedule Performance Index (SPI) | EV / PV |
| Estimate at Completion (EAC) | BAC / CPI |

**Explanation:** These are the core EVM formulas you must memorize for the exam. Write them down during your brain dump at the start of the exam.

**Exam Tip:**
- Variances use subtraction (EV - something)
- Indexes use division (EV / something)
- EV is always first in the formula

---

## Domain 2: Process - Schedule Management

### Multiple Choice - Medium

**Question:** You have the following network diagram:
- Path A-B-C: 10 days
- Path A-D-C: 15 days
- Path A-E-C: 12 days

Activity D has 3 days of total float. What happens if Activity D is delayed by 4 days?

A) Nothing - there's still float available
B) Activity D becomes critical but project end date doesn't change
C) Project completion will be delayed by 1 day
D) Project completion will be delayed by 4 days

**Correct Answer:** C

**Explanation:**

**Key Concept:** Total Float = Amount of delay possible WITHOUT delaying project

**Analysis:**
- Activity D can be delayed 3 days without impacting project (that's its float)
- If delayed 4 days, it exceeds float by 1 day
- **Project will be delayed by: 4 days - 3 days float = 1 day**

**Critical Path Reminder:**
- Critical path activities have ZERO float
- Activities with float can be delayed without impacting project end date
- Once you exceed the float, the project end date is impacted

**Exam Tip:** Total float tells you the maximum delay without impacting project. Exceed it, and you delay the project.

---

### Fill-in-the-Blank - Medium

**Question:** The ______ is the longest path through the network diagram and determines the minimum project duration.

**Correct Answer:** critical path

**Acceptable Answers:**
- critical path
- Critical Path
- CRITICAL PATH
- critical-path

**Explanation:** The critical path has zero float and determines how long the project will take. It's the LONGEST path, not the path with the most activities.

**Exam Tip:** Many people mistakenly think the critical path has the most activities. It's the path with the longest DURATION.

---

## Domain 2: Process - Risk Management

### Multiple Choice - Medium

**Question:** During risk planning, you identify a risk that would have catastrophic impact on the project if it occurs, but the probability is very low. What is the BEST response strategy?

A) Accept the risk since probability is low
B) Transfer the risk through insurance or outsourcing
C) Mitigate the risk to reduce its probability or impact
D) Avoid the risk by changing the project approach

**Correct Answer:** D (or B, depending on feasibility)

**Explanation:**

**Risk Profile:**
- **Impact:** Catastrophic (Very High)
- **Probability:** Very Low
- **Overall:** Still HIGH risk (high impact outweighs low probability)

**Response Strategies for Threats:**

| Strategy | When to Use | This Scenario |
|----------|-------------|---------------|
| **Avoid** | High impact, feasible to eliminate | ✅ Best if you can change approach |
| **Mitigate** | Reduce probability/impact | ⚠️ May not reduce "catastrophic" enough |
| **Transfer** | Shift to third party | ✅ Good if avoidance isn't feasible |
| **Accept** | Low overall risk | ❌ Not for catastrophic impact |

**Exam Tip:** For catastrophic risks, avoid if possible, transfer if not. Never accept them.

---

## Domain 2: Process - Change Control

### Multiple Choice - Medium

**Question:** A stakeholder emails you requesting a change to a key feature. What should you do FIRST?

A) Implement the change immediately to maintain stakeholder satisfaction
B) Deny the request to protect the baseline
C) Analyze the impact on scope, schedule, cost, quality, and risk
D) Submit the change request to the Change Control Board (CCB)

**Correct Answer:** C

**Explanation:**

**Change Control Process:**
1. **Receive change request**
2. **Analyze impact** (scope, schedule, cost, quality, risk, resources) ← **FIRST**
3. **Present to CCB** (with impact analysis)
4. **CCB approves/rejects**
5. **Implement if approved**
6. **Update baselines and documents**

**Why C is correct:** You must understand the impact BEFORE presenting to decision-makers. Can't make an informed decision without impact analysis.

**Why others are wrong:**
- **A:** Bypasses change control (causes scope creep, budget issues)
- **B:** Too rigid; changes may add value (principle: Value)
- **D:** Can't submit to CCB without impact analysis

**Key Concept:** Integrated change control ensures changes are:
- Documented
- Analyzed for impact
- Approved by appropriate authority
- Implemented systematically

**Exam Tip:** Never implement changes without analyzing impact and getting approval. Never deny without analysis either.

---

## Domain 3: Business - Benefits Realization

### Multiple Choice - Medium

**Question:** Your project finished on time and on budget, delivering all planned features. However, six months later, stakeholders report they're not seeing the expected business value. What was likely missing?

A) Proper scope management during the project
B) Benefits realization planning and post-project measurement
C) Sufficient budget for the project
D) Adequate quality control during execution

**Correct Answer:** B

**Explanation:**

**Key Distinction:**
- **Outputs:** Deliverables produced (features delivered ✅)
- **Outcomes:** Benefits and value realized (business value ❌)

**Benefits Realization:**
- Defined in business case
- Planned how benefits will be achieved
- Measured during AND after project
- Requires stakeholder adoption (change management)
- PM should track even post-project

**Why the disconnect occurred:**
- Features delivered (outputs) ✅
- Value not realized (outcomes) ❌
- Possible causes:
  - Users didn't adopt new features
  - Training was insufficient
  - Benefits weren't measured
  - Wrong features prioritized

**Why B is correct:** Benefits realization planning ensures outcomes are defined, measured, and achieved. This should be part of project planning and monitoring.

**Why others are wrong:**
- **A, C, D:** Project delivered on time/budget/scope - these weren't the problem

**Exam Tip:** Remember: Outputs ≠ Outcomes. Focus on value realization, not just deliverable completion.

---

## Domain 3: Business - Project Selection

### Multiple Choice - Hard

**Question:** You're helping select between two projects:

**Project A:**
- BCR = 1.5
- NPV = $50,000
- Payback Period = 3 years

**Project B:**
- BCR = 1.8
- NPV = $35,000
- Payback Period = 4 years

Which project should the organization select, and why?

A) Project A - Higher NPV means more total value
B) Project B - Higher BCR means better return on investment
C) Project A - Shorter payback period reduces risk
D) Cannot determine without knowing organizational priorities

**Correct Answer:** D

**Explanation:**

**Financial Metrics Comparison:**

| Metric | Project A | Project B | Winner |
|--------|-----------|-----------|--------|
| **BCR** (Efficiency) | 1.5 | 1.8 | B (better return per dollar) |
| **NPV** (Total Value) | $50,000 | $35,000 | A (more total value) |
| **Payback** (Speed) | 3 years | 4 years | A (faster return) |

**The Dilemma:**
- If organization wants **maximum total value** → Choose A
- If organization has **limited capital** and wants **best ROI** → Choose B
- If organization wants **quick return** (cash flow concerns) → Choose A

**Key Concept:** Different metrics measure different things:
- **BCR:** Efficiency (return per dollar invested)
- **NPV:** Total value created
- **Payback Period:** How fast you recover investment
- **IRR:** Rate of return

**Selection depends on:**
- Strategic priorities
- Capital availability
- Risk tolerance
- Cash flow needs
- Market timing

**Why D is correct:** Without knowing organizational priorities and constraints, we can't definitively choose. This tests understanding that **context matters** (Principle: Tailoring).

**Exam Tip:** If the question doesn't provide organizational context, the answer is often "it depends" or "needs more information."

---

## Agile/Scrum Scenarios

### Multiple Choice - Medium

**Question:** During Sprint Planning, the Development Team says they can only commit to 20 story points, but the Product Owner insists they must complete 35 story points to meet a critical deadline. As the Scrum Master, what should you do?

A) Side with the Product Owner and push the team to commit to 35 points
B) Side with the Development Team and tell the Product Owner the sprint will only include 20 points
C) Facilitate a discussion to understand constraints and help both parties collaborate on a solution
D) Decide yourself to split the difference at 27 story points

**Correct Answer:** C

**Explanation:**

**Scrum Master Role:**
- **Servant leader** and **facilitator**
- NOT a decision-maker for backlog or capacity
- Protects team from overcommitment
- Helps Product Owner understand team capacity
- Facilitates collaboration

**Why C is correct:**
- Facilitates understanding: Why 20? Why 35?
- May reveal options: Can scope be reduced? Can deadline flex? Can team capacity increase?
- Empowers team and Product Owner to find solution together
- True to Scrum Master's facilitation role

**Scrum Dynamics:**
- **Product Owner:** Owns WHAT (backlog, priorities)
- **Development Team:** Owns HOW and HOW MUCH (capacity, approach)
- **Scrum Master:** Owns PROCESS (facilitates, removes impediments)

**Why others are wrong:**
- **A:** Violates servant leadership; team should not be forced to overcommit (leads to burnout, quality issues)
- **B:** Too one-sided; doesn't explore options
- **D:** Scrum Master shouldn't decide capacity or scope

**Exam Tip:** Scrum Master facilitates, doesn't decide. Choose answers that show servant leadership and collaboration.

---

### Multiple Choice - Medium

**Question:** Midway through a 2-week sprint, a stakeholder requests adding a high-priority feature. What should happen?

A) Add the feature to the current sprint immediately
B) Product Owner adds it to the product backlog for prioritization in the next sprint
C) Cancel the sprint and replan with the new feature
D) Ask the Development Team if they can accommodate the addition

**Correct Answer:** B

**Explanation:**

**Scrum Sprint Rules:**
- **Sprint scope is fixed** once Sprint Planning is complete
- Protects team from constant interruptions
- Enables predictable velocity
- Maintains sustainable pace

**Exception: Sprint Cancellation**
- ONLY if sprint goal becomes obsolete (very rare)
- ONLY Product Owner can cancel
- Very disruptive and wasteful

**Proper Process:**
1. Stakeholder requests feature
2. Product Owner evaluates and adds to product backlog
3. Product Owner prioritizes (may be top of backlog)
4. Feature considered in NEXT Sprint Planning
5. Team pulls into next sprint if capacity allows

**Why B is correct:** Follows Scrum framework. High priority doesn't mean "disrupt current sprint" - it means "top of backlog for next sprint."

**Why others are wrong:**
- **A & D:** Violates sprint scope protection (leads to chaos, unpredictable velocity)
- **C:** Extreme; only if sprint goal is obsolete (not just a new request)

**Trade-off:**
- **Scrum approach:** Protect sprint, wait for next sprint (max 2 weeks delay)
- **Kanban approach:** If truly urgent, might use Kanban (continuous flow, no sprints)

**Exam Tip:** Sprint scope is protected. Even high-priority items wait for next sprint unless the sprint goal is obsolete.

---

## Summary

These sample questions demonstrate:

1. **Realistic Exam Format** - Questions mirror actual PMP exam style
2. **Comprehensive Coverage** - All domains, task types, and methodologies
3. **Detailed Explanations** - Learning value beyond just getting the answer right
4. **Exam Tips** - Practical advice for similar questions
5. **Multiple Question Types** - MC, MR, Matching, Fill-blank
6. **Difficulty Progression** - Easy to hard with appropriate scaffolding

**Total Quiz Bank:** 1,159 questions ready to support your PMP exam preparation!

---

*For the complete quiz bank, see `quiz-bank.json` and `QUIZ-BANK-README.md`*
