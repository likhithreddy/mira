# Sprint Plan & Issues
## MIRA — Mock Interview and Response Analyzer

| Field | Detail |
|---|---|
| **Team** | Likhith Reddy Rechintala · Jaya Sriharshita Koneti |
| **Start Date** | March 22, 2026 |
| **Final Target** | April 17, 2026 |
| **Submission Deadline** | April 19, 2026 |

---

## How This Plan Works

### Parallel Safety
Every issue within a sprint touches a distinct set of files. No two issues in the same sprint write to the same file. Either team member can pick up any issue and work simultaneously with zero merge conflicts.

### Issue Title Format
All issue titles follow conventional commit format: `type: description`

Valid types: `feat`, `fix`, `chore`, `test`, `docs`, `security`

### Sprint MVPs
At the end of every sprint the team has a functional, deployable, demonstrable application. The MVP is stated at the top of each sprint.

### Acceptance Criteria Format
Every issue contains:
- **Functional criteria** — what must work
- **Test cases** — explicit scenarios that must pass
- **Property-based tests** — invariants that hold across all inputs (fast-check)
- **E2E scenarios** — where applicable, the Playwright flow verifying the feature

---

## Issue Labels

| Label | Meaning |
|---|---|
| `feat` | New user-facing or admin-facing functionality |
| `chore` | Infrastructure, config, tooling, migrations |
| `test` | Test-only work |
| `security` | Security-specific implementation |
| `fix` | Correction of broken behaviour |
| `docs` | Documentation only |

---

## Sprint Overview

| Sprint | Dates | MVP at End |
|---|---|---|
| Sprint 1 | Mar 22 – Mar 28 | Working auth, protected routes, deployed to production, CI/CD pipeline fully operational |
| Sprint 2 | Mar 29 – Apr 4 | Admin can configure AI providers; user can complete setup and receive a generated question set |
| Sprint 3 | Apr 5 – Apr 11 | User can complete a full spoken interview session end-to-end with follow-ups |
| Sprint 4 | Apr 12 – Apr 17 | Full production application: reports, dashboard, PDF, monitoring, full test suite |

---

---

## Sprint 1 — Mar 22 to Mar 28
### Foundation: Repository, CI/CD, Database, Auth, Middleware, Deployment

**Sprint goal:** A fully deployed skeleton — no feature work. Every future PR has infrastructure to land on cleanly.

**Sprint MVP:** Either team member can sign up, log in with Google OAuth, land on an empty `/dashboard`, and log out. The full 7-stage CI/CD pipeline passes on every PR. The production URL is live on Vercel.

**Parallel safety map:**

| Issue | Files owned exclusively |
|---|---|
| S1-01 | `package.json`, `tailwind.config.ts`, `.eslintrc.json`, `.prettierrc`, `README.md`, `tsconfig.json`, `vitest.config.ts`, `playwright.config.ts`, `stryker.config.ts`, `.env.example` |
| S1-02 | `supabase/migrations/` (all SQL files) |
| S1-03 | `.github/workflows/` |
| S1-04 | `lib/supabase/client.ts`, `lib/supabase/server.ts`, `lib/supabase/middleware.ts`, `types/supabase.ts` |
| S1-05 | `middleware.ts` |
| S1-06 | `app/(auth)/login/`, `app/(auth)/signup/`, `app/auth/callback/` |
| S1-07 | `vercel.json`, Vercel project settings |
| S1-08 | `app/page.tsx`, `components/landing/` |
| S1-09 | `sentry.client.config.ts`, `sentry.server.config.ts`, `sentry.edge.config.ts`, `next.config.ts` (Sentry plugin section only) |

---

### S1-01 · `chore`
**`chore: initialise Next.js project with TypeScript, Tailwind, ShadCN, ESLint, and Prettier`**

Bootstrap the repository with the full toolchain. Establish the complete directory structure so all future issues have a clear home for their files.

**Functional acceptance criteria:**
- Next.js 14 initialised with App Router and TypeScript strict mode (`"strict": true` in `tsconfig.json`)
- Tailwind CSS configured with `tailwind.config.ts`; custom colour tokens defined
- ShadCN CLI initialised; all baseline components installed: `Button`, `Card`, `Input`, `Textarea`, `Dialog`, `Badge`, `Skeleton`, `Tabs`, `Avatar`, `Accordion`, `Slider`, `Sheet`, `Select`, `DropdownMenu`, `RadioGroup`, `Progress`, `Form`, `Label`, `Separator`, `Toast`
- ESLint configured: `next/core-web-vitals`, `@typescript-eslint/recommended`, `jsx-a11y/recommended`; rules: `@typescript-eslint/no-explicit-any: error`, `@typescript-eslint/no-unused-vars: error`, `no-console: warn`, `jsx-a11y/alt-text: error`
- Prettier configured: `semi: true`, `singleQuote: true`, `tabWidth: 2`, `trailingComma: es5`, `printWidth: 100`, `prettier-plugin-tailwindcss` plugin
- `.env.example` documents all required variable names: `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `GEMINI_API_KEY`, `GROQ_API_KEY`, `PGCRYPTO_SECRET`, `SENTRY_DSN`, `SENTRY_AUTH_TOKEN`, `BETTERSTACK_API_KEY`
- `.env.local` in `.gitignore`; no secrets committed to repository
- Full directory structure created matching PRD project structure (placeholder `.gitkeep` files where needed)
- `vitest.config.ts` configured: jsdom environment, 80% coverage thresholds on all metrics
- `playwright.config.ts` configured for Chromium and WebKit
- `stryker.config.ts` scoped to 5 modules: `scoring.ts`, `tokenCounter.ts`, `questionDedup.ts`, `sessionStore.ts`, `silenceDetector.ts`

**Test cases:**
- `yarn dev` starts without errors from a clean clone with `.env.local` populated
- `yarn build` produces a successful production build with zero TypeScript errors
- `yarn lint` exits 0 with zero errors or warnings
- `yarn format:check` exits 0 (no formatting diffs)
- `yarn test` runs Vitest and exits 0 (no test files yet; runner must not error on empty suite)
- `yarn test:e2e` runs Playwright and exits 0 (no spec files yet)

**Property-based tests:** N/A — tooling setup, no logic.

---

### S1-02 · `chore`
**`chore: create full Supabase database schema with RLS policies, triggers, and storage bucket`**

Create both production and staging Supabase projects. Run all table migrations. Apply all RLS policies. Create all triggers. Create the private `resumes` storage bucket.

**Functional acceptance criteria:**
- Two Supabase projects created: production and staging; each with its own set of environment variable values
- `pgcrypto` extension enabled on both: `CREATE EXTENSION IF NOT EXISTS pgcrypto`
- All 10 tables created with correct column types, constraints, and defaults: `profiles`, `user_resumes`, `sessions`, `transcripts`, `reports`, `session_feedback`, `ai_providers`, `ai_provider_keys`, `ai_call_logs`, `eval_results`
- `profiles.role`: `text NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin'))`
- `profiles.is_suspended`: `boolean NOT NULL DEFAULT false`
- `sessions.slider_value`: `smallint NOT NULL CHECK (slider_value BETWEEN 1 AND 10)` — no `interview_mode` column exists
- `ai_provider_keys.key_value_encrypted`: `bytea NOT NULL`
- `eval_results` has no `user_id` column — intentionally anonymised by design
- RLS enabled on all 10 tables; all policies applied per the PRD RLS summary table
- Trigger `enforce_single_default` on `user_resumes`: setting `is_default = true` unsets all other rows for same `user_id` in same transaction
- Trigger `enforce_single_active_provider` on `ai_providers`: setting `is_active = true` unsets all other rows in same transaction
- Trigger `auto_create_profile` on `auth.users` INSERT: creates `profiles` row with `id`, `email`, `role = 'user'`, `is_suspended = false`
- Private `resumes` bucket created; storage RLS: users can only read/write/delete paths prefixed with their own `auth.uid()`
- All migration SQL files committed to `supabase/migrations/` with numbered filenames
- `SUPABASE_TEST_URL` and `SUPABASE_TEST_ANON_KEY` (staging project credentials) added to GitHub repository secrets

**Test cases:**
- Insert a row into `auth.users` → `profiles` row auto-created with `role = 'user'` and `is_suspended = false`
- Set `is_default = true` on a second `user_resumes` row for same user → first row `is_default` becomes `false`
- Set `is_active = true` on a second `ai_providers` row → first row `is_active` becomes `false`
- INSERT `sessions` with `slider_value = 0` → constraint violation error returned
- INSERT `sessions` with `slider_value = 11` → constraint violation error returned
- SELECT `profiles` as a different authenticated user → RLS returns 0 rows
- SELECT `eval_results` as a regular user (role = 'user') → RLS returns 0 rows
- SELECT `ai_providers` as a regular user → RLS returns 0 rows

**Property-based tests:** N/A — declarative schema constraints.

---

### S1-03 · `chore`
**`chore: implement 12-stage sequential GitHub Actions CI/CD pipeline with branch protection rules`**

Implement the full sequential GitHub Actions pipeline. Configure branch protection on `main`. No `production.yml` — Vercel's GitHub integration handles production deploys automatically on push to `main`.

**Functional acceptance criteria:**
- `.github/workflows/pr.yml` triggers on `pull_request` targeting `main` (types: `opened`, `synchronize`, `reopened`, `closed`)
- **Stage 1:** `type-check` — `tsc --noEmit`
- **Stage 2:** `next-build` — `next build` (blocked on Stage 1)
- **Stage 3:** `lint-check` — ESLint with `--max-warnings 0` (blocked on Stage 2)
- **Stage 4:** `format-check` — Prettier `--check` (blocked on Stage 3)
- **Stage 5:** `dependency-audit` — `yarn audit --level high` (blocked on Stage 4)
- **Stage 6:** `secrets-scan` — `trufflesecurity/trufflehog-actions-scan` with `fetch-depth: 0` (blocked on Stage 5)
- **Stage 7:** `codeql-analysis` — GitHub CodeQL for TypeScript; SARIF saved locally and uploaded to Security tab; fails if any Critical or High finding (`level: error` in SARIF) is detected (blocked on Stage 6)
- **Stage 8:** `vitest` — `yarn test --coverage`; fails if any coverage metric < 80% (enforced by Vitest config thresholds); lcov report uploaded as artifact (blocked on Stage 7)
- **Stage 9:** `playwright` — Chromium + WebKit; `SUPABASE_TEST_URL` and `SUPABASE_TEST_ANON_KEY` from GitHub Secrets; uploads test report and failure screenshots as artifacts (blocked on Stage 8)
- **Stage 10:** `stryker` — `npx stryker run` on every PR; fails if mutation score < 60%; uploads HTML report as artifact (blocked on Stage 9)
- **Stage 11:** `claude-code` — `anthropics/claude-code-action@v1`; permissions: `contents: read`, `pull-requests: write` only; posts inline comments and PR summary (blocked on Stage 10)
- **Stage 12:** `vercel-preview` — deploys PR branch to isolated Vercel preview URL; URL posted as PR comment; skipped when PR is closed (blocked on Stage 11)
- `vercel-teardown` job — runs only on PR close/merge; removes the preview deployment
- Branch protection on `main`: no direct push, no force push, require PR, Stages 1–10 must pass as required status checks, minimum 1 approval, stale reviews dismissed on new commits
- Required GitHub Secrets: `VERCEL_TOKEN`, `ANTHROPIC_API_KEY`, `SUPABASE_TEST_URL`, `SUPABASE_TEST_ANON_KEY`, `SENTRY_AUTH_TOKEN` (added per-issue as each service is integrated)

**Test cases:**
- Open PR with a TypeScript error → Stage 1 (`type-check`) fails; all downstream stages skipped; PR cannot be merged
- Open PR with an ESLint violation → Stages 1–2 pass, Stage 3 (`lint-check`) fails; PR cannot be merged
- Open PR with test coverage at 79% → Stage 8 (`vitest`) fails; PR cannot be merged
- Open PR with mutation score below 60% → Stage 10 (`stryker`) fails; PR cannot be merged
- Open a valid PR → all 12 stages pass sequentially; preview URL appears as PR comment
- Close or merge a PR → `vercel-teardown` job runs and removes the preview deployment

**Property-based tests:** N/A — CI/CD configuration.

---

### S1-04 · `chore`
**`chore: integrate Supabase SSR client for browser, server, and middleware usage contexts`**

Wire `@supabase/ssr` into the project. This is a hard prerequisite for both S1-05 (middleware) and S1-06 (auth pages).

