import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@supabase/ssr', () => ({
  createBrowserClient: vi.fn(() => ({
    auth: {
      getUser: vi.fn().mockResolvedValue({ data: { user: null }, error: null }),
    },
  })),
}));

describe('lib/supabase/client', () => {
  beforeEach(() => {
    vi.stubEnv('NEXT_PUBLIC_SUPABASE_URL', 'https://test.supabase.co');
    vi.stubEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY', 'test-anon-key');
  });

  it('createClient() returns an object with an auth property', async () => {
    const { createClient } = await import('../client');
    const client = createClient();
    expect(client).toHaveProperty('auth');
  });

  it('createClient() does not throw when env vars are set', async () => {
    const { createClient } = await import('../client');
    expect(() => createClient()).not.toThrow();
  });
});
