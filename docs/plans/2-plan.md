# Issue #2 Implementation Plan: Supabase Database Schema

## Summary

Create the full Supabase database schema with 10 tables, RLS policies, triggers, and storage bucket.

## Files to Create/Modify

| File                                           | Action | Purpose                          |
| ---------------------------------------------- | ------ | -------------------------------- |
| `supabase/migrations/2_create_full_schema.sql` | Create | Single migration with all schema |

## Implementation Steps

### Step 1: Create Migration File Structure

Create `supabase/migrations/2_create_full_schema.sql` with sections:

1. Enable pgcrypto extension
2. Create tables (in dependency order)
3. Enable RLS on all tables
4. Create RLS policies
5. Create triggers
6. Create storage bucket with RLS

### Step 2: Tables (Dependency Order)

1. `profiles` (depends on auth.users)
2. `user_resumes` (depends on profiles)
3. `sessions` (depends on profiles, user_resumes)
4. `transcripts` (depends on sessions)
5. `reports` (depends on sessions)
6. `session_feedback` (depends on sessions, profiles)
7. `ai_providers` (no dependencies)
8. `ai_provider_keys` (depends on ai_providers)
9. `ai_call_logs` (depends on ai_providers)
10. `eval_results` (depends on sessions)

### Step 3: RLS Policies

For each table:

- Enable RLS: `ALTER TABLE <table> ENABLE ROW LEVEL SECURITY;`
- Create policies for SELECT, INSERT, UPDATE, DELETE as needed

### Step 4: Triggers

1. `auto_create_profile`:
   - Function: Creates profiles row on auth.users INSERT
   - Trigger: AFTER INSERT ON auth.users

2. `enforce_single_default`:
   - Function: Unsets other is_default when setting new default
   - Trigger: BEFORE INSERT OR UPDATE ON user_resumes

3. `enforce_single_active_provider`:
   - Function: Unsets other is_active when activating provider
   - Trigger: BEFORE INSERT OR UPDATE ON ai_providers

### Step 5: Storage Bucket

- Create private bucket `resumes`
- RLS policy: `(storage.foldername(name))[1] = auth.uid()::text`

## Constraints from Issue ACs

- `profiles.role`: `text NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin'))`
- `profiles.is_suspended`: `boolean NOT NULL DEFAULT false`
- `sessions.slider_value`: `smallint NOT NULL CHECK (slider_value BETWEEN 1 AND 10)`
- `ai_provider_keys.key_value_encrypted`: `bytea NOT NULL`
- `eval_results`: No `user_id` column (intentionally anonymized)
- No `interview_mode` column in sessions

## External Actions (Manual)

1. Create production Supabase project
2. Create staging Supabase project
3. Add `SUPABASE_TEST_URL` to GitHub secrets
4. Add `SUPABASE_TEST_ANON_KEY` to GitHub secrets

## Test Verification

After migration, verify:

1. Insert auth.users -> auto-creates profiles
2. Set is_default on second resume -> first becomes false
3. Set is_active on second provider -> first becomes false
4. INSERT sessions with slider_value=0 -> constraint error
5. INSERT sessions with slider_value=11 -> constraint error
6. SELECT profiles as different user -> 0 rows
7. SELECT eval_results as regular user -> 0 rows
8. SELECT ai_providers as regular user -> 0 rows
