# Plan: Issue #5 - Next.js Edge Middleware for Route Protection

## Summary
Implement `middleware.ts` at project root for route protection, admin role enforcement, session refresh, and suspended user handling.

## Files to Create/Modify

| File | Action | Purpose |
|------|--------|---------|
| `middleware.ts` | Create | Main middleware entry point |
| `lib/supabase/middleware.ts` | Modify | Add `createMiddlewareClient()` that returns user + profile |
| `tests/unit/middleware.test.ts` | Create | 10 unit tests for middleware |
| `tests/unit/middleware.property.test.ts` | Create | 2 property-based tests |
| `tests/unit/lib/supabase/middleware.test.ts` | Modify | Add tests for `createMiddlewareClient()` |

## Implementation Sequence (TDD)

### Phase 1: Write Failing Tests
1. Create `tests/unit/middleware.test.ts` with 10 test cases
2. Create `tests/unit/middleware.property.test.ts` with 2 property tests
3. Add tests for `createMiddlewareClient()` in existing test file
4. **Commit**: `[#5] test: add failing tests for edge middleware`

### Phase 2: Implement createMiddlewareClient
Extend `lib/supabase/middleware.ts` with:

```typescript
type MiddlewareClientResult = {
  response: NextResponse;
  user: { id: string; email?: string } | null;
  profile: { role: string; is_suspended: boolean } | null;
};

export async function createMiddlewareClient(request: NextRequest): Promise<MiddlewareClientResult>
```

**Commit**: `[#5] feat: add createMiddlewareClient for session and profile fetch`

### Phase 3: Implement Middleware
Create `middleware.ts` with route protection logic.

**Commit**: `[#5] feat: implement edge middleware with route protection`

### Phase 4: Verification
Run lint, format, and tests.

**Commit**: `[#5] chore: fix lint and ensure coverage threshold`

## Test Cases

| # | Test | Expected |
|---|------|----------|
| 1 | GET /dashboard, no session | 302 to /login?returnTo=%2Fdashboard |
| 2 | GET /dashboard, valid user | passes through |
| 3 | GET /login, valid user | 302 to /dashboard |
| 4 | GET /admin/users, role=user | 403 JSON |
| 5 | GET /admin/users, role=admin | passes through |
| 6 | GET /api/generate-questions, no session | 401 JSON |
| 7 | GET /api/admin/users, role=user | 403 JSON |
| 8 | GET /_next/static/chunk.js | excluded by matcher |
| 9 | GET /dashboard, is_suspended=true | 302 to /login?suspended=true |
| 10 | GET /api/generate-questions, role=admin | passes through |

## Property Tests

1. **Protected route + null session** -> status is 302 or 401, never 200
2. **Admin route + non-admin role** -> status is 403, never 200
