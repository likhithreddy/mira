## Architecture

### Route Groups & Protection

Middleware in `middleware.ts` enforces auth:
- `(auth)` group — `/login`, `/signup` (redirect to `/dashboard` if logged in)
- `(app)` group — `/setup`, `/session`, `/dashboard`, `/reports/[sessionId]`, `/profile` (require authenticated session)
- `(admin)` group — `/admin/**` (require `role = admin`)

API routes mirror the same split: `/api/generate-*` and `/api/resumes/**` require session; `/api/admin/**` require admin role.

### Session State Machine

The `/session` page is driven by a Zustand store with 9 states:
`idle → loading (witty phrases) → mic-permission → countdown → active (live interview) → rating → closing → report-wait → complete`

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
| `POST /api/judge` | LLM-as-judge eval — fire-and-forget async quality assessment after each session |
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

## Code Rules

- **Toasts:** `toast()` is called only from `lib` functions and API error handlers — never directly from UI components. Import from `lib/toast.ts`.
- **Animation variants:** Define Framer Motion `variants` as `const` at the top of the component file. Import shared presets (page transition, fade-in, stagger, chat bubble) from `utils/animations.ts` — never duplicate them.
- **Zustand stores:** All session and UI state lives in `store/`. Components subscribe to the store; they never own state that other components need.
- **Supabase queries:** All DB queries go through typed functions in `lib/supabase/`. Never write inline Supabase queries in components, pages, or API routes.
- **No `console.log`:** ESLint has `"no-console": "warn"` — remove all console statements before committing.
- **`.env.example`:** Always keep `.env.example` updated with every required variable name (no values). This file is committed; `.env.local` is not.
- **`returnTo` redirect:** When middleware redirects an unauthenticated user to `/login`, it appends `?returnTo={originalPath}`. After login, redirect to `returnTo` (defaulting to `/dashboard` if absent).
- **Prettier + Tailwind:** The project uses `prettier-plugin-tailwindcss` — do not manually reorder Tailwind classes; the formatter enforces canonical order automatically.
