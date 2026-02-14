-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- USERS TABLE
CREATE TABLE IF NOT EXISTS public.user (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  full_name text NOT NULL,
  phone_number text,
  email text NOT NULL UNIQUE,
  password text NOT NULL, -- Note: Storing password here for legacy reasons, Auth handled by Supabase
  auth_id uuid DEFAULT auth.uid(),
  updated_at timestamp with time zone,
  role text NOT NULL DEFAULT 'student'::text,
  bio text,
  profile_picture text,
  fcm_token text,
  CONSTRAINT user_pkey PRIMARY KEY (id)
);

-- COMPANY PROFILE
CREATE TABLE IF NOT EXISTS public.company_profile (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  website text,
  industry text,
  description text,
  user_id bigint REFERENCES public.user(id),
  CONSTRAINT company_profile_pkey PRIMARY KEY (id)
);

-- STUDENT PROFILE
CREATE TABLE IF NOT EXISTS public.student_profile (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  university text,
  major text,
  grad_year text,
  training_days numeric,
  user_id bigint REFERENCES public.user(id),
  cv_url text,
  github_url text,
  CONSTRAINT student_profile_pkey PRIMARY KEY (id)
);

-- OPPORTUNITY (Projects)
CREATE TABLE IF NOT EXISTS public.opportunity (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  title text,
  type text,
  description text,
  requirements text,
  deadline timestamp with time zone,
  is_paid boolean DEFAULT false,
  amount_of_money numeric,
  duration numeric,
  company_id bigint REFERENCES public.company_profile(id),
  image_url text,
  CONSTRAINT opportunity_pkey PRIMARY KEY (id)
);

-- APPLICATION (Applicants)
CREATE TABLE IF NOT EXISTS public.application (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  status text DEFAULT 'pending',
  opportunity_id bigint REFERENCES public.opportunity(id),
  cv text,
  proposal text,
  notes text,
  student_id bigint REFERENCES public.student_profile(id),
  CONSTRAINT application_pkey PRIMARY KEY (id)
);

-- OPTIONAL: STUDENT SKILLS (If needed)
CREATE TABLE IF NOT EXISTS public.student_skills (
  student_id bigint REFERENCES public.student_profile(id),
  created_at timestamp with time zone DEFAULT now(),
  skill_name text,
  PRIMARY KEY (student_id, skill_name)
);

-- RLS POLICIES (Basic - Open for now, secure later)
ALTER TABLE public.user ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.company_profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.opportunity ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.application ENABLE ROW LEVEL SECURITY;

-- Allow read access for authenticated users (Modify as needed)
CREATE POLICY "Enable read access for all users" ON public.user FOR SELECT USING (true);
CREATE POLICY "Enable insert for authenticated users only" ON public.user FOR INSERT WITH CHECK (auth.uid() = auth_id);

CREATE POLICY "Enable read access for all users" ON public.company_profile FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON public.student_profile FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON public.opportunity FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON public.application FOR SELECT USING (true);

-- Allow insert/update based on ownership (Simplified)
CREATE POLICY "Enable insert for authenticated users" ON public.opportunity FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Enable insert for authenticated users" ON public.application FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- User update policy
CREATE POLICY "Users can update own profile" ON public.user FOR UPDATE USING (auth.uid() = auth_id);

-- Company Profile policies
CREATE POLICY "Users can insert own company profile" ON public.company_profile FOR INSERT WITH CHECK (
  user_id IN (SELECT id FROM public.user WHERE auth_id = auth.uid())
);

CREATE POLICY "Users can update own company profile" ON public.company_profile FOR UPDATE USING (
  user_id IN (SELECT id FROM public.user WHERE auth_id = auth.uid())
);

-- Student Profile policies
CREATE POLICY "Users can insert own student profile" ON public.student_profile FOR INSERT WITH CHECK (
  user_id IN (SELECT id FROM public.user WHERE auth_id = auth.uid())
);

CREATE POLICY "Users can update own student profile" ON public.student_profile FOR UPDATE USING (
  user_id IN (SELECT id FROM public.user WHERE auth_id = auth.uid())
);
