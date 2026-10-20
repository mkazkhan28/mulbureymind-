-- =============================================================================
-- BDS Study Hub: PostgreSQL Database Migration & Security Schema
-- Platform: Supabase PostgreSQL with Row Level Security (RLS)
-- Target: BDS 2nd Year Dental Study Platform (Pakistan)
-- =============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- -----------------------------------------------------------------------------
-- 1. Profiles (Linked to Supabase Auth users)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  college_name TEXT,
  academic_year TEXT DEFAULT 'bds-2',
  phone_number TEXT,
  role TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'admin', 'moderator')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for role lookup
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);

-- Helper security definer function to check if current user is an admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$;

-- -----------------------------------------------------------------------------
-- 2. Academic Years
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.academic_years (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT false,
  description TEXT,
  display_order INT NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- 3. Subjects
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.subjects (
  id TEXT PRIMARY KEY,
  year_id TEXT NOT NULL REFERENCES public.academic_years(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  code TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  icon TEXT NOT NULL DEFAULT '📚',
  description TEXT,
  color TEXT,
  display_order INT NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_subjects_year ON public.subjects(year_id);

-- -----------------------------------------------------------------------------
-- 4. Topics
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.topics (
  id TEXT PRIMARY KEY,
  subject_id TEXT NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT,
  high_yield BOOLEAN NOT NULL DEFAULT false,
  display_order INT NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (subject_id, slug)
);

CREATE INDEX IF NOT EXISTS idx_topics_subject ON public.topics(subject_id);

-- -----------------------------------------------------------------------------
-- 5. Questions (Past-Paper & Practice MCQs)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  subject_id TEXT NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
  topic_id TEXT REFERENCES public.topics(id) ON DELETE SET NULL,
  year_source TEXT, -- e.g. "UHS BDS Annual 2023", "NUMS 2022"
  question_text TEXT NOT NULL,
  explanation TEXT NOT NULL,
  difficulty TEXT NOT NULL DEFAULT 'Medium' CHECK (difficulty IN ('Easy', 'Medium', 'Hard')),
  is_past_paper BOOLEAN NOT NULL DEFAULT true,
  is_published BOOLEAN NOT NULL DEFAULT true,
  image_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_questions_subject ON public.questions(subject_id);
CREATE INDEX IF NOT EXISTS idx_questions_topic ON public.questions(topic_id);
CREATE INDEX IF NOT EXISTS idx_questions_published ON public.questions(is_published);

-- -----------------------------------------------------------------------------
-- 6. Answer Options (Configurable, 4+ options per question)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.answer_options (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  question_id UUID NOT NULL REFERENCES public.questions(id) ON DELETE CASCADE,
  option_letter CHAR(1) NOT NULL, -- 'A', 'B', 'C', 'D'
  option_text TEXT NOT NULL,
  is_correct BOOLEAN NOT NULL DEFAULT false,
  display_order INT NOT NULL DEFAULT 1
);

CREATE INDEX IF NOT EXISTS idx_options_question ON public.answer_options(question_id);

-- -----------------------------------------------------------------------------
-- 7. Quiz Attempts & Responses
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.quiz_attempts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  subject_id TEXT REFERENCES public.subjects(id) ON DELETE SET NULL,
  topic_id TEXT REFERENCES public.topics(id) ON DELETE SET NULL,
  score INT NOT NULL DEFAULT 0,
  total_questions INT NOT NULL DEFAULT 0,
  percentage INT NOT NULL DEFAULT 0,
  mode TEXT NOT NULL DEFAULT 'tutor' CHECK (mode IN ('tutor', 'exam')),
  passed BOOLEAN NOT NULL DEFAULT false,
  time_spent_seconds INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_quiz_attempts_user ON public.quiz_attempts(user_id);

CREATE TABLE IF NOT EXISTS public.quiz_responses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  attempt_id UUID NOT NULL REFERENCES public.quiz_attempts(id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES public.questions(id) ON DELETE CASCADE,
  selected_option_id UUID REFERENCES public.answer_options(id) ON DELETE SET NULL,
  is_correct BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_quiz_responses_attempt ON public.quiz_responses(attempt_id);

-- -----------------------------------------------------------------------------
-- 8. Digital Flashcards & Progress
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.flashcard_decks (
  id TEXT PRIMARY KEY,
  subject_id TEXT NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.flashcards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  deck_id TEXT NOT NULL REFERENCES public.flashcard_decks(id) ON DELETE CASCADE,
  subject_id TEXT NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
  front_text TEXT NOT NULL,
  back_text TEXT NOT NULL,
  clinical_note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_flashcards_deck ON public.flashcards(deck_id);

CREATE TABLE IF NOT EXISTS public.flashcard_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  flashcard_id UUID NOT NULL REFERENCES public.flashcards(id) ON DELETE CASCADE,
  status TEXT NOT NULL CHECK (status IN ('mastered', 'review')),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, flashcard_id)
);

CREATE INDEX IF NOT EXISTS idx_flashcard_progress_user ON public.flashcard_progress(user_id);

-- -----------------------------------------------------------------------------
-- 9. PDF & PowerPoint Lecture Resources
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.study_resources (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  subject_id TEXT NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_type TEXT NOT NULL CHECK (file_type IN ('PDF', 'PPTX')),
  file_size TEXT NOT NULL,
  author TEXT NOT NULL DEFAULT 'BDS Study Hub',
  is_premium BOOLEAN NOT NULL DEFAULT true,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_resources_subject ON public.study_resources(subject_id);

-- -----------------------------------------------------------------------------
-- 10. Memberships & Payments
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.membership_plans (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  price_pkr INT NOT NULL DEFAULT 0,
  duration_months INT NOT NULL DEFAULT 12,
  description TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.memberships (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  plan_id TEXT NOT NULL REFERENCES public.membership_plans(id),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'expired', 'cancelled', 'trial')),
  starts_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_memberships_user ON public.memberships(user_id);
CREATE INDEX IF NOT EXISTS idx_memberships_status ON public.memberships(status);

CREATE TABLE IF NOT EXISTS public.payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  plan_id TEXT NOT NULL REFERENCES public.membership_plans(id),
  amount_pkr INT NOT NULL,
  provider TEXT NOT NULL CHECK (provider IN ('jazzcash', 'easypaisa', 'card', 'ibft', 'manual')),
  provider_tx_id TEXT UNIQUE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_payments_user ON public.payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_tx ON public.payments(provider_tx_id);

-- -----------------------------------------------------------------------------
-- 11. Saved / Bookmarked Questions
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.saved_questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES public.questions(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, question_id)
);

CREATE INDEX IF NOT EXISTS idx_saved_questions_user ON public.saved_questions(user_id);

-- =============================================================================
-- AUTOMATED USER REGISTRATION TRIGGER
-- Automatically creates a public.profiles entry whenever a user signs up
-- =============================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, college_name, academic_year, phone_number, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'BDS Student'),
    COALESCE(NEW.raw_user_meta_data->>'college_name', 'Dental College'),
    COALESCE(NEW.raw_user_meta_data->>'academic_year', 'bds-2'),
    COALESCE(NEW.raw_user_meta_data->>'phone_number', ''),
    'student'
  );

  -- Assign Free Starter Plan automatically upon sign-up
  INSERT INTO public.memberships (user_id, plan_id, status, starts_at, expires_at)
  VALUES (
    NEW.id,
    'plan-free',
    'active',
    NOW(),
    NOW() + INTERVAL '10 years'
  );

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =============================================================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.academic_years ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.answer_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.flashcard_decks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.flashcards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.flashcard_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.study_resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.membership_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_questions ENABLE ROW LEVEL SECURITY;

-- 1. Profiles: Students can read their own profile, admins can read all
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id OR public.is_admin());

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id AND role = (SELECT role FROM public.profiles WHERE id = auth.uid())); -- Prevents user from escalating their own role

