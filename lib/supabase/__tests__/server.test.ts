import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockGetAll = vi.fn().mockReturnValue([]);
const mockSet = vi.fn();

vi.mock('next/headers', () => ({
  cookies: vi.fn().mockResolvedValue({
    getAll: mockGetAll,
    set: mockSet,
  }),
}));

vi.mock('@supabase/ssr', () => ({
  createServerClient: vi.fn(() => ({
    auth: {
      getUser: vi.fn().mockResolvedValue({ data: { user: null }, error: null }),
    },
  })),
}));

describe('lib/supabase/server', () => {
  beforeEach(() => {
    vi.stubEnv('NEXT_PUBLIC_SUPABASE_URL', 'https://test.supabase.co');
    vi.stubEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY', 'test-anon-key');
    vi.clearAllMocks();
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
});
