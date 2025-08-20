-- Fix critical security issue: Restrict access to sensitive gamer data
-- Drop the overly permissive policy that allows anyone to view all gamer data
DROP POLICY IF EXISTS "Anyone can view public gamer data" ON public.gamers;

-- Create secure policies for the gamers table
-- Only allow admins to view full gamer data including sensitive information
CREATE POLICY "Admins can view all gamer data" 
ON public.gamers 
FOR SELECT 
USING (is_admin());

-- Create a view for public player directory that only shows non-sensitive information
CREATE OR REPLACE VIEW public.player_directory AS
SELECT 
    id,
    name,
    surname,
    created_at
FROM public.gamers
WHERE consent_given = true;

-- Grant public access to the safe view
GRANT SELECT ON public.player_directory TO anon, authenticated;

-- Create RLS policy for the view (though views don't enforce RLS by default)
-- This ensures consistent security approach
ALTER VIEW public.player_directory SET (security_barrier = true);

-- Update the gamer_games table to reference the safe view when needed
-- But keep the original foreign key relationship intact for admin functions