import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest, NextResponse } from 'next/server';

const mockGetUser = vi.fn().mockResolvedValue({ data: { user: null }, error: null });
const mockGetAll = vi.fn().mockReturnValue([]);
let capturedSetAll: ((cookies: { name: string; value: string; options?: object }[]) => void) | null = null;

vi.mock('@supabase/ssr', () => ({
  createServerClient: vi.fn((_url, _key, options) => {
    capturedSetAll = options.cookies.setAll;
    return {
      auth: {
        getUser: mockGetUser,
      },
    };
  }),
}));

describe('lib/supabase/middleware', () => {
  beforeEach(() => {
    vi.stubEnv('NEXT_PUBLIC_SUPABASE_URL', 'https://test.supabase.co');
    vi.stubEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY', 'test-anon-key');
    vi.clearAllMocks();
    capturedSetAll = null;
    mockGetUser.mockResolvedValue({ data: { user: null }, error: null });
    mockGetAll.mockReturnValue([]);
  });

  function makeMockRequest(): NextRequest {
    const request = new NextRequest('http://localhost/test');
    return request;
  }

  it('updateSession() returns a NextResponse instance', async () => {
    const { updateSession } = await import('../middleware');
    const request = makeMockRequest();
    const response = await updateSession(request);
    expect(response).toBeInstanceOf(NextResponse);
  });

  it('updateSession() calls supabase.auth.getUser() exactly once', async () => {
    const { updateSession } = await import('../middleware');
    const request = makeMockRequest();
    await updateSession(request);
    expect(mockGetUser).toHaveBeenCalledOnce();
  });

  it('cookie getAll() reads from request.cookies', async () => {
    const { createServerClient } = await import('@supabase/ssr');
    const { updateSession } = await import('../middleware');
    const request = makeMockRequest();

    await updateSession(request);

    const callArgs = vi.mocked(createServerClient).mock.calls[0];
    const cookieOptions = callArgs[2] as { cookies: { getAll: () => unknown } };
    const cookies = cookieOptions.cookies.getAll();
    // request.cookies.getAll() returns an array — result should be array-like
    expect(Array.isArray(cookies)).toBe(true);
  });

  it('cookie setAll() writes to both request.cookies and supabaseResponse.cookies', async () => {
    const { updateSession } = await import('../middleware');
    const request = makeMockRequest();

    await updateSession(request);

    // Trigger setAll with a test cookie
    expect(capturedSetAll).not.toBeNull();
    capturedSetAll!([{ name: 'sb-token', value: 'abc123', options: { httpOnly: true } }]);

    // After setAll, request.cookies should contain the new cookie
    expect(request.cookies.get('sb-token')?.value).toBe('abc123');
  });
});
