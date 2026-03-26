## Pre-PR Acceptance Criteria Validation (Mandatory)

Before raising a PR for any issue, you MUST perform the following validation. Do NOT push or open a PR until all acceptance criteria are confirmed.

### Step 1 — Fetch the issue acceptance criteria

Read the issue (via `gh issue view <number>`) and extract every acceptance criterion, test case, and property-based test case listed.

### Step 2 — Validate each criterion against the branch

For every acceptance criterion and test case, check the actual files and commands on the current branch to determine pass/fail.

### Step 3 — Present a validation table

Output tables in this exact format before proceeding:

**Acceptance Criteria:**

| # | Acceptance Criterion | Status |
|---|---|---|
| 1 | Description of criterion | - [x] Pass |
| 2 | Description of criterion | - [ ] Fail |

**Test Cases:**

| # | Test Case | Status |
|---|---|---|
| 1 | `yarn dev` starts without errors | - [x] Pass |

**Property-Based Test Cases (if applicable):**

| # | Property-Based Test Case | Status |
|---|---|---|
| 1 | Description of property test | - [x] Pass |

### Step 4 — Gate on result

- If every row is checked (`- [x]`) → proceed to push and open the PR.
- If any row is unchecked (`- [ ]`) → stop, fix the failing criterion, re-run verification, and repeat from Step 2.

**Never open a PR with any unchecked row in the table.**

### Step 5 — Open the PR

Push the branch and open the PR with a detailed body using `gh pr create`. The PR body must include:

1. A clear, detailed description of everything implemented for this issue — explain each significant decision and file created/modified
2. All acceptance criteria listed with markdown checkboxes (checked)
3. All test cases listed with markdown checkboxes (checked)
4. All property-based test cases listed with markdown checkboxes (checked, if applicable)

### Step 6 — Stop: awaiting teammate review

**Your job ends at PR creation.** Do NOT approve or merge your own PR. A teammate must review, approve, and merge.

After opening the PR, notify the user that the PR is ready for their review and provide the PR URL.

### Placement in Workflow

```
Implement → Commit → [Pre-PR Validation] → Push → gh pr create → [STOP — teammate reviews, approves, and merges]
```
