# Issue #4 Exploration: Supabase SSR Client Integration

## Overview

This issue requires wiring `@supabase/ssr` into the project for browser, server, and middleware usage contexts.

## Current State

### Dependencies (Already Installed)

- `@supabase/ssr`: ^0.6.1
- `@supabase/supabase-js`: ^2.49.4

### Existing File Structure

- `lib/supabase/` - Contains only `.gitkeep` (empty)
- `types/` - Contains only `.gitkeep` (empty)

### Environment Variables (from .env.example)

Server-side only:
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

Client-side safe:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Database Schema (10 Tables)

From `supabase/migrations/2_create_full_schema.sql`:

1. `profiles` - User profile data (extends auth.users)
2. `user_resumes` - Resume metadata
3. `sessions` - Interview session records
4. `transcripts` - Conversation turns
5. `reports` - AI-generated performance reports
6. `session_feedback` - User ratings
7. `ai_providers` - AI provider configuration
8. `ai_provider_keys` - Encrypted API keys
9. `ai_call_logs` - Gateway audit trail
10. `eval_results` - LLM-as-judge results

All tables have RLS enabled with appropriate policies.

## Implementation Requirements

### 1. Browser Client (`lib/supabase/client.ts`)

Export `createBrowserClient()` using:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 2. Server Client (`lib/supabase/server.ts`)

Export `createServerClient(cookieStore)` using server-only vars:
- Works in Server Components
- Works in API route handlers

### 3. Middleware Utilities (`lib/supabase/middleware.ts`)

Export `updateSession(request: NextRequest): NextResponse`:
- Refreshes session token
- Writes token back to response cookies

### 4. TypeScript Types (`types/supabase.ts`)

Generated via `npx supabase gen types typescript`:
- Must reflect all 10 tables
- Must be committed to repository

## References

- Supabase SSR docs: https://supabase.com/docs/guides/auth/server-side/nextjs
- PRD Section 9: Folder Structure

## Test Strategy

Unit tests with mocked cookie stores and requests to verify:
- Client instances are created without throwing
- Server client works with mock cookie store
- Middleware returns NextResponse with cookie headers
- Anon key does not grant service role privileges
