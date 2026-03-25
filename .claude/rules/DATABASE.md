## Database Migration Rules

- Every schema change, RLS policy, or seed data change must be a raw SQL file in `supabase/migrations/`
- Naming convention: `<issue-number>_<short-description>.sql` — no timestamp prefix (e.g. `39_create_profiles_table.sql`)
- Each issue gets exactly one migration file; all schema changes for that issue go into that single file — never spread across multiple files for the same issue
- Never touch migration files from other issues — if working on issue #42, only `42_<description>.sql` may be created or edited
- Migrations are applied via the Supabase MCP tool only at PR-raise time, after all commits are complete and all tests pass — never earlier
- Never apply changes directly via Supabase Studio without a migration file first
