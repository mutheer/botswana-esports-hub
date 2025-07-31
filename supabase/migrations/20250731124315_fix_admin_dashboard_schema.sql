-- Fix database schema to match AdminDashboard expectations
-- Add missing columns and fix column names for admin dashboard compatibility

-- Add status column to events table (for admin dashboard compatibility)
ALTER TABLE public.events 
ADD COLUMN status TEXT DEFAULT 'draft';

-- Add status column to news table (for admin dashboard compatibility)  
ALTER TABLE public.news 
ADD COLUMN status TEXT DEFAULT 'draft';

-- Add date column alias to events table (for admin dashboard compatibility)
ALTER TABLE public.events 
ADD COLUMN date TIMESTAMP WITH TIME ZONE;

-- Update the date column to use event_date value
UPDATE public.events 
SET date = event_date 
WHERE date IS NULL;

-- Create trigger to keep date and event_date in sync
CREATE OR REPLACE FUNCTION public.sync_event_dates()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.event_date IS NOT NULL THEN
        NEW.date = NEW.event_date;
    ELSIF NEW.date IS NOT NULL THEN
        NEW.event_date = NEW.date;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER sync_event_dates_trigger
    BEFORE INSERT OR UPDATE ON public.events
    FOR EACH ROW
    EXECUTE FUNCTION public.sync_event_dates();

-- Update status columns based on is_published
UPDATE public.events 
SET status = CASE 
    WHEN is_published = true THEN 'published'
    ELSE 'draft'
END;

UPDATE public.news 
SET status = CASE 
    WHEN is_published = true THEN 'published'
    ELSE 'draft'
END;

-- Add admin policies for full access
CREATE POLICY "Admins can view all profiles" ON public.profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can view all gamers" ON public.gamers
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can view all events" ON public.events
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can view all news" ON public.news
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Add admin management policies
CREATE POLICY "Admins can manage events" ON public.events
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can manage news" ON public.news
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Add some sample data for testing
INSERT INTO public.events (title, description, event_date, location, is_published, status, date) VALUES
  ('Botswana Esports Championship 2024', 'Annual esports championship featuring multiple games', '2024-12-15 10:00:00+00', 'Gaborone Convention Centre', true, 'published', '2024-12-15 10:00:00+00'),
  ('CS:GO Tournament', 'Local CS:GO tournament for amateur players', '2024-11-20 14:00:00+00', 'Online', false, 'draft', '2024-11-20 14:00:00+00')
ON CONFLICT DO NOTHING;

INSERT INTO public.news (title, content, excerpt, is_published, status, published_at) VALUES
  ('BESF Announces New Tournament Series', 'The Botswana Electronic Sports Federation is excited to announce a new tournament series...', 'Exciting news about upcoming tournaments', true, 'published', NOW()),
  ('Esports Growth in Botswana', 'Esports continues to grow rapidly in Botswana with increasing participation...', 'Analysis of esports growth trends', false, 'draft', NULL)
ON CONFLICT DO NOTHING;

-- Quick fix for admin dashboard compatibility

-- Add missing columns to events table
ALTER TABLE public.events 
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'draft',
ADD COLUMN IF NOT EXISTS date TIMESTAMP WITH TIME ZONE;

-- Add missing columns to news table  
ALTER TABLE public.news 
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'draft';

-- Update existing records
UPDATE public.events 
SET 
  status = CASE WHEN is_published = true THEN 'published' ELSE 'draft' END,
  date = event_date
WHERE date IS NULL;

UPDATE public.news 
SET status = CASE WHEN is_published = true THEN 'published' ELSE 'draft' END;

-- Add admin access policies
CREATE POLICY IF NOT EXISTS "Admins can view all profiles" ON public.profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY IF NOT EXISTS "Admins can view all gamers" ON public.gamers
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY IF NOT EXISTS "Admins can view all events" ON public.events
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY IF NOT EXISTS "Admins can view all news" ON public.news
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  ); 