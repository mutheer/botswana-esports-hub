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