**Functional acceptance criteria:**
- `@supabase/ssr` and `@supabase/supabase-js` installed
- `lib/supabase/client.ts` exports `createBrowserClient()` using `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `lib/supabase/server.ts` exports `createServerClient(cookieStore)` using server-only vars; works in Server Components and API route handlers
- `lib/supabase/middleware.ts` exports `updateSession(request: NextRequest): NextResponse`; refreshes session token and writes it back to response cookies
- TypeScript types generated from Supabase schema via `npx supabase gen types typescript`; output to `types/supabase.ts`; `types/supabase.ts` committed and reflects all 10 tables
- No runtime errors on any page with `.env.local` populated

**Test cases:**
- `createBrowserClient()` returns a Supabase client instance without throwing
- `createServerClient(mockCookieStore)` returns a Supabase client instance without throwing
- `updateSession(mockRequest)` returns a `NextResponse` instance with cookie headers present
- `createServerClient()` with anon key does not grant service role privileges

**Property-based tests:** N/A — client factory wrappers.

---

### S1-05 · `chore`
**`chore: implement Next.js edge middleware for route protection, admin role enforcement, and session refresh`**

Implement `middleware.ts` at project root. This is the security boundary for all routes. Depends on S1-04 being merged first.

**Functional acceptance criteria:**
- Calls `updateSession(request)` on every matched request to silently refresh session tokens
- Unauthenticated request to any user-protected route (`/dashboard`, `/setup`, `/session`, `/reports/**`, `/profile`) → `302` redirect to `/login?returnTo={encodedOriginalPath}`
- Unauthenticated request to any admin route (`/admin/**`) → `302` redirect to `/login?returnTo={encodedOriginalPath}`
- Unauthenticated request to user API routes (`/api/generate-*`, `/api/summarize-context`, `/api/judge`, `/api/resumes/**`) → `401` JSON `{ "error": "Unauthorized" }`
- Authenticated request to `/login` or `/signup` → `302` redirect to `/dashboard`
- Authenticated non-admin request to `/admin/**` → `403` JSON `{ "error": "Forbidden" }`
- Authenticated non-admin request to `/api/admin/**` → `403` JSON `{ "error": "Forbidden" }`
- Authenticated admin request to `/admin/**` → passes through
- Suspended user (`profiles.is_suspended = true`) on any protected route → `302` redirect to `/login?suspended=true`
- Static assets (`/_next/static/**`, `/_next/image/**`, `/favicon.ico`, image extensions) excluded via `matcher` config
- Uses only Edge Runtime-compatible APIs; no Node.js imports

**Test cases (unit — mock `NextRequest` and Supabase client via `vi.fn()`):**
- `GET /dashboard` with no session → redirect to `/login?returnTo=%2Fdashboard`
- `GET /dashboard` with valid user session → passes through
- `GET /login` with valid user session → redirect to `/dashboard`
- `GET /admin/users` with `role = 'user'` session → `403`
- `GET /admin/users` with `role = 'admin'` session → passes through
- `GET /api/generate-questions` with no session → `401` with `{ "error": "Unauthorized" }`
- `GET /api/admin/users` with user session → `403`
- `GET /_next/static/chunk.js` → middleware not executed (excluded by matcher)
- `GET /dashboard` with valid session where `is_suspended = true` → redirect to `/login?suspended=true`
- `GET /api/generate-questions` with admin session → passes through

**Property-based tests:**
- **Property:** For any path string matching a protected route pattern, if `session` is `null`, response status is always `302` or `401` — never `200`
- **Property:** For any path string matching an admin route pattern, if `session.user.role !== 'admin'`, response status is always `403` — never `200`

---

### S1-06 · `feat`
**`feat: implement login and signup pages with email/password and Google OAuth`**

Implement `/login` and `/signup`. These are the only entry points into the authenticated application.

**Functional acceptance criteria:**
- `/login`: email input, password input, "Sign In" button, "Continue with Google" button, "Don't have an account? Sign up" link
- `/signup`: email input, password input, "Create Account" button, "Continue with Google" button, "Already have an account? Sign in" link
- Live password checklist on `/signup` (shown as user types, not on submit): ✓ At least 8 characters, ✓ At least one uppercase letter, ✓ At least one number
- Invalid credentials on `/login` → inline error below email: "Invalid email or password" — no full page reload
- Email already registered on `/signup` → inline error: "An account with this email already exists"
- Successful login → redirect to `returnTo` query param if present, else `/dashboard`
- Successful signup → page shows "Check your email to verify your account"
- Google OAuth → `supabase.auth.signInWithOAuth({ provider: 'google' })`; callback handled by `/auth/callback`; redirects to `/dashboard`
- Forms built with React Hook Form + Zod
- All inputs keyboard-navigable; form submits on Enter
- ShadCN `Form`, `Input`, `Button`, `Label` used throughout
- Submit button shows loading spinner and is disabled during async auth call
- Auth errors mapped to user-friendly messages (no raw Supabase error strings)

**Test cases:**
- Submit `/login` with empty email → inline error "Email is required"; no API call
- Submit `/login` with `a@b` → inline error "Enter a valid email address"
- Submit `/signup` with password "pass" → checklist shows all 3 checks failing
- Submit `/signup` with password "Password1" → all 3 checklist items show ✓
- Submit `/login` with valid credentials → redirect to `/dashboard`
- Submit `/login` with `returnTo=/setup` in URL → redirect to `/setup` on success
- Submit `/login` with wrong password → inline error shown; no redirect

**Property-based tests:**
- **Property:** For any email string `s`, if `s` does not match `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`, the Zod email schema always returns an error — never valid
- **Property:** For any password string `s` on signup: if `s.length < 8 OR !/[A-Z]/.test(s) OR !/[0-9]/.test(s)`, the Zod password schema always returns an error — never valid

---

### S1-07 · `chore`
**`chore: configure Vercel three-environment deployment with staging, production, and rollback`**

Connect repository to Vercel. Configure PR Preview, Staging, and Production environments. Verify blue-green deployment and rollback.

**Functional acceptance criteria:**
- Vercel project created and connected to GitHub repository via Vercel GitHub integration
- Production environment: deploys from `main`; all production env vars set; `SUPABASE_SERVICE_ROLE_KEY` server-only (no `NEXT_PUBLIC_` prefix)
- Staging environment: deploys from `staging` branch; uses staging Supabase project env vars
- Preview environment: auto-created per PR branch; uses test Supabase project env vars
- Preview URL posted as PR comment by Stage 12 of PR pipeline
- Staging URL resolves and returns HTTP 200
- Production URL resolves and returns HTTP 200
- Rollback: previous Vercel deployment can be promoted in Vercel dashboard in under 60 seconds
- `VERCEL_TOKEN` added to GitHub repository secrets
- README updated with: production URL, staging URL, rollback procedure steps

**Test cases:**
- Merge a PR to `main` → production URL serves new code within 3 minutes
- Push to `staging` branch → staging deployment updates
- Open a PR → unique preview URL generated and posted as PR comment
- Rollback: promote previous deployment → traffic serves old code; re-promote new → traffic serves new code

**Property-based tests:** N/A — deployment configuration.

---

### S1-08 · `feat`
**`feat: build public landing page with hero section, feature callouts, and browser compatibility notice`**

Implement the public `/` landing page.

**Functional acceptance criteria:**
- Hero section: MIRA headline, sub-headline (1–2 sentences on value prop), "Get Started Free" CTA → `/signup`, "Sign In" link → `/login`
- Three feature callout cards: "Contextual Questions", "Spoken Practice", "Performance Report"
- Browser compatibility notice banner: "For the best experience with voice features, use Chrome or Edge"; dismissible; not shown when browser is already Chrome or Edge (detected via `navigator.userAgent`)
- Top navigation: MIRA logo left; "Sign In" and "Get Started" buttons right; collapses to hamburger `Sheet` on mobile
- Framer Motion fade-in on hero mount: `opacity: 0→1`, `y: 20→0`, 400ms ease-out
- Fully responsive: single-column mobile, two-column hero on `lg+`
- No Supabase imports; fully static page

**Test cases:**
- Render → hero headline visible
- Render at 375px → single-column layout; no horizontal overflow
- Render at 1280px → two-column hero layout
- Click "Get Started Free" → router navigates to `/signup`
- Click "Sign In" → router navigates to `/login`
- Render with Chrome user agent → banner not shown
- Render with Firefox user agent → banner shown
- Click dismiss on banner → banner removed from DOM

**Property-based tests:** N/A — static presentational page.

---

### S1-09 · `chore`
**`chore: integrate Sentry error tracking with source map upload and production alert rules`**

Add Sentry to the application for client and server error capture.

**Functional acceptance criteria:**
- `@sentry/nextjs` installed
- `sentry.client.config.ts`, `sentry.server.config.ts`, `sentry.edge.config.ts` created with DSN from `SENTRY_DSN` environment variable
- Sentry webpack plugin in `next.config.ts` uploads source maps on build using `SENTRY_AUTH_TOKEN`
- Source maps uploaded on every production deploy; stack traces in Sentry link to original TypeScript lines
- `SENTRY_DSN` set in all three Vercel environments; never committed to repository
- Sentry captures: unhandled exceptions in API routes, React Error Boundary catches, unhandled promise rejections
- Vercel Analytics enabled on production project
- Three Sentry alert rules: (1) new issue first seen → email both team members, (2) issue regresses after resolve → email, (3) error volume > 10 in 1 hour → email
- `SENTRY_AUTH_TOKEN` added to GitHub repository secrets

**Test cases:**
- Add deliberate `throw new Error('Sentry test')` to a test API route; call it → error appears in Sentry dashboard within 60 seconds
- Stack trace in Sentry points to TypeScript source file (not compiled output)
- `git grep SENTRY_DSN -- '*.ts' '*.tsx' '*.json'` returns no results except `.env.example`
- Remove the test error before merging

**Property-based tests:** N/A — monitoring configuration.

---

---

## Sprint 2 — Mar 29 to Apr 4
### AI Gateway, Admin Provider Config, Resume Management, Setup Wizard, Question Generation

**Sprint goal:** The AI gateway is operational. Admin can configure providers. Users can manage resumes and complete the full setup flow.

**Sprint MVP:** An admin user (role set via SQL) can log in, go to `/admin/providers`, add a Gemini provider with an API key, and set it as active. A regular user can upload a resume on `/profile`, navigate to `/setup`, select the saved resume, enter a JD, set the slider, confirm, see the witty phrases loading screen, and have a generated question set + opening greeting + closing note ready in Zustand state.

**Parallel safety map:**

| Issue | Files owned exclusively |
|---|---|
| S2-01 | `lib/gateway/index.ts`, `lib/gateway/router.ts`, `lib/gateway/logger.ts`, `types/gateway.ts` |
| S2-02 | `lib/gateway/adapters/gemini.ts`, `lib/gateway/adapters/groq.ts`, `lib/gateway/prompts.ts` |
| S2-03 | `lib/supabase/providers.ts`, `lib/supabase/callLogs.ts`, `lib/supabase/evalResults.ts`, `types/admin.ts` |
| S2-04 | `app/(admin)/`, `components/admin/`, `app/api/admin/` |
| S2-05 | `app/api/resumes/` |
| S2-06 | `app/(app)/profile/`, `components/profile/`, `app/api/profile/` |
| S2-07 | `store/sessionStore.ts`, `store/uiStore.ts`, `types/session.ts` |
| S2-08 | `app/(app)/setup/`, `components/setup/` |
| S2-09 | `app/api/generate-questions/`, `schemas/questionSchema.ts`, `lib/supabase/sessions.ts` |

---

### S2-01 · `feat`
**`feat: implement AI gateway core with round-robin key rotation and provider fallback chain`**

Implement `lib/gateway/index.ts` (entry point), `lib/gateway/router.ts` (provider selection, key rotation, fallback), and `lib/gateway/logger.ts` (audit logging). This is the foundation all AI API routes depend on.

**Functional acceptance criteria:**
- `lib/gateway/index.ts` exports `gatewayCall(callType: GatewayCallType, prompt: string, options?: GatewayOptions): Promise<GatewayResponse>`
- `GatewayCallType` union: `'question-generation' | 'follow-up' | 'summarize-context' | 'report' | 'judge'`
- `lib/gateway/router.ts` fetches the row where `ai_providers.is_active = true`; fetches all `ai_provider_keys` for that provider where `is_active = true`; selects the next key using a module-level round-robin counter persisted between calls in the same server process
- Round-robin: given keys [k0, k1, k2], call 1 → k0, call 2 → k1, call 3 → k2, call 4 → k0
- On `429` or `5xx` from a key: mark that key as failed for this request; try the next key in the same provider pool
- If all keys for the active provider exhausted (all returned errors): fall back to the next provider ordered by `ai_providers.created_at ASC`; attempt its key pool with same round-robin
- If all providers and all their keys fail: throw typed `GatewayExhaustedError`
- Key decryption via `SELECT pgp_sym_decrypt(key_value_encrypted, $PGCRYPTO_SECRET)` — only at call time; decrypted key value never stored, logged, or returned anywhere
- `lib/gateway/logger.ts` writes one row to `ai_call_logs` after every call attempt (success or failure): `provider_id`, `key_index` (integer — never the key value), `call_type`, `latency_ms`, `estimated_tokens`, `http_status`; uses service role Supabase client
- `ProviderAdapter` TypeScript interface in `types/gateway.ts`: `formatRequest(prompt: string, callType: GatewayCallType): unknown` and `parseResponse(raw: unknown): GatewayResponse`
- `GatewayResponse` type: `{ text: string; provider: string; model: string; latencyMs: number }`

**Test cases:**
- 1 active provider with 3 keys, 4 sequential calls → keys used in order [0, 1, 2, 0]
- Active provider key[0] returns `429` → router retries with key[1]; succeeds → `ai_call_logs` has 2 rows (failure then success)
- All 3 keys of active provider return `429` → router falls back to second provider; uses its key[0]
- All providers exhausted → `gatewayCall` throws `GatewayExhaustedError`
- `ai_call_logs` row contains `key_index` as integer; no `key_value` field present in any log row
- Decrypted key value never appears in any argument passed to `logger.ts`

**Property-based tests:**
- **Property:** Given `n` keys (for any integer `1 ≤ n ≤ 20`), after exactly `n` sequential calls all succeeding, the round-robin counter returns to 0 — call index `i` always uses `key[i % n]`
- **Property:** Given any sequence of provider responses (any mix of success and failure), `GatewayExhaustedError` is thrown if and only if every key across every provider returned a non-2xx status — never thrown in any partial-failure scenario

---

### S2-02 · `feat`
**`feat: implement Gemini and Groq provider adapters with normalised request formatting and response parsing`**

Implement the two concrete provider adapters and all prompt templates.

**Functional acceptance criteria:**
- `lib/gateway/adapters/gemini.ts` implements `ProviderAdapter`
- Gemini `formatRequest`: builds `{ model: 'gemini-pro', contents: [{ role: 'user', parts: [{ text: prompt }] }], generationConfig: { temperature: 0.7 } }`
- Gemini `parseResponse`: extracts `response.candidates[0].content.parts[0].text`; throws `ProviderParseError` if path absent
- `lib/gateway/adapters/groq.ts` implements `ProviderAdapter`
- Groq `formatRequest`: builds `{ model: 'llama3-8b-8192', messages: [{ role: 'user', content: prompt }], temperature: 0.7, max_tokens: 2000 }`
- Groq `parseResponse`: extracts `response.choices[0].message.content`; throws `ProviderParseError` if path absent
- Groq API endpoint: `https://api.groq.com/openai/v1/chat/completions` with `Authorization: Bearer {key}` header
- Both adapters return normalised `GatewayResponse`: `{ text, provider, model, latencyMs }`
- Both adapters throw typed `ProviderError` on HTTP errors (carrying `statusCode` and `message`)
- `lib/gateway/prompts.ts` exports all prompt template constants: `QUESTION_GENERATION_PROMPT`, `FOLLOW_UP_PROMPT`, `SUMMARIZE_CONTEXT_PROMPT`, `REPORT_PROMPT`, `JUDGE_PROMPT`

**Test cases:**
- Gemini `formatRequest('hello', 'question-generation')` → `contents[0].parts[0].text === 'hello'`
- Gemini `parseResponse` with valid Gemini JSON → returns `{ text: '...', provider: 'gemini' }`
- Gemini `parseResponse` with `{ candidates: [] }` → throws `ProviderParseError`
- Groq `formatRequest('hello', 'report')` → `messages[0].content === 'hello'`
- Groq `parseResponse` with valid Groq JSON → returns `{ text: '...', provider: 'groq' }`
- Mock HTTP 429 on Groq → throws `ProviderError` with `statusCode: 429`
- Mock HTTP 500 on Gemini → throws `ProviderError` with `statusCode: 500`

**Property-based tests:**
- **Property:** For any non-empty string `prompt`, `geminiAdapter.formatRequest(prompt, anyCallType).contents[0].parts[0].text === prompt` — prompt never mutated or truncated
- **Property:** For any non-empty string `prompt`, `groqAdapter.formatRequest(prompt, anyCallType).messages[0].content === prompt` — prompt never mutated or truncated

---

### S2-03 · `chore`
**`chore: implement Supabase data access layer for ai_providers, ai_call_logs, and eval_results tables`**

Implement the typed DB access functions for the three infrastructure tables.

**Functional acceptance criteria:**
- `lib/supabase/providers.ts` exports: `getActiveProvider()`, `getProviderKeys(providerId)`, `getAllProviders()`, `createProvider(data)`, `updateProvider(id, data)`, `deleteProvider(id)`, `createProviderKey(data)`, `deleteProviderKey(id)`
- `lib/supabase/callLogs.ts` exports: `insertCallLog(data)`, `getCallLogs(filters, page)`
- `lib/supabase/evalResults.ts` exports: `insertEvalResult(data)`, `getEvalResults(filters)`, `getEvalMetrics()`
- All functions use `createServerClient()` from `lib/supabase/server.ts`; never the browser client
- All functions have explicit TypeScript return types; no `any`
- All functions throw typed errors on failure
- `types/admin.ts` defines all types: `AIProvider`, `AIProviderKey`, `CallLog`, `EvalResult`, `EvalMetrics`

**Test cases:**
- `getActiveProvider()` with mocked Supabase → returns the row where `is_active = true`
- `getActiveProvider()` when no active provider → throws `NoActiveProviderError`
- `getProviderKeys(id)` → returns only keys where `is_active = true` for that provider
- `insertCallLog(data)` → calls Supabase insert with all required fields; no `key_value` field in the data
- `getCallLogs({ callType: 'follow-up' }, 1)` → returns only rows where `call_type = 'follow-up'`
- `getEvalMetrics()` → returns average score per dimension across all `eval_results` rows

**Property-based tests:**
- **Property:** `getCallLogs(filters, page)` always returns at most 20 rows regardless of total row count

---

### S2-04 · `feat`
**`feat: build admin dashboard with user management and AI provider configuration`**

Implement the full admin section: shared layout, home, user management page, and provider configuration page.

**Functional acceptance criteria:**
- `(admin)/layout.tsx`: admin nav sidebar with links: "Dashboard", "Users", "Providers", "Logs", "Evals", "← Back to App"; server-side role check — `role !== 'admin'` renders 403 error component (not redirect)
- `/admin`: welcome card with quick-stat tiles: total users, total sessions, total providers configured
- `/admin/users`: paginated user table (20/page); columns: avatar initials, email, display name, signup date, session count, status (Active/Suspended)
- "Suspend" button: confirmation `Dialog`; on confirm → `PATCH /api/admin/users` with `{ id, is_suspended: true }`; row updates immediately; admin cannot suspend own account
- "Activate" button (suspended users): `PATCH /api/admin/users` with `{ id, is_suspended: false }`
- "Delete" button: destructive `Dialog` "This will permanently delete the user and all their data. This action cannot be undone."; on confirm → `DELETE /api/admin/users?id={id}`; row removed with Framer Motion exit animation; cascade deletes all user data
- `/admin/providers`: provider list cards; each shows provider name, active badge, key count; "Set as Active", "Add Key", "Remove Provider" actions
- "Set as Active" → `PATCH /api/admin/providers` with `{ id, is_active: true }`; active badge moves immediately
- "Add Key": `Dialog` with password-type input + optional label; on submit → `POST /api/admin/providers/keys`; server calls `pgp_sym_encrypt(key, PGCRYPTO_SECRET)` before DB write
- Keys displayed as masked values (`sk-••••••••••••3f2a`); full key never returned after submission
- "Remove Key": confirmation `Dialog`; `DELETE /api/admin/providers/keys?id={keyId}`
- "Add New Provider": `Dialog` with `Select` for provider name (gemini, groq) and display name; `POST /api/admin/providers`
- All `/api/admin/**` routes return `403` for non-admin callers (checked in route handler independently of middleware)
- `DELETE /api/admin/users` cascade: deletes sessions, transcripts, reports, feedback, user_resumes, storage files, `profiles` row, then `auth.admin.deleteUser()`
- Loading skeletons on all list pages; empty states

**Test cases:**
- Render `/admin/users` as non-admin → 403 component; no user data visible
- Suspend a user → row status badge changes to "Suspended"; `PATCH /api/admin/users` called with `{ is_suspended: true }`
- Attempt to render own row → "Suspend" and "Delete" buttons not rendered
- Delete a user → confirmation dialog; on confirm → row removed; `DELETE /api/admin/users` called
- Add a key → key appears as masked value; key value not in any subsequent GET response
- Set provider as active → active badge on new provider; no other provider shows active badge
- `POST /api/admin/providers/keys` as non-admin → `403`
- `DELETE /api/admin/users` as non-admin → `403`

**Property-based tests:**
- **Property:** Given any number of providers (1 to 50), after any "Set as Active" operation, the count of rows where `is_active = true` is always exactly 1

---

### S2-05 · `feat`
**`feat: implement resume upload, signed download URL, and atomic delete API routes`**

Implement the three server-side resume management API routes.

**Functional acceptance criteria:**
- `POST /api/resumes/upload`: validates `Content-Type: multipart/form-data`; validates file is `application/pdf`; validates file ≤ 5MB; checks user has < 10 rows in `user_resumes`; writes to Supabase Storage at `{userId}/{timestamp}_{sanitisedFilename}.pdf`; saves `storage_path`, `extracted_text`, `file_name`, `user_id` to `user_resumes`; returns `201` with new resume record
- Returns `400 { error: 'File must be a PDF' }` for non-PDF
- Returns `400 { error: 'File exceeds 5MB limit' }` for files > 5MB
- Returns `409 { error: 'Resume limit reached' }` when user already has 10 resumes
- `GET /api/resumes/[id]/download`: verifies ownership via RLS; generates Supabase Storage signed URL (60s expiry); returns `{ signedUrl }` — never file bytes
- `DELETE /api/resumes/[id]`: verifies ownership; calls `storage.remove([path])` first; if storage delete succeeds → deletes DB row; if storage delete fails → DB row NOT deleted → returns `500 { error: 'Storage delete failed' }`
- All three routes return `401` for unauthenticated callers
- All three routes return `404` for IDs not owned by the requesting user (RLS behaves as not-found)

**Test cases:**
- Upload valid PDF ≤ 5MB with < 10 existing resumes → `201`; row in `user_resumes`; file in Storage
- Upload non-PDF → `400` "File must be a PDF"
- Upload 6MB PDF → `400` "File exceeds 5MB limit"
- Upload when user has 10 resumes → `409`
- Download owned resume → `{ signedUrl }` with 60s expiry
- Download resume owned by different user → `404`
- Delete: Storage delete succeeds → DB row deleted; `200`
- Delete: Storage delete fails → DB row NOT deleted; `500`
- All routes: no session → `401`

**Property-based tests:**
- **Property:** For any filename string (including unicode, spaces, slashes, SQL injection attempts), the storage path `{userId}/{timestamp}_{sanitisedFilename}.pdf` never contains `..`, an unescaped `/` in the filename segment, or SQL metacharacters — filename always sanitised before path construction

---

### S2-06 · `feat`
**`feat: build profile page with resume list, upload zone, default management, and display name editor`**

Implement `/profile`.

**Functional acceptance criteria:**
- User email displayed read-only; editable display name `Input`; "Save" button → `PATCH /api/profile` to update `profiles.full_name`; success toast on save
- Resume section header: "3 / 10 resumes saved"
- Each resume shown as ShadCN `Card`: filename, formatted upload date, "Default" `Badge` if `is_default = true`
- "Set as default" → `PATCH /api/resumes/[id]` with `{ is_default: true }`; UI updates immediately; previous default loses badge
- "Download" → calls `GET /api/resumes/[id]/download`; opens signed URL in new tab
- "Delete" → `Dialog` confirmation; on confirm → `DELETE /api/resumes/[id]`; card removed with Framer Motion exit animation; count indicator updates
- Resume upload zone at page bottom: drag-and-drop PDF; parses via pdf.js client-side; shows extracted text preview (first 300 chars); shows inline warning if pdf.js returns empty string; always saves to profile (`POST /api/resumes/upload`)
- On mobile (`sm` and below): action buttons collapse into per-card ShadCN `DropdownMenu`
- Loading skeleton (3 placeholder cards) while fetching
- Empty state: "No saved resumes yet. Upload one below." with upload zone visible
- All mutations show success/error toasts

**Test cases:**
- Render with 0 resumes → empty state; upload zone visible
- Render with 3 resumes → count shows "3 / 10 resumes saved"
- Click "Set as default" on non-default resume → that card shows "Default" badge; previous default loses badge
- Click "Delete" → confirmation dialog; on confirm → card removed; count decrements
- Upload valid PDF → extracted text preview shown; count increments
- Upload non-PDF → inline error "Only PDF files are accepted"
- Upload at 10 resumes → inline error "You've reached the maximum of 10 saved resumes"
- Edit display name → save → success toast; name persists on next page load
- Render at 375px → action buttons in `DropdownMenu`

**Property-based tests:**
- **Property:** The count indicator always shows a numerator between 0 and 10 inclusive — never exceeds 10 regardless of actual DB state

---

### S2-07 · `feat`
**`feat: implement Zustand session store with all state fields, actions, and invariant guards`**

Implement the complete Zustand session store that drives all 8 session phases.

**Functional acceptance criteria:**
- `store/sessionStore.ts` exports `useSessionStore` with all state fields: `resumeText`, `jdText`, `sliderValue` (1–10, default 5), `selectedResumeId`, `sessionPhase` (`'idle' | 'loading' | 'mic-permission' | 'countdown' | 'active' | 'rating' | 'closing' | 'report-wait' | 'complete'`), `questions`, `openingGreeting`, `closingNote`, `currentQuestionIndex`, `activeQuestion`, `consecutiveFollowUpCount`, `conversationHistory`, `contextPayload` (`{ conversationSummary, lastQuestion, lastAnswer }`), `sessionId`, `startTime`, `elapsedSeconds`, `micPermissionGranted`, `isSpeaking`, `isListening`, `liveTranscript`, `report`, `rating`, `feedbackText`
- All actions: `setResumeText`, `setJDText`, `setSliderValue`, `setSessionPhase`, `setGeneratedContent(questions, greeting, closing)`, `addAnswer(answer)`, `updateContextPayload(payload)`, `advanceToNextQuestion()`, `injectFollowUp(question)`, `incrementConsecutiveFollowUp()`, `resetConsecutiveFollowUp()`, `setReport`, `setRating`, `setFeedbackText`, `resetSession`
- `injectFollowUp(question)` returns `false` and makes no state change if `consecutiveFollowUpCount >= 2`; returns `true` and appends question if count < 2
- `advanceToNextQuestion()` always calls `resetConsecutiveFollowUp()` before incrementing `currentQuestionIndex`
- `setSliderValue(n)` — values outside [1, 10] are silently ignored; `sliderValue` unchanged
- `resetSession()` resets all fields to initial values
- `addAnswer(answer)` appends `{ role: 'candidate', content: answer }` to `conversationHistory`; updates `contextPayload.lastAnswer`
- `store/uiStore.ts` exports `useUIStore` with `isLoading`, `toastQueue`, actions `setLoading`, `pushToast`, `dismissToast`

**Test cases:**
- `injectFollowUp` with count 0 → returns `true`; count becomes 1
- `injectFollowUp` with count 1 → returns `true`; count becomes 2
- `injectFollowUp` with count 2 → returns `false`; count stays 2; state unchanged
- `advanceToNextQuestion()` → `consecutiveFollowUpCount` resets to 0; `currentQuestionIndex` increments
- `setSliderValue(0)` → `sliderValue` unchanged
- `setSliderValue(11)` → `sliderValue` unchanged
- `setSliderValue(5)` → `sliderValue === 5`
- `resetSession()` → `sessionPhase === 'idle'`; all fields at initial values
- `addAnswer('my answer')` → `conversationHistory.length` increased by 1; `contextPayload.lastAnswer === 'my answer'`

**Property-based tests:**
- **Property:** For any sequence of `injectFollowUp` calls (any length, any order), `consecutiveFollowUpCount` never exceeds 2
- **Property:** For any sequence of `advanceToNextQuestion` calls, after each call `consecutiveFollowUpCount === 0`
- **Property:** `setSliderValue(n)` for any integer `n`: if `n < 1 OR n > 10`, `sliderValue` is unchanged; if `1 ≤ n ≤ 10`, `sliderValue === n`
- **Property:** `addAnswer` called `n` times from empty store → `conversationHistory.length === n`

---

### S2-08 · `feat`
**`feat: build 3-step setup wizard with resume tabs, JD input, slider, and confirmation preview`**

Implement the `/setup` wizard — the user's entry point into a session.

**Functional acceptance criteria:**
- Step indicator at top showing steps 1, 2, 3 with active/completed highlighting
- **Step 1 — Resume**: three ShadCN `Tabs`: "Saved Resumes", "Upload New", "Paste Text"
  - "Saved Resumes": fetches `user_resumes` from Supabase; card per resume (filename, date, default badge); clicking sets `resumeText` from `extracted_text` and `selectedResumeId` in Zustand; default resume pre-selected on mount; empty state with link to `/profile`
  - "Upload New": drag-and-drop PDF zone; pdf.js parses client-side; extracted text preview shown; checkbox "Save to my profile for future sessions" (default unchecked); inline warning if pdf.js returns empty string
  - "Paste Text": `Textarea` 10,000 char limit; live counter; sets `resumeText` in Zustand
  - "Next" disabled if no resume source selected
- **Step 2 — Job Description**: `Textarea` 10,000 char limit; live counter; "Next" disabled if empty; "Back" returns to Step 1 preserving all data
- **Step 3 — Configure & Confirm**: ShadCN `Slider` min=1 max=10 step=1 defaultValue=5; live ratio label (e.g. "70% Technical / 30% Behavioral"); confirmation preview card showing truncated resume (200 chars) and JD (200 chars) previews + ratio badge; "Start Interview" always enabled; "Back" returns to Step 2
- Clicking "Start Interview": sets `sessionPhase = 'loading'`; fires `POST /api/generate-questions`; on success → `sessionPhase = 'mic-permission'`; on failure → inline error with "Try Again"
- Fully responsive; single-column all breakpoints; max-w-xl centered on desktop
- All validation errors shown inline — never via toast

**Test cases:**
- Render Step 1 with 0 saved resumes → empty state; "Next" disabled
- Select saved resume → "Next" enabled
- Switch to "Paste Text" and type → `resumeText` in Zustand updated
- Click "Next" on Step 1 → Step 2 renders; resume data preserved
- Click "Back" on Step 2 → Step 1 renders; resume data still in Zustand
- Slider at value 1 → label shows "100% Technical / 0% Behavioral"
- Slider at value 10 → label shows "0% Technical / 100% Behavioral"
- Slider at value 5 → label shows approximately "50% Technical / 50% Behavioral"
- Click "Start Interview" → `sessionPhase` becomes `'loading'`

**Property-based tests:**
- **Property:** For any slider integer value `v` where `1 ≤ v ≤ 10`, displayed technical% + behavioral% always equals exactly 100
- **Property:** For any string pasted into JD textarea with length > 10,000, `jdText` in Zustand is always clamped at 10,000 characters

---

### S2-09 · `feat`
**`feat: implement question generation API route with greeting, closing note, Zod validation, and sessionStorage caching`**

Implement `POST /api/generate-questions`.

**Functional acceptance criteria:**
- Accepts `{ resumeText: string, jdText: string, sliderValue: number, userName: string, roleTitle: string }`
- Returns `401` for unauthenticated callers
- Returns `400 { error: 'Missing required fields', fields: string[] }` if any field absent or empty
- Calls `gatewayCall('question-generation', prompt)` — never imports Gemini SDK directly
- Prompt from `QUESTION_GENERATION_PROMPT` template; includes resume, JD, slider ratio, instruction to generate 8–12 questions reflecting the ratio, a personalised opening greeting using `userName` and `roleTitle`, and a personalised closing note
- Response Zod-validated against `schemas/questionSchema.ts`: `{ questions: Array<{ id, question, category: 'technical' | 'behavioral', expectedKeywords: string[] }>, openingGreeting: string, closingNote: string }` with `questions.length` between 8 and 12
- On Zod parse failure: retries with re-prompt including the parse error; max 2 retries; on third failure → `422 { error: 'AI response schema invalid' }`
- On `GatewayExhaustedError` → `503 { error: 'AI service unavailable', retryable: true }`
- On success: creates `sessions` row (`user_id`, `jd_text`, `resume_text`, `slider_value`, `status = 'in_progress'`, `jd_role_title`); returns `{ questions, openingGreeting, closingNote, sessionId }`
- Client caches response to `sessionStorage` key `mira_session_{sessionId}` on receipt
- Client calls `store.setGeneratedContent(questions, openingGreeting, closingNote)` and `store.setSessionPhase('mic-permission')`

**Test cases:**
- Valid request → `200`; `questions.length` between 8 and 12; `openingGreeting` contains `userName`; `closingNote` contains `roleTitle`
- Missing `resumeText` → `400` with `fields: ['resumeText']`
- Missing `jdText` and `sliderValue` → `400` with `fields: ['jdText', 'sliderValue']`
- No session → `401`
- `GatewayExhaustedError` → `503 { retryable: true }`
- Malformed JSON from gateway (not matching schema) → retried up to 2 times; 3rd failure → `422`
- `slider_value = 5` stored in `sessions` row
- `sessionStorage` key `mira_session_{sessionId}` set after success

**Property-based tests:**
- **Property:** For any `sliderValue` integer between 1 and 10, `technicalCount / totalCount` always satisfies `|technicalCount / totalCount - expectedTechnicalRatio| ≤ 0.15` — within 15% of configured ratio

---

---

## Sprint 3 — Apr 5 to Apr 11
### Live Session: Pre-Session Flow, TTS, Speech Recognition, Follow-Ups, Summarization, Eval

**Sprint goal:** The complete session experience works end-to-end from countdown to auto-end.

**Sprint MVP:** A user can go from setup completion through witty phrases, mic permission, countdown, full spoken session with follow-ups and consecutive cap enforced, all the way to session auto-end. The eval system fires async. Admin can view eval results.

**Parallel safety map:**

| Issue | Files owned exclusively |
|---|---|
| S3-01 | `components/session/WittyPhrasesScreen.tsx`, `components/session/MicPermissionScreen.tsx`, `utils/constants.ts` |
| S3-02 | `components/session/CountdownScreen.tsx` |
| S3-03 | `components/session/SessionShell.tsx`, `components/session/SessionHeader.tsx`, `components/session/ChatBubble.tsx`, `components/session/EndEarlyModal.tsx` |
| S3-04 | `lib/speech/ttsWrapper.ts`, `hooks/useTTS.ts` |
| S3-05 | `lib/speech/speechRecognition.ts`, `lib/speech/silenceDetector.ts`, `lib/speech/browserSupport.ts`, `hooks/useSpeechRecognition.ts`, `components/session/MicButton.tsx` |
| S3-06 | `components/session/TextFallbackInput.tsx` |
| S3-07 | `app/api/generate-followup/`, `schemas/followUpSchema.ts` |
| S3-08 | `app/api/summarize-context/`, `lib/scoring/tokenCounter.ts`, `schemas/summarySchema.ts` |
| S3-09 | `lib/eval/runEval.ts`, `lib/eval/evalSchema.ts`, `app/api/judge/`, `schemas/evalSchema.ts` |
| S3-10 | `app/(admin)/admin/evals/`, `app/(admin)/admin/logs/`, `app/api/admin/evals/`, `app/api/admin/logs/` |

---

### S3-01 · `feat`
**`feat: build witty phrases loading screen and microphone permission request screen`**

Implement session states 1 (`loading`) and 2 (`mic-permission`).

**Functional acceptance criteria:**
- **State `loading`**: full-screen dark background; one witty phrase centered; 8+ phrases hardcoded in `utils/constants.ts` as `WITTY_PHRASES`; rotate every 2.5s with Framer Motion cross-fade (`opacity: 1→0` then `0→1`); no spinner; stays until `sessionPhase` becomes `'mic-permission'`
- **State `mic-permission`**: full-screen; lucide-react `Mic` icon (64px); "MIRA needs microphone access to capture your spoken answers."; "Allow Microphone" primary button; "Continue with Text Input" text link below
- "Allow Microphone": calls `navigator.mediaDevices.getUserMedia({ audio: true })`; on grant → `micPermissionGranted = true`, `sessionPhase = 'countdown'`
- "Allow Microphone": on browser denial → inline message "Microphone access was denied. You can still continue with text input."; "Continue with Text Input" highlighted
- "Continue with Text Input" → `micPermissionGranted = false`, `sessionPhase = 'countdown'`
- Browser without `getUserMedia` → "Allow Microphone" button replaced with disabled "Microphone not supported"; only "Continue with Text Input" actionable
- ARIA live region (`aria-live="polite"`): announces "Loading your interview..." during `loading`; "Microphone access required" during `mic-permission`
- Framer Motion fade+slide transition between states

**Test cases:**
- Render `loading` state → witty phrase text visible; no spinner element in DOM
- After 2.5s → phrase text changes
- `sessionPhase` changes to `'mic-permission'` → mic permission screen renders; loading screen unmounts
- Mock `getUserMedia` resolves → `micPermissionGranted = true`; `sessionPhase = 'countdown'`
- Mock `getUserMedia` rejects → inline denial message shown
- Click "Continue with Text Input" → `micPermissionGranted = false`; `sessionPhase = 'countdown'`
- `navigator.mediaDevices = undefined` → "Allow Microphone" button disabled; text input link actionable
- ARIA live region text is "Loading your interview..." in loading state

**Property-based tests:**
- **Property:** `WITTY_PHRASES.length >= 8` — any reduction below 8 is a test failure

---

### S3-02 · `feat`
**`feat: build 5-second animated countdown screen before session begins`**

Implement session state 3 (`countdown`).

**Functional acceptance criteria:**
- Full-screen dark background; large centered digit counting 5→4→3→2→1; "Get ready…" label fixed beneath (does not animate between digit changes)
- Each digit: Framer Motion `scale: 1.2→1.0`, `opacity: 0→1`, 400ms ease-out
- Advances via `setInterval` every 1000ms; no user interaction required or possible
- When count reaches 0: interval cleared; `sessionPhase = 'active'`; `elapsedSeconds` begins incrementing
- `micPermissionGranted = false` in Zustand: countdown completes identically; text fallback activated in session
- Cannot be skipped, paused, or restarted

**Test cases (using `vi.useFakeTimers()`):**
- Render → digit shows "5"
- Advance 1000ms → digit shows "4"
- Advance 5000ms total → `sessionPhase = 'active'`
- After transition to `'active'`: `setInterval` cleared (no further state changes)
- `elapsedSeconds` begins incrementing when phase becomes `'active'`

**Property-based tests:**
- **Property:** Regardless of how many times the countdown component mounts and unmounts, after exactly 5000ms of fake timer time, `sessionPhase` is always `'active'` — never stuck on `'countdown'` due to interval leak

---

### S3-03 · `feat`
**`feat: build full-screen session chat interface with header, bubbles, and end-early modal`**

Implement the full-screen chat UI shell for session state 4 (`active`).

**Functional acceptance criteria:**
- Full-screen layout; no top navigation bar; no scrollbars except the chat area
- Persistent header: MIRA logo left; session timer (MM:SS from `elapsedSeconds`) right; "End Interview Early" button with `LogOut` icon far right — NO question counter displayed
- Chat area: scrollable; fills remaining height; new bubbles auto-scroll to bottom; `overflow-y: auto`
- Interviewer bubble: left-aligned; `Bot` icon avatar; dark `Card`; text appears word-by-word
- Candidate bubble: right-aligned; user initials `Avatar`; lighter `Card`; full committed answer displayed
- Bubble mount animation: Framer Motion `scale: 0.95→1.0`, `opacity: 0→1`, 250ms ease-out
- `SessionShell.tsx`: reads `sessionPhase` from Zustand; renders correct screen component for each phase
- "End Interview Early" → `Dialog`: "Are you sure? Your performance report will be generated from the answers you've provided so far." — "Continue Interview" (closes dialog) and "End Interview" (saves `sessions.status = 'abandoned'`, `completed_at = now()`; `sessionPhase = 'rating'`)
- `beforeunload` event listener added on mount; fires native browser dialog on tab close during active session; removed on unmount
- Internal navigation during active session → custom `Dialog` warning modal
- Fully responsive; header compresses on mobile without truncation

**Test cases:**
- `SessionShell` with `sessionPhase = 'loading'` → renders `WittyPhrasesScreen`
- `SessionShell` with `sessionPhase = 'active'` → renders chat interface
- Add new AI bubble → chat scrolls to bottom
- Click "End Interview Early" → confirmation dialog renders
- Confirm "End Interview" → `sessionPhase = 'rating'`; Supabase update called with `status = 'abandoned'`
- Click "Continue Interview" → dialog closes; session unchanged
- Unmount → `beforeunload` listener removed

**Property-based tests:**
- **Property:** Regardless of how many bubbles added to `conversationHistory`, rendered bubble count always equals `conversationHistory.length` — no duplicates, no missing bubbles

---

### S3-04 · `feat`
**`feat: implement SpeechSynthesis TTS wrapper with word-by-word chat rendering`**

Implement `lib/speech/ttsWrapper.ts` and `hooks/useTTS.ts`.

**Functional acceptance criteria:**
- `ttsWrapper.ts` exports: `speak(text, onWord, onComplete): void` and `cancel(): void`
- `speak`: creates `SpeechSynthesisUtterance`; fires `onWord` on `onboundary` event at each word boundary; fires `onComplete` on `utterance.onend`; sets `isSpeaking = true` on start, `false` on end
- `cancel`: calls `window.speechSynthesis.cancel()`; sets `isSpeaking = false`
- No TTS support (`!window.speechSynthesis`): `speak()` splits text by spaces; fires `onWord` for each word synchronously; fires `onComplete` after last word
- `useTTS.ts` hook: calls `speak(text, onWord, onComplete)`; `onWord` appends word to active interviewer bubble via Zustand; `onComplete` sets `isSpeaking = false` and enables mic button
- Mic button disabled and visually grey while `isSpeaking = true`; enabled only after `onComplete`

**Test cases:**
- `speak('Hello world test', onWord, onComplete)` with mocked utterance → `onWord` called 3 times with 'Hello', 'world', 'test'; `onComplete` called once after
- `cancel()` → `window.speechSynthesis.cancel` called; `isSpeaking = false`
- No TTS support (`window.speechSynthesis = undefined`) → `speak('Hello world')` fires `onWord` twice, `onComplete` once synchronously
- `isSpeaking = true` during speak; `isSpeaking = false` after `onComplete`
- Mic button has `disabled` attribute while `isSpeaking = true`

**Property-based tests:**
- **Property:** For any string with `n` whitespace-delimited words, `onWord` is called exactly `n` times — never more, never fewer, regardless of punctuation

---

### S3-05 · `feat`
**`feat: implement Web Speech API recognition wrapper with silence detection and mic button states`**

Implement `lib/speech/speechRecognition.ts`, `lib/speech/silenceDetector.ts`, `lib/speech/browserSupport.ts`, and `hooks/useSpeechRecognition.ts`.

**Functional acceptance criteria:**
- `browserSupport.ts` exports `hasSpeechRecognition(): boolean`: returns `true` if `window.SpeechRecognition || window.webkitSpeechRecognition` exists
- `SpeechRecognitionWrapper` class: `start()`, `stop()`, `onInterimResult(cb)`, `onFinalResult(cb)`, `onError(cb)`; wraps `SpeechRecognition`; `continuous = true`, `interimResults = true`, `lang = 'en-US'`
- `SilenceDetector` class (pure): `feed(timestamp: number)` and `onSilence(cb)`: fires `cb` when no `feed` call for ≥ 2000ms; resets timer on each `feed`
- `useSpeechRecognition.ts`: starts recognition after `isSpeaking = false` AND `micPermissionGranted = true`; appends each interim word to `liveTranscript`; calls `silenceDetector.feed()` on each interim result; on `onSilence`: calls `addAnswer(liveTranscript)`, clears `liveTranscript`, triggers follow-up evaluation; if `micPermissionGranted = false`: returns immediately without starting
- `MicButton.tsx`: idle = grey icon, no animation; listening (`isListening = true`) = red icon, Framer Motion pulse keyframes on scale (0.95→1.05→0.95, 1.2s loop); processing = spinner overlay

**Test cases:**
- `hasSpeechRecognition()` with `window.SpeechRecognition = MockClass` → `true`
- `hasSpeechRecognition()` with both APIs `undefined` → `false`
- `SilenceDetector`: `feed` at t=0, `feed` at t=1500ms, silence until t=3600ms → `onSilence` fires once (at 3500ms)
- `SilenceDetector`: `feed` at t=0, t=1000ms, t=1900ms → `onSilence` fires at t=3900ms
- `useSpeechRecognition` with `micPermissionGranted = false` → `start()` never called
- Interim results 'hello', 'world' → `liveTranscript = 'hello world'` in store
- Silence detected → `addAnswer('hello world')` called; `liveTranscript` cleared

**Property-based tests:**
- **Property:** For any sequence of `feed(timestamp)` calls where consecutive timestamps always differ by < 2000ms, `onSilence` is never fired — fires if and only if the gap between any two consecutive calls is ≥ 2000ms
- **Property:** For any array of `n` interim result strings, `liveTranscript` always equals those strings joined with a single space — never double-spaced, never leading/trailing space

---

### S3-06 · `feat`
**`feat: build text input fallback for session when speech is unavailable or denied`**

Implement `components/session/TextFallbackInput.tsx`.

**Functional acceptance criteria:**
- Renders in place of `MicButton` when `micPermissionGranted = false` OR `hasSpeechRecognition() = false`
- Amber informational banner: "Speech input is not available. Type your answer below."
- Single-line `Input`; "Submit Answer" button; Enter key submits
- Submitting calls `addAnswer(inputValue.trim())`; triggers follow-up evaluation (identical flow to voice)
- Disabled while `isSpeaking = true`
- Input value cleared after submission; auto-focuses
- Empty input → "Submit Answer" disabled; Enter suppressed

**Test cases:**
- Render with `micPermissionGranted = false` → `TextFallbackInput` visible; `MicButton` absent
- Render with `micPermissionGranted = true` and `hasSpeechRecognition() = true` → `TextFallbackInput` absent
- `isSpeaking = true` → input `disabled` attribute present
- `isSpeaking = false` → input enabled
- Submit empty string → `addAnswer` not called; button disabled
- Type "My answer" → click Submit → `addAnswer('My answer')` called; input cleared
- Type "My answer" → press Enter → same result as Submit

**Property-based tests:**
- **Property:** For any input string, `addAnswer` is always called with `value.trim()` — never with leading or trailing whitespace

---

### S3-07 · `feat`
**`feat: implement follow-up evaluation API route with consecutive cap enforcement and session end condition`**

Implement `POST /api/generate-followup` and session controller follow-up injection and end logic.

**Functional acceptance criteria:**
- Accepts `{ contextPayload: { conversationSummary, lastQuestion, lastAnswer }, consecutiveFollowUpCount: number }`
- Returns `401` for unauthenticated callers
- If `consecutiveFollowUpCount >= 2`: immediately returns `{ followUpNeeded: false }` — no gateway call; cap enforced server-side
- Calls `gatewayCall('follow-up', prompt)` with the context payload
- Prompt from `FOLLOW_UP_PROMPT`: evaluate two triggers — (1) answer is weak/vague/short; (2) answer contains something specific worth exploring
- Response Zod-validated against `schemas/followUpSchema.ts`: `{ followUpNeeded: boolean, followUpQuestion?: string }`
- `followUpNeeded: true` AND count < 2: client calls `store.injectFollowUp(question)` then `store.incrementConsecutiveFollowUp()`
- `followUpNeeded: false`: client calls `store.resetConsecutiveFollowUp()` then `store.advanceToNextQuestion()`
- Session auto-end: after each advance, if `currentQuestionIndex >= questions.length` AND `consecutiveFollowUpCount === 0` → `sessionPhase = 'rating'`; saves `sessions.completed_at`, `duration_secs`, `status = 'completed'`
- Follow-up questions delivered identically to pre-generated — no label, no visual distinction

**Test cases:**
- count=0, model returns `true` → `{ followUpNeeded: true, followUpQuestion: '...' }` returned; count becomes 1
- count=1, model returns `true` → follow-up injected; count becomes 2
- count=2 → returns `{ followUpNeeded: false }` immediately; gateway not called
- `followUpNeeded: false` → `advanceToNextQuestion()` called; `consecutiveFollowUpCount = 0`
- Last pre-generated question answered, `followUpNeeded: false` → after advance: `sessionPhase = 'rating'`; Supabase update called
- Last question answered, `followUpNeeded: true`, count=0 → follow-up injected; session does NOT end
- No session → `401`

**Property-based tests:**
- **Property:** For any `consecutiveFollowUpCount >= 2` passed to the route, the gateway is never called — `followUpNeeded` is always `false` regardless of model behaviour

---

### S3-08 · `feat`
**`feat: implement rolling context summarization with token estimation and 12,000-token threshold trigger`**

Implement `lib/scoring/tokenCounter.ts` and `POST /api/summarize-context`.

**Functional acceptance criteria:**
- `lib/scoring/tokenCounter.ts` exports `estimateTokens(text: string): number`: returns `Math.ceil(text.length / 4)`; pure function
- `updateContextPayload()` action in store calls `estimateTokens` on full conversation history string before each API call
- Estimated tokens < 12,000: full history sent as context; no summarization call
- Estimated tokens ≥ 12,000: client calls `POST /api/summarize-context` with all Q&A pairs except the most recent
- `POST /api/summarize-context` accepts `{ history: Array<{ question, answer }> }` (all except latest)
- Returns `401` for unauthenticated callers
- Calls `gatewayCall('summarize-context', prompt)` with `SUMMARIZE_CONTEXT_PROMPT`
- Response Zod-validated: `{ summary: string }`
- `summary` replaces all prior Q&A pairs; stored as `conversationSummary = '[CONVERSATION SUMMARY]: {summary}'` in context payload; most recent Q&A preserved verbatim
- After summarization: new pairs accumulate; on next threshold hit, existing summary + new pairs (except latest) are re-summarized
- At least 2 Q&A pairs required before calling (client validates)

**Test cases:**
- `estimateTokens('')` → `0`
- `estimateTokens('four')` → `1`
- `estimateTokens('hello world')` → `3`
- `estimateTokens('a'.repeat(48000))` → `12000` (exact threshold)
- `estimateTokens('a'.repeat(48001))` → `12001` (triggers summarization)
- History < 12,000 tokens → `POST /api/summarize-context` not called
- History ≥ 12,000 tokens → route called with all pairs except latest
- Response `{ summary: 'condensed...' }` → `contextPayload.conversationSummary = '[CONVERSATION SUMMARY]: condensed...'`

**Property-based tests:**
- **Property:** For any non-empty string `s`, `estimateTokens(s) > 0`
- **Property:** For any string `s` of length `n`, `estimateTokens(s) === Math.ceil(n / 4)` — never deviates regardless of string content
- **Property:** For any conversation history of `k` pairs where total estimated tokens ≥ 12,000, the array sent to the route always has length `k - 1` — most recent pair always excluded

---

### S3-09 · `feat`
**`feat: implement LLM-as-judge eval system with async execution and anonymised eval_results persistence`**

Implement `lib/eval/runEval.ts`, `POST /api/judge`, and `eval_results` DB writes.

**Functional acceptance criteria:**
- `runEval(params): void` — synchronous wrapper; fire-and-forget; caller never awaits
- Params: `{ sessionId, questions, transcript, reportJson, sliderValue, openingGreeting, closingNote }`
- `runEval` calls `POST /api/judge`; catches and swallows all errors (logs via `console.error`; Sentry captures automatically); never propagates to caller
- `POST /api/judge` returns `401` for unauthenticated callers
- Calls `gatewayCall('judge', prompt)` with `JUDGE_PROMPT` template
- Prompt includes all session data; explicitly instructs judge to not include user-identifying information in response
- Response Zod-validated: `{ questionQuality: { score, rationale }, calibration: { score, rationale }, followupAppropriateness: { score, rationale }, reportAccuracy: { score, rationale }, tone: { score, rationale } }` — all scores 1–5
- `overall_eval_score = ((q + c + f + r + t) / 5)` rounded to 2 decimal places
- Writes to `eval_results`: all 5 dimension scores, rationale strings, `overall_eval_score`, `provider_used`, `session_id` — NO `user_id` field

**Test cases:**
- `runEval(params)` called → caller returns immediately; no thrown error propagates
- Mock `POST /api/judge` returns valid JSON → `eval_results` row inserted; row has no `user_id` field
- `overall_eval_score` for [3,4,5,2,4] → `3.60`
- `overall_eval_score` for [1,1,1,1,1] → `1.00`
- `overall_eval_score` for [5,5,5,5,5] → `5.00`
- Mock `POST /api/judge` throws network error → `runEval` does not propagate; caller unaffected
- `POST /api/judge` with no session → `401`
- Dimension score of 6 → Zod parse error; eval not written; error caught silently

**Property-based tests:**
- **Property:** For any 5 dimension scores each being an integer 1–5, `overall_eval_score = (sum / 5)` rounded to 2 decimal places — always between 1.00 and 5.00 inclusive
- **Property:** For any eval result row inserted to `eval_results`, the row object never contains a key named `user_id`

---

### S3-10 · `feat`
**`feat: build admin eval metrics page and call logs page with filtering and pagination`**

Implement `/admin/evals`, `/admin/logs`, `GET /api/admin/evals`, `GET /api/admin/logs`.

**Functional acceptance criteria:**
- `/admin/evals`: fetches from `GET /api/admin/evals`; 5 Recharts `LineChart` components (one per dimension) + 1 overall trend chart; "Total sessions evaluated" stat tile; table of 20 most recent eval results (date, overall score, 5 dimension scores); date range filter ("Last 7 days", "Last 30 days", "All time")
- `/admin/logs`: fetches from `GET /api/admin/logs`; paginated table 20/page; columns: timestamp, call type, provider name, key reference ("Key #N"), latency ms, estimated tokens, HTTP status; status `Badge`: green=2xx, amber=4xx, red=5xx; filter by call type and provider
- `GET /api/admin/evals` returns `403` for non-admin
- `GET /api/admin/logs?page=1&callType=&provider=` returns `403` for non-admin
- `GET /api/admin/logs` response: `{ data: CallLog[], total: number, page: number, pageCount: number }`
- Loading skeletons and empty states on both pages

**Test cases:**
- `GET /api/admin/evals` as non-admin → `403`
- `GET /api/admin/logs` as non-admin → `403`
- `GET /api/admin/logs?page=2` with 45 total rows → rows 21–40; `pageCount = 3`
- `GET /api/admin/logs?callType=follow-up` → only rows with `call_type = 'follow-up'`
- Render `/admin/evals` with 0 results → empty state; charts not rendered
- Render `/admin/evals` with 10 results → 6 line charts rendered (5 dimensions + overall)
- Select "Last 7 days" → API called with `after` param set 7 days ago
- HTTP status 429 in logs table → `Badge` shows amber colour

**Property-based tests:**
- **Property:** `GET /api/admin/logs` for any `page`: rows returned always equals `min(20, total - (page-1) * 20)` — never more than 20, never negative

---

---

## Sprint 4 — Apr 12 to Apr 17
### Post-Session Flow, Reports, Dashboard, PDF, Monitoring, Full Test Suite

**Sprint goal:** The application is complete, production-grade, and fully tested.

**Sprint MVP:** A user completes a full session → rating → closing note → report → PDF download → `/reports` listing → dashboard with trend chart. Admin can view eval metrics and call logs. Production URL is live and monitored by Sentry and Better Stack. Coverage ≥ 80%. Mutation score ≥ 70%.

**Parallel safety map:**

| Issue | Files owned exclusively |
|---|---|
| S4-01 | `components/session/RatingScreen.tsx`, `components/session/ClosingNoteScreen.tsx`, `app/api/session-feedback/` |
| S4-02 | `app/api/generate-report/`, `schemas/reportSchema.ts`, `lib/supabase/reports.ts`, `lib/supabase/transcripts.ts` |
| S4-03 | `components/session/ReportWaitScreen.tsx`, `components/session/CompletionScreen.tsx` |
| S4-04 | `app/(app)/reports/[sessionId]/`, `components/report/` |
| S4-05 | `lib/pdf/generateReport.ts` |
| S4-06 | `app/(app)/reports/page.tsx`, `components/reports/ReportListItem.tsx`, `components/reports/ReportsEmptyState.tsx` |
| S4-07 | `app/(app)/dashboard/`, `components/dashboard/` |
| S4-08 | Better Stack config, Sentry alert rules (no code changes) |
| S4-09 | `e2e/` (all spec files and fixtures) |
| S4-10 | Unit test gap-fills in `lib/`, `store/`, `app/api/` (no production source file changes) |
| S4-11 | Stryker run (no source file changes); accessibility spec additions to `e2e/` |
| S4-12 | No code changes; smoke test only |

---

### S4-01 · `feat`
**`feat: build rating screen and AI closing note screen for post-session flow`**

Implement session states 5 (`rating`) and 6 (`closing`).

**Functional acceptance criteria:**
- **State `rating`**: full-screen centered card; heading "How was your interview experience?"; 5 star icons as ShadCN `RadioGroup` (`role="radiogroup"`; each star `role="radio"`, `aria-label="N star"`); keyboard-navigable (Tab + arrow keys + Enter/Space)
- Hover: hovered star + all stars to its left fill; Framer Motion `scale: 1.0→1.1`, 150ms
- Selection: stars 1 through selected animate left-to-right (50ms stagger, `scale: 0.9→1.1→1.0`)
- Optional `Textarea`: `placeholder="What could we do better? (optional)"`, max 500 chars, live counter
- "Submit & Continue" `Button`: disabled until a star is selected; enabled regardless of feedback text
- On submit: `POST /api/session-feedback` with `{ session_id, star_rating, feedback_text }`; sets `sessionPhase = 'closing'`; simultaneously fires `POST /api/generate-report` (not awaited)
- Entering `rating` state: delete `sessionStorage` key `mira_session_{sessionId}`
- **State `closing`**: full-screen centered card; `closingNote` from Zustand delivered via TTS word-by-word and rendered simultaneously; after TTS `onComplete` → `sessionPhase = 'report-wait'`
- ARIA live region (`aria-live="assertive"`) announces closing note text as it renders

**Test cases:**
- Render → 5 star icons; "Submit & Continue" disabled
- Click star 3 → stars 1–3 filled; "Submit & Continue" enabled
- Submit with star 4, empty feedback → `POST /api/session-feedback` called with `{ star_rating: 4, feedback_text: '' }`; `sessionPhase = 'closing'`
- Submit → `POST /api/generate-report` fired concurrently (not awaited)
- Enter `rating` state → `sessionStorage` key deleted
- Type 500 chars in textarea → counter "500 / 500"; 501st char rejected
- Render `closing` state → closing note text delivered word-by-word; after TTS → `sessionPhase = 'report-wait'`
- `RadioGroup` has `role="radiogroup"`; each star has `aria-label`

**Property-based tests:**
- **Property:** For any star rating `n` where `1 ≤ n ≤ 5`, exactly `n` star icons have the filled visual state — never `n-1`, never `n+1`
- **Property:** For any `feedback_text` string of length > 500, `feedbackText` in Zustand is always clamped to 500 characters

---

### S4-02 · `feat`
**`feat: implement report generation API route with Supabase persistence and async eval trigger`**

Implement `POST /api/generate-report`.

**Functional acceptance criteria:**
- Accepts `{ sessionId: string, transcript: ConversationTurn[], jdText: string, sliderValue: number }`
- Returns `401` for unauthenticated callers; `400` if any field absent; `403` if `sessionId` belongs to different user
- Calls `gatewayCall('report', prompt)` with `REPORT_PROMPT`
- Prompt: evaluate every question (pre-generated and follow-up alike) as a standalone scored item; no differentiation
- Response Zod-validated against `schemas/reportSchema.ts`: `{ answers: Array<{ questionId, numericScore: 1–5, qualitativeLabel: 'Excellent'|'Good'|'Needs Work'|'Poor', dimensionScores: { relevance, starUsage, clarity, roleAlignment, delivery, improvementSpecificity }, feedbackText }>, overallScore: 1–5, topStrengths: [3 strings], topImprovementAreas: [3 strings], roleAlignmentSummary: string }`
- On success: inserts `reports` row; updates `sessions.overall_score`, `sessions.status = 'completed'`, `sessions.completed_at`; inserts all `transcripts` rows ordered by `turn_index` (0-based)
- Fires `runEval(...)` fire-and-forget after saving
- Returns `{ report, sessionId }`
- On gateway failure after retries: returns `503`; transcript still saved; `sessions.status = 'report_failed'`

**Test cases:**
- Valid 10-question transcript → `200`; `answers.length === 10`; `overallScore` between 1–5
- `overallScore` > 5 from model → Zod rejects; route retries
- Missing `sessionId` → `400`
- Different user's `sessionId` → `403`
- No session → `401`
- `transcripts` table has exactly `transcript.length` rows after success, ordered by `turn_index` 0 to n-1
- `sessions.status = 'completed'` after success
- `sessions.status = 'report_failed'` after gateway exhaustion
- `runEval` invoked after successful save (mock verifies call)

**Property-based tests:**
- **Property:** For any transcript of length `n`, `transcripts` table always has exactly `n` rows for that session after success
- **Property:** For any valid report, `overallScore` is always the arithmetic mean of all `answers[i].numericScore` values rounded to 2 decimal places

---

### S4-03 · `feat`
**`feat: build report wait screen and session completion screen`**

Implement session states 7a (`report-wait`) and 7b (`complete`).

**Functional acceptance criteria:**
- **State `report-wait`**: full-screen centered; "Analysing your performance…"; 3-dot Framer Motion animation (staggered `opacity: 0.3→1.0→0.3` on 900ms loop, 200ms stagger); no countdown; persists until `POST /api/generate-report` resolves or rejects
- If report already resolved before entering `report-wait`: transitions to `complete` immediately
- **State `complete`**: full-screen centered card; "Your report is ready"; two `Button` components: "Go to Dashboard" (`outline`, navigates to `/dashboard`) and "View Report" (`default`, navigates to `/reports/{sessionId}`); no auto-advance
- `POST /api/generate-report` rejects with `503`: "View Report" replaced with "Retry Report Generation"; "Go to Dashboard" remains; retry re-calls `POST /api/generate-report` with same params; spinner during retry; on second failure → "Unable to generate report. Please try again later."

**Test cases:**
- Enter `report-wait` → loading dots visible; no navigation buttons
- Mock resolves after 3s → `complete` state; "View Report" button visible
- Mock already resolved before entering `report-wait` → `complete` shown immediately
- Mock rejects 503 → "Retry Report Generation" shown; "Go to Dashboard" visible
- Click "View Report" → navigates to `/reports/{sessionId}`
- Click "Go to Dashboard" → navigates to `/dashboard`
- Click "Retry Report Generation" → spinner on button; on mock success → "View Report" shown

**Property-based tests:** N/A — screen state machine; covered by test cases.

---

### S4-04 · `feat`
**`feat: build report detail page with per-question accordion, full transcript, and PDF download`**

Implement `/reports/[sessionId]`.

**Functional acceptance criteria:**
- Hot path (from completion screen): loads from Zustand; no Supabase call
- Cold path (direct URL or from `/reports` listing): `SELECT * FROM reports WHERE session_id = $1` (RLS); if RLS blocks → redirect to `/dashboard` with error toast "You don't have access to this report"
- Top score card: large `overallScore`, qualitative label `Badge` (green=Excellent, blue=Good, amber=Needs Work, red=Poor), metadata row (date, duration as "24 min", ratio badge "60T / 40B", role title)
- Role alignment summary paragraph
- Two-column grid `grid-cols-1 md:grid-cols-2`: "Top Strengths" (3 green chips) and "Areas to Improve" (3 amber chips)
- Per-question `Accordion`: all `AccordionItem` collapsed by default; trigger shows truncated question (80 chars) + numeric score; content shows full question, candidate answer, qualitative label `Badge`, 6 dimension score rows, 2–4 sentence feedback
- No text "Follow-up" appears anywhere on the page in any element
- Staggered mount: Framer Motion, `delay = index * 0.05`
- Full transcript `Accordion` at bottom: all turns in order; `[Interviewer]: {text}` or `[Candidate]: {text}`; no turn labelled follow-up
- "Download PDF" `Button` sticky at top-right; calls `generateReport(sessionId, report, transcript)`

**Test cases:**
- Cold load with own `sessionId` → report data rendered
- Cold load with other user's `sessionId` → redirect to `/dashboard`; error toast shown
- Hot load → renders without Supabase call
- All `AccordionItem` collapsed by default
- Click first item → content expands; shows question, answer, 6 dimension scores
- String "Follow-up" not present anywhere in rendered DOM
- 10 answers → 10 `AccordionItem` elements
- Click "Download PDF" → `generateReport` called

**Property-based tests:**
- **Property:** For any report with `n` answer items, rendered `AccordionItem` count is always exactly `n`

---

### S4-05 · `feat`
**`feat: implement client-side PDF report generator with cover page, transcript, and per-question analysis`**

Implement `lib/pdf/generateReport.ts` using jsPDF.

**Functional acceptance criteria:**
- `generateReport(sessionId: string, report: PerformanceReport, transcript: ConversationTurn[]): void`
- Client-side; triggers browser download; no server call
- **Cover page**: "MIRA Performance Report" heading; session date as "March 15, 2026"; JD role title; ratio (e.g. "60% Technical / 40% Behavioral"); `Overall Score: 3.8 / 5.0 — Good`
- **Transcript section**: heading "Full Interview Transcript"; each turn: `Interviewer: {text}` or `Candidate: {text}`; sequential order; 6pt line spacing between turns
- **Analysis section**: heading "Performance Analysis"; per-question blocks separated by thin rule; each block: question text (bold), candidate answer, score label, 6 dimension score rows, feedback paragraph
- No text "Follow-up" appears anywhere in the PDF
- Filename: `MIRA_Report_{YYYY-MM-DD}.pdf` (date from `sessions.created_at`)
- Completes in < 5 seconds for a 12-question session

**Test cases:**
- `generateReport(...)` → jsPDF `save()` called with filename matching `MIRA_Report_\d{4}-\d{2}-\d{2}\.pdf`
- Cover page: document text includes "MIRA Performance Report" and the `overallScore`
- Transcript section: count of "Interviewer:" occurrences equals AI turn count in `transcript`
- Analysis section: number of question blocks equals `report.answers.length`
- String "Follow-up" never present in any document text
- Filename date matches `YYYY-MM-DD` format derived from `sessions.created_at`

**Property-based tests:**
- **Property:** For any transcript of `n` turns, PDF transcript section always has exactly `n` turn lines — no turn omitted or duplicated

---

### S4-06 · `feat`
**`feat: build reports listing page with pagination, staggered animation, and empty state`**

Implement `/reports` (the "My Reports" page).

**Functional acceptance criteria:**
- Fetches completed sessions + reports for authenticated user from Supabase, ordered by `created_at` DESC; joins `session_feedback` for star rating
- Each `Card`: session date, JD role title (truncated 60 chars), ratio badge, overall numeric score, qualitative label `Badge`, star rating as `n` filled star icons
- "View Report" → navigates to `/reports/{sessionId}`
- "Download PDF" → fetches full report and transcript from Supabase; calls `generateReport(...)`
- Pagination: 10/page; prev/next `Button` components; "Page 2 of 5" indicator
- Loading skeleton: 3 placeholder `Card` with `Skeleton` blocks
- Empty state: "No reports yet. Complete your first interview to see results here." + "Start New Interview" → `/setup`
- Staggered Framer Motion fade-in (30ms delay per card)
- Responsive: single-column mobile, `grid-cols-2` on `md+`

**Test cases:**
- 0 reports → empty state; "Start New Interview" links to `/setup`
- 10 reports → 10 cards; "Page 1 of 1"
- 15 reports → 10 cards; "Page 1 of 2"; "Next" enabled
- Click "Next" → 5 remaining reports; "Prev" enabled
- Click "View Report" → navigates to `/reports/{sessionId}`
- RLS: only own reports appear

**Property-based tests:**
- **Property:** For any total count `n`, number of pages always equals `Math.ceil(n / 10)` — never under-counts or over-counts

---

### S4-07 · `feat`
**`feat: build user dashboard with session history cards, score trend chart, and empty state`**

Implement `/dashboard`.

**Functional acceptance criteria:**
- "Start New Interview" `Button` at top → `/setup`
- Recharts `LineChart` score trend: hidden when user has < 2 completed sessions; shows "Complete 2 or more sessions to track your progress" placeholder; when 2+ sessions: x-axis = session dates as "Mar 15", y-axis = score (domain 1–5); line animates on mount
- Session history: fetches `status = 'completed'` sessions, ordered DESC, 10/page
- Each `Card`: date, role title (60 chars truncated), ratio badge, overall score, qualitative label `Badge`, "View Report" → `/reports/{sessionId}`
- Pagination: prev/next; page indicator
- Loading skeleton: 3 card skeletons + chart area skeleton
- Empty state: "Your first interview is waiting." + "Start New Interview"
- Responsive: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`
- RLS: only authenticated user's own sessions

**Test cases:**
- 0 sessions → empty state; chart hidden
- 1 session → card shown; chart hidden; placeholder text visible
- 2 sessions → card + chart with 2 data points
- 12 sessions → 10 cards on page 1; "Page 1 of 2"
- Click "View Report" → `/reports/{sessionId}`
- Different user's session not shown (RLS)

**Property-based tests:**
- **Property:** Chart is shown if and only if `sessionCount >= 2` — never shown for `n < 2`, always shown for `n >= 2`

---

### S4-08 · `chore`
**`chore: configure Better Stack uptime monitoring, finalise Sentry alert rules, and update monitoring documentation`**

**Functional acceptance criteria:**
- Better Stack account created; HTTP check monitor pointing at production URL; 1-minute interval; alert on 2 consecutive failures → email both team members
- Better Stack public status page URL publicly accessible
- Sentry alert rules active: new issue first seen → email; regression → email; volume > 10/hour → email
- Vercel Analytics confirmed enabled on production project
- README updated with all monitoring links: Sentry dashboard, Better Stack status page, Vercel Analytics, rollback procedure

**Test cases:**
- Manually trigger Sentry error from production → appears in dashboard within 60 seconds
- Vercel Analytics dashboard shows at least one page view
- Better Stack shows green uptime for production URL
- README monitoring section contains all three tool links

**Property-based tests:** N/A — monitoring configuration.

---

### S4-09 · `test`
**`test: write comprehensive Playwright E2E test suite covering all user, admin, and gateway flows`**

Write the complete E2E test suite.

**`auth.spec.ts`:**
- Email signup → redirect to `/dashboard`; `profiles` row created
- Signup with registered email → inline error; no redirect
- Login with valid credentials → redirect to `/dashboard`
- Login with wrong password → inline error; no redirect
- Google OAuth stub → mock callback → redirect to `/dashboard`
- Logout → redirect to `/login`; subsequent `/dashboard` access redirects to `/login`

**`middleware.spec.ts`:**
- Unauthenticated `/dashboard` → redirect to `/login?returnTo=%2Fdashboard`
- Authenticated `/login` → redirect to `/dashboard`
- Non-admin `/admin/users` → 403 page
- Admin `/admin/users` → page renders
- Suspended user `/dashboard` → redirect to `/login?suspended=true`
- Unauthenticated `GET /api/generate-questions` → `{ error: 'Unauthorized' }`, status 401

**`setup.spec.ts`:**
- Select saved resume → enter JD → slider 7 → confirm → witty phrases shown
- "Upload New" tab: upload PDF → extracted text shown → proceed
- "Paste Text" tab: paste text → proceed
- "Back" on step 2 → step 1 data preserved
- "Next" on step 1 with no resume → disabled; cannot proceed

**`session.spec.ts`:**
- Full 3-question session: greeting delivered → Q1 answered (mocked speech) → follow-up injected → answer → Q2 answered → Q3 answered → session auto-ends → rating screen shown
- Consecutive cap: Q1 answered → FU1 injected → FU1 answered → FU2 injected → FU2 answered → Q2 served (no third follow-up)
- Early exit: confirm → rating screen shown
- Text fallback: mock `getUserMedia` denied → text input visible; type answer → session continues
- `beforeunload`: during active session, close tab attempted → browser confirmation fires

**`report.spec.ts`:**
- Hot path: from completion → report renders from Zustand
- Cold path: direct URL → loads from Supabase
- String "Follow-up" absent from entire rendered DOM
- Click "Download PDF" → file download triggered
- Other user's `sessionId` in URL → redirect to `/dashboard`

**`dashboard.spec.ts`:**
- 0 sessions → empty state; chart hidden
- 2+ sessions → chart rendered; session cards shown
- "View Report" → navigates to correct URL

**`profile.spec.ts`:**
- Upload PDF → appears in list; count updates
- "Set as default" → badge moves
- "Delete" → confirmation → removed from list
- Upload at 10 resumes → inline error

**`admin.spec.ts`:**
- Login as admin → `/admin` renders
- Regular user → `/admin` shows 403 component
- Add provider + key → provider in list; key masked
- "Set as Active" → active badge moves
- Suspend user → status changes; suspended user login blocked
- Delete user → removed from list
- `/admin/evals` → charts render; date filter works
- `/admin/logs` → table renders; call type filter works

**`gateway.spec.ts`:**
- 3 keys configured → 3 sequential AI calls → `ai_call_logs` has `key_index` values [0, 1, 2]
- Active provider 1 key returns 429 → second provider key used → 2 rows in `ai_call_logs`

**Acceptance criteria:**
- All spec files run to completion with 0 failures on Chromium
- All spec files run to completion with 0 failures on WebKit
- Stage 4 CI pipeline passes on PR containing this issue's changes

---

### S4-10 · `test`
**`test: achieve 80% unit test coverage across all modules with property-based test gap-fill`**

Gap-fill unit tests to reach ≥ 80% coverage. Run Stryker.

**Coverage targets:**

| Module area | Required coverage |
|---|---|
| `lib/gateway/` (all files) | ≥ 80% |
| `lib/eval/` | ≥ 80% |
| `lib/speech/` | ≥ 80% |
| `lib/scoring/tokenCounter.ts` | 100% (pure function) |
| `lib/pdf/generateReport.ts` | ≥ 80% |
| `store/sessionStore.ts` | ≥ 90% (critical state machine) |
| `middleware.ts` | ≥ 90% (security boundary) |
| `app/api/` (all route handlers) | ≥ 80% |
| `lib/supabase/` (all files) | ≥ 80% |

**Specific tests that must be present:**
- `tokenCounter.estimateTokens('')` → `0`
- `tokenCounter.estimateTokens('a'.repeat(4))` → `1`
- fast-check property: `consecutiveFollowUpCount` never exceeds 2 for any sequence of `injectFollowUp` calls — `fc.array(fc.constant('inject'), { maxLength: 100 })`
- fast-check property: `setSliderValue(fc.integer())` — if outside [1,10] slider unchanged; else slider = n
- fast-check property: `silenceDetector.onSilence` never fires in under 2000ms — `fc.array(fc.integer({ min: 0, max: 1999 }), { minLength: 1 })` as inter-call delays
- `gateway/router`: all branches — success, 429 within provider, all-keys-exhausted fallback, all-providers-exhausted `GatewayExhaustedError`
- `middleware.ts`: all 9 classification scenarios (see S1-05)
- `lib/pdf/generateReport.ts`: string "Follow-up" never present in jsPDF output
- fast-check property: `runEval` — for any 5 dimension scores [a,b,c,d,e] each integer 1–5, `overall_eval_score === Math.round(((a+b+c+d+e)/5) * 100) / 100`

**Stryker mutation testing:**
- Run on 5 scoped modules: `scoring.ts`, `tokenCounter.ts`, `questionDedup.ts`, `sessionStore.ts`, `silenceDetector.ts`
- Overall mutation score ≥ 70%
- Any module below 60% → add additional example-based tests before closing

---

### S4-11 · `test`
**`test: run axe-core accessibility audit across all pages and fix all critical and serious violations`**

**Functional acceptance criteria:**
- `@axe-core/playwright` installed and integrated into E2E suite
- Axe scan run on all pages: `/`, `/login`, `/signup`, `/dashboard`, `/setup` (all 3 steps), `/session` (all 7 states), `/reports`, `/reports/[sessionId]`, `/profile`, `/admin`, `/admin/users`, `/admin/providers`, `/admin/logs`, `/admin/evals`
- Zero axe `critical` violations on any page
- Zero axe `serious` violations on any page
- All interactive elements reachable via Tab + Enter/Space
- ARIA live regions present: TTS word delivery, mic status, rating screen, toasts, countdown, closing note
- Star `RadioGroup`: announces "N star, radio button, 1 of 5" on focus
- Color never the sole indicator of meaning: all score labels have text + color; all status badges have text content
- Color contrast ≥ 4.5:1 for all normal text (verified via axe `color-contrast` rule)
- Admin tables: `scope="col"` on all headers; action buttons have `aria-label`
- PDF download button: `aria-label="Download performance report as PDF"`

**Test cases:**
- `axe().analyze()` on `/login` → 0 critical or serious violations
- `axe().analyze()` on `/session` in `active` state → 0 critical or serious violations
- `axe().analyze()` on `/reports/[sessionId]` → 0 critical or serious violations
- Tab through star rating → focus moves stars 1–5 in order; Enter selects focused star
- Tab through per-question accordion → all triggers reachable; Enter toggles expansion
- `axe().analyze()` on `/admin/users` → 0 critical or serious violations

---

### S4-12 · `chore`
**`chore: execute blue-green production deployment, verify rollback, and run end-to-end smoke test`**

**Functional acceptance criteria:**
- Merge to `main` after all Sprint 4 PRs merged → `production.yml` triggers and deploys successfully
- Blue-green: new deployment live; previous deployment preserved in Vercel dashboard
- Rollback test: promote previous deployment → traffic serves old code; re-promote new → traffic serves new; entire cycle under 2 minutes
- End-to-end smoke test on production URL:
  1. Sign up → `/dashboard` empty state
  2. Upload resume on `/profile` → appears in list
  3. `/setup` → saved resume pre-selected → enter JD → slider 5 → confirm
  4. Witty phrases → mic permission → countdown → session starts
  5. Opening greeting via TTS → speak Q1 → follow-up injected → answer follow-up → all questions answered → session auto-ends
  6. Rating 4 stars → closing note → report wait → view report
  7. Report page: score, accordion, transcript → download PDF → file opens without corruption
  8. Navigate to `/reports` → report entry visible
  9. Navigate to `/dashboard` → session card and trend chart visible
  10. Login as admin → `/admin/providers` → providers shown → `/admin/logs` → call log entries visible → `/admin/evals` → eval result visible
- Sentry receives at least one event from the smoke test (verified in Sentry dashboard)
- Better Stack shows green uptime status
- Vercel Analytics shows at least one request from smoke test
- README updated with final production URL, staging URL, all monitoring dashboard links

---

## Sprint Milestone Summary

| Sprint | End Date | MVP Deliverable |
|---|---|---|
| Sprint 1 | Mar 28 | Deployed app: auth, protected routes, full CI/CD, complete database schema |
| Sprint 2 | Apr 4 | Admin provider config working; user can complete setup and receive generated questions |
| Sprint 3 | Apr 11 | Full spoken session end-to-end with follow-ups and eval system |
| Sprint 4 | **Apr 17** | Complete production application: reports, dashboard, PDF, monitoring, full test suite |
| Submission buffer | Apr 19 | Final review |

---

## Issue Index

| ID | Title | Label | Sprint |
|---|---|---|---|
| S1-01 | `chore: initialise Next.js project with TypeScript, Tailwind, ShadCN, ESLint, and Prettier` | `chore` | 1 |
| S1-02 | `chore: create full Supabase database schema with RLS policies, triggers, and storage bucket` | `chore` | 1 |
| S1-03 | `chore: implement 12-stage sequential GitHub Actions CI/CD pipeline with branch protection rules` | `chore` | 1 |
| S1-04 | `chore: integrate Supabase SSR client for browser, server, and middleware usage contexts` | `chore` | 1 |
| S1-05 | `chore: implement Next.js edge middleware for route protection, admin role enforcement, and session refresh` | `chore` | 1 |
| S1-06 | `feat: implement login and signup pages with email/password and Google OAuth` | `feat` | 1 |
| S1-07 | `chore: configure Vercel three-environment deployment with staging, production, and rollback` | `chore` | 1 |
| S1-08 | `feat: build public landing page with hero section, feature callouts, and browser compatibility notice` | `feat` | 1 |
| S1-09 | `chore: integrate Sentry error tracking with source map upload and production alert rules` | `chore` | 1 |
| S2-01 | `feat: implement AI gateway core with round-robin key rotation and provider fallback chain` | `feat` | 2 |
| S2-02 | `feat: implement Gemini and Groq provider adapters with normalised request formatting and response parsing` | `feat` | 2 |
| S2-03 | `chore: implement Supabase data access layer for ai_providers, ai_call_logs, and eval_results tables` | `chore` | 2 |
| S2-04 | `feat: build admin dashboard with user management and AI provider configuration` | `feat` | 2 |
| S2-05 | `feat: implement resume upload, signed download URL, and atomic delete API routes` | `feat` | 2 |
| S2-06 | `feat: build profile page with resume list, upload zone, default management, and display name editor` | `feat` | 2 |
| S2-07 | `feat: implement Zustand session store with all state fields, actions, and invariant guards` | `feat` | 2 |
| S2-08 | `feat: build 3-step setup wizard with resume tabs, JD input, slider, and confirmation preview` | `feat` | 2 |
| S2-09 | `feat: implement question generation API route with greeting, closing note, Zod validation, and sessionStorage caching` | `feat` | 2 |
| S3-01 | `feat: build witty phrases loading screen and microphone permission request screen` | `feat` | 3 |
| S3-02 | `feat: build 5-second animated countdown screen before session begins` | `feat` | 3 |
| S3-03 | `feat: build full-screen session chat interface with header, bubbles, and end-early modal` | `feat` | 3 |
| S3-04 | `feat: implement SpeechSynthesis TTS wrapper with word-by-word chat rendering` | `feat` | 3 |
| S3-05 | `feat: implement Web Speech API recognition wrapper with silence detection and mic button states` | `feat` | 3 |
| S3-06 | `feat: build text input fallback for session when speech is unavailable or denied` | `feat` | 3 |
| S3-07 | `feat: implement follow-up evaluation API route with consecutive cap enforcement and session end condition` | `feat` | 3 |
| S3-08 | `feat: implement rolling context summarization with token estimation and 12,000-token threshold trigger` | `feat` | 3 |
| S3-09 | `feat: implement LLM-as-judge eval system with async execution and anonymised eval_results persistence` | `feat` | 3 |
| S3-10 | `feat: build admin eval metrics page and call logs page with filtering and pagination` | `feat` | 3 |
| S4-01 | `feat: build rating screen and AI closing note screen for post-session flow` | `feat` | 4 |
| S4-02 | `feat: implement report generation API route with Supabase persistence and async eval trigger` | `feat` | 4 |
| S4-03 | `feat: build report wait screen and session completion screen` | `feat` | 4 |
| S4-04 | `feat: build report detail page with per-question accordion, full transcript, and PDF download` | `feat` | 4 |
| S4-05 | `feat: implement client-side PDF report generator with cover page, transcript, and per-question analysis` | `feat` | 4 |
| S4-06 | `feat: build reports listing page with pagination, staggered animation, and empty state` | `feat` | 4 |
| S4-07 | `feat: build user dashboard with session history cards, score trend chart, and empty state` | `feat` | 4 |
| S4-08 | `chore: configure Better Stack uptime monitoring, finalise Sentry alert rules, and update monitoring documentation` | `chore` | 4 |
| S4-09 | `test: write comprehensive Playwright E2E test suite covering all user, admin, and gateway flows` | `test` | 4 |
| S4-10 | `test: achieve 80% unit test coverage across all modules with property-based test gap-fill` | `test` | 4 |
| S4-11 | `test: run axe-core accessibility audit across all pages and fix all critical and serious violations` | `test` | 4 |
| S4-12 | `chore: execute blue-green production deployment, verify rollback, and run end-to-end smoke test` | `chore` | 4 |

**Total: 40 issues across 4 sprints. No owner assignments. Any issue can be picked up by either team member independently.**

---

*Copy each issue title, description, functional acceptance criteria, test cases, and property-based tests verbatim into the GitHub Issue body. Issues within the same sprint with non-overlapping file ownership can be worked simultaneously with zero merge conflict risk.*