CREATE POLICY "Admins can update all profiles"
  ON public.profiles FOR ALL
  USING (public.is_admin());

-- 2. Educational Curricula (Read-only for public, writable only by admins)
CREATE POLICY "Anyone can view active academic years"
  ON public.academic_years FOR SELECT
  USING (true);

CREATE POLICY "Only admins manage academic years"
  ON public.academic_years FOR ALL
  USING (public.is_admin());

CREATE POLICY "Anyone can view subjects"
  ON public.subjects FOR SELECT
  USING (true);

CREATE POLICY "Only admins manage subjects"
  ON public.subjects FOR ALL
  USING (public.is_admin());

CREATE POLICY "Anyone can view topics"
  ON public.topics FOR SELECT
  USING (true);

CREATE POLICY "Only admins manage topics"
  ON public.topics FOR ALL
  USING (public.is_admin());

-- 3. Questions & Answer Options
CREATE POLICY "Anyone can view published questions"
  ON public.questions FOR SELECT
  USING (is_published = true OR public.is_admin());

CREATE POLICY "Only admins manage questions"
  ON public.questions FOR ALL
  USING (public.is_admin());

CREATE POLICY "Anyone can view answer options"
  ON public.answer_options FOR SELECT
  USING (true);

CREATE POLICY "Only admins manage answer options"
  ON public.answer_options FOR ALL
  USING (public.is_admin());

