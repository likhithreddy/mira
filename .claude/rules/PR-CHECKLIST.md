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

### Step 6 — Approve the PR with a comment

After opening the PR, approve it using:

```bash
gh pr review <number> --approve --body "<approval comment>"
```

The approval comment must include:
- A summary of what was implemented (2–4 sentences)
- Confirmation that all ACs, test cases, and property-based test cases were validated and pass

### Step 7 — Merge the PR (do NOT delete the branch)

After approving, merge using:

```bash
gh pr merge <number> --merge
```

Do NOT pass `--delete-branch`. The branch must be preserved after merge.

### Step 8 — Close with a detailed formatted comment

After merging, add a final closing comment to the issue:

```bash
gh issue comment <number> --body "$(cat <<'EOF'
<closing comment body>
EOF
)"
```

The closing comment must follow this exact format (use markdown checkboxes, no emojis):

```
Closed by PR #<pr-number>.

**Summary**
<Detailed description of what was implemented: files created, tools configured, design decisions made. 3–6 sentences minimum.>

**Acceptance Criteria**
- [x] <criterion 1>
- [x] <criterion 2>
...

**Test Cases**
- [x] <test case 1>
- [x] <test case 2>
...

**Property-Based Test Cases**
- [x] <property test 1>
...
```

Then close the issue:

```bash
gh issue close <number>
```

### Placement in Workflow

```
Implement → Commit → [Pre-PR Validation] → Push → gh pr create → gh pr review --approve → gh pr merge → gh issue comment → gh issue close
```
