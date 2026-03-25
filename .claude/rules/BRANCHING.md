## FIRST: Branch Setup (Do This Before Anything Else)

**Before writing a single line of code or creating any file, you MUST:**

1. Determine the issue number for the current task.
2. Create and check out the correct branch:
   - Feature work: `git checkout -b feature/<issue-number>-<short-description>`
   - Bug fix: `git checkout -b bug/<issue-number>-<short-description>`
   - Chore/infra: `git checkout -b chore/<issue-number>-<short-description>`
3. Confirm you are on the new branch before proceeding.

**One branch = one issue. Never work on `main` directly. Never reuse a branch across issues.**

This rule takes precedence over all other workflow steps.

## Branching, Commits & PRs

- Never commit directly to `main`
- Branch naming: `feature/<issue-number>-<short-description>`, `bug/<issue-number>-<description>`, `chore/<issue-number>-<description>`
- Commit format: `[#<issue-number>] <type>: <description>` — e.g. `[#12] feat: implement session rating screen`
- Every PR must link its issue with `Closes #<number>` for auto-close on merge
- TODOs in code: `// ISSUE-#<number>: <description>`
- Migrations are applied via Supabase MCP only at PR-raise time, after all commits and tests pass — never earlier