-- 4. Quiz Attempts & Responses (Private to the authenticated student)
CREATE POLICY "Students can view own quiz attempts"
  ON public.quiz_attempts FOR SELECT
  USING (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "Students can insert own quiz attempts"
  ON public.quiz_attempts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Students can view own quiz responses"
  ON public.quiz_responses FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.quiz_attempts
      WHERE quiz_attempts.id = quiz_responses.attempt_id
      AND (quiz_attempts.user_id = auth.uid() OR public.is_admin())
    )
  );

CREATE POLICY "Students can insert own quiz responses"
  ON public.quiz_responses FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.quiz_attempts
      WHERE quiz_attempts.id = quiz_responses.attempt_id
      AND quiz_attempts.user_id = auth.uid()
    )
  );

-- 5. Flashcards
CREATE POLICY "Anyone can view flashcards"
  ON public.flashcard_decks FOR SELECT
  USING (true);

CREATE POLICY "Only admins manage flashcard decks"
  ON public.flashcard_decks FOR ALL
  USING (public.is_admin());

CREATE POLICY "Anyone can view cards"
  ON public.flashcards FOR SELECT
  USING (true);

CREATE POLICY "Only admins manage flashcards"
  ON public.flashcards FOR ALL
  USING (public.is_admin());

CREATE POLICY "Students can view and update own flashcard progress"
  ON public.flashcard_progress FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 6. Study Resources
CREATE POLICY "Anyone can view resource metadata"
  ON public.study_resources FOR SELECT
  USING (true);

CREATE POLICY "Only admins manage study resources"
  ON public.study_resources FOR ALL
  USING (public.is_admin());

-- 7. Membership Plans & Subscriptions
CREATE POLICY "Anyone can view membership plans"
  ON public.membership_plans FOR SELECT
  USING (is_active = true OR public.is_admin());

CREATE POLICY "Students view own membership"
  ON public.memberships FOR SELECT
  USING (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "Students view own payments"
  ON public.payments FOR SELECT
  USING (auth.uid() = user_id OR public.is_admin());

-- Modifications to memberships/payments are strictly server-side (Service Role only) or admin
CREATE POLICY "Admins manage memberships"
  ON public.memberships FOR ALL
  USING (public.is_admin());

CREATE POLICY "Admins manage payments"
  ON public.payments FOR ALL
  USING (public.is_admin());

-- 8. Saved Questions
CREATE POLICY "Students manage own saved questions"
  ON public.saved_questions FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
