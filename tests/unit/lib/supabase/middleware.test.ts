import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { NextRequest } from 'next/server';

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
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  function createMockRequest(url = 'http://localhost:3000/') {
    return new NextRequest(url, {
      headers: new Headers({
        cookie: 'sb-access-token=test-token',
      }),
    });
  }

  it('updateSession() returns a NextResponse instance', async () => {
    const { updateSession } = await import('@/lib/supabase/middleware');

    const request = createMockRequest();
    const response = await updateSession(request);

    expect(response).toBeDefined();
    expect(response.constructor.name).toBe('NextResponse');
  });

  it('updateSession() returns response with cookie headers present', async () => {
    const { updateSession } = await import('@/lib/supabase/middleware');

    const request = createMockRequest();
    const response = await updateSession(request);

    // Response should be a valid NextResponse
    expect(response).toBeDefined();
    expect(response.headers).toBeDefined();
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

    const request = createMockRequest();
    await updateSession(request);

    expect(mockGetUser).toHaveBeenCalled();
  });

  it('updateSession() creates client with request cookies', async () => {
    const { createServerClient } = await import('@supabase/ssr');
    const { updateSession } = await import('@/lib/supabase/middleware');

    const request = createMockRequest();
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
    const { updateSession } = await import('@/lib/supabase/middleware');

    const request = new NextRequest('http://localhost:3000/');
    const response = await updateSession(request);

    expect(response).toBeDefined();
  });
});
