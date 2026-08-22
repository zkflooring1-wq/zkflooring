-- Create Services Table
CREATE TABLE public.services (
  slug text PRIMARY KEY,
  title text NOT NULL,
  category text NOT NULL,
  image text NOT NULL,
  summary text,
  description jsonb DEFAULT '[]'::jsonb NOT NULL,
  features jsonb DEFAULT '[]'::jsonb NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for Services
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Services are viewable by everyone" ON public.services FOR SELECT USING (true);
CREATE POLICY "Only admins/editors can modify services" ON public.services FOR ALL USING (public.is_editor_or_admin());

-- Create Projects Table
CREATE TABLE public.projects (
  slug text PRIMARY KEY,
  title text NOT NULL,
  category text NOT NULL,
  image text NOT NULL,
  location text NOT NULL,
  description jsonb DEFAULT '[]'::jsonb NOT NULL,
  highlights jsonb DEFAULT '[]'::jsonb NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for Projects
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Projects are viewable by everyone" ON public.projects FOR SELECT USING (true);
CREATE POLICY "Only admins/editors can modify projects" ON public.projects FOR ALL USING (public.is_editor_or_admin());

-- Create FAQs Table
CREATE TABLE public.faqs (
  id serial PRIMARY KEY,
  question text NOT NULL,
  answer text NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for FAQs
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "FAQs are viewable by everyone" ON public.faqs FOR SELECT USING (true);
CREATE POLICY "Only admins/editors can modify faqs" ON public.faqs FOR ALL USING (public.is_editor_or_admin());
