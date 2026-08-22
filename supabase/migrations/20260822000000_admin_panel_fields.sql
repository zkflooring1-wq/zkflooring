-- Add missing columns to existing tables for the Admin Panel
-- These are purely additive ALTER TABLE statements - no breaking changes

-- Projects: add missing fields
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS short_desc text;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS client text;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS duration text;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS area text;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS updated_at timestamp with time zone DEFAULT timezone('utc'::text, now());

-- Services: add missing fields
ALTER TABLE public.services ADD COLUMN IF NOT EXISTS info_label text;
ALTER TABLE public.services ADD COLUMN IF NOT EXISTS info_value text;
ALTER TABLE public.services ADD COLUMN IF NOT EXISTS cta_text text;
ALTER TABLE public.services ADD COLUMN IF NOT EXISTS cta_link text;
ALTER TABLE public.services ADD COLUMN IF NOT EXISTS updated_at timestamp with time zone DEFAULT timezone('utc'::text, now());

-- Posts: add missing fields
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS excerpt text;
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS author text;

-- FAQs: add missing fields
ALTER TABLE public.faqs ADD COLUMN IF NOT EXISTS sort_order integer DEFAULT 0;
ALTER TABLE public.faqs ADD COLUMN IF NOT EXISTS enabled boolean DEFAULT true;
ALTER TABLE public.faqs ADD COLUMN IF NOT EXISTS updated_at timestamp with time zone DEFAULT timezone('utc'::text, now());
