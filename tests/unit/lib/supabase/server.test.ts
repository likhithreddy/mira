import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Mock @supabase/ssr
vi.mock('@supabase/ssr', () => ({
  createServerClient: vi.fn(() => ({
    auth: {
      getUser: vi.fn().mockResolvedValue({ data: { user: null }, error: null }),
      getSession: vi.fn().mockResolvedValue({
        data: { session: null },
        error: null,
      }),
    },
    from: vi.fn(),
  })),
}));

// Mock next/headers
const mockCookieStore = {
  getAll: vi.fn(() => []),
  set: vi.fn(),
};

vi.mock('next/headers', () => ({
  cookies: vi.fn(() => Promise.resolve(mockCookieStore)),
}));

describe('lib/supabase/server', () => {
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

  it('createServerClient() returns a Supabase client instance without throwing', async () => {
    const { createServerClient } = await import('@/lib/supabase/server');

    const client = await createServerClient();

    expect(client).toBeDefined();
    expect(client).toHaveProperty('auth');
    expect(client).toHaveProperty('from');
  });

  it('createServerClient() calls SSR factory with cookie handlers', async () => {
    const { createServerClient: mockFactory } = await import('@supabase/ssr');
    const { createServerClient } = await import('@/lib/supabase/server');

    await createServerClient();

    expect(mockFactory).toHaveBeenCalledWith(
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

  it('createServerClient() with anon key does not grant service role privileges', async () => {
    const { createServerClient } = await import('@/lib/supabase/server');

    const client = await createServerClient();

    // Verify the client was created with anon key, not service role
    const { createServerClient: mockFactory } = await import('@supabase/ssr');
    expect(mockFactory).toHaveBeenCalledWith(
      expect.any(String),
      'test-anon-key', // anon key, not service role key
      expect.any(Object)
    );

    // The client should have auth methods but not admin capabilities
    expect(client.auth).toBeDefined();
  });

  it('cookie getAll returns cookies from cookie store', async () => {
    const { createServerClient: mockFactory } = await import('@supabase/ssr');
    const { createServerClient } = await import('@/lib/supabase/server');

    mockCookieStore.getAll.mockReturnValue([
      { name: 'sb-access-token', value: 'test-token' },
    ]);

    await createServerClient();

    // Extract the cookies config from the mock call
    const callArgs = (mockFactory as ReturnType<typeof vi.fn>).mock.calls[0];
    const cookiesConfig = callArgs[2].cookies;

    const cookies = cookiesConfig.getAll();
    expect(cookies).toEqual([{ name: 'sb-access-token', value: 'test-token' }]);
  });
});
