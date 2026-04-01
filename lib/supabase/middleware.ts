import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import type { Database } from '@/types/supabase';

type CookieToSet = { name: string; value: string; options: CookieOptions };

/**
 * Updates the Supabase session by refreshing the auth token if expired.
 * Should be called from middleware to ensure session cookies are kept fresh.
 *
 * @param request - The incoming Next.js request
 * @returns NextResponse with updated session cookies
 */
export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: CookieToSet[]) {
          cookiesToSet.forEach(({ name, value }: CookieToSet) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }: CookieToSet) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // IMPORTANT: DO NOT remove this getUser() call.
  // It validates and refreshes the session. Without it, sessions won't be refreshed
  // and users may be logged out unexpectedly.
  await supabase.auth.getUser();

  return supabaseResponse;
}
