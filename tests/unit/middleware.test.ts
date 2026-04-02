import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Mock response object
const mockResponse = {
  cookies: {
    set: vi.fn(),
    getAll: vi.fn(() => []),
  },
  headers: new Headers(),
};

// Mock NextResponse
vi.mock('next/server', () => {
  const redirectMock = vi.fn((url: URL) => ({
    status: 302,
    headers: new Headers({ Location: url.toString() }),
    cookies: { set: vi.fn(), getAll: vi.fn(() => []) },
  }));

  const jsonMock = vi.fn((body: object, init?: { status?: number }) => ({
    status: init?.status ?? 200,
    body,
    headers: new Headers({ 'Content-Type': 'application/json' }),
    cookies: { set: vi.fn(), getAll: vi.fn(() => []) },
  }));

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

describe('middleware', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.resetModules();
    process.env = {
      ...originalEnv,
      NEXT_PUBLIC_SUPABASE_URL: 'https://test.supabase.co',
      NEXT_PUBLIC_SUPABASE_ANON_KEY: 'test-anon-key',
    };
    vi.clearAllMocks();

    // Default mock response - no user
    mockCreateMiddlewareClient.mockResolvedValue({
      response: mockResponse,
      user: null,
      profile: null,
    });
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  async function createMockRequest(url: string) {
    const { NextRequest } = await import('next/server');
    return new NextRequest(url);
  }

  // Test Case 1: GET /dashboard with no session -> redirect to /login?returnTo=%2Fdashboard
  it('redirects unauthenticated user from /dashboard to /login with returnTo param', async () => {
    mockCreateMiddlewareClient.mockResolvedValue({
      response: mockResponse,
      user: null,
      profile: null,
    });

    const { middleware } = await import('@/middleware');
    const { NextResponse } = await import('next/server');

    const request = await createMockRequest('http://localhost:3000/dashboard');
    await middleware(request);

    expect(NextResponse.redirect).toHaveBeenCalled();
    const redirectCall = (NextResponse.redirect as ReturnType<typeof vi.fn>).mock.calls[0];
    const redirectUrl = redirectCall[0] as URL;
    expect(redirectUrl.pathname).toBe('/login');
    expect(redirectUrl.searchParams.get('returnTo')).toBe('/dashboard');
  });

  // Test Case 2: GET /dashboard with valid user session -> passes through
  it('allows authenticated user to access /dashboard', async () => {
    mockCreateMiddlewareClient.mockResolvedValue({
      response: mockResponse,
      user: { id: 'user-123', email: 'test@example.com' },
      profile: { role: 'user', is_suspended: false },
    });

    const { middleware } = await import('@/middleware');
    const { NextResponse } = await import('next/server');

    const request = await createMockRequest('http://localhost:3000/dashboard');
    const response = await middleware(request);

    expect(response).toBe(mockResponse);
    expect(NextResponse.redirect).not.toHaveBeenCalled();
    expect(NextResponse.json).not.toHaveBeenCalled();
  });

  // Test Case 3: GET /login with valid user session -> redirect to /dashboard
  it('redirects authenticated user from /login to /dashboard', async () => {
    mockCreateMiddlewareClient.mockResolvedValue({
      response: mockResponse,
      user: { id: 'user-123', email: 'test@example.com' },
      profile: { role: 'user', is_suspended: false },
    });

    const { middleware } = await import('@/middleware');
    const { NextResponse } = await import('next/server');

    const request = await createMockRequest('http://localhost:3000/login');
    await middleware(request);

    expect(NextResponse.redirect).toHaveBeenCalled();
    const redirectCall = (NextResponse.redirect as ReturnType<typeof vi.fn>).mock.calls[0];
    const redirectUrl = redirectCall[0] as URL;
    expect(redirectUrl.pathname).toBe('/dashboard');
  });

  // Test Case 4: GET /admin/users with role='user' session -> 403
  it('returns 403 for non-admin accessing /admin/users', async () => {
    mockCreateMiddlewareClient.mockResolvedValue({
      response: mockResponse,
      user: { id: 'user-123', email: 'test@example.com' },
      profile: { role: 'user', is_suspended: false },
    });

    const { middleware } = await import('@/middleware');
    const { NextResponse } = await import('next/server');

    const request = await createMockRequest('http://localhost:3000/admin/users');
    await middleware(request);

    expect(NextResponse.json).toHaveBeenCalledWith({ error: 'Forbidden' }, { status: 403 });
  });

  // Test Case 5: GET /admin/users with role='admin' session -> passes through
  it('allows admin to access /admin/users', async () => {
    mockCreateMiddlewareClient.mockResolvedValue({
      response: mockResponse,
      user: { id: 'admin-123', email: 'admin@example.com' },
      profile: { role: 'admin', is_suspended: false },
    });

    const { middleware } = await import('@/middleware');
    const { NextResponse } = await import('next/server');

    const request = await createMockRequest('http://localhost:3000/admin/users');
    const response = await middleware(request);

    expect(response).toBe(mockResponse);
    expect(NextResponse.redirect).not.toHaveBeenCalled();
    expect(NextResponse.json).not.toHaveBeenCalled();
  });

  // Test Case 6: GET /api/generate-questions with no session -> 401
  it('returns 401 for unauthenticated request to /api/generate-questions', async () => {
    mockCreateMiddlewareClient.mockResolvedValue({
      response: mockResponse,
      user: null,
      profile: null,
    });

    const { middleware } = await import('@/middleware');
    const { NextResponse } = await import('next/server');

    const request = await createMockRequest('http://localhost:3000/api/generate-questions');
    await middleware(request);

    expect(NextResponse.json).toHaveBeenCalledWith({ error: 'Unauthorized' }, { status: 401 });
  });

  // Test Case 7: GET /api/admin/users with user session -> 403
  it('returns 403 for non-admin accessing /api/admin/users', async () => {
    mockCreateMiddlewareClient.mockResolvedValue({
      response: mockResponse,
      user: { id: 'user-123', email: 'test@example.com' },
      profile: { role: 'user', is_suspended: false },
    });

    const { middleware } = await import('@/middleware');
    const { NextResponse } = await import('next/server');

    const request = await createMockRequest('http://localhost:3000/api/admin/users');
    await middleware(request);

    expect(NextResponse.json).toHaveBeenCalledWith({ error: 'Forbidden' }, { status: 403 });
  });

  // Test Case 8: GET /_next/static/chunk.js -> middleware not executed (excluded by matcher)
  it('matcher config excludes static assets', async () => {
    const { config } = await import('@/middleware');

    // The matcher should be defined
    expect(config).toBeDefined();
    expect(config.matcher).toBeDefined();
    expect(Array.isArray(config.matcher)).toBe(true);

    // Create a simple test function based on the matcher pattern
    const matcherPattern = config.matcher[0];
    expect(matcherPattern).toContain('_next/static');
    expect(matcherPattern).toContain('_next/image');
    expect(matcherPattern).toContain('favicon.ico');
  });

  // Test Case 9: GET /dashboard with is_suspended=true -> redirect to /login?suspended=true
  it('redirects suspended user to /login?suspended=true', async () => {
    mockCreateMiddlewareClient.mockResolvedValue({
      response: mockResponse,
      user: { id: 'user-123', email: 'test@example.com' },
      profile: { role: 'user', is_suspended: true },
    });

    const { middleware } = await import('@/middleware');
    const { NextResponse } = await import('next/server');

    const request = await createMockRequest('http://localhost:3000/dashboard');
    await middleware(request);

    expect(NextResponse.redirect).toHaveBeenCalled();
    const redirectCall = (NextResponse.redirect as ReturnType<typeof vi.fn>).mock.calls[0];
    const redirectUrl = redirectCall[0] as URL;
    expect(redirectUrl.pathname).toBe('/login');
    expect(redirectUrl.searchParams.get('suspended')).toBe('true');
  });

  // Test Case 10: GET /api/generate-questions with admin session -> passes through
  it('allows admin to access user API routes', async () => {
    mockCreateMiddlewareClient.mockResolvedValue({
      response: mockResponse,
      user: { id: 'admin-123', email: 'admin@example.com' },
      profile: { role: 'admin', is_suspended: false },
    });

    const { middleware } = await import('@/middleware');
    const { NextResponse } = await import('next/server');

    const request = await createMockRequest('http://localhost:3000/api/generate-questions');
    const response = await middleware(request);

    expect(response).toBe(mockResponse);
    expect(NextResponse.redirect).not.toHaveBeenCalled();
    expect(NextResponse.json).not.toHaveBeenCalled();
  });
});
