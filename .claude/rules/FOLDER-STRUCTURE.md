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
  eval/                     # LLM-as-judge: runEval.ts, evalSchema.ts
  supabase/                 # All Supabase DB query functions — never write raw queries in components or pages
  speech/                   # TTS and speech recognition abstractions
  pdf/                      # Resume parsing and report PDF generation
  scoring.ts                # Pure business logic modules
  tokenCounter.ts
  questionDedup.ts
  silenceDetector.ts
  toast.ts                  # toast() utility — called from lib/API handlers only, never from UI components
hooks/                      # Custom React hooks: useSession, useTTS, useSpeechRecognition,
                            #   useResumeUpload, useSessionTimer, useReducedMotion, useAvatarDropdown
schemas/                    # Zod validation schemas for all AI API responses and form inputs
                            #   questionSchema.ts, followupSchema.ts, reportSchema.ts, resumeSchema.ts
utils/
  formatters.ts             # Date, score, and text formatting helpers
  constants.ts              # App-wide constants: limits, thresholds, labels
  animations.ts             # Shared Framer Motion variants: pageTransition, fadeIn, staggerContainer, chatBubble
  errors.ts                 # Typed error classes for API and app errors
store/                      # Zustand stores only
types/                      # Global TypeScript types and Zod schemas
supabase/
  migrations/               # Every DB schema change must be a .sql file here — never via Supabase Studio UI
tests/
  unit/                     # Vitest unit + property-based tests (mirrors source structure)
  integration/              # Vitest integration tests
  e2e/                      # Playwright E2E tests (Chromium primary + WebKit)
```

**No test files co-locate with source files.** All tests live under `tests/` — never next to the source file, never in `__tests__` directories.
