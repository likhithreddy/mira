# Issue #2 Exploration: Supabase Database Schema

## Overview

This issue requires creating the full Supabase database schema including 10 tables, RLS policies, 3 triggers, and a private storage bucket.

## Tables (10 total)

### User Domain

1. **profiles** - Extends auth.users with app-level data
   - id (uuid, PK, FK -> auth.users)
   - email (text, NOT NULL)
   - full_name (text, nullable)
   - role (text, NOT NULL, DEFAULT 'user', CHECK IN ('user', 'admin'))
   - is_suspended (boolean, NOT NULL, DEFAULT false)
   - created_at (timestamptz, DEFAULT now())

2. **user_resumes** - Saved resume metadata
   - id (uuid, PK, DEFAULT gen_random_uuid())
   - user_id (uuid, NOT NULL, FK -> profiles)
   - file_name (text, NOT NULL)
   - storage_path (text, NOT NULL)
   - extracted_text (text, NOT NULL)
   - is_default (boolean, DEFAULT false)
   - uploaded_at (timestamptz, DEFAULT now())

### Session Domain

3. **sessions** - Interview session records
   - id (uuid, PK, DEFAULT gen_random_uuid())
   - user_id (uuid, NOT NULL, FK -> profiles)
   - resume_id (uuid, nullable, FK -> user_resumes)
   - created_at (timestamptz, DEFAULT now())
   - completed_at (timestamptz, nullable)
   - duration_secs (integer, nullable)
   - slider_value (smallint, NOT NULL, CHECK BETWEEN 1 AND 10)
   - jd_text (text, NOT NULL)
   - resume_text (text, NOT NULL)
   - jd_role_title (text, nullable)
   - status (text, DEFAULT 'in_progress')
   - overall_score (numeric(3,2), nullable)

4. **transcripts** - Conversation turns
   - id (uuid, PK, DEFAULT gen_random_uuid())
   - session_id (uuid, NOT NULL, FK -> sessions)
   - turn_index (integer, NOT NULL)
   - speaker (text, NOT NULL)
   - content (text, NOT NULL)
   - question_id (text, nullable)
   - created_at (timestamptz, DEFAULT now())

5. **reports** - AI-generated performance reports
   - id (uuid, PK, DEFAULT gen_random_uuid())
   - session_id (uuid, NOT NULL, FK -> sessions, UNIQUE)
   - overall_score (numeric(3,2), NOT NULL)
   - top_strengths (text[], NOT NULL)
   - top_improvements (text[], NOT NULL)
   - role_alignment_summary (text, NOT NULL)
   - report_json (jsonb, NOT NULL)
   - created_at (timestamptz, DEFAULT now())

6. **session_feedback** - User ratings
   - id (uuid, PK, DEFAULT gen_random_uuid())
   - session_id (uuid, NOT NULL, FK -> sessions, UNIQUE)
   - user_id (uuid, NOT NULL, FK -> profiles)
   - star_rating (smallint, NOT NULL, CHECK BETWEEN 1 AND 5)
   - feedback_text (text, nullable)
   - created_at (timestamptz, DEFAULT now())

### Infrastructure Domain

7. **ai_providers** - AI provider config
   - id (uuid, PK, DEFAULT gen_random_uuid())
   - name (text, NOT NULL, UNIQUE)
   - display_name (text, NOT NULL)
   - is_active (boolean, NOT NULL, DEFAULT false)
   - created_at (timestamptz, DEFAULT now())

8. **ai_provider_keys** - Encrypted API keys
   - id (uuid, PK, DEFAULT gen_random_uuid())
   - provider_id (uuid, NOT NULL, FK -> ai_providers)
   - key_value_encrypted (bytea, NOT NULL)
   - key_index (integer, NOT NULL)
   - label (text, nullable)
   - is_active (boolean, NOT NULL, DEFAULT true)
   - created_at (timestamptz, DEFAULT now())

9. **ai_call_logs** - Gateway audit trail
   - id (uuid, PK, DEFAULT gen_random_uuid())
   - provider_id (uuid, NOT NULL, FK -> ai_providers)
   - key_index (integer, NOT NULL)
   - call_type (text, NOT NULL)
   - latency_ms (integer, NOT NULL)
   - estimated_tokens (integer, nullable)
   - http_status (smallint, NOT NULL)
   - error_message (text, nullable)
   - created_at (timestamptz, DEFAULT now())

10. **eval_results** - LLM-as-judge results (anonymized)
    - id (uuid, PK, DEFAULT gen_random_uuid())
    - session_id (uuid, NOT NULL, FK -> sessions, UNIQUE)
    - overall_eval_score (numeric(3,2), NOT NULL)
    - question_quality_score (smallint, NOT NULL)
    - question_quality_rationale (text, NOT NULL)
    - calibration_score (smallint, NOT NULL)
    - calibration_rationale (text, NOT NULL)
    - followup_score (smallint, nullable)
    - followup_rationale (text, nullable)
    - report_accuracy_score (smallint, NOT NULL)
    - report_accuracy_rationale (text, NOT NULL)
    - tone_score (smallint, NOT NULL)
    - tone_rationale (text, NOT NULL)
    - provider_used (text, NOT NULL)
    - created_at (timestamptz, DEFAULT now())

## RLS Policies

| Table | Access | Condition |
|-------|--------|-----------|
| profiles | User: all ops | auth.uid() = id |
| profiles | Admin: all ops | auth.uid() = id OR role = 'admin' |
| user_resumes | User: all ops | auth.uid() = user_id |
| sessions | User: all ops | auth.uid() = user_id |
| transcripts | User: all ops | auth.uid() = (SELECT user_id FROM sessions WHERE id = session_id) |
| reports | User: all ops | auth.uid() = (SELECT user_id FROM sessions WHERE id = session_id) |
| session_feedback | User: all ops | auth.uid() = user_id |
| eval_results | Admin: SELECT only | role = 'admin' |
| ai_providers | Admin: all ops | role = 'admin' |
| ai_provider_keys | Admin: all ops | role = 'admin' |
| ai_call_logs | Admin: SELECT only | role = 'admin' |

## Triggers (3 total)

1. **auto_create_profile** - On auth.users INSERT, creates profiles row
2. **enforce_single_default** - On user_resumes INSERT/UPDATE, unsets other is_default
3. **enforce_single_active_provider** - On ai_providers INSERT/UPDATE, unsets other is_active

## Storage

- Private bucket: `resumes`
- RLS: Users can only access paths prefixed with their auth.uid()

## Migration File Strategy

Per DATABASE.md rules:
- Single migration file: `2_create_full_schema.sql`
- Contains: extension, all tables, all RLS policies, all triggers, storage bucket
