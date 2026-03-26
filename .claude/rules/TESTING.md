## Testing Strategy (TDD — Strictly Enforced)

- **TDD order:** write failing test → commit → implement minimum code to pass → commit → refactor → commit
- Tests are never changed to match a broken implementation — fix the code
- Never delete existing test cases
- All tests live under `tests/` — `tests/unit/` (Vitest), `tests/integration/` (Vitest), `tests/e2e/` (Playwright). No test files co-locate with source; no `__tests__` directories.
- Property-based tests with fast-check on 5 pure logic modules: `scoring.ts`, `tokenCounter.ts`, `questionDedup.ts`, `silenceDetector.ts`, `sessionStore.ts`
- E2E tests: Playwright in `tests/e2e/`, Chromium primary + WebKit
- Mutation testing: Stryker on the 5 modules above, weekly CI schedule, 70%+ mutation score target
- Coverage threshold: 80% minimum (branches, functions, lines, statements) — PRs blocked if below
- **Mocking:** gateway via `vi.mock('lib/gateway')`, Supabase via custom factory, Web Speech API + SpeechSynthesis via `vi.stubGlobal`
