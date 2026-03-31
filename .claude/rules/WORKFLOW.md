## Naming Conventions

- Files and directories: kebab-case (e.g. `rating-screen.tsx`, `token-counter.ts`)
- React components: PascalCase (e.g. `RatingScreen`, `SessionShell`)
- Zero tolerance: no TypeScript `any`, no unused imports, no ESLint warnings, no Prettier violations at any commit

## Explore → Plan → Implement → Commit Workflow

Required for any feature touching 3 or more files, or involving auth, permissions, DB schema, or the AI gateway.

**Phase 1 — Explore:** Use Glob, Grep, and Read to understand all affected existing code. Save findings to `docs/explorations/<issue-number>-exploration.md`. Run `/clear` after saving.

**Phase 2 — Plan:** Enter Plan mode. Read the saved exploration file and the relevant PRD sections. Design the full approach — files to create/edit, migration needed, tests to write first. Save the complete plan to `docs/plans/<issue-number>-plan.md`. Run `/clear` after saving.

**Phase 3 — Implement:** Read the saved plan file. Follow TDD — write failing tests first → commit → implement minimum code to pass → commit → refactor → commit. Never deviate from the saved plan without updating the plan file first.

**Phase 4 — Commit:** Commit at each meaningful checkpoint. Once all commits are done and tests pass, raise the PR, then apply the migration via Supabase MCP.

## Documentation

- When working on any issue, create or update relevant documentation in `docs/` at the root of the project
- Documentation filenames must be UPPERCASE (e.g. `DEPLOYMENT.md`, `AUTHENTICATION.md`)
- If the issue introduces new infrastructure, architecture, configuration, or developer-facing workflows, document it in `docs/`
- Reference the documentation from `README.md` where appropriate
- Keep documentation up to date — if an issue changes existing behavior that is already documented, update the relevant `docs/` file

## PostToolUse Hook

A PostToolUse hook is configured on the Edit and Write tools. After every file edit or write, Prettier runs automatically on that file — never run `yarn format` manually after individual edits. The `yarn format:check` CI gate still runs as a final catch.
