# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

@import project-memory/PRD.md

**MIRA** (Mock Interview and Response Analyzer) is an AI-powered mock interview platform. Users provide a resume + job description, MIRA generates personalized questions via Gemini/Groq, captures spoken answers via Web Speech API, and delivers structured feedback reports.

Deadline: April 19, 2026. Four sprints from March 22 – April 17.

Full requirements are in `project-memory/PRD.md` (single source of truth). Always reference PRD section and requirement IDs (e.g. F1.1, NF-S2) in commits and comments. Sprint details are in `project-memory/SPRINT_PLAN.md`. The codebase follows an **AI-TDD workflow**: tests are written before implementation.

## Tech Stack (Strict — Do Not Substitute)

- **Framework:** Next.js 14+ App Router + TypeScript strict mode
- **Styling:** Tailwind CSS + ShadCN/UI — use ShadCN primitives wherever a match exists; never build a button, input, or dialog from scratch
- **Animations:** Framer Motion — all page transitions, component mounts, and interactive state changes
- **State:** Zustand — session state, conversation history, UI state
- **Client Cache:** sessionStorage — caches the question set to survive page refresh during `/session`
- **Auth + DB:** Supabase Auth (`@supabase/ssr`) — email+password and Google OAuth; Supabase PostgreSQL with RLS on every table; pgcrypto for API key encryption
- **File Storage:** Supabase Storage — private `resumes` bucket, user-scoped paths
- **AI:** Google Gemini Pro + Groq — exclusively via the AI gateway in Next.js API routes; never called directly from the client
- **Speech:** Web Speech API (recognition) + SpeechSynthesis API (TTS) — Chromium only for full functionality
- **PDF:** pdf.js (client-side resume parsing), jsPDF (client-side report generation)
- **Forms/Validation:** react-hook-form + zod — all form inputs and all API response validation
- **Icons:** lucide-react only — never use emojis anywhere in the UI
- **Error Tracking:** Sentry (`@sentry/nextjs`)
- **Testing:** Vitest + React Testing Library (unit), fast-check (property-based), Playwright (E2E), Stryker (mutation)
- **Hosting:** Vercel only

## Commands

```bash
yarn dev              # Next.js dev server
yarn build            # Production build
yarn type-check       # TypeScript strict check
yarn lint             # ESLint
yarn format           # Prettier auto-format
yarn format:check     # Prettier check (CI)
yarn test             # Vitest unit tests (80% coverage threshold)
yarn test:integration # Integration tests
yarn test:e2e         # Playwright (Chromium + WebKit)
```

Run a single test file:
```bash
yarn vitest run src/path/to/file.test.ts
```

Pre-commit checklist — run all of these before every commit:
```bash
yarn lint
yarn format
yarn test --coverage
yarn test:integration
yarn test:e2e
```

## Folder Structure (Strict — Never Deviate)

Map all new code to the exact directory tree in PRD Section 9 before creating any file.

```
app/                        # Pages and layouts only — no business logic
components/
  ui/                       # ShadCN auto-generated primitives — never edit these files
  auth/                     # Auth feature components
  setup/                    # Setup wizard components
  session/                  # Interview session components
  report/                   # Report page components
  admin/                    # Admin panel components
  dashboard/                # Dashboard components
  profile/                  # Profile page components
  shared/                   # Shared/reusable components
lib/
  gateway/                  # AI gateway: router, adapters (gemini.ts, groq.ts), prompts, logger
  supabase/                 # All Supabase DB query functions — never write raw queries in components or pages
  speech/                   # TTS and speech recognition abstractions
  pdf/                      # Resume parsing and report PDF generation
  scoring.ts                # Pure business logic modules
  tokenCounter.ts
  questionDedup.ts
  silenceDetector.ts
store/                      # Zustand stores only
types/                      # Global TypeScript types and Zod schemas
supabase/
  migrations/               # Every DB schema change must be a .sql file here — never via Supabase Studio UI
```

## Database Migration Rules

- Every schema change, RLS policy, or seed data change must be a raw SQL file in `supabase/migrations/`
- Naming convention: `<issue-number>_<short-description>.sql` — no timestamp prefix (e.g. `39_create_profiles_table.sql`)
- Each issue gets exactly one migration file; all schema changes for that issue go into that single file — never spread across multiple files for the same issue
- Never touch migration files from other issues — if working on issue #42, only `42_<description>.sql` may be created or edited
- Migrations are applied via the Supabase MCP tool only at PR-raise time, after all commits are complete and all tests pass — never earlier
- Never apply changes directly via Supabase Studio without a migration file first

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

## PostToolUse Hook

A PostToolUse hook is configured on the Edit and Write tools. After every file edit or write, Prettier runs automatically on that file — never run `yarn format` manually after individual edits. The `yarn format:check` CI gate still runs as a final catch.

## Architecture

### Route Groups & Protection

Middleware in `middleware.ts` enforces auth:
- `(auth)` group — `/login`, `/signup` (redirect to `/dashboard` if logged in)
- `(app)` group — `/setup`, `/session`, `/dashboard`, `/reports/[sessionId]`, `/profile` (require authenticated session)
- `(admin)` group — `/admin/**` (require `role = admin`)

API routes mirror the same split: `/api/generate-*` and `/api/resumes/**` require session; `/api/admin/**` require admin role.

### Session State Machine

The `/session` page is driven by a Zustand store with 8 states:
`loading (witty phrases) → mic-permission → countdown → chat (active interview) → rating → closing-note → report-wait → complete`

`SessionShell.tsx` is the state machine orchestrator — it renders the correct state component. Never put state logic in the page file.

### AI Gateway (`lib/gateway/`)

