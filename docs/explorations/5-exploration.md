# Issue #5 Exploration: Edge Middleware for Route Protection

## Existing Supabase Setup

### lib/supabase/middleware.ts

- `updateSession(request: NextRequest)` exists and handles session refresh
- Creates Supabase client with cookie handling
- Calls `auth.getUser()` to validate/refresh tokens
- Returns `NextResponse` with updated cookies

### Database Schema (profiles table)

- `role`: text with CHECK constraint ('user' | 'admin'), default 'user'
- `is_suspended`: boolean, default false
- `is_admin()` SQL function exists for RLS checks

### Test Patterns (tests/unit/lib/supabase/middleware.test.ts)

- Mock `next/server` with `NextRequest` and `NextResponse`
- Mock `@supabase/ssr` with `createServerClient`
- Use `vi.resetModules()` in beforeEach
- Environment variables set in beforeEach
- `createMockRequest()` helper function pattern

## Route Groups to Protect

| Route Type     | Patterns                                                                | Auth Required              | Role Required |
| -------------- | ----------------------------------------------------------------------- | -------------------------- | ------------- |
| User Protected | /dashboard, /setup, /session, /profile, /reports/\*\*                   | Yes                        | Any           |
| Admin Pages    | /admin/\*\*                                                             | Yes                        | admin         |
| User API       | /api/generate-\*, /api/summarize-context, /api/judge, /api/resumes/\*\* | Yes                        | Any           |
| Admin API      | /api/admin/\*\*                                                         | Yes                        | admin         |
| Auth Routes    | /login, /signup                                                         | No (redirect if logged in) | -             |

## Response Types

- Page routes: `NextResponse.redirect(url)` with 302 status
- API routes: `NextResponse.json({ error: '...' }, { status: 4xx })`
- Pass through: return the response from createMiddlewareClient

## Edge Runtime Compatibility

Must use only:

- `NextRequest`/`NextResponse` from `next/server`
- `createServerClient` from `@supabase/ssr`

Cannot use:

- `cookies()` from `next/headers`
- Node.js APIs (fs, path, etc.)
