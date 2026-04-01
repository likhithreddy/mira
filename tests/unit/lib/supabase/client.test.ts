import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Mock @supabase/ssr before importing the module under test
vi.mock('@supabase/ssr', () => ({
  createBrowserClient: vi.fn(() => ({
    auth: {
      getUser: vi.fn(),
      getSession: vi.fn(),
    },
    from: vi.fn(),
  })),
}));

describe('lib/supabase/client', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.resetModules();
    process.env = {
      ...originalEnv,
      NEXT_PUBLIC_SUPABASE_URL: 'https://test.supabase.co',
      NEXT_PUBLIC_SUPABASE_ANON_KEY: 'test-anon-key',
    };
  });

  afterEach(() => {
    process.env = originalEnv;
    vi.clearAllMocks();
  });

  it('createBrowserClient() returns a Supabase client instance without throwing', async () => {
    const { createBrowserClient } = await import('@/lib/supabase/client');

    const client = createBrowserClient();

    expect(client).toBeDefined();
    expect(client).toHaveProperty('auth');
    expect(client).toHaveProperty('from');
  });

  it('createBrowserClient() calls SSR factory with correct env vars', async () => {
    const { createBrowserClient: mockFactory } = await import('@supabase/ssr');
    const { createBrowserClient } = await import('@/lib/supabase/client');

    createBrowserClient();

    expect(mockFactory).toHaveBeenCalledWith('https://test.supabase.co', 'test-anon-key');
  });

  it('createBrowserClient() can be called multiple times without error', async () => {
    const { createBrowserClient } = await import('@/lib/supabase/client');

    expect(() => {
      createBrowserClient();
      createBrowserClient();
      createBrowserClient();
    }).not.toThrow();
  });
});
