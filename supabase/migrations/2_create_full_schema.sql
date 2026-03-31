-- Issue #2: Full Supabase database schema
-- Creates all 10 tables, RLS policies, triggers, and storage bucket

-- ============================================================================
-- EXTENSIONS
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ============================================================================
-- TABLES
-- ============================================================================

-- 1. profiles - Extends auth.users with application-level data
CREATE TABLE profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  full_name text,
  role text NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  is_suspended boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- 2. user_resumes - Saved resume metadata
CREATE TABLE user_resumes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  file_name text NOT NULL,
  storage_path text NOT NULL,
  extracted_text text NOT NULL,
  is_default boolean DEFAULT false,
  uploaded_at timestamptz DEFAULT now()
);

-- 3. sessions - Interview session records
CREATE TABLE sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  resume_id uuid REFERENCES user_resumes(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  completed_at timestamptz,
  duration_secs integer,
  slider_value smallint NOT NULL CHECK (slider_value BETWEEN 1 AND 10),
  jd_text text NOT NULL,
  resume_text text NOT NULL,
  jd_role_title text,
  status text DEFAULT 'in_progress',
  overall_score numeric(3,2)
);

-- 4. transcripts - Conversation turns
CREATE TABLE transcripts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
  turn_index integer NOT NULL,
  speaker text NOT NULL,
  content text NOT NULL,
  question_id text,
  created_at timestamptz DEFAULT now(),
  UNIQUE (session_id, turn_index)
);

-- 5. reports - AI-generated performance reports
CREATE TABLE reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid NOT NULL UNIQUE REFERENCES sessions(id) ON DELETE CASCADE,
  overall_score numeric(3,2) NOT NULL,
  top_strengths text[] NOT NULL,
  top_improvements text[] NOT NULL,
  role_alignment_summary text NOT NULL,
  report_json jsonb NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- 6. session_feedback - User ratings
CREATE TABLE session_feedback (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid NOT NULL UNIQUE REFERENCES sessions(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  star_rating smallint NOT NULL CHECK (star_rating BETWEEN 1 AND 5),
  feedback_text text,
  created_at timestamptz DEFAULT now()
);

-- 7. ai_providers - AI provider configuration
CREATE TABLE ai_providers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  display_name text NOT NULL,
  is_active boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- 8. ai_provider_keys - Encrypted API keys
CREATE TABLE ai_provider_keys (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id uuid NOT NULL REFERENCES ai_providers(id) ON DELETE CASCADE,
  key_value_encrypted bytea NOT NULL,
  key_index integer NOT NULL,
  label text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now(),
  UNIQUE (provider_id, key_index)
);

-- 9. ai_call_logs - Gateway audit trail
CREATE TABLE ai_call_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id uuid NOT NULL REFERENCES ai_providers(id) ON DELETE CASCADE,
  key_index integer NOT NULL,
  call_type text NOT NULL,
  latency_ms integer NOT NULL,
  estimated_tokens integer,
  http_status smallint NOT NULL,
  error_message text,
  created_at timestamptz DEFAULT now()
);

-- 10. eval_results - LLM-as-judge results (intentionally anonymized - no user_id)
CREATE TABLE eval_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid NOT NULL UNIQUE REFERENCES sessions(id) ON DELETE CASCADE,
  overall_eval_score numeric(3,2) NOT NULL,
  question_quality_score smallint NOT NULL,
  question_quality_rationale text NOT NULL,
  calibration_score smallint NOT NULL,
  calibration_rationale text NOT NULL,
  followup_score smallint,
  followup_rationale text,
  report_accuracy_score smallint NOT NULL,
  report_accuracy_rationale text NOT NULL,
  tone_score smallint NOT NULL,
  tone_rationale text NOT NULL,
  provider_used text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- ============================================================================
-- ROW LEVEL SECURITY - Enable on all tables
-- ============================================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_resumes ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE transcripts ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE session_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_provider_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_call_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE eval_results ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- RLS POLICIES
-- ============================================================================

-- Helper function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$ LANGUAGE sql SECURITY DEFINER SET search_path = '';

-- profiles: Users can manage their own profile, admins can manage all
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id OR is_admin());

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id OR is_admin());

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can delete own profile"
  ON profiles FOR DELETE
  USING (auth.uid() = id OR is_admin());

-- user_resumes: Users can only access their own resumes
CREATE POLICY "Users can view own resumes"
  ON user_resumes FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own resumes"
  ON user_resumes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own resumes"
  ON user_resumes FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own resumes"
  ON user_resumes FOR DELETE
  USING (auth.uid() = user_id);

-- sessions: Users can only access their own sessions
CREATE POLICY "Users can view own sessions"
  ON sessions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own sessions"
  ON sessions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own sessions"
  ON sessions FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own sessions"
  ON sessions FOR DELETE
  USING (auth.uid() = user_id);

