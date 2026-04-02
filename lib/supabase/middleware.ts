import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import type { Database } from '@/types/supabase';

type CookieToSet = { name: string; value: string; options: CookieOptions };

type Profile = {
  role: string;
  is_suspended: boolean;
};

type MiddlewareClientResult = {
  response: NextResponse;
  user: { id: string; email?: string } | null;
  profile: Profile | null;
};

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

  // If Supabase credentials are not configured, pass through without session refresh
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return supabaseResponse;
  }

  const supabase = createServerClient<Database>(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: CookieToSet[]) {
          cookiesToSet.forEach(({ name, value }: CookieToSet) => request.cookies.set(name, value));
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

/**
 * Creates a Supabase client for middleware use, validates session,
 * and fetches user profile data for route protection decisions.
 *
 * @param request - The incoming Next.js request
 * @returns Object containing response, user data, and profile data
 */
export async function createMiddlewareClient(
  request: NextRequest
): Promise<MiddlewareClientResult> {
  let supabaseResponse = NextResponse.next({
    request,
  });

  // If Supabase credentials are not configured, pass through without auth
  // This allows the app to run in development/testing without Supabase
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return { response: supabaseResponse, user: null, profile: null };
  }

  const supabase = createServerClient<Database>(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: CookieToSet[]) {
          cookiesToSet.forEach(({ name, value }: CookieToSet) => request.cookies.set(name, value));
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

  // Validate and refresh the session
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { response: supabaseResponse, user: null, profile: null };
  }

  // Fetch profile for role and suspension status
  const { data: profile } = await supabase
    .from('profiles')
    .select('role, is_suspended')
    .eq('id', user.id)
    .single();

  return {
    response: supabaseResponse,
    user: { id: user.id, email: user.email },
    profile: profile ?? null,
  };
}
