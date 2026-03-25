## Security Rules (Non-Negotiable)

- RLS enabled on every Supabase table — users can only read/write their own rows
- Admin routes and tables require `role = admin` checked at both middleware AND RLS layer
- `SUPABASE_SERVICE_ROLE_KEY` and all AI provider keys: server-side API routes only — never in any `NEXT_PUBLIC_` variable
- All AI calls proxied through the gateway — no provider SDK called from the client
- All DB queries via the typed Supabase JS client — no raw SQL strings built from user input
- Double auth verification: middleware checks session at edge; route handler re-verifies with `supabase.auth.getUser()` as defense-in-depth
- TruffleHog secrets scanning blocks any PR that contains a committed secret