All AI calls go through `lib/gateway/index.ts` — `gatewayCall(callType, prompt, options)`:
1. **Router** — selects active provider from `ai_providers` table, rotates keys round-robin from `ai_provider_keys` pool
2. **Adapter** — formats request per provider (gemini.ts / groq.ts), normalizes response
3. **Logger** — writes call metadata (latency, tokens, errors) to `ai_call_logs`; never logs decrypted key values
4. **Retry** — exponential backoff, max 3 retries, on 429 and 503 errors
5. **Token management** — estimate tokens before every call (1 token ≈ 4 chars); if ≥ 12,000 tokens, call `/api/summarize-context` first

### Key API Routes

| Route | Purpose |
|---|---|
| `POST /api/generate-questions` | Generate 8–12 interview Qs from resume + JD + slider ratio |
| `POST /api/generate-followup` | Evaluate latest answer; return follow-up Q or `null` |
| `POST /api/summarize-context` | Compress conversation when token threshold is hit |
| `POST /api/generate-report` | Generate full performance report after session ends |
| `GET/POST /api/resumes/**` | Resume CRUD (Supabase Storage, private bucket) |
| `GET/POST /api/admin/**` | Admin: user management, provider config, logs, evals |

### Database Schema (10 tables)

`auth.users` → `profiles` (role, suspension) → `user_resumes`, `sessions`
`sessions` → `transcripts` (ordered Q&A), `reports` (JSON), `session_feedback`, `eval_results`
`ai_providers` → `ai_provider_keys`, `ai_call_logs`

All tables have RLS policies. API keys are encrypted with `pgcrypto`.

### Browser APIs

- **Speech recognition:** Web Speech API — Chromium only
- **TTS:** `SpeechSynthesis` API — reads questions word-by-word
- **PDF parsing:** pdf.js (client-side resume extraction)
- **PDF export:** jsPDF (client-side report download)

## Security Rules (Non-Negotiable)

- RLS enabled on every Supabase table — users can only read/write their own rows
- Admin routes and tables require `role = admin` checked at both middleware AND RLS layer
- `SUPABASE_SERVICE_ROLE_KEY` and all AI provider keys: server-side API routes only — never in any `NEXT_PUBLIC_` variable
- All AI calls proxied through the gateway — no provider SDK called from the client
- All DB queries via the typed Supabase JS client — no raw SQL strings built from user input
- Double auth verification: middleware checks session at edge; route handler re-verifies with `supabase.auth.getUser()` as defense-in-depth
- TruffleHog secrets scanning blocks any PR that contains a committed secret

## Testing Strategy (TDD — Strictly Enforced)

- **TDD order:** write failing test → commit → implement minimum code to pass → commit → refactor → commit
- Tests are never changed to match a broken implementation — fix the code
- Never delete existing test cases
- Unit + property tests: Vitest + React Testing Library; files end in `.test.ts` / `.test.tsx`
- Property-based tests with fast-check on 5 pure logic modules: `scoring.ts`, `tokenCounter.ts`, `questionDedup.ts`, `silenceDetector.ts`, `sessionStore.ts`
- E2E tests: Playwright in `tests/e2e/`, Chromium primary + WebKit
- Mutation testing: Stryker on the 5 modules above, weekly CI schedule, 70%+ mutation score target
- Coverage threshold: 80% minimum (branches, functions, lines, statements) — PRs blocked if below
- **Mocking:** gateway via `vi.mock('lib/gateway')`, Supabase via custom factory, Web Speech API + SpeechSynthesis via `vi.stubGlobal`

## Branching, Commits & PRs

- Never commit directly to `main`
- Branch naming: `feature/<issue-number>-<short-description>`, `bug/<issue-number>-<description>`, `chore/<issue-number>-<description>`
- Commit format: `[#<issue-number>] <type>: <description>` — e.g. `[#12] feat: implement session rating screen`
- Every PR must link its issue with `Closes #<number>` for auto-close on merge
- TODOs in code: `// ISSUE-#<number>: <description>`
- Migrations are applied via Supabase MCP only at PR-raise time, after all commits and tests pass — never earlier

## Design Rules

- **Typography:** DM Serif Display for headings, Figtree for body text
- **Icons:** lucide-react only — no emojis anywhere
- **Animations:** Framer Motion, ease-out — 200–400ms for UI transitions, 400–600ms for page transitions, fade + `y: 10 → 0` for route changes
- Always respect `prefers-reduced-motion` via Framer Motion's `useReducedMotion` hook — set `duration: 0` when enabled
- **Loading states:** ShadCN `Skeleton` components with shimmer — never spinner-only for content areas
- **Forms:** no focus rings (`focus-visible:ring-0`), inline field-level error messages only — no top-of-form banners
- No blank white flash between route transitions — use `AnimatePresence` at the layout level
- Full responsiveness: 320px mobile through 1536px+ desktop — no fixed pixel widths on containers

## AI Behavior Rules

- Never hallucinate architecture decisions — halt and ask if context is missing
- Implement only what the current issue explicitly requests — never prematurely build future features
- Push back if a requested change violates these rules, breaks RLS, exposes a key to the client, or contradicts the PRD
- All implementation decisions must be traceable to a PRD requirement ID

## Sprint Structure

4 sprints (Mar 22 – Apr 17). Each sprint issue in `SPRINT_PLAN.md` specifies exact files owned (zero merge conflicts by design), acceptance criteria, explicit test cases, and whether property-based tests are required.

- Sprint 1: Project scaffolding, auth, setup wizard
- Sprint 2: Session state machine + speech I/O
- Sprint 3: Reports, dashboard, admin panel
- Sprint 4: CI/CD, monitoring, polish