-- transcripts: Users can access transcripts for their own sessions
CREATE POLICY "Users can view own transcripts"
  ON transcripts FOR SELECT
  USING (auth.uid() = (SELECT user_id FROM sessions WHERE id = session_id));

CREATE POLICY "Users can insert own transcripts"
  ON transcripts FOR INSERT
  WITH CHECK (auth.uid() = (SELECT user_id FROM sessions WHERE id = session_id));

CREATE POLICY "Users can update own transcripts"
  ON transcripts FOR UPDATE
  USING (auth.uid() = (SELECT user_id FROM sessions WHERE id = session_id));

CREATE POLICY "Users can delete own transcripts"
  ON transcripts FOR DELETE
  USING (auth.uid() = (SELECT user_id FROM sessions WHERE id = session_id));

-- reports: Users can access reports for their own sessions
CREATE POLICY "Users can view own reports"
  ON reports FOR SELECT
  USING (auth.uid() = (SELECT user_id FROM sessions WHERE id = session_id));

CREATE POLICY "Users can insert own reports"
  ON reports FOR INSERT
  WITH CHECK (auth.uid() = (SELECT user_id FROM sessions WHERE id = session_id));

CREATE POLICY "Users can update own reports"
  ON reports FOR UPDATE
  USING (auth.uid() = (SELECT user_id FROM sessions WHERE id = session_id));

CREATE POLICY "Users can delete own reports"
  ON reports FOR DELETE
  USING (auth.uid() = (SELECT user_id FROM sessions WHERE id = session_id));

-- session_feedback: Users can only access their own feedback
CREATE POLICY "Users can view own feedback"
  ON session_feedback FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own feedback"
  ON session_feedback FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own feedback"
  ON session_feedback FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own feedback"
  ON session_feedback FOR DELETE
  USING (auth.uid() = user_id);

-- ai_providers: Admin only
CREATE POLICY "Admins can view providers"
  ON ai_providers FOR SELECT
  USING (is_admin());

CREATE POLICY "Admins can insert providers"
  ON ai_providers FOR INSERT
  WITH CHECK (is_admin());

CREATE POLICY "Admins can update providers"
  ON ai_providers FOR UPDATE
  USING (is_admin());

CREATE POLICY "Admins can delete providers"
  ON ai_providers FOR DELETE
  USING (is_admin());

-- ai_provider_keys: Admin only
CREATE POLICY "Admins can view provider keys"
  ON ai_provider_keys FOR SELECT
  USING (is_admin());

CREATE POLICY "Admins can insert provider keys"
  ON ai_provider_keys FOR INSERT
  WITH CHECK (is_admin());

CREATE POLICY "Admins can update provider keys"
  ON ai_provider_keys FOR UPDATE
  USING (is_admin());

CREATE POLICY "Admins can delete provider keys"
  ON ai_provider_keys FOR DELETE
  USING (is_admin());

-- ai_call_logs: Admin SELECT only (INSERT via service role)
CREATE POLICY "Admins can view call logs"
  ON ai_call_logs FOR SELECT
  USING (is_admin());

-- eval_results: Admin SELECT only (INSERT via service role)
CREATE POLICY "Admins can view eval results"
  ON eval_results FOR SELECT
  USING (is_admin());

-- ============================================================================
-- TRIGGERS
-- ============================================================================

-- 1. auto_create_profile: Creates profiles row on auth.users INSERT
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role, is_suspended)
  VALUES (NEW.id, NEW.email, 'user', false);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- 2. enforce_single_default: Ensures only one default resume per user
CREATE OR REPLACE FUNCTION enforce_single_default_resume()
RETURNS trigger AS $$
BEGIN
  IF NEW.is_default = true THEN
    UPDATE public.user_resumes
    SET is_default = false
    WHERE user_id = NEW.user_id
      AND id != NEW.id
      AND is_default = true;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';

CREATE TRIGGER enforce_single_default
  BEFORE INSERT OR UPDATE ON user_resumes
  FOR EACH ROW
  WHEN (NEW.is_default = true)
  EXECUTE FUNCTION enforce_single_default_resume();

-- 3. enforce_single_active_provider: Ensures only one active provider
CREATE OR REPLACE FUNCTION enforce_single_active_provider()
RETURNS trigger AS $$
BEGIN
  IF NEW.is_active = true THEN
    UPDATE public.ai_providers
    SET is_active = false
    WHERE id != NEW.id
      AND is_active = true;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';

CREATE TRIGGER enforce_single_active
  BEFORE INSERT OR UPDATE ON ai_providers
  FOR EACH ROW
  WHEN (NEW.is_active = true)
  EXECUTE FUNCTION enforce_single_active_provider();

-- ============================================================================
-- STORAGE BUCKET
-- ============================================================================

-- Create private resumes bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('resumes', 'resumes', false)
ON CONFLICT (id) DO NOTHING;

-- Storage RLS: Users can only access their own folder
CREATE POLICY "Users can upload to own folder"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'resumes'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can view own files"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'resumes'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can update own files"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'resumes'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can delete own files"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'resumes'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );
