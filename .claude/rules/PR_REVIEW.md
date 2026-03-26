## PR Review Best Practices

### 1. Start with the Issue, Not the Code
- Read the issue description fully before opening a single file
- Extract all acceptance criteria, test cases, and property-based test cases
- Build a mental checklist — you're validating against this, not your own assumptions

### 2. High-Level Pass First
- Check the PR description: does it explain *what* and *why*, not just *what*?
- Verify branch naming and commit message format match conventions
- Confirm the PR links `Closes #<number>` for auto-close
- Scan the file diff list — are the right files touched? Any unexpected files?

### 3. Acceptance Criteria Validation
- For each AC, find the specific code or test that satisfies it
- If an AC has no corresponding code or test, it's a blocker — not a suggestion
- Never assume an AC is met because the PR author says so

### 4. Test Quality Review
- **Unit tests:** Do they test behavior, not implementation? Are edge cases covered?
- **Integration tests:** Do they use real dependencies (DB, API), not mocked-out stubs where inappropriate?
- **Property-based tests:** Are the properties meaningful? Do they cover the actual invariants of the module?
- **Mutation score:** Would killing a mutation in the core logic cause at least one test to fail?
- Check coverage isn't just line coverage — branch coverage matters more

### 5. Code Correctness
- Trace the happy path manually through the diff
- Trace at least two failure paths — what happens on bad input, network error, etc.?
- Check for off-by-one errors, null/undefined cases, and async race conditions
- Verify no `any` types, no unused imports, no disabled lint rules without justification

### 6. Security Pass
- Is user input validated at the boundary (API routes, form inputs)?
- Are secrets server-side only? No `NEXT_PUBLIC_` for sensitive values?
- Are RLS policies in place for any new DB tables?
- Does any new API route re-verify auth (not just rely on middleware)?

### 7. Architecture Conformance
- Do new files land in the correct directory per folder structure rules?
- Are components, lib functions, and stores respecting their layer boundaries?
- No business logic in pages/components? No inline DB queries?

### 8. Design & UX (for frontend changes)
- Does it respect the design system (typography, icons, animation durations)?
- Is it responsive across the required breakpoints?
- Does it handle loading, error, and empty states?
- Does `prefers-reduced-motion` work correctly?

### 9. What to Flag as Blocker vs. Suggestion

| Type | Criteria |
|---|---|
| **Blocker** | Failing AC, missing test, security issue, broken build, wrong architecture |
| **Suggestion** | Style preference, minor naming, non-critical refactor opportunity |
| **Nitpick** | Prefix with `nit:` — reviewer acknowledges it's optional |

### 10. Final Gate Before Approving
- All ACs confirmed with evidence in the code
- All listed test cases pass (or reviewer ran them locally)
- No outstanding blockers
- PR description is accurate and complete

The key discipline: **never approve based on intent** — only approve based on evidence in the diff.

### 11. GitHub Comment Etiquette

Every review comment must be prefixed with its type — never leave an unprefixed comment. Ambiguous comments cause confusion and delay.

| Prefix | Meaning | Merge gate? |
|---|---|---|
| `BLOCKER:` | Must be fixed before approval | Yes |
| `SUGGESTION:` | Strongly recommended, not required | No |
| `nit:` | Optional — author's call | No |

**Blocker comments must include three things:** what is wrong, why it matters, and what the fix should look like. Example:

```
BLOCKER: The Supabase query is written inline in the component (line 42).
Per FOLDER-STRUCTURE rules, all DB queries must go through typed functions in lib/supabase/.
Move this to a new function in lib/supabase/sessions.ts and call it from the component.
```

**Suggestions and nits** must never trigger a re-request for review — leave them for the author to consider at their discretion.

### 12. Approval Rules

- **Never approve a PR that has any open BLOCKER comment** — yours or anyone else's
- Never approve based on intent, verbal assurance, or "will fix in a follow-up" promises — if it is not in the diff, it is not done
- When approving, post a comment that summarises what was reviewed and what was verified:

```
Approving. Reviewed all ACs — all pass. Ran `yarn test` and `yarn lint` locally — clean.
Comment #3 above is a suggestion, not a blocker — author's call.
```

### 13. Merge Rules

- **Always merge commit** — never rebase merge; all individual commits must be preserved in history
- **Never merge your own PR** — a different teammate must approve first
- Merge only after: (a) at least one approval with zero open BLOCKER comments, and (b) all CI checks are green
- When merging, post a comment confirming blockers resolved:

```
Merge committing. All blockers resolved. CI green.
```

- If CI is red at merge time — **stop, do not merge** — ping the PR author to fix CI first
