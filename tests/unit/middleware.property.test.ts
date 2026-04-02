import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import * as fc from 'fast-check';

// Mock response object
const mockResponse = {
  status: 200,
  cookies: {
    set: vi.fn(),
    getAll: vi.fn(() => []),
  },
  headers: new Headers(),
};

// Track redirect and json calls
let redirectCalls: { url: URL }[] = [];
let jsonCalls: { body: object; status: number }[] = [];

// Mock NextResponse
vi.mock('next/server', () => {
  const redirectMock = vi.fn((url: URL) => {
    const response = {
      status: 302,
      headers: new Headers({ Location: url.toString() }),
      cookies: { set: vi.fn(), getAll: vi.fn(() => []) },
    };
    redirectCalls.push({ url });
    return response;
  });

  const jsonMock = vi.fn((body: object, init?: { status?: number }) => {
    const status = init?.status ?? 200;
    const response = {
      status,
      body,
      headers: new Headers({ 'Content-Type': 'application/json' }),
      cookies: { set: vi.fn(), getAll: vi.fn(() => []) },
    };
    jsonCalls.push({ body, status });
    return response;
  });

  const nextMock = vi.fn(() => mockResponse);

  return {
    NextRequest: vi.fn().mockImplementation((url: string) => ({
      url,
      cookies: { getAll: vi.fn(() => []), set: vi.fn() },
      headers: new Headers(),
      nextUrl: new URL(url),
    })),
    NextResponse: {
      next: nextMock,
      redirect: redirectMock,
      json: jsonMock,
    },
  };
});

// Mock createMiddlewareClient
const mockCreateMiddlewareClient = vi.fn();
vi.mock('@/lib/supabase/middleware', () => ({
  createMiddlewareClient: mockCreateMiddlewareClient,
}));

describe('middleware property-based tests', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.resetModules();
    process.env = {
      ...originalEnv,
      NEXT_PUBLIC_SUPABASE_URL: 'https://test.supabase.co',
      NEXT_PUBLIC_SUPABASE_ANON_KEY: 'test-anon-key',
    };
    vi.clearAllMocks();
    redirectCalls = [];
    jsonCalls = [];
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  async function createMockRequest(url: string) {
    const { NextRequest } = await import('next/server');
    return new NextRequest(url);
  }

  // Arbitrary for protected route paths
  const protectedRouteArbitrary = fc.oneof(
    fc.constant('/dashboard'),
    fc.constant('/setup'),
    fc.constant('/session'),
    fc.constant('/profile'),
    // /reports/** paths
    fc
      .string({ minLength: 1, maxLength: 10 })
      .filter((s) => /^[a-zA-Z0-9]+$/.test(s))
      .map((s) => `/reports/${s}`),
    // /admin/** paths
    fc
      .string({ minLength: 1, maxLength: 10 })
      .filter((s) => /^[a-zA-Z0-9]+$/.test(s))
      .map((s) => `/admin/${s}`),
    // User API routes
    fc.constant('/api/generate-questions'),
    fc.constant('/api/generate-followup'),
    fc.constant('/api/generate-report'),
    fc.constant('/api/summarize-context'),
    fc.constant('/api/judge'),
    // /api/resumes/** paths
    fc
      .string({ minLength: 1, maxLength: 10 })
      .filter((s) => /^[a-zA-Z0-9]+$/.test(s))
      .map((s) => `/api/resumes/${s}`),
    // Admin API routes
    fc
      .string({ minLength: 1, maxLength: 10 })
      .filter((s) => /^[a-zA-Z0-9]+$/.test(s))
      .map((s) => `/api/admin/${s}`)
  );

  // Arbitrary for admin route paths (pages and API)
  const adminRouteArbitrary = fc.oneof(
    fc.constant('/admin'),
    fc
      .string({ minLength: 1, maxLength: 10 })
      .filter((s) => /^[a-zA-Z0-9]+$/.test(s))
      .map((s) => `/admin/${s}`),
    fc.constant('/api/admin'),
    fc
      .string({ minLength: 1, maxLength: 10 })
      .filter((s) => /^[a-zA-Z0-9]+$/.test(s))
      .map((s) => `/api/admin/${s}`)
  );

  // Property 1: For any protected route + null session -> status is 302 or 401, never 200
  it('any protected route with null session returns 302 or 401, never 200', async () => {
    await fc.assert(
      fc.asyncProperty(protectedRouteArbitrary, async (pathname) => {
        // Reset mocks and tracking
        vi.clearAllMocks();
        redirectCalls = [];
        jsonCalls = [];

        mockCreateMiddlewareClient.mockResolvedValue({
          response: mockResponse,
          user: null,
          profile: null,
        });

        const { middleware } = await import('@/middleware');

        const request = await createMockRequest(`http://localhost:3000${pathname}`);
        const response = await middleware(request);

        // Check that we got a redirect (302) or json error (401)
        const gotRedirect = redirectCalls.length > 0;
        const gotUnauthorized = jsonCalls.some((call) => call.status === 401);

        // Must be one of these, never the passthrough response (200)
        const isProtected = gotRedirect || gotUnauthorized;
        expect(isProtected).toBe(true);

        // Should never pass through with 200
        if (!gotRedirect && !gotUnauthorized) {
          expect(response.status).not.toBe(200);
        }
      }),
      { numRuns: 50 }
    );
  });

  // Property 2: For any admin route + non-admin role -> status is 403, never 200
  it('any admin route with non-admin role returns 403, never 200', async () => {
    await fc.assert(
      fc.asyncProperty(adminRouteArbitrary, async (pathname) => {
        // Reset mocks and tracking
        vi.clearAllMocks();
        redirectCalls = [];
        jsonCalls = [];

        mockCreateMiddlewareClient.mockResolvedValue({
          response: mockResponse,
          user: { id: 'user-123', email: 'test@example.com' },
          profile: { role: 'user', is_suspended: false },
        });

        const { middleware } = await import('@/middleware');

        const request = await createMockRequest(`http://localhost:3000${pathname}`);
        const response = await middleware(request);

        // Check that we got a 403 Forbidden
        const gotForbidden = jsonCalls.some((call) => call.status === 403);

        expect(gotForbidden).toBe(true);

        // Should never pass through with 200
        if (!gotForbidden) {
          expect(response.status).not.toBe(200);
        }
      }),
      { numRuns: 50 }
    );
  });
});
