import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Create mock cookies and response objects
const mockCookies = {
  getAll: vi.fn((): { name: string; value: string }[] => []),
  set: vi.fn(),
};

const mockResponseCookies = {
  set: vi.fn(),
  getAll: vi.fn(() => []),
};

const mockResponse = {
  cookies: mockResponseCookies,
  headers: new Headers(),
};

// Mock next/server
vi.mock('next/server', () => ({
  NextRequest: vi.fn().mockImplementation((url: string) => ({
    url,
    cookies: mockCookies,
    headers: new Headers(),
    nextUrl: new URL(url),
  })),
  NextResponse: {
    next: vi.fn(() => mockResponse),
  },
}));

// Mock @supabase/ssr
vi.mock('@supabase/ssr', () => ({
  createServerClient: vi.fn(() => ({
    auth: {
      getUser: vi.fn().mockResolvedValue({ data: { user: null }, error: null }),
    },
  })),
}));

describe('lib/supabase/middleware', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.resetModules();
    process.env = {
      ...originalEnv,
      NEXT_PUBLIC_SUPABASE_URL: 'https://test.supabase.co',
      NEXT_PUBLIC_SUPABASE_ANON_KEY: 'test-anon-key',
    };
    vi.clearAllMocks();
    mockCookies.getAll.mockReturnValue([]);
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  async function createMockRequest(url = 'http://localhost:3000/') {
    const { NextRequest } = await import('next/server');
    return new NextRequest(url);
  }

  it('updateSession() returns a NextResponse instance', async () => {
    const { updateSession } = await import('@/lib/supabase/middleware');

    const request = await createMockRequest();
    const response = await updateSession(request);

    expect(response).toBeDefined();
    expect(response).toBe(mockResponse);
  });

  it('updateSession() returns response with cookie headers present', async () => {
    const { updateSession } = await import('@/lib/supabase/middleware');

    const request = await createMockRequest();
    const response = await updateSession(request);

    // Response should be a valid response with cookies
    expect(response).toBeDefined();
    expect(response.cookies).toBeDefined();
  });

  it('updateSession() calls supabase.auth.getUser() to refresh session', async () => {
    const { createServerClient } = await import('@supabase/ssr');
    const mockGetUser = vi.fn().mockResolvedValue({
      data: { user: { id: 'test-user' } },
      error: null,
    });

    (createServerClient as ReturnType<typeof vi.fn>).mockReturnValue({
      auth: {
        getUser: mockGetUser,
      },
    });

    const { updateSession } = await import('@/lib/supabase/middleware');

    const request = await createMockRequest();
    await updateSession(request);

    expect(mockGetUser).toHaveBeenCalled();
  });

  it('updateSession() creates client with request cookies', async () => {
    const { createServerClient } = await import('@supabase/ssr');
    const { updateSession } = await import('@/lib/supabase/middleware');

    const request = await createMockRequest();
    await updateSession(request);

    expect(createServerClient).toHaveBeenCalledWith(
      'https://test.supabase.co',
      'test-anon-key',
      expect.objectContaining({
        cookies: expect.objectContaining({
          getAll: expect.any(Function),
          setAll: expect.any(Function),
        }),
      })
    );
  });

  it('updateSession() handles requests without cookies', async () => {
    mockCookies.getAll.mockReturnValue([]);
    const { updateSession } = await import('@/lib/supabase/middleware');

    const request = await createMockRequest();
    const response = await updateSession(request);

    expect(response).toBeDefined();
  });

  it('cookie setAll sets cookies on request and response', async () => {
    const { createServerClient } = await import('@supabase/ssr');
    const { NextResponse } = await import('next/server');
    const { updateSession } = await import('@/lib/supabase/middleware');

    const request = await createMockRequest();
    await updateSession(request);

    // Extract the cookies config from the mock call
    const callArgs = (createServerClient as ReturnType<typeof vi.fn>).mock.calls[0];
    const cookiesConfig = callArgs[2].cookies;

    // Reset mocks to track setAll calls
    mockCookies.set.mockClear();
    mockResponseCookies.set.mockClear();
    (NextResponse.next as ReturnType<typeof vi.fn>).mockClear();

    // Call setAll with test cookies
    const testCookies = [{ name: 'sb-access-token', value: 'new-token', options: { path: '/' } }];
    cookiesConfig.setAll(testCookies);

    // Verify request.cookies.set was called
    expect(mockCookies.set).toHaveBeenCalledWith('sb-access-token', 'new-token');

    // Verify NextResponse.next was called to create new response
    expect(NextResponse.next).toHaveBeenCalled();

    // Verify response.cookies.set was called
    expect(mockResponseCookies.set).toHaveBeenCalledWith('sb-access-token', 'new-token', {
      path: '/',
    });
  });

  it('cookie getAll returns cookies from request', async () => {
    const { createServerClient } = await import('@supabase/ssr');
    const { updateSession } = await import('@/lib/supabase/middleware');

    mockCookies.getAll.mockReturnValue([{ name: 'sb-access-token', value: 'existing-token' }]);

    const request = await createMockRequest();
    await updateSession(request);

    // Extract the cookies config from the mock call
    const callArgs = (createServerClient as ReturnType<typeof vi.fn>).mock.calls[0];
    const cookiesConfig = callArgs[2].cookies;

    const cookies = cookiesConfig.getAll();
    expect(cookies).toEqual([{ name: 'sb-access-token', value: 'existing-token' }]);
  });

  describe('createMiddlewareClient', () => {
    it('returns user and profile when authenticated', async () => {
      const { createServerClient } = await import('@supabase/ssr');
      const mockGetUser = vi.fn().mockResolvedValue({
        data: { user: { id: 'user-123', email: 'test@example.com' } },
        error: null,
      });
      const mockSingle = vi.fn().mockResolvedValue({
        data: { role: 'user', is_suspended: false },
        error: null,
      });
      const mockEq = vi.fn().mockReturnValue({ single: mockSingle });
      const mockSelect = vi.fn().mockReturnValue({ eq: mockEq });
      const mockFrom = vi.fn().mockReturnValue({ select: mockSelect });

      (createServerClient as ReturnType<typeof vi.fn>).mockReturnValue({
        auth: { getUser: mockGetUser },
        from: mockFrom,
      });

      const { createMiddlewareClient } = await import('@/lib/supabase/middleware');

      const request = await createMockRequest();
      const result = await createMiddlewareClient(request);

      expect(result.user).toEqual({ id: 'user-123', email: 'test@example.com' });
      expect(result.profile).toEqual({ role: 'user', is_suspended: false });
      expect(result.response).toBeDefined();
    });

    it('returns null user and profile when not authenticated', async () => {
      const { createServerClient } = await import('@supabase/ssr');
      const mockGetUser = vi.fn().mockResolvedValue({
        data: { user: null },
        error: null,
      });

      (createServerClient as ReturnType<typeof vi.fn>).mockReturnValue({
        auth: { getUser: mockGetUser },
      });

      const { createMiddlewareClient } = await import('@/lib/supabase/middleware');

      const request = await createMockRequest();
      const result = await createMiddlewareClient(request);

      expect(result.user).toBeNull();
      expect(result.profile).toBeNull();
      expect(result.response).toBeDefined();
    });

    it('returns null profile when profile fetch fails', async () => {
      const { createServerClient } = await import('@supabase/ssr');
      const mockGetUser = vi.fn().mockResolvedValue({
        data: { user: { id: 'user-123', email: 'test@example.com' } },
        error: null,
      });
      const mockSingle = vi.fn().mockResolvedValue({
        data: null,
        error: { message: 'Not found' },
      });
      const mockEq = vi.fn().mockReturnValue({ single: mockSingle });
      const mockSelect = vi.fn().mockReturnValue({ eq: mockEq });
      const mockFrom = vi.fn().mockReturnValue({ select: mockSelect });

      (createServerClient as ReturnType<typeof vi.fn>).mockReturnValue({
        auth: { getUser: mockGetUser },
        from: mockFrom,
      });

      const { createMiddlewareClient } = await import('@/lib/supabase/middleware');

      const request = await createMockRequest();
      const result = await createMiddlewareClient(request);

      expect(result.user).toEqual({ id: 'user-123', email: 'test@example.com' });
      expect(result.profile).toBeNull();
      expect(result.response).toBeDefined();
    });

    it('queries profiles table with user id', async () => {
      const { createServerClient } = await import('@supabase/ssr');
      const mockGetUser = vi.fn().mockResolvedValue({
        data: { user: { id: 'user-456', email: 'another@example.com' } },
        error: null,
      });
      const mockSingle = vi.fn().mockResolvedValue({
        data: { role: 'admin', is_suspended: false },
        error: null,
      });
      const mockEq = vi.fn().mockReturnValue({ single: mockSingle });
      const mockSelect = vi.fn().mockReturnValue({ eq: mockEq });
      const mockFrom = vi.fn().mockReturnValue({ select: mockSelect });

      (createServerClient as ReturnType<typeof vi.fn>).mockReturnValue({
        auth: { getUser: mockGetUser },
        from: mockFrom,
      });

      const { createMiddlewareClient } = await import('@/lib/supabase/middleware');

      const request = await createMockRequest();
      await createMiddlewareClient(request);

      expect(mockFrom).toHaveBeenCalledWith('profiles');
      expect(mockSelect).toHaveBeenCalledWith('role, is_suspended');
      expect(mockEq).toHaveBeenCalledWith('id', 'user-456');
    });

    it('returns response with cookies', async () => {
      const { createServerClient } = await import('@supabase/ssr');
      const mockGetUser = vi.fn().mockResolvedValue({
        data: { user: null },
        error: null,
      });

      (createServerClient as ReturnType<typeof vi.fn>).mockReturnValue({
        auth: { getUser: mockGetUser },
      });

      const { createMiddlewareClient } = await import('@/lib/supabase/middleware');

      const request = await createMockRequest();
      const result = await createMiddlewareClient(request);

      expect(result.response).toBeDefined();
      expect(result.response.cookies).toBeDefined();
    });

    it('returns null user and profile when SUPABASE_URL is missing', async () => {
      // Remove Supabase URL
      delete process.env.NEXT_PUBLIC_SUPABASE_URL;

      const { createMiddlewareClient } = await import('@/lib/supabase/middleware');

      const request = await createMockRequest();
      const result = await createMiddlewareClient(request);

      expect(result.user).toBeNull();
      expect(result.profile).toBeNull();
      expect(result.response).toBeDefined();
    });

    it('returns null user and profile when SUPABASE_ANON_KEY is missing', async () => {
      // Remove Supabase anon key
      delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

      const { createMiddlewareClient } = await import('@/lib/supabase/middleware');

      const request = await createMockRequest();
      const result = await createMiddlewareClient(request);

      expect(result.user).toBeNull();
      expect(result.profile).toBeNull();
      expect(result.response).toBeDefined();
    });
  });

  describe('updateSession with missing credentials', () => {
    it('returns response without calling Supabase when URL is missing', async () => {
      const { createServerClient } = await import('@supabase/ssr');

      // Remove Supabase URL
      delete process.env.NEXT_PUBLIC_SUPABASE_URL;

      const { updateSession } = await import('@/lib/supabase/middleware');

      const request = await createMockRequest();
      const response = await updateSession(request);

      expect(response).toBeDefined();
      expect(createServerClient).not.toHaveBeenCalled();
    });

    it('returns response without calling Supabase when anon key is missing', async () => {
      const { createServerClient } = await import('@supabase/ssr');

      // Remove Supabase anon key
      delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

      const { updateSession } = await import('@/lib/supabase/middleware');

      const request = await createMockRequest();
      const response = await updateSession(request);

      expect(response).toBeDefined();
      expect(createServerClient).not.toHaveBeenCalled();
    });
  });
});
