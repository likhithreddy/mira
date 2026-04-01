# Issue #4 Plan: Supabase SSR Client Integration

## Files to Create/Modify

### New Files

1. `lib/supabase/client.ts` - Browser client factory
2. `lib/supabase/server.ts` - Server client factory
3. `lib/supabase/middleware.ts` - Session refresh utility
4. `types/supabase.ts` - Generated TypeScript types
5. `tests/unit/lib/supabase/client.test.ts` - Browser client tests
6. `tests/unit/lib/supabase/server.test.ts` - Server client tests
7. `tests/unit/lib/supabase/middleware.test.ts` - Middleware tests

### Files to Delete

- `lib/supabase/.gitkeep`
- `types/.gitkeep`

## Implementation Steps (TDD Order)

### Step 1: Write Failing Tests

Create test files for:
- `createBrowserClient()` - Returns Supabase client instance
- `createServerClient(cookieStore)` - Returns server client instance
- `updateSession(request)` - Returns NextResponse with cookies

### Step 2: Implement Browser Client

```typescript
// lib/supabase/client.ts
import { createBrowserClient as createClient } from '@supabase/ssr';
import type { Database } from '@/types/supabase';

export function createBrowserClient() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
```

### Step 3: Implement Server Client

```typescript
// lib/supabase/server.ts
import { createServerClient as createClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import type { Database } from '@/types/supabase';

export async function createServerClient() {
  const cookieStore = await cookies();

  return createClient<Database>(
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
            // Server Component - ignore set errors
          }
        },
      },
    }
  );
}
```

### Step 4: Implement Middleware Utilities

```typescript
// lib/supabase/middleware.ts
import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import type { Database } from '@/types/supabase';

export async function updateSession(request: NextRequest) {
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

  // Refresh session if expired
  await supabase.auth.getUser();

  return supabaseResponse;
}
```

### Step 5: Generate TypeScript Types

Run via Supabase MCP `generate_typescript_types` tool to get types for all 10 tables, then save to `types/supabase.ts`.

### Step 6: Verification

- Run `yarn dev` and ensure no runtime errors
- Run `yarn type-check` for TypeScript validation
- Run `yarn test` for unit tests

## Test Strategy

### Unit Tests

1. **client.test.ts**
   - Mock `@supabase/ssr` module
   - Verify `createBrowserClient()` calls the SSR factory with correct env vars
   - Verify returned object has expected Supabase client shape

2. **server.test.ts**
   - Mock `@supabase/ssr` and `next/headers`
   - Verify `createServerClient()` creates client with cookie handlers
   - Verify cookie getAll/setAll are properly wired

3. **middleware.test.ts**
   - Mock NextRequest/NextResponse
   - Verify `updateSession()` returns NextResponse
   - Verify cookies are refreshed and passed through

## Acceptance Criteria Mapping

| AC | Implementation |
|----|----------------|
| `@supabase/ssr` and `@supabase/supabase-js` installed | Already in package.json |
| `lib/supabase/client.ts` exports `createBrowserClient()` | Step 2 |
| `lib/supabase/server.ts` exports `createServerClient(cookieStore)` | Step 3 |
| `lib/supabase/middleware.ts` exports `updateSession()` | Step 4 |
| TypeScript types generated | Step 5 |
| No runtime errors | Step 6 verification |
