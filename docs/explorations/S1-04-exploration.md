# S1-04 Exploration Findings
> Issue: S1-04 — Integrate Supabase SSR client
> Date: 2026-03-23

---

## Current Repository State

The project is **a fresh repository with no implementation code yet**. It contains only:

- `CLAUDE.md` — architecture rules and project guidelines
- `project-memory/PRD.md` — full product requirements
- `project-memory/SPRINT_PLAN.md` — 4-sprint breakdown
- `.claude/settings.json` — Claude Code config

**No `lib/`, `app/`, `components/`, `middleware.ts`, `package.json`, or any source files exist.** Issue S1-04 is a greenfield implementation.

---

## Files to Create (S1-04 Scope)

Per SPRINT_PLAN.md, issue S1-04 owns exactly these files:

| File | Purpose |
|------|---------|
| `lib/supabase/client.ts` | Browser-side Supabase client |
| `lib/supabase/server.ts` | Server-side Supabase client (Server Components, Route Handlers) |
| `lib/supabase/middleware.ts` | Session refresh helper used by `middleware.ts` |
| `types/supabase.ts` | Auto-generated DB types placeholder |

---

## @supabase/ssr API Surface

### Exported Functions

#### `createBrowserClient(supabaseUrl, supabaseKey, options?)`
- Use in Client Components (`'use client'`)
- Takes `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `isSingleton: true` by default in browser (prevents duplicate client instances)
- Cookie handling is automatic in browser context; no custom cookie handler needed
- Returns `SupabaseClient` configured with PKCE flow and auto-refresh enabled

```typescript
// lib/supabase/client.ts
import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
```

#### `createServerClient(supabaseUrl, supabaseKey, options)`
- Use in Server Components, Route Handlers, Server Actions, Middleware
- `options.cookies` is **required** — must implement `getAll()` and `setAll()`
- Auto-refresh is **disabled** (middleware handles token refresh instead)
- Session detection from URL is **disabled** on server

**Modern cookie handler interface (`CookieMethodsServer`):**
```typescript
cookies: {
  getAll(): { name: string; value: string }[]
  setAll(cookies: { name: string; value: string; options: CookieSerializeOptions }[]): void
}
```

**Security rule:** Always call `supabase.auth.getUser()` for authorization checks — never `getSession()`. `getSession()` reads cookies without server-side JWT validation and is unsafe for access control.

#### `parseCookieHeader(str)` / `serializeCookieHeader(cookies)`
- Utility helpers for parsing/serializing raw cookie header strings
- Used internally; exposed for custom integrations

---

## Usage Patterns by Context

### `lib/supabase/client.ts` (Browser)
```typescript
import { createBrowserClient } from '@supabase/ssr';
import { Database } from '@/types/supabase';

export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
```

### `lib/supabase/server.ts` (Server Components & Route Handlers)
```typescript
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { Database } from '@/types/supabase';

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Server Components cannot write cookies — expected, safe to ignore
          }
        },
      },
    }
  );
}
```

### `lib/supabase/middleware.ts` (Session Refresh)
The critical pattern — Server Components cannot write cookies, so middleware must refresh tokens before page render:

```typescript
import { createServerClient } from '@supabase/ssr';
import { NextRequest, NextResponse } from 'next/server';
import { Database } from '@/types/supabase';

export async function updateSession(request: NextRequest): Promise<NextResponse> {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          // Must set on both request and response
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // IMPORTANT: This call refreshes the session if expired.
  // Do NOT remove — auth breaks if omitted.
  await supabase.auth.getUser();

  return supabaseResponse;
}
```

### `types/supabase.ts` (Generated Types Placeholder)
Auto-generated via `npx supabase gen types typescript --linked > types/supabase.ts`.
For now, a placeholder `Database` type stub is sufficient until S1-02 migration is applied.

---

## Environment Variables

| Variable | Side | Used In |
|----------|------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Client + Server | Both `createBrowserClient` and `createServerClient` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Client + Server | Both clients (anon key is safe to expose) |
| `SUPABASE_SERVICE_ROLE_KEY` | Server only, **never `NEXT_PUBLIC_`** | Admin API routes only |

---

## Security Constraints (Non-Negotiable)

1. `SUPABASE_SERVICE_ROLE_KEY` must never appear in any `NEXT_PUBLIC_` variable
2. Use `getUser()` (server JWT verification) for all auth checks — not `getSession()`
3. Middleware must run on all routes to ensure session tokens are always fresh
4. `try/catch` in `setAll` for Server Components is correct — they cannot set cookies

---

## Test Cases for S1-04

Per SPRINT_PLAN.md acceptance criteria:

**Unit tests (`lib/supabase/`):**
- `createClient()` (browser) returns a `SupabaseClient` instance
- `createClient()` (server) calls `cookies()` from `next/headers`
- `updateSession()` calls `supabase.auth.getUser()`
- `updateSession()` returns a `NextResponse`
- Cookie `getAll()` reads from `request.cookies`
- Cookie `setAll()` writes to both request and response cookies

**Property-based test (fast-check):**
- Not required for S1-04 (no pure logic module); property tests are scoped to `scoring.ts`, `tokenCounter.ts`, `questionDedup.ts`, `silenceDetector.ts`, `sessionStore.ts`

---

## Key Constraints from CLAUDE.md

- Use `@supabase/ssr` exclusively — no direct use of `@supabase/supabase-js` auth helpers in components
- All files in `lib/supabase/` must export factory functions (`createClient()`), not singleton instances, to avoid shared state across requests
- TypeScript strict mode — no `any`, no unused imports
- File naming: `client.ts`, `server.ts`, `middleware.ts` (kebab-case)
