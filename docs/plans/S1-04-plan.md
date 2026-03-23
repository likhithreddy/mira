# S1-04 Implementation Plan
> Issue: S1-04 — Integrate Supabase SSR client
> Date: 2026-03-23

---

## Context

S1-04 wires `@supabase/ssr` into the project as the foundational auth layer. It is a hard prerequisite for S1-05 (middleware route protection) and S1-06 (auth pages). Without it, no authenticated page or API route can function. The issue involves creating four files — three Supabase client factory modules and one types placeholder — with zero business logic; the only correctness concern is the cookie plumbing that keeps session tokens fresh across server renders.

---

## Files to Create

| File | Purpose |
|------|---------|
| `lib/supabase/client.ts` | Browser-side Supabase client (Client Components) |
| `lib/supabase/server.ts` | Server-side Supabase client (Server Components, Route Handlers) |
| `lib/supabase/middleware.ts` | Session refresh helper for `middleware.ts` |
| `types/supabase.ts` | Auto-generated DB types placeholder (stub until S1-02 migration is applied) |

No existing files are modified. No migration is needed for this issue.

---

## Implementation

### `types/supabase.ts`

A minimal `Database` type stub. The real type will be regenerated after S1-02 applies the schema via `npx supabase gen types typescript --linked > types/supabase.ts`.

```typescript
export type Database = Record<string, never>;
```

### `lib/supabase/client.ts`

Uses `createBrowserClient` from `@supabase/ssr`. Exports a factory function — not a singleton — so it is safe to call in multiple Client Components. The `isSingleton: true` default inside `@supabase/ssr` de-duplicates the browser instance automatically.

```typescript
'use client';

import { createBrowserClient } from '@supabase/ssr';
import { type Database } from '@/types/supabase';

export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
```

### `lib/supabase/server.ts`

Uses `createServerClient` from `@supabase/ssr`. Awaits `cookies()` from `next/headers` (Next.js 15 async cookies API). The `setAll` body is wrapped in `try/catch` because Server Components cannot write cookies — the error is expected and safe to swallow.

```typescript
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { type Database } from '@/types/supabase';

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

### `lib/supabase/middleware.ts`

The session refresh helper. Must be called on every request so expired JWTs are silently rotated before the page renders. The `supabaseResponse` variable is intentionally mutable — `setAll` must reassign it to a new `NextResponse.next({ request })` so the refreshed cookies propagate to the browser.

The `await supabase.auth.getUser()` call is mandatory and must not be removed; it is what triggers the token refresh.

```typescript
import { createServerClient } from '@supabase/ssr';
import { NextRequest, NextResponse } from 'next/server';
import { type Database } from '@/types/supabase';

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

  // IMPORTANT: refreshes session if expired. Do NOT remove.
  await supabase.auth.getUser();

  return supabaseResponse;
}
```

---

## Environment Variables

These must be present in `.env.local` for runtime and in CI secrets for tests:

| Variable | Side | Notes |
|----------|------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | Client + Server | Safe to expose — public project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Client + Server | Safe to expose — anon key, RLS enforces access |

`SUPABASE_SERVICE_ROLE_KEY` is **not** used in any of these files. It belongs only in admin API routes.

---

## Security Constraints

1. No `any` types — all functions typed via `Database` generic
2. `getUser()` must be called in `updateSession` — not `getSession()`; only `getUser()` performs server-side JWT verification
3. The `'use client'` directive is required on `client.ts` to prevent accidental server-side import
4. `SUPABASE_SERVICE_ROLE_KEY` must never appear in `NEXT_PUBLIC_*` variables or in any of these files

---

## Tests to Write

All tests live in `lib/supabase/__tests__/` (or co-located `.test.ts` files).

### `client.test.ts`
- `createClient()` returns an object with an `auth` property (i.e., is a SupabaseClient)
- `createClient()` does not throw when env vars are set

### `server.test.ts`
- `createClient()` calls `cookies()` from `next/headers`
- Returns an object with an `auth` property
- Does not throw when a mock cookie store is provided

### `middleware.test.ts`
- `updateSession(mockRequest)` returns a `NextResponse` instance
- `updateSession` calls `supabase.auth.getUser()` exactly once
- Cookie `getAll()` reads from `request.cookies`
- Cookie `setAll()` writes to both `request.cookies` and `supabaseResponse.cookies`

**Mocking strategy:**
- Mock `@supabase/ssr` with `vi.mock('@supabase/ssr')` — stub `createBrowserClient` and `createServerClient` to return a fake client with `auth.getUser` returning `{ data: { user: null }, error: null }`
- Mock `next/headers` with `vi.mock('next/headers')` — stub `cookies()` to return a fake `ReadonlyRequestCookies` with `getAll` and `set` methods

---

## Commit Sequence

1. `[#S1-04] test: add failing unit tests for Supabase SSR client factories`
2. `[#S1-04] feat: implement lib/supabase/client.ts browser client`
3. `[#S1-04] feat: implement lib/supabase/server.ts server client`
4. `[#S1-04] feat: implement lib/supabase/middleware.ts session refresh helper`
5. `[#S1-04] chore: add types/supabase.ts Database type stub`

---

## Verification

1. `yarn type-check` — no TypeScript errors
2. `yarn lint` — no ESLint warnings
3. `yarn test --coverage` — all S1-04 unit tests pass, ≥80% coverage on new files
4. Manual: start `yarn dev` with `.env.local` populated → no runtime errors on `/` (even before auth pages exist)
