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
});
