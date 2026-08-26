-- Grant permissions to anon and authenticated roles
GRANT ALL ON TABLE public.leads TO anon, authenticated, service_role;

-- Drop existing insert policy if any
DROP POLICY IF EXISTS "Public can insert leads" ON public.leads;
DROP POLICY IF EXISTS "Allow public insert on leads" ON public.leads;

-- Create comprehensive insert policy for anon, authenticated and service_role
CREATE POLICY "Allow public insert on leads"
  ON public.leads
  FOR INSERT
  TO anon, authenticated, service_role
  WITH CHECK (true);
