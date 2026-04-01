import {
  createServerClient as createClient,
  type CookieOptions,
} from '@supabase/ssr';
import { cookies } from 'next/headers';
import type { Database } from '@/types/supabase';

type CookieToSet = { name: string; value: string; options: CookieOptions };

/**
 * Creates a Supabase client for use in Server Components, Server Actions,
 * and Route Handlers. Uses the anon key for RLS-protected queries.
 *
 * This function must be called within a request context where cookies() is available.
 */
export async function createServerClient() {
  const cookieStore = await cookies();

  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet: CookieToSet[]) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // The `setAll` method is called from a Server Component.
            // This can be ignored if you have middleware refreshing sessions.
          }
        },
      },
    }
  );
}
