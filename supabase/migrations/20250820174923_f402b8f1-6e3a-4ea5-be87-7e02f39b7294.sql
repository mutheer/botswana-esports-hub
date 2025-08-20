-- Fix the security definer view issue
-- Recreate the view without security_barrier to avoid the security definer warning
DROP VIEW IF EXISTS public.player_directory;

CREATE VIEW public.player_directory AS
SELECT 
    id,
    name,
    surname,
    created_at
FROM public.gamers
WHERE consent_given = true;

-- Grant access without security definer properties
GRANT SELECT ON public.player_directory TO anon, authenticated;