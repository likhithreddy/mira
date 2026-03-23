import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockGetAll = vi.fn().mockReturnValue([{ name: 'test', value: 'cookie' }]);
const mockSet = vi.fn();

vi.mock('next/headers', () => ({
  cookies: vi.fn().mockResolvedValue({
    getAll: mockGetAll,
    set: mockSet,
  }),
}));

type CookieOptions = { name: string; value: string; options?: object };
type ServerClientOptions = {
  cookies: {
    getAll: () => CookieOptions[];
    setAll: (cookies: CookieOptions[]) => void;
  };
};

let capturedCookieOptions: ServerClientOptions['cookies'] | null = null;

vi.mock('@supabase/ssr', () => ({
  createServerClient: vi.fn((_url, _key, options: ServerClientOptions) => {
    capturedCookieOptions = options.cookies;
    return {
      auth: {
        getUser: vi.fn().mockResolvedValue({ data: { user: null }, error: null }),
      },
    };
  }),
}));

describe('lib/supabase/server', () => {
  beforeEach(() => {
    vi.stubEnv('NEXT_PUBLIC_SUPABASE_URL', 'https://test.supabase.co');
    vi.stubEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY', 'test-anon-key');
    vi.clearAllMocks();
    capturedCookieOptions = null;
    mockGetAll.mockReturnValue([{ name: 'test', value: 'cookie' }]);
  });

  it('createClient() calls cookies() from next/headers', async () => {
    const { cookies } = await import('next/headers');
    const { createClient } = await import('../server');
    await createClient();
    expect(cookies).toHaveBeenCalledOnce();
  });

  it('createClient() returns an object with an auth property', async () => {
    const { createClient } = await import('../server');
    const client = await createClient();
    expect(client).toHaveProperty('auth');
  });

  it('createClient() does not throw when a mock cookie store is provided', async () => {
    const { createClient } = await import('../server');
    await expect(createClient()).resolves.not.toThrow();
  });

  it('cookie getAll() delegates to cookieStore.getAll()', async () => {
    const { createClient } = await import('../server');
    await createClient();
    expect(capturedCookieOptions).not.toBeNull();
    const result = capturedCookieOptions!.getAll();
    expect(mockGetAll).toHaveBeenCalled();
    expect(result).toEqual([{ name: 'test', value: 'cookie' }]);
  });

  it('cookie setAll() delegates to cookieStore.set() and swallows errors from Server Components', async () => {
    const { createClient } = await import('../server');
    await createClient();
    expect(capturedCookieOptions).not.toBeNull();
    // Normal case: set is called for each cookie
    capturedCookieOptions!.setAll([{ name: 'sb-token', value: 'abc', options: { httpOnly: true } }]);
    expect(mockSet).toHaveBeenCalledWith('sb-token', 'abc', { httpOnly: true });
    // Server Component error case: set throws but setAll swallows it
    mockSet.mockImplementationOnce(() => { throw new Error('Cannot set cookies in Server Component'); });
    expect(() =>
      capturedCookieOptions!.setAll([{ name: 'sb-token', value: 'xyz' }])
    ).not.toThrow();
  });
});
